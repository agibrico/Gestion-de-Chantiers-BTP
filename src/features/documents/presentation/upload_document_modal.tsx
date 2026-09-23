/**
 * AGB CHANTIER - Modal d'Importation de Document / Plan - AXE 18
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ProjectDocumentEntity, DocumentType, DocumentApprovalStatus } from "../domain/entities/document_entity";
import { FileText, Upload, FolderUp } from "lucide-react";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Omit<ProjectDocumentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const TYPE_OPTIONS = [
  { value: "PLAN_STRUCTURE_BETON_ARME", label: "Plan d'Exécution Structure (Béton Armé / Armatures)" },
  { value: "PLAN_ARCHITECTE", label: "Plan d'Architecture (Masse, Coupes, Façades)" },
  { value: "PLAN_TECHNIQUE_MEP", label: "Plan Fluides / Électricité / Plomberie (MEP)" },
  { value: "CCTP_DESCRIPTIF", label: "CCTP / Descriptif technique" },
  { value: "CONTRAT_MARCHE_TRAVAUX", label: "Contrat de Marché / Avenant" },
  { value: "FACTURE_DECOMPTE_PROVISOIRE", label: "Décompte Provisoire / Situation mensuelle" },
  { value: "PV_REUNION_CHANTIER", label: "Procès-Verbal de Réunion de Chantier" },
  { value: "RAPPORT_SOL_ETUDE_GEOTECH", label: "Rapport Géotechnique / Étude de Sol LBTP" },
];

const APPROVAL_OPTIONS = [
  { value: "BON_POUR_EXECUTION_BPE", label: "BON POUR EXÉCUTION (BPE - Visa accordé)" },
  { value: "EN_COURS_DE_REVUE", label: "En cours de revue technique" },
  { value: "APPROUVE_AVEC_OBSERVATIONS", label: "Approuvé avec observations mineures" },
  { value: "REFUSE_A_REVISER", label: "Refusé (À reprendre par le bureau d'études)" },
];

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("PLAN_STRUCTURE_BETON_ARME");
  const [version, setVersion] = useState("Indice C");
  const [fileName, setFileName] = useState("PLAN-BA-COFFRAGE-R2.pdf");
  const [authorOrganization, setAuthorOrganization] = useState("BET Structure");
  const [approvalStatus, setApprovalStatus] = useState<DocumentApprovalStatus>("BON_POUR_EXECUTION_BPE");
  const [tags, setTags] = useState("Gros Œuvre, BPE, Structure");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    setIsSubmitting(true);
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await onSave({
        projectId: defaultProjectId,
        projectName: defaultProjectName,
        documentNumber: `DOC-2026-${randomNum}`,
        title: title.trim(),
        documentType,
        version: version.trim(),
        fileName: fileName.trim(),
        fileSizeMb: 8.5,
        fileUrl: "#",
        approvalStatus,
        authorOrganization: authorOrganization.trim(),
        uploadDate: new Date().toISOString().split("T")[0],
        tags: tags.split(",").map((t) => t.trim()),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Classer un Nouveau Document / Plan"
      subtitle="Gestion Électronique des Documents (GED) de chantier avec versioning et statut BPE"
      icon={<FileText className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Titre descriptif du document"
          placeholder="Ex: Plan de ferraillage plancher haut R+2 ou CCTP Lot Électricité"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Catégorie de document"
            options={TYPE_OPTIONS}
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            required
          />

          <AppSelect
            label="Statut du Visa / Approbation"
            options={APPROVAL_OPTIONS}
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value as DocumentApprovalStatus)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Nom du fichier numérique"
            placeholder="Ex: BA-EXE-04-R2.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />

          <AppTextField
            label="Indice / Version"
            placeholder="Ex: Indice C ou V2"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />

          <AppTextField
            label="Émetteur / Auteur"
            placeholder="Ex: Bureau d'études Structure"
            value={authorOrganization}
            onChange={(e) => setAuthorOrganization(e.target.value)}
            required
          />
        </div>

        <AppTextField
          label="Mots-clés / Tags de recherche (séparés par des virgules)"
          placeholder="Ex: Structure, R+2, BPE, SOCOTEC"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<FolderUp className="w-4 h-4" />}
          >
            Enregistrer dans la GED
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
