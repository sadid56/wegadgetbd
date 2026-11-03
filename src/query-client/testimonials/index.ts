import { orpcClient, orpc } from "@/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";

export type TestimonialsResponse = Awaited<ReturnType<typeof orpcClient.testimonials.list>>;
export type TestimonialItem = TestimonialsResponse[number];

export const TestimonialEndpoints = {
  getTestimonials: (limit: number = 8) => orpcClient.testimonials.list({ limit }),
};

export const useTestimonials = (limit: number = 8) =>
  useQuery(orpc.testimonials.list.queryOptions({ input: { limit } }));

