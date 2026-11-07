import { eq, and } from "drizzle-orm";
import { productReview, reviewReply } from "@/db/schema";
import type { Context } from "@/server/context";
import { ORPCError } from "@orpc/server";

export interface CreateReviewReplyOptions {
  reviewId: string;
  parentId?: string | null;
  comment: string;
  user?: {
    id: string;
    name?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export class CreateReviewReplyUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ reviewId, parentId, comment, user }: CreateReviewReplyOptions) {
    // 1. Verify parent review exists
    const targetReview = await this.db.query.productReview.findFirst({
      where: and(eq(productReview.id, reviewId), eq(productReview.isDeleted, false)),
    });

    if (!targetReview) {
      throw new ORPCError("NOT_FOUND", { message: "Review not found" });
    }

    // 2. If parentId specified, verify parent reply exists
    if (parentId) {
      const parentReply = await this.db.query.reviewReply.findFirst({
        where: and(eq(reviewReply.id, parentId), eq(reviewReply.isDeleted, false)),
      });
      if (!parentReply) {
        throw new ORPCError("NOT_FOUND", { message: "Parent reply not found" });
      }
    }

    const userName = user?.name || "Customer";
    const userAvatar = user?.image || null;
    const userId = user?.id || null;
    const userRole = user?.role || "USER";

    const [created] = await this.db
      .insert(reviewReply)
      .values({
        id: crypto.randomUUID(),
        reviewId,
        parentId: parentId || null,
        userId,
        userName,
        userAvatar,
        userRole,
        comment: comment.trim(),
      })
      .returning();

    return created;
  }
}

