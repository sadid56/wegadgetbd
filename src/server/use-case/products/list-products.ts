import { eq, and, or, ilike, desc, asc, count, sql } from "drizzle-orm";
import { product, category, type ProductLabel } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ListProductsInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";

type OrderByClause = ReturnType<typeof asc>[];

const ORDER_BY_MAP: Record<string, (p: typeof product) => OrderByClause> = {
  "price-asc": () => [asc(product.price)],
  "price-desc": () => [desc(product.price)],
  newest: () => [desc(product.createdAt)],
  "best-selling": () => [desc(product.soldCount), desc(product.rating)],
};

export class ListProductsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: ListProductsInput) {
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

  private buildWhereClause({ search, label, featured }: Pick<ListProductsInput, "search" | "label" | "featured">) {
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
