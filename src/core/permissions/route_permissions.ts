import { AppPermission as P } from "./permissions";
/** Required read permissions. Server-side enforcement remains required. */
export const ROUTE_PERMISSIONS: Record<string, P[]> = {
  "/admin/users": [P.USERS_MANAGE], "/admin/permissions": [P.USERS_MANAGE],
  "/gerant/dashboard": [P.PROJECT_VIEW, P.FINANCE_VIEW],
  "/clients": [P.CLIENT_VIEW], "/projects": [P.PROJECT_VIEW],
  "/teams": [P.USERS_MANAGE], "/intervenants": [P.USERS_MANAGE],
  "/planning": [P.PLANNING_VIEW], "/tasks": [P.PLANNING_VIEW],
  "/attendance": [P.ATTENDANCE_VIEW], "/inventory": [P.STOCK_VIEW],
  "/suppliers": [P.STOCK_VIEW], "/finance": [P.FINANCE_VIEW],
  "/equipment": [P.PROJECT_VIEW], "/site-diary": [P.SITE_DIARY_VIEW],
  "/photos": [P.DOCUMENT_VIEW], "/quality": [P.QUALITY_VIEW], "/hse": [P.HSE_VIEW],
  "/reservations": [P.QUALITY_VIEW], "/documents": [P.DOCUMENT_VIEW],
  "/reports": [P.REPORT_GENERATE], "/reception": [P.QUALITY_VIEW],
  "/analytics": [P.PROJECT_VIEW, P.FINANCE_VIEW], "/dashboard-d3": [P.PROJECT_VIEW, P.FINANCE_VIEW],
  "/settings": [P.SETTINGS_MANAGE], "/audit": [P.AUDIT_VIEW],
};
