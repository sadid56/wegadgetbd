import { z } from "zod";
import { publicProcedure, adminProcedure } from "@/server/init";
import {
  promoCodeSchema,
  listPromoCodesInputSchema,
  listPromoCodesOutputSchema,
  createPromoCodeInputSchema,
  updatePromoCodeInputSchema,
  validatePromoCodeInputSchema,
  validatePromoCodeOutputSchema,
} from "@/server/schemas/promo-codes.schema";

import { ValidatePromoCodeUseCase } from "@/server/use-case/promo-codes/validate-promo-code";
import { AdminListPromoCodesUseCase } from "@/server/use-case/promo-codes/admin-list-promo-codes";
import { CreatePromoCodeUseCase } from "@/server/use-case/promo-codes/create-promo-code";
import { UpdatePromoCodeUseCase } from "@/server/use-case/promo-codes/update-promo-code";
import { DeletePromoCodeUseCase } from "@/server/use-case/promo-codes/delete-promo-code";

export const promoCodesRouter = {
  validate: publicProcedure
    .route({
      method: "POST",
      path: "/promo-codes/validate",
      summary: "Validate a promo code and compute discount",
      tags: ["Promo Codes"],
    })
    .input(validatePromoCodeInputSchema)
    .output(validatePromoCodeOutputSchema)
    .handler(async ({ input, context }) => new ValidatePromoCodeUseCase(context.db).execute(input)),

  adminList: adminProcedure
    .route({
      method: "GET",
      path: "/admin/promo-codes",
      summary: "List promo codes for admin",
      tags: ["Admin Promo Codes"],
    })
    .input(listPromoCodesInputSchema.optional())
    .output(listPromoCodesOutputSchema)
    .handler(async ({ input, context }) => new AdminListPromoCodesUseCase(context.db).execute(input ?? {})),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/promo-codes",
      summary: "Create a new promo code",
      tags: ["Admin Promo Codes"],
    })
    .input(createPromoCodeInputSchema)
    .output(promoCodeSchema)
    .handler(async ({ input, context }) =>
      new CreatePromoCodeUseCase(context.db).execute(input, context.user.id)
    ),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/promo-codes/:id",
      summary: "Update an existing promo code",
      tags: ["Admin Promo Codes"],
    })
    .input(updatePromoCodeInputSchema)
    .output(promoCodeSchema)
    .handler(async ({ input, context }) =>
      new UpdatePromoCodeUseCase(context.db).execute(input, context.user.id)
    ),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/promo-codes/:id",
      summary: "Delete a promo code",
      tags: ["Admin Promo Codes"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean(), id: z.string() }))
    .handler(async ({ input, context }) =>
      new DeletePromoCodeUseCase(context.db).execute(input.id, context.user.id)
    ),
};
