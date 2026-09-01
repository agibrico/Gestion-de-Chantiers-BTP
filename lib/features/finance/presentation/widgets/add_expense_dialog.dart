import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../bloc/finance_bloc.dart';
import '../../domain/entities/expense_entity.dart';

class AddExpenseDialog extends StatefulWidget {
  final String projectId;
  final String projectName;
  final Function(ExpenseEntity) onConfirm;

  const AddExpenseDialog({
    super.key,
    required this.projectId,
    required this.projectName,
    required this.onConfirm,
  });

  @override
  State<AddExpenseDialog> createState() => _AddExpenseDialogState();
}

class _AddExpenseDialogState extends State<AddExpenseDialog> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  final _vendorController = TextEditingController();
  final _refController = TextEditingController();
  
  ExpenseCategory _category = ExpenseCategory.MATERIAUX;
  PaymentMode _paymentMode = PaymentMode.ESPECES;

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    _vendorController.dispose();
    _refController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('NOUVELLE DÉPENSE', style: TextStyle(fontWeight: FontWeight.black, fontSize: 18)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppTextField(label: 'Libellé de la dépense', hint: 'Ex: Achat sacs de ciment', controller: _titleController),
            const SizedBox(height: 16),
            AppTextField(label: 'Montant (FCFA)', controller: _amountController, keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            const Text('CATÉGORIE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            DropdownButtonFormField<ExpenseCategory>(
              value: _category,
              items: ExpenseCategory.values.map((c) => DropdownMenuItem(value: c, child: Text(c.toString().split('.').last))).toList(),
              onChanged: (v) => setState(() => _category = v!),
            ),
            const SizedBox(height: 16),
            const Text('MODE DE PAIEMENT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            DropdownButtonFormField<PaymentMode>(
              value: _paymentMode,
              items: PaymentMode.values.map((m) => DropdownMenuItem(value: m, child: Text(m.toString().split('.').last.replaceAll('_', ' ')))).toList(),
              onChanged: (v) => setState(() => _paymentMode = v!),
            ),
            const SizedBox(height: 16),
            AppTextField(label: 'Fournisseur / Bénéficiaire', controller: _vendorController),
            const SizedBox(height: 16),
            AppTextField(label: 'N° Facture / Reçu', controller: _refController),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'ENREGISTRER',
          onPressed: () {
            if (_titleController.text.isNotEmpty && _amountController.text.isNotEmpty) {
              final expense = ExpenseEntity(
                id: const Uuid().v4(),
                projectId: widget.projectId,
                projectName: widget.projectName,
                title: _titleController.text,
                amount: double.tryParse(_amountController.text) ?? 0.0,
                category: _category,
                date: DateTime.now(),
                paymentMode: _paymentMode,
                vendorName: _vendorController.text,
                referenceNumber: _refController.text,
                createdAt: DateTime.now(),
              );
              widget.onConfirm(expense);
              Navigator.pop(context);
            }
          },
        ),
      ],
    );
  }
}
