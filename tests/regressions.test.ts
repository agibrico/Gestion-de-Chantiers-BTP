import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { indexedDB } from 'fake-indexeddb';
import { IdbAdapter as DB } from '../src/core/storage/idb_adapter';
import { DatabaseService } from '../src/core/storage/db_service';
import { hashPassword, verifyPassword } from '../src/core/security/password';
import { AuthRepositoryImpl } from '../src/features/auth/data/auth_repository_impl';
import { SyncQueueManager as Queue } from '../src/core/network/sync_queue';
import { InventoryRepositoryImpl } from '../src/features/inventory/data/inventory_repository_impl';
import { generateBtpDashboardCsv } from '../src/features/reporting/domain/btp_dashboard_csv_service';
import { FinanceRepositoryImpl } from '../src/features/finance/data/finance_repository_impl';
import { UserRole } from '../src/core/permissions/roles';

Object.defineProperty(globalThis, 'navigator', {value: {onLine:true}, configurable:true});
const storage = new Map<string, string>();
Object.assign(globalThis, { window: { indexedDB }, localStorage: {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => storage.set(k, v),
  removeItem: (k: string) => storage.delete(k),
}});
const record = (id: string) => ({id, createdAt: '2026-09-21', updatedAt: '2026-09-21'});
beforeEach(async () => {
  Queue.configureTransport(null);
  const db = await DB.getDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(Object.values(DB.STORES), 'readwrite');
    for (const store of Object.values(DB.STORES)) tx.objectStore(store).clear();
    tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
  });
  storage.clear();
});

