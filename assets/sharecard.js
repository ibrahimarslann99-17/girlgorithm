/* =============================================================================
   GIRLGORITHM — share card
   Renders the exact verdict already on screen (same v object SCREEN.result
   used) onto a 1080x1350 canvas: same portrait, same name, same target
   height, same zone, same rarity. Nothing here is computed independently —
   it only formats numbers evaluate() already produced, so the card can never
   drift from what the page shows.
   ============================================================================= */
window.WZ = window.WZ || {};
WZ.card = (function () {
  const M = () => window.WZ.math;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("image failed: " + src));
      img.src = src;
    });
  }

  /* Same resolve-CSS-color-to-rgb trick app.js uses for the SVG duotone
     filter, kept independent so this file has no load-order dependency on
     app.js's IIFE internals. */
  function resolveColor(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
    const tmp = document.createElement("div");
    tmp.style.color = raw;
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color;
    document.body.removeChild(tmp);
    const m = rgb.match(/[\d.]+/g) || [20, 17, 14];
    return m.slice(0, 3).map(Number);
  }

  /* Pixel-for-pixel the same map as index.html's #duotone SVG filter
     (luma via feColorMatrix's Rec.709 weights, then a 2-stop table lookup
     from shadow to light) — canvas has no drawImage-time filter access to
     an SVG filter chain, so this reproduces it by hand on the pixel data. */
  function duotone(ctx, x, y, w, h, shadow, light) {
    const frame = ctx.getImageData(x, y, w, h);
    const d = frame.data;
    for (let i = 0; i < d.length; i += 4) {
      const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      d[i]     = shadow[0] + (light[0] - shadow[0]) * l;
      d[i + 1] = shadow[1] + (light[1] - shadow[1]) * l;
      d[i + 2] = shadow[2] + (light[2] - shadow[2]) * l;
    }
    ctx.putImageData(frame, x, y);
  }

  function hairline(ctx, x1, y, x2, color, w) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w || 1;
    ctx.beginPath();
    ctx.moveTo(x1, Math.round(y) + 0.5);
    ctx.lineTo(x2, Math.round(y) + 0.5);
    ctx.stroke();
  }

  /* v is the exact object SCREEN.result(v) rendered from — plateNo/totalTypes
     are the two derived values app.js already computes alongside it. No
     value here is re-derived from S; everything is read off v. */
  async function build(v, plateNo, totalTypes) {
    await Promise.all([
      document.fonts.load('600 30px "IBM Plex Mono"'),
      document.fonts.load('400 24px "IBM Plex Mono"'),
      document.fonts.load('600 20px "IBM Plex Mono"'),
      document.fonts.load('600 60px Fraunces'),
      document.fonts.load('italic 500 28px Fraunces'),
      document.fonts.load('600 38px Fraunces')
    ]).catch(() => {});
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }

    const W = 1080, H = 1350, pad = 64;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() || "#EFEAE0";
    const ink   = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim()   || "#14110E";
    const spot  = getComputedStyle(document.documentElement).getPropertyValue("--spot").trim()  || "#B4472C";
    const shadow = resolveColor("--dt-shadow", ink);
    const light  = resolveColor("--dt-light", paper);

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "alphabetic";

    /* masthead */
    ctx.fillStyle = ink;
    ctx.font = '600 30px "IBM Plex Mono"';
    ctx.textAlign = "left";
    ctx.fillText("GIRLGORITHM", pad, 92);
    ctx.font = '400 24px "IBM Plex Mono"';
    ctx.fillStyle = "rgba(20,17,14,.7)";
    ctx.textAlign = "right";
    ctx.fillText("PLATE Nº " + plateNo + " / " + String(totalTypes).padStart(2, "0"), W - pad, 92);
    ctx.textAlign = "left";
    hairline(ctx, pad, 114, W - pad, ink, 2);

    /* portrait — same key + variant as the on-screen slot(), so the image is
       identical to the one the user is looking at */
    const key = v.type.t.key;
    const variant = v.type.variant;
    const entry = window.WZ_IMG && window.WZ_IMG[key];
    const src = Array.isArray(entry) ? entry[variant] : entry;

    const frameX = pad, frameY = 150, frameW = W - pad * 2, frameH = 640;
    if (src) {
      try {
        const img = await loadImage(src);
        const scale = Math.max(frameW / img.width, frameH / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        const dx = frameX + (frameW - dw) / 2, dy = frameY + (frameH - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(frameX, frameY, frameW, frameH);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        duotone(ctx, frameX, frameY, frameW, frameH, shadow, light);
      } catch (e) {
        ctx.fillStyle = "rgba(20,17,14,.06)";
        ctx.fillRect(frameX, frameY, frameW, frameH);
      }
    } else {
      ctx.fillStyle = "rgba(20,17,14,.06)";
      ctx.fillRect(frameX, frameY, frameW, frameH);
    }
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(frameX + 1.5, frameY + 1.5, frameW - 3, frameH - 3);

    let y = frameY + frameH + 68;

    /* type name + tier — verbatim v.type.t.name / v.type.tier.label */
    ctx.fillStyle = ink;
    ctx.font = '600 60px Fraunces';
    fitText(ctx, v.type.t.name, pad, y, W - pad * 2, 60, '600 __PXpx Fraunces');
    y += 42;
    ctx.font = 'italic 500 28px Fraunces';
    ctx.fillStyle = "rgba(20,17,14,.7)";
    ctx.fillText(v.type.tier.label, pad, y);

    y += 54;
    hairline(ctx, pad, y, W - pad, "rgba(20,17,14,.2)", 1);
    y += 58;

    /* the three numbers that matter — read straight off v, same source as
       the on-page spec cards (v.target, v.zone.name, v.rare.oneIn) */
    const stats = [
      { k: "TARGET HEIGHT", val: v.target + " cm" },
      { k: "MATRIX ZONE", val: v.zone.name },
      { k: "RARITY", val: "1 in " + M().fmt(v.rare.oneIn) }
    ];
    const colW = (W - pad * 2) / 3;
    stats.forEach((s, i) => {
      const x = pad + i * colW;
      ctx.fillStyle = spot;
      ctx.font = '600 19px "IBM Plex Mono"';
      ctx.fillText(s.k, x, y);
      ctx.fillStyle = ink;
      ctx.font = '600 36px Fraunces';
      fitText(ctx, s.val, x, y + 46, colW - 20, 36, '600 __PXpx Fraunces');
    });

    y += 118;
    hairline(ctx, pad, y, W - pad, "rgba(20,17,14,.2)", 1);

    ctx.fillStyle = "rgba(20,17,14,.55)";
    ctx.font = '400 22px "IBM Plex Mono"';
    ctx.textAlign = "left";
    ctx.fillText("girlgorithm.app", pad, H - pad + 6);
    ctx.textAlign = "right";
    ctx.fillText("17 QUESTIONS · REAL ARITHMETIC", W - pad, H - pad + 6);
    ctx.textAlign = "left";

    return canvas;
  }

  /* Shrinks the font-size token in `tpl` until `text` fits `maxWidth`, so a
     long archetype name or a wide "1 in 4,300,000" never overflows the card
     off the edge — it steps the size down instead of clipping. */
  function fitText(ctx, text, x, y, maxWidth, startPx, tpl) {
    let px = startPx;
    while (px > 16) {
      ctx.font = tpl.replace("__PX", px);
      if (ctx.measureText(text).width <= maxWidth) break;
      px -= 2;
    }
    ctx.fillText(text, x, y);
  }

  function toBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
  }

  return { build, toBlob };
})();
