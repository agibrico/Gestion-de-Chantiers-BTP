import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class AppBadge extends StatelessWidget {
  final String label;
  final Color color;
  final Color textColor;

  const AppBadge({
    super.key,
    required this.label,
    this.color = AppColors.orangeSecurite,
    this.textColor = Colors.white,
  });

  factory AppBadge.info(String label) => AppBadge(
        label: label,
        color: AppColors.info.withOpacity(0.1),
        textColor: AppColors.info,
      );

  factory AppBadge.success(String label) => AppBadge(
        label: label,
        color: AppColors.success.withOpacity(0.1),
        textColor: AppColors.success,
      );

  factory AppBadge.warning(String label) => AppBadge(
        label: label,
        color: AppColors.warning.withOpacity(0.1),
        textColor: AppColors.warning,
      );

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: textColor,
          fontSize: 10,
          fontWeight: FontWeight.black,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
