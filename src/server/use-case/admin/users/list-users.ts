import { count, desc, ilike, or, type SQL } from "drizzle-orm";
import { user } from "@/db/schema";
import type { Context } from "@/server/context";
import { buildWhere } from "@/server/lib/orm";
import { offsetOf, paginate } from "@/server/lib/pagination";

export interface ListUsersInput {
  page: number;
  limit: number;
  search?: string;
}

export class ListUsersUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ page, limit, search }: ListUsersInput) {
    const conditions: SQL[] = [];
    if (search) {
      conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))!);
    }
    const whereClause = buildWhere(conditions);
    const offset = offsetOf(page, limit);

    const [rows, [{ total }]] = await Promise.all([
      this.db.query.user.findMany({
        where: whereClause,
        orderBy: [desc(user.createdAt)],
        limit,
        offset,
        with: { sessions: { columns: { id: true } } },
      }),
      this.db.select({ total: count() }).from(user).where(whereClause),
    ]);

    const users = rows.map((u) => ({
      ...u,
      _count: { sessions: u.sessions.length },
    }));

    return { users, ...paginate(Number(total), limit), page };
  }
}
