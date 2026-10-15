/**
 * Jerarquía de errores de la aplicación.
 *
 * Un error que extiende AppError es un error ESPERADO: sabemos qué pasó, qué
 * código HTTP le corresponde y qué decirle al cliente. Cualquier otra cosa que
 * llegue al handler global es un fallo nuestro y se convierte en 500 genérico.
 */

export interface ErrorDetail {
  field: string;
  issue: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: ErrorDetail[] | undefined;

  constructor(statusCode: number, code: string, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, new.target);
  }
}

/** 400 — la petición está mal formada. No entendemos lo que pide. */
export class BadRequestError extends AppError {
  constructor(code: string, message: string, details?: ErrorDetail[]) {
    super(400, code, message, details);
  }
}

/** 404 — el recurso no existe. */
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

/** 409 — la petición choca con el estado actual del recurso. */
export class ConflictError extends AppError {
  constructor(code: string, message: string, details?: ErrorDetail[]) {
    super(409, code, message, details);
  }
}

/**
 * 422 — entendemos la petición, está bien formada, pero viola una regla de
 * negocio. La diferencia con 400 importa: 400 es "no te entiendo",
 * 422 es "te entiendo y no puedo hacerlo".
 */
export class UnprocessableError extends AppError {
  constructor(code: string, message: string, details?: ErrorDetail[]) {
    super(422, code, message, details);
  }
}
