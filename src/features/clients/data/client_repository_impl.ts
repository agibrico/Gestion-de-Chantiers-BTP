/**
 * AGB CHANTIER - Implémentation du Repository Clients & MOA (IndexedDB Offline-First) - AXE 03
 */

import { IClientRepository, CreateClientDTO } from "../domain/repositories/client_repository";
import {
  ClientEntity,
  ClientContact,
  ClientInteraction,
  ClientFilterQuery,
  ClientStats,
} from "../domain/entities/client_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { NotFoundException } from "../../../core/errors/app_exception";

export class ClientRepositoryImpl implements IClientRepository {
  private static instance: ClientRepositoryImpl;

  public static getInstance(): ClientRepositoryImpl {
    if (!ClientRepositoryImpl.instance) {
      ClientRepositoryImpl.instance = new ClientRepositoryImpl();
    }
    return ClientRepositoryImpl.instance;
  }

  /**
   * Initialisation des données de démarrage réalistes BTP si la base est vide
   */
  public async initializeSeedData(): Promise<void> {
    try {
      const existing = await IdbAdapter.getAll<ClientEntity>(IdbAdapter.STORES.CLIENTS);
      if (existing.length === 0) {
        const now = new Date().toISOString();

        const defaultClients: ClientEntity[] = [
          {
            id: "cli_moa_001",
            code: "MOA-2026-001",
            name: "Ministère de la Construction, du Logement et de l'Urbanisme",
            commercialName: "MCLU - Direction Grands Travaux",
            type: "MOA_PUBLIC",
            status: "ACTIF",
            rccm: "CI-ABJ-2018-B-04912",
            ifuTaxNumber: "1809240P",
            email: "marches.publics@construction.gouv.ci",
            phone: "+225 27 20 21 45 00",
            altPhone: "+225 07 08 12 34 56",
            address: "Cité Administrative, Tour D, 14ème Étage",
            city: "Abidjan (Plateau)",
            country: "Côte d'Ivoire",
            postalCode: "BP V 153",
            website: "https://construction.gouv.ci",
            rating: 5,
            totalContractValue: 485000000, // 485M FCFA
            totalPaidValue: 320000000, // 320M FCFA
            paymentTerms: "Situation mensuelle visée par le BNETD sous 45 jours",
            notes: "Maître d'ouvrage étatique prioritaire. Projet d'aménagement urbain et réhabilitation de bâtiments administratifs.",
            tags: ["Marché Public", "BNETD", "État", "Prioritaire"],
            createdAt: "2026-01-10T08:00:00.000Z",
            updatedAt: now,
            contacts: [
              {
                id: "ct_001",
                name: "Ing. Koffi Marc",
                role: "Directeur des Marchés Publics & Suivi des Chantiers",
                department: "Direction Générale des Grands Travaux",
                phone: "+225 07 48 92 10 33",
                email: "marc.koffi@construction.gouv.ci",
                isPrimary: true,
                notes: "Interlocuteur principal pour les comités de pilotage et ordres de service.",
              },
              {
                id: "ct_002",
                name: "Mme Bamba Aïcha",
                role: "Responsable Suivi Financier & Ordonnancement",
                department: "Direction des Affaires Financières",
                phone: "+225 05 66 11 22 33",
                email: "aicha.bamba@construction.gouv.ci",
                isPrimary: false,
                notes: "Validation des décomptes mensuels et bons d'encaissement.",
              },
            ],
            projects: [
              {
                id: "prj_001",
                code: "CHT-2026-001",
                name: "Réhabilitation Cité Administrative Tour C & D",
                budget: 285000000,
                paidAmount: 210000000,
                status: "EN_COURS",
                progressPercentage: 68,
                startDate: "2026-01-15",
                endDate: "2026-11-30",
                location: "Abidjan - Plateau",
              },
              {
                id: "prj_002",
                code: "CHT-2026-003",
                name: "Construction Complexe Administratif Régional",
                budget: 200000000,
                paidAmount: 110000000,
                status: "EN_COURS",
                progressPercentage: 42,
                startDate: "2026-02-01",
                endDate: "2026-12-15",
                location: "Yamoussoukro",
              },
            ],
            interactions: [
              {
                id: "int_001",
                clientId: "cli_moa_001",
                date: "2026-02-20T10:00:00.000Z",
                type: "REUNION_CHANTIER",
                title: "Comité de pilotage bi-mensuel Tour D",
                summary: "Validation de l'avancement gros œuvre (Niveau R+8). Approbation du procès-verbal avec félicitations pour le respect des délais.",
                authorName: "Directeur Général AGB",
                priority: "IMPORTANTE",
                projectId: "prj_001",
                projectName: "Réhabilitation Cité Administrative Tour C & D",
              },
              {
                id: "int_002",
                clientId: "cli_moa_001",
                date: "2026-02-28T14:30:00.000Z",
                type: "VALIDATION_SITUATION",
                title: "Validation Décompte N°3 (75M FCFA)",
                summary: "Signature conjointe BNETD / Direction Financière. Virement bancaire programmé sous 15 jours ouvrés.",
                authorName: "Conducteur de Travaux Principal",
                priority: "NORMALE",
                projectId: "prj_001",
                projectName: "Réhabilitation Cité Administrative Tour C & D",
              },
            ],
          },
          {
            id: "cli_moa_002",
            code: "MOA-2026-002",
            name: "Société Ivoirienne de Promotion Immobilière (SIPI SA)",
            commercialName: "SIPI Immobilier Prestige",
            type: "PROMOTEUR_PRIVE",
            status: "ACTIF",
            rccm: "CI-ABJ-2015-B-11209",
            ifuTaxNumber: "1512984K",
            email: "contact@sipi-immobilier.ci",
            phone: "+225 27 22 41 80 90",
            altPhone: "+225 07 77 88 99 00",
            address: "Boulevard Latrille, Immeuble Les Jardins de Cocody, 3ème Étage",
            city: "Abidjan (Cocody Deux-Plateaux)",
            country: "Côte d'Ivoire",
            website: "https://www.sipi-immobilier.ci",
            rating: 5,
            totalContractValue: 750000000, // 750M FCFA
            totalPaidValue: 520000000, // 520M FCFA
            paymentTerms: "Acompte 30%, situations mensuelles à l'avancement, retenue de garantie 5%",
            notes: "Promoteur privé de résidences haut standing. Excellent payeur, exigences élevées en finition et sécurité HSE.",
            tags: ["Haut Standing", "Promoteur Privé", "Résidentiel", "Partenaire Clé"],
            createdAt: "2026-01-05T09:30:00.000Z",
            updatedAt: now,
            contacts: [
              {
                id: "ct_003",
                name: "M. Touré Amadou",
                role: "Directeur Général & Fondateur",
                department: "Direction Générale",
                phone: "+225 07 09 88 77 66",
                email: "amadou.toure@sipi-immobilier.ci",
                isPrimary: true,
                notes: "Signataire des contrats cadres et avenants budgétaires.",
              },
              {
                id: "ct_004",
                name: "Arch. Coulibaly Salimata",
                role: "Directrice des Programmes & Architecture",
                department: "Bureau d'Études Promotion",
                phone: "+225 01 02 03 04 05",
                email: "s.coulibaly@sipi-immobilier.ci",
                isPrimary: false,
                notes: "Supervise le choix des matériaux et la validation des plans d'exécution.",
              },
            ],
            projects: [
              {
                id: "prj_003",
                code: "CHT-2026-002",
                name: "Résidence Les Perles de la Riviera (R+6, 24 Appartements)",
                budget: 520000000,
                paidAmount: 380000000,
                status: "EN_COURS",
                progressPercentage: 55,
                startDate: "2026-01-10",
                endDate: "2026-10-31",
                location: "Abidjan - Riviera Golf",
              },
              {
                id: "prj_004",
                code: "CHT-2026-004",
                name: "Villas Duplex Émeraude (Lot de 8 Villas)",
                budget: 230000000,
                paidAmount: 140000000,
                status: "EN_COURS",
                progressPercentage: 30,
                startDate: "2026-02-15",
                endDate: "2026-12-20",
                location: "Bingerville",
              },
            ],
            interactions: [
              {
                id: "int_003",
                clientId: "cli_moa_002",
                date: "2026-02-25T15:00:00.000Z",
                type: "VISITE_TERRAIN",
                title: "Visite d'étape avec le Bureau de Contrôle SOCOTEC",
                summary: "Validation de la structure béton armé R+3 des Perles de la Riviera. Aucun écart constaté.",
                authorName: "Conducteur de Travaux Principal",
                priority: "NORMALE",
                projectId: "prj_003",
                projectName: "Résidence Les Perles de la Riviera",
              },
            ],
          },
          {
            id: "cli_moa_003",
            code: "MOA-2026-003",
            name: "SCI Ivoire Horizon & Développement",
            commercialName: "SCI Horizon",
            type: "ENTREPRISE_PARTENAIRE",
            status: "ACTIF",
            rccm: "CI-ABJ-2020-M-08341",
            ifuTaxNumber: "2019482X",
            email: "direction@sci-horizon.ci",
            phone: "+225 25 21 00 11 22",
            altPhone: "+225 05 44 33 22 11",
            address: "Zone Industrielle de Vridi, Rue des Pétroliers",
            city: "Abidjan (Port-Bouët)",
            country: "Côte d'Ivoire",
            rating: 4,
            totalContractValue: 310000000, // 310M FCFA
            totalPaidValue: 240000000, // 240M FCFA
            paymentTerms: "Paiement à 30 jours date de facture par virement",
            notes: "Société immobilière industrielle et logistique. Construction d'entrepôts sous température dirigée.",
            tags: ["Industriel", "Entrepôt", "Logistique", "Zone Portuaire"],
            createdAt: "2026-01-20T11:00:00.000Z",
            updatedAt: now,
            contacts: [
              {
                id: "ct_005",
                name: "M. N'Goran Jean-Eudes",
                role: "Responsable Patrimoine & Travaux Neufs",
                phone: "+225 07 88 99 11 22",
                email: "jeaneudes.ngoran@sci-horizon.ci",
                isPrimary: true,
              },
            ],
            projects: [
              {
                id: "prj_005",
                code: "CHT-2026-005",
                name: "Plateforme Logistique Vridi Sud (4 500 m²)",
                budget: 310000000,
                paidAmount: 240000000,
                status: "EN_COURS",
                progressPercentage: 78,
                startDate: "2026-01-05",
                endDate: "2026-07-31",
                location: "Abidjan - Vridi",
              },
            ],
            interactions: [
              {
                id: "int_004",
                clientId: "cli_moa_003",
                date: "2026-02-18T11:30:00.000Z",
                type: "APPEL",
                title: "Point sur la livraison de la charpente métallique",
                summary: "Confirmation de la réception des poutres maîtresses le 05 mars. Coordination des équipes de levage.",
                authorName: "Conducteur de Travaux Principal",
                priority: "NORMALE",
              },
            ],
          },
          {
            id: "cli_moa_004",
            code: "MOA-2026-004",
            name: "M. Diomandé Ibrahim & Épouse",
            commercialName: "Villa Privée Riviera Beverley",
            type: "PARTICULIER",
            status: "ACTIF",
            email: "ibrahim.diomande@afrikmail.com",
            phone: "+225 07 55 44 33 22",
            address: "Riviera Beverley Hills, Lot N° 412",
            city: "Abidjan (Cocody)",
            country: "Côte d'Ivoire",
            rating: 4,
            totalContractValue: 145000000, // 145M FCFA
            totalPaidValue: 95000000, // 95M FCFA
            paymentTerms: "Paiement échelonné par phases de construction (Fondations, Gros Œuvre, Finitions)",
            notes: "Client particulier haut standing. Construction d'une villa contemporaine avec piscine à débordement et toiture terrasse.",
            tags: ["Villa Particulière", "Luxe", "Piscine"],
            createdAt: "2026-02-01T14:00:00.000Z",
            updatedAt: now,
            contacts: [
              {
                id: "ct_006",
                name: "M. Diomandé Ibrahim",
                role: "Propriétaire / Maître d'Ouvrage",
                phone: "+225 07 55 44 33 22",
                email: "ibrahim.diomande@afrikmail.com",
                isPrimary: true,
              },
            ],
            projects: [
              {
                id: "prj_006",
                code: "CHT-2026-006",
                name: "Villa Contemporaine Beverley Hills",
                budget: 145000000,
                paidAmount: 95000000,
                status: "EN_COURS",
                progressPercentage: 62,
                startDate: "2026-01-20",
                endDate: "2026-08-30",
                location: "Cocody Beverley",
              },
            ],
            interactions: [
              {
                id: "int_005",
                clientId: "cli_moa_004",
                date: "2026-02-27T16:00:00.000Z",
                type: "REUNION_CHANTIER",
                title: "Choix des carreaux grand format et luminaires LED",
                summary: "Sélection des échantillons d'importation d'Espagne et validation des plans électriques de la cuisine.",
                authorName: "Directeur Général AGB",
                priority: "NORMALE",
              },
            ],
          },
          {
            id: "cli_moa_005",
            code: "MOA-2026-005",
            name: "Fonds Africain de Développement Urbain (FADU)",
            commercialName: "FADU Invest",
            type: "INVESTISSEUR",
            status: "PROSPECT",
            rccm: "CI-ABJ-2022-B-19401",
            ifuTaxNumber: "2209184T",
            email: "projects@fadu-invest.org",
            phone: "+225 20 00 99 88",
            address: "Avenue Chardy, Immeuble Horizon 2000",
            city: "Abidjan (Plateau)",
            country: "Côte d'Ivoire",
            rating: 5,
            totalContractValue: 1200000000, // 1.2 Milliard FCFA
            totalPaidValue: 0,
            paymentTerms: "Appel d'Offres International - Financement Banque Mondiale / BAD",
            notes: "Appel d'offres en phase finale pour la construction de 100 logements sociaux écologiques à Songon.",
            tags: ["Appel d'Offres", "Logements Sociaux", "Fonds Institutionnel", "Bailleur"],
            createdAt: "2026-02-10T10:00:00.000Z",
            updatedAt: now,
            contacts: [
              {
                id: "ct_007",
                name: "Dr. Mensah Kwame",
                role: "Coordonnateur Principal des Programmes BTP",
                department: "Division Infrastructures Ouest-Africaines",
                phone: "+225 05 11 22 33 44",
                email: "kwame.mensah@fadu-invest.org",
                isPrimary: true,
              },
            ],
            projects: [],
            interactions: [
              {
                id: "int_006",
                clientId: "cli_moa_005",
                date: "2026-02-24T09:00:00.000Z",
                type: "REUNION_CHANTIER",
                title: "Soutenance technique de l'offre AGB Chantier",
                summary: "Présentation des moyens humains, matériels, et du planning prévisionnel d'exécution. Retours très positifs du jury technique.",
                authorName: "Directeur Général AGB",
                priority: "URGENTE",
              },
            ],
          },
        ];

        for (const client of defaultClients) {
          await IdbAdapter.put(IdbAdapter.STORES.CLIENTS, client);
        }
        console.log(`[ClientRepositoryImpl] Seed initialisé avec ${defaultClients.length} Maîtres d'Ouvrage.`);
      }
    } catch (error) {
      console.error("[ClientRepositoryImpl] Erreur initialisation seed clients:", error);
    }
  }

