import { IdbAdapter } from '../../core/storage/idb_adapter';
import { ProjectEntity } from '../projects/domain/entities/project_entity';
export interface DossierInput {
  id:string; name:string; type:ProjectEntity['type']; city:string; address:string;
  clientName:string; clientId:string; phone:string; responsible:string;
  start:string; end:string; budget:string; market:string; description:string;
}
export function validateDossier(d:DossierInput) {
  if (![d.name,d.city,d.clientName,d.responsible,d.start,d.end,d.budget,d.market].every(x=>x.trim())) throw new Error('Complétez les champs obligatoires.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.start) || !/^\d{4}-\d{2}-\d{2}$/.test(d.end) || !Number.isFinite(Date.parse(d.start)) || !Number.isFinite(Date.parse(d.end)) || d.end<d.start) throw new Error('Les dates du chantier sont incohérentes.');
  for(const n of [d.budget,d.market]) if(!Number.isSafeInteger(Number(n)) || Number(n)<0) throw new Error('Les montants FCFA doivent être des entiers positifs ou nuls.');
}
export async function saveDossier(d:DossierInput, userId:string):Promise<ProjectEntity> {
  validateDossier(d);
  const existing = (await IdbAdapter.getAllUnscoped<ProjectEntity>('projects')).find(p=>p.id===d.id);
  if(existing) return existing; // Stable draft ID makes repeated validation idempotent.
  const now=new Date().toISOString();
  const project:ProjectEntity & {ownerId:string; dossierState:string; initialReference:unknown}={
    id:d.id, code:`CH-${new Date().getFullYear()}-${d.id.slice(-8).toUpperCase()}`,
    name:d.name.trim(),description:d.description,type:d.type,status:'ETUDE_PREPARATION',riskLevel:'FAIBLE',
    clientId:d.clientId || `client_${crypto.randomUUID()}`,clientName:d.clientName.trim(),clientPhone:d.phone,
    location:{address:d.address,city:d.city,country:'Côte d’Ivoire'},
    startDate:d.start,estimatedEndDate:d.end,totalBudgetEstimated:Number(d.budget),totalBudgetContracted:Number(d.market),
    totalExpensesRealized:0,totalBilledAmount:0,totalPaidAmount:0,retentionGuaranteeRate:0,
    progressPercentage:0,financialProgressPercentage:0,
    managementTeam:{projectManagerName:d.responsible,siteManagerName:d.responsible,siteManagerId:userId,foremanName:''},
    phases:[],milestones:[],metrics:{workersOnSiteToday:0,totalHoursWorked:0,openReservationsCount:0,safetyIncidentsCount:0,siteDiaryEntriesCount:0,photosCount:0,activeAlertsCount:0},
    tags:[],createdAt:now,updatedAt:now,ownerId:userId,dossierState:'VALIDATED',
    initialReference:{budget:Number(d.budget),market:Number(d.market),start:d.start,end:d.end,validatedAt:now,validatedBy:userId}
  };
  await IdbAdapter.put('projects',project);
  return project;
}
