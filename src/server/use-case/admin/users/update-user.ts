import { eq } from "drizzle-orm";
import { user, type AuditAction, type Role } from "@/db/schema";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export interface UpdateUserInput {
  id: string;
  banned?: boolean;
  role?: string;
  banReason?: string | null;
}

export class UpdateUserUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute({ id, banned, role, banReason }: UpdateUserInput) {
    const [updated] = await this.db
      .update(user)
      .set({
        ...(banned !== undefined && { banned }),
        ...(role && { role: role as Role }),
        ...(banReason !== undefined && { banReason }),
      })
      .where(eq(user.id, id))
      .returning();

    const action: AuditAction = banned === undefined ? "STATUS_CHANGE" : banned ? "BLOCK_USER" : "UNBLOCK_USER";

    await writeAudit(this.db, {
      action,
      actorId: this.actorId,
      metadata: { userId: updated.id, userEmail: updated.email, banned, role },
    });

    return updated as any;
  }
}
