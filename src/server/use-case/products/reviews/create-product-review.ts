import { eq, and, sql } from "drizzle-orm";
import { product, productReview } from "@/db/schema";
import type { Context } from "@/server/context";
import { ORPCError } from "@orpc/server";

export interface CreateProductReviewOptions {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  user?: {
    id: string;
    name?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export class CreateInteractiveProductReviewUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({
    productId,
    rating,
    title,
    comment,
    images = [],
    user,
  }: CreateProductReviewOptions) {
    // 1. Verify target product exists and is active
    const existingProduct = await this.db.query.product.findFirst({
      where: and(eq(product.id, productId), eq(product.isDeleted, false)),
      columns: { id: true, title: true, rating: true, soldCount: true },
    });

    if (!existingProduct) {
      throw new ORPCError("NOT_FOUND", { message: "Product not found" });
    }

    const userName = user?.name || "Verified Customer";
    const userAvatar = user?.image || null;
    const userId = user?.id || null;

    // 2. Insert the new review
    const [created] = await this.db
      .insert(productReview)
      .values({
        id: crypto.randomUUID(),
        productId,
        userId,
        userName,
        userAvatar,
        rating: Math.min(Math.max(rating, 1), 5),
        title: title?.trim() || null,
        comment: comment.trim(),
        images: images.filter(Boolean),
        isVerifiedPurchase: Boolean(userId),
      })
      .returning();

    // 3. Recalculate and update product's overall rating
    const allReviews = await this.db
      .select({
        rating: productReview.rating,
      })
      .from(productReview)
      .where(and(eq(productReview.productId, productId), eq(productReview.isDeleted, false)));

    const count = allReviews.length;
    const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = count > 0 ? Number((sum / count).toFixed(1)) : 5.0;

    await this.db
      .update(product)
      .set({
        rating: avg,
      })
      .where(eq(product.id, productId));

    return created;
  }
}

