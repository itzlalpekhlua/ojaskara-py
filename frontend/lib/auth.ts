import { cookies } from "next/headers";
import { sessionCookie, verifySession } from "@/lib/session";
import { BACKEND_URL } from "@/lib/api";

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(sessionCookie.name)?.value;
  const payload = await verifySession(token);
  if (!payload) return null;

  const res = await fetch(`${BACKEND_URL}/api/admin/auth/me`, {
    headers: { Cookie: `${sessionCookie.name}=${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ id: string; email: string; role: string }>;
}
