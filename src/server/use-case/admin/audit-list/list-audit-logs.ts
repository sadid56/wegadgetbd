import { count, desc, eq, ilike, or } from "drizzle-orm";
import { auditLog, user, type AuditAction } from "@/db/schema";
import type { Context } from "@/server/context";
import { buildWhere } from "@/server/lib/orm";
import { offsetOf, paginate } from "@/server/lib/pagination";

export interface ListAuditLogsInput {
  page: number;
  limit: number;
  search?: string;
  action?: string;
}

export class ListAuditLogsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: ListAuditLogsInput) {
    const { page, limit } = input;
    const whereClause = this.buildWhereClause(input);
    const offset = offsetOf(page, limit);

    const [logs, [{ total }]] = await Promise.all([this.fetchLogs(whereClause, limit, offset), this.fetchLogCount(whereClause)]);

    return {
      logs,
      ...paginate(Number(total), limit),
      currentPage: page,
    };
  }

  private buildWhereClause({ search = "", action }: ListAuditLogsInput) {
    const conditions: any[] = [];
    if (search) {
      conditions.push(or(ilike(auditLog.actorId, `%${search}%`), ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)));
    }
    if (action) conditions.push(eq(auditLog.action, action as AuditAction));
    return buildWhere(conditions);
  }

  private fetchLogs(whereClause: ReturnType<typeof buildWhere>, limit: number, offset: number) {
    return this.db.query.auditLog.findMany({
      where: whereClause,
      with: { user: { columns: { id: true, name: true, email: true } } },
      orderBy: [desc(auditLog.timestamp)],
      limit,
      offset,
    });
  }

  private fetchLogCount(whereClause: ReturnType<typeof buildWhere>) {
    return this.db.select({ total: count() }).from(auditLog).leftJoin(user, eq(auditLog.actorId, user.id)).where(whereClause);
  }
}
