/**
 * AGB CHANTIER - Écran Galerie Photos & Géolocalisation - AXE 14
 */

import React, { useState, useEffect } from "react";
import {
  Camera,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  Eye,
  Download,
  Share2,
  Tag,
  Maximize2,
  Building,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { SitePhotoEntity, PhotoTag } from "../domain/entities/photo_entity";
import { PhotoRepositoryImpl } from "../data/photo_repository_impl";
import { UploadPhotoModal } from "./upload_photo_modal";

export const PhotosGalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<SitePhotoEntity[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<SitePhotoEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await PhotoRepositoryImpl.getAllPhotos();
      setPhotos(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePhoto = async (
    data: Omit<SitePhotoEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await PhotoRepositoryImpl.createPhoto(data);
    await loadData();
  };

  const filteredPhotos = photos.filter((p) => {
    const matchTag = selectedTag === "ALL" || p.tag === selectedTag;
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zoneOrBuilding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTag && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 14
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Photos, Galerie & Géolocalisation
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Documentation photographique géolocalisée, suivi d'avancement visuel et historique des ouvrages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Prendre / Envoyer Photo
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clichés Répertoire"
          value={`${photos.length} Photos`}
          subValue="Tous chantiers confondus"
          icon={<Camera className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="HD"
          badgeVariant="neutral"
        />
        <StatCard
          label="Photos Géolocalisées GPS"
          value={`${photos.filter((p) => p.geoLocation).length} / ${photos.length}`}
          subValue="Coordonnées vérifiées"
          icon={<MapPin className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="100% GPS"
          badgeVariant="success"
        />
        <StatCard
          label="Coulages & Armatures"
          value={`${photos.filter((p) => p.tag === "COULAGE_BETON" || p.tag === "FERRAILLAGE_ARMATURES").length} Clichés`}
          subValue="Gros Œuvre & Structure"
          icon={<Layers className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Structure"
          badgeVariant="info"
        />
        <StatCard
          label="Dernière Prise de Vue"
          value="Aujourd'hui"
          subValue="Cocody Riviera Golf"
          icon={<Calendar className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Temps Réel"
          badgeVariant="info"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par titre, zone, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full md:w-64">
          <AppSelect
            options={[
              { value: "ALL", label: "Toutes les catégories" },
              { value: "AVANCEMENT_GLOBAL", label: "Avancement global" },
              { value: "FERRAILLAGE_ARMATURES", label: "Ferraillage & Armatures" },
              { value: "COULAGE_BETON", label: "Coulage Béton" },
              { value: "SECOND_OEUVRE", label: "Second Œuvre" },
              { value: "SECURITE_HSE", label: "Sécurité HSE" },
              { value: "NON_CONFORMITE_RESERVE", label: "Réserves OPR" },
            ]}
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image with overlay tags */}
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                    {photo.tag}
                  </span>
                </div>
                <button
                  onClick={() => setActivePhoto(photo)}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-orange-600 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{photo.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{photo.zoneOrBuilding}</span>
                  </div>
                  {photo.geoLocation && (
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {photo.geoLocation.latitude.toFixed(4)}, {photo.geoLocation.longitude.toFixed(4)}
                        {photo.geoLocation.addressDescription ? ` • ${photo.geoLocation.addressDescription}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Par {photo.authorName}</span>
              <span>{new Date(photo.dateCaptured).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-orange-400 font-bold">{activePhoto.tag}</span>
                  <h3 className="text-lg font-bold mt-0.5">{activePhoto.title}</h3>
                </div>
                <AppButton variant="outline" size="sm" onClick={() => setActivePhoto(null)}>
                  Fermer
                </AppButton>
              </div>
              <p className="text-sm text-slate-300">{activePhoto.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>📍 Zone : {activePhoto.zoneOrBuilding}</span>
                {activePhoto.geoLocation && (
                  <span>
                    🌐 GPS : {activePhoto.geoLocation.latitude}, {activePhoto.geoLocation.longitude} (
                    {activePhoto.geoLocation.addressDescription})
                  </span>
                )}
                <span>👤 Prise par : {activePhoto.authorName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <UploadPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreatePhoto}
      />
    </div>
  );
};
