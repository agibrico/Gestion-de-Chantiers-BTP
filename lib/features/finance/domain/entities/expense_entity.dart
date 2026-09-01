import 'package:equatable/equatable.dart';

enum ExpenseCategory {
  MATERIAUX,
  MAIN_D_OEUVRE,
  EQUIPEMENT,
  TRANSPORT,
  HSE,
  ADMINISTRATIF,
  AUTRE,
}

enum PaymentMode {
  ESPECES,
  MOBILE_MONEY,
  VIREMENT,
  CHEQUE,
}

class ExpenseEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final String title;
  final double amount;
  final ExpenseCategory category;
  final DateTime date;
  final PaymentMode paymentMode;
  final String? referenceNumber; // N° de facture ou reçu
  final String? vendorName;
  final String? notes;
  final String? receiptImageUrl;
  final DateTime createdAt;

  const ExpenseEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
    required this.paymentMode,
    this.referenceNumber,
    this.vendorName,
    this.notes,
    this.receiptImageUrl,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        title,
        amount,
        category,
        date,
        paymentMode,
        referenceNumber,
        vendorName,
        notes,
        receiptImageUrl,
        createdAt,
      ];
}
