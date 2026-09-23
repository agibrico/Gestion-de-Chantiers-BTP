/**
 * AGB CHANTIER - Extensions & Utilitaires Numériques et Financiers
 */

export class NumberExtensions {
  /**
   * Formate un montant en devise BTP (ex: "15 000 000 FCFA" ou "12 500 €")
   */
  public static formatCurrency(
    amount: number | null | undefined,
    currency = "FCFA",
    decimals = 0
  ): string {
    if (amount === null || amount === undefined || isNaN(amount)) return `0 ${currency}`;
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
    return `${formatted} ${currency}`;
  }

  /**
   * Formate un pourcentage d'avancement de chantier (ex: "78.5 %")
   */
  public static formatPercent(value: number | null | undefined, decimals = 1): string {
    if (value === null || value === undefined || isNaN(value)) return "0%";
    const clamped = Math.min(100, Math.max(0, value));
    return `${clamped.toFixed(decimals).replace(".", ",")}%`;
  }

  /**
   * Formate une quantité physique BTP (ex: "12,50 m³", "450 sacs")
   */
  public static formatQuantity(quantity: number, unit?: string): string {
    const formatted = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 2,
    }).format(quantity);
    return unit ? `${formatted} ${unit}` : formatted;
  }
}
