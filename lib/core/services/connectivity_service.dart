import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

enum AppConnectivityStatus { online, offline }

class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  final StreamController<AppConnectivityStatus> _statusController = StreamController<AppConnectivityStatus>.broadcast();

  ConnectivityService() {
    _connectivity.onConnectivityChanged.listen((results) {
      // connectivity_plus 6.x returns a List<ConnectivityResult>
      final hasConnection = results.any((result) => result != ConnectivityResult.none);
      _statusController.add(hasConnection ? AppConnectivityStatus.online : AppConnectivityStatus.offline);
    });
  }

  Stream<AppConnectivityStatus> get statusStream => _statusController.stream;

  Future<bool> get isOnline async {
    final results = await _connectivity.checkConnectivity();
    return results.any((result) => result != ConnectivityResult.none);
  }
}
