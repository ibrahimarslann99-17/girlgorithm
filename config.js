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
  SUPABASE_URL:      "https://npyfgbhdseigfnsdevtd.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weWZnYmhkc2VpZ2Zuc2RldnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTE4NzAsImV4cCI6MjEwMzc2Nzg3MH0.6EMpNRY6wGnyjQUQZHVwYQNBMZVEo1jVbsPnz-cAZp8"
};
