import { db } from "@/db";
import { user as userTable, type Role } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { headers as getHeaders, cookies } from "next/headers";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "@/lib/supabase";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type UserMetadata = {
  name?: string;
  full_name?: string;
  avatar_url?: string | null;
  picture?: string | null;
  role?: string;
  banned?: boolean;
  [key: string]: unknown;
};

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(/;\s*/).map((c) => {
      const [k, ...v] = c.split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );
}

function extractToken(headers: Headers): string | null {
  const cookieToken = parseCookies(headers.get("cookie"))["sb-access-token"];
  if (cookieToken) return cookieToken;
  return headers.get("authorization")?.replace("Bearer ", "") || null;
}

async function resolveToken(reqHeaders?: Headers): Promise<string | null> {
  if (reqHeaders) {
    const t = extractToken(reqHeaders);
    if (t) return t;
  }

  try {
    const store = await cookies();
    const t = store.get("sb-access-token")?.value;
    if (t) return t;
  } catch {}

  try {
    return extractToken(await getHeaders());
  } catch {
    return null;
  }
}

function roleFromAppMetadata(sbUser: SupabaseUser): Role | undefined {
  return (sbUser.app_metadata as { role?: Role } | undefined)?.role;
}

async function loadOrCreateDbUser(sbUser: SupabaseUser, defaults: { name: string; image: string | null }) {
  try {
    const conditions = [eq(userTable.id, sbUser.id)];
    if (sbUser.email) conditions.push(eq(userTable.email, sbUser.email));

    const dbUser = await db.query.user.findFirst({
      where: or(...conditions),
      columns: { id: true, role: true, banned: true, name: true, image: true },
    });

    if (dbUser) {
      if (dbUser.id !== sbUser.id && sbUser.email) {
        await db
          .update(userTable)
          .set({ id: sbUser.id })
          .where(eq(userTable.email, sbUser.email))
          .catch(() => null);
      }
      return dbUser;
    }

    const meta = (sbUser.user_metadata ?? {}) as UserMetadata;
    const role: Role = roleFromAppMetadata(sbUser) ?? "USER";

    await db
      .insert(userTable)
      .values({
        id: sbUser.id,
        name: defaults.name,
        email: sbUser.email ?? "",
        emailVerified: Boolean(sbUser.email_confirmed_at),
        role,
        image: defaults.image,
      })
      .onConflictDoNothing();

    return {
      id: sbUser.id,
      role,
      banned: Boolean(meta.banned),
      name: defaults.name,
      image: defaults.image,
    };
  } catch {
    return null;
  }
}

export async function getSession(reqHeaders?: Headers) {
  const token = await resolveToken(reqHeaders);
  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;

    const sbUser = data.user;
    const meta = (sbUser.user_metadata ?? {}) as UserMetadata;
    const name = meta.name || meta.full_name || sbUser.email?.split("@")[0] || "User";
    const image = meta.avatar_url || meta.picture || null;

    const dbUser = await loadOrCreateDbUser(sbUser, { name, image });

    const role: Role = dbUser?.role ?? roleFromAppMetadata(sbUser) ?? "USER";

    if (role === "ADMIN" && meta.role !== "ADMIN" && supabaseAdmin) {
      await supabaseAdmin.auth.admin
        .updateUserById(sbUser.id, {
          user_metadata: { ...meta, role: "ADMIN" },
        })
        .catch(() => null);
    }

    return {
      session: {
        id: sbUser.id,
        userId: sbUser.id,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        token,
      },
      user: {
        id: sbUser.id,
        name: dbUser?.name ?? name,
        email: sbUser.email ?? "",
        role,
        image: dbUser?.image ?? image,
        emailVerified: Boolean(sbUser.email_confirmed_at),
        banned: dbUser?.banned ?? Boolean(meta.banned),
        createdAt: new Date(sbUser.created_at),
        updatedAt: new Date(sbUser.updated_at ?? sbUser.created_at),
      },
    };
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  return getSession();
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  return session?.user.role === "ADMIN" ? session : null;
}

export const auth = {
  api: {
    getSession({ headers }: { headers: Headers }) {
      return getSession(headers);
    },
  },
};
