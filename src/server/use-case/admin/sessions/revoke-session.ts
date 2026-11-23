import { eq } from "drizzle-orm";
import { session } from "@/db/schema";
import type { Context } from "@/server/context";
import { supabaseAdmin } from "@/lib/supabase";

export class RevokeSessionUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly _actorId: string,
  ) {}

  async execute(id: string) {
    const [deleted] = await this.db.delete(session).where(eq(session.id, id)).returning();

    if (deleted) {
      if (supabaseAdmin && deleted.token) {
        await supabaseAdmin.auth.admin.signOut(deleted.token).catch(() => null);
      }
    }

    return { success: true, id };
  }
}
