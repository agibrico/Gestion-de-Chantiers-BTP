import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../../../resources/presentation/bloc/resource_bloc.dart';
import '../../../resources/presentation/bloc/resource_state.dart';
import '../../domain/entities/ppe_audit_entity.dart';
import '../bloc/hse_bloc.dart';

class PpeAuditScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const PpeAuditScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<PpeAuditScreen> createState() => _PpeAuditScreenState();
}

class _PpeAuditScreenState extends State<PpeAuditScreen> {
  final List<PpeCheck> _checks = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('AUDIT EPI FLASH')),
      body: BlocListener<HseBloc, HseState>(
        listener: (context, state) {
          if (state is HseOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message), backgroundColor: AppColors.success));
            Navigator.pop(context);
          }
        },
        child: BlocBuilder<ResourceBloc, ResourceState>(
          builder: (context, state) {
            if (state is ResourceLoading) return const Center(child: CircularProgressIndicator());
            if (state is ResourcesLoaded) {
              return Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: state.employees.length,
                      itemBuilder: (context, index) {
                        final emp = state.employees[index];
                        return _buildPpeRow(emp);
                      },
                    ),
                  ),
                  _buildFooter(context),
                ],
              );
            }
            return const SizedBox();
          },
        ),
      ),
    );
  }

  Widget _buildPpeRow(dynamic employee) {
    // Check if we already have a record for this employee
    int idx = _checks.indexWhere((c) => c.employeeId == employee.id);
    if (idx == -1) {
      // Default initialization
      _checks.add(PpeCheck(
        employeeId: employee.id, 
        employeeName: employee.fullName, 
        hasHelmet: true, 
        hasSafetyShoes: true, 
        hasHighVisVest: true, 
        hasGloves: true, 
        hasGlasses: true
      ));
      idx = _checks.length - 1;
    }

    final check = _checks[idx];

    return Card(
      margin: const EdgeInsets.bottom(12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(employee.fullName.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildPpeIcon(LucideIcons.hardHat, check.hasHelmet, (v) => _updateCheck(idx, 'helmet', v)),
                _buildPpeIcon(LucideIcons.footprints, check.hasSafetyShoes, (v) => _updateCheck(idx, 'shoes', v)),
                _buildPpeIcon(LucideIcons.user, check.hasHighVisVest, (v) => _updateCheck(idx, 'vest', v)),
                _buildPpeIcon(LucideIcons.hand, check.hasGloves, (v) => _updateCheck(idx, 'gloves', v)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPpeIcon(IconData icon, bool active, Function(bool) onToggle) {
    return InkWell(
      onTap: () => onToggle(!active),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: active ? AppColors.success.withOpacity(0.1) : AppColors.danger.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: active ? AppColors.success : AppColors.danger, width: 1),
        ),
        child: Icon(icon, color: active ? AppColors.success : AppColors.danger, size: 24),
      ),
    );
  }

  void _updateCheck(int index, String type, bool value) {
    setState(() {
      final old = _checks[index];
      _checks[index] = PpeCheck(
        employeeId: old.employeeId,
        employeeName: old.employeeName,
        hasHelmet: type == 'helmet' ? value : old.hasHelmet,
        hasSafetyShoes: type == 'shoes' ? value : old.hasSafetyShoes,
        hasHighVisVest: type == 'vest' ? value : old.hasHighVisVest,
        hasGloves: type == 'gloves' ? value : old.hasGloves,
        hasGlasses: type == 'glasses' ? value : old.hasGlasses,
      );
    });
  }

  Widget _buildFooter(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))]),
      child: AppButton(
        text: 'VALIDER L\'AUDIT SÉCURITÉ',
        onPressed: () {
          final authState = context.read<AuthBloc>().state;
          String author = "Inspecteur HSE";
          if (authState is Authenticated) author = authState.user.fullName;

          final audit = PpeAuditEntity(
            id: const Uuid().v4(),
            projectId: widget.projectId,
            projectName: widget.projectName,
            date: DateTime.now(),
            teamId: 'ALL',
            teamName: 'Site Global',
            checks: _checks,
            auditorName: author,
            createdAt: DateTime.now(),
          );
          context.read<HseBloc>().add(SavePpeAuditRequested(audit));
        },
      ),
    );
  }
}
