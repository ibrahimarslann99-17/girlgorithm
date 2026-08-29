#!/usr/bin/env node
/* =============================================================================
   compute_cuts.js — recalibrate each archetype's variant cuts against a
   REALISTIC population of answers, not a uniform grid.

   The bug this fixes: the old cuts were distance terciles computed over every
   reachable answer combination weighted EQUALLY (7,056 uniform combos). Real
   users don't answer uniformly at random — they cluster in the high-probability
   region of every axis (BUILD_P, EFFORT.p, ROOM.p are already in math.js for
   exactly this reason; hot/crazy already have modelled population curves too).
   Uniform enumeration massively overweights rare/extreme combinations, which
   inflates the *spread* of the reference distance distribution far beyond what
   real answers ever produce — so real users' distances almost always land
   below cuts[0] and everyone gets the textbook portrait. Five independent
   testers, zero variant-2/3 hits, confirms it.

   Fix: Monte Carlo sample answers from the SAME weights the app already
   documents (BUILD_P / EFFORT.p / ROOM.p / HOT / CRAZY), plus a reasonable
   model for height + the override delta (not otherwise weighted in math.js),
   run each sample through the real classify() distance formula, and take each
   type's distance terciles only among the samples actually assigned to it —
   the same semantics the old cuts were supposed to have, just honestly
   weighted this time.

   node scripts/compute_cuts.js
   ============================================================================= */
"use strict";
global.window = global;
require("../assets/math.js");
const M = global.WZ.math;

const N = 4_000_000;

/* ---- weighted categorical sampler ---- */
function sampler(items, pOf) {
  const weights = items.map(pOf);
  const total = weights.reduce((a, b) => a + b, 0);
  const cum = [];
  let acc = 0;
  for (const w of weights) { acc += w / total; cum.push(acc); }
  return () => {
    const r = Math.random();
    for (let i = 0; i < cum.length; i++) if (r <= cum[i]) return items[i];
    return items[items.length - 1];
  };
}

/* soft+form jointly, straight off BUILD_P — the exact table math.js uses. */
const buildPairs = [];
for (let soft = 0; soft <= 3; soft++) {
  for (const form of ["muscle", "neutral", "fat"]) {
    buildPairs.push({ soft, form, p: M.buildP(soft, form) });
  }
}
const drawBuild = sampler(buildPairs, x => x.p);

const drawEffort = sampler(M.EFFORT, x => x.p);
const drawRoom = sampler(M.ROOM, x => x.p);

/* Height override: math.js doesn't weight this (it's per-user, not a modelled
   population axis), so this is the one assumption in the script that isn't
   read straight off an existing constant. Most people take the model's
   number; small tweaks beat large ones; asking for shorter is slightly more
   common than asking for taller, matching the app's own framing of the joke. */
const deltaOptions = [
  { d: 0,   p: 0.50 },
  { d: -5,  p: 0.15 },
  { d: 5,   p: 0.10 },
  { d: -15, p: 0.08 },
  { d: 10,  p: 0.07 },
  { d: -25, p: 0.05 },
  { d: 15,  p: 0.05 },
];
const drawDelta = sampler(deltaOptions, x => x.p);

/* Height itself: adult male, ~178cm/sd7 is a reasonable real-world estimate.
   Only feeds heightZ, which classify() already weights lowest of all seven
   axes, so this assumption matters least of anything in this script. */
function gaussian(mu, sd) {
  const u1 = Math.random() || 1e-12, u2 = Math.random();
  return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
function drawHeight() {
  return Math.max(150, Math.min(210, Math.round(gaussian(178, 7))));
}

/* Hot/crazy: sample from the exact curves math.js already models the
   population with, rounded to the integer slider and clamped to its range. */
function drawSlider(dist) {
  return Math.max(4, Math.min(10, Math.round(gaussian(dist.mu, dist.sd))));
}

/* ---- run ---- */
const byType = {};
for (const t of M.TYPES) byType[t.key] = [];

for (let i = 0; i < N; i++) {
  const b = drawBuild();
  const formKey = b.form;
  const effort = drawEffort().idx;
  const room = drawRoom().key;
  const height = drawHeight();
  const ideal = M.idealFor(height);
  const delta = drawDelta().d;
  const target = delta === 0 ? ideal : M.applyDelta(height, ideal, delta);
  const heightZ = M.heightZFor(target);
  const hot = drawSlider(M.HOT);
  const crazy = drawSlider(M.CRAZY);

  const best = M.classify(b.soft, formKey, effort, room, heightZ, hot, crazy);
  byType[best.t.key].push(best.d);
}

console.log("type".padEnd(12), "n".padStart(9), "old cuts".padStart(16), "new cuts".padStart(16), "share".padStart(8));
const newCuts = {};
for (const t of M.TYPES) {
  const arr = byType[t.key].sort((a, b) => a - b);
  const n = arr.length;
  const q = p => arr[Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))];
  const c0 = q(1 / 3), c1 = q(2 / 3);
  newCuts[t.key] = [Number(c0.toFixed(3)), Number(c1.toFixed(3))];
  console.log(
    t.key.padEnd(12),
    String(n).padStart(9),
    ("[" + t.cuts.join(",") + "]").padStart(16),
    ("[" + newCuts[t.key].join(",") + "]").padStart(16),
    ((100 * n / N).toFixed(1) + "%").padStart(8)
  );
}

console.log("\n--- paste into TYPES in assets/math.js ---\n");
for (const t of M.TYPES) {
  console.log(t.key + ": " + JSON.stringify(newCuts[t.key]));
}
