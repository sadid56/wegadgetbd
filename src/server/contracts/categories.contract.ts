import { oc } from "@orpc/contract";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  _count: z.object({
    products: z.number(),
  }).optional(),
});

export const createCategoryInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().nullable().optional(),
});

export const updateCategoryInputSchema = z.object({
  id: z.string(),
  data: createCategoryInputSchema.partial(),
});

export const categoriesContract = {
  list: oc
    .route({ method: "GET", path: "/categories", summary: "List all categories" })
    .input(z.object({}).optional())
    .output(z.array(categorySchema)),

  bySlug: oc
    .route({ method: "GET", path: "/categories/:slug", summary: "Get category details by slug" })
    .input(z.object({ slug: z.string() }))
    .output(categorySchema.nullable()),

  create: oc
    .route({ method: "POST", path: "/admin/categories", summary: "Create category (Admin only)" })
    .input(createCategoryInputSchema)
    .output(categorySchema),

  update: oc
    .route({ method: "PATCH", path: "/admin/categories/:id", summary: "Update category (Admin only)" })
    .input(updateCategoryInputSchema)
    .output(categorySchema),

  delete: oc
    .route({ method: "DELETE", path: "/admin/categories/:id", summary: "Delete category (Admin only)" })
    .input(z.object({ id: z.string() }))
    .output(categorySchema),
};
