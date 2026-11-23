import { eq } from "drizzle-orm";
import { product, type ProductStatus } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import type { Context } from "@/server/context";
import type { UpdateProductInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";
import { revalidateProductPaths } from "@/server/lib/revalidate";

type UpdateData = UpdateProductInput["data"];

const FIELD_TRANSFORMS: Record<string, (v: unknown) => unknown> = {
  price: (v) => String(v),
  discountPrice: (v) => (v != null ? String(v) : null),
  status: (v) => v as ProductStatus,
  videoLinks: (v) => (Array.isArray(v) ? v.map((l: unknown) => normalizeVideoInput(String(l))).filter(Boolean) : v),
};

export class UpdateProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly _actorId: string,
  ) {}

  async execute({ id, data }: UpdateProductInput) {
    const existing = data.slug
      ? await this.db.query.product.findFirst({ where: eq(product.id, id), columns: { slug: true } })
      : null;

    const payload = this.buildUpdatePayload(data);
    await this.persistUpdate(id, payload);

    const updated = await this.findUpdated(id);
    if (!updated) throw new Error("Product not found");

    revalidateProductPaths([existing?.slug, updated?.slug]);

    return formatProduct(updated);
  }

  private buildUpdatePayload(data: UpdateData): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      const transform = FIELD_TRANSFORMS[key];
      payload[key] = transform ? transform(value) : value;
    }
    return payload;
  }

  private persistUpdate(id: string, payload: Record<string, unknown>) {
    return this.db
      .update(product)
      .set(payload)
      .where(eq(product.id, id));
  }

  private findUpdated(id: string) {
    return this.db.query.product.findFirst({
      where: eq(product.id, id),
      with: { category: true },
    });
  }
}
