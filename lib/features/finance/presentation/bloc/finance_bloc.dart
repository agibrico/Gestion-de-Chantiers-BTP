import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/budget_entity.dart';
import '../../domain/entities/expense_entity.dart';
import '../../domain/repositories/finance_repository.dart';

// Events
abstract class FinanceEvent extends Equatable {
  const FinanceEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectFinanceRequested extends FinanceEvent {
  final String projectId;
  const LoadProjectFinanceRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class RecordExpenseRequested extends FinanceEvent {
  final ExpenseEntity expense;
  const RecordExpenseRequested(this.expense);
  @override
  List<Object?> get props => [expense];
}

class UpdateBudgetRequested extends FinanceEvent {
  final BudgetEntity budget;
  const UpdateBudgetRequested(this.budget);
  @override
  List<Object?> get props => [budget];
}

// States
abstract class FinanceState extends Equatable {
  const FinanceState();
  @override
  List<Object?> get props => [];
}

class FinanceInitial extends FinanceState {}
class FinanceLoading extends FinanceState {}

class FinanceLoaded extends FinanceState {
  final BudgetEntity budget;
  final List<ExpenseEntity> expenses;
  final Map<String, double> totalsByCategory;

  const FinanceLoaded({
    required this.budget,
    required this.expenses,
    required this.totalsByCategory,
  });

  double get totalExpenses => expenses.fold(0, (sum, e) => sum + e.amount);
  double get remainingBudget => budget.totalAllocated - totalExpenses;
  double get consumptionRate => budget.totalAllocated > 0 ? (totalExpenses / budget.totalAllocated) * 100 : 0;

  @override
  List<Object?> get props => [budget, expenses, totalsByCategory];
}

class FinanceOperationSuccess extends FinanceState {
  final String message;
  const FinanceOperationSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class FinanceError extends FinanceState {
  final String message;
  const FinanceError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class FinanceBloc extends Bloc<FinanceEvent, FinanceState> {
  final FinanceRepository financeRepository;

  FinanceBloc({required this.financeRepository}) : super(FinanceInitial()) {
    on<LoadProjectFinanceRequested>(_onLoadFinance);
    on<RecordExpenseRequested>(_onRecordExpense);
    on<UpdateBudgetRequested>(_onUpdateBudget);
  }

  Future<void> _onLoadFinance(LoadProjectFinanceRequested event, Emitter<FinanceState> emit) async {
    emit(FinanceLoading());
    
    final budgetRes = await financeRepository.getBudgetByProject(event.projectId);
    final expensesRes = await financeRepository.getExpensesByProject(event.projectId);
    final totalsRes = await financeRepository.getExpensesTotalsByCategory(event.projectId);

    budgetRes.fold(
      (failure) => emit(FinanceError(failure.message)),
      (budget) {
        expensesRes.fold(
          (failure) => emit(FinanceError(failure.message)),
          (expenses) {
            totalsRes.fold(
              (failure) => emit(FinanceError(failure.message)),
              (totals) => emit(FinanceLoaded(
                budget: budget,
                expenses: expenses,
                totalsByCategory: totals,
              )),
            );
          },
        );
      },
    );
  }

  Future<void> _onRecordExpense(RecordExpenseRequested event, Emitter<FinanceState> emit) async {
    final result = await financeRepository.recordExpense(event.expense);
    result.fold(
      (failure) => emit(FinanceError(failure.message)),
      (_) {
        emit(const FinanceOperationSuccess('Dépense enregistrée.'));
        add(LoadProjectFinanceRequested(event.expense.projectId));
      },
    );
  }

  Future<void> _onUpdateBudget(UpdateBudgetRequested event, Emitter<FinanceState> emit) async {
    final result = await financeRepository.createOrUpdateBudget(event.budget);
    result.fold(
      (failure) => emit(FinanceError(failure.message)),
      (_) {
        emit(const FinanceOperationSuccess('Budget mis à jour.'));
        add(LoadProjectFinanceRequested(event.budget.projectId));
      },
    );
  }
}
