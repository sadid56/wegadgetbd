import { type PaymentMethod, type PaymentStatus } from "@/db/schema";
import { isValidDate } from "@/server/lib/action-utils";

export const MAX_PAGE_SIZE = 100;
export const MAX_AMOUNT = 1_000_000_000;
export const MAX_NOTE_LENGTH = 2000;
export const MAX_TXN_LENGTH = 200;
export const DEFAULT_STATUS: PaymentStatus = "COMPLETED";

export interface CreatePaymentInput {
  amount: number;
  method: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  date?: Date;
  note?: string;
}

export type UpdatePaymentInput = Partial<CreatePaymentInput>;

export function isValidAmount(a: unknown): a is number {
  return typeof a === "number" && Number.isFinite(a) && a > 0 && a <= MAX_AMOUNT;
}

export function serializePayment<T extends { amount: unknown }>(p: T) {
  return { ...p, amount: Number(p.amount) };
}

export function validateCreate(input: CreatePaymentInput): string | null {
  if (!isValidAmount(input.amount)) return "Invalid amount";
  if (!input.method) return "Payment method is required";
  if (input.note && input.note.length > MAX_NOTE_LENGTH) return "Note is too long";
  if (input.transactionId && input.transactionId.length > MAX_TXN_LENGTH) return "Transaction ID is too long";
  if (input.date !== undefined && !isValidDate(input.date)) return "Invalid payment date";
  return null;
}

