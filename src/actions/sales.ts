"use server";

import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq, or, ilike, desc, asc, count, and, gte, lte, inArray, isNotNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, isValidDate, isNonNegativeNumber, isPositiveInt, type ActionResult } from "./_utils";

const MAX_PAGE_SIZE = 100;
const MAX_NAME_LENGTH = 200;
const MAX_ADDRESS_LENGTH = 500;
const MAX_PHONE_LENGTH = 30;
const SUCCESS_STATUSES = ["COMPLETED", "DELIVERED"] as const;
const VALID_STATUSES = new Set(["PENDING", "COMPLETED", "DELIVERED", "CANCELLED", "RETURNED"]);
const DEFAULT_STATUS = "COMPLETED";

export type SaleResult<T> = ActionResult<T>;

export interface GetSalesInput {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  sellerName?: string;
}

export interface CreateSaleInput {
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

export type UpdateSaleInput = Partial<CreateSaleInput>;

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
}) => (sellPrice - buyPrice - boostingCost) * quantity;

function serializeSale<
  T extends {
    buyPrice: unknown;
    sellPrice: unknown;
    boostingCost: unknown;
    profit: unknown;
  },
>(s: T) {
  return {
    ...s,
    buyPrice: Number(s.buyPrice),
    sellPrice: Number(s.sellPrice),
    boostingCost: Number(s.boostingCost),
    profit: Number(s.profit),
  };
}

function validateSaleInput(input: CreateSaleInput, opts: { partial: boolean }): string | null {
  const check = (field: keyof CreateSaleInput) => !opts.partial || input[field] !== undefined;

  if (check("productName")) {
    const v = input.productName?.trim();
    if (!v) return "Product name is required";
    if (v.length > MAX_NAME_LENGTH) return "Product name is too long";
  }
  if (check("customerName")) {
    const v = input.customerName?.trim();
    if (!v) return "Customer name is required";
    if (v.length > MAX_NAME_LENGTH) return "Customer name is too long";
  }
  if (check("quantity") && !isPositiveInt(input.quantity)) return "Quantity must be a positive integer";
  if (check("buyPrice") && !isNonNegativeNumber(input.buyPrice)) return "Buy price must be a non-negative number";
  if (check("sellPrice") && !isNonNegativeNumber(input.sellPrice)) return "Sell price must be a non-negative number";
  if (check("boostingCost") && !isNonNegativeNumber(input.boostingCost)) return "Boosting cost must be a non-negative number";
  if (input.date !== undefined && !isValidDate(input.date)) return "Invalid sale date";
  if (input.status !== undefined && !VALID_STATUSES.has(input.status)) return "Invalid sale status";
  if (input.phoneNumber !== undefined && input.phoneNumber.length > MAX_PHONE_LENGTH) return "Phone number is too long";
  if (input.address !== undefined && input.address.length > MAX_ADDRESS_LENGTH) return "Address is too long";
  return null;
}

async function getProductWiseStats({ from, sellerName }: { from: Date; sellerName?: string }) {
  const conditions = [gte(sale.date, from), inArray(sale.status, SUCCESS_STATUSES as unknown as string[])];
  if (sellerName) conditions.push(eq(sale.sellerName, sellerName));

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
    const prev = map.get(row.productName) ?? {
      productName: row.productName,
      soldQty: 0,
      totalSellAmount: 0,
    };
    prev.soldQty += row.quantity;
    prev.totalSellAmount += Number(row.sellPrice) * row.quantity;
    map.set(row.productName, prev);
  }

  return Array.from(map.values()).sort((a, b) => b.totalSellAmount - a.totalSellAmount);
}

