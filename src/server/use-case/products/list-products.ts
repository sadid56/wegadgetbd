import { eq, and, or, ilike, desc, asc, count, sql, isNotNull } from "drizzle-orm";
import { product, category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ListProductsInput } from "@/server/schemas/products.schema";
import { getProductReviewCountMap } from "./_shared";

type OrderByClause = ReturnType<typeof asc>[];

const ORDER_BY_MAP: Record<string, (p: typeof product) => OrderByClause> = {
  "price-asc": () => [asc(product.price)],
  "price-desc": () => [desc(product.price)],
  newest: () => [desc(product.createdAt)],
  "best-selling": () => [desc(product.soldCount), desc(product.rating)],
  rating: () => [desc(product.rating), desc(product.soldCount)],
  discount: () => [desc(sql`COALESCE(NULLIF(${product.discountPrice}, 0), 0)`), desc(product.createdAt)],
};

export class ListProductsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: Partial<ListProductsInput> = {}) {
    const { page = 1, limit = 12 } = input;
    const offset = (page - 1) * limit;

    const whereClause = this.buildWhereClause(input);
    const categoryFilter = this.buildCategoryFilter(input.category, whereClause);
    const orderByClause = this.buildOrderByClause(input.sort);

    const [rows, [{ total }]] = await Promise.all([
      this.fetchProducts({ categoryFilter, orderByClause, limit, offset }),
      this.fetchProductCount(input.category, whereClause),
    ]);

    const reviewCountMap = await getProductReviewCountMap(
      this.db,
      rows.map((r) => r.id),
    );

    return {
      products: rows.map((p) => this.mapProduct(p, reviewCountMap.get(p.id) ?? 0)),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }

  private buildWhereClause(input: Partial<ListProductsInput> = {}) {
    const { search, featured, inStock, onSale, minPrice, maxPrice, rating, brand } = input;
    const conditions = [eq(product.status, "ACTIVE"), eq(product.isDeleted, false)];

    if (featured) {
      conditions.push(eq(product.isFeatured, true));
    }

    if (inStock !== undefined) {
      conditions.push(eq(product.inStock, inStock));
    }

    if (onSale) {
      conditions.push(and(isNotNull(product.discountPrice), sql`${product.discountPrice} > 0 AND ${product.discountPrice} < ${product.price}`)!);
    }

    if (minPrice !== undefined && minPrice > 0) {
      conditions.push(sql`${product.price} >= ${minPrice}`);
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      conditions.push(sql`${product.price} <= ${maxPrice}`);
    }

    if (rating !== undefined && rating > 0) {
      conditions.push(sql`${product.rating} >= ${rating}`);
    }

    if (brand) {
      conditions.push(sql`CAST(${product.specifications} AS text) ILIKE ${'%' + brand + '%'}`);
    }

    if (search) {
      conditions.push(
        or(
          ilike(product.title, `%${search}%`),
          ilike(product.slug, `%${search}%`),
          ilike(product.markdown_description, `%${search}%`),
          sql`CAST(${product.specifications} AS text) ILIKE ${'%' + search + '%'}`,
          sql`${product.tags} && ARRAY[${search}]::text[]`,
        )!,
      );
    }

    return and(...conditions);
  }

  private buildCategoryFilter(catSlug: string | undefined, whereClause: ReturnType<typeof and>) {
    if (!catSlug) return whereClause;

    const categorySubquery = this.db.select({ id: category.id }).from(category).where(eq(category.slug, catSlug)).limit(1);

    return and(whereClause, eq(product.categoryId, sql`(${categorySubquery})`));
  }

  private buildOrderByClause(sort?: string): OrderByClause {
    const resolver = sort && ORDER_BY_MAP[sort];
    return resolver ? resolver(product) : [desc(product.createdAt)];
  }

  private fetchProducts({
    categoryFilter,
    orderByClause,
    limit,
    offset,
  }: {
    categoryFilter: ReturnType<typeof and>;
    orderByClause: OrderByClause;
    limit: number;
    offset: number;
  }) {
    return this.db
      .select({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        isFeatured: product.isFeatured,
        inStock: product.inStock,
        soldCount: product.soldCount,
        rating: product.rating,
        categoryName: category.name,
      })
      .from(product)
      .leftJoin(category, eq(product.categoryId, category.id))
      .where(categoryFilter)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);
  }

  private mapProduct(
    p: {
      id: string;
      title: string;
      slug: string;
      price: string | number;
      discountPrice: string | number | null;
      images: string[] | null;
      isFeatured: boolean | null;
      inStock: boolean | null;
      soldCount: number | null;
      rating: string | number | null;
      categoryName: string | null;
    },
    reviewsCount: number,
  ) {
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: Number(p.price),
      discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
      thumbnail: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      brand: p.categoryName || "GADGET",
      isFeatured: p.isFeatured ?? false,
      inStock: p.inStock ?? true,
      soldCount: p.soldCount ?? 360,
      reviewsCount,
      reviewCount: reviewsCount,
      rating: reviewsCount > 0 ? Number(p.rating ?? 0) : 0,
    };
  }

  private fetchProductCount(catSlug: string | undefined, whereClause: ReturnType<typeof and>) {
    return this.db
      .select({ total: count() })
      .from(product)
      .leftJoin(category, eq(product.categoryId, category.id))
      .where(catSlug ? and(whereClause, eq(category.slug, catSlug)) : whereClause);
  }
}
