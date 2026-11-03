import { z } from "zod";
import { publicProcedure } from "@/server/init";
import { testimonialItemSchema } from "@/server/schemas/testimonials.schema";
import { GetTestimonialsUseCase } from "@/server/use-case/testimonials/get-testimonials";

export const testimonialsRouter = {
  list: publicProcedure
    .route({
      method: "GET",
      path: "/testimonials",
      summary: "Get customer reviews for testimonials section",
      tags: ["Testimonials"],
    })
    .input(z.object({ limit: z.number().int().positive().default(8).optional() }).optional())
    .output(z.array(testimonialItemSchema))
    .handler(async ({ input, context }) =>
      new GetTestimonialsUseCase(context.db).execute(input?.limit ?? 8),
    ),
};

