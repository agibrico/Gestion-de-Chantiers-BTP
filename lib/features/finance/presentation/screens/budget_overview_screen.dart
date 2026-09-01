import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../projects/domain/entities/project_entity.dart';
import '../../../projects/presentation/bloc/project_bloc.dart';
import '../../../projects/presentation/bloc/project_event.dart';
import '../../../projects/presentation/bloc/project_state.dart';
import '../bloc/finance_bloc.dart';
import '../widgets/add_expense_dialog.dart';

class BudgetOverviewScreen extends StatefulWidget {
  final String? initialProjectId;

  const BudgetOverviewScreen({super.key, this.initialProjectId});

  @override
  State<BudgetOverviewScreen> createState() => _BudgetOverviewScreenState();
}

class _BudgetOverviewScreenState extends State<BudgetOverviewScreen> {
  ProjectEntity? _selectedProject;
  final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');

  @override
  void initState() {
    super.initState();
    context.read<ProjectBloc>().add(LoadProjects());
    if (widget.initialProjectId != null) {
      _loadFinance(widget.initialProjectId!);
    }
  }

  void _loadFinance(String projectId) {
    context.read<FinanceBloc>().add(LoadProjectFinanceRequested(projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('SUIVI FINANCIER')),
      body: Column(
        children: [
          _buildProjectSelector(),
          Expanded(
            child: _selectedProject == null 
              ? _buildNoProjectState()
              : _buildFinanceContent(),
          ),
        ],
      ),
      floatingActionButton: _selectedProject != null ? FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text('DÉPENSE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => _showAddExpenseDialog(context),
      ) : null,
    );
  }

  Widget _buildProjectSelector() {
    return Container(
      color: AppColors.acierBTP,
      padding: const EdgeInsets.all(16),
      child: BlocConsumer<ProjectBloc, ProjectState>(
        listener: (context, state) {
          if (state is ProjectsLoaded && widget.initialProjectId != null && _selectedProject == null) {
            final proj = state.projects.where((p) => p.id == widget.initialProjectId).firstOrNull;
            if (proj != null) {
              setState(() => _selectedProject = proj);
              _loadFinance(proj.id);
            }
          }
        },
        builder: (context, state) {
          List<ProjectEntity> projects = [];
          if (state is ProjectsLoaded) projects = state.projects;

          return DropdownButtonFormField<ProjectEntity>(
            dropdownColor: AppColors.acierBTP,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            value: _selectedProject,
            decoration: const InputDecoration(
              label: Text('SÉLECTIONNER LE CHANTIER', style: TextStyle(color: Colors.white54, fontSize: 10)),
              enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white30)),
            ),
            items: projects.map((p) => DropdownMenuItem(value: p, child: Text(p.name.toUpperCase()))).toList(),
            onChanged: (v) {
              setState(() => _selectedProject = v);
              if (v != null) _loadFinance(v.id);
            },
          );
        },
      ),
    );
  }

  Widget _buildFinanceContent() {
    return BlocBuilder<FinanceBloc, FinanceState>(
      builder: (context, state) {
        if (state is FinanceLoading) return const Center(child: CircularProgressIndicator());
        if (state is FinanceError) return Center(child: Text(state.message));

        if (state is FinanceLoaded) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildKpiSection(state),
              const SizedBox(height: 24),
              const Text('DERNIÈRES DÉPENSES', style: TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
              const SizedBox(height: 12),
              ...state.expenses.map((e) => _buildExpenseCard(e)),
              if (state.expenses.isEmpty) const Center(child: Text('Aucune dépense enregistrée.')),
            ],
          );
        }
        return const SizedBox();
      },
    );
  }

  Widget _buildKpiSection(FinanceLoaded state) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildKpiCard(
                'BUDGET ALLOUÉ', 
                currencyFormat.format(state.budget.totalAllocated), 
                LucideIcons.briefcase, 
                Colors.blue
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildKpiCard(
                'DÉPENSES RÉELLES', 
                currencyFormat.format(state.totalExpenses), 
                LucideIcons.trendingUp, 
                AppColors.orangeSecurite
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildKpiCard(
          'SOLDE DISPONIBLE', 
          currencyFormat.format(state.remainingBudget), 
          LucideIcons.wallet, 
          AppColors.success,
          isFullWidth: true,
          subText: 'Taux de consommation: ${state.consumptionRate.toStringAsFixed(1)}%'
        ),
      ],
    );
  }

  Widget _buildKpiCard(String label, String value, IconData icon, Color color, {bool isFullWidth = false, String? subText}) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black, color: AppColors.acierBTP)),
            if (subText != null) ...[
              const SizedBox(height: 8),
              Text(subText, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildExpenseCard(dynamic expense) {
    return Card(
      margin: const EdgeInsets.bottom(12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.background,
          child: Icon(_getCategoryIcon(expense.category), size: 18, color: AppColors.acierBTP),
        ),
        title: Text(expense.title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text('${DateFormat('dd/MM/yyyy').format(expense.date)} • ${expense.paymentMode.toString().split('.').last}'),
        trailing: Text(currencyFormat.format(expense.amount), style: const TextStyle(fontWeight: FontWeight.black, color: AppColors.danger)),
      ),
    );
  }

  Widget _buildNoProjectState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.barChart3, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Sélectionnez un chantier pour voir les finances.'),
        ],
      ),
    );
  }

  IconData _getCategoryIcon(dynamic category) {
    switch (category) {
      case ExpenseCategory.MATERIAUX: return LucideIcons.package;
      case ExpenseCategory.MAIN_D_OEUVRE: return LucideIcons.users;
      case ExpenseCategory.EQUIPEMENT: return LucideIcons.truck;
      case ExpenseCategory.TRANSPORT: return LucideIcons.map;
      default: return LucideIcons.shoppingBag;
    }
  }

  void _showAddExpenseDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AddExpenseDialog(
        projectId: _selectedProject!.id,
        projectName: _selectedProject!.name,
        onConfirm: (expense) {
          context.read<FinanceBloc>().add(RecordExpenseRequested(expense));
        },
      ),
    );
  }
}
