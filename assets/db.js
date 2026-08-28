/* =============================================================================
   WIFE ZONE CALCULATOR — Supabase client
   Three RPC calls over plain fetch. No SDK, no build step, no dependencies.

   Every function here fails soft on purpose: if the config is blank, the
   project is paused, or the network is down, the calculator still runs end to
   end. The backend adds sharing and group stats — it is never load-bearing.
   ============================================================================= */
window.WZ = window.WZ || {};

WZ.db = (function () {
  "use strict";

  const cfg = window.WZ_CONFIG || {};
  const ON  = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  function rpc(name, args, timeoutMs) {
    if (!ON) return Promise.resolve(null);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs || 6000);
    return fetch(cfg.SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1/rpc/" + name, {
      method: "POST",
      signal: ctl.signal,
      headers: {
        "Content-Type": "application/json",
        "apikey": cfg.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY
      },
      body: JSON.stringify(args || {})
    })
      .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(name + ": " + t); }))
      .catch(err => { console.warn("[wz] " + name + " unavailable —", err.message); return null; })
      .finally(() => clearTimeout(timer));
  }

  return {
    enabled: ON,

    /* Store a completed run, get back a 6-character share code (or null). */
    submit: function (s, v) {
      return rpc("submit_run", {
        p_height:        s.height,
        p_obese:         Boolean(s.obese),
        p_looks:         s.looks,
        p_adjust:        s.adjust,
        p_delta:         s.adjust === "fine" ? 0 : s.delta,
        p_body:          s.body,
        p_hot:           s.hot,
        p_crazy:         s.crazy,
        p_target_height: v.target,
        p_zone:          v.zone.name,
        p_archetype:     v.type.t.name,
        p_one_in:        Math.min(Math.round(v.rare.oneIn), 9007199254740991),
        p_flags:         s.flags.map(f => f[0])
      });
    },

    /* Rehydrate a shared run from its code. Returns the stored answers. */
    load: function (code) {
      return rpc("get_run", { p_code: String(code || "").toUpperCase().trim() });
    },

    /* Group stats for the result screen, plus the caller's rarity percentile. */
    stats: function (oneIn) {
      return rpc("get_stats", {
        p_one_in: oneIn ? Math.min(Math.round(oneIn), 9007199254740991) : null
      });
    }
  };
})();
