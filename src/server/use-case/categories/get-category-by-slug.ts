import { eq, count } from "drizzle-orm";
import { category, product } from "@/db/schema";
import type { Context } from "@/server/context";

export class GetCategoryBySlugUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(slug: string) {
    const result = await this.db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        productCount: count(product.id),
      })
      .from(category)
      .leftJoin(product, eq(product.categoryId, category.id))
      .where(eq(category.slug, slug))
      .groupBy(category.id)
      .limit(1);

    if (!result.length) return null;

    const c = result[0];
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: { products: Number(c.productCount) },
    };
  }
}

