/**
 * AGB CHANTIER - Entité Document d'Identité
 */

export type IdentityDocType = "CNI" | "PASSPORT" | "PERMIS" | "ATTESTATION_BTP";

export interface IdentityDocument {
  type: IdentityDocType;
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  photoBase64?: string;
  fileName?: string;
  verified: boolean;
  uploadedAt: string;
}

export const IDENTITY_DOC_LABELS: Record<IdentityDocType, string> = {
  CNI: "Carte Nationale d'Identité (CNI)",
  PASSPORT: "Passeport Biométrique",
  PERMIS: "Permis de Conduire",
  ATTESTATION_BTP: "Attestation / Carte BTP Professionnelle",
};
