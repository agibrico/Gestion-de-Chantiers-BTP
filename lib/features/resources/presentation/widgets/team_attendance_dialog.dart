import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/attendance_entity.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/team_entity.dart';

class TeamAttendanceDialog extends StatefulWidget {
  final List<TeamEntity> teams;
  final List<EmployeeEntity> allEmployees;
  final String projectId;
  final String projectName;
  final DateTime date;
  final Function(List<AttendanceEntity>) onConfirm;

  const TeamAttendanceDialog({
    super.key,
    required this.teams,
    required this.allEmployees,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.onConfirm,
  });

  @override
  State<TeamAttendanceDialog> createState() => _TeamAttendanceDialogState();
}

class _TeamAttendanceDialogState extends State<TeamAttendanceDialog> {
  TeamEntity? _selectedTeam;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('POINTAGE D\'ÉQUIPE', style: TextStyle(fontWeight: FontWeight.black, fontSize: 18)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('Sélectionnez une équipe pour marquer tous ses membres comme PRÉSENTS (8h).', 
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          DropdownButtonFormField<TeamEntity>(
            value: _selectedTeam,
            decoration: InputDecoration(
              label: const Text('ÉQUIPE'),
              filled: true,
              fillColor: Colors.grey[100],
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
            items: widget.teams.map((t) => DropdownMenuItem(value: t, child: Text(t.name))).toList(),
            onChanged: (v) => setState(() => _selectedTeam = v),
          ),
          if (_selectedTeam != null) ...[
            const SizedBox(height: 16),
            Text('Responsable: ${_selectedTeam!.leaderName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
            Text('${_selectedTeam!.memberIds.length + 1} membres seront pointés.', style: const TextStyle(fontSize: 11)),
          ],
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'VALIDER LE POINTAGE',
          onPressed: _selectedTeam == null ? null : () {
            final List<AttendanceEntity> attendances = [];
            
            // Leader
            attendances.add(_createAttendance(_selectedTeam!.leaderId, _selectedTeam!.leaderName));
            
            // Members
            for (final memberId in _selectedTeam!.memberIds) {
              final employee = widget.allEmployees.firstWhere((e) => e.id == memberId);
              attendances.add(_createAttendance(memberId, employee.fullName));
            }
            
            widget.onConfirm(attendances);
            Navigator.pop(context);
          },
        ),
      ],
    );
  }

  AttendanceEntity _createAttendance(String employeeId, String employeeName) {
    return AttendanceEntity(
      id: const Uuid().v4(),
      employeeId: employeeId,
      employeeName: employeeName,
      projectId: widget.projectId,
      projectName: widget.projectName,
      date: widget.date,
      status: AttendanceStatus.PRESENT,
      hoursWorked: 8.0,
      overtimeHours: 0.0,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }
}
