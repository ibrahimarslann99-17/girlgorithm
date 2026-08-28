# Image generation brief

24 archetype portraits (8 types × 3 variants) plus 8 interstitials. **32 files total.**

Save each one as `assets/img/<slot>.png` using the filenames below, then fill in the
matching entry in `/images.js` and run `node build.js`.

---

## How to use this

Every archetype prompt is **STYLE SPINE + SUBJECT**. Paste the spine first, then the
subject block for the slot you're generating. The spine is what makes 24 separate
generations look like one designed set instead of 24 unrelated stock photos — don't
skip it or edit it between runs.

If Gemini drifts (too glamorous, too retouched, wrong crop), re-paste the spine and
add: *"Less polished. Real skin texture. Editorial, not commercial."*

### File specs

Generate at whatever size Gemini gives you, then convert before committing:
**1024 px wide, 3:2, WebP quality 82.** That takes a ~400 KB PNG down to roughly
20 KB with no visible loss at the size the slot actually renders.

```bash
# needs pillow:  pip install pillow
python3 -c "
from PIL import Image; import glob, os
for f in glob.glob('*.png'):
    im = Image.open(f).convert('RGB')
    if im.width > 1024: im = im.resize((1024, round(1024*im.height/im.width)), Image.LANCZOS)
    im.save(os.path.splitext(f)[0] + '.webp', 'WEBP', quality=82, method=6)
"
```

This matters. 32 portraits at full PNG size is about 13 MB, which becomes ~17 MB once
`build.js` base64-inlines them — over the 16 MB artifact ceiling. As WebP the whole
set lands under 1 MB. Commit the `.webp` files, not the PNGs.

---

## STYLE SPINE — paste before every archetype prompt

```
Editorial character portrait, waist-up, subject placed right of centre with clear
negative space on the left third of the frame. Single hard key light from camera
left at 45 degrees with deep shadow falloff, plus one narrow rim light on the far
shoulder. Background: flat, plain, very dark plum-black (#17090F) — no props, no
set, no texture behind her. Muted colour grade with a faint magenta bias in the
shadows. Fine 35mm film grain. 85mm lens look, f/2.8, sharp on the eyes. 3:2
landscape aspect ratio. Photorealistic, natural skin texture, visible pores, no
beauty retouching or skin smoothing. A fictional person who does not resemble any
real or public figure. No text, no logos, no watermark, no border.
```

---

# The 8 archetypes

Each type gets three portraits. Which one the site shows is decided by how far the
user's answers sit from that archetype's centre — split at its distance terciles, so
each of the three comes up almost exactly a third of the time.

- **1 · textbook** — the pure form. Answers land almost on the archetype.
- **2 · variation** — recognisably the type, one thing off-spec.
- **3 · edge case** — barely qualifies; the neighbouring archetype is bleeding in.

The edge-case briefs below are written from the actual input regions that produce
them, which is why they read strangely. That is correct — they should.

---

## THE MODEL — tall, slim, hot 9, crazy 7

### `model1.png` · textbook
```
A woman in her mid-twenties, very tall and lean with long limbs and sharp
collarbones. High cheekbones, strong jaw, dark hair pulled back flat and severe.
Wearing a plain black sleeveless top, no jewellery except one thin gold chain.
Expression: bored, unimpressed, looking slightly past the camera as if someone
behind it is taking too long. Shoulders square, posture effortless. She knows
exactly how she photographs and has stopped finding it interesting.
```

### `model2.png` · variation
```
A woman in her late twenties, very tall and lean, but caught mid-laugh with her
head tipped back slightly — the composure has cracked. Long dark hair loose and
slightly messy, one strand across her face. Wearing an oversized white men's shirt,
sleeves rolled. Expression: genuinely amused, teeth showing, eyes creased. Still
unmistakably a model's bone structure, just off duty and unguarded.
```

### `model3.png` · edge case
```
A woman around thirty, unusually tall and very thin, plain-featured rather than
striking — a long face, a slightly beaky nose, thin lips, no makeup. Mousy brown
hair in a low ponytail. Wearing a grey marl sweatshirt. Expression: flat, patient,
faintly tired, looking directly at the camera without performing for it. Height and
build read as "model" from across a room; the face does not. That contradiction is
the point of this image.
```

