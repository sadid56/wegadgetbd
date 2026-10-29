import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";

export interface CreateContextOptions {
  headers?: Headers;
}

async function resolveHeaders(provided?: Headers): Promise<Headers> {
  if (provided) return provided;
  return getHeaders().catch(() => new Headers());
}

export async function createContext(opts?: CreateContextOptions) {
  const headers = await resolveHeaders(opts?.headers);

  const sessionData = await auth.api.getSession({ headers }).catch(() => null);

  return {
    db,
    session: sessionData?.session ?? null,
    user: sessionData?.user ?? null,
    headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;