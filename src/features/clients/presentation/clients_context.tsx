/**
 * AGB CHANTIER - Contexte & State Management Clients & MOA (AXE 03)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ClientEntity,
  ClientContact,
  ClientInteraction,
  ClientFilterQuery,
  ClientStats,
} from "../domain/entities/client_entity";
import { CreateClientDTO } from "../domain/repositories/client_repository";
import { ClientRepositoryImpl } from "../data/client_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";

interface ClientsContextType {
  clients: ClientEntity[];
  selectedClient: ClientEntity | null;
  isLoading: boolean;
  stats: ClientStats | null;
  filterQuery: ClientFilterQuery;
  setFilterQuery: React.Dispatch<React.SetStateAction<ClientFilterQuery>>;
  setSelectedClient: (client: ClientEntity | null) => void;
  refreshClients: () => Promise<void>;
  createClient: (dto: CreateClientDTO) => Promise<ClientEntity>;
  updateClient: (client: ClientEntity) => Promise<ClientEntity>;
  deleteClient: (id: string) => Promise<boolean>;
  addContact: (clientId: string, contact: Omit<ClientContact, "id">) => Promise<void>;
  updateContact: (clientId: string, contact: ClientContact) => Promise<void>;
  deleteContact: (clientId: string, contactId: string) => Promise<void>;
  addInteraction: (clientId: string, interaction: Omit<ClientInteraction, "id">) => Promise<void>;
  deleteInteraction: (clientId: string, interactionId: string) => Promise<void>;
  exportCsv: () => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<ClientEntity[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientEntity | null>(null);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState<ClientFilterQuery>({
    search: "",
    type: "ALL",
    status: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const toast = useToast();
  const repo = ClientRepositoryImpl.getInstance();

  const refreshClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await repo.getAllClients(filterQuery);
      setClients(data);

      const statistics = await repo.getClientStats();
      setStats(statistics);

      // Si un client est sélectionné, rafraîchir son état
      if (selectedClient) {
        const refreshed = data.find((c) => c.id === selectedClient.id);
        if (refreshed) {
          setSelectedClient(refreshed);
        }
      }
    } catch (error: any) {
      toast.error("Erreur de chargement", error.message || "Impossible de récupérer les clients.");
    } finally {
      setIsLoading(false);
    }
  }, [filterQuery, selectedClient, repo, toast]);

  useEffect(() => {
    refreshClients();
  }, [filterQuery.search, filterQuery.type, filterQuery.status, filterQuery.sortBy, filterQuery.sortOrder]);

  const createClient = async (dto: CreateClientDTO): Promise<ClientEntity> => {
    try {
      const created = await repo.createClient(dto);
      await refreshClients();
      toast.success("Client / MOA Enregistré", `Le client "${created.name}" (${created.code}) a été créé.`);
      return created;
    } catch (error: any) {
      toast.error("Erreur création", error.message || "Impossible d'enregistrer le client.");
      throw error;
    }
  };

  const updateClient = async (client: ClientEntity): Promise<ClientEntity> => {
    try {
      const updated = await repo.updateClient(client);
      await refreshClients();
      if (selectedClient?.id === updated.id) {
        setSelectedClient(updated);
      }
      toast.success("Fiche Mise à Jour", `Informations de "${updated.name}" actualisées avec succès.`);
      return updated;
    } catch (error: any) {
      toast.error("Erreur mise à jour", error.message || "Impossible de mettre à jour la fiche client.");
      throw error;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const success = await repo.deleteClient(id);
      if (success) {
        if (selectedClient?.id === id) {
          setSelectedClient(null);
        }
        await refreshClients();
        toast.success("Client Supprimé", "La fiche client a été retirée du système.");
      }
      return success;
    } catch (error: any) {
      toast.error("Erreur suppression", error.message || "Impossible de supprimer ce client.");
      return false;
    }
  };

  const addContact = async (clientId: string, contact: Omit<ClientContact, "id">): Promise<void> => {
    try {
      const updated = await repo.addContact(clientId, contact);
      await refreshClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.success("Contact Ajouté", `Interlocuteur "${contact.name}" ajouté avec succès.`);
    } catch (error: any) {
      toast.error("Erreur contact", error.message || "Impossible d'ajouter l'interlocuteur.");
    }
  };

  const updateContact = async (clientId: string, contact: ClientContact): Promise<void> => {
    try {
      const updated = await repo.updateContact(clientId, contact);
      await refreshClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.success("Contact Modifié", `Interlocuteur "${contact.name}" mis à jour.`);
    } catch (error: any) {
      toast.error("Erreur contact", error.message || "Impossible de modifier l'interlocuteur.");
    }
  };

  const deleteContact = async (clientId: string, contactId: string): Promise<void> => {
    try {
      const updated = await repo.deleteContact(clientId, contactId);
      await refreshClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.success("Contact Retiré", "L'interlocuteur a été supprimé de la fiche client.");
    } catch (error: any) {
      toast.error("Erreur contact", error.message || "Impossible de retirer l'interlocuteur.");
    }
  };

  const addInteraction = async (
    clientId: string,
    interaction: Omit<ClientInteraction, "id">
  ): Promise<void> => {
    try {
      const updated = await repo.addInteraction(clientId, interaction);
      await refreshClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.success("Échange Enregistré", `L'interaction "${interaction.title}" a été consignée.`);
    } catch (error: any) {
      toast.error("Erreur interaction", error.message || "Impossible d'enregistrer l'échange.");
    }
  };

  const deleteInteraction = async (clientId: string, interactionId: string): Promise<void> => {
    try {
      const updated = await repo.deleteInteraction(clientId, interactionId);
      await refreshClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(updated);
      }
      toast.info("Journal actualisé", "L'entrée du journal d'échanges a été retirée.");
    } catch (error: any) {
      toast.error("Erreur journal", error.message || "Impossible de supprimer l'entrée.");
    }
  };

  const exportCsv = () => {
    try {
      const csvContent = repo.exportToCsv(clients);
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `AGB_EXPORT_CLIENTS_MOA_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export Réussi", "Fichier CSV téléchargé avec succès.");
    } catch (error: any) {
      toast.error("Erreur export", "Impossible d'exporter les données.");
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        selectedClient,
        isLoading,
        stats,
        filterQuery,
        setFilterQuery,
        setSelectedClient,
        refreshClients,
        createClient,
        updateClient,
        deleteClient,
        addContact,
        updateContact,
        deleteContact,
        addInteraction,
        deleteInteraction,
        exportCsv,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = (): ClientsContextType => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients doit être utilisé au sein d'un ClientsProvider.");
  }
  return context;
};
