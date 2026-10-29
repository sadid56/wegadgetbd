import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  if (error || !data.session) return NextResponse.redirect(failUrl);

  const response = NextResponse.redirect(new URL(next, url.origin));
  const { access_token, refresh_token } = data.session;

  response.cookies.set("sb-access-token", access_token, {
    ...COOKIE_OPTS,
    maxAge: ACCESS_MAX_AGE,
  });

  if (refresh_token) {
    response.cookies.set("sb-refresh-token", refresh_token, {
      ...COOKIE_OPTS,
      maxAge: REFRESH_MAX_AGE,
    });
  }

  return response;
}
