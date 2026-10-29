import { desc, eq } from "drizzle-orm";
import { auditLog, user } from "@/db/schema";
import type { Context } from "@/server/context";

export class GetUserUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string) {
    const found = await this.db.query.user.findFirst({
      where: eq(user.id, id),
      with: {
        sessions: true,
        auditLogs: { orderBy: [desc(auditLog.timestamp)], limit: 10 },
      },
    });
    if (!found) throw new Error("User not found");
    return found as any;
  }
}
