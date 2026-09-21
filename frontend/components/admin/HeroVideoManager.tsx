"use client";

import { useTransition } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function HeroVideoManager({
  currentUrl,
  onSet,
  onReset,
}: {
  currentUrl: string | null;
  onSet: (url: string) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="max-w-xl space-y-4">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <video key={currentUrl ?? "default"} src={currentUrl ?? "/video/hero-bg.mp4"} className="w-full" controls muted />
      </div>
      <p className="text-xs text-bone/50">
        {currentUrl ? "Using an uploaded video." : "Using the default video (/video/hero-bg.mp4)."}
      </p>

      <MediaUploader
        section="hero"
        accept="video/*"
        label="Upload a new introduction video"
        onUploaded={(result) => startTransition(() => onSet(result.url))}
      />

      {currentUrl && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (window.confirm("Reset to the default introduction video?")) {
              startTransition(() => onReset());
            }
          }}
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-bone/60 hover:bg-white/5 disabled:opacity-50"
        >
          Reset to default
        </button>
      )}
    </div>
  );
}
