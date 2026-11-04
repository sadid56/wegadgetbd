import { orpcClient } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";
import type { CreateExpenseInput } from "@/server/schemas";

export const ExpenseEndpoints = {
  getSummary: () => orpcClient.expenses.summary(),
  createExpense: (data: CreateExpenseInput) => orpcClient.expenses.create(data),
};

export const useExpenseSummary = () => {
  return useQuery({
    queryKey: ["expenses", "summary"],
    queryFn: () => ExpenseEndpoints.getSummary(),
  });
};

export const useCreateExpense = () =>
  useAppMutation({
    mutationFn: ExpenseEndpoints.createExpense,
    invalidateKeys: [["expenses"]],
    successMessage: "Expense added successfully",
  });

