/**
 * AGB CHANTIER - Formateurs d'Affichage BTP
 */

import { DateExtensions } from "../extensions/date_extensions";
import { NumberExtensions } from "../extensions/number_extensions";

export class Formatters {
  public static date(val: Date | string | null | undefined): string {
    return DateExtensions.toBtpDisplayDate(val);
  }

  public static dateTime(val: Date | string | null | undefined): string {
    return DateExtensions.toBtpDisplayDateTime(val);
  }

  public static currency(amount: number | null | undefined, currency = "FCFA"): string {
    return NumberExtensions.formatCurrency(amount, currency);
  }

  public static percent(val: number | null | undefined): string {
    return NumberExtensions.formatPercent(val);
  }

  public static quantity(val: number, unit?: string): string {
    return NumberExtensions.formatQuantity(val, unit);
  }

  public static phoneNumber(phone: string): string {
    if (!phone) return "-";
    // Format français / international standard
    const cleaned = phone.replace(/\s+/g, "");
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return phone;
  }
}
