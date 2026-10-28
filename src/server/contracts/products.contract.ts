import { oc } from "@orpc/contract";
import { z } from "zod";
import { paginationInputSchema } from "./common.contract";

export const productStatusSchema = z.enum(["PENDING", "ACTIVE", "INACTIVE"]);
export const productLabelSchema = z.enum(["NONE", "NEW", "SPECIAL", "BEST_SELLER"]);

export const productCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().nullable().optional(),
});

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  markdown_description: z.string().nullable().optional(),
  price: z.number().or(z.string()),
  discountPrice: z.number().or(z.string()).nullable().optional(),
  images: z.array(z.string()),
  categoryId: z.string(),
  category: productCategorySchema.optional(),
  status: productStatusSchema,
  label: productLabelSchema,
  isFeatured: z.boolean(),
  featuredBanner: z.string().nullable().optional(),
  stockCount: z.number().default(0),
  inStock: z.boolean().default(true),
  soldCount: z.number().default(0),
  rating: z.number().default(0),
  ratingCount: z.number().default(0),
  tags: z.array(z.string()),
  videoLinks: z.array(z.string()).optional(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  whyBuyText: z.string().nullable().optional(),
  messengerUrl: z.string().nullable().optional(),
  specifications: z.any().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const listProductsInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  label: productLabelSchema.optional(),
  featured: z.boolean().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "best-selling"]).optional(),
});

export const listProductsOutputSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const customerReviewSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerPic: z.string().nullable().optional(),
  review: z.string(),
  rating: z.number(),
  status: z.string(),
  productId: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
});

export const createProductInputSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string(),
  markdown_description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  categoryId: z.string(),
  status: productStatusSchema.default("ACTIVE"),
  label: productLabelSchema.default("NONE"),
  isFeatured: z.boolean().default(false),
  featuredBanner: z.string().optional(),
  stockCount: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  videoLinks: z.array(z.string()).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  whyBuyText: z.string().optional(),
  messengerUrl: z.string().optional(),
  specifications: z.any().optional(),
  soldCount: z.number().int().nonnegative().optional(),
});

export const updateProductInputSchema = z.object({
  id: z.string(),
  data: createProductInputSchema.partial(),
});

export const productsContract = {
  list: oc
    .route({ method: "GET", path: "/products", summary: "List products with filtering and pagination" })
    .input(listProductsInputSchema)
    .output(listProductsOutputSchema),

  bySlug: oc
    .route({ method: "GET", path: "/products/:slug", summary: "Get single product by slug or id" })
    .input(z.object({ slug: z.string() }))
    .output(productSchema.nullable()),

  reviews: oc
    .route({ method: "GET", path: "/products/:productId/reviews", summary: "Get approved reviews for a product" })
    .input(z.object({ productId: z.string() }))
    .output(z.array(customerReviewSchema)),

  adminList: oc
    .route({ method: "GET", path: "/admin/products", summary: "List products for admin management" })
    .input(paginationInputSchema.extend({ search: z.string().optional() }).optional())
    .output(listProductsOutputSchema),

  adminGet: oc
    .route({ method: "GET", path: "/admin/products/:id", summary: "Get single product by id for admin" })
    .input(z.object({ id: z.string() }))
    .output(productSchema.nullable()),

  create: oc
    .route({ method: "POST", path: "/admin/products", summary: "Create a new product (Admin only)" })
    .input(createProductInputSchema)
    .output(productSchema),

  update: oc
    .route({ method: "PATCH", path: "/admin/products/:id", summary: "Update an existing product (Admin only)" })
    .input(updateProductInputSchema)
    .output(productSchema),

  delete: oc
    .route({ method: "DELETE", path: "/admin/products/:id", summary: "Delete product by ID (Admin only)" })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean(), id: z.string() })),
};
