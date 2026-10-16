# PSYCH: The Spirits Are Speaking

An unofficial, fan-made 16-bit adventure game inspired by the TV show *Psych*. Shawn and Gus
collect clues by talking to witnesses, solving side quests, and noticing things nobody else
does (with or without permission), then present the evidence to the SBPD as a "psychic
vision", complete with gyrations and the spirit world getting the answer slightly wrong first.

Everything is drawn and synthesized in code: the pixel art, the portraits, the chiptune
soundtrack and sound effects. No image or audio files.

## Play

- **Easiest:** open `dist/psych.html` in any modern browser (double-click it). It is one
  self-contained file and works offline.
- **From source:** open `index.html` (also works straight from the file system).

Click or press a key on the first screen to enable sound.

### Controls

| | Keyboard | Mouse / touch |
|---|---|---|
| Walk | Arrow keys or WASD | Click the ground |
| Interact (talk, use, enter) | E, Enter, or Space | Click a person or thing |
| Shawn-Vision (observe; reveals hidden details) | Q | Eye button, or right-click to observe |
| Case File (clues, items, gifts for Juliet, snacks, notes) | Tab or C | Folder button |
| Call Dad for a hint | H | Phone button |
| Skip text | Hold Shift | |
| Menu (settings, save & quit) | Esc | Menu button |
| Mute | M | |

The game autosaves at every scene change and every new clue. "Continue" on the title screen
picks up where you left off. Juliet's romance meter and your lifetime snack count carry over
between cases.

## The cases

1. **Hang Ten Grand.** The $10,000 purse for a surf contest vanishes from a locked judges' tent.
   Cold open: 1987 poker night, and Henry's lesson about tells.
2. **Rack of Lies.** A champion pitmaster drops dead at a BBQ cook-off, right after tasting his
   rival's sauce. Cold open: a street magician in 1989, and "watch the other hand."
3. **Seance & Sensibility.** A TV psychic, a stormy Montecito mansion, a blackout, and a missing
   sapphire. Cold open: a pawn shop in 1990, and the fog test.

Each case follows the shape of an episode: flashback cold open, title card, crime scene,
a way to look where you're not allowed, a first vision that gets Shawn and Gus hired, side
quests, a twist that pays off Henry's lesson, a final vision with everyone gathered, and an
epilogue. Each one also has hidden gifts for Juliet, snacks, Henry's hint line, Gus being
introduced by a ridiculous name, and a pineapple somewhere in the background.

## Add a case

See [docs/CHAPTER_GUIDE.md](docs/CHAPTER_GUIDE.md). In short: copy
`src/chapters/_template.js`, add a `<script>` tag for it in `index.html`, write your story
with the `g.say` / `g.clue` / `g.revelation` script API, then run `python3 tools/build.py` to
rebuild `dist/psych.html`.

## Project layout

```
index.html                 dev entry point (loads the scripts below in order)
src/engine/                core, pixel drawing, font, chiptune audio, sprites, portraits, props,
                           scenes, UI, case file, scripting API, revelations, flashbacks, map, game loop
src/world/                 recurring cast and shared locations (Psych HQ, SBPD, Henry's, the morgue)
src/chapters/              one file per case, plus _template.js
docs/CHAPTER_GUIDE.md      how to write a case
tools/build.py             bundles everything into dist/psych.html (and dist/artifact.html)
tools/walkthrough.js       scripted solution paths used by the automated playtests
tools/playtest.py          runs a walkthrough in headless Chromium (needs Playwright)
tools/sheet.html           character sprite preview sheet
tools/portraits.html       portrait preview sheet
```

## Testing

Each shipped case has an automated walkthrough that plays it from the cold open to "Case
Closed" through the real game logic (walking, conversations, evidence, revelations), and
fails on any script error or missed step:

```sh
python3 -m pip install playwright && python3 -m playwright install chromium   # once
python3 tools/playtest.py ch1      # or ch2, ch3, example
```

## Credits

A fan tribute. *Psych* and its characters belong to their respective owners; this project is
not affiliated with or endorsed by them. All art, music, story and dialogue here are original.
