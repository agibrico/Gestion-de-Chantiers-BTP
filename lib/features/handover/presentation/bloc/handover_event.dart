import 'package:equatable/equatable.dart';
import '../../domain/entities/handover_entity.dart';

abstract class HandoverEvent extends Equatable {
  const HandoverEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectHandoversRequested extends HandoverEvent {
  final String projectId;
  const LoadProjectHandoversRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class SaveHandoverRequested extends HandoverEvent {
  final HandoverEntity handover;
  const SaveHandoverRequested(this.handover);
  @override
  List<Object?> get props => [handover];
}
