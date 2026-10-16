# Writing a new case

Every case (chapter) is one JavaScript file in `src/chapters/` that calls
`P.registerChapter({...})`. The engine handles walking, dialogue, the Case File,
Shawn-Vision, saving, Henry's hint line, banter, the map, and psychic revelations.
Your file supplies the story.

The fastest way to start is to copy `src/chapters/_template.js`, which is a small
but complete, playable case.

## 1. Register the file

1. Copy `src/chapters/_template.js` to `src/chapters/ch4_your_title.js`.
2. Add a script tag for it in `index.html`, inside the `<!--SCRIPTS-->` block, after the
   other chapters (before `src/main.js`).
3. Open `index.html?debug` in a browser. The debug flag logs a warning if your case never
   paints a pineapple, or if a required field is missing.
4. When it works, run `python3 tools/build.py` to regenerate `dist/psych.html`.

## 2. Follow the episode structure

Each case should feel like an episode of the show. The checklist:

| Beat | What it means here | Engine pieces |
|---|---|---|
| Cold open | A flashback to young Shawn and Henry. Henry teaches a lesson; Shawn takes a memory test. | `g.flashback(true)`, a flashback scene with `noShawn: true`, `g.memoryTest()` |
| Title card | `CASE N: TITLE` | `g.card({ kicker, title, sub })` |
| The hook | The case reaches Shawn and Gus (TV, a newspaper, or they witness it). | `extend.office`, or open on the scene itself |
| Crime scene | Lassiter shuts them out; Juliet is friendlier. Witnesses, observation. | scenes, actors, hotspots, `g.clue()` |
| Without permission | A way to see what you're not supposed to: a guard to sneak past, a back window, a distraction. | `guard: {...}` on an actor, flags, `blockers` |
| First vision | Shawn "has a vision" for Chief Vick and gets hired. | a revelation with 2-3 steps |
| Side quests | Witnesses who won't talk until you help them. Chains are good: A needs B, which needs C. | items, `onPresent`, flags, objectives |
| Food | Shawn and Gus are always hungry. Give them 2-4 snacks to find. | `snacks`, `g.snack()` |
| Juliet | 2-3 hidden gifts (Shawn-Vision `secret: true` hotspots work well). | `gifts`, `g.gift()` |
| The twist | Something reframes the case. Ideally Henry's cold-open lesson pays off. | `g.flashback(true)` + a line from `younghenry` |
| Final vision | Everyone gathered. 4-5 steps, each proved by a clue. | a revelation |
| Epilogue | Henry, food, maybe Juliet, then `g.complete()`. | |
| Pineapple | Every case paints at least one pineapple somewhere in its own scenes. Background only, never interactive. | `R.pineapple(x, X, Y, size)` in a `bg` painter |

## 3. The chapter object

```js
P.registerChapter({
  id: 'ch4', number: 4, title: 'MY CASE', tagline: 'One line for the case select screen.',
  pineapple: { scene: 'lobby', note: 'On the fruit stand.' },   // required: where you hid it
  cast: { ... },        // new characters (see section 5)
  clues: { ... },       // evidence, shown in the Case File
  items: { ... },       // usable things (quarters, keys, a plate of ribs)
  gifts: { ... },       // things Shawn can give Juliet
  snacks: { ... },      // things Shawn and Gus can eat
  scenes: { ... },      // this case's locations (section 4)
  revelations: { ... }, // psychic visions (section 7)
  hints: [ ... ],       // Henry's hint ladder (section 8)
  banter: [ ... ],      // extra ambient Shawn/Gus exchanges for this case
  map: { ... },         // map pins for this case's locations
  where: { ... },       // where recurring cast are right now (section 6)
  topics: { ... },      // case-specific conversation topics for recurring cast
  observe: { ... },     // case-specific Shawn-Vision lines for recurring cast
  reactions: { ... },   // how recurring cast react when shown a clue
  extend: { ... },      // add hotspots/actors/onEnter to shared scenes (office, station, henry, morgue)
  onLoad(g) { },        // optional: runs when the case starts or a save is resumed
  async start(g) { ... } // the cold open; must end by moving to a scene with g.goto()
});
```

