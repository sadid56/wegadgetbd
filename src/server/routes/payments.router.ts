import { z } from "zod";
import { adminProcedure } from "@/server/init";
import { ListPaymentsUseCase } from "@/server/use-case/admin/payments/list-payments";
import {
  CreatePaymentUseCase,
  UpdatePaymentUseCase,
  DeletePaymentUseCase,
} from "@/server/use-case/admin/payments/create-payment";
import type { PaymentMethod } from "@/db/schema";

export const paymentsRouter = {
  list: adminProcedure
    .route({
      method: "GET",
      path: "/admin/payments",
      summary: "List payments with pagination and search",
      tags: ["Admin Payments"],
    })
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .handler(async ({ input, context }) => {
      const useCase = new ListPaymentsUseCase(context.db);
      return useCase.execute({
        page: input?.page,
        limit: input?.limit,
        search: input?.search,
      });
    }),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/payments",
      summary: "Create a new payment",
      tags: ["Admin Payments"],
    })
    .input(
      z.object({
        amount: z.number(),
        method: z.string(),
        transactionId: z.string().optional(),
        note: z.string().optional(),
        date: z.string().or(z.date()).optional(),
        orderId: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const useCase = new CreatePaymentUseCase(context.db);
      return useCase.execute({
        ...input,
        method: input.method as PaymentMethod,
        date: input.date ? new Date(input.date) : undefined,
      });
    }),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/payments/{id}",
      summary: "Update an existing payment",
      tags: ["Admin Payments"],
    })
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          amount: z.number().optional(),
          method: z.string().optional(),
          transactionId: z.string().optional(),
          note: z.string().optional(),
          date: z.string().or(z.date()).optional(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      const useCase = new UpdatePaymentUseCase(context.db);
      return useCase.execute(input.id, {
        ...input.data,
        method: input.data.method as PaymentMethod | undefined,
        date: input.data.date ? new Date(input.data.date) : undefined,
      });
    }),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/payments/{id}",
      summary: "Delete a payment",
      tags: ["Admin Payments"],
    })
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const useCase = new DeletePaymentUseCase(context.db);
      return useCase.execute(input.id);
    }),
};
