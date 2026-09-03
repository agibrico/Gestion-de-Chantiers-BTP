/**
 * AGB CHANTIER - Entités du Domaine Pointage & Présences - AXE 08
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type AttendanceStatus =
  | "PRESENT"
  | "RETARD"
  | "ABSENT_JUSTIFIE"
  | "ABSENT_INJUSTIFIE"
  | "CONGE"
  | "INTEMPERIES";

export type WeatherCondition =
  | "BEAU_TEMPS"
  | "PLUIE_FORTE"
  | "CANICULE"
  | "VENT_VIOLENT"
  | "ORAGE";

export interface AttendanceRecordEntity extends BaseEntity {
  date: string; // YYYY-MM-DD
  workerId: string;
  workerName: string;
  workerTrade: string;
  registrationNumber?: string;
  teamId?: string;
  teamName?: string;
  projectId: string;
  projectName: string;
  
  status: AttendanceStatus;
  checkInTime?: string; // HH:mm (ex: "07:30")
  checkOutTime?: string; // HH:mm (ex: "17:00")
  regularHours: number; // ex: 8
  overtimeHours: number; // ex: 2
  dailyRateFCFA: number; // Taux journalier de base
  overtimeRatePerHourFCFA: number; // Taux horaire supplémentaire
  totalDayLaborCostFCFA: number; // Calculé
  
  weatherCondition?: WeatherCondition;
  isWeatherStoppage?: boolean; // Arrêt intempéries indemnisable
  
  isValidatedBySiteManager: boolean;
  validatorName?: string;
  validationTimestamp?: string;
  notes?: string;
}

export interface DailyAttendanceSummary {
  date: string;
  projectId: string;
  projectName: string;
  totalWorkersExpected: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalIntemperies: number;
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalLaborCostFCFA: number;
  isShiftClosed: boolean;
  weatherCondition: WeatherCondition;
}

export interface AttendanceFilterQuery {
  date?: string;
  projectId?: string;
  teamId?: string;
  status?: AttendanceStatus | "ALL";
  search?: string;
}
