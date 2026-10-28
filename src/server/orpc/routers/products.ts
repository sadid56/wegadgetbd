import { productsContract } from "@/server/contracts/products.contract";
import { implementPublic, implementAdmin } from "../init";
import { product, category, customerReview, auditLog, type ProductStatus, type ProductLabel, type AuditAction } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import { eq, and, or, ilike, arrayContains, desc, asc, count, sql } from "drizzle-orm";

function formatProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    price: Number(p.price),
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
    rating: Number(p.rating ?? 5),
    stockCount: p.stockCount ?? 0,
    ratingCount: p.ratingCount ?? 0,
    soldCount: p.soldCount ?? 360,
    tags: p.tags || [],
    images: p.images || [],
    videoLinks: p.videoLinks || [],
  };
}

export const productsRouter = {
  list: implementPublic(productsContract.list).handler(async ({ input, context }) => {
    const { page = 1, limit = 12, search, category: catSlug, label, featured, sort } = input;

    const conditions = [eq(product.status, "ACTIVE")];

    if (featured) {
      conditions.push(eq(product.isFeatured, true));
      conditions.push(eq(product.inStock, true));
    }

    if (label) {
      conditions.push(eq(product.label, label as ProductLabel));
    }

    if (search) {
      conditions.push(
        or(
          ilike(product.title, `%${search}%`),
          ilike(product.description, `%${search}%`),
          sql`${product.tags} && ARRAY[${search}]::text[]`
        )!
      );
    }

    let joinCategory = false;
    if (catSlug) {
      joinCategory = true;
    }

    const whereClause = and(...conditions);

    let orderByClause: any[] = [desc(product.createdAt)];
    if (sort === "price-asc") orderByClause = [asc(product.price)];
    if (sort === "price-desc") orderByClause = [desc(product.price)];
    if (sort === "newest") orderByClause = [desc(product.createdAt)];
    if (sort === "best-selling") {
      orderByClause = [desc(product.soldCount), desc(product.rating)];
    }

    const offset = (page - 1) * limit;

    const [productsList, [{ total }]] = await Promise.all([
      context.db.query.product.findMany({
        where: catSlug
          ? and(
              whereClause,
              eq(
                product.categoryId,
                context.db
                  .select({ id: category.id })
                  .from(category)
                  .where(eq(category.slug, catSlug))
                  .limit(1) as any
              )
            )
          : whereClause,
        orderBy: orderByClause,
        limit,
        offset,
        with: { category: true },
      }),
      context.db
        .select({ total: count() })
        .from(product)
        .leftJoin(category, eq(product.categoryId, category.id))
        .where(catSlug ? and(whereClause, eq(category.slug, catSlug)) : whereClause),
    ]);

    return {
      products: productsList.map(formatProduct),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }),

  bySlug: implementPublic(productsContract.bySlug).handler(async ({ input, context }) => {
    const foundProduct = await context.db.query.product.findFirst({
      where: and(
        or(eq(product.slug, input.slug), eq(product.id, input.slug)),
        eq(product.status, "ACTIVE")
      ),
      with: { category: true },
    });

    return formatProduct(foundProduct);
  }),

  reviews: implementPublic(productsContract.reviews).handler(async ({ input, context }) => {
    const reviews = await context.db.query.customerReview.findMany({
      where: and(
        eq(customerReview.productId, input.productId),
        eq(customerReview.status, "APPROVED")
      ),
      orderBy: [desc(customerReview.createdAt)],
    });

    return reviews;
  }),

  adminList: implementAdmin(productsContract.adminList).handler(async ({ input, context }) => {
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 12;
    const search = input?.search;

    const conditions = [];
    if (search) {
      conditions.push(
        or(ilike(product.title, `%${search}%`), ilike(product.description, `%${search}%`))!
      );
    }
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const offset = (page - 1) * limit;

    const [productsList, [{ total }]] = await Promise.all([
      context.db.query.product.findMany({
        where: whereClause,
        orderBy: [desc(product.createdAt)],
        limit,
        offset,
        with: { category: true },
      }),
      context.db.select({ total: count() }).from(product).where(whereClause),
    ]);

    return {
      products: productsList.map(formatProduct),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }),

  adminGet: implementAdmin(productsContract.adminGet).handler(async ({ input, context }) => {
    const foundProduct = await context.db.query.product.findFirst({
      where: eq(product.id, input.id),
      with: { category: true },
    });

    return formatProduct(foundProduct);
  }),

  create: implementAdmin(productsContract.create).handler(async ({ input, context }) => {
    let videoLinks = input.videoLinks;
    if (Array.isArray(videoLinks)) {
      videoLinks = videoLinks.map((l: string) => normalizeVideoInput(l)).filter(Boolean);
    }

    const [newProduct] = await context.db
      .insert(product)
      .values({
        title: input.title,
        slug: input.slug,
        description: input.description,
        markdown_description: input.markdown_description,
        price: String(input.price),
        discountPrice: input.discountPrice != null ? String(input.discountPrice) : null,
        images: input.images || [],
        categoryId: input.categoryId,
        status: (input.status as ProductStatus) || "PENDING",
        label: (input.label as ProductLabel) || "NONE",
        isFeatured: input.isFeatured ?? false,
        featuredBanner: input.featuredBanner,
        tags: input.tags || [],
        brand: input.brand,
        model: input.model,
        whyBuyText: input.whyBuyText,
        messengerUrl: input.messengerUrl,
        specifications: input.specifications,
        soldCount: input.soldCount ?? 360,
        videoLinks: videoLinks || [],
      })
      .returning();

    await context.db
      .insert(auditLog)
      .values({
        action: "CREATE_PRODUCT" as AuditAction,
        actorId: context.user.id,
        metadata: { productId: newProduct.id, title: newProduct.title },
      })
      .catch(() => null);

    const fullProduct = await context.db.query.product.findFirst({
      where: eq(product.id, newProduct.id),
      with: { category: true },
    });

    return formatProduct(fullProduct);
  }),

  update: implementAdmin(productsContract.update).handler(async ({ input, context }) => {
    const { id, data } = input;

    let videoLinks = data.videoLinks;
    if (Array.isArray(videoLinks)) {
      videoLinks = videoLinks.map((l: string) => normalizeVideoInput(l)).filter(Boolean);
    }

    const updateValues: any = {};
    if (data.title !== undefined) updateValues.title = data.title;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.markdown_description !== undefined) updateValues.markdown_description = data.markdown_description;
    if (data.price !== undefined) updateValues.price = String(data.price);
    if (data.discountPrice !== undefined) updateValues.discountPrice = data.discountPrice != null ? String(data.discountPrice) : null;
    if (data.images !== undefined) updateValues.images = data.images;
    if (data.categoryId !== undefined) updateValues.categoryId = data.categoryId;
    if (data.status !== undefined) updateValues.status = data.status as ProductStatus;
    if (data.label !== undefined) updateValues.label = data.label as ProductLabel;
    if (data.isFeatured !== undefined) updateValues.isFeatured = data.isFeatured;
    if (data.featuredBanner !== undefined) updateValues.featuredBanner = data.featuredBanner;
    if (data.tags !== undefined) updateValues.tags = data.tags;
    if (data.brand !== undefined) updateValues.brand = data.brand;
    if (data.model !== undefined) updateValues.model = data.model;
    if (data.whyBuyText !== undefined) updateValues.whyBuyText = data.whyBuyText;
    if (data.messengerUrl !== undefined) updateValues.messengerUrl = data.messengerUrl;
    if (data.specifications !== undefined) updateValues.specifications = data.specifications;
    if (data.soldCount !== undefined) updateValues.soldCount = data.soldCount;
    if (videoLinks !== undefined) updateValues.videoLinks = videoLinks;

    await context.db.update(product).set(updateValues).where(eq(product.id, id));

    const updatedProduct = await context.db.query.product.findFirst({
      where: eq(product.id, id),
      with: { category: true },
    });

    const action = data.status ? "STATUS_CHANGE" : "UPDATE_PRODUCT";
    await context.db
      .insert(auditLog)
      .values({
        action: action as AuditAction,
        actorId: context.user.id,
        metadata: { productId: id, changes: Object.keys(data) },
      })
      .catch(() => null);

    return formatProduct(updatedProduct);
  }),

  delete: implementAdmin(productsContract.delete).handler(async ({ input, context }) => {
    const [deleted] = await context.db.delete(product).where(eq(product.id, input.id)).returning();

    if (deleted) {
      await context.db
        .insert(auditLog)
        .values({
          action: "DELETE_PRODUCT" as AuditAction,
          actorId: context.user.id,
          metadata: { productId: input.id, title: deleted.title },
        })
        .catch(() => null);
    }

    return {
      success: true,
      id: input.id,
    };
  }),
};
