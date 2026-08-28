# Wife Zone Calculator

A joke matchmaking calculator with an unreasonable amount of real arithmetic behind it. Nine questions, one written spec, an honest estimate of how many of her exist.

Nothing in the model is random. The same answers always produce the same file — that is the whole joke.

---

## What it actually computes

| Step | Method |
|---|---|
| Optimum partner height | `your height ÷ 1.09`, ±3 cm band, hard floor at `height − 30` |
| Rarity | Normal distributions: height `N(163, 6.4)`, hot `N(5.0, 1.6)`, crazy `N(6.4, 1.5)`, times build prevalence |
| Hot/crazy correction | Asking for a big hot−crazy gap divides the result by `1 + (gap − 2) × 1.8` |
| Matrix zone | Boundaries read straight off the Hot Crazy Matrix chart |
| Archetype | Nearest neighbour among 8 types in weighted 4-D space (height z-score, build, hot, crazy) |

All of it lives in `assets/math.js` as pure functions with no DOM access, so it can be tested or reused on its own.

---

## Layout

```
index.html            page shell
config.js             Supabase URL + anon key  (safe to commit — see below)
images.js             image paths. the one file you edit when renders arrive
assets/
  style.css           the whole visual system
  math.js             the model. pure functions, no DOM
  db.js               three RPC calls over fetch. no SDK
  app.js              screen flow, interstitials, the dossier
  img/                the images, plus PROMPTS.md — the full generation brief
supabase/schema.sql   table, RLS lockdown, three functions. idempotent
build.js              squashes everything into dist/artifact.html
```

---

## Running it

Any static server. There is no build step for the site itself.

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Open it straight off the filesystem and it still works, but `file://` blocks the
clipboard and the Supabase calls, so use a server.

---

## Deploying to GitHub Pages

1. Push this folder to a repo.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Wait a minute. It lands on `https://<user>.github.io/<repo>/`.

No workflow file needed — these are plain static files. `.nojekyll` is there to stop
GitHub running the files through Jekyll.

---

## Setting up Supabase

The backend does exactly two things: it gives every completed run a shareable
6-character code, and it shows you how the rest of the group answered. The
calculator runs fine without it — you just lose those two features.

1. Create a project at [supabase.com](https://supabase.com). Free tier is far more than enough.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, Run.
   It is idempotent, so re-running it after an edit is safe.
3. **Project Settings → API**, copy the URL and the `anon` / `public` key into `config.js`.
4. Commit and push.

### About committing the anon key

It is fine, and it is the intended design. The anon key is what every browser
loading the page uses; there is nowhere to hide it in a static site and no point
trying.

The protection is in the schema, not the key:

- `runs` has row-level security **on** with **zero policies**, so direct REST access to
  the table returns nothing and accepts nothing.
- All grants on the table are revoked from `anon` and `authenticated`.
- `anon` can execute exactly three `security definer` functions: `submit_run`,
  `get_run`, `get_stats`. There is no update path and no delete path at all.
- `submit_run` refuses to write if more than 40 rows landed in the last minute.

Nobody can dump the table, edit a row, or drop anything with that key. The worst
available attack is writing junk runs at 40 a minute, and the fix for that is
deleting them from the dashboard.

**Never put the `service_role` key in `config.js`.** That one bypasses all of the above.

### Reading the data

In the Supabase table editor, or:

```sql
select zone, count(*) from runs group by 1 order by 2 desc;
select archetype, count(*) from runs group by 1 order by 2 desc;
select * from runs where 'WATCHLIST' = any(flags);   -- everyone who got the cops
```

Rows are anonymous: answers and derived results, no names, no identifiers.

---

## Images

32 files: 8 interstitials plus 24 archetype portraits (8 types × 3 variants each).
Full generation brief with every prompt is in **`assets/img/PROMPTS.md`**.

Convert to **1024 px wide WebP at quality 82** before committing (the exact command is
in PROMPTS.md) — at full PNG size the 32-image set blows past the 16 MB artifact
ceiling once `build.js` inlines it; as WebP it lands under 1 MB.

Drop the files into `assets/img/` and wire them up in **`images.js`** — the one file
you edit when renders arrive:

```js
scared : "assets/img/scared.webp",
model  : ["assets/img/model1.webp", "assets/img/model2.webp", "assets/img/model3.webp"],
```

Which of a type's three portraits appears is not random. `classify()` returns the
distance between the user's answers and the archetype's centre; each type carries
its distance terciles as `cuts`, measured over all 62,769 reachable input
combinations, so the three variants come up in even thirds and all 24 are reachable:

| index | tier | meaning |
|---|---|---|
| 0 | textbook | answers land almost on the archetype |
| 1 | variation | recognisably the type, one thing off-spec |
| 2 | edge case | barely qualifies, the neighbouring type is bleeding in |

Any slot left as `""` renders a labelled dashed placeholder, so partial sets ship
fine — generate them in whatever order suits you.

---

## Publishing the single-file version

```bash
node build.js      # → dist/artifact.html
```

Inlines the CSS, all five scripts, and every image path in `images.js` as a data
URI. That file is what gets published as a Claude artifact, where external requests
are blocked. It also warns about paths listed in `images.js` that aren't on disk,
and about files in `assets/img/` that nothing references.

`dist/` is gitignored and rebuilt every run — edit `assets/`, never `dist/`.

---

## A word on the content

It is a group-chat toy that runs on stereotypes and a meme chart from the
internet. The height ergonomics are real, the distributions are roughly real, the
archetypes are a bit. Every woman on that chart is a person and none of them
filled in this form.
