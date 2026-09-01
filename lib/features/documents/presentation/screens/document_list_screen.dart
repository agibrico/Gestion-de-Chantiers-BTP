import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../../domain/entities/project_document_entity.dart';
import '../bloc/document_bloc.dart';
import '../bloc/document_event.dart';
import '../bloc/document_state.dart';
import '../widgets/document_upload_dialog.dart';

class DocumentListScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const DocumentListScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<DocumentListScreen> createState() => _DocumentListScreenState();
}

class _DocumentListScreenState extends State<DocumentListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<DocumentBloc>().add(LoadProjectDocumentsRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('GED - GESTION DOCUMENTAIRE'),
            Text(widget.projectName.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(
            child: BlocBuilder<DocumentBloc, DocumentState>(
              builder: (context, state) {
                if (state is DocumentLoading) return const Center(child: CircularProgressIndicator());
                
                if (state is DocumentsLoaded) {
                  final docs = state.documents;
                  if (docs.isEmpty) return _buildEmptyState();

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: docs.length,
                    itemBuilder: (context, index) {
                      final doc = docs[index];
                      return _buildDocumentCard(doc);
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.filePlus, color: Colors.white),
        label: const Text('AJOUTER DOCUMENT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => _showUploadDialog(context),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: TextField(
        onChanged: (v) => context.read<DocumentBloc>().add(SearchDocumentsRequested(widget.projectId, v)),
        decoration: InputDecoration(
          hintText: 'Rechercher un plan, facture, contrat...',
          prefixIcon: const Icon(LucideIcons.search, size: 20),
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        ),
      ),
    );
  }

  Widget _buildDocumentCard(ProjectDocumentEntity doc) {
    return Card(
      margin: const EdgeInsets.bottom(12),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(12)),
          child: Icon(_getFileIcon(doc.type), color: AppColors.acierBTP, size: 20),
        ),
        title: Text(doc.title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13)),
        subtitle: Text(
          '${doc.type.toString().split('.').last} • ${DateFormat('dd/MM/yyyy').format(doc.dateAdded)} • ${(doc.fileSize / 1024).toStringAsFixed(1)} Mo',
          style: const TextStyle(fontSize: 10),
        ),
        trailing: PopupMenuButton(
          icon: const Icon(LucideIcons.moreVertical, size: 20),
          itemBuilder: (context) => [
            const PopupMenuItem(value: 'open', child: Row(children: [Icon(LucideIcons.eye, size: 16), SizedBox(width: 8), Text('Ouvrir')])),
            const PopupMenuItem(value: 'share', child: Row(children: [Icon(LucideIcons.share2, size: 16), SizedBox(width: 8), Text('Partager')])),
            const PopupMenuItem(value: 'delete', child: Row(children: [Icon(LucideIcons.trash2, size: 16, color: Colors.red), SizedBox(width: 8), Text('Supprimer', style: TextStyle(color: Colors.red))])),
          ],
          onSelected: (val) {
            if (val == 'share') {
              Share.shareXFiles([XFile(doc.filePath)], text: 'Document AGB : ${doc.title}');
            } else if (val == 'delete') {
              context.read<DocumentBloc>().add(DeleteDocumentRequested(doc.id, widget.projectId));
            }
          },
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.folderOpen, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun document archivé pour ce projet.'),
        ],
      ),
    );
  }

  IconData _getFileIcon(DocumentType type) {
    switch (type) {
      case DocumentType.PLAN: return LucideIcons.map;
      case DocumentType.FACTURE: return LucideIcons.receipt;
      case DocumentType.CONTRAT: return LucideIcons.fileKey;
      case DocumentType.RAPPORT: return LucideIcons.fileText;
      default: return LucideIcons.file;
    }
  }

  void _showUploadDialog(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    String author = "Inconnu";
    if (authState is Authenticated) author = authState.user.fullName;

    showDialog(
      context: context,
      builder: (context) => DocumentUploadDialog(
        projectId: widget.projectId,
        projectName: widget.projectName,
        authorName: author,
        onConfirm: (doc) {
          context.read<DocumentBloc>().add(SaveDocumentRequested(doc));
        },
      ),
    );
  }
}
