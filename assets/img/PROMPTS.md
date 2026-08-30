# Image generation brief

16 archetypes × 3 variants (48) + 8 interstitials. **56 files total.**
Model and Baddie (6 files) are already generated — do not regenerate. The
original 8 archetypes plus Old Money, Coquette, Dark Academia and Cottagecore
(36 files) are all in place. Y2K, Off-Duty and Pilates Princess (9 files) are
drafted below and waiting on generation.

---

## The mistake this file exists to correct

The first version of this brief said *"photorealistic, natural skin texture, visible
pores, no beauty retouching or skin smoothing"* and told the generator to drift
toward *"less polished, editorial not commercial"*. Every one of those instructions
forbids the thing an attractive portrait needs. The result was women who all looked
like the same tired documentary subject, and the lowest-effort type came out plain
*ugly* — which is not a type, it is a failure.

**The correction, and the single most important line in this file:**

> Attractiveness is not the variable. Every woman in this set is beautiful. What
> changes between archetypes is **styling, effort and energy** — never how good
> looking she is. Cast a beautiful woman, then style her to the type. Never cast a
> plain woman and call it a type.

A bare-face archetype is not an ugly woman. She is a beautiful woman who spent zero
minutes getting ready and would rather be somewhere else.

---

## How to use this

Every prompt below is already **BASE SPINE + TREATMENT + SUBJECT**, merged into one
block — paste the whole block as-is, one block per image.

### Framing: full body, not waist-up

Earlier renders were waist-up 3:2 landscape, but the site crops every portrait into
a **3:4 vertical, full-body** frame. A waist-up shot forced into that box gets cut in
half. Every prompt below asks for the full figure, head to feet, in a vertical frame.

### File specs

Convert before committing: **1024 px wide, 3:4, WebP quality 82.**

```bash
python3 -c "
from PIL import Image; import glob, os
for f in glob.glob('*.png'):
    im = Image.open(f).convert('RGB')
    if im.width > 1024: im = im.resize((1024, round(1024*im.height/im.width)), Image.LANCZOS)
    im.save(os.path.splitext(f)[0] + '.webp', 'WEBP', quality=82, method=6)
"
```

---

## Reference pieces (for your own record — already merged into each prompt below)

