import { count, desc, eq } from "drizzle-orm";
import { session } from "@/db/schema";
import type { Context } from "@/server/context";
import { offsetOf, paginate } from "@/server/lib/pagination";

export interface ListSessionsInput {
  page: number;
  limit: number;
  userId?: string;
}

export class ListSessionsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ page, limit, userId }: ListSessionsInput) {
    const whereClause = userId ? eq(session.userId, userId) : undefined;
    const offset = offsetOf(page, limit);

    const [sessions, [{ total }]] = await Promise.all([
      this.db.query.session.findMany({
        where: whereClause,
        orderBy: [desc(session.createdAt)],
        limit,
        offset,
        with: { user: { columns: { name: true, email: true } } },
      }),
      this.db.select({ total: count() }).from(session).where(whereClause),
    ]);

    return { sessions, ...paginate(Number(total), limit), page };
  }
}
