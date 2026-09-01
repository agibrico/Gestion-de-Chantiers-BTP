import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/project_photo_entity.dart';
import '../../domain/repositories/photo_repository.dart';

// Events
abstract class PhotoEvent extends Equatable {
  const PhotoEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectPhotosRequested extends PhotoEvent {
  final String projectId;
  const LoadProjectPhotosRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class SavePhotoRequested extends PhotoEvent {
  final ProjectPhotoEntity photo;
  const SavePhotoRequested(this.photo);
  @override
  List<Object?> get props => [photo];
}

// States
abstract class PhotoState extends Equatable {
  const PhotoState();
  @override
  List<Object?> get props => [];
}

class PhotoInitial extends PhotoState {}
class PhotoLoading extends PhotoState {}
class PhotoLoaded extends PhotoState {
  final List<ProjectPhotoEntity> photos;
  const PhotoLoaded(this.photos);
  @override
  List<Object?> get props => [photos];
}
class PhotoOperationSuccess extends PhotoState {
  final String message;
  const PhotoOperationSuccess(this.message);
}
class PhotoError extends PhotoState {
  final String message;
  const PhotoError(this.message);
}

// Bloc
class PhotoBloc extends Bloc<PhotoEvent, PhotoState> {
  final PhotoRepository photoRepository;

  PhotoBloc({required this.photoRepository}) : super(PhotoInitial()) {
    on<LoadProjectPhotosRequested>(_onLoadPhotos);
    on<SavePhotoRequested>(_onSavePhoto);
  }

  Future<void> _onLoadPhotos(LoadProjectPhotosRequested event, Emitter<PhotoState> emit) async {
    emit(PhotoLoading());
    final result = await photoRepository.getPhotosByProject(event.projectId);
    result.fold(
      (failure) => emit(PhotoError(failure.message)),
      (photos) => emit(PhotoLoaded(photos)),
    );
  }

  Future<void> _onSavePhoto(SavePhotoRequested event, Emitter<PhotoState> emit) async {
    final result = await photoRepository.savePhoto(event.photo);
    result.fold(
      (failure) => emit(PhotoError(failure.message)),
      (_) {
        emit(const PhotoOperationSuccess('Photo enregistrée avec succès.'));
        add(LoadProjectPhotosRequested(event.photo.projectId));
      },
    );
  }
}
