#!/usr/bin/env node
/* Headless walk-through of the built artifact to grab screenshots of the new
   field-guide design at a few key screens: welcome, a question, an
   interstitial, and the result plate. Dev tool only — not shipped. */
"use strict";
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
  const file = "file://" + path.resolve(__dirname, "../dist/artifact.html");
  await page.goto(file);
  await page.screenshot({ path: "/tmp/shot_01_welcome.png", fullPage: true });

  await page.click("#scared");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "/tmp/shot_02_interstitial.png", fullPage: true });
  await page.click(".veil-inner button");
  await page.waitForTimeout(150);

  await page.fill("#h", "185");
  await page.click("#next");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "/tmp/shot_03_reveal.png", fullPage: true });
  await page.click("#n");
  await page.waitForTimeout(150);
  await page.screenshot({ path: "/tmp/shot_04_question.png", fullPage: true });

  for (let i = 0; i < 20; i++) {
    const hasDossier = await page.$(".dossier");
    if (hasDossier) break;
    const veil = await page.$(".veil-inner button");
    if (veil) { await veil.click(); await page.waitForTimeout(100); continue; }
    const dataBtn = await page.$(".stack button[data-v]");
    if (dataBtn) { await dataBtn.click(); await page.waitForTimeout(100); continue; }
    const nextBtn = await page.$("#n");
    if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(100); continue; }
    break;
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/tmp/shot_05_result.png", fullPage: true });

  await browser.close();
  console.log("done");
})().catch(e => { console.error(e); process.exit(1); });