**BASE SPINE**
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin — this is a casting decision and
it does not change between archetypes. A fictional person who does not resemble any
real or public figure. No text, no logos, no watermark, no border.
```

**TREATMENT B · POLISHED** — for Goth, Corporate Baddie (effort 2.2–2.4, higher production)
```
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up, styled
to a personality rather than to a campaign — precise, composed, camera-ready.
Retouched enough that she looks flawless without looking artificial.
```

**TREATMENT C · UNDERSTATED** — for Nerd, Clean Girl, Gym Girl, Grunge Girl, Comfort Class
```
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low STYLING, not low attractiveness. She must
still be a strikingly good-looking woman — the kind people describe as "she doesn't
even try". Do NOT make her plain, tired, washed out, or ordinary.
```

**TREATMENT D · QUIET LUXURY** — for Old Money (effort 1.4, tradition +0.7, visibility −0.7)
```
Soft key light from camera left with gentle fill, one subtle rim light. Clean, muted
colour grade — warm neutrals, no saturation spikes. f/2.5. Groomed and polished but
deliberately unflashy: the effort went into fabric and cut, not into visible styling.
Hair professionally done but reads as low-maintenance. Skin retouched to flawless
without looking artificial. Nothing about the image should read as "trying" — the
whole point is that trying is beneath her.
```

**TREATMENT E · ROMANTIC** — for Coquette (effort 2.7, the highest of the
low-body-modification types; the glam is decorative, not sharp)
```
Soft key light from camera left with generous fill, a warm rim light. Bright,
slightly warm colour grade — softer contrast than the Polished treatment,
nothing hard-edged. f/2.5. Deliberately, elaborately styled: hair curled, a
considered bow or ribbon somewhere on the outfit, glossy lips. The styling
reads as decorative and performed-sweet rather than sharp or severe — this is
softness as a deliberate choice, not an accident. Retouched to flawless.
```

**TREATMENT F · LITERARY** — for Dark Academia (effort 1.0, tradition +0.9,
visibility −0.8, hot 5.3 — deliberately not the conventionally "hot" register
this brief usually casts for; beauty here reads as interesting, not glossy)
```
Soft, slightly cool-neutral key light from camera left, minimal fill, moody
falloff into the dark background rather than an even wash. f/2.8. Tailored but
unglamorous: real wool, real brass buttons, nothing borrowed from a runway.
Hair and skin lightly done, not styled for a camera. The retouching should
still make her flawless, but the mood is inward — she is not performing for
the lens, she has simply been caught mid-thought and happens to be beautiful.
```

**TREATMENT G · FLASH** — for Y2K (effort 1.3, hot 7.0, crazy 7.0 — playful
chaos, not the broody kind)
```
Direct on-camera flash look — slightly blown highlights, a harder shadow edge
than the rest of this set, but still clean enough to read the outfit clearly.
Bright, slightly oversaturated colour grade. f/4. Deliberately dressed for
going out: low-rise, rhinestones or shimmer somewhere, hair either dead
straight or crimped. The energy is disposable-camera-at-a-party, not
studio-polished — but she is still the best-looking person in the frame.
```

---

# The 16 archetypes

- **1 · textbook** — the pure form. Answers land almost on the archetype.
- **2 · variation** — recognisably the type, one thing off-spec.
- **3 · edge case** — barely qualifies; the type stretched to its far edge.

Which one shows is decided by how far the user's answers sit from the archetype
centre in eleven-dimensional space (build ×2, effort, room, vice, tradition,
visibility, family, height, hot, crazy), split at that type's distance
terciles — each comes up in even thirds.

---

## THE GOTH — treatment B · effort 2.2, room −0.8, height +0.3, hot 7.5, crazy 9.0
*(PDF: Goth girl — siyah ağırlıklı giyim, koyu makyaj, dantel/deri/platform botlar)*

### `goth1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A strikingly beautiful, tall, slim woman in her mid-twenties, pale porcelain skin,
dressed entirely in black: a fitted lace-panelled top, a black leather mini skirt,
sheer black tights, chunky black platform boots laced to the calf. Jet-black hair,
blunt fringe cut straight across the eyebrows, glossy and sharply cut. Precise dark
eyeliner and a matte deep-plum lip. Silver rings on four fingers, a small septum
hoop. Expression: level, unblinking, a very slight smile at one corner of the mouth
that does not reach the eyes. Direct eye contact held one beat too long. Genuinely
gorgeous and slightly frightening — both at once.
```

### `goth2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A beautiful woman in her late twenties, slim, softened dark-academia-adjacent goth: a
charcoal knit cardigan over a black lace-trimmed slip dress, knee-high black leather
boots with a low heel, one delicate silver pendant. Black hair grown out with two
inches of natural brown at the roots, tucked behind one ear. Eyeliner smudged from a
long day rather than carelessness. Expression: thoughtful, lips slightly parted as if
she was about to say something and thought better of it. Warm, intelligent, quietly
beautiful.
```

### `goth3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A beautiful woman in her early twenties, slim, tall, black clothing worn hard: a
faded band t-shirt tucked into ripped black jeans, scuffed platform boots, chipped
black nail varnish, dark hair loose and deliberately undone. Almost no makeup beyond
smudged kohl, and she does not need any. Expression: wired and slightly manic,
eyebrows up, a wide unsettling grin, leaning into the lens. Too much energy for the
frame to hold. The beauty is obvious; the stability is the question.
```

---

## CORPORATE BADDIE — treatment B · effort 2.4, room +0.3, height +0.5, hot 7.2, crazy 5.2
*(PDF: Corporate baddie — vücuda oturan blazer, topuklu, keskin makyaj, boss havası)*

### `corporate1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A beautiful woman in her early thirties, tall, with a curvy hourglass figure and
visibly toned, defined arms — the build of someone who trains but is not skinny — in
an immaculately tailored black blazer worn fitted to the body over a silk camisole, a
matching pencil skirt, sharp black stiletto heels. Dark hair cut to a precise
shoulder-length bob, glossy. Sharp, expertly done makeup — defined brows, a bold but
controlled lip, a steel watch, small gold studs. Expression: composed, one eyebrow
fractionally raised — the look of someone who has already found the flaw in what you
said and is deciding whether to mention it. Arms loose at her sides, chin level.
Formidable and extremely attractive.
```

### `corporate2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A beautiful woman in her mid-thirties, curvy, at the end of a long day: blazer off
and carried over one shoulder, silk camisole underneath, sleeves nowhere in sight,
heels still on, hair escaping the bob. Reading glasses pushed up onto her head.
Expression: dry, half-smiling, exhaling. Warm and tired rather than sharp, and better
looking for it. Still visibly the most organised person in any room she enters.
```

### `corporate3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.5. Deliberately styled and well made up,
precise and composed. Retouched enough that she looks flawless without looking
artificial.
A beautiful woman in her early thirties, fuller-figured, tall, in a sharply cut
burgundy blazer-dress with nothing underneath but a delicate chain, very high heels.
Bold red lip, gold jewellery stacked on both wrists, hair in loose waves rather than
a bob. Expression: openly amused, chin tilted down, looking up at the lens through
her lashes. The tailoring says boardroom; everything else says she owns the company.
Far more glamorous than the type usually runs.
```

---

## THE NERD — treatment C · effort 0.4, room −0.9, height −0.2, hot 6.0, crazy 4.2
*(closest PDF match: Study girl / Booktok girl — kütüphane, not alma, üretkenlik)*

### `nerd1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A genuinely beautiful young woman in her early twenties, slim and small-framed,
wearing large round tortoiseshell glasses, standing in an oversized cable-knit
cardigan over leggings, thick wool socks. Dark hair in a messy bun held up with a
pencil, a few strands escaping. No makeup at all, a scatter of freckles, clear
glowing skin. Expression: mid-sentence and lit up, eyebrows raised, explaining
something she cares about far more than you do. She is beautiful and has simply never
thought about it.
```

### `nerd2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same woman in her mid-twenties, glasses off and folded in one hand, hair brushed
out and down over a simple fitted dark green sweater and straight-leg jeans, bare
feet. Expression: quietly pleased and a little self-conscious, a small closed-mouth
smile, looking straight at the lens. The version of her twenty minutes into a good
conversation, when she stops hiding — and the whole joke of this archetype is that
she is stunning and nobody noticed for months.
```

### `nerd3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful young woman in her early twenties, very slim, glasses slightly askew,
hair half out of its bun, in an oversized university hoodie over pyjama shorts and
mismatched socks. Expression: over-caffeinated and locked in, staring at the lens
with the flat intensity of hour thirty of a deadline. Not tired-looking, not unwell —
wired. Still obviously good looking underneath the chaos. This is the Nerd with the
crazy dial turned up.
```

---

## CLEAN GIRL — treatment C · effort 0.7, room +0.1, height 0.0, hot 7.0, crazy 4.5
*(PDF: Clean girl — parlak doğal cilt, slick-back topuz, nötr kıyafetler, sade takılar)*

### `cleangirl1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
An exceptionally beautiful woman in her mid-twenties, soft and gently curvy rather
than lean, hair slicked back into a tight low bun with not a strand out of place,
small gold hoop earrings, a fitted ribbed top in oatmeal-neutral, straight-leg
trousers skimming rounded hips. Dewy, glass-like skin with
almost no visible makeup beyond a hint of gloss. Flawless clear complexion,
perfectly even features. Expression: relaxed, open, an easy natural smile that
reaches the eyes, comfortable being looked at. Looks identical at 7am and at a
wedding.
```

### `cleangirl2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same beautiful woman in her late twenties, hair down but glossy and freshly
washed, in a simple cream slip dress, one thin gold necklace, a touch of tinted balm.
Dressed up for once, still reads as effortless. Expression: warm, slightly amused at
the small amount of effort she has made, head tilted. The same person as the first
image, at a nicer dinner, and everyone there has noticed.
```

### `cleangirl3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A breathtaking woman in her mid-twenties, soft and curvy, wearing a plain white
ribbed tank stretched slightly over the curve of her hips and loose linen trousers,
no jewellery, hair simply slicked back with water, no makeup whatsoever. Strong
symmetrical features, unusual striking eye colour. Expression:
calm, direct, almost blank. The joke of this image is that absolutely nothing has
been done to her and she is still the most beautiful woman in the set.
```

---

## GYM GIRL — treatment C · effort 1.6, room +0.6, height +0.4, hot 7.8, crazy 6.2
*(PDF: Gym girl / Fit girl — antrenman programı, spor kombinleri, disiplinli yaşam)*

### `gymgirl1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her late twenties, tall, athletic and powerfully built — toned
shoulders, defined arms, a lean athlete's frame — in a matching fitted workout set:
sports bra and high-waisted leggings in a solid colour. Long hair pulled back in a
high ponytail. Minimal makeup, healthy glowing skin with a light sheen. Expression:
head back, laughing openly from the chest, entirely unselfconscious, hands loosely on
her hips. She fills the frame and is not apologising for it. Power and beauty in the
same person, not a trade between them.
```

### `gymgirl2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her early thirties, athletic, post-workout: hair damp and tied
back low, an oversized cropped hoodie over the same leggings, a gym towel draped over
one shoulder. One small tattoo on the forearm. Expression: relaxed, direct, chin
slightly down, a small satisfied smile — the look of someone who already got the hard
part of the day done before you woke up.
```

### `gymgirl3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful, very athletic woman around thirty, heavily muscled, hair braided back
tight against her head, in a sports bra and leggings, arms crossed, weight on one
hip. Expression: locked, intense, unblinking eye contact, jaw set — competitive
energy with nowhere to go. Still warm at the edges, but the message is "do not test
me". Attractive, and a little too switched on.
```

---

## GRUNGE GIRL — treatment C · effort 0.3, room −0.3, height −0.1, hot 6.8, crazy 8.9
*(PDF: Grunge girl — flanel gömlek, yırtık jean, band tişörtü, combat bot, umursamaz görünüm)*

### `grunge1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her early twenties, slim, an unbuttoned faded flannel shirt tied
loosely at the waist over a plain band t-shirt, ripped light-wash jeans, scuffed
combat boots. Hair long, slightly greasy-textured on purpose, parted messily down the
middle. No visible makeup except a smudge of old dark eyeliner. Expression: bored,
heavy-lidded, chin down, looking at the lens like it is an inconvenience. Puts in no
visible effort and is somehow the most magnetic person in the room.
```

### `grunge2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her mid-twenties, flannel shirt buttoned all the way this time,
oversized, sleeves rolled once, over black leggings and combat boots, a beanie pulled
low over messy hair. One small silver nose ring. Expression: small, dry, closed-mouth
smile, arms crossed loosely. More put-together than the first image but still
entirely unbothered — the softer edge of the same person.
```

### `grunge3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her early twenties, a torn band t-shirt worn as a dress over
fishnet tights, unlaced combat boots, dark eyeliner smudged heavily and deliberately,
hair wild and unbrushed with one section dyed a faded colour. Expression: wide, wired
grin, eyes a little too bright, leaning into the lens with restless energy. The
beauty is obvious; so is the chaos.
```

---

## THE COMFORT CLASS — treatment C · effort 0.8, room +0.4, height −0.5, hot 5.5, crazy 5.5
*(closest PDF mood: Vanilla girl — krem, bej tonları, örgü, sıcak, rahat ev estetiği)*

### `comfort1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her late twenties, heavy-set and soft, with a lovely open round
face, warm eyes and wonderful skin, wearing a large oatmeal cable-knit cardigan over
a cream slip dress, thick wool socks. Hair in a simple low bun with pieces falling
out. No makeup. Expression: an easy unhurried smile, eyes crinkled, entirely at ease.
The specific calm of someone with nothing to prove to anybody in the room. Warmth is
the point, not a consolation prize.
```

### `comfort2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same woman in her early thirties, heavy-set, hair down and freshly washed, in a
deep green wrap dress with small gold earrings — dressed for something. A little
makeup, well done. Expression: laughing at something just off camera, one hand half
raised as if waving off a compliment. More energy and more polish than the first
image, the same fundamental unbotheredness. Beautiful and glowing.
```

### `comfort3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A pretty woman in her mid-twenties, shorter and heavy-set, in a plain grey hoodie
with the hood down over pyjama bottoms, hair flat and unstyled. Expression: neutral
to the point of blank, mouth closed, eyes slightly unfocused, looking past the
camera. Not unhappy, not unwell — just switched off. Still a good-looking face; the
lights are simply off.
```

---

## OLD MONEY — treatment D · effort 1.4, room −0.2, vice 0.1, tradition +0.7,
## visibility −0.7, family +0.5, height +0.3, hot 7.0, crazy 3.8
*(PDF: Old money / Quiet luxury — logosuz kaliteli kumaşlar, pastel/nötr tonlar,
inci, hiç zorlama görünmeyen bakımlı hâl; en sık "Clean girl" ile karışan tip —
ayrımı burada tradition yüksek + visibility düşük yapıyor, clean girl'de ikisi de
nötr)*

### `oldmoney1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with gentle fill, one subtle rim light. Clean, muted
colour grade — warm neutrals, no saturation spikes. f/2.5. Groomed and polished but
deliberately unflashy: the effort went into fabric and cut, not into visible styling.
Hair professionally done but reads as low-maintenance. Skin retouched to flawless
without looking artificial. Nothing about the image should read as "trying" — the
whole point is that trying is beneath her.
A beautiful woman in her late twenties, tall and slim, standing with her weight
shifted onto one leg, one hand raised to push a pair of dark cat-eye sunglasses up
into her hair, caught mid-gesture rather than posed. A dark green and navy
cricket-style varsity knit jumper layered over a crisp white oxford shirt, cuffs
turned back over the sweater at the wrist, tucked into pleated camel wool trousers
with a thin black leather belt. A slim gold chain-link watch, one plain gold ring.
Brown leather loafers, no socks. Hair down in loose natural waves. Bare, even
complexion, a soft muted red on the lips — the one deliberate touch of colour.
Expression: composed, faintly amused, looking off past the camera as if distracted
by something more interesting than the lens. Reads like she just stepped out of a
library in a house with too many books in it — not off a runway, not out of an
office.
```

*(v3 — v2 fixed the corporate-headshot problem but was still generic quiet-luxury.
Rebuilt against İbrahim's own reference set: his 5 "old money" photos split into two
different types — visible-logo Parisian It-girl (Gucci horsebit, LV bag, red lip,
sneakers) which is NOT this archetype, and genuine unbranded heritage style (cricket
knit, books, fireplace, sunglasses-as-gesture) which is. Swapped the plain cashmere
crewneck for a cricket-style varsity knit — the one signifier in the set no
non-heritage rich person reaches for by accident — kept the sunglasses-into-hair
gesture and off-camera gaze from the good references, standing-only since the site
format has no room for the seated/prop shots those came from.)*

### `oldmoney2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with gentle fill, one subtle rim light. Clean, muted
colour grade — warm neutrals, no saturation spikes. f/2.5. Groomed and polished but
deliberately unflashy: the effort went into fabric and cut, not into visible styling.
Hair professionally done but reads as low-maintenance. Skin retouched to flawless
without looking artificial. Nothing about the image should read as "trying" — the
whole point is that trying is beneath her.
The same woman in her early thirties, weekend register: a cream cable-knit sweater
tied over her shoulders on top of a white oxford shirt, straight-leg jeans, tan
flats, tortoiseshell sunglasses pushed up into her hair. Small gold hoops. Expression:
mid-laugh, genuinely delighted, head tilted back slightly, one hand loosely at her
collarbone. Warmer and looser than the first image, still unmistakably put together
without effort.
```

### `oldmoney3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with gentle fill, one subtle rim light. Clean, muted
colour grade — warm neutrals, no saturation spikes. f/2.5. Groomed and polished but
deliberately unflashy: the effort went into fabric and cut, not into visible styling.
Hair professionally done but reads as low-maintenance. Skin retouched to flawless
without looking artificial. Nothing about the image should read as "trying" — the
whole point is that trying is beneath her.
A striking woman in her mid-thirties, at home in a floor-length ivory silk robe worn
loosely over silk pyjamas, hair swept up loosely with a few pieces falling, thin
reading glasses pushed down her nose, a heavy signet ring on one hand. No other
jewellery. Expression: cool, appraising, looking over the top of the glasses directly
into the lens, one eyebrow very faintly raised. Detached rather than warm — the edge
case where quiet confidence tips into not needing the room's approval at all.
```

---

## THE COQUETTE — treatment E · effort 2.7, room +0.6, height −0.3, hot 7.0, crazy 7.0
*(PDF: Coquette / Balletcore — fiyonk, dantel, inci, flörtöz vintage-romantik feminenlik;
new archetype, added from the 52-aesthetic dictionary — fills the "deliberately
soft, decorative, performed-sweet" niche nothing else on the board covers)*

### `coquette1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, a warm rim light. Bright,
slightly warm colour grade — softer contrast than a sharp editorial look, nothing
hard-edged. f/2.5. Deliberately, elaborately styled: hair curled, a considered bow
or ribbon somewhere on the outfit, glossy lips. The styling reads as decorative and
performed-sweet rather than sharp or severe. Retouched to flawless.
A beautiful woman in her early twenties, petite, in a fitted pale-pink cardigan with
a large satin bow at the collar, a pleated white mini skirt, knee-high white socks,
black ballet flats. Hair in loose curled pigtails tied with matching ribbon. Glossy
tinted lip, soft blush, doe-eyed makeup with long lashes. Expression: a wide,
practiced, camera-ready smile, head tilted just slightly, one finger near her chin —
sweet on purpose, and clearly aware of the effect. The whole picture is a decision.
```

### `coquette2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, a warm rim light. Bright,
slightly warm colour grade — softer contrast than a sharp editorial look, nothing
hard-edged. f/2.5. Deliberately, elaborately styled: hair curled, a considered bow
or ribbon somewhere on the outfit, glossy lips. The styling reads as decorative and
performed-sweet rather than sharp or severe. Retouched to flawless.
The same woman in her mid-twenties, a plainer version: a cream slip dress with one
small ribbon at the strap, hair down and only loosely curled, a single delicate
pearl necklace. Less production than the first image but the same calculated
softness underneath. Expression: pouting slightly, wide eyes looking straight into
the lens as if she has just been mildly wronged and is waiting for you to notice.
```

### `coquette3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, a warm rim light. Bright,
slightly warm colour grade — softer contrast than a sharp editorial look, nothing
hard-edged. f/2.5. Deliberately, elaborately styled: hair curled, a considered bow
or ribbon somewhere on the outfit, glossy lips. The styling reads as decorative and
performed-sweet rather than sharp or severe. Retouched to flawless.
A beautiful woman in her early twenties, in a baby-pink babydoll dress layered with
lace trim, an oversized bow worn like a crown at the top of her head, thigh-high
socks, mary-jane heels. Exaggerated doll-like makeup — round blush spots, glossy
cupid's-bow lips. Expression: wide-eyed and unblinking, head cocked at an unnatural
angle, smiling a beat too long. Genuinely gorgeous and just slightly too much — the
crazy dial on this one is turned all the way up.
```

---

## DARK ACADEMIA — treatment F · effort 1.0, tradition +0.9, visibility −0.8,
## height +0.1, hot 5.3, crazy 7.0
*(PDF: Dark academia — kitap, klasik triko, ekose, sonbahar/kütüphane atmosferi;
new archetype, added from the 52-aesthetic dictionary — the "brooding intellectual"
niche nothing else on the board covers; deliberately cast at a lower hot than the
rest of the set — this type reads as interesting rather than glossy)*

### `academia1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft, slightly cool-neutral key light from camera left, minimal fill, moody falloff
into the dark background. f/2.8. Tailored but unglamorous: real wool, real brass
buttons, nothing borrowed from a runway. Hair and skin lightly done, not styled for
a camera. Retouched to flawless, but the mood stays inward.
A beautiful woman in her early twenties, slim, in a fitted brown herringbone blazer
with brass buttons over a cream turtleneck, a pleated forest-green tartan skirt,
knee-high brown leather boots, round wire-rimmed glasses. Dark hair loosely pinned
up with pieces falling out, a scarf looped twice at the neck. No visible makeup
beyond a hint of dark red on the lips. Expression: distant, thoughtful, looking
slightly off to the side as though mid-thought, a paperback held loosely at her
side. Beautiful in a way that takes a second look to register.
```

### `academia2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft, slightly cool-neutral key light from camera left, minimal fill, moody falloff
into the dark background. f/2.8. Tailored but unglamorous: real wool, real brass
buttons, nothing borrowed from a runway. Hair and skin lightly done, not styled for
a camera. Retouched to flawless, but the mood stays inward.
The same woman in her mid-twenties, softer register: an oversized charcoal cardigan
over a white collared shirt, straight wool trousers, no glasses this time, hair down
and slightly windswept. A thin gold chain with a small pendant. Expression: a small,
private, closed-mouth smile, eyes down and to the side — the look of someone
enjoying a joke she has decided not to share.
```

### `academia3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft, slightly cool-neutral key light from camera left, minimal fill, moody falloff
into the dark background. f/2.8. Tailored but unglamorous: real wool, real brass
buttons, nothing borrowed from a runway. Hair and skin lightly done, not styled for
a camera. Retouched to flawless, but the mood stays inward.
A beautiful woman in her early twenties, dark circles lightly visible under the
eyes, in a rumpled cream blouse under an unbuttoned black wool coat, ink stains on
two fingers, hair falling out of a messy braid. A stack of three books clutched to
her chest instead of held loosely. Expression: intense, slightly wild-eyed, staring
directly into the lens mid-sentence, mouth slightly open. Gorgeous, and very
obviously three coffees and one existential crisis into the evening.
```

---

## COTTAGECORE — treatment C · effort 0.15, tradition +0.6, family +0.7,
## height −0.3, hot 5.0, crazy 6.0
*(PDF: Cottagecore / Bohem / Earthy — çiçekli elbise, keten, doğal materyal, yavaş
yaşam fantezisi; new archetype, merging three closely related PDF entries — the
"natural, low-effort, family-and-tradition-coded" niche nothing else on the board
covers; deliberately the lowest hot on the whole board — the joke is that she is
genuinely lovely and has never once optimised for it)*

### `cottagecore1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her late twenties, soft and round-faced, in a flowing floral
linen dress, barefoot, a woven flower crown sitting slightly crooked in loose wavy
hair. Sun-freckled skin, no makeup. A smear of flour on one forearm. Expression: an
open, unguarded smile, eyes crinkled against the light, entirely at ease with
herself. Looks like she just walked out of a garden, because she did.
```

### `cottagecore2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same woman in her early thirties, practical register: a chunky knit cardigan
over a simple cotton dress, canvas garden apron with pockets, hair tied back with a
strip of cloth, dirt visibly under her nails. Expression: focused, mid-task, glancing
up at the lens with a small distracted smile — interrupted, not posing.
```

### `cottagecore3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her mid-twenties, barefoot in a slip of a linen dress with
grass stains at the hem, hair wild and full of small leaves and petals, a string of
hand-tied herbs around one wrist. Expression: wide-eyed, unblinking, a little too
delighted, staring directly into the lens with the intensity of someone who has just
named the moon her business partner. Feral in the nicest possible way.
```

---

## Y2K — treatment G · effort 1.3, room +0.5, height −0.2, hot 7.0, crazy 7.0
*(PDF: Y2K / McBling — düşük bel, taşlı aksesuar, parlak pembe, 2000'ler pop
kültürü nostaljisi; new archetype — fills the "playful chaotic" register
nothing else on the board covers, since Grunge and Goth are chaotic in a
broody/dark direction instead)*

### `y2k1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Direct on-camera flash look — slightly blown highlights, a harder shadow edge than
the rest of this set, but still clean enough to read the outfit clearly. Bright,
slightly oversaturated colour grade. f/4. Deliberately dressed for going out: the
energy is disposable-camera-at-a-party, not studio-polished.
A beautiful woman in her early twenties, in a baby-pink halter top with a
rhinestone trim, low-rise denim mini skirt, chunky-heeled sandals. Hair straightened
poker-flat with chunky highlighted pieces, a butterfly clip on one side. Glossy
lip gloss, shimmery eyeshadow. A rhinestone belly chain visible above the
waistband. Expression: mid-laugh, head thrown back, one hand on her hip — caught,
not posed, exactly like a flash photo taken at 1am.
```

### `y2k2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Direct on-camera flash look — slightly blown highlights, a harder shadow edge than
the rest of this set, but still clean enough to read the outfit clearly. Bright,
slightly oversaturated colour grade. f/4. Deliberately dressed for going out: the
energy is disposable-camera-at-a-party, not studio-polished.
The same woman in her mid-twenties, a plainer register: a fitted grey baby tee
with a small graphic, low-rise cargo pants, hoop earrings, hair in two low
pigtails with face-framing pieces out. Less shimmer, same energy. Expression:
peace sign half-raised, tongue out, mid-blink from the flash — a candid, not a
pose.
```

### `y2k3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Direct on-camera flash look — slightly blown highlights, a harder shadow edge than
the rest of this set, but still clean enough to read the outfit clearly. Bright,
slightly oversaturated colour grade. f/4. Deliberately dressed for going out: the
energy is disposable-camera-at-a-party, not studio-polished.
A beautiful woman in her early twenties, in a rhinestone-logo tube top, extremely
low-rise flare jeans, tinted heart-shaped sunglasses pushed up into messy crimped
hair. Body glitter on the shoulders and collarbone. Expression: wide-eyed,
slightly manic grin, one finger pointing at the lens, caught mid-shout. Gorgeous,
and about four drinks past her best decision-making.
```

---

## OFF-DUTY — treatment C · effort 0.4, height +0.8, hot 8.2, crazy 3.8
*(PDF: Model-off-duty / Clean girl indie — rahat basic parçalar, deri ceket,
sneaker, zahmetsiz "cool" şehir stili; new archetype — distinct from the
existing Model (glam, full production) and Clean Girl (skincare-minimalism):
this one is street-cool, not glowy)*

### `offduty1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A very tall, striking woman in her early twenties, sharp model-adjacent bone
structure, in an oversized black leather jacket over a plain white tank, straight-leg
jeans, white sneakers, oversized sunglasses pushed up on her head. Hair down, slightly
undone, no visible makeup. Expression: flat, faintly bored, unimpressed by the
camera entirely — cool in the specific way that requires not caring at all.
```

### `offduty2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same woman in her mid-twenties, warmer register: an oversized grey hoodie
over bike shorts, an iced coffee held loosely, hair in a low claw clip. Barely
there makeup. Expression: a small, private half-smile, eyes elsewhere, entirely
unbothered by being looked at.
```

### `offduty3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her early twenties, in yesterday's outfit — a crumpled
oversized band shirt worn as a dress, unlaced boots, sunglasses on despite being
indoors, hair a genuine mess rather than a styled one. Expression: detached to
the point of vacant, staring just past the lens, not performing coolness so much
as simply not registering the camera at all.
```

---

## PILATES PRINCESS — treatment C · effort 1.3, tradition +0.4, family +0.5,
## height +0.2, hot 7.0, crazy 4.5
*(PDF: Pilates girl / Balletcore wellness — pilates, hareket, athleisure,
sakin; new archetype — distinct from Gym Girl (muscle, performance, disciplined
grind): this one is soft movement, matching sets, and a slightly cult-like
devotion to the reformer)*

### `pilates1.webp` · textbook
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her late twenties, lean and long-limbed rather than
muscular, in a matching sage-green ribbed bra top and full-length leggings, grip
socks, hair in a sleek low bun. Dewy, barely-there makeup. A yoga mat rolled under
one arm. Expression: serene, faintly self-satisfied, chin slightly lifted — the
specific calm of someone who has already done more today than you have.
```

