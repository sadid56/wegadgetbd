import { z } from "zod";
import { paginationInputSchema } from "./common.schema";

export const paymentMethodSchema = z.enum([
  "CASH",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "BANK_TRANSFER",
  "OTHER",
]);
export type PaymentMethodType = z.infer<typeof paymentMethodSchema>;

export const paymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);
export type PaymentStatusType = z.infer<typeof paymentStatusSchema>;

export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number().or(z.string()),
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  transactionId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  date: z.date().or(z.string()),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export const createPaymentInputSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  method: paymentMethodSchema.default("CASH"),
  status: paymentStatusSchema.default("COMPLETED"),
  transactionId: z.string().optional(),
  note: z.string().optional(),
  date: z.date().or(z.string()).optional(),
  orderId: z.string().optional(),
});

export const updatePaymentInputSchema = z.object({
  id: z.string(),
  data: createPaymentInputSchema.partial(),
});

export const listPaymentsInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentInputSchema>;
export type ListPaymentsInput = z.infer<typeof listPaymentsInputSchema>;

