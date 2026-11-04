import { z } from "zod";
import { adminProcedure } from "@/server/init";
import { CreateExpenseUseCase } from "@/server/use-case/admin/expenses/create-expense";
import { GetExpenseSummaryUseCase } from "@/server/use-case/admin/expenses/get-expense-summary";
import { createExpenseInputSchema } from "@/server/schemas";

export const expensesRouter = {
  summary: adminProcedure
    .route({
      method: "GET",
      path: "/admin/expenses/summary",
      summary: "Get expense summary stats and recent list",
      tags: ["Admin Expenses"],
    })
    .input(z.object({}).optional())
    .handler(async ({ context }) => {
      const useCase = new GetExpenseSummaryUseCase(context.db);
      return useCase.execute();
    }),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/expenses",
      summary: "Create an expense record",
      tags: ["Admin Expenses"],
    })
    .input(createExpenseInputSchema)
    .handler(async ({ input, context }) => {
      const useCase = new CreateExpenseUseCase(context.db);
      return useCase.execute({
        ...input,
        date: input.date ? new Date(input.date) : undefined,
      });
    }),
};

