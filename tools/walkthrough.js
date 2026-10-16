'use strict';
/* Dev-only automated walkthroughs. Injected by tools/playtest.py.
   Drives the real game through real interactions with dialogue auto-advanced. */
(function (P) {
  const T = P.T = { log: [], errors: [], picks: [], presents: [], mapTo: null, shots: [] };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  T.note = (m) => { T.log.push(m); console.log('[walk] ' + m); };
  T.fail = (m) => { T.errors.push(m); console.error('[walk] FAIL ' + m); };

  P.debugAuto = true;
  P.timeScale = 6;
  P.debugPick = (opts) => {
    const want = T.picks.length ? T.picks.shift() : null;
    let idx = -1;
    if (want != null) idx = opts.findIndex((o) => o.value === want || (typeof want === 'string' && String(o.text).toLowerCase().includes(want.toLowerCase())));
    if (want != null && idx < 0) { T.fail(`option "${want}" not offered; had: ${opts.map((o) => o.text).join(' | ')}`); }
    if (idx < 0) { idx = opts.findIndex((o) => o.value === '__bye' || o.value === 'no'); if (idx < 0) idx = opts.length - 1; }
    while (opts[idx] && opts[idx].disabled && idx < opts.length - 1) idx++;
    return idx;
  };
  P.debugPresent = (w) => {
    const id = T.presents.length ? T.presents.shift() : null;
    if (id && !w.game.state.clues.includes(id) && !w.game.state.items.includes(id) && !w.game.state.gifts.includes(id)) T.fail('tried to present missing ' + id);
    return id;
  };
  P.debugMap = () => T.mapTo;

  T.idle = async (timeout = (P.timeScale < 3 ? 60000 : 9000)) => {
    const t0 = Date.now();
    await sleep(30);
    while (Date.now() - t0 < timeout) {
      const g = P.game;
      if (!g.busy && !g.fadeAnim && g.mode && g.mode.constructor.name === 'Play') { await sleep(30); if (!g.busy && !g.fadeAnim) return true; }
      if (g.mode && g.mode.constructor.name === 'Complete') return true;
      await sleep(25);
    }
    const sc = P.game.scene;
    const acts = sc ? Object.values(sc.actors).map((a) => `${a.id}@${Math.round(a.x)},${Math.round(a.y)}${a.target ? '->' + Math.round(a.target.x) + ',' + Math.round(a.target.y) : ''}`).join(' ') : '';
    T.fail('timeout waiting for idle; ui=' + P.game.ui.map((w) => w.constructor.name).join(',') + ' cut=' + P.game.cutscene + ' mode=' + (P.game.mode && P.game.mode.constructor.name) + ' scene=' + (sc && sc.id) + ' timers=' + P.game.timers.length + ' fade=' + !!P.game.fadeAnim + ' actors: ' + acts);
    throw new Error('stuck');
  };
  T.find = (id, vision = true) => {
    const sc = P.game.scene;
    return sc && sc.interactables(vision).find((o) => o.id === id);
  };
  T.act = async (id, verb = 'use', picks = [], presents = []) => {
    await T.idle();
    T.picks = picks.slice(); T.presents = presents.slice();
    const o = T.find(id);
    if (!o) { T.fail(`no interactable "${id}" in ${P.game.scene && P.game.scene.id}; have: ${(P.game.scene ? P.game.scene.interactables(true).map((q) => q.id) : []).join(',')}`); return false; }
    T.note(`${verb} ${id} @${P.game.scene.id}`);
    P.game.mode.interact(o, verb);
    await T.idle();
    if (T.picks.length) T.fail(`unused picks after ${id}: ${T.picks.join(' | ')}`);
    if (T.presents.length) T.fail(`unused presents after ${id}: ${T.presents.join(' | ')}`);
    return true;
  };
  T.travel = async (sceneId, exitId) => {
    await T.idle();
    T.mapTo = sceneId;
    const ex = exitId || (P.game.scene.def.hotspots || []).find((h) => h.exit === 'map').id;
    await T.act(ex, 'use');
    await T.idle();
    if (P.game.scene.id !== sceneId) T.fail(`expected scene ${sceneId}, in ${P.game.scene.id}`);
  };
  T.expect = (cond, msg) => { if (!cond) T.fail('expectation: ' + msg); else T.note('ok: ' + msg); };
  T.hasClue = (id) => P.game.state && P.game.state.clues.includes(id);
  T.flag = (id) => P.game.state && !!P.game.state.flags[id];

  T.start = async (ch, picks = []) => {
    try { localStorage.clear(); } catch (e) { /* ignore */ }
    P.game.global = { romance: 0, giftsGiven: [], snacks: 0, done: {}, nicknames: 0 };
    T.picks = picks.slice();
    P.audio.unlock();
    P.game.startChapter(ch);
    await sleep(200);
    await T.idle(60000);
  };

  T.ch1 = async () => {
    await T.start('ch1', ['A silver dollar']);
    T.expect(P.game.scene.id === 'office', 'arrived at office after cold open');
    T.expect(T.flag('memory_ok'), 'memory test answered correctly');
    await T.act('fridge', 'use');
    await T.travel('beach');
    T.expect(T.flag('beach_intro'), 'beach intro played');
    // sneak attempt while guard is looking -> caught path should not crash
    await T.act('juliet', 'use', ['What happened here', 'Who could open', 'Anything else missing', 'peek']);
    T.expect(T.hasClue('combo_two'), 'combo clue from Juliet');
    T.expect(!T.flag('juliet_ok'), 'Juliet refuses without a reason');
    await T.act('ricky', 'look');
    T.expect(T.hasClue('ricky_wax'), 'observed Ricky');
    await T.act('ricky', 'use', ['Where were you', 'owe people money', 'anything weird', 'Who is Dewey']);
    await T.act('gil', 'use', ['What happened last night', 'Who knows the combination', 'missing mascot']);
    await T.act('gil', 'look');
    T.expect(T.hasClue('gil_chip'), 'observed Gil chip');
    await T.act('fenwick', 'use', ['Where were you', 'lockbox combo', "Who's winning"]);
    T.expect(T.hasClue('judge_alibi'), 'judge alibi');
    await T.act('mcnab', 'use', ['What are you watching']);
    await T.act('juliet', 'use', ['peek']);
    T.expect(T.flag('juliet_ok'), 'Juliet grants permission');
    await T.act('tentflap', 'use');
    T.expect(P.game.scene.id === 'tent', 'inside tent');
    await T.act('flap', 'look'); await T.act('lockbox', 'look'); await T.act('dent', 'look'); await T.act('hook', 'look'); await T.act('sheets', 'look');
    T.expect(T.hasClue('flap_cut_inside') && T.hasClue('lockbox_unforced') && T.hasClue('drag_marks'), 'tent clues');
    await T.act('out', 'use');
    await T.travel('station');
    await T.act('donuts', 'use');
    // revelation 1: one wrong answer then right ones
    await T.act('vick', 'use', ["having a vision"], ['ricky_wax', 'flap_cut_inside', 'lockbox_unforced']);
    T.expect(T.flag('hired'), 'hired after first revelation');
    T.expect((P.game.state.wrongPresents || 0) === 1, 'wrong answer counted');
    await T.travel('henry');
    await T.act('henry', 'use', ['tells', "Raid Dad's fridge", 'I need a hint']);
    await T.travel('beach');
    await T.act('leilani', 'use', ['Why are you closed']);
    await T.travel('pier');
    T.expect(P.game.scene.id === 'pier', 'pier unlocked');
    await T.act('churros', 'use');
    await T.act('arcade', 'use');
    await T.act('dewey', 'use', ['aunt', 'Where did you leave', "let's go see"]);
    T.expect(T.hasClue('costume_left'), 'costume left clue');
    await T.act('gus', 'use', ['quarters']);
    T.expect(P.game.state.items.includes('quarters'), 'got quarters');
    await T.act('dewey', 'use', ['__present'], ['quarters']);
    T.expect(T.flag('dewey_back'), 'Dewey goes home');
    await T.act('prizes', 'use', ['otter']);
    await T.act('prizes', 'use', ['shark']);
    T.expect(P.game.state.gifts.includes('otterplush'), 'otter gift');
    await T.act('out', 'use');
    await T.act('sal', 'look');
    await T.act('sal', 'use', ['Know Gil']);
    await T.travel('beach');
    await T.act('leilani', 'use', ['What did you see', 'to go']);
    T.expect(T.hasClue('mascot_midnight'), 'Leilani testimony');
    T.expect(P.game.state.gifts.includes('plumeria'), 'plumeria gift');
    await T.travel('pier');
    await T.act('sal', 'use', ['__present'], ['shaveice_togo']);
    T.expect(T.hasClue('gil_debt'), 'Sal spills');
    await T.act('stairs', 'use');
    await T.act('seaglass', 'look');
    await T.act('costume', 'use');
    await T.act('costume', 'look');
    T.expect(T.hasClue('chip_in_costume'), 'chip in costume');
    await T.act('up', 'use');
    await T.travel('beach');
    await T.act('gil', 'look');
    T.expect(T.flag('realized'), 'realization flashback');
    await T.act('van', 'look');
    T.expect(T.hasClue('van_cooler'), 'van cooler');
    await T.travel('station');
    await T.act('juliet', 'use', ['__gift'], ['seaglass']);
    await T.act('juliet', 'use', ['__gift'], ['otterplush']);
    await T.act('juliet', 'use', ['__gift'], ['plumeria']);
    T.expect((P.game.global.romance || 0) === 3, 'romance 3');
    await T.act('vick', 'use', ['big finish'], ['mascot_midnight', 'costume_left', 'chip_in_costume', 'gil_debt', 'van_cooler']);
    await T.idle(60000);
    T.expect(P.game.mode.constructor.name === 'Complete', 'chapter complete screen');
    T.expect(T.flag('jules_date1'), 'Juliet date unlocked');
  };

  T.ch2 = async () => {
    await T.start('ch2', ["jacket pocket"]);
    P.game.global.romance = 3; // as if case 1 went well
    T.expect(P.game.scene.id === 'fair', 'at fairgrounds after cold open');
    T.expect(T.flag('memory_ok') && T.flag('c2_crime'), 'memory test + opening');
    await T.act('tammy', 'use', ['What happened at the tasting', 'threaten', 'Vance', 'Nice hat']);
    await T.act('juliet', 'use', ['What happened']);
    await T.act('lassiter', 'use', ['Still like Tammy']);
    await T.act('thorne', 'look');
    await T.act('thorne', 'use', ['How was Tammy', 'heart condition']);
    T.expect(T.hasClue('thorne_pills'), 'Thorne pills');
    await T.act('vance', 'look');
    await T.act('vance', 'use', ['Tell me about Earl', 'trailer key']);
    await T.act('duane', 'use', ['sorry', 'Who gets', 'burnt ends']);
    await T.act('kenji', 'use', ['pictures', 'see your photos']);
    await T.act('odessa', 'use', ['Why are you closed', 'Did you know Big Earl']);
    await T.travel('morgue');
    await T.act('woody', 'use', ['What killed', 'Not yet']);
    await T.act('woody', 'look');
    T.expect(T.flag('woody_read'), 'read Woody');
    await T.act('woody', 'use', ['What killed', 'Give Woody a reading', 'orange cat', 'Polka', 'stegosaurus']);
    T.expect(T.flag('tox_done'), 'tox results');
    await T.act('lunch', 'look');
    await T.travel('station');
    await T.act('vick', 'use', ['having a vision'], ['tammy_threat', 'sauce_clean', 'digoxin_timing', 'sweet_tea_stomach']);
    T.expect(T.flag('hired'), 'hired');
    await T.travel('fair');
    await T.act('tammy', 'use', []);
    T.expect(P.game.state.gifts.includes('hatpin'), 'hat pin gift');
    await T.act('barn', 'use');
    await T.act('gertrude', 'use', []);
    await T.act('gus', 'use', ['granola']);
    await T.act('gertrude', 'use', ['Offer the granola']);
    T.expect(P.game.state.items.includes('tea_sign'), 'got sign');
    await T.act('ribbon', 'look');
    await T.act('pigs', 'look');
    await T.act('out', 'use');
    await T.act('odessa', 'use', ['Did Earl get tea', 'sweet tea']);
    T.expect(T.hasClue('vance_bought_tea'), 'Odessa testimony');
    await T.act('bale', 'use');
    await T.act('trailerwin', 'use');
    T.expect(P.game.scene.id === 'trailer', 'in trailer via window');
    await T.act('tongs', 'use'); await T.act('desk', 'look'); await T.act('fridge', 'look'); await T.act('photos', 'look');
    await T.act('door', 'use');
    T.expect(P.game.scene.id === 'trailer', 'door blocked after window entry');
    await T.act('window', 'use');
    await T.act('duane', 'use', ['__present'], ['tongs']);
    await T.act('kenji', 'use', ['__present'], ['burntends_plate']);
    T.expect(T.hasClue('photo_tent') && T.hasClue('photo_tea'), 'Kenji photos');
    await T.act('recycling', 'look');
    T.expect(T.hasClue('mason_jar'), 'mason jar');
    await T.act('funnel', 'use');
    for (const gft of ['hatpin', 'jam', 'blueribbon']) await T.act('juliet', 'use', ['__gift'], [gft]);
    await T.travel('station');
    await T.act('vick', 'use', ['fairgrounds'], ['thorne_pills', 'vance_cuff', 'photo_tent', 'photo_tea', 'sale_contract', 'mason_jar']);
    await T.idle(60000);
    T.expect(P.game.mode.constructor.name === 'Complete', 'chapter 2 complete');
    T.expect(T.flag('jules_ferris'), 'Juliet ferris wheel (romance >= 4)');
  };

  T.ch3 = async () => {
    await T.start('ch3', ['The right one']);
    P.game.global.romance = 4; // as if cases 1-2 went fairly well
    T.expect(P.game.scene.id === 'office', 'office after cold open');
    T.expect(T.flag('memory_ok'), 'fog memory test');
    await T.act('tv', 'look');
    await T.travel('foyer');
    T.expect(T.flag('manor_arrive'), 'arrived at manor');
    await T.act('hargrove', 'use', ["Who's here", 'sapphire']);
    await T.act('ozera', 'use', ['real psychic']);
    await T.act('dolores', 'look');
    await T.act('pemberton', 'use', ['polished', "How's business"]);
    await T.act('preston', 'use', ['golf', 'sell the house']);
    await T.act('dolores', 'use', ['Tell me about the sapphire', 'Why a seance', "start the seance"]);
    T.expect(T.flag('seance_done'), 'seance + blackout');
    T.expect(P.game.scene.id === 'foyer', 'back in foyer with police');
    await T.act('lassiter', 'use', ['Still think it was Ozera']);
    await T.act('juliet', 'use', ['What do we know']);
    await T.act('guestbook', 'look');
    T.expect(T.hasClue('guest_log'), 'guest log');
    await T.act('stairs', 'use');
    T.expect(P.game.scene.id === 'foyer', 'Lassiter blocks the stairs');
    await T.act('kitchen', 'use');
    await T.act('rosa', 'use', ['no such thing']);
    await T.act('dumbwaiter', 'use');
    T.expect(P.game.scene.id === 'kitchen', 'Gus refuses without a bribe');
    await T.act('jar', 'use');
    await T.act('dumbwaiter', 'use');
    T.expect(P.game.scene.id === 'basement', 'Gus in the basement');
    T.expect(P.game.scene.actors.shawn.cast === 'gus', 'playing as Gus');
    await T.act('trunk', 'look'); await T.act('wine', 'look');
    await T.act('fusebox', 'look');
    T.expect(T.hasClue('blackout_timer'), 'timer found');
    await T.act('up', 'use');
    T.expect(P.game.scene.id === 'kitchen' && P.game.scene.actors.shawn.cast === 'shawn', 'back as Shawn');
    await T.act('rosa', 'use', ['cleanse', 'Interpretive dance', 'Sprinkle Gus']);
    T.expect(T.flag('rosa_calm'), 'Rosa calmed');
    await T.act('rosa', 'use', ['Preston', 'handle the sapphire']);
    T.expect(T.hasClue('pemberton_alone'), 'Pemberton alone clue');
    await T.act('out', 'use');
    // distraction route upstairs (before being hired)
    await T.act('gus', 'use', ['distract Lassiter', 'feelings']);
    await T.act('gus', 'use', ['distract Lassiter', 'ghost']);
    T.expect(T.flag('lassiter_away'), 'Lassiter distracted');
    await T.act('stairs', 'use');
    T.expect(P.game.scene.id === 'preston', 'upstairs via distraction');
    await T.act('timerbox', 'look'); await T.act('bed', 'look');
    await T.act('golfbag', 'look');
    T.expect(T.hasClue('necklace_found'), 'necklace found');
    await T.act('golfbag', 'use', ['light']);
    await T.act('golfbag', 'use', ['fog']);
    T.expect(T.hasClue('fog_test'), 'fog test');
    await T.act('down', 'use');
    T.expect(!T.flag('lassiter_away'), 'Lassiter back');
    await T.act('vick', 'use', ['having a vision'], ['ozera_record', 'blackout_timer', 'guest_log']);
    T.expect(T.flag('hired'), 'hired');
    await T.act('ozera', 'use', []);
    T.expect(P.game.state.gifts.includes('tarot'), 'tarot gift');
    await T.act('closet', 'look');
    await T.act('pemberton', 'look');
    T.expect(T.hasClue('pemberton_broke') && T.hasClue('thick_watch'), 'Pemberton clues');
    await T.act('library', 'use');
    await T.act('hargrove', 'use', []);
    await T.act('gus', 'use', ['concussion']);
    await T.act('hargrove', 'use', ['__present'], ['salts']);
    T.expect(T.flag('hargrove_awake'), 'Hargrove awake');
    await T.act('hargrove', 'use', ['What happened in the dark']);
    await T.act('poems', 'look');
    await T.act('out', 'use');
    await T.act('parlor', 'use');
    await T.act('table', 'look'); await T.act('canapes', 'use');
    await T.act('out', 'use');
    for (const gft of ['cameo', 'tarot', 'pressedrose']) await T.act('juliet', 'use', ['__gift'], [gft]);
    T.expect((P.game.global.romance || 0) >= 6, 'romance >= 6');
    await T.act('vick', 'use', ['seance of my own'], ['timer_set', 'fog_test', 'pemberton_alone', 'pemberton_broke', 'thick_watch']);
    await T.idle(60000);
    T.expect(P.game.mode.constructor.name === 'Complete', 'chapter 3 complete');
    T.expect(T.flag('jules_umbrella'), 'umbrella moment');
  };

  T.example = async () => {
    await new Promise((res) => { const sc = document.createElement('script'); sc.src = 'src/chapters/_template.js'; sc.onload = res; document.body.appendChild(sc); });
    await T.start('example', ['DONUTS']);
    T.expect(P.game.scene.id === 'donutshop', 'template: in the shop');
    await T.act('dot', 'use', ['What happened', 'coffee']);
    await T.act('chip', 'use', ['__present'], ['coffee']);
    T.expect(T.hasClue('chip_route'), 'template: Chip talks');
    await T.act('backdoor', 'look'); await T.act('backdoor', 'use'); await T.act('van', 'look');
    await T.act('case', 'use'); await T.act('keychain', 'look');
    await T.act('chip', 'use', []);
    T.expect(T.flag('ready'), 'template: Vick called');
    await T.act('vick', 'use', [], ['flour_print', 'recipe_card']);
    await T.idle(30000);
    T.expect(P.game.mode.constructor.name === 'Complete', 'template: case closed');
  };

  T.sneak = async () => {
    try { localStorage.clear(); } catch (e) { /* ignore */ }
    P.audio.unlock();
    const st = P.game.newState('ch1'); Object.assign(st.flags, { c1_intro: 1, beach_intro: 1 }); st.scene = 'beach'; st.px = 200; st.py = 156;
    await P.game.startChapter('ch1', { state: st });
    await T.idle();
    P.timeScale = 1;
    const mc = P.game.scene.actors.mcnab;
    const waitFace = async (f, minLeft) => { for (let i = 0; i < 400; i++) { const gd = mc.guard; if (mc.face === f && gd.timer > minLeft) return; await sleep(25); } T.fail('guard never faced ' + f); };
    // 1) walk in while he is watching -> caught
    await waitFace(-1, 2.2);
    await T.act('tentflap', 'use');
    T.expect(P.game.scene.id === 'beach', 'caught while McNab watches (still on the beach)');
    // 2) wait for his back to turn -> slip in
    await waitFace(1, 2.0);
    await T.act('tentflap', 'use');
    T.expect(P.game.scene.id === 'tent', 'slipped into the tent while McNab watched the surf');
    T.expect(T.flag('sneaked'), 'sneak flag set');
    // 3) the softlock fix: quarters before asking about the suit still yields costume_left
    const st2 = P.game.newState('ch1'); Object.assign(st2.flags, { c1_intro: 1, beach_intro: 1, hired: 1, pier_known: 1, met_dewey: 1, dewey_found: 1, dewey_needs_quarters: 1 }); st2.items = ['quarters']; st2.scene = 'arcade'; st2.px = 60; st2.py = 152;
    P.timeScale = 6;
    await P.game.startChapter('ch1', { state: st2 });
    await T.idle();
    await T.act('dewey', 'use', ['__present'], ['quarters']);
    T.expect(T.hasClue('costume_left'), 'Dewey still tells you where he left the suit');
  };

  T.run = async (name) => {
    try { await T[name](); } catch (e) { T.fail('exception: ' + (e && e.stack || e)); }
    return { errors: T.errors, log: T.log };
  };
})(window.P);
