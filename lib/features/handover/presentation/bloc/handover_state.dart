import 'package:equatable/equatable.dart';
import '../../domain/entities/handover_entity.dart';

abstract class HandoverState extends Equatable {
  const HandoverState();
  @override
  List<Object?> get props => [];
}

class HandoverInitial extends HandoverState {}
class HandoverLoading extends HandoverState {}

class HandoversLoaded extends HandoverState {
  final List<HandoverEntity> handovers;
  const HandoversLoaded(this.handovers);
  @override
  List<Object?> get props => [handovers];
}

class HandoverOperationSuccess extends HandoverState {
  final String message;
  const HandoverOperationSuccess(this.message);
}

class HandoverError extends HandoverState {
  final String message;
  const HandoverError(this.message);
}
