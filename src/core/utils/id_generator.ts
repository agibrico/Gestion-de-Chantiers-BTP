/**
 * AGB CHANTIER - Générateur d'Identifiants Métier BTP & UUIDs
 */

export class IdGenerator {
  /**
   * Génère un UUID v4 standard
   */
  public static uuid(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Génère un matricule métier professionnel lisible (ex: CHT-2026-042)
   */
  public static generateBtpCode(prefix: "CHT" | "CLT" | "INT" | "TSK" | "STK" | "CMD" | "DEP" | "ENG" | "JRN" | "HSE" | "RES" | "DOC" | "RCP", sequenceNumber: number): string {
    const year = new Date().getFullYear();
    const padded = sequenceNumber.toString().padStart(4, "0");
    return `${prefix}-${year}-${padded}`;
  }

  /**
   * Génère un code court aléatoire (ex: pour QR Codes / Badges)
   */
  public static generateShortCode(prefix = "AGB"): string {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${rand}`;
  }
}
