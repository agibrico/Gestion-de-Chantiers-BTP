/**
 * AGB CHANTIER - Extensions & Utilitaires Chaînes de Caractères
 */

export class StringExtensions {
  public static capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  public static getInitials(name: string): string {
    if (!name) return "AGB";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  public static truncate(str: string, maxLength = 30): string {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  }

  public static slugify(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
}
