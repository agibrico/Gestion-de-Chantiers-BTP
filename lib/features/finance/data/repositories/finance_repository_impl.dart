import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/budget_entity.dart';
import '../../domain/entities/expense_entity.dart';
import '../../domain/repositories/finance_repository.dart';
import '../models/finance_models.dart';

class FinanceRepositoryImpl implements FinanceRepository {
  final IsarService isarService;

  FinanceRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, BudgetEntity>> getBudgetByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final model = await isar.budgetModels.filter().projectIdEqualTo(projectId).findFirst();
      if (model != null) {
        return Right(model.toEntity());
      }
      // Return a default empty budget if not found
      return Right(BudgetEntity(
        id: 'new',
        projectId: projectId,
        projectName: '',
        totalAllocated: 0,
        allocatedByCategory: const {},
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, BudgetEntity>> createOrUpdateBudget(BudgetEntity budget) async {
    try {
      final isar = await isarService.db;
      final model = BudgetModel.fromEntity(budget);
      
      final existing = await isar.budgetModels.filter().projectIdEqualTo(budget.projectId).findFirst();
      if (existing != null) {
        model.id = existing.id;
      }
      
      await isar.writeTxn(() => isar.budgetModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<ExpenseEntity>>> getExpensesByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.expenseModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByDateDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, ExpenseEntity>> recordExpense(ExpenseEntity expense) async {
    try {
      final isar = await isarService.db;
      final model = ExpenseModel.fromEntity(expense);
      await isar.writeTxn(() => isar.expenseModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteExpense(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.expenseModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, Map<String, double>>> getExpensesTotalsByCategory(String projectId) async {
    try {
      final isar = await isarService.db;
      final expenses = await isar.expenseModels.filter().projectIdEqualTo(projectId).findAll();
      
      final Map<String, double> totals = {};
      for (final e in expenses) {
        final catName = e.category.toString().split('.').last;
        totals[catName] = (totals[catName] ?? 0) + e.amount;
      }
      
      return Right(totals);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