test('salted passwords verify without exposing plaintext', async () => {
  const a = await hashPassword('Test-password-2026');
  const b = await hashPassword('Test-password-2026');
  assert.notEqual(a, b); assert.ok(!a.includes('Test-password'));
  assert.equal(await verifyPassword('Test-password-2026', a), true);
  assert.equal(await verifyPassword('incorrect', a), false);
  assert.equal(await verifyPassword('x', 'pbkdf2$999999999$aa$bb'), false);
});
test('successful legacy login migrates password; wrong login does not', async () => {
  await DB.put(DB.STORES.USERS, {...record('legacy'), name:'Test', phone:'0100000000', passwordHash:'legacy-pass', status:'ACTIVE', role:UserRole.OUVRIER});
  const repo = AuthRepositoryImpl.getInstance();
  await assert.rejects(repo.login('0100000000', 'incorrect'));
  assert.equal((await DB.getById<any>(DB.STORES.USERS, 'legacy')).passwordHash, 'legacy-pass');
  const user = await repo.login('0100000000', 'legacy-pass');
  assert.match(user.passwordHash!, /^pbkdf2\$/);
});
test('a suspended account cannot restore a persisted session', async () => {
  await DB.put(DB.STORES.USERS, {...record('suspended'), status:'SUSPENDED'});
  storage.set('agb_current_user_id', 'suspended');
  assert.equal(await AuthRepositoryImpl.getInstance().getCurrentUser(), null);
  assert.equal(storage.has('agb_current_user_id'), false);
});
test('first login requires 8 characters and does not auto-verify identity', async () => {
  await DB.put(DB.STORES.USERS, {...record('first'), status:'ACTIVE'});
  const repo = AuthRepositoryImpl.getInstance();
  const doc = {type:'CNI', documentNumber:'TEST-ONLY'} as any;
  await assert.rejects(repo.completeFirstLogin('first','short',doc));
  const updated = await repo.completeFirstLogin('first','long-password',doc);
  assert.equal(updated.identityDocument?.verified,false);
  assert.equal(await verifyPassword('long-password',updated.passwordHash!),true);
});
test('queue remains pending without a remote connector', async () => {
  const item = await Queue.enqueue('CREATE','projects','p1',{});
  assert.deepEqual(await Queue.processQueue(),{syncedCount:0,failedCount:0});
  assert.equal((await DB.getById<any>(DB.STORES.SYNC_QUEUE,item.id)).status,'pending');
});
test('failed remote request is retained for retry, then acknowledged', async () => {
  const item = await Queue.enqueue('UPDATE','projects','p1',{});
  Queue.configureTransport(async () => {throw new Error('network');});
  assert.equal((await Queue.processQueue()).failedCount,1);
  assert.equal((await DB.getById<any>(DB.STORES.SYNC_QUEUE,item.id)).status,'failed');
  Queue.configureTransport(async () => {});
  assert.equal((await Queue.processQueue()).syncedCount,1);
});
test('interrupted syncing records can resume', async () => {
  await DB.put(DB.STORES.SYNC_QUEUE,{...record('resume'),status:'syncing',retryCount:0});
  Queue.configureTransport(async () => {});
  assert.equal((await Queue.processQueue()).syncedCount,1);
});
test('backup retains soft deletion markers',async () => {
  await DB.put(DB.STORES.PROJECTS,record('deleted'));
  await DB.delete(DB.STORES.PROJECTS,'deleted');
  assert.equal((await DB.getAll(DB.STORES.PROJECTS)).length,0);
  assert.equal((await DatabaseService.exportAllData()).PROJECTS.length,1);
});
test('backup read failures are reported instead of empty tables',async () => {
  const original = DB.getAllUnscoped;
  DB.getAllUnscoped = async () => {throw new Error('disk failure');};
  try { await assert.rejects(DatabaseService.exportAllData(),/Sauvegarde interrompue/); }
  finally { DB.getAllUnscoped = original; }
});
test('invalid import is rejected before any mutation',async () => {
  await assert.rejects(DatabaseService.importData({PROJECTS:[record('new')],CLIENTS:[{}]}));
  assert.equal(await DB.getById(DB.STORES.PROJECTS,'new'),null);
});
test('import transaction rolls back on non-cloneable content',async () => {
  await assert.rejects(DatabaseService.importData({PROJECTS:[record('new')],CLIENTS:[{...record('bad'),fn:()=>{}}]}));
  assert.equal(await DB.getById(DB.STORES.PROJECTS,'new'),null);
});
test('valid import merges without deleting existing records',async () => {
  await DB.put(DB.STORES.PROJECTS,record('old'));
  await DatabaseService.importData({PROJECTS:[record('new')]});
  assert.equal((await DB.getAll(DB.STORES.PROJECTS)).length,2);
});
const seedItem = () => DB.put(DB.STORES.INVENTORY_ITEMS,{...record('cement'),currentStock:10,unitPurchasePriceFCFA:100,minStockAlert:2});
const movement = (quantity:number) => ({itemId:'cement',movementType:'SORTIE_CONSOMMATION_CHANTIER',quantity,date:'2026-09-21'} as any);
test('stock cannot go negative and rejected movement leaves no trace',async () => {
  await seedItem();
  await assert.rejects(new InventoryRepositoryImpl().recordMovement(movement(11)),/Stock insuffisant/);
  assert.equal((await DB.getById<any>(DB.STORES.INVENTORY_ITEMS,'cement')).currentStock,10);
  assert.equal((await DB.getAll(DB.STORES.STOCK_MOVEMENTS)).length,0);
});
test('concurrent stock exits cannot oversell',async () => {
  await seedItem(); const repo = new InventoryRepositoryImpl();
  const results = await Promise.allSettled([repo.recordMovement(movement(7)),repo.recordMovement(movement(7))]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal((await DB.getById<any>(DB.STORES.INVENTORY_ITEMS,'cement')).currentStock,3);
  assert.equal((await DB.getAll(DB.STORES.STOCK_MOVEMENTS)).length,1);
});
test('stock rejects invalid quantities and missing item',async () => {
  const repo = new InventoryRepositoryImpl();
  for (const q of [-1,0,NaN,Infinity]) await assert.rejects(repo.recordMovement(movement(q)));
  await assert.rejects(repo.recordMovement(movement(1)),/Article introuvable/);
});
test('CSV neutralizes formula cells and escapes quotes', () => {
  const csv = generateBtpDashboardCsv([{code:'=1+1',name:'say \"hello\"',status:'PREPARATION',progressPercentage:0} as any]);
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(csv.includes('say ""hello""'));
  assert.ok(csv.startsWith('\uFEFF'));
});
test('expense rejects invalid amounts',async () => {
  for (const amountFCFA of [-1,0,NaN,Infinity,1.5]) {
    await assert.rejects(FinanceRepositoryImpl.createExpense({projectId:'p',title:'Test',amountFCFA} as any),/entier positif/);
  }
});
