import { and, eq, ne } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";
import type { UpdatePromoCodeInput } from "@/server/schemas/promo-codes.schema";
import { writeAudit } from "@/server/lib/orm";
import { formatPromoCode } from "./_shared";

export class UpdatePromoCodeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: UpdatePromoCodeInput, userId?: string) {
    const existing = await this.db.query.promoCode.findFirst({
      where: eq(promoCode.id, input.id),
    });

    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Promo code not found." });
    }

    const nextType = input.discountType ?? existing.discountType;
    const nextValue = input.discountValue ?? Number(existing.discountValue);
    if (nextType === "PERCENTAGE" && nextValue > 100) {
      throw new ORPCError("BAD_REQUEST", { message: "Percentage discount cannot exceed 100%." });
    }

    let normalizedCode = existing.code;
    if (input.code !== undefined) {
      normalizedCode = input.code.trim().toUpperCase();
      const duplicate = await this.db.query.promoCode.findFirst({
        where: and(eq(promoCode.code, normalizedCode), ne(promoCode.id, input.id)),
        columns: { id: true },
      });
      if (duplicate) {
        throw new ORPCError("CONFLICT", { message: `Promo code "${normalizedCode}" already exists.` });
      }
    }

    const startsAt =
      input.startsAt === undefined ? existing.startsAt : input.startsAt ? new Date(input.startsAt) : null;
    const expiresAt =
      input.expiresAt === undefined ? existing.expiresAt : input.expiresAt ? new Date(input.expiresAt) : null;

    if (startsAt && expiresAt && expiresAt <= startsAt) {
      throw new ORPCError("BAD_REQUEST", { message: "Expiry date must be after start date." });
    }

    const [updated] = await this.db
      .update(promoCode)
      .set({
        code: normalizedCode,
        description: input.description === undefined ? existing.description : input.description?.trim() || null,
        discountType: nextType,
        discountValue: String(nextValue),
        maxDiscountAmount:
          input.maxDiscountAmount === undefined
            ? existing.maxDiscountAmount
            : input.maxDiscountAmount != null
            ? String(input.maxDiscountAmount)
            : null,
        minOrderAmount:
          input.minOrderAmount === undefined ? existing.minOrderAmount : String(input.minOrderAmount),
        usageLimit: input.usageLimit === undefined ? existing.usageLimit : input.usageLimit,
        startsAt,
        expiresAt,
        isActive: input.isActive === undefined ? existing.isActive : input.isActive,
      })
      .where(eq(promoCode.id, input.id))
      .returning();

    await writeAudit(this.db, {
      actorId: userId,
      actorType: "ADMIN",
      action: "UPDATE",
      metadata: { entity: "PROMO_CODE", id: updated.id, code: updated.code },
    });

    return formatPromoCode(updated);
  }
}
