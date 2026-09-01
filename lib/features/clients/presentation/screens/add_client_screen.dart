import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/client_entity.dart';
import '../bloc/client_bloc.dart';
import '../bloc/client_event.dart';
import '../bloc/client_state.dart';

class AddClientScreen extends StatefulWidget {
  const AddClientScreen({super.key});

  @override
  State<AddClientScreen> createState() => _AddClientScreenState();
}

class _AddClientScreenState extends State<AddClientScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  ClientType _selectedType = ClientType.PARTICULIER;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _whatsappController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('NOUVEAU CLIENT'),
      ),
      body: BlocListener<ClientBloc, ClientState>(
        listener: (context, state) {
          if (state is ClientOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.success),
            );
            context.pop();
          }
          if (state is ClientError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.danger),
            );
          }
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'INFORMATIONS GÉNÉRALES',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Nom ou Raison Sociale',
                  hint: 'Ex: AGB HOLDING ou Jean Dupont',
                  controller: _nameController,
                  validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null,
                ),
                const SizedBox(height: 16),
                const Text(
                  'TYPE DE CLIENT',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<ClientType>(
                  value: _selectedType,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                  items: ClientType.values.map((t) {
                    return DropdownMenuItem(value: t, child: Text(t.toString().split('.').last.replaceAll('_', ' ')));
                  }).toList(),
                  onChanged: (v) => setState(() => _selectedType = v!),
                ),
                const SizedBox(height: 24),
                const Text(
                  'CONTACTS',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Téléphone',
                  hint: '+225 00 00 00 00',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  validator: (v) => v?.isEmpty ?? true ? 'Champ requis' : null,
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'WhatsApp (Optionnel)',
                  hint: '+225 00 00 00 00',
                  controller: _whatsappController,
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Email',
                  hint: 'client@email.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 24),
                const Text(
                  'LOCALISATION',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Ville',
                  hint: 'Ex: Abidjan',
                  controller: _cityController,
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Adresse complète',
                  hint: 'Commune, Quartier, Rue...',
                  controller: _addressController,
                ),
                const SizedBox(height: 40),
                AppButton(
                  text: 'Enregistrer le Client',
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final now = DateTime.now();
                      final client = ClientEntity(
                        id: const Uuid().v4(),
                        clientNumber: 'CLT-${now.year}-${(100 + now.millisecond)}',
                        name: _nameController.text,
                        phone: _phoneController.text,
                        whatsapp: _whatsappController.text.isEmpty ? null : _whatsappController.text,
                        email: _emailController.text.isEmpty ? null : _emailController.text,
                        city: _cityController.text.isEmpty ? null : _cityController.text,
                        address: _addressController.text.isEmpty ? null : _addressController.text,
                        type: _selectedType,
                        createdAt: now,
                        updatedAt: now,
                      );
                      context.read<ClientBloc>().add(AddClientRequested(client));
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
