import { eq } from "drizzle-orm";
import { product, type ProductStatus, type AuditAction } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import type { Context } from "@/server/context";
import type { UpdateProductInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";
import { writeAudit } from "@/server/lib/orm";

type UpdateData = UpdateProductInput["data"];

const FIELD_TRANSFORMS: Record<string, (v: any) => unknown> = {
  price: (v) => String(v),
  discountPrice: (v) => (v != null ? String(v) : null),
  status: (v) => v as ProductStatus,
  videoLinks: (v) => (Array.isArray(v) ? v.map((l: string) => normalizeVideoInput(l)).filter(Boolean) : v),
};

export class UpdateProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute({ id, data }: UpdateProductInput) {
    const payload = this.buildUpdatePayload(data);
    await this.persistUpdate(id, payload);

    const updated = await this.findUpdated(id);
    await this.recordAudit(id, data, updated?.title);

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
      .set(payload as any)
      .where(eq(product.id, id));
  }

  private findUpdated(id: string) {
    return this.db.query.product.findFirst({
      where: eq(product.id, id),
      with: { category: true },
    });
  }

  private async recordAudit(id: string, data: UpdateData, title?: string) {
    const keys = Object.keys(data);
    const isOnlyStatusChange = keys.length === 1 && data.status !== undefined;
    const action: AuditAction = isOnlyStatusChange ? "STATUS_CHANGE" : "UPDATE_PRODUCT";

    return writeAudit(this.db, {
      action,
      actorId: this.actorId,
      metadata: {
        productId: id,
        title: title || (data as any)?.title,
        changes: keys,
      },
    });
  }
}
