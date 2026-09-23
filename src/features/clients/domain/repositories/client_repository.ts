/**
 * AGB CHANTIER - Interface du Repository Clients & MOA - AXE 03
 */

import {
  ClientEntity,
  ClientContact,
  ClientInteraction,
  ClientFilterQuery,
  ClientStats,
} from "../entities/client_entity";

export interface CreateClientDTO {
  code?: string;
  name: string;
  commercialName?: string;
  type: ClientEntity["type"];
  status?: ClientEntity["status"];
  rccm?: string;
  ifuTaxNumber?: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  country?: string;
  website?: string;
  paymentTerms?: string;
  totalContractValue?: number;
  totalPaidValue?: number;
  rating?: number;
  notes?: string;
  tags?: string[];
  initialContact?: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
}

export interface IClientRepository {
  getAllClients(query?: ClientFilterQuery): Promise<ClientEntity[]>;
  getClientById(id: string): Promise<ClientEntity | null>;
  createClient(dto: CreateClientDTO): Promise<ClientEntity>;
  updateClient(client: ClientEntity): Promise<ClientEntity>;
  deleteClient(id: string): Promise<boolean>;
  addContact(clientId: string, contact: Omit<ClientContact, "id">): Promise<ClientEntity>;
  updateContact(clientId: string, contact: ClientContact): Promise<ClientEntity>;
  deleteContact(clientId: string, contactId: string): Promise<ClientEntity>;
  addInteraction(clientId: string, interaction: Omit<ClientInteraction, "id">): Promise<ClientEntity>;
  deleteInteraction(clientId: string, interactionId: string): Promise<ClientEntity>;
  getClientStats(): Promise<ClientStats>;
  exportToCsv(clients: ClientEntity[]): string;
  initializeSeedData(): Promise<void>;
}
