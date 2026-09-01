import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/analytics_bloc.dart';
import '../widgets/budget_pie_chart.dart';
import '../widgets/workforce_bar_chart.dart';

class AnalyticsDashboardScreen extends StatefulWidget {
  const AnalyticsDashboardScreen({super.key});

  @override
  State<AnalyticsDashboardScreen> createState() => _AnalyticsDashboardScreenState();
}

class _AnalyticsDashboardScreenState extends State<AnalyticsDashboardScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AnalyticsBloc>().add(LoadGlobalAnalyticsRequested());
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('COCKPIT ANALYTIQUE', style: TextStyle(fontWeight: FontWeight.black, letterSpacing: 1.5)),
      ),
      body: BlocBuilder<AnalyticsBloc, AnalyticsState>(
        builder: (context, state) {
          if (state is AnalyticsLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is AnalyticsLoaded) {
            final kpi = state.analytics.kpis;
            return ListView(
              padding: const EdgeInsets.all(24),
              children: [
                const Text('INDICATEURS CLÉS (KPI)', style: TextStyle(fontWeight: FontWeight.black, fontSize: 16)),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.4,
                  children: [
                    _buildKpiCard('PROJETS ACTIFS', '${kpi.activeProjectsCount}', LucideIcons.building2, AppColors.info),
                    _buildKpiCard('AVANCEMENT MOYEN', '${kpi.globalProgressPercentage.toInt()}%', LucideIcons.trendingUp, AppColors.success),
                    _buildKpiCard('PERSONNEL TOTAL', '${kpi.totalWorkforce}', LucideIcons.users, AppColors.orangeSecurite),
                    _buildKpiCard('VALEUR STOCKS', currencyFormat.format(kpi.inventoryTotalValue), LucideIcons.boxes, AppColors.acierBTP),
                  ],
                ),
                
                const SizedBox(height: 32),
                _buildChartSection(
                  'EXÉCUTION BUDGÉTAIRE GLOBALE',
                  'Budget alloué vs Dépenses réelles',
                  BudgetPieChart(budget: kpi.totalBudgetAllocated, expenses: kpi.totalExpensesRealized),
                ),
                
                const SizedBox(height: 24),
                _buildChartSection(
                  'RÉPARTITION DE LA MAIN D\'ŒUVRE',
                  'Nombre d\'ouvriers par équipe active',
                  WorkforceBarChart(data: state.analytics.workforceByTeam),
                ),
                
                const SizedBox(height: 40),
                Center(
                  child: Text('Dernière mise à jour : ${DateFormat('HH:mm').format(DateTime.now())}', 
                    style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ),
                const SizedBox(height: 40),
              ],
            );
          }
          
          return const SizedBox();
        },
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black)),
            Text(label, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _buildChartSection(String title, String subtitle, Widget chart) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey[100]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13)),
          Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          chart,
        ],
      ),
    );
  }
}
