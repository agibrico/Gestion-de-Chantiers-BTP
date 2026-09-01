import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../bloc/report_bloc.dart';
import 'pdf_preview_screen.dart';
import 'package:intl/intl.dart';

class ReportSelectionScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const ReportSelectionScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<ReportSelectionScreen> createState() => _ReportSelectionScreenState();
}

class _ReportSelectionScreenState extends State<ReportSelectionScreen> {
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('GÉNÉRATION DE RAPPORTS'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocListener<ReportBloc, ReportState>(
        listener: (context, state) {
          if (state is ReportGenerated) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PdfPreviewScreen(pdfBytes: state.pdfBytes, fileName: state.fileName),
              ),
            );
          }
          if (state is ReportError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.danger),
            );
          }
        },
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const Text('SÉLECTIONNEZ LE TYPE DE RAPPORT', 
              style: TextStyle(fontWeight: FontWeight.black, fontSize: 14, letterSpacing: -0.5)),
            const SizedBox(height: 24),
            _buildReportTypeCard(
              title: 'Rapport Journalier',
              description: 'Journal de chantier complet pour une date précise.',
              icon: LucideIcons.calendarCheck,
              onTap: () => _showDateSelection(),
            ),
            _buildReportTypeCard(
              title: 'État des Stocks',
              description: 'Inventaire actuel et alertes de rupture.',
              icon: LucideIcons.boxes,
              onTap: () {
                // Feature coming soon
              },
            ),
            _buildReportTypeCard(
              title: 'Synthèse Financière',
              description: 'Budget vs Dépenses réelles du projet.',
              icon: LucideIcons.banknote,
              onTap: () {
                // Feature coming soon
              },
            ),
            const SizedBox(height: 40),
            const Center(
              child: Opacity(
                opacity: 0.5,
                child: Column(
                  children: [
                    Icon(LucideIcons.fileText, size: 40, color: AppColors.textSecondary),
                    SizedBox(height: 8),
                    Text('Les rapports sont générés au format PDF professionnel', 
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportTypeCard({
    required String title,
    required String description,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.bottom(16),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: AppColors.orangeSecurite),
        ),
        title: Text(title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13)),
        subtitle: Text(description, style: const TextStyle(fontSize: 11)),
        trailing: const Icon(LucideIcons.chevronRight, size: 20),
      ),
    );
  }

  void _showDateSelection() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      helpText: 'SÉLECTIONNEZ LA DATE DU JOURNAL',
    );

    if (picked != null) {
      setState(() => _selectedDate = picked);
      _generateDailyReport();
    }
  }

  void _generateDailyReport() {
    context.read<ReportBloc>().add(GenerateDailyReportRequested(
      projectId: widget.projectId,
      date: _selectedDate,
    ));
  }
}
