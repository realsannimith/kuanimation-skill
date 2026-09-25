# The look (default: `wash`)

A simple watercolour cartoon in an open landscape, full frame, no stage: sunny by day,
deep indigo and rainy at night. It is the look of every film unless the user asks for
another (the alternatives follow below), and it suits any subject: build the world from
the moods and props, and draw anything new with `sh`/`mk` so it matches.

**Scenery (no outlines).** `stageBack(c, mood)` paints a watercolour sky (soft gradient
and faint pigment blooms), pale soft clouds, a cream horizon band, two layers of rolling
hills in muted greens and teal, small blob trees and dot flowers. `stageFloor` adds a
sandy road with a few dashes. Everything behind the action is outline-free and soft.

**Characters and props (thin ink).** Drawn with `sh`/`mk`: flat colour with a light
watercolour mottle and a thin, slightly wobbly dark ink outline (≈3 px at 1080p). Simple
shapes, dot or arc eyes, rosy cheeks, a soft shadow puddle under each figure.

**Sun and lights.** The sun is a flat yellow disc with a soft glow and a paler highlight,
no rays (`sunBurst` in this style). Lamps, lanterns and fires glow with `glowLight`.

**Moods.** `WASH_MOODS` = `[sky top, sky low, horizon, far hills, near hills, road]` for
`warm dawn sea green gold milk saffron dust forest` (day) and `night storm fire` (dark).
Dark moods switch to: deep indigo sky, clouds drawn only as faint light outlines, a band
of lumpy dark bushes on the horizon, a flat blue-grey ground plane, and light subtitles.
Add rain with `rain(c, tau, {n, al, slant})` and lights with `glowLight`.

**Palette.** sky `#9fcbe6`, meadow `green #78b35c`, teal `#35a0a0`, sand road `#e6d8bb`,
sun `yellow #f5c142`, warm `orange #e8843e`, `red #e0664a`, `pink #eca0aa`, roof `purple
#5f5094`, ink `#1d1a1c`. Use the names in `T`.

**Subtitles.** Plain hand lettering (Chalkboard SE; Khmer and other scripts fall back to a
script font such as Khmer MN automatically) centred at the bottom, no box: a soft halo for legibility, the unspoken part lighter, the spoken part
darker and underlined. On dark scenes the colours flip (light text, dark halo).

**Transitions.** Scenes fade softly through warm cream paper.

**Motion.** Players act: travel, hop, react (`action.js`). Poses are keyed drawings with
eased breakdowns (`span`, `keys`, `pop`); walking is `walk: phase`; scenery pops, rises
from behind the ground (`rise`), drops on strings (`signBoard`) or comes up on a stick
(`onStick`). The camera push is anchored near the top so signs stay in frame.

## Quality gates (wash)
- Outlines only on characters and props; sky, clouds, sun, hills and road have none.
- Smooth washes: no repeating blotch pattern, no hard-edged colour bands in the sky.
- Players ≈ 250 px tall at 1080p, standing on the road (y ≈ 760–900); key action in
  the centre third; the bottom 150 px stays clear for the subtitles.
- Night scenes readable: characters and lights stand out against the indigo.
- At most one saturated accent per scene besides the sun or a light.

## Alternative: `style: 'haze'` (hazy painted forests)

A painted animation background: misty, layered, muted, with thin warm-brown ink. Think
of a TV-animation establishing shot, seen from the side at stage height.

**Scenery.** `stageBack(c, mood)` paints, back to front: a hazy sky with a bright glow
in the upper right; soft cumulus with a faint pencil line along the top; a far ridge
deep in the mist; three forest bands built from `clump`s (scalloped cauliflower
canopies lit from the upper right, shaded underneath, trunks peeking below), each band
mixed further toward the haze the farther it is; two tall trees framing the edges; mist
between the layers. The `sea` mood swaps the middle forest for a pale sea with white
glints. `stageFloor` is dusty earth under a fringe of grass, with long scratchy brush
tracks, V-tufts and soft shadow pools, and a thin ink line on the grass edge.

**Characters and props.** `sh`/`mk`: flat colour, a soft cel shade (the side away from
the light dims by a multiply gradient), a whisper of grain, and a thin warm-brown ink
line (`#3a3024`, ≈2.4 px at 1080p). Trees use `treeT` (trunk + three clumps). Clouds as
props are soft and nearly line-free.

**Frame.** `stageFront` lays a vignette over every frame and lets the glow bleed in from
the upper right; scenes dissolve through pale mist.

