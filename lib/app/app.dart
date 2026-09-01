import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/theme/app_theme.dart';
import '../features/authentication/presentation/bloc/auth_bloc.dart';
import '../features/authentication/presentation/bloc/auth_event.dart';
import '../features/clients/presentation/bloc/client_bloc.dart';
import '../features/projects/presentation/bloc/project_bloc.dart';
import '../features/resources/presentation/bloc/resource_bloc.dart';
import '../features/resources/presentation/bloc/attendance_bloc.dart';
import '../features/resources/presentation/bloc/equipment_bloc.dart';
import '../features/inventory/presentation/bloc/inventory_bloc.dart';
import '../features/purchases/presentation/bloc/purchase_bloc.dart';
import '../features/finance/presentation/bloc/finance_bloc.dart';
import '../features/site_diary/presentation/bloc/site_diary_bloc.dart';
import '../features/handover/presentation/bloc/handover_bloc.dart';
import '../features/photos/presentation/bloc/photo_bloc.dart';
import '../features/quality/presentation/bloc/quality_bloc.dart';
import '../features/quality/presentation/bloc/snag_bloc.dart';
import '../features/notifications/presentation/bloc/notification_bloc.dart';
import '../features/settings/presentation/bloc/settings_bloc.dart';
import '../features/audit/presentation/bloc/audit_bloc.dart';
import '../features/analytics/presentation/bloc/analytics_bloc.dart';
import '../features/sync/presentation/bloc/sync_bloc.dart';
import '../features/planning/presentation/bloc/planning_bloc.dart';
import '../core/di/injection_container.dart';
import 'router.dart';

class AgbChantierApp extends StatelessWidget {
  const AgbChantierApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => sl<AuthBloc>()..add(AppStarted())),
        BlocProvider(create: (context) => sl<ClientBloc>()),
        BlocProvider(create: (context) => sl<ProjectBloc>()),
        BlocProvider(create: (context) => sl<ResourceBloc>()),
        BlocProvider(create: (context) => sl<EquipmentBloc>()),
        BlocProvider(create: (context) => sl<AttendanceBloc>()),
        BlocProvider(create: (context) => sl<InventoryBloc>()),
        BlocProvider(create: (context) => sl<PurchaseBloc>()),
        BlocProvider(create: (context) => sl<FinanceBloc>()),
        BlocProvider(create: (context) => sl<SiteDiaryBloc>()),
        BlocProvider(create: (context) => sl<HandoverBloc>()),
        BlocProvider(create: (context) => sl<PhotoBloc>()),
        BlocProvider(create: (context) => sl<QualityBloc>()),
        BlocProvider(create: (context) => sl<NotificationBloc>()),
        BlocProvider(create: (context) => sl<SettingsBloc>()),
        BlocProvider(create: (context) => sl<AuditBloc>()),
        BlocProvider(create: (context) => sl<AnalyticsBloc>()),
        BlocProvider(create: (context) => sl<SyncBloc>()..add(StartGlobalSyncRequested())),
        BlocProvider(create: (context) => sl<PlanningBloc>()),
      ],
      child: MaterialApp.router(
        title: 'AGB CHANTIER',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        routerConfig: AppRouter.router,
      ),
    );
  }
}
