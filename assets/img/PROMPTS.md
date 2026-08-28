# Image generation brief

24 archetype portraits (8 types × 3 variants) plus 8 interstitials. **32 files total.**

---

## The mistake this file exists to correct

The first version of this brief said *"photorealistic, natural skin texture, visible
pores, no beauty retouching or skin smoothing"* and told the generator to drift back
toward *"less polished, editorial not commercial"*. Every one of those instructions
forbids the thing an attractive portrait needs. The result was eighteen women who all
looked like the same tired documentary subject, and the "plain good looking" type came
out plain *ugly* — which is not a type, it is a failure.

**The correction, and the single most important line in this file:**

> Attractiveness is not the variable. Every woman in this set is beautiful. What
> changes between archetypes is **styling, effort and energy** — never how good
> looking she is. Cast a beautiful woman, then style her to the type. Never cast a
> plain woman and call it a type.

A hot-5 archetype is not an ugly woman. She is a beautiful woman who spent four
minutes getting ready and would rather be reading.

---

## How to use this

Every prompt is **BASE SPINE + TREATMENT + SUBJECT**. Paste all three, in that order.
The spine is what makes 24 separate generations look like one designed set.

### File specs

Convert before committing: **1024 px wide, 3:2, WebP quality 82** — at full PNG size
the 32-image set blows past the 16 MB artifact ceiling once `build.js` inlines it.

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

## BASE SPINE — paste before every archetype prompt

```
Portrait photograph, waist-up, subject placed right of centre with clear negative
space on the left third of the frame. Background: flat, plain, very dark plum-black
(#17090F) — no props, no set, no texture behind her. 85mm lens look, sharp on the
eyes. 3:2 landscape aspect ratio. Photorealistic. Cast a genuinely beautiful woman
with strong, memorable features and clear healthy skin — this is a casting decision
and it does not change between archetypes. A fictional person who does not resemble
any real or public figure. No text, no logos, no watermark, no border.
```

---

## TREATMENT — pick one, by archetype

### A · CAMPAIGN — for The Model and The Baddie
```
Large soft key light close to camera with a reflector filling the shadows — flattering
and low-contrast on the face — plus one hard rim light separating her from the
background. Rich saturated colour grade. f/1.8. High-end: professionally styled hair,
flawless makeup, campaign-grade retouching. She must read instantly as a 9 out of 10.
```

### B · POLISHED — for The Gothic and The Litigator
```
Soft key light from camera left at 30 degrees with gentle fill, one rim light on the
far shoulder. Clean colour grade. f/2.0. Deliberately styled and well made up, but
styled to a personality rather than to a campaign — the look is precise, not glossy.
Beautiful, composed, finished. Retouched enough that she looks rested.
```

### C · UNDERSTATED — for The Nerd, Plain Good Looking, The Valkyrie, The Comfort Class
```
Soft key light from camera left with generous fill, one gentle rim light. Warm, natural
colour grade. f/2.0. Minimal or no makeup and simple unstyled hair — but flattering
light, healthy glowing skin, and light retouching so she looks well and rested.
CRITICAL: low effort means low STYLING, not low attractiveness. She must still be a
strikingly good-looking woman — the kind people describe as "she doesn't even try".
Do NOT make her plain, tired, washed out, or ordinary.
```

If a render comes back dull, add:
*"More beautiful. Better casting. Flattering light and healthy skin — she should be
the best-looking person in any room, just not dressed up for it."*

---

# The 8 archetypes

- **1 · textbook** — the pure form. Answers land almost on the archetype.
- **2 · variation** — recognisably the type, one thing off-spec.
- **3 · edge case** — barely qualifies; the type stretched to its far edge.

Which one shows is decided by how far the user's answers sit from the archetype centre
in six-dimensional space, split at that type's distance terciles — each comes up almost
exactly a third of the time.

---

## THE MODEL — treatment A · effort 2.6, hot 9.2 · **DONE, do not regenerate**

## THE BADDIE — treatment A · effort 3.0, hot 9.3 · **DONE, do not regenerate**

---

## THE GOTHIC — treatment B · effort 2.2, room: corner, hot 7.5, crazy 9.0

### `gothic1.png` · textbook
```
A strikingly beautiful woman in her mid-twenties, slim, pale porcelain skin, dressed
entirely in black — high-necked long-sleeved top, silver rings on four fingers, a small
septum hoop. Jet-black hair, blunt fringe cut straight across the eyebrows, glossy and
sharply cut. Precise dark eyeliner and a matte deep-plum lip, expertly done. Expression:
level, unblinking, a very slight smile at one corner of the mouth that does not reach
the eyes. Direct eye contact held one beat too long. Genuinely gorgeous and slightly
frightening — both at once.
```

