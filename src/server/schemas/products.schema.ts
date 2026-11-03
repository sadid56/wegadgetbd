import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

export const productStatusSchema = z.enum(["PENDING", "ACTIVE", "INACTIVE"]);

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
  isFeatured: z.boolean(),
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
  specifications: z.any().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const listProductsInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
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

export const topPickProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  brand: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  badgeVariant: z.string().nullable().optional(),
  rating: z.string().or(z.number()),
  reviewCount: z.string().or(z.number()),
  price: z.number(),
  originalPrice: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  inStock: z.boolean().default(true),
});

export type TopPickProduct = z.infer<typeof topPickProductSchema>;

export { testimonialItemSchema, type TestimonialItem } from "./testimonials.schema";

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
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  markdown_description: z.string().nullable().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  discountPrice: z.coerce.number().positive().nullable().optional(),
  images: z.array(z.string()).min(1, "At least one image is required").default([]),
  categoryId: z.string().min(1, "Category is required"),
  status: productStatusSchema.default("ACTIVE"),
  isFeatured: z.boolean().default(false),
  stockCount: z.coerce.number().int().nonnegative().default(0),
  inStock: z.boolean().default(true),
  rating: z.coerce.number().min(0).max(5).default(5),
  tags: z.array(z.string()).default([]),
  videoLinks: z.array(z.string()).max(2, "Maximum 2 video links allowed").optional(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  whyBuyText: z.string().nullable().optional(),
  specifications: z.any().nullable().optional(),
  soldCount: z.coerce.number().int().nonnegative().optional().default(360),
});

export const updateProductInputSchema = z.object({
  id: z.string(),
  data: createProductInputSchema.partial(),
});

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Product = z.infer<typeof productSchema>;
export type ListProductsInput = z.infer<typeof listProductsInputSchema>;
export type ListProductsOutput = z.infer<typeof listProductsOutputSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
export type CustomerReview = z.infer<typeof customerReviewSchema>;

