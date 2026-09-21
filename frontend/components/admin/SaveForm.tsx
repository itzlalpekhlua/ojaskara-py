"use client";

import { createContext, useContext, useRef, useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";

type SaveStatus = { pending: boolean; saved: boolean };
const SaveContext = createContext<SaveStatus>({ pending: false, saved: false });

export function useSaveStatus() {
  return useContext(SaveContext);
}

/**
 * Drop-in replacement for `<form action={serverAction}>` that gives visible save
 * feedback: the submit button (via `SaveButton`) shows "Saving…" then "Saved",
 * and the nearest ancestor `<details>` (the "+ Add" / "Edit" disclosure most admin
 * forms live inside) auto-collapses once the save completes.
 */
export function SaveForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      await action(formData);

      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2000);

      const details = form.closest("details");
      if (details) details.open = false;

      if (resetOnSuccess) form.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <SaveContext.Provider value={{ pending, saved }}>{children}</SaveContext.Provider>
    </form>
  );
}
