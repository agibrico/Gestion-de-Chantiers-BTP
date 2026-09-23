/**
 * AGB CHANTIER - Service d'Exportation CSV BTP Avancé
 * Génère des rapports professionnels conformes aux standards de gestion de chantier,
 * intégrant la synthèse exécutive, les métriques financières/avancement, et l'audit des jalons dépassés.
 * Formaté en UTF-8 avec BOM (\uFEFF) pour compatibilité native Microsoft Excel et tableurs.
 */

import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { DashboardMilestoneAlertsSummary } from "../../planning/domain/milestone_alert_helper";

export interface BtpCsvExportOptions {
  includeKpiSummary?: boolean;
  includeMilestonesDetail?: boolean;
  filterName?: string;
  searchQuery?: string;
}

/**
 * Nettoie et échappe une chaîne pour inclusion dans un fichier CSV (RFC 4180)
 */
const escapeCsvCell = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) return '""';
  const raw = String(value);
  const stringValue = typeof value === "string" && /^[\s\u0000-\u001f]*[=+@-]/.test(raw) ? `'${raw}` : raw;
  // Échapper les guillemets doubles et entourer la cellule de guillemets
  return `"${stringValue.replace(/"/g, '""')}"`;
};

/**
 * Formate un nombre au format monétaire standard
 */
const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString("fr-FR");
};

/**
 * Vérifie si un chantier est en retard sur son échéance contractuelle
 */
const isDelayedProject = (p: ProjectEntity): boolean => {
  if (p.status !== "EN_COURS") return false;
  const now = new Date().getTime();
  const end = new Date(p.estimatedEndDate).getTime();
  return end < now;
};

/**
 * Calcule les jours de retard sur la date prévisionnelle
 */
const getDelayDays = (p: ProjectEntity): number => {
  if (!isDelayedProject(p)) return 0;
  const now = new Date().getTime();
  const end = new Date(p.estimatedEndDate).getTime();
  return Math.max(0, Math.floor((now - end) / (1000 * 3600 * 24)));
};

/**
 * Génère la structure complète du fichier CSV de reporting BTP
 */
