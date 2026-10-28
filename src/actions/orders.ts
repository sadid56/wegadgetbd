"use server";

import { db } from "@/db";
import { order, type OrderStatus } from "@/db/schema";
import { eq, or, ilike, desc, count, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createOrder(data: {
  customerName: string;
  phoneNumber: string;
  address: string;
  city?: string;
  area?: string;
  items: any[];
  totalAmount: number;
  shippingCost?: number;
  discountAmount?: number;
  paymentMethod?: string;
  notes?: string;
  whatsappMessage?: string;
  userId?: string;
}) {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "unknown";
    const ipAddress = headerList.get("x-forwarded-for") || "unknown";

    const [newOrder] = await db
      .insert(order)
      .values({
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        area: data.area,
        items: data.items,
        totalAmount: String(data.totalAmount),
        shippingCost: String(data.shippingCost || 0),
        discountAmount: String(data.discountAmount || 0),
        paymentMethod: data.paymentMethod || "CASH_ON_DELIVERY",
        status: "PENDING",
        userAgent,
        ipAddress,
        userId: data.userId,
        notes: data.notes,
        whatsappMessage: data.whatsappMessage,
      })
      .returning();


    return {
      success: true,
      order: {
        ...newOrder,
        totalAmount: Number(newOrder.totalAmount),
        shippingCost: Number(newOrder.shippingCost),
        discountAmount: Number(newOrder.discountAmount),
      },
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders({
  page = 1,
  limit = 10,
  search = "",
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
} = {}) {
  try {
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(order.customerName, `%${search}%`),
          ilike(order.phoneNumber, `%${search}%`),
          ilike(order.address, `%${search}%`)
        )!
      );
    }

    if (status) {
      conditions.push(eq(order.status, status));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [ordersList, [{ total }]] = await Promise.all([
      db.query.order.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(order.createdAt)],
        with: {
          user: {
            columns: { name: true, email: true },
          },
        },
      }),
      db.select({ total: count() }).from(order).where(whereClause),
    ]);

    return {
      success: true,
      orders: ordersList.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        shippingCost: Number(o.shippingCost),
        discountAmount: Number(o.discountAmount),
      })),
      metadata: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const [updatedOrder] = await db
      .update(order)
      .set({ status })
      .where(eq(order.id, id))
      .returning();

    revalidatePath("/admin/orders");
    return {
      success: true,
      order: {
        ...updatedOrder,
        totalAmount: Number(updatedOrder.totalAmount),
        shippingCost: Number(updatedOrder.shippingCost),
        discountAmount: Number(updatedOrder.discountAmount),
      },
    };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(id: string) {
  try {
    await db.delete(order).where(eq(order.id, id));

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}