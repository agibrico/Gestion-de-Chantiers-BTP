/**
 * AGB CHANTIER - Écran d'Identification par QR Code - AXE 21
 */

import React, { useState } from "react";
import { QrScanner } from "../../../core/widgets/display/qr_scanner";
import {
  QrIdentificationController,
  IdentificationResult
} from "./qr_identification_controller";
import {
  QrCode,
  Search,
  ArrowLeft,
  Package,
  Truck,
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
  Fuel,
  Activity,
  User,
  ExternalLink
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";

export const QrIdentificationScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanSuccess = async (code: string) => {
    setIsScanning(false);
    setIsLoading(true);
    setError(null);
    try {
      const identification = await QrIdentificationController.identify(code);
      setResult(identification);
    } catch (e) {
      setError("Erreur lors de l'identification de l'élément.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20 rotate-3">
            <QrCode className="w-10 h-10 text-white" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <AppBadge variant="warning" dot={true}>AXE 21 DÉPLOYÉ</AppBadge>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Digital Site ID</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              Identification QR Code
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              Scannez les étiquettes AGB sur vos matériaux et engins pour accéder instantanément à la traçabilité complète, au stock en temps réel et au statut de maintenance.
            </p>
          </div>

          <div className="shrink-0">
            <AppButton
              variant="primary"
              size="lg"
              className="px-8 rounded-2xl shadow-xl shadow-orange-600/20"
              leftIcon={<QrCode className="w-5 h-5" />}
              onClick={() => setIsScanning(true)}
            >
              Lancer le Scanner
            </AppButton>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Result or Empty */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !isLoading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Prêt pour l'identification</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Appuyez sur le bouton "Lancer le Scanner" pour capturer un code QR AGB.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-slate-600 uppercase text-xs tracking-widest">Recherche en cours...</p>
            </div>
          )}

          {result?.type === "MATERIAU" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Fiche Matériau Identifiée</h2>
                    <p className="text-xs text-blue-600 font-bold font-mono">{result.data.code}</p>
                  </div>
                </div>
                <AppBadge variant="info">STOCK DÉPÔT</AppBadge>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{result.data.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        {result.data.primaryStorageLocation}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-600" />
                        Dernière entrée : {result.data.lastRestockedDate || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Stock Actuel</span>
                      <span className={`text-3xl font-black font-mono ${result.data.isBelowAlertThreshold ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                        {result.data.currentStock}
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-2 uppercase">{result.data.unit}</span>
                    </div>
                    {result.data.isBelowAlertThreshold && (
                      <AppBadge variant="danger">ALERTE RUPTURE</AppBadge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Prix Unitaire</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatFCFA(result.data.unitPurchasePriceFCFA)}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Valeur Totale</span>
                    <span className="font-mono font-bold text-emerald-600">{formatFCFA(result.data.totalStockValueFCFA)}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Seuil Alerte</span>
                    <span className="font-mono font-bold text-orange-600">{result.data.minStockAlert}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Stock Optimal</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{result.data.optimalStock}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result?.type === "ENGIN" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-600 rounded-xl text-white">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Fiche Engin Identifiée</h2>
                    <p className="text-xs text-orange-600 font-bold font-mono">{result.data.code}</p>
                  </div>
                </div>
                <AppBadge variant={result.data.status === 'EN_SERVICE_CHANTIER' ? 'success' : 'warning'}>
                  {result.data.status.replace(/_/g, ' ')}
                </AppBadge>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">{result.data.brand} {result.data.model}</h3>
                      <p className="text-sm font-bold text-slate-500">{result.data.name}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        {result.data.currentProjectName || "Dépôt Central AGB"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-orange-600" />
                        Opérateur : {result.data.assignedOperator || "Non assigné"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex items-center gap-6 min-w-[200px]">
                    <div className="text-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase block">Horamètre</span>
                      <span className="text-xl font-black font-mono">{result.data.hourMeterCurrent} h</span>
                    </div>
                    <div className="w-px h-10 bg-slate-800"></div>
                    <div className="text-center">
                      <Fuel className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                      <span className="text-[8px] font-bold text-slate-500 uppercase block">Conso</span>
                      <span className="text-xl font-black font-mono">{result.data.fuelConsumptionAvgLitrePerHour} L/h</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Prochaine Maintenance</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {result.data.nextMaintenanceHourMeter ? `${result.data.nextMaintenanceHourMeter} h` : "Non planifiée"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Dernière Révision</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{result.data.lastMaintenanceDate || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result?.type === "INCONNU" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in shake duration-500">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Code Inconnu : {result.code}</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Ce code QR ne correspond à aucun matériau ou engin référencé dans la base de données AGB CHANTIER.
              </p>
              <AppButton variant="outline" onClick={() => setIsScanning(true)}>
                Réessayer le Scan
              </AppButton>
            </div>
          )}

          {error && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-6 rounded-3xl flex items-center gap-4">
               <AlertCircle className="w-6 h-6 text-red-600" />
               <p className="text-red-700 dark:text-red-400 text-sm font-bold">{error}</p>
             </div>
          )}
        </div>

        {/* Right Column: Tips & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-600"></div>
              Guide d'Identification
            </h3>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-black text-xs">01</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nettoyez l'objectif de votre caméra pour une lecture optimale sur le terrain.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-black text-xs">02</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Cadrez le code QR au centre de la zone de scan pointillée.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-black text-xs">03</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Les étiquettes doivent être propres et non déchirées pour être reconnues.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-600/20 space-y-4">
             <div className="flex items-center justify-between">
                <Truck className="w-8 h-8 opacity-50" />
                <Package className="w-8 h-8 opacity-50" />
             </div>
             <h4 className="font-black uppercase italic tracking-tighter">Générer des Étiquettes ?</h4>
             <p className="text-xs text-orange-100 leading-relaxed">
               Vous pouvez générer et imprimer les étiquettes QR directement depuis le catalogue des Matériaux (Axe 09) ou des Engins (Axe 12).
             </p>
             <AppButton variant="secondary" size="sm" fullWidth className="bg-white text-orange-600 border-none">
               Voir le Catalogue
             </AppButton>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal Overlay */}
      {isScanning && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  );
};
