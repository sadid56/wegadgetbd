import { eq } from "drizzle-orm";
import { session, type AuditAction } from "@/db/schema";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";
import { supabaseAdmin } from "@/lib/supabase";

export class RevokeSessionUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute(id: string) {
    const [deleted] = await this.db.delete(session).where(eq(session.id, id)).returning();

    if (deleted) {
      if (supabaseAdmin && deleted.token) {
        await supabaseAdmin.auth.admin.signOut(deleted.token).catch(() => null);
      }

      await writeAudit(this.db, {
        action: "SESSION_REVOKE" as AuditAction,
        actorId: this.actorId,
        metadata: { sessionId: id, userId: deleted.userId },
      });
    }

    return { success: true, id };
  }
}
