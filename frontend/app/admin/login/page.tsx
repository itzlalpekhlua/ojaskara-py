"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PUBLIC_BACKEND_URL } from "@/lib/publicBackendUrl";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${PUBLIC_BACKEND_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Invalid credentials");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 text-bone">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.03] p-8">
        <p className="font-display text-2xl text-gold-metal">Ojaskaraa Admin</p>
        <p className="mt-1 text-sm text-bone/50">Sign in to manage the site.</p>

        <label className="mt-6 block text-xs uppercase tracking-wide text-bone/50">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400"
        />

        <label className="mt-4 block text-xs uppercase tracking-wide text-bone/50">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-md bg-gold-400 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-gold-300 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
