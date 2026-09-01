/**
 * AGB CHANTIER - Contexte d'État Matériaux, Stocks & Inventaire - AXE 09
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  InventoryItemEntity,
  StockMovementEntity,
  InventoryStats,
  MaterialCategory,
} from "../domain/entities/inventory_entity";
import { InventoryRepositoryImpl } from "../data/inventory_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";

interface InventoryContextType {
  items: InventoryItemEntity[];
  movements: StockMovementEntity[];
  projects: ProjectEntity[];
  selectedCategory: MaterialCategory | "ALL";
  setSelectedCategory: (c: MaterialCategory | "ALL") => void;
  selectedProjectId: string;
  setSelectedProjectId: (p: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  stats: InventoryStats | null;
  isLoading: boolean;
  activeTab: "ITEMS" | "MOVEMENTS" | "ALERTS";
  setActiveTab: (t: "ITEMS" | "MOVEMENTS" | "ALERTS") => void;
  refreshInventory: () => Promise<void>;
  createItem: (data: any) => Promise<void>;
  updateItem: (data: any) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  recordMovement: (data: any) => Promise<void>;
  exportInventoryCsv: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const repository = InventoryRepositoryImpl.getInstance();

  const [items, setItems] = useState<InventoryItemEntity[]>([]);
  const [movements, setMovements] = useState<StockMovementEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | "ALL">("ALL");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ITEMS" | "MOVEMENTS" | "ALERTS">("ITEMS");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let [allItems, allMovements, allProjects, calculatedStats] = await Promise.all([
        repository.getAllItems(selectedCategory, selectedProjectId),
        repository.getAllMovements(),
        IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
        repository.calculateStats(selectedProjectId),
      ]);

      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        allItems = allItems.filter(
          (i) =>
            i.name.toLowerCase().includes(s) ||
            i.code.toLowerCase().includes(s) ||
            (i.supplierName && i.supplierName.toLowerCase().includes(s))
        );
      }

      setItems(allItems);
      setMovements(allMovements);
      setProjects(allProjects);
      setStats(calculatedStats);
    } catch (e) {
      console.error("Erreur chargement inventaire", e);
      toast.error("Erreur de chargement de l'inventaire");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedProjectId, searchQuery, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createItem = async (data: any) => {
    try {
      await repository.createItem(data);
      toast.success("Matériau ajouté", `L'article "${data.name}" est disponible en stock.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur ajout matériau");
      throw e;
    }
  };

  const updateItem = async (data: any) => {
    try {
      await repository.updateItem(data);
      toast.success("Matériau mis à jour", `"${data.name}" a été modifié.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour");
      throw e;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await repository.deleteItem(id);
      toast.success("Article supprimé");
      await loadData();
    } catch (e) {
      toast.error("Erreur suppression article");
      throw e;
    }
  };

  const recordMovement = async (data: any) => {
    try {
      await repository.recordMovement(data);
      toast.success("Mouvement validé", `Mouvement enregistré pour ${data.itemName}.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur enregistrement mouvement");
      throw e;
    }
  };

  const exportInventoryCsv = () => {
    if (items.length === 0) {
      toast.warning("Aucun matériau à exporter");
      return;
    }
    const headers = [
      "Code",
      "Désignation",
      "Catégorie",
      "Unité",
      "Stock Actuel",
      "Seuil Alerte",
      "P.U Achat (FCFA)",
      "Valeur Totale (FCFA)",
      "Emplacement",
      "Fournisseur",
    ];

    const rows = items.map((i) => [
      `"${i.code}"`,
      `"${i.name}"`,
      i.category,
      i.unit,
      i.currentStock,
      i.minStockAlert,
      i.unitPurchasePriceFCFA,
      i.totalStockValueFCFA,
      `"${i.primaryStorageLocation || ""}"`,
      `"${i.supplierName || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AGB_Inventaire_Stocks_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation réussie", "État d'inventaire CSV généré.");
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        movements,
        projects,
        selectedCategory,
        setSelectedCategory,
        selectedProjectId,
        setSelectedProjectId,
        searchQuery,
        setSearchQuery,
        stats,
        isLoading,
        activeTab,
        setActiveTab,
        refreshInventory: loadData,
        createItem,
        updateItem,
        deleteItem,
        recordMovement,
        exportInventoryCsv,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory doit être utilisé au sein de InventoryProvider");
  }
  return context;
};
