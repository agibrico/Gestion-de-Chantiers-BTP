/**
 * AGB CHANTIER - Barre Latérale Adaptative (Desktop & Tablet Rail / Drawer)
 */

import React from "react";
import {
  Layers,
  Palette,
  HardHat,
  Users,
  Calendar,
  CheckSquare,
  Clock,
  Package,
  Truck,
  Coins,
  Wrench,
  BookOpen,
  Camera,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  FileText,
  Printer,
  Award,
  QrCode,
  Bell,
  Sparkles,
  History,
  Settings,
  X,
  Briefcase,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../../features/auth/presentation/auth_context";
import { AppTooltip } from "../feedback/app_tooltip";

interface SidebarItem {
  key: string;
  label: string;
  route: string;
  icon: React.ReactNode;
  axeNumber: number;
  description: string;
}

interface AppSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { currentUser } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { key: "auth_portal", label: "02. Portail (3 Boutons)", route: "/auth/login", icon: <ShieldCheck className="w-4 h-4" />, axeNumber: 2, description: "Accès multi-profils (Admin, Gérant, Salarié terrain)" },
    { key: "admin_users", label: "02. Employés & Permissions", route: "/admin/users", icon: <Users className="w-4 h-4" />, axeNumber: 2, description: "Gestion des comptes utilisateurs, statuts et rôles RBAC" },
    { key: "gerant_dash", label: "02. Espace Gérant", route: "/gerant/dashboard", icon: <Briefcase className="w-4 h-4" />, axeNumber: 2, description: "Pilotage stratégique, budgets consolidés et validation des dépenses" },
    { key: "employee_port", label: "02. Espace Employé", route: "/employee/portal", icon: <HardHat className="w-4 h-4" />, axeNumber: 2, description: "Pointage personnel, fiches de paie et sécurité individuelle" },
    { key: "overview", label: "01. Architecture & 30 Axes", route: "/overview", icon: <Layers className="w-4 h-4" />, axeNumber: 1, description: "Matrice d'avancement globale du projet AGB Chantier" },
    { key: "design_system", label: "01. Design System", route: "/design-system", icon: <Palette className="w-4 h-4" />, axeNumber: 1, description: "Composants certifiés, tokens et charte graphique BTP" },
    { key: "clients", label: "03. Clients & MOA", route: "/clients", icon: <Users className="w-4 h-4" />, axeNumber: 3, description: "Maîtrise d'ouvrage, promoteurs, contrats et facturation" },
    { key: "projects", label: "04. Chantiers", route: "/projects", icon: <HardHat className="w-4 h-4" />, axeNumber: 4, description: "Opérations actives, avancement physique et géolocalisation" },
    { key: "teams", label: "05. Gestion des Intervenants", route: "/intervenants", icon: <Users className="w-4 h-4" />, axeNumber: 5, description: "Sous-traitants, personnel régie, coordonnées et affectations chantier" },
    { key: "planning", label: "06. Planning & Gantt", route: "/planning", icon: <Calendar className="w-4 h-4" />, axeNumber: 6, description: "Calendrier prévisionnel, jalons clés et retards météo" },
    { key: "tasks", label: "07. Travaux & Tâches", route: "/tasks", icon: <CheckSquare className="w-4 h-4" />, axeNumber: 7, description: "Assignation des tâches par corps d'état et avancement" },
    { key: "attendance", label: "08. Pointage & Présence", route: "/attendance", icon: <Clock className="w-4 h-4" />, axeNumber: 8, description: "Pointage biométrique/PIN et heures travaillées du personnel" },
    { key: "inventory", label: "09. Matériaux & Stocks", route: "/inventory", icon: <Package className="w-4 h-4" />, axeNumber: 9, description: "Niveaux de stock ciment, aciers et alertes de réapprovisionnement" },
    { key: "suppliers", label: "10. Fournisseurs & Commandes", route: "/suppliers", icon: <Truck className="w-4 h-4" />, axeNumber: 10, description: "Bons de commande, livraisons BPE et factures fournisseurs" },
    { key: "finance", label: "11. Budget & Dépenses", route: "/finance", icon: <Coins className="w-4 h-4" />, axeNumber: 11, description: "Suivi des déboursés, marges nettes et engagements de dépenses" },
    { key: "equipment", label: "12. Engins & Matériels", route: "/equipment", icon: <Wrench className="w-4 h-4" />, axeNumber: 12, description: "Parc matériel, grues, pelleteuses et contrôles périodiques VGP" },
    { key: "site_diary", label: "13. Journal de Chantier", route: "/site-diary", icon: <BookOpen className="w-4 h-4" />, axeNumber: 13, description: "Rapports journaliers, effectifs, météo et faits marquants" },
    { key: "photos", label: "14. Photos & Géoloc", route: "/photos", icon: <Camera className="w-4 h-4" />, axeNumber: 14, description: "Banque d'images horodatées et preuves visuelles d'avancement" },
    { key: "quality", label: "15. Contrôle Qualité", route: "/quality", icon: <FileCheck className="w-4 h-4" />, axeNumber: 15, description: "Fiches de conformité, bons à couler et essais d'écrasement béton" },
    { key: "hse", label: "16. HSE & Sécurité", route: "/hse", icon: <AlertTriangle className="w-4 h-4" />, axeNumber: 16, description: "Accidents de travail, presqu'accidents, registres SST et EPI" },
    { key: "reservations", label: "17. Réserves & OPR", route: "/reservations", icon: <FileCheck className="w-4 h-4" />, axeNumber: 17, description: "Levée des réserves OPR et quitus de réception contradictoire" },
    { key: "documents", label: "18. Documents & Plans", route: "/documents", icon: <FileText className="w-4 h-4" />, axeNumber: 18, description: "GED technique, plans BPE, visas SOCOTEC et CCTP" },
    { key: "reports", label: "19. Rapports & PDF", route: "/reports", icon: <Printer className="w-4 h-4" />, axeNumber: 19, description: "Génération de rapports hebdomadaires et mensuels signés" },
    { key: "reception", label: "20. Réception & PV", route: "/reception", icon: <Award className="w-4 h-4" />, axeNumber: 20, description: "Procès-verbaux de réception provisoire et définitive avec ou sans réserves" },
    { key: "analytics_d3", label: "21. Graphiques D3.js (BI)", route: "/analytics", icon: <BarChart3 className="w-4 h-4" />, axeNumber: 21, description: "Tableaux de bord D3.js : avancement physique, consommation budgétaire et réserves" },
    { key: "qr_code", label: "22. QR Code Scanner", route: "/qr-scanner", icon: <QrCode className="w-4 h-4" />, axeNumber: 22, description: "Scan des badges ouvriers et accès aux fiches matériels" },
    { key: "notifications", label: "23. Alertes & Notifications", route: "/notifications", icon: <Bell className="w-4 h-4" />, axeNumber: 23, description: "Alerte push et visuelle en direct : accidents et non-conformités majeures" },
    { key: "ai_assistant", label: "25. Assistant IA AGB", route: "/ai-assistant", icon: <Sparkles className="w-4 h-4" />, axeNumber: 25, description: "Analyse prédictive des plannings et calcul des ratios chantiers" },
    { key: "audit", label: "26. Journal d'Audit", route: "/audit", icon: <History className="w-4 h-4" />, axeNumber: 26, description: "Traçabilité intégrale des actions et signatures électroniques" },
    { key: "settings", label: "27. Paramètres & Backup", route: "/settings", icon: <Settings className="w-4 h-4" />, axeNumber: 27, description: "Sauvegardes chiffrées IndexedDB et synchronisation cloud" },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800">
      {/* Brand & Timeline Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
            Modules Chantier
          </h3>
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
            AGB BTP Management Suite
          </p>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex flex-col">
          {sidebarItems.map((item) => {
            const isActive = currentRoute === item.route || (item.route === "/intervenants" && currentRoute === "/teams");
            const isReady = item.axeNumber <= 22;

            return (
              <AppTooltip key={item.key} content={item.description} position="right">
                <button
                  onClick={() => {
                    onNavigate(item.route);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-white dark:bg-slate-800 border-l-4 border-orange-500 shadow-xs"
                      : "border-l-4 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? "text-orange-500 font-bold" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col truncate">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isActive
                            ? "text-slate-900 dark:text-white font-bold"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {isReady ? (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      [READY]
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase font-mono text-slate-400">
                      AXE {item.axeNumber.toString().padStart(2, "0")}
                    </span>
                  )}
                </button>
              </AppTooltip>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between bg-white dark:bg-slate-900/60 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Système Opérationnel
        </span>
        <span className="font-bold text-orange-500">Axes 01 à 22 Validés</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-64px)] sticky top-16 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
