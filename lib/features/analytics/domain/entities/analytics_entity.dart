import 'package:equatable/equatable.dart';

class ChartDataPoint extends Equatable {
  final String label;
  final double value;
  final String? color; // Hex string

  const ChartDataPoint({required this.label, required this.value, this.color});

  @override
  List<Object?> get props => [label, value, color];
}

class DashboardKpis extends Equatable {
  final int activeProjectsCount;
  final double totalBudgetAllocated;
  final double totalExpensesRealized;
  final double globalProgressPercentage;
  final int totalWorkforce;
  final double inventoryTotalValue;

  const DashboardKpis({
    required this.activeProjectsCount,
    required this.totalBudgetAllocated,
    required this.totalExpensesRealized,
    required this.globalProgressPercentage,
    required this.totalWorkforce,
    required this.inventoryTotalValue,
  });

  @override
  List<Object?> get props => [
        activeProjectsCount,
        totalBudgetAllocated,
        totalExpensesRealized,
        globalProgressPercentage,
        totalWorkforce,
        inventoryTotalValue,
      ];
}

class GlobalAnalytics extends Equatable {
  final DashboardKpis kpis;
  final List<ChartDataPoint> budgetByProject;
  final List<ChartDataPoint> workforceByTeam;
  final List<ChartDataPoint> stockValueByCategory;

  const GlobalAnalytics({
    required this.kpis,
    required this.budgetByProject,
    required this.workforceByTeam,
    required this.stockValueByCategory,
  });

  @override
  List<Object?> get props => [kpis, budgetByProject, workforceByTeam, stockValueByCategory];
}
