/**
 * AGB CHANTIER - Écran de Gestion Électronique des Documents (GED) - AXE 18
 */

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  FileCheck,
  Building,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { ProjectDocumentEntity, DocumentType } from "../domain/entities/document_entity";
import { DocumentRepositoryImpl } from "../data/document_repository_impl";
import { UploadDocumentModal } from "./upload_document_modal";

export const DocumentsManagementScreen: React.FC = () => {
  const [documents, setDocuments] = useState<ProjectDocumentEntity[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await DocumentRepositoryImpl.getAllDocuments();
      setDocuments(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDocument = async (
    data: Omit<ProjectDocumentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await DocumentRepositoryImpl.createDocument(data);
    await loadData();
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchType = selectedType === "ALL" || doc.documentType === selectedType;
    const matchQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authorOrganization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchQuery;
  });

  const total = documents.length;
  const bpeCount = documents.filter((d) => d.approvalStatus === "BON_POUR_EXECUTION_BPE").length;
  const inReviewCount = documents.filter((d) => d.approvalStatus === "EN_COURS_DE_REVUE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 18
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              GED, Plans, Contrats & Factures
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion Électronique des Documents, versioning des plans d'exécution BPE, pièces contractuelles et situations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Classer un Document
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Documents Référencés"
          value={`${total} Fichiers`}
          subValue="Tous formats (DWG, PDF, IFC)"
          icon={<FileText className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="GED AGB"
          badgeVariant="default"
        />
        <StatCard
          label="Plans Bon Pour Exécution (BPE)"
          value={`${bpeCount} Plans`}
          subValue="Visés et autorisés chantier"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="BPE Validé"
          badgeVariant="success"
        />
        <StatCard
          label="Documents en Revue"
          value={`${inReviewCount} En cours`}
          subValue="Contrôle technique SOCOTEC"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-amber-600"
          badgeText="En examen"
          badgeVariant="warning"
        />
        <StatCard
          label="Espace Stocké"
          value="49.5 Mo"
          subValue="Cache hors-ligne actif"
          icon={<Layers className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Offline OK"
          badgeVariant="default"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par titre, N° document, fichier, émetteur..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            fullWidth
          />
        </div>
        <div className="w-full md:w-72">
          <AppSelect
            options={[
              { value: "ALL", label: "Toutes catégories de documents" },
              { value: "PLAN_STRUCTURE_BETON_ARME", label: "Plans Béton Armé (Structure)" },
              { value: "PLAN_ARCHITECTE", label: "Plans d'Architecture" },
              { value: "CCTP_DESCRIPTIF", label: "CCTP & Descriptifs" },
              { value: "FACTURE_DECOMPTE_PROVISOIRE", label: "Décomptes & Factures" },
            ]}
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
            fullWidth
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Réf / Version</th>
                <th className="p-3.5">Titre du Document & Fichier</th>
                <th className="p-3.5">Émetteur / BET</th>
                <th className="p-3.5">Date / Poids</th>
                <th className="p-3.5 text-center">Statut Visa</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                      {doc.documentNumber}
                    </div>
                    <span className="inline-block mt-0.5 text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {doc.version}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{doc.title}</div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <FileCode className="w-3.5 h-3.5 text-orange-600" />
                      {doc.fileName}
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-xs text-slate-800 dark:text-slate-200">
                    {doc.authorOrganization}
                  </td>
                  <td className="p-3.5 text-xs text-slate-500 font-mono">
                    <div>{doc.uploadDate}</div>
                    <div className="text-[11px] text-slate-400">{doc.fileSizeMb} Mo</div>
                  </td>
                  <td className="p-3.5 text-center">
                    {doc.approvalStatus === "BON_POUR_EXECUTION_BPE" ? (
                      <AppBadge variant="success">B.P.E. ACCORDÉ</AppBadge>
                    ) : doc.approvalStatus === "EN_COURS_DE_REVUE" ? (
                      <AppBadge variant="warning">EN REVUE</AppBadge>
                    ) : (
                      <AppBadge variant="danger">REFUSÉ</AppBadge>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <AppButton size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Voir
                      </AppButton>
                      <AppButton size="sm" variant="secondary" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        PDF
                      </AppButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UploadDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateDocument}
      />
    </div>
  );
};
