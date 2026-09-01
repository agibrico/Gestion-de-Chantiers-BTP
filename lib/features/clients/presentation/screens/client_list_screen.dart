import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../bloc/client_bloc.dart';
import '../bloc/client_event.dart';
import '../bloc/client_state.dart';

class ClientListScreen extends StatefulWidget {
  const ClientListScreen({super.key});

  @override
  State<ClientListScreen> createState() => _ClientListScreenState();
}

class _ClientListScreenState extends State<ClientListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ClientBloc>().add(LoadClients());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('GESTION DES CLIENTS'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus),
            onPressed: () => context.push('/clients/add'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (value) {
                context.read<ClientBloc>().add(SearchClientsRequested(value));
              },
              decoration: InputDecoration(
                hintText: 'Rechercher un client ou numéro...',
                prefixIcon: const Icon(LucideIcons.search, size: 20),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          
          Expanded(
            child: BlocBuilder<ClientBloc, ClientState>(
              builder: (context, state) {
                if (state is ClientLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                if (state is ClientError) {
                  return Center(child: Text(state.message));
                }
                
                if (state is ClientsLoaded) {
                  if (state.clients.isEmpty) {
                    return const Center(
                      child: Text('Aucun client enregistré.'),
                    );
                  }
                  
                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: state.clients.length,
                    itemBuilder: (context, index) {
                      final client = state.clients[index];
                      return Card(
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  client.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.black,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                              AppBadge.info(client.clientNumber),
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(LucideIcons.phone, size: 14, color: AppColors.textSecondary),
                                  const SizedBox(width: 8),
                                  Text(client.phone),
                                  if (client.whatsapp != null) ...[
                                    const SizedBox(width: 16),
                                    const Icon(LucideIcons.messageCircle, size: 14, color: Colors.green),
                                    const SizedBox(width: 4),
                                    const Text('WhatsApp', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold)),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(LucideIcons.mapPin, size: 14, color: AppColors.textSecondary),
                                  const SizedBox(width: 8),
                                  Text(client.city ?? 'Ville non précisée'),
                                ],
                              ),
                            ],
                          ),
                          trailing: const Icon(LucideIcons.chevronRight),
                          onTap: () {
                            // TODO: Client details
                          },
                        ),
                      );
                    },
                  );
                }
                
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.plus, color: Colors.white),
        onPressed: () => context.push('/clients/add'),
      ),
    );
  }
}
