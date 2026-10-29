import { eq } from "drizzle-orm";
import { product, auditLog, type ProductStatus, type ProductLabel, type AuditAction } from "@/db/schema";
import { normalizeVideoInput } from "@/lib/video-links";
import type { Context } from "@/server/context";
import type { UpdateProductInput } from "@/server/schemas/products.schema";
import { formatProduct } from "./_shared";

type UpdateData = UpdateProductInput["data"];

const FIELD_TRANSFORMS: Record<string, (v: any) => unknown> = {
  price: (v) => String(v),
  discountPrice: (v) => (v != null ? String(v) : null),
  status: (v) => v as ProductStatus,
  label: (v) => v as ProductLabel,
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

    const [updated] = await Promise.all([this.findUpdated(id), this.recordAudit(id, data)]);

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

  private async recordAudit(id: string, data: UpdateData) {
    const action: AuditAction = data.status ? "STATUS_CHANGE" : "UPDATE_PRODUCT";
    try {
      return await this.db.insert(auditLog).values({
        action,
        actorId: this.actorId,
        metadata: { productId: id, changes: Object.keys(data) },
      });
    } catch {
      return null;
    }
  }
}
