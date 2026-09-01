/**
 * AGB CHANTIER - Routeur Applicatif avec Gestion d'État et Navigation
 */

import React, { useState, useEffect } from "react";
import { AppScaffold } from "../core/widgets/layout/app_scaffold";
import { SplashScreen } from "../features/architecture_showcase/presentation/splash_screen";
import { ArchitectureOverviewScreen } from "../features/architecture_showcase/presentation/architecture_overview_screen";
import { DesignSystemScreen } from "../features/architecture_showcase/presentation/design_system_screen";
import { AuthPortalScreen } from "../features/auth/presentation/auth_portal_screen";
import { AdminUsersAndPermissionsScreen } from "../features/auth/presentation/admin_users_and_permissions_screen";
import { GerantDashboardScreen } from "../features/auth/presentation/gerant_dashboard_screen";
import { EmployeePortalScreen } from "../features/auth/presentation/employee_portal_screen";
import { ClientsListScreen } from "../features/clients/presentation/clients_list_screen";
import { ProjectsListScreen } from "../features/projects/presentation/projects_list_screen";
import { TeamsManagementScreen } from "../features/teams/presentation/teams_management_screen";
import { PlanningManagementScreen } from "../features/planning/presentation/planning_management_screen";
import { TasksManagementScreen } from "../features/tasks/presentation/tasks_management_screen";
import { AttendanceManagementScreen } from "../features/attendance/presentation/attendance_management_screen";
import { InventoryManagementScreen } from "../features/inventory/presentation/inventory_management_screen";
import { SuppliersManagementScreen } from "../features/suppliers/presentation/suppliers_management_screen";
import { FinanceManagementScreen } from "../features/finance/presentation/finance_management_screen";
import { EquipmentManagementScreen } from "../features/equipment/presentation/equipment_management_screen";
import { SiteDiaryScreen } from "../features/site_diary/presentation/site_diary_screen";
import { PhotosGalleryScreen } from "../features/photos/presentation/photos_gallery_screen";
import { QualityManagementScreen } from "../features/quality/presentation/quality_management_screen";
import { HseManagementScreen } from "../features/hse/presentation/hse_management_screen";
import { ReservationsManagementScreen } from "../features/reservations/presentation/reservations_management_screen";
import { DocumentsManagementScreen } from "../features/documents/presentation/documents_management_screen";
import { ReportsManagementScreen } from "../features/reports/presentation/reports_management_screen";
import { HandoverManagementScreen } from "../features/handover/presentation/handover_management_screen";
import { QrIdentificationScreen } from "../features/qr_identification/presentation/qr_identification_screen";
import { AppEmptyState } from "../core/widgets/display/app_empty_state";
import { ArrowLeft, Clock } from "lucide-react";
import { AppButton } from "../core/widgets/buttons/app_button";
import { useAuth } from "../features/auth/presentation/auth_context";

export const AppRouter: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      return window.location.hash.replace("#", "") || "/auth/login";
    }
    return "/auth/login";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "/auth/login";
      setCurrentRoute(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== "undefined") {
      window.location.hash = route;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const handleLoginSuccess = (user: any) => {
    if (user.profileCategory === "ADMINISTRATEUR") {
      navigate("/admin/users");
    } else if (user.profileCategory === "GERANT") {
      navigate("/gerant/dashboard");
    } else {
      navigate("/employee/portal");
    }
  };

  const renderRouteContent = () => {
    switch (currentRoute) {
      case "/":
      case "/auth/login":
      case "/portal":
        return <AuthPortalScreen onLoginSuccess={handleLoginSuccess} />;

      case "/admin/users":
      case "/admin/permissions":
        return <AdminUsersAndPermissionsScreen />;

      case "/gerant/dashboard":
        return <GerantDashboardScreen onNavigate={navigate} />;

      case "/employee/portal":
        return <EmployeePortalScreen onNavigate={navigate} />;

      case "/overview":
        return <ArchitectureOverviewScreen onNavigate={navigate} />;

      case "/design-system":
        return <DesignSystemScreen />;

      case "/clients":
        return <ClientsListScreen />;

      case "/projects":
        return <ProjectsListScreen />;

      case "/teams":
        return <TeamsManagementScreen />;

      case "/planning":
        return <PlanningManagementScreen />;

      case "/tasks":
        return <TasksManagementScreen />;

      case "/attendance":
        return <AttendanceManagementScreen />;

      case "/inventory":
        return <InventoryManagementScreen />;

      case "/suppliers":
        return <SuppliersManagementScreen />;

      case "/finance":
        return <FinanceManagementScreen />;

      case "/equipment":
        return <EquipmentManagementScreen />;

      case "/site-diary":
        return <SiteDiaryScreen />;

      case "/photos":
        return <PhotosGalleryScreen />;

      case "/quality":
        return <QualityManagementScreen />;

      case "/hse":
        return <HseManagementScreen />;

      case "/reservations":
        return <ReservationsManagementScreen />;

      case "/documents":
        return <DocumentsManagementScreen />;

      case "/reports":
        return <ReportsManagementScreen />;

      case "/reception":
        return <HandoverManagementScreen />;

      case "/qr-scanner":
        return <QrIdentificationScreen />;

      case "/notifications":
      case "/ai-assistant":
      case "/audit":
      case "/settings":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <AppButton
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate("/overview")}
              >
                Retour à la Vue d'Ensemble
              </AppButton>
            </div>

            <AppEmptyState
              icon={<Clock className="w-7 h-7 text-orange-600" />}
              title={`Module en attente : ${currentRoute.replace("/", "").toUpperCase()}`}
              description="Les axes 01 et 02 (Architecture & Authentification Multi-Rôles) sont validés. Ce module métier sera déployé lors de son axe respectif."
              actionLabel="Consulter la feuille de route des 30 axes"
              onAction={() => navigate("/overview")}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <AppEmptyState
              title="Page introuvable (404)"
              description="La route demandée n'existe pas ou n'est pas encore enregistrée."
              actionLabel="Retour au Portail d'Accueil"
              onAction={() => navigate("/auth/login")}
            />
          </div>
        );
    }
  };

  return (
    <AppScaffold currentRoute={currentRoute} onNavigate={navigate}>
      {renderRouteContent()}
    </AppScaffold>
  );
};
