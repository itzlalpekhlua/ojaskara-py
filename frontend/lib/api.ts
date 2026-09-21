import { cookies } from "next/headers";
import { sessionCookie } from "@/lib/session";

export const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

async function authHeaders(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get(sessionCookie.name)?.value;
  return token ? { Cookie: `${sessionCookie.name}=${token}` } : {};
}

/** Public, unauthenticated read from the FastAPI backend. Always fresh — the
 * backend's JSON files can change at any time via the admin panel. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Same as apiGet, but returns null instead of throwing on a 404. */
export async function apiGetOrNull<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BACKEND_URL}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Authenticated call to the FastAPI backend (create/update/delete/etc), forwarding
 * the admin_session cookie from the current request. Used from Server Actions and
 * from Next.js API routes that proxy to the backend. */
export async function apiAdmin<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(init.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string })?.error || `Request to ${path} failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
