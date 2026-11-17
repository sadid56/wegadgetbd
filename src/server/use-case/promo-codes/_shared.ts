import type { PromoCode } from "@/db/schema";

export function formatPromoCode(p: PromoCode) {
  return {
    id: p.id,
    code: p.code,
    description: p.description ?? null,
    discountType: p.discountType,
    discountValue: Number(p.discountValue),
    maxDiscountAmount: p.maxDiscountAmount != null ? Number(p.maxDiscountAmount) : null,
    minOrderAmount: Number(p.minOrderAmount ?? 0),
    usageLimit: p.usageLimit ?? null,
    usedCount: p.usedCount ?? 0,
    startsAt: p.startsAt ?? null,
    expiresAt: p.expiresAt ?? null,
    isActive: p.isActive ?? true,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function evaluatePromoCode(
  promo: PromoCode | undefined,
  subtotal: number,
  now: Date = new Date()
):
  | { valid: true; discountAmount: number; promo: PromoCode }
  | { valid: false; message: string } {
  if (!promo) {
    return { valid: false, message: "Invalid promo code. Please check and try again." };
  }

  if (!promo.isActive) {
    return { valid: false, message: "This promo code is currently inactive." };
  }

  if (promo.startsAt && new Date(promo.startsAt) > now) {
    return { valid: false, message: "This promo code is not active yet." };
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < now) {
    return { valid: false, message: "This promo code has expired." };
  }

  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) {
    return { valid: false, message: "This promo code has reached its usage limit." };
  }

  const minOrder = Number(promo.minOrderAmount ?? 0);
  if (subtotal < minOrder) {
    return {
      valid: false,
      message: `Minimum order of ৳${minOrder.toLocaleString()} required for this promo code.`,
    };
  }

  const discountVal = Number(promo.discountValue);
  let discountAmount = 0;

  if (promo.discountType === "PERCENTAGE") {
    discountAmount = Math.round((subtotal * discountVal) / 100);
    if (promo.maxDiscountAmount != null) {
      discountAmount = Math.min(discountAmount, Number(promo.maxDiscountAmount));
    }
  } else {
    discountAmount = discountVal;
  }

  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

  return { valid: true, discountAmount, promo };
}
