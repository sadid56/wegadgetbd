import { z } from "zod";

export const testimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().default("Verified Buyer"),
  location: z.string().default("Bangladesh"),
  product: z.string(),
  avatar: z.string().nullable().optional(),
  rating: z.number().default(5),
  comment: z.string(),
  date: z.string(),
});

export type TestimonialItem = z.infer<typeof testimonialItemSchema>;

export const listTestimonialsInputSchema = z.object({
  limit: z.number().int().positive().default(8).optional(),
});

