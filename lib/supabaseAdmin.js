import { createClient } from '@supabase/supabase-js'

// Server-only client met de service-role key. Omzeilt RLS — NOOIT naar de
// client/browser exporteren. Lazy: pas aanmaken bij het eerste verzoek, zodat
// de build niet afhangt van runtime-env-vars.
let _client
export function getSupabaseAdmin() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
  }
  return _client
}
