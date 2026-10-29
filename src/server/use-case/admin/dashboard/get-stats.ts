import { count, desc, asc, gte, eq, sql } from "drizzle-orm";
import { user, product, sale, payment, order } from "@/db/schema";
import type { Context } from "@/server/context";

const RECENT_LIMIT = 5;
const WINDOW_DAYS = 30;

const formatDay = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export class GetDashboardStatsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute() {
    const now = new Date();
    const since = this.daysAgo(WINDOW_DAYS, now);

    const [stats, productsByStatus, sales, recentUsers, recentPayments] = await Promise.all([
      this.fetchStats(),
      this.fetchProductsByStatus(),
      this.fetchSales(since),
      this.fetchRecentUsers(),
      this.fetchRecentPayments(),
    ]);

    return {
      ...stats,
      productsByStatus: productsByStatus.map((p) => ({
        status: p.status,
        _count: { _all: Number(p.count) },
      })),
      salesChartData: this.buildSalesChartData(sales, since, now),
      recentUsers,
      recentPayments: recentPayments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
      recentActivity: [],
    };
  }

  private daysAgo(days: number, from: Date) {
    const d = new Date(from);
    d.setDate(from.getDate() - days);
    return d;
  }

  private async fetchStats() {
    const [
      [{ totalUsers }],
      [{ totalProducts }],
      [{ activeProducts }],
      [{ pendingProducts }],
      [{ totalOrders }],
      [{ totalRevenue }],
      [{ totalProfit }],
    ] = await Promise.all([
      this.db.select({ totalUsers: count() }).from(user),
      this.db.select({ totalProducts: count() }).from(product),
      this.db.select({ activeProducts: count() }).from(product).where(eq(product.status, "ACTIVE")),
      this.db.select({ pendingProducts: count() }).from(product).where(eq(product.status, "PENDING")),
      this.db.select({ totalOrders: count() }).from(order),
      this.db.select({ totalRevenue: sql<string>`COALESCE(SUM(${order.totalAmount}), 0)` }).from(order),
      this.db.select({ totalProfit: sql<string>`COALESCE(SUM(${sale.profit}), 0)` }).from(sale),
    ]);

    return {
      totalUsers: Number(totalUsers),
      totalProducts: Number(totalProducts),
      activeProducts: Number(activeProducts),
      pendingProducts: Number(pendingProducts),
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      totalProfit: Number(totalProfit),
    };
  }

  private fetchProductsByStatus() {
    return this.db.select({ status: product.status, count: count() }).from(product).groupBy(product.status);
  }

  private fetchSales(since: Date) {
    return this.db.select({ date: sale.date, sellPrice: sale.sellPrice }).from(sale).where(gte(sale.date, since)).orderBy(asc(sale.date));
  }

  private fetchRecentUsers() {
    return this.db.query.user.findMany({
      limit: RECENT_LIMIT,
      orderBy: [desc(user.createdAt)],
      columns: { id: true, name: true, email: true, image: true, createdAt: true },
    });
  }

  private fetchRecentPayments() {
    return this.db.query.payment.findMany({
      limit: RECENT_LIMIT,
      orderBy: [desc(payment.date)],
      columns: {
        id: true,
        amount: true,
        method: true,
        status: true,
        date: true,
        transactionId: true,
        note: true,
      },
    });
  }

  private buildSalesChartData(sales: { date: Date | string; sellPrice: string | number }[], since: Date, until: Date) {
    const map = new Map<string, number>();
    for (let d = new Date(since); d <= until; d.setDate(d.getDate() + 1)) {
      map.set(formatDay(d), 0);
    }
    for (const s of sales) {
      const key = formatDay(new Date(s.date));
      map.set(key, (map.get(key) ?? 0) + Number(s.sellPrice));
    }
    return Array.from(map, ([date, amount]) => ({ date, amount }));
  }
}
