/**
 * AGB CHANTIER - Modal de Saisie d'un Échange / Réunion MOA - AXE 03
 */

import React, { useState } from "react";
import { AppDialog } from "../../../core/widgets/feedback/app_dialog";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ClientInteraction, InteractionType, ClientProjectSummary } from "../domain/entities/client_entity";
import { useAuth } from "../../auth/presentation/auth_context";
import { MessageSquare, Calendar, Flag, Sparkles } from "lucide-react";

interface ClientInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (interaction: Omit<ClientInteraction, "id">) => Promise<void>;
  clientId: string;
  clientProjects?: ClientProjectSummary[];
}

const INTERACTION_TYPES: { value: InteractionType; label: string }[] = [
  { value: "REUNION_CHANTIER", label: "🏗️ Réunion de Chantier / Coordination MOA" },
  { value: "APPEL", label: "📞 Échange Téléphonique" },
  { value: "VISITE_TERRAIN", label: "🔎 Visite de Contrôle sur Site" },
  { value: "VALIDATION_SITUATION", label: "📝 Validation de Situation / Décompte" },
  { value: "SIGNATURE_CONTRAT", label: "🖋️ Signature Contrat / Ordre de Service" },
  { value: "AVENANT", label: "📑 Négociation / Signature d'Avenant" },
  { value: "PAIEMENT_RECU", label: "💰 Notification d'Encaissement / Acompte" },
  { value: "RECLAMATION", label: "⚠️ Signalement / Réclamation Client" },
  { value: "EMAIL", label: "✉️ Courrier Électronique Officiel" },
];

export const ClientInteractionModal: React.FC<ClientInteractionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientId,
  clientProjects = [],
}) => {
  const { currentUser } = useAuth();

  const [type, setType] = useState<InteractionType>("REUNION_CHANTIER");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [authorName, setAuthorName] = useState(currentUser?.name || "Directeur Général AGB");
  const [priority, setPriority] = useState<"NORMALE" | "IMPORTANTE" | "URGENTE">("NORMALE");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectOptions = [
    { value: "", label: "Aucun chantier spécifique (Échange général)" },
    ...clientProjects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    try {
      setIsSubmitting(true);
      const selectedProject = clientProjects.find((p) => p.id === selectedProjectId);

      await onSave({
        clientId,
        date: new Date().toISOString(),
        type,
        title: title.trim(),
        summary: summary.trim(),
        authorName: authorName.trim() || "Collaborateur AGB",
        priority,
        projectId: selectedProjectId || undefined,
        projectName: selectedProject ? selectedProject.name : undefined,
        followUpDate: followUpDate || undefined,
      });

      onClose();
      // Reset form
      setTitle("");
      setSummary("");
      setFollowUpDate("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Consigner un Échange / Réunion MOA"
      subtitle="Traçabilité officielle des décisions, comptes-rendus et relances"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <AppButton variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!title.trim() || !summary.trim()}
          >
            Enregistrer l'échange
          </AppButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AppSelect
            label="Type d'interaction"
            value={type}
            onChange={(e) => setType(e.target.value as InteractionType)}
            options={INTERACTION_TYPES}
          />

          <AppSelect
            label="Priorité de l'échange"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            options={[
              { value: "NORMALE", label: "🟢 Normale (Information standard)" },
              { value: "IMPORTANTE", label: "🟠 Importante (Décision ou jalon)" },
              { value: "URGENTE", label: "🔴 Urgente (Blocage ou réclamation)" },
            ]}
          />
        </div>

        {clientProjects.length > 0 && (
          <AppSelect
            label="Chantier / Projet BTP concerné (Optionnel)"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            options={projectOptions}
          />
        )}

        <AppTextField
          label="Objet / Titre de la réunion ou de l'échange"
          placeholder="Ex: Comité technique de validation des finitions R+3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          leftIcon={<MessageSquare className="w-4 h-4" />}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Compte-rendu détaillé / Décisions actées <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            placeholder="Détaillez les points abordés, les validations obtenues, les réserves éventuelles..."
            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AppTextField
            label="Rapporteur / Représentant AGB"
            placeholder="Nom du rapporteur"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />

          <AppTextField
            label="Date de relance / Prochaine étape"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>

        {/* Quick template snippets */}
        <div className="p-3 bg-orange-50/70 dark:bg-orange-950/20 rounded-xl border border-orange-200/60 dark:border-orange-900/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 dark:text-orange-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Modèles rapides de compte-rendu
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              {
                label: "Validation Décompte",
                title: "Validation décompte mensuel N°...",
                body: "Le Maître d'Ouvrage et le bureau de contrôle ont visé favorablement le décompte de la situation mensuelle. Mise en paiement programmée.",
              },
              {
                label: "Visite Chantier RAS",
                title: "Visite de chantier contradictoire",
                body: "Visite conjointe effectuée ce jour. Constat de conformité du ferraillage et coulage selon le plan d'exécution validé.",
              },
              {
                label: "Choix Matériaux",
                title: "Sélection des échantillons de carrelage & menuiserie",
                body: "Présentation des planches d'échantillons au client. Choix validé pour les teintes et références catalogue.",
              },
            ].map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTitle(tpl.title);
                  setSummary(tpl.body);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer"
              >
                + {tpl.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </AppDialog>
  );
};