export const generateBtpDashboardCsv = (
  projects: ProjectEntity[],
  milestoneAlertsSummary?: DashboardMilestoneAlertsSummary,
  options: BtpCsvExportOptions = {}
): string => {
  const {
    includeKpiSummary = true,
    includeMilestonesDetail = true,
    filterName = "Tous les Chantiers",
    searchQuery = "",
  } = options;

  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calcul des statistiques globales
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "EN_COURS").length;
  const delayedProjects = projects.filter(isDelayedProject).length;

  const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudgetContracted || 0), 0);
  const totalExpenses = projects.reduce((sum, p) => sum + (p.totalExpensesRealized || 0), 0);
  const totalBilled = projects.reduce((sum, p) => sum + (p.totalBilledAmount || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (p.totalPaidAmount || 0), 0);
  const budgetBalance = totalBudget - totalExpenses;
  const budgetConsumptionRate = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : "0.0";

  const avgProgress =
    totalProjects > 0
      ? (projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / totalProjects).toFixed(1)
      : "0.0";

  const totalWorkers = projects.reduce(
    (sum, p) => sum + (p.metrics?.workersOnSiteToday || 0),
    0
  );
  const totalHoursWorked = projects.reduce(
    (sum, p) => sum + (p.metrics?.totalHoursWorked || 0),
    0
  );

  const totalOverdueMilestones = milestoneAlertsSummary?.totalOverdueMilestonesCount || 0;
  const totalCriticalMilestones = milestoneAlertsSummary?.totalCriticalMilestonesCount || 0;

  const lines: string[] = [];

  // ==========================================
  // EN-TÊTE DU RAPPORT BTP
  // ==========================================
  lines.push(
    [
      escapeCsvCell("AGB CHANTIER — RAPPORT OFFICIEL DE SUPERVISION & PILOTAGE BTP"),
      escapeCsvCell(`Généré le ${dateStr} à ${timeStr}`),
    ].join(";")
  );
  lines.push(
    [
      escapeCsvCell("Périmètre"),
      escapeCsvCell(`Filtre : ${filterName} | Recherche : ${searchQuery || "Aucune"}`),
    ].join(";")
  );
  lines.push(""); // Ligne vide de séparation

  // ==========================================
  // SECTION 1 : SYNTHÈSE EXÉCUTIVE DES KPIS
  // ==========================================
  if (includeKpiSummary) {
    lines.push(escapeCsvCell("--- 1. SYNTHÈSE EXÉCUTIVE DES INDICATEURS CLÉS (PORTFOLIO BTP) ---"));
    lines.push(["Indicateur", "Valeur", "Unité / Commentaire"].map(escapeCsvCell).join(";"));
    lines.push(["Total Chantiers dans le Périmètre", totalProjects, "Chantiers"].map(escapeCsvCell).join(";"));
    lines.push(["Chantiers Actifs en Cours", activeProjects, "Chantiers"].map(escapeCsvCell).join(";"));
    lines.push(
      [
        "Chantiers en Retard sur Livraison",
        delayedProjects,
        totalProjects > 0 ? `${((delayedProjects / totalProjects) * 100).toFixed(1)}% du portefeuille` : "0%",
      ]
        .map(escapeCsvCell)
        .join(";")
    );
    lines.push(["Avancement Physique Moyen", `${avgProgress}%`, "Moyenne arithmétique"].map(escapeCsvCell).join(";"));
    lines.push(["Budget Total Marchés (TTC)", formatNumber(totalBudget), "FCFA"].map(escapeCsvCell).join(";"));
    lines.push(["Dépenses Totales Réalisées (Coûts)", formatNumber(totalExpenses), "FCFA"].map(escapeCsvCell).join(";"));
    lines.push(["Solde Budgétaire Disponible", formatNumber(budgetBalance), "FCFA"].map(escapeCsvCell).join(";"));
    lines.push(["Taux d'Engagement Budgétaire", `${budgetConsumptionRate}%`, "Ratio Dépenses / Marchés"].map(escapeCsvCell).join(";"));
    lines.push(["Montant Total Facturé (Situations)", formatNumber(totalBilled), "FCFA"].map(escapeCsvCell).join(";"));
    lines.push(["Montant Total Encaissé", formatNumber(totalPaid), "FCFA"].map(escapeCsvCell).join(";"));
    lines.push(["Effectif Ouvriers Mobilisé Aujourd'hui", totalWorkers, "Compagnons sur site"].map(escapeCsvCell).join(";"));
    lines.push(["Volume d'Heures Travaillées Cumulées", formatNumber(totalHoursWorked), "Heures"].map(escapeCsvCell).join(";"));
    lines.push(
      ["Jalons Charnières en Retard", totalOverdueMilestones, `Dont ${totalCriticalMilestones} sur chemin critique`]
        .map(escapeCsvCell)
        .join(";")
    );
    lines.push(""); // Ligne vide
  }

  // ==========================================
  // SECTION 2 : REGISTRE DÉTAILLÉ DES CHANTIERS
  // ==========================================
  lines.push(escapeCsvCell("--- 2. REGISTRE DÉTAILLÉ DES CHANTIERS BTP ---"));

  const projectHeaders = [
    "Code Chantier",
    "Intitulé du Projet",
    "Typologie Ouvrage",
    "Statut Chantier",
    "Niveau de Risque",
    "Date Début Prévue",
    "Date Livraison Prévue",
    "Retard Détecté",
    "Délai Retard (Jours)",
    "Avancement Physique (%)",
    "Avancement Financier (%)",
    "Budget Marché Initial (FCFA)",
    "Dépenses Réalisées (FCFA)",
    "Solde Budgétaire (FCFA)",
    "Taux Consommation (%)",
    "Montant Facturé (FCFA)",
    "Montant Encaissé (FCFA)",
    "Client / Maître d'Ouvrage",
    "Ville",
    "Conducteur de Travaux",
    "Directeur de Travaux",
    "Chef de Chantier",
    "Ouvriers sur Site",
    "Heures Travaillées Cumulées",
    "Incidents HSE",
  ];

  lines.push(projectHeaders.map(escapeCsvCell).join(";"));

  projects.forEach((p) => {
    const isDelayed = isDelayedProject(p);
    const delayDays = getDelayDays(p);

    const pBudget = p.totalBudgetContracted || 0;
    const pExpenses = p.totalExpensesRealized || 0;
    const pBalance = pBudget - pExpenses;
    const pRate = pBudget > 0 ? ((pExpenses / pBudget) * 100).toFixed(1) : "0.0";

    const row = [
      p.code,
      p.name,
      p.type,
      p.status,
      p.riskLevel || "NORMAL",
      p.startDate ? p.startDate.split("T")[0] : "",
      p.estimatedEndDate ? p.estimatedEndDate.split("T")[0] : "",
      isDelayed ? "OUI" : "NON",
      delayDays,
      p.progressPercentage,
      p.financialProgressPercentage || 0,
      formatNumber(pBudget),
      formatNumber(pExpenses),
      formatNumber(pBalance),
      `${pRate}%`,
      formatNumber(p.totalBilledAmount || 0),
      formatNumber(p.totalPaidAmount || 0),
      p.clientName,
      p.location?.city || "",
      p.managementTeam?.siteManagerName || "",
      p.managementTeam?.projectManagerName || "",
      p.managementTeam?.foremanName || "",
      p.metrics?.workersOnSiteToday || 0,
      p.metrics?.totalHoursWorked || 0,
      p.metrics?.safetyIncidentsCount || 0,
    ];

    lines.push(row.map(escapeCsvCell).join(";"));
  });

  lines.push(""); // Ligne vide

  // ==========================================
  // SECTION 3 : AUDIT DES JALONS CRITIQUES ET DATES CHARNIÈRES DÉPASSÉES
  // ==========================================
  if (
    includeMilestonesDetail &&
    milestoneAlertsSummary &&
    milestoneAlertsSummary.projectsWithAlerts &&
    milestoneAlertsSummary.projectsWithAlerts.length > 0
  ) {
    lines.push(escapeCsvCell("--- 3. AUDIT DES JALONS PLANNING & DATES CHARNIÈRES EN DÉPASSEMENT ---"));

    const milestoneHeaders = [
      "Code Chantier",
      "Nom du Chantier",
      "Phase des Travaux",
      "Intitulé du Jalon Charnière",
      "Date Cible Prévue",
      "Retard Constaté (Jours)",
      "Degré de Criticité",
      "Type d'Alerte",
      "Gravité",
      "Commentaires / Notes",
    ];

    lines.push(milestoneHeaders.map(escapeCsvCell).join(";"));

    milestoneAlertsSummary.projectsWithAlerts.forEach((projAlert) => {
      projAlert.overdueItems.forEach((item) => {
        const row = [
          projAlert.projectCode,
          projAlert.projectName,
          item.phaseName || "Général",
          item.title,
          item.targetDate ? item.targetDate.split("T")[0] : "",
          item.overdueDays,
          item.isCritical ? "CRITIQUE (Chemin Critique)" : "STANDARD",
          item.type,
          item.severity,
          item.notes || "",
        ];
        lines.push(row.map(escapeCsvCell).join(";"));
      });
    });
  }

  // BOM UTF-8 (\uFEFF) pour compatibilité totale avec Excel
  return "\uFEFF" + lines.join("\r\n");
};

/**
 * Déclenche le téléchargement direct du fichier CSV dans le navigateur
 */
export const downloadBtpDashboardCsv = (
  projects: ProjectEntity[],
  milestoneAlertsSummary?: DashboardMilestoneAlertsSummary,
  options: BtpCsvExportOptions = {}
): string => {
  const csvContent = generateBtpDashboardCsv(projects, milestoneAlertsSummary, options);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const dateSlug = new Date().toISOString().split("T")[0];
  const filename = `AGB_Reporting_BTP_TableauDeBord_${dateSlug}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  return filename;
};
