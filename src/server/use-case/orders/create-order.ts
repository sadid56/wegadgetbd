import { db } from "@/db";
import { order, product, type OrderStatus } from "@/db/schema";
import { inArray } from "drizzle-orm";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

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
      const shipping = Math.max(input.shippingCost ?? 0, 0);
      const discount = Math.max(input.discountAmount ?? 0, 0);
      const computedTotal = Math.max(totalCheck.total + shipping - discount, 0);
      const finalTotal = input.totalAmount !== undefined ? Math.max(input.totalAmount, 0) : computedTotal;

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
          discountAmount: String(discount),
          paymentMethod: input.paymentMethod || DEFAULT_PAYMENT,
          notes: input.notes?.trim() || null,
          whatsappMessage: input.whatsappMessage?.trim() || null,
          userId: input.userId || null,
          status: DEFAULT_STATUS,
          userAgent: (input.userAgent ?? "unknown").slice(0, MAX_USER_AGENT),
          ipAddress: input.ipAddress ?? "unknown",
        })
        .returning();

      await writeAudit(this.dbInstance, {
        actorId: input.userId || "anonymous",
        action: "CREATE",
        targetType: "ORDER",
        targetId: newOrder.id,
        metadata: { customerName: newOrder.customerName, total: finalTotal },
      });

      return {
        success: true as const,
        data: {
          id: newOrder.id,
          orderId: newOrder.id,
          totalAmount: finalTotal,
          status: newOrder.status,
        },
      };
    } catch (err: any) {
      console.error("CreateOrderUseCase failed:", err);
      const msg = err?.message || "Failed to create order";
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

  private async computeTotal(items: OrderItem[]): Promise<{ ok: true; total: number } | { ok: false; error: string }> {
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

    const priceMap = new Map<string, number>();
    for (const p of products) {
      const effective = p.discountPrice != null ? Number(p.discountPrice) : Number(p.price);
      if (Number.isFinite(effective) && effective >= 0) {
        priceMap.set(p.id, effective);
      }
    }

    let total = 0;
    for (const item of items) {
      const unit = priceMap.get(item.id);
      if (unit === undefined) {
        return { ok: false, error: `Product ${item.id} is no longer available` };
      }
      total += unit * item.qty;
    }

    return { ok: true, total };
  }
}

