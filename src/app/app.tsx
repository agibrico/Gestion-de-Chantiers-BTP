/**
 * AGB CHANTIER - Point d'Entrée Principal de l'Application (App Root)
 */

import React from "react";
import { ThemeProvider } from "../core/theme/theme_context";
import { ToastProvider } from "../core/widgets/feedback/app_toast";
import { ErrorBoundary } from "../core/widgets/feedback/error_boundary";
import { AuthProvider } from "../features/auth/presentation/auth_context";
import { ClientsProvider } from "../features/clients/presentation/clients_context";
import { FirstLoginModal } from "../features/auth/presentation/first_login_modal";
import { AppRouter } from "./router";

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ClientsProvider>
              <AppRouter />
              <FirstLoginModal />
            </ClientsProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
