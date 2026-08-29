#!/usr/bin/env node
/* =============================================================================
   build.js — squash the site into one self-contained file.

     node build.js

   Writes dist/artifact.html: every stylesheet and script inlined, every image
   in assets/img/ turned into a data: URI. That file is what gets published as a
   Claude artifact, where external requests are blocked. The Google Fonts link
   is left alone — it is the one host artifacts still allow.

   One source of truth. Edit assets/, run this, republish. Never hand-edit
   dist/artifact.html: it is overwritten every run.

   No dependencies. Node 14+.
   ============================================================================= */
"use strict";
const fs   = require("fs");
const path = require("path");

const ROOT = __dirname;
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");

const MIME = {
  ".png": "image/png",  ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif",  ".webp": "image/webp", ".svg": "image/svg+xml",
  ".avif": "image/avif"
};

/* ---------- 1. swap every path in images.js for a data: URI ----------------- */
/* Works on both shapes in that file — a bare string and an array of three. */

function inlineImages(js) {
  let count = 0, missing = 0;

  const out = js.replace(/"([^"\\]*\.(?:png|jpe?g|gif|webp|svg|avif))"/gi, (whole, rel) => {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.warn("  ! " + rel + " — listed in images.js but not on disk, left as a placeholder");
      missing++;
      return '""';
    }
    const buf = fs.readFileSync(abs);
    const uri = "data:" + (MIME[path.extname(rel).toLowerCase()] || "application/octet-stream") +
                ";base64," + buf.toString("base64");
    count++;
    console.log("  + " + rel + "  (" + (buf.length / 1024).toFixed(0) + " KB)");
    return JSON.stringify(uri);
  });

  // Flag renders that were generated but never wired up.
  const dir = path.join(ROOT, "assets", "img");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!MIME[path.extname(f).toLowerCase()]) continue;
      if (js.indexOf(f) === -1) console.warn("  ? assets/img/" + f + " is not referenced in images.js");
    }
  }
  return { js: out, count, missing };
}

/* ---------- 2. assemble ---------------------------------------------------- */

console.log("Inlining images…");
const img = inlineImages(read("images.js"));

const css = read("assets/style.css");
const js  = [
  read("config.js"),
  img.js,                    // images.js, with every path now a data: URI
  read("assets/icons.js"),
  read("assets/math.js"),
  read("assets/db.js"),
  read("assets/app.js")
].join("\n");

let html = read("index.html");

// Artifacts supply their own doctype/head/body wrapper, so strip ours.
html = html
  .replace(/<!doctype html>\s*/i, "")
  .replace(/<\/?html[^>]*>\s*/gi, "")
  .replace(/<\/?head[^>]*>\s*/gi, "")
  .replace(/<\/?body[^>]*>\s*/gi, "")
  .replace(/<meta[^>]*charset[^>]*>\s*/gi, "")
  .replace(/<meta[^>]*viewport[^>]*>\s*/gi, "")
  // the favicon link holds an inline SVG with its own ">" chars — kill the line
  .replace(/^[ \t]*<link rel="icon".*$\n?/gim, "")
  .replace(/<link[^>]*href=["']assets\/style\.css["'][^>]*>/i, "<style>\n" + css + "\n</style>")
  .replace(/<script src=["'](config\.js|images\.js|assets\/[^"']+)["']><\/script>\s*/gi, "")
  .replace(/<\/div>\s*$/, "</div>")          // keep trailing markup intact
  .trimEnd() + "\n\n<script>\n" + js + "\n</script>\n";

fs.mkdirSync(path.join(ROOT, "dist"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "dist", "artifact.html"), html);

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log("\ndist/artifact.html — " + kb + " KB, " + img.count + " image" + (img.count === 1 ? "" : "s") +
            " inlined" + (img.missing ? ", " + img.missing + " still missing" : ""));
if (Buffer.byteLength(html) > 15 * 1024 * 1024) {
  console.warn("WARNING: over 15 MB. Artifacts cap at 16 MB — compress the images in assets/img/.");
}
