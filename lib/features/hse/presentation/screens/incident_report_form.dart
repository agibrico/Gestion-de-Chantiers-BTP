import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../../domain/entities/hse_incident_entity.dart';
import '../bloc/hse_bloc.dart';

class IncidentReportForm extends StatefulWidget {
  final String projectId;
  final String projectName;

  const IncidentReportForm({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<IncidentReportForm> createState() => _IncidentReportFormState();
}

class _IncidentReportFormState extends State<IncidentReportForm> {
  final _formKey = GlobalKey<FormState>();
  final _locController = TextEditingController();
  final _descController = TextEditingController();
  final _actionController = TextEditingController();
  
  IncidentType _type = IncidentType.ACCIDENT_TRAVAIL;
  IncidentSeverity _severity = IncidentSeverity.MODEREE;

  @override
  void dispose() {
    _locController.dispose();
    _descController.dispose();
    _actionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('RAPPORTER UN INCIDENT')),
      body: BlocListener<HseBloc, HseState>(
        listener: (context, state) {
          if (state is HseOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message), backgroundColor: AppColors.success));
            Navigator.pop(context);
          }
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('TYPE D\'ÉVÉNEMENT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary)),
                DropdownButtonFormField<IncidentType>(
                  value: _type,
                  items: IncidentType.values.map((t) => DropdownMenuItem(value: t, child: Text(t.toString().split('.').last.replaceAll('_', ' ')))).toList(),
                  onChanged: (v) => setState(() => _type = v!),
                ),
                const SizedBox(height: 16),
                const Text('GRAVITÉ ESTIMÉE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary)),
                DropdownButtonFormField<IncidentSeverity>(
                  value: _severity,
                  items: IncidentSeverity.values.map((s) => DropdownMenuItem(value: s, child: Text(s.toString().split('.').last))).toList(),
                  onChanged: (v) => setState(() => _severity = v!),
                ),
                const SizedBox(height: 24),
                AppTextField(label: 'LIEU PRÉCIS', hint: 'Ex: Echafaudage façade Nord', controller: _locController, validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null),
                const SizedBox(height: 16),
                AppTextField(label: 'DESCRIPTION DES FAITS', hint: 'Que s\'est-il passé ?', controller: _descController, maxLines: 3, validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null),
                const SizedBox(height: 16),
                AppTextField(label: 'ACTIONS IMMÉDIATES PRISES', hint: 'Ex: Balisage, Soins, Arrêt de la machine...', controller: _actionController),
                const SizedBox(height: 48),
                AppButton(
                  text: 'DÉCLARER L\'INCIDENT', 
                  variant: AppButtonVariant.danger,
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final authState = context.read<AuthBloc>().state;
                      String author = "Anonyme";
                      if (authState is Authenticated) author = authState.user.fullName;

                      final incident = HseIncidentEntity(
                        id: const Uuid().v4(),
                        projectId: widget.projectId,
                        projectName: widget.projectName,
                        date: DateTime.now(),
                        type: _type,
                        severity: _severity,
                        location: _locController.text,
                        description: _descController.text,
                        victims: const [],
                        immediateActions: _actionController.text,
                        reporterName: author,
                        isClosed: false,
                        createdAt: DateTime.now(),
                      );
                      context.read<HseBloc>().add(ReportIncidentRequested(incident));
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
