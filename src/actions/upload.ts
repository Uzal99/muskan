"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/constants";
import { BUCKET, getSupabaseAdmin } from "@/lib/supabase";

export type UploadUrlResult =
  | { ok: true; bucket: string; path: string; token: string; publicUrl: string }
  | { ok: false; error: string };

/**
 * Images are uploaded straight from the browser to Supabase Storage using a
 * short-lived signed URL. That avoids Netlify's ~6 MB function payload limit
 * and keeps the service-role key on the server.
 */
export async function createUploadUrl(input: {
  fileName: string;
  contentType: string;
  size: number;
}): Promise<UploadUrlResult> {
  await requireAdmin();

  const ext = ALLOWED_IMAGE_TYPES[input.contentType];
  if (!ext) return { ok: false, error: "Use a JPG, PNG, WebP, GIF or AVIF image." };
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be 5 MB or smaller." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase storage isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create an upload URL. Does the storage bucket exist?" };
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, bucket: BUCKET, path, token: data.token, publicUrl: pub.publicUrl };
}
