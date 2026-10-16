'use strict';
/* ============================================================================
   CASE 3: SEANCE & SENSIBILITY
   TV psychic Madame Ozera calls Shawn a fraud and dares him to attend her
   seance at Vanderkamp Manor. Thunder. Candles. Blackout. When the lights
   come back, the Vanderkamp Sapphire is gone and the butler is out cold.

   Episode structure:
     Cold open  - 1990, Lucky's Pawn: Henry's fog test. "Fakes look perfect
                  until you put a little heat on them."
     Act 1      - The challenge on TV, the manor, the seance, the blackout.
                  Gus goes down the dumbwaiter (you play as Gus in the dark
                  basement). First vision in the foyer -> hired.
     Act 2      - Calm the terrified maid, wake the butler, get past Lassiter
                  to the upstairs (distraction OR permission), the golf bag,
                  the twist: the stolen sapphire is FAKE.
     Act 3      - Shawn holds his own seance. Two thieves, one storm.
   Pineapple: carved on the staircase newel post in the foyer (a classic
   symbol of hospitality). Not interactive.
   ========================================================================== */
(function (P) {
  const G = P.G, U = P.U, R = P.props;

  /* ------------------------------------------------------------------ cast */
  const cast = {
    dolores: {
      name: 'Dolores Vanderkamp', short: 'Dolores', h: 52, build: 'stout', skin: 'pale', jaw: 'soft', eyes: '#5a7a9a',
      hair: { style: 'beehive', color: 'white' }, face: { lashes: true, lips: '#b04060', wrinkles: true },
      top: { type: 'dress', color: '#6a2a8a' }, bottom: { type: 'skirt', color: '#6a2a8a' }, shoes: '#2a1a2a',
      acc: ['sapphire', 'earrings'], voice: { pitch: 1.1 }, color: '#d8a8ff', portrait: { bg: '#2a1438', frame: '#d8a8ff' },
    },
    ozera: {
      name: 'Madame Ozera', short: 'Madame Ozera', h: 55, build: 'fem', skin: 'olive', jaw: 'long', eyes: '#3a1a2a',
      hair: { style: 'long', color: 'black' }, face: { lashes: true, lips: '#8a2a4a' },
      top: { type: 'dress', color: '#3a1a4a' }, bottom: { type: 'skirt', color: '#3a1a4a' }, shoes: '#1a1418',
      acc: [{ type: 'turban', color: '#7a2a8a' }, 'hoops', { type: 'scarf', color: '#c89a3a' }], voice: { pitch: 0.92 }, color: '#e8a0ff', portrait: { bg: '#1e0e2a', frame: '#e8a0ff', base: 'smug' },
    },
    preston: {
      name: 'Preston Vanderkamp III', short: 'Preston', h: 57, build: 'slim', skin: 'rosy', jaw: 'long', eyes: '#4a8ac8',
      hair: { style: 'swoop', color: 'blonde' }, face: {},
      top: { type: 'polo', color: '#7ac8e8' }, bottom: { type: 'pants', color: '#d8c8a0' }, shoes: '#8a5a3a',
      acc: [{ type: 'scarf', color: '#f4e0c0' }], voice: { pitch: 1.05 }, color: '#9ae0ff', portrait: { bg: '#14303a', frame: '#9ae0ff' },
    },
    hargrove: {
      name: 'Hargrove', short: 'Hargrove', h: 58, build: 'slim', skin: 'pale', jaw: 'long', eyes: '#3a3a4a',
      hair: { style: 'balding', color: 'gray' }, face: { thickBrows: true },
      top: { type: 'tux', color: '#1a1a24', shirt: '#f4f4f8' }, bottom: { type: 'pants', color: '#1a1a24' }, shoes: '#0e0a14',
      acc: [{ type: 'bowtie', color: '#14101c' }], voice: { pitch: 0.8 }, color: '#c8c8d8', portrait: { bg: '#141420', frame: '#c8c8d8', base: 'stern' },
    },
    rosa: {
      name: 'Rosa', short: 'Rosa', h: 51, build: 'fem', skin: 'tan', jaw: 'soft', eyes: '#3a2a1a',
      hair: { style: 'bun', color: 'dkbrown' }, face: { lashes: true, lips: '#c04a5a' },
      top: { type: 'dress', color: '#2a2a3a', apron: '#f4f4f8' }, bottom: { type: 'skirt', color: '#2a2a3a' }, shoes: '#1a1418',
      acc: ['earrings'], voice: { pitch: 1.3 }, color: '#ffb0c0', portrait: { bg: '#2a1a24', frame: '#ffb0c0' },
    },
    pemberton: {
      name: 'Reginald Pemberton', short: 'Pemberton', h: 54, build: 'stout', skin: 'pale', jaw: 'round', eyes: '#5a5a4a',
      hair: { style: 'gray', color: 'salt' }, face: { mustache: 'white' },
      top: { type: 'vest', color: '#5a4a2a', shirt: '#f4f0e0' }, bottom: { type: 'pants', color: '#3a3a30' }, shoes: '#2a1a14',
      acc: [{ type: 'bowtie', color: '#2a4a8a' }, 'watch', 'monocle'], voice: { pitch: 0.9 }, color: '#e8d090', portrait: { bg: '#2a2414', frame: '#e8d090' },
    },
    archibald: {
      name: 'Archibald Vanderkamp', short: 'Archibald', h: 58, build: 'avg', skin: 'pale', jaw: 'long', eyes: '#3a4a5a',
      hair: { style: 'balding', color: 'white' }, face: { mustache: 'white', wrinkles: true },
      top: { type: 'suit', color: '#2a2a3a', shirt: '#f4f4f8', tie: '#6a1a2a' }, bottom: { type: 'pants', color: '#2a2a3a' }, shoes: '#0e0a14',
      acc: ['monocle'], color: '#c8c8d8', portrait: { bg: '#3a2a1a', frame: '#c8a040', base: 'stern' },
    },
    lucky: {
      name: 'Lucky', short: 'Lucky', h: 54, build: 'stout', skin: 'olive', jaw: 'round', eyes: '#2a1a14',
      hair: { style: 'balding', color: 'black' }, face: { mustache: 'black', glasses: 'square' },
      top: { type: 'shirt', color: '#e8e0c0' }, bottom: { type: 'pants', color: '#4a4a3a' }, shoes: '#2a1a14',
      voice: { pitch: 0.85 }, color: '#e0c890', portrait: { bg: '#2a2a1e', frame: '#d8c890' },
    },
  };

  /* -------------------------------------------------------------- evidence */
  const clues = {
    guest_log: { name: "Hargrove's Guest Book", icon: 'book', zoom: true, from: 'foyer', desc: 'Arrivals: Mr. Pemberton 3:00 PM (stayed for dinner). Preston: "in residence". Madame Ozera 8:45 PM. Spencer & Guster 8:52 PM.' },
    ozera_record: { name: "Ozera's Record", icon: 'card', from: 'Lassiter', desc: 'Madame Ozera (real name: Doris Ozeranski) has three prior arrests in Reno for fortune-telling fraud.' },
    ozera_tricks: { name: 'Seance Tricks', icon: 'magnifier', zoom: true, from: 'parlor', desc: 'Fishing line under the tablecloth to tip the table, and a tiny speaker behind the curtain for the "spirit voice". A fraud. But a fraud who never left the table.' },
    blackout_timer: { name: 'The Golf-Ball Timer', icon: 'timer', zoom: true, from: 'basement (Gus)', desc: 'A novelty 60-minute kitchen timer shaped like a golf ball, wired to trip the main breaker. It went off at 9:15, so it was set at 8:15.' },
    preston_letgo: { name: 'Preston Let Go', icon: 'glove', from: 'Dolores', desc: 'During the blackout, Preston let go of his aunt\'s hand. "His hand was clammy, and then it simply wasn\'t."' },
    hargrove_saw: { name: "Hargrove's Account", icon: 'note', from: 'Hargrove', desc: 'In the dark, someone tall rushed up the stairs and struck Hargrove with something round and heavy. They smelled of limes and gin.' },
    preston_debts: { name: "Preston's Debts", icon: 'money', from: 'Rosa', desc: 'Men call the house for "Mister Preston". Men who say "or else". He has been selling his golf clubs.' },
    pemberton_alone: { name: 'Twenty Minutes Alone', icon: 'watch', from: 'Rosa', desc: 'At 3 PM, Mr. Pemberton took the sapphire into the study to "polish" it. Door closed. Twenty minutes. Alone.' },
    timer_set: { name: 'Country Club Timer Set', icon: 'timer', zoom: true, from: "Preston's room", desc: 'A Montecito Country Club gift set of golf-ball timers in Preston\'s desk. Four slots. Three timers.' },
    necklace_found: { name: 'Necklace in the Golf Bag', icon: 'necklace', zoom: true, from: "Preston's room", desc: 'The Vanderkamp Sapphire necklace, stuffed in the ball pocket of Preston\'s golf bag.' },
    fog_test: { name: "Dad's Fog Test", icon: 'gem', zoom: true, from: "Preston's room", desc: 'Breathe on a real gem and the fog vanishes instantly. On this "sapphire" it lingered. It\'s glass. The necklace Preston stole is a FAKE.' },
    pemberton_broke: { name: 'Final Notice', icon: 'letter', zoom: true, from: 'coat closet', desc: "In Pemberton's coat: 'PEMBERTON & SONS FINE JEWELRY - FINAL NOTICE - VACATE IN 30 DAYS.'" },
    thick_watch: { name: "Pemberton's Pocket Watch", icon: 'watch', zoom: true, from: 'observation', desc: 'A hunter-case pocket watch, nearly half an inch too thick. He touches it constantly but never once checks the time.' },
  };
  const items = {
    salts: { name: 'Ammonia Inhalants', icon: 'vial', desc: 'From Gus\'s sample case. "For fainting." Gus has a lot of these. For reasons.' },
  };
  const gifts = {
    pressedrose: {
      name: 'Pressed Rose (1924)', icon: 'flower', romance: 1, desc: 'Found in a book of love poems. A note: "To Dolly. Forever, Archie."',
      give: async (g) => {
        await g.say('juliet:surprised', 'Shawn... this is from 1924. "To Dolly, forever, Archie."');
        await g.say('shawn', "Mrs. Vanderkamp said a rose that old should belong to someone who still believes in forever.");
        await g.say('juliet:happy', "...She did not say that.");
        await g.say('shawn', 'She said "take it, I have nine hundred." But the spirit was there.');
      },
    },
    cameo: {
      name: 'Ivory Cameo Brooch', icon: 'ring', romance: 1, desc: 'From Rosa: "The Senora says give it to a nice girl. She has a hundred."',
      give: async (g) => {
        await g.say('juliet:happy', "A cameo? It's beautiful. It looks like... it looks like me, actually.");
        await g.say('gus', 'It really does.');
        await g.say('shawn', 'The spirits have excellent taste, Jules.');
      },
    },
    tarot: {
      name: 'Tarot Card: The Lovers', icon: 'card', romance: 2, desc: 'From Madame Ozera. "Give it to the one you see when you close your eyes."',
      give: async (g) => {
        await g.say('juliet:surprised', 'The Lovers? Shawn Spencer, are you giving me a TAROT card?');
        await g.say('shawn', 'Madame Ozera said to give it to the person I see when I close my eyes.');
        await g.say('juliet:flirty', '...And who do you see?');
        await g.say('shawn', 'Mostly the backs of my eyelids. But there was a blonde in a blazer. Very persistent.');
        await g.say('juliet:happy', "Smooth, Spencer.");
      },
    },
  };
  const snacks = {
    polvorones: { name: "Rosa's Polvorones", icon: 'donut', desc: 'Crumbly, buttery, used as currency to send Gus into a dumbwaiter.' },
    canapes: { name: 'Seance Canapes', icon: 'pie', desc: 'Tiny cucumber sandwiches. Gus ate eleven out of nervousness.' },
    cocoa: { name: "Hargrove's Hot Cocoa", icon: 'cup', desc: 'Made by a man with a concussion. Somehow still perfect.' },
  };

  /* -------------------------------------------------------------- weather */
  function storm(sc, dt) {
    sc.flashT = (sc.flashT == null ? U.rand(4, 9) : sc.flashT) - dt;
    if (sc.flashT <= 0) { sc.lightning = 1; sc.flashT = U.rand(7, 15); sc.thunderAt = U.rand(0.2, 0.9); }
    if (sc.lightning > 0) sc.lightning = Math.max(0, sc.lightning - dt * 2.2);
    if (sc.thunderAt != null) { sc.thunderAt -= dt; if (sc.thunderAt <= 0) { P.audio.sfx('thunder'); sc.thunderAt = null; } }
  }
  function stormWindow(x, X, Y, W, H, sc, t) {
    const L = sc.lightning || 0;
    G.rect(x, X, Y, W, H, L > 0.3 ? '#c8d0ff' : '#141a34');
    if (L > 0.5) { G.line(x, X + W * 0.6, Y, X + W * 0.4, Y + H * 0.5, '#ffffff'); G.line(x, X + W * 0.4, Y + H * 0.5, X + W * 0.55, Y + H, '#ffffff'); }
    R.rain(x, X, Y, W, H, t, L > 0.3 ? '#6a7ab0' : '#5a6aa0', Math.round(W * H / 60));
  }
  function stormFlash(x, sc) { if (sc.lightning > 0.4) { x.save(); x.globalAlpha = (sc.lightning - 0.4) * 0.35; G.rect(x, 0, 0, P.W, P.H, '#e8ecff'); x.restore(); } }

  const scenes = {};

  /* ---- cold open: Lucky's Pawn, 1990 ---- */
  scenes.flash90 = {
    name: "Lucky's Pawn, 1990", width: 320, noShawn: true, noGus: true, music: 'flashback',
    floor: { x0: 20, x1: 300, y0: 138, y1: 170 },
    bg(x) {
      R.wall(x, 0, 0, 320, 118, '#6a6a4a', { wainscot: 30, wainscotCol: '#4a3a2a' });
      R.floor(x, 0, 118, 320, 62, 'tile', '#a8a088');
      // shelves of everything
      for (let s = 0; s < 3; s++) G.rect(x, 10, 30 + s * 26, 90, 3, '#5a3a2a');
      G.rect(x, 14, 14, 12, 16, '#c87a3a'); G.circle(x, 20, 26, 5, '#c87a3a'); G.line(x, 20, 14, 20, 4, '#5a3a2a'); // guitar
      R.tv(x, 34, 56, { on: false }); G.rect(x, 70, 40, 14, 16, '#3a3a48'); G.rect(x, 86, 44, 10, 12, '#c0cbdc');
      R.clock(x, 52, 70, 6); G.rect(x, 64, 64, 30, 18, '#7a4a2a');
      R.sign(x, 120, 14, 90, 13, "LUCKY'S PAWN", { bg: '#c83a3a', fg: '#fee761' });
      R.sign(x, 240, 30, 60, 10, 'NO REFUNDS', { bg: '#f4ecd6', fg: '#c83a3a' });
      R.window(x, 236, 46, 64, 40, { frame: '#5a5a4a' });
      // glass counter
      G.rect(x, 112, 98, 110, 26, '#9ac8d8'); G.dither(x, 112, 98, 110, 26, '#c8e8f0', 4); G.frame(x, 112, 98, 110, 26, '#5a6a6a');
      G.rect(x, 110, 96, 114, 3, '#c0cbdc');
      G.rect(x, 140, 90, 56, 7, '#5a1a3a'); // velvet tray
    },
    props: [{ y: 100, draw: (x, cam) => {
      const sc = P.game.scene, f = sc.fog || { t: 99 };
      for (let i = 0; i < 3; i++) {
        const gx = 150 + i * 18 - cam, gy = 92;
        G.poly(x, [[gx - 3, gy], [gx + 3, gy], [gx + 4, gy + 2], [gx, gy + 5], [gx - 4, gy + 2]], '#e8f4ff'); G.px(x, gx - 1, gy + 1, '#ffffff'); G.px(x, gx + 1, gy + 2, '#9ac8ff');
        const clearAt = i === 2 ? 4.5 : 0.5;
        if (f.t < clearAt) { x.save(); x.globalAlpha = 0.85 * (1 - f.t / clearAt) + 0.1; G.ellipse(x, gx, gy + 2, 5, 4, '#f4f4f8'); x.restore(); }
      }
    } }],
    update(sc, dt) { if (sc.fog) sc.fog.t += dt; },
    actors: [
      { id: 'lucky', x: 214, y: 132, face: 'left' },
      { id: 'younghenry', x: 150, y: 152, face: 'right' },
      { id: 'youngshawn', x: 128, y: 158, face: 'right' },
    ],
  };

  /* ---- Vanderkamp Manor: the foyer ---- */
  scenes.foyer = {
    name: 'Vanderkamp Manor - Foyer', width: 480, music: 'mansion',
    floor: { x0: 10, x1: 470, y0: 134, y1: 172 },
    entries: { map: { x: 40, y: 152, face: 'right' }, parlor: { x: 180, y: 140, face: 'right' }, kitchen: { x: 274, y: 140, face: 'left' }, library: { x: 308, y: 140, face: 'left' }, preston: { x: 368, y: 142, face: 'left' } },
    bg(x) {
      const Wd = 480;
      R.wall(x, 0, 0, Wd, 120, '#5a1a2a', { wainscot: 40, wainscotCol: '#3a2214', crown: true });
      for (let yy = 8; yy < 76; yy += 10) for (let xx = (yy / 10) % 2 ? 4 : 9; xx < Wd; xx += 10) G.px(x, xx, yy, '#7a2a3a');
      R.floor(x, 0, 120, Wd, 60, 'checker', '#e8e0d0');
      // front doors + fanlight
      G.rect(x, 6, 44, 36, 76, '#2a1408'); R.door(x, 8, 52, 16, 68, '#4a2a14'); R.door(x, 24, 52, 16, 68, '#4a2a14');
      G.ellipse(x, 24, 46, 16, 7, '#141a34');
      // grandfather clock
      G.rect(x, 48, 48, 22, 72, '#4a2a14'); G.circle(x, 59, 60, 8, '#f4ecd6'); G.circle(x, 59, 60, 1, '#1a1424'); G.frame(x, 52, 74, 14, 34, '#2a1408');
      // coat closet
      R.door(x, 80, 62, 24, 58, '#3a2214');
      // side table + guest book + lamp
      G.rect(x, 112, 100, 34, 3, '#5a3a24'); G.rect(x, 116, 103, 3, 21, '#4a2a14'); G.rect(x, 139, 103, 3, 21, '#4a2a14');
      G.rect(x, 118, 96, 16, 4, '#f4ecd6'); G.vl(x, 126, 96, 4, '#8a7a6a'); R.lamp(x, 136, 100, '#e8c870');
      // parlor arch
      G.rect(x, 154, 46, 54, 74, '#1a0a14'); G.poly(x, [[154, 50], [181, 40], [208, 50]], '#1a0a14');
      G.rect(x, 154, 46, 3, 74, '#c8a040'); G.rect(x, 205, 46, 3, 74, '#c8a040');
      R.sign(x, 162, 30, 38, 9, 'PARLOR', { bg: '#2a1408', fg: '#c8a040' });
      // Archibald's portrait (rendered from the cast)
      G.rect(x, 214, 16, 42, 56, '#8a6a2a'); G.frame(x, 215, 17, 40, 54, '#c8a040');
      const pr = P.Portrait.get('archibald', 'stern'); if (pr) x.drawImage(pr, 0, 0, 48, 56, 218, 20, 34, 48);
      // kitchen + library doors
      R.door(x, 262, 62, 24, 58, '#3a2214'); R.sign(x, 256, 52, 36, 9, 'KITCHEN', { bg: '#2a1408', fg: '#c8a040', shadow: false });
      R.door(x, 296, 62, 24, 58, '#3a2214'); R.sign(x, 290, 40, 36, 9, 'LIBRARY', { bg: '#2a1408', fg: '#c8a040', shadow: false });
      G.vl(x, 307, 49, 13, '#c8a040');
      // tall window
      G.rect(x, 326, 22, 22, 72, '#2a1408');
      // grand staircase
      for (let i = 0; i < 12; i++) { const sx = 352 + i * 10, sy = 124 - i * 8; G.rect(x, sx, sy, 128 - i * 10, 8, i % 2 ? '#6a2a2a' : '#7a3030'); G.hl(x, sx, sy, 128 - i * 10, '#9a4a3a'); }
      G.rect(x, 440, 20, 40, 10, '#3a2214');
      for (let i = 0; i < 12; i++) G.vl(x, 356 + i * 10, 104 - i * 8, 16, '#e8d8b0');
      G.line(x, 352, 102, 470, 6, '#5a3a24', 2);
      // newel post with a carved pineapple finial (hospitality!)
      G.rect(x, 348, 98, 8, 26, '#5a3a24'); G.rect(x, 346, 96, 12, 3, '#6a4a2a');
      R.pineapple(x, 352, 96, 1);
      // chandelier chain (the chandelier itself sways in anim)
      G.vl(x, 240, 0, 8, '#c8a040');
    },
    anim(x, t, o) {
      const sc = o.scene, c = o.cam;
      stormWindow(x, 328 - c, 24, 18, 68, sc, t);
      stormWindow(x, 10 - c, 40, 28, 6, sc, t);
      // pendulum
      const sw = Math.sin(t * 3) * 4; G.line(x, 59 - c, 76, 59 - c + sw, 100, '#c8a040'); G.circle(x, 59 - c + sw, 102, 2, '#fee761');
      // chandelier
      const cx = 240 - c + Math.sin(t * 0.8) * 1.5;
      G.ellipse(x, cx, 14, 16, 4, '#c8a040'); for (let i = -2; i <= 2; i++) { G.vl(x, cx + i * 6, 6, 8, '#c8a040'); const on = !sc.blackout; G.px(x, cx + i * 6, 5, on ? (Math.random() < 0.9 ? '#fee761' : '#ffffff') : '#3a3a30'); }
    },
    overlay(x, t, o) { const sc = o.scene; stormFlash(x, sc); if (sc.blackout) { x.save(); x.globalAlpha = sc.lightning > 0.4 ? 0.3 : 0.97; G.rect(x, 0, 0, P.W, P.H, '#04020a'); x.restore(); } },
    update(sc, dt) { storm(sc, dt); },
    hotspots: [
      { id: 'frontdoor', name: 'Front Doors', x: 6, y: 44, w: 36, h: 78, walk: [34, 150], verb: 'Try the',
        use: async (g) => {
          if (!g.flag('seance_done')) { await g.map(); return; }
          await g.say('shawn', 'Locked. Storm outside. Lassiter says nobody leaves. A classic mansion mystery, Gus. We are LIVING the board game.');
          await g.say('gus', 'In the board game, somebody always gets hit with a candlestick.');
        } },
      { id: 'clock', name: 'Grandfather Clock', x: 46, y: 46, w: 26, h: 76, walk: [60, 140],
        look: async (g) => { await g.say('shawn', g.flag('seance_done') ? "Stopped at 9:15 when the power cut out. Electric grandfather clock. Archibald was a man of contradictions." : "A grandfather clock. It's watching me. They always are."); } },
      { id: 'closet', name: 'Coat Closet', x: 78, y: 60, w: 28, h: 62, walk: [92, 140], clue: (g) => g.flag('seance_done') && !g.hasClue('pemberton_broke'),
        look: async (g) => {
          if (!g.flag('seance_done')) { await g.say('shawn', "Coats. Furs. One very aggressive umbrella. Nothing to see. Yet."); return; }
          if (await g.clue('pemberton_broke')) {
            await g.say('shawn', "Gus. Pemberton's coat. An eviction notice for Pemberton & Sons Fine Jewelry. Thirty days.");
            await g.say('gus', 'A jeweler about to lose his store. In a house with a famous sapphire.');
            await g.say('shawn', 'In a STORM, Gus. Weather is always an accomplice.');
          } else await g.say('shawn', 'Furs. Tweed. A sad eviction notice. The closet has nothing left to tell me.');
        } },
      { id: 'guestbook', name: 'Guest Book', x: 114, y: 92, w: 24, h: 10, walk: [128, 138], clue: (g) => !g.hasClue('guest_log'),
        look: async (g) => {
          if (await g.clue('guest_log')) await g.think('Pemberton since three. Ozera at 8:45. Preston was home all day. Hargrove writes EVERYTHING down. I love this man.');
          else await g.say('shawn', "Hargrove's handwriting is so beautiful it should be illegal. Probably it is in some states.");
        } },
      { id: 'parlor', name: 'Parlor', x: 156, y: 46, w: 50, h: 76, walk: [180, 136], exit: 'parlor', verb: 'Go into the' },
      { id: 'portrait', name: "Archibald's Portrait", x: 214, y: 16, w: 42, h: 56, walk: [236, 138],
        look: async (g) => { await g.say('shawn', "Archibald Vanderkamp. His eyes follow you around the room."); await g.say('gus:worried', 'Shawn, they really do. They REALLY do.'); await g.say('shawn', "It's a painting trick, Gus. Or he's haunting us. Fifty-fifty."); } },
      { id: 'kitchen', name: 'Kitchen', x: 260, y: 60, w: 28, h: 62, walk: [274, 138], exit: 'kitchen', verb: 'Go into the' },
      { id: 'library', name: 'Library', x: 294, y: 60, w: 28, h: 62, walk: [308, 138], exit: 'library', verb: 'Go into the', show: (g) => g.flag('seance_done') },
      { id: 'stairs', name: 'Grand Staircase (upstairs)', x: 350, y: 20, w: 126, h: 104, walk: [372, 140], verb: 'Climb the',
        use: async (g) => {
          if (!g.flag('seance_done')) { await g.say('hargrove:stern', 'The upstairs is private, Mr. Spencer. Madame Ozera is ready for you in the parlor.'); return; }
          if (!g.flag('hired') && !g.flag('lassiter_away')) {
            g.face('lassiter', 'shawn');
            await g.say('lassiter:stern', 'Upstairs is off-limits, Spencer. Crime scene. Hargrove was attacked up there.');
            await g.say('shawn', 'Lassie, I just need to use the little psychics\' room.');
            await g.say('lassiter:angry', 'Use the one in the kitchen.');
            await g.think("Lassie won't budge. Not unless something more interesting comes along. Gus is VERY interesting.");
            return;
          }
          g.sfx('step');
          await g.goto('preston', { x: 290, y: 152 });
        } },
    ],
    actors: [
      { id: 'hargrove', x: 70, y: 150, face: 'right', show: (g) => !g.flag('seance_done'), talk: (g) => talkHargrovePre(g) },
      { id: 'dolores', x: 248, y: 148, face: 'left', show: (g) => !g.flag('finale_pending'), talk: (g) => talkDolores(g),
        observe: (g) => observeDolores(g) },
      { id: 'preston', x: 330, y: 154, face: 'left', show: (g) => !g.flag('finale_pending'), talk: (g) => talkPreston(g),
        observe: (g) => g.say('shawn', g.flag('seance_done') ? "Golf glove tan on his left hand. Smells like limes and gin. And he's sweating through cashmere in a cold house." : "Preston. Golf glove tan, cashmere sweater, and the haunted look of a man whose allowance has been cut.") },
      { id: 'pemberton', x: 140, y: 150, face: 'right', show: (g) => !g.flag('finale_pending'), talk: (g) => talkPemberton(g), observe: (g) => observePemberton(g) },
      { id: 'ozera', x: 212, y: 156, face: 'left', show: (g) => !g.flag('seance_done') || g.flag('ozera_free'), talk: (g) => talkOzera(g),
        observe: (g) => g.say('shawn', "Turban, hoops, and a confident aura. Also a very modern earpiece hidden under the turban. Somebody's feeding her information.") },
      { id: 'lassiter', x: 384, y: 150, face: 'left', idle: 'crossed', show: (g) => g.flag('seance_done') && !g.flag('lassiter_away') && !g.flag('finale_pending'), talk: (g) => P.castTalk(g, 'lassiter', P.BASE_TOPICS.lassiter) },
      { id: 'juliet', x: 100, y: 154, face: 'right', show: (g) => g.flag('seance_done') && !g.flag('finale_pending'), talk: (g) => P.castTalk(g, 'juliet', P.BASE_TOPICS.juliet) },
      { id: 'vick', x: 290, y: 146, face: 'left', show: (g) => g.flag('seance_done') && !g.flag('finale_pending'), talk: (g) => P.castTalk(g, 'vick', P.BASE_TOPICS.vick) },
    ],
    onEnter: async (g, o) => {
      if (g.once('manor_arrive')) {
        await g.say('hargrove:stern', 'Mr. Spencer. Mr. Guster. Madame Ozera said you would come. She said you would be late.');
        await g.say('shawn', "We're early!");
        await g.say('hargrove:stern', 'She said you would say that.');
        await g.say('gus:worried', 'Shawn, that is a little impressive.');
        await g.say('hargrove', 'Mrs. Vanderkamp will begin the seance when she is ready. Please do not touch the portraits. They are... sensitive.');
        g.objective('Meet the guests. When you\'re ready, tell Mrs. Vanderkamp to start the seance.');
      }
    },
  };

  /* ---- the parlor (seance room) ---- */
  function chair(x, X, Y, face) { const back = face > 0 ? X - 7 : X + 5; G.rect(x, X - 7, Y - 14, 14, 3, '#5a1a2a'); G.rect(x, back, Y - 32, 3, 19, '#3a1218'); G.vl(x, X - 6, Y - 11, 11, '#2a0a10'); G.vl(x, X + 5, Y - 11, 11, '#2a0a10'); }
  scenes.parlor = {
    name: 'The Parlor', width: 320, music: (g) => (g.flag('finale_pending') ? 'vision' : 'mansion'),
    floor: { x0: 16, x1: 304, y0: 134, y1: 172 },
    entries: { foyer: { x: 26, y: 154, face: 'right' } },
    blockers: [{ x: 128, y: 134, w: 64, h: 12 }],
    bg(x) {
      R.wall(x, 0, 0, 320, 120, '#2a1438', { wainscot: 30, wainscotCol: '#1a0a14', crown: true });
      for (let yy = 10; yy < 80; yy += 12) for (let xx = (yy / 12) % 2 ? 6 : 12; xx < 320; xx += 12) G.px(x, xx, yy, '#4a2a5a');
      R.floor(x, 0, 120, 320, 60, 'wood', '#4a2a1a');
      R.rug(x, 90, 132, 140, 30, '#5a1a3a');
      // fireplace
      G.rect(x, 22, 64, 54, 56, '#3a3a40'); G.rect(x, 18, 60, 62, 6, '#5a5a62'); G.rect(x, 32, 80, 34, 40, '#0e0a10');
      // bookcase
      R.bookshelf(x, 86, 120, 34, 74, '#3a2214', 'parlorbooks');
      // window with heavy curtains
      G.rect(x, 232, 22, 56, 78, '#141a34');
      G.poly(x, [[226, 16], [246, 16], [242, 108], [222, 108]], '#8a1a2a'); G.poly(x, [[274, 16], [294, 16], [298, 108], [278, 108]], '#8a1a2a');
      G.rect(x, 222, 14, 76, 4, '#c8a040');
      R.frame(x, 140, 24, 30, 36, 'portrait', 'lady');
      R.door(x, 2, 64, 14, 56, '#3a2214');
      // side table with canapes
      G.rect(x, 190, 104, 26, 3, '#5a3a24'); G.rect(x, 194, 107, 2, 17, '#4a2a14'); G.rect(x, 210, 107, 2, 17, '#4a2a14');
      G.ellipse(x, 203, 102, 10, 2, '#c0cbdc'); for (let i = 0; i < 4; i++) G.rect(x, 196 + i * 4, 99, 3, 2, '#f4ecd6');
    },
    props: [
      { y: 128, show: (g) => !!P.game.scene.seated, draw: (x, cam) => { for (const [cx, cy, f] of P.game.scene.seated || []) chair(x, cx - cam, cy + 1, f); } },
      { y: 141, draw: (x, cam, t) => { // round seance table
        const X = 160 - cam;
        G.ellipse(x, X, 120, 34, 8, '#3a1a4a'); G.rect(x, X - 34, 120, 69, 18, '#3a1a4a'); G.ellipse(x, X, 138, 34, 4, '#2a1238');
        for (let i = -30; i <= 30; i += 6) G.vl(x, X + i, 122, 16, '#4a2a5a');
        G.circle(x, X, 112, 6, '#9ac8ff'); G.circle(x, X - 2, 110, 2, '#e8f4ff'); G.rect(x, X - 4, 117, 8, 2, '#c8a040');
        for (const dx of [-22, 22]) { G.rect(x, X + dx - 1, 110, 3, 8, '#f4ecd6'); const fl = Math.floor(t * 9 + dx) % 2; G.px(x, X + dx, 108 - fl, '#fee761'); G.px(x, X + dx, 109, '#f77622'); }
      } },
    ],
    anim(x, t, o) {
      const sc = o.scene;
      stormWindow(x, 246, 22, 28, 78, sc, t);
      // fire
      for (let i = 0; i < 6; i++) { const fx = 36 + i * 5, h = 8 + Math.round(Math.sin(t * 9 + i * 2) * 4 + 4); G.rect(x, fx, 120 - h, 4, h, i % 2 ? '#f77622' : '#fee761'); }
    },
    overlay(x, t, o) {
      const sc = o.scene;
      stormFlash(x, sc);
      if (sc.dim) R.darkness(x, 160, 112, 70, sc.dim, [[50, 104, 40]]);
      if (sc.blackout) { x.save(); x.globalAlpha = sc.lightning > 0.4 ? 0.35 : 0.98; G.rect(x, 0, 0, P.W, P.H, '#04020a'); x.restore(); }
    },
    update(sc, dt) { storm(sc, dt); },
    hotspots: [
      { id: 'out', name: 'Foyer', x: 0, y: 60, w: 18, h: 62, walk: [22, 152], exit: 'foyer', verb: 'Back to the' },
      { id: 'table', name: 'Seance Table', x: 126, y: 104, w: 68, h: 36, walk: [160, 158], clue: (g) => g.flag('seance_done') && !g.hasClue('ozera_tricks'),
        look: async (g) => {
          if (!g.flag('seance_done')) { await g.say('shawn', 'A crystal ball, two candles, and a tablecloth with suspicious lumps. Gus, do not look under the tablecloth.'); await g.say('gus', 'I was not going to.'); return; }
          if (await g.clue('ozera_tricks')) { await g.say('shawn', 'Fishing line to tip the table, and a speaker behind the curtain for the spooky voice. Ozera is a fraud.'); await g.say('gus', "So she did it?"); await g.say('shawn', "Gus, she's a fraud with her hands on the table the entire time. I'd know. I was watching her hands. Like Dad taught me. Well. Like Dad taught me in a different episode of my life."); }
          else await g.say('shawn', 'Fishing line and a speaker. Seances are just magic tricks with better lighting.');
        } },
      { id: 'canapes', name: 'Canape Tray', x: 188, y: 94, w: 30, h: 14, walk: [204, 140],
        use: async (g) => {
          if (g.s.snacks.includes('canapes')) { await g.say('gus', 'I ate eleven. I am not proud. I am a little proud.'); return; }
          await g.say('shawn', 'Cucumber sandwiches. Crusts removed. The rich really do live differently, Gus.');
          await g.snack('canapes');
          await g.say('gus', 'These are the size of postage stamps. I need nine more.');
        } },
      { id: 'fireplace', name: 'Fireplace', x: 18, y: 58, w: 62, h: 62, walk: [52, 140],
        look: async (g) => { await g.say('shawn', 'Fireplace. Gas logs. Archibald wanted the look of a fire without the hassle of having to pretend he could build one.'); } },
      { id: 'curtains', name: 'Velvet Curtains', x: 222, y: 14, w: 78, h: 96, walk: [262, 138],
        look: async (g) => { await g.say('shawn', 'Behind the curtain: a tiny speaker with a wire running to... Ozera\'s chair. The voice of Archibald is brought to you by Bluetooth.'); } },
    ],
    actors: [
      { id: 'vick', x: 214, y: 150, face: 'left', show: (g) => g.flag('finale_pending'), talk: async (g) => { if (g.flag('finale_done')) return; const c = await g.ask('vick:stern', 'Ready to try again, Mr. Spencer?', [{ text: 'Ready, Chief.', value: 1 }, { text: 'One more minute.', value: 0 }]); if (c === 1) { g.unset('finale_started'); await finale(g); } } },
      { id: 'ozera', x: 160, y: 130, face: 'right', show: (g) => g.flag('seance_done') && !g.flag('ozera_free') && !g.flag('finale_pending'), idle: 'crossed', talk: (g) => talkOzera(g),
        observe: (g) => g.say('shawn', 'Ozera is pretending to meditate. She is actually listening to every word Lassiter says through that earpiece. Respect.') },
    ],
    onEnter: async (g) => {
      if (g.flag('finale_pending') && !g.flag('finale_started')) return finale(g);
    },
  };

  /* ---- kitchen ---- */
  scenes.kitchen = {
    name: 'Kitchen', width: 320, music: 'mansion',
    floor: { x0: 16, x1: 304, y0: 134, y1: 172 },
    entries: { foyer: { x: 28, y: 154, face: 'right' }, basement: { x: 236, y: 140, face: 'right' } },
    bg(x) {
      R.wall(x, 0, 0, 320, 120, '#e8ecf0', {});
      for (let yy = 40; yy < 120; yy += 8) for (let xx = 0; xx < 320; xx += 8) { G.frame(x, xx, yy, 8, 8, '#c8d0dc'); if ((xx + yy) % 32 === 0) G.px(x, xx + 4, yy + 4, '#4a7ad0'); }
      R.floor(x, 0, 120, 320, 60, 'checker', '#d8d8d0');
      R.door(x, 2, 64, 14, 56, '#5a3a24');
      // stove + pots
      G.rect(x, 40, 84, 60, 36, '#2a2a30'); G.rect(x, 40, 80, 60, 5, '#3a3a40'); G.rect(x, 48, 94, 44, 20, '#141418'); G.hl(x, 48, 94, 44, '#5a5a62');
      for (let i = 0; i < 4; i++) { G.line(x, 50 + i * 14, 20, 50 + i * 14, 34, '#5a5a62'); G.ellipse(x, 50 + i * 14, 40, 5, 4, '#c87a3a'); G.px(x, 48 + i * 14, 38, '#f0a860'); }
      // counter + cookie jar
      G.rect(x, 110, 96, 80, 4, '#c8b898'); G.rect(x, 112, 100, 76, 20, '#7a5a3a');
      G.rect(x, 160, 84, 12, 12, '#e8d8c0'); G.ellipse(x, 166, 84, 6, 2, '#c8a87a'); G.px(x, 166, 82, '#8a6a4a');
      // window
      G.rect(x, 120, 34, 50, 40, '#2a1408');
      // dumbwaiter hatch
      G.rect(x, 222, 68, 30, 28, '#5a3a24'); G.frame(x, 222, 68, 30, 28, '#3a2214'); G.rect(x, 234, 80, 6, 3, '#c8a040');
      R.sign(x, 218, 58, 38, 8, 'DUMBWAITER', { bg: '#3a2214', fg: '#c8a040', shadow: false });
      // basement door (locked)
      R.door(x, 274, 62, 26, 58, '#4a3a2a'); R.sign(x, 272, 52, 30, 8, 'CELLAR', { bg: '#3a2214', fg: '#c8a040', shadow: false });
      G.rect(x, 288, 90, 4, 6, '#8a8a98');
    },
    anim(x, t, o) { stormWindow(x, 122, 36, 46, 36, o.scene, t); },
    overlay(x, t, o) { stormFlash(x, o.scene); },
    update(sc, dt) { storm(sc, dt); },
    hotspots: [
      { id: 'out', name: 'Foyer', x: 0, y: 60, w: 18, h: 62, walk: [22, 152], exit: 'foyer', verb: 'Back to the' },
      { id: 'jar', name: 'Cookie Jar', x: 156, y: 78, w: 20, h: 20, walk: [166, 140],
        use: async (g) => {
          if (g.s.snacks.includes('polvorones')) { await g.say('gus', 'There are three left. They are for emergencies. Dumbwaiter emergencies.'); return; }
          await g.say('shawn', "Polvorones. Rosa's famous shortbread. Gus, these are basically clouds made of butter.");
          await g.snack('polvorones');
          g.set('gus_bribed');
          await g.say('gus:happy', "...Okay. Okay, these are incredible. Shawn, whatever you're about to ask me, the answer is a reluctant yes.");
        } },
      { id: 'dumbwaiter', name: 'Dumbwaiter', x: 220, y: 56, w: 34, h: 42, walk: [236, 138], show: (g) => g.flag('seance_done'),
        use: async (g) => {
          if (g.hasClue('blackout_timer')) { await g.say('gus', 'I am never getting back in there. I left part of my soul in that basement.'); return; }
          if (!g.flag('basement_locked_seen')) { await g.say('shawn', "The cellar's locked and Hargrove has the keys. But a dumbwaiter goes straight down to the basement..."); g.set('basement_locked_seen'); }
          await g.say('shawn', 'Gus. You fit.');
          if (!g.flag('gus_bribed')) { await g.say('gus:angry', 'I am NOT getting in a dumbwaiter. I am a pharmaceutical sales representative. I have a 401(k).'); await g.think('Gus responds well to baked goods. Rosa\'s cookie jar is right there.'); return; }
          await g.say('gus:worried', 'Fine. FINE. If I get stuck, tell my mother I died brave.');
          await g.say('shawn', "I'll tell her you died with crumbs on your tie, which is basically the same thing.");
          g.sfx('door');
          g.set('gus_pov');
          await g.goto('basement', { x: 40, y: 150 });
        } },
      { id: 'cellar', name: 'Cellar Door', x: 272, y: 60, w: 30, h: 62, walk: [288, 140],
        use: async (g) => { await g.say('shawn', 'Locked. Hargrove has the keys, and Hargrove is having a little nap. On the floor. Against his will.'); g.set('basement_locked_seen'); } },
      { id: 'stove', name: 'Stove', x: 40, y: 80, w: 60, h: 40, walk: [70, 140],
        look: async (g) => { await g.say('shawn', 'A six-burner professional range. Has anyone in this house ever cooked anything? I doubt it.'); await g.say('rosa', '¡Yo! Every day!'); await g.say('shawn', 'My apologies, Rosa.'); } },
    ],
    actors: [
      { id: 'rosa', x: 120, y: 150, face: 'right', show: (g) => g.flag('seance_done') && !g.flag('finale_pending'), talk: (g) => talkRosa(g),
        observe: (g) => g.say('shawn', 'Rosa is clutching a rosary, a wooden spoon, and a can of furniture polish. She is prepared for ghosts, cooking, and dust. In that order.') },
    ],
  };

  /* ---- the basement (Gus POV!) ---- */
  scenes.basement = {
    name: 'Basement (Gus)', width: 320, music: 'tension', noGus: true, shawnCast: 'gus',
    floor: { x0: 20, x1: 300, y0: 134, y1: 172 },
    bg(x) {
      G.rect(x, 0, 0, 320, 122, '#3a3a40');
      for (let yy = 0; yy < 122; yy += 8) for (let xx = (yy / 8) % 2 ? 0 : 10; xx < 320; xx += 20) G.frame(x, xx, yy, 20, 8, '#2a2a30');
      G.noise(x, 0, 0, 320, 122, ['#4a4a52', '#2a2a30'], 0.05, 'cellarwall');
      R.floor(x, 0, 120, 320, 60, 'concrete', '#4a4a50');
      // dumbwaiter shaft
      G.rect(x, 18, 66, 30, 30, '#2a1a10'); G.frame(x, 18, 66, 30, 30, '#5a3a24');
      // wine racks
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { G.circle(x, 74 + c * 10, 56 + r * 12, 4, '#1a1418'); G.circle(x, 74 + c * 10, 56 + r * 12, 2, (r + c) % 3 ? '#5a1a2a' : '#2a4a2a'); }
      G.frame(x, 66, 48, 64, 52, '#5a3a24');
      // furnace
      G.rect(x, 150, 52, 44, 68, '#5a5a62'); G.rect(x, 160, 92, 24, 14, '#1a1418'); G.rect(x, 168, 20, 8, 32, '#4a4a52');
      // trunk with a sheet ghost
      G.rect(x, 206, 100, 30, 20, '#6a4a2a'); G.frame(x, 206, 100, 30, 20, '#3a2214'); G.poly(x, [[210, 100], [226, 100], [222, 92], [214, 92]], '#e8e8f0'); G.px(x, 216, 95, '#1a1418'); G.px(x, 220, 95, '#1a1418');
      // fuse box
      G.rect(x, 250, 56, 26, 34, '#7a7a84'); G.frame(x, 250, 56, 26, 34, '#4a4a52');
      for (let i = 0; i < 4; i++) G.rect(x, 254 + (i % 2) * 10, 60 + Math.floor(i / 2) * 10, 6, 6, '#2a2a30');
      G.circle(x, 263, 82, 4, '#f4f4f8'); G.px(x, 262, 81, '#c0cbdc'); G.line(x, 263, 78, 263, 70, '#e43b44'); // the golf-ball timer
      // cobwebs
      G.line(x, 0, 0, 20, 20, '#8a8a92'); G.line(x, 0, 10, 14, 4, '#8a8a92'); G.line(x, 320, 0, 300, 18, '#8a8a92');
    },
    anim(x, t) { const g = Math.floor(t * 6) % 3; G.rect(x, 162, 94, 20, 10, ['#f77622', '#fe8a32', '#e86a12'][g]); const rx = 120 + ((t * 30) % 200); if (Math.floor(t / 4) % 3 === 0) { G.rect(x, rx, 166, 6, 3, '#4a3a3a'); G.px(x, rx + 6, 166, '#e8a8b8'); G.line(x, rx, 167, rx - 5, 165, '#4a3a3a'); } },
    overlay(x, t, o) {
      const sc = o.scene, p = sc.actors.shawn;
      if (p) R.darkness(x, p.x - o.cam + p.face * 14, p.y - 30, 50, 0.93, [[172, 100, 22]]);
    },
    hotspots: [
      { id: 'up', name: 'Dumbwaiter (back up)', x: 16, y: 62, w: 34, h: 38, walk: [34, 140], verb: 'Ride the',
        use: async (g) => {
          if (!g.hasClue('blackout_timer')) { await g.say('shawn', "Gus, you can't come up yet! Find the fuse box!", { phone: true }); await g.say('gus', 'I hate you so much right now.'); return; }
          g.unset('gus_pov');
          await g.goto('kitchen', { x: 236, y: 142 });
          await g.say('gus', 'I am back. I have seen things. I have seen a rat with a face like my uncle Lester.');
          await g.say('shawn', 'Gus, you are a hero. A crumb-covered, rat-adjacent hero.');
        } },
      { id: 'fusebox', name: 'Fuse Box', x: 248, y: 54, w: 30, h: 38, walk: [262, 140], clue: (g) => !g.hasClue('blackout_timer'),
        look: async (g) => {
          if (await g.clue('blackout_timer')) {
            await g.say('gus', "Shawn. There's a kitchen timer taped to the main breaker. Shaped like a golf ball. Sixty minutes.");
            await g.say('shawn', 'It went off at 9:15. So somebody set it at 8:15.', { phone: true });
            await g.say('shawn', "The lights didn't go out because of Archibald, Gus. They went out because of Titleist.", { phone: true });
            g.objective("Come back up the dumbwaiter. Then figure out who was in the house at 8:15.");
          } else await g.say('gus', 'The timer is still taped there. Still golf-shaped. Still upsetting.');
        },
        use: async (g) => { await g.say('gus', "I'm not touching anything electrical in a dark basement in a thunderstorm, Shawn. I have a LITTLE sense."); } },
      { id: 'trunk', name: 'Old Trunk', x: 204, y: 88, w: 34, h: 32, walk: [220, 140],
        look: async (g) => { await g.say('gus:surprised', 'AH! A GHOST! ...It is a bedsheet. Labeled "HALLOWEEN 1987".'); await g.say('shawn', "Gus, you screamed so loud I heard it without the phone.", { phone: true }); } },
      { id: 'wine', name: 'Wine Racks', x: 64, y: 46, w: 68, h: 56, walk: [98, 140],
        look: async (g) => { await g.say('gus', 'Shawn, there is a bottle down here older than my parents.'); await g.say('shawn', 'Bring it up.', { phone: true }); await g.say('gus', 'Absolutely not.'); } },
      { id: 'furnace', name: 'Furnace', x: 148, y: 50, w: 48, h: 70, walk: [172, 140],
        look: async (g) => { await g.say('gus:worried', 'The furnace is making a noise like it knows my name.'); } },
    ],
    onEnter: async (g, o) => {
      if (o.first) {
        await g.say('gus:worried', "Shawn? I'm down. It's dark. It smells like wine and wet dog. Why does a basement smell like wet dog when there is no dog?");
        await g.say('shawn', "You're doing great, buddy. Find the fuse box. I'm right here on the phone.", { phone: true });
        await g.say('shawn', "If you see a ghost, ask it for the WiFi password.", { phone: true });
        g.objective('(As Gus!) Find the fuse box in the dark basement.');
      }
    },
  };

  /* ---- library ---- */
  scenes.library = {
    name: 'Library', width: 320, music: 'mansion',
    floor: { x0: 16, x1: 304, y0: 134, y1: 172 },
    entries: { foyer: { x: 28, y: 154, face: 'right' } },
    bg(x) {
      R.wall(x, 0, 0, 320, 120, '#2a1a10', {});
      for (let i = 0; i < 6; i++) R.bookshelf(x, 24 + i * 48, 120, 44, 108, '#3a2214', 'lib' + i);
      R.floor(x, 0, 120, 320, 60, 'wood', '#5a3a24');
      R.rug(x, 120, 140, 100, 22, '#2a4a3a');
      G.rect(x, 272, 26, 30, 60, '#141a34');
      G.line(x, 214, 10, 230, 120, '#8a6a4a', 2); G.line(x, 222, 10, 238, 120, '#8a6a4a', 2); for (let i = 0; i < 8; i++) G.line(x, 215 + i * 2, 20 + i * 13, 223 + i * 2, 20 + i * 13, '#8a6a4a');
      R.door(x, 2, 64, 14, 56, '#3a2214');
      // globe
      G.rect(x, 104, 112, 2, 10, '#5a3a24'); G.circle(x, 105, 104, 8, '#3a7ab0'); G.ellipse(x, 102, 102, 3, 4, '#5aa84a'); G.ellipse(x, 108, 106, 2, 3, '#5aa84a');
    },
    props: [{ y: 141, draw: (x, cam) => { const X = 186 - cam; G.rect(x, X, 126, 50, 10, '#6a2a3a'); G.rect(x, X + 40, 112, 10, 16, '#6a2a3a'); G.hl(x, X, 126, 50, '#8a3a4a'); G.rect(x, X + 2, 136, 3, 5, '#3a2214'); G.rect(x, X + 45, 136, 3, 5, '#3a2214'); } }],
    anim(x, t, o) { stormWindow(x, 274, 28, 26, 56, o.scene, t); },
    overlay(x, t, o) { stormFlash(x, o.scene); },
    update(sc, dt) { storm(sc, dt); },
    hotspots: [
      { id: 'out', name: 'Foyer', x: 0, y: 60, w: 18, h: 62, walk: [22, 152], exit: 'foyer', verb: 'Back to the' },
      { id: 'poems', name: 'Book of Love Poems', x: 168, y: 40, w: 12, h: 10, walk: [174, 140], secret: true, show: (g) => !g.hasGift('pressedrose') && !(g.global.giftsGiven || []).includes('pressedrose'),
        look: async (g) => {
          await g.say('shawn', '"Sonnets for Dolly." And inside... a pressed rose. "To Dolly. Forever, Archie. 1924."');
          await g.gift('pressedrose');
          await g.say('gus', 'Shawn, you cannot take a dead man\'s rose.');
          await g.say('shawn', "I'll clear it with Dolores. I'm sure she has nine hundred.");
        } },
      { id: 'globe', name: 'Globe', x: 96, y: 94, w: 18, h: 28, walk: [106, 140],
        look: async (g) => { await g.say('shawn', 'An antique globe. Still has the Soviet Union on it. Gus, this house is a time machine.'); } },
      { id: 'ladder', name: 'Library Ladder', x: 212, y: 8, w: 30, h: 112, walk: [226, 140],
        look: async (g) => { await g.say('shawn', 'A rolling library ladder. Every kid\'s dream. Gus, push me.'); await g.say('gus', 'Absolutely not. Crime scene.'); } },
    ],
    actors: [
      { id: 'hargrove', x: 196, y: 138, face: 'left', idle: 'sitIdle', show: (g) => g.flag('seance_done') && !g.flag('finale_pending'), walk: [170, 150], talk: (g) => talkHargrove(g),
        observe: (g) => g.say('shawn', 'A bump on the back of his head the size of a golf ball. Round, hard object. And his eyes are still doing the cartoon spiral.') },
    ],
  };

  /* ---- Preston's room (upstairs) ---- */
  scenes.preston = {
    name: "Upstairs: Preston's Room", width: 320, music: (g) => (g.flag('hired') ? 'mansion' : 'tension'),
    floor: { x0: 16, x1: 304, y0: 134, y1: 172 },
    bg(x) {
      R.wall(x, 0, 0, 320, 120, '#1e2a4a', { stripes: 8, wainscot: 26, wainscotCol: '#14182a' });
      R.floor(x, 0, 120, 320, 60, 'carpet', '#3a2a3a');
      // bed
      G.rect(x, 24, 96, 90, 24, '#8a2a2a'); for (let i = 0; i < 90; i += 8) G.vl(x, 24 + i, 96, 24, '#6a1a1a'); G.hl(x, 24, 100, 90, '#e8d8a8'); G.hl(x, 24, 110, 90, '#e8d8a8');
      G.rect(x, 20, 72, 6, 48, '#3a2214'); G.rect(x, 26, 88, 22, 8, '#f4f4f8');
      // desk + timer box
      R.desk(x, 132, 128, 60, '#3a2214'); G.rect(x, 140, 100, 22, 6, '#2a6a3a'); for (let i = 0; i < 3; i++) G.circle(x, 144 + i * 6, 102, 2, '#f4f4f8'); G.frame(x, 161, 100, 5, 5, '#5a5a62');
      // trophy shelf + poster + window
      G.rect(x, 130, 46, 70, 3, '#3a2214'); for (let i = 0; i < 5; i++) { G.rect(x, 134 + i * 13, 36, 6, 8, '#fec83a'); G.rect(x, 136 + i * 13, 44, 2, 2, '#c89a2a'); }
      R.poster(x, 214, 30, 30, 22, 'surf', 'yacht');
      G.rect(x, 252, 24, 36, 56, '#141a34');
      R.door(x, 296, 64, 18, 56, '#2a1a10');
    },
    props: [{ y: 128, draw: (x, cam) => { const X = 214 - cam; G.rect(x, X, 98, 14, 30, '#2a5a3a'); G.frame(x, X, 98, 14, 30, '#14301e'); G.rect(x, X + 2, 112, 10, 8, '#1a3a2a'); for (let i = 0; i < 3; i++) { G.line(x, X + 3 + i * 4, 98, X + 1 + i * 5, 82, '#c0cbdc'); G.rect(x, X + i * 5, 80, 4, 3, '#2a2a30'); } } }],
    anim(x, t, o) { stormWindow(x, 254, 26, 32, 52, o.scene, t); },
    overlay(x, t, o) { stormFlash(x, o.scene); },
    update(sc, dt) { storm(sc, dt); },
    hotspots: [
      { id: 'down', name: 'Back Downstairs', x: 292, y: 60, w: 26, h: 62, walk: [296, 152], verb: 'Head',
        use: async (g) => {
          if (g.flag('lassiter_away')) { g.unset('lassiter_away'); }
          await g.goto('foyer', { from: 'preston' });
          if (!g.flag('hired') && g.once('lassiter_back')) { await g.say('lassiter:stern', 'There was no ghost in the conservatory, Guster.'); await g.say('gus', 'It was a very convincing ficus.'); }
        } },
      { id: 'golfbag', name: 'Golf Bag', x: 210, y: 78, w: 22, h: 52, walk: [222, 140], clue: (g) => !g.hasClue('fog_test'),
        look: async (g) => {
          if (await g.clue('necklace_found')) {
            await g.say('shawn:surprised', 'Gus. GUS. The Vanderkamp Sapphire. In the ball pocket of Preston\'s golf bag.');
            await g.say('gus', 'Case closed! Preston did it! Let\'s go home, Shawn. I want to go home.');
            await g.think("Preston did grab it. But this was... easy. Too easy. Something's bugging me.");
            g.objective('Something feels off about the sapphire. What would Dad do? (Try using the golf bag again.)');
          } else if (!g.hasClue('fog_test')) await g.say('shawn', "It's sitting right there. Shiny. Perfect. Maybe TOO perfect.");
          else await g.say('shawn', 'A beautiful fake in a very expensive bag. Like Preston.');
        },
        use: async (g) => {
          if (!g.hasClue('necklace_found')) { await g.say('shawn', 'Golf clubs, tees, a flask, and... hold on. Something is in the ball pocket.'); await g.clue('necklace_found'); g.objective('Something feels off about the sapphire. What would Dad do?'); return; }
          if (g.hasClue('fog_test')) { await g.say('shawn', "I'm leaving it for Jules to bag. Chain of custody, Gus. I'm very professional."); return; }
          const c = await g.choose([{ text: "Do Dad's fog test (breathe on it)", value: 'fog' }, { text: 'Hold it up to the light', value: 'light' }, { text: 'Leave it for the police', value: 'leave' }], { title: 'The sapphire...', cancel: 'leave' });
          if (c === 'light') { await g.say('shawn', 'Ooh. Sparkly. Very sparkly. That told me nothing.'); return; }
          if (c !== 'fog') return;
          await g.say('shawn', 'Hhhhhhh...');
          await g.clue('fog_test');
          await g.say('shawn:surprised', "It's still foggy. Gus. A real stone clears instantly. This is GLASS.");
          await g.say('gus:surprised', 'Preston stole a fake?');
          await g.say('shawn', 'Preston stole a fake. Which means somebody stole the real one first.');
          g.objective('The stolen sapphire is fake. Who was alone with the real one earlier today?');
        } },
      { id: 'timerbox', name: 'Desk', x: 132, y: 96, w: 60, h: 32, walk: [162, 140], clue: (g) => !g.hasClue('timer_set'),
        look: async (g) => {
          if (await g.clue('timer_set')) { await g.say('shawn', "Montecito Country Club golf-ball timers. Four slots. Three timers."); await g.say('gus', 'The fourth one is taped to a fuse box in the basement.'); await g.say('shawn', 'Fore!'); }
          else await g.say('shawn', 'Three golf-ball timers and an empty slot shaped like guilt.');
        } },
      { id: 'trophies', name: 'Golf Trophies', x: 130, y: 32, w: 70, h: 16, walk: [166, 140],
        look: async (g) => { await g.say('shawn', '"Club Champion, 2019." "Club Champion, 2020." "Most Improved Putter, 2015." Preston peaked at putting.'); } },
      { id: 'bed', name: 'Bed', x: 20, y: 70, w: 96, h: 50, walk: [70, 140],
        look: async (g) => { await g.say('shawn', 'Under the pillow: a stack of IOUs to people named "Big Mike", "Bigger Mike" and "Mike." Preston owes a lot of Mikes.'); } },
    ],
    onEnter: async (g, o) => {
      if (o.first) {
        await g.say('shawn', "Preston's room. Golf trophies, a yacht poster, and the distinct aroma of a trust fund running out.");
        if (!g.flag('hired')) await g.say('gus:worried', 'Shawn, Lassiter is going to be back any second.');
        g.objective("Search Preston's room.");
      }
    },
  };

  /* --------------------------------------------------------- conversations */
  async function talkHargrovePre(g) {
    await g.topics('hargrove', [
      { id: 'who', label: "Who's here tonight?", run: async (gg) => {
        await gg.say('hargrove', "Mrs. Vanderkamp. Her nephew, Mr. Preston. Mr. Pemberton, the family jeweler, who came to polish the sapphire and stayed for dinner. And Madame Ozera.");
        await gg.say('hargrove:stern', 'And now, regrettably, you.');
      } },
      { id: 'sapphire', label: 'About the sapphire...', run: async (gg) => { await gg.say('hargrove', 'The Vanderkamp Sapphire. Forty carats. Mr. Archibald gave it to Madame in 1962. She has not taken it off since. Not even to swim.'); } },
    ], { title: 'Hargrove' });
  }
  async function talkHargrove(g) {
    if (!g.flag('hargrove_awake')) {
      await g.say('hargrove', 'The fog... the fog... Madam, your tea is... a pelican...');
      await g.say('gus', 'He is concussed, Shawn. Badly.');
      g.set('hargrove_dazed');
      await g.think('We need to bring him around. Gus carries everything in that sample case.');
      await g.topics('hargrove', [], { title: 'Hargrove (dazed)', onPresent: async (gg, id) => { if (id === 'salts') { await wakeHargrove(gg); return true; } return false; } });
      return;
    }
    await g.topics('hargrove', [
      { id: 'what', label: 'What happened in the dark?', run: async (gg) => {
        await gg.say('hargrove', 'When the lights failed I went for the candles. Someone came rushing up the stairs. Tall. Breathing hard. I stepped into his path...');
        await gg.say('hargrove:sad', 'And he struck me with something round and heavy. I remember the smell. Limes. And gin.');
        await gg.clue('hargrove_saw');
        await gg.say('gus', 'Shawn, Preston has been drinking gin and tonics all night.');
      } },
      { id: 'keys', label: 'Can we have the cellar keys?', run: async (gg) => { await gg.say('hargrove:stern', 'Certainly not. Also I appear to have lost them. Also my left shoe.'); } },
    ], { title: 'Hargrove' });
  }
  async function wakeHargrove(g) {
    g.take('salts');
    await g.say('gus', 'Ammonia inhalant. Just a little sniff, Mr. Hargrove.');
    g.sfx('gasp');
    await g.say('hargrove:surprised', 'GOOD HEAVENS. I am awake. I am exceedingly awake.');
    g.set('hargrove_awake');
    await g.say('hargrove', 'Thank you, Mr. Guster. May I offer you both some cocoa? Butlers do not stop buttling merely because they have been concussed.');
    await g.snack('cocoa');
    await g.say('gus:happy', 'Shawn. This is the best cocoa I have ever had in my life. And I have had a LOT of cocoa.');
  }
  async function talkDolores(g) {
    if (g.once('met_dolores')) {
      await g.say('dolores:happy', "Ah, the psychic detective! Madame Ozera says you're a charlatan. I adore a charlatan.");
      await g.introGus('dolores');
      await g.say('dolores:happy', 'Delightful.');
    }
    if (!g.flag('seance_done')) {
      const go = await g.topics('dolores', [
        { id: 'sapphire', label: 'Tell me about the sapphire.', run: async (gg) => { await gg.say('dolores', "Archie gave it to me in 1962. Forty carats. Reginald, my jeweler, polished it just this afternoon for the seance. Archie liked it sparkly."); } },
        { id: 'archie', label: 'Why a seance?', run: async (gg) => { await gg.say('dolores:sad', "I want to know if my Archie is at peace. And Preston keeps saying I should sell the house. I want to know what Archie thinks."); } },
        { id: 'start', label: "Let's start the seance.", run: async () => 'exit' },
      ], { title: 'Dolores', single: false });
      if (g.s.talked['dolores:start']) { delete g.s.talked['dolores:start']; await seance(g); }
      return;
    }
    if (g.flag('necklace_returned')) { await g.say('dolores:happy', 'My Archie would have adored you, Mr. Spencer.'); return; }
    await g.topics('dolores', [
      { id: 'hand', label: 'Who was holding your hand in the dark?', run: async (gg) => {
        await gg.say('dolores', 'Preston, on my left. And then he let go. I remember, because his hand was clammy, and then it simply wasn\'t.');
        await gg.clue('preston_letgo');
      } },
      { id: 'pem', label: 'Tell me about Mr. Pemberton.', run: async (gg) => {
        await gg.say('dolores', "Reginald? His family has cared for the sapphire since 1924. His grandfather set the stone. Such a sweet, nervous little man.");
      } },
    ], { title: 'Dolores' });
  }
  async function observeDolores(g) {
    if (!g.flag('seance_done')) { await g.say('shawn', "The sapphire. Forty carats of blue. It's gorgeous. It's... almost too perfect. Huh."); await g.say('gus', "Shawn, don't stare at a rich lady's neck."); }
    else await g.say('shawn', "No sapphire. A pale line on her neck where it's been for sixty years. She keeps touching the spot.");
  }
  async function talkPreston(g) {
    if (g.once('met_preston')) {
      await g.say('preston', "Preston Vanderkamp. The Third. Auntie's favorite. Only. Nephew.");
      await g.introGus('preston');
      await g.say('preston:smug', 'Ha. Sure.');
    }
    await g.topics('preston', [
      { id: 'golf', label: 'Do you golf?', run: async (gg) => { await gg.say('preston:smug', "Scratch golfer. Club champion two years running. I have a putter older than you, Mr. Spencer."); } },
      { id: 'where', label: 'Where were you during the blackout?', when: (gg) => gg.flag('seance_done'), run: async (gg) => {
        await gg.say('preston', 'At the table. Holding Auntie\'s hand. The whole time. Obviously.');
        if (gg.hasClue('preston_letgo')) { await gg.say('shawn', 'Your aunt says you let go.'); await gg.say('preston:worried', 'She\'s... she\'s eighty-four! She\'s confused!'); await gg.say('dolores:angry', 'I am NOT confused, Preston!'); }
      } },
      { id: 'house', label: 'You want her to sell the house?', run: async (gg) => { await gg.say('preston', "It's a forty-room house for one woman and a butler. It's practical. I'm a practical man."); await gg.say('gus', 'He has a yacht poster.'); } },
    ], { title: 'Preston' });
  }
  async function talkPemberton(g) {
    if (g.once('met_pem')) {
      await g.say('pemberton', 'Reginald Pemberton. Pemberton & Sons, Fine Jewelry. Since 1924.');
      await g.introGus('pemberton');
      await g.say('pemberton', 'Hm. A pleasure. I suppose.');
    }
    await g.topics('pemberton', [
      { id: 'clean', label: 'You polished the sapphire today?', run: async (gg) => { await gg.say('pemberton', 'At three o\'clock. A routine polish. She wanted it to sparkle for Archibald. Spirits like sparkle, you know.'); } },
      { id: 'alone', label: 'Were you alone with it?', when: (gg) => gg.flag('seance_done'), run: async (gg) => { await gg.say('pemberton:worried', 'Polishing requires... concentration, young man. Is that a crime now?'); await g_think(gg); } },
      { id: 'biz', label: "How's business?", run: async (gg) => {
        if (gg.hasClue('pemberton_broke')) { await gg.say('shawn', 'We saw the eviction notice, Mr. Pemberton.'); await gg.say('pemberton:angry', 'You went through my COAT?'); await gg.say('shawn', 'The coat spoke to me. Spiritually. And also it was open.'); }
        else await gg.say('pemberton:smug', 'Thriving! Booming! Never better!');
      } },
    ], { title: 'Pemberton' });
  }
  async function g_think(g) { await g.think("Twenty minutes alone with the real thing. And now he can't stop touching that watch."); }
  async function observePemberton(g) {
    if (!g.flag('seance_done')) { await g.say('shawn', "He checks his pocket watch every thirty seconds. Must be a very busy jeweler."); return; }
    if (await g.clue('thick_watch')) await g.think("He touches that watch constantly. But he never once looks at the time. A watch you don't read is a box you're guarding.");
    else await g.say('shawn', 'Still petting that watch like a nervous hamster.');
  }
  async function talkOzera(g) {
    if (g.once('met_ozera')) {
      await g.say('ozera:smug', 'Ah. The "psychic detective." I sensed your arrival. And your cologne. Mostly your cologne.');
      await g.say('shawn:smug', "Madame Ozera. I sensed your arrival too. From the TV. Where you called me a fraud.");
      await g.introGus('ozera');
      await g.say('ozera', 'I know. The spirits told me his real name. It is Burton.');
      await g.say('gus:surprised', '...How?');
      await g.say('shawn', 'Business card in your shirt pocket, Gus.');
    }
    if (g.flag('hired') && g.flag('ozera_free') && g.once('ozera_thanks')) {
      await g.say('ozera', "You proved I couldn't have set that timer. I suppose I owe you, Mr. Spencer. As one fraud to another.");
      await g.say('shawn', "I'm not a fraud. I'm gifted.");
      await g.say('ozera:smug', 'Of course you are. Here. The Lovers. Give it to the one you see when you close your eyes.');
      await g.gift('tarot');
      return;
    }
    await g.topics('ozera', [
      { id: 'real', label: 'So are you a real psychic?', run: async (gg) => { await gg.say('ozera:smug', 'Are YOU, Mr. Spencer?'); await gg.say('shawn', "...Touche."); await gg.say('gus', "Neither of you are real psychics."); await gg.say('ozera', 'And neither of us will ever admit it.'); } },
      { id: 'spirits', label: 'What did Archibald say?', when: (gg) => gg.flag('seance_done'), run: async (gg) => { await gg.say('ozera', '"Protect the sapphire." Which, in hindsight, was very good advice.'); await gg.say('shawn', "Too bad nobody listened. Not even the speaker behind the curtain."); } },
    ], { title: 'Madame Ozera' });
  }
  async function talkRosa(g) {
    if (!g.flag('rosa_calm')) {
      if (g.once('met_rosa')) {
        await g.say('rosa:worried', "¡Ay, Dios mío! The ghost of Señor Archibald! The lights, the scream! I am NOT leaving this kitchen!");
        await g.introGus('rosa');
        await g.say('rosa:worried', 'Mucho gusto. I am still not leaving the kitchen.');
      }
      await g.topics('rosa', [
        { id: 'cleanse', label: 'Let me cleanse this house of spirits.', run: async (gg) => { await cleansing(gg); return 'exit'; } },
        { id: 'ghost', label: "There's no such thing as ghosts.", run: async (gg) => { await gg.say('rosa:angry', "Tell that to the clock! It stopped! At the EXACT moment!"); await gg.say('gus', 'It is electric, Rosa.'); await gg.say('rosa:angry', 'GHOSTS ARE ELECTRIC.'); } },
      ], { title: 'Rosa' });
      return;
    }
    await g.topics('rosa', [
      { id: 'preston', label: 'Tell me about Preston.', run: async (gg) => {
        await gg.say('rosa', "Men call the house for Mister Preston. Bad men. Men who say 'or else' and do not say goodbye. He sold two sets of golf clubs last month. He LOVES those clubs.");
        await gg.clue('preston_debts');
      } },
      { id: 'pem', label: 'Did anyone handle the sapphire today?', run: async (gg) => {
        await gg.say('rosa', "Mr. Pemberton, at three o'clock. He took it into the study to polish. Door closed. Twenty minutes. He said polishing needs 'quiet'.");
        await gg.say('rosa', "I brought him tea. He jumped like a cat. Polishing should not make a man jump.");
        await gg.clue('pemberton_alone');
      } },
    ], { title: 'Rosa' });
  }
  async function cleansing(g) {
    await g.say('shawn:psychic', 'Rosa. Stand back. I am going to perform an ancient spirit cleansing. It has been in my family for... a while.');
    const a = await g.choose([{ text: 'Wave a dish towel like sage', value: 0 }, { text: 'Interpretive dance', value: 1 }, { text: 'Yell "BE GONE" at the ceiling', value: 2 }], { title: 'Step one:' });
    if (a === 1) { g.anim('shawn', 'jazz', 1600); await g.say('gus', "That is just the Running Man, Shawn."); }
    else if (a === 2) { g.shake(200, 2); await g.say('shawn:angry', 'BE GONE, ARCHIBALD! YOU HAD A GOOD RUN!'); }
    else { g.anim('shawn', 'wave', 1400); await g.say('shawn', 'Cleansing... cleansing... towel-ing...'); }
    const b = await g.choose([{ text: 'Sprinkle salt', value: 0 }, { text: 'Sprinkle pepper', value: 1 }, { text: 'Sprinkle Gus', value: 2 }], { title: 'Step two:' });
    if (b === 2) await g.say('gus:angry', 'Do NOT sprinkle me.');
    else if (b === 1) { g.sfx('gasp'); await g.say('rosa', '*achoo!*'); }
    else await g.say('shawn', 'Salt. The ghost repellent of champions.');
    g.anim('shawn', 'armsUp', 1200);
    await g.say('shawn:psychic', '...And it is DONE. The spirit has moved on. To a nice condo. In Boca.');
    await g.say('rosa:happy', '¡Gracias! I feel... lighter! Señor, you are a real psychic!');
    await g.say('gus', 'He is really not.');
    g.set('rosa_calm');
    await g.say('rosa', "And Señora Dolores said to give this to a nice girl if I met a nice young man. She has a hundred. You are... medium nice.");
    await g.gift('cameo');
  }
  function talkVickTopics() { return []; }

  /* ---------------------------------------------------------- the seance */
  async function seance(g) {
    g.set('seance_started');
    await g.goto('parlor', { x: 226, y: 154 });
    const sc = g.scene;
    sc.seated = [[124, 130, 1], [196, 130, -1], [96, 150, 1], [228, 152, -1], [252, 156, -1]];
    g.spawn('dolores', { x: 124, y: 130, face: 'right', idle: 'sit' });
    g.spawn('preston', { x: 196, y: 130, face: 'left', idle: 'sit' });
    g.spawn('pemberton', { x: 96, y: 150, face: 'right', idle: 'sit' });
    g.spawn('ozera', { x: 160, y: 128, face: 'right' });
    g.spawn('hargrove', { x: 290, y: 148, face: 'left' });
    g.place('shawn', 228, 152, 'left'); g.anim('shawn', 'sit');
    g.place('gus', 252, 156, 'left'); g.anim('gus', 'sit'); g.actor('gus').follow = null;
    g.anim('ozera', 'frontIdle');
    sc.dim = 0.75;
    g.music('vision');
    await g.say('ozera', 'Join hands. Do not break the circle. Whatever you hear... whatever you FEEL.');
    await g.say('gus:worried', 'Shawn, why is your hand so warm?');
    await g.say('shawn', "Because I'm a giver, Gus.");
    g.anim('ozera', 'frontArmsUp');
    await g.say('ozera:psychic', 'Archibald... Archibald Vanderkamp... Your Dolly calls to you... cross the veil...');
    g.sfx('thunder'); sc.lightning = 1; g.shake(500, 2);
    await g.wait(500);
    await g.say('gus:surprised', 'The table moved. Shawn, the table MOVED.');
    await g.say('shawn', 'Fishing line, Gus. Enjoy the show.');
    await g.say('ARCHIBALD?', '"Dolly... Dolly... protect... the sapphire..."');
    await g.say('dolores:surprised', 'Archie! Archie, is that you?');
    await g.say('shawn', "(She's good, Gus. She's really good.)");
    // blackout
    g.sfx('thunder'); sc.lightning = 1;
    await g.wait(200);
    sc.blackout = true;
    g.music(null);
    g.sfx('hit');
    await g.wait(700);
    g.show('preston', false);
    sc.lightning = 1; g.sfx('thunder');
    await g.wait(450);
    await g.say('gus:surprised', 'Somebody is holding my hand!');
    await g.say('shawn', "That's me, Gus.");
    await g.say('gus', '...Okay. Keep holding it.');
    g.sfx('gasp');
    await g.say('dolores:surprised', 'Someone touched my neck! AAAH!');
    g.sfx('hit'); g.shake(300, 3);
    await g.wait(800);
    sc.lightning = 1; g.sfx('thunder');
    await g.wait(900);
    g.show('preston', true);
    cast.dolores.acc = ['earrings'];
    P.defineCast('dolores', cast.dolores); P.Sprite.clear(); P.Portrait.clear();
    sc.blackout = false; sc.dim = 0;
    g.flash('#ffffff', 200);
    g.music('tension');
    await g.say('dolores:surprised', 'My SAPPHIRE! My sapphire is GONE!');
    g.anim('preston', 'stand');
    await g.say('preston:worried', 'Auntie! Are you all right?! What happened?');
    g.walkNoWait('hargrove', 340, 148);
    await g.say('ozera:surprised', "...The spirits... have taken it.");
    await g.say('shawn', 'The spirits have very sticky fingers.');
    await g.say('ROSA (offscreen)', '¡SEÑORA! Mr. Hargrove is on the floor at the top of the stairs!');
    await g.fade(true, 700);
    g.set('seance_done');
    g.stopAnim('shawn'); g.stopAnim('gus');
    await g.card({ kicker: 'FORTY MINUTES LATER', title: 'THE POLICE', sub: 'Nobody leaves the house.', dur: 2.8 });
    await g.goto('foyer', { x: 200, y: 156, instant: true });
    g.music('mansion');
    await g.say('vick', "Mrs. Vanderkamp is one of this department's biggest supporters. I came straight from the charity gala. Detective?");
    await g.say('lassiter:smug', "Madame Ozera, real name Doris Ozeranski. Three arrests in Reno for fortune-telling fraud. Her 'spirits' turn out the lights, the rock vanishes. I've had cases with fewer bows on them.");
    await g.clue('ozera_record');
    await g.say('lassiter', "Nobody leaves this house. Nobody goes upstairs. Madame Ozera is waiting in the parlor with an officer.");
    await g.say('juliet', "Hargrove was hit on the head at the top of the stairs. He's resting in the library. Pretty dazed.");
    await g.say('gus:worried', 'Shawn, it is a haunted mansion, in a thunderstorm, with a jewel thief. This is my nightmare. Specifically. I have had this exact nightmare.');
    g.objective('The lights went out at exactly 9:15. Find out how. (The fuse box is in the locked basement...)');
  }

  /* ---------------------------------------------------------- the finale */
  async function finale(g) {
    g.set('finale_started');
    const sc = g.scene;
    sc.seated = null;
    await g.stage({
      shawn: [160, 156, 'right'], gus: [132, 160, 'right'], vick: [214, 150, 'left'], lassiter: [92, 148, 'right'], juliet: [240, 158, 'left'],
      dolores: [120, 136, 'right'], preston: [200, 136, 'left'], pemberton: [268, 146, 'left'], ozera: [64, 152, 'right'], hargrove: [290, 156, 'left'], rosa: [40, 146, 'right'],
    });
    sc.dim = 0.3;
    await g.say('shawn:psychic', 'Everyone, please. Join hands. Tonight, I will be your medium. Medium-rare. Medium-well. Medium.');
    await g.say('ozera:smug', "Oh, this I have to see.");
    await g.say('lassiter:stern', "Spencer, if you so much as hum spooky music—");
    g.music('vision');
    await g.say('shawn', '(hums spooky music)');
    const ok = await g.revelation('finale');
    if (!ok) { sc.dim = 0; g.objective('Talk to Chief Vick when the spirits are ready to try again.'); return; }
    sc.dim = 0;
    await g.say('pemberton:angry', 'This is preposterous! I will not stand here and be—');
    g.walkNoWait('pemberton', 10, 156, { run: true });
    await g.wait(300);
    g.sfx('thunder'); g.scene.lightning = 1;
    g.anim('gus', 'kneel', 4000);
    await g.say('gus:surprised', 'THUNDER! I am fainting! I am fainting in a SPECIFIC direction!');
    g.sfx('hit'); g.shake(400, 4);
    const pm = g.actor('pemberton'); if (pm) pm.stop();
    g.anim('pemberton', 'kneel', 5000);
    await g.say('juliet:smug', 'Nice block, Gus.');
    await g.say('gus', 'I meant to do that. Mostly.');
    await g.walk('lassiter', 40, 156, { run: true });
    await g.say('lassiter:smug', 'Reginald Pemberton, you are under arrest for grand theft. Preston Vanderkamp, you too. Theft, assault, and being extremely annoying.');
    g.sfx('pickup');
    await g.say('lassiter', "One pocket watch. Hunter case. Very... heavy.");
    g.sfx('reveal'); g.flash('#9ac8ff', 300);
    await g.say('dolores:happy', "Archie's sapphire! Oh, Reginald. Your grandfather would be ashamed.");
    cast.dolores.acc = ['sapphire', 'earrings'];
    P.defineCast('dolores', cast.dolores); P.Sprite.clear(); P.Portrait.clear();
    g.set('necklace_returned');
    await g.say('ozera', 'Mr. Spencer. Perhaps... you DO have the gift.');
    await g.say('shawn', "Perhaps YOU do, Madame.");
    await g.say('ozera:smug', '...No. You are a fraud.');
    await g.say('shawn:smug', 'So are you.');
    await g.say('ozera', 'Good night, Mr. Spencer.');
    // Juliet, the door, the rain
    await g.fade(true, 500);
    await g.goto('foyer', { x: 60, y: 156, instant: true });
    if (!g.actor('juliet')) g.spawn('juliet', { x: 84, y: 154, face: 'left' }); g.place('juliet', 84, 154, 'left'); g.place('gus', 150, 150, 'left');
    const r = g.global.romance || 0;
    if (r >= 6) {
      await g.say('juliet:happy', "It's still pouring. I have one umbrella.");
      await g.say('shawn', 'Jules, are you suggesting we share an umbrella? Like in a movie?');
      await g.say('juliet:flirty', "I'm suggesting I don't want you to get wet, Spencer. You'd be insufferable about it.");
      await g.say('shawn', '...Jules.');
      await g.say('juliet:flirty', '...Shawn.');
      g.emote('juliet', 'heart', 2400); g.emote('shawn', 'heart', 2400); g.sfx('heart');
      await g.wait(1200);
      await g.say('lassiter:angry', "O'HARA! We have TWO perps in the car and one of them is crying!");
      await g.say('juliet:sad', '...Rain check?');
      await g.say('shawn', "Jules. It's literally raining.");
      await g.say('juliet:happy', 'Then it counts.');
      g.set('jules_umbrella');
    } else if (r >= 3) {
      await g.say('juliet:smile', 'Good work tonight, Shawn. The seance thing was... a lot. But it worked.');
      await g.say('shawn', 'Jules, would you like to share an umbrella?');
      await g.say('juliet:happy', "I have my own umbrella, Shawn. But... ask me again sometime.");
    } else {
      await g.say('juliet', 'Night, Shawn. Night, Gus. Try not to hold any more seances.');
      await g.say('gus', 'She said "any more". That means she liked the first one.');
    }
    g.set('finale_done');
    await g.fade(true, 600);
    await g.card({ kicker: 'THE NEXT MORNING', title: "DAD'S PORCH", sub: 'The storm has passed.', dur: 2.6 });
    await g.goto('henry', { x: 160, y: 154 });
    g.place('henry', 200, 150, 'left');
    await g.say('henry', 'So. A fake sapphire.');
    await g.say('shawn', 'Fakes look perfect until you put a little heat on them.');
    await g.say('henry:surprised', '...You were nine.');
    await g.say('shawn:smug', 'I was nine and A HALF.');
    await g.say('henry', 'And what does that make you, Shawn? Real or fake?');
    await g.say('shawn', "I'd like to think I'm the real thing, Dad.");
    await g.say('henry:smug', "You're the real thing, all right. A real pain in my neck.");
    await g.say('shawn', 'Aww. Dad.');
    await g.say('gus', 'Mr. Spencer, are those fish tacos?');
    await g.say('henry', '...Sit down. Both of you.');
    await g.complete({ finale: true });
  }

  /* ---------------------------------------------------------- revelations */
  const revelations = {
    hired: {
      requires: ['blackout_timer', 'guest_log'],
      audience: ['vick', 'lassiter', 'juliet', 'gus', 'ozera'],
      intro: async (g) => {
        g.set('ozera_free_temp');
        await g.stage({ shawn: [230, 158, 'right'], gus: [204, 152, 'right'], vick: [280, 148, 'left'], lassiter: [176, 150, 'right'], juliet: [262, 162, 'left'], ozera: [150, 156, 'right'] });
        await g.say('lassiter:smug', 'Chief, Ozera rigs seances for a living. She rigged this one too. Lights out, rock gone.');
        await g.say('shawn:psychic', 'Wait. Wait! Archibald is... he is coming through... he is very upset about his electric bill...');
        await g.say('ozera:smug', 'Oh, this should be good.');
      },
      steps: [
        {
          prompt: 'Lassiter says Ozera\'s "spirits" killed the lights. Prove it wasn\'t supernatural.',
          answer: 'blackout_timer',
          guesses: ['A GHOST! A GHOST... WRITER!', 'A GOLF... A GOLF CART! A GOLF CLAP!', 'TICK... TOCK... TICK-TOCK!'],
          final: 'SOMEBODY SET A TIMER!', pointAt: 'lassiter',
          after: async (g) => { await g.say('juliet', "A golf-ball timer on the main breaker. Gus found it. ...How did Gus find it?"); await g.say('gus', 'I would rather not talk about the dumbwaiter.'); },
          wrong: { ozera_record: async (g) => { await g.say('shawn:worried', "The spirits say... she has a record. Which is Lassie's point, not mine. Spirits, please stay on MY side."); } },
          hint: 'Shawn, what did I find in the basement? The THING. On the breaker.',
        },
        {
          prompt: 'The timer was set an hour before the blackout, at 8:15. Why couldn\'t Ozera have set it?',
          answer: 'guest_log',
          guesses: ['SHE WAS... IN RENO! NO! IN A RENO-VATION!', 'EIGHT... EIGHT-FORTY... EIGHT... TRACK?'],
          final: "SHE WASN'T HERE YET!", pointAt: 'ozera',
          after: async (g) => { await g.say('vick', "Hargrove's guest book. Madame Ozera arrived at 8:45. Thirty minutes after that timer was set."); await g.say('ozera:surprised', '...He is defending me?'); await g.say('shawn', "Don't get used to it."); },
        },
      ],
      outro: async (g) => {
        await g.say('vick', "Then whoever set that timer was already in this house at 8:15. Mr. Spencer, Mr. Guster, you're hired. Again.");
        await g.say('lassiter:angry', 'Chief!');
        await g.say('vick:stern', "Carlton, release Madame Ozera. And let Mr. Spencer upstairs. Within reason.");
        await g.say('shawn:happy', 'Chief, I am ALWAYS within reason.');
        await g.say('vick:stern', 'You are almost never within reason.');
        g.set('hired'); g.set('ozera_free');
        g.respawn('ozera');
        g.objective("You're hired. Who was in the house at 8:15? Search upstairs, talk to the staff, wake up the butler.");
      },
    },
    finale: {
      requires: ['timer_set', 'fog_test', 'pemberton_alone', 'pemberton_broke', 'thick_watch'],
      audience: ['vick', 'lassiter', 'juliet', 'gus', 'dolores', 'preston', 'pemberton', 'ozera'],
      intro: async (g) => { await g.say('shawn:psychic', 'The veil is thin tonight... I hear... Archibald... he says... "Dolly... you look... marvelous..."'); await g.say('dolores:happy', 'Oh, Archie!'); },
      steps: [
        {
          prompt: 'The blackout was a golf-ball timer. Whose timer was it?',
          answer: 'timer_set',
          guesses: ['A PRESTO! PRESTO CHANGE-O!', 'PRESS... PRESSED... PANINI PRESS!'],
          final: 'PRESTON!', pointAt: 'preston', gusJoins: true,
          after: async (g) => {
            await g.say('preston:sad', "OKAY! Okay! I took it! I owe money to some very serious golfers! I grabbed it in the dark and hid it in my bag, and Hargrove got in the way, and I'm SORRY!");
            await g.say('dolores:angry', 'PRESTON!');
            await g.say('lassiter:smug', 'There it is. The nephew. Case closed.');
            await g.say('shawn', 'Not so fast, Lassie. The spirits are not done. They have a two-drink minimum.');
          },
          wrong: { hargrove_saw: async (g) => { await g.say('shawn:worried', 'Limes and gin. Very suggestive. But the spirits want the hardware, not the bar tab.'); } },
        },
        {
          prompt: 'Preston stole the necklace. But what did he really steal?',
          answer: 'fog_test',
          guesses: ['A FROG! A FOG! A FOGHORN LEGHORN!', 'GLASS... GLASS HALF FULL! GLASS SLIPPER!'],
          final: "A FAKE! IT'S GLASS!", pointAt: 'dolores',
          after: async (g) => { await g.say('dolores:surprised', 'A FAKE? My sapphire?'); await g.say('preston:surprised', "I stole a FAKE?! Do you know what those golfers are going to do to me?"); },
        },
        {
          prompt: 'So the real sapphire was swapped earlier today. Who was alone with it?',
          answer: 'pemberton_alone',
          guesses: ['A PEMBROKE! A WELSH CORGI!', 'PEM... PEMMICAN! A PELICAN!'],
          final: 'REGINALD PEMBERTON!', pointAt: 'pemberton',
          after: async (g) => { await g.say('pemberton:angry', 'I am a JEWELER! Polishing is my JOB!'); await g.say('rosa', 'You jumped like a cat!'); },
        },
        {
          prompt: 'Why would the family jeweler rob his best client?',
          answer: 'pemberton_broke',
          guesses: ['A NOTICE! A NOVICE! A NOVELLA!', 'BROKE... BROKEBACK... BROCCOLI!'],
          final: "HE'S ABOUT TO LOSE HIS STORE!", pointAt: 'pemberton',
          after: async (g) => { await g.say('vick', 'An eviction notice. Thirty days. And a forty-carat sapphire could keep the lights on for a long time.'); },
        },
        {
          prompt: 'Then where is the real sapphire right now?',
          answer: 'thick_watch',
          guesses: ['TICK TOCK! A CROCODILE! CAPTAIN HOOK!', 'HE\'S... WATCHING! A WATCH... WATCHAMACALLIT!'],
          final: 'IN HIS POCKET WATCH!', pointAt: 'pemberton',
          after: async (g) => { await g.say('lassiter:surprised', '...Huh.'); },
        },
      ],
      fail: async (g) => { await g.say('vick:stern', 'Mr. Spencer. The spirits seem confused. Regroup, and find me when they are not.'); },
    },
  };

  /* ----------------------------------------------------------------- hints */
  const hints = [
    { id: 'h_go', when: (g) => !g.s.visited.foyer, vague: 'A woman called you a fraud on TV. Are you going to sit there and take it?', specific: "Leave the office. Montecito. Vanderkamp Manor. It's on the map." },
    { id: 'h_seance', when: (g) => !g.flag('seance_done'), vague: "You went to a seance. Go have the seance.", specific: 'Talk to the lady of the house. Tell her to start.' },
    { id: 'h_timer', when: (g) => !g.hasClue('blackout_timer'), vague: "Lights don't go out on their own. They get help. Find the fuse box.", specific: ["The basement's locked, but old houses have dumbwaiters. In the kitchen.", "Gus fits. Bribe him. Rosa's cookie jar."] },
    { id: 'h_log', when: (g) => !g.hasClue('guest_log'), vague: 'You need to know who was in that house, and when.', specific: 'Butlers write everything down. The guest book is on the table in the foyer.' },
    { id: 'h_vick', when: (g) => !g.flag('hired'), vague: "You can clear the TV lady. Go do it.", specific: "Tell Karen you're having a vision. Timer, and the guest book." },
    { id: 'h_upstairs', when: (g) => !g.hasClue('necklace_found'), vague: 'Somebody in that house was a golfer with a grudge. Check his room.', specific: ["Upstairs. If Carlton's blocking the stairs, he's easy to distract. Ask Gus.", 'Or, if you got yourselves hired, just walk up.'] },
    { id: 'h_fog', when: (g) => !g.hasClue('fog_test'), vague: "You found it. Too easy. What did I teach you about fakes in that pawn shop?", specific: 'Heat, Shawn. Breathe on it. Use the golf bag again.' },
    { id: 'h_rosa', when: (g) => !g.hasClue('pemberton_alone'), vague: "If it's a fake, the real one was swapped. Who handled it today? The help always knows.", specific: "The maid's too scared to talk. So do one of your ridiculous rituals. Then ask her." },
    { id: 'h_coat', when: (g) => !g.hasClue('pemberton_broke'), vague: "Why would a man steal from his best customer? Money trouble.", specific: 'Men keep bad news in their coat pockets. Check the coat closet in the foyer.' },
    { id: 'h_watch', when: (g) => !g.hasClue('thick_watch'), vague: "Where's he keeping it? Watch what he keeps touching.", specific: 'Look at the jeweler. Closely. Shawn-Vision, or whatever you call it.' },
    { id: 'h_final', when: (g) => !g.flag('finale_done'), vague: "Go finish it.", specific: 'Tell Karen you want to hold a seance of your own. In the parlor.' },
  ];

  /* ---------------------------------------------- recurring cast, this case */
  const finaleReady = (g) => g.hasAll(['timer_set', 'fog_test', 'pemberton_alone', 'pemberton_broke', 'thick_watch']);
  const topics = {
    vick: [
      { id: 'c3_vision1', label: "Chief, I'm having a vision!", keep: true, when: (g) => !g.flag('hired') && g.hasAll(['blackout_timer', 'guest_log']), run: async (g) => { await g.revelation('hired'); return 'exit'; } },
      { id: 'c3_vision_early', label: "Chief, I'm having a vision!", keep: true, when: (g) => !g.flag('hired') && !g.hasAll(['blackout_timer', 'guest_log']), run: async (g) => {
        await g.say('shawn:psychic', 'The lights... the lights went out because... the spirits... forgot to pay the electric bill...');
        await g.say('vick:stern', 'Mr. Spencer. Bring me something real.');
        await g.think('How did the lights go out, and who was here to do it?');
      } },
      { id: 'c3_finale', label: "I'd like to hold a seance of my own.", keep: true, when: (g) => g.flag('hired') && !g.flag('finale_done') && finaleReady(g), run: async (g) => {
        await g.say('shawn:psychic', 'Chief. Everyone. In the parlor. Lights low. I will contact... the truth.');
        await g.say('vick:stern', '...Fine. But if you start speaking in a British accent—');
        await g.say('shawn', 'I will try my absolute best not to, Chief.');
        g.set('finale_pending');
        await g.goto('parlor', { x: 160, y: 156 });
        return 'exit';
      } },
      { id: 'c3_notready', label: "I'd like to hold a seance of my own.", keep: true, when: (g) => g.flag('hired') && !g.flag('finale_done') && !finaleReady(g), run: async (g) => {
        await g.say('vick:stern', 'Not yet, Mr. Spencer. Who set the timer, what was stolen, who had the chance, why, and where it is now. Bring me all of it.');
      } },
    ],
    juliet: [
      { id: 'c3_what', label: 'What do we know, Jules?', run: async (g) => {
        await g.say('juliet', "Lights out at 9:15 for about ninety seconds. The necklace vanished off Mrs. Vanderkamp's neck. Hargrove was hit at the top of the stairs.");
        await g.say('juliet', "Nobody's left the house. The doors were locked from the inside because of the storm.");
      } },
      { id: 'c3_lead', label: 'Any leads?', when: (g) => g.flag('hired'), run: async (g) => {
        if (!g.hasClue('necklace_found')) await g.say('juliet', "Preston's been very eager to help. Too eager. He's offered to search the house four times.");
        else if (!g.hasClue('pemberton_alone')) await g.say('juliet', "The maid, Rosa, won't leave the kitchen. She says the house is haunted. Maybe she saw something.");
        else await g.say('juliet', "I think you're about to do something dramatic, Shawn.");
      } },
    ],
    lassiter: [
      { id: 'c3_ozera', label: 'Still think it was Ozera?', run: async (g) => {
        if (!g.flag('hired')) { await g.say('lassiter', "Three arrests. Fake spirits. Lights out on cue. If it walks like a fraud and talks to dead people like a fraud..."); await g.clue('ozera_record'); }
        else await g.say('lassiter:stern', "Fine. She didn't set the timer. She is still a fraud. Fraud is a CRIME, Spencer. Remember that. You of all people.");
      } },
    ],
    gus: [
      { id: 'c3_distract', label: 'Gus, distract Lassiter.', when: (g) => g.flag('seance_done') && !g.flag('hired') && !g.flag('lassiter_away') && g.here === 'foyer', run: async (g) => {
        await g.say('gus', 'With WHAT?');
        const c = await g.choose([{ text: 'Report a ghost in the conservatory', value: 'ghost' }, { text: 'Ask him about his feelings', value: 'feel' }, { text: 'Do a little tap dance', value: 'tap' }], { title: 'How should Gus distract him?' });
        if (c === 'feel') { await g.say('gus', 'Detective Lassiter... how are you, really? Emotionally?'); await g.say('lassiter:angry', 'Get away from me, Guster.'); return; }
        if (c === 'tap') { g.anim('gus', 'jazz', 1500); await g.wait(900); await g.say('lassiter:stern', "...I'm not even going to ask."); return; }
        await g.say('gus:surprised', 'DETECTIVE! I just saw a GHOST in the conservatory! It was carrying a... a SAPPHIRE!');
        await g.say('lassiter:surprised', '...A ghost with a sapphire?');
        await g.say('gus', 'And it was WEARING A TURBAN.');
        await g.say('lassiter:angry', 'I KNEW IT.');
        await g.walk('lassiter', 300, 140, { run: true });
        g.show('lassiter', false);
        g.set('lassiter_away');
        await g.say('gus', 'Go. GO. I have bought you about four minutes and my dignity.');
      } },
      { id: 'c3_salts', label: 'Got anything for a concussion?', when: (g) => g.flag('hargrove_dazed') && !g.hasItem('salts') && !g.flag('hargrove_awake'), run: async (g) => {
        await g.say('gus', "Ammonia inhalants. I rep them. I carry them because... reasons.");
        await g.say('shawn', 'Because you faint, Gus.');
        await g.say('gus', 'I carry them for REASONS, Shawn.');
        await g.item('salts');
      } },
    ],
    henry: [
      { id: 'c3_fog', label: 'Dad, remember the pawn shop?', run: async (g) => { await g.say('henry', "Lucky's. Nice man. Sold me a fake Rolex in 1988. I sold it back to him in 1990."); await g.say('henry:smug', 'Fakes look perfect until you put a little heat on them, Shawn.'); } },
    ],
  };

  const banter = [
    [['gus', 'Shawn, that portrait just blinked.'], ['shawn', 'Portraits don\'t blink, Gus.'], ['gus', 'THAT one does.']],
    [['shawn', 'Gus, if you were a ghost, who would you haunt?'], ['gus', 'The guy who invented decaf.']],
    [['gus', 'I want it on the record I did not want to come here.'], ['shawn', 'Noted. Now go check that dark hallway.'], ['gus', 'You check the dark hallway.']],
    [['shawn', "This storm is perfect. It's so atmospheric."], ['gus', "It's so atmospheric I can't feel my toes."]],
    [['gus', 'Do you think the cook makes breakfast for guests?'], ['shawn', 'Gus, someone was assaulted.'], ['gus', 'And afterward, breakfast.']],
  ];

  P.registerChapter({
    id: 'ch3', number: 3, title: 'SEANCE & SENSIBILITY',
    tagline: 'A TV psychic, a storm, a missing sapphire.',
    pineapple: { scene: 'foyer', note: 'Carved into the staircase newel post, as tradition demands.' },
    cast, clues, items, gifts, snacks, scenes, revelations, hints, topics, banter,
    observe: {},
    where: {
      vick: () => 'manor', lassiter: () => 'manor', juliet: () => 'manor', mcnab: () => 'none',
    },
    map: {
      manor: { name: 'Vanderkamp Manor', x: 246, y: 52, scene: 'foyer', scenes: ['parlor', 'kitchen', 'library', 'preston', 'basement'], chapter: true, desc: 'Montecito. Forty rooms, one sapphire, and a TV psychic who thinks you are a fraud.' },
    },
    extend: {
      office: {
        hotspots: [{ id: 'tv', name: 'TV', x: 328, y: 28, w: 50, h: 32, walk: [352, 140], look: async (g) => { await g.say('MADAME OZERA (TV)', '"...and to the so-called psychic detective of Santa Barbara: tonight. Vanderkamp Manor. Come and see a REAL psychic at work."'); await g.say('shawn:angry', 'So-called! SO-CALLED, Gus!'); } }],
        onEnter: async (g) => {
          if (g.once('c3_intro')) {
            g.place('shawn', 300, 150, 'right'); g.place('gus', 272, 150, 'right');
            await g.say('MADAME OZERA (TV)', "...so-called 'psychic detectives' are frauds, preying on the police and the public. One in Santa Barbara in particular. Shawn Spencer, I'm looking at you.");
            await g.say('shawn:surprised', 'Gus. GUS. She said my name on television.');
            await g.say('MADAME OZERA (TV)', "Tonight I hold a seance at Vanderkamp Manor to contact the late Archibald Vanderkamp. Mr. Spencer, if you have the gift... come and prove it.");
            await g.say('gus:worried', 'Shawn, it is a haunted mansion. In Montecito. During a THUNDERSTORM.');
            await g.say('shawn', "Gus, don't be a scaredy-pants.");
            await g.say('gus', 'I am going to be EXACTLY a scaredy-pants.');
            await g.say('shawn', "Then be a scaredy-pants in the car. We're going.");
            g.objective('Go to Vanderkamp Manor in Montecito. Accept the challenge.');
          }
        },
      },
    },
    onLoad(g) {
      const has = !g.flag('seance_done') || g.flag('necklace_returned');
      cast.dolores.acc = has ? ['sapphire', 'earrings'] : ['earrings'];
      P.defineCast('dolores', cast.dolores); P.Sprite.clear(); P.Portrait.clear();
    },
    async start(g) {
      g.flashback(true);
      await g.goto('flash90', { instant: true });
      await g.card({ kicker: 'DE LA VINA STREET', title: '1990', sub: "Lucky's Pawn", dur: 2.6 });
      await g.say('lucky', 'Henry! Genuine diamonds, all three. For you? A cop discount.');
      await g.say('younghenry:stern', "Lucky, if these are genuine, I'm a ballerina.");
      await g.say('younghenry', "Shawn, watch. Real stones get rid of heat fast. Fakes hold onto it. Watch what happens when I breathe on 'em.");
      await g.say('younghenry', 'Hhhhhhh...');
      g.scene.fog = { t: 0 };
      const ok = await g.memoryTest({ seconds: 5, label: 'WATCH THE FOG!', question: 'Eyes shut, Shawn. Which stone stayed cloudy?', options: ['The left one', 'The middle one', 'The right one', 'They all cleared'], answer: 2 });
      if (ok) { await g.say('youngshawn:happy', 'The right one! It stayed foggy forever!'); await g.say('lucky:worried', "...Okay, the right one is a LITTLE bit glass."); }
      else { await g.say('younghenry:stern', 'The right one, Shawn. It held the fog like a bathroom mirror. Glass.'); await g.say('lucky:sad', 'Kid, you are bad for business.'); }
      await g.say('younghenry', "Remember this. Fakes look perfect. Right up until you put a little heat on them.");
      await g.say('youngshawn', 'Can I breathe on everything in the store?');
      await g.say('younghenry:stern', 'No.');
      await g.say('lucky', 'PLEASE no.');
      await g.fade(true, 700);
      g.flashback(false);
      g.music('title');
      await g.card({ kicker: 'CASE 3', title: 'SEANCE & SENSIBILITY', sub: 'Present day. A storm is coming.', dur: 3.6 });
      await g.goto('office', { x: 300, y: 150 });
    },
  });
})(window.P);
