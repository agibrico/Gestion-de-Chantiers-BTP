import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:agb_chantier/core/widgets/app_button.dart';

void main() {
  group('AppButton Widget Test', () {
    testWidgets('should display text correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppButton(text: 'Valider'),
          ),
        ),
      );

      expect(find.text('VALIDER'), findOneWidget); // Note: AppButton calls toUpperCase()
    });

    testWidgets('should call onPressed when tapped', (WidgetTester tester) async {
      bool pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppButton(
              text: 'Tap Me',
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(AppButton));
      expect(pressed, true);
    });

    testWidgets('should display loading indicator when isLoading is true', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppButton(
              text: 'Wait',
              isLoading: true,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findOneWidget);
      expect(find.text('WAIT'), findNothing);
    });
  });
}
