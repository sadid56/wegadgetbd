import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";

export interface CreateContextOptions {
  headers?: Headers;
}

export async function createContext(opts?: CreateContextOptions) {
  let reqHeaders: Headers;

  if (opts?.headers) {
    reqHeaders = opts.headers;
  } else {
    try {
      reqHeaders = await getHeaders();
    } catch {
      reqHeaders = new Headers();
    }
  }

  let sessionData = null;
  try {
    sessionData = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (error) {
    // Session retrieval failed or not authenticated
    sessionData = null;
  }

  return {
    db,
    session: sessionData?.session ?? null,
    user: sessionData?.user ?? null,
    headers: reqHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