### `gothic2.png` · variation
```
A beautiful woman in her late twenties, slim, the same dark world but softened — a
charcoal knit cardigan over a black slip dress, one delicate silver pendant. Black hair
grown out with two inches of natural brown at the roots, tucked behind one ear. Eyeliner
smudged from a long day rather than from carelessness. Expression: thoughtful, lips
slightly parted as if she was about to say something and thought better of it. Warm,
intelligent, quietly beautiful.
```

### `gothic3.png` · edge case
```
A beautiful woman in her early twenties, slim, black clothing worn hard — a faded band
t-shirt, chipped black nail varnish, dark hair loose and deliberately undone. Almost no
makeup, and she does not need any. Expression: wired and slightly manic, eyebrows up, a
wide unsettling grin, leaning into the lens. Too much energy for the frame to hold. The
beauty is obvious; the stability is the question.
```

---

## THE LITIGATOR — treatment B · effort 2.4, room: edges, hot 7.2, crazy 5.2

### `litigator1.png` · textbook
```
A beautiful woman in her early thirties, curvy and solidly built, in an immaculately
tailored navy blazer over a white shirt buttoned to the second button. Dark hair cut to
a precise shoulder-length bob, glossy. Discreet expert makeup, a steel watch, small pearl
studs. Expression: composed, one eyebrow fractionally raised — the look of someone who
has already found the flaw in what you said and is deciding whether to mention it. Arms
folded, chin level. Formidable and extremely attractive.
```

### `litigator2.png` · variation
```
A beautiful woman in her mid-thirties, curvy, at the end of a long day — blazer off and
over one shoulder, sleeves pushed up, top button undone, hair escaping the bob. Reading
glasses pushed up onto her head. Expression: dry, half-smiling, exhaling. Warm and tired
rather than sharp, and better looking for it. Still visibly the most organised person in
any room she enters.
```

### `litigator3.png` · edge case
```
A beautiful woman in her early thirties, fuller-figured, in a sharply cut burgundy suit
with a silk camisole underneath. Bold red lip, gold jewellery, hair in loose waves rather
than a bob. Expression: openly amused, chin tilted down, looking up at the lens through
her lashes. The tailoring says lawyer; everything else says she owns the firm. Far more
glamorous than the type usually runs.
```

---

## THE NERD — treatment C · effort 0.4, room: corner, hot 6.0, crazy 4.2

### `nerd1.png` · textbook
```
A genuinely beautiful young woman in her early twenties, slim and small-framed, wearing
large round tortoiseshell glasses. Dark hair in a messy bun held up with a pencil, a few
strands escaping. Faded graphic t-shirt under an open flannel shirt. No makeup at all,
a scatter of freckles, clear glowing skin. Expression: mid-sentence and lit up, eyebrows
raised, explaining something she cares about far more than you do. IMPORTANT: she is
beautiful and has simply never thought about it — do not make her plain or awkward.
```

### `nerd2.png` · variation
```
The same woman in her mid-twenties, glasses off and folded in one hand, hair brushed out
and down. A simple fitted dark green sweater. Expression: quietly pleased and a little
self-conscious, a small closed-mouth smile, looking straight at the lens. This is the
version of her twenty minutes into a good conversation, when she stops hiding — and the
whole joke of this archetype is that she is stunning and nobody noticed for months.
```

### `nerd3.png` · edge case
```
A beautiful young woman in her early twenties, very slim, glasses slightly askew, hair
half out of its bun. An oversized university hoodie. Expression: over-caffeinated and
locked in, staring at the lens with the flat intensity of hour thirty of a deadline.
Not tired-looking, not unwell — wired. Still obviously good looking underneath the
chaos. This is the Nerd with the crazy dial turned up.
```

---

## PLAIN GOOD LOOKING — treatment C · effort 0.7, room: edges, hot 7.0, crazy 4.5

**This is the type the first attempt got most wrong.** "Plain" describes the styling,
not the face. She is the best-looking woman in this entire set and she is wearing a
jumper.

