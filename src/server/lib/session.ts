import { db } from "@/db";
import { session as sessionTable, user as userTable, type Role } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers as getHeaders } from "next/headers";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface RecordSessionOptions {
  userId: string;
  token: string;
  role?: Role;
  expiresAt?: Date;
  method?: "password" | "google" | "signup" | "sync";
  reqHeaders?: Headers;
}

export async function getClientInfo(reqHeaders?: Headers) {
  let h: Headers | null = null;
  if (reqHeaders) {
    h = reqHeaders;
  } else {
    try {
      h = await getHeaders();
    } catch {
      h = null;
    }
  }

  const rawIp =
    h?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h?.get("x-real-ip") ||
    h?.get("cf-connecting-ip") ||
    "127.0.0.1";

  const userAgent = h?.get("user-agent") || "Unknown Device";

  return { ipAddress: rawIp, userAgent };
}

export async function recordSession({
  userId,
  token,
  role: _role = "USER",
  expiresAt,
  method: _method = "password",
  reqHeaders,
}: RecordSessionOptions) {
  try {
    const { ipAddress, userAgent } = await getClientInfo(reqHeaders);
    const sessionExpiresAt = expiresAt || new Date(Date.now() + SESSION_TTL_MS);

    // Verify user exists in DB to prevent foreign key errors
    const existingUser = await db.query.user.findFirst({
      where: eq(userTable.id, userId),
      columns: { id: true, role: true, email: true },
    });

    if (!existingUser) {
      console.warn(`[recordSession] User ${userId} not found in database. Skipping session insertion.`);
      return null;
    }

    const sessionId = crypto.randomUUID();

    // Insert or update session
    const [savedSession] = await db
      .insert(sessionTable)
      .values({
        id: sessionId,
        userId,
        token,
        expiresAt: sessionExpiresAt,
        ipAddress,
        userAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: sessionTable.token,
        set: {
          updatedAt: new Date(),
          expiresAt: sessionExpiresAt,
          ipAddress,
          userAgent,
        },
      })
      .returning();

    return savedSession;
  } catch (err) {
    console.error("[recordSession] Failed to record session:", err);
    return null;
  }
}
