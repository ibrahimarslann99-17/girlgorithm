/* =============================================================================
   WIFE ZONE CALCULATOR — the model
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
    { idx: 3, key: "jug",     label: "All give",        hug: "like hugging a 19-litre water jug" }
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
    { idx: 0, key: "none",   p: 0.15, label: "None",            hint: "Rolled out of bed. That is the whole look." },
    { idx: 1, key: "low",    p: 0.35, label: "Minimal",         hint: "Clean, brushed, done in four minutes." },
    { idx: 2, key: "high",   p: 0.35, label: "Put together",    hint: "Thought about it. You can tell, but only just." },
    { idx: 3, key: "max",    p: 0.15, label: "Full production", hint: "Ninety minutes. Every single time." }
  ];

  /* --- room: where she sits in a crowd ------------------------------------
     Temperament, not volume of speech. Separates the Gothic from the Baddie
     and the Nerd from the Comfort Class far better than craziness does. */
  const ROOM = [
    { v: +1, key: "centre", p: 0.30, label: "The centre of it",        hint: "Everyone ends up facing her." },
    { v:  0, key: "edges",  p: 0.45, label: "Working the edges",       hint: "Three good conversations, no audience." },
    { v: -1, key: "corner", p: 0.25, label: "Found one person, stayed", hint: "Left at eleven and did not say goodbye." }
  ];
  const effortOf = i => EFFORT[i];
  const roomOf   = k => ROOM.find(r => r.key === k) || ROOM[1];

  /* Hotness and craziness, as distributed in the wild. */
  const HOT   = { mu: 5.0, sd: 1.6 };
  const CRAZY = { mu: 6.4, sd: 1.5 };

  /* Archetypes, as points in 6-D spec space: softness, form, effort, room,
     hot, crazy — every axis is something the user actually chooses. Height is
     deliberately absent: it is fixed per user, so including it pinned the
     result. Classification is nearest neighbour, never a dice roll. `cuts` are
     each type's distance terciles over all 7,056 reachable answer
     combinations, so its three portraits come up in even thirds. */
  const TYPES = [
    { key: "model", cuts: [1.63, 2.01], name: "The Model", soft: 0.7, form: -0.2, effort: 2.6, room:  0.0, hot: 9.2, crazy: 7.5,
      blurb: "Built like a coat hanger, photographs better than she looks and looks incredible. Eats one salad in public and a whole cake at home. Will out-earn you by 25 and remind you of it kindly." },
    { key: "gothic", cuts: [1.81, 2.25], name: "The Gothic", soft: 1.1, form:  0.1, effort: 2.2, room: -0.8, hot: 7.5, crazy: 9.0,
      blurb: "Black everything, reads three books at once, owns a cat with a Latin name. Deeply loyal until the exact second she is not. You will learn more about yourself than you wanted to." },
    { key: "litigator", cuts: [1.66, 2.05], name: "The Litigator", soft: 1.7, form: -0.3, effort: 2.4, room:  0.3, hot: 7.2, crazy: 5.2,
      blurb: "Sharp, tailored, replies to texts in complete sentences. Will win every argument you start, including the ones you were right about. Astonishingly low drama, astonishingly high standards." },
    { key: "nerd", cuts: [1.67, 2.07], name: "The Nerd", soft: 1.3, form:  0.2, effort: 0.4, room: -0.9, hot: 6.0, crazy: 4.2,
      blurb: "Quick, wry, glasses, opinions about a videogame you have never heard of. Improves by 2 points the moment she gets comfortable. The highest-return pick on the whole board." },
    { key: "girlnextdoor", cuts: [1.68, 2.09], name: "Plain Good Looking", soft: 1.9, form:  0.1, effort: 0.7, room:  0.1, hot: 7.0, crazy: 4.5,
      blurb: "No filter, no fuss, no arc. Looks the same at 7am as she does at a wedding, which is the entire point. Everyone underrates her until they meet her." },
    { key: "baddie", cuts: [1.64, 2.02], name: "The Baddie", soft: 2.0, form:  0.0, effort: 3.0, room:  0.9, hot: 9.3, crazy: 8.3,
      blurb: "Nails, lashes, a phone that never stops. Turns a supermarket run into an event. Costs money, costs sleep, worth it for a defined period you should agree on in advance." },
    { key: "valkyrie", cuts: [1.76, 2.18], name: "The Valkyrie", soft: 1.4, form: -0.9, effort: 1.0, room:  0.7, hot: 6.5, crazy: 7.0,
      blurb: "Substantial, laughs from the chest, could carry you out of a burning building and probably would. Do not start what you cannot finish." },
    { key: "comfort", cuts: [1.61, 2.06], name: "The Comfort Class", soft: 2.8, form:  0.9, effort: 0.8, room:  0.4, hot: 5.5, crazy: 5.5,
      blurb: "Warm, unbothered, feeds people as a love language. The lowest-maintenance partner on this chart by a distance. Your friends will like her more than they like you." }
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

  /* --- archetype: nearest neighbour in weighted 4-D space ----------------- */

  /* Height is deliberately NOT an axis here. It is fixed for any one user, so
     including it pinned the archetype to whatever their own height happened to
     be — at 195 cm only four of the eight types were reachable at all, and the
     three answers the user actually chooses barely moved the result. Height
     still drives the target band and the whole rarity calculation, which is
     where it belongs. The type is decided by what they pick. */
  function classify(soft, form, effort, room, hot, crazy) {
    const f = formOf(form).v;
    const r = roomOf(room).v;
    let best = null;
    for (const t of TYPES) {
      const d = Math.sqrt(
        Math.pow((soft   - t.soft)   * 0.90, 2) +
        Math.pow((f      - t.form)   * 1.10, 2) +
        Math.pow((effort - t.effort) * 0.75, 2) +
        Math.pow((r      - t.room)   * 0.85, 2) +
        Math.pow((hot    - t.hot)    * 0.60, 2) +
        Math.pow((crazy  - t.crazy)  * 0.55, 2)
      );
      if (!best || d < best.d) best = { t: t, d: d };
    }
    best.fit = Math.max(31, Math.round(100 * Math.exp(-best.d / 4.2)));

    /* Which of the type's three portraits to show. The cuts on each archetype
       are its distance terciles measured over the whole input space, so the
       three variants come up in even thirds and none is unreachable. */
    best.note = buildNote(best.t, soft, form, effort, room);
    const c = best.t.cuts;
    best.variant = best.d <= c[0] ? 0 : best.d <= c[1] ? 1 : 2;
    best.tier    = VARIANTS[best.variant];
    return best;
  }

  /* The type is the headline; this is the fine print. It reads the user's exact
     build against the archetype's centre, so two people who land on the same
     type but arrived from different builds do not get the identical write-up. */
  function buildNote(t, soft, form, effort, room) {
    const ds = soft - t.soft;
    const df = formOf(form).v - t.form;
    const de = effort - t.effort;
    const dr = roomOf(room).v - t.room;
    const bits = [];
    if (ds <= -1.0) bits.push("firmer than the type usually runs");
    else if (ds >= 1.0) bits.push("softer than the type usually runs");
    else bits.push("dead on the type for build");
    if (df <= -0.7) bits.push("and carrying real muscle under it");
    else if (df >= 0.7) bits.push("and there is nothing but softness underneath");
    let out = bits.join(" ") + ".";
    if (de <= -1.2) out += " She puts in far less work on her appearance than this type normally does.";
    else if (de >= 1.2) out += " And considerably more production than the type calls for.";
    if (dr <= -1.2) out += " Quieter in a room than the archetype suggests.";
    else if (dr >= 1.2) out += " Louder in a room than the archetype suggests.";
    return out;
  }

  const VARIANTS = [
    { key: "textbook",  label: "Textbook",  note: "The pure form of the type. Your answers land almost exactly on the archetype." },
    { key: "variation", label: "Variation", note: "Recognisably the type, but one of your answers pulls her off-spec." },
    { key: "edge",      label: "Edge case", note: "She only just qualifies. Your answers sit at the far edge of this archetype — the next type over was close behind." }
  ];

  /* --- stature: where the target sits in the height distribution ---------- */
  /* Height no longer decides the archetype, so it reports itself directly. */
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

  function rarity(lo, hi, soft, form, effort, room, hot, crazy) {
    const pH  = Math.max(1e-12, ncdf(hi + 0.5, POP.mu, POP.sd) - ncdf(lo - 0.5, POP.mu, POP.sd));
    const pB  = buildP(soft, form);
    const pE  = EFFORT[effort].p;
    const pR  = roomOf(room).p;
    const pHt = Math.max(1e-12, 1 - ncdf(hot - 0.5, HOT.mu, HOT.sd));
    const pCz = Math.max(1e-12, ncdf(crazy + 0.5, CRAZY.mu, CRAZY.sd));

    /* Hot and crazy are correlated in the wild — that is the whole point of the
       diagonal on the chart. Asking for a wide gap has to cost something. */
    const gap  = hot - crazy;
    const corr = gap > 2 ? 1 / (1 + (gap - 2) * 1.8) : 1;

    const p = pH * pB * pE * pR * pHt * pCz * corr;
    return {
      pH: pH, pB: pB, pE: pE, pR: pR, pHt: pHt, pCz: pCz, corr: corr, p: p,
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
    const type  = classify(s.soft, s.form, s.effort, s.room, s.hot, s.crazy);
    const rare  = rarity(lo, hi, s.soft, s.form, s.effort, s.room, s.hot, s.crazy);
    const stature = statureOf(target);
    const weeks = rare.oneIn / 2;                 // two assessed first dates a week
    const years = weeks / 52;
    return {
      ideal: ideal, target: target, lo: lo, hi: hi,
      gap: s.height - target,
      floor: floorFor(s.height),
      soft: softOf(s.soft), form: formOf(s.form),
      effort: effortOf(s.effort), room: roomOf(s.room),
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

  return { POP, RATIO, SOFT, FORM, EFFORT, ROOM, BUILD_P, HOT, CRAZY, TYPES, VARIANTS,
           effortOf, roomOf,
           buildP, softOf, formOf, buildLabel, buildNote,
           ncdf, idealFor, floorFor, applyDelta,
           zoneOf, classify, statureOf, rarity, evaluate, fmt, pct };
})();
