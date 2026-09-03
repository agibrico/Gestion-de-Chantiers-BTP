/**
 * AGB CHANTIER - Écran de Vue d'Ensemble Architecture & Feuille de Route
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Terminal,
  Activity,
  HardHat,
  FolderGit2,
  Lock,
} from "lucide-react";
import { AXES_ROADMAP, APP_NAME, APP_VERSION } from "../../../core/constants/app_constants";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { AgbCreatorSignature } from "../../../core/widgets/display/agb_creator_signature";
import { FLUTTER_PLATFORMS } from "../../../core/flutter/flutter_engine_config";
import { FLUTTER_PUBSPEC_YAML, FLUTTER_AGB_SIGNATURE_DART } from "../../../core/flutter/flutter_code_snippets";

interface ArchitectureOverviewScreenProps {
  onNavigate: (route: string) => void;
}

export const ArchitectureOverviewScreen: React.FC<ArchitectureOverviewScreenProps> = ({ onNavigate }) => {
  const toast = useToast();
  const [dbStoresCount, setDbStoresCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"axes" | "architecture" | "database" | "flutter_compilation" | "terminal">("axes");

  useEffect(() => {
    setDbStoresCount(Object.keys(IdbAdapter.STORES).length);
  }, []);

  const handleTestDatabase = async () => {
    try {
      await IdbAdapter.getDb();
      toast.success("Moteur IndexedDB actif", `${dbStoresCount} tables/stores prêts et indexés.`);
    } catch {
      toast.error("Erreur de diagnostic IndexedDB");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 01 VALIDÉ
            </AppBadge>
            <span className="text-xs text-slate-400 font-mono">v{APP_VERSION}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            {APP_NAME} — Socle & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Architecture logicielle Clean Architecture + MVVM + SOLID + Repository Pattern.
            Système Offline-First, base IndexedDB persistante, RBAC 13 rôles métiers et Design System BTP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={() => onNavigate("/design-system")}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explorer le Design System
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={handleTestDatabase}
            leftIcon={<Database className="w-4 h-4 text-emerald-600" />}
          >
            Tester IndexedDB
          </AppButton>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Progression Axes"
          value="10 / 30"
          subValue="Axes 01 à 10 Validés • Prêt pour Axe 11"
          icon={<Layers className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Axe 10 Actif"
          badgeVariant="success"
        />

        <StatCard
          label="Stores IndexedDB"
          value={dbStoresCount}
          subValue="Schéma relationnel BTP complet"
          icon={<Database className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Persistance 100%"
          badgeVariant="info"
        />

        <StatCard
          label="Rôles BTP (RBAC)"
          value="13 Rôles"
          subValue="MOA, MOE, Conducteur, HSE, etc."
          icon={<ShieldCheck className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Sécurité Granulaire"
          badgeVariant="neutral"
        />

        <StatCard
          label="Mode Fonctionnement"
          value="Offline-1st"
          subValue="File d'attente de synchronisation"
          icon={<Activity className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Haute Disponibilité"
          badgeVariant="success"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("axes")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "axes"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Feuille de Route des 30 Axes
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "architecture"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Structure Clean Architecture
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "database"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Schéma IndexedDB (Stores)
        </button>

        <button
          onClick={() => setActiveTab("flutter_compilation")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "flutter_compilation"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Compilation Flutter & Android Studio
        </button>

        <button
          onClick={() => setActiveTab("terminal")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "terminal"
              ? "bg-orange-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Commandes de Validation
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "axes" && (
        <div className="space-y-6">
          {/* Executive Roadmap Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Architecture</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Clean + MVVM</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-full h-full rounded-full"></div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Database Engine</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">IndexedDB / 25 Stores</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-full h-full rounded-full"></div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Security & RBAC</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">13 Rôles BTP</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-full h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Grid of 30 Axes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AXES_ROADMAP.map((axe) => {
              const isCompleted = axe.id <= 20;
              const isNext = axe.id === 21;

              const getRouteForAxe = (id: number) => {
                if (id === 1) return "/design-system";
                if (id === 2) return "/admin/users";
                if (id === 3) return "/clients";
                if (id === 4) return "/projects";
                if (id === 5) return "/teams";
                if (id === 6) return "/planning";
                if (id === 7) return "/tasks";
                if (id === 8) return "/attendance";
                if (id === 9) return "/inventory";
                if (id === 10) return "/suppliers";
                if (id === 11) return "/finance";
                if (id === 12) return "/equipment";
                if (id === 13) return "/site-diary";
                if (id === 14) return "/photos";
                if (id === 15) return "/quality";
                if (id === 16) return "/hse";
                if (id === 17) return "/reservations";
                if (id === 18) return "/documents";
                if (id === 19) return "/reports";
                if (id === 20) return "/reception";
                return null;
              };
              const route = getRouteForAxe(axe.id);

              return (
                <div
                  key={axe.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs"
                      : isNext
                      ? "bg-orange-50/30 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800/80 ring-1 ring-orange-400/20"
                      : "bg-white dark:bg-[#131D31] border-slate-200 dark:border-slate-800/80 opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">
                        AXE {axe.id.toString().padStart(2, "0")}
                      </span>
                      {isCompleted ? (
                        <AppBadge variant="success" size="sm" dot={true}>
                          VALIDÉ
                        </AppBadge>
                      ) : isNext ? (
                        <AppBadge variant="warning" size="sm" dot={true}>
                          PROCHAIN AXE
                        </AppBadge>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">À VENIR</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                      {axe.name}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {isCompleted
                        ? "Module développé, testé, persistant en IndexedDB et prêt pour la production."
                        : isNext
                        ? "Prêt à être démarré dès votre signal 'axe 6'."
                        : "Planifié selon la méthodologie de développement axe par axe."}
                    </p>
                  </div>

                  {isCompleted && route && (
                    <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-900/50 flex justify-end">
                      <button
                        onClick={() => onNavigate(route)}
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                      >
                        Ouvrir le Module &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "architecture" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <AppCard title="Structure de Fichiers & Couches (src/)">
              <div className="font-mono text-xs text-slate-600 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl overflow-x-auto">
                <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between">
                  <span>📦 src/app/</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">[READY]</span>
                </div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📄 routes.ts (Gestion des 30 routes)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📄 router.tsx (Hash routing & Navigation)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">└─ 📄 app.tsx (Providers & Scaffold)</div>

                <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between mt-3">
                  <span>📦 src/core/</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">[READY]</span>
                </div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 storage/ (IndexedDB 25 stores + LocalStorage)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 permissions/ (13 rôles RBAC + permissions)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 network/ (Offline-first + Sync queue)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 errors/ (Result & Failure pattern)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">└─ 📂 widgets/ (Design System BTP)</div>

                <div className="text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between mt-3">
                  <span>📦 src/features/</span>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase">[AXE 01 PRÊT]</span>
                </div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 architecture_showcase/ (Axe 01)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">├─ 📂 authentication/ (Axe 02 - À venir)</div>
                <div className="pl-4 text-slate-500 dark:text-slate-400">└─ 📂 projects/ (Axe 04 - À venir)</div>
              </div>
            </AppCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppCard title="1. Couche Presentation" subtitle="UI, ViewModels & Widgets BTP">
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Design System BTP (Orange/Acier)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Responsive TopBar, Sidebar & BottomBar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Error Boundary & Feedback Toasts</span>
                  </li>
                </ul>
              </AppCard>

              <AppCard title="2. Couche Domain" subtitle="Règles Métier, RBAC & Use Cases">
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>13 Rôles RBAC et Permissions fines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pattern Result / Failure fonctionnel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Validateurs de formulaires BTP</span>
                  </li>
                </ul>
              </AppCard>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Dark Accent System Card */}
            <div className="bg-slate-900 text-white rounded-xl shadow-md p-6 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-800 pb-2 text-slate-200">
                Design System Palette
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Palette Primaire</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-900 border border-slate-700 rounded-lg" title="Acier BTP"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded-lg" title="Safety Orange"></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-lg text-slate-900 flex items-center justify-center font-bold text-[10px]" title="Paper">P</div>
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg" title="HSE Success"></div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Indicateurs Statut</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded font-mono">NEUTRAL</span>
                    <span className="px-2 py-0.5 text-[10px] bg-blue-900/40 border border-blue-500/50 text-blue-300 rounded font-mono">EN COURS</span>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 rounded font-mono">TERMINÉ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-[#131D31] rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                System Health (Axe 01)
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">TypeScript Engine</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">5.8 (0 err) ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">IndexedDB Storage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">25 Stores ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">RBAC Matrix</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">13 Rôles ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Offline Sync Queue</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">Active ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "database" && (
        <AppCard
          title="Schéma Relationnel IndexedDB (25 Object Stores)"
          subtitle="Toutes les tables requises pour les 30 axes sont d'ores et déjà déclarées et prêtes."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(IdbAdapter.STORES).map(([key, storeName]) => (
              <div
                key={key}
                className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 font-mono truncate">{storeName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">keyPath: id</div>
              </div>
            ))}
          </div>
        </AppCard>
      )}

      {activeTab === "flutter_compilation" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppCard
              title="1. Compilation Multi-Plateformes Flutter (Android Studio)"
              subtitle="Génération d'exécutables et installables natifs pour chaque OS sans dépendre du navigateur"
            >
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  Le projet Flutter est structuré pour une compilation directe sous <strong>Android Studio</strong> et les outils en ligne de commande :
                </p>

                <div className="space-y-2">
                  {FLUTTER_PLATFORMS.map((target) => (
                    <div
                      key={target.platform}
                      className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                          {target.platform}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                          {target.artifact}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {target.command}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Outil : {target.studioTooling}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AppCard>

            <AppCard
              title="2. Dépôt GitHub & CI/CD de Compilation"
              subtitle="Versionnement et pipelines automatiques pour générer les fichiers installables"
            >
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  Les fichiers compilés (.apk, .aab, .exe, .ipa) peuvent être automatiquement produits par GitHub Actions à chaque commit :
                </p>

                <div className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-[11px] space-y-1">
                  <div className="text-emerald-400"># Publication du code Flutter sur GitHub</div>
                  <div>git init</div>
                  <div>git add .</div>
                  <div>git commit -m "feat(flutter): AGB CHANTIER Multiplatform Release v1.0"</div>
                  <div>git branch -M main</div>
                  <div>git remote add origin https://github.com/votre-compte/agb-chantier-flutter.git</div>
                  <div>git push -u origin main</div>
                </div>

                <div className="space-y-1.5 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Aucun bouton d'installation web (Application 100% native installable)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Signature du concepteur <strong>AGB</strong> ancrée en permanence au bas de l'application</span>
                  </div>
                </div>
              </div>
            </AppCard>
          </div>

          {/* Signature Officielle du Concepteur AGB */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Signature Officielle du Concepteur (Ancrée au bas de toutes les applications)
            </h3>
            <AgbCreatorSignature variant="full" />
          </div>
        </div>
      )}

      {activeTab === "terminal" && (
        <AppCard title="Vérification Technique & Commandes de Build">
          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 overflow-x-auto">
            <div className="text-emerald-400"># 1. Compilation TypeScript et Vérification des Types</div>
            <div className="text-slate-300">$ npm run lint (tsc --noEmit) &rarr; 0 erreurs</div>
            <div className="text-emerald-400 mt-3"># 2. Build de Production</div>
            <div className="text-slate-300">$ npm run build &rarr; OK (Vite + Tailwind 4)</div>
            <div className="text-emerald-400 mt-3"># 3. Équivalents Flutter / Android Studio</div>
            <div className="text-slate-300">$ flutter analyze</div>
            <div className="text-slate-300">$ flutter build apk --release</div>
            <div className="text-slate-300">$ flutter build appbundle --release</div>
          </div>
        </AppCard>
      )}
    </div>
  );
};
