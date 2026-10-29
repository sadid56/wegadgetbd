import { and, or, ilike, desc, count } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";
import { formatProduct } from "./_shared";

export interface AdminListProductsInput {
  page?: number;
  limit?: number;
  search?: string;
}

export class AdminListProductsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input?: AdminListProductsInput) {
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 12;
    const offset = (page - 1) * limit;

    const whereClause = this.buildWhereClause(input?.search);

    const [rows, [{ total }]] = await Promise.all([this.fetchProducts(whereClause, limit, offset), this.fetchProductCount(whereClause)]);

    return {
      products: rows.map(formatProduct),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }

  private buildWhereClause(search?: string) {
    const conditions = [];
    if (search) {
      conditions.push(or(ilike(product.title, `%${search}%`), ilike(product.description, `%${search}%`))!);
    }
    return conditions.length ? and(...conditions) : undefined;
  }

  private fetchProducts(whereClause: ReturnType<typeof and>, limit: number, offset: number) {
    return this.db.query.product.findMany({
      where: whereClause,
      orderBy: [desc(product.createdAt)],
      limit,
      offset,
      with: { category: true },
    });
  }

  private fetchProductCount(whereClause: ReturnType<typeof and>) {
    return this.db.select({ total: count() }).from(product).where(whereClause);
  }
}
