/**
 * AGB CHANTIER - Interface du Repository Pointage & Présences - AXE 08
 */

import {
  AttendanceRecordEntity,
  AttendanceFilterQuery,
  DailyAttendanceSummary,
  AttendanceStatus,
  WeatherCondition,
} from "../entities/attendance_entity";

export interface AttendanceRepository {
  getAttendanceRecords(query?: AttendanceFilterQuery): Promise<AttendanceRecordEntity[]>;
  getDailySummary(date: string, projectId: string): Promise<DailyAttendanceSummary>;
  recordAttendance(data: Omit<AttendanceRecordEntity, "id" | "createdAt" | "updatedAt">): Promise<AttendanceRecordEntity>;
  updateAttendance(record: AttendanceRecordEntity): Promise<AttendanceRecordEntity>;
  quickBatchStatusUpdate(recordIds: string[], status: AttendanceStatus, checkInTime?: string): Promise<void>;
  validateDailyShift(date: string, projectId: string, validatorName: string): Promise<void>;
  updateWeatherCondition(date: string, projectId: string, weather: WeatherCondition): Promise<void>;
  seedDailyAttendanceIfEmpty(date: string, projectId: string): Promise<void>;
}
