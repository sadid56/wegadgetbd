import { asc } from "drizzle-orm";
import { category } from "@/db/schema";
import type { Context } from "@/server/context";

export class ListCategoriesUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    return this.db
      .select({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
      })
      .from(category)
      .orderBy(asc(category.name));
  }
}
