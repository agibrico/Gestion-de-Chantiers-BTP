import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('MON COMPTE')),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is Authenticated) {
            _nameController.text = state.user.fullName;
            _emailController.text = state.user.email;

            return SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: AppColors.acierBTP,
                          child: Text(state.user.fullName[0].toUpperCase(), style: const TextStyle(fontSize: 40, color: Colors.white, fontWeight: FontWeight.black)),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(color: AppColors.orangeSecurite, shape: BoxShape.circle),
                            child: const Icon(LucideIcons.camera, size: 16, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  AppTextField(label: 'NOM COMPLET', controller: _nameController, readOnly: true),
                  const SizedBox(height: 16),
                  AppTextField(label: 'ADRESSE EMAIL', controller: _emailController, readOnly: true),
                  const SizedBox(height: 16),
                  AppTextField(label: 'RÔLE SUR CHANTIER', hint: state.user.role.toString().split('.').last, readOnly: true),
                  
                  const SizedBox(height: 48),
                  const Text('SÉCURITÉ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary)),
                  const SizedBox(height: 16),
                  AppButton(
                    text: 'MODIFIER MOT DE PASSE',
                    variant: AppButtonVariant.outline,
                    onPressed: () {
                      // TODO
                    },
                  ),
                  const SizedBox(height: 12),
                  const Text('L\'édition du profil est gérée par l\'administrateur système du Groupe AGB.', 
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 10, color: Colors.grey, fontStyle: FontStyle.italic)),
                ],
              ),
            );
          }
          return const SizedBox();
        },
      ),
    );
  }
}
