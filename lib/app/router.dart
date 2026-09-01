import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../features/authentication/presentation/bloc/auth_bloc.dart';
import '../features/authentication/presentation/bloc/auth_state.dart';
import '../features/authentication/presentation/bloc/auth_event.dart';
import '../features/authentication/presentation/screens/login_screen.dart';
import '../features/clients/presentation/bloc/client_bloc.dart';
import '../features/clients/presentation/screens/add_client_screen.dart';
import '../features/clients/presentation/screens/client_list_screen.dart';
import '../features/projects/presentation/bloc/project_bloc.dart';
import '../features/projects/presentation/screens/add_project_screen.dart';
import '../features/projects/presentation/screens/project_list_screen.dart';
import '../features/resources/presentation/bloc/resource_bloc.dart';
import '../features/resources/presentation/screens/employee_list_screen.dart';
import '../features/resources/presentation/screens/team_management_screen.dart';
import '../features/resources/presentation/screens/equipment_list_screen.dart';
import '../features/resources/presentation/screens/attendance_screen.dart';
import '../features/inventory/presentation/screens/material_list_screen.dart';
import '../features/purchases/presentation/bloc/purchase_bloc.dart';
import '../features/purchases/presentation/screens/purchase_order_screen.dart';
import '../features/purchases/presentation/screens/supplier_list_screen.dart';
import '../features/finance/presentation/bloc/finance_bloc.dart';
import '../features/finance/presentation/screens/budget_overview_screen.dart';
import '../features/site_diary/presentation/bloc/site_diary_bloc.dart';
import '../features/site_diary/presentation/screens/site_diary_form_screen.dart';
import '../features/site_diary/presentation/screens/site_diary_list_screen.dart';
import '../features/handover/presentation/bloc/handover_bloc.dart';
import '../features/handover/presentation/screens/handover_management_screen.dart';
import '../features/handover/presentation/screens/handover_form_screen.dart';
import '../features/photos/presentation/bloc/photo_bloc.dart';
import '../features/photos/presentation/screens/camera_capture_screen.dart';
import '../features/photos/presentation/screens/photo_gallery_screen.dart';
import '../features/quality/presentation/bloc/quality_bloc.dart';
import '../features/quality/presentation/bloc/snag_bloc.dart';
import '../features/quality/presentation/screens/inspection_form_screen.dart';
import '../features/quality/presentation/screens/inspection_list_screen.dart';
import '../features/quality/presentation/screens/add_snag_screen.dart';
import '../features/quality/presentation/screens/snag_list_screen.dart';
import '../features/hse/presentation/bloc/hse_bloc.dart';
import '../features/hse/presentation/screens/hse_dashboard_screen.dart';
import '../features/hse/presentation/screens/incident_report_form.dart';
import '../features/hse/presentation/screens/ppe_audit_screen.dart';
import '../features/documents/presentation/bloc/document_bloc.dart';
import '../features/documents/presentation/screens/document_list_screen.dart';
import '../features/reports/presentation/bloc/report_bloc.dart';
import '../features/reports/presentation/screens/report_selection_screen.dart';
import '../features/notifications/presentation/screens/notification_center_screen.dart';
import '../features/notifications/presentation/bloc/notification_bloc.dart';
import '../features/notifications/presentation/bloc/notification_state.dart';
import '../features/notifications/presentation/bloc/notification_event.dart';
import '../features/analytics/presentation/screens/analytics_dashboard_screen.dart';
import '../features/sync/presentation/widgets/sync_status_widget.dart';
import '../features/qr_code/presentation/screens/qr_scanner_screen.dart';
import '../features/resources/presentation/bloc/attendance_bloc.dart';
import '../features/planning/presentation/bloc/planning_bloc.dart';
import '../features/planning/presentation/screens/planning_screen.dart';
import '../features/planning/presentation/screens/task_execution_screen.dart';

