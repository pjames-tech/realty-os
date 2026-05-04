import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client using the service_role key.
 * This bypasses RLS, rate limits, and email confirmation.
 * Only use server-side — never expose to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