  public async getAllClients(query?: ClientFilterQuery): Promise<ClientEntity[]> {
    await this.initializeSeedData();
    let clients = await IdbAdapter.getAll<ClientEntity>(IdbAdapter.STORES.CLIENTS);

    if (!query) return clients;

    // Filtre textuel
    if (query.search && query.search.trim() !== "") {
      const q = query.search.toLowerCase().trim();
      clients = clients.filter((c) => {
        const inCode = c.code.toLowerCase().includes(q);
        const inName = c.name.toLowerCase().includes(q);
        const inCommercial = c.commercialName ? c.commercialName.toLowerCase().includes(q) : false;
        const inCity = c.city.toLowerCase().includes(q);
        const inPhone = c.phone.toLowerCase().includes(q);
        const inEmail = c.email.toLowerCase().includes(q);
        const inContacts = c.contacts.some(
          (ct) => ct.name.toLowerCase().includes(q) || ct.phone.includes(q) || ct.role.toLowerCase().includes(q)
        );
        const inTags = c.tags.some((tag) => tag.toLowerCase().includes(q));

        return inCode || inName || inCommercial || inCity || inPhone || inEmail || inContacts || inTags;
      });
    }

    // Filtre par type
    if (query.type && query.type !== "ALL") {
      clients = clients.filter((c) => c.type === query.type);
    }

    // Filtre par statut
    if (query.status && query.status !== "ALL") {
      clients = clients.filter((c) => c.status === query.status);
    }

    // Filtre par notation minimale
    if (query.minRating && query.minRating > 0) {
      clients = clients.filter((c) => c.rating >= query.minRating!);
    }

    // Filtre par ville
    if (query.city && query.city !== "ALL") {
      clients = clients.filter((c) => c.city.toLowerCase().includes(query.city!.toLowerCase()));
    }

    // Tri
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    clients.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "totalContractValue") {
        comparison = a.totalContractValue - b.totalContractValue;
      } else if (sortBy === "rating") {
        comparison = a.rating - b.rating;
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return clients;
  }

