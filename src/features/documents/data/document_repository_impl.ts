/**
 * AGB CHANTIER - Implémentation du Repository GED & Plans - AXE 18
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectDocumentEntity } from "../domain/entities/document_entity";

const INITIAL_DOCUMENTS_MOCK: Omit<ProjectDocumentEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    documentNumber: "DOC-PL-BA-004",
    title: "Plan de Coffrage et Ferraillage Dalle R+2 et Poteaux",
    documentType: "PLAN_STRUCTURE_BETON_ARME",
    version: "Indice C (Définitif)",
    fileName: "BA-EXE-R2-COFFRAGE-FERRAILLAGE-REV-C.dwg",
    fileSizeMb: 14.8,
    fileUrl: "#",
    approvalStatus: "BON_POUR_EXECUTION_BPE",
    authorOrganization: "BET Ingénierie Structure CI",
    uploadDate: "2026-08-20",
    tags: ["Gros Œuvre", "Armatures", "BPE"],
    approvedBy: "SOCOTEC CI (Visa BPE accordé)",
    approvalDate: "2026-08-22",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    documentNumber: "DOC-PL-ARCHI-001",
    title: "Plans de Masse, Coupes et Façades Principales",
    documentType: "PLAN_ARCHITECTE",
    version: "Indice D",
    fileName: "ARCHI-PL-ENSEMBLE-FACADES-IND-D.pdf",
    fileSizeMb: 28.4,
    fileUrl: "#",
    approvalStatus: "BON_POUR_EXECUTION_BPE",
    authorOrganization: "Cabinet Architecture ARCHI-DESIGN",
    uploadDate: "2026-08-15",
    tags: ["Architecture", "Façades", "Permis"],
    approvedBy: "Maître d'Ouvrage MOA",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    documentNumber: "DOC-TECH-CCTP-01",
    title: "Cahier des Clauses Techniques Particulières (CCTP)",
    documentType: "CCTP_DESCRIPTIF",
    version: "V1.0 Contractuelle",
    fileName: "CCTP-LOT-GROS-OEUVRE-ET-FINITIONS.pdf",
    fileSizeMb: 4.2,
    fileUrl: "#",
    approvalStatus: "BON_POUR_EXECUTION_BPE",
    authorOrganization: "Maîtrise d'Œuvre MOE",
    uploadDate: "2026-08-01",
    tags: ["Marché", "Spécifications", "Normes"],
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    documentNumber: "DOC-FAC-DP-003",
    title: "Décompte Provisoire N° 03 (Situation Mensuelle Travaux)",
    documentType: "FACTURE_DECOMPTE_PROVISOIRE",
    version: "V1.0",
    fileName: "SITUATION-MENSUELLE-N03-AGB-MOA.pdf",
    fileSizeMb: 2.1,
    fileUrl: "#",
    approvalStatus: "EN_COURS_DE_REVUE",
    authorOrganization: "AGB BTP - Direction Financière",
    uploadDate: "2026-08-28",
    tags: ["Facturation", "Décompte", "Avancement"],
  },
];

export class DocumentRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<ProjectDocumentEntity>(IdbAdapter.STORES.DOCUMENTS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_DOCUMENTS_MOCK.length; i++) {
          const item = INITIAL_DOCUMENTS_MOCK[i];
          const entity: ProjectDocumentEntity = {
            ...item,
            id: `doc-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<ProjectDocumentEntity>(IdbAdapter.STORES.DOCUMENTS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Documents error:", e);
    }
  }

  public static async getAllDocuments(): Promise<ProjectDocumentEntity[]> {
    await this.init();
    return IdbAdapter.getAll<ProjectDocumentEntity>(IdbAdapter.STORES.DOCUMENTS);
  }

  public static async createDocument(
    data: Omit<ProjectDocumentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<ProjectDocumentEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: ProjectDocumentEntity = {
      ...data,
      id: `doc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<ProjectDocumentEntity>(IdbAdapter.STORES.DOCUMENTS, newEntity);
    return newEntity;
  }
}
