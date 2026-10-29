import { eq, and, or } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";
import { formatProduct } from "./_shared";

export class GetProductBySlugUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(slug: string) {
    const foundProduct = await this.db.query.product.findFirst({
      where: and(or(eq(product.slug, slug), eq(product.id, slug)), eq(product.status, "ACTIVE")),
      with: { category: true },
    });

    return formatProduct(foundProduct);
  }
}