Evidence, item, gift, and snack entries share one shape:

```js
clues: {
  cut_flap: { name: 'Cut From the Inside', icon: 'fabric', from: 'the tent',
              desc: 'Shown in the Case File.', zoom: true },   // zoom: play the Shawn-Vision lens when found
},
gifts: {
  seaglass: { name: 'Heart-Shaped Sea Glass', icon: 'seaglass', romance: 1, desc: '...',
              give: async (g) => { await g.say('juliet:happy', '...'); } },
},
```

Icons are names from `P.ICONS` in `src/engine/props.js` (note, photo, chip, fabric, lock,
footprint, key, money, receipt, cooler, mask, tooth, pill, bottle, camera, ticket, phone,
shell, seaglass, flower, badge, map, magnifier, cup, glove, watch, ring, gem, candle, fuse,
book, letter, sauce, spoon, knife, wax, sand, quarters, shaveice, donut, taco, burger, ribs,
pie, plush, heart, sunglasses, hat, feather, tape, card, calendar, recording, vial, leaf,
button, wrench, contract, timer, necklace, chalk, spray, scroll), or a function `(ctx) => {}`
that draws into a 16x16 box.

## 4. Scenes

The screen is 320x180 pixels. Characters stand with their feet on the floor band,
usually y = 132..172.

```js
scenes: {
  lobby: {
    name: 'Hotel Lobby',             // shown in the HUD (string or (g) => string)
    width: 480,                      // wider than 320 scrolls with Shawn
    music: 'mansion',                // a song name, or (g) => name
    floor: { x0: 10, x1: 470, y0: 134, y1: 172 },
    blockers: [{ x: 200, y: 134, w: 40, h: 10 }],   // no-walk rectangles (feet coordinates)
    entries: { map: { x: 30, y: 152, face: 'right' }, kitchen: { x: 300, y: 140 } }, // spawn points by previous scene
    variant: (g) => (g.flag('night') ? 'night' : 'day'),  // repaints the cached background when it changes
    bg(x, o) { /* paint once per variant; o.W, o.v, o.g */ },
    anim(x, t, o) { /* animated layer, drawn every frame under the actors; subtract o.cam */ },
    overlay(x, t, o) { /* drawn over the actors (darkness, rain, flashes) */ },
    update(sc, dt, g) { /* per-frame logic */ },
    props: [{ y: 140, draw: (x, cam, t, g) => {} }],     // depth-sorted with the actors
    hotspots: [ ... ],
    actors: [ ... ],
    onEnter: async (g, { first, from }) => { },
    noGus: false,           // true: Gus stays behind
    shawnCast: 'gus',       // play this scene AS someone else (the case 3 basement)
  },
}
```

Painting helpers live on `P.props` (`R` in the chapter files) and `P.G`. Useful ones: `sky`,
`ocean`, `sand`, `grass`, `wall`, `floor`, `window`, `door`, `sign`, `poster`, `frame`, `desk`,
`computer`, `cabinet`, `bookshelf`, `couch`, `plant`, `palm`, `tree`, `tent`, `crimeTape`,
`car`, `stand`, `arcade`, `lamp`, `crate`, `barrel`, `fence`, `pineapple`, `darkness`, `rain`.
Every painter takes integer pixel coordinates. Look at the existing chapters for examples.

### Hotspots

