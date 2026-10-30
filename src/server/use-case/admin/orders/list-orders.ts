import { db } from "@/db";
import { order, type OrderStatus } from "@/db/schema";
import { desc, count, or, ilike, eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { buildWhere } from "@/server/lib/orm";
import { offsetOf, paginate } from "@/server/lib/pagination";

const MAX_PAGE_SIZE = 100;

export interface ListOrdersInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
}

export class ListOrdersUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: ListOrdersInput = {}) {
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 10, 1), MAX_PAGE_SIZE);
    const offset = offsetOf(page, limit);

    const whereClause = this.buildWhereClause(input);

    const [orders, [{ total }]] = await Promise.all([
      this.dbInstance
        .select()
        .from(order)
        .where(whereClause)
        .orderBy(desc(order.createdAt))
        .limit(limit)
        .offset(offset),
      this.dbInstance
        .select({ total: count() })
        .from(order)
        .where(whereClause),
    ]);

    const paginationMeta = paginate(Number(total), limit);

    return {
      orders,
      metadata: {
        total: paginationMeta.total,
        page,
        limit,
        totalPages: paginationMeta.totalPages,
      },
    };
  }

  private buildWhereClause({ search, status }: ListOrdersInput) {
    const conditions: any[] = [];

    if (search?.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(or(ilike(order.customerName, q), ilike(order.phoneNumber, q), ilike(order.address, q)));
    }

    if (status) {
      conditions.push(eq(order.status, status));
    }

    return buildWhere(conditions);
  }
}

