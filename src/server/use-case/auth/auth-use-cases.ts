import { cookies, headers } from "next/headers";
import type { Session as SupabaseSession, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { db } from "@/db";
import { user as userTable, type Role } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { getSiteUrl } from "@/lib/seo";

const ACCESS_MAX_AGE = 60 * 60 * 24 * 7;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
const IS_PROD = process.env.NODE_ENV === "production";
const AUTO_CONFIRM_EMAILS = process.env.AUTO_CONFIRM_EMAILS !== "false";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserMetadata = {
  name?: string;
  full_name?: string;
  avatar_url?: string | null;
  picture?: string | null;
  role?: string;
  [key: string]: unknown;
};

function authErrorMessage(error: { message?: string; status?: number } | null): string {
  if (!error) return "Sign in failed";
  if (error.status === 429) return "Too many attempts. Please try again later.";
  if (!IS_PROD) return error.message ?? "Sign in failed";
  return "Invalid email or password";
}

const COOKIE_BASE = {
  path: "/",
  sameSite: "lax" as const,
  secure: IS_PROD,
  httpOnly: false as const,
};

async function setAuthCookies(session: SupabaseSession, role: Role) {
  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", session.access_token, {
    ...COOKIE_BASE,
    maxAge: ACCESS_MAX_AGE,
  });
  if (session.refresh_token) {
    cookieStore.set("sb-refresh-token", session.refresh_token, {
      ...COOKIE_BASE,
      maxAge: REFRESH_MAX_AGE,
    });
  }
  cookieStore.set("user-role", role, {
    ...COOKIE_BASE,
    maxAge: ACCESS_MAX_AGE,
  });
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  cookieStore.delete("user-role");
}

async function confirmUserByEmail(email: string): Promise<boolean> {
  if (!AUTO_CONFIRM_EMAILS || !supabaseAdmin) return false;
  try {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const target = data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!target) return false;

    const { data: updated } = await supabaseAdmin.auth.admin.updateUserById(target.id, { email_confirm: true });
    if (!updated.user) return false;

    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, updated.user.id))
      .catch(() => null);
    return true;
  } catch (err) {
    console.error("confirmUserByEmail failed:", err);
    return false;
  }
}

async function confirmUserById(id: string): Promise<boolean> {
  if (!AUTO_CONFIRM_EMAILS || !supabaseAdmin) return false;
  try {
    const { data } = await supabaseAdmin.auth.admin.updateUserById(id, {
      email_confirm: true,
    });
    return Boolean(data.user?.email_confirmed_at);
  } catch (err) {
    console.error("confirmUserById failed:", err);
    return false;
  }
}

type SyncOptions = { forceEmailVerified?: boolean };

async function syncUser(sbUser: SupabaseUser, fallbackEmail: string, opts?: SyncOptions): Promise<{ role: Role }> {
  let role: Role = "USER";

  try {
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
      const meta = (sbUser.user_metadata ?? {}) as UserMetadata;
      const metaRole = (meta.role as Role | undefined) ?? "USER";
      role = metaRole;

      await db
        .insert(userTable)
        .values({
          id: sbUser.id,
          name: meta.name || meta.full_name || sbUser.email?.split("@")[0] || "User",
          email: sbUser.email || fallbackEmail,
          image: meta.avatar_url || meta.picture || null,
          role,
          emailVerified: opts?.forceEmailVerified ?? Boolean(sbUser.email_confirmed_at),
        })
        .onConflictDoNothing();
    }
  } catch (err) {
    console.error("syncUser error:", err);
  }

  return { role };
}

