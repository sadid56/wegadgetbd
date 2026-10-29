import { desc } from "drizzle-orm";
import { customerReview } from "@/db/schema";
import type { Context } from "@/server/context";
import { PRODUCT_COLUMNS } from "./_shared";

export class ListReviewsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    return this.db.query.customerReview.findMany({
      with: { product: { columns: PRODUCT_COLUMNS } },
      orderBy: [desc(customerReview.createdAt)],
    });
  }
}
