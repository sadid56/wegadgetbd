"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ACCESS_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

type ErrorCtx = { error: { message: string } };

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function syncSupabaseCookies(session: any) {
  if (typeof document === "undefined") return;
  if (session?.access_token) {
    setCookie("sb-access-token", session.access_token, ACCESS_MAX_AGE);
    if (session.refresh_token) {
      setCookie("sb-refresh-token", session.refresh_token, REFRESH_MAX_AGE);
    }
    const role = session.user?.user_metadata?.role || "USER";
    setCookie("user-role", role, ACCESS_MAX_AGE);
  }
}

function clearAuthCookiesClient() {
  if (typeof document === "undefined") return;
  setCookie("sb-access-token", "", 0);
  setCookie("sb-refresh-token", "", 0);
  setCookie("user-role", "", 0);
}

function formatUser(sbUser: any) {
  if (!sbUser) return null;
  const meta = sbUser.user_metadata ?? {};
  return {
    id: sbUser.id,
    name: meta.name || meta.full_name || sbUser.email?.split("@")[0] || "User",
    email: sbUser.email || "",
    role: meta.role || "USER",
    image: meta.avatar_url || meta.picture || null,
    emailVerified: Boolean(sbUser.email_confirmed_at),
    banned: Boolean(meta.banned),
    createdAt: new Date(sbUser.created_at),
    updatedAt: new Date(sbUser.updated_at || sbUser.created_at),
  };
}

async function attempt<R extends { data: any; error: any }>(
  fn: () => Promise<R>,
  opts: {
    beforeSuccess?: (data: R["data"]) => void;
    onSuccess?: (data: R["data"]) => void;
    onError?: (ctx: ErrorCtx) => void;
    fallbackError: string;
  },
): Promise<{ data: R["data"] | null; error: any }> {
  try {
    const result = await fn();
    if (result.error) {
      opts.onError?.({ error: { message: result.error.message } });
      return { data: null, error: result.error };
    }
    opts.beforeSuccess?.(result.data);
    opts.onSuccess?.(result.data);
    return { data: result.data, error: null };
  } catch (err: any) {
    opts.onError?.({ error: { message: err?.message || opts.fallbackError } });
    return { data: null, error: err };
  }
}

export function useSession() {
  const [data, setData] = useState<{ user: any; session: any } | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session }, error: getError }) => {
      if (!mounted) return;
      if (session?.user) {
        syncSupabaseCookies(session);
        setData({ session, user: formatUser(session.user) });
        setIsPending(false);
        return;
      }

      // Check if cookies exist from Server Action or prior login
      const token = getCookie("sb-access-token");
      const refresh = getCookie("sb-refresh-token");
      if (token) {
        try {
          const { data: setRes } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh || "",
          });
          if (!mounted) return;
          if (setRes?.session?.user) {
            syncSupabaseCookies(setRes.session);
            setData({ session: setRes.session, user: formatUser(setRes.session.user) });
            setIsPending(false);
            return;
          }
        } catch {
          // ignore setSession failure
        }
      }

      if (getError) setError(getError);
      setData(null);
      setIsPending(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") {
        clearAuthCookiesClient();
        setData(null);
        setIsPending(false);
        return;
      }
      if (session?.user) {
        syncSupabaseCookies(session);
        setData({ session, user: formatUser(session.user) });
      }
      setIsPending(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { data, isPending, isLoading: isPending, error };
}

export const signIn = {
  email({
    email,
    password,
    fetchOptions,
  }: {
    email: string;
    password: string;
    callbackURL?: string;
    fetchOptions?: {
      onSuccess?: (ctx: { data: any }) => void;
      onError?: (ctx: ErrorCtx) => void;
    };
  }) {
    return attempt(() => supabase.auth.signInWithPassword({ email, password }), {
      beforeSuccess: (data) => {
        if (data.session) syncSupabaseCookies(data.session);
      },
      onSuccess: (data) => fetchOptions?.onSuccess?.({ data }),
      onError: fetchOptions?.onError,
      fallbackError: "Failed to sign in",
    });
  },

  social({
    provider,
    callbackURL = "/",
    fetchOptions,
  }: {
    provider: "google" | "github";
    callbackURL?: string;
    fetchOptions?: {
      onError?: (ctx: ErrorCtx) => void;
    };
  }) {
    return attempt(
      () => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(callbackURL)}`;
        return supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      },
      {
        onError: fetchOptions?.onError,
        fallbackError: "Social sign in failed",
      },
    );
  },
};

export const signUp = {
  email({
    email,
    password,
    name,
    fetchOptions,
  }: {
    email: string;
    password: string;
    name?: string;
    callbackURL?: string;
    fetchOptions?: {
      onSuccess?: (ctx: { data: any }) => void;
      onError?: (ctx: ErrorCtx) => void;
    };
  }) {
    return attempt(
      () =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split("@")[0],
              role: "USER",
            },
          },
        }),
      {
        beforeSuccess: (data) => {
          if (data.session) syncSupabaseCookies(data.session);
        },
        onSuccess: (data) => fetchOptions?.onSuccess?.({ data }),
        onError: fetchOptions?.onError,
        fallbackError: "Failed to create account",
      },
    );
  },
};

export async function signOut(options?: {
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: (ctx: ErrorCtx) => void;
  };
}) {
  const { onSuccess, onError } = options?.fetchOptions ?? {};
  try {
    const { signOutAction } = await import("@/server/actions/auth.action");
    await signOutAction().catch(() => null);
    const { error } = await supabase.auth.signOut();
    clearAuthCookiesClient();
    if (error) {
      onError?.({ error: { message: error.message } });
      return { error };
    }
    onSuccess?.();
    return { error: null };
  } catch (err: any) {
    onError?.({ error: { message: err?.message || "Failed to sign out" } });
    return { error: err };
  }
}

export const authClient = {
  useSession,
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session?.user) return { data: null, error };
    return { data: { session, user: formatUser(session.user) }, error: null };
  },
  signIn,
  signUp,
  signOut,
};
