import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/project_photo_entity.dart';
import '../bloc/photo_bloc.dart';
import 'package:intl/intl.dart';

class PhotoGalleryScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const PhotoGalleryScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<PhotoGalleryScreen> createState() => _PhotoGalleryScreenState();
}

class _PhotoGalleryScreenState extends State<PhotoGalleryScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PhotoBloc>().add(LoadProjectPhotosRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('GALERIE PHOTOS'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<PhotoBloc, PhotoState>(
        builder: (context, state) {
          if (state is PhotoLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is PhotoLoaded) {
            final photos = state.photos;
            if (photos.isEmpty) return _buildEmptyState();

            return GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.8,
              ),
              itemCount: photos.length,
              itemBuilder: (context, index) {
                final photo = photos[index];
                return _buildPhotoCard(photo);
              },
            );
          }
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.camera, color: Colors.white),
        onPressed: () => context.push('/projects/${widget.projectId}/camera?projectName=${widget.projectName}'),
      ),
    );
  }

  Widget _buildPhotoCard(ProjectPhotoEntity photo) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _showPhotoDetails(photo),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Image.file(
                File(photo.filePath),
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Colors.grey[200],
                  child: const Icon(LucideIcons.imageOff, color: Colors.grey),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    photo.description ?? "Sans description",
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(LucideIcons.calendar, size: 10, color: AppColors.textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        DateFormat('dd/MM/yy').format(photo.date),
                        style: const TextStyle(fontSize: 9, color: AppColors.textSecondary),
                      ),
                      const Spacer(),
                      if (photo.latitude != null)
                        const Icon(LucideIcons.mapPin, size: 10, color: Colors.green),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.images, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune photo pour ce chantier.'),
        ],
      ),
    );
  }

  void _showPhotoDetails(ProjectPhotoEntity photo) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: EdgeInsets.zero,
        child: Stack(
          children: [
            Center(child: Image.file(File(photo.filePath))),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(LucideIcons.xCircle, color: Colors.white, size: 30),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(24),
                color: Colors.black54,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(photo.description?.toUpperCase() ?? "SANS DESCRIPTION", 
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.black, fontSize: 16)),
                    const SizedBox(height: 8),
                    Text('Capturée le : ${DateFormat('dd MMMM yyyy HH:mm').format(photo.date)}', 
                      style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    if (photo.latitude != null) ...[
                      const SizedBox(height: 4),
                      Text('GPS : ${photo.latitude}, ${photo.longitude}', 
                        style: const TextStyle(color: AppColors.orangeSecurite, fontSize: 10, fontWeight: FontWeight.bold)),
                    ],
                    const SizedBox(height: 8),
                    Text('Par : ${photo.authorName}', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
