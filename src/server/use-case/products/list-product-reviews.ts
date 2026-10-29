import { eq, and, desc } from "drizzle-orm";
import { customerReview } from "@/db/schema";
import type { Context } from "@/server/context";

export class ListProductReviewsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(productId: string) {
    const reviews = await this.db.query.customerReview.findMany({
      where: and(eq(customerReview.productId, productId), eq(customerReview.status, "APPROVED")),
      orderBy: [desc(customerReview.createdAt)],
    });

    return reviews;
  }
}

