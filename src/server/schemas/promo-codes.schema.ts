import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

export const promoDiscountTypeSchema = z.enum(["PERCENTAGE", "FIXED"]);

export const promoCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().nullable().optional(),
  discountType: promoDiscountTypeSchema,
  discountValue: z.number(),
  maxDiscountAmount: z.number().nullable().optional(),
  minOrderAmount: z.number().default(0),
  usageLimit: z.number().nullable().optional(),
  usedCount: z.number().default(0),
  startsAt: z.date().or(z.string()).nullable().optional(),
  expiresAt: z.date().or(z.string()).nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const listPromoCodesInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  status: z.enum(["all", "active", "inactive", "expired"]).optional(),
});

export const listPromoCodesOutputSchema = z.object({
  promoCodes: z.array(promoCodeSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const createPromoCodeInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Promo code must be at least 2 characters")
    .max(40, "Promo code must be under 40 characters"),
  description: z.string().trim().max(255).nullable().optional(),
  discountType: promoDiscountTypeSchema.default("PERCENTAGE"),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  maxDiscountAmount: z.number().positive().nullable().optional(),
  minOrderAmount: z.number().min(0).default(0),
  usageLimit: z.number().int().positive().nullable().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const updatePromoCodeInputSchema = z.object({
  id: z.string(),
  code: z
    .string()
    .trim()
    .min(2, "Promo code must be at least 2 characters")
    .max(40, "Promo code must be under 40 characters")
    .optional(),
  description: z.string().trim().max(255).nullable().optional(),
  discountType: promoDiscountTypeSchema.optional(),
  discountValue: z.number().positive("Discount value must be greater than 0").optional(),
  maxDiscountAmount: z.number().positive().nullable().optional(),
  minOrderAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  startsAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const validatePromoCodeInputSchema = z.object({
  code: z.string().trim().min(1, "Please enter a promo code"),
  subtotal: z.number().min(0),
});

export const validatePromoCodeOutputSchema = z.object({
  valid: z.boolean(),
  message: z.string().optional(),
  code: z.string().optional(),
  discountType: promoDiscountTypeSchema.optional(),
  discountValue: z.number().optional(),
  discountAmount: z.number().optional(),
});

export type PromoCodeItem = z.infer<typeof promoCodeSchema>;
export type ListPromoCodesInput = z.infer<typeof listPromoCodesInputSchema>;
export type CreatePromoCodeInput = z.infer<typeof createPromoCodeInputSchema>;
export type UpdatePromoCodeInput = z.infer<typeof updatePromoCodeInputSchema>;
export type ValidatePromoCodeInput = z.infer<typeof validatePromoCodeInputSchema>;
export type ValidatePromoCodeOutput = z.infer<typeof validatePromoCodeOutputSchema>;
