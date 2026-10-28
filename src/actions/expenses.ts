"use server";

import { db } from "@/db";
import { expense } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { desc, gte, sql } from "drizzle-orm";

const EXPENSE_PASSWORD = "Ttttt5656";

export async function verifyExpensePassword(password: string) {
  const session = await requireAdmin();
  if (!session) return { success: false, message: "Unauthorized" };

  if (password !== EXPENSE_PASSWORD) {
    return { success: false, message: "Invalid password" };
  }

  return { success: true };
}

export async function createExpense(input: { amount: number; note?: string; date?: Date; password: string }) {
  const auth = await verifyExpensePassword(input.password);
  if (!auth.success) return auth;

  try {
    await db.insert(expense).values({
      amount: String(input.amount),
      note: input.note || "",
      date: input.date || new Date(),
    });

    revalidatePath("/admin/expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to create expense", error);
    return { success: false, message: "Failed to create expense" };
  }
}

export async function getExpenseSummary(password: string) {
  const auth = await verifyExpensePassword(password);
  if (!auth.success) return { success: false, message: auth.message };

  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(now.getDate() - 30);

  const lastYear = new Date(now);
  lastYear.setFullYear(now.getFullYear() - 1);

  try {
    const [[{ sum30 }], [{ sumYear }], recent] = await Promise.all([
      db
        .select({ sum30: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
        .from(expense)
        .where(gte(expense.date, last30Days)),
      db
        .select({ sumYear: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
        .from(expense)
        .where(gte(expense.date, lastYear)),
      db.query.expense.findMany({
        orderBy: [desc(expense.date)],
        limit: 20,
      }),
    ]);

    return {
      success: true,
      last30DaysExpense: Number(sum30) || 0,
      lastYearExpense: Number(sumYear) || 0,
      recent: recent.map((item) => ({
        ...item,
        amount: Number(item.amount),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch expenses", error);
    return { success: false, message: "Failed to load expense summary" };
  }
}