  public async getClientById(id: string): Promise<ClientEntity | null> {
    await this.initializeSeedData();
    return await IdbAdapter.getById<ClientEntity>(IdbAdapter.STORES.CLIENTS, id);
  }

  public async createClient(dto: CreateClientDTO): Promise<ClientEntity> {
    await this.initializeSeedData();
    const now = new Date().toISOString();
    const existing = await IdbAdapter.getAll<ClientEntity>(IdbAdapter.STORES.CLIENTS);
    
    // Génération automatique du code si non fourni
    const count = existing.length + 1;
    const code = dto.code || `MOA-2026-${count.toString().padStart(3, "0")}`;

    const newId = `cli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const contacts: ClientContact[] = [];
    if (dto.initialContact && dto.initialContact.name) {
      contacts.push({
        id: `ct_${Date.now()}_1`,
        name: dto.initialContact.name,
        role: dto.initialContact.role || "Interlocuteur Principal",
        phone: dto.initialContact.phone || dto.phone,
        email: dto.initialContact.email || dto.email,
        isPrimary: true,
      });
    }

    const newClient: ClientEntity = {
      id: newId,
      code,
      name: dto.name,
      commercialName: dto.commercialName,
      type: dto.type,
      status: dto.status || "ACTIF",
      rccm: dto.rccm,
      ifuTaxNumber: dto.ifuTaxNumber,
      email: dto.email,
      phone: dto.phone,
      altPhone: dto.altPhone,
      address: dto.address,
      city: dto.city,
      country: dto.country || "Côte d'Ivoire",
      website: dto.website,
      paymentTerms: dto.paymentTerms || "Situation mensuelle à 30 jours",
      totalContractValue: dto.totalContractValue || 0,
      totalPaidValue: dto.totalPaidValue || 0,
      rating: dto.rating || 5,
      notes: dto.notes,
      tags: dto.tags || ["Nouveau MOA"],
      contacts,
      projects: [],
      interactions: [
        {
          id: `int_${Date.now()}`,
          clientId: newId,
          date: now,
          type: "REUNION_CHANTIER",
          title: "Création du dossier Maître d'Ouvrage",
          summary: `Fiche client enregistrée dans la plateforme AGB Chantier.`,
          authorName: "Direction AGB",
          priority: "NORMALE",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    return await IdbAdapter.put(IdbAdapter.STORES.CLIENTS, newClient);
  }

  public async updateClient(client: ClientEntity): Promise<ClientEntity> {
    const existing = await this.getClientById(client.id);
    if (!existing) {
      throw new NotFoundException(`Client ID ${client.id} introuvable.`);
    }

    const updated: ClientEntity = {
      ...client,
      updatedAt: new Date().toISOString(),
    };

    return await IdbAdapter.put(IdbAdapter.STORES.CLIENTS, updated);
  }

  public async deleteClient(id: string): Promise<boolean> {
    const existing = await this.getClientById(id);
    if (!existing) {
      throw new NotFoundException(`Client introuvable.`);
    }
    return await IdbAdapter.delete(IdbAdapter.STORES.CLIENTS, id);
  }

  public async addContact(clientId: string, contact: Omit<ClientContact, "id">): Promise<ClientEntity> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException(`Client introuvable.`);
    }

    const newContact: ClientContact = {
      ...contact,
      id: `ct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    if (newContact.isPrimary) {
      client.contacts = client.contacts.map((c) => ({ ...c, isPrimary: false }));
    }

    client.contacts.push(newContact);
    return await this.updateClient(client);
  }

