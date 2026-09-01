/**
 * AGB CHANTIER - Contexte d'État Fournisseurs & Achats - AXE 10
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SupplierEntity,
  PurchaseOrderEntity,
  SuppliersStats,
  SupplierCategory,
  PurchaseOrderStatus,
} from "../domain/entities/supplier_entity";
import { SupplierRepositoryImpl } from "../data/supplier_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";

interface SuppliersContextType {
  suppliers: SupplierEntity[];
  orders: PurchaseOrderEntity[];
  projects: ProjectEntity[];
  selectedCategory: SupplierCategory | "ALL";
  setSelectedCategory: (c: SupplierCategory | "ALL") => void;
  selectedProjectId: string;
  setSelectedProjectId: (p: string) => void;
  selectedOrderStatus: PurchaseOrderStatus | "ALL";
  setSelectedOrderStatus: (s: PurchaseOrderStatus | "ALL") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  stats: SuppliersStats | null;
  isLoading: boolean;
  activeTab: "ORDERS" | "SUPPLIERS";
  setActiveTab: (t: "ORDERS" | "SUPPLIERS") => void;
  refreshSuppliers: () => Promise<void>;
  createSupplier: (data: any) => Promise<void>;
  updateSupplier: (data: any) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  createPurchaseOrder: (data: any) => Promise<void>;
  updatePurchaseOrder: (data: any) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  approvePurchaseOrder: (id: string, approver: string) => Promise<void>;
  markAsDelivered: (id: string, blNumber: string, date: string) => Promise<void>;
  exportOrdersCsv: () => void;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const repository = SupplierRepositoryImpl.getInstance();

  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [orders, setOrders] = useState<PurchaseOrderEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SupplierCategory | "ALL">("ALL");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<PurchaseOrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stats, setStats] = useState<SuppliersStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"ORDERS" | "SUPPLIERS">("ORDERS");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let [allSuppliers, allOrders, allProjects, calculatedStats] = await Promise.all([
        repository.getAllSuppliers(selectedCategory),
        repository.getAllPurchaseOrders(selectedProjectId, selectedOrderStatus),
        IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
        repository.calculateStats(selectedProjectId),
      ]);

      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        allSuppliers = allSuppliers.filter(
          (sp) =>
            sp.name.toLowerCase().includes(s) ||
            sp.code.toLowerCase().includes(s) ||
            sp.city.toLowerCase().includes(s)
        );
        allOrders = allOrders.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(s) ||
            o.supplierName.toLowerCase().includes(s) ||
            o.projectName.toLowerCase().includes(s)
        );
      }

      setSuppliers(allSuppliers);
      setOrders(allOrders);
      setProjects(allProjects);
      setStats(calculatedStats);
    } catch (e) {
      console.error("Erreur chargement fournisseurs & achats", e);
      toast.error("Erreur de chargement des données fournisseurs");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedProjectId, selectedOrderStatus, searchQuery, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createSupplier = async (data: any) => {
    try {
      await repository.createSupplier(data);
      toast.success("Fournisseur référencé", `L'entreprise "${data.name}" est enregistrée.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur ajout fournisseur");
      throw e;
    }
  };

  const updateSupplier = async (data: any) => {
    try {
      await repository.updateSupplier(data);
      toast.success("Fournisseur mis à jour", `Fiche "${data.name}" actualisée.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur modification fournisseur");
      throw e;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await repository.deleteSupplier(id);
      toast.success("Fournisseur supprimé");
      await loadData();
    } catch (e) {
      toast.error("Erreur suppression");
      throw e;
    }
  };

  const createPurchaseOrder = async (data: any) => {
    try {
      await repository.createPurchaseOrder(data);
      toast.success("Bon de commande créé", `N° ${data.orderNumber} émis avec succès.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur création commande");
      throw e;
    }
  };

  const updatePurchaseOrder = async (data: any) => {
    try {
      await repository.updatePurchaseOrder(data);
      toast.success("Commande mise à jour", `Bon ${data.orderNumber} actualisé.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour commande");
      throw e;
    }
  };

  const deletePurchaseOrder = async (id: string) => {
    try {
      await repository.deletePurchaseOrder(id);
      toast.success("Bon de commande annulé / supprimé");
      await loadData();
    } catch (e) {
      toast.error("Erreur suppression commande");
      throw e;
    }
  };

  const approvePurchaseOrder = async (id: string, approver: string) => {
    try {
      await repository.approvePurchaseOrder(id, approver);
      toast.success("Commande validée", `Visa de direction apposé par ${approver}.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur validation commande");
      throw e;
    }
  };

  const markAsDelivered = async (id: string, blNumber: string, date: string) => {
    try {
      await repository.markAsDelivered(id, blNumber, date);
      toast.success("Livraison réceptionnée", `Rapprochement BL ${blNumber} effectué.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur réception livraison");
      throw e;
    }
  };

  const exportOrdersCsv = () => {
    if (orders.length === 0) {
      toast.warning("Aucun bon de commande à exporter");
      return;
    }
    const headers = [
      "N° Commande",
      "Fournisseur",
      "Chantier",
      "Date Commande",
      "Date Livraison Prévue",
      "Statut Commande",
      "Statut Règlement",
      "Montant HT (FCFA)",
      "TVA (FCFA)",
      "Total TTC (FCFA)",
      "N° BL Rapproché",
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.supplierName}"`,
      `"${o.projectName}"`,
      o.orderDate,
      o.expectedDeliveryDate,
      o.status,
      o.paymentStatus,
      o.subtotalFCFA,
      o.vatAmountFCFA,
      o.totalWithTaxFCFA,
      `"${o.deliveryNoteNumber || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AGB_Bons_de_Commande_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation réussie", "Registre des commandes CSV généré.");
  };

  return (
    <SuppliersContext.Provider
      value={{
        suppliers,
        orders,
        projects,
        selectedCategory,
        setSelectedCategory,
        selectedProjectId,
        setSelectedProjectId,
        selectedOrderStatus,
        setSelectedOrderStatus,
        searchQuery,
        setSearchQuery,
        stats,
        isLoading,
        activeTab,
        setActiveTab,
        refreshSuppliers: loadData,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        createPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        approvePurchaseOrder,
        markAsDelivered,
        exportOrdersCsv,
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = (): SuppliersContextType => {
  const context = useContext(SuppliersContext);
  if (!context) {
    throw new Error("useSuppliers doit être utilisé au sein de SuppliersProvider");
  }
  return context;
};
