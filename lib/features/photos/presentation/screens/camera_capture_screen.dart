import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:geolocator/geolocator.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../authentication/presentation/bloc/auth_bloc.dart';
import '../../../authentication/presentation/bloc/auth_state.dart';
import '../../domain/entities/project_photo_entity.dart';
import '../bloc/photo_bloc.dart';

class CameraCaptureScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const CameraCaptureScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<CameraCaptureScreen> createState() => _CameraCaptureScreenState();
}

class _CameraCaptureScreenState extends State<CameraCaptureScreen> {
  CameraController? _controller;
  List<CameraDescription>? _cameras;
  bool _isCameraInitialized = false;
  Position? _currentPosition;
  XFile? _capturedFile;
  final _descController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _getCurrentLocation();
  }

  Future<void> _initializeCamera() async {
    _cameras = await availableCameras();
    if (_cameras != null && _cameras!.isNotEmpty) {
      _controller = CameraController(_cameras![0], ResolutionPreset.high);
      await _controller!.initialize();
      if (!mounted) return;
      setState(() => _isCameraInitialized = true);
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }

      _currentPosition = await Geolocator.getCurrentPosition();
      if (mounted) setState(() {});
    } catch (e) {
      debugPrint("Error getting location: $e");
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _takePicture() async {
    if (_controller == null || !_controller!.value.isInitialized) return;
    try {
      final file = await _controller!.takePicture();
      setState(() => _capturedFile = file);
    } catch (e) {
      debugPrint("Error taking picture: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_capturedFile != null) return _buildPreviewUI();

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('PRISE DE VUE CHANTIER'),
      ),
      body: Stack(
        children: [
          if (_isCameraInitialized)
            Center(child: CameraPreview(_controller!))
          else
            const Center(child: CircularProgressIndicator(color: AppColors.orangeSecurite)),
            
          // Location Overlay
          Positioned(
            top: 20,
            left: 20,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
              child: Row(
                children: [
                  Icon(LucideIcons.mapPin, color: _currentPosition != null ? Colors.green : Colors.red, size: 14),
                  const SizedBox(width: 8),
                  Text(
                    _currentPosition != null ? "GPS OK" : "GPS EN RECHERCHE...",
                    style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          
          // Controls
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const SizedBox(width: 60),
                GestureDetector(
                  onTap: _takePicture,
                  child: Container(
                    height: 80,
                    width: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                    ),
                    child: Center(
                      child: Container(
                        height: 60,
                        width: 60,
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.refreshCw, color: Colors.white, size: 30),
                  onPressed: () {
                    // Switch camera logic if needed
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreviewUI() {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('VALIDATION PHOTO')),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AspectRatio(
              aspectRatio: 4 / 3,
              child: Image.file(File(_capturedFile!.path), fit: BoxImage.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  AppTextField(
                    label: 'DESCRIPTION DE LA PHOTO', 
                    hint: 'Ex: État du ferraillage, Problème de fuite...',
                    controller: _descController,
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      const Icon(LucideIcons.mapPin, size: 14, color: AppColors.orangeSecurite),
                      const SizedBox(width: 8),
                      Text(
                        _currentPosition != null 
                          ? '${_currentPosition!.latitude.toStringAsFixed(6)}, ${_currentPosition!.longitude.toStringAsFixed(6)}'
                          : 'Aucune donnée GPS',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 40),
                  AppButton(
                    text: 'ENREGISTRER DANS LA GALERIE',
                    onPressed: _savePhotoToGallery,
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () => setState(() => _capturedFile = null),
                    child: const Text('REPRENDRE LA PHOTO', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _savePhotoToGallery() {
    final authState = context.read<AuthBloc>().state;
    String author = "Inconnu";
    if (authState is Authenticated) author = authState.user.fullName;

    final photo = ProjectPhotoEntity(
      id: const Uuid().v4(),
      projectId: widget.projectId,
      projectName: widget.projectName,
      filePath: _capturedFile!.path,
      description: _descController.text,
      latitude: _currentPosition?.latitude,
      longitude: _currentPosition?.longitude,
      date: DateTime.now(),
      authorName: author,
      createdAt: DateTime.now(),
    );

    context.read<PhotoBloc>().add(SavePhotoRequested(photo));
    Navigator.pop(context);
  }
}
