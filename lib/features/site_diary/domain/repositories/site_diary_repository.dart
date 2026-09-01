import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/site_diary_entity.dart';

abstract class SiteDiaryRepository {
  Future<Either<Failure, List<SiteDiaryEntry>>> getEntriesByProject(String projectId);
  
  Future<Either<Failure, SiteDiaryEntry?>> getEntryByProjectAndDate(String projectId, DateTime date);
  
  Future<Either<Failure, SiteDiaryEntry>> createEntry(SiteDiaryEntry entry);
  
  Future<Either<Failure, SiteDiaryEntry>> updateEntry(SiteDiaryEntry entry);
  
  Future<Either<Failure, void>> deleteEntry(String id);
}
