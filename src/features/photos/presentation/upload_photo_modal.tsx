/**
 * AGB CHANTIER - Modal d'Envoi / Prise de Photo Chantier avec Géolocalisation - AXE 14
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { SitePhotoEntity, PhotoTag } from "../domain/entities/photo_entity";
import { Camera, MapPin, Upload, Image as ImageIcon } from "lucide-react";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: Omit<SitePhotoEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const TAG_OPTIONS = [
  { value: "AVANCEMENT_GLOBAL", label: "Avancement global du chantier" },
  { value: "FERRAILLAGE_ARMATURES", label: "Ferraillage & Armatures BA" },
  { value: "COULAGE_BETON", label: "Coulage Béton & Éprouvettes" },
  { value: "SECOND_OEUVRE", label: "Second Œuvre & Finitions" },
  { value: "RECOLEMENT", label: "Plan de récolement & Réseaux" },
  { value: "NON_CONFORMITE_RESERVE", label: "Non-conformité / Réserve OPR" },
  { value: "SECURITE_HSE", label: "Sécurité HSE & Balisage" },
  { value: "LIVRAISON_MATERIAUX", label: "Livraison Matériaux & Bordereau" },
];

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<PhotoTag>("AVANCEMENT_GLOBAL");
  const [zoneOrBuilding, setZoneOrBuilding] = useState("Bâtiment A - R+2");
  const [descriptionDecoder, setDescriptionDecoder] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60");
  const [latitude, setLatitude] = useState(5.3489);
  const [longitude, setLongitude] = useState(-3.9783);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        projectId: defaultProjectName ? "proj-001" : "proj-001",
        projectName: defaultProjectName,
        title: title.trim(),
        description: descriptionDecoder.trim() || undefined,
        tag,
        imageUrl,
        zoneOrBuilding: zoneOrBuilding.trim(),
        dateCaptured: new Date().toISOString(),
        authorName: "Kouassi Jean-Marc",
        authorRole: "Directeur Travaux",
        geoLocation: {
          latitude,
          longitude,
          addressDescription: "Cocody Riviera Golf, Abidjan, Côte d'Ivoire",
        },
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
      title="Ajouter une Photo avec Géolocalisation"
      subtitle="Documentation visuelle horodatée avec métadonnées GPS et classement par lot"
      icon={<Camera className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Titre / Sujet de la photo"
          placeholder="Ex: Coulage voile béton Bâtiment B ou Ferraillage poteaux"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Catégorie / Tag d'ouvrage"
            options={TAG_OPTIONS}
            value={tag}
            onChange={(e) => setTag(e.target.value as PhotoTag)}
            required
          />

          <AppTextField
            label="Zone / Bâtiment / Niveau"
            placeholder="Ex: Bâtiment A - R+2 Zone Ouest"
            value={zoneOrBuilding}
            onChange={(e) => setZoneOrBuilding(e.target.value)}
            required
          />
        </div>

        <AppTextField
          label="URL de l'image (ou photo terrain)"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-orange-600" />
            Coordonnées Géographiques GPS (Côte d'Ivoire)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AppTextField
              label="Latitude"
              type="number"
              value={latitude.toString()}
              onChange={(e) => setLatitude(Number(e.target.value))}
            />
            <AppTextField
              label="Longitude"
              type="number"
              value={longitude.toString()}
              onChange={(e) => setLongitude(Number(e.target.value))}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Cocody Riviera Golf, Abidjan (Précision GPS satellite : ± 3.5 m)
          </p>
        </div>

        <AppTextField
          label="Description / Observations techniques"
          placeholder="Détails du ferraillage, conditions de pose..."
          value={descriptionDecoder}
          onChange={(e) => setDescriptionDecoder(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Publier dans la Galerie
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
