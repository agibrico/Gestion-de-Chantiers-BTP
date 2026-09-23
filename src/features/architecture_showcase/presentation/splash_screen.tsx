/**
 * AGB CHANTIER - Écran de Démarrage / Splash Screen Professionnel
 */

import React, { useEffect, useState } from "react";
import { HardHat, CheckCircle2, Database, ShieldCheck, Wifi } from "lucide-react";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "../../../core/constants/app_constants";
import { DatabaseService } from "../../../core/storage/db_service";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<string>("Initialisation du moteur BTP...");
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        if (isMounted) {
          setProgress(25);
          setStep("Vérification de la base de données locale (IndexedDB)...");
        }
        await DatabaseService.initialize();
        await new Promise((r) => setTimeout(r, 200));

        if (isMounted) {
          setProgress(60);
          setStep("Chargement du Design System & Permissions RBAC...");
        }
        await new Promise((r) => setTimeout(r, 200));

        if (isMounted) {
          setProgress(90);
          setStep("Synchronisation de l'environnement prêt.");
        }
        await new Promise((r) => setTimeout(r, 150));

        if (isMounted) {
          setProgress(100);
          setTimeout(() => {
            onComplete();
          }, 200);
        }
      } catch (e) {
        console.error("Erreur init splash:", e);
        if (isMounted) onComplete();
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col items-center justify-between p-8 select-none">
      <div />

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/30 border border-orange-500/30 animate-pulse">
          <HardHat className="w-11 h-11 text-white" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center justify-center gap-2">
            <span>AGB</span>
            <span className="text-orange-500">CHANTIER</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">{APP_TAGLINE}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="bg-orange-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{step}</span>
            <span className="font-mono text-orange-400">{progress}%</span>
          </div>
        </div>

        {/* System Checklist */}
        <div className="grid grid-cols-3 gap-2 w-full pt-4 text-[10px] text-slate-400">
          <div className="flex items-center justify-center gap-1 bg-slate-800/60 p-2 rounded-lg border border-slate-800">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>IndexedDB</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-slate-800/60 p-2 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>RBAC Pro</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-slate-800/60 p-2 rounded-lg border border-slate-800">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span>Offline-1st</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-500 space-y-1">
        <p>
          {APP_NAME} • Version {APP_VERSION}
        </p>
        <p className="text-slate-600">Clean Architecture • BTP Mobile & Tablette</p>
      </div>
    </div>
  );
};
