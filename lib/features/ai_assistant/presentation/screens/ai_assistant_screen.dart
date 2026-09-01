import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/ai_message_entity.dart';
import '../bloc/ai_bloc.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<AiBloc>().add(LoadChatHistoryRequested());
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(LucideIcons.bot, color: AppColors.orangeSecurite),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ASSISTANT AGB', style: TextStyle(fontSize: 14, fontWeight: FontWeight.black)),
                Text('Propulsé par IA Contextuelle', style: TextStyle(fontSize: 9, color: Colors.grey)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.trash2, size: 20),
            onPressed: () => context.read<AiBloc>().add(ClearChatRequested()),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: BlocConsumer<AiBloc, AiState>(
              listener: (context, state) {
                if (state is AiLoaded) _scrollToBottom();
              },
              builder: (context, state) {
                if (state is AiLoading) return const Center(child: CircularProgressIndicator());
                
                if (state is AiLoaded) {
                  final messages = state.messages;
                  if (messages.isEmpty) return _buildEmptyState();

                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: messages.length + (state.isGenerating ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == messages.length) return _buildTypingIndicator();
                      final msg = messages[index];
                      return _buildMessageBubble(msg);
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(AiMessageEntity msg) {
    final isUser = msg.role == AiMessageRole.user;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) _buildBotAvatar(),
          const SizedBox(width: 8),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isUser ? AppColors.acierBTP : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 0),
                  bottomRight: Radius.circular(isUser ? 0 : 16),
                ),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    msg.content,
                    style: TextStyle(
                      color: isUser ? Colors.white : AppColors.textPrimary,
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    DateFormat('HH:mm').format(msg.timestamp),
                    style: TextStyle(fontSize: 8, color: isUser ? Colors.white70 : Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          if (isUser) _buildUserAvatar(),
        ],
      ),
    );
  }

  Widget _buildBotAvatar() {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: const BoxDecoration(color: AppColors.orangeSecurite, shape: BoxShape.circle),
      child: const Icon(LucideIcons.bot, size: 16, color: Colors.white),
    );
  }

  Widget _buildUserAvatar() {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: const BoxDecoration(color: AppColors.background, shape: BoxShape.circle),
      child: const Icon(LucideIcons.user, size: 16, color: AppColors.acierBTP),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          _buildBotAvatar(),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: const Text('L\'Assistant réfléchit...', style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))]),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _messageController,
                decoration: InputDecoration(
                  hintText: 'Posez une question sur vos chantiers...',
                  hintStyle: const TextStyle(fontSize: 12),
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: const BoxDecoration(color: AppColors.orangeSecurite, shape: BoxShape.circle),
              child: IconButton(
                icon: const Icon(LucideIcons.send, color: Colors.white, size: 18),
                onPressed: () {
                  if (_messageController.text.isNotEmpty) {
                    context.read<AiBloc>().add(SendUserPromptRequested(_messageController.text));
                    _messageController.clear();
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(LucideIcons.bot, size: 64, color: Colors.grey),
          const SizedBox(height: 24),
          const Text('BIENVENUE DANS L\'ASSISTANT AGB', style: TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
          const SizedBox(height: 8),
          const Text('Posez des questions sur vos projets,\nvos stocks ou vos budgets.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 32),
          _buildQuickAction('Quels sont les chantiers en retard ?'),
          _buildQuickAction('État des stocks de ciment'),
          _buildQuickAction('Résumé financier de la semaine'),
        ],
      ),
    );
  }

  Widget _buildQuickAction(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: ActionChip(
        label: Text(text, style: const TextStyle(fontSize: 11)),
        onPressed: () => context.read<AiBloc>().add(SendUserPromptRequested(text)),
      ),
    );
  }
}
