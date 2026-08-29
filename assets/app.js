/* =============================================================================
   GIRLGORITHM — flow and rendering
   ============================================================================= */
(function () {
  "use strict";

  const M  = WZ.math;
  const DB = WZ.db;

  /* Image paths live in images.js — the one file to edit when renders arrive. */
  const IMG = window.WZ_IMG || {};

  /* --- state ------------------------------------------------------------- */

  const BLANK = {
    height: null, obese: null, looks: null,
    adjust: null, delta: 0, soft: null, form: null, effort: null, room: null,
    hot: 8, crazy: 6, flags: []
  };
  let S = Object.assign({}, BLANK, { flags: [] });

  const FLAG_TEXT = {
    STANDING:    "Applicant declared obese. Target spec issued anyway. Enforcement is on you.",
    ORIENTATION: "Applicant self-rated 'very handsome'. Flag retained on file. No further action.",
    WATCHLIST:   "Applicant requested a 25 cm additional height reduction. Referred. Spec issued with a hard floor."
  };
  const addFlag = k => { if (!S.flags.some(f => f[0] === k)) S.flags.push([k, FLAG_TEXT[k]]); };

  const STEPS = ["height","reveal","obese","looks","adjust","soft","form","effort","room","hot","crazy","result"];
  let stepIdx = -1;

  const stage  = document.getElementById("stage");
  const rail   = document.getElementById("rail");
  const fileNo = document.getElementById("fileno");
  rail.innerHTML = STEPS.map(() => "<i></i>").join("");

  function paintRail() {
    [...rail.children].forEach((el, i) => {
      el.className = i < stepIdx ? "done" : i === stepIdx ? "now" : "";
    });
  }
  function go(name) {
    stepIdx = STEPS.indexOf(name);
    paintRail();
    SCREEN[name]();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const el = html => { stage.innerHTML = html; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[c]));

  /* slot("cops") for a single image, slot("model", 2) for an archetype variant */
  function slot(key, label, cls, variant) {
    const entry = IMG[key];
    const src = Array.isArray(entry) ? entry[variant || 0] : entry;
    const k = "slot " + (cls || "");
    return src
      ? '<div class="' + k + ' filled"><img src="' + src + '" alt="' + esc(label) + '" decoding="async"></div>'
      : '<div class="' + k + '">Image slot &mdash; ' + esc(label) + "</div>";
  }

  /* --- interstitial ------------------------------------------------------ */

  let veilNode = null;
  function say(o) {
    close();
    const v = document.createElement("div");
    v.className = "veil";
    v.innerHTML =
      '<div class="veil-inner ' + (o.tone || "") + '" role="dialog" aria-modal="true" aria-label="' + esc(o.title) + '">' +
        "<h3>" + o.title + "</h3>" +
        (o.img ? slot(o.img, o.imgLabel || o.title) : "") +
        "<p>" + o.body + "</p>" +
        '<div class="stack" id="veilbtns"></div>' +
      "</div>";
    document.body.appendChild(v);
    veilNode = v;
    const holder = v.querySelector("#veilbtns");
    (o.buttons || [{ label: "Fine. Continue.", fn: close }]).forEach(b => {
      const btn = document.createElement("button");
      btn.className = b.style || "primary";
      btn.innerHTML = b.label;
      btn.onclick = () => { close(); if (b.fn) b.fn(); };
      holder.appendChild(btn);
    });
    holder.firstChild.focus();
  }
  function close() { if (veilNode) { veilNode.remove(); veilNode = null; } }

  /* --- police siren: oscillator sweep, no audio file ---------------------- */

  function siren(seconds) {
    const node = document.getElementById("siren");
    node.classList.add("on");
    let ctx = null;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = "sawtooth";
      const t0 = ctx.currentTime;
      for (let i = 0; i < seconds * 2; i++) {
        osc.frequency.setValueAtTime(720, t0 + i * 0.5);
        osc.frequency.setValueAtTime(980, t0 + i * 0.5 + 0.25);
      }
      g.gain.setValueAtTime(0.05, t0);
      g.gain.setTargetAtTime(0.0001, t0 + seconds - 0.3, 0.1);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + seconds);
    } catch (e) { /* audio blocked — the flashing carries it */ }
    setTimeout(() => {
      node.classList.remove("on");
      if (ctx) { try { ctx.close(); } catch (e) {} }
    }, seconds * 1000);
  }

  /* =========================================================================
     SCREENS
     ========================================================================= */
  const SCREEN = {};

  function welcome() {
    stepIdx = -1; paintRail();
    fileNo.innerHTML = "FILE&nbsp;#0000";
    el(
      '<div class="card">' +
        '<p class="eyebrow">Intake &mdash; Case <b>OPEN</b></p>' +
        '<h1 class="big">You have been picking wrong. We can prove it.</h1>' +
        '<p class="sub">Eleven questions. Real arithmetic behind every one of them &mdash; a height ratio, six normal distributions, and the Hot Crazy Matrix, applied without mercy. At the end you get a written spec for the woman you should actually be looking for, and an honest estimate of how many exist.</p>' +
        '<p class="sub"><em>No result here is random.</em> Same answers, same verdict, every time. That is the part that will annoy you.</p>' +
        '<div class="row">' +
          '<button class="primary" style="flex:1;min-width:180px" id="begin">Let\'s begin</button>' +
          '<button class="ghost" style="flex:1;min-width:150px" id="scared">I\'m scared</button>' +
        "</div>" +
      "</div>"
    );
    document.getElementById("begin").onclick = () => go("height");
    document.getElementById("scared").onclick = () => say({
      title: "Get your shit together",
      img: "scared", imgLabel: "get your shit together",
      body: "It's a quiz. It has eleven questions and no consequences. You have survived worse things than a chart. <strong>Stand up straight and answer the questions.</strong>",
      buttons: [
        { label: "Got my shit together", fn: () => go("height") },
        { label: "Still scared, honestly", style: "ghost", fn: welcome }
      ]
    });
  }

  /* --- 01 height --------------------------------------------------------- */
  SCREEN.height = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 01 &mdash; Baseline measurement</p>' +
        '<h2 class="q">How tall are you?</h2>' +
        '<p class="sub">Barefoot. In centimetres. The entire model hangs off this one number, so do not do the thing where you add four.</p>' +
        '<div class="measure"><input id="h" type="number" inputmode="numeric" placeholder="185" min="120" max="240" autocomplete="off"><span class="unit">CM</span></div>' +
        '<p class="err" id="he"></p>' +
        '<button class="primary" id="next" style="width:100%">Lock it in</button>' +
      "</div>"
    );
    const inp = document.getElementById("h");
    inp.focus();
    const submit = () => {
      const v = parseFloat(inp.value);
      if (!v || v < 120 || v > 240) {
        document.getElementById("he").textContent = "ERROR — enter a real height between 120 and 240 cm.";
        return;
      }
      S.height = Math.round(v);
      fileNo.innerHTML = "FILE&nbsp;#" + String(S.height).padStart(4, "0");
      go("reveal");
    };
    document.getElementById("next").onclick = submit;
    inp.onkeydown = e => { if (e.key === "Enter") submit(); };
  };

  /* --- 02 the reveal ----------------------------------------------------- */
  SCREEN.reveal = function () {
    const ideal = M.idealFor(S.height);
    el(
      '<div class="card">' +
        '<p class="eyebrow">Result 01 &mdash; Optimum partner height</p>' +
        '<h2 class="q">Here is your number.</h2>' +
        '<div class="readout">' + S.height + " cm &divide; 1.09 =" +
          '<span class="huge">' + ideal + " cm</span>" +
          "Working band <b>" + (ideal - 3) + "&ndash;" + (ideal + 3) + " cm</b><br>" +
          "Height gap <b>" + (S.height - ideal) + " cm</b><br>" +
          "Hard floor <b>" + M.floorFor(S.height) + " cm</b> &mdash; below this, daily friction" +
        "</div>" +
        '<p class="sub">Men\'s stated preference sits at roughly <em>1.09&times;</em> their partner\'s height, which lands the gap near 15 cm. That number is not aesthetic, it is ergonomic: at 15 cm the neck angle when kissing is neutral, her head sits on your chest when hugging, and your walking stride matches. Add a 7 cm heel and the gap drops to 8 &mdash; still reads as "she\'s tall", still nothing strained. It is the one figure that works flat and in heels.</p>' +
        '<button class="primary" id="n" style="width:100%">Understood. Next.</button>' +
      "</div>"
    );
    document.getElementById("n").onclick = () => go("obese");
  };

  /* --- 03 obese ---------------------------------------------------------- */
  SCREEN.obese = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 02 &mdash; Standing check</p>' +
        '<h2 class="q">Are you obese?</h2>' +
        '<p class="sub">Not "big-boned". Not "it\'s winter". The actual question.</p>' +
        '<div class="stack">' +
          '<button data-v="yes">Yes<span class="hint">Honest answer</span></button>' +
          '<button data-v="no">No<span class="hint">Also possibly honest</span></button>' +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.obese = b.dataset.v === "yes";
      if (!S.obese) return go("looks");
      addFlag("STANDING");
      say({
        title: "Then lose the weight, bro",
        img: "obese", imgLabel: "lose the weight bro", tone: "warn",
        body: "You are about to spend nine questions specifying a woman who is not looking for an obese man. <strong>If you're not looking for an obese partner, you don't get to be one.</strong> The chart is symmetrical. It is the only fair thing about it.",
        buttons: [{ label: "Fair. Continue.", fn: () => go("looks") }]
      });
    });
  };

  /* --- 04 self-image ----------------------------------------------------- */
  SCREEN.looks = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 03 &mdash; Self-assessment</p>' +
        '<h2 class="q">How would you describe yourself?</h2>' +
        '<p class="sub">Your friends already have an answer. This is just to see whether it matches yours.</p>' +
        '<div class="stack">' +
          '<button data-v="ugly">Ugly as hell<span class="hint">Brutal, but self-aware</span></button>' +
          '<button data-v="normal">Normal dude<span class="hint">The statistically correct answer</span></button>' +
          '<button data-v="handsome">Very handsome<span class="hint">Careful</span></button>' +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.looks = b.dataset.v;
      if (S.looks === "ugly") {
        say({
          title: "Which spell did he use?",
          img: "ugly", imgLabel: "which spell did he use",
          body: "Don't worry about it. Statistically you're going to do very well in life, and one day you'll walk into a room with a beautiful woman on your arm and every single person there will silently ask themselves the same question: <strong>which spell did he use?</strong> Keep building. The spell is a portfolio.",
          buttons: [{ label: "Casting it now", fn: () => go("adjust") }]
        });
      } else if (S.looks === "handsome") {
        addFlag("ORIENTATION");
        say({
          title: "Why are you gay?",
          img: "gay", imgLabel: "why are you gay meme",
          body: "That's not an insult, it's a question. You typed it yourself. <strong>Why are you gay?</strong>",
          buttons: [{ label: "I'm not, continue", fn: homoPitch }]
        });
      } else go("adjust");
    });
  };

  function homoPitch() {
    say({
      title: "Maybe try FindMeAHomo",
      img: "homo", imgLabel: "FindMeAHomo app listing",
      body: "This calculator is optimised for men looking for women. Based on your last answer we think you'd get better results on <strong>FindMeAHomo</strong> &mdash; 4.8 stars, 12 million downloads, extremely good UI. Do you want to keep going here instead?",
      buttons: [
        { label: "Yes, keep going here", fn: () => say({
            title: "Seriously dude. Why are you gay?",
            img: "gay2", imgLabel: "seriously dude why are you gay",
            body: "We gave you an exit. You didn't take it. That's fine &mdash; but we're writing it down. <strong>Proceeding with the heterosexual model under protest.</strong>",
            buttons: [{ label: "Proceed under protest", fn: () => go("adjust") }]
          })
        },
        { label: "Download FindMeAHomo", style: "ghost", fn: () => say({
            title: "Not a real app",
            body: "It doesn't exist. You have to finish the quiz like everybody else.",
            buttons: [{ label: "Damn. Continue.", fn: () => go("adjust") }]
          })
        }
      ]
    });
  }

  /* --- 05 override ------------------------------------------------------- */
  SCREEN.adjust = function () {
    const ideal = M.idealFor(S.height);
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 04 &mdash; Manual override</p>' +
        '<h2 class="q">You know your number. Want to argue with it?</h2>' +
        '<div class="readout">Model output <b>' + ideal + " cm</b> &mdash; a " + (S.height - ideal) + " cm gap</div>" +
        '<div class="stack">' +
          '<button data-v="fine">This is fine<span class="hint">The correct answer. Skips ahead.</span></button>' +
          '<button data-v="short">I want her shorter<span class="hint">Widen the gap</span></button>' +
          '<button data-v="tall">I want her taller<span class="hint">Close the gap</span></button>' +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.adjust = b.dataset.v;
      if (S.adjust === "fine") { S.delta = 0; return go("soft"); }
      if (S.adjust === "tall") {
        return say({
          title: "Got some complexes there?",
          img: "complex", imgLabel: "got some complexes there champ",
          body: "You have a mathematically optimal answer in front of you and your instinct is to close the gap. <strong>Nobody's judging.</strong> Everyone's judging. How much taller?",
          buttons: [
            { label: "+5 cm &mdash; barely",     fn: () => setDelta(5) },
            { label: "+10 cm &mdash; noticeably", style: "ghost", fn: () => setDelta(10) },
            { label: "+15 cm &mdash; eye to eye", style: "ghost", fn: () => setDelta(15) }
          ]
        });
      }
      const gap = S.height - ideal;
      el(
        '<div class="card">' +
          '<p class="eyebrow">Question 04b &mdash; Override magnitude</p>' +
          '<h2 class="q">How much shorter?</h2>' +
          '<p class="sub">Current gap: <em>' + gap + ' cm</em>. Choose carefully.</p>' +
          '<div class="stack">' +
            '<button data-d="-5">A little &mdash; 5 cm shorter<span class="hint">Gap becomes ' + (gap + 5) + ' cm</span></button>' +
            '<button data-d="-15">Noticeably &mdash; 15 cm shorter<span class="hint">Gap becomes ' + (gap + 15) + ' cm</span></button>' +
            '<button data-d="-25">A lot &mdash; 25 cm shorter<span class="hint">Gap becomes ' + (gap + 25) + ' cm</span></button>' +
          "</div>" +
        "</div>"
      );
      stage.querySelectorAll("button").forEach(x => x.onclick = () => {
        const d = parseInt(x.dataset.d, 10);
        if (d !== -25) return setDelta(d);
        siren(5);
        addFlag("WATCHLIST");
        say({
          title: "Pedo detected. Calling the cops.",
          img: "cops", imgLabel: "pedo detected calling the cops", tone: "cop",
          body: "A 25 cm cut on top of a " + gap + " cm gap puts your target at <strong>" + (ideal - 25) +
                " cm</strong>. That is not a preference, that is a search warrant. Officers have been dispatched. " +
                "<strong>The floor has been reset to " + M.floorFor(S.height) + " cm and your file is flagged.</strong>",
          buttons: [{ label: "I can explain", fn: () => setDelta(-25) }]
        });
      });
    });
  };
  function setDelta(d) { S.delta = d; go("soft"); }

  /* --- 06 build, axis one: how much give ---------------------------------- */
  SCREEN.soft = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 05 &mdash; Build, first axis</p>' +
        '<h2 class="q">When you hug her, how much give is there?</h2>' +
        '<p class="sub">This is the most honest question on the form, because nobody has a socially acceptable answer prepared for it. Answer before you think about it.</p>' +
        '<div class="stack">' +
          M.SOFT.map(function (o) {
            return '<button data-v="' + o.idx + '">' +
              o.hug.charAt(0).toUpperCase() + o.hug.slice(1) +
              '<span class="hint">' + o.label + "</span></button>";
          }).join("") +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.soft = parseInt(b.dataset.v, 10); go("form");
    });
  };

  /* --- 06b build, axis two: what is underneath ---------------------------- */
  SCREEN.form = function () {
    const hug = M.softOf(S.soft).hug;
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 06 &mdash; Build, second axis</p>' +
        '<h2 class="q">And underneath that &mdash; what is doing the work?</h2>' +
        '<p class="sub">You said <em>' + hug + '</em>. Two women can feel identical in a hug and be built completely differently. Softness is one axis; this is the other, and the old version of this quiz collapsed them into one, which is why everybody got the same answer.</p>' +
        '<div class="stack">' +
          '<button data-v="muscle">Muscle<span class="hint">She trains. It is load-bearing.</span></button>' +
          '<button data-v="neutral">Nothing in particular<span class="hint">No engine under it either way. She just is.</span></button>' +
          '<button data-v="fat">More of the same<span class="hint">Softness all the way down. No apologies.</span></button>' +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.form = b.dataset.v; go("effort");
    });
  };

  /* --- 07 effort ---------------------------------------------------------- */
  SCREEN.effort = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 07 &mdash; Getting-ready effort</p>' +
        '<h2 class="q">How much work goes into her face and hair before she leaves the house?</h2>' +
        '<p class="sub">Not how good she looks &mdash; how much <em>labour</em> is involved. A bare-faced girl and a full-glam one can be equally good looking; this is the makeup-and-effort axis, the one that actually separates a Clean Girl from a Baddie.</p>' +
        '<div class="stack">' +
          M.EFFORT.map(function (o) {
            return '<button data-v="' + o.idx + '">' + o.label +
              '<span class="hint">' + o.hint + "</span></button>";
          }).join("") +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.effort = parseInt(b.dataset.v, 10); go("room");
    });
  };

  /* --- 08 room ------------------------------------------------------------ */
  SCREEN.room = function () {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 08 &mdash; Temperament</p>' +
        '<h2 class="q">You walk into a party together. Ninety seconds later, where is she?</h2>' +
        '<p class="sub">Not a shyness question &mdash; a gravity one. This single answer splits the Goth from the Baddie and the Nerd from the Comfort Class harder than anything else on the form.</p>' +
        '<div class="stack">' +
          M.ROOM.map(function (o) {
            return '<button data-v="' + o.key + '">' + o.label +
              '<span class="hint">' + o.hint + "</span></button>";
          }).join("") +
        "</div>" +
      "</div>"
    );
    stage.querySelectorAll("button").forEach(b => b.onclick = () => {
      S.room = b.dataset.v; go("hot");
    });
  };

  /* --- 09 / 10 the matrix axes ------------------------------------------- */
  const HOTLBL = {4:"Below the chart's floor",5:"Chart minimum. Barely on the board.",6:"Solid. Grows on people.",7:"Turns heads in a normal bar.",8:"Turns heads in a good bar.",9:"Turns heads in an airport.",10:"You would not approach her."};
  const CZLBL  = {4:"Chart minimum. Suspiciously calm.",5:"Load-bearing amount only.",6:"Normal human volatility.",7:"Interesting. Manageable.",8:"The last safe rung.",9:"Above the danger line.",10:"Actively hazardous."};

  function sliderScreen(o) {
    el(
      '<div class="card">' +
        '<p class="eyebrow">Question 0' + o.n + ' &mdash; Matrix axis</p>' +
        '<h2 class="q">' + o.title + "</h2>" +
        '<p class="sub">' + o.sub + "</p>" +
        '<div class="slider-wrap">' +
          '<div class="slider-top">' +
            '<div class="slider-val" id="sv">' + S[o.key] + "</div>" +
            '<div class="slider-label" id="sl">' + o.labels[S[o.key]] + "</div>" +
          "</div>" +
          '<input type="range" id="sr" min="4" max="10" step="1" value="' + S[o.key] + '" aria-label="' + esc(o.title) + '">' +
          '<div class="ticks"><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span></div>' +
        "</div>" +
        '<p class="sub" style="font-size:15px">' + o.note + "</p>" +
        '<button class="primary" id="n" style="width:100%">Set it</button>' +
      "</div>"
    );
    const sr = document.getElementById("sr");
    sr.oninput = () => {
      S[o.key] = parseInt(sr.value, 10);
      document.getElementById("sv").textContent = S[o.key];
      document.getElementById("sl").textContent = o.labels[S[o.key]];
    };
    document.getElementById("n").onclick = () => go(o.next);
  }

  SCREEN.hot = () => sliderScreen({
    n: 9, key: "hot", labels: HOTLBL, next: "crazy",
    title: "How hot do you want her?",
    sub: "The chart's x-axis. Be greedy here and the arithmetic at the end will hand you the bill.",
    note: "In the reference population hotness sits around 5 with a standard deviation of 1.6. Every point you add above 5 cuts the pool by roughly two thirds."
  });

  SCREEN.crazy = () => sliderScreen({
    n: 10, key: "crazy", labels: CZLBL, next: "result",
    title: "And how much crazy can you take?",
    sub: "The y-axis. Nobody is under 4 &mdash; the chart doesn't even print the numbers. You are choosing a ceiling, not an absence.",
    note: "Population crazy sits near 6.4. Asking for a hot 9 with a crazy 5 is not a preference, it is a search for an exception &mdash; and the model prices exceptions accordingly."
  });

  /* =========================================================================
     THE MATRIX PLOT
     ========================================================================= */
  function matrixSVG(hot, crazy) {
    const W = 520, H = 430, L = 54, R = 22, T = 26, B = 44;
    const x = v => L + (v - 1) / 9 * (W - L - R);
    const y = v => H - B - (v - 4) / 6 * (H - T - B);
    const zones = [
      { x1:1, x2:5,  y1:4,   y2:10,  label:"NO GO ZONE",  fill:"rgba(255,59,92,.07)" },
      { x1:5, x2:10, y1:8.2, y2:10,  label:"DANGER ZONE", fill:"rgba(255,59,92,.13)" },
      { x1:5, x2:8,  y1:4,   y2:8.2, label:"FUN ZONE",    fill:"rgba(255,255,255,.025)" },
      { x1:8, x2:10, y1:7,   y2:8.2, label:"DATE ZONE",   fill:"rgba(116,214,190,.08)" },
      { x1:8, x2:10, y1:5,   y2:7,   label:"WIFE ZONE",   fill:"rgba(116,214,190,.14)" },
      { x1:8, x2:10, y1:4,   y2:5,   label:"UNICORN",     fill:"rgba(255,176,32,.12)" }
    ];
    let s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Hot Crazy Matrix with your position plotted">' +
      '<defs><pattern id="hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
      '<line x1="0" y1="0" x2="0" y2="9" stroke="#FF3B5C" stroke-opacity=".22" stroke-width="1.6"/></pattern></defs>';

    zones.forEach(z => {
      s += '<rect x="' + x(z.x1) + '" y="' + y(z.y2) + '" width="' + (x(z.x2) - x(z.x1)) +
           '" height="' + (y(z.y1) - y(z.y2)) + '" fill="' + z.fill + '" stroke="#45222E" stroke-width="1"/>';
    });
    s += '<rect x="' + x(1) + '" y="' + y(10) + '" width="' + (x(5) - x(1)) +
         '" height="' + (y(4) - y(10)) + '" fill="url(#hatch)"/>';
    zones.forEach(z => {
      const cx = (x(z.x1) + x(z.x2)) / 2, cy = (y(z.y1) + y(z.y2)) / 2;
      s += '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" letter-spacing="1.4" fill="#B49AA2">' + z.label + "</text>";
    });
    s += '<line x1="' + x(1) + '" y1="' + y(4) + '" x2="' + x(10) + '" y2="' + y(10) + '" stroke="#F6EAE5" stroke-width="2.5" stroke-opacity=".8"/>';
    s += '<text x="' + x(6.6) + '" y="' + y(7.9) + '" font-family="JetBrains Mono, monospace" font-size="9.5" letter-spacing="1.6" fill="#F6EAE5" fill-opacity=".65" transform="rotate(-25.5 ' + x(6.6) + " " + y(7.9) + ')">HOT CRAZY LINE</text>';
    s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="#45222E"/>' +
         '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '" stroke="#45222E"/>';
    for (let i = 1; i <= 10; i++)
      s += '<text x="' + x(i) + '" y="' + (H - B + 17) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#7E656E">' + i + "</text>";
    for (let j = 4; j <= 10; j++)
      s += '<text x="' + (L - 10) + '" y="' + (y(j) + 3.5) + '" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" fill="#7E656E">' + j + "</text>";
    s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-family="Anton, sans-serif" font-size="15" letter-spacing="3" fill="#B49AA2">HOT</text>';
    s += '<text x="14" y="' + ((T + H - B) / 2) + '" text-anchor="middle" font-family="Anton, sans-serif" font-size="15" letter-spacing="3" fill="#B49AA2" transform="rotate(-90 14 ' + ((T + H - B) / 2) + ')">CRAZY</text>';

    const px = x(hot), py = y(crazy);
    const ty = (crazy <= 8 ? py - 19 : py + 27);
    const tw = 118, th = 15;
    const tx = Math.min(Math.max(px, L + tw / 2 + 2), W - R - tw / 2 - 2);
    s += '<line x1="' + px + '" y1="' + (H - B) + '" x2="' + px + '" y2="' + py + '" stroke="#FF3B5C" stroke-width="1" stroke-dasharray="3 3" stroke-opacity=".6"/>' +
         '<line x1="' + L + '" y1="' + py + '" x2="' + px + '" y2="' + py + '" stroke="#FF3B5C" stroke-width="1" stroke-dasharray="3 3" stroke-opacity=".6"/>' +
         '<circle cx="' + px + '" cy="' + py + '" r="12" fill="#FF3B5C" fill-opacity=".2"/>' +
         '<circle cx="' + px + '" cy="' + py + '" r="5.5" fill="#FF3B5C" stroke="#24111A" stroke-width="2"/>' +
         '<rect x="' + (tx - tw / 2) + '" y="' + (ty - th + 3) + '" width="' + tw + '" height="' + th + '" rx="2" fill="#17090F" stroke="#FF3B5C" stroke-opacity=".5"/>' +
         '<text x="' + tx + '" y="' + (ty - 1) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" letter-spacing="1" fill="#FF3B5C">YOU WANT (' + hot + ", " + crazy + ")</text>";
    return s + "</svg>";
  }

  /* =========================================================================
     THE DOSSIER
     ========================================================================= */
  SCREEN.result = function (opts) {
    opts = opts || {};
    const v = M.evaluate(S);

    const flagsHTML = S.flags.length
      ? '<div class="block"><p class="panel-h">Flags on file</p><div class="flags">' +
        S.flags.map(f => '<div class="flag"><b>' + f[0] + "</b><span>" + f[1] + "</span></div>").join("") +
        "</div></div>"
      : "";

    const overrideLine =
      S.adjust === "fine"
        ? "You took the model's number without arguing. Rare, and correct."
        : S.delta > 0
          ? "You overrode the model by <em>+" + S.delta + " cm</em>, which closes the gap to " + v.gap +
            " cm. Below 12 cm a heel erases the height difference entirely and the whole advantage disappears from the picture."
          : "You overrode the model by <em>" + S.delta + " cm</em>, which opens the gap to " + v.gap +
            " cm. Past 30 cm, kissing standing up, hugging and walking side by side all turn into daily micro-friction. You are inside the floor, but only just.";

    el(
      '<div class="dossier">' +
        '<div class="verdict-row">' +
        slot(v.type.t.key, v.type.t.name + " — " + v.type.tier.label, "portrait", v.type.variant) +
        '<div class="verdict">' +
          '<p class="eyebrow">Verdict &mdash; Case <b>CLOSED</b></p>' +
          '<div class="type">' + v.type.t.name + "</div>" +
          '<p class="tier"><span>' + v.type.tier.label + "</span> " + v.type.tier.note + " " + v.type.note + "</p>" +
          '<p class="stature"><b>' + v.target + " cm</b> &nbsp;·&nbsp; " + v.stature.line + "</p>" +
          '<p class="blurb">' + v.type.t.blurb + "</p>" +
          '<p class="fit" style="margin:16px 0 0">Spec match <b>' + v.type.fit + "%</b> &nbsp;·&nbsp; nearest of " +
            M.TYPES.length + " archetypes &nbsp;·&nbsp; distance " + v.type.d.toFixed(2) +
            " &nbsp;·&nbsp; portrait " + (v.type.variant + 1) + " of 3</p>" +
        "</div></div>" +

        '<div class="specs">' +
          '<div class="spec"><div class="k">Target height</div><div class="v">' + v.target + "<small>" + v.lo + "&ndash;" + v.hi + " cm band</small></div></div>" +
          '<div class="spec"><div class="k">Height gap</div><div class="v">' + v.gap + "<small>cm below you</small></div></div>" +
          '<div class="spec"><div class="k">Build</div><div class="v" style="font-size:17px">' + v.soft.label + "<small>" + v.form.note + "</small></div></div>" +
          '<div class="spec"><div class="k">Effort</div><div class="v" style="font-size:17px">' + v.effort.label + "<small>" + v.room.label + "</small></div></div>" +
          '<div class="spec ' + (v.zone.ok ? "zone" : "bad") + '"><div class="k">Matrix position</div><div class="v">' + v.zone.name + "<small>hot " + S.hot + " · crazy " + S.crazy + "</small></div></div>" +
          '<div class="spec"><div class="k">Rarity</div><div class="v">1 in ' + M.fmt(v.rare.oneIn) + "<small>of the population</small></div></div>" +
          '<div class="spec"><div class="k">Search time</div><div class="v">' + v.searchTime + "<small>at 2 dates a week</small></div></div>" +
        "</div>" +

        '<div class="block">' +
          '<p class="panel-h">Where that puts you on the chart</p>' +
          '<div class="matrix-wrap">' + matrixSVG(S.hot, S.crazy) + "</div>" +
          '<p class="sub" style="margin:14px 0 0;font-size:16px"><strong>' + v.zone.name + ".</strong> " + v.zone.line + "</p>" +
        "</div>" +

        '<div class="block">' +
          '<p class="panel-h">The arithmetic, itemised</p>' +
          '<ul class="mathlist">' +
            "<li><span>Height " + v.lo + "&ndash;" + v.hi + ' cm &nbsp;<em style="color:var(--dim)">N(' + M.POP.mu + ", " + M.POP.sd + ")</em></span><span>" + M.pct(v.rare.pH) + "</span></li>" +
            "<li><span>Build: " + v.buildLabel.toLowerCase() + "</span><span>" + M.pct(v.rare.pB) + "</span></li>" +
            "<li><span>Effort: " + v.effort.label.toLowerCase() + "</span><span>" + M.pct(v.rare.pE) + "</span></li>" +
            "<li><span>Room: " + v.room.label.toLowerCase() + "</span><span>" + M.pct(v.rare.pR) + "</span></li>" +
            "<li><span>Hot &ge; " + S.hot + ' &nbsp;<em style="color:var(--dim)">N(' + M.HOT.mu + ", " + M.HOT.sd + ")</em></span><span>" + M.pct(v.rare.pHt) + "</span></li>" +
            "<li><span>Crazy &le; " + S.crazy + ' &nbsp;<em style="color:var(--dim)">N(' + M.CRAZY.mu + ", " + M.CRAZY.sd + ")</em></span><span>" + M.pct(v.rare.pCz) + "</span></li>" +
            "<li><span>Hot/crazy correlation penalty</span><span>&times;" + v.rare.corr.toFixed(2) + "</span></li>" +
            '<li class="total"><span>Share of the population that qualifies</span><span>' + M.pct(v.rare.p) + "</span></li>" +
            '<li class="total"><span>Women in a 4,000,000 pool</span><span>' + M.fmt(Math.max(0, v.rare.candidates)) + "</span></li>" +
          "</ul>" +
        "</div>" +

        '<div id="roomblock"></div>' +
        '<div id="shareblock"></div>' +

        '<div class="block">' +
          '<p class="panel-h">Notes for the file</p>' +
          '<p class="sub" style="margin:0 0 14px">' + overrideLine + "</p>" +
          '<p class="sub" style="margin:0 0 14px">Height is a saturated variable. Going from 170 to 178 is a real jump; going from 185 to 193 is close to nothing, and past 195 some samples show a small penalty for looking disproportionate. Which means the height filter belongs at the <em>end</em> of your list, not the front &mdash; it costs nothing to observe from across a room, so screening on it first throws away the pool before you have learned anything expensive: her humour, how she argues, what she does when things go wrong. Those take three meetings to find out. Let those do the narrowing. Height breaks ties.</p>' +
          '<p class="sub" style="margin:0">The steep part of the curve is elsewhere and it is all fixable: how your clothes actually fit, whether you stand up straight, body composition, and how many conversations you start in a month. That last one is the whole model. A perfect filter over zero input returns zero.</p>' +
        "</div>" +

        flagsHTML +

        '<div class="footnote">' +
          "Model: partner height = own height &divide; 1.09 &nbsp;·&nbsp; population N(" + M.POP.mu + " cm, " + M.POP.sd + " cm) &nbsp;·&nbsp; zone boundaries read off the Hot Crazy Matrix &nbsp;·&nbsp; archetype by nearest neighbour in 4-D spec space.<br>" +
          "Deterministic: the same answers always produce this same file. Built for a group chat, not a life plan. Every woman on this chart is a person and none of them filled in this form.<br>" +
          "<b style=\"color:var(--muted);letter-spacing:.18em\">GIRLGORITHM</b> &nbsp;·&nbsp; issued by the Bureau of Applied Matchmaking" +
        "</div>" +

        '<div class="row">' +
          '<button class="primary" id="again" style="flex:1;min-width:170px">Run it again</button>' +
          '<button class="ghost" id="tweak" style="flex:1;min-width:170px">Change hot &amp; crazy</button>' +
        "</div>" +
      "</div>"
    );

    document.getElementById("again").onclick = reset;
    document.getElementById("tweak").onclick = () => go("hot");

    /* --- backend: share code + how the room compares --------------------- */
    renderShare(opts.code || null, v);
    if (!opts.code && DB.enabled) {
      DB.submit(S, v).then(code => { if (code) renderShare(code, v); });
    }
    DB.stats(v.rare.oneIn).then(st => renderRoom(st, v));
  };

  function renderShare(code, v) {
    const host = document.getElementById("shareblock");
    if (!host) return;
    if (!DB.enabled) {
      host.innerHTML =
        '<div class="block"><p class="panel-h">Sharing</p>' +
        '<p class="sub" style="margin:0;font-size:15px">Running without a backend, so this file lives only in your browser. Screenshot it like a caveman.</p></div>';
      return;
    }
    if (!code) {
      host.innerHTML =
        '<div class="share"><p class="panel-h">Filing your case&hellip;</p>' +
        '<p class="sub" style="margin:0;font-size:15px">Generating a share code.</p></div>';
      return;
    }
    const url = location.origin + location.pathname + "?r=" + code;
    host.innerHTML =
      '<div class="share">' +
        '<p class="panel-h">Case filed &mdash; send it to the group</p>' +
        '<div class="code-row"><span class="code">' + code + "</span></div>" +
        '<p class="link" id="shurl">' + esc(url) + "</p>" +
        '<div class="row">' +
          '<button class="small" id="copylink" style="flex:1">Copy link</button>' +
          '<button class="small" id="copytext" style="flex:1">Copy the brag</button>' +
        "</div>" +
        '<p class="msg" id="shmsg"></p>' +
      "</div>";

    const msg = document.getElementById("shmsg");
    const brag = v.type.t.name + " — " + v.target + " cm, " + v.zone.name +
                 ", 1 in " + M.fmt(v.rare.oneIn) + ". " + url;
    const copy = (text, ok) => {
      const done = () => { msg.className = "msg"; msg.textContent = ok; setTimeout(() => { msg.textContent = ""; }, 2600); };
      const fail = () => { msg.className = "msg off"; msg.textContent = "Copy blocked — select the link above by hand."; };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    };
    document.getElementById("copylink").onclick = () => copy(url,  "Link copied");
    document.getElementById("copytext").onclick = () => copy(brag, "Brag copied");
  }

  function renderRoom(st, v) {
    const host = document.getElementById("roomblock");
    if (!host || !st || !st.total) return;
    const total = st.total;
    const mine  = v.zone.name;
    const zones = (st.zones || []).slice(0, 6);
    const top   = Math.max.apply(null, zones.map(z => z.n).concat([1]));

    const bars = zones.map(z =>
      '<div class="bar' + (z.zone === mine ? " you" : "") + '">' +
        '<span class="bl">' + esc(z.zone) + "</span>" +
        '<span class="bn">' + z.n + " &middot; " + Math.round(100 * z.n / total) + "%</span>" +
        '<span class="track"><span class="fill" style="width:' + (100 * z.n / top).toFixed(1) + '%"></span></span>' +
      "</div>"
    ).join("");

    host.innerHTML =
      '<div class="block">' +
        '<p class="panel-h">How the room compares &mdash; ' + total + " completed file" + (total === 1 ? "" : "s") + "</p>" +
        '<div class="bignum">' +
          (st.rarer_than !== null && st.rarer_than !== undefined
            ? '<div><div class="n">' + st.rarer_than + '%</div><div class="l">Pickier than</div></div>' : "") +
          '<div><div class="n">' + (st.avg_height !== null ? st.avg_height : "—") + '</div><div class="l">Avg height here</div></div>' +
          '<div><div class="n">' + (st.cops || 0) + '</div><div class="l">Cops called</div></div>' +
          '<div><div class="n">' + (st.handsome || 0) + '</div><div class="l">Self-declared handsome</div></div>' +
        "</div>" +
        '<p class="panel-h" style="margin-bottom:10px">Zone distribution</p>' +
        '<div class="bars">' + bars + "</div>" +
      "</div>";
  }

  /* --- reset + shared-link entry ----------------------------------------- */

  function reset() {
    S = Object.assign({}, BLANK, { flags: [] });
    if (location.search) history.replaceState({}, "", location.pathname);
    welcome();
  }

  function openShared(code) {
    el('<div class="card"><p class="eyebrow">Retrieving file</p><h2 class="q">Pulling case ' + esc(code) + "&hellip;</h2></div>");
    DB.load(code).then(row => {
      if (!row) {
        el(
          '<div class="card">' +
            '<p class="eyebrow">Archive &mdash; <b>NOT FOUND</b></p>' +
            '<h2 class="q">No such case.</h2>' +
            '<p class="sub">Code <em>' + esc(code) + "</em> isn't in the archive. Either it was mistyped or somebody made it up to look interesting.</p>" +
            '<button class="primary" id="own" style="width:100%">Run your own</button>' +
          "</div>"
        );
        document.getElementById("own").onclick = reset;
        return;
      }
      S = {
        height: row.height, obese: row.obese, looks: row.looks,
        adjust: row.adjust, delta: row.delta, soft: row.soft, form: row.form,
        effort: row.effort, room: row.room,
        hot: row.hot, crazy: row.crazy,
        flags: (row.flags || []).map(k => [k, FLAG_TEXT[k] || ""])
      };
      fileNo.innerHTML = "FILE&nbsp;#" + String(S.height).padStart(4, "0");
      stepIdx = STEPS.indexOf("result"); paintRail();
      SCREEN.result({ code: row.code });
    });
  }

  const shared = new URLSearchParams(location.search).get("r");
  if (shared && DB.enabled) openShared(shared);
  else welcome();
})();
