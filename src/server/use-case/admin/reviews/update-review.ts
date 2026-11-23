import { eq } from "drizzle-orm";
import { customerReview, type ReviewStatus } from "@/db/schema";
import type { Context } from "@/server/context";
import { PRODUCT_COLUMNS } from "./_shared";

interface FieldRule {
  include: "truthy" | "defined";
  cast?: (v: unknown) => unknown;
}

const FIELD_RULES: Record<string, FieldRule> = {
  customerName: { include: "truthy" },
  customerPic: { include: "defined" },
  review: { include: "truthy" },
  rating: { include: "truthy" },
  status: { include: "truthy", cast: (v) => v as ReviewStatus },
  productId: { include: "defined" },
};

export class UpdateReviewUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ id, ...data }: { id: string } & Record<string, unknown>) {
    const payload = this.buildUpdatePayload(data);
    await this.persistUpdate(id, payload);
    const updated = await this.findWithProduct(id);
    if (!updated) throw new Error("Review not found");
    return updated;
  }

  private buildUpdatePayload(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {};
    for (const [key, { include, cast }] of Object.entries(FIELD_RULES)) {
      const value = data[key];
      const keep = include === "truthy" ? Boolean(value) : value !== undefined;
      if (!keep) continue;
      payload[key] = cast ? cast(value) : value;
    }
    return payload;
  }

  private persistUpdate(id: string, payload: Record<string, unknown>) {
    return this.db
      .update(customerReview)
      .set(payload)
      .where(eq(customerReview.id, id));
  }

  private findWithProduct(id: string) {
    return this.db.query.customerReview.findFirst({
      where: eq(customerReview.id, id),
      with: { product: { columns: PRODUCT_COLUMNS } },
    });
  }
}
