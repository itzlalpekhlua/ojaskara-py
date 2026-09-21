"use client";

import { useSaveStatus } from "./SaveForm";

export function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending, saved } = useSaveStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
        saved ? "bg-emerald-500 text-white" : "bg-gold-400 text-ink-950 hover:bg-gold-300 disabled:opacity-60"
      }`}
    >
      {pending ? "Saving…" : saved ? "Saved ✓" : label}
    </button>
  );
}
