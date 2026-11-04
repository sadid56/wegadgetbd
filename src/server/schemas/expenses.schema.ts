import { z } from "zod";

export const expenseSchema = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  note: z.string().nullable().optional(),
  date: z.date().or(z.string()),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export const createExpenseInputSchema = z.object({
  category: z.string().optional().default("General"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().optional(),
  date: z.string().or(z.date()).optional(),
});

export const expenseSummarySchema = z.object({
  success: z.boolean(),
  last7DaysExpense: z.number(),
  last30DaysExpense: z.number(),
  lastYearExpense: z.number(),
  recent: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      note: z.string().nullable().optional(),
      date: z.date().or(z.string()),
    })
  ),
});

export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;
export type ExpenseSummary = z.infer<typeof expenseSummarySchema>;

