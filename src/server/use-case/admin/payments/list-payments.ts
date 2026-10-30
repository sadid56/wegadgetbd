import { db } from "@/db";
import { payment } from "@/db/schema";
import { count, desc, ilike, or } from "drizzle-orm";
import type { Context } from "@/server/context";
import { MAX_PAGE_SIZE, serializePayment } from "./_shared";

export interface ListPaymentsInput {
  page?: number;
  limit?: number;
  search?: string;
}

export class ListPaymentsUseCase {
  constructor(private readonly dbInstance: Context["db"] = db) {}

  async execute(input: ListPaymentsInput = {}) {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, input.limit ?? 10));
    const search = input.search?.trim() ?? "";
    const offset = (page - 1) * limit;

    const whereClause = search ? or(ilike(payment.note, `%${search}%`), ilike(payment.transactionId, `%${search}%`))! : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.dbInstance.query.payment.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(payment.date)],
      }),
      this.dbInstance.select({ total: count() }).from(payment).where(whereClause),
    ]);

    return {
      payments: rows.map(serializePayment),
      metadata: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit) || 1,
      },
    };
  }
}

