/**
 * AGB CHANTIER - Extensions & Utilitaires de Dates
 */

export class DateExtensions {
  public static toBtpDisplayDate(date: Date | string | number | null | undefined): string {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }

  public static toBtpDisplayDateTime(date: Date | string | number | null | undefined): string {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  public static toIsoDateString(date: Date | string | number = new Date()): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  public static daysBetween(start: Date | string, end: Date | string): number {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public static isDelayed(targetDate: Date | string, status: string): boolean {
    if (status === "Terminé" || status === "Archivé") return false;
    const now = new Date();
    const target = new Date(targetDate);
    return target.getTime() < now.getTime();
  }
}
