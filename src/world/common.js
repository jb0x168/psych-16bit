'use strict';
/* Shared world: recurring locations (Psych HQ, SBPD, Henry's house), map spots, banter,
   Gus nicknames, Henry's phone lines and recurring-cast small talk.
   Chapters customise these through `extend`, `where`, and `topics` (see docs/CHAPTER_GUIDE.md). */
(function (P) {
  const G = P.G, U = P.U, R = P.props;
  const W = P.world;

  /* -------- where is everybody? (chapters override via chapter.where) -------- */
  const HOME = { vick: 'station', juliet: 'station', lassiter: 'station', mcnab: 'station', henry: 'henry', woody: 'morgue' };
  P.where = (g, id) => {
    const ch = g.chapter;
    if (ch && ch.where && ch.where[id]) return ch.where[id](g);
    return HOME[id];
  };
  // build a topic list for a recurring character: chapter topics first, then their evergreen small talk
  P.castTalk = async (g, id, base, o = {}) => {
    const ch = g.chapter;
    let extra = ch && ch.topics && ch.topics[id];
    if (typeof extra === 'function') extra = extra(g);
    const list = (extra || []).concat(base || []);
    if (ch && ch.onTalk && ch.onTalk[id]) { const r = await ch.onTalk[id](g); if (r === 'handled') return; }
    await g.topics(id, list, o);
  };

  /* -------- common items & snacks -------- */
  W.items = {};
  W.snacks = {
    pudding: { name: "Gus's Pudding Cup", icon: 'cup', desc: 'Chocolate. Labelled "GUS - DO NOT EAT, SHAWN". Delicious.' },
    donut: { name: 'SBPD Precinct Donut', icon: 'donut', desc: 'Sprinkles. Technically evidence of nothing.' },
    fishtaco: { name: "Henry's Fish Taco", icon: 'taco', desc: 'Caught it, cleaned it, grilled it, judged you for not helping.' },
  };

  /* -------- map -------- */
  W.mapSpots = {
    office: { name: 'Psych HQ', x: 112, y: 72, scene: 'office', desc: 'Our office. Rent is due. Rent is always due.' },
    station: { name: 'SBPD', x: 168, y: 58, scene: 'station', desc: 'Santa Barbara Police Department. Free coffee, mild hostility.' },
    henry: { name: "Dad's House", x: 262, y: 94, scene: 'henry', desc: 'Henry Spencer. Retired cop. Professional disappointment dispenser. Excellent hints.' },
  };

  /* -------- Henry on the phone -------- */
  W.henry = {
    shawnOpens: ['Dad! Quick question. Totally hypothetical.', 'Hey Dad. Funny story...', "Dad, it's your favorite son.", "Before you hang up: it's important. Ish."],
    greetings: ["Shawn. I'm re-grouting the shower. This better be good.", "You only call when you're stuck. So you're stuck.", "Let me guess. You looked, but you didn't SEE.", "I was about to cast a line. Make it quick, kid.", 'What did I tell you about calling during the game?'],
    noHint: ["I don't know what you want from me. Go look at something. Really look.", "You're doing fine. For once. Keep at it."],
    signoffs: ['Now stop calling me.', 'And Shawn? Eat a vegetable.', "Don't make me drive over there.", 'Good luck. You need it.', 'Tell Gus I said hi. Gus. Not you.'],
  };

  /* -------- Gus nicknames (Shawn's introductions) -------- */
  W.nicknames = [
    'Lavender Gooms', 'Methuselah Honeysuckle', 'Felony Hobbes', 'Dr. Fizzlebottom Q. Cornbread', 'Ichabod Trouserpants', 'Sir Reginald Waffleworth',
    'Squeaky Kibbles', 'Magic Hands McGillicuddy', 'Gustavo Fudgesicle', 'Sugar Ray Nougat', 'Tiberius Snackwell', 'Professor Bananapants',
    'Jazz Hands Jefferson', 'Ferguson Flapjack the Third', 'Baron Von Snickerdoodle', 'Velvet Thunder', 'Galileo Humpkins', 'Shmuel Butterbean',
    'Admiral Breadbowl', 'Bartholomew Pinecone', 'Hot Sauce Henderson', 'Quincy Pickles', 'Ambrose Bundt-Cake', 'Chocolate Thunder Brown',
    'Detective Dinkleberg', 'Earl Grey Poupon', 'Clarence "Clean Hands" Fontaine', 'Dirk Thunderbiscuit',
  ];

  /* -------- ambient Shawn & Gus banter -------- */
  W.banter = [
    [['gus', 'Shawn, I have not eaten since 11:15.'], ['shawn', 'Gus, it is 11:40.'], ['gus', 'And yet here we are. Starving.']],
    [['shawn', 'Gus. Best sandwich of all time. Go.'], ['gus', 'Monte Cristo. Fried. Powdered sugar.'], ['shawn', "That's a dessert in a trench coat."]],
    [['shawn', 'You know what this case needs?'], ['gus', 'Do not say a theme song.'], ['shawn', 'A theme song, Gus.']],
    [['shawn', 'If you were a superhero, what would your power be?'], ['gus', 'Super smell. Obviously.'], ['shawn', 'You already have that.'], ['gus', 'Then I am ALREADY a superhero.']],
    [['gus', 'I have a sales meeting at four.'], ['shawn', 'Sales meetings are just seances for spreadsheets.']],
    [['shawn', "Gus, don't be a half-eaten churro."], ['gus', 'What does that even mean?'], ['shawn', 'Incomplete. Sad. Covered in sugar.']],
    [['shawn', 'Name a better duo than us.'], ['gus', 'Hall and Oates.'], ['shawn', "...Name one that ISN'T Hall and Oates."]],
    [['gus', 'Promise me no tap dancing today.'], ['shawn', 'I can promise no tap dancing ON PURPOSE.']],
    [['shawn', 'I smell nachos.'], ['gus', 'That is the smell of hope, Shawn.']],
    [['gus', 'We should have brought snacks.'], ['shawn', 'I did bring snacks.'], ['gus', 'Where?'], ['shawn', 'In my heart, Gus.']],
    [['shawn', 'If this were a movie, who plays you?'], ['gus', 'Denzel.'], ['shawn', "Denzel's busy. Denzel's cousin."]],
    [['shawn', 'You hear that?'], ['gus', 'Hear what?'], ['shawn', 'The sound of a mystery. It sounds like a kazoo.']],
    [['gus', "If Lassiter sees us here, we're done."], ['shawn', 'Lassie loves us. He shows it through threats.']],
    [['shawn', 'Give me your best detective face.'], ['gus', '...'], ['shawn', 'Terrifying. Never do that again.']],
    [['gus', 'My mother says I should get a real job.'], ['shawn', 'You HAVE a real job. You sell pills.'], ['gus', 'Pharmaceuticals, Shawn.']],
    [['shawn', 'New rule: first to spot a clue gets the last taco.'], ['gus', 'There are no tacos.'], ['shawn', 'Then we have TWO mysteries.']],
    [['gus', "What's our plan?"], ['shawn', 'Step one: wing it. Step two: see step one.']],
    [['shawn', "You know that's right."], ['gus', "I know that's right."]],
    [['gus', 'I could really go for some pudding.'], ['shawn', 'Chocolate or vanilla?'], ['gus', 'Yes.']],
    [['gus', 'Do NOT touch anything.'], ['shawn', 'Touching things is how I read them.'], ['gus', "You're not psychic."], ['shawn', 'Shh. The things will hear you.']],
    [['shawn', 'Every case ends with someone running away.'], ['gus', 'And me tackling them.'], ['shawn', 'You have never tackled anyone.'], ['gus', 'Spiritually, I tackle them.']],
    [['shawn', 'Can you believe they pay us for this?'], ['gus', 'They BARELY pay us for this.']],
    [['shawn', 'I bet it was the butler.'], ['gus', 'There is no butler.'], ['shawn', "That's what a butler would want us to think."]],
    [['gus', 'I need a smoothie. Mango. A little ginger.'], ['shawn', 'You need help.'], ['gus', 'I need a SMOOTHIE.']],
    [['shawn', "Gus, you're my best friend."], ['gus', '...What did you break?'], ['shawn', 'Nothing! Yet.']],
    [['gus', 'Can we stop for food after this?'], ['shawn', 'Gus, we ARE the food. Spiritually.'], ['gus', 'That is disturbing and I am still hungry.']],
    [['shawn', 'Do you think fish know they live in water?'], ['gus', 'Focus, Shawn.'], ['shawn', 'I AM focused. On fish.']],
    [['shawn', 'Remind me to get a cape.'], ['gus', 'No.'], ['shawn', 'A little cape. A capelet.']],
  ];

  /* ===================== shared scenes ===================== */

  /* -------- Psych HQ -------- */
  W.scenes.office = {
    name: 'Psych HQ', width: 400, music: 'office',
    floor: { x0: 12, x1: 390, y0: 132, y1: 172 },
    entries: { map: { x: 34, y: 150, face: 'right' } },
    spawn: { x: 120, y: 150 },
    bg(x, o) {
      const Wd = o.W, fy = 120;
      R.wall(x, 0, 0, Wd, fy, '#e2b25e', { wainscot: 32, wainscotCol: '#7a4a2e', crown: true });
      R.floor(x, 0, fy, Wd, P.H - fy, 'wood', '#a8744a');
      G.rect(x, 0, fy, Wd, 2, '#4a2a18');
      // sign letters painted on the wall
      P.font.draw(x, 'PSYCH', 164, 6, '#2e8a3a', { scale: 2, shadow: '#7a4a2e' });
      R.door(x, 12, 58, 26, 62, '#5a8a6a', { glass: true, label: 'PSYCH', labelCol: '#2e6a3a' });
      R.corkboard(x, 48, 30, 46, 30, { strings: true, n: 7 });
      // dartboard
      G.circle(x, 108, 40, 7, '#2a2028'); G.circle(x, 108, 40, 6, '#e8d8b0'); G.circle(x, 108, 40, 4, '#c83a3a'); G.circle(x, 108, 40, 2, '#3a8a3a'); G.px(x, 108, 40, '#c83a3a'); G.line(x, 110, 37, 115, 33, '#fee761');
      R.window(x, 128, 22, 76, 50, { blinds: true, blindsDown: 18, view: 'palms' });
      G.rect(x, 130, 80, 72, 8, '#c8c8d0'); for (let i = 132; i < 200; i += 4) G.vl(x, i, 81, 6, '#9a9aa8'); // radiator
      // Shawn's desk (messy)
      const st = R.desk(x, 50, 128, 60, '#8a5a3a');
      R.computer(x, 56, st, { text: true });
      G.circle(x, 82, st - 3, 3, '#1a1a22'); G.px(x, 81, st - 4, '#ffffff'); G.px(x, 82, st - 3, '#2a5ad8'); // magic 8-ball
      G.rect(x, 90, st - 6, 4, 6, '#e43b44'); G.rect(x, 90, st - 9, 4, 3, '#f2c39e'); // action figure
      G.rect(x, 96, st - 4, 9, 4, '#f4ecd6'); G.rect(x, 98, st - 5, 7, 1, '#fff8a0'); // comic
      R.officeChair(x, 64, 132, '#5a2a2a');
      // filing cabinet + plant + THE PINEAPPLE
      R.cabinet(x, 214, 120, 38, '#8a8e98');
      R.pineapple(x, 220, 82, 1);
      R.plant(x, 228, 82, 18, '#3a6a8a');
      // Gus's desk (immaculate)
      const gt = R.desk(x, 240, 128, 58, '#6a4a3a');
      G.rect(x, 248, gt - 9, 14, 9, '#3a3a48'); G.rect(x, 249, gt - 8, 12, 6, '#9ac8e8'); G.rect(x, 246, gt - 1, 18, 1, '#5a5a6a'); // laptop
      G.rect(x, 268, gt - 7, 12, 7, '#c83a3a'); G.rect(x, 269, gt - 6, 10, 2, '#f4f4f8'); G.rect(x, 272, gt - 9, 4, 2, '#5a5a6a'); // sample case
      R.frame(x, 285, gt - 10, 7, 8, 'photo');
      R.officeChair(x, 262, 132, '#24324e');
      R.poster(x, 250, 26, 22, 30, 'movie', 'officeposter1');
      R.poster(x, 300, 30, 18, 24, 'surf', 'officeposter2');
      // mini fridge + couch + tv
      G.rect(x, 308, 94, 18, 26, '#e8e8ec'); G.hl(x, 308, 94, 18, '#ffffff'); G.vl(x, 325, 94, 26, '#b8b8c4'); G.vl(x, 322, 100, 8, '#9a9aa8');
      G.rect(x, 330, 30, 46, 28, '#1a1a22'); G.rect(x, 332, 32, 42, 22, '#2a3a48'); G.rect(x, 350, 58, 6, 4, '#3a3a48');
      R.couch(x, 338, 126, 50, '#7a3a4a');
      R.lamp(x, 386, 120, '#e8c870');
      R.rug(x, 150, 140, 90, 18, '#8a3a4a');
    },
    anim(x, t, o) {
      // TV flicker
      const c = o.cam;
      const k = Math.floor(t * 6) % 4;
      G.rect(x, 332 - c, 32, 42, 22, ['#2a4a68', '#2a5078', '#264660', '#2e5480'][k]);
      G.dither(x, 332 - c, 32, 42, 22, '#4a7ab0', 3 + k);
    },
    hotspots: [
      { id: 'door', name: 'Front Door', x: 10, y: 56, w: 30, h: 66, walk: [30, 150], exit: 'map', verb: 'Head out the' },
      { id: 'board', name: 'Case Board', x: 46, y: 28, w: 50, h: 34, walk: [72, 140],
        look: async (g) => { await g.say('shawn', 'The case board. Red string is how you know it is serious.'); if (g.s.objective) await g.say('gus', 'Current lead: ' + g.s.objective); } },
      { id: 'sdesk', name: "Shawn's Desk", x: 50, y: 100, w: 60, h: 30, walk: [86, 140],
        look: async (g) => { await g.say('shawn', U.pick(['My desk. A delicate ecosystem of genius.', 'Magic 8-ball says: "Reply hazy, try Gus."', 'Is that... a Pop-Tart from 2009? Vintage.'])); } },
      { id: 'gdesk', name: "Gus's Desk", x: 240, y: 100, w: 58, h: 30, walk: [266, 140],
        look: async (g) => { await g.say('gus', U.pick(['Do not touch my desk, Shawn. It is in harmony.', 'My samples are alphabetized. By side effect.'])); } },
      { id: 'fridge', name: 'Mini Fridge', x: 306, y: 92, w: 22, h: 30, walk: [316, 140],
        use: async (g) => {
          if (!g.s.snacks.includes('pudding')) {
            await g.say('shawn:happy', 'Ooh. Pudding cup.');
            await g.say('gus:angry', 'Shawn, that is labelled. With my name. In two places.');
            await g.say('shawn', 'Gus, sharing is how the universe stays balanced.');
            await g.snack('pudding');
            await g.say('gus', '...Okay, it is delicious. I am still upset.');
          } else await g.say('gus', 'There is nothing left in there but baking soda and regret.');
        } },
      { id: 'couch', name: 'Couch', x: 334, y: 96, w: 58, h: 30, walk: [360, 142],
        look: async (g) => { await g.say('shawn', 'The thinking couch. Also the napping couch. Same couch.'); } },
      { id: 'window', name: 'Window', x: 128, y: 22, w: 76, h: 50, walk: [166, 136],
        look: async (g) => { await g.say('shawn', 'Santa Barbara. Sunshine, palm trees, and roughly one murder a week. Paradise.'); } },
    ],
  };

  /* -------- SBPD -------- */
  W.scenes.station = {
    name: 'SBPD', width: 420, music: 'station',
    floor: { x0: 12, x1: 410, y0: 132, y1: 172 },
    entries: { map: { x: 30, y: 152, face: 'right' } },
    bg(x, o) {
      const Wd = o.W, fy = 120;
      R.wall(x, 0, 0, Wd, fy, '#b8c4cc', { wainscot: 30, wainscotCol: '#6a7a8a', crown: true });
      R.floor(x, 0, fy, Wd, P.H - fy, 'tile', '#c8c4bc');
      R.door(x, 8, 56, 28, 64, '#6a7a8a', { glass: true, label: 'EXIT', labelCol: '#2a3a4a' });
      R.flag(x, 44, 44, 'us'); R.flag(x, 64, 46, 'ca');
      R.corkboard(x, 86, 30, 40, 28, { n: 5 });
      R.poster(x, 90, 33, 10, 14, 'wanted', 'w1'); R.poster(x, 104, 34, 10, 14, 'wanted', 'w2'); R.poster(x, 115, 32, 9, 13, 'wanted', 'w3');
      // Lassiter's desk (precise)
      const lt = R.desk(x, 78, 128, 56, '#5a5a66');
      R.computer(x, 84, lt, {});
      G.rect(x, 104, lt - 4, 12, 4, '#3a3a48'); P.font.draw(x, 'C.L.', 105, lt - 4, '#e8e0d0');
      R.plant(x, 122, lt, 10, '#c86a3a'); // cactus in a pot
      R.pineapple(x, 128, lt, 0); // pineapple pencil cup. He denies it.
      R.waterCooler(x, 142, 120);
      R.window(x, 164, 24, 58, 44, { blinds: true, blindsDown: 26, view: 'city' });
      // Juliet's desk
      const jt = R.desk(x, 166, 128, 58, '#7a6a5a');
      R.computer(x, 172, jt, { text: true });
      R.frame(x, 196, jt - 9, 7, 7, 'photo');
      G.rect(x, 206, jt - 6, 5, 6, '#ff8ab8'); G.hl(x, 206, jt - 6, 5, '#7a4a2a'); // mug
      R.plant(x, 216, jt, 12, '#5a8ac8');
      // coffee counter
      G.rect(x, 234, 96, 40, 4, '#8a7a6a'); G.rect(x, 236, 100, 36, 20, '#6a5a4a'); G.hl(x, 236, 100, 36, '#4a3a2a');
      R.coffee(x, 238, 96); R.donutBox(x, 252, 96);
      R.clock(x, 254, 28, 7);
      // Chief's office
      G.rect(x, 286, 24, 102, 96, '#a8b4bc'); G.frame(x, 286, 24, 102, 96, '#6a7a8a');
      R.door(x, 292, 56, 28, 64, '#8a6a4a', { glass: true, label: 'CHIEF', labelCol: '#2a2a3a' });
      R.window(x, 328, 36, 52, 40, { blinds: true, blindsDown: 40, frame: '#6a7a8a', cross: false });
      R.plant(x, 400, 120, 26, '#8a5a3a');
      R.poster(x, 398, 40, 16, 22, 'chart', 'stchart');
    },
    hotspots: [
      { id: 'exit', name: 'Exit', x: 6, y: 54, w: 32, h: 68, walk: [28, 150], exit: 'map', verb: 'Leave via' },
      { id: 'donuts', name: 'Donut Box', x: 234, y: 86, w: 40, h: 16, walk: [254, 138],
        use: async (g) => {
          if (!g.s.snacks.includes('donut')) {
            await g.say('shawn', 'Gus. Precinct donuts. These are basically community property.');
            await g.say('gus', 'They are basically evidence of a crime if we take them.');
            await g.snack('donut');
            await g.say('gus:happy', '...Sprinkles. Okay. I am an accessory. I accept that.');
          } else await g.say('gus', 'Shawn, we already ate the good ones. Only the plain cake ones are left.');
        } },
      { id: 'wanted', name: 'Wanted Posters', x: 84, y: 28, w: 44, h: 32, walk: [104, 140],
        look: async (g) => { await g.say('shawn', U.pick(["Wanted: a guy who looks like a thumb. Gus, have you been to Reno lately?", 'One of these guys is wearing a turtleneck in a mugshot. Respect.'])); } },
      { id: 'cooler', name: 'Water Cooler', x: 138, y: 90, w: 16, h: 32, walk: [146, 140],
        look: async (g) => { await g.say('shawn', 'The water cooler. Where cops gather to talk about how amazing I am.'); await g.say('gus', 'They talk about how annoying you are.'); await g.say('shawn', "Gus. That's the same thing."); } },
      { id: 'chiefdoor', name: "Chief's Office", x: 290, y: 54, w: 32, h: 68, walk: [306, 140],
        look: async (g) => { await g.say('shawn', "Chief Vick's office. Every time I go in there I come out employed or banned. It's a coin flip."); } },
      { id: 'ldesk', name: "Lassiter's Desk", x: 78, y: 100, w: 56, h: 30, walk: [106, 140],
        look: async (g) => { await g.say('shawn:smug', "Lassie's desk. Pencils sharpened to the exact same length. A cactus, because of course. And a framed photo of... his badge."); await g.say('gus', 'Do not let him catch you looking at his badge photo.'); } },
      { id: 'jdesk', name: "Juliet's Desk", x: 166, y: 100, w: 58, h: 30, walk: [194, 140],
        look: async (g) => { await g.say('shawn', "Jules's desk. Neat, organized, smells like vanilla and justice."); await g.say('gus', 'You smelled her desk?'); await g.say('shawn', 'I sensed it, Gus.'); } },
    ],
    actors: [
      { id: 'vick', x: 330, y: 146, face: 'left', show: (g) => P.where(g, 'vick') === 'station', talk: (g) => P.castTalk(g, 'vick', BASE.vick) },
      { id: 'lassiter', x: 112, y: 150, face: 'right', idle: 'crossed', show: (g) => P.where(g, 'lassiter') === 'station', talk: (g) => P.castTalk(g, 'lassiter', BASE.lassiter) },
      { id: 'juliet', x: 204, y: 152, face: 'left', show: (g) => P.where(g, 'juliet') === 'station', talk: (g) => P.castTalk(g, 'juliet', BASE.juliet) },
      { id: 'mcnab', x: 262, y: 148, face: 'left', show: (g) => P.where(g, 'mcnab') === 'station', talk: (g) => P.castTalk(g, 'mcnab', BASE.mcnab) },
    ],
  };

  /* -------- Henry's house -------- */
  W.scenes.henry = {
    name: "Dad's House", width: 320, music: 'henry',
    floor: { x0: 10, x1: 312, y0: 136, y1: 172 },
    entries: { map: { x: 26, y: 156, face: 'right' } },
    blockers: [{ x: 30, y: 136, w: 30, h: 8 }],
    bg(x) {
      R.sky(x, 0, 0, 320, 80, 'day');
      R.cloud(x, 30, 12, 40); R.cloud(x, 200, 20, 30);
      R.ocean(x, 0, 66, 320, 20, 'day');
      R.hills(x, 0, 90, 320, '#7aa85a', 'hhills', 8);
      // house
      R.siding(x, 104, 30, 206, 92, '#7a9ab0');
      R.roofTiles(x, 96, 18, 222, 14, '#5a5a6a');
      G.poly(x, [[96, 32], [318, 32], [310, 38], [104, 38]], '#4a4a58');
      R.window(x, 122, 52, 30, 26, { frame: '#f4f0e8' });
      R.window(x, 262, 52, 30, 26, { frame: '#f4f0e8' });
      R.door(x, 196, 60, 24, 58, '#c8583a');
      // porch
      G.rect(x, 104, 112, 206, 10, '#9a7a5a'); G.hl(x, 104, 112, 206, '#c8a87a');
      G.rect(x, 104, 76, 206, 4, '#f4f0e8');
      for (const px of [108, 168, 248, 304]) G.rect(x, px, 80, 4, 32, '#f4f0e8');
      R.railing(x, 108, 112, 70, '#f4f0e8'); R.railing(x, 236, 112, 72, '#f4f0e8');
      // porch steps
      for (let i = 0; i < 3; i++) G.rect(x, 186 - i * 2, 122 + i * 4, 44 + i * 4, 4, i % 2 ? '#a8886a' : '#9a7a5a');
      // porch chairs + rods + pineapple
      G.rect(x, 130, 100, 14, 12, '#d8c8a8'); G.rect(x, 130, 92, 3, 10, '#d8c8a8');
      G.rect(x, 270, 100, 14, 12, '#d8c8a8'); G.rect(x, 281, 92, 3, 10, '#d8c8a8');
      G.line(x, 236, 112, 250, 70, '#5a3a2a'); G.line(x, 240, 112, 258, 72, '#4a2a1a'); G.line(x, 250, 70, 252, 110, '#c0cbdc');
      R.pineapple(x, 160, 99, 1); // on the porch rail
      // yard
      R.grass(x, 0, 122, 320, 58, '#6aa84a');
      G.rect(x, 190, 134, 36, 46, '#c8b898'); G.noise(x, 190, 134, 36, 46, ['#b8a888', '#d8c8a8'], 0.1, 'path');
      R.grill(x, 36, 140);
      R.car(x, 0, 132, '#8a3a2a', 'van', 1);
      R.fence(x, 0, 180, 320, '#f4f0e8');
      R.flowers(x, 110, 124, 70, 'hfl'); R.flowers(x, 236, 124, 70, 'hfl2');
      R.bush(x, 290, 130, 26);
    },
    hotspots: [
      { id: 'leave', name: 'Street', x: 0, y: 120, w: 14, h: 60, walk: [14, 156], exit: 'map', verb: 'Leave to the' },
      { id: 'grill', name: 'Grill', x: 32, y: 120, w: 22, h: 22, walk: [56, 150],
        look: async (g) => { await g.say('shawn', 'Dad\'s grill. Older than me. Better maintained than me.'); } },
      { id: 'rods', name: 'Fishing Rods', x: 234, y: 68, w: 26, h: 46, walk: [244, 140],
        look: async (g) => { await g.say('shawn', 'Dad\'s fishing rods. He talks to these more than he talks to me.'); await g.say('henry', 'They listen.'); } },
    ],
    actors: [
      { id: 'henry', x: 222, y: 146, face: 'left', show: (g) => P.where(g, 'henry') === 'henry', talk: (g) => P.castTalk(g, 'henry', BASE.henry) },
    ],
  };

  /* -------- Coroner's office (Woody) -------- */
  W.scenes.morgue = {
    name: "Coroner's Office", width: 320, music: 'station',
    floor: { x0: 14, x1: 306, y0: 134, y1: 172 },
    entries: { map: { x: 28, y: 154, face: 'right' } },
    bg(x) {
      R.wall(x, 0, 0, 320, 118, '#9ac8b8', { wainscot: 26, wainscotCol: '#6a9a8a' });
      for (let yy = 4; yy < 92; yy += 10) G.hl(x, 0, yy, 320, '#8ab8a8');
      for (let xx = 0; xx < 320; xx += 12) G.vl(x, xx, 0, 92, '#8ab8a8');
      R.floor(x, 0, 118, 320, 62, 'checker', '#d8e0dc');
      R.door(x, 8, 58, 26, 60, '#7a9a9a', { glass: true, label: 'EXIT', labelCol: '#2a3a3a' });
      // body drawers
      G.rect(x, 44, 30, 70, 84, '#a8b0b8'); G.frame(x, 44, 30, 70, 84, '#6a7078');
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { G.frame(x, 48 + c * 33, 34 + r * 26, 30, 22, '#7a8088'); G.rect(x, 58 + c * 33, 44 + r * 26, 10, 2, '#e8e8f0'); }
      // covered table + lamp
      G.rect(x, 130, 100, 70, 4, '#c0c8d0'); G.rect(x, 136, 104, 3, 22, '#8a9098'); G.rect(x, 190, 104, 3, 22, '#8a9098');
      G.poly(x, [[128, 100], [202, 100], [200, 92], [180, 86], [150, 86], [130, 92]], '#e8eef4');
      G.line(x, 165, 0, 165, 30, '#3a3a48'); G.poly(x, [[150, 30], [180, 30], [174, 22], [156, 22]], '#c0c8d0'); G.rect(x, 156, 30, 18, 2, '#fff8c0');
      // desk + microscope + lunch next to a specimen jar
      const dt = R.desk(x, 220, 128, 70, '#6a7a7a');
      G.rect(x, 230, dt - 12, 4, 12, '#2a2a34'); G.rect(x, 228, dt - 14, 8, 3, '#2a2a34'); G.rect(x, 226, dt - 2, 12, 2, '#2a2a34');
      G.rect(x, 246, dt - 8, 8, 8, '#c8e8d8'); G.frame(x, 246, dt - 8, 8, 8, '#5a7a6a'); G.circle(x, 250, dt - 4, 2, '#d88a8a');
      G.rect(x, 258, dt - 5, 12, 5, '#f4ecd6'); G.rect(x, 258, dt - 6, 12, 1, '#e8a030');
      // skeleton model
      G.circle(x, 300, 46, 5, '#f4f0e0'); G.vl(x, 300, 51, 30, '#f4f0e0'); for (let i = 0; i < 4; i++) G.hl(x, 295, 55 + i * 4, 11, '#f4f0e0'); G.line(x, 300, 81, 294, 104, '#f4f0e0'); G.line(x, 300, 81, 306, 104, '#f4f0e0'); G.line(x, 296, 55, 290, 74, '#f4f0e0'); G.line(x, 304, 55, 310, 74, '#f4f0e0');
      G.rect(x, 292, 104, 16, 3, '#5a5a6a');
      R.poster(x, 250, 30, 26, 32, 'chart', 'morguechart');
    },
    hotspots: [
      { id: 'exit', name: 'Exit', x: 6, y: 56, w: 30, h: 64, walk: [28, 152], exit: 'map', verb: 'Leave via' },
      { id: 'drawers', name: 'Cold Drawers', x: 44, y: 30, w: 70, h: 84, walk: [80, 140],
        look: async (g) => { await g.say('gus:worried', 'Shawn, do not open the drawers.'); await g.say('shawn', 'I was not going to open the drawers.'); await g.say('shawn', '...I was thinking about opening the drawers.'); } },
      { id: 'skeleton', name: 'Skeleton Model', x: 288, y: 38, w: 24, h: 70, walk: [290, 140],
        look: async (g) => { await g.say('woody:happy', "That's Gary! He's been with me eleven years. He's a great listener."); } },
      { id: 'lunch', name: "Woody's Lunch", x: 244, y: 96, w: 30, h: 12, walk: [256, 140],
        look: async (g) => { await g.say('gus:worried', 'Is that a sandwich next to a... specimen?'); await g.say('woody', 'Different containers, Gus! Mostly.'); } },
    ],
    actors: [
      { id: 'woody', x: 186, y: 150, face: 'left', show: (g) => P.where(g, 'woody') === 'morgue', talk: (g) => P.castTalk(g, 'woody', BASE.woody),
        observe: (g) => g.say('shawn', 'Woody has latex glove powder on his tie and mustard on his glove. One of those is fine.') },
    ],
  };

  /* -------- evergreen small talk for the recurring cast -------- */
  const BASE = {
    vick: [
      { id: 'chief_small', label: 'Small talk', run: async (g) => {
        const lines = [
          [['shawn', 'Chief! Have you done something with your hair?'], ['vick:stern', 'No, Mr. Spencer.'], ['shawn', 'Well, it looks fantastic regardless.']],
          [['shawn', 'Chief, I sense your daughter recently learned a new word.'], ['vick:surprised', '...How could you possibly know that?'], ['shawn', 'The spirits. Also there is crayon on your blazer.']],
          [['vick', 'Mr. Spencer, Mr. Guster. Is there something I can do for you, or are you just... here?'], ['shawn', "We're always just here, Chief. It's our gift."]],
        ];
        await g.lines(U.pick(lines));
      } },
    ],
    lassiter: [
      { id: 'lassie_poke', label: 'Call him "Lassie"', run: async (g) => {
        const lines = [
          [['shawn:smug', "Lassie! Who's a good detective?"], ['lassiter:angry', 'Do not. Call me. Lassie.']],
          [['shawn', "Lassie, I'm sensing you had a sad breakfast. Dry toast. No jam."], ['lassiter:stern', "...I'm not dignifying that."], ['gus', 'He did, though.']],
          [['shawn', 'Carlton. Carly. The Lass-Man. Lassie-Lou.'], ['lassiter:angry', 'Spencer, I will put you in a cell and lose the key in the ocean.']],
          [['lassiter:stern', 'Spencer. Guster. Whatever it is, the answer is no.'], ['shawn', "I didn't ask anything."], ['lassiter', "And yet. No."]],
        ];
        await g.lines(U.pick(lines));
      } },
    ],
    juliet: [
      { id: 'jules_flirt', label: 'Flirt (badly)', run: async (g) => {
        const lines = [
          [['shawn:smug', 'Jules. Is it hot in here or is that just your detective skills?'], ['juliet:smug', 'It is the broken AC, Shawn.'], ['gus', 'Smooth.']],
          [['shawn', 'I had a vision about you last night, Jules.'], ['juliet:surprised', 'Shawn!'], ['shawn', 'You were solving a crossword. It was very wholesome. Seven across was "heartthrob."']],
          [['juliet:happy', 'Hi, Shawn. Hi, Gus.'], ['shawn', 'She said my name first, Gus. Write that down.'], ['gus', 'I am not writing that down.']],
          [['shawn', 'Jules, if you were a pineapple, you would be the sweetest one.'], ['juliet', '...Thank you? I think?'], ['gus', 'Never say that again.']],
        ];
        await g.lines(U.pick(lines));
      } },
    ],
    mcnab: [
      { id: 'mcnab_chat', label: 'Hey, Buzz!', run: async (g) => {
        const lines = [
          [['mcnab:happy', "Shawn! Gus! I've been practicing my psychic stuff. I knew you'd come in today."], ['shawn', 'Buzz, we come in every day.'], ['mcnab:happy', "And I KNEW it."]],
          [['mcnab', 'Did you guys know a group of crows is called a murder? That seems unfair to crows.'], ['gus', 'That is actually a great point, Buzz.']],
          [['mcnab:happy', 'My wife made banana bread. Want some? Oh. I ate it on the way here.'], ['shawn', 'The thought is what counts, Buzz.']],
        ];
        await g.lines(U.pick(lines));
      } },
    ],
    henry: [
      { id: 'henry_hint', label: 'I need a hint, Dad', run: async (g) => {
        const hint = (g.chapter.hints || []).find((h) => h.when(g));
        g.s.hintsUsed = (g.s.hintsUsed || 0) + 1;
        if (!hint) { await g.say('henry', "You seem to be doing fine. Don't screw it up."); return; }
        await g.say('henry:stern', 'Sit down. Not there. There.');
        for (const l of U.toArr(hint.vague).concat(U.toArr(hint.specific || []))) { if (Array.isArray(l)) await g.say(l[0], l[1]); else await g.say('henry', l); }
        g.s.hintCount[hint.id] = 2;
      } },
      { id: 'henry_fridge', label: "Raid Dad's fridge", run: async (g) => {
        if (g.s.snacks.includes('fishtaco')) { await g.say('henry', 'You already ate. Everything. Go away.'); return; }
        await g.say('henry', 'Fine. There are fish tacos. I caught the fish this morning, which is more than you did.');
        await g.say('gus:happy', 'Mr. Spencer, these smell incredible.');
        await g.snack('fishtaco');
        await g.say('henry:smug', "That's what fresh tastes like, Shawn. Not from a gas station.");
      } },
      { id: 'henry_old', label: 'Remember when...?', run: async (g) => {
        const lines = [
          [['shawn', 'Remember when you made me memorize every license plate on our street?'], ['henry', 'And you remembered every one. Then you wrote a song about them.'], ['shawn', 'It slapped.']],
          [['shawn', 'Remember my first bike?'], ['henry', 'You figured out the neighbor kid stole it because his socks had your chain grease on them.'], ['henry:smug', 'Proudest day of my life. Then you sold his bike back to him.']],
          [['henry', 'You know what your problem is, Shawn?'], ['shawn', 'Too handsome? Too gifted? Too modest?'], ['henry:stern', 'You think it is all a game.'], ['shawn', 'Dad. It literally is a game right now.']],
        ];
        await g.lines(U.pick(lines));
      } },
    ],
    gus: [
      { id: 'gus_think', label: 'What do you think, Gus?', run: async (g) => {
        if (g.s.objective) { await g.say('gus', 'I think we should ' + g.s.objective.charAt(0).toLowerCase() + g.s.objective.slice(1)); await g.say('shawn', "That's what I was going to say. You're in my head, Gus."); }
        else await g.say('gus', 'I think we should get lunch.');
      } },
      { id: 'gus_food', label: "I'm hungry.", run: async (g) => {
        await g.lines(U.pick([
          [['shawn', "Gus, I'm hungry."], ['gus', 'You are always hungry.'], ['shawn', 'And you are always right. That is why we work.']],
          [['gus', 'Do not say tacos.'], ['shawn', 'Tacos.'], ['gus', '...Now I want tacos.']],
          [['shawn', 'What do we have in the car?'], ['gus', 'Half a granola bar and a single, perfect Jolly Rancher.'], ['shawn', 'Watermelon?'], ['gus', 'Watermelon.']],
        ]));
      } },
    ],
    woody: [
      { id: 'woody_chat', label: 'Chat with Woody', run: async (g) => {
        await g.lines(U.pick([
          [['woody:happy', 'Shawn! Gus! I just finished my lunch. Over there. By the... never mind.'], ['gus', 'Woody, please wash your hands.']],
          [['woody', 'Did you know the human body has enough iron to make a small nail? I checked.'], ['shawn', 'You... checked?'], ['woody:happy', 'Hypothetically!']],
        ]));
      } },
    ],
  };
  P.BASE_TOPICS = BASE;
})(window.P);
