import { createClient } from '@supabase/supabase-js'

// Server-only client met de service-role key. Omzeilt RLS — NOOIT naar de
// client/browser exporteren. Alleen gebruiken in server-side API-routes.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
)
