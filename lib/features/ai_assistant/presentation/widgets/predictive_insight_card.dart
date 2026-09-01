import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/ai_message_entity.dart';

class PredictiveInsightCard extends StatelessWidget {
  final PredictiveInsight insight;

  const PredictiveInsightCard({super.key, required this.insight});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.orangeSecurite.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.orangeSecurite.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.sparkles, size: 16, color: AppColors.orangeSecurite),
              const SizedBox(width: 8),
              Text(insight.title.toUpperCase(), 
                style: const TextStyle(fontWeight: FontWeight.black, fontSize: 12, color: AppColors.orangeSecurite)),
              const Spacer(),
              _buildImpactBadge(insight.impact),
            ],
          ),
          const SizedBox(height: 12),
          Text(insight.description, style: const TextStyle(fontSize: 13, height: 1.4)),
          const SizedBox(height: 12),
          Row(
            children: [
              Text('Fiabilité de l\'IA : ${(insight.confidenceScore * 100).toInt()}%', 
                style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
              const Spacer(),
              const Text('ANALYSE PRÉDICTIVE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildImpactBadge(String impact) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: AppColors.acierBTP, borderRadius: BorderRadius.circular(4)),
      child: Text(impact, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
    );
  }
}
