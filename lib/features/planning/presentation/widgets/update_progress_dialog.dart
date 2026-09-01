import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/planning_task_entity.dart';

class UpdateProgressDialog extends StatefulWidget {
  final PlanningTaskEntity task;
  final Function(double progress, double actualCost, String observations, PlanningTaskStatus status) onUpdate;

  const UpdateProgressDialog({
    super.key,
    required this.task,
    required this.onUpdate,
  });

  @override
  State<UpdateProgressDialog> createState() => _UpdateProgressDialogState();
}

class _UpdateProgressDialogState extends State<UpdateProgressDialog> {
  late double _progress;
  late TextEditingController _costController;
  late TextEditingController _obsController;
  late PlanningTaskStatus _status;

  @override
  void initState() {
    super.initState();
    _progress = widget.task.progressPercentage;
    _costController = TextEditingController(text: widget.task.actualCost.toStringAsFixed(0));
    _obsController = TextEditingController(text: widget.task.observations ?? '');
    _status = widget.task.status;
  }

  @override
  void dispose() {
    _costController.dispose();
    _obsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('MISE À JOUR : ${widget.task.title.toUpperCase()}', 
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('AVANCEMENT REÉL (%)', 
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Slider(
                    value: _progress,
                    min: 0,
                    max: 100,
                    divisions: 20,
                    label: '${_progress.toInt()}%',
                    activeColor: AppColors.orangeSecurite,
                    onChanged: (value) {
                      setState(() {
                        _progress = value;
                        if (_progress == 100) {
                          _status = PlanningTaskStatus.TERMINE;
                        } else if (_progress > 0) {
                          _status = PlanningTaskStatus.EN_COURS;
                        }
                      });
                    },
                  ),
                ),
                Text('${_progress.toInt()}%', style: const TextStyle(fontWeight: FontWeight.black)),
              ],
            ),
            const SizedBox(height: 16),
            const Text('STATUT OPÉRATIONNEL', 
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            DropdownButtonFormField<PlanningTaskStatus>(
              value: _status,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              items: PlanningTaskStatus.values.map((s) => DropdownMenuItem(
                value: s, 
                child: Text(s.toString().split('.').last.replaceAll('_', ' '))
              )).toList(),
              onChanged: (v) => setState(() => _status = v!),
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Coût réel engagé (FCFA)', 
              controller: _costController,
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Observations de terrain', 
              hint: 'Difficultés, besoins en matériel...',
              controller: _obsController,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'Enregistrer', 
          onPressed: () {
            widget.onUpdate(
              _progress,
              double.tryParse(_costController.text) ?? 0.0,
              _obsController.text,
              _status,
            );
            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}
