/**
 * AGB CHANTIER - Gestion fonctionnelle des échecs (Pattern Result / Either)
 */

export abstract class Failure {
  public readonly message: string;
  public readonly code?: string;

  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }
}

export class DatabaseFailure extends Failure {
  constructor(message = "Impossible d'accéder aux données locales.", code = "DB_FAILURE") {
    super(message, code);
  }
}

export class AuthFailure extends Failure {
  constructor(message = "Identifiants invalides ou session expirée.", code = "AUTH_FAILURE") {
    super(message, code);
  }
}

export class PermissionFailure extends Failure {
  constructor(message = "Vous n'avez pas l'autorisation pour effectuer cette action sur le chantier.", code = "PERMISSION_FAILURE") {
    super(message, code);
  }
}

export class ValidationFailure extends Failure {
  public readonly errors: Record<string, string>;
  constructor(errors: Record<string, string>, message = "Veuillez corriger les champs indiqués.") {
    super(message, "VALIDATION_FAILURE");
    this.errors = errors;
  }
}

export class NetworkFailure extends Failure {
  constructor(message = "Aucune connexion réseau. Les données ont été enregistrées localement.", code = "NETWORK_FAILURE") {
    super(message, code);
  }
}

export class GenericFailure extends Failure {
  constructor(message = "Une erreur inattendue est survenue.") {
    super(message, "GENERIC_FAILURE");
  }
}

/**
 * Result Container Pattern pour les UseCases
 */
export type Result<T, E = Failure> =
  | { success: true; data: T }
  | { success: false; failure: E };

export function Ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function Err<E extends Failure>(failure: E): Result<never, E> {
  return { success: false, failure };
}