---

## THE GOTHIC — average-tall, slim, hot 7.5, crazy 9

### `gothic1.png` · textbook
```
A woman in her mid-twenties, slim, pale, dressed entirely in black — high-necked
long-sleeved top, silver rings on four fingers, small hoop in the septum. Dyed
jet-black hair with a blunt fringe cut straight across the eyebrows. Heavy dark
eyeliner, matte dark lipstick. Expression: level, unblinking, a very slight smile
at one corner of the mouth that does not reach the eyes. Direct eye contact held a
beat too long.
```

### `gothic2.png` · variation
```
A woman in her late twenties, slim, dark clothing but softened — a charcoal knit
cardigan over a black slip dress, one delicate silver pendant. Black hair grown out
with two inches of natural brown at the roots, tucked behind one ear. Smudged
eyeliner from a long day rather than a careful application. Expression: thoughtful,
mouth slightly open as if she was about to say something and reconsidered. Holding
a paperback closed against her chest with a finger keeping her place.
```

### `gothic3.png` · edge case
```
A woman in her early twenties, slim, dressed in scuffed black but with none of the
polish — an old band t-shirt with a cracked print, chipped black nail varnish,
tangled dark hair that has not been styled. No makeup at all. Expression: wired and
slightly manic, eyebrows up, a wide unsettling grin, leaning forward into the lens
with her weight on one shoulder. Too much energy for the frame to hold.
```

---

## THE LITIGATOR — tall-ish, curvy, hot 7, crazy 5

### `litigator1.png` · textbook
```
A woman in her early thirties, tall, curvy and solidly built, in an immaculately
tailored navy blazer over a white shirt buttoned to the second button. Dark hair
cut to a precise shoulder-length bob. Minimal makeup, a steel watch, small pearl
studs. Expression: composed, one eyebrow fractionally raised, the specific look of
someone who has already spotted the flaw in what you just said and is deciding
whether to mention it. Arms folded, chin level.
```

### `litigator2.png` · variation
```
A woman in her mid-thirties, tall and curvy, at the end of a long day — blazer off
and slung over one shoulder, shirt sleeves pushed up, top button undone, hair
escaping the bob. Reading glasses pushed up onto her head. Expression: dry,
half-smiling, exhaling. Warm and tired rather than sharp. Still visibly the most
organised person in any room she walks into.
```

### `litigator3.png` · edge case
```
A woman in her early thirties, tall and heavy-set rather than merely curvy,
wearing a sharply cut burgundy suit with nothing underneath the jacket but a
camisole. Bold red lip, gold jewellery, hair in loose waves rather than a bob.
Expression: openly amused, chin tilted down, looking up at the lens through her
lashes. The tailoring says lawyer; everything else says she owns the firm and does
what she likes. Far more glamorous than the type usually runs.
```

---

## THE NERD — short, slim, hot 6, crazy 4

### `nerd1.png` · textbook
```
A young woman in her early twenties, small and slight, wearing large round
tortoiseshell glasses that are slightly too big for her face. Dark hair in a messy
bun held with a pencil. Faded graphic t-shirt under an open flannel shirt. No
makeup, a few freckles. Expression: mid-sentence and enthusiastic, eyebrows raised,
hands not visible but clearly gesturing — explaining something she cares about far
more than you do. Slightly hunched forward.
```

### `nerd2.png` · variation
```
A young woman in her mid-twenties, small and slight, glasses off and folded in one
hand, hair actually brushed and down. Wearing a simple fitted dark green sweater.
Expression: quietly pleased and a little self-conscious, small closed-mouth smile,
looking straight at the camera. The version of her that happens twenty minutes into
a good conversation, when she has stopped hiding. Noticeably better looking than
the first impression suggested — that is the whole brief.
```

### `nerd3.png` · edge case
```
A young woman in her early twenties, very small and thin, glasses askew, hair half
out of a bun and static-frizzed. Three-day-old hoodie. Expression: hollow-eyed,
over-caffeinated, staring at the lens with the specific flat intensity of someone
on hour thirty of a deadline. Not sad — locked in. Slightly unnerving. The nerd
with the crazy dial turned up.
```

---

## PLAIN GOOD LOOKING — average height, curvy, hot 7, crazy 4.5

