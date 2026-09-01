/**
 * AGB CHANTIER - Validateurs de Formulaires Robustes
 */

export class FormValidators {
  public static required(value: unknown, fieldName = "Ce champ"): string | null {
    if (value === null || value === undefined) return `${fieldName} est obligatoire.`;
    if (typeof value === "string" && value.trim().length === 0) return `${fieldName} est obligatoire.`;
    if (Array.isArray(value) && value.length === 0) return `${fieldName} doit contenir au moins un élément.`;
    return null;
  }

  public static email(value: string): string | null {
    if (!value || value.trim().length === 0) return null; // Use required for mandatory
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return "Adresse email invalide.";
    }
    return null;
  }

  public static phone(value: string): string | null {
    if (!value || value.trim().length === 0) return null;
    const phoneRegex = /^(\+?[0-9\s-]{8,18})$/;
    if (!phoneRegex.test(value.trim())) {
      return "Numéro de téléphone invalide (au moins 8 chiffres).";
    }
    return null;
  }

  public static minNumber(value: number, min: number, fieldName = "Ce montant"): string | null {
    if (value === null || value === undefined || isNaN(value)) return `${fieldName} doit être un nombre valide.`;
    if (value < min) return `${fieldName} doit être supérieur ou égal à ${min}.`;
    return null;
  }

  public static positiveNumber(value: number, fieldName = "La valeur"): string | null {
    return this.minNumber(value, 0, fieldName);
  }

  public static dateOrder(startDate: string, endDate: string, message = "La date de fin doit être postérieure à la date de début."): string | null {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end.getTime() < start.getTime()) {
      return message;
    }
    return null;
  }
}
