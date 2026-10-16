'use strict';
/* ============================================================================
   CASE 2: RACK OF LIES
   Reigning pitmaster "Big Earl" Boudreaux collapses at the Santa Barbara
   Smoke-Off right after tasting his rival's sauce. Lassiter cuffs the rival.
   Everybody watched the sauce. Nobody watched the other hand.

   Episode structure:
     Cold open  - 1989, State Street: a street magician; Henry teaches young
                  Shawn to "watch the other hand".
     Act 1      - Present day: Shawn & Gus witness the collapse (the poison
                  handoff happens in plain sight). Woody's cold-reading side
                  quest for the tox report. First vision at SBPD -> hired.
     Act 2      - Thorne's missing pills, the goat quest for Miss Odessa, the
                  trailer (back window sneak OR the key via Juliet), tongs ->
                  burnt ends -> Kenji's photos, the jar in the recycling.
     Act 3      - Night-time revelation under the string lights, Tammy's lasso.
   Pineapple: in the fruit crate at the funnel cake stand (fairgrounds).
   ========================================================================== */
(function (P) {
  const G = P.G, U = P.U, R = P.props;

  /* ------------------------------------------------------------------ cast */
  const cast = {
    earl: {
      name: 'Big Earl Boudreaux', short: 'Big Earl', h: 60, build: 'huge', skin: 'tan', jaw: 'round', eyes: '#3a2a1a',
      hair: { style: 'bald', color: 'gray' }, face: { beard: 'gray' },
      top: { type: 'tee', color: '#2a2a34', apron: '#7a2a1a' }, bottom: { type: 'jeans', color: '#3a4a6a' }, shoes: '#3a2a1a',
      acc: [{ type: 'cap', color: '#c83a3a' }], voice: { pitch: 0.65 }, color: '#ff9a6a', portrait: { bg: '#3a1a10', frame: '#ff9a6a' },
    },
    tammy: {
      name: 'Tammy Lynn Pruitt', short: 'Tammy', h: 54, build: 'fem', skin: 'rosy', jaw: 'soft', eyes: '#3a7a4a',
      hair: { style: 'curly', color: 'red' }, face: { lashes: true, lips: '#c83a4a', freckles: true },
      top: { type: 'shirt', color: '#c83a3a', apron: '#f4ecd6' }, bottom: { type: 'jeans', color: '#3a5a8a' }, shoes: '#7a4a2a',
      acc: [{ type: 'cowboy', color: '#e8d8b0' }], voice: { pitch: 1.2 }, color: '#ff8a6a', portrait: { bg: '#4a1a1a', frame: '#ff8a6a' },
    },
    duane: {
      name: 'Duane Boudreaux', short: 'Duane', h: 55, build: 'slim', skin: 'olive', jaw: 'avg', eyes: '#2a1a14',
      hair: { style: 'short', color: 'black' }, face: { stubble: true },
      top: { type: 'tee', color: '#3a3a48', apron: '#7a4a2a' }, bottom: { type: 'jeans', color: '#2a3a5a' }, shoes: '#2a2228',
      acc: [{ type: 'headband', color: '#e43b44' }], voice: { pitch: 1.0 }, color: '#e8b070', portrait: { bg: '#2a1e14', frame: '#e8b070' },
    },
    vance: {
      name: 'Vance Holloway', short: 'Vance', h: 58, build: 'avg', skin: 'light', jaw: 'long', eyes: '#3a5a7a',
      hair: { style: 'swoop', color: 'dkbrown' }, face: {},
      top: { type: 'blazer', color: '#2e3e60', shirt: '#e8f0ff', pocketSquare: '#feae34' }, bottom: { type: 'pants', color: '#c8b890' }, shoes: '#5a3a2a',
      acc: ['chain'], voice: { pitch: 1.0 }, color: '#9ab8ff', portrait: { bg: '#141e34', frame: '#9ab8ff', base: 'smug' },
    },
    thorne: {
      name: 'Reginald Thorne', short: 'Thorne', h: 57, build: 'slim', skin: 'pale', jaw: 'long', eyes: '#4a4a3a',
      hair: { style: 'slick', color: 'salt' }, face: { mustache: 'salt', glasses: 'square' },
      top: { type: 'vest', color: '#6a2a3a', shirt: '#f4f0e8' }, bottom: { type: 'pants', color: '#3a3a48' }, shoes: '#1a1418',
      acc: [{ type: 'bowtie', color: '#2a6a4a' }], voice: { pitch: 0.95 }, color: '#d8b0c0', portrait: { bg: '#2a1420', frame: '#d8b0c0', base: 'stern' },
    },
    kenji: {
      name: 'Kenji Watanabe', short: 'Kenji', h: 55, build: 'slim', skin: 'light', jaw: 'avg', eyes: '#2a1a14',
      hair: { style: 'short', color: 'black' }, face: {},
      top: { type: 'hoodie', color: '#3a8a7a' }, bottom: { type: 'jeans', color: '#2a3a5a' }, shoes: '#e43b44',
      acc: [{ type: 'beanie', color: '#e8a030' }, 'camera'], voice: { pitch: 1.15 }, color: '#8ae8d0', portrait: { bg: '#123a34', frame: '#8ae8d0' },
    },
    odessa: {
      name: 'Miss Odessa', short: 'Odessa', h: 52, build: 'stout', skin: 'deep', jaw: 'round', eyes: '#2a1a14',
      hair: { style: 'bun', color: 'gray' }, face: { glasses: 'round', glassesColor: '#c8a040', lips: '#9a3a4a' },
      top: { type: 'dress', color: '#e8b040', pattern: 'flowers', pattern2: '#ffffff' }, bottom: { type: 'skirt', color: '#e8b040' }, shoes: '#5a3a2a',
      acc: ['pearls'], voice: { pitch: 1.05 }, color: '#ffd070', portrait: { bg: '#3a2a10', frame: '#ffd070' },
    },
    marvin: {
      name: 'The Marvelous Marvin', short: 'Marvin', h: 57, build: 'slim', skin: 'tan', jaw: 'long', eyes: '#2a1a14',
      hair: { style: 'slick', color: 'black' }, face: { mustache: 'black' },
      top: { type: 'tux', color: '#2a1a3a', shirt: '#f4f4f8' }, bottom: { type: 'pants', color: '#2a1a3a' }, shoes: '#1a1418',
      acc: [{ type: 'bowtie', color: '#c83a3a' }, { type: 'fedora', color: '#1a1a2a' }], voice: { pitch: 1.1 }, color: '#d8a8ff', portrait: { bg: '#2a1a3a', frame: '#d8a8ff' },
    },
  };

  /* ------------------------------------------------------------- evidence */
  const clues = {
    tasting: { name: 'The Champion\'s Tasting', icon: 'spoon', from: 'Juliet', desc: 'Big Earl collapsed at 2:15 PM, seconds after tasting Tammy Pruitt\'s sauce at the judges\' table.' },
    tammy_threat: { name: '"I\'ll Kill You, Earl"', icon: 'recording', from: 'Lassiter', desc: 'Tammy Pruitt told Earl she\'d "kill him" in front of forty people this morning. She says she meant "on the scoreboard".' },
    sauce_clean: { name: 'The Sauce Was Clean', icon: 'sauce', from: 'Woody', desc: 'Tammy\'s sauce sample tested clean. No poison. (Woody says it was also delicious.)' },
    digoxin_timing: { name: 'Digoxin, Slow-Acting', icon: 'vial', from: 'Woody', desc: 'Earl died of a massive digoxin overdose. It takes 30-60 minutes to hit. He swallowed it long before the 2:15 tasting.' },
    sweet_tea_stomach: { name: 'A Stomach Full of Sweet Tea', icon: 'cup', from: 'Woody', desc: 'Earl\'s stomach held a huge amount of sweet tea, drunk about 45 minutes before death. Sweet enough to hide something bitter.' },
    thorne_pills: { name: "Thorne's Missing Pills", icon: 'pill', zoom: true, from: 'Reginald Thorne', desc: 'Judge Thorne takes digoxin. His bottle had 20 pills this morning; it has 3 now. His jacket hung on the judges\' coat rack all afternoon.' },
    vance_bought_tea: { name: 'Vance Bought the Tea', icon: 'receipt', from: 'Miss Odessa', desc: 'At 1:30 PM Vance Holloway bought Earl\'s sweet tea and carried the mason jar to him himself. He has never bought Earl anything. Ever.' },
    sale_contract: { name: 'Smokestack Brands Contract', icon: 'contract', zoom: true, from: "Earl's trailer", desc: 'A $3,000,000 offer for the Big Earl\'s brand. Signed by Vance. NOT signed by Earl. The partnership agreement gives everything to the surviving partner.' },
    photo_tent: { name: 'Photo: The Coat Rack', icon: 'photo', zoom: true, from: 'Kenji', desc: "Kenji's 12:52 PM photo: Vance Holloway with his hand in a tweed jacket on the judges' coat rack. Thorne's jacket." },
    photo_tea: { name: 'Photo: The Other Hand', icon: 'photo', zoom: true, from: 'Kenji', desc: "Kenji's 1:31 PM photo: everyone looks at Tammy's giant hat while Vance, pointing at it with his right hand, slides Earl the mason jar with his left." },
    mason_jar: { name: 'The Mason Jar', icon: 'bottle', zoom: true, from: 'recycling bin', desc: 'Earl\'s mason jar, rinsed and dumped in the recycling behind Odessa\'s stand. A chalky white crust is still stuck under the rim. Gus says it smells bitter.' },
    vance_cuff: { name: 'Powder on Vance\'s Cuff', icon: 'magnifier', zoom: true, from: 'observation', desc: 'A fine white powder on Vance\'s LEFT shirt cuff. Not sugar. Sugar sparkles.' },
  };
  const items = {
    granola: { name: "Gus's Emergency Granola Bar", icon: 'leaf', desc: 'Oats, honey, and the last shred of Gus\'s trust.' },
    tea_sign: { name: "Odessa's Sign", icon: 'card', desc: '"MISS ODESSA\'S SWEET TEA - $2". Slightly chewed. Smells like goat.' },
    trailer_key: { name: 'Trailer Key', icon: 'key', desc: "The key to Big Earl's trailer, pried out of Vance Holloway's hand by Juliet's patience." },
    tongs: { name: "Earl's Lucky Tongs", icon: 'wrench', desc: 'Stainless steel, taped with lucky electrical tape. Thirty years of championships.' },
    burntends_plate: { name: 'Plate of Burnt Ends', icon: 'ribs', desc: 'Big Earl\'s legendary burnt ends, made by Duane. Hands off, Shawn.' },
  };
  const gifts = {
    blueribbon: {
      name: 'Second-Place Ribbon', icon: 'badge', romance: 1, desc: '"2ND PLACE - DAIRY GOAT". Gertrude is a champion in our hearts.',
      give: async (g) => {
        await g.say('juliet:surprised', 'Second place... dairy goat? Shawn, did you win this?');
        await g.say('shawn', "A goat named Gertrude won it. She wanted you to have it. She respects law enforcement.");
        await g.say('juliet:happy', "...That's the weirdest thing anyone has ever given me. I'm keeping it.");
      },
    },
    jam: {
      name: "Miss Odessa's Peach Jam", icon: 'bottle', romance: 1, desc: '"For your sweetheart. Not for you. I mean it."',
      give: async (g) => {
        await g.say('juliet:happy', "Homemade peach jam? Shawn, this is from Miss Odessa's. She's a legend.");
        await g.say('shawn', 'She said it was for my sweetheart.');
        await g.say('juliet:flirty', '...Did she.');
        await g.say('gus', 'She also said not to eat it ourselves. Twice. With a finger point.');
      },
    },
    hatpin: {
      name: 'Tiny Cowboy Hat Pin', icon: 'hat', romance: 1, desc: 'From Tammy: "Give it to that blonde detective who believed me."',
      give: async (g) => {
        await g.say('juliet:smile', 'A tiny cowboy hat. From Tammy?');
        await g.say('shawn', 'She said it was for the detective who believed her. I said, "Jules always believes people." She said, "That one\'s a keeper."');
        await g.say('juliet:happy', "She did not say that.");
        await g.say('shawn', 'She said it with her eyes, Jules.');
      },
    },
  };
  const snacks = {
    burntends: { name: "Big Earl's Burnt Ends", icon: 'ribs', desc: 'Smoked 14 hours. Gus said a little prayer.' },
    sweettea: { name: "Miss Odessa's Sweet Tea", icon: 'cup', desc: 'So sweet it has its own gravitational pull.' },
    cornbread: { name: "Tammy's Jalapeno Cornbread", icon: 'pie', desc: 'Spicy, buttery, apologetic.' },
    funnelcake: { name: 'Funnel Cake', icon: 'donut', desc: 'Powdered sugar on Gus\'s tie: 100%.' },
  };

  /* ---------------------------------------------------------- scene art */
  function drawGoat(x, sx, sy, a) {
    const t = a.t, f = a.face;
    const c = G.canvas(40, 34), q = c.x;
    const chew = Math.floor(t * 4) % 2;
    // body
    G.ellipse(q, 18, 18, 11, 7, '#e8e4dc'); G.ellipse(q, 16, 16, 9, 5, '#f4f0e8');
    for (const lx of [10, 14, 22, 26]) G.rect(q, lx, 22, 2, 9, '#c8c4bc');
    G.rect(q, 6, 14, 3, 2, '#c8c4bc'); // tail
    // head + neck
    G.poly(q, [[24, 14], [30, 6], [33, 8], [28, 17]], '#e8e4dc');
    G.ellipse(q, 33, 9 + chew, 4, 3, '#f4f0e8');
    G.line(q, 30, 5, 28, 1, '#8a7a6a'); G.line(q, 32, 5, 31, 1, '#8a7a6a');
    G.px(q, 34, 8, '#1a1424'); G.rect(q, 35, 12 + chew, 2, 3, '#c8c4bc');
    if (!P.game.g.flag('goat_fed')) { G.rect(q, 33, 11 + chew, 7, 5, '#f4ecd6'); G.hl(q, 34, 13 + chew, 5, '#c83a3a'); }
    else if (a.t % 3 < 1.5) G.rect(q, 34, 12, 4, 2, '#c8a060');
    const o = G.outline(c, '#1d1526');
    const img = f < 0 ? G.flip(o) : o;
    G.shadow(x, sx, sy + 1, 10, 2);
    x.drawImage(img, Math.round(sx - 20), Math.round(sy - 32));
  }
  function ferris(x, cx, cy, r, t, night) {
    G.line(x, cx, cy, cx - 16, cy + r + 18, '#8a8a9a', 2); G.line(x, cx, cy, cx + 16, cy + r + 18, '#8a8a9a', 2);
    for (let a = 0; a < 64; a++) { const ang = (a / 64) * Math.PI * 2; G.px(x, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, night ? '#fee761' : '#c8c8d8'); }
    for (let i = 0; i < 8; i++) {
      const ang = t * 0.3 + (i / 8) * Math.PI * 2;
      const px = cx + Math.cos(ang) * r, py = cy + Math.sin(ang) * r;
      G.line(x, cx, cy, px, py, '#a8a8b8');
      G.rect(x, px - 2, py, 5, 4, ['#e43b44', '#2a8ad8', '#fee761', '#63c74d'][i % 4]);
    }
    G.circle(x, cx, cy, 2, '#5a5a6a');
  }
  function drawBale(x, X, Y) {
    G.rect(x, X, Y - 12, 22, 12, '#d8b850'); G.hl(x, X, Y - 12, 22, '#f0d070'); G.hl(x, X, Y - 1, 22, '#a88a30');
    G.vl(x, X + 6, Y - 12, 12, '#8a6a20'); G.vl(x, X + 15, Y - 12, 12, '#8a6a20'); G.noise(x, X, Y - 12, 22, 12, ['#c8a840', '#f0d070'], 0.15, 'bale' + X);
  }

  const scenes = {};

  /* ---- cold open: 1989 ---- */
  scenes.flash89 = {
    name: 'State Street, 1989', width: 320, noShawn: true, noGus: true, music: 'flashback',
    floor: { x0: 20, x1: 300, y0: 136, y1: 170 },
    bg(x) {
      R.sky(x, 0, 0, 320, 40, 'day');
      R.stucco(x, 0, 24, 110, 94, '#f4ecdc'); R.roofTiles(x, 0, 18, 110, 8);
      R.stucco(x, 112, 30, 96, 88, '#f0e0c8'); R.roofTiles(x, 108, 24, 104, 8);
      R.stucco(x, 210, 22, 110, 96, '#f4ecdc'); R.roofTiles(x, 206, 16, 114, 8);
      R.sign(x, 20, 34, 70, 11, 'PLATTERS', { bg: '#2a2a48', fg: '#ff8ab8' });
      R.window(x, 16, 56, 40, 34, { frame: '#5a3a2a', cross: false }); R.door(x, 70, 64, 24, 54, '#5a3a2a', { glass: true });
      R.sign(x, 124, 40, 72, 11, 'SCOOPS', { bg: '#ff8ab8', fg: '#ffffff' });
      R.window(x, 120, 60, 80, 30, { frame: '#e8e0d0' });
      for (let i = 0; i < 5; i++) G.circle(x, 130 + i * 15, 82, 4, ['#ff8ab8', '#f4ecd6', '#8a5a3a', '#63c74d', '#fee761'][i]);
      R.sign(x, 224, 32, 80, 11, 'VIDEO WORLD', { bg: '#2a6ab0', fg: '#fee761' });
      R.window(x, 220, 54, 50, 34, { frame: '#5a5a6a', cross: false }); R.door(x, 280, 62, 24, 56, '#5a5a6a', { glass: true });
      R.poster(x, 226, 58, 14, 20, 'movie', 'vw1'); R.poster(x, 246, 58, 14, 20, 'movie', 'vw2');
      R.sidewalk(x, 0, 118, 320, 62);
      R.palm(x, 112, 128, 70, 'ssp'); R.streetlamp(x, 304, 128);
    },
    props: [{ y: 146, draw: (x, cam, t) => { // the magician's folding table + cups
      const X = 186 - cam, sc = P.game.scene, st = sc.cups || { phase: 'idle', t: 0 };
      G.rect(x, X, 120, 40, 4, '#7a1a2a'); G.rect(x, X - 1, 120, 42, 10, '#9a2a3a'); G.hl(x, X - 1, 129, 42, '#5a0a1a');
      G.rect(x, X + 4, 130, 2, 16, '#3a3a48'); G.rect(x, X + 34, 130, 2, 16, '#3a3a48');
      const tt = st.t;
      const pos = [X + 8, X + 20, X + 32];
      let order = [0, 1, 2];
      if (st.phase === 'shuffle') { const k = Math.floor(tt * 3) % 3; order = [[0, 1, 2], [1, 0, 2], [1, 2, 0]][k]; }
      for (let i = 0; i < 3; i++) {
        const cx = pos[order.indexOf(i)] + (st.phase === 'shuffle' ? Math.round(Math.sin(tt * 9 + i) * 2) : 0);
        G.poly(x, [[cx - 4, 120], [cx + 4, 120], [cx + 3, 112], [cx - 3, 112]], '#c0cbdc'); G.hl(x, cx - 3, 112, 7, '#e8f0f8');
      }
      // the ball: palmed into the pocket at ~2.4s of the shuffle, while the wand waves
      if (st.phase === 'shuffle' && tt > 2.2 && tt < 3.0) { const k = (tt - 2.2) / 0.8; G.circle(x, U.lerp(X + 20, X + 6, k), U.lerp(119, 104, k), 1, '#e43b44'); }
    } }],
    actors: [
      { id: 'marvin', x: 196, y: 140, face: 'right', idle: 'wave' },
      { id: 'younghenry', x: 252, y: 150, face: 'left' },
      { id: 'youngshawn', x: 232, y: 156, face: 'left' },
    ],
    update(sc, dt) { if (sc.cups) sc.cups.t += dt; },
    anim(x, t, o) {
      const sc = o.scene;
      if (sc.cups && sc.cups.phase === 'shuffle') { const m = sc.actors.marvin; if (m) G.sparkle(x, m.x + 12 + Math.sin(t * 9) * 3, 92 + Math.cos(t * 7) * 3, 2, '#fee761'); }
    },
  };

  /* ---- the fairgrounds ---- */
  scenes.fair = {
    name: (g) => (g.flag('finale_pending') ? 'Smoke-Off Fairgrounds - Night' : 'Smoke-Off Fairgrounds'),
    width: 640, music: (g) => (g.flag('finale_pending') ? 'finale' : 'bbq'),
    floor: { x0: 8, x1: 632, y0: 134, y1: 172 },
    entries: { map: { x: 30, y: 152, face: 'right' }, trailer: { x: 142, y: 140, face: 'right' }, barn: { x: 600, y: 150, face: 'left' } },
    variant: (g) => (g.flag('finale_pending') ? 'night' : 'day') + (g.flag('sign_returned') ? '-sign' : '-nosign'),
    bg(x, o) {
      const night = o.v.startsWith('night'), sign = o.v.endsWith('-sign');
      const Wd = o.W;
      R.sky(x, 0, 0, Wd, 80, night ? 'night' : 'day');
      if (night) R.stars(x, 0, 0, Wd, 60, 'fairstars', 90); else { R.cloud(x, 40, 12, 40); R.cloud(x, 260, 6, 34); R.cloud(x, 520, 16, 30); }
      R.mountains(x, 0, 84, Wd, night ? '#22264a' : '#8aa0b0', 'fairmtn', 30, 22);
      R.hills(x, 0, 96, Wd, night ? '#1a3a2a' : '#6a9a4a', 'fairhill', 10);
      // distant tents
      for (let i = 0; i < 9; i++) { const tx = 20 + i * 72; G.poly(x, [[tx, 100], [tx + 20, 86], [tx + 40, 100]], i % 2 ? (night ? '#5a2a3a' : '#e85a5a') : (night ? '#4a4a6a' : '#f4f0e8')); }
      R.grass(x, 0, 100, Wd, 34, night ? '#2a4a2a' : '#6aa84a');
      G.rect(x, 0, 128, Wd, 52, night ? '#5a4a3a' : '#b8946a'); G.noise(x, 0, 128, Wd, 52, night ? ['#4a3a2a', '#6a5a4a'] : ['#a8845a', '#c8a47a'], 0.08, 'dirt');
      G.dither(x, 0, 128, Wd, 3, night ? '#2a4a2a' : '#6aa84a', 6);
      // entrance arch
      G.rect(x, 6, 40, 4, 92, '#7a4a2a'); G.rect(x, 42, 40, 4, 92, '#7a4a2a');
      R.sign(x, 2, 32, 48, 12, 'SMOKE-OFF', { bg: '#2a1a10', fg: '#ff9a3c' });
      // Big Earl's trailer
      G.rect(x, 56, 62, 100, 60, '#1a1a22'); G.hl(x, 56, 62, 100, '#3a3a4a');
      for (let i = 0; i < 12; i++) G.poly(x, [[58 + i * 8, 122], [62 + i * 8, 104 - (i % 3) * 6], [66 + i * 8, 122]], i % 2 ? '#ff6a1a' : '#fec83a');
      P.font.draw(x, "BIG EARL'S", 106, 66, '#ff9a3c', { align: 'center', shadow: '#5a1a0a' });
      R.window(x, 66, 78, 22, 14, { frame: '#5a5a6a', night: true, cross: false });
      G.rect(x, 78, 78, 10, 14, '#0a0a14');
      R.door(x, 130, 82, 20, 40, '#2a2a34');
      G.rect(x, 128, 122, 24, 3, '#5a5a6a');
      G.rect(x, 154, 96, 24, 26, '#2a2a30'); G.ellipse(x, 166, 96, 12, 4, '#3a3a40'); G.rect(x, 170, 72, 4, 24, '#2a2a30');
      // judges' canopy + table (crime scene)
      G.rect(x, 188, 64, 3, 60, '#c8c8d0'); G.rect(x, 290, 64, 3, 60, '#c8c8d0');
      for (let i = 0; i < 108; i += 12) G.poly(x, [[186 + i, 66], [198 + i, 66], [198 + i, 72], [186 + i, 72]], (i / 12) % 2 ? '#2a6ab0' : '#f4f0e8');
      G.poly(x, [[184, 66], [296, 66], [284, 54], [196, 54]], '#f4f0e8');
      G.rect(x, 200, 102, 80, 4, '#f8f8f4'); G.rect(x, 200, 106, 80, 10, '#e8e8e4'); G.hl(x, 200, 115, 80, '#c8c8c4');
      R.sign(x, 218, 80, 44, 10, 'JUDGES', { bg: '#2a6ab0', fg: '#ffffff' });
      // coat rack behind the judges' table
      G.rect(x, 274, 74, 2, 28, '#7a4a2a'); G.hl(x, 270, 76, 10, '#7a4a2a'); G.poly(x, [[268, 78], [276, 78], [278, 96], [266, 96]], '#8a6a4a');
      // Tammy's booth
      G.rect(x, 304, 56, 3, 68, '#7a4a2a'); G.rect(x, 378, 56, 3, 68, '#7a4a2a');
      G.rect(x, 300, 50, 84, 14, '#c83a3a'); P.font.draw(x, "PRUITT'S PIT", 342, 54, '#fee761', { align: 'center', shadow: '#5a0a0a' });
      G.rect(x, 316, 66, 22, 14, '#ffffff'); G.rect(x, 316, 66, 8, 14, '#2a3a8a'); G.rect(x, 324, 73, 14, 7, '#c83a3a'); G.px(x, 319, 72, '#ffffff');
      G.rect(x, 346, 92, 28, 20, '#8a2a2a'); G.ellipse(x, 360, 92, 14, 3, '#aa3a3a'); G.rect(x, 366, 70, 3, 22, '#3a3a40');
      // Odessa's sweet tea stand
      R.stand(x, 396, 126, 72, { roof: '#e8a030', sign: sign ? 'SWEET TEA' : '', col: '#fff4d8', h: 54 });
      if (!sign) { G.rect(x, 408, 56, 48, 10, '#e8a030'); G.poly(x, [[440, 56], [456, 56], [456, 66], [446, 64]], '#3a2a1a'); }
      for (let i = 0; i < 3; i++) { G.rect(x, 406 + i * 18, 92, 12, 16, '#e8b050'); G.frame(x, 406 + i * 18, 92, 12, 16, '#c8d8e8'); G.rect(x, 408 + i * 18, 96, 8, 10, '#c87a2a'); }
      // recycling bin
      G.rect(x, 474, 108, 14, 20, '#2a6ab0'); G.hl(x, 473, 107, 16, '#4a8ad0'); G.px(x, 480, 116, '#ffffff'); G.px(x, 481, 117, '#ffffff');
      // funnel cake stand + the pineapple in the fruit crate
      R.stand(x, 500, 126, 56, { roof: '#ff6ac8', sign: 'FUNNEL', col: '#fff4f8' });
      R.crate(x, 556, 128, 14, '#b8884a');
      R.pineapple(x, 563, 116, 1);
      G.circle(x, 559, 115, 2, '#e43b44'); G.circle(x, 567, 116, 2, '#63c74d');
      // livestock barn
      G.rect(x, 576, 44, 64, 84, '#b83a2a'); G.poly(x, [[572, 46], [644, 46], [608, 22]], '#8a2a1a');
      for (let px = 578; px < 640; px += 6) G.vl(x, px, 48, 80, '#a8321f');
      G.rect(x, 590, 72, 36, 56, '#2a1410'); G.line(x, 590, 72, 626, 128, '#f4f0e8'); G.line(x, 626, 72, 590, 128, '#f4f0e8'); G.frame(x, 590, 72, 36, 56, '#f4f0e8');
      R.sign(x, 586, 54, 44, 10, 'LIVESTOCK', { bg: '#f4f0e8', fg: '#8a2a1a' });
      // string lights posts
      for (const px of [52, 186, 296, 390, 494, 572]) G.rect(x, px, 36, 2, 92, '#5a4a3a');
    },
    anim(x, t, o) {
      const c = o.cam, night = o.v && o.v.startsWith('night');
      ferris(x, 470 - c * 0.6, 50, 26, t, night);
      // smoke from the smokers
      for (const [sx, sy] of [[172, 72], [368, 70]]) for (let i = 0; i < 4; i++) { const ph = (t * 0.4 + i / 4) % 1; x.save(); x.globalAlpha = 0.5 * (1 - ph); G.circle(x, sx - c + Math.sin(ph * 5 + i) * 4, sy - ph * 30, 2 + ph * 4, '#d8d8e0'); x.restore(); }
      // string lights
      const posts = [53, 187, 297, 391, 495, 573];
      for (let i = 0; i < posts.length - 1; i++) {
        const a = posts[i], b = posts[i + 1];
        for (let k = 0; k <= 12; k++) {
          const px = U.lerp(a, b, k / 12) - c, py = 37 + Math.sin((k / 12) * Math.PI) * 8;
          G.px(x, px, py, '#3a3a48');
          if (k % 2 === 0) { const on = night ? (Math.floor(t * 2 + k + i) % 5 !== 0) : false; G.px(x, px, py + 1, on ? ['#fee761', '#ff8ab8', '#7ae2f8'][k % 3] : '#8a8a7a'); if (on) { x.save(); x.globalAlpha = 0.3; G.circle(x, px, py + 1, 2, '#fee761'); x.restore(); } }
        }
      }
    },
    props: [
      { y: 128, draw: (x, cam) => drawBale(x, (P.game.g.flag('bale_moved') ? 66 : 186) - cam, 128) },
      { y: 124, draw: (x, cam) => drawBale(x, 318 - cam, 128) },
      { y: 126, show: (g) => !g.flag('finale_pending'), draw: (x, cam) => R.crimeTape(x, 186 - cam, 108, 296 - cam, 110) },
    ],
    update(sc, dt, g) { const v = sc.actors.vance; if (v) v.prop = g.flag('finale_started') ? 'sweat' : null; },
    hotspots: [
      { id: 'leave', name: 'Fairgrounds Exit', x: 0, y: 30, w: 14, h: 150, walk: [14, 152], exit: 'map', verb: 'Head out through the' },
      { id: 'trailerdoor', name: "Big Earl's Trailer", x: 126, y: 80, w: 28, h: 46, walk: [140, 138],
        use: async (g) => {
          if (g.hasItem('trailer_key') || g.flag('trailer_ok')) { g.sfx('door'); await g.goto('trailer', { x: 270, y: 152 }); return; }
          await g.say('shawn', 'Locked. Of course.');
          if (g.actor('mcnab')) await g.say('mcnab', "Sorry, Shawn. Locked up tight. Mr. Holloway has the only key. And Detective Lassiter says nobody goes in without a warrant.");
          await g.think('There\'s a window on the back end. A little high, though...');
        } },
      { id: 'trailerwin', name: 'Trailer Window (cracked open)', x: 64, y: 74, w: 28, h: 22, walk: [80, 136],
        use: async (g) => {
          if (!g.flag('bale_moved')) { await g.say('shawn', 'Open just a crack. If I had something to stand on...'); await g.say('gus', 'Do NOT ask me to be the something.'); return; }
          if (g.actor('mcnab') && g.once('window_warn')) { await g.say('gus:worried', 'Shawn, McNab is RIGHT around the corner.'); await g.say('shawn', 'Then we will be quick, quiet, and graceful. Like ninjas. Hungry ninjas.'); }
          g.sfx('step'); await g.hop('shawn', 10);
          g.set('window_in');
          await g.goto('trailer', { x: 60, y: 152 });
        },
        look: async (g) => { await g.say('shawn', 'The back window is cracked open. About... Shawn-sized. If I could reach it.'); } },
      { id: 'bale', name: 'Hay Bale', x: 184, y: 114, w: 26, h: 16, walk: [196, 140], show: (g) => !g.flag('bale_moved'),
        use: async (g) => {
          await g.say('shawn', 'Gus. Help me push this.');
          await g.say('gus', 'Why?');
          await g.say('shawn', "Because I'm about to do something brave and slightly illegal, and I need a step stool.");
          g.sfx('hit'); g.set('bale_moved');
          await g.say('gus', "There. It's under the window. My hands smell like a horse now.");
        } },
      { id: 'judgestable', name: "Judges' Table", x: 198, y: 96, w: 84, h: 22, walk: [240, 138],
        look: async (g) => {
          await g.say('shawn', "Where Big Earl tasted Tammy's sauce. Everybody was staring at the spoon.");
          await g.think("Everybody was staring at the spoon. That's what bothers me.");
        } },
      { id: 'coatrack', name: 'Judges\' Coat Rack', x: 266, y: 72, w: 14, h: 32, walk: [270, 136],
        look: async (g) => { await g.say('shawn', 'A coat rack. One tweed jacket, smells like pipe smoke and disapproval. Thorne\'s, I bet.'); } },
      { id: 'recycling', name: 'Recycling Bin', x: 472, y: 104, w: 18, h: 26, walk: [480, 138], clue: (g) => g.hasClue('photo_tea') && !g.hasClue('mason_jar'),
        look: async (g) => {
          if (!g.hasClue('photo_tea') && !g.hasClue('vance_bought_tea')) { await g.say('shawn', 'Recycling. Cans, bottles, and an alarming number of mason jars. This town LOVES a mason jar.'); return; }
          if (await g.clue('mason_jar')) {
            await g.say('shawn', 'Gus. Earl\'s mason jar. His name is painted on the bottom. Somebody rinsed it... badly.');
            await g.say('gus', '*sniff* ...Bitter. Under the sugar. That is not tea, Shawn. That is pharmacology.');
            await g.say('shawn', "Gus, your nose should have its own badge.");
          } else await g.say('shawn', 'Nothing else in there but a deep sense of environmental responsibility.');
        } },
      { id: 'funnel', name: 'Funnel Cake Stand', x: 500, y: 70, w: 56, h: 56, walk: [528, 138],
        use: async (g) => {
          if (g.s.snacks.includes('funnelcake')) { await g.say('gus', 'Shawn, I am still finding powdered sugar in places.'); return; }
          await g.say('shawn', "Gus. Funnel cake. It's the official food of investigating.");
          await g.snack('funnelcake');
          await g.say('gus', 'There is powdered sugar on my tie. My SILK tie.');
        } },
      { id: 'barn', name: 'Livestock Barn', x: 588, y: 70, w: 40, h: 60, walk: [604, 140], exit: 'barn', verb: 'Head into the' },
      { id: 'ferris', name: 'Ferris Wheel', x: 420, y: 20, w: 100, h: 66, walk: null,
        look: async (g) => { await g.say('shawn', 'If we solve this before sunset, we are riding that.'); await g.say('gus', "I'm not getting on a ride built by a guy named Spike."); } },
    ],
    actors: [
      // the present-day cold open
      { id: 'earl', x: 244, y: 142, face: 'right', show: (g) => !g.flag('c2_crime'), noInteract: true },
      // investigation
      { id: 'lassiter', x: 228, y: 150, face: 'right', idle: 'crossed', show: (g) => g.flag('c2_crime') && P.where(g, 'lassiter') === 'fair', talk: (g) => P.castTalk(g, 'lassiter', P.BASE_TOPICS.lassiter) },
      { id: 'juliet', x: 288, y: 156, face: 'left', show: (g) => g.flag('c2_crime') && P.where(g, 'juliet') === 'fair', talk: (g) => P.castTalk(g, 'juliet', P.BASE_TOPICS.juliet) },
      { id: 'mcnab', x: 112, y: 140, face: 'right', show: (g) => g.flag('c2_crime') && P.where(g, 'mcnab') === 'fair', talk: (g) => P.castTalk(g, 'mcnab', P.BASE_TOPICS.mcnab) },
      { id: 'tammy', x: 330, y: 128, face: 'left', idle: 'sit', talk: (g) => talkTammy(g),
        observe: (g) => g.say('shawn', "Sauce under her nails, flour on her apron, and the posture of a woman who has been accused of murder before lunch. Rough day.") },
      { id: 'duane', x: 176, y: 148, face: 'left', show: (g) => !g.flag('finale_pending') || true, talk: (g) => talkDuane(g),
        observe: (g) => g.say('shawn', 'Red eyes. Smoke in his hair. He loved his uncle. Also there\'s a tattoo on his wrist: a pig wearing a crown. Respect.') },
      { id: 'vance', x: 100, y: 156, face: 'right', talk: (g) => talkVance(g), observe: (g) => observeVance(g) },
      { id: 'thorne', x: 252, y: 140, face: 'left', show: (g) => true, talk: (g) => talkThorne(g), observe: (g) => observeThorne(g) },
      { id: 'kenji', x: 520, y: 154, face: 'left', talk: (g) => talkKenji(g),
        observe: (g) => g.say('shawn', 'Camera strap worn on the left side, three memory cards in his pocket, and BBQ sauce on his lens cap. This guy shoots EVERYTHING.') },
      { id: 'odessa', x: 432, y: 126, face: 'left', walk: [432, 140], talk: (g) => talkOdessa(g),
        observe: (g) => g.say('shawn', "Pearls, a church fan, and arms like a woman who has stirred ten thousand gallons of tea. Do not cross Miss Odessa.") },
      { id: 'vick', x: 330, y: 152, face: 'left', show: (g) => g.flag('finale_pending'), talk: (g) => talkVickFair(g) },
    ],
    onEnter: async (g) => {
      if (!g.flag('c2_open')) return openingCutscene(g);
      if (g.flag('finale_pending') && !g.flag('finale_started')) return finale(g);
    },
  };

  /* ---- Big Earl's trailer ---- */
  scenes.trailer = {
    name: "Big Earl's Trailer", width: 320, music: (g) => (g.flag('window_in') && !g.hasItem('trailer_key') ? 'tension' : 'bbq'),
    floor: { x0: 24, x1: 296, y0: 136, y1: 170 },
    bg(x) {
      R.wall(x, 0, 0, 320, 118, '#8a5a3a', { stripes: 10 });
      G.rect(x, 0, 0, 320, 16, '#3a2a1a'); G.hl(x, 0, 16, 320, '#2a1a10');
      R.floor(x, 0, 118, 320, 62, 'planks', '#6a4a2a');
      R.window(x, 26, 40, 30, 22, { frame: '#5a5a6a' });
      // recipe chalkboard
      G.rect(x, 74, 28, 64, 42, '#2a3a2a'); G.frame(x, 74, 28, 64, 42, '#7a4a2a');
      P.font.draw(x, 'SECRET RUB', 106, 32, '#f4f4f8', { align: 'center' });
      for (let i = 0; i < 4; i++) G.rect(x, 80, 44 + i * 6, 50 - i * 7, 3, '#5a6a5a');
      P.font.draw(x, 'DUANE KNOWS', 106, 60, '#fee761', { align: 'center' });
      // photos
      R.frame(x, 150, 30, 16, 14, 'photo'); R.frame(x, 172, 32, 16, 14, 'photo'); R.frame(x, 194, 28, 16, 14, 'photo');
      // trophies
      G.rect(x, 146, 52, 74, 3, '#5a3a2a');
      for (let i = 0; i < 6; i++) { const tx = 150 + i * 12; G.rect(x, tx + 1, 42, 6, 6, '#fec83a'); G.rect(x, tx + 3, 48, 2, 2, '#c89a2a'); G.rect(x, tx + 1, 50, 6, 2, '#5a3a2a'); }
      // desk + papers
      const dt = R.desk(x, 150, 128, 70, '#5a3a2a');
      G.rect(x, 160, dt - 3, 16, 3, '#f8f8f4'); G.rect(x, 162, dt - 5, 14, 2, '#f4f0e8'); G.rect(x, 186, dt - 6, 10, 6, '#3a3a48'); G.rect(x, 202, dt - 2, 10, 2, '#e8e0c8');
      // mini fridge with letter
      G.rect(x, 246, 92, 20, 30, '#e8e8ec'); G.hl(x, 246, 92, 20, '#ffffff'); G.rect(x, 250, 98, 10, 12, '#f8f8f4'); G.hl(x, 251, 101, 8, '#8a8a9a');
      G.rect(x, 282, 64, 26, 56, '#3a2a1a'); G.frame(x, 282, 64, 26, 56, '#1a1410'); G.rect(x, 302, 92, 3, 3, '#fee761');
    },
    props: [{ y: 60, show: (g) => !g.hasItem('tongs') && !g.flag('tongs_given'), draw: (x, cam) => { G.line(x, 232 - cam, 50, 230 - cam, 74, '#c0cbdc', 2); G.line(x, 236 - cam, 50, 238 - cam, 74, '#c0cbdc', 2); G.rect(x, 230 - cam, 48, 8, 4, '#1a1a22'); G.px(x, 233 - cam, 46, '#c0cbdc'); } }],
    hotspots: [
      { id: 'door', name: 'Trailer Door', x: 280, y: 62, w: 30, h: 60, walk: [284, 150], verb: 'Leave by the',
        use: async (g) => {
          if (g.flag('window_in') && !g.hasItem('trailer_key') && !g.flag('trailer_ok')) { await g.say('gus:worried', 'Shawn, McNab is right outside that door!'); await g.say('shawn', 'Right. Out the way we came in. Like gentlemen.'); return; }
          await g.goto('fair', { from: 'trailer' });
        } },
      { id: 'window', name: 'Back Window', x: 22, y: 36, w: 38, h: 30, walk: [44, 150], show: (g) => g.flag('window_in'), verb: 'Climb out the',
        use: async (g) => { g.sfx('step'); await g.goto('fair', { x: 84, y: 140 }); } },
      { id: 'tongs', name: "Earl's Lucky Tongs", x: 226, y: 44, w: 16, h: 34, walk: [234, 140], show: (g) => !g.hasItem('tongs') && !g.flag('tongs_given'),
        use: async (g) => {
          await g.say('shawn', "Earl's lucky tongs. Electrical tape on the handles. Thirty years of championships.");
          await g.item('tongs');
          await g.say('gus', 'Are we stealing a dead man\'s tongs?');
          await g.say('shawn', 'We\'re RETURNING them, Gus. To his nephew. Through a time-delayed method.');
        } },
      { id: 'desk', name: "Earl's Desk", x: 150, y: 96, w: 70, h: 32, walk: [184, 140], clue: (g) => !g.hasClue('sale_contract'),
        look: async (g) => {
          if (await g.clue('sale_contract')) {
            await g.say('shawn', 'Three million dollars from Smokestack Brands for the Big Earl\'s name. Vance signed. Earl didn\'t.');
            await g.say('gus', 'And the partnership agreement says if one partner dies, the other gets everything.');
            await g.say('shawn', "Gus. That's not a contract. That's a motive with a staple in it.");
          } else await g.say('shawn', 'Bills, receipts, and a coffee ring shaped like Texas. Tammy would hate that.');
        } },
      { id: 'board', name: 'Recipe Board', x: 72, y: 26, w: 68, h: 46, walk: [106, 140],
        look: async (g) => { await g.say('shawn', '"SECRET RUB: DUANE KNOWS." Earl trusted his nephew with the most important thing he had.'); await g.say('gus', 'The rub.'); await g.say('shawn', 'The rub, Gus.'); } },
      { id: 'photos', name: 'Photos', x: 148, y: 26, w: 64, h: 22, walk: [180, 140],
        look: async (g) => { await g.say('shawn', "Earl and Duane, Earl and Duane, Earl and Duane holding a pig. Vance isn't in a single photo."); await g.say('gus', 'Maybe he took them.'); await g.say('shawn', 'Or maybe nobody wanted him in them.'); } },
      { id: 'fridge', name: 'Mini Fridge Note', x: 244, y: 90, w: 24, h: 32, walk: [256, 140],
        look: async (g) => { await g.say('shawn', 'A letter from Earl\'s cardiologist: "Heart of a thirty-year-old. No medications needed. Lay off the brisket."'); await g.think("So Earl didn't take digoxin. Somebody gave it to him."); } },
    ],
    onEnter: async (g, o) => {
      if (o.first) {
        if (g.flag('window_in') && !g.hasItem('trailer_key')) { await g.say('gus:worried', 'We are inside a crime scene through a WINDOW, Shawn.'); await g.say('shawn', 'Gus, windows are just doors that believe in themselves.'); }
        else await g.say('shawn', "Big Earl's trailer. Smells like hickory and thirty years of hard work.");
        g.objective('Search the trailer. Duane needs his uncle\'s tongs, and Earl\'s desk might explain a few things.');
      }
    },
  };

  /* ---- livestock barn ---- */
  scenes.barn = {
    name: 'Livestock Barn', width: 320, music: 'bbq',
    floor: { x0: 20, x1: 300, y0: 136, y1: 172 },
    entries: { fair: { x: 30, y: 152, face: 'right' } },
    bg(x) {
      G.rect(x, 0, 0, 320, 118, '#7a3a22'); for (let px = 0; px < 320; px += 8) { G.vl(x, px, 0, 118, '#6a2e1a'); G.vl(x, px + 1, 0, 118, '#8a4a2a'); }
      for (let px = 4; px < 320; px += 40) G.vl(x, px, 0, 118, '#e8c890');
      G.rect(x, 0, 18, 320, 6, '#4a2a1a'); G.rect(x, 0, 60, 320, 4, '#4a2a1a');
      R.floor(x, 0, 118, 320, 62, 'planks', '#8a6a3a');
      G.noise(x, 0, 118, 320, 62, ['#e8c860', '#c8a840'], 0.12, 'barnhay');
      // stalls
      for (let i = 0; i < 4; i++) { const sx = 40 + i * 64; G.rect(x, sx, 84, 56, 34, '#9a6a3a'); for (let k = 0; k < 4; k++) G.hl(x, sx, 88 + k * 8, 56, '#7a4a2a'); G.rect(x, sx, 80, 4, 38, '#6a3a1a'); }
      // pigs
      for (const px of [60, 84]) { G.ellipse(x, px, 98, 9, 6, '#f4a8b8'); G.ellipse(x, px + 8, 96, 4, 3, '#f8b8c8'); G.px(x, px + 11, 96, '#a85a6a'); G.px(x, px + 9, 94, '#1a1424'); }
      // a cow peeking
      G.ellipse(x, 190, 92, 8, 7, '#f4f4f0'); G.ellipse(x, 186, 90, 3, 3, '#1a1a1a'); G.ellipse(x, 190, 98, 5, 3, '#f8c8c8'); G.px(x, 187, 89, '#ffffff');
      R.bale; drawBale(x, 270, 128); drawBale(x, 248, 128); drawBale(x, 258, 116);
      R.door(x, 4, 66, 22, 52, '#5a2a1a');
      R.sign(x, 110, 30, 100, 11, 'GOAT & PIG SHOW', { bg: '#f4f0e8', fg: '#8a2a1a' });
    },
    anim(x, t) {
      const sn = Math.floor(t * 3) % 2;
      for (const px of [60, 84]) G.px(x, px + 12, 97 - sn, '#a85a6a');
      x.save(); x.globalAlpha = 0.1 + Math.sin(t * 0.8) * 0.03;
      for (let px = 4; px < 320; px += 40) G.poly(x, [[px, 0], [px + 2, 0], [px + 40, 180], [px + 30, 180]], '#fff6c0');
      x.restore();
    },
    hotspots: [
      { id: 'out', name: 'Barn Door', x: 0, y: 62, w: 28, h: 60, walk: [24, 152], exit: 'fair', verb: 'Back out the' },
      { id: 'ribbon', name: 'Ribbon on a Post', x: 230, y: 78, w: 14, h: 16, walk: [232, 142], secret: true, show: (g) => !g.hasGift('blueribbon') && !(g.global.giftsGiven || []).includes('blueribbon'),
        look: async (g) => {
          await g.say('shawn', '"2nd Place - Dairy Goat." Gertrude\'s ribbon. She dropped it. Or rejected it. Second place is beneath her.');
          await g.gift('blueribbon');
        } },
      { id: 'pigs', name: 'Pigs', x: 48, y: 86, w: 52, h: 24, walk: [74, 140],
        look: async (g) => { await g.say('gus:worried', 'Shawn, they are looking at me. They KNOW what we ate today.'); await g.say('shawn', 'Make eye contact, Gus. Show them you are not ashamed.'); } },
      { id: 'cow', name: 'Curious Cow', x: 178, y: 82, w: 24, h: 24, walk: [190, 140],
        look: async (g) => { await g.say('shawn', 'That cow has been staring at me for two minutes.'); await g.say('gus', 'She can sense you are a fraud.'); await g.say('shawn', 'She can sense I am FABULOUS, Gus.'); } },
    ],
    actors: [
      { id: 'gertrude', x: 170, y: 152, face: 'left', h: 30, name: 'Gertrude the Goat', draw: drawGoat,
        talk: async (g) => {
          if (g.flag('goat_fed')) { await g.say('Gertrude', 'Mehhh.'); await g.say('shawn', "She says thank you. And that she'd like to speak to a manager."); return; }
          await g.say('Gertrude', 'MEHHHHH.');
          await g.say('shawn', "Gertrude, I need you to give back Miss Odessa's sign. It is not food.");
          await g.say('Gertrude', '*crunch*');
          await g.say('gus', 'She disagrees.');
          g.set('need_goat');
          if (!g.hasItem('granola')) await g.think("She won't let go of that sign for nothing. Maybe a trade. Gus always has a snack...");
          else await g.think('Show her the granola bar.');
        },
        observe: (g) => g.say('shawn', "Gertrude has chewed through: one sign, half a hay bale, and somebody's sandal strap. She is a goat of appetite. She'd trade for something tastier."),
        give: true,
      },
    ],
    onEnter: async (g, o) => { if (o.first) { await g.say('gus', 'It smells like a petting zoo had a petting zoo.'); } },
  };
  // Gertrude takes snacks via "Show evidence..."
  scenes.barn.actors[0].talk = ((orig) => async (g) => {
    await orig(g);
    if (!g.flag('goat_fed') && g.hasItem('granola')) {
      const c = await g.choose([{ text: 'Offer the granola bar', value: 1 }, { text: 'Leave her be', value: 0 }], { cancel: 0 });
      if (c === 1) await feedGoat(g);
    }
  })(scenes.barn.actors[0].talk);
  async function feedGoat(g) {
    g.take('granola');
    await g.say('gus:sad', 'Goodbye, emergency granola bar. You were going to be an emergency.');
    g.sfx('munch');
    g.set('goat_fed');
    await g.say('Gertrude', 'MEH!');
    g.sfx('item');
    await g.item('tea_sign');
    await g.say('shawn', "She dropped it! Gertrude, you are a reasonable goat. I will tell the other goats.");
    g.objective("Return the sign to Miss Odessa at the sweet tea stand.");
  }

  /* --------------------------------------------------------- the opening */
  async function openingCutscene(g) {
    g.set('c2_open');
    g.music('bbq');
    g.place('shawn', 360, 156, 'left'); g.place('gus', 384, 152, 'left');
    g.place('tammy', 300, 152, 'left'); g.anim('tammy', 'stand');
    g.place('thorne', 214, 140, 'right');
    g.place('vance', 150, 152, 'right');
    g.place('earl', 244, 142, 'right');
    const earl = g.actor('earl'); earl.hold = null;
    await g.say('gus:happy', 'Shawn. Eleven kinds of brisket. This is the greatest day of my life.');
    await g.say('shawn', "Gus, you said that at the chili cook-off. And the pie festival. And that one funeral.");
    await g.say('gus', 'The funeral had a very good buffet.');
    // the handoff, in plain sight (watch the other hand!)
    g.walkNoWait('vance', 228, 146);
    await g.wait(900);
    g.face('vance', 'earl');
    g.bubble('vance', "Earl! Get a load of Tammy's hat! It's bigger than Texas!", 2400);
    for (const id of ['earl', 'shawn', 'gus', 'thorne']) g.face(id, 'tammy');
    g.anim('vance', 'point', 1800);
    await g.wait(700);
    earl.hold = 'cup';
    await g.wait(1300);
    await g.say('tammy:angry', 'My hat is EXACTLY as big as Texas, thank you very much.');
    await g.say('earl:happy', 'Ha! Thanks for the tea, Vance. First time you ever bought me anything.');
    await g.say('vance:smug', "Don't get used to it, partner.");
    g.walkNoWait('vance', 140, 156);
    await g.fade(true, 500);
    await g.card({ kicker: 'FORTY-FIVE MINUTES LATER', title: '2:15 PM', sub: "The Champion's Tasting", dur: 2.4 });
    earl.hold = null;
    g.place('tammy', 272, 146, 'left'); g.anim('tammy', 'stand');
    await g.fade(false, 400);
    await g.say('ANNOUNCER', "And now, a Smoke-Off tradition! Defending champion Big Earl Boudreaux tastes his challenger's sauce!");
    await g.say('tammy:smug', "Here you go, Earl. Try not to cry.");
    g.anim('earl', 'eat', 1500);
    await g.wait(1200);
    await g.say('earl', 'Mmm. Tammy, that is a fine sauce. Too much cumin, but a fine...');
    g.anim('earl', 'stagger');
    g.sfx('gasp');
    await g.say('earl:surprised', '...sauce...');
    g.anim('earl', 'kneel'); g.shake(300, 2);
    await g.say('gus:surprised', 'Shawn! Somebody call 9-1-1!');
    g.flash('#ffffff', 300);
    await g.fade(true, 700);
    g.set('c2_crime');
    g.music('tension');
    await g.card({ kicker: 'CASE 2', title: 'RACK OF LIES', sub: 'Two hours later.', dur: 3.4 });
    await g.goto('fair', { x: 380, y: 156, instant: true });
    g.place('tammy', 330, 128, 'left'); g.stopAnim('tammy');
    g.music('bbq');
    await g.say('lassiter:stern', "Tammy Lynn Pruitt is being held pending the tox report. Big Earl tasted her sauce and dropped dead. Open and shut.");
    await g.say('juliet:sad', 'Woody took the body about an hour ago, Shawn. He\'s running the tox now.');
    await g.say('shawn', "Lassie, everyone in Santa Barbara watched him taste that sauce. Which is exactly why I don't trust it.");
    await g.say('lassiter:angry', "Spencer, you're not on this case. You're a spectator with a funnel cake habit.");
    await g.say('gus', 'We have not even had a funnel cake yet.');
    g.objective('Find out what really killed Big Earl. Woody at the coroner\'s office has the tox report.');
  }

  /* ---------------------------------------------------------- conversations */
  async function talkTammy(g) {
    if (g.once('met_tammy')) {
      await g.say('tammy:angry', "Are you more cops? I didn't poison anybody! My sauce has never killed anybody. Except the competition. FIGURATIVELY.");
      await g.introGus('tammy');
      await g.say('tammy', '...Well, bless your heart.');
    }
    if (g.flag('hired') && g.once('tammy_thanks')) {
      g.anim('tammy', 'stand');
      await g.say('tammy:happy', "You! Psychic boy! You got me out of those cuffs. Come here.");
      await g.say('tammy', 'Jalapeno cornbread. On the house. Don\'t you dare say no.');
      await g.snack('cornbread');
      await g.say('tammy', 'And this little hat pin? You give it to that blonde detective. She was the only one who believed me.');
      await g.gift('hatpin');
    }
    await g.topics('tammy', [
      { id: 'what', label: 'What happened at the tasting?', run: async (gg) => {
        await gg.say('tammy', "Earl tasted my sauce, said 'too much cumin', which, rude, and then he just... dropped.");
        await gg.say('tammy:angry', 'And that Lassiter fella had me in cuffs before Earl hit the ground.');
        await gg.clue('tasting');
      } },
      { id: 'threat', label: 'Did you threaten Earl?', run: async (gg) => {
        await gg.say('tammy', "I said I'd KILL him... on the scoreboard! It's an expression! It's trash talk! It's BARBECUE!");
        await gg.clue('tammy_threat');
      } },
      { id: 'vance', label: 'What do you know about Vance?', run: async (gg) => {
        await gg.say('tammy', "Earl's partner? Slick as a greased pig. Been trying to sell Big Earl's to some chain for a year. Earl told him over his dead body.");
        await gg.say('shawn', 'Interesting choice of words.');
      } },
      { id: 'hat', label: 'Nice hat.', run: async (gg) => {
        await gg.say('tammy:smug', "Thank you, sugar. Everybody was looking at it today. EVERYBODY.");
        await gg.think('Everybody was looking at the hat. Huh.');
      } },
    ], { title: 'Tammy' });
  }
  async function talkDuane(g) {
    if (g.once('met_duane')) {
      await g.say('duane:sad', "Hey. Sorry. I'm... not great right now.");
      await g.introGus('duane');
      await g.say('duane', "...Uncle Earl would've liked you guys. He liked weirdos.");
    }
    await g.topics('duane', [
      { id: 'sorry', label: "I'm sorry about your uncle.", run: async (gg) => {
        await gg.say('duane:sad', 'He taught me everything. How to trim a brisket, how to build a fire, how to never trust a man in loafers.');
        await gg.say('gus', 'Vance wears loafers.');
        await gg.say('duane', 'Yeah. Vance wears loafers.');
      } },
      { id: 'recipe', label: 'Who gets the business now?', run: async (gg) => {
        await gg.say('duane', "The recipe? Me. Uncle Earl made sure. But the business, the name, the restaurant... that's in the partnership agreement. Vance's lawyers wrote it.");
      } },
      { id: 'cook', label: "Could you make Earl's burnt ends?", when: (gg) => !gg.flag('tongs_given'), run: async (gg) => {
        await gg.say('duane', "Not without Uncle Earl's lucky tongs. Thirty years, he never cooked without 'em. They're in his trailer.");
        await gg.say('duane', "But the cops locked it, and Vance has the only key. He won't give it to me. Says it's 'company property.'");
        gg.set('need_tongs');
        gg.objective("Get Earl's lucky tongs from the locked trailer. Vance has the key... or is there another way in?");
      } },
    ], { title: 'Duane', onPresent: async (gg, id) => {
      if (id === 'tongs') { await duaneCooks(gg); return true; }
      return false;
    } });
  }
  async function duaneCooks(g) {
    g.take('tongs'); g.set('tongs_given');
    await g.say('duane:surprised', "Uncle Earl's tongs! How did you— you know what, I don't want to know.");
    await g.say('duane:happy', "Give me ten minutes. I'm making his burnt ends. For him.");
    await g.fade(true, 400);
    g.sfx('drumroll');
    await g.wait(600);
    await g.fade(false, 400);
    await g.say('duane', "Here. One plate for you two. And one plate for... whoever you're getting it for. I saw you eyeing the blogger.");
    await g.snack('burntends');
    await g.say('gus:happy', 'Shawn. SHAWN. Fourteen hours of smoke. I can taste the patience.');
    await g.item('burntends_plate');
    g.objective('Bring the burnt ends to Kenji the food blogger.');
  }
  async function talkVance(g) {
    if (g.once('met_vance')) {
      await g.say('vance:smug', "Vance Holloway. Earl's partner. Tragic day. Truly. Can I help you gentlemen?");
      await g.introGus('vance');
      await g.say('vance:smug', 'Cute. Anyway. Grieving.');
    }
    await g.topics('vance', [
      { id: 'earl', label: 'Tell me about Earl.', run: async (gg) => {
        await gg.say('vance', "Earl was like a brother to me. A brother who said no to every good business decision I ever brought him. But a brother.");
      } },
      { id: 'key', label: 'Can we get the trailer key?', when: (gg) => !gg.hasItem('trailer_key'), run: async (gg) => {
        await gg.say('vance:smug', "To Earl's trailer? Company property, I'm afraid. Unless you've got a warrant, Mr. Psychic.");
        await gg.think("He's not going to hand it over to us. Maybe to an actual detective...");
      } },
      { id: 'tea', label: "You bought Earl's sweet tea?", when: (gg) => gg.hasClue('vance_bought_tea'), run: async (gg) => {
        await gg.say('vance:worried', "I... it was a nice gesture. A partner can't do a nice gesture?");
        await gg.say('shawn', 'You never bought him so much as a toothpick.');
        await gg.say('vance:angry', "I'm a generous guy! I'm generous NOW.");
      } },
      { id: 'sale', label: 'About Smokestack Brands...', when: (gg) => gg.hasClue('sale_contract'), run: async (gg) => {
        await gg.say('vance:worried', "That's... a healthy business disagreement. Earl and I were negotiating.");
        await gg.say('gus', 'Earl said "over my dead body."');
        await gg.say('vance', '...Figure of speech.');
      } },
    ], { title: 'Vance' });
  }
  async function observeVance(g) {
    if (await g.clue('vance_cuff')) {
      await g.think("White powder on his left cuff. He's right-handed. So what was his left hand doing today?");
    } else await g.say('shawn', 'Same cuff. Same powder. Same aftershave that smells like a timeshare presentation.');
  }
  async function talkThorne(g) {
    if (g.once('met_thorne')) {
      await g.say('thorne:stern', 'Reginald Thorne. Santa Barbara Gazette, food section. I suppose you want my opinion. Everyone does.');
      await g.introGus('thorne');
      await g.say('thorne:stern', 'Charming. Derivative, but charming.');
    }
    await g.topics('thorne', [
      { id: 'sauce', label: "How was Tammy's sauce?", run: async (gg) => {
        await gg.say('thorne', 'Adequate. Too much cumin. Not lethal, merely disappointing.');
      } },
      { id: 'heart', label: 'Do you have a heart condition?', when: (gg) => gg.flag('thorne_obs') || gg.hasClue('digoxin_timing'), run: async (gg) => {
        await gg.say('thorne:angry', 'How DARE— yes. Atrial fibrillation. I take digoxin for it. Why?');
        await gg.say('gus', 'Digoxin. Shawn, that is a cardiac glycoside. I rep it. Bitter as sin.');
        await gg.say('thorne:surprised', 'Wait... my bottle. There were twenty pills this morning. Twenty! There are... three.');
        if (await gg.clue('thorne_pills')) {
          await gg.say('thorne:worried', "My jacket hung on the judges' coat rack all afternoon. Anyone could have... oh, no. Oh, I see how this looks.");
          gg.objective("Somebody took Thorne's pills from his jacket. Who got near Earl's sweet tea? Ask around.");
        }
      } },
      { id: 'vance', label: 'Did you see anyone near the coat rack?', when: (gg) => gg.hasClue('thorne_pills'), run: async (gg) => {
        await gg.say('thorne', 'I was JUDGING, young man. Forty-one plates of brisket. I saw nothing but brisket. I may never see anything but brisket again.');
      } },
    ], { title: 'Thorne' });
  }
  async function observeThorne(g) {
    g.set('thorne_obs');
    await g.zoom({ at: 'thorne', icon: 'pill', title: 'Breast Pocket', text: 'A prescription bottle in his vest pocket. When he moves, it barely rattles. Hands with a faint tremor. Heart trouble?' });
    await g.think("A man with a heart prescription, at a poisoning. I should ask him about his heart.");
  }
  async function talkKenji(g) {
    if (g.once('met_kenji')) {
      await g.say('kenji', "Yo! Kenji Watanabe, 'Kenji Eats SB'. Four thousand followers. Okay, eleven hundred. Okay, my mom and eleven hundred bots.");
      await g.introGus('kenji');
      await g.say('kenji:happy', "Ha! That's going in my story.");
    }
    await g.topics('kenji', [
      { id: 'photos', label: 'Were you taking pictures today?', run: async (gg) => {
        await gg.say('kenji', 'All day, every plate, every pitmaster. Big Earl, Tammy, the judges, the coat rack, the hats. Content is content.');
        await gg.think('He was photographing everything. Including whatever everyone else missed.');
      } },
      { id: 'share', label: 'Can we see your photos?', when: (gg) => !gg.flag('kenji_photos'), run: async (gg) => {
        await gg.say('kenji', "Exclusive content isn't free, dude. I'm not handing it to the cops for nothing either.");
        await gg.say('kenji:happy', "You know what WOULD go viral? Big Earl's legendary burnt ends. Last batch ever. Get me a plate and the photos are yours.");
        gg.set('need_burntends');
        if (!gg.flag('tongs_given')) gg.objective("Kenji wants Big Earl's burnt ends. Only Duane can make them. Talk to Duane.");
      } },
    ], { title: 'Kenji', onPresent: async (gg, id) => {
      if (id === 'burntends_plate') { await kenjiPhotos(gg); return true; }
      return false;
    } });
  }
  async function kenjiPhotos(g) {
    g.take('burntends_plate'); g.set('kenji_photos');
    await g.say('kenji:happy', 'Big Earl\'s burnt ends. Oh, that bark. That smoke ring. Hold on, I need the light.');
    g.sfx('flash'); g.flash('#ffffff', 150); await g.wait(300); g.sfx('flash'); g.flash('#ffffff', 150);
    await g.say('kenji', 'Okay. A deal\'s a deal. Here\'s everything from the judges\' area.');
    await g.clue('photo_tent');
    await g.say('shawn', "Twelve fifty-two. Vance. With his hand in a tweed jacket on the judges' coat rack.");
    await g.say('gus', "That's Thorne's jacket. With Thorne's pills in it.");
    await g.clue('photo_tea');
    await g.say('kenji', "That one's my favorite. Look at Tammy's hat! Everyone's looking at the hat.");
    await g.say('shawn', "Everyone's looking at the hat... except Vance's left hand. Which is handing Earl his tea.");
    g.flashback(true);
    await g.say('younghenry', "Everybody watches the hand that's waving, Shawn. Watch the OTHER hand.", { name: 'Henry (1989)' });
    g.flashback(false);
    g.sfx('flash');
    await g.say('shawn', 'Gus. Where would you get rid of a mason jar at a barbecue?');
    await g.say('gus', 'Shawn, everyone recycles at a barbecue. It is a very conscientious community.');
    g.objective(g.hasClue('mason_jar') ? "You have everything. Tell Chief Vick the spirits want to meet at the fairgrounds." : "Find Earl's mason jar. Maybe Vance dumped it nearby.");
  }
  async function talkOdessa(g) {
    if (g.once('met_odessa')) {
      await g.say('odessa', "Afternoon, boys. You want to talk, you can talk. But I'm not open.");
      await g.introGus('odessa');
      await g.say('odessa', "Mm-hm. I knew a man named that. He owed me money.");
    }
    if (g.hasItem('tea_sign') && !g.flag('sign_returned')) await returnSign(g);
    if (!g.flag('sign_returned')) {
      await g.topics('odessa', [
        { id: 'closed', label: 'Why are you closed?', run: async (gg) => {
          await gg.say('odessa', "Because that devil goat Gertrude walked off with my sign! No sign, no customers. Folks think I'm just a lady standing behind a counter.");
          await gg.say('odessa', "You get my sign back from that goat, sugar, and I'll tell you anything you want to know. I see EVERYTHING from this stand.");
          gg.set('need_sign');
          gg.objective("Get Miss Odessa's sign back from Gertrude the goat in the livestock barn.");
        } },
        { id: 'earl', label: 'Did you know Big Earl?', run: async (gg) => { await gg.say('odessa:sad', 'Twenty years I poured that man\'s tea. Extra sweet. In his big ol\' mason jar. Lord rest him.'); } },
      ], { title: 'Miss Odessa', onPresent: async (gg, id) => { if (id === 'tea_sign') { await returnSign(gg); return true; } return false; } });
      return;
    }
    await g.topics('odessa', [
      { id: 'tea', label: 'Did Earl get tea from you today?', run: async (gg) => {
        await gg.say('odessa', "Every day of his life. Extra sweet, in that big ol' mason jar with his name on the bottom.");
        await gg.say('odessa', "But today? Vance came and bought it for him. One-thirty on the dot. Carried it over himself.");
        await gg.say('odessa:angry', "Twenty years, that man never bought Earl so much as a toothpick.");
        if (await gg.clue('vance_bought_tea')) gg.objective(gg.hasClue('photo_tea') ? 'Track down that mason jar.' : "Vance carried Earl's tea. Can anyone prove what he did with it? Kenji photographed everything.");
      } },
      { id: 'drink', label: 'Could we get a sweet tea?', run: async (gg) => {
        if (gg.s.snacks.includes('sweettea')) { await gg.say('odessa', 'You had one. Your friend is vibrating.'); await gg.say('gus', 'I can hear colors, Shawn.'); return; }
        await gg.say('odessa', "On the house. You brought my sign home.");
        await gg.snack('sweettea');
        await gg.say('gus:surprised', "Shawn... I can feel my teeth. All of them. Individually.");
      } },
    ], { title: 'Miss Odessa' });
  }
  async function returnSign(g) {
    g.take('tea_sign'); g.set('sign_returned');
    if (g.scene && g.scene.renderBg) { g.scene.bg = null; g.scene.renderBg(); }
    await g.say('odessa:happy', "My sign! Bless you, boys. Slobbered on, but it'll do.");
    await g.say('odessa', "And this is for your sweetheart. Peach jam. Not for YOU. I'll know.");
    await g.gift('jam');
    await g.say('shawn', 'Miss Odessa, what makes you think I have a sweetheart?');
    await g.say('odessa:smug', "Sugar, it's all over your face. It's like a billboard.");
  }
  async function talkVickFair(g) {
    if (g.flag('finale_pending') && !g.flag('finale_done')) {
      const c = await g.ask('vick:stern', 'Ready to try again, Mr. Spencer?', [{ text: "Ready, Chief.", value: 1 }, { text: 'One more minute.', value: 0 }]);
      if (c === 1) await runFinale(g);
    }
  }

  /* ------------------------------------------------------------ the finale */
  async function finale(g) {
    g.set('finale_started');
    g.music('finale');
    await g.stage({
      shawn: [300, 158, 'right'], gus: [272, 152, 'right'], vick: [344, 150, 'left'], lassiter: [228, 150, 'right'], juliet: [362, 158, 'left'],
      vance: [212, 158, 'right'], thorne: [252, 140, 'right'], tammy: [330, 138, 'left'], duane: [190, 148, 'right'], kenji: [384, 150, 'left'], mcnab: [150, 150, 'right'],
    });
    g.anim('tammy', 'stand');
    await g.say('vick', 'All right, Mr. Spencer. Under the string lights, as requested. Everyone is here.');
    await g.say('vance:smug', "Is this really necessary? I have investors flying in tomorrow.");
    await g.say('shawn', 'Investors, Vance? On the day your partner died? The spirits find that... tacky.');
    await runFinale(g);
  }
  async function runFinale(g) {
    const ok = await g.revelation('finale');
    if (!ok) { g.objective('Talk to Chief Vick at the fairgrounds when you are ready to try again.'); return; }
    await g.say('vance:angry', "This is ridiculous! I'm leaving. My lawyers will—");
    g.walkNoWait('vance', 40, 156, { run: true });
    await g.wait(300);
    await g.say('tammy:angry', "Oh no you don't, sugar.");
    g.anim('tammy', 'wave', 1200); g.sfx('boing');
    await g.wait(600);
    g.sfx('hit'); g.shake(350, 3);
    const v = g.actor('vance'); if (v) { v.stop(); }
    g.anim('vance', 'kneel', 5000);
    await g.say('tammy:smug', "Lassoed him with a string of patio lights. Nine years of rodeo, boys.");
    await g.walk('lassiter', 70, 154, { run: true });
    await g.say('lassiter:smug', "Vance Holloway, you are under arrest for the murder of Earl Boudreaux.");
    await g.say('vance:sad', "It was three million dollars! He wanted to keep SMOKING MEAT!");
    await g.say('lassiter', 'Tell it to the judge.');
    await g.say('thorne:stern', "I'm a judge.");
    await g.say('lassiter:angry', 'Why does that keep HAPPENING?');
    await g.say('duane', "Uncle Earl's would've wanted everybody to eat. Burnt ends for the whole fair. On the house.");
    await g.say('gus:surprised', 'The WHOLE fair?');
    await g.say('kenji:happy', 'This is going SO viral.');
    const r = g.global.romance || 0;
    await g.approach('juliet', 'shawn', 22);
    if (r >= 4) {
      await g.say('juliet:happy', 'So. The other hand, huh? Where did you learn that?');
      await g.say('shawn', 'My dad. A magician. Ice cream was involved.');
      await g.say('juliet:flirty', "Well, Shawn Spencer, I'm watching BOTH your hands. Ferris wheel?");
      g.emote('juliet', 'heart', 1500); g.sfx('heart');
      await g.say('gus', "I'll just... go eat eleven pounds of brisket. Alone. Happily.");
      g.set('jules_ferris');
    } else {
      await g.say('juliet:smile', 'Good work, Shawn. Really. Tammy owes you one.');
      await g.say('shawn', 'Jules, the Ferris wheel is still running...');
      await g.say('juliet', "And my paperwork is still waiting. Raincheck, psychic.");
      await g.say('gus', 'A raincheck is basically a yes. Statistically.');
    }
    g.set('finale_done');
    await g.fade(true, 600);
    await g.card({ kicker: 'THE NEXT MORNING', title: 'PSYCH HQ', sub: 'Leftovers.', dur: 2.4 });
    await g.goto('office', { x: 200, y: 152 });
    await g.say('gus', 'Shawn. Eleven containers of burnt ends. Our fridge has never been this happy.');
    g.sfx('phone'); await g.wait(1000); g.sfx('pickup');
    await g.say('henry', 'Heard you watched the other hand.', { phone: true });
    await g.say('shawn', 'Dad! Did you see the news? Was that pride in your voice?', { phone: true });
    await g.say('henry:smug', "It was indigestion. Bring me some of that brisket.", { phone: true });
    await g.say('shawn', 'Love you too, Dad.', { phone: true });
    await g.complete();
  }

  /* ---------------------------------------------------------- revelations */
  const revelations = {
    hired: {
      requires: ['sauce_clean', 'digoxin_timing', 'sweet_tea_stomach'],
      audience: ['vick', 'lassiter', 'juliet', 'gus'],
      intro: async (g) => {
        await g.stage({ shawn: [250, 158, 'right'], gus: [222, 150, 'right'], vick: [300, 146, 'left'], lassiter: [190, 148, 'right'], juliet: [282, 162, 'left'] });
        await g.say('lassiter:smug', "Chief, Pruitt threatened the victim and fed him the last thing he ever ate. She's going down for it.");
        await g.say('shawn:psychic', 'Lassie, Lassie, Lassie. I hear... a voice. A big voice. Smoky. Slightly Cajun...');
        await g.say('vick:stern', 'Mr. Spencer, if this is Big Earl, he gets thirty seconds.');
      },
      steps: [
        {
          prompt: "Lassiter says Tammy's sauce killed Earl. What proves the sauce was harmless?",
          answer: 'sauce_clean',
          guesses: ['SAUCE... BOSS! THE SAUCE BOSS!', 'AWESOME SAUCE! WITH A SIDE OF...', 'SAUCE... CLEAN... SQUEAKY CLEAN!'],
          final: 'THE SAUCE WAS CLEAN!', pointAt: 'lassiter',
          after: async (g) => { await g.say('juliet', "Woody's lab confirms it, Carlton. The sauce sample was clean."); await g.say('lassiter:stern', "Then she slipped it in something else."); },
          wrong: { tammy_threat: async (g) => { await g.say('shawn:worried', "The spirits are saying... she DID threaten him. Wait, that's the opposite of helpful. Spirits, whose side are you on?"); } },
          hint: 'Shawn, what did Woody say about the sauce sample?',
        },
        {
          prompt: 'Earl collapsed seconds after the tasting. So when was he really poisoned?',
          answer: 'digoxin_timing',
          guesses: ['I SEE A CLOCK! A CUCKOO! COCOA PUFFS!', 'AN HOUR... AN HOURGLASS! A SAND... WICH?', 'FORTY... FORTY-FIVE...'],
          final: 'FORTY-FIVE MINUTES BEFORE!', pointAt: 'vick',
          after: async (g) => { await g.say('vick', "Digoxin takes time to work. Whatever killed him, he swallowed it long before he tasted that sauce."); },
        },
        {
          prompt: 'What did Earl swallow back then?',
          answer: 'sweet_tea_stomach',
          guesses: ['SWEET... A SWEDE! A SWEDISH CHEF!', 'T! T-REX! T-BONE! MR. T!'],
          final: 'HIS SWEET TEA!', pointAt: 'juliet',
          after: async (g) => { await g.say('juliet', 'Sweet enough to hide something bitter.'); await g.say('lassiter:angry', '...I hate it when he does that.'); },
        },
      ],
      outro: async (g) => {
        await g.say('vick', "Detective, release Ms. Pruitt. Mr. Spencer, Mr. Guster: you're hired. Find out who poisoned that tea.");
        await g.say('shawn:happy', 'Chief, can our consulting fee be paid in brisket?');
        await g.say('vick:stern', 'No.');
        await g.say('gus', 'Can it be partially paid in brisket?');
        await g.say('vick:stern', 'Mr. Guster.');
        g.set('hired');
        g.objective("You're hired! Who had digoxin? Who touched Earl's tea? Back to the fairgrounds.");
      },
    },
    finale: {
      requires: ['thorne_pills', 'photo_tent', 'photo_tea', 'sale_contract', 'mason_jar'],
      audience: ['vick', 'lassiter', 'juliet', 'gus', 'vance', 'thorne', 'tammy', 'duane', 'kenji'],
      intro: async (g) => { await g.say('shawn:psychic', "The spirits are here. They smell like hickory. And they're hungry. Mostly they're hungry."); },
      steps: [
        {
          prompt: 'Earl was poisoned with digoxin. Where did the pills come from?',
          answer: 'thorne_pills',
          guesses: ['A THORN! A ROSE! A ROSE BOWL!', 'THORNE... THORNE-BIRDS! THE THORNE-BIRDS!'],
          final: "JUDGE THORNE'S HEART PILLS!", pointAt: 'thorne',
          after: async (g) => { await g.say('thorne:surprised', 'I never! I was judging! Forty-one plates of brisket!'); await g.say('lassiter:smug', 'The critic. I always knew critics were dangerous.'); },
        },
        {
          prompt: "Thorne's jacket hung on the coat rack all day. Who was caught going through it?",
          answer: 'photo_tent',
          guesses: ['VAN! A VAN! A MINIVAN!', 'VAN... VANILLA! VANILLA ICE!', 'VAN... VANCE...'],
          final: 'VANCE HOLLOWAY!', pointAt: 'vance', gusJoins: true,
          after: async (g) => { await g.say('vance:angry', 'I was looking for... a mint! Thorne always has mints!'); await g.say('thorne:angry', 'I have NEVER carried a mint in my LIFE.'); },
          wrong: { vance_cuff: async (g) => { await g.say('shawn:worried', "The powder is a good start, but the spirits want a picture. They're very visual."); } },
        },
        {
          prompt: 'Everyone was watching the sauce. How did Vance get the pills into Earl?',
          answer: ['photo_tea', 'vance_bought_tea'],
          guesses: ['EVERYBODY WATCH THE HAT! THE HAT! THE HAAAT!', 'NO! WATCH THE OTHER HAND! THE OTHER... HANDBAG?'],
          final: 'IN HIS SWEET TEA!', pointAt: 'vance',
          after: async (g) => { await g.say('tammy:surprised', "He used my HAT? He used my hat as a DISTRACTION?"); await g.say('kenji', 'It is a really distracting hat.'); },
        },
        {
          prompt: 'Why would Vance kill his own partner?',
          answer: 'sale_contract',
          guesses: ['SMOKESTACK! A SMOKE SIGNAL! SMOKEY THE BEAR!', 'THREE! THREE AMIGOS! THREE MUSKETEERS!'],
          final: 'THREE MILLION DOLLARS!', pointAt: 'vance',
          after: async (g) => { await g.say('duane:angry', "Uncle Earl said no, so you... for a CHAIN?"); },
        },
        {
          prompt: "Vance says it's all circumstantial. Where's the proof?",
          answer: 'mason_jar',
          guesses: ['A JAR! A JAR JAR! NO! NOT JAR JAR!', 'RECYCLE! RE... BICYCLE! A TANDEM BICYCLE!'],
          final: 'THE JAR IN THE RECYCLING!', pointAt: 'vance',
          after: async (g) => { await g.say('juliet', "With digoxin residue under the rim, and Earl's name on the bottom."); await g.say('lassiter:surprised', '...Huh.'); },
        },
      ],
      fail: async (g) => { await g.say('vick:stern', 'Mr. Spencer. Regroup. Find me when the spirits have their story straight.'); },
    },
  };

  /* ----------------------------------------------------------------- hints */
  const hints = [
    { id: 'h_woody', when: (g) => !g.hasClue('digoxin_timing'), vague: 'A body tells you everything if you ask the right man.', specific: ["Go see Woody at the coroner's office. He'll want a 'reading'. So read him. Use your eyes first.", 'Look at his coat. Look at his pockets. Then tell him what he wants to hear.'] },
    { id: 'h_vick', when: (g) => !g.flag('hired'), vague: "You've got the science. Now go get the badge to listen.", specific: "Go to the station. Tell Karen about the sauce, the timing, and the tea." },
    { id: 'h_thorne', when: (g) => !g.hasClue('thorne_pills'), vague: "Digoxin's a prescription. Who at that fair has a bad heart?", specific: 'The snooty judge. Look at him closely, then ask him about his heart.' },
    { id: 'h_odessa', when: (g) => !g.hasClue('vance_bought_tea'), vague: 'The tea lady knows who poured what for whom. But she says she\'s closed.', specific: ["Her sign is in the barn. With a goat. Goats like snacks.", 'Gus always has an emergency granola bar. Ask him.'] },
    { id: 'h_tongs', when: (g) => !g.flag('tongs_given'), vague: "The nephew can't cook without his uncle's tongs.", specific: ["They're in the trailer. Get Detective O'Hara to sweet-talk the key out of the partner,", 'or push that hay bale under the cracked back window and climb in.'] },
    { id: 'h_kenji', when: (g) => !g.hasClue('photo_tent'), vague: 'That blogger photographed everything. Every hat, every hand.', specific: 'Bring him the burnt ends Duane made. Show him the plate.' },
    { id: 'h_contract', when: (g) => !g.hasClue('sale_contract'), vague: 'Motive, Shawn. Partners fight about money.', specific: "Look at the papers on Earl's desk in the trailer." },
    { id: 'h_jar', when: (g) => !g.hasClue('mason_jar'), vague: 'If you poisoned a jar of tea, what would you do with the jar?', specific: 'Check the recycling bin by the sweet tea stand.' },
    { id: 'h_final', when: (g) => !g.flag('finale_done'), vague: "You've got it. Go close it.", specific: 'Tell Karen the spirits want everyone at the fairgrounds.' },
  ];

  /* ---------------------------------------------- recurring cast, this case */
  const toxDone = (g) => g.hasAll(['sauce_clean', 'digoxin_timing', 'sweet_tea_stomach']);
  const finaleReady = (g) => g.hasAll(['thorne_pills', 'photo_tent', 'photo_tea', 'sale_contract', 'mason_jar']);
  const topics = {
    vick: [
      { id: 'c2_case', label: 'About Big Earl...', run: async (g) => {
        if (!g.flag('hired')) await g.say('vick', 'Detective Lassiter believes Ms. Pruitt poisoned him. Unless the tox report says otherwise, Mr. Spencer, so do I.');
        else await g.say('vick', 'Find me who poisoned that tea, Mr. Spencer.');
      } },
      { id: 'c2_vision1', label: "Chief, I'm having a vision!", keep: true, when: (g) => !g.flag('hired') && toxDone(g), run: async (g) => { await g.revelation('hired'); return 'exit'; } },
      { id: 'c2_vision_early', label: "Chief, I'm having a vision!", keep: true, when: (g) => !g.flag('hired') && !toxDone(g), run: async (g) => {
        await g.say('shawn:psychic', "I'm seeing... a brisket... a beautiful brisket...");
        await g.say('vick:stern', "Mr. Spencer, unless the brisket tells you what's in the tox report, go away.");
        await g.think('The tox report. Woody has it.');
      } },
      { id: 'c2_finale', label: 'The spirits want to meet at the fairgrounds.', keep: true, when: (g) => g.flag('hired') && !g.flag('finale_done') && finaleReady(g), run: async (g) => {
        await g.say('shawn:psychic', 'Chief. Tonight. The fairgrounds. Under the string lights. Bring everybody. Especially Vance Holloway.');
        await g.say('vick:stern', "...Fine. But if this is a ploy to get the department to buy you brisket...");
        await g.say('gus', 'It is not. Mostly not.');
        g.set('finale_pending');
        await g.goto('fair', { x: 300, y: 158 });
        return 'exit';
      } },
      { id: 'c2_notready', label: 'The spirits want to meet at the fairgrounds.', keep: true, when: (g) => g.flag('hired') && !g.flag('finale_done') && !finaleReady(g), run: async (g) => {
        await g.say('vick:stern', 'With what, Mr. Spencer? Bring me the source of the poison, how it got into the tea, who did it, why, and proof.');
      } },
    ],
    juliet: (g) => [
      { id: 'c2_what', label: 'What happened, Jules?', run: async (gg) => {
        await gg.say('juliet', 'Big Earl collapsed at 2:15, seconds after tasting Tammy Pruitt\'s sauce at the judges\' table. Paramedics couldn\'t revive him.');
        await gg.clue('tasting');
      } },
      { id: 'c2_key', label: 'Could you get the trailer key from Vance?', when: (gg) => gg.flag('hired') && gg.flag('need_tongs') && !gg.hasItem('trailer_key') && !gg.flag('tongs_given'), run: async (gg) => {
        await gg.say('juliet', "Vance? He's been weirdly protective of that trailer. Hang on.");
        await gg.fade(true, 300); await gg.wait(400); await gg.fade(false, 300);
        await gg.say('juliet:smug', 'I asked nicely. Then I asked like a detective. Here.');
        await gg.item('trailer_key');
        gg.set('trailer_ok');
        await gg.say('shawn', 'Jules, have I ever told you that you are the best detective in Santa Barbara?');
        await gg.say('juliet', "Every time I do something for you, Shawn.");
      } },
      { id: 'c2_lead', label: 'Any leads?', when: (gg) => gg.flag('hired'), run: async (gg) => {
        if (!gg.hasClue('thorne_pills')) await gg.say('juliet', "Digoxin's a prescription drug. We're checking who at the fair has one.");
        else if (!gg.hasClue('photo_tent')) await gg.say('juliet', "That food blogger, Kenji, won't hand over his memory cards without a warrant. He keeps talking about burnt ends.");
        else await gg.say('juliet', "Honestly, Shawn? I think you're about to have one of your visions.");
      } },
    ],
    lassiter: [
      { id: 'c2_case', label: 'Still like Tammy for it?', run: async (g) => {
        if (!g.flag('hired')) { await g.say('lassiter', 'Public threat. Last thing he ate. She doesn\'t like the victim. That\'s motive, means, and opportunity, Spencer.'); await g.clue('tammy_threat'); }
        else await g.say('lassiter:stern', "Fine. Not the sauce. Doesn't mean she's clean. Nobody's clean, Spencer. Especially you.");
      } },
    ],
    woody: [
      { id: 'c2_tox', label: 'What killed Big Earl?', when: (g) => !g.flag('tox_done'), keep: true, run: async (g) => { await woodyReading(g); } },
      { id: 'c2_tox_again', label: 'Run the tox results by me again.', when: (g) => g.flag('tox_done'), run: async (g) => {
        await g.say('woody', 'Digoxin, Shawn! Heart medicine, enough to drop a horse. Swallowed with a gallon of sweet tea forty-five minutes before he died. The sauce was clean!');
      } },
    ],
    gus: [
      { id: 'c2_granola', label: 'Gus, give me your granola bar.', when: (g) => g.flag('need_goat') && !g.hasItem('granola') && !g.flag('goat_fed'), run: async (g) => {
        await g.say('gus:stern', "That's my emergency granola bar.");
        await g.say('shawn', "It's for a goat, Gus.");
        await g.say('gus', 'Is the goat having an emergency?');
        await g.say('shawn', 'The goat IS the emergency.');
        await g.say('gus:sad', '...Fine.');
        await g.item('granola');
      } },
      { id: 'c2_dig', label: "What's digoxin, Gus?", when: (g) => g.hasClue('digoxin_timing'), run: async (g) => {
        await g.say('gus', 'Cardiac glycoside, Shawn. From the foxglove plant. Treats atrial fibrillation. I rep the generic.');
        await g.say('gus', "It's bitter. You'd want to hide it in something strong and very, very sweet.");
        await g.say('shawn', 'Gus, sometimes I forget you know things.');
      } },
    ],
    henry: [
      { id: 'c2_hand', label: 'Dad, remember Marvin the magician?', run: async (g) => {
        await g.say('henry', 'The cup guy on State Street? He took me for twenty bucks before I figured him out.');
        await g.say('henry:smug', "Waving hand gets the attention. Other hand does the work. Every time.");
      } },
    ],
  };

  async function woodyReading(g) {
    if (g.once('woody_ask')) {
      await g.say('woody', "Shawn! Gus! Are you here about Big Earl? I'm not supposed to share results with civilians...");
      await g.say('woody:happy', "...unless! You're psychic! Do me! Give me a reading! Three things you couldn't possibly know about me, and I'll tell you anything!");
      await g.say('gus', 'Shawn, maybe LOOK at him first.');
    }
    const go = await g.choose([{ text: 'Give Woody a reading', value: 1 }, { text: 'Not yet (look first)', value: 0 }], { cancel: 0 });
    if (!go) return;
    await g.say('shawn:psychic', 'Woody... the spirits are showing me your home. Your... companion...');
    const a1 = await g.choose(['...a large orange cat.', '...a ferret named Stan.', '...a gentleman friend named Gary.', '...a haunted doll.'], { title: 'Woody shares his home with...' });
    await g.say('shawn:psychic', 'And recently... you went dancing. I hear... music...');
    const a2 = await g.choose(['...accordions! Polka!', '...bongos! Salsa!', '...violins! A waltz!', '...nothing. A silent disco.'], { title: 'Woody went dancing to...' });
    await g.say('shawn:psychic', 'And you carry a small friend... for luck...');
    const a3 = await g.choose(['...a rabbit\'s foot.', '...a plastic stegosaurus.', '...a lucky penny.', '...a tiny bottle of formaldehyde.'], { title: 'Woody\'s lucky charm is...' });
    const score = (a1 === 0) + (a2 === 0) + (a3 === 1);
    if (score === 3) {
      await g.say('woody:surprised', 'Professor Whiskers! The Danish Polka Festival! Steggy! HOW?!');
      await g.say('shawn', "Woody, you have orange cat hair on your sleeve, a polka ticket stub in your pocket, and a stegosaurus poking out of your lab coat.");
      await g.say('woody:happy', "...That's what a psychic WOULD say!");
      await g.say('woody', "Okay! Big Earl. Cause of death: digoxin. A heart medication. Enough to drop a horse. A small horse. A pony.");
      await g.say('woody', "Digoxin takes thirty to sixty minutes to work. So he swallowed it well before that tasting.");
      await g.clue('digoxin_timing');
      await g.say('woody', "Stomach contents: mostly sweet tea. A LOT of sweet tea. Forty-five minutes before death, give or take.");
      await g.clue('sweet_tea_stomach');
      await g.say('woody:happy', "And the sauce sample from Ms. Pruitt? Clean as a whistle! Also delicious. I had a little. For science.");
      await g.clue('sauce_clean');
      await g.say('gus', 'Woody, please tell me you did not eat evidence.');
      await g.say('woody', 'A LITTLE evidence.');
      g.set('tox_done');
      g.objective("The sauce didn't kill Earl. Go to SBPD and have a vision for Chief Vick.");
    } else {
      await g.say('woody:sad', score === 2 ? "Two out of three? Shawn, even my horoscope gets three out of three." : "Hmm. No. That's not how psychic works. I've seen TV.");
      await g.think("I was guessing. I should really LOOK at Woody first (Q).");
    }
  }
  const observe = {
    woody: async (g) => {
      g.set('woody_read');
      await g.zoom({ at: 'woody', icon: 'plush', title: 'Woody, decoded', text: 'Orange cat hair all over his sleeves. A ticket stub in his breast pocket: "Danish Polka Festival". And a tiny plastic stegosaurus peeking out of his lab coat.' });
      await g.think('Cat, polka, stegosaurus. Got it. Now for the reading.');
    },
  };

  const banter = [
    [['gus', 'Shawn, there are eleven kinds of brisket here.'], ['shawn', 'We are on a case, Gus.'], ['gus', 'A case of brisket.']],
    [['shawn', 'Gus, would you rather be a pig or a goat?'], ['gus', 'Neither. They both end up at a fair.']],
    [['gus', 'Do you smell that?'], ['shawn', 'Hickory?'], ['gus', 'Mesquite. Amateur.']],
    [['shawn', 'If I had a BBQ restaurant I would call it "Psych-Ribs".'], ['gus', 'That is the worst thing you have ever said.']],
    [['gus', 'Tammy\'s hat could shade a small family.'], ['shawn', 'Tammy\'s hat could shade a medium-sized church.']],
  ];

  P.registerChapter({
    id: 'ch2', number: 2, title: 'RACK OF LIES',
    tagline: 'A pitmaster drops dead. Watch the other hand.',
    pineapple: { scene: 'fair', note: 'In the fruit crate beside the funnel cake stand.' },
    cast, clues, items, gifts, snacks, scenes, revelations, hints, topics, banter, observe,
    where: {
      lassiter: (g) => (g.flag('finale_pending') ? 'fair' : !g.flag('hired') && !toxDone(g) && g.flag('c2_crime') ? 'fair' : 'station'),
      juliet: (g) => (g.flag('finale_pending') ? 'fair' : g.flag('hired') ? 'fair' : toxDone(g) ? 'station' : 'fair'),
      mcnab: (g) => 'fair',
      vick: (g) => (g.flag('finale_pending') ? 'fair' : 'station'),
    },
    map: {
      fair: { name: 'Smoke-Off', x: 210, y: 64, scene: 'fair', scenes: ['trailer', 'barn'], chapter: true, desc: 'The Santa Barbara Smoke-Off at the county fairgrounds. Eleven kinds of brisket. One murder.' },
      morgue: { name: "Coroner", x: 136, y: 50, scene: 'morgue', color: '#7ae2c0', desc: "Woody's domain. Bring an appetite for science. Not for lunch." },
    },
    async start(g) {
      g.flashback(true);
      await g.goto('flash89', { instant: true });
      await g.card({ kicker: 'STATE STREET', title: '1989', sub: 'The Marvelous Marvin performs', dur: 2.6 });
      await g.say('marvin', 'Step right up! Keep your eye on the ball! Three cups, one ball, one lucky winner!');
      await g.say('youngshawn:happy', 'Dad! Dad! I can win! I watched the whole time!');
      await g.say('younghenry:stern', "Everybody watches the whole time, Shawn. That's how he wins.");
      await g.say('younghenry', "This time, don't watch the ball. And don't watch the wand. Watch everything ELSE.");
      g.scene.cups = { phase: 'shuffle', t: 0 };
      g.anim('marvin', 'wave');
      const ok = await g.memoryTest({ seconds: 5, question: 'Eyes closed, kid. Where did the ball go?', options: ['Under the left cup', 'Under the middle cup', 'Under the right cup', "Into the guy's jacket pocket"], answer: 3 });
      g.scene.cups = { phase: 'idle', t: 0 };
      g.anim('marvin', 'stand');
      if (ok) { await g.say('youngshawn:happy', "It's not under ANY cup! It's in his pocket! His left hand put it there while he waved the stick!"); await g.say('marvin:surprised', "...Kid, how'd you like to be my assistant?"); await g.say('younghenry:stern', 'He would not.'); }
      else { await g.say('youngshawn', 'The middle one!'); await g.say('marvin:smug', 'Ohhh, so close!'); await g.say('younghenry', "It's in his jacket pocket, Shawn. You watched the wand. Everybody watches the wand."); }
      await g.say('younghenry', "Remember this. Everybody watches the hand that's waving. The other hand is the one doing the work.");
      await g.say('youngshawn', 'Can we get ice cream?');
      await g.say('younghenry', "...Fine. But I'm watching both your hands.");
      await g.fade(true, 700);
      g.flashback(false);
      await g.goto('fair', { instant: true, x: 360, y: 156 });
    },
  });
})(window.P);
