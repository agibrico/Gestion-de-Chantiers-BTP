/**
 * AGB CHANTIER - Contrôleur d'Identification par QR Code - AXE 21
 */

import { InventoryRepositoryImpl } from "../../inventory/data/inventory_repository_impl";
import { EquipmentRepositoryImpl } from "../../equipment/data/equipment_repository_impl";
import { InventoryItemEntity } from "../../inventory/domain/entities/inventory_entity";
import { EquipmentEntity } from "../../equipment/domain/entities/equipment_entity";

export type IdentificationResult =
  | { type: "MATERIAU"; data: InventoryItemEntity }
  | { type: "ENGIN"; data: EquipmentEntity }
  | { type: "INCONNU"; code: string };

export class QrIdentificationController {
  /**
   * Identifie un élément à partir d'un code scanné
   * @param code Le code lu par le scanner (ex: MAT-CIM-01, ENG-PELLE-01)
   */
  public static async identify(code: string): Promise<IdentificationResult> {
    const cleanCode = code.trim().toUpperCase();

    // 1. Recherche dans l'inventaire (Matériaux)
    const inventoryRepo = InventoryRepositoryImpl.getInstance();
    const allMaterials = await inventoryRepo.getAllItems("ALL");
    const material = allMaterials.find(m => m.code.toUpperCase() === cleanCode);

    if (material) {
      return { type: "MATERIAU", data: material };
    }

    // 2. Recherche dans le parc matériel (Engins)
    const allEquipment = await EquipmentRepositoryImpl.getAllEquipment();
    const equipment = allEquipment.find(e => e.code.toUpperCase() === cleanCode);

    if (equipment) {
      return { type: "ENGIN", data: equipment };
    }

    // 3. Non trouvé
    return { type: "INCONNU", code: cleanCode };
  }
}
