/**
 * AGB CHANTIER - Barre de Recherche Globale & Command Palette (Ctrl+K / ⌘K)
 * Permet de retrouver instantanément des documents, des incidents HSE, des tâches, des intervenants ou des réserves.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  AlertTriangle,
  CheckSquare,
  Users,
  HardHat,
  FileCheck,
  Wrench,
  ArrowRight,
  CornerDownLeft,
  X,
  Clock,
  Sparkles,
  Command,
} from "lucide-react";
import { AppBadge } from "../badges/app_badge";

export interface GlobalSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "DOCUMENT" | "INCIDENT" | "TASK" | "STAKEHOLDER" | "RESERVATION" | "EQUIPMENT";
  categoryLabel: string;
  badge: string;
  route: string;
  project?: string;
  tags?: string[];
}

const GLOBAL_SEARCH_DATABASE: GlobalSearchItem[] = [
  // Documents
  {
    id: "doc-01",
    title: "Plan de Ferraillage Plancher Haut R+2 (BA-EXE-04)",
    subtitle: "Plan BPE validé SOCOTEC • Indice C • Tour Postel 2001",
    category: "DOCUMENT",
    categoryLabel: "Documents & Plans",
    badge: "BPE VALIDÉ",
    route: "/documents",
    project: "Tour Postel 2001",
    tags: ["plan", "ferraillage", "bpe", "structure", "bet"],
  },
  {
    id: "doc-02",
    title: "CCTP Lot Électricité Courants Forts & Faibles",
    subtitle: "Cahier des charges techniques particulières • Marché AGB",
    category: "DOCUMENT",
    categoryLabel: "Documents & Plans",
    badge: "MARCHÉ",
    route: "/documents",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["cctp", "electricite", "cfo", "cfa", "marche"],
  },
  {
    id: "doc-03",
    title: "Fiche d'Agrément Technique Béton B25 Lafarge",
    subtitle: "Formulation béton de structure avec adjuvants plastifiants",
    category: "DOCUMENT",
    categoryLabel: "Documents & Plans",
    badge: "AGRÉÉ",
    route: "/documents",
    project: "Hangar Logistique San-Pédro",
    tags: ["fiche", "beton", "b25", "lafarge", "agrement"],
  },
  {
    id: "doc-04",
    title: "Procès-Verbal de Réception Technique Câblage Réseau",
    subtitle: "PV contradictoire avec bureau d'études et MOA",
    category: "DOCUMENT",
    categoryLabel: "Documents & Plans",
    badge: "PV SIGNE",
    route: "/reception",
    project: "Tour Postel 2001",
    tags: ["pv", "reception", "reseau", "moa"],
  },

  // Incidents HSE
  {
    id: "inc-01",
    title: "Chute de hauteur depuis échafaudage R+2",
    subtitle: "Accident avec arrêt de travail • Enquête SST et déclaration CNPS",
    category: "INCIDENT",
    categoryLabel: "Incidents & Sécurité HSE",
    badge: "ACCIDENT GRAVE",
    route: "/hse",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["accident", "chute", "echafaudage", "arret", "sst", "cnps"],
  },
  {
    id: "inc-02",
    title: "Coupure profonde à la main lors du ligaturage d'armatures",
    subtitle: "Intervention secouriste de chantier • Gants anti-coupure requis",
    category: "INCIDENT",
    categoryLabel: "Incidents & Sécurité HSE",
    badge: "SOINS SUR SITE",
    route: "/hse",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["coupure", "main", "armatures", "soins", "gants", "epi"],
  },
  {
    id: "inc-03",
    title: "Glissade sur nappe d'eau résiduelle décoffrage",
    subtitle: "Entorse bénigne cheville • Zone sécurisée et évacuée",
    category: "INCIDENT",
    categoryLabel: "Incidents & Sécurité HSE",
    badge: "BENIN",
    route: "/hse",
    project: "Tour Postel 2001",
    tags: ["glissade", "entorse", "decoffrage", "eau"],
  },
  {
    id: "inc-04",
    title: "Presqu'accident : Rupture d'élingue de grue à vide",
    subtitle: "Arrêt immédiat de la grue et remplacement de l'accessoire de levage",
    category: "INCIDENT",
    categoryLabel: "Incidents & Sécurité HSE",
    badge: "PRESQU'ACCIDENT",
    route: "/hse",
    project: "Tour Postel 2001",
    tags: ["grue", "elingue", "levage", "presqu'accident", "panne"],
  },
  {
    id: "inc-05",
    title: "Non-respect du port des EPI en zone de circulation engins",
    subtitle: "Rappel formel à l'ordre du chef d'équipe sous-traitant",
    category: "INCIDENT",
    categoryLabel: "Incidents & Sécurité HSE",
    badge: "RAPPEL SÉCURITÉ",
    route: "/hse",
    project: "Hangar Logistique San-Pédro",
    tags: ["epi", "casque", "gilet", "engins", "securite"],
  },

  // Tâches & Travaux
  {
    id: "task-01",
    title: "Coulage du voile béton armé V12 Bâtiment B",
    subtitle: "Volume 35 m³ • Toupie Lafarge B25 • Arrêt momentané pour calage",
    category: "TASK",
    categoryLabel: "Travaux & Tâches",
    badge: "EN COURS",
    route: "/tasks",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["coulage", "voile", "beton", "v12", "toupie"],
  },
  {
    id: "task-02",
    title: "Ferraillage des semelles filantes et longrines Axe 3",
    subtitle: "Acier FeE500 HA 12 et HA 16 • Contrôle d'enrobage préalable",
    category: "TASK",
    categoryLabel: "Travaux & Tâches",
    badge: "À CONTRÔLER",
    route: "/tasks",
    project: "Hangar Logistique San-Pédro",
    tags: ["ferraillage", "semelles", "longrines", "aciers", "armatures"],
  },
  {
    id: "task-03",
    title: "Pose des colonnes de gaines techniques CFO/CFA",
    subtitle: "Chemins de câbles galvanisés en gaine technique RDC à R+4",
    category: "TASK",
    categoryLabel: "Travaux & Tâches",
    badge: "PLANIFIÉ",
    route: "/tasks",
    project: "Tour Postel 2001",
    tags: ["pose", "gaines", "electricite", "cables", "cfo"],
  },
  {
    id: "task-04",
    title: "Terrassement et compactage plateforme grue à tour",
    subtitle: "Essai à la plaque Westergaard > 50 MPa • Validation LBTP",
    category: "TASK",
    categoryLabel: "Travaux & Tâches",
    badge: "TERMINÉ",
    route: "/tasks",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["terrassement", "compactage", "grue", "fondations", "lbtp"],
  },
  {
    id: "task-05",
    title: "Pose de la chape de ravoirage et carrelage 60x60",
    subtitle: "Bâtiment A logements témoins • Réception d'aspect requise",
    category: "TASK",
    categoryLabel: "Travaux & Tâches",
    badge: "EN COURS",
    route: "/tasks",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["chape", "carrelage", "finition", "sol"],
  },

  // Intervenants & Sous-traitants
  {
    id: "stk-01",
    title: "SOCOTEC Côte d'Ivoire (Bureau de Contrôle)",
    subtitle: "Contrôle technique solidité L et sécurité incendie S • Tél: +225 27 20 22 14",
    category: "STAKEHOLDER",
    categoryLabel: "Intervenants & Sous-traitants",
    badge: "AGRÉÉ AGB",
    route: "/intervenants",
    project: "Tous Chantiers",
    tags: ["socotec", "controle", "bureau", "securite", "solidite"],
  },
  {
    id: "stk-02",
    title: "COTELEC BTP (Sous-traitant Électricité Générale)",
    subtitle: "Sous-traitance Courants Forts/Faibles • 18 techniciens sur site",
    category: "STAKEHOLDER",
    categoryLabel: "Intervenants & Sous-traitants",
    badge: "SOUS-TRAITANT",
    route: "/intervenants",
    project: "Tour Postel 2001",
    tags: ["cotelec", "electricite", "sous-traitant", "personnel", "equipe"],
  },
  {
    id: "stk-03",
    title: "BâtiTech Ingénierie (Bureau d'Études Structure BA)",
    subtitle: "Calculs Eurocodes 2 & Plans d'exécution béton armé",
    category: "STAKEHOLDER",
    categoryLabel: "Intervenants & Sous-traitants",
    badge: "BET STRUCTURE",
    route: "/intervenants",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["batitech", "bet", "bureau", "etudes", "structure", "ingenieur"],
  },
  {
    id: "stk-04",
    title: "LBTP (Laboratoire du Bâtiment & Travaux Publics)",
    subtitle: "Contrôle des éprouvettes béton, carottages et sols",
    category: "STAKEHOLDER",
    categoryLabel: "Intervenants & Sous-traitants",
    badge: "LABO OFFICIEL",
    route: "/intervenants",
    project: "Tous Chantiers",
    tags: ["lbtp", "laboratoire", "essais", "eprouvettes", "beton"],
  },

  // Réserves & Non-conformités
  {
    id: "res-01",
    title: "Non-conformité enrobage armatures voiles porteurs V12",
    subtitle: "Écart constaté par SOCOTEC : enrobage < 25mm • Cales manquantes",
    category: "RESERVATION",
    categoryLabel: "Qualité & Réserves OPR",
    badge: "MAJEURE",
    route: "/quality",
    project: "Tour Postel 2001",
    tags: ["non-conformite", "enrobage", "voiles", "socotec", "qualite"],
  },
  {
    id: "res-02",
    title: "Réserve OPR : Fuite étanchéité raccord réseau RIA sous-sol",
    subtitle: "Épreuve de pression d'eau défavorable • Remplacement joint bride",
    category: "RESERVATION",
    categoryLabel: "Qualité & Réserves OPR",
    badge: "BLOQUANTE",
    route: "/reservations",
    project: "Hangar Logistique San-Pédro",
    tags: ["reserve", "opr", "fuite", "ria", "incendie", "sous-sol"],
  },

  // Équipements
  {
    id: "eq-01",
    title: "Grue à Tour Potain MDT 178 (45m flèche)",
    subtitle: "Levage principal • VGP trimestrielle à jour • Grutier qualifié",
    category: "EQUIPMENT",
    categoryLabel: "Engins & Équipements",
    badge: "EN SERVICE",
    route: "/equipment",
    project: "Résidence Les Perles d'Abidjan",
    tags: ["grue", "potain", "engin", "levage", "materiel"],
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredItems = GLOBAL_SEARCH_DATABASE.filter((item) => {
    if (activeCategory !== "ALL" && item.category !== activeCategory) {
      return false;
    }
    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesSubtitle = item.subtitle.toLowerCase().includes(q);
    const matchesProject = item.project?.toLowerCase().includes(q);
    const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesTitle || matchesSubtitle || matchesProject || matchesTags;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelectItem = (item: GlobalSearchItem) => {
    onNavigate(item.route);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DOCUMENT":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "INCIDENT":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "TASK":
        return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case "STAKEHOLDER":
        return <Users className="w-4 h-4 text-orange-500" />;
      case "RESERVATION":
        return <FileCheck className="w-4 h-4 text-amber-500" />;
      case "EQUIPMENT":
        return <Wrench className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher documents, incidents HSE, tâches, intervenants..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Category Pills Filter */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-50/40 dark:bg-slate-900/30">
          <button
            onClick={() => {
              setActiveCategory("ALL");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === "ALL"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            }`}
          >
            Tous les modules
          </button>
          <button
            onClick={() => {
              setActiveCategory("DOCUMENT");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === "DOCUMENT"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Documents
          </button>
          <button
            onClick={() => {
              setActiveCategory("INCIDENT");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === "INCIDENT"
                ? "bg-red-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Incidents HSE
          </button>
          <button
            onClick={() => {
              setActiveCategory("TASK");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === "TASK"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            Tâches
          </button>
          <button
            onClick={() => {
              setActiveCategory("STAKEHOLDER");
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === "STAKEHOLDER"
                ? "bg-purple-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Intervenants
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Aucun résultat trouvé pour "{query}"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Essayez avec d'autres termes comme : <em>plan, coulage, socotec, ferraillage, chute, grue...</em>
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.badge}
                        </span>
                        {item.project && (
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium truncate">
                            • {item.project}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold truncate ${
                          isSelected
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 ${
                        isSelected
                          ? "bg-orange-600 text-white"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      Ouvrir
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">
                ↓
              </kbd>
              Naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">
                ↵
              </kbd>
              Sélectionner
            </span>
          </div>

          <span className="font-mono text-[11px] text-slate-400">
            {filteredItems.length} élément{filteredItems.length > 1 ? "s" : ""} indexé{filteredItems.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
