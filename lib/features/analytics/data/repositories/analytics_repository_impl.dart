import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../../projects/data/models/project_model.dart';
import '../../../finance/data/models/finance_models.dart';
import '../../../resources/data/models/resource_models.dart';
import '../../../inventory/data/models/inventory_models.dart';
import '../../domain/entities/analytics_entity.dart';
import '../../domain/repositories/analytics_repository.dart';

class AnalyticsRepositoryImpl implements AnalyticsRepository {
  final IsarService isarService;

  AnalyticsRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, GlobalAnalytics>> getGlobalAnalytics() async {
    try {
      final isar = await isarService.db;

      // 1. Projects & Budgets
      final projects = await isar.projectModels.where().findAll();
      final totalBudget = projects.fold(0.0, (sum, p) => sum + p.budgetAllocated);
      final avgProgress = projects.isEmpty ? 0.0 : projects.fold(0.0, (sum, p) => sum + p.progressPercentage) / projects.length;

      // 2. Expenses
      final expenses = await isar.expenseModels.where().findAll();
      final totalExpenses = expenses.fold(0.0, (sum, e) => sum + e.amount);

      // 3. Workforce
      final employees = await isar.employeeModels.where().findAll();
      
      // 4. Inventory Value
      final materials = await isar.materialModels.where().findAll();
      final totalStockValue = materials.fold(0.0, (sum, m) => sum + (m.currentStock * m.unitPrice));

      final kpis = DashboardKpis(
        activeProjectsCount: projects.where((p) => p.status != ProjectStatus.ARCHIVE).length,
        totalBudgetAllocated: totalBudget,
        totalExpensesRealized: totalExpenses,
        globalProgressPercentage: avgProgress,
        totalWorkforce: employees.length,
        inventoryTotalValue: totalStockValue,
      );

      // 5. Data Points for Charts
      final budgetByProject = projects.take(5).map((p) => ChartDataPoint(
        label: p.name,
        value: p.budgetAllocated,
      )).toList();

      // Simple grouping for workforce (example)
      final teams = await isar.teamModels.where().findAll();
      final workforceByTeam = teams.take(5).map((t) => ChartDataPoint(
        label: t.name,
        value: t.memberIds.length.toDouble(),
      )).toList();

      return Right(GlobalAnalytics(
        kpis: kpis,
        budgetByProject: budgetByProject,
        workforceByTeam: workforceByTeam,
        stockValueByCategory: [], // Simplified for now
      ));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, DashboardKpis>> getProjectKpis(String projectId) async {
    try {
      final isar = await isarService.db;
      final project = await isar.projectModels.filter().remoteIdEqualTo(projectId).findFirst();
      
      if (project == null) return const Left(CacheFailure('Projet non trouvé.'));

      final expenses = await isar.expenseModels.filter().projectIdEqualTo(projectId).findAll();
      final totalExpenses = expenses.fold(0.0, (sum, e) => sum + e.amount);

      return Right(DashboardKpis(
        activeProjectsCount: 1,
        totalBudgetAllocated: project.budgetAllocated,
        totalExpensesRealized: totalExpenses,
        globalProgressPercentage: project.progressPercentage,
        totalWorkforce: 0, // Need to filter by assignment
        inventoryTotalValue: 0,
      ));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