### `girlnextdoor1.png` · textbook
```
An exceptionally beautiful woman in her mid-twenties, softly curvy, completely unstyled
— clean hair worn down with no product, no makeup whatsoever, no jewellery, a plain
cream crew-neck jumper. Flawless clear skin, perfectly even symmetrical features,
nothing exaggerated anywhere. Expression: relaxed, open, an easy natural smile that
reaches the eyes, looking straight at the lens and comfortable being looked at. She
would look exactly like this at seven in the morning. CRITICAL: no makeup means no
makeup, NOT plain — she must be immediately, obviously beautiful.
```

### `girlnextdoor2.png` · variation
```
The same beautiful woman in her late twenties, dressed up for once — a simple black
dress, one thin gold necklace, a small amount of makeup that mostly just evens things
out. Hair pinned back on one side. Expression: warm, slightly amused at the effort she
has made, head tilted. The same person as the first image, at a wedding, and everyone
there has noticed.
```

### `girlnextdoor3.png` · edge case
```
A breathtaking woman in her mid-twenties, curvy, wearing a plain white t-shirt and
nothing else of note — no makeup, no jewellery, hair simply down. Strong symmetrical
features, thick glossy natural hair, unusual striking eye colour. Expression: calm,
direct, almost blank. The joke of this image is that absolutely nothing has been done
to her and she is still the most beautiful woman in the set.
```

---

## THE VALKYRIE — treatment C · effort 1.0, room: centre, hot 6.5, crazy 7.0

### `valkyrie1.png` · textbook
```
A beautiful woman in her late twenties, tall and powerfully built — broad shoulders,
strong arms, an athlete's frame, substantial and solid rather than soft. Long
dark-blonde hair loose. A simple fitted olive t-shirt. Minimal makeup, healthy glowing
skin. Expression: head back, laughing openly from the chest, entirely unselfconscious.
She fills the whole frame and is not apologising for it. Strong and genuinely
good-looking — power and beauty in the same person, not a trade between them.
```

### `valkyrie2.png` · variation
```
A beautiful woman in her early thirties, tall and heavily built, hair braided back tight
against her head. A sleeveless black top, one tattoo on the upper arm. Expression: not
laughing this time — level, direct, chin slightly down, arms crossed. Still warm around
the eyes, but the message has changed. This is the version of her that ends an argument
by standing up.
```

### `valkyrie3.png` · edge case
```
A beautiful woman around thirty, tall but curvy rather than muscular, in a loose dark
jumper, hair long and unbrushed. Expression: unsettled and unpredictable — a wide fixed
smile with tension around the eyes, leaning slightly out of frame, weight on the back
foot. Very tall, quite soft, and something is going on behind the face. Attractive, and
you would not relax around her.
```

---

## THE COMFORT CLASS — treatment C · effort 0.8, room: edges, hot 5.5, crazy 5.5

### `comfort1.png` · textbook
```
A beautiful woman in her late twenties, heavy-set and soft, with a lovely open round
face, warm eyes and wonderful skin. Hair in a simple low bun with pieces falling out.
A large oatmeal knitted cardigan over a plain top. No makeup. Expression: an easy
unhurried smile, eyes crinkled, entirely at ease. The specific calm of someone with
nothing to prove to anybody in the room. Genuinely lovely to look at — warmth is the
point, not a consolation prize.
```

### `comfort2.png` · variation
```
The same woman in her early thirties, heavy-set, hair down and freshly washed, in a deep
green wrap dress with small gold earrings — dressed for something. A little makeup, well
done. Expression: laughing at something just off camera, one hand half raised as if
waving off a compliment. More energy and more polish than the first image, the same
fundamental unbotheredness. Beautiful and glowing.
```

### `comfort3.png` · edge case
```
A pretty woman in her mid-twenties, shorter and heavy-set, in a plain grey hoodie with
the hood down, hair flat and unstyled. Expression: neutral to the point of blank, mouth
closed, eyes slightly unfocused, looking past the camera. Not unhappy, not unwell — just
switched off. Low on every axis the chart measures, which is exactly the region of the
model that produces this slot. Still a good-looking face; the lights are simply off.
```

---

# The 8 interstitials

Joke cards, not portraits — the spine and treatments do **not** apply. All eight are
already generated and in place. `gay` and `gay2` use the real meme images.

---

## Wiring them up

```js
// images.js
scared : "assets/img/scared.webp",
model  : ["assets/img/model1.webp", "assets/img/model2.webp", "assets/img/model3.webp"],
```

```bash
node build.js
```

Slots left as `""` keep rendering their dashed placeholder, so partial sets ship fine.
