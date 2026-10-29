import { eq, asc, count } from "drizzle-orm";
import { category, product } from "@/db/schema";
import type { Context } from "@/server/context";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  productCount: number | string;
};

export class ListCategoriesUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    const rows = await this.fetchCategoriesWithCount();
    return rows.map(this.formatCategory);
  }

  private fetchCategoriesWithCount() {
    return this.db
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
      .groupBy(category.id)
      .orderBy(asc(category.name));
  }

  private formatCategory(c: CategoryRow) {
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
