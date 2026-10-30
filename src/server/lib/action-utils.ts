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

export function ok<T = void>(data?: T): ActionSuccess<T> {
  return { success: true, data: data as T };
}

export function fail(error: string): ActionFailure {
  return { success: false, error, message: error };
}

export function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function isNonNegativeNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function isPositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}

