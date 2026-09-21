"use client";

import { useTransition } from "react";

export function ConfirmDeleteButton({
  onDelete,
  label = "Delete",
  confirmText = "Delete this? This cannot be undone.",
  className = "",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmText?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => onDelete());
        }
      }}
      className={
        className ||
        "rounded-md border border-red-400/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10 disabled:opacity-50"
      }
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
