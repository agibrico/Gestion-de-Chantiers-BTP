import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/project_document_entity.dart';
import 'package:path/path.dart' as p;

class DocumentUploadDialog extends StatefulWidget {
  final String projectId;
  final String projectName;
  final String authorName;
  final Function(ProjectDocumentEntity) onConfirm;

  const DocumentUploadDialog({
    super.key,
    required this.projectId,
    required this.projectName,
    required this.authorName,
    required this.onConfirm,
  });

  @override
  State<DocumentUploadDialog> createState() => _DocumentUploadDialogState();
}

class _DocumentUploadDialogState extends State<DocumentUploadDialog> {
  PlatformFile? _selectedFile;
  final _titleController = TextEditingController();
  DocumentType _type = DocumentType.AUTRE;

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
    );

    if (result != null) {
      setState(() {
        _selectedFile = result.files.first;
        if (_titleController.text.isEmpty) {
          _titleController.text = p.basenameWithoutExtension(_selectedFile!.name);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('ARCHIVER UN DOCUMENT', style: TextStyle(fontWeight: FontWeight.black, fontSize: 18)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            InkWell(
              onTap: _pickFile,
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey[300]!, width: 2, style: BorderStyle.solid),
                ),
                child: Column(
                  children: [
                    Icon(_selectedFile != null ? Icons.check_circle : Icons.upload_file, 
                         color: _selectedFile != null ? AppColors.success : AppColors.orangeSecurite, size: 40),
                    const SizedBox(height: 12),
                    Text(
                      _selectedFile?.name ?? 'CLIQUEZ POUR CHOISIR UN FICHIER',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _selectedFile != null ? Colors.black : Colors.grey),
                    ),
                    if (_selectedFile != null)
                      Text('${(_selectedFile!.size / 1024).toStringAsFixed(1)} Ko', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            AppTextField(label: 'TITRE DU DOCUMENT', controller: _titleController),
            const SizedBox(height: 16),
            const Text('CATÉGORIE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            DropdownButtonFormField<DocumentType>(
              value: _type,
              items: DocumentType.values.map((t) => DropdownMenuItem(value: t, child: Text(t.toString().split('.').last))).toList(),
              onChanged: (v) => setState(() => _type = v!),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'VALIDER L\'ARCHIVAGE',
          onPressed: (_selectedFile == null || _titleController.text.isEmpty) ? null : () {
            final doc = ProjectDocumentEntity(
              id: const Uuid().v4(),
              projectId: widget.projectId,
              projectName: widget.projectName,
              title: _titleController.text,
              type: _type,
              filePath: _selectedFile!.path!,
              fileName: _selectedFile!.name,
              fileSize: _selectedFile!.size.toDouble(),
              dateAdded: DateTime.now(),
              authorName: widget.authorName,
              createdAt: DateTime.now(),
            );
            widget.onConfirm(doc);
            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}
