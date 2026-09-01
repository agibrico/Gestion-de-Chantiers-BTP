import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../../domain/entities/quality_inspection_entity.dart';
import '../bloc/quality_bloc.dart';

class InspectionFormScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const InspectionFormScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<InspectionFormScreen> createState() => _InspectionFormScreenState();
}

class _InspectionFormScreenState extends State<InspectionFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _zoneController = TextEditingController();
  final _obsController = TextEditingController();
  
  InspectionType _type = InspectionType.FERRAILLAGE;
  InspectionStatus _result = InspectionStatus.CONFORME;
  
  List<ChecklistItem> _checklist = [];

  @override
  void initState() {
    super.initState();
    _loadDefaultChecklist();
  }

  void _loadDefaultChecklist() {
    setState(() {
      _checklist = [
        const ChecklistItem(label: 'Respect des plans d\'exécution', isChecked: false),
        const ChecklistItem(label: 'Propreté de la zone de travail', isChecked: false),
        const ChecklistItem(label: 'Conformité des matériaux utilisés', isChecked: false),
        const ChecklistItem(label: 'Respect des consignes de sécurité', isChecked: false),
      ];
    });
  }

  @override
  void dispose() {
    _zoneController.dispose();
    _obsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('NOUVELLE INSPECTION')),
      body: BlocListener<QualityBloc, QualityState>(
        listener: (context, state) {
          if (state is QualityOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message), backgroundColor: AppColors.success));
            context.pop();
          }
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('DÉTAILS DU CONTRÔLE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                DropdownButtonFormField<InspectionType>(
                  value: _type,
                  decoration: const InputDecoration(labelText: 'TYPE DE CONTRÔLE'),
                  items: InspectionType.values.map((t) => DropdownMenuItem(value: t, child: Text(t.toString().split('.').last.replaceAll('_', ' ')))).toList(),
                  onChanged: (v) => setState(() => _type = v!),
                ),
                const SizedBox(height: 16),
                AppTextField(label: 'ZONE / ÉLÉMENT CONTRÔLÉ', hint: 'Ex: Dalle R+1 Zone A', controller: _zoneController, validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null),
                
                const SizedBox(height: 32),
                const Text('POINTS DE CONTRÔLE (CHECKLIST)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 8),
                ...List.generate(_checklist.length, (index) {
                  final item = _checklist[index];
                  return CheckboxListTile(
                    title: Text(item.label, style: const TextStyle(fontSize: 13)),
                    value: item.isChecked,
                    activeColor: AppColors.orangeSecurite,
                    onChanged: (v) {
                      setState(() {
                        _checklist[index] = ChecklistItem(label: item.label, isChecked: v!, comment: item.comment);
                      });
                    },
                  );
                }),
                
                const SizedBox(height: 32),
                const Text('RÉSULTAT & DÉCISION', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                SegmentedButton<InspectionStatus>(
                  segments: const [
                    ButtonSegment(value: InspectionStatus.CONFORME, label: Text('CONFORME'), icon: Icon(LucideIcons.check)),
                    ButtonSegment(value: InspectionStatus.NON_CONFORME, label: Text('NON C.'), icon: Icon(LucideIcons.x)),
                    ButtonSegment(value: InspectionStatus.SOUS_RESERVE, label: Text('RÉSERVE'), icon: Icon(LucideIcons.alertTriangle)),
                  ],
                  selected: {_result},
                  onSelectionChanged: (Set<InspectionStatus> newSelection) {
                    setState(() => _result = newSelection.first);
                  },
                ),
                const SizedBox(height: 24),
                AppTextField(label: 'OBSERVATIONS COMPLÉMENTAIRES', hint: 'Détaillez les non-conformités éventuelles...', controller: _obsController, maxLines: 3),
                
                const SizedBox(height: 48),
                AppButton(
                  text: 'VALIDER L\'INSPECTION', 
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final authState = context.read<AuthBloc>().state;
                      String author = "Inconnu";
                      if (authState is Authenticated) author = authState.user.fullName;

                      final inspection = QualityInspectionEntity(
                        id: const Uuid().v4(),
                        projectId: widget.projectId,
                        projectName: widget.projectName,
                        type: _type,
                        zone: _zoneController.text,
                        date: DateTime.now(),
                        inspectorName: author,
                        checklist: _checklist,
                        result: _result,
                        observations: _obsController.text,
                        isSigned: true, // Simulation
                        createdAt: DateTime.now(),
                        updatedAt: DateTime.now(),
                      );
                      context.read<QualityBloc>().add(SaveInspectionRequested(inspection));
                    }
                  },
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
