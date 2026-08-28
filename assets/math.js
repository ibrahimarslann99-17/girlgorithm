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

  /* Prevalence of each build in the reference population. */
  const BODY = {
    oak:    { key: "oak",    idx: 0, p: 0.22, label: "Slim / straight-line", hug: "like hugging the trunk of an oak tree" },
    pillow: { key: "pillow", idx: 1, p: 0.46, label: "Curvy / soft",         hug: "like hugging your cotton pillow" },
    jug:    { key: "jug",    idx: 2, p: 0.18, label: "Heavy-set",            hug: "like hugging a 19-litre water jug" }
  };

  /* Hotness and craziness, as distributed in the wild. */
  const HOT   = { mu: 5.0, sd: 1.6 };
  const CRAZY = { mu: 6.4, sd: 1.5 };

  /* Archetypes, as points in 3-D spec space: build index, hot, crazy — the
     three things the user actually chooses. Classification is nearest
     neighbour, never a dice roll. `cuts` are each type's distance terciles
     measured over all 147 reachable answer combinations, so its three
     portraits come up in even thirds. */
  const TYPES = [
    { key: "model", cuts: [0.77, 1.09], name: "The Model", body: 0, hot: 9.2, crazy: 7.5,
      blurb: "Built like a coat hanger, photographs better than she looks and looks incredible. Eats one salad in public and a whole cake at home. Will out-earn you by 25 and remind you of it kindly." },
    { key: "gothic", cuts: [1.05, 1.60], name: "The Gothic", body: 0, hot: 7.5, crazy: 9.0,
      blurb: "Black everything, reads three books at once, owns a cat with a Latin name. Deeply loyal until the exact second she is not. You will learn more about yourself than you wanted to." },
    { key: "litigator", cuts: [1.00, 1.65], name: "The Litigator", body: 1, hot: 7.2, crazy: 5.2,
      blurb: "Sharp, tailored, replies to texts in complete sentences. Will win every argument you start, including the ones you were right about. Astonishingly low drama, astonishingly high standards." },
    { key: "nerd", cuts: [0.74, 1.28], name: "The Nerd", body: 0, hot: 6.0, crazy: 4.2,
      blurb: "Quick, wry, glasses, opinions about a videogame you have never heard of. Improves by 2 points the moment she gets comfortable. The highest-return pick on the whole board." },
    { key: "girlnextdoor", cuts: [0.66, 1.23], name: "Plain Good Looking", body: 1, hot: 7.0, crazy: 4.5,
      blurb: "No filter, no fuss, no arc. Looks the same at 7am as she does at a wedding, which is the entire point. Everyone underrates her until they meet her." },
    { key: "baddie", cuts: [0.87, 1.66], name: "The Baddie", body: 1, hot: 9.3, crazy: 8.3,
      blurb: "Nails, lashes, a phone that never stops. Turns a supermarket run into an event. Costs money, costs sleep, worth it for a defined period you should agree on in advance." },
    { key: "valkyrie", cuts: [1.14, 1.68], name: "The Valkyrie", body: 2, hot: 6.5, crazy: 7.0,
      blurb: "Substantial, laughs from the chest, could carry you out of a burning building and probably would. Do not start what you cannot finish." },
    { key: "comfort", cuts: [0.88, 1.22], name: "The Comfort Class", body: 2, hot: 5.5, crazy: 5.5,
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
  function classify(bodyKey, hot, crazy) {
    const b = BODY[bodyKey].idx;
    let best = null;
    for (const t of TYPES) {
      const d = Math.sqrt(
        Math.pow((b     - t.body)  * 1.60, 2) +
        Math.pow((hot   - t.hot)   * 0.60, 2) +
        Math.pow((crazy - t.crazy) * 0.55, 2)
      );
      if (!best || d < best.d) best = { t: t, d: d };
    }
    best.fit = Math.max(31, Math.round(100 * Math.exp(-best.d / 1.35)));

    /* Which of the type's three portraits to show. The cuts on each archetype
       are its distance terciles measured over the whole input space, so the
       three variants come up in even thirds and none is unreachable. */
    const c = best.t.cuts;
    best.variant = best.d <= c[0] ? 0 : best.d <= c[1] ? 1 : 2;
    best.tier    = VARIANTS[best.variant];
    return best;
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

  function rarity(lo, hi, bodyKey, hot, crazy) {
    const pH  = Math.max(1e-12, ncdf(hi + 0.5, POP.mu, POP.sd) - ncdf(lo - 0.5, POP.mu, POP.sd));
    const pB  = BODY[bodyKey].p;
    const pHt = Math.max(1e-12, 1 - ncdf(hot - 0.5, HOT.mu, HOT.sd));
    const pCz = Math.max(1e-12, ncdf(crazy + 0.5, CRAZY.mu, CRAZY.sd));

    /* Hot and crazy are correlated in the wild — that is the whole point of the
       diagonal on the chart. Asking for a wide gap has to cost something. */
    const gap  = hot - crazy;
    const corr = gap > 2 ? 1 / (1 + (gap - 2) * 1.8) : 1;

    const p = pH * pB * pHt * pCz * corr;
    return {
      pH: pH, pB: pB, pHt: pHt, pCz: pCz, corr: corr, p: p,
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
    const type  = classify(s.body, s.hot, s.crazy);
    const rare  = rarity(lo, hi, s.body, s.hot, s.crazy);
    const stature = statureOf(target);
    const weeks = rare.oneIn / 2;                 // two assessed first dates a week
    const years = weeks / 52;
    return {
      ideal: ideal, target: target, lo: lo, hi: hi,
      gap: s.height - target,
      floor: floorFor(s.height),
      body: BODY[s.body],
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

  return { POP, RATIO, BODY, HOT, CRAZY, TYPES, VARIANTS,
           ncdf, idealFor, floorFor, applyDelta,
           zoneOf, classify, statureOf, rarity, evaluate, fmt, pct };
})();
