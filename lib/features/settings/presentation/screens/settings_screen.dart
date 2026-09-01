import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../bloc/settings_bloc.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<SettingsBloc>().add(LoadSettingsRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('RÉGLAGES & MAINTENANCE'),
      ),
      body: BlocConsumer<SettingsBloc, SettingsState>(
        listener: (context, state) {
          if (state.message != null) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message!)));
          }
        },
        builder: (context, state) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildProfileHeader(),
              const SizedBox(height: 24),
              
              _buildSectionTitle('PRÉFÉRENCES'),
              _buildSettingCard(
                icon: LucideIcons.moon,
                title: 'Mode Sombre',
                trailing: Switch(
                  value: state.isDarkMode,
                  activeColor: AppColors.orangeSecurite,
                  onChanged: (v) => context.read<SettingsBloc>().add(ToggleDarkModeRequested(v)),
                ),
              ),
              _buildSettingCard(
                icon: LucideIcons.bell,
                title: 'Notifications Système',
                trailing: Switch(
                  value: state.notificationsEnabled,
                  activeColor: AppColors.orangeSecurite,
                  onChanged: (v) {
                    // Update repo directly or add event
                  },
                ),
              ),
              
              const SizedBox(height: 24),
              _buildSectionTitle('SAUVEGARDE & SÉCURITÉ'),
              _buildActionCard(
                icon: LucideIcons.save,
                title: 'Sauvegarder les données',
                subtitle: 'Exporter la base locale Isar (.isar)',
                onTap: () => context.read<SettingsBloc>().add(CreateBackupRequested()),
                isLoading: state.isProcessing,
              ),
              _buildActionCard(
                icon: LucideIcons.uploadCloud,
                title: 'Restaurer une sauvegarde',
                subtitle: 'Importer un fichier de secours',
                onTap: () => _showRestoreConfirm(context),
              ),
              _buildActionCard(
                icon: LucideIcons.shieldAlert,
                title: 'Journal d\'Audit',
                subtitle: 'Consulter les actions critiques',
                onTap: () => context.push('/audit'),
              ),
              
              const SizedBox(height: 24),
              _buildSectionTitle('SUPPORT & INFOS'),
              _buildSettingCard(
                icon: LucideIcons.info,
                title: 'Version de l\'application',
                trailing: const Text('1.0.0 (BETA)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
              _buildSettingCard(
                icon: LucideIcons.helpCircle,
                title: 'Aide & Support Technique',
                onTap: () {},
              ),
              
              const SizedBox(height: 40),
              AppButton(
                text: 'DÉCONNEXION',
                variant: AppButtonVariant.danger,
                onPressed: () => context.read<AuthBloc>().add(LogoutRequested()),
              ),
              const SizedBox(height: 40),
            ],
          );
        },
      ),
    );
  }

  Widget _buildProfileHeader() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if (state is Authenticated) {
          return Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.acierBTP,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppColors.orangeSecurite,
                  child: Text(state.user.fullName[0].toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.black)),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(state.user.fullName.toUpperCase(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.black, fontSize: 16)),
                      Text(state.user.role.toString().split('.').last, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.edit3, color: Colors.white70),
                  onPressed: () => context.push('/profile'),
                ),
              ],
            ),
          );
        }
        return const SizedBox();
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 12),
      child: Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary, letterSpacing: 1.2)),
    );
  }

  Widget _buildSettingCard({required IconData icon, required String title, Widget? trailing, VoidCallback? onTap}) {
    return Card(
      margin: const EdgeInsets.bottom(8),
      child: ListTile(
        leading: Icon(icon, size: 20, color: AppColors.acierBTP),
        title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        trailing: trailing,
        onTap: onTap,
      ),
    );
  }

  Widget _buildActionCard({required IconData icon, required String title, required String subtitle, required VoidCallback onTap, bool isLoading = false}) {
    return Card(
      margin: const EdgeInsets.bottom(8),
      child: ListTile(
        onTap: isLoading ? null : onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, size: 20, color: AppColors.orangeSecurite),
        ),
        title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.black)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 10)),
        trailing: isLoading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(LucideIcons.chevronRight, size: 16),
      ),
    );
  }

  void _showRestoreConfirm(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('RESTAURATION DES DONNÉES', style: TextStyle(fontWeight: FontWeight.black)),
        content: const Text('Attention : La restauration remplacera toutes vos données locales actuelles par celles du fichier de sauvegarde. L\'application devra être redémarrée.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<SettingsBloc>().add(RestoreBackupRequested());
            }, 
            child: const Text('CONFIRMER', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.bold))
          ),
        ],
      ),
    );
  }
}
