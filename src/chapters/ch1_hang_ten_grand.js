'use strict';
/* ============================================================================
   CASE 1: HANG TEN GRAND
   The $10,000 purse for the Big Kahuna Surf Classic vanishes from a locked
   judges' tent. Lassiter likes the cocky surfer. The promoter has a tell.

   Episode structure:
     Cold open  - 1987 poker night: Henry teaches young Shawn about "tells".
     Act 1      - TV news hook, beach crime scene, sneak (or sweet-talk) into
                  the tent, first vision at SBPD -> hired.
     Act 2      - Missing mascot, the shave-ice side quest chain (find Dewey ->
                  quarters -> Leilani reopens -> witness + bribe for Sal),
                  costume under the pier, the chip, the realisation.
     Act 3      - Sunset revelation on the beach, chase, epilogue with Henry.
   Pineapple: on Auntie Leilani's shave ice sign (beach). Not interactive.
   ========================================================================== */
(function (P) {
  const G = P.G, U = P.U, R = P.props;

  /* ------------------------------------------------------------------ cast */
  const cast = {
    gil: {
      name: 'Gil Hazelton', short: 'Gil', h: 57, build: 'stout', skin: 'tan', jaw: 'avg', eyes: '#3a5a7a',
      hair: { style: 'pompadour', color: 'sandy' }, face: {},
      top: { type: 'blazer', color: '#efe6cf', shirt: '#ff8a5a', pocketSquare: '#ff8a5a' },
      bottom: { type: 'pants', color: '#e8dfc8' }, shoes: '#b8865a', acc: ['chain', 'shadeshead'],
      voice: { pitch: 1.05 }, color: '#ffb070', portrait: { bg: '#3a2a1a', frame: '#ffb070' },
    },
    ricky: {
      name: 'Ricky "Riptide" Ruiz', short: 'Ricky', h: 57, build: 'slim', skin: 'olive', jaw: 'avg', eyes: '#3a2a1a',
      hair: { style: 'surfer', color: 'dkbrown' }, face: { stubble: true },
      top: { type: 'tank', color: '#2a9ad8', stripe: '#fee761' },
      bottom: { type: 'shorts', color: '#ff6a3a' }, shoes: '#c99466', acc: ['tooth'],
      voice: { pitch: 0.95 }, color: '#7ad0ff', portrait: { bg: '#123a5a', frame: '#7ad0ff' },
    },
    leilani: {
      name: 'Auntie Leilani', short: 'Leilani', h: 52, build: 'stout', skin: 'brown', jaw: 'round', eyes: '#2a1a14',
      hair: { style: 'bun', color: 'salt' }, face: { lips: '#b04050' },
      top: { type: 'muumuu', color: '#e84a6a', pattern: 'flowers', pattern2: '#fff0a0' },
      bottom: { type: 'skirt', color: '#e84a6a' }, shoes: '#5a3a2a', acc: ['flower', 'lei'],
      voice: { pitch: 1.2 }, color: '#ff9ab0', portrait: { bg: '#4a1a2a', frame: '#ff9ab0' },
    },
    dewey: {
      name: 'Dewey Kealoha', short: 'Dewey', h: 50, build: 'slim', skin: 'tan', jaw: 'soft', eyes: '#3a2a1a',
      hair: { style: 'short', color: 'black' }, face: { freckles: true },
      top: { type: 'hoodie', color: '#7a3a8a' },
      bottom: { type: 'shorts', color: '#3a4a5a' }, shoes: '#e4e4e4', acc: [{ type: 'cap', color: '#e43b44', backwards: true }],
      voice: { pitch: 1.35 }, color: '#d8a0ff', portrait: { bg: '#2a1a3a', frame: '#d8a0ff' },
    },
    sal: {
      name: 'Sal "The Fish" Fusco', short: 'Sal', h: 55, build: 'stout', skin: 'olive', jaw: 'round', eyes: '#2a1a14',
      hair: { style: 'balding', color: 'black' }, face: { mustache: 'black', stubble: true },
      top: { type: 'vest', color: '#7a8a5a', shirt: '#d8d0c0' },
      bottom: { type: 'pants', color: '#4a4a5a' }, shoes: '#2a2228', acc: [{ type: 'bucket', color: '#8a9a6a' }],
      voice: { pitch: 0.7 }, color: '#b8c890', portrait: { bg: '#1e2a1e', frame: '#b8c890' },
    },
    fenwick: {
      name: 'Judge Hal "Moondoggie" Fenwick', short: 'Judge Fenwick', h: 55, build: 'avg', skin: 'rosy', jaw: 'avg', eyes: '#4a7ab0',
      hair: { style: 'long', color: 'white' }, face: { beard: 'white' },
      top: { type: 'tee', color: '#5ab0c8', graphic: '#fee761' },
      bottom: { type: 'shorts', color: '#d8c8a0' }, shoes: '#8a6a4a', acc: ['shadeshead', 'lei'],
      voice: { pitch: 0.8 }, color: '#a8f0ff', portrait: { bg: '#123a4a', frame: '#a8f0ff' },
    },
    ray: {
      name: 'Uncle Ray', short: 'Ray', h: 58, build: 'big', skin: 'light', jaw: 'round', eyes: '#3a4a2a',
      hair: { style: 'short', color: 'auburn' }, face: { mustache: 'auburn' },
      top: { type: 'shirt', color: '#5a8ac8' }, bottom: { type: 'pants', color: '#5a4a3a' }, shoes: '#3a2a20',
      voice: { pitch: 0.8 }, color: '#f0b080', portrait: { bg: '#2a2a1e', frame: '#d8c890' },
    },
    frank: {
      name: 'Frank', short: 'Frank', h: 55, build: 'stout', skin: 'tan', jaw: 'avg', eyes: '#2a2a2a',
      hair: { style: 'balding', color: 'gray' }, face: { glasses: 'square' },
      top: { type: 'sweater', color: '#a85a3a', collar: '#f4f0e0' }, bottom: { type: 'pants', color: '#4a4a3a' }, shoes: '#3a2a20',
      voice: { pitch: 0.9 }, color: '#e0c090', portrait: { bg: '#2a2a1e', frame: '#d8c890' },
    },
  };

  /* --------------------------------------------------------------- evidence */
  const clues = {
    combo_two: { name: 'Only Two Know the Combo', icon: 'lock', from: 'Juliet', desc: 'Only promoter Gil Hazelton and head judge Hal Fenwick know the lockbox combination. Gil changed it on Friday.' },
    ricky_wax: { name: "Ricky's Waxy Fingernails", icon: 'wax', zoom: true, from: 'observation', desc: 'Fresh board wax under his nails, sand caked to his knees. Ricky really was out here waxing his board at midnight.' },
    gil_chip: { name: "Gil's Lucky Chip", icon: 'chip', zoom: true, from: 'observation', desc: 'Gil constantly flips a red casino chip over his knuckles: Lucky Lady Casino, Lake Tahoe. His tell.' },
    flap_cut_inside: { name: 'Cut From the Inside', icon: 'fabric', zoom: true, from: 'judges\' tent', desc: 'The back flap of the tent was sliced, but the canvas frays OUTWARD. Whoever cut it was already inside.' },
    lockbox_unforced: { name: 'Unforced Lockbox', icon: 'lock', zoom: true, from: 'judges\' tent', desc: 'Not a scratch on the lockbox. No pry marks. It was opened with the combination.' },
    drag_marks: { name: 'Drag Marks', icon: 'footprint', zoom: true, from: 'judges\' tent', desc: 'A heavy rectangular dent in the sand, and drag marks leading out through the cut flap. Something cooler-sized left the tent.' },
    judge_alibi: { name: "Judge's Karaoke Alibi", icon: 'recording', from: 'Judge Fenwick', desc: "Hal Fenwick sang 'Margaritaville' at the Elks Lodge until 2 AM. Four times. Forty witnesses." },
    costume_left: { name: 'Costume Left in Tent', icon: 'mask', from: 'Dewey', desc: 'Dewey hung the Tiki Tom costume on its hook in the judges\' tent at 10 PM, because Gil specifically told him to.' },
    mascot_midnight: { name: 'Tiki Tom at Midnight', icon: 'cooler', from: 'Auntie Leilani', desc: 'At 12:15 AM, Leilani saw "Tiki Tom" dragging a heavy cooler down the beach toward the pier. He did not wave back.' },
    costume_found: { name: 'Abandoned Tiki Suit', icon: 'mask', zoom: true, from: 'under the pier', desc: 'The Tiki Tom costume, stuffed behind a piling under Stearns Wharf. Smells like coconut sunscreen and expensive cologne.' },
    chip_in_costume: { name: 'Chip Inside the Tiki Head', icon: 'chip', zoom: true, from: 'under the pier', desc: 'Wedged inside the Tiki Tom head: a red Lucky Lady casino chip. Exactly like the one Gil never stops flipping.' },
    gil_debt: { name: "Gil's Ten-Grand Debt", icon: 'money', from: 'Sal Fusco', desc: 'Gil owes bookie Sal Fusco $10,000, due Sunday. He promised to pay "after the contest". Same amount as the purse.' },
    van_cooler: { name: 'Cooler in the Van', icon: 'cooler', zoom: true, from: 'observation', desc: "In the back of Gil's Kahuna Events van: a blue cooler, padlocked, with a strand of tiki grass caught in the lid." },
  };
  const items = {
    quarters: { name: "Gus's Emergency Quarters", icon: 'quarters', desc: 'A roll of quarters Gus keeps for parking meters, laundromats, and, apparently, extortion.' },
    tickets: { name: 'Arcade Tickets (800)', icon: 'ticket', desc: "Dewey's victory tickets. Redeemable at the Fun Zone prize counter." },
    shaveice_togo: { name: 'Rainbow Shave Ice (to go)', icon: 'shaveice', desc: 'Rainbow with condensed milk. Melting at roughly the speed of guilt.' },
  };
  const gifts = {
    seaglass: {
      name: 'Heart-Shaped Sea Glass', icon: 'seaglass', romance: 1, desc: 'A piece of sea-green glass, worn smooth into an almost perfect heart.',
      give: async (g) => {
        await g.say('juliet:surprised', "Sea glass? It's shaped like a heart. Shawn... did you buy this and pretend you found it?");
        await g.say('shawn', 'Jules. The ocean made that. I just noticed it. Noticing is kind of my thing.');
        await g.say('juliet:happy', "...It's really pretty. Thank you.");
      },
    },
    otterplush: {
      name: 'Plush Sea Otter', icon: 'plush', romance: 1, desc: 'Won fair and square (by Dewey) at the Fun Zone arcade.',
      give: async (g) => {
        await g.say('juliet:happy', 'An otter! Did you know sea otters hold hands when they sleep so they don\'t drift apart?');
        await g.say('shawn', "I did not know that. But I'm going to tell people I did.");
        await g.say('gus', 'He did not know that.');
      },
    },
    plumeria: {
      name: 'Plumeria Blossom', icon: 'flower', romance: 1, desc: 'From Auntie Leilani\'s lei. "For someone special," she said, and winked. Twice.',
      give: async (g) => {
        await g.say('juliet:flirty', 'A plumeria? Leilani gave you this, didn\'t she?');
        await g.say('shawn', 'She said it was for someone special. I immediately thought of you. Then Gus. Then you again.');
        await g.say('juliet:happy', "Smooth recovery. I'll allow it.");
      },
    },
  };
  const snacks = {
    shaveice: { name: "Leilani's Shave Ice", icon: 'shaveice', desc: 'Li hing mui, lilikoi, and a snowcap of condensed milk. Gus wept a little.' },
    churro: { name: 'Wharf Churro', icon: 'taco', desc: 'Honor-system churro. Gus paid. Shawn ate two.' },
  };

  /* ---------------------------------------------------------- scene art */
  function vanLogo(x, X, Y) { P.font.draw(x, 'KAHUNA', X + 10, Y - 22, '#e43b44'); P.font.draw(x, 'EVENTS', X + 12, Y - 14, '#2a8ad8'); }
  function drawCounterFront(x, cam) { // Leilani's stand counter, drawn over her legs
    const X = 434 - cam;
    G.rect(x, X + 2, 108, 68, 20, '#f4e4c0'); R.siding(x, X + 2, 108, 68, 20, '#f4e4c0');
    G.rect(x, X, 106, 72, 4, '#c8a878'); G.hl(x, X, 106, 72, '#e8c898');
  }
  function drawTiki(x, X, Y) { // Tiki Tom costume heap
    G.poly(x, [[X - 14, Y], [X + 16, Y], [X + 12, Y - 10], [X - 10, Y - 10]], '#b8c050');
    for (let i = -12; i < 14; i += 2) G.vl(x, X + i, Y - 10, 10, i % 4 ? '#9aa040' : '#d8d870');
    G.rect(x, X - 8, Y - 30, 18, 22, '#8a5a32'); G.frame(x, X - 8, Y - 30, 18, 22, '#5a3a1a');
    G.rect(x, X - 5, Y - 25, 4, 3, '#1a1018'); G.rect(x, X + 3, Y - 25, 4, 3, '#1a1018');
    G.rect(x, X - 4, Y - 16, 10, 3, '#e8e0d0'); G.hl(x, X - 4, Y - 15, 10, '#1a1018');
    for (let i = -2; i <= 2; i++) G.line(x, X + 1, Y - 30, X + 1 + i * 4, Y - 38 + Math.abs(i) * 2, '#3e8948', 2);
  }
  function chair(x, X, Y, face) { // side-on kitchen chair; seat under the hips of a seated actor at (X,Y)
    const back = face > 0 ? X - 7 : X + 5;
    G.rect(x, X - 7, Y - 14, 14, 3, '#7a4a2a'); G.rect(x, back, Y - 30, 3, 17, '#6a3a1a');
    G.vl(x, X - 6, Y - 11, 11, '#5a3018'); G.vl(x, X + 5, Y - 11, 11, '#5a3018');
  }

  const scenes = {};

  /* ---- cold open: 1987 ---- */
  scenes.flash87 = {
    name: 'Santa Barbara, 1987', width: 320, noShawn: true, noGus: true, music: 'flashback',
    floor: { x0: 20, x1: 300, y0: 140, y1: 170 },
    bg(x) {
      R.wall(x, 0, 0, 320, 118, '#8a5a34', { stripes: 8, texture: true });
      for (let px = 0; px < 320; px += 8) G.vl(x, px + 4, 0, 118, '#9a6a40');
      R.window(x, 236, 24, 46, 36, { night: true, frame: '#d8c8a8' });
      R.frame(x, 40, 28, 28, 18, 'fish'); R.frame(x, 80, 34, 14, 18, 'photo');
      R.floor(x, 0, 118, 320, 62, 'carpet', '#c86a2a');
      R.tv(x, 268, 120, { on: true });
      R.lamp(x, 20, 118, '#f4d890');
      R.couch(x, 100, 120, 70, '#8a6a3a');
      P.font.draw(x, 'GO DODGERS', 236, 70, '#c8b8a0');
    },
    props: [
      { y: 140, draw: (x, cam) => chair(x, 140 - cam, 141, 1) },
      { y: 140, draw: (x, cam) => chair(x, 214 - cam, 141, -1) },
      { y: 150, draw: (x, cam) => { // card table in front
        const X = 150 - cam;
        G.rect(x, X, 120, 56, 4, '#2a6a3a'); G.hl(x, X, 120, 56, '#4a9a5a'); G.rect(x, X + 4, 124, 3, 26, '#3a3a3a'); G.rect(x, X + 49, 124, 3, 26, '#3a3a3a');
        for (let i = 0; i < 5; i++) G.rect(x, X + 8 + i * 4, 118, 3, 2, ['#e43b44', '#2a8ad8', '#f4f4f4', '#e43b44', '#63c74d'][i]);
        G.rect(x, X + 30, 117, 4, 3, '#f4f4f0'); G.rect(x, X + 36, 117, 4, 3, '#f4f4f0');
        G.rect(x, X + 46, 113, 3, 7, '#3a7a3a'); G.px(x, X + 47, 112, '#c8c0a0');
      } },
    ],
    actors: [
      { id: 'younghenry', x: 140, y: 141, face: 'right', idle: 'sitDrink' },
      { id: 'ray', x: 214, y: 141, face: 'left', idle: 'sitIdle', prop: 'coinflip' },
      { id: 'frank', x: 178, y: 136, face: 'right', idle: 'sitIdle', prop: 'smoke' },
      { id: 'youngshawn', x: 70, y: 158, face: 'right' },
    ],
    anim(x, t, o) { const k = Math.floor(t * 5) % 3; G.dither(x, 272 - o.cam, 84, 24, 17, ['#7ab0e0', '#9ac0f0', '#5a90c0'][k], 6); },
  };

  /* ---- Leadbetter Beach ---- */
  scenes.beach = {
    name: (g) => (g.flag('finale_pending') ? 'Leadbetter Beach - Sunset' : 'Leadbetter Beach'),
    width: 560, music: (g) => (g.flag('finale_pending') ? 'finale' : 'beach'),
    floor: { x0: 8, x1: 552, y0: 132, y1: 172 },
    entries: { map: { x: 26, y: 150, face: 'right' }, tent: { x: 280, y: 138, face: 'left' } },
    variant: (g) => (g.flag('finale_pending') ? 'sunset' : 'day') + (g.flag('dewey_back') ? '-open' : '-closed'),
    bg(x, o) {
      const sunset = o.v.startsWith('sunset'), open = o.v.endsWith('open');
      const Wd = o.W;
      R.sky(x, 0, 0, Wd, 66, sunset ? 'sunset' : 'day');
      if (sunset) R.sun(x, 400, 60, 13, '#ffd890'); else { R.sun(x, 486, 16, 8); R.cloud(x, 60, 10, 46); R.cloud(x, 300, 22, 34); R.cloud(x, 420, 6, 28); }
      R.hills(x, 300, 66, 200, sunset ? '#7a4a7a' : '#8aa0b8', 'islands', 5);
      R.ocean(x, 0, 64, Wd, 38, sunset ? 'sunset' : 'day');
      R.sand(x, 0, 100, Wd, 80, sunset ? '#e2b48e' : '#ecd2a0');
      G.rect(x, 0, 100, Wd, 6, sunset ? '#c8988a' : '#d8b880'); G.dither(x, 0, 106, Wd, 3, sunset ? '#c8988a' : '#d8b880', 6);
      // parking lot
      G.rect(x, 0, 106, 132, 28, '#5a5a66'); G.noise(x, 0, 106, 132, 28, ['#6a6a76', '#4a4a56'], 0.08, 'lot');
      for (let px = 4; px < 130; px += 34) G.rect(x, px, 108, 2, 22, '#e8e0c0');
      R.car(x, 22, 132, '#f4f0e8', 'van', 1); vanLogo(x, 22, 132);
      // banner arch
      G.rect(x, 150, 34, 3, 92, '#c8b8a0'); G.rect(x, 232, 34, 3, 92, '#c8b8a0');
      G.rect(x, 146, 32, 94, 15, '#2a8ad8'); G.frame(x, 146, 32, 94, 15, '#14306a'); G.hl(x, 147, 33, 92, '#7ac8ff');
      P.font.draw(x, 'BIG KAHUNA', 193, 36, '#fee761', { align: 'center', shadow: '#14306a' });
      G.rect(x, 152, 47, 82, 9, '#e43b44'); P.font.draw(x, 'SURF CLASSIC', 193, 48, '#ffffff', { align: 'center' });
      // background beachgoers' umbrellas + towels
      R.umbrella(x, 168, 124, '#fee761', '#ffffff'); G.rect(x, 172, 118, 18, 5, '#ff8ab8');
      R.umbrella(x, 214, 120, '#63c74d', '#ffffff');
      // tent + crime tape
      R.tent(x, 244, 128, 80, 54, '#ffffff', '#e43b44', { flap: true });
      R.crimeTape(x, 236, 110, 334, 112);
      // judge's cooler seat + scoreboard
      G.rect(x, 346, 124, 20, 12, '#2a8ad8'); G.rect(x, 346, 122, 20, 3, '#f4f4f8'); G.frame(x, 346, 122, 20, 14, '#14306a');
      G.rect(x, 372, 50, 3, 76, '#8a8a98'); G.rect(x, 360, 46, 40, 34, '#1a2a3a'); G.frame(x, 360, 46, 40, 34, '#5a6a7a');
      P.font.draw(x, 'RUIZ 9.1', 364, 50, '#fee761'); P.font.draw(x, 'KAI  7.8', 364, 60, '#c0cbdc'); P.font.draw(x, 'BO   7.2', 364, 70, '#c0cbdc');
      // surfboard rack
      G.rect(x, 404, 92, 2, 36, '#8a6a4a'); G.rect(x, 442, 92, 2, 36, '#8a6a4a'); G.rect(x, 404, 104, 40, 2, '#8a6a4a');
      [['#ff6a4a', '#fff8e0'], ['#2a8ad8', '#fee761'], ['#63c74d', '#ffffff'], ['#fee761', '#e43b44'], ['#f4f4f4', '#2a8ad8']].forEach(([c, s2], i) => R.surfboard(x, 408 + i * 8, 126, 36 - (i % 2) * 4, c, s2));
      // Auntie Leilani's shave ice stand (+ the pineapple, proudly on the sign)
      R.stand(x, 452, 128, 74, { roof: '#3ab0a0', sign: 'SHAVE ICE', col: '#f4e4c0' });
      R.pineapple(x, 516, 74, 2);
      P.font.draw(x, "AUNTIE LEILANI'S", 489, 60, '#ffffff', { align: 'center', shadow: '#1a6a60' });
      if (!open) {
        for (let yy = 94; yy < 110; yy += 2) G.hl(x, 456, yy, 66, yy % 4 ? '#a8a8b4' : '#8a8a98');
        R.sign(x, 470, 98, 38, 10, 'CLOSED', { bg: '#e43b44', fg: '#ffffff' });
      } else {
        // syrup bottles + ice machine
        for (let i = 0; i < 6; i++) G.rect(x, 460 + i * 6, 98, 3, 8, ['#ff4a6a', '#2ac8ff', '#fee761', '#63c74d', '#ff9a3c', '#b55088'][i]);
        G.rect(x, 504, 96, 12, 12, '#c0cbdc');
      }
      // lifeguard tower + palms
      R.lifeguard(x, 528, 128);
      R.palm(x, 128, 112, 66, 'bp1'); R.palm(x, 556, 118, 74, 'bp2');
    },
    anim(x, t, o) {
      const c = o.cam, sunset = o.v && o.v.startsWith('sunset');
      // breaking waves along the shore
      for (let i = 0; i < 18; i++) { const px = ((i * 37 + t * 14) % (o.W + 40)) - 20 - c; const k = (Math.sin(t * 1.6 + i) + 1) / 2; G.hl(x, px, 98 + Math.round(k * 3), 10 + Math.round(k * 6), sunset ? '#ffd8c8' : '#ffffff'); }
      // surfers on the swell
      for (let i = 0; i < 3; i++) {
        const px = ((i * 170 + t * (8 + i * 3)) % (o.W + 30)) - 15 - c, py = 80 + i * 6 + Math.round(Math.sin(t * 2 + i) * 2);
        G.rect(x, px - 5, py + 4, 11, 2, ['#ff6a4a', '#fee761', '#63c74d'][i]); G.rect(x, px - 1, py - 3, 2, 6, '#1a1a22'); G.px(x, px - 1, py - 4, '#c99466');
      }
      // gulls
      for (let i = 0; i < 3; i++) { const gx = ((t * (14 + i * 5) + i * 200) % (o.W + 60)) - 30 - c, gy = 20 + i * 9 + Math.round(Math.sin(t * 3 + i) * 3); const f = Math.floor(t * 6 + i) % 2; G.line(x, gx - 3, gy - f, gx, gy, '#f4f4f4'); G.line(x, gx, gy, gx + 3, gy - f, '#f4f4f4'); }
    },
    props: [
      { y: 129, draw: (x, cam) => drawCounterFront(x, cam) },
      { y: 171, show: (g) => g.flag('finale_pending'), draw: (x, cam) => { const X = 300 - cam; G.poly(x, [[X - 8, 172], [X + 8, 172], [X + 5, 164], [X - 5, 164]], '#d8b880'); G.rect(x, X - 2, 158, 4, 6, '#d8b880'); G.px(x, X, 157, '#e43b44'); } },
    ],
    update(sc, dt, g) { const gil = sc.actors.gil; if (gil) gil.prop = g.hasClue('chip_in_costume') ? 'sweat' : 'chipflip'; },
    hotspots: [
      { id: 'leave', name: 'Parking Lot Exit', x: 0, y: 100, w: 14, h: 80, walk: [12, 150], exit: 'map', verb: 'Drive off from the' },
      { id: 'van', name: "Gil's Van", x: 20, y: 98, w: 66, h: 36, walk: [70, 140], clue: (g) => g.hasClue('chip_in_costume') && !g.hasClue('van_cooler'),
        look: async (g) => {
          if (g.hasClue('chip_in_costume') || g.hasClue('gil_debt')) {
            if (await g.clue('van_cooler')) {
              await g.think('A padlocked cooler. In a promoter\'s van. With tiki grass in the lid. Gus would call that circumstantial. I call it Tuesday.');
              g.objective('You have the whole picture. Tell Chief Vick at SBPD that the spirits want a big finish.');
            } else await g.say('shawn', 'The cooler is still sitting in there. Taunting me. Coolly.');
          } else await g.say('shawn', 'Kahuna Events. The van has more bumper stickers than a skateboard. "MY OTHER CAR IS A WAVE." Sure it is, Gil.');
        },
        use: async (g) => { await g.say('gus:angry', 'Do NOT break into that van, Shawn. That is an actual crime with actual jail.'); await g.say('shawn', "Fine. I'll just look. Looking is free. (Q)"); } },
      { id: 'tentflap', name: 'Judges\' Tent', x: 266, y: 88, w: 28, h: 40, walk: [280, 136], sneak: true, verb: 'Slip into the',
        use: async (g) => {
          const ok = g.flag('hired') || g.flag('juliet_ok');
          const mc = g.actor('mcnab');
          if (!ok && mc && mc.visible) {
            const facing = Math.sign(g.actor('shawn').x - mc.x) === mc.face || Math.abs(g.actor('shawn').x - mc.x) < 6;
            if (facing) { mc.emo('!'); g.sfx('caught'); await g.say('mcnab', "Whoa, Shawn! Can't let you in there, buddy. Detective Lassiter said. He said 'especially Spencer.'"); await g.walk('shawn', 230, 150); return; }
            if (g.once('sneaked')) { await g.say('gus:worried', 'Shawn, this is trespassing on a crime scene. That is two crimes.'); await g.say('shawn', "It's a tent, Gus. Tents are basically outdoors."); }
          }
          g.sfx('door');
          await g.goto('tent');
        } },
      { id: 'scoreboard', name: 'Scoreboard', x: 358, y: 44, w: 44, h: 38, walk: [380, 138],
        look: async (g) => { await g.say('shawn', 'Ricky Ruiz: 9.1. He\'s crushing it.'); await g.think("He's about to win ten grand fair and square. Why steal it the night before? That's... bad math."); } },
      { id: 'rack', name: 'Surfboard Rack', x: 402, y: 88, w: 44, h: 40, walk: [424, 140], clue: (g) => !g.hasClue('ricky_wax'),
        look: async (g) => {
          await g.say('shawn', "One of these boards has a fresh coat of wax. Still tacky. Smells like coconut and ambition.");
          if (!g.hasClue('ricky_wax')) await g.think('Somebody waxed a board very recently. I should take a good look at Ricky (Q).');
        } },
      { id: 'tower', name: 'Lifeguard Tower', x: 524, y: 70, w: 36, h: 58, walk: [530, 140],
        look: async (g) => { await g.say('shawn', 'Lifeguard tower. I applied to be a lifeguard once.'); await g.say('gus', 'You applied to be "Lifeguard Spencer: Beach Psychic." It was a flyer.'); } },
      { id: 'banner', name: 'Contest Banner', x: 146, y: 30, w: 94, h: 28, walk: [193, 136],
        look: async (g) => { await g.say('shawn', 'The Big Kahuna Surf Classic. Grand prize: ten thousand dollars. Current prize: emotional growth.'); } },
      { id: 'ocean', name: 'The Pacific', x: 0, y: 62, w: 560, h: 36, walk: null,
        look: async (g) => { await g.say('shawn', U.pick(['Somebody out there just wiped out so hard I felt it in my soul.', 'The Pacific Ocean. Big. Wet. Overrated. Do not tell Dad I said that.'])); } },
      { id: 'standsign', name: 'Shave Ice Stand', x: 452, y: 60, w: 74, h: 50, walk: [470, 136], show: (g) => !g.flag('dewey_back'),
        look: async (g) => { await g.say('gus:sad', 'Closed. Shawn. It is CLOSED.'); await g.say('shawn', 'Stay strong, Gus.'); } },
    ],
    actors: [
      { id: 'lassiter', x: 214, y: 146, face: 'right', idle: 'crossed', show: (g) => P.where(g, 'lassiter') === 'beach', talk: (g) => P.castTalk(g, 'lassiter', P.BASE_TOPICS.lassiter), observe: (g) => g.say('shawn', "Lassie's doing the crossed-arms thing. That means he's already decided who did it. Also that his shirt is too starched.") },
      { id: 'juliet', x: 344, y: 152, face: 'left', show: (g) => P.where(g, 'juliet') === 'beach', talk: (g) => P.castTalk(g, 'juliet', P.BASE_TOPICS.juliet), observe: (g) => g.say('shawn', 'Jules has sand on her left shoe and a pen behind her ear. She\'s been taking statements. Also she looks great. That one\'s not a clue, just a fact.') },
      { id: 'mcnab', x: 306, y: 140, face: 'left', walk: [328, 150], show: (g) => P.where(g, 'mcnab') === 'beach',
        guard: {
          zone: [250, 318], zoneY: [130, 143], range: 80, reset: [226, 156],
          pattern: [{ face: 'left', t: 3.2 }, { face: 'right', t: 2.8, say: ['Whoa, nice cutback!', 'Go Kai!', 'Is that a dolphin?!'] }],
          off: (g) => g.flag('hired') || g.flag('juliet_ok') || g.flag('finale_pending'),
          onCaught: async (g) => { await g.say('mcnab:worried', "Shawn! Come on, man. Don't make me tell Detective Lassiter. He gets a vein. Right here."); },
        },
        talk: async (g) => {
          if (g.flag('hired') || g.flag('juliet_ok')) { await g.say('mcnab:happy', "Go on in, Shawn! You're official now. Kind of. Mostly."); return; }
          await g.topics('mcnab', [
            { id: 'tent', label: 'Can we go in the tent?', run: async (gg) => { await gg.say('mcnab', "Sorry, Shawn. Detective Lassiter said nobody goes in. He said, and I quote, 'especially Spencer.'"); await gg.say('shawn', 'He says that about everything.'); await gg.say('mcnab', "He does! He said it about the donuts this morning."); } },
            { id: 'watch', label: 'What are you watching?', run: async (gg) => { await gg.say('mcnab:happy', 'The heats! I keep turning around to watch the surfers. I probably shouldn\'t. Don\'t tell Detective Lassiter.'); await gg.think('Every few seconds he turns his back on the tent. Noted.'); } },
          ]);
        },
        observe: (g) => g.say('shawn', 'McNab keeps glancing at the surfers every few seconds. A good guard watches the door. A great guard watches the waves. Buzz is a great guard.'),
      },
      { id: 'gil', x: 112, y: 150, face: 'right', prop: 'chipflip', show: (g) => !g.flag('finale_done'),
        talk: (g) => talkGil(g), observe: (g) => observeGil(g) },
      { id: 'ricky', x: 452, y: 152, face: 'left', show: (g) => !g.flag('finale_done') || true,
        talk: (g) => talkRicky(g),
        observe: async (g) => {
          if (await g.clue('ricky_wax')) { await g.think("Fresh wax and sandy knees. His moon-wax story checks out. Jules should hear about this."); g.set('know_ricky_alibi'); }
          else await g.say('shawn', 'Ricky has the aura of a man who has said "gnarly" unironically today. Multiple times.');
        } },
      { id: 'fenwick', x: 356, y: 136, face: 'left', idle: 'sitIdle', walk: [340, 150],
        talk: (g) => talkFenwick(g),
        observe: (g) => g.say('shawn', "Sunburn on the left side only. He's been facing west since dawn. Also he smells faintly of tequila and karaoke regret.") },
      { id: 'leilani', x: 488, y: 128, face: 'left', walk: [478, 140],
        talk: (g) => talkLeilani(g),
        observe: (g) => g.say('shawn', 'Auntie Leilani. Flower over the left ear means she\'s taken. Flour on her sleeve means malasadas. I need both of those facts.') },
      // finale extras
      { id: 'vick', x: 386, y: 146, face: 'left', show: (g) => g.flag('finale_pending'), talk: (g) => talkVickBeach(g) },
      { id: 'dewey', x: 430, y: 146, face: 'left', show: (g) => g.flag('finale_pending'), talk: (g) => g.say('dewey', 'Dude. This is SO much better than Galaxy Surfer.') },
      { id: 'deweystand', cast: 'dewey', name: 'Dewey', x: 510, y: 150, face: 'left', show: (g) => g.flag('dewey_back') && !g.flag('finale_pending'),
        talk: async (g) => {
          await g.topics('dewey', [
            { id: 'suit2', label: 'Where did you leave the Tiki suit?', run: async (gg) => { await gg.say('dewey', "Judges' tent. Ten o'clock. On the hook. Gil was weirdly intense about it."); await gg.clue('costume_left'); } },
            { id: 'work', label: 'Back at work, huh?', run: async (gg) => { await gg.say('dewey', "Auntie says I'm on register duty until I'm thirty. Worth it. D-E-W, baby."); } },
          ], { title: 'Dewey' });
        },
        observe: (g) => g.say('shawn', "He's wearing an apron over the hoodie now. Grounded, but triumphant.") },
    ],
    onEnter: async (g, o) => {
      if (g.flag('finale_pending') && !g.flag('finale_started')) return finale(g);
      if (g.flag('finale_pending') && !g.flag('finale_done')) return;
      if (g.once('beach_intro')) {
        await g.walk('shawn', 180, 152);
        g.face('lassiter', 'shawn');
        await g.say('lassiter:stern', 'Spencer. Guster. This is an active crime scene.');
        await g.say('shawn:smug', "Lassie! We were just in the neighborhood. Spiritually.");
        await g.say('gus', 'And for the shave ice.');
        await g.say('juliet:happy', 'Hi Shawn. Hi Gus.');
        await g.say('lassiter:angry', 'Nobody goes behind that tape. McNab is watching the tent, and McNab is a wall of pure obedience.');
        g.bubble('mcnab', 'Hi Shawn!', 1800);
        await g.wait(900);
        await g.say('lassiter:stern', '...A wall of mostly obedience.');
        g.objective("Find out what happened. Talk to people, and look at everything with Shawn-Vision (Q). The tent is off-limits... officially.");
      }
    },
  };

  /* ---- Judges' tent interior ---- */
  scenes.tent = {
    name: "Judges' Tent", width: 320, music: (g) => (g.flag('hired') || g.flag('juliet_ok') ? 'beach' : 'tension'),
    floor: { x0: 20, x1: 300, y0: 132, y1: 172 },
    entries: { beach: { x: 288, y: 156, face: 'left' } },
    bg(x) {
      // canvas walls in perspective
      G.rect(x, 0, 0, 320, 112, '#f2ece0');
      for (let px = 0; px < 320; px += 20) G.rect(x, px, 18, 10, 94, '#e85a5a');
      G.poly(x, [[0, 0], [320, 0], [320, 18], [0, 18]], '#d84a4a');
      for (let px = 0; px < 320; px += 20) G.poly(x, [[px, 0], [px + 10, 0], [px + 10, 18], [px, 18]], '#f2ece0');
      G.hl(x, 0, 18, 320, '#a83a3a');
      // the cut flap at the back, light spilling through
      G.poly(x, [[150, 36], [174, 36], [170, 112], [154, 112]], '#3a2a3a');
      G.line(x, 162, 38, 160, 110, '#fff6c0'); G.line(x, 163, 38, 161, 110, '#ffe890');
      G.poly(x, [[150, 36], [160, 38], [158, 112], [154, 112]], '#f2ece0'); G.poly(x, [[164, 38], [174, 36], [170, 112], [162, 112]], '#e85a5a');
      // sand floor
      R.sand(x, 0, 110, 320, 70, '#e4c898');
      G.dither(x, 0, 110, 320, 4, '#c8a878', 8);
      // dent + drag marks to the flap
      G.rect(x, 196, 142, 30, 10, '#c8a070'); G.frame(x, 196, 142, 30, 10, '#a8805a');
      for (let i = 0; i < 2; i++) G.line(x, 200 + i * 20, 142, 158 + i * 6, 114, '#c8a070', 2);
      // folding table with score sheets + open lockbox
      G.rect(x, 36, 104, 84, 4, '#c8c8d0'); G.rect(x, 40, 108, 2, 24, '#8a8a98'); G.rect(x, 114, 108, 2, 24, '#8a8a98');
      for (let i = 0; i < 3; i++) { G.rect(x, 44 + i * 13, 98, 11, 6, '#f8f8f4'); G.hl(x, 46 + i * 13, 100, 6, '#8a8a9a'); }
      G.rect(x, 96, 96, 18, 8, '#5a6a7a'); G.poly(x, [[96, 96], [114, 96], [116, 86], [98, 86]], '#6a7a8a'); G.rect(x, 98, 97, 14, 5, '#1a1a22'); G.rect(x, 103, 99, 4, 2, '#d8c070');
      // coat hook for Tiki Tom (empty)
      G.rect(x, 258, 40, 3, 72, '#8a6a4a'); G.rect(x, 252, 44, 14, 2, '#8a6a4a'); G.line(x, 254, 46, 258, 54, '#c0cbdc'); G.line(x, 262, 46, 258, 54, '#c0cbdc');
      R.sign(x, 246, 58, 26, 9, 'TIKI', { bg: '#f4ecd6', fg: '#8a3a1a', border: '#8a6a4a' });
      // lantern
      G.line(x, 80, 18, 80, 30, '#4a4a4a'); G.rect(x, 76, 30, 8, 10, '#fee761'); G.frame(x, 76, 30, 8, 10, '#4a4a4a');
      // cooler of water bottles + sign
      G.rect(x, 20, 120, 18, 12, '#e43b44'); G.rect(x, 20, 118, 18, 3, '#f4f4f8');
      R.sign(x, 130, 24, 60, 10, 'JUDGES ONLY', { bg: '#2a2a3a', fg: '#ffffff' });
    },
    hotspots: [
      { id: 'out', name: 'Tent Opening', x: 296, y: 100, w: 24, h: 80, walk: [298, 156], exit: 'beach', verb: 'Back out through the' },
      { id: 'flap', name: 'Slashed Back Flap', x: 148, y: 34, w: 28, h: 80, walk: [162, 136], clue: (g) => !g.hasClue('flap_cut_inside'),
        look: async (g) => {
          if (await g.clue('flap_cut_inside')) { await g.think('Fibers pushed outward. You don\'t cut your way IN from the inside. You cut your way OUT. Somebody wanted this to look like a break-in.'); afterTentClue(g); }
          else await g.say('shawn', 'Cut from the inside. Still true. Still suspicious.');
        },
        use: async (g) => { await g.say('gus', 'Shawn, do not touch the evidence.'); await g.say('shawn', "I'm not touching it. I'm hovering near it. Psychically. Try Q, Gus."); } },
      { id: 'lockbox', name: 'Lockbox', x: 92, y: 84, w: 26, h: 22, walk: [100, 136], clue: (g) => !g.hasClue('lockbox_unforced'),
        look: async (g) => {
          if (await g.clue('lockbox_unforced')) { await g.think('Not a scratch. No crowbar, no hammer. Whoever opened this knew the numbers.'); afterTentClue(g); }
          else await g.say('shawn', 'An empty box. Like my bank account. And my fridge. And Gus\'s sense of adventure.');
        } },
      { id: 'sheets', name: 'Score Sheets', x: 40, y: 94, w: 40, h: 12, walk: [64, 136],
        look: async (g) => { await g.say('shawn', 'Score sheets from the heats. Ricky Ruiz is miles ahead.'); await g.say('gus', 'So he was about to win the money anyway.'); await g.say('shawn', 'Exactly. Gus, write that down. Then show it to Lassie. Then duck.'); } },
      { id: 'hook', name: 'Mascot Hook', x: 244, y: 38, w: 30, h: 76, walk: [256, 136],
        look: async (g) => {
          g.set('hook_seen');
          if (g.hasClue('costume_left')) await g.say('shawn', 'Where Dewey hung Tiki Tom at 10 PM. Somebody took him for a midnight stroll.');
          else { await g.say('shawn', 'A hook labeled "TIKI." No tiki. Somebody took the mascot costume.'); await g.say('gus', 'Who steals a mascot?'); await g.say('shawn', "Someone who wants to be anybody but themselves, Gus. It's very sad. And very suspicious."); }
        } },
      { id: 'dent', name: 'Dent in the Sand', x: 192, y: 138, w: 38, h: 18, walk: [210, 160], clue: (g) => !g.hasClue('drag_marks'),
        look: async (g) => {
          if (await g.clue('drag_marks')) await g.think('Something heavy and cooler-shaped sat here, then got dragged out the back. Ten grand in cash doesn\'t weigh much. A cooler full of ice does.');
          else await g.say('shawn', 'Drag marks. The sand remembers everything. The sand is my kind of witness.');
        } },
    ],
    onEnter: async (g, o) => {
      if (o.first) {
        await g.say('shawn', 'Okay, Gus. We have maybe two minutes. Look at everything.');
        await g.say('gus', 'I am looking at the exit.');
        g.objective('Search the tent. Use Shawn-Vision (Q) on anything suspicious.');
      }
    },
  };
  function afterTentClue(g) {
    if (g.hasClue('flap_cut_inside') && g.hasClue('lockbox_unforced') && !g.flag('hired')) {
      g.objective('This was no break-in. Head to SBPD and have a "vision" for Chief Vick.');
    }
  }

  /* ---- Stearns Wharf ---- */
  scenes.pier = {
    name: 'Stearns Wharf', width: 480, music: 'beach',
    floor: { x0: 10, x1: 470, y0: 134, y1: 172 },
    entries: { map: { x: 24, y: 152, face: 'right' }, arcade: { x: 214, y: 142, face: 'right' }, underpier: { x: 356, y: 142, face: 'left' } },
    bg(x, o) {
      const Wd = o.W;
      R.sky(x, 0, 0, Wd, 60, 'day'); R.cloud(x, 100, 14, 40); R.cloud(x, 340, 8, 30);
      R.mountains(x, 0, 62, 180, '#8a9ab0', 'pmtn', 20, 16);
      R.ocean(x, 0, 58, Wd, 60, 'day');
      // deck
      R.floor(x, 0, 118, Wd, 62, 'wood', '#9a7048');
      G.rect(x, 0, 116, Wd, 3, '#6a4a2a');
      R.railing(x, 0, 118, Wd, '#e8e0d0');
      // bait shop
      G.rect(x, 26, 58, 88, 60, '#7a9a8a'); R.siding(x, 26, 58, 88, 60, '#7a9a8a');
      G.poly(x, [[20, 60], [120, 60], [112, 48], [28, 48]], '#5a5a6a');
      R.sign(x, 34, 62, 72, 10, 'REEL DEAL BAIT', { bg: '#f4ecd6', fg: '#2a5a8a' });
      R.door(x, 58, 80, 22, 38, '#5a4a3a'); R.sign(x, 54, 86, 30, 8, 'CLOSED', { bg: '#e43b44', fg: '#fff' });
      R.window(x, 88, 80, 18, 16, { frame: '#f4f0e8' });
      // Fun Zone arcade
      G.rect(x, 160, 42, 104, 76, '#2a1a4a'); G.frame(x, 160, 42, 104, 76, '#14082a');
      G.rect(x, 166, 48, 92, 18, '#14082a');
      R.door(x, 200, 78, 26, 40, '#3a2a5a', { glass: true });
      R.window(x, 170, 78, 22, 22, { night: true, frame: '#5a3a8a', cross: false }); R.window(x, 234, 78, 22, 22, { night: true, frame: '#5a3a8a', cross: false });
      // churro cart
      G.rect(x, 286, 104, 36, 18, '#e8a030'); G.hl(x, 286, 104, 36, '#fec860'); G.rect(x, 290, 122, 4, 4, '#1a1a22'); G.rect(x, 314, 122, 4, 4, '#1a1a22');
      R.umbrella(x, 300, 104, '#e43b44', '#fee761'); P.font.draw(x, 'CHURROS', 304, 110, '#7a2a1a', { align: 'center' });
      G.rect(x, 316, 98, 5, 6, '#c8e8ff'); // tip jar
      // beach access stairs
      G.rect(x, 338, 116, 36, 4, '#1a1418'); for (let i = 0; i < 4; i++) G.rect(x, 340 + i * 2, 120 + i * 3, 32 - i * 4, 3, i % 2 ? '#7a5a3a' : '#6a4a2a');
      R.sign(x, 334, 92, 44, 10, 'BEACH ↓', { bg: '#2a6ab0', fg: '#ffffff', posts: 14 });
      // benches + lamps
      G.rect(x, 396, 104, 30, 3, '#7a4a2a'); G.rect(x, 396, 96, 30, 2, '#7a4a2a'); G.rect(x, 398, 107, 2, 9, '#3a3a48'); G.rect(x, 422, 107, 2, 9, '#3a3a48');
      R.streetlamp(x, 140, 118); R.streetlamp(x, 384, 118);
    },
    anim(x, t, o) {
      const c = o.cam;
      // neon sign flicker
      const on = Math.floor(t * 3) % 7 !== 0;
      P.font.draw(x, 'FUN ZONE', 212 - c, 51, on ? '#ff6ac8' : '#5a2a5a', { align: 'center', scale: 1, outline: on ? '#7a1a6a' : null });
      for (let i = 0; i < 10; i++) G.px(x, 168 - c + i * 9, 68, (Math.floor(t * 6) + i) % 3 === 0 ? '#fee761' : '#5a3a8a');
      // Sal's fishing line
      G.line(x, 452 - c, 104, 474 - c, 84, '#3a2a1a'); G.line(x, 474 - c, 84, 476 - c, 112 + Math.round(Math.sin(t * 2) * 2), '#d8d8e8');
      // gulls on the rail
      const hop = Math.floor(t * 2) % 5 === 0 ? 1 : 0;
      for (const gx of [120, 268, 430]) { G.rect(x, gx - c, 102 - hop, 5, 3, '#f4f4f4'); G.px(x, gx + 4 - c, 101 - hop, '#f4f4f4'); G.px(x, gx + 5 - c, 101 - hop, '#feae34'); G.px(x, gx - c, 103 - hop, '#8a8a98'); }
    },
    hotspots: [
      { id: 'leave', name: 'Wharf Entrance', x: 0, y: 110, w: 12, h: 70, walk: [12, 152], exit: 'map', verb: 'Head back down the' },
      { id: 'arcade', name: 'Fun Zone Arcade', x: 198, y: 76, w: 30, h: 44, walk: [213, 138], exit: 'arcade', verb: 'Enter the' },
      { id: 'stairs', name: 'Beach Access (under the pier)', x: 334, y: 90, w: 44, h: 36, walk: [356, 138], exit: 'underpier', verb: 'Climb down the' },
      { id: 'bait', name: 'Bait Shop', x: 26, y: 50, w: 90, h: 68, walk: [70, 138],
        look: async (g) => { await g.say('shawn', '"CLOSED. BACK IN 10 MINUTES." The sign is from 1994.'); await g.say('gus', 'That is a long ten minutes.'); } },
      { id: 'churros', name: 'Churro Cart', x: 284, y: 92, w: 40, h: 34, walk: [300, 138],
        use: async (g) => {
          if (g.s.snacks.includes('churro')) { await g.say('gus', 'We are not having a third churro, Shawn.'); await g.say('shawn', 'Second-and-a-half.'); return; }
          await g.say('shawn', 'Honor-system churros. Two dollars in the jar. Gus, honor the system.');
          await g.say('gus', 'Why is it always my honor?');
          await g.snack('churro');
          await g.say('gus:happy', 'Cinnamon. Sugar. Structural integrity. This is a well-built churro.');
        } },
      { id: 'sea', name: 'Ocean View', x: 0, y: 56, w: 480, h: 44, walk: null,
        look: async (g) => { await g.say('shawn', 'From here you can see the whole beach. Including the parking lot. Including every van in the parking lot.'); } },
    ],
    actors: [
      { id: 'sal', x: 446, y: 146, face: 'right', idle: 'think', walk: [420, 150], talk: (g) => talkSal(g), observe: (g) => observeSal(g) },
    ],
    onEnter: async (g, o) => {
      if (o.first) { await g.say('gus', 'Stearns Wharf. Smells like fish, sunscreen, and teenagers.'); await g.say('shawn', 'Ah. The holy trinity.'); }
    },
  };

  /* ---- Under the pier ---- */
  scenes.underpier = {
    name: 'Under the Pier', width: 320, music: 'tension',
    floor: { x0: 16, x1: 300, y0: 134, y1: 172 },
    entries: { pier: { x: 30, y: 152, face: 'right' } },
    bg(x) {
      G.bands(x, 0, 0, 320, 120, ['#1a1a2a', '#22223a', '#2a2a48', '#34344e'], 2);
      // deck overhead with light slits
      G.rect(x, 0, 0, 320, 22, '#3a2a1a'); for (let px = 0; px < 320; px += 10) G.vl(x, px, 0, 22, '#2a1a10');
      for (let px = 6; px < 320; px += 20) G.vl(x, px, 0, 22, '#fff2a0');
      // distant sea + light
      G.rect(x, 0, 70, 320, 40, '#1a4a7a'); G.dither(x, 0, 70, 320, 40, '#2a6a9a', 5);
      R.sand(x, 0, 110, 320, 70, '#b89870'); G.dither(x, 0, 110, 320, 70, '#9a7a5a', 5);
      // tide pools + seaweed
      G.ellipse(x, 120, 164, 18, 4, '#2a5a7a'); G.ellipse(x, 120, 163, 14, 2, '#4a8ab0');
      G.ellipse(x, 270, 172, 14, 3, '#2a5a7a');
      for (let i = 0; i < 8; i++) G.line(x, 40 + i * 33, 140, 44 + i * 33, 132, '#3e6a3a', 2);
      // pilings
      for (const px of [26, 92, 158, 224, 290]) { G.rect(x, px, 22, 12, 120, '#4a3a2a'); G.vl(x, px + 10, 22, 120, '#3a2a1a'); G.rect(x, px - 1, 126, 14, 16, '#3a5a3a'); G.noise(x, px - 1, 100, 14, 40, ['#5a7a4a', '#2a3a2a', '#e8e0c0'], 0.15, 'pile' + px); }
      // stairs up (left)
      for (let i = 0; i < 6; i++) G.rect(x, 4 + i * 2, 100 + i * 8, 24, 3, '#6a4a2a');
      R.sign(x, 12, 80, 30, 9, 'UP', { bg: '#2a6ab0', fg: '#fff' });
    },
    anim(x, t) {
      // light shafts
      x.save(); x.globalAlpha = 0.07 + Math.sin(t) * 0.02;
      for (let px = 6; px < 320; px += 40) G.poly(x, [[px, 22], [px + 2, 22], [px + 30, 180], [px + 18, 180]], '#fff6c0');
      x.restore();
      // crab
      const cx = 180 + Math.round(Math.sin(t * 0.7) * 30);
      G.rect(x, cx - 3, 160, 7, 3, '#e8583a'); G.px(x, cx - 4, 159, '#e8583a'); G.px(x, cx + 4, 159, '#e8583a'); G.px(x, cx - 1, 159, '#1a1a1a'); G.px(x, cx + 1, 159, '#1a1a1a');
      // waves at the back
      for (let i = 0; i < 8; i++) G.hl(x, ((i * 47 + t * 10) % 340) - 10, 104 + (i % 3), 8, '#7ac8f0');
    },
    props: [
      { y: 150, show: (g) => g.hasClue('mascot_midnight'), draw: (x, cam) => drawTiki(x, 238 - cam, 150) },
    ],
    hotspots: [
      { id: 'up', name: 'Stairs Up', x: 0, y: 78, w: 34, h: 70, walk: [26, 150], exit: 'pier', verb: 'Climb the' },
      { id: 'costume', name: 'Tiki Tom Costume', x: 220, y: 108, w: 40, h: 44, walk: [212, 156], show: (g) => g.hasClue('mascot_midnight'), clue: (g) => !g.hasClue('chip_in_costume'),
        use: async (g) => {
          if (!g.hasClue('costume_found')) {
            await g.say('shawn:surprised', 'Gus! Tiki Tom! Stuffed behind a piling like a sad, sandy burrito.');
            await g.clue('costume_found');
            await g.say('gus', 'It smells like coconut sunscreen... and cologne. Expensive cologne. That is not a teenager smell.');
            await g.say('shawn', "Gus, your nose is a national treasure.");
            await g.think('Something rattled when I moved the head. I should take a really close look at it (Q).');
            g.objective('Observe the Tiki Tom head closely with Shawn-Vision (Q).');
          } else if (!g.hasClue('chip_in_costume')) {
            await g.say('shawn', "It rattles. The head rattles. Gus, there's something inside.");
            await g.say('gus', "I'm not sticking my hand in a mascot. Use your 'gift'.");
          } else await g.say('shawn', "Poor Tiki Tom. He's seen things.");
        },
        look: async (g) => {
          if (!g.hasClue('costume_found')) { await g.clue('costume_found'); await g.say('gus', 'Coconut sunscreen and expensive cologne. That is not a teenager smell.'); }
          if (await g.clue('chip_in_costume')) {
            await g.say('shawn:surprised', 'Gus. GUS. A red casino chip. Lucky Lady Casino, Lake Tahoe.');
            await g.say('gus:surprised', "That's Gil's chip!");
            await g.say('shawn', 'Or the same brand of chip, from the same casino, owned by a different guy who also flips them constantly.');
            await g.say('gus', "...That's Gil's chip.");
            await g.say('shawn', "That's Gil's chip.");
            g.objective("Gil wore the costume? Find out WHY he'd rob his own contest, and where the money went.");
          } else await g.say('shawn', 'Tiki Tom has given up all his secrets. He is at peace now.');
        } },
      { id: 'seaglass', name: 'Glint in the Sand', x: 64, y: 150, w: 16, h: 12, walk: [80, 158], secret: true, show: (g) => !g.hasGift('seaglass') && !(g.global.giftsGiven || []).includes('seaglass'),
        look: async (g) => {
          await g.say('shawn', 'Ooh. Sea glass. Shaped like a heart. The ocean is basically setting me up here, Gus.');
          await g.gift('seaglass');
          await g.say('gus', 'Are you going to give a piece of trash to Juliet?');
          await g.say('shawn', "It's not trash, Gus. It's a love letter from the sea.");
        } },
      { id: 'pool', name: 'Tide Pool', x: 100, y: 156, w: 40, h: 14, walk: [120, 150],
        look: async (g) => { await g.say('gus:surprised', 'OW! A crab just pinched me!'); await g.say('shawn', 'He likes you, Gus. That is how crabs say hello.'); g.emote('gus', 'anger'); } },
      { id: 'pilings', name: 'Pilings', x: 150, y: 24, w: 30, h: 110, walk: [165, 140],
        look: async (g) => { await g.say('shawn', 'Barnacles, seaweed, and one very old flip-flop. Every piling tells a story. This one is boring.'); } },
    ],
    onEnter: async (g, o) => {
      if (o.first) {
        await g.say('gus', 'Shawn, it is dark and damp and there are crabs.');
        if (g.hasClue('mascot_midnight')) await g.say('shawn', "Tiki Tom dragged a cooler this way. If I were a guilty mascot, this is exactly where I'd have a breakdown.");
        else await g.say('shawn', 'Gus, this is where the magic happens. Or where seagulls go to die. One of the two.');
      }
    },
  };

  /* ---- Fun Zone Arcade ---- */
  scenes.arcade = {
    name: 'Fun Zone Arcade', width: 320, music: 'map',
    floor: { x0: 16, x1: 300, y0: 132, y1: 172 },
    entries: { pier: { x: 30, y: 152, face: 'right' } },
    bg(x) {
      G.bands(x, 0, 0, 320, 120, ['#1a0e30', '#221238', '#2a1640', '#321a4a'], 2);
      for (let px = 0; px < 320; px += 16) G.vl(x, px, 0, 120, '#2a1a4a');
      G.hl(x, 0, 14, 320, '#ff6ac8'); G.hl(x, 0, 15, 320, '#7a1a6a');
      R.floor(x, 0, 120, 320, 60, 'carpet', '#1a1a4a');
      const r = U.rng('arcadecarpet'); for (let i = 0; i < 120; i++) G.px(x, Math.floor(r() * 320), 121 + Math.floor(r() * 58), ['#ff6ac8', '#2ce8f5', '#fee761', '#63c74d'][i % 4]);
      const cols = ['#7a3a8a', '#2a6ab0', '#c83a4a', '#3a8a5a', '#e8a030', '#5a3a9a', '#2a8a9a'];
      for (let i = 0; i < 7; i++) R.arcade(x, 22 + i * 26, 122, cols[i], 0, i);
      // claw machine
      G.rect(x, 208, 66, 30, 56, '#e43b44'); G.rect(x, 211, 70, 24, 30, '#9ac8e8'); G.dither(x, 211, 70, 24, 30, '#c8e8ff', 3);
      for (let i = 0; i < 5; i++) G.circle(x, 215 + i * 4, 96, 2, ['#fee761', '#ff8ab8', '#a8743f', '#63c74d', '#2ce8f5'][i]);
      G.line(x, 222, 70, 222, 84, '#c0cbdc'); G.line(x, 220, 84, 224, 84, '#c0cbdc');
      // prize counter + shelves
      G.rect(x, 246, 24, 70, 70, '#3a2a5a');
      for (let sy = 34; sy < 90; sy += 18) G.rect(x, 246, sy, 70, 2, '#8a6a9a');
      const prizes = [['plush', 252, 30], ['plush', 264, 30], ['ticket', 284, 32], ['tooth', 298, 32], ['ring', 254, 50], ['gem', 270, 50], ['shell', 290, 50], ['plush', 300, 48], ['heart', 256, 68], ['sunglasses', 276, 70], ['feather', 296, 68]];
      for (const [ic, px, py] of prizes) x.drawImage(P.icon(ic), px, py);
      R.pineapple(x, 286, 86, 0); // a pineapple keychain, way up on the shelf
      G.rect(x, 244, 98, 74, 24, '#5a2a6a'); G.rect(x, 244, 96, 74, 3, '#ff6ac8'); R.sign(x, 258, 104, 46, 10, 'PRIZES', { bg: '#14082a', fg: '#fee761' });
      R.door(x, 4, 70, 22, 50, '#3a2a5a', { glass: true });
    },
    anim(x, t) {
      for (let i = 0; i < 7; i++) {
        const X = 22 + i * 26;
        const k = (Math.floor(t * 4) + i) % 4;
        G.rect(x, X + 3, 122 - 37, 16, 13, ['#0a0a24', '#0a1a3a', '#1a0a3a', '#0a2a2a'][k]);
        G.px(x, X + 4 + ((Math.floor(t * 10) + i * 3) % 14), 122 - 30, '#fee761');
        G.px(x, X + 6 + ((Math.floor(t * 7) + i * 5) % 12), 122 - 34, '#2ce8f5');
      }
      if (P.game.g.flag('highscore_t') && t - (P.game.g.get('highscore_t') || 0) < 4) {
        const on = Math.floor(t * 8) % 2;
        P.font.draw(x, 'HI', 22 + 3 * 26 + 5, 122 - 34, on ? '#fee761' : '#ff6ac8');
      }
    },
    hotspots: [
      { id: 'out', name: 'Exit to the Wharf', x: 0, y: 66, w: 28, h: 60, walk: [24, 150], exit: 'pier', verb: 'Leave via' },
      { id: 'claw', name: 'Claw Machine', x: 206, y: 64, w: 34, h: 60, walk: [222, 140],
        use: async (g) => { await g.say('gus', 'One try.'); g.sfx('boing'); await g.wait(600); await g.say('gus:sad', 'The claw is rigged. The claw is ALWAYS rigged.'); await g.say('shawn', 'The claw has free will, Gus. It chose not to love you.'); } },
      { id: 'prizes', name: 'Prize Counter', x: 244, y: 24, w: 74, h: 100, walk: [262, 140],
        use: async (g) => {
          if (!g.hasItem('tickets')) { await g.say('shawn', 'A sea otter plush. 500 tickets. Gus, how many tickets do we have?'); await g.say('gus', 'Zero, Shawn. We have zero tickets.'); return; }
          const c = await g.choose([
            { text: 'Plush Sea Otter (500)', value: 'otter', disabled: g.flag('got_otter') },
            { text: 'Rubber Shark (300)', value: 'shark', disabled: g.flag('got_shark') },
            { text: 'Never mind', value: 'no' },
          ], { title: 'Prize Counter', cancel: 'no' });
          if (c === 'otter') { g.set('got_otter'); await g.gift('otterplush'); await g.say('shawn', 'An otter. For Jules. They hold hands when they sleep, you know.'); await g.say('gus', 'You literally just read that on the tag.'); }
          if (c === 'shark') { g.set('got_shark'); await g.say('gus:happy', 'A rubber shark? For me? Shawn...'); await g.say('shawn', "Every time you look at it, I want you to remember that you once let a crab beat you up."); g.emote('gus', 'heart'); }
          if (g.flag('got_otter') && g.flag('got_shark')) g.take('tickets');
        } },
      { id: 'cabs', name: 'Arcade Cabinets', x: 20, y: 76, w: 76, h: 46, walk: [60, 140],
        look: async (g) => { await g.say('shawn', U.pick(['"GALAXY SURFER." "TURBO KART 3." "STREET BRAWLERS: THE REBRAWLENING." Gus, this is a sacred place.', 'I once beat Gus at Turbo Kart so badly he retired from video games for a week.'])); } },
    ],
    actors: [
      { id: 'dewey', x: 112, y: 140, face: 'left', idle: 'backArms', show: (g) => !g.flag('dewey_back'), walk: [138, 146], talk: (g) => talkDewey(g),
        observe: (g) => g.say('shawn', "Thumb calluses, eye bags, and a hoodie with a ketchup stain shaped like Florida. This kid hasn't left the arcade since last night.") },
    ],
    onEnter: async (g, o) => {
      if (o.first) { await g.say('shawn', 'Gus. The Fun Zone. I spent my entire fourteenth summer in here.'); await g.say('gus', 'And all your money. And mine.'); }
    },
  };

  /* --------------------------------------------------------- conversations */
  async function talkGil(g) {
    if (g.once('met_gil')) {
      await g.say('gil', 'You cops? I already told the lady cop everything. Twice.');
      await g.say('shawn:smug', "Better than cops. We're psychic.");
      await g.introGus('gil');
      await g.say('gil', 'Psychic, huh? Then you already know the punk surfer did it.');
    }
    await g.topics('gil', [
      { id: 'what', label: 'What happened last night?', run: async (gg) => {
        await gg.say('gil', "I locked the purse in the box at ten. Ten grand, cash. Winners like cash, it photographs better.");
        await gg.say('gil:angry', "Came back at six, the tent's sliced open and my money's gone! It was Ruiz. Everybody knows he owes half of Santa Barbara.");
      } },
      { id: 'combo', label: 'Who knows the combination?', when: (gg) => gg.hasClue('combo_two'), run: async (gg) => {
        await gg.say('gil', "Me and Hal Fenwick, the head judge. Hal's harmless. He's been judging since surfboards were made of redwood.");
        await gg.say('shawn', 'And yet he knows the combination.');
        await gg.say('gil', "I changed it Friday. Gave it to him personally. Made sure he had it. ...What are you implying?");
        await gg.say('shawn', "Nothing. I'm a psychic. We only imply things spiritually.");
      } },
      { id: 'mascot', label: 'About the missing mascot...', when: (gg) => gg.flag('know_costume') || gg.flag('hook_seen'), run: async (gg) => {
        await gg.say('gil:angry', "Eight hundred bucks, that Tiki Tom suit! The kid who wears it, Dewey, probably lost it partying.");
        await gg.say('shawn', 'Where would we find Dewey?');
        await gg.say('gil', "How should I know? Ask his aunt. She runs the shave ice stand. When she bothers to open it.");
        gg.set('need_dewey');
        if (!gg.flag('hired')) gg.objective('Keep digging. The tent still matters most right now.');
      } },
      { id: 'chip', label: 'Nice chip.', when: (gg) => gg.hasClue('gil_chip') && !gg.hasClue('chip_in_costume'), run: async (gg) => {
        await gg.say('gil:happy', "Lucky Lady Casino, Tahoe, ninety-eight. Hit a royal flush. Never leave home without it.");
        await gg.say('shawn', 'Do you gamble a lot, Gil?');
        await gg.say('gil:stern', '...I play cards with friends. Recreationally. Why?');
      } },
      { id: 'chipgone', label: "Where's your lucky chip, Gil?", when: (gg) => gg.hasClue('chip_in_costume'), run: async (gg) => {
        await gg.say('gil:worried', "My— it's in my other pants. Why? Why would you ask me that? Who's asking?");
        await gg.say('shawn', 'No reason. Just a friendly psychic inquiry.');
        await realization(gg);
      } },
    ], { title: 'Gil' });
  }
  async function observeGil(g) {
    if (!g.hasClue('chip_in_costume')) {
      if (await g.clue('gil_chip')) { await g.think('Flip, catch, flip, catch. Dad would call that a tell.'); }
      else await g.say('shawn', 'Still flipping that chip. Flip, catch. Flip, catch. Gus, I\'m getting hypnotized.');
    } else await realization(g);
  }
  async function realization(g) {
    if (g.flag('realized')) { await g.say('shawn', 'No chip. Just a nervous hand patting an empty pocket.'); return; }
    g.set('realized');
    await g.say('shawn', "No chip. He keeps patting his pocket. The tell is gone...");
    g.flash('#fff2c0', 300); g.sfx('whoosh');
    g.flashback(true);
    await g.say('younghenry', "When a man's tell suddenly disappears, Shawn, that means he lost it. Or he left it somewhere he shouldn't have.", { name: 'Henry (1987)' });
    g.flashback(false);
    g.sfx('flash');
    await g.think("Somewhere like inside a mascot head. Under a pier. Next to a stolen cooler.");
    g.objective(g.hasClue('gil_debt') ? (g.hasClue('van_cooler') ? 'Tell Chief Vick the spirits want a big finish.' : 'Where would Gil stash a cooler full of cash? Check his van.') : 'Why would Gil rob his own contest? Somebody on the wharf might know about his money troubles.');
  }

  async function talkRicky(g) {
    if (g.once('met_ricky')) {
      await g.say('ricky', "Bro, if you're another cop, I already told the scary one. I didn't take the money.");
      await g.introGus('ricky');
      await g.say('ricky:happy', '...Gnarly name, dude.');
    }
    await g.topics('ricky', [
      { id: 'where', label: 'Where were you at midnight?', run: async (gg) => {
        await gg.say('ricky', "Right here, man. Waxing my board under the full moon. Moon wax. It's a ritual.");
        await gg.say('gus', 'Is that a real thing?');
        await gg.say('ricky', "It's real if you believe, bro.");
      } },
      { id: 'money', label: 'Heard you owe people money.', run: async (gg) => {
        await gg.say('ricky', "Everybody owes money, dude. But I'm gonna WIN the purse tomorrow. Why would I steal it today? That's like... bad math.");
        await gg.say('shawn', 'He has a point, Gus.');
        await gg.say('gus', 'Bad math is your entire life philosophy, Shawn.');
      } },
      { id: 'saw', label: 'See anything weird last night?', run: async (gg) => {
        await gg.say('ricky', 'Just Tiki Tom wandering around after midnight. I figured Dewey was doing a bit. That kid is always doing a bit.');
        gg.set('know_costume');
      } },
      { id: 'dewey', label: 'Who is Dewey?', when: (gg) => gg.flag('need_dewey') || gg.flag('know_costume') || gg.flag('hired'), run: async (gg) => {
        await gg.say('ricky', "Leilani's nephew. He wears the Tiki Tom suit. When he's not working, he basically lives at the Fun Zone arcade on Stearns Wharf.");
        if (!gg.flag('pier_known')) { gg.set('pier_known'); gg.toast('New location: Stearns Wharf', 'map', '#7ee2d0'); }
        if (gg.flag('hired') && !gg.flag('dewey_back')) gg.objective('Find Dewey at the Fun Zone arcade on Stearns Wharf.');
      } },
    ], { title: 'Ricky' });
  }

  async function talkFenwick(g) {
    if (g.once('met_fenwick')) {
      await g.say('fenwick:happy', "Duuude. Psychics! Far out. I had my aura read in Big Sur once. It was teal.");
      await g.introGus('fenwick');
      await g.say('fenwick:happy', 'Groovy.');
    }
    await g.topics('fenwick', [
      { id: 'night', label: 'Where were you last night?', run: async (gg) => {
        await gg.say('fenwick', "Elks Lodge karaoke, man. Till two. I sang 'Margaritaville' four times. By request. Mostly mine.");
        await gg.clue('judge_alibi');
        await gg.say('gus', 'Forty people heard that. Four times.');
        await gg.say('shawn', "That's not an alibi, Gus. That's a hostage situation.");
      } },
      { id: 'combo', label: 'You know the lockbox combo?', when: (gg) => gg.hasClue('combo_two'), run: async (gg) => {
        await gg.say('fenwick', "Gil gave it to me Friday. Made a big deal about it. Wanted me to know it. Wanted everybody to know I knew it.");
        await gg.say('fenwick:worried', 'Weird vibe, man. Like a guy picking out a scapegoat at the scapegoat store.');
        await gg.think("Interesting. Gil made sure there'd be someone else to blame.");
      } },
      { id: 'scores', label: "Who's winning?", run: async (gg) => {
        await gg.say('fenwick', "Ricky. Kid's untouchable this year. He wins tomorrow, no question. If there's still a prize, man.");
      } },
    ], { title: 'Judge Fenwick' });
  }

  async function talkLeilani(g) {
    if (!g.flag('dewey_back')) {
      if (g.once('met_leilani')) {
        await g.say('leilani', 'Aloha, boys. Sorry, closed today.');
        await g.introGus('leilani');
        await g.say('leilani:happy', 'Cute. Still closed.');
      }
      await g.topics('leilani', [
        { id: 'why', label: 'Why are you closed?', run: async (gg) => {
          await gg.say('leilani', "My nephew Dewey runs the register, and he vanished last night. You find that boy, you tell him Auntie is NOT mad.");
          await gg.say('leilani:angry', 'Auntie is a LITTLE mad.');
          await gg.say('gus:sad', 'No shave ice, Shawn. NO shave ice.');
          gg.set('need_dewey');
          if (gg.flag('hired')) gg.objective('Find Dewey. Somebody here must know where he hangs out.');
        } },
        { id: 'night', label: 'Were you here last night?', run: async (gg) => {
          await gg.say('leilani', "Sure, I closed late. But I don't gossip with customers. You're not even customers today.");
          await gg.say('shawn', 'What if we brought Dewey back?');
          await gg.say('leilani:happy', "Then you'd be family. Family I gossip with.");
        } },
      ], { title: 'Auntie Leilani' });
      return;
    }
    if (g.once('leilani_thanks')) {
      await g.say('leilani:happy', 'You found my Dewey! Mahalo, boys. Shave ice is on the house!');
      await g.say('gus:happy', 'Shawn. SHAWN. Free.');
      await g.snack('shaveice');
      await g.say('gus:happy', 'Li hing mui. Lilikoi. A snowcap of condensed milk. I am having an emotional experience.');
      await g.say('leilani', 'And this, for someone special.');
      await g.gift('plumeria');
      await g.say('shawn', 'Auntie, I\'m flattered, but I\'m seeing someone. Spiritually. Sort of.');
      await g.say('leilani:smug', 'Not for ME, silly. For your girl.');
    }
    await g.topics('leilani', [
      { id: 'night2', label: 'What did you see last night?', run: async (gg) => {
        await gg.say('leilani', "I was closing up, about 12:15. And there goes Tiki Tom, big tiki head, grass skirt, dragging a big cooler down the sand toward the pier.");
        await gg.say('leilani:angry', 'I waved. Tiki Tom did NOT wave back. Very rude for a mascot.');
        if (await gg.clue('mascot_midnight')) {
          await gg.say('shawn', 'Dewey hung that costume in the tent at ten. So who was in it at 12:15?');
          if (!gg.flag('pier_known')) { gg.set('pier_known'); gg.toast('New location: Stearns Wharf', 'map', '#7ee2d0'); }
          gg.objective('Tiki Tom headed for the pier with a cooler. Look under Stearns Wharf.');
        }
      } },
      { id: 'togo', label: 'Can I get one to go?', when: (gg) => !gg.hasItem('shaveice_togo') && !gg.flag('sal_paid'), run: async (gg) => {
        await gg.say('leilani', 'For a friend? Rainbow? Condensed milk on top?');
        await gg.say('shawn', 'Auntie, you read my mind.');
        await gg.say('leilani:smug', "Who's the psychic now?");
        await gg.item('shaveice_togo');
      } },
      { id: 'dewey', label: "How's Dewey doing?", run: async (gg) => {
        await gg.say('leilani', 'Grounded. Working the register. Talking about his "high score" like it was the moon landing.');
      } },
    ], { title: 'Auntie Leilani' });
  }

  async function talkDewey(g) {
    if (g.once('met_dewey')) {
      g.set('dewey_found');
      await g.say('dewey', "Not now, dude. One life left. Galaxy Surfer high score. This is my destiny.");
      await g.introGus('dewey');
      await g.say('dewey', "...Sick. Still busy.");
    }
    g.anim('dewey', null);
    await g.topics('dewey', [
      { id: 'aunt', label: "Your aunt's looking for you.", run: async (gg) => {
        await gg.say('dewey:worried', "I can't go back, man. The Tiki Tom suit's missing and Gil's gonna make me pay for it. It's like eight hundred bucks. I make nine an hour.");
      } },
      { id: 'suit', label: 'Where did you leave the suit?', run: async (gg) => {
        await gg.say('dewey', "In the judges' tent. Ten o'clock. On the hook. Gil told me to. He was super specific. Like, 'Hook. Tent. Ten. Don't be late.'");
        if (await gg.clue('costume_left')) await gg.think('Gil wanted that costume in the tent with the money. At ten. Alone.');
      } },
      { id: 'leave', label: "C'mon, let's go see Auntie.", when: (gg) => !gg.flag('dewey_back'), run: async (gg) => {
        if (!gg.flag('dewey_needs_quarters')) {
          await gg.say('dewey', "I'm out of quarters and one life away from the all-time high score. I am NOT leaving a legacy unfinished.");
          gg.set('dewey_needs_quarters');
          gg.objective('Get Dewey some quarters so he can finish his game. Who carries quarters?');
        } else await gg.say('dewey', 'Quarters, dude. The legacy needs quarters.');
      } },
    ], { title: 'Dewey', onPresent: async (gg, id) => {
      if (id === 'quarters') { await deweyHighScore(gg); return true; }
      if (id === 'chip_in_costume' || id === 'costume_found') { await gg.say('dewey:surprised', 'You found Tiki Tom?! Dude. DUDE. Is he okay?'); await gg.say('shawn', "He's been through a lot, Dewey."); return true; }
      return false;
    } });
  }
  async function deweyHighScore(g) {
    g.take('quarters');
    await g.say('shawn', "Dewey. Gus's emergency quarters. Finish your legacy.");
    await g.say('gus:sad', 'Goodbye, quarters. You were going to be parking.');
    await g.say('dewey:happy', "You guys are legends.");
    g.anim('dewey', 'backArms');
    g.music('tension');
    for (let i = 0; i < 6; i++) { g.sfx(i % 2 ? 'select' : 'type'); await g.hop('dewey', 2); await g.wait(220); }
    g.sfx('drumroll'); await g.wait(800);
    g.set('highscore_t', P.game.scene.t);
    g.sfx('reveal'); g.flash('#fee761', 250);
    g.anim('dewey', 'armsUp');
    await g.say('dewey:happy', "NEW HIGH SCORE! D-E-W! I'm immortal, bro!");
    g.music('map');
    g.stopAnim('dewey');
    g.face('dewey', 'shawn');
    await g.say('dewey', "Here. Eight hundred tickets. Prize counter's over there. And... yeah. I'll go see Auntie. Tell her I'm sorry about the suit.");
    await g.item('tickets');
    await g.say('dewey', "Oh, and if you find Tiki Tom? Tell him I'm sorry too.");
    if (!g.hasClue('costume_left')) {
      await g.say('dewey', "I left him right where Gil told me. On the hook in the judges' tent, ten o'clock sharp. Gil was super specific about it.");
      await g.clue('costume_left');
    }
    g.set('dewey_back');
    await g.walk('dewey', 10, 150);
    g.remove('dewey');
    g.objective("Auntie Leilani's stand should be open now. She was there late last night. Ask what she saw.");
  }

  async function talkSal(g) {
    if (g.once('met_sal')) {
      await g.say('sal', "Beat it. Fish don't bite when people talk.");
      await g.introGus('sal');
      await g.say('sal', "I don't care what his name is.");
    }
    await g.topics('sal', [
      { id: 'gil', label: 'Know Gil Hazelton?', run: async (gg) => {
        if (gg.flag('sal_paid')) { await gg.say('sal', "I told you everything. Ten large, due Sunday. Now let a man fish."); return; }
        if (!gg.flag('sal_read')) { await gg.say('sal', 'Never heard of him.'); await gg.say('gus', "That was fast. That was suspiciously fast."); await gg.think('Let me read this guy before I push (Q).'); return; }
        await gg.say('sal', "Okay, psychic. You got my attention. But I don't talk business on an empty stomach.");
        await gg.say('sal', "Rainbow shave ice. Condensed milk. Then we talk.");
        gg.set('sal_wants');
        gg.objective(gg.flag('dewey_back') ? "Get a to-go shave ice from Auntie Leilani for Sal." : "Sal wants shave ice. Leilani's stand needs to reopen first.");
      } },
      { id: 'fish', label: 'Catch anything?', run: async (gg) => { await gg.say('sal', 'A boot. A smaller boot. And a crab with an attitude.'); await gg.say('gus', "We've met the crab."); } },
    ], { title: 'Sal', onPresent: async (gg, id) => {
      if (id === 'shaveice_togo') {
        gg.take('shaveice_togo'); gg.set('sal_paid');
        await gg.say('sal', "Rainbow. Condensed milk. Now THAT'S service.");
        await gg.say('sal', "Okay. Gil's into me for ten large from a bad week at the track. Due Sunday. Told me, and I quote, 'Don't worry, Sal. I'll have it after the contest.'");
        if (await gg.clue('gil_debt')) {
          await gg.say('shawn', 'Ten grand. Same as the purse.');
          await gg.say('gus', "Gil was going to pay his bookie with the prize money.");
          await gg.say('sal', "Hey. I'm a fishing enthusiast who sometimes holds onto money for friends.");
          if (!gg.hasClue('van_cooler')) gg.objective('So where is the cooler full of cash now? Somewhere Gil can keep an eye on it.');
        }
        return true;
      }
      if (id === 'gil_chip' || id === 'chip_in_costume') { await gg.say('sal', 'Lucky Lady chip. Gil loves that joint. It does not love him back.'); return true; }
      return false;
    } });
  }
  async function observeSal(g) {
    if (g.flag('sal_read')) { await g.say('shawn', 'Same betting slip in the hat band. Same sunburned scowl.'); return; }
    g.set('sal_read');
    await g.zoom({ at: 'sal', icon: 'receipt', title: 'Betting Slip', text: "Tucked into his hat band: a betting slip. Scrawled on it: 'G.H. - 10K - SUN'." });
    await g.say('shawn:psychic', "Mr. Fusco... I'm sensing... initials. G... H... and a number. Ten... thousand? Sunday?");
    await g.say('sal:surprised', "How did you— okay. Okay. You're good.");
  }

  async function talkVickBeach(g) {
    if (g.flag('finale_pending') && !g.flag('finale_done')) {
      const c = await g.ask('vick:stern', 'Are the spirits ready to try again, Mr. Spencer?', [{ text: "They're ready, Chief.", value: 1 }, { text: 'They need a minute.', value: 0 }]);
      if (c === 1) await runFinaleRevelation(g);
    }
  }

  /* ------------------------------------------------------------- finale */
  async function finale(g) {
    g.set('finale_started');
    g.music('finale');
    await g.stage({
      shawn: [330, 158, 'right'], gus: [300, 150, 'right'], vick: [386, 146, 'left'], lassiter: [262, 146, 'right'], juliet: [410, 152, 'left'],
      gil: [236, 154, 'right'], mcnab: [214, 142, 'right'], ricky: [438, 158, 'left'], dewey: [458, 146, 'left'],
    });
    const gil = g.actor('gil'); if (gil) gil.prop = 'sweat';
    await g.say('vick:stern', "All right, Mr. Spencer. Everyone's here. The sun is setting. Make it quick.");
    await g.say('shawn', "Chief, the spirits don't do quick. They do dramatic. With a light breeze.");
    await g.say('gil:angry', 'This is ridiculous. I have a contest to reschedule.');
    await g.say('fenwick', 'Groovy. Is there gonna be a show?');
    await runFinaleRevelation(g);
  }
  async function runFinaleRevelation(g) {
    const ok = await g.revelation('finale');
    if (!ok) { g.objective('Talk to Chief Vick on the beach when you are ready to try again.'); return; }
    // the chase (such as it is)
    g.music('finale');
    await g.say('gil:angry', 'You can\'t prove— no. NO.');
    g.walkNoWait('gil', 120, 152, { run: true });
    await g.wait(250);
    await g.say('lassiter:angry', 'He\'s running! Guster!');
    await g.say('gus:surprised', "Why ME?!");
    g.walkNoWait('gus', 150, 160, { run: true });
    await g.wait(900);
    g.sfx('hit'); g.shake(400, 4);
    g.anim('gus', 'kneel', 2000); g.anim('gil', 'kneel', 4000);
    await g.say('gus:surprised', 'I TRIPPED ON A SANDCASTLE AND FELL ON HIM. I MEANT TO DO THAT.');
    await g.walk('lassiter', 140, 150, { run: true });
    g.face('lassiter', 'gil');
    await g.say('lassiter:smug', "Gil Hazelton, you're under arrest for grand theft and filing a false police report.");
    await g.say('gil:sad', "It was a loan! From myself! To myself!");
    await g.say('lassiter', 'Tell it to the judge.');
    await g.say('fenwick', "I'm a judge.");
    await g.say('lassiter:stern', 'A REAL judge.');
    g.stopAnim('gus');
    await g.walk('mcnab', 70, 140);
    g.sfx('door');
    await g.say('mcnab:happy', "Detective! Blue cooler, back of the van, padlocked. Want me to... oh, I opened it. It's money! It's SO much money!");
    await g.say('vick', 'Excellent work, Officer. And... Mr. Spencer. Mr. Guster.');
    await g.say('ricky:happy', 'So the contest is back on?');
    await g.say('fenwick:happy', 'Heats at dawn, dude!');
    await g.say('leilani:happy', 'Free shave ice for life for the psychic boys!');
    await g.say('gus:surprised', 'For LIFE?');
    await g.say('leilani', 'For the life of the stand. Let\'s not get crazy.');
    // Juliet moment
    const r = g.global.romance || 0;
    await g.approach('juliet', 'shawn', 22);
    if (r >= 2) {
      await g.say('juliet:happy', 'That was impressive, Shawn. Weird, and loud, and you fell over twice. But impressive.');
      await g.say('shawn:smug', 'Jules, would you like to celebrate with a complimentary lifetime shave ice?');
      await g.say('juliet:flirty', "...Rainbow. Condensed milk. And you're not allowed to talk about the spirits the whole time.");
      g.emote('juliet', 'heart', 1500); g.sfx('heart');
      await g.say('gus', 'Shawn. Did that just happen?');
      await g.say('shawn', 'Gus, I think it did.');
      g.set('jules_date1');
    } else {
      await g.say('juliet:smile', 'Nice work, Shawn. Really.');
      await g.say('shawn', 'Jules, maybe we could—');
      await g.say('juliet', "Paperwork, Shawn. Mountains of it. Goodnight, Gus.");
      await g.say('gus', 'She almost smiled at you. I am counting it.');
    }
    g.set('finale_done');
    await g.fade(true, 600);
    g.unset('finale_pending');
    await g.card({ kicker: 'LATER THAT WEEK', title: "DAD'S PORCH", sub: 'Every man has a tell.', dur: 2.5 });
    await epilogue(g);
  }
  async function epilogue(g) {
    await g.goto('henry', { x: 160, y: 154 });
    g.place('henry', 200, 150, 'left');
    await g.say('henry', 'Heard you nailed the promoter. A poker chip in a mascot head, huh?');
    await g.say('shawn:smug', "Every man has a tell, Dad.");
    await g.say('henry:surprised', '...You remembered that.');
    await g.say('shawn', 'I remember everything. I just pretend not to. It keeps you humble.');
    await g.say('henry:smug', "So what's yours, Shawn? Your tell.");
    await g.say('shawn', "I don't have one.");
    await g.say('henry', 'You do a thing with your eyebrows when you lie.');
    g.anim('shawn', 'shrug', 800);
    await g.say('shawn', 'No I don\'t.');
    await g.say('gus', 'You totally do.');
    await g.say('henry:smug', 'Like a semaphore.');
    await g.say('shawn', '...Who wants fish tacos? I want fish tacos.');
    await g.wait(300);
    await g.complete();
  }

  /* --------------------------------------------------------- revelations */
  const revelations = {
    hired: {
      requires: ['flap_cut_inside', 'lockbox_unforced'],
      audience: ['vick', 'lassiter', 'juliet', 'gus'],
      intro: async (g) => {
        await g.stage({ shawn: [250, 158, 'right'], gus: [222, 150, 'right'], vick: [300, 146, 'left'], lassiter: [190, 148, 'right'], juliet: [282, 162, 'left'] });
        await g.say('vick:stern', "Mr. Spencer. Detective Lassiter tells me you were seen near his crime scene.");
        await g.say('shawn', "Seen? Chief, I was DRAWN there. By forces beyond my control. Wait... wait... it's happening again...");
        await g.say('lassiter:stern', 'Oh, here we go.');
      },
      steps: [
        {
          prompt: "Lassiter thinks Ricky broke into the tent. What proves the thief didn't come in from outside?",
          answer: 'flap_cut_inside',
          guesses: ["I'M SENSING... AN OUTSIDE JOB!", 'NO... A SIDE JOB! A SIDE SALAD!', 'IN... INSIDE! IT\'S COMING FROM INSIDE!'],
          final: 'IT WAS AN INSIDE JOB!', pointAt: 'lassiter',
          after: async (g) => {
            await g.say('lassiter:surprised', 'The flap was cut from the INSIDE?');
            await g.say('juliet', "The fibers do push outward, Carlton. I noticed that too.");
            await g.say('lassiter:stern', '...I was going to notice it.');
          },
          wrong: { ricky_wax: async (g) => { await g.say('shawn:worried', 'The spirits are saying... wax. Wax museum? No. Wax on, wax off. That\'s Ricky\'s alibi, not the break-in. Different vision.'); } },
          hint: 'Shawn. The tent flap. Remember which way the fibers were pointing?',
        },
        {
          prompt: 'So how did the thief get into a locked box without breaking it?',
          answer: ['lockbox_unforced', 'combo_two'],
          guesses: ['A CROWBAR! A CROW! A... BAR!', 'A COMBO! A COMBO PLATTER! WITH FRIES!'],
          final: 'THEY KNEW THE COMBINATION!', pointAt: 'vick',
          after: async (g) => {
            await g.say('vick', "And a surfer like Ricky Ruiz wouldn't know the combination.");
            await g.say('juliet', 'Gil said only he and Judge Fenwick have it.');
          },
          hint: 'The lockbox, Shawn. Not a scratch on it.',
        },
      ],
      outro: async (g) => {
        await g.say('vick', "Mr. Spencer. Mr. Guster. Consider yourselves hired. Standard consulting rate.");
        await g.say('shawn:happy', 'Can we get that in shave ice?');
        await g.say('vick:stern', 'No.');
        await g.say('lassiter:angry', 'Chief!');
        await g.say('vick', 'Carlton, Ruiz stays a person of interest. But we look at everyone with that combination.');
        await g.say('gus', 'Shawn, we have a job. A real one. With a rate.');
        await g.say('shawn', 'Gus, I always knew we would make it. I just did not know when, or how, or why.');
        g.set('hired');
        g.objective('You\'re hired! Check out Judge Fenwick, and find out what happened to the missing Tiki Tom costume.');
      },
    },
    finale: {
      requires: ['mascot_midnight', 'costume_left', 'chip_in_costume', 'gil_debt', 'van_cooler'],
      audience: ['vick', 'lassiter', 'juliet', 'gil', 'gus', 'mcnab', 'ricky', 'dewey'],
      music: 'vision',
      intro: async (g) => {
        await g.say('shawn:psychic', 'Everybody quiet. The spirits are... surfing in. Hang on. They\'re hanging ten.');
      },
      steps: [
        {
          prompt: 'Someone carried the money away from the tent at midnight. Who did Leilani see?',
          answer: 'mascot_midnight',
          guesses: ['I SEE... A TIKKA MASALA!', 'NO! A TIC TAC! A TICK-TOCK!', 'TI... TIKI...'],
          final: 'TIKI TOM!', pointAt: 'dewey',
          after: async (g) => {
            await g.say('dewey:surprised', 'Whoa, whoa! It wasn\'t me, dude! I swear on my high score!');
            await g.say('lassiter:smug', 'The mascot kid. I knew it was someone young and irresponsible.');
          },
        },
        {
          prompt: 'Everyone is looking at Dewey. What proves he wasn\'t in the suit?',
          answer: 'costume_left',
          guesses: ['DEWEY! DEW... DEW DROP!', 'MOUNTAIN DEW! DO THE DEW!', 'DEW... DEWN\'T! HE DIDN\'T!'],
          final: 'DEWEY LEFT IT IN THE TENT AT TEN!', pointAt: 'gil',
          after: async (g) => {
            await g.say('dewey', 'Yeah! Gil told me exactly where to leave it! Hook. Tent. Ten.');
            await g.say('juliet', 'So whoever was in the tent after ten had a ready-made disguise.');
          },
        },
        {
          prompt: 'Then who was inside Tiki Tom?',
          answer: 'chip_in_costume',
          guesses: ['I SEE A... CHIMP!', 'A CHEAP... A CHEAPSKATE!', 'A CHIP! A LUCKY... LADY...'],
          final: 'GIL HAZELTON!', pointAt: 'gil', gusJoins: true,
          after: async (g) => {
            await g.say('gil:angry', "That's insane! Anybody could have a casino chip!");
            await g.say('shawn', 'Gil, you flip that chip like it pays rent. Where is it right now?');
            g.emote('gil', 'sweat');
            await g.say('gil:worried', "It's... in my other... pants.");
          },
          wrong: { judge_alibi: async (g) => { await g.say('fenwick:happy', "It wasn't me, man! I was singing! Four times!"); await g.say('shawn', "Right, the spirits know, Hal. They were there. They're still recovering."); } },
        },
        {
          prompt: 'Why would a promoter rob his own contest?',
          answer: 'gil_debt',
          guesses: ['I SEE A FISH! A SALMON!', 'SAL... SALMONELLA? SAL-SA?', 'TEN... TENNIS! TENNESSEE!'],
          final: 'HE OWES SAL TEN GRAND!', pointAt: 'gil',
          after: async (g) => {
            await g.say('vick', 'The prize money would have paid off his bookie. And the "break-in" would have covered it up.');
            await g.say('ricky', 'Bro. You were gonna pin it on me?');
          },
        },
        {
          prompt: 'So where is the ten grand right now?',
          answer: 'van_cooler',
          guesses: ['COOL RANCH! I SEE COOL RANCH!', 'COOLIO! A GANGSTA\'S PARADISE!', 'COOL... COOLER...'],
          final: 'IN THE COOLER IN HIS VAN!', pointAt: 'gil',
          after: async (g) => { await g.say('lassiter:surprised', '...Huh.'); },
        },
      ],
      fail: async (g) => {
        await g.say('vick:stern', 'Mr. Spencer, take five. Come find me when the spirits have their facts in a row.');
        await g.say('shawn:worried', "They're very disorganized, Chief. It's a whole union thing.");
      },
    },
  };

  /* -------------------------------------------------------------- hints */
  const hints = [
    { id: 'h_go', when: (g) => !g.s.visited.beach, vague: "You're not going to solve anything sitting in that office. Go to the scene.", specific: 'Use the office door, open the map, and pick Leadbetter Beach. Honestly, Shawn.' },
    { id: 'h_tent', when: (g) => !g.hasClue('flap_cut_inside') || !g.hasClue('lockbox_unforced'), vague: ["The answer's in that tent. A good cop gets in with permission. A Spencer finds another way."], specific: ["That big officer turns around to watch the surfers every few seconds. When his back's to the tent, you walk in. And once you're in, LOOK at the flap and the box.", "Or do it the honest way: take a close look at the surfer kid's story, then show what you find to Detective O'Hara."] },
    { id: 'h_vick', when: (g) => !g.flag('hired'), vague: "You've got something. Don't sit on it.", specific: "Go to the station. Tell Karen you're having one of your 'visions'. Then show her the flap and the box." },
    { id: 'h_dewey', when: (g) => !g.flag('dewey_found'), vague: 'Somebody wore that mascot suit for a living. Find them.', specific: ['Ask the shave ice lady or the promoter about the missing costume. Then ask that surfer kid where the mascot boy hangs out.', 'Hint: it involves quarters and a wharf.'] },
    { id: 'h_quarters', when: (g) => !g.flag('dewey_back'), vague: "Kids want what kids want. What does a kid in an arcade want?", specific: "Quarters, Shawn. Talk to Gus. He has a roll of them in his pocket. He always does. He's Gus." },
    { id: 'h_leilani', when: (g) => !g.hasClue('mascot_midnight'), vague: "The shave ice lady is open again. People who close late see things.", specific: 'Talk to Leilani about last night.' },
    { id: 'h_costume', when: (g) => !g.hasClue('costume_found'), vague: 'If you dragged something to the pier at midnight, where would you ditch the evidence?', specific: 'Take the beach access stairs on the wharf. Look under the pier.' },
    { id: 'h_chip', when: (g) => !g.hasClue('chip_in_costume'), vague: 'You found the costume. Did you LOOK at it?', specific: 'Use that so-called vision of yours on the mascot head. Q, or right-click. Inside it.' },
    { id: 'h_costume_left', when: (g) => !g.hasClue('costume_left'), vague: 'Who was SUPPOSED to be in that suit, and where did he leave it?', specific: 'Ask Dewey where he left the costume.' },
    { id: 'h_sal', when: (g) => !g.hasClue('gil_debt'), vague: 'Motive, Shawn. People steal when they owe.', specific: ['The fisherman on the wharf, Sal. Read him first with your eyes, then work on him with your wallet.', "He'll talk for a to-go shave ice from Leilani."] },
    { id: 'h_van', when: (g) => !g.hasClue('van_cooler'), vague: "Ten grand doesn't evaporate. It sits somewhere and waits.", specific: "Look at the promoter's van in the beach parking lot. Closely." },
    { id: 'h_final', when: (g) => !g.flag('finale_done'), vague: "You've got it. Stop calling me and go close it.", specific: "Go tell Karen you're ready. And Shawn, don't do the thing where you fall on the floor." },
  ];

  /* ------------------------------------------- recurring cast this case */
  const topics = {
    vick: [
      { id: 'c1_case', label: 'About the surf contest theft...', run: async (g) => {
        if (!g.flag('hired')) { await g.say('vick', "Detective Lassiter has it handled, Mr. Spencer. He's focused on Ricky Ruiz."); await g.say('shawn', 'That is exactly what worries me, Chief.'); }
        else await g.say('vick', 'You have the department\'s full cooperation, Mr. Spencer. Within reason. Mostly within reason.');
      } },
      { id: 'c1_vision1', label: "Chief, I'm having a vision!", when: (g) => !g.flag('hired') && g.hasAll(['flap_cut_inside', 'lockbox_unforced']), keep: true, run: async (g) => { await g.revelation('hired'); return 'exit'; } },
      { id: 'c1_vision_early', label: "Chief, I'm having a vision!", when: (g) => !g.flag('hired') && !g.hasAll(['flap_cut_inside', 'lockbox_unforced']), keep: true, run: async (g) => {
        await g.say('shawn:psychic', "I'm seeing... a tent... a tent in... Tent-essee?");
        await g.say('vick:stern', 'Mr. Spencer. When you have something real, come back.');
        await g.think("I need to see inside that tent first. The flap and the lockbox.");
      } },
      { id: 'c1_finale', label: 'The spirits want a big finish, Chief.', when: (g) => g.flag('hired') && !g.flag('finale_done') && g.hasAll(['mascot_midnight', 'costume_left', 'chip_in_costume', 'gil_debt', 'van_cooler']), keep: true, run: async (g) => {
        await g.say('shawn:psychic', 'Chief. The spirits want everyone on the beach. At sunset. With the promoter. And maybe some shave ice.');
        await g.say('vick:stern', '...Fine. Detectives, McNab, with me. If this is a waste of my evening, Mr. Spencer, you\'re buying everyone dinner.');
        await g.say('gus:worried', 'He cannot afford that.');
        g.set('finale_pending');
        await g.goto('beach', { x: 330, y: 158 });
        return 'exit';
      } },
      { id: 'c1_not_ready', label: 'The spirits want a big finish, Chief.', when: (g) => g.flag('hired') && !g.flag('finale_done') && !g.hasAll(['mascot_midnight', 'costume_left', 'chip_in_costume', 'gil_debt', 'van_cooler']), keep: true, run: async (g) => {
        await g.say('vick:stern', "A big finish needs a big middle, Mr. Spencer. What do you actually have?");
        await g.think("Not enough yet. Who wore the costume, why they needed money, and where it went.");
      } },
    ],
    juliet: (g) => [
      { id: 'c1_what', label: 'What happened here, Jules?', when: (gg) => !gg.flag('hired'), run: async (gg) => {
        await gg.say('juliet', "Gil Hazelton, the promoter, says he locked ten thousand dollars in cash in that tent at ten last night. This morning the back's slashed open and the box is empty.");
        await gg.say('juliet', 'Carlton likes Ricky Ruiz for it. Ricky was seen near the tent around midnight, and he owes money all over town.');
      } },
      { id: 'c1_combo', label: 'Who could open the lockbox?', run: async (gg) => {
        await gg.say('juliet', 'Gil says only two people know the combination: him and the head judge, Hal Fenwick.');
        await gg.clue('combo_two');
      } },
      { id: 'c1_costume', label: 'Anything else missing?', run: async (gg) => {
        await gg.say('juliet', 'Weirdly, yes. The contest mascot costume. Tiki Tom. Gil is more upset about that than the money, honestly.');
        gg.set('know_costume');
      } },
      { id: 'c1_peek', label: 'Can I take a peek inside the tent?', when: (gg) => !gg.flag('hired') && !gg.flag('juliet_ok') && P.where(gg, 'juliet') === 'beach', keep: true, run: async (gg) => {
        if (gg.hasClue('ricky_wax')) await juliettPermission(gg);
        else { await gg.say('juliet', "Shawn, I can't just let you into a crime scene. Give me one good reason to doubt Carlton's theory, and maybe we'll talk."); await gg.think('A reason to doubt Lassie. Ricky\'s story, maybe? If I could prove it...'); }
      } },
      { id: 'c1_lead', label: 'Any new leads?', when: (gg) => gg.flag('hired'), run: async (gg) => {
        if (!gg.flag('dewey_back')) await gg.say('juliet', "We're still trying to find the kid who wears the mascot suit. Dewey Kealoha. His aunt runs the shave ice stand.");
        else if (!gg.hasClue('gil_debt')) await gg.say('juliet', "Gil's finances are a mess, Shawn. Three maxed-out cards. But no one will say who he owes.");
        else await gg.say('juliet', 'Honestly? I think you know more than we do right now. Which is annoying.');
      } },
    ],
    lassiter: [
      { id: 'c1_case', label: 'What do we know, Lassie?', run: async (g) => {
        if (!g.flag('hired')) {
          await g.say('lassiter', "We know Ricky Ruiz was near this tent at midnight and owes money to half of Santa Barbara. Case closed.");
          await g.say('shawn', "Sounds like you've already decided.");
          await g.say('lassiter:smug', "Sounds like I'm good at my job.");
        } else {
          await g.say('lassiter:stern', "We know YOU got lucky. Ruiz is still a person of interest. And I am still watching you, Spencer.");
          await g.say('shawn', "Aw. I'm watching you too, buddy.");
        }
      } },
      { id: 'c1_tent', label: 'Can we see the tent?', when: (g) => !g.flag('hired'), run: async (g) => {
        await g.say('lassiter', 'No.');
        await g.say('shawn', 'What if I—');
        await g.say('lassiter:angry', 'No.');
        await g.say('gus', "He said no twice, Shawn. That's a no-no.");
      } },
    ],
    henry: [
      { id: 'c1_tells', label: 'Dad, about tells...', run: async (g) => {
        await g.say('henry', 'Uncle Ray rolled a silver dollar every time he bluffed. Cost him a fishing boat in 1987.');
        await g.say('henry:stern', "Everybody has something their hands do when their mouth lies. Find it. Then notice when it stops.");
      } },
    ],
    gus: [
      { id: 'c1_quarters', label: 'Gus, give me your quarters.', when: (g) => g.flag('dewey_needs_quarters') && !g.hasItem('quarters') && !g.flag('dewey_back'), run: async (g) => {
        await g.say('gus:stern', 'These are my emergency parking quarters, Shawn.');
        await g.say('shawn', 'Gus. This IS an emergency. A child\'s legacy is on the line.');
        await g.say('gus', "...Fine. But I want it on the record that I'm being robbed in an arcade.");
        await g.item('quarters');
        g.objective('Give Dewey the quarters (talk to him, then Show evidence).');
      } },
    ],
  };
  async function juliettPermission(g) {
    await g.say('shawn', 'Jules. Ricky has fresh board wax under his nails and sand up to his knees. His moon-wax story checks out.');
    await g.say('juliet:surprised', '...You noticed that too? I saw the wax but Carlton wouldn\'t listen.');
    await g.say('juliet', 'Okay. Two minutes in the tent. If Carlton asks, I never saw you.');
    await g.say('juliet', 'McNab! Let these two through.');
    g.bubble('mcnab', 'You got it, Detective!', 1800);
    g.set('juliet_ok');
    g.objective('You have permission. Search the judges\' tent.');
  }

  /* -------------------------------------------------------------- banter */
  const banter = [
    [['gus', 'Shawn, that shave ice stand is RIGHT there.'], ['shawn', 'Focus, Gus. Crime first, shave ice second.'], ['gus', 'You have never said that sentence in your life.']],
    [['shawn', 'Gus, can you surf?'], ['gus', 'I can surf the web.'], ['shawn', '...Gus.']],
    [['gus', 'I am not getting sand in these shoes. They are Italian.'], ['shawn', 'The sand is also Italian, Gus. Probably.']],
    [['shawn', 'Ten grand. What would you buy?'], ['gus', 'A tasteful mid-size sedan.'], ['shawn', 'You HAVE a tasteful mid-size sedan.'], ['gus', 'A second one.']],
    [['shawn', 'Do you think seagulls know they are jerks?'], ['gus', 'I think they lean into it.']],
    [['gus', 'Is it weird that I want a malasada right now?'], ['shawn', 'It would be weird if you did NOT.']],
  ];

  /* ------------------------------------------------------------- chapter */
  P.registerChapter({
    id: 'ch1', number: 1, title: 'HANG TEN GRAND',
    tagline: 'A surf contest purse vanishes. The promoter has a tell.',
    pineapple: { scene: 'beach', note: "On Auntie Leilani's shave ice sign. (Also hiding in the arcade's prize shelf.)" },
    cast, clues, items, gifts, snacks, scenes, revelations, hints, topics, banter,
    where: {
      lassiter: (g) => (g.flag('finale_pending') ? 'beach' : !g.flag('hired') && !(g.hasClue('flap_cut_inside') && g.hasClue('lockbox_unforced')) ? 'beach' : 'station'),
      juliet: (g) => (g.flag('finale_pending') ? 'beach' : !g.flag('hired') && !(g.hasClue('flap_cut_inside') && g.hasClue('lockbox_unforced')) ? 'beach' : 'station'),
      mcnab: (g) => 'beach',
      vick: (g) => (g.flag('finale_pending') ? 'beach' : 'station'),
    },
    reactions: {
      juliet: { ricky_wax: async (g) => { if (!g.flag('juliet_ok') && !g.flag('hired')) await juliettPermission(g); else await g.say('juliet', 'Ricky\'s wax story holds up. Carlton still won\'t let it go.'); } },
      lassiter: { ricky_wax: async (g) => { await g.say('lassiter:stern', 'Wax. Under his fingernails. Fascinating. He is still my suspect.'); } },
      gil: {},
    },
    map: {
      beach: { name: 'Leadbetter Beach', x: 84, y: 106, scene: 'beach', scenes: ['tent'], chapter: true, desc: 'The Big Kahuna Surf Classic. Scene of the crime. Also: shave ice.' },
      pier: { name: 'Stearns Wharf', x: 170, y: 128, scene: 'pier', scenes: ['arcade', 'underpier'], chapter: true, show: (g) => g.flag('pier_known'), desc: 'Bait shop, churros, the Fun Zone arcade, and the beach under the pier.' },
    },
    extend: {
      office: {
        hotspots: [
          { id: 'tv', name: 'TV', x: 328, y: 28, w: 50, h: 32, walk: [352, 140],
            look: async (g) => { await g.say('TV Anchor', "...police are questioning local surfer Ricky 'Riptide' Ruiz about the ten-thousand-dollar purse stolen from the Big Kahuna Surf Classic..."); await g.say('shawn', "Lassie's on it. Which means it's going to be the wrong guy, very confidently."); } },
        ],
        onEnter: async (g) => {
          if (g.once('c1_intro')) {
            g.place('shawn', 300, 150, 'right'); g.place('gus', 270, 148, 'right');
            g.anim('shawn', 'think');
            await g.say('TV Anchor', "...breaking news from Leadbetter Beach, where the ten-thousand-dollar purse for this weekend's Big Kahuna Surf Classic vanished overnight from a locked judges' tent.");
            await g.say('TV Anchor', "Police say they have a person of interest: local surfer Ricky 'Riptide' Ruiz.");
            g.stopAnim('shawn');
            await g.say('shawn:happy', 'Gus. Ten grand. A beach. A mystery.');
            await g.say('gus', 'I have a lunch meeting with a urologist.');
            await g.say('shawn', "And Auntie Leilani's shave ice stand is twenty feet from the crime scene.");
            await g.say('gus:surprised', "...The one with the li hing mui?");
            await g.say('shawn:smug', 'The one with the li hing mui.');
            await g.say('gus', "I'll get the car.");
            await g.say('gus', 'And Shawn? Try not to touch anything at the crime scene.');
            await g.say('shawn', "Gus, I'm a psychic. I don't need to touch things. I just LOOK at them. Really, really hard.");
            await g.message('HOW TO PLAY', 'Walk: arrows/WASD or click. Interact: E or click. Shawn-Vision: Q (hidden things sparkle; right-click also observes). Case File: Tab. Stuck? Press H to call Dad. Head out the front door to open the map.', { icon: 'magnifier' });
            g.objective('Head to Leadbetter Beach. Use the front door to open the map.');
          }
        },
      },
      station: {
        onEnter: async (g, o) => {
          if (g.hasAll(['flap_cut_inside', 'lockbox_unforced']) && !g.flag('hired') && g.once('c1_station_hint')) {
            await g.say('gus', "Shawn, Chief Vick is right there. If you're going to do your thing, do it now.");
          }
        },
      },
    },
    async start(g) {
      g.flashback(true);
      await g.goto('flash87', { instant: true });
      await g.card({ kicker: 'SANTA BARBARA', title: '1987', sub: 'Poker night at the Spencer house', dur: 2.6 });
      await g.say('ray', "Henry, your kid's staring at my cards again.");
      await g.say('younghenry', "He's not looking at your cards, Ray. He's looking at YOU. Shawn, c'mere.");
      await g.walk('youngshawn', 110, 158);
      await g.say('younghenry', "Everybody at this table has a tell. Watch 'em for a few seconds. Then close your eyes and tell me what you saw.");
      await g.say('youngshawn:happy', 'Like a game?');
      await g.say('younghenry:stern', "Like a lesson. Ready? Watch.");
      const ok = await g.memoryTest({ seconds: 6, question: 'Eyes closed, Shawn. What was Uncle Ray fiddling with?', options: ['His mustache', 'A silver dollar', 'A poker chip', 'His car keys'], answer: 1 });
      if (ok) {
        await g.say('younghenry:smile', 'A silver dollar. Good.');
        await g.say('youngshawn:happy', 'He rolls it over his knuckles. Every time he has bad cards.');
        await g.say('ray:surprised', "Henry! You're training a narc!");
      } else {
        await g.say('younghenry:stern', "A silver dollar, Shawn. You looked, but you didn't see.");
        await g.say('youngshawn:sad', 'I was looking at the pretzels.');
      }
      await g.say('younghenry', "Every man's got a tell. The thing his hands do when his mouth is lying.");
      await g.say('younghenry', "And when a man's tell suddenly disappears? That means he lost it. Or he left it somewhere he shouldn't have.");
      await g.say('youngshawn', 'Can I have a dollar?');
      await g.say('younghenry:stern', 'No.');
      g.sfx('boing');
      await g.say('ray:happy', 'Here, kid. Keep it.');
      await g.say('younghenry:angry', 'RAY.');
      await g.fade(true, 700);
      g.flashback(false);
      g.music('title');
      await g.card({ kicker: 'CASE 1', title: 'HANG TEN GRAND', sub: 'Santa Barbara. Present day.', dur: 3.6 });
      await g.goto('office', { x: 300, y: 150 });
    },
  });
})(window.P);