### `girlnextdoor1.png` · textbook
```
A woman in her mid-twenties, average height, softly curvy, entirely unstyled — clean
hair worn down with no product, no makeup, no jewellery. Plain cream crew-neck
jumper. Clear skin, even features, nothing exaggerated anywhere on her face.
Expression: relaxed, open, an easy natural smile with the eyes fully involved.
Looking directly at the camera, comfortable being looked at. She would look exactly
like this at seven in the morning.
```

### `girlnextdoor2.png` · variation
```
A woman in her late twenties, average height, softly curvy, dressed up slightly for
once — a simple black dress, one thin gold necklace, a small amount of makeup that
mostly just evens things out. Hair pinned back on one side. Expression: warm,
slightly amused at the effort she has made, head tilted. The same person as the
first image, at a wedding.
```

### `girlnextdoor3.png` · edge case
```
A woman in her mid-twenties, average height, curvy, still unstyled and unmadeup —
but genuinely striking rather than merely pleasant. Strong symmetrical features,
thick natural hair, an unusual eye colour. Plain white t-shirt. Expression: calm,
direct, almost blank. The joke of this one is that nothing has been done to her at
all and she is the best looking person in the frame anyway.
```

---

## THE BADDIE — short-ish, curvy, hot 9, crazy 8

### `baddie1.png` · textbook
```
A woman in her mid-twenties, on the shorter side, strongly curvy. Full glam: long
sculpted nails, dramatic lash extensions, sharp contour, glossy nude lip. Long
honey-toned hair with a centre part, styled to within an inch of its life. Gold
hoops, layered chains, a fitted black going-out top. Expression: chin up, one
eyebrow raised, looking down her nose at the lens. Completely unbothered. Phone
held loosely at chest height, screen facing away.
```

### `baddie2.png` · variation
```
A woman in her late twenties, shorter, curvy, glam dialled down to daytime — hair
scraped into a slick high bun, big sunglasses pushed up on her head, minimal makeup
but the nails and lashes are still immaculate. Oversized hoodie, gold jewellery
underneath. Expression: mid eye-roll, half a smirk, caught off guard and not
enjoying it. Running errands and still the most put-together person on the street.
```

### `baddie3.png` · edge case
```
A woman in her early twenties, slim rather than curvy, heavy glam makeup on a
narrow face — sharp liner, dark lip, long nails. Jet-black hair, several ear
piercings. Wearing black, not colour. Expression: intense and volatile, eyes wide,
head lowered slightly, jaw set. She has the styling of a baddie and the energy of
something considerably less fun. Visibly one bad text away from an incident.
```

---

## THE VALKYRIE — very tall, heavy-set, hot 6.5, crazy 7

### `valkyrie1.png` · textbook
```
A woman in her late twenties, very tall and powerfully built — broad shoulders,
thick arms, substantial frame, not soft. Long dark-blonde hair loose. Simple fitted
olive t-shirt. Expression: head back, laughing openly from the chest, completely
unselfconscious. Takes up the whole frame and is not apologising for it. Warmth and
physical presence in equal measure.
```

### `valkyrie2.png` · variation
```
A woman in her early thirties, very tall and heavily built, hair braided back tight
against her head. Sleeveless black top, one visible tattoo on the upper arm.
Expression: not laughing this time — level, direct, chin slightly down, arms
crossed. Still warm around the eyes, but the message is different. The version of
her that ends an argument by standing up.
```

### `valkyrie3.png` · edge case
```
A woman around thirty, very tall but curvy rather than heavy, in a loose dark
jumper. Hair long and unbrushed. Expression: unsettled and unpredictable — a wide
fixed smile with tension around the eyes, leaning slightly out of frame, weight on
the back foot. Very tall, quite soft, and something is going on behind the face.
The Valkyrie with the stability removed.
```

---

## THE COMFORT CLASS — average height, heavy-set, hot 5.5, crazy 5.5

### `comfort1.png` · textbook
```
A woman in her late twenties, average height, heavy-set and soft. Round face, warm
open features, hair in a simple low bun with pieces falling out. Wearing a large
knitted cardigan in oatmeal over a plain top. No makeup. Expression: an easy
unhurried smile, eyes crinkled, entirely at ease. The specific calm of a person
with nothing to prove to anybody in the room.
```

