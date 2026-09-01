import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class BudgetPieChart extends StatelessWidget {
  final double budget;
  final double expenses;

  const BudgetPieChart({super.key, required this.budget, required this.expenses});

  @override
  Widget build(BuildContext context) {
    final remaining = budget - expenses;
    final isOverBudget = remaining < 0;

    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PieChart(
            PieChartData(
              sectionsSpace: 4,
              centerSpaceRadius: 40,
              sections: [
                PieChartSectionData(
                  value: expenses,
                  title: 'DÉPENSES',
                  color: isOverBudget ? AppColors.danger : AppColors.orangeSecurite,
                  radius: 60,
                  titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                PieChartSectionData(
                  value: isOverBudget ? 0 : remaining,
                  title: 'DISPONIBLE',
                  color: AppColors.success,
                  radius: 50,
                  titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildLegend(AppColors.orangeSecurite, 'DÉPENSÉ'),
            const SizedBox(width: 24),
            _buildLegend(AppColors.success, 'RESTE'),
          ],
        ),
      ],
    );
  }

  Widget _buildLegend(Color color, String label) {
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
