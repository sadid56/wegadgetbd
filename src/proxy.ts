import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"] as const;
const CLOCK_SKEW_SEC = 30;

const handleI18n = createMiddleware(routing);

function decodeJwt(token: string | undefined) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (payload?.exp && Date.now() / 1000 >= payload.exp - CLOCK_SKEW_SEC) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function safeNext(next: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  if (next.startsWith("/auth") || next.startsWith("/bn/auth")) return null;
  return next;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isBn = pathname.startsWith("/bn/") || pathname === "/bn";
  const cleanPath = isBn ? pathname.slice(3) || "/" : pathname;

  const isAdminRoute = cleanPath.startsWith("/admin");
  const isAuthRoute = AUTH_ROUTES.some((p) => cleanPath.startsWith(p));

  // Fast path: public routes. No JWT/cookie work at all.
  if (!isAdminRoute && !isAuthRoute) {
    return handleI18n(request);
  }

  const payload = decodeJwt(request.cookies.get("access-token")?.value);
  const isAuthenticated = payload !== null;
  const isAdmin =
    request.cookies.get("user-role")?.value === "ADMIN" ||
    payload?.app_metadata?.role === "ADMIN" ||
    payload?.user_metadata?.role === "ADMIN";

  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = new URL("/auth/sign-in", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Auth routes: already-signed-in users shouldn't see sign-in/sign-up.
  if (isAuthenticated) {
    const next = safeNext(searchParams.get("next"));
    if (next) return NextResponse.redirect(new URL(next, request.url));
    if (isAdmin) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL(isBn ? "/bn" : "/", request.url));
  }

  return handleI18n(request);
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};