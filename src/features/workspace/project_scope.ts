/** Local data isolation. A server must enforce authorization in a hosted edition. */
export class ProjectScope {
  static enabled = false;
  static id: string | null = null;
  static readOnly = false;
  static scopedStores = new Set(['phases','tasks','attendance','inventory_items','stock_movements','purchase_orders','expenses','budgets','equipments','site_diary_entries','photos','quality_inspections','hse_incidents','reservations','documents','receptions','handovers','notifications','audit_logs','sync_queue','teams','stakeholders']);
  static select(id: string | null, readOnly = false) { this.id=id; this.readOnly=readOnly; }
  static visible(store: string, item: any, id = this.id): boolean {
    if (!this.enabled) return true;
    if (store === 'projects') return !id || item.id === id;
    if (!this.scopedStores.has(store)) return true;
    return !!id && item.projectId === id;
  }
  static prepare(store: string, item: any, id = this.id): any {
    if (!this.enabled || !this.scopedStores.has(store)) return item;
    if (!id) throw new Error('Choisissez un chantier avant cette opération.');
    if (this.readOnly) throw new Error('Ce chantier est clôturé ou annulé : consultation uniquement.');
    if (item.projectId && item.projectId !== id) throw new Error('Cette opération concerne un autre chantier.');
    return {...item, projectId:id};
  }
}
