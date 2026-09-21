"use client";

import { useTransition } from "react";

export function PublishToggle({
  published,
  onToggle,
}: {
  published: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => onToggle(!published))}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide transition-colors disabled:opacity-50 ${
        published ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-bone/50"
      }`}
      title="Toggle published"
    >
      {published ? "Published" : "Draft"}
    </button>
  );
}
