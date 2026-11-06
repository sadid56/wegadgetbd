import { eq, and, or, ilike, desc, asc, count, sql, isNotNull } from "drizzle-orm";
import { product, category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ListProductsInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";

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

    return {
      products: rows.map(formatProduct),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }

  private buildWhereClause(input: Partial<ListProductsInput> = {}) {
    const { search, featured, inStock, onSale, minPrice, maxPrice, rating, brand } = input;
    const conditions = [eq(product.status, "ACTIVE")];

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
      conditions.push(ilike(product.brand, `%${brand}%`));
    }

    if (search) {
      conditions.push(
        or(
          ilike(product.title, `%${search}%`),
          ilike(product.slug, `%${search}%`),
          ilike(product.brand, `%${search}%`),
          ilike(product.model, `%${search}%`),
          ilike(product.description, `%${search}%`),
          sql`${product.tags} && ARRAY[${search}]::text[]`,
        )!,
      );
    }

    return and(...conditions);
  }

  private buildCategoryFilter(catSlug: string | undefined, whereClause: ReturnType<typeof and>) {
    if (!catSlug) return whereClause;

    const categorySubquery = this.db.select({ id: category.id }).from(category).where(eq(category.slug, catSlug)).limit(1);

    return and(whereClause, eq(product.categoryId, categorySubquery as any));
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
    return this.db.query.product.findMany({
      where: categoryFilter,
      orderBy: orderByClause,
      limit,
      offset,
      with: { category: true },
    });
  }

  private fetchProductCount(catSlug: string | undefined, whereClause: ReturnType<typeof and>) {
    return this.db
      .select({ total: count() })
      .from(product)
      .leftJoin(category, eq(product.categoryId, category.id))
      .where(catSlug ? and(whereClause, eq(category.slug, catSlug)) : whereClause);
  }
}
