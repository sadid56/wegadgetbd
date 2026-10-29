"use server";

import { db } from "@/db";
import { payment, type PaymentMethod, type PaymentStatus } from "@/db/schema";
import { eq, or, ilike, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, isValidDate, type ActionResult } from "./_utils";

const MAX_PAGE_SIZE = 100;
const MAX_AMOUNT = 1_000_000_000;
const MAX_NOTE_LENGTH = 2000;
const MAX_TXN_LENGTH = 200;
const DEFAULT_STATUS: PaymentStatus = "COMPLETED";

export type PaymentResult<T> = ActionResult<T>;

export interface GetPaymentsInput {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreatePaymentInput {
  amount: number;
  method: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  date?: Date;
  note?: string;
}

export type UpdatePaymentInput = Partial<CreatePaymentInput>;

function isValidAmount(a: unknown): a is number {
  return typeof a === "number" && Number.isFinite(a) && a > 0 && a <= MAX_AMOUNT;
}

function serializePayment<T extends { amount: unknown }>(p: T) {
  return { ...p, amount: Number(p.amount) };
}

function validateCreate(input: CreatePaymentInput): string | null {
  if (!isValidAmount(input.amount)) return "Invalid amount";
  if (!input.method) return "Payment method is required";
  if (input.note && input.note.length > MAX_NOTE_LENGTH) return "Note is too long";
  if (input.transactionId && input.transactionId.length > MAX_TXN_LENGTH) return "Transaction ID is too long";
  if (input.date !== undefined && !isValidDate(input.date)) return "Invalid payment date";
  return null;
}

export async function getPayments(input: GetPaymentsInput = {}) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return {
        payments: [],
        metadata: { total: 0, page: 1, limit: 10, totalPages: 1 },
      };
    }

    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, input.limit ?? 10));
    const search = input.search?.trim() ?? "";
    const offset = (page - 1) * limit;

    const whereClause = search ? or(ilike(payment.note, `%${search}%`), ilike(payment.transactionId, `%${search}%`))! : undefined;

    const [rows, [{ total }]] = await Promise.all([
      db.query.payment.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(payment.date)],
      }),
      db.select({ total: count() }).from(payment).where(whereClause),
    ]);

    return {
      payments: rows.map(serializePayment),
      metadata: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      },
    };
  } catch (err) {
    console.error("getPayments failed:", err);
    return {
      payments: [],
      metadata: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
}

export async function createPayment(input: CreatePaymentInput): Promise<PaymentResult<{ id: string }>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const validationError = validateCreate(input);
    if (validationError) return fail(validationError);

    const [created] = await db
      .insert(payment)
      .values({
        amount: String(input.amount),
        method: input.method,
        status: input.status ?? DEFAULT_STATUS,
        transactionId: input.transactionId?.trim() || null,
        date: input.date ?? new Date(),
        note: input.note?.trim() || null,
      })
      .returning({ id: payment.id });

    revalidatePath("/admin/payments");
    return ok({ id: created.id });
  } catch (err) {
    console.error("createPayment failed:", err);
    return fail("Failed to create payment");
  }
}

export async function updatePayment(id: string, input: UpdatePaymentInput): Promise<PaymentResult<{ id: string }>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const patch: Record<string, unknown> = {};
    if (input.amount !== undefined) {
      if (!isValidAmount(input.amount)) return fail("Invalid amount");
      patch.amount = String(input.amount);
    }
    if (input.method !== undefined) patch.method = input.method;
    if (input.status !== undefined) patch.status = input.status;
    if (input.transactionId !== undefined) patch.transactionId = input.transactionId?.trim() || null;
    if (input.date !== undefined) {
      if (!isValidDate(input.date)) return fail("Invalid payment date");
      patch.date = input.date;
    }
    if (input.note !== undefined) {
      if (input.note && input.note.length > MAX_NOTE_LENGTH) return fail("Note is too long");
      patch.note = input.note?.trim() || null;
    }

    if (Object.keys(patch).length === 0) return fail("No fields to update");

    const [updated] = await db
      .update(payment)
      .set(patch as any)
      .where(eq(payment.id, id))
      .returning({ id: payment.id });

    if (!updated) return fail("Payment not found");

    revalidatePath("/admin/payments");
    revalidatePath(`/admin/payments/${id}`);
    return ok({ id: updated.id });
  } catch (err) {
    console.error("updatePayment failed:", err);
    return fail("Failed to update payment");
  }
}

export async function deletePayment(id: string): Promise<PaymentResult<null>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const [deleted] = await db.delete(payment).where(eq(payment.id, id)).returning({ id: payment.id });

    if (!deleted) return fail("Payment not found");

    revalidatePath("/admin/payments");
    return ok(null);
  } catch (err) {
    console.error("deletePayment failed:", err);
    return fail("Failed to delete payment");
  }
}