**Moods.** `HAZE_MOODS` = `[sky top, sky low (haze), forest, ground, glow]` for
`warm dawn sea green forest gold saffron milk dust` (day) and `night storm fire` (dark:
blue-green night forest, moonlit or fire glow, light subtitles).

**Palette.** Muted: sage `green #86a077`, `greenDk #587258`, stone `#b3a88f`, dusty ground
`floor #b9906a`, terracotta `red #b35a48`, ochre `gold #cfa954`, dusty `blue #6a8eaa`,
`teal #5f928c`, ink `#3a3024`. Keep saturation low; let the glow do the brightening.

**Subtitles.** Avenir Next (other scripts fall back to a script font automatically), centred, no box, a soft halo; the spoken
part darker and underlined; flipped on dark scenes.

### Haze quality gates
- Depth reads at a glance: far layers pale and low-contrast, near layers darker with
  stronger ink; the glow corner is the brightest area of the frame.
- No wallpaper: canopy clumps vary in size and the forest line rolls.
- Everything muted; at most one saturated accent (a flag, a royal robe, a fire).
- Players ≈ 250 px tall at 1080p on the ground (y ≈ 760–900); bottom 150 px clear.

## Alternative: `style: 'paper'` (Paper Diorama)

Every scene is a small diorama built from cut coloured paper and
set inside a kraft-card shadow box.

**Paper cut-outs.** No outlines. Every shape (`sh`) has a torn, deckled edge, a pale cut
edge on the lit side, a darker edge in shade, the shared paper-fibre texture, and a soft
drop shadow cast down-right (light from the upper left). `lift` sets how far a shape floats
(0.5 flat on the sheet … 1.4 held off it). Depth comes from layering and shadow.

**Paper puppets.** Players and presenters are jointed like paper puppets: small brass
split-pins (`pin`) at shoulders and hips. Faces, eyes and mouths are fine dark-card lines
(`mk` draws ink-dark strokes thin, coloured strokes as paper strips).

**Palette (sun-washed paper).** terracotta `red #d9674a`, marigold `yellow #f2b233`, teal
`#2f8f8a`, indigo `navy #34427a`, blush `pink #f0a3a0`, sage `green #7fae6e`, kraft `floor
#c49a6c`, cream `white #f7f0e2`, ink `#3a2a22`. Use the names in `T`; never raw black.

**Backdrop.** `stageBack(c, mood)` builds a paper landscape: a sky sheet, torn white cloud
strips, and three bands of rolling paper hills in the mood's colours
(`warm dawn sea green night fire gold milk saffron dust storm forest`; add one to `MOODS`
as `[sky, a, b, c]`). The scene adds its own sun or moon (`sunBurst`, a paper disc).

**Ground and frame.** `stageFloor` lays a mood-tinted paper ground with a darker front
strip and a sewn stitch line. `stageFront` adds the shadow-box frame (walnut kraft,
rounded inner corners, inner shadow, washi tape on two corners). Between scenes a torn
kraft sheet sweeps down and lifts away.

**Subtitles.** A torn cream strip held by two pieces of washi tape; the first line (any
language) over the second in Avenir Next; the spoken part gets a yellow highlighter
swipe.

**Motion.** Players act: travel, hop, react (`action.js`). Poses are keyed drawings with
eased breakdowns (`span`, `keys`, `pop`); walking is `walk: phase`; scenery pops, rises
from behind the ground (`rise`), drops on strings (`signBoard`, `hangingMap`) or comes up
on a stick (`onStick`). The camera push is anchored near the top so signs stay in frame.

**Text in the picture.** Only names and years on signs. Words belong to the voice-over.

### Paper Diorama quality gates
- Every visible edge is torn paper with a shadow; no stray hard vector lines except the
  fine dark-card features (eyes, mouths, rigging, poles).
- Shadows all fall the same way (down-right). Nothing floats without one.
- Players ≈ 250 px tall at 1080p; key action in the centre third; nothing important in
  the bottom 190 px (subtitle strip) or hidden by the frame's 40 px border.
- Colours from `T` and the moods only; at most one saturated accent per scene.
- The torn sheet has fully lifted before the first subtitle appears.

## Alternative: `style: 'marker'`
`buildPlay(SCENES, {style: 'marker'})`: flat fills with a thick felt-tip outline, red
theatre curtains with a gold valance, a tiled perspective floor, watercolour-bloom
backdrops and a slate subtitle bar with gold karaoke. Same scenes, same code.
