import { eq } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";
import { formatProduct } from "./_shared";

export class AdminGetProductUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string) {
    const foundProduct = await this.db.query.product.findFirst({
      where: eq(product.id, id),
      with: { category: true },
    });

    return formatProduct(foundProduct);
  }
}

