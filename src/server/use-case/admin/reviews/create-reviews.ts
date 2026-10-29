import { eq } from "drizzle-orm";
import { customerReview, type ReviewStatus } from "@/db/schema";
import type { Context } from "@/server/context";
import { PRODUCT_COLUMNS } from "./_shared";

export class CreateReviewUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: any) {
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

    return this.findWithProduct(newReview.id) as any;
  }

  private findWithProduct(id: string) {
    return this.db.query.customerReview.findFirst({
      where: eq(customerReview.id, id),
      with: { product: { columns: PRODUCT_COLUMNS } },
    });
  }
}
