import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";
import type { CreatePromoCodeInput } from "@/server/schemas/promo-codes.schema";
import { writeAudit } from "@/server/lib/orm";
import { formatPromoCode } from "./_shared";

export class CreatePromoCodeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: CreatePromoCodeInput, userId?: string) {
    const normalizedCode = input.code.trim().toUpperCase();

    if (input.discountType === "PERCENTAGE" && input.discountValue > 100) {
      throw new ORPCError("BAD_REQUEST", { message: "Percentage discount cannot exceed 100%." });
    }

    const existing = await this.db.query.promoCode.findFirst({
      where: eq(promoCode.code, normalizedCode),
      columns: { id: true },
    });

    if (existing) {
      throw new ORPCError("CONFLICT", { message: `Promo code "${normalizedCode}" already exists.` });
    }

    const startsAt = input.startsAt ? new Date(input.startsAt) : null;
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;

    if (startsAt && expiresAt && expiresAt <= startsAt) {
      throw new ORPCError("BAD_REQUEST", { message: "Expiry date must be after start date." });
    }

    const [created] = await this.db
      .insert(promoCode)
      .values({
        code: normalizedCode,
        description: input.description?.trim() || null,
        discountType: input.discountType,
        discountValue: String(input.discountValue),
        maxDiscountAmount: input.maxDiscountAmount != null ? String(input.maxDiscountAmount) : null,
        minOrderAmount: String(input.minOrderAmount ?? 0),
        usageLimit: input.usageLimit ?? null,
        startsAt,
        expiresAt,
        isActive: input.isActive ?? true,
      })
      .returning();

    await writeAudit(this.db, {
      actorId: userId,
      actorType: "ADMIN",
      action: "CREATE",
      metadata: { entity: "PROMO_CODE", id: created.id, code: created.code },
    });

    return formatPromoCode(created);
  }
}
