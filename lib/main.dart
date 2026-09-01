import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/di/injection_container.dart' as di;
import 'package:logger/logger.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Dependency Injection
  await di.init();
  
  runApp(const AgbChantierApp());
}
