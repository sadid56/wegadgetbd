import { db } from "@/db";
import { expense } from "@/db/schema";
import { desc, gte, sql } from "drizzle-orm";
import type { Context } from "@/server/context";

export class GetExpenseSummaryUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute() {
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);

    try {
      const [[{ sum7 }], [{ sum30 }], [{ sumYear }], recent] = await Promise.all([
        this.dbInstance
          .select({ sum7: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
          .from(expense)
          .where(gte(expense.date, last7Days)),
        this.dbInstance
          .select({ sum30: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
          .from(expense)
          .where(gte(expense.date, last30Days)),
        this.dbInstance
          .select({ sumYear: sql<string>`COALESCE(SUM(${expense.amount}), 0)` })
          .from(expense)
          .where(gte(expense.date, lastYear)),
        this.dbInstance.query.expense.findMany({
          orderBy: [desc(expense.date)],
          limit: 20,
        }),
      ]);

      return {
        success: true as const,
        last7DaysExpense: Number(sum7) || 0,
        last30DaysExpense: Number(sum30) || 0,
        lastYearExpense: Number(sumYear) || 0,
        recent: recent.map((item) => ({
          ...item,
          amount: Number(item.amount),
        })),
      };
    } catch (err: any) {
      console.error("GetExpenseSummaryUseCase failed:", err);
      return {
        success: false as const,
        error: "Failed to load expense summary",
        message: "Failed to load expense summary",
      };
    }
  }
}

