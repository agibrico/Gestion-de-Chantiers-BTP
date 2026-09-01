/**
 * AGB CHANTIER - Implémentation Repository Pointage & Présences - AXE 08
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  AttendanceRecordEntity,
  AttendanceFilterQuery,
  DailyAttendanceSummary,
  AttendanceStatus,
  WeatherCondition,
} from "../domain/entities/attendance_entity";
import { AttendanceRepository } from "../domain/repositories/attendance_repository";
import { WorkerEntity } from "../../teams/domain/entities/worker_entity";

const DEFAULT_WORKERS_SEED: Array<{
  name: string;
  trade: string;
  reg: string;
  rate: number;
  team: string;
}> = [
  { name: "M. Traoré Souleymane", trade: "Chef d'Équipe Maçon", reg: "MAT-2026-081", rate: 18000, team: "Équipe Gros Œuvre Alpha" },
  { name: "Kouakou Jean-Yves", trade: "Chef Ferrailleur", reg: "MAT-2026-082", rate: 16000, team: "Équipe Ferraillage & Armatures" },
  { name: "Bakayoko Amadou", trade: "Maçon Finisseur", reg: "MAT-2026-083", rate: 12000, team: "Équipe Gros Œuvre Alpha" },
  { name: "Diallo Ousmane", trade: "Grutier & Conducteur d'Engins", reg: "MAT-2026-084", rate: 22000, team: "Équipe Gros Œuvre Alpha" },
  { name: "Koffi N'Guessan", trade: "Électricien BTP", reg: "MAT-2026-085", rate: 14000, team: "Équipe Électricité & Fluides" },
  { name: "Koné Drissa", trade: "Plombier / Canalisateur", reg: "MAT-2026-086", rate: 13500, team: "Équipe Électricité & Fluides" },
  { name: "Yao Franck", trade: "Ferrailleur Coffreur", reg: "MAT-2026-087", rate: 11000, team: "Équipe Ferraillage & Armatures" },
  { name: "Cissé Mamadou", trade: "Manoeuvre Polyvalent", reg: "MAT-2026-088", rate: 8000, team: "Équipe Gros Œuvre Alpha" },
  { name: "Bamba Lassina", trade: "Manoeuvre VRD", reg: "MAT-2026-089", rate: 8000, team: "Équipe VRD & Terrassement" },
  { name: "Diarra Seydou", trade: "Topographe Aide", reg: "MAT-2026-090", rate: 15000, team: "Équipe VRD & Terrassement" },
];

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private static instance: AttendanceRepositoryImpl | null = null;

  public static getInstance(): AttendanceRepositoryImpl {
    if (!this.instance) {
      this.instance = new AttendanceRepositoryImpl();
    }
    return this.instance;
  }

  public async seedDailyAttendanceIfEmpty(date: string, projectId: string): Promise<void> {
    try {
      const allRecords = await IdbAdapter.getAll<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE);
      const existing = allRecords.filter((r) => r.date === date && r.projectId === projectId);

      if (existing.length === 0) {
        // Try getting real workers from storage
        let workers = await IdbAdapter.getAll<WorkerEntity>("workers" as any).catch(() => []);
        const now = new Date().toISOString();

        if (workers.length === 0) {
          // Use default workers seed
          for (let i = 0; i < DEFAULT_WORKERS_SEED.length; i++) {
            const w = DEFAULT_WORKERS_SEED[i];
            const isLate = i === 4;
            const isAbsent = i === 7;
            const status: AttendanceStatus = isAbsent
              ? "ABSENT_JUSTIFIE"
              : isLate
              ? "RETARD"
              : "PRESENT";
            const checkIn = isAbsent ? undefined : isLate ? "08:15" : "07:30";
            const checkOut = isAbsent ? undefined : "17:00";
            const regHours = isAbsent ? 0 : 8;
            const otHours = i === 0 || i === 3 ? 2 : 0;
            const otRate = Math.round(w.rate / 8 * 1.5);
            const totalCost = isAbsent ? 0 : w.rate + otHours * otRate;

            const record: AttendanceRecordEntity = {
              id: `att_${date}_${i}_${projectId}`,
              date,
              workerId: `w_${i}`,
              workerName: w.name,
              workerTrade: w.trade,
              registrationNumber: w.reg,
              teamName: w.team,
              projectId,
              projectName: projectId === "prj_002" ? "Résidence Les Jardins de la Riviera" : "Tour Horizon R+14 (Plateau)",
              status,
              checkInTime: checkIn,
              checkOutTime: checkOut,
              regularHours: regHours,
              overtimeHours: otHours,
              dailyRateFCFA: w.rate,
              overtimeRatePerHourFCFA: otRate,
              totalDayLaborCostFCFA: totalCost,
              weatherCondition: "BEAU_TEMPS",
              isValidatedBySiteManager: false,
              createdAt: now,
              updatedAt: now,
              syncStatus: "synced",
            };
            await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, record);
          }
        }
      }
    } catch (e) {
      console.warn("Seeding attendance warning", e);
    }
  }

  public async getAttendanceRecords(query?: AttendanceFilterQuery): Promise<AttendanceRecordEntity[]> {
    const today = query?.date || new Date().toISOString().split("T")[0];
    const prjId = query?.projectId || "prj_001";

    await this.seedDailyAttendanceIfEmpty(today, prjId);
    let records = await IdbAdapter.getAll<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE);

    if (query) {
      if (query.date) {
        records = records.filter((r) => r.date === query.date);
      }
      if (query.projectId && query.projectId !== "ALL") {
        records = records.filter((r) => r.projectId === query.projectId);
      }
      if (query.status && query.status !== "ALL") {
        records = records.filter((r) => r.status === query.status);
      }
      if (query.search && query.search.trim()) {
        const s = query.search.toLowerCase();
        records = records.filter(
          (r) =>
            r.workerName.toLowerCase().includes(s) ||
            r.workerTrade.toLowerCase().includes(s) ||
            (r.registrationNumber && r.registrationNumber.toLowerCase().includes(s)) ||
            (r.teamName && r.teamName.toLowerCase().includes(s))
        );
      }
    }

    return records.sort((a, b) => a.workerName.localeCompare(b.workerName));
  }

  public async getDailySummary(date: string, projectId: string): Promise<DailyAttendanceSummary> {
    const records = await this.getAttendanceRecords({ date, projectId });
    const totalWorkersExpected = records.length;
    const totalPresent = records.filter((r) => r.status === "PRESENT").length;
    const totalLate = records.filter((r) => r.status === "RETARD").length;
    const totalAbsent = records.filter(
      (r) => r.status === "ABSENT_JUSTIFIE" || r.status === "ABSENT_INJUSTIFIE" || r.status === "CONGE"
    ).length;
    const totalIntemperies = records.filter((r) => r.status === "INTEMPERIES").length;

    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalLaborCostFCFA = 0;
    let isShiftClosed = false;
    let weatherCondition: WeatherCondition = "BEAU_TEMPS";

    for (const r of records) {
      totalRegularHours += r.regularHours || 0;
      totalOvertimeHours += r.overtimeHours || 0;
      totalLaborCostFCFA += r.totalDayLaborCostFCFA || 0;
      if (r.isValidatedBySiteManager) isShiftClosed = true;
      if (r.weatherCondition) weatherCondition = r.weatherCondition;
    }

    return {
      date,
      projectId,
      projectName: records[0]?.projectName || "Chantier Principal",
      totalWorkersExpected,
      totalPresent,
      totalLate,
      totalAbsent,
      totalIntemperies,
      totalRegularHours,
      totalOvertimeHours,
      totalLaborCostFCFA,
      isShiftClosed,
      weatherCondition,
    };
  }

  public async recordAttendance(
    data: Omit<AttendanceRecordEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<AttendanceRecordEntity> {
    const now = new Date().toISOString();
    const newRecord: AttendanceRecordEntity = {
      ...data,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, newRecord);
    return newRecord;
  }

  public async updateAttendance(record: AttendanceRecordEntity): Promise<AttendanceRecordEntity> {
    // Recalculate total labor cost
    let hours = record.regularHours;
    if (record.status === "ABSENT_INJUSTIFIE" || record.status === "ABSENT_JUSTIFIE") {
      hours = 0;
    }
    const otRate = record.overtimeRatePerHourFCFA || Math.round(record.dailyRateFCFA / 8 * 1.5);
    const dayCost = hours > 0 ? record.dailyRateFCFA + (record.overtimeHours || 0) * otRate : 0;

    const updated: AttendanceRecordEntity = {
      ...record,
      totalDayLaborCostFCFA: dayCost,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, updated);
    return updated;
  }

  public async quickBatchStatusUpdate(
    recordIds: string[],
    status: AttendanceStatus,
    checkInTime?: string
  ): Promise<void> {
    const records = await IdbAdapter.getAll<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE);
    const targetRecords = records.filter((r) => recordIds.includes(r.id));

    for (const r of targetRecords) {
      const isAbsent = status === "ABSENT_JUSTIFIE" || status === "ABSENT_INJUSTIFIE" || status === "CONGE";
      const isIntemperie = status === "INTEMPERIES";
      const regHours = isAbsent ? 0 : isIntemperie ? 4 : 8;
      const otRate = r.overtimeRatePerHourFCFA || Math.round(r.dailyRateFCFA / 8 * 1.5);
      const dayCost = isAbsent ? 0 : isIntemperie ? Math.round(r.dailyRateFCFA * 0.5) : r.dailyRateFCFA + (r.overtimeHours || 0) * otRate;

      const updated: AttendanceRecordEntity = {
        ...r,
        status,
        checkInTime: isAbsent ? undefined : checkInTime || r.checkInTime || "07:30",
        regularHours: regHours,
        totalDayLaborCostFCFA: dayCost,
        updatedAt: new Date().toISOString(),
      };
      await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, updated);
    }
  }

  public async validateDailyShift(date: string, projectId: string, validatorName: string): Promise<void> {
    const records = await IdbAdapter.getAll<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE);
    const targetRecords = records.filter((r) => r.date === date && r.projectId === projectId);
    const now = new Date().toISOString();

    for (const r of targetRecords) {
      const updated: AttendanceRecordEntity = {
        ...r,
        isValidatedBySiteManager: true,
        validatorName,
        validationTimestamp: now,
        updatedAt: now,
      };
      await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, updated);
    }
  }

  public async updateWeatherCondition(date: string, projectId: string, weather: WeatherCondition): Promise<void> {
    const records = await IdbAdapter.getAll<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE);
    const targetRecords = records.filter((r) => r.date === date && r.projectId === projectId);

    for (const r of targetRecords) {
      const updated: AttendanceRecordEntity = {
        ...r,
        weatherCondition: weather,
        updatedAt: new Date().toISOString(),
      };
      await IdbAdapter.put<AttendanceRecordEntity>(IdbAdapter.STORES.ATTENDANCE, updated);
    }
  }
}
