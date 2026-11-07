import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { productReview, reviewReply, reviewLike } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ReviewReplyItem, ProductReviewItem } from "@/server/schemas/products.schema";

export interface ListProductReviewsOptions {
  productId: string;
  page?: number;
  limit?: number;
  rating?: number;
  currentUserId?: string | null;
}

export class ListInteractiveProductReviewsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({
    productId,
    page = 1,
    limit = 10,
    rating,
    currentUserId,
  }: ListProductReviewsOptions) {
    const conditions = [
      eq(productReview.productId, productId),
      eq(productReview.isDeleted, false),
    ];

    if (rating && rating >= 1 && rating <= 5) {
      conditions.push(eq(productReview.rating, rating));
    }

    // 1. Fetch all reviews for calculating distribution & stats
    const allProductReviews = await this.db.query.productReview.findMany({
      where: and(eq(productReview.productId, productId), eq(productReview.isDeleted, false)),
      columns: { id: true, rating: true },
    });

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    for (const r of allProductReviews) {
      const star = Math.min(Math.max(r.rating, 1), 5) as 1 | 2 | 3 | 4 | 5;
      ratingCounts[star] = (ratingCounts[star] || 0) + 1;
      ratingSum += r.rating;
    }
    const total = allProductReviews.length;
    const averageRating = total > 0 ? Number((ratingSum / total).toFixed(1)) : 5.0;

    // 2. Fetch paginated reviews with direct query
    const offset = (page - 1) * limit;
    const reviewRows = await this.db.query.productReview.findMany({
      where: and(...conditions),
      orderBy: [desc(productReview.createdAt)],
      limit,
      offset,
    });

    if (reviewRows.length === 0) {
      return {
        reviews: [],
        total,
        averageRating,
        ratingCounts,
      };
    }

    const reviewIds = reviewRows.map((r) => r.id);

    // 3. Fetch replies for these reviews
    const replies = await this.db.query.reviewReply.findMany({
      where: and(
        inArray(reviewReply.reviewId, reviewIds),
        eq(reviewReply.isDeleted, false),
      ),
      orderBy: [asc(reviewReply.createdAt)],
    });

    // 4. Fetch likes by current user if logged in
    let userLikedReviewIds = new Set<string>();
    if (currentUserId) {
      const userLikes = await this.db.query.reviewLike.findMany({
        where: and(
          inArray(reviewLike.reviewId, reviewIds),
          eq(reviewLike.userId, currentUserId),
        ),
        columns: { reviewId: true },
      });
      userLikedReviewIds = new Set(userLikes.map((l) => l.reviewId));
    }

    // 5. Structure nested replies for each review
    const repliesByReviewId = new Map<string, ReviewReplyItem[]>();

    for (const r of reviewIds) {
      repliesByReviewId.set(r, []);
    }

    // Group replies into tree
    const repliesMap = new Map<string, ReviewReplyItem & { children?: ReviewReplyItem[] }>();
    for (const reply of replies) {
      repliesMap.set(reply.id, {
        id: reply.id,
        reviewId: reply.reviewId,
        parentId: reply.parentId,
        userId: reply.userId,
        userName: reply.userName,
        userAvatar: reply.userAvatar,
        userRole: reply.userRole,
        comment: reply.comment,
        likesCount: reply.likesCount,
        isLiked: false,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        replies: [],
      });
    }

    for (const reply of replies) {
      const item = repliesMap.get(reply.id)!;
      if (reply.parentId && repliesMap.has(reply.parentId)) {
        repliesMap.get(reply.parentId)!.replies!.push(item);
      } else {
        const list = repliesByReviewId.get(reply.reviewId) || [];
        list.push(item);
        repliesByReviewId.set(reply.reviewId, list);
      }
    }

    const formattedReviews: ProductReviewItem[] = reviewRows.map((r) => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      userAvatar: r.userAvatar,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      images: r.images || [],
      likesCount: r.likesCount,
      isLiked: userLikedReviewIds.has(r.id),
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      replies: repliesByReviewId.get(r.id) || [],
    }));

    return {
      reviews: formattedReviews,
      total,
      averageRating,
      ratingCounts,
    };
  }
}

