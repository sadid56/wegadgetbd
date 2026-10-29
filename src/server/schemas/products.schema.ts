import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

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
  markdown_description: z.string().nullable().optional(),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive().nullable().optional(),
  images: z.array(z.string()).default([]),
  categoryId: z.string(),
  status: productStatusSchema.default("ACTIVE"),
  label: productLabelSchema.default("NONE"),
  isFeatured: z.boolean().default(false),
  featuredBanner: z.string().nullable().optional(),
  stockCount: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  videoLinks: z.array(z.string()).optional(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  whyBuyText: z.string().nullable().optional(),
  messengerUrl: z.string().nullable().optional(),
  specifications: z.any().nullable().optional(),
  soldCount: z.number().int().nonnegative().optional(),
});

export const updateProductInputSchema = z.object({
  id: z.string(),
  data: createProductInputSchema.partial(),
});

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ProductLabel = z.infer<typeof productLabelSchema>;
export type Product = z.infer<typeof productSchema>;
export type ListProductsInput = z.infer<typeof listProductsInputSchema>;
export type ListProductsOutput = z.infer<typeof listProductsOutputSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
export type CustomerReview = z.infer<typeof customerReviewSchema>;

