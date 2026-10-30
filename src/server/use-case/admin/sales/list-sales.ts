import { db } from "@/db";
import { sale } from "@/db/schema";
import { eq, or, ilike, desc, count, and, gte, lte, inArray, isNotNull, sql } from "drizzle-orm";
import type { Context } from "@/server/context";
import { isValidDate } from "@/server/lib/action-utils";
import {
  MAX_PAGE_SIZE,
  SUCCESS_STATUSES,
  serializeSale,
  getProductWiseStats,
} from "./_shared";

export interface ListSalesInput {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  sellerName?: string;
}

const toStartOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export class ListSalesUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: ListSalesInput = {}) {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, input.limit ?? 10));
    const search = input.search?.trim() ?? "";
    const sellerFilter = input.sellerName && input.sellerName !== "all" ? input.sellerName : undefined;
    const offset = (page - 1) * limit;

    if (input.startDate && !isValidDate(input.startDate)) return this.emptyResponse();
    if (input.endDate && !isValidDate(input.endDate)) return this.emptyResponse();

    const conditions: any[] = [];
    if (search) {
      conditions.push(or(ilike(sale.productName, `%${search}%`), ilike(sale.customerName, `%${search}%`)));
    }
    if (sellerFilter) {
      conditions.push(eq(sale.sellerName, sellerFilter));
    }
    if (input.startDate) {
      conditions.push(gte(sale.date, input.startDate));
    }
    if (input.endDate) {
      conditions.push(lte(sale.date, input.endDate));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const baseStatsConditions = [inArray(sale.status, SUCCESS_STATUSES as unknown as string[])];
    if (input.startDate) baseStatsConditions.push(gte(sale.date, input.startDate));
    if (input.endDate) baseStatsConditions.push(lte(sale.date, input.endDate));
    if (sellerFilter) baseStatsConditions.push(eq(sale.sellerName, sellerFilter));
    const statsWhere = and(...baseStatsConditions);

    const now = new Date();
    const today = toStartOfDay(now);
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const otherStatsConditions: any[] = [];
    if (input.startDate) otherStatsConditions.push(gte(sale.date, input.startDate));
    if (input.endDate) otherStatsConditions.push(lte(sale.date, input.endDate));
    if (sellerFilter) otherStatsConditions.push(eq(sale.sellerName, sellerFilter));
    const otherStatsWhere = otherStatsConditions.length ? and(...otherStatsConditions) : undefined;

    const [
      salesData,
      totalCountResult,
      profitResult,
      sellerRows,
      totalsResult,
      productWiseToday,
      productWise7,
      productWise30,
    ] = await Promise.all([
      this.dbInstance.select().from(sale).where(whereClause).orderBy(desc(sale.date)).limit(limit).offset(offset),
      this.dbInstance.select({ count: count() }).from(sale).where(whereClause),
      this.dbInstance
        .select({ totalProfit: sql<string>`COALESCE(SUM(${sale.profit}), 0)` })
        .from(sale)
        .where(statsWhere),
      this.dbInstance
        .selectDistinct({ sellerName: sale.sellerName })
        .from(sale)
        .where(isNotNull(sale.sellerName))
        .orderBy(sale.sellerName),
      this.dbInstance
        .select({
          totalSoldQty: sql<number>`COALESCE(SUM(CASE WHEN ${sale.status} IN ('COMPLETED', 'DELIVERED') THEN ${sale.quantity} ELSE 0 END), 0)::int`,
          totalSellAmount: sql<string>`COALESCE(SUM(CASE WHEN ${sale.status} IN ('COMPLETED', 'DELIVERED') THEN (${sale.sellPrice} * ${sale.quantity}) ELSE 0 END), 0)`,
          cancelCount: sql<number>`COALESCE(SUM(CASE WHEN ${sale.status} = 'CANCELLED' THEN 1 ELSE 0 END), 0)::int`,
          returnCount: sql<number>`COALESCE(SUM(CASE WHEN ${sale.status} = 'RETURNED' THEN 1 ELSE 0 END), 0)::int`,
        })
        .from(sale)
        .where(otherStatsWhere),
      getProductWiseStats(this.dbInstance as typeof db, { from: today, sellerName: sellerFilter }),
      getProductWiseStats(this.dbInstance as typeof db, { from: last7Days, sellerName: sellerFilter }),
      getProductWiseStats(this.dbInstance as typeof db, { from: last30Days, sellerName: sellerFilter }),
    ]);

    const total = Number(totalCountResult[0]?.count ?? 0);
    const sellerOptions = sellerRows
      .map((r) => r.sellerName?.trim())
      .filter((name): name is string => Boolean(name && name.length > 0));

    return {
      sales: salesData.map(serializeSale),
      totalProfit: Number(profitResult[0]?.totalProfit ?? 0),
      sellerOptions,
      totals: {
        totalSoldQuantity: totalsResult[0]?.totalSoldQty ?? 0,
        totalSellPrices: Number(totalsResult[0]?.totalSellAmount ?? 0),
        cancelCount: totalsResult[0]?.cancelCount ?? 0,
        returnCount: totalsResult[0]?.returnCount ?? 0,
      },
      productWise: {
        today: productWiseToday,
        last7Days: productWise7,
        last30Days: productWise30,
      },
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  private emptyResponse() {
    return {
      sales: [],
      totalProfit: 0,
      sellerOptions: [],
      totals: { totalSoldQuantity: 0, totalSellPrices: 0, cancelCount: 0, returnCount: 0 },
      productWise: { today: [], last7Days: [], last30Days: [] },
      metadata: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
}

