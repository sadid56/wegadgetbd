import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}
