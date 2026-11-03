import { desc, eq } from "drizzle-orm";
import { customerReview, product } from "@/db/schema";
import type { Context } from "@/server/context";
import type { TestimonialItem } from "@/server/schemas/testimonials.schema";

function formatRelativeDate(date: Date | string | null): string {
  if (!date) return "Recently";

  const diffDays = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return `${Math.floor(diffDays / 30)} months ago`;
}

export class GetTestimonialsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(limit = 8): Promise<TestimonialItem[]> {
    const fetchReviews = (approvedOnly: boolean) => {
      const query = this.db
        .select({
          id: customerReview.id,
          customerName: customerReview.customerName,
          customerPic: customerReview.customerPic,
          review: customerReview.review,
          rating: customerReview.rating,
          createdAt: customerReview.createdAt,
          productTitle: product.title,
        })
        .from(customerReview)
        .leftJoin(product, eq(customerReview.productId, product.id));

      return approvedOnly
        ? query.where(eq(customerReview.status, "APPROVED")).orderBy(desc(customerReview.createdAt)).limit(limit)
        : query.orderBy(desc(customerReview.rating), desc(customerReview.createdAt)).limit(limit);
    };

    let rows = await fetchReviews(true);

    if (rows.length < 2) {
      const fallbackRows = await fetchReviews(false);

      if (fallbackRows.length > rows.length) {
        rows = fallbackRows;
      }
    }

    return rows.map((row) => ({
      id: row.id,
      name: row.customerName || "Satisfied Customer",
      role: "Verified Buyer",
      location: "Bangladesh",
      product: row.productTitle || "Verified Purchase",
      avatar: row.customerPic || null,
      rating: Number(row.rating ?? 5),
      comment: row.review,
      date: formatRelativeDate(row.createdAt),
    }));
  }
}
