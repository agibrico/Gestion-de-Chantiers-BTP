/**
 * AGB CHANTIER - Gestionnaire Centralisé des Erreurs
 */

import { AppException, DatabaseException, NetworkException, PermissionDeniedException, ValidationException } from "./app_exception";
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure, PermissionFailure, ValidationFailure } from "./failure";

export class ErrorHandler {
  /**
   * Convertit une exception brute ou AppException en Failure typée
   */
  public static mapExceptionToFailure(error: unknown): Failure {
    if (error instanceof DatabaseException) {
      return new DatabaseFailure(error.message, error.code);
    }
    if (error instanceof PermissionDeniedException) {
      return new PermissionFailure(error.message, error.code);
    }
    if (error instanceof ValidationException) {
      return new ValidationFailure(error.validationErrors, error.message);
    }
    if (error instanceof NetworkException) {
      return new NetworkFailure(error.message, error.code);
    }
    if (error instanceof AppException) {
      return new GenericFailure(error.message);
    }
    if (error instanceof Error) {
      return new GenericFailure(error.message);
    }
    return new GenericFailure("Une erreur inconnue est survenue.");
  }

  /**
   * Enregistre l'erreur dans la console ou journal d'audit
   */
  public static log(error: unknown, context?: string): void {
    console.error(`[AGB CHANTIER ERROR] ${context ? `[${context}] ` : ""}`, error);
  }
}
