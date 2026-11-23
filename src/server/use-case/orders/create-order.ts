import { db } from "@/db";
import { order, product, promoCode, type OrderStatus } from "@/db/schema";
import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import type { Context } from "@/server/context";
import { evaluatePromoCode } from "@/server/use-case/promo-codes/_shared";

const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const MAX_USER_AGENT = 500;
const DEFAULT_PAYMENT = "CASH_ON_DELIVERY";
const DEFAULT_STATUS: OrderStatus = "PENDING";

export interface OrderItem {
  id: string;
  qty: number;
  [key: string]: unknown;
}

export interface CreateOrderInput {
  customerName: string;
  phoneNumber: string;
  address: string;
  city?: string;
  area?: string;
  items: OrderItem[];
  totalAmount?: number;
  shippingCost?: number;
  discountAmount?: number;
  promoCode?: string;
  paymentMethod?: string;
  notes?: string;
  whatsappMessage?: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class CreateOrderUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: CreateOrderInput) {
    const validationError = this.validateInput(input);
    if (validationError) {
      return { success: false as const, error: validationError, message: validationError };
    }

    const totalCheck = await this.computeTotal(input.items);
    if (!totalCheck.ok) {
      return { success: false as const, error: totalCheck.error, message: totalCheck.error };
    }

    try {
      const shipping =
        input.city === "Dhaka" ? 80 : input.city === "Outside Dhaka" ? 130 : Math.max(input.shippingCost ?? 0, 0);
      let promoDiscount = 0;
      let appliedPromoId: string | null = null;
      let appliedPromoCode: string | null = null;

      if (input.promoCode?.trim()) {
        const normalizedCode = input.promoCode.trim().toUpperCase();
        const foundPromo = await this.dbInstance.query.promoCode.findFirst({
          where: eq(promoCode.code, normalizedCode),
        });
        const promoEval = evaluatePromoCode(foundPromo, totalCheck.total);
        if (!promoEval.valid) {
          return { success: false as const, error: promoEval.message, message: promoEval.message };
        }
        promoDiscount = promoEval.discountAmount;
        appliedPromoId = promoEval.promo.id;
        appliedPromoCode = promoEval.promo.code;

        const [claimed] = await this.dbInstance
          .update(promoCode)
          .set({ usedCount: sql`${promoCode.usedCount} + 1` })
          .where(
            and(
              eq(promoCode.id, appliedPromoId),
              or(isNull(promoCode.usageLimit), lt(promoCode.usedCount, promoCode.usageLimit))
            )
          )
          .returning({ id: promoCode.id });

        if (!claimed) {
          return {
            success: false as const,
            error: "This promo code has reached its usage limit.",
            message: "This promo code has reached its usage limit.",
          };
        }
      }

      const totalDiscount = totalCheck.productDiscount + promoDiscount;
      const finalTotal = Math.max(totalCheck.total + shipping - promoDiscount, 0);

      const [newOrder] = await this.dbInstance
        .insert(order)
        .values({
          customerName: input.customerName.trim(),
          phoneNumber: input.phoneNumber.trim(),
          address: input.address.trim(),
          city: input.city?.trim() || null,
          area: input.area?.trim() || null,
          items: input.items,
          totalAmount: String(finalTotal),
          shippingCost: String(shipping),
          discountAmount: String(totalDiscount),
          promoCode: appliedPromoCode,
          paymentMethod: input.paymentMethod || DEFAULT_PAYMENT,
          notes: input.notes?.trim() || null,
          whatsappMessage: input.whatsappMessage?.trim() || null,
          userId: input.userId || null,
          status: DEFAULT_STATUS,
          userAgent: (input.userAgent ?? "unknown").slice(0, MAX_USER_AGENT),
          ipAddress: input.ipAddress ?? "unknown",
        })
        .returning();

      return {
        success: true as const,
        data: {
          id: newOrder.id,
          orderId: newOrder.id,
          totalAmount: finalTotal,
          status: newOrder.status,
        },
      };
    } catch (err: unknown) {
      console.error("CreateOrderUseCase failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to create order";
      return { success: false as const, error: msg, message: msg };
    }
  }

  private validateInput(input: CreateOrderInput): string | null {
    if (!input.customerName?.trim()) return "Customer name is required";
    if (!input.phoneNumber?.trim()) return "Phone number is required";
    if (!PHONE_RE.test(input.phoneNumber.trim())) return "Invalid phone number format";
    if (!input.address?.trim()) return "Delivery address is required";
    if (!Array.isArray(input.items) || !input.items.length) return "Order must contain at least one item";
    return null;
  }

  private async computeTotal(
    items: OrderItem[]
  ): Promise<{ ok: true; total: number; productDiscount: number } | { ok: false; error: string }> {
    for (const item of items) {
      if (!item.id || !Number.isInteger(item.qty) || item.qty < 1) {
        return { ok: false, error: "Invalid item or quantity in order" };
      }
    }

    const productIds = Array.from(new Set(items.map((i) => i.id)));
    const products = await this.dbInstance
      .select({ id: product.id, price: product.price, discountPrice: product.discountPrice })
      .from(product)
      .where(inArray(product.id, productIds));

    const priceMap = new Map<string, { regular: number; effective: number }>();
    for (const p of products) {
      const regular = Number(p.price);
      const effective = p.discountPrice != null ? Number(p.discountPrice) : regular;
      if (Number.isFinite(effective) && effective >= 0) {
        priceMap.set(p.id, { regular, effective });
      }
    }

    let total = 0;
    let productDiscount = 0;
    for (const item of items) {
      const pricing = priceMap.get(item.id);
      if (pricing === undefined) {
        return { ok: false, error: `Product ${item.id} is no longer available` };
      }
      total += pricing.effective * item.qty;
      if (pricing.regular > pricing.effective) {
        productDiscount += (pricing.regular - pricing.effective) * item.qty;
      }
    }

    return { ok: true, total, productDiscount };
  }
}

