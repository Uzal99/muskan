import { createClient } from "@supabase/supabase-js";

export const BUCKET = process.env.SUPABASE_BUCKET || "portfolio";

/** Server-only client using the service-role key. Never import in client components. */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
