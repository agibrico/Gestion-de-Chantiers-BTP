import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';
import 'app_button.dart';

class QrCodeViewer extends StatelessWidget {
  final String value;
  final String title;
  final String? subtitle;

  const QrCodeViewer({
    super.key,
    required this.value,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Column(
        children: [
          const Text('IDENTIFICATION NUMÉRIQUE', 
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 1.2)),
          const SizedBox(height: 8),
          Text(title.toUpperCase(), 
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.black)),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey[200]!),
            ),
            child: QrImageView(
              data: value,
              version: QrVersions.auto,
              size: 200.0,
              eyeStyle: const QrEyeStyle(
                eyeShape: QrEyeShape.square,
                color: AppColors.acierBTP,
              ),
              dataModuleStyle: const QrDataModuleStyle(
                dataModuleShape: QrDataModuleShape.square,
                color: AppColors.acierBTP,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(value, 
            style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          if (subtitle != null) ...[
            const SizedBox(height: 8),
            Text(subtitle!, 
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          ],
          const SizedBox(height: 24),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.shieldCheck, size: 14, color: AppColors.success),
              SizedBox(width: 8),
              Text('ÉTIQUETTE OFFICIELLE AGB', 
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.success)),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context), 
          child: const Text('FERMER')
        ),
        AppButton(
          text: 'IMPRIMER',
          size: AppButtonSize.small,
          icon: const Icon(LucideIcons.printer, size: 14, color: Colors.white),
          onPressed: () {
            // TODO: Link to printing service from Axe 19
          },
        ),
      ],
    );
  }
}