const EMPTY_SALES_RESPONSE = {
  sales: [] as any[],
  totalProfit: 0,
  sellerOptions: [] as string[],
  totals: { totalSoldQuantity: 0, totalSellPrices: 0, cancelCount: 0, returnCount: 0 },
  productWise: {
    today: [] as { productName: string; soldQty: number; totalSellAmount: number }[],
    last7Days: [] as { productName: string; soldQty: number; totalSellAmount: number }[],
    last30Days: [] as { productName: string; soldQty: number; totalSellAmount: number }[],
  },
  metadata: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

export async function getSales(input: GetSalesInput = {}) {
  try {
    const admin = await requireAdmin();
    if (!admin) return EMPTY_SALES_RESPONSE;

    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, input.limit ?? 10));
    const search = input.search?.trim() ?? "";
    const sellerFilter = input.sellerName && input.sellerName !== "all" ? input.sellerName : undefined;
    const offset = (page - 1) * limit;

    if (input.startDate && !isValidDate(input.startDate)) return EMPTY_SALES_RESPONSE;
    if (input.endDate && !isValidDate(input.endDate)) return EMPTY_SALES_RESPONSE;

    const conditions = [];
    if (search) {
      conditions.push(
        or(ilike(sale.productName, `%${search}%`), ilike(sale.customerName, `%${search}%`), ilike(sale.phoneNumber, `%${search}%`))!,
      );
    }
    if (sellerFilter) conditions.push(eq(sale.sellerName, sellerFilter));
    if (input.startDate) conditions.push(gte(sale.date, input.startDate));
    if (input.endDate) conditions.push(lte(sale.date, input.endDate));

    const whereClause = conditions.length ? and(...conditions) : undefined;
    const now = Date.now();

    const [salesList, [{ total }], [{ totalProfit }], [summary], sellerRows, productWiseToday, productWise7Days, productWise30Days] =
      await Promise.all([
        db.query.sale.findMany({
          where: whereClause,
          limit,
          offset,
          orderBy: [desc(sale.date)],
        }),
        db.select({ total: count() }).from(sale).where(whereClause),
        db
          .select({
            totalProfit: sql<string>`COALESCE(SUM(${sale.profit}), 0)`,
          })
          .from(sale)
          .where(whereClause),
        db
          .select({
            totalSoldQuantity: sql<string>`COALESCE(SUM(CASE WHEN UPPER(${sale.status}) IN ('COMPLETED', 'DELIVERED') THEN ${sale.quantity} ELSE 0 END), 0)`,
            totalSellPrices: sql<string>`COALESCE(SUM(CASE WHEN UPPER(${sale.status}) IN ('COMPLETED', 'DELIVERED') THEN ${sale.sellPrice} * ${sale.quantity} ELSE 0 END), 0)`,
            cancelCount: sql<string>`COALESCE(SUM(CASE WHEN UPPER(${sale.status}) = 'CANCELLED' THEN 1 ELSE 0 END), 0)`,
            returnCount: sql<string>`COALESCE(SUM(CASE WHEN UPPER(${sale.status}) = 'RETURNED' THEN 1 ELSE 0 END), 0)`,
          })
          .from(sale)
          .where(whereClause),
        db.selectDistinct({ sellerName: sale.sellerName }).from(sale).where(isNotNull(sale.sellerName)).orderBy(asc(sale.sellerName)),
        getProductWiseStats({
          from: toStartOfDay(new Date()),
          sellerName: sellerFilter,
        }),
        getProductWiseStats({
          from: new Date(now - 7 * 24 * 60 * 60 * 1000),
          sellerName: sellerFilter,
        }),
        getProductWiseStats({
          from: new Date(now - 30 * 24 * 60 * 60 * 1000),
          sellerName: sellerFilter,
        }),
      ]);

    return {
      sales: salesList.map(serializeSale),
      totalProfit: Number(totalProfit) || 0,
      sellerOptions: sellerRows.map((s) => s.sellerName).filter((v): v is string => Boolean(v)),
      totals: {
        totalSoldQuantity: Number(summary.totalSoldQuantity) || 0,
        totalSellPrices: Number(summary.totalSellPrices) || 0,
        cancelCount: Number(summary.cancelCount) || 0,
        returnCount: Number(summary.returnCount) || 0,
      },
      productWise: {
        today: productWiseToday,
        last7Days: productWise7Days,
        last30Days: productWise30Days,
      },
      metadata: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      },
    };
  } catch (err) {
    console.error("getSales failed:", err);
    return EMPTY_SALES_RESPONSE;
  }
}

