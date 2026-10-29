/**
 * Standardized Server Action Results and Utilities
 */

export type ActionSuccess<T = any> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: string;
  message: string;
};

export type ActionResult<T = any> = ActionSuccess<T> | ActionFailure;

/**
 * Success helper returning a standardized { success: true, data } response
 */
export function ok<T = void>(data?: T): ActionSuccess<T> {
  return { success: true, data: data as T };
}

/**
 * Failure helper returning a standardized { success: false, error, message } response
 */
export function fail(error: string): ActionFailure {
  return { success: false, error, message: error };
}

/**
 * Wraps an async operation safely, returning standard ok(data) or fail(message)
 */
export async function tryAction<T>(
  operation: () => Promise<T>,
  fallbackMessage: string = "An unexpected error occurred",
): Promise<ActionResult<T>> {
  try {
    const data = await operation();
    return ok(data);
  } catch (err: any) {
    console.error(fallbackMessage, err);
    return fail(err?.message || fallbackMessage);
  }
}

/**
 * Common input validation utilities
 */
export function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function isNonNegativeNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function isPositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}
