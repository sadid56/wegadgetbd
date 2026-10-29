"use server";

import { db } from "@/db";
import { order, product, type OrderStatus } from "@/db/schema";
import { eq, or, ilike, desc, count, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getSession, requireAdmin } from "@/lib/auth";
import { ok, fail, type ActionResult } from "./_utils";

const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const MAX_USER_AGENT = 500;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAYMENT = "CASH_ON_DELIVERY";
const DEFAULT_STATUS: OrderStatus = "PENDING";

export type OrderResult<T> = ActionResult<T>;

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
}

export interface GetOrdersInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}

async function requestMeta() {
  const h = await headers();
  return {
    userAgent: (h.get("user-agent") ?? "unknown").slice(0, MAX_USER_AGENT),
    ipAddress: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
  };
}

async function computeTotal(items: OrderItem[]): Promise<{ ok: true; total: number } | { ok: false; error: string }> {
  if (!items.length) return { ok: false, error: "Order must contain at least one item" };

  for (const item of items) {
    if (!item.id || !Number.isInteger(item.qty) || item.qty < 1) {
      return { ok: false, error: "Invalid order item" };
    }
  }

  const ids = [...new Set(items.map((i) => i.id))];
  const rows = await db.query.product.findMany({
    where: inArray(product.id, ids),
    columns: { id: true, price: true, discountPrice: true, status: true },
  });
  const priceMap = new Map(rows.map((p) => [p.id, { price: Number(p.discountPrice ?? p.price), active: p.status === "ACTIVE" }]));

  let total = 0;
  for (const item of items) {
    const entry = priceMap.get(item.id);
    if (!entry) return { ok: false, error: "One or more products no longer exist" };
    if (!entry.active) return { ok: false, error: "One or more products are unavailable" };
    total += entry.price * item.qty;
  }
  return { ok: true, total };
}

function serializeOrder<T extends { totalAmount: unknown; shippingCost: unknown; discountAmount: unknown }>(o: T) {
  return {
    ...o,
    totalAmount: Number(o.totalAmount),
    shippingCost: Number(o.shippingCost),
    discountAmount: Number(o.discountAmount),
  };
}

export async function createOrder(input: CreateOrderInput): Promise<OrderResult<{ id: string; totalAmount: number }>> {
  try {
    const name = input.customerName?.trim();
    const phone = input.phoneNumber?.trim();
    const address = input.address?.trim();

    if (!name || name.length < 2) return fail("Invalid customer name");
    if (!phone || !PHONE_RE.test(phone)) return fail("Invalid phone number");
    if (!address || address.length < 5) return fail("Invalid address");

    const priced = await computeTotal(input.items);
    if (!priced.ok) return fail(priced.error);

    const meta = await requestMeta();
    const session = await getSession();

    const [created] = await db
      .insert(order)
      .values({
        customerName: name,
        phoneNumber: phone,
        address,
        city: input.city?.trim(),
        area: input.area?.trim(),
        items: input.items,
        totalAmount: String(priced.total),
        shippingCost: "0",
        discountAmount: "0",
        paymentMethod: input.paymentMethod || DEFAULT_PAYMENT,
        status: DEFAULT_STATUS,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        userId: session?.user.id,
        notes: input.notes,
        whatsappMessage: input.whatsappMessage,
      })
      .returning({ id: order.id });

    revalidatePath("/admin/orders");
    return ok({ id: created.id, totalAmount: priced.total });
  } catch (err) {
    console.error("createOrder failed:", err);
    return fail("Failed to create order");
  }
}

export async function getOrders(input: GetOrdersInput = {}) {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, input.limit ?? 10));
    const search = input.search?.trim() ?? "";
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        or(ilike(order.customerName, `%${search}%`), ilike(order.phoneNumber, `%${search}%`), ilike(order.address, `%${search}%`))!,
      );
    }
    if (input.status) conditions.push(eq(order.status, input.status));

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      db.query.order.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(order.createdAt)],
        with: { user: { columns: { name: true, email: true } } },
      }),
      db.select({ total: count() }).from(order).where(whereClause),
    ]);

    return {
      success: true as const,
      orders: rows.map(serializeOrder),
      metadata: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      },
    };
  } catch (err) {
    console.error("getOrders failed:", err);
    return fail("Failed to fetch orders");
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResult<{ id: string; status: OrderStatus }>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const [updated] = await db.update(order).set({ status }).where(eq(order.id, id)).returning({ id: order.id, status: order.status });

    if (!updated) return fail("Order not found");

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return ok(updated);
  } catch (err) {
    console.error("updateOrderStatus failed:", err);
    return fail("Failed to update order status");
  }
}

export async function deleteOrder(id: string): Promise<OrderResult<null>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    await db.delete(order).where(eq(order.id, id));

    revalidatePath("/admin/orders");
    return ok(null);
  } catch (err) {
    console.error("deleteOrder failed:", err);
    return fail("Failed to delete order");
  }
}