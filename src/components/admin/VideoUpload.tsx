"use client";

import { createClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";
import { createUploadUrl } from "@/actions/upload";
import { ALLOWED_VIDEO_TYPES, MAX_VIDEO_BYTES } from "@/lib/constants";

export default function VideoUpload({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED_VIDEO_TYPES[file.type]) {
      setError("Use an MP4 or WebM video.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError("Video must be 50 MB or smaller.");
      return;
    }

    setBusy(true);
    try {
      const res = await createUploadUrl({ fileName: file.name, contentType: file.type, size: file.size });
      if (!res.ok) throw new Error(res.error);

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !anon) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.");

      const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
      const { error: uploadError } = await supabase.storage
        .from(res.bucket)
        .uploadToSignedUrl(res.path, res.token, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      setValue(res.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
          {value ? (
            <video src={value} muted playsInline className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-[11px] uppercase tracking-wider text-zinc-600">
              No video
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="btn-ghost btn-sm">
              {busy ? "Uploading…" : value ? "Replace video" : "Upload video"}
            </button>
            {value && !busy && (
              <button type="button" onClick={() => setValue("")} className="btn-danger btn-sm">
                Remove
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileRef}
            accept={Object.keys(ALLOWED_VIDEO_TYPES).join(",")}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <input
            type="url"
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="…or paste a public video URL"
            className="input !py-2 text-xs"
          />
          {hint && <p className="text-xs text-zinc-500">{hint}</p>}
          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
