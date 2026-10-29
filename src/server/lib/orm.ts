import { and } from "drizzle-orm";
import type { Context } from "@/server/context";
import { auditLog } from "@/db/schema";

export function buildWhere(conditions: any[]) {
  return conditions.length ? and(...conditions) : undefined;
}

export async function writeAudit(db: Context["db"], values: any) {
  try {
    return await db.insert(auditLog).values(values);
  } catch {
    return null;
  }
}