```js
{ id: 'flap', name: 'Slashed Back Flap', x: 148, y: 34, w: 28, h: 80, walk: [162, 136],
  look: async (g) => { ... },   // Shawn-Vision / right-click / Q
  use: async (g) => { ... },    // click / E
  clue: (g) => !g.hasClue('flap_cut_inside'),   // gold sparkle in Shawn-Vision while true
  secret: true,                 // only visible in Shawn-Vision (great for Juliet gifts)
  show: (g) => g.flag('x'),     // hide until true
  exit: 'tent',                 // makes it a door; 'map' opens the map
  before: async (g) => false,   // for exits: return false to block
  verb: 'Slip into the',        // HUD label prefix
  noFocus: true,                // big backdrop hotspot: mouse-only, never keyboard-focused
}
```

### Actors

```js
{ id: 'gil', cast: 'gil', x: 112, y: 150, face: 'right',
  idle: 'crossed',              // any pose name in P.Poses (sit, crossed, think, sitIdle...)
  prop: 'chipflip',             // animated hand prop: chipflip, coinflip, smoke, steam, sweat, zzz
  walk: [140, 152],             // where Shawn stands to talk
  show: (g) => !g.flag('arrested'),
  talk: async (g) => { ... },
  observe: async (g) => { ... },
  guard: {                      // optional: turns on a clock and catches Shawn in its zone
    zone: [250, 318], zoneY: [130, 143], range: 80, reset: [226, 156],
    pattern: [{ face: 'left', t: 3.2 }, { face: 'right', t: 2.8, say: ['Nice wave!'] }],
    off: (g) => g.flag('hired'),
    onCaught: async (g) => { ... },
  },
  draw: (x, sx, sy, actor) => {}, h: 30,   // fully custom-drawn actor (the goat in case 2)
}
```

## 5. Characters

Characters are generated from a description; no image files are needed. The same definition
drives the walking sprite and the dialogue portrait.

```js
cast: {
  gil: {
    name: 'Gil Hazelton', short: 'Gil', h: 57,             // height in pixels (kids ~38)
    build: 'stout',            // slim avg fem big huge stout kid
    skin: 'tan',               // pale light rosy tan olive brown dark deep, or a hex colour
    jaw: 'avg',                // avg round long soft
    eyes: '#3a5a7a',
    hair: { style: 'pompadour', color: 'sandy' },
    face: { stubble: true, mustache: 'gray', goatee: 'gray', beard: 'white',
            glasses: 'round' | 'square' | 'sun', lashes: true, lips: '#c8506a', freckles: true, wrinkles: true },
    top: { type: 'blazer', color: '#efe6cf', shirt: '#ff8a5a', tie: '#7a2030', apron: '#f4ecd6' },
    bottom: { type: 'pants', color: '#e8dfc8' },           // pants jeans shorts skirt
    shoes: '#b8865a',
    acc: ['chain', 'badge', { type: 'cap', color: '#e43b44', backwards: true }],
    voice: { pitch: 1.05 },    // dialogue blip pitch
    color: '#ffb070',          // name colour in dialogue
    portrait: { bg: '#3a2a1a', frame: '#ffb070', base: 'smug' },
  },
}
```

- Hair styles: spiky buzz slick ponytail bob gray short crew balding surfer pompadour bun long
  curly beehive swoop mohawk afro bald.
- Tops: overshirt shirt polo suit blazer tux hawaiian uniform labcoat tee tank hoodie sweater
  wetsuit dress muumuu vest.
- Accessories: badge holster lei chain tooth pearls sapphire watch bowtie whistle scarf camera
  bag sash stethoscope, and head items cap chefhat cowboy fedora turban bucket flower shadeshead
  headband beanie tiara earrings hoops monocle.
- Expressions for dialogue (`'gil:smug'`): neutral happy smile smug angry surprised sad worried
  closed psychic stern flirty eating.

Use `tools/sheet.html?ids=gil` and `tools/portraits.html?ids=gil` (with your chapter loaded via
`&extra=../src/chapters/ch4_your_title.js` for portraits) to preview characters.

The recurring cast (shawn, gus, lassiter, juliet, vick, henry, mcnab, woody, youngshawn,
younghenry) are defined in `src/world/cast.js`.

## 6. Shared locations and the recurring cast

