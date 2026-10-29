"use server";

import { db } from "@/db";
import { expense } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { desc, gte, sql } from "drizzle-orm";
import { ok, fail } from "./_utils";

export async function createExpense(input: { amount: number; note?: string; date?: Date }) {
  const session = await requireAdmin();
  if (!session) return fail("Unauthorized");

  try {
    await db.insert(expense).values({
      amount: String(input.amount),
      note: input.note || "",
      date: input.date || new Date(),
    });

    revalidatePath("/admin/expenses");
    return ok();
  } catch (error) {
    console.error("Failed to create expense", error);
    return fail("Failed to create expense");
  }
}

export async function getExpenseSummary() {
  const session = await requireAdmin();
  if (!session) return fail("Unauthorized");

  const now = new Date();
  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 7);

  const last30Days = new Date(now);
  last30Days.setDate(now.getDate() - 30);

  const lastYear = new Date(now);
  lastYear.setFullYear(now.getFullYear() - 1);

  try {
    const [[{ sum7 }], [{ sum30 }], [{ sumYear }], recent] = await Promise.all([
      db
        .select({ sum7: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
        .from(expense)
        .where(gte(expense.date, last7Days)),
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
      last7DaysExpense: Number(sum7) || 0,
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
