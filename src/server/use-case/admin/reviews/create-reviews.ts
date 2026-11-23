import { eq } from "drizzle-orm";
import { customerReview, type ReviewStatus } from "@/db/schema";
import type { Context } from "@/server/context";
import { PRODUCT_COLUMNS } from "./_shared";

export class CreateReviewUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: {
    customerName: string;
    customerPic?: string | null;
    review: string;
    rating: number;
    status?: ReviewStatus;
    productId?: string | null;
  }) {
    const [newReview] = await this.db
      .insert(customerReview)
      .values({
        customerName: input.customerName,
        customerPic: input.customerPic ?? null,
        review: input.review,
        rating: input.rating,
        status: (input.status as ReviewStatus) || "PENDING",
        productId: input.productId ?? null,
      })
      .returning();

    const created = await this.findWithProduct(newReview.id);
    if (!created) throw new Error("Failed to load created review");
    return created;
  }

  private findWithProduct(id: string) {
    return this.db.query.customerReview.findFirst({
      where: eq(customerReview.id, id),
      with: { product: { columns: PRODUCT_COLUMNS } },
    });
  }
}