Psych HQ (`office`), SBPD (`station`), Henry's house (`henry`), and Woody's morgue (`morgue`)
are defined once in `src/world/common.js`.

- `where` decides where recurring characters are right now:
  `where: { lassiter: (g) => g.flag('hired') ? 'station' : 'beach' }`. Shared scenes show
  Vick/Lassiter/Juliet/McNab only when `where` returns that scene's home (`'station'`); your
  scenes should use `show: (g) => P.where(g, 'lassiter') === 'beach'`.
- `topics` adds case-specific conversation options before the evergreen small talk:
  `topics: { vick: [ { id, label, when, keep, run } ], juliet: (g) => [...] }`.
- `extend` adds hotspots, actors, banter, or an `onEnter` to a shared scene for this case only.
  Use `hide: ['vick']` to remove a shared actor.
- `observe` overrides what Shawn-Vision says about a recurring character in this case.
- `reactions` handles evidence shown to a recurring character:
  `reactions: { juliet: { ricky_wax: async (g) => {...} } }`.
- To put an existing shared location on the map, add a pin for it in your `map`
  (case 2 does this for the morgue).

## 7. Revelations

A revelation is the "psychic vision" sequence. For each step, the player opens the Case File
and presents the clue that proves the point. A correct pick plays Shawn's gyrations and his
slightly garbled guesses, then the real answer. A wrong pick fizzles and raises Lassiter's
skepticism; three wrong picks end the vision, and the player can try again later.

```js
revelations: {
  hired: {
    requires: ['cut_flap', 'unforced_box'],      // engine refuses to start without these
    audience: ['vick', 'lassiter', 'juliet', 'gus'],
    intro: async (g) => { await g.stage({ shawn: [250, 158, 'right'], vick: [300, 146, 'left'] }); ... },
    steps: [
      {
        prompt: 'What proves the thief did not break in from outside?',  // shown in the banner and picker
        answer: 'cut_flap',                       // or an array of acceptable clue ids
        guesses: ["AN OUTSIDE JOB!", 'A SIDE JOB! A SIDE SALAD!'],   // the spirit world gets it slightly wrong
        final: 'IT WAS AN INSIDE JOB!',
        pointAt: 'lassiter',                      // Shawn points here for the landing
        moves: ['spin', 'kneel', 'flail'],        // optional choreography; random otherwise
        gusJoins: true,                           // Gus dances along
        after: async (g) => { ... },
        wrong: { ricky_wax: async (g) => { ... } },  // custom fizzles for tempting wrong answers
        hint: 'Gus nudges with this line after a wrong pick.',
      },
    ],
    outro: async (g) => { g.set('hired'); },
    fail: async (g) => { ... },                   // after three strikes
  },
},
```

Start one from a topic: `run: async (g) => { await g.revelation('hired'); return 'exit'; }`.
`g.revelation()` resolves to `true` on success.

Gyration moves: reel crouchVision tiptoe stagger kneel wave conduct horse hipsSway flail jazz
spin lunge frontArmsUp frontTemples frontStar frontSquat temple2 hop.

## 8. Henry's hints

Hints are an ordered ladder. When the player presses H (or visits Henry), the first entry whose
`when` is true is used. The first call gives `vague`; later calls give `specific`.

```js
hints: [
  { id: 'h_tent', when: (g) => !g.hasClue('cut_flap'),
    vague: 'The answer is in that tent.',
    specific: ['That officer turns to watch the surfers.', 'When his back is turned, walk in.'] },
  { id: 'h_final', when: (g) => !g.flag('finale_done'), vague: 'Go close it.', specific: 'Tell Karen.' },
],
```

Keep a final catch-all entry so Henry always has something to say.

## 9. Script API (`g`)

Every script function receives `g`. All dialogue and movement calls are `async`.

