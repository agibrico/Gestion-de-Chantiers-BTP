import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:agb_chantier/features/authentication/data/repositories/auth_repository_impl.dart';
import 'package:agb_chantier/features/authentication/domain/entities/user_entity.dart';

class MockSharedPreferences extends Mock implements SharedPreferences {}

void main() {
  late AuthRepositoryImpl repository;
  late MockSharedPreferences mockSharedPreferences;

  setUp(() {
    mockSharedPreferences = MockSharedPreferences();
    repository = AuthRepositoryImpl(sharedPreferences: mockSharedPreferences);
  });

  group('AuthRepository', () {
    test('login should return success when credentials are valid', () async {
      // Arrange
      when(() => mockSharedPreferences.setString(any(), any())).thenAnswer((_) async => true);
      
      // Act
      final result = await repository.login('admin@agb.ci', 'admin');
      
      // Assert
      expect(result.isRight(), true);
      verify(() => mockSharedPreferences.setString('user_data', any())).called(1);
    });

    test('login should return failure when credentials are invalid', () async {
      // Act
      final result = await repository.login('wrong@email.com', 'wrong');
      
      // Assert
      expect(result.isLeft(), true);
    });

    test('logout should clear shared preferences', () async {
      // Arrange
      when(() => mockSharedPreferences.remove(any())).thenAnswer((_) async => true);
      
      // Act
      await repository.logout();
      
      // Assert
      verify(() => mockSharedPreferences.remove('user_data')).called(1);
    });
  });
}
