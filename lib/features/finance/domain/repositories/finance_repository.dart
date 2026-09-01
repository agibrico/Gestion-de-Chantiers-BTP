import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/budget_entity.dart';
import '../entities/expense_entity.dart';

abstract class FinanceRepository {
  // Budget
  Future<Either<Failure, BudgetEntity>> getBudgetByProject(String projectId);
  Future<Either<Failure, BudgetEntity>> createOrUpdateBudget(BudgetEntity budget);

  // Expenses
  Future<Either<Failure, List<ExpenseEntity>>> getExpensesByProject(String projectId);
  Future<Either<Failure, ExpenseEntity>> recordExpense(ExpenseEntity expense);
  Future<Either<Failure, void>> deleteExpense(String id);

  // Analytics
  Future<Either<Failure, Map<String, double>>> getExpensesTotalsByCategory(String projectId);
}
