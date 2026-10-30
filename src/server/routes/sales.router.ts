import { z } from "zod";
import { adminProcedure } from "@/server/init";
import { ListSalesUseCase } from "@/server/use-case/admin/sales/list-sales";
import { CreateSaleUseCase } from "@/server/use-case/admin/sales/create-sale";
import { UpdateSaleUseCase } from "@/server/use-case/admin/sales/update-sale";
import { DeleteSaleUseCase, GetSaleUseCase } from "@/server/use-case/admin/sales/delete-sale";

export const salesRouter = {
  list: adminProcedure
    .route({
      method: "GET",
      path: "/admin/sales",
      summary: "List sales with pagination and filters",
      tags: ["Admin Sales"],
    })
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
          startDate: z.string().or(z.date()).optional(),
          endDate: z.string().or(z.date()).optional(),
          sellerName: z.string().optional(),
        })
        .optional()
    )
    .handler(async ({ input, context }) => {
      const useCase = new ListSalesUseCase(context.db);
      return useCase.execute({
        page: input?.page,
        limit: input?.limit,
        search: input?.search,
        startDate: input?.startDate ? new Date(input.startDate) : undefined,
        endDate: input?.endDate ? new Date(input.endDate) : undefined,
        sellerName: input?.sellerName,
      });
    }),

  get: adminProcedure
    .route({
      method: "GET",
      path: "/admin/sales/{id}",
      summary: "Get sale by ID",
      tags: ["Admin Sales"],
    })
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const useCase = new GetSaleUseCase(context.db);
      return useCase.execute(input.id);
    }),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/sales",
      summary: "Create a new sale",
      tags: ["Admin Sales"],
    })
    .input(
      z.object({
        productName: z.string(),
        quantity: z.number(),
        buyPrice: z.number(),
        sellPrice: z.number(),
        boostingCost: z.number(),
        customerName: z.string(),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        sellerName: z.string().optional(),
        date: z.string().or(z.date()).optional(),
        status: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const useCase = new CreateSaleUseCase(context.db);
      return useCase.execute({
        ...input,
        date: input.date ? new Date(input.date) : undefined,
        status: input.status,
      });
    }),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/sales/{id}",
      summary: "Update an existing sale",
      tags: ["Admin Sales"],
    })
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          productName: z.string().optional(),
          quantity: z.number().optional(),
          buyPrice: z.number().optional(),
          sellPrice: z.number().optional(),
          boostingCost: z.number().optional(),
          customerName: z.string().optional(),
          phoneNumber: z.string().optional(),
          address: z.string().optional(),
          sellerName: z.string().optional(),
          date: z.string().or(z.date()).optional(),
          status: z.string().optional(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      const useCase = new UpdateSaleUseCase(context.db);
      return useCase.execute(input.id, {
        ...input.data,
        date: input.data.date ? new Date(input.data.date) : undefined,
        status: input.data.status,
      });
    }),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/sales/{id}",
      summary: "Delete a sale",
      tags: ["Admin Sales"],
    })
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const useCase = new DeleteSaleUseCase(context.db);
      return useCase.execute(input.id);
    }),
};
