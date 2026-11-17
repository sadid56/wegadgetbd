import { and, count, desc, eq, gt, ilike, isNotNull, isNull, lt, or, type SQL } from "drizzle-orm";
import { promoCode } from "@/db/schema";
import type { Context } from "@/server/context";
import type { ListPromoCodesInput } from "@/server/schemas/promo-codes.schema";
import { formatPromoCode } from "./_shared";

export class AdminListPromoCodesUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: Partial<ListPromoCodesInput> = {}) {
    const { page = 1, limit = 10, search, status = "all" } = input;
    const offset = (page - 1) * limit;
    const now = new Date();

    const conditions: SQL[] = [];

    if (search?.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(or(ilike(promoCode.code, term), ilike(promoCode.description, term))!);
    }

    if (status === "active") {
      conditions.push(eq(promoCode.isActive, true));
      conditions.push(or(gt(promoCode.expiresAt, now), isNull(promoCode.expiresAt))!);
    } else if (status === "inactive") {
      conditions.push(eq(promoCode.isActive, false));
    } else if (status === "expired") {
      conditions.push(isNotNull(promoCode.expiresAt));
      conditions.push(lt(promoCode.expiresAt, now));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.db.query.promoCode.findMany({
        where,
        orderBy: [desc(promoCode.createdAt)],
        limit,
        offset,
      }),
      this.db.select({ total: count() }).from(promoCode).where(where),
    ]);

    return {
      promoCodes: rows.map(formatPromoCode),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit) || 1,
    };
  }
}
