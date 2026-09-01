/**
 * AGB CHANTIER - Entités du Domaine Photos, Galerie & Géolocalisation - AXE 14
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type PhotoTag =
  | "AVANCEMENT_GLOBAL"
  | "FERRAILLAGE_ARMATURES"
  | "COULAGE_BETON"
  | "SECOND_OEUVRE"
  | "RECOLEMENT"
  | "NON_CONFORMITE_RESERVE"
  | "SECURITE_HSE"
  | "LIVRAISON_MATERIAUX";

export interface GeoLocationCoords {
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  addressDescription?: string; // Ex: Cocody Riviera Golf, Abidjan
}

export interface SitePhotoEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  tag: PhotoTag;
  imageUrl: string;
  thumbnailUrl?: string;
  zoneOrBuilding: string; // Ex: Bâtiment A - R+2 - Zone Est
  dateCaptured: string; // ISO
  authorName: string;
  authorRole: string;
  geoLocation?: GeoLocationCoords;
  beforeAfterPairId?: string; // Si comparaison avant/après travaux
  isBefore?: boolean;
}
