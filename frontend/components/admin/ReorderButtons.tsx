"use client";

import { useTransition } from "react";

export function ReorderButtons({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => Promise<void>;
  onMoveDown: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-0.5">
      <button
        type="button"
        disabled={pending || !canMoveUp}
        onClick={() => startTransition(() => onMoveUp())}
        className="rounded px-1.5 py-0.5 text-bone/60 hover:text-bone disabled:opacity-20"
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={pending || !canMoveDown}
        onClick={() => startTransition(() => onMoveDown())}
        className="rounded px-1.5 py-0.5 text-bone/60 hover:text-bone disabled:opacity-20"
        title="Move down"
      >
        ↓
      </button>
    </div>
  );
}
