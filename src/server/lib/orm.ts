import { and, eq } from "drizzle-orm";
import type { Context } from "@/server/context";
import { auditLog, user, auditActionEnum, type AuditAction } from "@/db/schema";

export function buildWhere(conditions: any[]) {
  return conditions.length ? and(...conditions) : undefined;
}

const VALID_ACTIONS = new Set<string>(auditActionEnum.enumValues);

export interface WriteAuditInput {
  action: string;
  actorId?: string;
  actorType?: "ADMIN" | "USER";
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export async function writeAudit(db: Context["db"], input: WriteAuditInput) {
  try {
    let { action, actorId, actorType = "ADMIN", metadata, ...extra } = input;

    // Map common non-enum aliases
    if (action === "UPDATE") action = "STATUS_CHANGE";
    if (action === "DELETE") action = "DELETE_PRODUCT";
    if (action === "CREATE") action = "CREATE_PRODUCT";

    if (!VALID_ACTIONS.has(action)) {
      console.warn(`[writeAudit] Unsupported audit action '${action}', defaulting to 'STATUS_CHANGE'`);
      action = "STATUS_CHANGE";
    }

    // Merge extra fields (e.g. targetType, targetId) into metadata
    const finalMetadata: Record<string, unknown> = {
      ...(metadata || {}),
      ...(extra && Object.keys(extra).length > 0 ? extra : {}),
    };

    // Ensure actorId references a valid User in DB
    let validActorId = actorId;
    if (!validActorId || validActorId === "admin" || validActorId === "anonymous") {
      const fallbackUser = await db.query.user.findFirst({
        where: eq(user.role, "ADMIN"),
        columns: { id: true },
      });
      validActorId = fallbackUser?.id;
    }

    if (!validActorId) {
      console.warn("[writeAudit] No valid user found for actorId, skipping audit insertion.");
      return null;
    }

    const [created] = await db
      .insert(auditLog)
      .values({
        id: crypto.randomUUID(),
        action: action as AuditAction,
        actorId: validActorId,
        actorType,
        metadata: finalMetadata,
      })
      .returning();

    return created;
  } catch (err) {
    console.error("[writeAudit] Error inserting audit log:", err);
    return null;
  }
}
