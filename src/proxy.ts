import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type JwtPayload = {
  exp?: number;
  app_metadata?: { role?: string };
  user_metadata?: { role?: string };
  [key: string]: unknown;
};

const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"] as const;
const CLOCK_SKEW_SEC = 30;

function decodeJwt(token: string | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as JwtPayload;

    if (payload.exp && Date.now() / 1000 >= payload.exp - CLOCK_SKEW_SEC) {
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
  if (next.startsWith("/auth")) return null;
  return next;
}

function isAdmin(payload: JwtPayload | null, roleCookie: string | undefined): boolean {
  if (roleCookie === "ADMIN") return true;
  if (payload?.app_metadata?.role === "ADMIN") return true;
  if (payload?.user_metadata?.role === "ADMIN") return true;
  return false;
}

function signInRedirect(request: NextRequest, pathname: string) {
  const url = new URL("/auth/sign-in", request.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const token = request.cookies.get("sb-access-token")?.value;
  const roleCookie = request.cookies.get("user-role")?.value;
  const payload = decodeJwt(token);
  const isAuthenticated = payload !== null;
  const admin = isAdmin(payload, roleCookie);

  if (AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!isAuthenticated) return NextResponse.next();
    const next = safeNext(searchParams.get("next"));
    if (next) return NextResponse.redirect(new URL(next, request.url));
    if (admin) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) return signInRedirect(request, pathname);
    if (roleCookie === "USER" && !admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/checkout")) {
    if (!isAuthenticated) return signInRedirect(request, pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