import '../core/di/injection_container.dart';
import '../core/constants/app_colors.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    refreshListenable: _AuthRefreshListenable(sl<AuthBloc>()),
    redirect: (context, state) {
      final authState = sl<AuthBloc>().state;
      final isLoggingIn = state.matchedLocation == '/login';

      if (authState is! Authenticated) {
        return isLoggingIn ? null : '/login';
      }

      if (isLoggingIn) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const DashboardPlaceholder(),
      ),
      GoRoute(
        path: '/projects',
        builder: (context, state) => const ProjectListScreen(),
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) => const AddProjectScreen(),
          ),
          GoRoute(
            path: ':id/planning',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['name'] ?? 'Chantier';
              return PlanningScreen(projectId: id, projectName: name);
            },
          ),
          GoRoute(
            path: ':id/tasks',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['name'] ?? 'Chantier';
              return TaskExecutionScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/clients',
        builder: (context, state) => const ClientListScreen(),
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) => const AddClientScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/employees',
        builder: (context, state) => const EmployeeListScreen(),
      ),
      GoRoute(
        path: '/teams',
        builder: (context, state) => const TeamManagementScreen(),
      ),
      GoRoute(
        path: '/equipment',
        builder: (context, state) => const EquipmentListScreen(),
      ),
      GoRoute(
        path: '/attendance',
        builder: (context, state) {
          final projectId = state.uri.queryParameters['projectId'];
          return AttendanceScreen(initialProjectId: projectId);
        },
      ),
      GoRoute(
        path: '/inventory',
        builder: (context, state) => const MaterialListScreen(),
      ),
      GoRoute(
        path: '/suppliers',
        builder: (context, state) => const SupplierListScreen(),
      ),
      GoRoute(
        path: '/purchases',
        builder: (context, state) {
          final projectId = state.uri.queryParameters['projectId'];
          return PurchaseOrderScreen(initialProjectId: projectId);
        },
      ),
      GoRoute(
        path: '/finance',
        builder: (context, state) {
          final projectId = state.uri.queryParameters['projectId'];
          return BudgetOverviewScreen(initialProjectId: projectId);
        },
      ),
      GoRoute(
        path: '/projects/:id/diary',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return SiteDiaryListScreen(projectId: id, projectName: name);
        },
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return SiteDiaryFormScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/projects/:id/gallery',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return PhotoGalleryScreen(projectId: id, projectName: name);
        },
      ),
      GoRoute(
        path: '/projects/:id/camera',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return CameraCaptureScreen(projectId: id, projectName: name);
        },
      ),
      GoRoute(
        path: '/projects/:id/hse',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return HseDashboardScreen(projectId: id, projectName: name);
        },
        routes: [
          GoRoute(
            path: 'incident',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return IncidentReportForm(projectId: id, projectName: name);
            },
          ),
          GoRoute(
            path: 'ppe',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return PpeAuditScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/projects/:id/quality',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return InspectionListScreen(projectId: id, projectName: name);
        },
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return InspectionFormScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/projects/:id/snags',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return SnagListScreen(projectId: id, projectName: name);
        },
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return AddSnagScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/projects/:id/documents',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return DocumentListScreen(projectId: id, projectName: name);
        },
      ),
      GoRoute(
        path: '/projects/:id/reports',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return ReportSelectionScreen(projectId: id, projectName: name);
        },
      ),
      GoRoute(
        path: '/projects/:id/reception',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
          return HandoverManagementScreen(projectId: id, projectName: name);
        },
        routes: [
          GoRoute(
            path: 'add',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              final name = state.uri.queryParameters['projectName'] ?? 'Chantier';
              return HandoverFormScreen(projectId: id, projectName: name);
            },
          ),
        ],
      ),
      GoRoute(
        path: '/qr-scanner',
        builder: (context, state) => const QrScannerScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationCenterScreen(),
      ),
      GoRoute(
        path: '/analytics',
        builder: (context, state) => const AnalyticsDashboardScreen(),
      ),
      GoRoute(
        path: '/ai-assistant',
        builder: (context, state) => const AiAssistantScreen(),
      ),
      GoRoute(
        path: '/audit',
        builder: (context, state) => const AuditLogScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}

class DashboardPlaceholder extends StatelessWidget {
  const DashboardPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AGB CHANTIER'),
        actions: [
          const SyncStatusWidget(),
          BlocBuilder<NotificationBloc, NotificationState>(
            builder: (context, state) {
              int count = 0;
              if (state is NotificationsLoaded) count = state.unreadCount;
              
              return Stack(
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.bell),
                    onPressed: () => context.push('/notifications'),
                  ),
                  if (count > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(color: AppColors.orangeSecurite, borderRadius: BorderRadius.circular(10)),
                        constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                        child: Text('$count', style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                      ),
                    ),
                ],
              );
            },
          ),
          IconButton(
            icon: const Icon(LucideIcons.settings),
            onPressed: () => context.push('/settings'),
          ),
          IconButton(
            icon: const Icon(LucideIcons.logOut),
            onPressed: () => sl<AuthBloc>().add(LogoutRequested()),
          ),
        ],
      ),
      body: GridView.count(
        padding: const EdgeInsets.all(24),
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildMenuCard(context, 'CLIENTS', LucideIcons.users, '/clients'),
          _buildMenuCard(context, 'PROJETS', LucideIcons.building2, '/projects'),
          _buildMenuCard(context, 'PERSONNEL', LucideIcons.contact, '/employees'),
          _buildMenuCard(context, 'ÉQUIPES', LucideIcons.users2, '/teams'),
          _buildMenuCard(context, 'POINTAGE', LucideIcons.checkSquare, '/attendance'),
          _buildMenuCard(context, 'STOCKS', LucideIcons.boxes, '/inventory'),
          _buildMenuCard(context, 'ENGINS', LucideIcons.truck, '/equipment'),
          _buildMenuCard(context, 'ACHATS', LucideIcons.shoppingCart, '/purchases'),
          _buildMenuCard(context, 'FINANCES', LucideIcons.banknote, '/finance'),
          _buildMenuCard(context, 'FOURNISSEURS', LucideIcons.factory, '/suppliers'),
          _buildMenuCard(context, 'DASHBOARD STATS', LucideIcons.pieChart, '/analytics'),
          _buildMenuCard(context, 'AUDIT LOGS', LucideIcons.shieldCheck, '/audit'),
          _buildMenuCard(context, 'ASSISTANT IA', LucideIcons.bot, '/ai-assistant'),
          _buildMenuCard(context, 'QUALITÉ', LucideIcons.clipboardCheck, '/'),
          _buildMenuCard(context, 'SCANNER QR', LucideIcons.scanLine, '/qr-scanner'),
          _buildMenuCard(context, 'HSE', LucideIcons.shieldAlert, '/'),
        ],
      ),
    );
  }

  Widget _buildMenuCard(BuildContext context, String title, IconData icon, String route) {
    return InkWell(
      onTap: () => context.push(route),
      borderRadius: BorderRadius.circular(24),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: AppColors.orangeSecurite),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.black, fontSize: 12, letterSpacing: 1),
            ),
          ],
        ),
      ),
    );
  }
}

class _AuthRefreshListenable extends ChangeNotifier {
  _AuthRefreshListenable(AuthBloc bloc) {
    bloc.stream.listen((state) {
      notifyListeners();
    });
  }
}
