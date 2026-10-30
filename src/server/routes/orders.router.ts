import { z } from "zod";
import { publicProcedure, adminProcedure } from "@/server/init";
import { CreateOrderUseCase } from "@/server/use-case/orders/create-order";
import { ListOrdersUseCase } from "@/server/use-case/admin/orders/list-orders";
import { GetOrderUseCase } from "@/server/use-case/admin/orders/get-order";
import { UpdateOrderStatusUseCase } from "@/server/use-case/admin/orders/update-order-status";
import { UpdateOrderUseCase } from "@/server/use-case/admin/orders/update-order";
import { DeleteOrderUseCase } from "@/server/use-case/admin/orders/delete-order";

export const ordersRouter = {
  create: publicProcedure
    .route({
      method: "POST",
      path: "/orders",
      summary: "Create a customer order",
      tags: ["Orders"],
    })
    .input(
      z.object({
        customerName: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string().optional(),
        area: z.string().optional(),
        items: z.array(z.object({ id: z.string(), qty: z.number() }).passthrough()),
        totalAmount: z.number().optional(),
        shippingCost: z.number().optional(),
        discountAmount: z.number().optional(),
        paymentMethod: z.string().optional(),
        notes: z.string().optional(),
        whatsappMessage: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const useCase = new CreateOrderUseCase(context.db);
      return useCase.execute(input);
    }),

  list: adminProcedure
    .route({
      method: "GET",
      path: "/admin/orders",
      summary: "List orders",
      tags: ["Admin Orders"],
    })
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
          status: z.any().optional(),
        })
        .optional()
    )
    .handler(async ({ input, context }) => {
      const useCase = new ListOrdersUseCase(context.db);
      return useCase.execute(input || {});
    }),

  get: adminProcedure
    .route({
      method: "GET",
      path: "/admin/orders/:id",
      summary: "Get order details by id",
      tags: ["Admin Orders"],
    })
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const useCase = new GetOrderUseCase(context.db);
      return useCase.execute(input.id);
    }),

  updateStatus: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/orders/:id/status",
      summary: "Update order status",
      tags: ["Admin Orders"],
    })
    .input(z.object({ id: z.string(), status: z.any() }))
    .handler(async ({ input, context }) => {
      const useCase = new UpdateOrderStatusUseCase(context.db, context.user.id);
      return useCase.execute(input.id, input.status);
    }),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/orders/:id",
      summary: "Update order details",
      tags: ["Admin Orders"],
    })
    .input(z.object({ id: z.string(), data: z.record(z.string(), z.any()) }))
    .handler(async ({ input, context }) => {
      const useCase = new UpdateOrderUseCase(context.db, context.user.id);
      return useCase.execute(input.id, input.data);
    }),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/orders/:id",
      summary: "Delete an order",
      tags: ["Admin Orders"],
    })
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const useCase = new DeleteOrderUseCase(context.db, context.user.id);
      return useCase.execute(input.id);
    }),
};

