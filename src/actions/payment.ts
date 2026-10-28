"use server";

import { db } from "@/db";
import { payment, type PaymentMethod, type PaymentStatus } from "@/db/schema";
import { eq, or, ilike, desc, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPayments({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {}) {
  const offset = (page - 1) * limit;

  const whereClause = search
    ? or(
        ilike(payment.note, `%${search}%`),
        ilike(payment.transactionId, `%${search}%`)
      )
    : undefined;

  const [paymentsList, [{ total }]] = await Promise.all([
    db.query.payment.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(payment.date)],
    }),
    db.select({ total: count() }).from(payment).where(whereClause),
  ]);

  return {
    payments: paymentsList.map((p) => ({ ...p, amount: Number(p.amount) })),
    metadata: {
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    },
  };
}

export async function createPayment(data: {
  amount: number;
  method: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
  date?: Date;
  note?: string;
}) {
  try {
    const [newPayment] = await db
      .insert(payment)
      .values({
        amount: String(data.amount),
        method: data.method,
        status: data.status || "COMPLETED",
        transactionId: data.transactionId,
        date: data.date || new Date(),
        note: data.note,
      })
      .returning();

    revalidatePath("/admin/payments");
    return { success: true, payment: { ...newPayment, amount: Number(newPayment.amount) } };
  } catch (error) {
    console.error("Failed to create payment:", error);
    return { success: false, error: "Failed to create payment" };
  }
}

export async function updatePayment(
  id: string,
  data: {
    amount: number;
    method: PaymentMethod;
    status?: PaymentStatus;
    transactionId?: string;
    date?: Date;
    note?: string;
  }
) {
  try {
    const [updatedPayment] = await db
      .update(payment)
      .set({
        amount: String(data.amount),
        method: data.method,
        status: data.status,
        transactionId: data.transactionId,
        date: data.date,
        note: data.note,
      })
      .where(eq(payment.id, id))
      .returning();

    revalidatePath("/admin/payments");
    return { success: true, payment: { ...updatedPayment, amount: Number(updatedPayment.amount) } };
  } catch (error) {
    console.error("Failed to update payment:", error);
    return { success: false, error: "Failed to update payment" };
  }
}

export async function deletePayment(id: string) {
  try {
    await db.delete(payment).where(eq(payment.id, id));

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete payment:", error);
    return { success: false, error: "Failed to delete payment" };
  }
}
