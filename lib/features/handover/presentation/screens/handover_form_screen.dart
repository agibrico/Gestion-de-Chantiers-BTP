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
import '../../domain/entities/handover_entity.dart';
import '../bloc/handover_bloc.dart';
import '../bloc/handover_event.dart';
import '../bloc/handover_state.dart';

class HandoverFormScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const HandoverFormScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<HandoverFormScreen> createState() => _HandoverFormScreenState();
}

class _HandoverFormScreenState extends State<HandoverFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _obsController = TextEditingController();
  final _participantController = TextEditingController();
  final _reserveController = TextEditingController();
  
  HandoverType _type = HandoverType.PROVISOIRE;
  final List<HandoverParticipant> _participants = [];
  final List<HandoverReserve> _reserves = [];

  @override
  void dispose() {
    _obsController.dispose();
    _participantController.dispose();
    _reserveController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('RÉDACTION PV RÉCEPTION')),
      body: BlocListener<HandoverBloc, HandoverState>(
        listener: (context, state) {
          if (state is HandoverOperationSuccess) {
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
                const Text('TYPE DE RÉCEPTION', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 16),
                SegmentedButton<HandoverType>(
                  segments: const [
                    ButtonSegment(value: HandoverType.PROVISOIRE, label: Text('PROVISOIRE'), icon: Icon(LucideIcons.clock)),
                    ButtonSegment(value: HandoverType.DEFINITIVE, label: Text('DÉFINITIVE'), icon: Icon(LucideIcons.checkCircle)),
                  ],
                  selected: {_type},
                  onSelectionChanged: (v) => setState(() => _type = v.first),
                ),
                
                const SizedBox(height: 32),
                const Text('PARTICIPANTS (SIGNATAIRES)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: AppTextField(label: 'Nom & Rôle', hint: 'Ex: M. Kouassi (Client)', controller: _participantController)),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(LucideIcons.plusCircle, color: AppColors.orangeSecurite),
                      onPressed: () {
                        if (_participantController.text.isNotEmpty) {
                          setState(() {
                            _participants.add(HandoverParticipant(name: _participantController.text, role: '', hasSigned: false));
                            _participantController.clear();
                          });
                        }
                      },
                    ),
                  ],
                ),
                ..._participants.map((p) => ListTile(
                  dense: true,
                  leading: const Icon(LucideIcons.user, size: 16),
                  title: Text(p.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  trailing: IconButton(icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red), onPressed: () => setState(() => _participants.remove(p))),
                )),

                const SizedBox(height: 32),
                const Text('RÉSERVES DE LIVRAISON', style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: AppTextField(label: 'Description réserve', hint: 'Ex: Peinture éclatée porte salon', controller: _reserveController)),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(LucideIcons.plusCircle, color: AppColors.orangeSecurite),
                      onPressed: () {
                        if (_reserveController.text.isNotEmpty) {
                          setState(() {
                            _reserves.add(HandoverReserve(description: _reserveController.text, isResolved: false));
                            _reserveController.clear();
                          });
                        }
                      },
                    ),
                  ],
                ),
                ..._reserves.map((r) => ListTile(
                  dense: true,
                  leading: const Icon(LucideIcons.alertTriangle, size: 16, color: AppColors.warning),
                  title: Text(r.description, style: const TextStyle(fontSize: 12)),
                  trailing: IconButton(icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red), onPressed: () => setState(() => _reserves.remove(r))),
                )),

                const SizedBox(height: 32),
                AppTextField(label: 'OBSERVATIONS GÉNÉRALES', controller: _obsController, maxLines: 3),
                
                const SizedBox(height: 48),
                AppButton(
                  text: 'VALIDER ET GÉNÉRER LE PV', 
                  onPressed: () {
                    if (_participants.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez ajouter au moins un participant.')));
                      return;
                    }
                    
                    final handover = HandoverEntity(
                      id: const Uuid().v4(),
                      projectId: widget.projectId,
                      projectName: widget.projectName,
                      date: DateTime.now(),
                      type: _type,
                      participants: _participants,
                      reserves: _reserves,
                      observations: _obsController.text,
                      isCompleted: true,
                      createdAt: DateTime.now(),
                      updatedAt: DateTime.now(),
                    );
                    context.read<HandoverBloc>().add(SaveHandoverRequested(handover));
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
