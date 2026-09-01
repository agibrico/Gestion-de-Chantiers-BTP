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
import '../../domain/entities/snag_entity.dart';
import '../bloc/snag_bloc.dart';

class AddSnagScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const AddSnagScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<AddSnagScreen> createState() => _AddSnagScreenState();
}

class _AddSnagScreenState extends State<AddSnagScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _zoneController = TextEditingController();
  final _respController = TextEditingController();
  
  SnagPriority _priority = SnagPriority.MOYENNE;
  DateTime? _dueDate;

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _zoneController.dispose();
    _respController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('SIGNALER UNE RÉSERVE')),
      body: BlocListener<SnagBloc, SnagState>(
        listener: (context, state) {
          if (state is SnagOperationSuccess) {
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
                const Text('DESCRIPTION DU DÉFAUT', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                AppTextField(label: 'Titre abrégé', hint: 'Ex: Fissure poutre', controller: _titleController, validator: (v) => v?.isEmpty ?? true ? 'Titre requis' : null),
                const SizedBox(height: 16),
                AppTextField(label: 'Description détaillée', hint: 'Détaillez le problème constaté...', controller: _descController, maxLines: 3),
                const SizedBox(height: 16),
                AppTextField(label: 'Localisation / Zone', hint: 'Ex: Batiment A, R+2', controller: _zoneController, validator: (v) => v?.isEmpty ?? true ? 'Localisation requise' : null),
                
                const SizedBox(height: 32),
                const Text('PRIORITÉ & ÉCHÉANCE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                DropdownButtonFormField<SnagPriority>(
                  value: _priority,
                  decoration: const InputDecoration(labelText: 'NIVEAU D\'URGENCE'),
                  items: SnagPriority.values.map((p) => DropdownMenuItem(value: p, child: Text(p.toString().split('.').last))).toList(),
                  onChanged: (v) => setState(() => _priority = v!),
                ),
                const SizedBox(height: 16),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(LucideIcons.calendar),
                  title: const Text('Date limite de levée', style: TextStyle(fontSize: 12)),
                  subtitle: Text(_dueDate == null ? 'Non définie' : DateFormat('dd MMMM yyyy').format(_dueDate!)),
                  onTap: () async {
                    final picked = await showDatePicker(context: context, initialDate: DateTime.now().add(const Duration(days: 7)), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                    if (picked != null) setState(() => _dueDate = picked);
                  },
                ),
                
                const SizedBox(height: 32),
                const Text('RESPONSABILITÉ', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                AppTextField(label: 'Responsable de la correction', hint: 'Ex: Équipe Maçonnerie / Entreprise X', controller: _respController),
                
                const SizedBox(height: 48),
                AppButton(
                  text: 'ENREGISTRER LA RÉSERVE', 
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final authState = context.read<AuthBloc>().state;
                      String author = "Anonyme";
                      if (authState is Authenticated) author = authState.user.fullName;

                      final snag = SnagEntity(
                        id: const Uuid().v4(),
                        projectId: widget.projectId,
                        projectName: widget.projectName,
                        title: _titleController.text,
                        description: _descController.text,
                        zone: _zoneController.text,
                        status: SnagStatus.OUVERTE,
                        priority: _priority,
                        responsiblePerson: _respController.text,
                        dueDate: _dueDate,
                        reporterName: author,
                        createdAt: DateTime.now(),
                        updatedAt: DateTime.now(),
                      );
                      context.read<SnagBloc>().add(CreateSnagRequested(snag));
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
