import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db } from "@/db";
import { user as userTable, type Role } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { recordSession } from "@/server/lib/session";

const ACCESS_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;
const COOKIE_OPTS = { path: "/", sameSite: "lax" } as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  const failUrl = new URL("/auth/sign-in?error=auth-failed", url.origin);

  if (!code) return NextResponse.redirect(failUrl);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session || !data.user) return NextResponse.redirect(failUrl);

  const { access_token, refresh_token, expires_at } = data.session;
  const sbUser = data.user;

  // Sync user to DB
  let role: Role = "USER";
  try {
    const meta = (sbUser.user_metadata ?? {}) as Record<string, any>;
    const name = meta.name || meta.full_name || sbUser.email?.split("@")[0] || "User";
    const image = meta.avatar_url || meta.picture || null;

    const conditions = [eq(userTable.id, sbUser.id)];
    if (sbUser.email) conditions.push(eq(userTable.email, sbUser.email));

    const existing = await db.query.user.findFirst({
      where: or(...conditions),
    });

    if (existing) {
      role = existing.role;
      if (existing.id !== sbUser.id && sbUser.email) {
        await db
          .update(userTable)
          .set({ id: sbUser.id })
          .where(eq(userTable.email, sbUser.email))
          .catch(() => null);
      }
    } else {
      role = (meta.role as Role | undefined) ?? "USER";
      await db
        .insert(userTable)
        .values({
          id: sbUser.id,
          name,
          email: sbUser.email ?? "",
          image,
          role,
          emailVerified: Boolean(sbUser.email_confirmed_at),
        })
        .onConflictDoNothing();
    }

    // Record session and audit log
    await recordSession({
      userId: sbUser.id,
      token: access_token,
      role,
      expiresAt: expires_at ? new Date(expires_at * 1000) : undefined,
      method: "google",
      reqHeaders: request.headers,
    });
  } catch (err) {
    console.error("[auth/callback] Error syncing user or recording session:", err);
  }

  const response = NextResponse.redirect(new URL(next, url.origin));

  response.cookies.set("access-token", access_token, {
    ...COOKIE_OPTS,
    maxAge: ACCESS_MAX_AGE,
  });

  if (refresh_token) {
    response.cookies.set("refresh-token", refresh_token, {
      ...COOKIE_OPTS,
      maxAge: REFRESH_MAX_AGE,
    });
  }

  response.cookies.set("user-role", role, {
    ...COOKIE_OPTS,
    maxAge: ACCESS_MAX_AGE,
  });

  return response;
}
