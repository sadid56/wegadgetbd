"use server";

import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq, or, ilike, desc, asc, count, and, gte, lte, inArray, isNotNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const SUCCESS_STATUSES = ["COMPLETED", "DELIVERED"];

const toStartOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const calculateProfit = ({
  quantity,
  buyPrice,
  sellPrice,
  boostingCost,
}: {
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  boostingCost: number;
}) => {
  return (sellPrice - buyPrice - boostingCost) * quantity;
};

async function getProductWiseStats({
  from,
  sellerName,
}: {
  from: Date;
  sellerName?: string;
}) {
  const conditions = [
    gte(sale.date, from),
    inArray(sale.status, SUCCESS_STATUSES),
  ];

  if (sellerName) {
    conditions.push(ilike(sale.sellerName, sellerName));
  }

  const rows = await db
    .select({
      productName: sale.productName,
      quantity: sale.quantity,
      sellPrice: sale.sellPrice,
    })
    .from(sale)
    .where(and(...conditions));

  const map = new Map<string, { productName: string; soldQty: number; totalSellAmount: number }>();
  for (const row of rows) {
    const prev = map.get(row.productName) || { productName: row.productName, soldQty: 0, totalSellAmount: 0 };
    prev.soldQty += row.quantity;
    prev.totalSellAmount += Number(row.sellPrice) * row.quantity;
    map.set(row.productName, prev);
  }

  return Array.from(map.values()).sort((a, b) => b.totalSellAmount - a.totalSellAmount);
}

export async function getSales({
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  sellerName,
}: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  sellerName?: string;
} = {}) {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(sale.productName, `%${search}%`),
        ilike(sale.customerName, `%${search}%`),
        ilike(sale.phoneNumber, `%${search}%`)
      )!
    );
  }

  if (sellerName && sellerName !== "all") {
    conditions.push(ilike(sale.sellerName, sellerName));
  }

  if (startDate) {
    conditions.push(gte(sale.date, startDate));
  }
  if (endDate) {
    conditions.push(lte(sale.date, endDate));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [
    salesList,
    [{ total }],
    [{ totalProfit }],
    summaryRows,
    sellerRows,
    productWiseToday,
    productWise7Days,
    productWise30Days,
  ] = await Promise.all([
    db.query.sale.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(sale.date)],
    }),
    db.select({ total: count() }).from(sale).where(whereClause),
    db
      .select({ totalProfit: sql<string>`COALESCE(SUM(${sale.profit}), 0)` })
      .from(sale)
      .where(whereClause),
    db
      .select({
        status: sale.status,
        quantity: sale.quantity,
        sellPrice: sale.sellPrice,
      })
      .from(sale)
      .where(whereClause),
    db
      .selectDistinct({
        sellerName: sale.sellerName,
      })
      .from(sale)
      .where(isNotNull(sale.sellerName))
      .orderBy(asc(sale.sellerName)),
    getProductWiseStats({
      from: toStartOfDay(new Date()),
      sellerName: sellerName && sellerName !== "all" ? sellerName : undefined,
    }),
    getProductWiseStats({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      sellerName: sellerName && sellerName !== "all" ? sellerName : undefined,
    }),
    getProductWiseStats({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      sellerName: sellerName && sellerName !== "all" ? sellerName : undefined,
    }),
  ]);

  const totals = summaryRows.reduce(
    (acc, row) => {
      const status = String(row.status || "").toUpperCase();
      if (SUCCESS_STATUSES.includes(status)) {
        acc.totalSoldQuantity += row.quantity;
        acc.totalSellPrices += Number(row.sellPrice) * row.quantity;
      }
      if (status === "CANCELLED") {
        acc.cancelCount += 1;
      }
      if (status === "RETURNED") {
        acc.returnCount += 1;
      }
      return acc;
    },
    {
      totalSoldQuantity: 0,
      totalSellPrices: 0,
      cancelCount: 0,
      returnCount: 0,
    }
  );

  return {
    sales: salesList.map((s) => ({
      ...s,
      buyPrice: Number(s.buyPrice),
      sellPrice: Number(s.sellPrice),
      boostingCost: Number(s.boostingCost),
      profit: Number(s.profit),
    })),
    totalProfit: Number(totalProfit) || 0,
    sellerOptions: sellerRows
      .map((item) => item.sellerName)
      .filter((value): value is string => Boolean(value)),
    totals,
    productWise: {
      today: productWiseToday,
      last7Days: productWise7Days,
      last30Days: productWise30Days,
    },
    metadata: {
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    },
  };
}

export async function createSale(data: {
  productName: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  boostingCost: number;
  customerName: string;
  phoneNumber?: string;
  address?: string;
  sellerName?: string;
  date?: Date;
  status?: string;
}) {
  try {
    const profit = calculateProfit(data);

    const [newSale] = await db
      .insert(sale)
      .values({
        productName: data.productName,
        quantity: data.quantity,
        buyPrice: String(data.buyPrice),
        sellPrice: String(data.sellPrice),
        boostingCost: String(data.boostingCost),
        profit: String(profit),
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        sellerName: data.sellerName,
        date: data.date || new Date(),
        status: data.status || "COMPLETED",
      })
      .returning();

    revalidatePath("/admin/sales");
    return { success: true, sale: { ...newSale, profit: Number(newSale.profit) } };
  } catch (error) {
    console.error("Failed to create sale:", error);
    return { success: false, error: "Failed to create sale" };
  }
}

export async function updateSale(
  id: string,
  data: {
    productName: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    boostingCost: number;
    customerName: string;
    phoneNumber?: string;
    address?: string;
    sellerName?: string;
    date?: Date;
    status?: string;
  }
) {
  try {
    const profit = calculateProfit(data);

    const [updatedSale] = await db
      .update(sale)
      .set({
        productName: data.productName,
        quantity: data.quantity,
        buyPrice: String(data.buyPrice),
        sellPrice: String(data.sellPrice),
        boostingCost: String(data.boostingCost),
        profit: String(profit),
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        sellerName: data.sellerName,
        date: data.date,
        status: data.status,
      })
      .where(eq(sale.id, id))
      .returning();

    revalidatePath("/admin/sales");
    return { success: true, sale: { ...updatedSale, profit: Number(updatedSale.profit) } };
  } catch (error) {
    console.error("Failed to update sale:", error);
    return { success: false, error: "Failed to update sale" };
  }
}

export async function deleteSale(id: string) {
  try {
    await db.delete(sale).where(eq(sale.id, id));

    revalidatePath("/admin/sales");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete sale:", error);
    return { success: false, error: "Failed to delete sale" };
  }
}
