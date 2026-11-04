import { count, desc, sql } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";

export class ListBrandsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    const rows = await this.db
      .select({
        name: product.brand,
        count: count(),
      })
      .from(product)
      .where(sql`${product.status} = 'ACTIVE' AND ${product.brand} IS NOT NULL AND TRIM(${product.brand}) != ''`)
      .groupBy(product.brand)
      .orderBy(desc(count()));

    return rows
      .filter((r): r is { name: string; count: number } => Boolean(r.name && r.name.trim()))
      .map((r) => ({
        name: r.name.trim(),
        count: Number(r.count),
      }));
  }
}

