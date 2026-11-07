import { eq, and, sql } from "drizzle-orm";
import { productReview, reviewLike } from "@/db/schema";
import type { Context } from "@/server/context";
import { ORPCError } from "@orpc/server";

export class ToggleReviewLikeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ reviewId, userId }: { reviewId: string; userId: string }) {
    if (!userId) {
      throw new ORPCError("UNAUTHORIZED", { message: "You must be signed in to like a review" });
    }

    // Check if user already liked this review
    const existingLike = await this.db.query.reviewLike.findFirst({
      where: and(eq(reviewLike.reviewId, reviewId), eq(reviewLike.userId, userId)),
    });

    if (existingLike) {
      // Unlike
      await this.db.delete(reviewLike).where(eq(reviewLike.id, existingLike.id));
      const [updated] = await this.db
        .update(productReview)
        .set({
          likesCount: sql`GREATEST(${productReview.likesCount} - 1, 0)`,
        })
        .where(eq(productReview.id, reviewId))
        .returning({ likesCount: productReview.likesCount });

      return { liked: false, likesCount: updated?.likesCount ?? 0 };
    } else {
      // Like
      await this.db.insert(reviewLike).values({
        id: crypto.randomUUID(),
        reviewId,
        userId,
      });

      const [updated] = await this.db
        .update(productReview)
        .set({
          likesCount: sql`${productReview.likesCount} + 1`,
        })
        .where(eq(productReview.id, reviewId))
        .returning({ likesCount: productReview.likesCount });

      return { liked: true, likesCount: updated?.likesCount ?? 1 };
    }
  }
}

