/* =============================================================================
   Supabase connection.

   Both values below are safe to commit. The anon key is designed to be public —
   it is what every browser hitting the page uses. What actually protects the
   data is in supabase/schema.sql: the runs table has row-level security on and
   zero policies, all grants revoked, and anon can only execute three specific
   functions. Nobody can dump, update or delete anything with this key.

   NEVER put the service_role key here. That one bypasses everything.

   Leave both blank and the calculator still runs end to end — it just loses the
   share links and the group stats.
   ============================================================================= */
window.WZ_CONFIG = {
  SUPABASE_URL:      "",  // https://xxxxxxxxxxxx.supabase.co
  SUPABASE_ANON_KEY: ""   // Project Settings → API → anon / public
};
