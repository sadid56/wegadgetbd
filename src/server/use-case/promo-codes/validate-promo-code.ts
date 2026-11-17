import { eq } from "drizzle-orm";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ValidatePromoCodeInput, ValidatePromoCodeOutput } from "@/server/schemas/promo-codes.schema";
import { evaluatePromoCode } from "./_shared";

export class ValidatePromoCodeUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: ValidatePromoCodeInput): Promise<ValidatePromoCodeOutput> {
    const normalizedCode = input.code.trim().toUpperCase();
    if (!normalizedCode) {
      return { valid: false, message: "Please enter a promo code." };
    }

    const found = await this.db.query.promoCode.findFirst({
      where: eq(promoCode.code, normalizedCode),
    });

    const result = evaluatePromoCode(found, input.subtotal);
    if (!result.valid) {
      return { valid: false, message: result.message };
    }

    return {
      valid: true,
      code: result.promo.code,
      discountType: result.promo.discountType,
      discountValue: Number(result.promo.discountValue),
      discountAmount: result.discountAmount,
      message: `Promo code "${result.promo.code}" applied! You save ৳${result.discountAmount.toLocaleString()}.`,
    };
  }
}
