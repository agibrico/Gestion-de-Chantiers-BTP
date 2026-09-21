/**
 * AGB CHANTIER - Écran Informatif pour Module / Fonctionnalité Désactivée
 * Présente un message clair et un bouton en 1 clic pour réactiver l'option masquée.
 */

import React from "react";
import { SlidersHorizontal, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useFeatures } from "../feature_toggle_context";
import { ALL_FEATURES } from "../feature_registry";

interface DeactivatedFeatureNoticeProps {
  route: string;
  onNavigate?: (route: string) => void;
}

export const DeactivatedFeatureNotice: React.FC<DeactivatedFeatureNoticeProps> = ({
  route,
  onNavigate,
}) => {
  const { enableFeature, openCustomizer } = useFeatures();

  const feature = ALL_FEATURES.find((f) => f.route === route);

  const handleReactivate = () => {
    if (feature) {
      enableFeature(feature.id);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
        <SlidersHorizontal className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Option non affichée dans votre espace
      </h2>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
        {feature ? (
          <>
            Le module <strong className="text-slate-800 dark:text-slate-200">{feature.name}</strong> a été
            retiré de votre application selon vos choix de personnalisation actuels.
          </>
        ) : (
          "Cette fonctionnalité est actuellement masquée selon les options choisies pour votre espace de travail."
        )}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {feature && (
          <button
            onClick={handleReactivate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Activer et afficher cette fonction</span>
          </button>
        )}

        <button
          onClick={() => openCustomizer("categories")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Gérer toutes mes options</span>
        </button>

        {onNavigate && (
          <button
            onClick={() => onNavigate("/projects")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux chantiers</span>
          </button>
        )}
      </div>
    </div>
  );
};
