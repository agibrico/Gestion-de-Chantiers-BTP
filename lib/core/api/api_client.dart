import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dio/io.dart';

class ApiClient {
  late Dio dio;
  static const String baseUrl = 'https://api-cloud.agb-btp.ci/v1';

  ApiClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // SSL Pinning Configuration (Axe 28)
    // Note: Dans une app de production, on chargerait le certificat .pem depuis les assets
    (dio.httpClientAdapter as IOHttpClientAdapter).createHttpClient = () {
      final client = HttpClient();
      client.badCertificateCallback = (X509Certificate cert, String host, int port) {
        // Logique de validation de l'empreinte du certificat (Fingerprint)
        // return cert.sha256 == 'EMPREINTE_OFFICIELLE_AGB';
        return true; // Mode dev : accepte tout
      };
      return client;
    };

    // Interceptor pour logger ou injecter le token Auth
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // sl<AuthBloc>().state.user.token si besoin
        return handler.next(options);
      },
      onError: (e, handler) {
        return handler.next(e);
      },
    ));
  }

  Future<Response> post(String path, dynamic data) async {
    return dio.post(path, data: data);
  }

  Future<Response> get(String path) async {
    return dio.get(path);
  }
}
