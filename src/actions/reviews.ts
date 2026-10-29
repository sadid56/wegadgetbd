"use server";

import { db } from "@/db";
import { customerReview, product, type ReviewStatus } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "./_utils";

export { type ActionResult };

export type CreateReviewInput = {
  customerName: string;
  customerPic?: string;
  mediaUrl?: string;
  mediaType?: string;
  review: string;
  rating: number;
  status?: ReviewStatus;
  productId?: string;
};

export type UpdateReviewInput = Partial<CreateReviewInput>;

export async function getReviews(): Promise<ActionResult<any[]>> {
  try {
    const reviews = await db.query.customerReview.findMany({
      orderBy: [desc(customerReview.createdAt)],
      with: {
        product: {
          columns: { id: true, title: true, slug: true },
        },
      },
    });
    return ok(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return fail("Failed to fetch reviews");
  }
}

export async function getApprovedReviews(): Promise<ActionResult<any[]>> {
  try {
    const reviews = await db.query.customerReview.findMany({
      where: eq(customerReview.status, "APPROVED"),
      orderBy: [desc(customerReview.createdAt)],
      with: {
        product: {
          columns: { id: true, title: true, slug: true },
        },
      },
    });
    return ok(reviews);
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return fail("Failed to fetch reviews");
  }
}

export async function getProductReviews(productId: string): Promise<ActionResult<any[]>> {
  try {
    const reviews = await db.query.customerReview.findMany({
      where: and(eq(customerReview.productId, productId), eq(customerReview.status, "APPROVED")),
      orderBy: [desc(customerReview.createdAt)],
    });
    return ok(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return fail("Failed to fetch reviews");
  }
}

export async function createReview(data: CreateReviewInput): Promise<ActionResult<any>> {
  try {
    const [review] = await db
      .insert(customerReview)
      .values({
        customerName: data.customerName,
        customerPic: data.customerPic || null,
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || null,
        review: data.review,
        rating: data.rating,
        status: data.status || "PENDING",
        productId: data.productId || null,
      })
      .returning();

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return ok(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return fail("Failed to create review");
  }
}

export async function updateReview(id: string, data: UpdateReviewInput): Promise<ActionResult<any>> {
  try {
    const [review] = await db
      .update(customerReview)
      .set({
        ...(data.customerName && { customerName: data.customerName }),
        ...(data.customerPic !== undefined && { customerPic: data.customerPic }),
        ...(data.mediaUrl !== undefined && { mediaUrl: data.mediaUrl }),
        ...(data.mediaType !== undefined && { mediaType: data.mediaType }),
        ...(data.review && { review: data.review }),
        ...(data.rating && { rating: data.rating }),
        ...(data.status && { status: data.status }),
        ...(data.productId !== undefined && { productId: data.productId }),
      })
      .where(eq(customerReview.id, id))
      .returning();

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return ok(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return fail("Failed to update review");
  }
}

export async function deleteReview(id: string): Promise<ActionResult<void>> {
  try {
    await db.delete(customerReview).where(eq(customerReview.id, id));
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return ok();
  } catch (error) {
    console.error("Error deleting review:", error);
    return fail("Failed to delete review");
  }
}

export async function toggleReviewStatus(id: string, status: ReviewStatus): Promise<ActionResult<any>> {
  try {
    const [review] = await db.update(customerReview).set({ status }).where(eq(customerReview.id, id)).returning();

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return ok(review);
  } catch (error) {
    console.error("Error updating review status:", error);
    return fail("Failed to update status");
  }
}

export async function getProductsForSelect() {
  try {
    const products = await db.query.product.findMany({
      columns: { id: true, title: true },
      orderBy: [asc(product.title)],
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: "Failed to fetch products" };
  }
}