| Call | Does |
|---|---|
| `g.say('shawn:smug', 'Line', { phone: true })` | Dialogue with portrait. `'narrator'`, `'thought'`, or any name string also work. Colour tags: `{y}yellow{/}`, `{r}`, `{g}`, `{b}`, `{c}`, `{p}`, `{o}`. |
| `g.think('...')` | Shawn's inner voice. |
| `g.lines([[who, text], ...])` | Several lines. |
| `g.choose([{ text, value, disabled }], { title, cancel })` | A menu; resolves to the value. |
| `g.ask(who, text, options)` | A question that stays on screen above the menu. |
| `g.topics(npc, [{ id, label, when, once, keep, run }], { title, onPresent })` | Conversation menu loop. Adds "Show evidence..." and, for Juliet, "Give something...". `run` may return `'exit'`. `onPresent(g, id)` returns `true` if it handled the shown item. |
| `g.introGus(npc)` | Shawn introduces Gus by a ridiculous name. |
| `g.clue(id)`, `g.item(id)`, `g.take(id)`, `g.gift(id)`, `g.snack(id)` | Evidence, inventory, Juliet gifts, food. |
| `g.has(id)`, `g.hasClue(id)`, `g.hasItem(id)`, `g.hasGift(id)`, `g.hasAll([...])` | Checks. |
| `g.flag(n)`, `g.set(n, v)`, `g.unset(n)`, `g.inc(n)`, `g.once(n)` | Story flags (saved). `once` returns true the first time only. |
| `g.objective('...')` | Updates the current lead (shown in the HUD and Case File). |
| `g.romance(n)` | Adjust Juliet's meter (gifts do this automatically). |
| `g.walk(id, x, y, { run })`, `g.walkNoWait(...)`, `g.approach(id, targetId)` | Movement. |
| `g.face(id, 'left' or otherId)`, `g.place(id, x, y, face)`, `g.stage({ id: [x, y, face] })` | Positioning. `stage` fades and teleports a whole cast. |
| `g.anim(id, pose, ms)`, `g.stopAnim(id)`, `g.hop(id)`, `g.emote(id, '!')`, `g.bubble(id, text)` | Acting. Emotes: `! ? ... heart anger sweat idea music food sparkle`. |
| `g.spawn(id, def)`, `g.remove(id)`, `g.show(id, bool)`, `g.respawn(id)` | Actors. |
| `g.zoom({ at, icon, title, text })` | The Shawn-Vision close-up lens. `at` is a hotspot id, actor id, or `[x, y]`. |
| `g.card({ kicker, title, sub })`, `g.message(title, body)` | Title cards and panels. |
| `g.wait(ms)`, `g.fade(true, ms)`, `g.flash()`, `g.shake()`, `g.sfx(name)`, `g.music(name)` | Effects. |
| `g.goto(sceneId, { x, y, from, instant })`, `g.map()` | Travel. |
| `g.flashback(true or false)` | Sepia flashback filter. |
| `g.memoryTest({ seconds, question, options, answer, label })` | The cold-open "close your eyes" test; resolves true or false. |
| `g.revelation(id)` | Run a psychic vision. |
| `g.complete()` | Case closed screen. |

Songs: title office beach station vision flashback tension henry map finale bbq mansion complete.
Sound effects: select confirm cancel clue item whoosh zoom wrong correct phone pickup door step
car heart munch gulp psychic spirit reveal thunder caught boing stamp flash type gasp sparkle
drumroll hit dial page.

## 10. Test it automatically

`tools/walkthrough.js` contains scripted solution paths for the shipped cases (`T.ch1`, `T.ch2`,
`T.ch3`). They drive the real game through real interactions, with dialogue auto-advanced, and
check flags and clues along the way. Add a `T.ch4` for your case and run:

```sh
python3 -m pip install playwright && python3 -m playwright install chromium   # once
python3 tools/playtest.py ch4
```

`T.act(id, 'use' | 'look', [topic labels to pick], [clue ids to present])` is the workhorse.
A run that reports `errors: 0` means the case can be finished from start to case closed.
