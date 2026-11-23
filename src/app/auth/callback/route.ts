import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";
import { db } from "@/db";
import { user as userTable, type Role } from "@/db/schema";
import { recordSession } from "@/server/lib/session";

const ACCESS_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

const COOKIE_OPTS = {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
} as const;

function safeNext(next: string | null, origin: string): string {
  if (!next) return "/";
  try {
    const target = new URL(next, origin);
    return target.origin === origin ? target.href : "/";
  } catch {
    return "/";
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"), url.origin);
  const failUrl = new URL("/auth/sign-in?error=auth-failed", url.origin);

  if (!code) return NextResponse.redirect(failUrl);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session || !data.user) return NextResponse.redirect(failUrl);

  const { access_token, refresh_token, expires_at } = data.session;
  const sbUser = data.user;

  let role: Role = "USER";

  const name: string = sbUser.user_metadata?.full_name ?? "";
  const image: string | null = sbUser.user_metadata?.avatar_url ?? null;

  try {
    const existing = await db.query.user.findFirst({
      where: sbUser.email ? eq(userTable.email, sbUser.email) : eq(userTable.id, sbUser.id),
    });

    if (existing) {
      role = existing.role;
    } else {
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
  } catch (err) {
    console.error("[auth/callback] Failed to sync user:", err);
    return NextResponse.redirect(failUrl);
  }

  try {
    await recordSession({
      userId: sbUser.id,
      token: access_token,
      role,
      expiresAt: expires_at ? new Date(expires_at * 1000) : undefined,
      method: "google",
      reqHeaders: request.headers,
    });
  } catch (err) {
    console.error("[auth/callback] Failed to record session:", err);
  }

  const response = NextResponse.redirect(next);

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