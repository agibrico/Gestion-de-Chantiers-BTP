/**
 * AGB CHANTIER - Pied de Page Permanent & Marque AGB (App Footer)
 * Affichage obligatoire et exclusif du logo officiel AGB en dessous,
 * sans bouton d'installation, avec statut multi-plateformes Flutter et dépôt GitHub.
 */

import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Github,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { AgbCreatorSignature } from "../display/agb_creator_signature";
import { AppDialog } from "../feedback/app_dialog";
import { AppButton } from "../buttons/app_button";
import { APP_VERSION } from "../../constants/app_constants";

export const AppFooter: React.FC = () => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  return (
    <>
      <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto select-none">
        {/* Main Footer Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Top Row: App Title & Platforms */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            {/* Zone 1: App Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md border border-orange-500/40 tracking-tight shrink-0">
                AGB
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm tracking-tight uppercase">
                    AGB CHANTIER
                  </span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    SaaS BTP Multi-Plateformes
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Application Multi-Plateforme Flutter • Compilable sous Android Studio
                </p>
              </div>
            </div>

            {/* Zone 2: Support Multi-Plateformes & GitHub */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span>Android (APK/AAB) & iOS (IPA)</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300">
                <Laptop className="w-3.5 h-3.5 text-sky-400" />
                <span>Windows (.exe) & macOS & Linux</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300">
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span className="font-mono text-[11px]">GitHub Source</span>
              </div>
            </div>
          </div>

          {/* Mandatory Creator Signature Zone (Affichage obligatoire du logo créateur AGB en dessous de toutes les applications) */}
          <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Graphic Signature Block */}
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Visual AGB Circuit Logo */}
                <div className="w-24 h-12 flex items-center justify-center shrink-0">
                  <img
                    src="/agb_signature.svg"
                    alt="Logo Concepteur AGB"
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-black tracking-tight text-white uppercase">
                      CONCEPTEUR D'APPLICATIONS MOBILES ET SOLUTIONS WEB SUR MESURE
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-300">
                    <a
                      href="mailto:atsegillesbrice@gmail.com"
                      className="text-sky-400 hover:text-sky-300 hover:underline font-medium"
                    >
                      atsegillesbrice@gmail.com
                    </a>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="font-mono text-slate-300 font-semibold">
                      0104818092 / 0797709693
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Open Creator Signature Card */}
              <div className="shrink-0">
                <button
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>Détails Concepteur</span>
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Micro-Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AGB CHANTIER SaaS • Architecture Flutter & Compilation Multi-Plateformes</span>
            </div>
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} AGB Groupe</span>
              <span className="font-mono text-slate-400">v{APP_VERSION}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Signature Complète du Concepteur AGB */}
      <AppDialog
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        title="Signature Officielle du Concepteur AGB"
        subtitle="Développement d'applications mobiles & solutions web professionnelles"
        footer={
          <AppButton variant="primary" onClick={() => setIsSignatureModalOpen(false)}>
            Fermer
          </AppButton>
        }
      >
        <div className="space-y-4">
          <AgbCreatorSignature variant="full" />
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Cette signature atteste de l'ingénierie et de la conception logicielle sur mesure par le Concepteur AGB.
          </p>
        </div>
      </AppDialog>
    </>
  );
};
