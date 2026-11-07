import { eq, desc } from "drizzle-orm";
import { product, category, customerReview, order } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ListTrashInput, TrashItem } from "@/server/schemas/admin.schema";

export class ListTrashUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: ListTrashInput) {
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 100);
    const typeFilter = input.type ?? "ALL";
    const searchQuery = input.search?.trim().toLowerCase() || "";

    // Parallel fetch of soft-deleted records from each collection
    const [deletedProducts, deletedCategories, deletedReviews, deletedOrders] = await Promise.all([
      this.db
        .select({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          images: product.images,
          deletedAt: product.deletedAt,
        })
        .from(product)
        .where(eq(product.isDeleted, true))
        .orderBy(desc(product.deletedAt)),

      this.db
        .select({
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          deletedAt: category.deletedAt,
        })
        .from(category)
        .where(eq(category.isDeleted, true))
        .orderBy(desc(category.deletedAt)),

      this.db
        .select({
          id: customerReview.id,
          customerName: customerReview.customerName,
          customerPic: customerReview.customerPic,
          mediaUrl: customerReview.mediaUrl,
          rating: customerReview.rating,
          review: customerReview.review,
          deletedAt: customerReview.deletedAt,
        })
        .from(customerReview)
        .where(eq(customerReview.isDeleted, true))
        .orderBy(desc(customerReview.deletedAt)),

      this.db
        .select({
          id: order.id,
          customerName: order.customerName,
          phoneNumber: order.phoneNumber,
          totalAmount: order.totalAmount,
          deletedAt: order.deletedAt,
        })
        .from(order)
        .where(eq(order.isDeleted, true))
        .orderBy(desc(order.deletedAt)),
    ]);

    // Map to normalized TrashItem records
    const productItems: TrashItem[] = deletedProducts.map((p) => ({
      id: p.id,
      itemType: "PRODUCT",
      title: p.title,
      subtitle: `Price: ৳${p.price} • Slug: ${p.slug}`,
      image: p.images?.[0] || null,
      deletedAt: p.deletedAt || new Date(),
      metadata: { slug: p.slug, price: p.price, images: p.images },
    }));

    const categoryItems: TrashItem[] = deletedCategories.map((c) => ({
      id: c.id,
      itemType: "CATEGORY",
      title: c.name,
      subtitle: `Slug: ${c.slug}`,
      image: c.icon || null,
      deletedAt: c.deletedAt || new Date(),
      metadata: { slug: c.slug, icon: c.icon },
    }));

    const reviewItems: TrashItem[] = deletedReviews.map((r) => ({
      id: r.id,
      itemType: "REVIEW",
      title: r.customerName,
      subtitle: `Rating: ${r.rating}★ • "${r.review.slice(0, 50)}${r.review.length > 50 ? "..." : ""}"`,
      image: r.customerPic || r.mediaUrl || null,
      deletedAt: r.deletedAt || new Date(),
      metadata: { rating: r.rating, mediaUrl: r.mediaUrl },
    }));

    const orderItems: TrashItem[] = deletedOrders.map((o) => ({
      id: o.id,
      itemType: "ORDER",
      title: `Order #${o.id.slice(0, 8)} • ${o.customerName}`,
      subtitle: `Total: ৳${o.totalAmount} • Phone: ${o.phoneNumber}`,
      image: null,
      deletedAt: o.deletedAt || new Date(),
      metadata: { totalAmount: o.totalAmount, phoneNumber: o.phoneNumber },
    }));

    const counts = {
      ALL: productItems.length + categoryItems.length + reviewItems.length + orderItems.length,
      PRODUCT: productItems.length,
      CATEGORY: categoryItems.length,
      REVIEW: reviewItems.length,
      ORDER: orderItems.length,
    };

    // Filter by type
    let allItems: TrashItem[] = [];
    if (typeFilter === "ALL") {
      allItems = [...productItems, ...categoryItems, ...reviewItems, ...orderItems];
    } else if (typeFilter === "PRODUCT") {
      allItems = productItems;
    } else if (typeFilter === "CATEGORY") {
      allItems = categoryItems;
    } else if (typeFilter === "REVIEW") {
      allItems = reviewItems;
    } else if (typeFilter === "ORDER") {
      allItems = orderItems;
    }

    // Filter by search query
    if (searchQuery) {
      allItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.subtitle.toLowerCase().includes(searchQuery) ||
          item.id.toLowerCase().includes(searchQuery),
      );
    }

    // Sort by deletedAt descending
    allItems.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

    const total = allItems.length;
    const offset = (page - 1) * limit;
    const paginatedItems = allItems.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      counts,
    };
  }
}