### `comfort2.png` · variation
```
A woman in her early thirties, average height, heavy-set, hair down and freshly
washed, wearing a deep green wrap dress and small earrings — dressed for something.
Expression: laughing at something just off camera, one hand half raised as if
waving off a compliment. More energy and more polish than the first image, same
fundamental unbotheredness.
```

### `comfort3.png` · edge case
```
A woman in her mid-twenties, short and heavy-set, in a shapeless grey hoodie with
the hood down. Hair flat and unstyled. Expression: neutral to the point of blank,
mouth closed, eyes slightly unfocused, looking past the camera. Not unhappy — just
switched off. Low on every axis the chart measures, which is exactly the region of
the model that produces this slot.
```

---

# The 8 interstitials

These are joke cards, not portraits, so the style spine does **not** apply.

Two of them (`gay`, `gay2`) exist as well-known internet meme images. If you want the
actual meme, use the actual meme — drop the file in and skip the prompt. Generating a
lookalike of a real person is both worse and not something I'll write a prompt for.
The briefs below are original illustrations that carry the same joke.

### `scared.png` — get your shit together
```
Bold graphic poster illustration, 4:3. A single crumpled paper coffee cup standing
upright on a plain surface, dented but not fallen over, lit by one hard overhead
light. Flat deep plum-black background. Limited palette: black, bone white, one hot
pink-red accent. Heavy grain, high contrast, screen-print feel. No text.
```

### `obese.png` — then lose the weight, bro
```
Graphic illustration, 4:3. An old cast-iron gym weighing scale, side on, needle
pinned all the way past the end of its dial. Flat deep plum-black background,
single hard light, long shadow. Limited palette: black, bone white, one amber
accent. Screen-print texture, heavy grain. No text, no numbers legible on the dial.
```

### `ugly.png` — which spell did he use
```
Graphic illustration, 4:3. A plain wooden wand lying on a dark surface, one faint
spark at its tip, the rest of the frame empty. Flat deep plum-black background,
single hard raking light. Limited palette: black, bone white, one hot pink-red
accent. Screen-print texture, heavy grain, slightly mystical but deadpan. No text.
```

### `gay.png` / `gay2.png` — why are you gay
```
Use the actual meme image. If you want an original instead:

Graphic illustration, 4:3. An empty TV interview chair under a single hard studio
light, a microphone on a stand angled toward it, nobody sitting in it. Flat deep
plum-black background. Limited palette: black, bone white, one hot pink-red accent.
Screen-print texture, heavy grain. No text.

For gay2, generate the same scene from a tighter crop with the microphone pushed
closer to the empty chair — the follow-up question.
```

### `homo.png` — FindMeAHomo listing
```
Graphic illustration, 4:3. A generic smartphone seen straight on, screen showing a
blank app store listing layout: a rounded square app icon placeholder, a row of
five stars, three grey bars where the description would be. All placeholder shapes,
no readable text anywhere. Flat deep plum-black background, single hard light.
Limited palette: black, bone white, one mint-green accent. Heavy grain.
```

### `cops.png` — pedo detected, calling the cops
```
Graphic illustration, 4:3. A police light bar seen head on in the dark, both lamps
lit, red on the left and blue on the right, lens flare and light bleed across the
frame. Nothing else visible. Flat black background. High contrast, heavy grain,
harsh and cheap-looking on purpose. No vehicle, no text, no insignia of any real
police force.
```

### `complex.png` — got some complexes there
```
Graphic illustration, 4:3. A wooden ruler snapped clean in half, both pieces lying
on a dark surface with the break facing the camera. Flat deep plum-black
background, single hard side light, long shadows. Limited palette: black, bone
white, one amber accent. Screen-print texture, heavy grain. No text, no legible
measurement markings.
```

---

## Wiring them up

```js
// images.js
scared : "assets/img/scared.png",
model  : ["assets/img/model1.png", "assets/img/model2.png", "assets/img/model3.png"],
```

Then:

```bash
node build.js
```

It inlines everything it finds, warns about paths listed but missing from disk, and
warns about files sitting in `assets/img/` that nothing references. Slots left as
`""` keep rendering their dashed placeholder, so partial sets ship fine — do them in
whatever order you like.
