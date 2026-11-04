import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

export const saleStatusEnum = z.enum([
  "COMPLETED",
  "DELIVERED",
  "RETURNED",
  "PENDING",
  "CANCELLED",
]);
export type SaleStatus = z.infer<typeof saleStatusEnum>;

export const saleSchema = z.object({
  id: z.string(),
  productName: z.string(),
  customerName: z.string(),
  phoneNumber: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  sellerName: z.string().nullable().optional(),
  quantity: z.number(),
  buyPrice: z.number().or(z.string()),
  sellPrice: z.number().or(z.string()),
  boostingCost: z.number().or(z.string()),
  profit: z.number().or(z.string()).optional(),
  status: z.string(),
  date: z.date().or(z.string()),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export const createSaleInputSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  buyPrice: z.coerce.number().min(0, "Buy price must be positive"),
  sellPrice: z.coerce.number().min(0, "Sell price must be positive"),
  boostingCost: z.coerce.number().min(0, "Boosting cost must be positive"),
  customerName: z.string().min(1, "Customer name is required"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  sellerName: z.string().optional(),
  status: z.string().default("COMPLETED"),
  date: z.date().or(z.string()).optional(),
});

export const updateSaleInputSchema = z.object({
  id: z.string(),
  data: createSaleInputSchema.partial(),
});

export const listSalesInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  sellerName: z.string().optional(),
});

export type Sale = z.infer<typeof saleSchema>;
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleInputSchema>;
export type ListSalesInput = z.infer<typeof listSalesInputSchema>;

