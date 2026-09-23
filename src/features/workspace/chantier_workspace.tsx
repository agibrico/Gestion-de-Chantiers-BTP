import React,{useEffect,useState} from 'react';
import {useAuth} from '../auth/presentation/auth_context';
import {AppPermission} from '../../core/permissions/permissions';
import {IdbAdapter} from '../../core/storage/idb_adapter';
import {ProjectEntity} from '../projects/domain/entities/project_entity';
import {ProjectScope} from './project_scope';
import {DossierInput,saveDossier} from './dossier_service';
ProjectScope.enabled=true;
const field='w-full rounded-lg border border-slate-300 bg-white text-slate-900 p-3';
const button='rounded-lg bg-orange-600 text-white px-4 py-3 font-semibold disabled:opacity-40';
export function ChantierWorkspace({children}:{children:React.ReactNode}) {
 const {currentUser,isAuthenticated,isFirstLoginModalRequired,hasPermission,logout}=useAuth();
 const [projects,setProjects]=useState<ProjectEntity[]>([]),[active,setActive]=useState<ProjectEntity|null>(null),[editing,setEditing]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[step,setStep]=useState(0);
 const key=`agb_dossier_${currentUser?.id || 'none'}`;
 const empty=():DossierInput=>({id:`proj_${crypto.randomUUID()}`,name:'',type:'BATIMENT_RESIDENTIEL',city:'',address:'',clientName:'',clientId:'',phone:'',responsible:currentUser?.name||'',start:'',end:'',budget:'',market:'',description:''});
 const [draft,setDraft]=useState<DossierInput>(empty);
 const allowed=(p:any)=>currentUser?.role==='ADMINISTRATEUR' || p.ownerId===currentUser?.id || p.assignedUserIds?.includes(currentUser?.id) || [p.managementTeam?.siteManagerId,p.managementTeam?.projectManagerId].includes(currentUser?.id);
 async function refresh(){const all=await IdbAdapter.getAllUnscoped<ProjectEntity>('projects');setProjects(all.filter(p=>!p.deletedAt && allowed(p)));}
 useEffect(()=>{ProjectScope.select(null);setActive(null);setEditing(false);setProjects([]);if(currentUser) refresh().catch(e=>setError(e.message));},[currentUser?.id]);
 if(!isAuthenticated || isFirstLoginModalRequired) return <>{children}</>;
 function begin(){try{const saved=JSON.parse(localStorage.getItem(key)||'null');setDraft(saved?.id?saved:empty());}catch{setDraft(empty());}setStep(0);setEditing(true);setError('');}
 function update(k:keyof DossierInput,v:string){const next={...draft,[k]:v};setDraft(next);try{localStorage.setItem(key,JSON.stringify(next));}catch{setError('Stockage plein : le brouillon n’a pas pu être sauvegardé.');}}
 function choose(p:ProjectEntity){ProjectScope.select(p.id,['CLOTURE','ANNULE'].includes(p.status));setActive(p);window.location.hash='/projects';}
 function change(){if(!window.confirm('Revenir à Mes chantiers ? Les formulaires non enregistrés seront abandonnés.'))return;window.location.reload();}
 async function submit(){setBusy(true);setError('');try{if(!hasPermission(AppPermission.PROJECT_CREATE))throw new Error('Création non autorisée.');const p=await saveDossier(draft,currentUser!.id);localStorage.removeItem(key);setEditing(false);await refresh();choose(p);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 const input=(label:string,k:keyof DossierInput,type='text')=><label className="block space-y-1"><span className="text-sm font-medium">{label}</span><input className={field} type={type} value={draft[k]} onChange={e=>update(k,e.target.value)}/></label>;
 if(active)return <div key={`${currentUser!.id}-${active.id}`}><div className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2"><div><strong>{active.name}</strong><span className="ml-3 text-xs">{active.code} · {active.status}</span></div><button onClick={change} className="rounded border border-slate-500 px-3 py-2">Mes chantiers</button></div>{children}</div>;
 return <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8"><div className="max-w-4xl mx-auto space-y-6"><header className="flex justify-between gap-3"><div><p className="text-orange-600 font-bold">AGB CHANTIER</p><h1 className="text-3xl font-bold">{editing?'Dossier initial du chantier':'Mes chantiers'}</h1><p className="text-slate-500">Un dossier de référence pour chaque chantier.</p></div><button onClick={()=>logout()} className="text-sm underline">Déconnexion</button></header>
 <p className="rounded bg-amber-100 p-3 text-sm">Version locale de test. Les données restent sur cet appareil ; aucun serveur n’est connecté.</p>
 {error&&<p role="alert" className="bg-red-100 p-3 rounded">{error}</p>}
 {editing?<section className="bg-white rounded-xl shadow-sm border p-5 space-y-5"><p className="font-bold text-orange-700">Étape {step+1}/5 — {['Identification','Client et responsable','Marché et budget','Planning','Vérification'][step]}</p>
 {step===0&&<>{input('Nom du chantier *','name')}{input('Ville *','city')}{input('Adresse','address')}<label className="block">Type d’ouvrage<select className={field} value={draft.type} onChange={e=>update('type',e.target.value)}>{['BATIMENT_RESIDENTIEL','BATIMENT_TERTIAIRE','TRAVAUX_PUBLICS_VRD','GENIE_CIVIL_OUVRAGES','RENOVATION_REHABILITATION','INDUSTRIEL_ENTREPOT','AMENAGEMENT_INTERIEUR'].map(t=><option key={t}>{t}</option>)}</select></label>{input('Description','description')}</>}
 {step===1&&<>{input('Client / maître d’ouvrage *','clientName')}{input('Téléphone du client','phone','tel')}{input('Responsable principal *','responsible')}</>}
 {step===2&&<>{input('Montant du marché (FCFA) *','market','number')}{input('Budget prévisionnel (FCFA) *','budget','number')}<p className="text-sm text-slate-500">Ces montants constituent les références initiales. Les dépenses et encaissements seront enregistrés séparément.</p></>}
 {step===3&&<>{input('Début prévu *','start','date')}{input('Livraison prévue *','end','date')}<p className="text-sm">Après validation, ajoutez les phases, équipes, ressources et documents depuis les modules du chantier.</p></>}
 {step===4&&<dl className="space-y-3">{[['Chantier',draft.name],['Ville',draft.city],['Client',draft.clientName],['Responsable',draft.responsible],['Marché',`${draft.market} FCFA`],['Budget',`${draft.budget} FCFA`],['Période',`${draft.start} → ${draft.end}`]].map(([k,v])=><div key={k} className="flex justify-between border-b pb-2"><dt>{k}</dt><dd className="font-semibold">{v||'À compléter'}</dd></div>)}</dl>}
 <div className="flex flex-wrap gap-3"><button className="px-3 py-2 border rounded" onClick={()=>setEditing(false)}>Enregistrer et quitter</button>{step>0&&<button className="px-3 py-2" onClick={()=>setStep(step-1)}>Précédent</button>}{step<4?<button className={button} onClick={()=>setStep(step+1)}>Suivant</button>:<button className={button} disabled={busy} onClick={submit}>{busy?'Enregistrement…':'Valider et ouvrir le chantier'}</button>}</div></section>:<>
 {hasPermission(AppPermission.PROJECT_CREATE)&&<button className={button} onClick={begin}>Créer un chantier / reprendre mon brouillon</button>}
 {!projects.length&&<p className="rounded-xl bg-white border p-8">Aucun chantier accessible. Créez votre premier dossier ou demandez une affectation.</p>}
 <div className="grid sm:grid-cols-2 gap-4">{projects.map(p=><button key={p.id} onClick={()=>choose(p)} className="text-left rounded-xl border bg-white p-5 shadow-sm space-y-2 hover:border-orange-500"><p className="text-xs text-orange-700">{p.code}</p><h2 className="font-bold text-xl">{p.name}</h2><p>{p.clientName} · {p.location?.city}</p><p className="text-sm text-slate-500">{p.status} · {p.progressPercentage}%</p><p className="font-semibold text-orange-600">Ouvrir le chantier →</p></button>)}</div></>}
 </div></div>;
}
