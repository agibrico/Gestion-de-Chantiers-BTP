import 'package:isar/isar.dart';
import '../../domain/entities/budget_entity.dart';
import '../../domain/entities/expense_entity.dart';

part 'finance_models.g.dart';

@collection
class BudgetModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(unique: true)
  late String projectId;
  
  late String projectName;
  late double totalAllocated;
  late Map<String, double> allocatedByCategory;
  late DateTime createdAt;
  late DateTime updatedAt;

  BudgetEntity toEntity() {
    return BudgetEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      totalAllocated: totalAllocated,
      allocatedByCategory: allocatedByCategory,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static BudgetModel fromEntity(BudgetEntity entity) {
    final model = BudgetModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.totalAllocated = entity.totalAllocated;
    model.allocatedByCategory = entity.allocatedByCategory;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@collection
class ExpenseModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late String title;
  late double amount;

  @enumerated
  late ExpenseCategory category;

  late DateTime date;

  @enumerated
  late PaymentMode paymentMode;

  String? referenceNumber;
  String? vendorName;
  String? notes;
  String? receiptImageUrl;
  late DateTime createdAt;

  ExpenseEntity toEntity() {
    return ExpenseEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      title: title,
      amount: amount,
      category: category,
      date: date,
      paymentMode: paymentMode,
      referenceNumber: referenceNumber,
      vendorName: vendorName,
      notes: notes,
      receiptImageUrl: receiptImageUrl,
      createdAt: createdAt,
    );
  }

  static ExpenseModel fromEntity(ExpenseEntity entity) {
    final model = ExpenseModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.title = entity.title;
    model.amount = entity.amount;
    model.category = entity.category;
    model.date = entity.date;
    model.paymentMode = entity.paymentMode;
    model.referenceNumber = entity.referenceNumber;
    model.vendorName = entity.vendorName;
    model.notes = entity.notes;
    model.receiptImageUrl = entity.receiptImageUrl;
    model.createdAt = entity.createdAt;
    return model;
  }
}
