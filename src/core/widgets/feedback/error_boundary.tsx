/**
 * AGB CHANTIER - Composant Error Boundary Global
 */

import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { AppButton } from "../buttons/app_button";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[AGB CHANTIER ERROR BOUNDARY]", error, errorInfo);
  }

  private handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B1120]">
          <div className="max-w-md w-full bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-5">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {this.props.fallbackTitle || "Une interruption est survenue"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                L'application a rencontré un comportement inattendu. Vos données locales sont sécurisées.
              </p>
              {this.state.error && (
                <div className="text-[11px] font-mono text-left bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-slate-700 dark:text-slate-300 overflow-x-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <AppButton
              variant="primary"
              onClick={this.handleReload}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              fullWidth
            >
              Recharger l'application
            </AppButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