export class SignInUseCase {
  async execute(input: FormData | { email: string; password: string }) {
    const email = (input instanceof FormData ? String(input.get("email") ?? "") : input.email).trim().toLowerCase();
    const password = input instanceof FormData ? String(input.get("password") ?? "") : input.password;

    if (!email || !password) return { success: false as const, error: "Email and password are required", message: "Email and password are required" };
    if (!EMAIL_RE.test(email)) return { success: false as const, error: "Invalid email address", message: "Invalid email address" };
    if (password.length < 6) return { success: false as const, error: "Password must be at least 6 characters", message: "Password must be at least 6 characters" };

    try {
      const attempt = () => supabase.auth.signInWithPassword({ email, password });
      let { data, error } = await attempt();

      if (error && error.message?.toLowerCase().includes("email not confirmed")) {
        if (await confirmUserByEmail(email)) {
          ({ data, error } = await attempt());
        }
      }

      if (error || !data.session || !data.user) {
        const msg = authErrorMessage(error);
        return { success: false as const, error: msg, message: msg };
      }

      const { role } = await syncUser(data.user, email);
      await setAuthCookies(data.session, role);

      const meta = (data.user.user_metadata ?? {}) as UserMetadata;
      return {
        success: true as const,
        data: {
          id: data.user.id,
          email: data.user.email ?? null,
          name: meta.name || data.user.email?.split("@")[0] || null,
          role,
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          },
        },
      };
    } catch (err: any) {
      console.error("SignInUseCase failed:", err);
      return { success: false as const, error: "An unexpected error occurred", message: "An unexpected error occurred" };
    }
  }
}

export class SignUpUseCase {
  async execute(input: FormData | { name: string; email: string; password: string }) {
    const name = (input instanceof FormData ? String(input.get("name") ?? "") : input.name).trim();
    const email = (input instanceof FormData ? String(input.get("email") ?? "") : input.email).trim().toLowerCase();
    const password = input instanceof FormData ? String(input.get("password") ?? "") : input.password;

    if (!name || !email || !password) return { success: false as const, error: "All fields are required", message: "All fields are required" };
    if (name.length < 2) return { success: false as const, error: "Name must be at least 2 characters", message: "Name must be at least 2 characters" };
    if (!EMAIL_RE.test(email)) return { success: false as const, error: "Invalid email address", message: "Invalid email address" };
    if (password.length < 6) return { success: false as const, error: "Password must be at least 6 characters", message: "Password must be at least 6 characters" };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: "USER" } },
      });

      if (error || !data.user) {
        const msg = error?.message ?? "Registration failed";
        return { success: false as const, error: msg, message: msg };
      }

      const wasConfirmed = Boolean(data.user.email_confirmed_at);
      const nowConfirmed = wasConfirmed ? false : await confirmUserById(data.user.id);
      const emailVerified = wasConfirmed || nowConfirmed;

      const { role } = await syncUser(data.user, email, {
        forceEmailVerified: emailVerified,
      });

      let session = data.session;
      if (!session && emailVerified) {
        const retry = await supabase.auth.signInWithPassword({ email, password }).catch(() => null);
        if (retry?.data?.session) session = retry.data.session;
      }

      if (session) await setAuthCookies(session, role);

      return {
        success: true as const,
        data: {
          id: data.user.id,
          email: data.user.email ?? null,
          name,
          role,
          requiresEmailConfirmation: !session,
          session: session
            ? {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              }
            : null,
        },
      };
    } catch (err: any) {
      console.error("SignUpUseCase failed:", err);
      return { success: false as const, error: "An unexpected error occurred", message: "An unexpected error occurred" };
    }
  }
}

export class GetGoogleOAuthUrlUseCase {
  async execute(callbackUrl: string = "/") {
    try {
      const headerList = await headers();
      const host = headerList.get("host");
      const proto = headerList.get("x-forwarded-proto") ?? "https";
      const origin = host ? `${proto}://${host}` : getSiteUrl();
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (error || !data.url) {
        const msg = error?.message ?? "Failed to initiate Google sign-in";
        return { success: false as const, error: msg, message: msg };
      }

      return { success: true as const, data: { url: data.url } };
    } catch (err: any) {
      console.error("GetGoogleOAuthUrlUseCase failed:", err);
      return { success: false as const, error: "Failed to initiate Google sign-in", message: "Failed to initiate Google sign-in" };
    }
  }
}

export class SignOutUseCase {
  async execute() {
    try {
      await clearAuthCookies();
      await supabase.auth.signOut().catch(() => null);
      return { success: true as const, data: null };
    } catch (err: any) {
      console.error("SignOutUseCase failed:", err);
      return { success: false as const, error: "Failed to sign out", message: "Failed to sign out" };
    }
  }
}
