import { db } from "@/db";
import { expense } from "@/db/schema";
import type { Context } from "@/server/context";

export interface CreateExpenseInput {
  amount: number;
  note?: string;
  date?: Date;
}

export class CreateExpenseUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: CreateExpenseInput) {
    try {
      const [newExpense] = await this.dbInstance
        .insert(expense)
        .values({
          amount: String(input.amount),
          note: input.note || "",
          date: input.date || new Date(),
        })
        .returning();

      return {
        success: true as const,
        data: {
          ...newExpense,
          amount: Number(newExpense.amount),
        },
      };
    } catch (err: any) {
      console.error("CreateExpenseUseCase failed:", err);
      const msg = err?.message || "Failed to create expense";
      return { success: false as const, error: msg, message: msg };
    }
  }
}