export async function createSale(input: CreateSaleInput): Promise<SaleResult<{ id: string; profit: number }>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const validationError = validateSaleInput(input, { partial: false });
    if (validationError) return fail(validationError);

    const profit = calculateProfit({
      quantity: input.quantity,
      buyPrice: input.buyPrice,
      sellPrice: input.sellPrice,
      boostingCost: input.boostingCost,
    });

    const [created] = await db
      .insert(sale)
      .values({
        productName: input.productName.trim(),
        quantity: input.quantity,
        buyPrice: String(input.buyPrice),
        sellPrice: String(input.sellPrice),
        boostingCost: String(input.boostingCost),
        profit: String(profit),
        customerName: input.customerName.trim(),
        phoneNumber: input.phoneNumber?.trim() || null,
        address: input.address?.trim() || null,
        sellerName: input.sellerName?.trim() || null,
        date: input.date ?? new Date(),
        status: input.status ?? DEFAULT_STATUS,
      })
      .returning({ id: sale.id, profit: sale.profit });

    revalidatePath("/admin/sales");
    return ok({ id: created.id, profit: Number(created.profit) });
  } catch (err) {
    console.error("createSale failed:", err);
    return fail("Failed to create sale");
  }
}

export async function updateSale(id: string, input: UpdateSaleInput): Promise<SaleResult<{ id: string; profit: number }>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const validationError = validateSaleInput(input as CreateSaleInput, {
      partial: true,
    });
    if (validationError) return fail(validationError);

    const existing = await db.query.sale.findFirst({
      where: eq(sale.id, id),
    });
    if (!existing) return fail("Sale not found");

    const merged = {
      quantity: input.quantity ?? existing.quantity,
      buyPrice: Number(input.buyPrice ?? existing.buyPrice),
      sellPrice: Number(input.sellPrice ?? existing.sellPrice),
      boostingCost: Number(input.boostingCost ?? existing.boostingCost),
    };
    const profit = calculateProfit(merged);

    const patch: Record<string, unknown> = { profit: String(profit) };
    if (input.productName !== undefined) patch.productName = input.productName.trim();
    if (input.quantity !== undefined) patch.quantity = input.quantity;
    if (input.buyPrice !== undefined) patch.buyPrice = String(input.buyPrice);
    if (input.sellPrice !== undefined) patch.sellPrice = String(input.sellPrice);
    if (input.boostingCost !== undefined) patch.boostingCost = String(input.boostingCost);
    if (input.customerName !== undefined) patch.customerName = input.customerName.trim();
    if (input.phoneNumber !== undefined) patch.phoneNumber = input.phoneNumber?.trim() || null;
    if (input.address !== undefined) patch.address = input.address?.trim() || null;
    if (input.sellerName !== undefined) patch.sellerName = input.sellerName?.trim() || null;
    if (input.date !== undefined) patch.date = input.date;
    if (input.status !== undefined) patch.status = input.status;

    const [updated] = await db
      .update(sale)
      .set(patch as any)
      .where(eq(sale.id, id))
      .returning({ id: sale.id, profit: sale.profit });

    revalidatePath("/admin/sales");
    revalidatePath(`/admin/sales/${id}`);
    return ok({ id: updated.id, profit: Number(updated.profit) });
  } catch (err) {
    console.error("updateSale failed:", err);
    return fail("Failed to update sale");
  }
}

export async function deleteSale(id: string): Promise<SaleResult<null>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return fail("Unauthorized");

    const [deleted] = await db.delete(sale).where(eq(sale.id, id)).returning({ id: sale.id });

    if (!deleted) return fail("Sale not found");

    revalidatePath("/admin/sales");
    return ok(null);
  } catch (err) {
    console.error("deleteSale failed:", err);
    return fail("Failed to delete sale");
  }
}