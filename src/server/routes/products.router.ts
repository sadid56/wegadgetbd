import { z } from "zod";
import { publicProcedure, adminProcedure } from "@/server/init";
import { paginationInputSchema } from "@/server/schemas/common.schema";
import {
  productSchema,
  listProductsInputSchema,
  listProductsOutputSchema,
  customerReviewSchema,
  createProductInputSchema,
  updateProductInputSchema,
} from "@/server/schemas/products.schema";

import { ListProductsUseCase } from "@/server/use-case/products/list-products";
import { GetProductBySlugUseCase } from "@/server/use-case/products/get-product-by-slug";
import { ListProductReviewsUseCase } from "@/server/use-case/products/list-product-reviews";
import { AdminListProductsUseCase } from "@/server/use-case/products/admin-list-products";
import { AdminGetProductUseCase } from "@/server/use-case/products/admin-get-product";
import { CreateProductUseCase } from "@/server/use-case/products/create-product";
import { UpdateProductUseCase } from "@/server/use-case/products/update-product";
import { DeleteProductUseCase } from "@/server/use-case/products/delete-product";

export const productsRouter = {
  list: publicProcedure
    .route({
      method: "GET",
      path: "/products",
      summary: "List products with filtering and pagination",
      tags: ["Products"],
    })
    .input(listProductsInputSchema)
    .output(listProductsOutputSchema)
    .handler(async ({ input, context }) => new ListProductsUseCase(context.db).execute(input)),

  bySlug: publicProcedure
    .route({
      method: "GET",
      path: "/products/:slug",
      summary: "Get single product by slug or id",
      tags: ["Products"],
    })
    .input(z.object({ slug: z.string() }))
    .output(productSchema.nullable())
    .handler(async ({ input, context }) => new GetProductBySlugUseCase(context.db).execute(input.slug)),

  reviews: publicProcedure
    .route({
      method: "GET",
      path: "/products/:productId/reviews",
      summary: "Get approved reviews for a product",
      tags: ["Products"],
    })
    .input(z.object({ productId: z.string() }))
    .output(z.array(customerReviewSchema))
    .handler(async ({ input, context }) => new ListProductReviewsUseCase(context.db).execute(input.productId)),

  adminList: adminProcedure
    .route({
      method: "GET",
      path: "/admin/products",
      summary: "List products for admin management",
      tags: ["Admin Products"],
    })
    .input(paginationInputSchema.extend({ search: z.string().optional() }).optional())
    .output(listProductsOutputSchema)
    .handler(async ({ input, context }) => new AdminListProductsUseCase(context.db).execute(input)),

  adminGet: adminProcedure
    .route({
      method: "GET",
      path: "/admin/products/:id",
      summary: "Get single product by id for admin",
      tags: ["Admin Products"],
    })
    .input(z.object({ id: z.string() }))
    .output(productSchema.nullable())
    .handler(async ({ input, context }) => new AdminGetProductUseCase(context.db).execute(input.id)),

  create: adminProcedure
    .route({
      method: "POST",
      path: "/admin/products",
      summary: "Create a new product (Admin only)",
      tags: ["Admin Products"],
    })
    .input(createProductInputSchema)
    .output(productSchema)
    .handler(async ({ input, context }) =>
      new CreateProductUseCase(context.db, context.user.id).execute(input),
    ),

  update: adminProcedure
    .route({
      method: "PATCH",
      path: "/admin/products/:id",
      summary: "Update an existing product (Admin only)",
      tags: ["Admin Products"],
    })
    .input(updateProductInputSchema)
    .output(productSchema)
    .handler(async ({ input, context }) =>
      new UpdateProductUseCase(context.db, context.user.id).execute(input),
    ),

  delete: adminProcedure
    .route({
      method: "DELETE",
      path: "/admin/products/:id",
      summary: "Delete product by ID (Admin only)",
      tags: ["Admin Products"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean(), id: z.string() }))
    .handler(async ({ input, context }) =>
      new DeleteProductUseCase(context.db, context.user.id).execute(input.id),
    ),
};

