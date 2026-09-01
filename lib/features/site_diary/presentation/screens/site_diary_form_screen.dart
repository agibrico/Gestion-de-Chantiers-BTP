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
import '../../domain/entities/site_diary_entity.dart';
import '../bloc/site_diary_bloc.dart';

class SiteDiaryFormScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const SiteDiaryFormScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<SiteDiaryFormScreen> createState() => _SiteDiaryFormScreenState();
}

class _SiteDiaryFormScreenState extends State<SiteDiaryFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _activitiesController = TextEditingController();
  final _workersController = TextEditingController();
  final _equipmentController = TextEditingController();
  final _incidentsController = TextEditingController();
  final _tempController = TextEditingController();
  
  WeatherCondition _weather = WeatherCondition.ENSOLEILLE;

  @override
  void dispose() {
    _activitiesController.dispose();
    _workersController.dispose();
    _equipmentController.dispose();
    _incidentsController.dispose();
    _tempController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('RÉDIGER LE JOURNAL')),
      body: BlocListener<SiteDiaryBloc, SiteDiaryState>(
        listener: (context, state) {
          if (state is SiteDiaryOperationSuccess) {
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
                const Text('CONDITIONS DU JOUR', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('MÉTÉO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                          DropdownButtonFormField<WeatherCondition>(
                            value: _weather,
                            items: WeatherCondition.values.map((w) => DropdownMenuItem(value: w, child: Text(w.toString().split('.').last))).toList(),
                            onChanged: (v) => setState(() => _weather = v!),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: AppTextField(label: 'TEMP. (°C)', controller: _tempController, keyboardType: TextInputType.number),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                const Text('ACTIVITÉS & EFFECTIFS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Travaux réalisés', 
                  hint: 'Ex: Ferraillage poutres R+1, Coulage poteaux...',
                  controller: _activitiesController,
                  validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null,
                ),
                const SizedBox(height: 16),
                AppTextField(label: 'Nombre d\'ouvriers présents', controller: _workersController, keyboardType: TextInputType.number),
                const SizedBox(height: 16),
                AppTextField(label: 'Engins mobilisés', hint: 'Ex: Grue, Bétonnière Dieci', controller: _equipmentController),
                const SizedBox(height: 32),
                const Text('ALÉAS & INCIDENTS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Observations / Incidents', 
                  hint: 'Ex: Panne groupe électrogène, Retard livraison sable...',
                  controller: _incidentsController,
                ),
                const SizedBox(height: 48),
                AppButton(
                  text: 'ENREGISTRER LE JOURNAL', 
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final authState = context.read<AuthBloc>().state;
                      String author = "Inconnu";
                      if (authState is Authenticated) author = authState.user.fullName;

                      final entry = SiteDiaryEntry(
                        id: const Uuid().v4(),
                        projectId: widget.projectId,
                        projectName: widget.projectName,
                        date: DateTime.now(),
                        weather: _weather,
                        temperature: double.tryParse(_tempController.text),
                        activitiesPerformed: _activitiesController.text,
                        totalWorkers: int.tryParse(_workersController.text) ?? 0,
                        equipmentUsed: _equipmentController.text,
                        incidents: _incidentsController.text,
                        authorName: author,
                        createdAt: DateTime.now(),
                        updatedAt: DateTime.now(),
                      );
                      context.read<SiteDiaryBloc>().add(SaveSiteDiaryRequested(entry));
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
