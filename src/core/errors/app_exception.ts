/**
 * AGB CHANTIER - Exceptions de l'Application
 */

export abstract class AppException implements Error {
  public readonly name: string;
  public readonly message: string;
  public readonly code?: string;
  public readonly stack?: string;
  public readonly details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class DatabaseException extends AppException {
  constructor(message = "Erreur de base de données locale", code = "DB_ERROR", details?: unknown) {
    super(message, code, details);
  }
}

export class AuthException extends AppException {
  constructor(message = "Erreur d'authentification", code = "AUTH_ERROR", details?: unknown) {
    super(message, code, details);
  }
}

export class PermissionDeniedException extends AppException {
  constructor(message = "Accès refusé : permissions insuffisantes", code = "PERMISSION_DENIED", details?: unknown) {
    super(message, code, details);
  }
}

export class ValidationException extends AppException {
  public readonly validationErrors: Record<string, string>;
  constructor(validationErrors: Record<string, string>, message = "Données de formulaire invalides") {
    super(message, "VALIDATION_ERROR", validationErrors);
    this.validationErrors = validationErrors;
  }
}

export class NetworkException extends AppException {
  constructor(message = "Erreur de connexion réseau", code = "NETWORK_ERROR", details?: unknown) {
    super(message, code, details);
  }
}

export class SyncException extends AppException {
  constructor(message = "Échec de synchronisation", code = "SYNC_ERROR", details?: unknown) {
    super(message, code, details);
  }
}

export class NotFoundException extends AppException {
  constructor(entityName: string, id?: string) {
    super(`${entityName} ${id ? `avec l'ID ${id}` : ""} introuvable.`, "NOT_FOUND");
  }
}