  public async updateContact(clientId: string, updatedContact: ClientContact): Promise<ClientEntity> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException(`Client introuvable.`);
    }

    if (updatedContact.isPrimary) {
      client.contacts = client.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === updatedContact.id,
      }));
    }

    client.contacts = client.contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
    return await this.updateClient(client);
  }

  public async deleteContact(clientId: string, contactId: string): Promise<ClientEntity> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException(`Client introuvable.`);
    }

    client.contacts = client.contacts.filter((c) => c.id !== contactId);
    return await this.updateClient(client);
  }

  public async addInteraction(
    clientId: string,
    interaction: Omit<ClientInteraction, "id">
  ): Promise<ClientEntity> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException(`Client introuvable.`);
    }

    const newInteraction: ClientInteraction = {
      ...interaction,
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    client.interactions = [newInteraction, ...(client.interactions || [])];
    return await this.updateClient(client);
  }

  public async deleteInteraction(clientId: string, interactionId: string): Promise<ClientEntity> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException(`Client introuvable.`);
    }

    client.interactions = (client.interactions || []).filter((i) => i.id !== interactionId);
    return await this.updateClient(client);
  }

  public async getClientStats(): Promise<ClientStats> {
    const clients = await this.getAllClients();
    
    let totalContractValue = 0;
    let totalPaidValue = 0;
    let totalProjects = 0;
    let totalRating = 0;
    let ratedCount = 0;

    let activeCount = 0;
    let prospectCount = 0;

    clients.forEach((c) => {
      totalContractValue += c.totalContractValue || 0;
      totalPaidValue += c.totalPaidValue || 0;
      totalProjects += (c.projects || []).length;
      if (c.rating) {
        totalRating += c.rating;
        ratedCount++;
      }
      if (c.status === "ACTIF") activeCount++;
      if (c.status === "PROSPECT" || c.status === "EN_NEGOCIATION") prospectCount++;
    });

    return {
      totalClients: clients.length,
      activeClients: activeCount,
      prospects: prospectCount,
      totalContractValue,
      totalPaidValue,
      outstandingBalance: Math.max(0, totalContractValue - totalPaidValue),
      totalLinkedProjects: totalProjects,
      averageRating: ratedCount > 0 ? Number((totalRating / ratedCount).toFixed(1)) : 5,
    };
  }

  public exportToCsv(clients: ClientEntity[]): string {
    const headers = [
      "Code",
      "Nom / Raison Sociale",
      "Nom Commercial",
      "Type",
      "Statut",
      "RCCM",
      "IFU Fiscal",
      "Email",
      "Téléphone",
      "Ville",
      "Pays",
      "Valeur Contrats (FCFA)",
      "Total Encaissé (FCFA)",
      "Solde Restant (FCFA)",
      "Notation",
      "Contact Principal Nom",
      "Contact Principal Tel",
      "Projets Associés",
    ];

    const rows = clients.map((c) => {
      const primaryContact = c.contacts.find((ct) => ct.isPrimary) || c.contacts[0];
      const solde = (c.totalContractValue || 0) - (c.totalPaidValue || 0);

      return [
        `"${c.code}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${(c.commercialName || "").replace(/"/g, '""')}"`,
        `"${c.type}"`,
        `"${c.status}"`,
        `"${c.rccm || ""}"`,
        `"${c.ifuTaxNumber || ""}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.city}"`,
        `"${c.country}"`,
        `"${c.totalContractValue}"`,
        `"${c.totalPaidValue}"`,
        `"${solde}"`,
        `"${c.rating}"`,
        `"${primaryContact ? primaryContact.name.replace(/"/g, '""') : ""}"`,
        `"${primaryContact ? primaryContact.phone : ""}"`,
        `"${(c.projects || []).length}"`,
      ].join(";");
    });

    return [headers.join(";"), ...rows].join("\n");
  }
}
