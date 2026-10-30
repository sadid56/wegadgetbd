import { db } from "@/db";
import { payment } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { isValidDate } from "@/server/lib/action-utils";
import {
  DEFAULT_STATUS,
  isValidAmount,
  validateCreate,
  type CreatePaymentInput,
  type UpdatePaymentInput,
} from "./_shared";

export class CreatePaymentUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: CreatePaymentInput) {
    const validationError = validateCreate(input);
    if (validationError) {
      return { success: false as const, error: validationError, message: validationError };
    }

    try {
      const [created] = await this.dbInstance
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

      return { success: true as const, data: { id: created.id } };
    } catch (err: any) {
      console.error("CreatePaymentUseCase failed:", err);
      const msg = err?.message || "Failed to create payment";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

export class UpdatePaymentUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string, input: UpdatePaymentInput) {
    const patch: Record<string, unknown> = {};
    if (input.amount !== undefined) {
      if (!isValidAmount(input.amount)) return { success: false as const, error: "Invalid amount", message: "Invalid amount" };
      patch.amount = String(input.amount);
    }
    if (input.method !== undefined) patch.method = input.method;
    if (input.status !== undefined) patch.status = input.status;
    if (input.transactionId !== undefined) patch.transactionId = input.transactionId?.trim() || null;
    if (input.date !== undefined) {
      if (!isValidDate(input.date)) return { success: false as const, error: "Invalid payment date", message: "Invalid payment date" };
      patch.date = input.date;
    }
    if (input.note !== undefined) patch.note = input.note?.trim() || null;

    if (!Object.keys(patch).length) {
      return { success: false as const, error: "No fields to update", message: "No fields to update" };
    }

    try {
      const [updated] = await this.dbInstance
        .update(payment)
        .set(patch)
        .where(eq(payment.id, id))
        .returning({ id: payment.id });

      if (!updated) {
        return { success: false as const, error: "Payment not found", message: "Payment not found" };
      }

      return { success: true as const, data: { id: updated.id } };
    } catch (err: any) {
      console.error("UpdatePaymentUseCase failed:", err);
      const msg = err?.message || "Failed to update payment";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

export class DeletePaymentUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(id: string) {
    try {
      const [deleted] = await this.dbInstance.delete(payment).where(eq(payment.id, id)).returning({ id: payment.id });
      if (!deleted) {
        return { success: false as const, error: "Payment not found", message: "Payment not found" };
      }
      return { success: true as const, data: undefined };
    } catch (err: any) {
      console.error("DeletePaymentUseCase failed:", err);
      const msg = err?.message || "Failed to delete payment";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

