"use client";

import { useRef, useState } from "react";
import { PUBLIC_BACKEND_URL } from "@/lib/publicBackendUrl";

type UploadResult = { url: string; mediaType: "image" | "video" };

export function MediaUploader({
  section,
  accept = "image/*,video/*",
  label = "Upload file",
  multiple = false,
  onUploaded,
}: {
  section: string;
  accept?: string;
  label?: string;
  multiple?: boolean;
  onUploaded: (result: UploadResult) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("section", section);
    const res = await fetch(`${PUBLIC_BACKEND_URL}/api/admin/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `Upload failed for ${file.name}`);
    }
    return data as UploadResult;
  }

  async function uploadMany(files: File[]) {
    setBusy(true);
    setError(null);
    setProgress({ done: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        const result = await uploadOne(files[i]);
        onUploaded(result);
        setProgress({ done: i + 1, total: files.length });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const buttonLabel = busy
    ? progress && progress.total > 1
      ? `Uploading ${progress.done + 1} of ${progress.total}…`
      : "Uploading…"
    : label;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const files = Array.from(e.dataTransfer.files ?? []);
          if (files.length) uploadMany(multiple ? files : files.slice(0, 1));
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-6 text-center text-sm transition-colors ${
          dragOver ? "border-gold-400 bg-gold-400/5" : "border-white/20 hover:border-white/40"
        }`}
      >
        <span className="text-bone/80">{buttonLabel}</span>
        <span className="text-xs text-bone/40">
          {multiple ? "Click or drag files here — you can select more than one" : "Click or drag a file here"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) uploadMany(files);
        }}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