### `pilates2.webp` · variation
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
The same woman in her early thirties, post-class: an oversized cream half-zip
over the same leggings, hair down and slightly damp at the edges, a large
smoothie in one hand. Expression: mid-conversation, warm and animated, clearly
telling someone about her class whether they asked or not.
```

### `pilates3.webp` · edge case
```
Full-length portrait photograph, standing, head to feet fully inside the frame,
subject placed right of centre with clear negative space on the left third. 3:4
vertical portrait aspect ratio. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp focus,
evenly lit from head to feet. Photorealistic. Cast a genuinely beautiful woman with
strong, memorable features and clear healthy skin. A fictional person who does not
resemble any real or public figure. No text, no logos, no watermark, no border.
Soft key light from camera left with generous fill, one gentle rim light. Warm,
natural colour grade. f/2.5. Minimal or no makeup and simple unstyled hair — but
flattering light, healthy glowing skin, light retouching so she looks well and
rested. CRITICAL: low effort means low styling, not low attractiveness — she must
still be a strikingly good-looking woman. Do NOT make her plain, tired, or ordinary.
A beautiful woman in her late twenties, in a full matching pastel-lilac set,
grip socks with a cat print, a resistance band looped over one shoulder like an
accessory. Expression: intense, slightly evangelical, mid-sentence with both hands
raised as if demonstrating a stretch — one class away from starting a wellness
cult, in the nicest possible way.
```

---

# The 8 interstitials

Joke cards, not portraits — spine and treatments do **not** apply. All eight are
already generated and in place. `gay` and `gay2` use the real meme images.

---

## Wiring them up

```js
// images.js
goth      : ["assets/img/goth1.webp", "assets/img/goth2.webp", "assets/img/goth3.webp"],
corporate : ["assets/img/corporate1.webp", "assets/img/corporate2.webp", "assets/img/corporate3.webp"],
nerd      : ["assets/img/nerd1.webp", "assets/img/nerd2.webp", "assets/img/nerd3.webp"],
cleangirl : ["assets/img/cleangirl1.webp", "assets/img/cleangirl2.webp", "assets/img/cleangirl3.webp"],
gymgirl   : ["assets/img/gymgirl1.webp", "assets/img/gymgirl2.webp", "assets/img/gymgirl3.webp"],
grunge    : ["assets/img/grunge1.webp", "assets/img/grunge2.webp", "assets/img/grunge3.webp"],
comfort   : ["assets/img/comfort1.webp", "assets/img/comfort2.webp", "assets/img/comfort3.webp"],
oldmoney  : ["assets/img/oldmoney1.webp", "assets/img/oldmoney2.webp", "assets/img/oldmoney3.webp"],
coquette    : ["assets/img/coquette1.webp", "assets/img/coquette2.webp", "assets/img/coquette3.webp"],
academia    : ["assets/img/academia1.webp", "assets/img/academia2.webp", "assets/img/academia3.webp"],
cottagecore : ["assets/img/cottagecore1.webp", "assets/img/cottagecore2.webp", "assets/img/cottagecore3.webp"],
y2k         : ["assets/img/y2k1.webp", "assets/img/y2k2.webp", "assets/img/y2k3.webp"],
offduty     : ["assets/img/offduty1.webp", "assets/img/offduty2.webp", "assets/img/offduty3.webp"],
pilates     : ["assets/img/pilates1.webp", "assets/img/pilates2.webp", "assets/img/pilates3.webp"]
```

```bash
node build.js
```

Slots left as `""` keep rendering their dashed placeholder, so partial sets ship fine
— generate them in whatever order suits you.
