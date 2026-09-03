/**
 * AGB CHANTIER - Système de Notifications Toast Global
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, durationMs?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string, durationMs = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message, durationMs };

    setToasts((prev) => [...prev, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast("success", title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast("error", title, message, 6000), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast("warning", title, message, 5000), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast("info", title, message), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-900/95 text-white border-emerald-700"
                : toast.type === "error"
                ? "bg-rose-900/95 text-white border-rose-700"
                : toast.type === "warning"
                ? "bg-amber-900/95 text-white border-amber-700"
                : "bg-slate-900/95 text-white border-slate-700"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-300" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-300" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-sky-300" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs text-slate-200 mt-1 leading-normal">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé au sein d'un ToastProvider");
  }
  return context;
};
