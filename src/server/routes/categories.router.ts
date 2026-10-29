import { z } from "zod";
import { publicProcedure, adminProcedure } from "@/server/init";
import {
  categorySchema,
  createCategoryInputSchema,
  updateCategoryInputSchema,
} from "@/server/schemas/categories.schema";

import { ListCategoriesUseCase } from "@/server/use-case/categories/list-categories";
import { GetCategoryBySlugUseCase } from "@/server/use-case/categories/get-category-by-slug";
import { CreateCategoryUseCase } from "@/server/use-case/categories/create-category";
import { UpdateCategoryUseCase } from "@/server/use-case/categories/update-category";
import { DeleteCategoryUseCase } from "@/server/use-case/categories/delete-category";

export const categoriesRouter = {
  list: publicProcedure
    .route({
      method: "GET",
      path: "/categories",
      summary: "List all categories",
      tags: ["Categories"],
    })
    .input(z.object({}).optional())
    .output(z.array(categorySchema))
    .handler(async ({ context }) => new ListCategoriesUseCase(context.db).execute()),

  bySlug: publicProcedure
    .route({
      method: "GET",
      path: "/categories/:slug",
      summary: "Get category details by slug",
      tags: ["Categories"],
    })
    .input(z.object({ slug: z.string() }))
    .output(categorySchema.nullable())
    .handler(async ({ input, context }) => new GetCategoryBySlugUseCase(context.db).execute(input.slug)),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/categories",
      summary: "Create category (Admin only)",
      tags: ["Categories"],
    })
    .input(createCategoryInputSchema)
    .output(categorySchema)
    .handler(async ({ input, context }) => new CreateCategoryUseCase(context.db).execute(input)),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/categories/:id",
      summary: "Update category (Admin only)",
      tags: ["Categories"],
    })
    .input(updateCategoryInputSchema)
    .output(categorySchema)
    .handler(async ({ input, context }) => new UpdateCategoryUseCase(context.db).execute(input)),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/categories/:id",
      summary: "Delete category (Admin only)",
      tags: ["Categories"],
    })
    .input(z.object({ id: z.string() }))
    .output(categorySchema)
    .handler(async ({ input, context }) => new DeleteCategoryUseCase(context.db).execute(input.id)),
};

