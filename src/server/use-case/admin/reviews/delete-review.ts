import { eq } from "drizzle-orm";
import { customerReview } from "@/db/schema";
import type { Context } from "@/server/context";

export class DeleteReviewUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string) {
    await this.db
      .update(customerReview)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(customerReview.id, id));
    return { success: true };
  }
}
