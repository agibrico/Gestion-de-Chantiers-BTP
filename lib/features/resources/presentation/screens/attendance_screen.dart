import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../projects/domain/entities/project_entity.dart';
import '../../../projects/presentation/bloc/project_bloc.dart';
import '../../../projects/presentation/bloc/project_event.dart';
import '../../../projects/presentation/bloc/project_state.dart';
import '../bloc/attendance_bloc.dart';
import '../bloc/attendance_event.dart';
import '../bloc/attendance_state.dart';
import '../bloc/resource_bloc.dart';
import '../bloc/resource_event.dart';
import '../bloc/resource_state.dart';
import '../../domain/entities/attendance_entity.dart';
import '../../domain/entities/employee_entity.dart';
import '../widgets/team_attendance_dialog.dart';
import 'package:intl/intl.dart';

class AttendanceScreen extends StatefulWidget {
  final String? initialProjectId;

  const AttendanceScreen({super.key, this.initialProjectId});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  DateTime _selectedDate = DateTime.now();
  ProjectEntity? _selectedProject;

  @override
  void initState() {
    super.initState();
    context.read<ProjectBloc>().add(LoadProjects());
    context.read<ResourceBloc>().add(LoadResources());
    
    // Si un projet est passé, on le chargera quand les projets seront chargés
  }

  void _loadAttendance() {
    if (_selectedProject != null) {
      context.read<AttendanceBloc>().add(LoadAttendanceRequested(
        projectId: _selectedProject!.id,
        date: _selectedDate,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('POINTAGE JOURNALIER'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.calendar),
            onPressed: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime(2020),
                lastDate: DateTime.now().add(const Duration(days: 1)),
              );
              if (picked != null) {
                setState(() => _selectedDate = picked);
                _loadAttendance();
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Project Selector
          _buildHeader(),
          
          // Main List
          Expanded(
            child: _selectedProject == null 
              ? _buildNoProjectState()
              : _buildAttendanceList(),
          ),
        ],
      ),
      floatingActionButton: _selectedProject != null ? BlocBuilder<ResourceState>(
        builder: (context, state) {
          if (state is ResourcesLoaded) {
            return FloatingActionButton.extended(
              backgroundColor: AppColors.acierBTP,
              icon: const Icon(LucideIcons.users, color: Colors.white),
              label: const Text('POINTAGE D\'ÉQUIPE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              onPressed: () => _showTeamAttendanceDialog(context, state),
            );
          }
          return const SizedBox();
        },
      ) : null,
    );
  }

  Widget _buildHeader() {
    return Container(
      color: AppColors.acierBTP,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('CHANTIER', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          BlocConsumer<ProjectBloc, ProjectState>(
            listener: (context, state) {
              if (state is ProjectsLoaded && widget.initialProjectId != null) {
                final proj = state.projects.where((p) => p.id == widget.initialProjectId).firstOrNull;
                if (proj != null) {
                  setState(() => _selectedProject = proj);
                  _loadAttendance();
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
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white30)),
                  focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.orangeSecurite)),
                ),
                items: projects.map((p) => DropdownMenuItem(value: p, child: Text(p.name.toUpperCase()))).toList(),
                onChanged: (v) {
                  setState(() => _selectedProject = v);
                  _loadAttendance();
                },
                hint: const Text('Sélectionner un chantier', style: TextStyle(color: Colors.white54)),
              );
            },
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('EEEE dd MMMM yyyy', 'fr_FR').format(_selectedDate).toUpperCase(),
                style: const TextStyle(color: AppColors.orangeSecurite, fontWeight: FontWeight.black, fontSize: 12),
              ),
              const AppBadge.success('Aujourd\'hui'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNoProjectState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.building, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Veuillez sélectionner un chantier pour faire le pointage.', 
            style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildAttendanceList() {
    return BlocBuilder<ResourceBloc, ResourceState>(
      builder: (context, resourceState) {
        return BlocBuilder<AttendanceBloc, AttendanceState>(
          builder: (context, attendanceState) {
            if (resourceState is ResourceLoading || attendanceState is AttendanceLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (resourceState is ResourcesLoaded && attendanceState is AttendanceLoaded) {
              final allEmployees = resourceState.employees;
              final currentAttendances = attendanceState.attendances;

              if (allEmployees.isEmpty) return const Center(child: Text('Aucun employé dans la base.'));

              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: allEmployees.length,
                itemBuilder: (context, index) {
                  final employee = allEmployees[index];
                  final attendance = currentAttendances.where((a) => a.employeeId == employee.id).firstOrNull;
                  
                  return _buildEmployeeAttendanceCard(employee, attendance);
                },
              );
            }
            return const Center(child: Text('Erreur de chargement des données.'));
          },
        );
      },
    );
  }

  Widget _buildEmployeeAttendanceCard(EmployeeEntity employee, AttendanceEntity? attendance) {
    return Card(
      margin: const EdgeInsets.bottom(12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.background,
                  child: Text(employee.firstName[0], style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.acierBTP)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(employee.fullName.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
                      Text(employee.position, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                if (attendance != null)
                  _buildStatusBadge(attendance.status)
                else
                  const AppBadge(label: 'NON POINTÉ', color: Colors.grey),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildActionButton(LucideIcons.checkCircle, 'PRÉSENT', Colors.green, () => _markAttendance(employee, AttendanceStatus.PRESENT)),
                _buildActionButton(LucideIcons.xCircle, 'ABSENT', Colors.red, () => _markAttendance(employee, AttendanceStatus.ABSENT)),
                _buildActionButton(LucideIcons.clock, 'RETARD', Colors.orange, () => _markAttendance(employee, AttendanceStatus.RETARD)),
                _buildActionButton(LucideIcons.umbrella, 'CONGÉ', Colors.blue, () => _markAttendance(employee, AttendanceStatus.CONGE)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(AttendanceStatus status) {
    switch (status) {
      case AttendanceStatus.PRESENT: return AppBadge.success('PRÉSENT');
      case AttendanceStatus.ABSENT: return const AppBadge(label: 'ABSENT', color: AppColors.danger);
      case AttendanceStatus.RETARD: return AppBadge.warning('RETARD');
      case AttendanceStatus.CONGE: return AppBadge.info('CONGÉ');
    }
  }

  void _markAttendance(EmployeeEntity employee, AttendanceStatus status) {
    final attendance = AttendanceEntity(
      id: const Uuid().v4(),
      employeeId: employee.id,
      employeeName: employee.fullName,
      projectId: _selectedProject!.id,
      projectName: _selectedProject!.name,
      date: _selectedDate,
      status: status,
      hoursWorked: status == AttendanceStatus.PRESENT ? 8.0 : 0.0,
      overtimeHours: 0.0,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    context.read<AttendanceBloc>().add(RecordAttendanceRequested(attendance));
  }

  void _showTeamAttendanceDialog(BuildContext context, ResourcesLoaded state) {
    showDialog(
      context: context,
      builder: (context) => TeamAttendanceDialog(
        teams: state.teams,
        allEmployees: state.employees,
        projectId: _selectedProject!.id,
        projectName: _selectedProject!.name,
        date: _selectedDate,
        onConfirm: (attendances) {
          context.read<AttendanceBloc>().add(RecordBulkAttendanceRequested(attendances));
        },
      ),
    );
  }
}
