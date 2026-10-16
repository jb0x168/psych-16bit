'use strict';
/* ============================================================================
   TEMPLATE CASE: THE MISSING MAPLE BAR
   A small but complete case that shows every system in one place. Copy this
   file to start a new case (see docs/CHAPTER_GUIDE.md), then add a <script>
   tag for your copy in index.html. This template itself is NOT loaded by the
   game, so it never shows up in Case Select.

   Cold open -> title card -> one location with a witness and a suspect ->
   observation clues -> a side quest -> a hidden gift for Juliet -> a snack ->
   a two-step psychic revelation -> epilogue. Plus the mandatory pineapple.
   ========================================================================== */
(function (P) {
  const G = P.G, R = P.props;

  const cast = {
    dot: {
      name: 'Dot Pruneda', short: 'Dot', h: 52, build: 'stout', skin: 'tan', jaw: 'round', eyes: '#3a2a1a',
      hair: { style: 'curly', color: 'auburn' }, face: { lips: '#c04a5a', glasses: 'round' },
      top: { type: 'tee', color: '#ff8ab8', apron: '#f4f4f8' }, bottom: { type: 'pants', color: '#4a4a5a' }, shoes: '#2a2228',
      voice: { pitch: 1.2 }, color: '#ff9ac0',
    },
    chip: {
      name: 'Chip Delgado', short: 'Chip', h: 56, build: 'avg', skin: 'olive', jaw: 'avg', eyes: '#2a1a14',
      hair: { style: 'short', color: 'black' }, face: { stubble: true },
      top: { type: 'polo', color: '#3a8a5a' }, bottom: { type: 'shorts', color: '#6a5a3a' }, shoes: '#e4e4e4',
      acc: [{ type: 'cap', color: '#3a8a5a' }], voice: { pitch: 0.95 }, color: '#8ae8a8',
    },
  };

  const clues = {
    flour_print: { name: 'Floury Handprint', icon: 'glove', zoom: true, from: 'the back door', desc: 'A flour handprint on the back door, at the height of a very tall person. Dot is five foot one.' },
    chip_route: { name: "Chip's Delivery Route", icon: 'map', from: 'Chip', desc: 'Chip says he dropped off flour at 6 AM, through the back door, and left right away.' },
    recipe_card: { name: 'The Recipe Card', icon: 'card', zoom: true, from: 'the delivery van', desc: 'The famous maple bar recipe card, tucked in the visor of Chip\'s van. With a note: "SELL TO DONUT KING".' },
  };
  const items = { coffee: { name: 'Large Coffee', icon: 'cup', desc: 'Black. Chip will not talk without it.' } };
  const gifts = {
    sprinklering: { name: 'Sprinkle Donut Keychain', icon: 'donut', romance: 1, desc: 'Found under the display case.',
      give: async (g) => { await g.say('juliet:happy', 'A sprinkle donut keychain? Shawn, this is adorable.'); } },
  };
  const snacks = { maplebar: { name: 'Maple Bar', icon: 'donut', desc: 'The last one. Gus got the bigger half. Somehow.' } };

  const scenes = {
    flash85: { // cold-open flashback: noShawn, only the kids/Henry act
      name: 'Santa Barbara, 1985', width: 320, noShawn: true, noGus: true, music: 'flashback',
      bg(x) { R.wall(x, 0, 0, 320, 118, '#c8a87a', {}); R.floor(x, 0, 118, 320, 62, 'checker', '#f4ecd6'); R.sign(x, 110, 20, 100, 12, 'DONUTS', { bg: '#ff8ab8', fg: '#ffffff' }); },
      actors: [{ id: 'younghenry', x: 180, y: 150, face: 'left' }, { id: 'youngshawn', x: 140, y: 156, face: 'right' }],
    },
    donutshop: {
      name: 'Donut Derby', width: 320, music: 'office',
      floor: { x0: 14, x1: 306, y0: 134, y1: 172 },
      entries: { map: { x: 30, y: 152, face: 'right' } },
      bg(x) {
        R.wall(x, 0, 0, 320, 118, '#ffe0ec', { wainscot: 30, wainscotCol: '#ff8ab8' });
        R.floor(x, 0, 118, 320, 62, 'checker', '#f4f4f8');
        R.sign(x, 100, 10, 120, 14, 'DONUT DERBY', { bg: '#ff6aa0', fg: '#ffffff' });
        G.rect(x, 90, 86, 120, 34, '#c8e8f8'); G.frame(x, 90, 86, 120, 34, '#8a9aaa');      // display case
        for (let i = 0; i < 8; i++) G.circle(x, 102 + i * 14, 104, 4, ['#d8964a', '#ff8ab8', '#6a3a2a'][i % 3]);
        R.door(x, 270, 60, 30, 60, '#8a6a4a');                                                  // back door
        R.door(x, 6, 60, 22, 60, '#5a8ac8', { glass: true });                                   // front door
        G.rect(x, 230, 50, 30, 3, '#8a6a4a'); R.pineapple(x, 245, 50, 1);                       // the pineapple, on a shelf
      },
      hotspots: [
        { id: 'front', name: 'Front Door', x: 4, y: 58, w: 26, h: 64, walk: [26, 152], exit: 'map', verb: 'Leave by the' },
        { id: 'backdoor', name: 'Back Door', x: 268, y: 58, w: 34, h: 64, walk: [282, 140], clue: (g) => !g.hasClue('flour_print'),
          look: async (g) => { if (await g.clue('flour_print')) await g.think('Dot could not reach that high with a stepladder.'); },
          use: async (g) => { await g.say('shawn', 'The alley. And Chip\'s delivery van, still parked.'); g.set('saw_van'); } },
        { id: 'van', name: "Chip's Van (through the window)", x: 300, y: 70, w: 20, h: 40, walk: [292, 140], show: (g) => g.flag('saw_van'), clue: (g) => !g.hasClue('recipe_card'),
          look: async (g) => { if (await g.clue('recipe_card')) await g.say('shawn:surprised', 'Gus. The recipe card. In the visor.'); } },
        { id: 'case', name: 'Display Case', x: 90, y: 84, w: 120, h: 36, walk: [150, 140],
          use: async (g) => { if (!g.s.snacks.includes('maplebar')) { await g.say('gus', 'There is one maple bar left.'); await g.snack('maplebar'); } else await g.say('gus', 'Gone. Like my dignity.'); } },
        { id: 'keychain', name: 'Something Shiny', x: 150, y: 120, w: 12, h: 8, walk: [156, 140], secret: true, show: (g) => !g.hasGift('sprinklering') && !(g.global.giftsGiven || []).includes('sprinklering'),
          look: async (g) => { await g.say('shawn', 'A sprinkle donut keychain. Jules would love this.'); await g.gift('sprinklering'); } },
      ],
      actors: [
        { id: 'dot', x: 150, y: 128, face: 'left', walk: [170, 146], talk: (g) => talkDot(g),
          observe: (g) => g.say('shawn', 'Flour on her apron up to the elbows. Five foot one, max.') },
        { id: 'chip', x: 230, y: 152, face: 'left', talk: (g) => talkChip(g),
          observe: (g) => g.say('shawn', 'Six foot four. Flour on his RIGHT palm only. A man who pushed a door open.') },
        { id: 'vick', x: 60, y: 150, face: 'right', show: (g) => g.flag('ready'), talk: async (g) => { if (await g.revelation('solve')) await g.complete(); } },
      ],
      onEnter: async (g, o) => { if (o.first) { await g.say('dot:sad', 'Thank goodness. Somebody stole my maple bar recipe!'); g.objective('Find out who took Dot\'s recipe.'); } },
    },
  };

  async function talkDot(g) {
    if (g.once('met_dot')) await g.introGus('dot');
    await g.topics('dot', [
      { id: 'what', label: 'What happened?', run: async (gg) => { await gg.say('dot', 'The recipe card was on the corkboard at five. Gone by seven. Only Chip came by.'); } },
      { id: 'coffee', label: 'Can I get a coffee?', when: (gg) => !gg.hasItem('coffee'), run: async (gg) => { await gg.say('dot', 'Large black, on the house.'); await gg.item('coffee'); } },
    ], { title: 'Dot' });
  }
  async function talkChip(g) {
    if (!g.flag('chip_awake')) {
      await g.say('chip', '...Not before coffee, man.');
      await g.topics('chip', [], { title: 'Chip', onPresent: async (gg, id) => {
        if (id !== 'coffee') return false;
        gg.take('coffee'); gg.set('chip_awake');
        await gg.say('chip:happy', 'Ahh. Okay. I dropped the flour at six, through the back door, and I left. Swear.');
        await gg.clue('chip_route');
        return true;
      } });
      return;
    }
    await g.say('chip', 'I told you, I left at six.');
    if (g.hasAll(['flour_print', 'recipe_card']) && g.once('call_vick')) {
      await g.say('gus', 'Shawn, I called Chief Vick. She is right behind us.');
      g.set('ready');
      await g.goto('donutshop', { x: 140, y: 152 }); // rebuild the scene so Vick appears
    }
  }

  const revelations = {
    solve: {
      requires: ['flour_print', 'recipe_card'],
      audience: ['vick', 'dot', 'chip', 'gus'],
      intro: async (g) => { await g.say('shawn:psychic', 'I am getting... a sweet... glazed... vision...'); },
      steps: [
        { prompt: 'Who reached that high on the back door?', answer: 'flour_print', guesses: ['A GIRAFFE!', 'A TALL... A TALLY-HO!'], final: 'SOMEONE VERY TALL!', pointAt: 'chip' },
        { prompt: 'And where is the recipe now?', answer: 'recipe_card', guesses: ['A VISOR! A VIZIER!', 'A SUN... SUNDAE!'], final: "IN CHIP'S VAN!", pointAt: 'chip',
          after: async (g) => { await g.say('chip:sad', 'Donut King offered me five hundred bucks!'); } },
      ],
      outro: async (g) => { await g.say('dot:happy', 'My recipe! Free maple bars for life!'); await g.say('gus:happy', 'FOR LIFE?'); },
    },
  };

  P.registerChapter({
    id: 'example', number: 99, title: 'THE MISSING MAPLE BAR', tagline: 'Template case. Copy me!',
    pineapple: { scene: 'donutshop', note: 'On the shelf above the display case.' },
    cast, clues, items, gifts, snacks, scenes, revelations,
    hints: [
      { id: 'h1', when: (g) => !g.hasClue('chip_route'), vague: 'Grumpy delivery guys run on caffeine.', specific: 'Ask Dot for a coffee, then show it to Chip.' },
      { id: 'h2', when: (g) => !g.hasClue('flour_print'), vague: 'Look at the doors, Shawn.', specific: 'Use Shawn-Vision on the back door.' },
      { id: 'h3', when: (g) => !g.hasClue('recipe_card'), vague: 'Where does a delivery guy keep his secrets?', specific: 'Open the back door and look at the van.' },
      { id: 'h4', when: () => true, vague: 'Talk to Chip again once you have it all.', specific: 'Then tell Karen you are having a vision.' },
    ],
    map: { donutshop: { name: 'Donut Derby', x: 140, y: 88, scene: 'donutshop', chapter: true, desc: 'Home of the famous maple bar.' } },
    where: { vick: (g) => (g.flag('ready') ? 'donutshop' : 'station') },
    async start(g) {
      g.flashback(true);
      await g.goto('flash85', { instant: true });
      await g.say('younghenry', 'Shawn. Look around. Then close your eyes.');
      const ok = await g.memoryTest({ seconds: 3, question: 'What did the sign say?', options: ['DONUTS', 'BAGELS'], answer: 0 });
      await g.say('younghenry', ok ? 'Good.' : 'Donuts, Shawn. Look harder.');
      await g.fade(true, 500);
      g.flashback(false);
      await g.card({ kicker: 'CASE 99', title: 'THE MISSING MAPLE BAR', sub: 'Present day.' });
      await g.goto('donutshop', { x: 40, y: 152 });
    },
  });
})(window.P);
