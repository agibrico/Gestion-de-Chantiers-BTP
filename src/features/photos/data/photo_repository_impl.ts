/**
 * AGB CHANTIER - Implémentation du Repository Photos & Galerie - AXE 14
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { SitePhotoEntity } from "../domain/entities/photo_entity";

const INITIAL_PHOTOS_MOCK: Omit<SitePhotoEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    title: "Coulage Dalle Plancher Haut R+2",
    description: "Mise en œuvre du béton autoplaçant C25/30 à la pompe à béton Putzmeister.",
    tag: "COULAGE_BETON",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60",
    zoneOrBuilding: "Bâtiment Principal - Niveau R+2",
    dateCaptured: "2026-08-30T10:30:00Z",
    authorName: "Amadou Touré",
    authorRole: "Conducteur de Travaux",
    geoLocation: {
      latitude: 5.3489,
      longitude: -3.9783,
      altitudeMeters: 45,
      accuracyMeters: 4.2,
      addressDescription: "Riviera Golf, Cocody, Abidjan",
    },
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    title: "Contrôle Ferraillage Poteaux P1 à P8",
    description: "Vérification de l'enrobage béton de 3cm et des étriers HA8 tous les 15cm.",
    tag: "FERRAILLAGE_ARMATURES",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60",
    zoneOrBuilding: "Niveau R+2 - Axe C-D",
    dateCaptured: "2026-08-29T14:15:00Z",
    authorName: "Kouassi Jean-Marc",
    authorRole: "Directeur Travaux",
    geoLocation: {
      latitude: 5.3491,
      longitude: -3.9785,
      altitudeMeters: 46,
      addressDescription: "Riviera Golf, Cocody, Abidjan",
    },
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    title: "Vue Panoramique d'Avancement Façade",
    description: "Élévation de la structure avec grue à tour Potain en service.",
    tag: "AVANCEMENT_GLOBAL",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60",
    zoneOrBuilding: "Vue Générale Ouest",
    dateCaptured: "2026-08-28T16:00:00Z",
    authorName: "Kouassi Jean-Marc",
    authorRole: "Directeur Travaux",
    geoLocation: {
      latitude: 5.3485,
      longitude: -3.978,
      altitudeMeters: 50,
      addressDescription: "Riviera Golf, Cocody, Abidjan",
    },
  },
  {
    projectId: "proj-002",
    projectName: "Complexe Commercial & Bureaux - Plateau",
    title: "Pose Charpente Métallique Verrière",
    description: "Assemblage par boulonnage HR des fermes treillis en toiture.",
    tag: "SECOND_OEUVRE",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=60",
    zoneOrBuilding: "Atrium Central",
    dateCaptured: "2026-08-27T11:20:00Z",
    authorName: "Yao N'Goran",
    authorRole: "Ingénieur Suivi",
    geoLocation: {
      latitude: 5.3218,
      longitude: -4.0195,
      addressDescription: "Boulevard de la République, Plateau, Abidjan",
    },
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    title: "Contrôle Port des EPI & Ligne de Vie",
    description: "Vérification des harnais de sécurité lors des travaux de coffrage en rive de dalle.",
    tag: "SECURITE_HSE",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60",
    zoneOrBuilding: "Bordure Plancher R+2",
    dateCaptured: "2026-08-26T09:10:00Z",
    authorName: "Responsable HSE",
    authorRole: "Coordinateur Sécurité",
    geoLocation: {
      latitude: 5.3489,
      longitude: -3.9783,
    },
  },
];

export class PhotoRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<SitePhotoEntity>(IdbAdapter.STORES.PHOTOS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_PHOTOS_MOCK.length; i++) {
          const item = INITIAL_PHOTOS_MOCK[i];
          const entity: SitePhotoEntity = {
            ...item,
            id: `photo-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<SitePhotoEntity>(IdbAdapter.STORES.PHOTOS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Photos error:", e);
    }
  }

  public static async getAllPhotos(): Promise<SitePhotoEntity[]> {
    await this.init();
    return IdbAdapter.getAll<SitePhotoEntity>(IdbAdapter.STORES.PHOTOS);
  }

  public static async createPhoto(
    data: Omit<SitePhotoEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<SitePhotoEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: SitePhotoEntity = {
      ...data,
      id: `photo-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<SitePhotoEntity>(IdbAdapter.STORES.PHOTOS, newEntity);
    return newEntity;
  }
}
