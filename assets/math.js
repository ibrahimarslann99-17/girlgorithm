/* =============================================================================
   GIRLGORITHM — the model
   Pure functions, no DOM, no randomness. Same answers in, same file out.
   ============================================================================= */
window.WZ = window.WZ || {};

WZ.math = (function () {
  "use strict";

  /* Reference population: adult women, height in cm. */
  const POP = { mu: 163, sd: 6.4, singlePool: 4000000 };

  /* Male stated preference ratio: partner height = own height / 1.09.
     Lands the gap near 15 cm, which is the ergonomic sweet spot. */
  const RATIO = 1.09;

  /* --- build: two axes, because one was not enough -------------------------
     A single 3-value scale put "muscular" and "heavy" on the same line and made
     the middle option the safe answer for everyone. Softness (how much give
     there is) and form (what is underneath it) are independent, so they are two
     questions now — 12 combinations instead of 3. */

  const SOFT = [
    { idx: 0, key: "oak",     label: "No give at all",  hug: "like hugging the trunk of an oak tree" },
    { idx: 1, key: "yoga",    label: "Firm",            hug: "like hugging a rolled-up yoga mat" },
    { idx: 2, key: "pillow",  label: "Properly soft",   hug: "like hugging your cotton pillow" },
    { idx: 3, key: "waterbed", label: "All give",       hug: "like hugging a waterbed" }
  ];

  const FORM = [
    { v: -1, key: "muscle",  label: "Muscle",   note: "built, and it shows" },
    { v:  0, key: "neutral", label: "Neither",  note: "no particular engine under it" },
    { v: +1, key: "fat",     label: "Softness", note: "more of the same, all the way down" }
  ];

  /* Joint prevalence P(soft, form) in the reference population — rows sum to the
     softness marginal, the whole table sums to 1. Muscle clusters at the firm
     end, fat at the soft end, which is the only shape that is not nonsense. */
  const BUILD_P = {
    "0|muscle": 0.090, "0|neutral": 0.057, "0|fat": 0.003,
    "1|muscle": 0.090, "1|neutral": 0.186, "1|fat": 0.024,
    "2|muscle": 0.038, "2|neutral": 0.209, "2|fat": 0.133,
    "3|muscle": 0.007, "3|neutral": 0.044, "3|fat": 0.119
  };
  const buildP    = (soft, form) => BUILD_P[soft + "|" + form] || 0.001;
  const softOf    = i => SOFT[i];
  const formOf    = k => FORM.find(f => f.key === k) || FORM[1];
  const buildLabel = (soft, form) => softOf(soft).label + ", " + formOf(form).label.toLowerCase() + " underneath";

  /* --- effort: how much production goes into how she looks ----------------
     This is the axis that actually separates the Girl Next Door from the
     Baddie. Before it existed they were told apart only by hot/crazy, which is
     why so many answers collapsed onto the same few types. */
  const EFFORT = [
    { idx: 0, key: "none",   p: 0.15, label: "Bare face",           hint: "Didn't glance in a mirror. Grunge-girl, zero performance." },
    { idx: 1, key: "low",    p: 0.35, label: "Clean-girl minimal",  hint: "Slicked-back bun, tinted lip, skin she actually invests in." },
    { idx: 2, key: "high",   p: 0.35, label: "Put together",       hint: "Sharp and intentional, corporate-baddie energy. You can tell she tried, but only just." },
    { idx: 3, key: "max",    p: 0.15, label: "Full glam",           hint: "Lashes, contour, ninety minutes. Every single time — IG-baddie production." }
  ];

  /* --- room: where she sits in a crowd ------------------------------------
     Temperament, not volume of speech. Separates the Gothic from the Baddie
     and the Nerd from the Comfort Class far better than craziness does.
     Four buckets, not three — "working the edges" collapsed two genuinely
     different energies (mingles with strangers vs. stays inside her own
     group) into one vague option. Splitting it needed a v recompute run
     (scripts/compute_cuts.js) since ROOM.p changed; TYPES centroids did not
     need to move — they already sit on the same continuous scale. */
  const ROOM = [
    { v: +1,   key: "centre", p: 0.30, label: "Centre of the room",                              hint: "It-girl gravity — people orbit toward her without meaning to." },
    { v: +0.35, key: "social", p: 0.25, label: "Says hi to everyone, then finds her people",       hint: "Knows the room, works the room, still ends up on the same three couches by the end of the night." },
    { v: -0.35, key: "clique", p: 0.20, label: "Skips the small talk, comes in with her crew",     hint: "Didn't come to network. Arrived with the group chat, leaves with the group chat." },
    { v: -1,   key: "corner", p: 0.25, label: "Finds the one person she knows, leaves early",      hint: "In and out before the party photos happen. Efficient, not antisocial." }
  ];
  const effortOf = i => EFFORT[i];
  const roomOf   = k => ROOM.find(r => r.key === k) || ROOM[1];

  /* --- vice: how much drink and smoke are actually in the picture --------- */
  const VICE = [
    { v: -1,    key: "sober",   p: 0.20, label: "Sober, doesn't touch either",                          hint: "Never picked either habit up. No interest in starting on your account." },
    { v: -0.33, key: "social",  p: 0.40, label: "Social drinker, no smoking",                            hint: "A glass of wine at dinner. That is the entire relationship." },
    { v: 0.33,  key: "regular", p: 0.25, label: "Drinks regularly, smokes or vapes occasionally",        hint: "Not a daily habit, but nobody at the table is surprised to see it." },
    { v: 1,     key: "heavy",   p: 0.15, label: "Smokes regularly, drinks like it's a personality trait", hint: "It is load-bearing at this point. Ask her about it, she has a whole bit." }
  ];

  /* --- tradition: how much of her life runs on an inherited script -------- */
  const TRADITION = [
    { v: -1,    key: "secular",  p: 0.25, label: "Writes her own rules, no inherited script",               hint: "Faith and family tradition are things other people have. She built her own instead." },
    { v: -0.33, key: "cultural", p: 0.35, label: "Respects tradition, doesn't live by it",                   hint: "Shows up for the holidays. Skips everything in between without a shred of guilt." },
    { v: 0.33,  key: "practicing", p: 0.25, label: "Practices, keeps it personal",                          hint: "It is genuinely part of her life. She is not building a sermon out of it for you." },
    { v: 1,     key: "core",    p: 0.15, label: "It's the organising principle — family, faith, the whole structure", hint: "This is not a phase or an aesthetic. It is the load-bearing wall of how she lives." }
  ];

  /* --- visibility: how much of her life is performed for an audience ------
     Deliberately not the same thing "room" measures. Room is how she carries
     herself in a space she can see the whole of. This is how much of her
     life she performs for an audience she can't — a wallflower can run a
     large account, a room's centre of gravity can post nothing at all. */
  const VISIBILITY = [
    { v: -1,    key: "ghost",   p: 0.20, label: "Ghost. Three mutual friends had to confirm she owns a phone", hint: "No grid, no stories, no digital footprint worth finding." },
    { v: -0.33, key: "private", p: 0.30, label: "Close-friends story only, four posts a year",                hint: "Exists online strictly for an audience of people who already have her number." },
    { v: 0.33,  key: "normal",  p: 0.35, label: "Normal poster — a few stories a week, curated grid",         hint: "Documents her life without turning it into a job." },
    { v: 1,     key: "creator", p: 0.15, label: "Full content creation — she has a ring light and opinions about it", hint: "There is a posting schedule. There is a brand. You are, on some level, a storyline now." }
  ];

  /* --- family: how close the family orbit sits ----------------------------- */
  const FAMILY = [
    { v: -1,    key: "distant", p: 0.15, label: "Distant or estranged — family's a group chat she mutes",   hint: "Handles the holidays and asks for nothing further from the arrangement." },
    { v: -0.33, key: "normal",  p: 0.40, label: "Normal — a call every week or two, home for the holidays", hint: "A functioning, ordinary amount of family. Nothing to manage, nothing to escape." },
    { v: 0.33,  key: "close",   p: 0.30, label: "Close — texts her mom daily, still asks her advice on everything", hint: "You are not just dating her. You are, eventually, dating the group chat too." },
    { v: 1,     key: "core",    p: 0.15, label: "Family is the whole operating system", hint: "Sunday dinners are mandatory. So, eventually, are you." }
  ];

  const viceOf       = k => VICE.find(x => x.key === k) || VICE[1];
  const traditionOf  = k => TRADITION.find(x => x.key === k) || TRADITION[1];
  const visibilityOf = k => VISIBILITY.find(x => x.key === k) || VISIBILITY[1];
  const familyOf     = k => FAMILY.find(x => x.key === k) || FAMILY[1];

  /* Hotness and craziness, as distributed in the wild. */
  const HOT   = { mu: 5.0, sd: 1.6 };
  const CRAZY = { mu: 6.4, sd: 1.5 };

  /* Archetypes, as points in 7-D spec space: softness, form, effort, room,
     height z-score, hot, crazy — every axis is something the user actually
     chooses. Classification is nearest neighbour, never a dice roll.

     `cuts` are each type's distance terciles, but — this is the fix for the
     "everyone gets the textbook portrait" bug five separate testers hit,
     0/5 ever seeing variant 2 or 3 — measured over a REALISTIC population of
     answers, not a uniform grid. The original cuts were terciles over all
     7,056 combinations weighted equally, which means a soft=3/muscle combo
     with a real-world probability of 0.007 counted exactly as much as the
     soft=2/neutral combo at 0.209 — 30x more common in practice. That
     inflated the reference distance spread far past what real answers ever
     produce, so everyone landed under cuts[0]. Recomputed in
     scripts/compute_cuts.js by Monte Carlo sampling from the SAME weights
     this file already documents (BUILD_P, EFFORT.p, ROOM.p, HOT, CRAZY) plus
     a reasonable height/override model, then taking terciles only among the
     samples actually assigned to each type. Re-run that script and paste its
     output here if any axis weight, TYPES centroid, or probability table
     above changes — these numbers are only correct for the current model. */
  const TYPES = [
    { key: "model", cuts: [1.669, 1.952], name: "The Model", soft: 0.7, form: -0.2, effort: 2.6, room:  0.0, vice: +0.20, tradition: -0.30, visibility: +0.70, family: -0.20, heightZ: +0.9, hot: 9.2, crazy: 7.5,
      blurb: "Built like a coat hanger, photographs better than she looks and looks incredible. Eats one salad in public and a whole cake at home. Will out-earn you by 25 and remind you of it kindly." },
    { key: "goth", cuts: [1.925, 2.402], name: "The Goth", soft: 1.1, form:  0.1, effort: 2.2, room: -0.8, vice: +0.40, tradition: -0.60, visibility: +0.10, family: -0.50, heightZ: +0.3, hot: 7.5, crazy: 9.0,
      blurb: "Black everything, reads three books at once, owns a cat with a Latin name. Deeply loyal until the exact second she is not. You will learn more about yourself than you wanted to." },
    { key: "corporate", cuts: [1.947, 2.408], name: "Corporate Baddie", soft: 1.7, form: -0.3, effort: 2.4, room:  0.3, vice: +0.10, tradition: -0.30, visibility: +0.20, family: -0.10, heightZ: +0.5, hot: 7.2, crazy: 5.2,
      blurb: "Sharp, tailored, replies to texts in complete sentences. Will win every argument you start, including the ones you were right about. Astonishingly low drama, astonishingly high standards." },
    { key: "nerd", cuts: [1.895, 2.237], name: "The Nerd", soft: 1.3, form:  0.2, effort: 0.4, room: -0.9, vice: -0.60, tradition: +0.00, visibility: -0.50, family: +0.20, heightZ: -0.2, hot: 6.0, crazy: 4.2,
      blurb: "Quick, wry, glasses, opinions about a videogame you have never heard of. Improves by 2 points the moment she gets comfortable. The highest-return pick on the whole board." },
    { key: "cleangirl", cuts: [1.717, 2.08], name: "Clean Girl", soft: 1.9, form:  0.1, effort: 0.7, room:  0.1, vice: -0.40, tradition: +0.10, visibility: +0.40, family: +0.30, heightZ:  0.0, hot: 7.0, crazy: 4.5,
      blurb: "Glowing skin, slicked-back bun, small gold hoops, nothing on her that looks like it took effort — because the effort went into sleep, water and a skincare shelf you will not be allowed to touch. Looks identical at 7am and at a wedding. Everyone underrates her until they meet her." },
    { key: "baddie", cuts: [1.852, 2.445], name: "The Baddie", soft: 2.0, form:  0.0, effort: 3.0, room:  0.9, vice: +0.50, tradition: -0.50, visibility: +0.90, family: -0.10, heightZ: -0.3, hot: 9.3, crazy: 8.3,
      blurb: "Nails, lashes, a phone that never stops. Turns a supermarket run into an event. Costs money, costs sleep, worth it for a defined period you should agree on in advance." },
    { key: "gymgirl", cuts: [2.058, 2.56], name: "Gym Girl", soft: 0.9, form: -0.9, effort: 1.6, room:  0.6, vice: -0.50, tradition: +0.00, visibility: +0.30, family: +0.00, heightZ: +0.4, hot: 7.8, crazy: 6.2,
      blurb: "Trains five days a week and can tell you exactly why. Meal-prepped, disciplined, in a matching set more often than in clothes. The most reliable person on this chart and the one most likely to out-lift you. Your gym membership is about to start getting used." },
    { key: "grunge", cuts: [1.932, 2.345], name: "Grunge Girl", soft: 1.2, form:  0.0, effort: 0.3, room: -0.3, vice: +0.60, tradition: -0.70, visibility: -0.40, family: -0.60, heightZ: -0.1, hot: 6.8, crazy: 8.9,
      blurb: "Flannel, ripped jeans, combat boots, a band on the shirt you have not heard of. Puts in no visible effort and is somehow the most magnetic person in the room. Chaotic in a way that is extremely fun for about eight months." },
    { key: "comfort", cuts: [1.864, 2.237], name: "The Comfort Class", soft: 2.8, form:  0.9, effort: 0.8, room:  0.4, vice: -0.30, tradition: +0.40, visibility: -0.50, family: +0.80, heightZ: -0.5, hot: 5.5, crazy: 5.5,
      blurb: "Warm, unbothered, feeds people as a love language. The lowest-maintenance partner on this chart by a distance. Your friends will like her more than they like you." },
    { key: "oldmoney", cuts: [1.73, 2.21], name: "Old Money", soft: 1.4, form: 0.1, effort: 1.4, room: -0.2, vice: 0.1, tradition: 0.7, visibility: -0.7, family: 0.5, heightZ: 0.3, hot: 7.0, crazy: 3.8,
      blurb: "Never raises her voice, never explains herself twice, has never once posted the vacation. Quiet is not the same as boring; quiet is what you can afford once you stop needing an audience. The calmest person in any room by a wide margin." },
    { key: "coquette", cuts: [1.934, 2.395], name: "The Coquette", soft: 1.503, form: 0.125, effort: 3.0, room: 0.6, vice: +0.20, tradition: -0.484, visibility: +0.534, family: -0.447, heightZ: -0.418, hot: 7.512, crazy: 6.589,
      blurb: "Bows, blush and a smile that has been rehearsed since middle school. Photographs like a Valentine and negotiates like a hostage situation. Sweet is the costume; underneath is someone who has never once lost an argument she planned in advance." },
    { key: "academia", cuts: [2.035, 2.351], name: "Dark Academia", soft: 1.03, form: 0.5, effort: 0.3, room: -1.0, vice: +0.90, tradition: +0.88, visibility: -0.473, family: -0.425, heightZ: 0.157, hot: 6.2, crazy: 7.214,
      blurb: "Tweed, a battered copy of something Russian, and the settled conviction that she was born in the wrong century. Quotes poetry unprompted, cries at an ending she already knew was coming. Brilliant, a little doomed, and you will absolutely read the book before you're allowed to watch the film." },
    { key: "cottagecore", cuts: [1.973, 2.294], name: "Cottagecore", soft: 2.219, form: 0.7, effort: 0.126, room: -0.328, vice: -0.223, tradition: +0.479, visibility: +0.515, family: +0.758, heightZ: -0.103, hot: 5.564, crazy: 6.255,
      blurb: "Flower-pressed, sun-freckled, on a first-name basis with her sourdough starter. Talks about the moon cycle like it's a coworker. No makeup, no shoes, opinions about raw milk you did not ask for. Feral in the specific way that involves a very good skincare routine." },
    { key: "y2k", cuts: [2.251, 2.622], name: "Y2K", soft: 1.563, form: -0.566, effort: 1.354, room: 0.953, vice: +0.834, tradition: -0.375, visibility: +0.798, family: -0.348, heightZ: -0.126, hot: 6.992, crazy: 8.413,
      blurb: "Low-rise, rhinestoned, thinks the year is perpetually 2003. Runs on flash photography and disposable-camera chemistry. Guilt-trips you with the fluency of someone who learned relationships from a Myspace top-8. Genuinely a great time until roughly 3am." },
    { key: "offduty", cuts: [1.65, 2.02], name: "Off-Duty", soft: 0.56, form: 0.07, effort: 0.9, room: 0.13, vice: 0.0, tradition: -0.515, visibility: +0.034, family: -0.08, heightZ: 0.5, hot: 7.8, crazy: 4.45,
      blurb: "Leather jacket, straight-leg jeans, sunglasses indoors, allegedly no makeup. Looks better doing nothing than most people look trying. Replies three hours late and somehow that is also fine. The least effort anyone has ever put into being this attractive." },
    { key: "pilates", cuts: [2.194, 2.639], name: "Pilates Princess", soft: 0.833, form: -0.876, effort: 1.256, room: 0.221, vice: -0.547, tradition: +0.693, visibility: +0.78, family: +0.496, heightZ: 0.087, hot: 7.503, crazy: 3.803,
      blurb: "Matching set, grip socks, a reformer class at 6am with the same four girls every day. Will mention Pilates within the first ten minutes of meeting you, unprompted. Calm, disciplined, and quietly convinced everyone else is doing wellness wrong." }
  ];

  /* --- normal distribution ------------------------------------------------ */

  function erf(x) {
    const s = x < 0 ? -1 : 1; x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
          a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
    return s * y;
  }
  const ncdf = (x, mu, sd) => 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));

  /* --- height ------------------------------------------------------------- */

  const idealFor = h => Math.round(h / RATIO);
  const floorFor = h => h - 30;

  /* Apply a manual override, clamped to the ergonomic floor and a sane ceiling. */
  function applyDelta(height, ideal, delta) {
    return Math.max(floorFor(height), Math.min(height - 4, ideal + delta));
  }

  /* --- Hot / Crazy Matrix, boundaries read straight off the chart ---------- */

  function zoneOf(hot, crazy) {
    if (hot < 5) return { name: "NO GO ZONE", ok: false,
      line: "Below 5 hot, every point of crazy is unpaid overtime. The chart shades this whole column out for a reason." };
    if (crazy > 8.2) return { name: "DANGER ZONE", ok: false,
      line: "Above the 8 line she is hot enough to be worth it and unstable enough to end you. Historically this is where the fun stories and the restraining orders come from." };
    if (hot < 8) return { name: "FUN ZONE", ok: true,
      line: "Nothing wrong here. Good weekends, no forwarding address. The chart's honest middle." };
    if (crazy >= 7) return { name: "DATE ZONE", ok: true,
      line: "Genuinely hot, genuinely a handful. Date her, enjoy it, do not co-sign a lease." };
    if (crazy >= 5) return { name: "WIFE ZONE", ok: true,
      line: "Hot, and crazy only in the load-bearing amount every human carries. This is the target rectangle." };
    return { name: "UNICORN", ok: true,
      line: "An 8-plus with a crazy under 5. The chart lists this zone for completeness. She is a transvestite or you are being lied to." };
  }

  /* --- archetype: nearest neighbour in weighted 7-D space ----------------- */

  /* Height re-enters here, but not the way it broke things the first time.
     The first version fed the user's raw height straight into classify() —
     fixed for any one user, so it just pinned the archetype to whichever
     number they happened to be born with; at 195 cm only four of the eight
     types were reachable at all. What actually carries a *choice* is the
     override: after the ratio sets a proposed partner height, the user can
     accept it or argue with it, and that decision — asking for someone taller
     or shorter than the model recommends, and by how much — is exactly the
     kind of preference the rest of this axis list is made of. So the input
     here is not height, it is heightZ: the resulting target height expressed
     as a z-score against the population, i.e. "how tall a partner is this,
     relative to everyone" rather than "how tall is this user". Comparable
     across a 165 cm user and a 205 cm user, and it moves only when the user
     actually pushes on the override screen. Weighted low relative to the
     other axes on purpose — a nudge toward Model/Gym Girl on a tall ask, not
     a repeat of the old takeover.

     Form's weight was 1.10 until a real user hit "clean-girl minimal effort,
     no muscle" and still got handed Gym Girl — hot+crazy+softness sat close
     enough to Gym Girl's centre that they outvoted a form axis that flatly
     disagreed. Form is the one axis that is nearly definitional for a couple
     of these types (Gym Girl's whole identity is "muscle"), so it needed to
     out-argue the others when it disagrees, not get outvoted by them.
     Raised to 1.90 — a same-form mismatch now costs roughly as much distance
     as being off by two full points on the hot/crazy sliders — and the
     "clean effort, no muscle" combination stopped reaching Gym Girl in
     simulation. Changing it moved every type's distance scale, so cuts were
     recomputed same as any other axis change (see the TYPES comment).

     Vice, tradition, visibility and family joined as real axes at the same
     time as the Gym Girl fix went in — same treatment as every other axis
     here: a real weight in this distance, a real centroid on all nine
     TYPES, a real population table (VICE.p / TRADITION.p / VISIBILITY.p /
     FAMILY.p) feeding both this classification AND rarity()'s "1 in N", and
     a sentence slot in buildNote() below so a specific answer shows up as a
     specific line in the write-up, not just an invisible number. Weighted
     at 0.65 each — real, but lighter than form or room, since four axes
     arrived in one pass and the existing seven were already load-bearing. */
  function classify(soft, form, effort, room, vice, tradition, visibility, family, heightZ, hot, crazy) {
    const f   = formOf(form).v;
    const r   = roomOf(room).v;
    const vc  = viceOf(vice).v;
    const tr  = traditionOf(tradition).v;
    const vis = visibilityOf(visibility).v;
    const fam = familyOf(family).v;
    let best = null;
    for (const t of TYPES) {
      const d = Math.sqrt(
        Math.pow((soft    - t.soft)       * 0.90, 2) +
        Math.pow((f       - t.form)       * 1.90, 2) +
        Math.pow((effort  - t.effort)     * 0.75, 2) +
        Math.pow((r       - t.room)       * 0.85, 2) +
        Math.pow((vc      - t.vice)       * 0.65, 2) +
        Math.pow((tr      - t.tradition)  * 0.65, 2) +
        Math.pow((vis     - t.visibility) * 0.65, 2) +
        Math.pow((fam     - t.family)     * 0.65, 2) +
        Math.pow((heightZ - t.heightZ)    * 0.45, 2) +
        Math.pow((hot     - t.hot)        * 0.60, 2) +
        Math.pow((crazy   - t.crazy)      * 0.55, 2)
      );
      if (!best || d < best.d) best = { t: t, d: d };
    }
    best.fit = Math.max(31, Math.round(100 * Math.exp(-best.d / 4.2)));

    /* Which of the type's three portraits to show. The cuts on each archetype
       are its distance terciles measured over a realistically-weighted
       population of answers (see the TYPES comment above and
       scripts/compute_cuts.js), so the three variants come up in even
       thirds among real users, not just among every combination on paper. */
    best.note = buildNote(best.t, soft, form, effort, room, vice, tradition, visibility, family);
    const c = best.t.cuts;
    best.variant = best.d <= c[0] ? 0 : best.d <= c[1] ? 1 : 2;
    best.tier    = VARIANTS[best.variant];
    return best;
  }

  /* The type is the headline; this is the fine print. It reads the user's exact
     build against the archetype's centre, so two people who land on the same
     type but arrived from different builds do not get the identical write-up. */
  function buildNote(t, soft, form, effort, room, vice, tradition, visibility, family) {
    const ds = soft - t.soft;
    const df = formOf(form).v - t.form;
    const de = effort - t.effort;
    const dr = roomOf(room).v - t.room;
    const dv  = viceOf(vice).v - t.vice;
    const dt  = traditionOf(tradition).v - t.tradition;
    const dvi = visibilityOf(visibility).v - t.visibility;
    const dfa = familyOf(family).v - t.family;
    const bits = [];
    if (ds <= -1.0) bits.push("firmer than the type usually runs");
    else if (ds >= 1.0) bits.push("softer than the type usually runs");
    else bits.push("dead on the type for build");
    if (df <= -0.7) bits.push("and carrying real muscle under it");
    else if (df >= 0.7) bits.push("and there is nothing but softness underneath");
    let out = bits.join(" ") + ".";
    out = out.charAt(0).toUpperCase() + out.slice(1);
    if (de <= -1.2) out += " She puts in far less work on her appearance than this type normally does.";
    else if (de >= 1.2) out += " And considerably more production than the type calls for.";
    if (dr <= -1.2) out += " Quieter in a room than the archetype suggests.";
    else if (dr >= 1.2) out += " Louder in a room than the archetype suggests.";
    if (dv <= -1.0) out += " More sober than the type usually runs.";
    else if (dv >= 1.0) out += " Considerably more vice in the picture than the archetype carries.";
    if (dt <= -1.0) out += " Less tied to tradition than typical for the type.";
    else if (dt >= 1.0) out += " More tradition-bound than the archetype suggests.";
    if (dvi <= -1.0) out += " Quieter online than the type usually is.";
    else if (dvi >= 1.0) out += " Considerably more online than the archetype suggests.";
    if (dfa <= -1.0) out += " More distant from family than typical for the type.";
    else if (dfa >= 1.0) out += " Closer to family than the archetype suggests.";
    return out;
  }

  const VARIANTS = [
    { key: "textbook",  label: "Textbook",  note: "The pure form of the type. Your answers land almost exactly on the archetype." },
    { key: "variation", label: "Variation", note: "Recognisably the type, but one of your answers pulls her off-spec." },
    { key: "edge",      label: "Edge case", note: "She only just qualifies. Your answers sit at the far edge of this archetype — the next type over was close behind." }
  ];

  /* --- stature: where the target sits in the height distribution ---------- */
  /* Height no longer decides the archetype, so it reports itself directly. */
  function heightZFor(target) { return (target - POP.mu) / POP.sd; }

  function statureOf(target) {
    const pctShorter = Math.round(100 * ncdf(target, POP.mu, POP.sd));
    const line =
      pctShorter >= 99 ? "Taller than 99% of women. You are asking for the very end of the curve."
    : pctShorter >= 90 ? "Taller than " + pctShorter + "% of women. Genuinely tall, and priced accordingly."
    : pctShorter >= 70 ? "Taller than " + pctShorter + "% of women. Above average without being rare."
    : pctShorter >= 31 ? pctShorter + "% of women are shorter. Dead centre of the distribution — the widest part of the pool."
    : pctShorter >= 10 ? "Shorter than " + (100 - pctShorter) + "% of women. Petite, and common enough to find."
    :                    "Shorter than " + (100 - pctShorter) + "% of women. That is its own kind of rare.";
    return { pctShorter: pctShorter, line: line };
  }

  /* --- rarity ------------------------------------------------------------- */

  function rarity(lo, hi, soft, form, effort, room, vice, tradition, visibility, family, hot, crazy) {
    const pH   = Math.max(1e-12, ncdf(hi + 0.5, POP.mu, POP.sd) - ncdf(lo - 0.5, POP.mu, POP.sd));
    const pB   = buildP(soft, form);
    const pE   = EFFORT[effort].p;
    const pR   = roomOf(room).p;
    const pV   = viceOf(vice).p;
    const pT   = traditionOf(tradition).p;
    const pVis = visibilityOf(visibility).p;
    const pF   = familyOf(family).p;
    const pHt  = Math.max(1e-12, 1 - ncdf(hot - 0.5, HOT.mu, HOT.sd));
    const pCz  = Math.max(1e-12, ncdf(crazy + 0.5, CRAZY.mu, CRAZY.sd));

    /* Hot and crazy are correlated in the wild — that is the whole point of the
       diagonal on the chart. Asking for a wide gap has to cost something. */
    const gap  = hot - crazy;
    const corr = gap > 2 ? 1 / (1 + (gap - 2) * 1.8) : 1;

    const p = pH * pB * pE * pR * pV * pT * pVis * pF * pHt * pCz * corr;
    return {
      pH: pH, pB: pB, pE: pE, pR: pR, pV: pV, pT: pT, pVis: pVis, pF: pF, pHt: pHt, pCz: pCz, corr: corr, p: p,
      oneIn: 1 / p,
      candidates: POP.singlePool * p
    };
  }

  /* --- one call that turns answers into a whole verdict ------------------- */

  function evaluate(s) {
    const ideal  = idealFor(s.height);
    const target = s.adjust === "fine" ? ideal : applyDelta(s.height, ideal, s.delta);
    const lo = target - 3, hi = target + 3;
    const zone  = zoneOf(s.hot, s.crazy);
    const heightZ = heightZFor(target);
    const type  = classify(s.soft, s.form, s.effort, s.room, s.vice, s.tradition, s.visibility, s.family, heightZ, s.hot, s.crazy);
    const rare  = rarity(lo, hi, s.soft, s.form, s.effort, s.room, s.vice, s.tradition, s.visibility, s.family, s.hot, s.crazy);
    const stature = statureOf(target);
    const weeks = rare.oneIn / 2;                 // two assessed first dates a week
    const years = weeks / 52;
    return {
      ideal: ideal, target: target, lo: lo, hi: hi,
      gap: s.height - target,
      floor: floorFor(s.height),
      soft: softOf(s.soft), form: formOf(s.form),
      effort: effortOf(s.effort), room: roomOf(s.room),
      vice: viceOf(s.vice), tradition: traditionOf(s.tradition),
      visibility: visibilityOf(s.visibility), family: familyOf(s.family),
      buildLabel: buildLabel(s.soft, s.form),
      zone: zone, type: type, rare: rare, stature: stature,
      weeks: weeks, years: years,
      searchTime: years > 4000 ? "The sun expires first"
                : years > 1    ? fmt(years) + " yr"
                : Math.round(weeks) + " wk"
    };
  }

  /* --- formatting --------------------------------------------------------- */

  function fmt(n) {
    if (!isFinite(n)) return "∞";
    return n >= 1000 ? Math.round(n).toLocaleString("en-US")
         : n >= 10   ? String(Math.round(n))
         : n.toFixed(1);
  }
  function pct(p) {
    return p >= 0.1   ? (p * 100).toFixed(1) + "%"
         : p >= 0.001 ? (p * 100).toFixed(2) + "%"
         : (p * 100).toExponential(1) + "%";
  }

  return { POP, RATIO, SOFT, FORM, EFFORT, ROOM, VICE, TRADITION, VISIBILITY, FAMILY, BUILD_P, HOT, CRAZY, TYPES, VARIANTS,
           effortOf, roomOf, viceOf, traditionOf, visibilityOf, familyOf,
           buildP, softOf, formOf, buildLabel, buildNote,
           ncdf, idealFor, floorFor, applyDelta,
           zoneOf, classify, statureOf, heightZFor, rarity, evaluate, fmt, pct };
})();
