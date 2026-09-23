/**
 * AGB CHANTIER - Gestionnaire de Raccourcis Clavier Globaux
 * Permet la navigation instantanée au clavier (Ctrl+D pour Dashboard, Ctrl+P pour Portail, etc.)
 * et propose une aide contextuelle accessible via '?' ou l'en-tête.
 */

import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import {
  Keyboard,
  LayoutDashboard,
  Layers,
  Download,
  Search,
  Laptop,
  HelpCircle,
  X,
  Command,
} from "lucide-react";

export interface ShortcutDefinition {
  id: string;
  keys: string[];
  label: string;
  description: string;
  category: "Navigation" | "Actions" | "Système";
  action: () => void;
}

interface KeyboardShortcutsContextType {
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;
  isShortcutsModalOpen: boolean;
  registerShortcut: (shortcut: ShortcutDefinition) => () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export const KeyboardShortcutsProvider: React.FC<{
  activeView: "dashboard" | "portal";
  setActiveView: (view: "dashboard" | "portal") => void;
  onExportCsv?: () => void;
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
  children: React.ReactNode;
}> = ({
  activeView,
  setActiveView,
  onExportCsv,
  onToggleTheme,
  onOpenSearch,
  children,
}) => {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [extraShortcuts, setExtraShortcuts] = useState<ShortcutDefinition[]>([]);

  const openShortcutsModal = useCallback(() => setIsShortcutsModalOpen(true), []);
  const closeShortcutsModal = useCallback(() => setIsShortcutsModalOpen(false), []);

  const registerShortcut = useCallback((shortcut: ShortcutDefinition) => {
    setExtraShortcuts((prev) => [...prev.filter((s) => s.id !== shortcut.id), shortcut]);
    return () => {
      setExtraShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
    };
  }, []);

  // Écouteur global sur window.keydown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur est en train de taper dans un champ de formulaire ou un éditeur
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        // Exception : laisser passer Echap pour fermer les modales
        if (e.key === "Escape" && isShortcutsModalOpen) {
          e.preventDefault();
          setIsShortcutsModalOpen(false);
        }
        return;
      }

      const isModifier = e.ctrlKey || e.metaKey;

      // 1. Ctrl+D / Cmd+D : Basculer vers le Tableau de Bord
      if (isModifier && e.key.toLowerCase() === "d") {
        e.preventDefault();
        e.stopPropagation();
        setActiveView("dashboard");
        return;
      }

      // 2. Ctrl+P / Cmd+P : Basculer vers le Portail Entreprise
      if (isModifier && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
        setActiveView("portal");
        return;
      }

      // 3. Ctrl+E / Cmd+E : Exporter les données CSV
      if (isModifier && e.key.toLowerCase() === "e" && onExportCsv) {
        e.preventDefault();
        e.stopPropagation();
        onExportCsv();
        return;
      }

      // 4. Ctrl+K / Cmd+K : Recherche Globale
      if (isModifier && e.key.toLowerCase() === "k" && onOpenSearch) {
        e.preventDefault();
        e.stopPropagation();
        onOpenSearch();
        return;
      }

      // 5. Touche '?' ou 'Shift+/' : Ouvrir l'aide des raccourcis
      if (!isModifier && e.key === "?" && !isShortcutsModalOpen) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      // 6. Echap : Fermer la modale si ouverte
      if (e.key === "Escape" && isShortcutsModalOpen) {
        e.preventDefault();
        setIsShortcutsModalOpen(false);
        return;
      }

      // 7. Raccourcis dynamiques additionnels
      for (const shortcut of extraShortcuts) {
        // Exécuter si correspondance
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, setActiveView, onExportCsv, onOpenSearch, isShortcutsModalOpen, extraShortcuts]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        openShortcutsModal,
        closeShortcutsModal,
        isShortcutsModalOpen,
        registerShortcut,
      }}
    >
      {children}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={closeShortcutsModal}
        activeView={activeView}
        setActiveView={setActiveView}
      />
    </KeyboardShortcutsContext.Provider>
  );
};

export const useKeyboardShortcuts = (): KeyboardShortcutsContextType => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error("useKeyboardShortcuts doit être utilisé à l'intérieur d'un KeyboardShortcutsProvider");
  }
  return context;
};

/**
 * Modale d'aide affichant la liste complète des raccourcis clavier
 */
export const KeyboardShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activeView: "dashboard" | "portal";
  setActiveView: (view: "dashboard" | "portal") => void;
}> = ({ isOpen, onClose, activeView, setActiveView }) => {
  if (!isOpen) return null;

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";

  const shortcutsList = [
    {
      category: "Navigation Rapide",
      items: [
        {
          keys: [modKey, "D"],
          label: "Tableau de Bord",
          description: "Afficher immédiatement les indicateurs clés et chantiers",
          badge: activeView === "dashboard" ? "Actif" : undefined,
          action: () => {
            setActiveView("dashboard");
            onClose();
          },
        },
        {
          keys: [modKey, "P"],
          label: "Portail Entreprise",
          description: "Accéder à l'ensemble des modules BTP (Planning, Finance, HSE...)",
          badge: activeView === "portal" ? "Actif" : undefined,
          action: () => {
            setActiveView("portal");
            onClose();
          },
        },
        {
          keys: [modKey, "K"],
          label: "Recherche Rapide",
          description: "Ouvrir la palette de recherche par chantier, code ou intervenant",
        },
      ],
    },
    {
      category: "Actions & Reporting BTP",
      items: [
        {
          keys: [modKey, "E"],
          label: "Export CSV Chantier",
          description: "Générer et télécharger instantanément la synthèse BTP complète",
        },
        {
          keys: ["?"],
          label: "Guide des Raccourcis",
          description: "Ouvrir cette fenêtre d'aide à tout moment",
        },
        {
          keys: ["Échap"],
          label: "Fermer les Fenêtres",
          description: "Quitter les modales ou tiroirs latéraux ouverts",
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Raccourcis Clavier AGB CHANTIER
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Navigation rapide et actions prioritaires de supervision BTP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {shortcutsList.map((cat, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {cat.category}
              </h4>
              <div className="space-y-1.5">
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    onClick={item.action}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      item.action ? "cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-950/20" : ""
                    } ${
                      item.badge
                        ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/60"
                        : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 text-[11px] font-mono font-bold rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pied de page */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Astuce : Appuyez sur <kbd className="font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">?</kbd> à tout moment pour rouvrir ce guide.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
