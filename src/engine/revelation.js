'use strict';
/* Psychic Revelations.
   A revelation is a sequence of steps. For each step the player presents the clue that proves it.
   Correct -> Shawn gyrates through slightly-wrong "garbled" guesses from the spirit world, then nails it.
   Wrong   -> the vision fizzles and Lassiter's skepticism rises. Three strikes and you're out (for now). */
(function (P) {
  const G = P.G, U = P.U, UI = P.UI;
  const F = () => P.font;

  const MOVES = ['reel', 'crouchVision', 'tiptoe', 'stagger', 'kneel', 'wave', 'conduct', 'horse', 'hipsSway', 'flail', 'jazz', 'spin', 'lunge', 'frontArmsUp', 'frontTemples', 'frontStar', 'frontSquat', 'temple2', 'hop'];
  const ALT = {
    wave: (t) => (Math.floor(t * 5) % 2 ? P.Poses.wave1() : P.Poses.wave2()),
    conduct: (t) => (Math.floor(t * 4) % 2 ? P.Poses.conduct1() : P.Poses.conduct2()),
  };
  const WRONG_GARBLE = [
    'I SEE... A LLAMA IN A TRENCH COAT!', 'THE SPIRITS SAY... "NEW PHONE, WHO DIS?"', 'I\'M GETTING... A STRONG SENSE OF... NACHOS?',
    'THERE IS A... DOLPHIN! NO! A DOLPH LUNDGREN!', 'THE NUMBER... SEVEN! OR... FOURTEEN! OR A BEE!', 'I SEE A... OH. THAT\'S MY REFLECTION.',
    'THE SPIRITS ARE... SINGING... HALL AND OATES?', 'A MAN... NAMED... DAVE! WAIT. NO DAVES.',
  ];
  const SHAWN_RECOVER = [
    "Hold on, that was a pocket dial from the spirit world.", "The spirits are saying... nope, that's my stomach.", "Okay, that one came in on the wrong frequency. Spirit AM radio.",
    "My third eye has something in it. An eyelash, I think.", "False alarm. That was a ghost doing an impression of a clue.",
  ];
  const SKEPTIC_LINES = [
    ['lassiter:stern', 'Unbelievable. Chief, he is literally making this up.'], ['lassiter:smug', 'Spirits seem a little foggy today, Spencer.'], ['lassiter:angry', "That's strike number {n}, Spencer. I'm counting."],
    ['lassiter:stern', 'Is this the part where you fall down? I like the part where you fall down.'],
  ];

  const R = P.Revelation = {
    async run(g, id) {
      const game = g.game, ch = g.chapter, rev = ch.revelations[id];
      if (!rev) { console.warn('no revelation', id); return false; }
      if (rev.requires && !g.hasAll(rev.requires)) {
        await g.say('shawn:worried', "I'm getting... static. The spirits need more before they'll talk.");
        return false;
      }
      const st0 = { id, t: 0, aura: 0, banner: null, guess: null, big: null, skeptic: g.s.skepticism || 0, audience: rev.audience || [] };
      game.rev = st0;
      const prevMusic = P.audio.current;
      if (rev.intro) await rev.intro(g);
      P.audio.music(rev.music || 'vision');
      g.sfx('psychic');
      st0.aura = 1;
      g.anim('shawn', 'temple');
      g.flash('#c8a0ff', 300);
      await g.wait(600);
      const cleanup = () => { st0.aura = 0; game.rev = null; g.stopAnim('shawn'); if (g.actor('gus')) g.stopAnim('gus'); P.audio.music(U.call(game.scene.def.music, g) || prevMusic); };
      for (let i = 0; i < rev.steps.length; i++) {
        const step = rev.steps[i];
        for (;;) {
          st0.banner = { text: step.prompt, n: i + 1, total: rev.steps.length, t: 0 };
          if (step.lead) await g.say(step.leadWho || 'shawn:psychic', step.lead);
          const pick = await g.pick(step.kinds || ['clues', 'items'], step.short || 'Which clue proves it?');
          if (!pick) {
            st0.banner = null;
            await g.say('shawn:worried', "Hold on. The spirits put me on hold. I'm getting smooth jazz.");
            await g.say('gus', "He'll... he'll call them back.");
            cleanup();
            return false;
          }
          if (U.toArr(step.answer).includes(pick)) { await R.correct(g, st0, step, i); break; }
          const sk = await R.wrong(g, st0, step, pick);
          if (sk >= 3) {
            st0.banner = null;
            if (rev.fail) await rev.fail(g);
            else {
              await g.say('vick:stern', "That's enough, Mr. Spencer. Come back when the spirits have their facts straight.");
              await g.say('shawn:worried', "They're very disorganized. It's a union thing.");
            }
            g.s.skepticism = 0;
            cleanup();
            return false;
          }
        }
      }
      st0.banner = null;
      g.s.revDone[id] = true;
      g.s.skepticism = 0;
      if (rev.outro) await rev.outro(g);
      cleanup();
      game.autosave();
      return true;
    },

    async correct(g, st0, step, idx) {
      g.sfx('correct');
      st0.banner = Object.assign({}, st0.banner, { solved: true });
      const guesses = step.guesses || [];
      const moves = step.moves || U.shuffle(MOVES);
      const sh = g.actor('shawn');
      const baseX = sh.x;
      for (let k = 0; k < guesses.length; k++) {
        const mv = moves[k % moves.length];
        await R.move(g, mv, sh, baseX + (k % 2 ? -10 : 10) * (step.roam === false ? 0 : 1));
        st0.guess = { text: guesses[k], t: 0, k };
        g.sfx('spirit');
        R.react(g, st0, k);
        if (g.actor('gus') && (step.gusJoins || (k === 1 && Math.random() < 0.5))) g.anim('gus', U.pick(['jazz', 'hipsSway', 'temple', 'wave']), 900);
        await g.wait(step.beat || 1050);
      }
      // the landing
      st0.guess = null;
      g.stopAnim('shawn');
      if (step.pointAt && g.actor(step.pointAt)) g.face('shawn', step.pointAt);
      g.anim('shawn', 'point');
      st0.big = { text: step.final, t: 0 };
      g.sfx('reveal'); g.flash('#ffffff', 250); g.shake(350, 3);
      if (g.actor('gus')) g.anim('gus', 'armsUp', 900);
      await g.wait(1600);
      st0.big = null;
      g.stopAnim('shawn');
      sh.x = U.lerp(sh.x, baseX, 1);
      if (step.after) await step.after(g);
    },

    async wrong(g, st0, step, pick) {
      g.s.wrongPresents = (g.s.wrongPresents || 0) + 1;
      const custom = step.wrong && step.wrong[pick];
      g.anim('shawn', 'flail', 900);
      st0.guess = { text: U.pick(WRONG_GARBLE), t: 0, bad: true };
      g.sfx('spirit');
      await g.wait(1000);
      st0.guess = null;
      g.sfx('wrong'); g.shake(250, 2);
      g.anim('shawn', 'shrug', 900);
      if (custom) await custom(g);
      else await g.say('shawn:worried', U.pick(SHAWN_RECOVER));
      const sk = g.skepticism(1);
      st0.skeptic = sk;
      const skeptic = st0.audience.includes('lassiter') || g.actor('lassiter') ? 'lassiter' : null;
      if (skeptic && sk < 3) { const [who, line] = U.pick(SKEPTIC_LINES); await g.say(who, line.replace('{n}', ['one', 'two', 'three'][sk - 1] || sk)); }
      if (sk < 3 && step.hint) await g.say('gus:worried', step.hint);
      return sk;
    },

    async move(g, mv, sh, toX) {
      if (mv === 'spin') {
        const views = [['frontIdle', 1], ['stand', 1], ['back', 1], ['stand', -1]];
        for (let r = 0; r < 2; r++) for (const [p, f] of views) { sh.anim = p; sh.face = f; g.sfx('step'); await g.wait(75); }
        sh.anim = 'frontArmsUp'; sh.animT = 0;
        return;
      }
      if (mv === 'hop') { sh.anim = 'armsUp'; await g.hop('shawn', 12); return; }
      if (toX != null && Math.abs(toX - sh.x) > 2) { sh.scripted = true; sh.walkTo(toX, sh.y, { run: true }).then(() => { sh.scripted = false; }); await g.wait(120); }
      sh.anim = ALT[mv] || mv; sh.animT = 0; sh.animUntil = 0;
    },

    react(g, st0, k) {
      const sc = g.scene; if (!sc) return;
      const ids = st0.audience.length ? st0.audience : Object.keys(sc.actors).filter((i) => i !== 'shawn');
      const who = ids[(k + Math.floor(Math.random() * ids.length)) % ids.length];
      const map = { lassiter: ['...', 'anger', '...'], juliet: ['?', 'heart', '!'], vick: ['...', '?', '!'], gus: ['sweat', '!', 'music'], mcnab: ['!', '?', 'music'], henry: ['...', 'anger'] };
      const opts = map[who] || ['!', '?', '...'];
      g.emote(who, U.pick(opts), 900);
    },

    /* aura is painted under the actors (hooked from Scene.draw) */
    drawAura(x, game, cam) {
      const st0 = game.rev; if (!st0 || !st0.aura) return;
      const sh = game.scene && game.scene.actors.shawn; if (!sh) return;
      const t = game.t;
      const cx = Math.round(sh.x - cam), cy = Math.round(sh.y - 30);
      const cols = ['#3a1a6a', '#5a2a8a', '#8a3aa0', '#b04aa8', '#5ac8c8', '#9be564', '#fee761'];
      x.save();
      x.globalAlpha = 0.55;
      for (let r = 90; r > 6; r -= 6) {
        const c = cols[(Math.floor(r / 6 + t * 10)) % cols.length];
        G.ellipse(x, cx, cy, r * 1.15, r * 0.75, c);
      }
      x.globalAlpha = 0.8;
      for (let i = 0; i < 12; i++) {
        const a = t * 1.5 + (i / 12) * Math.PI * 2;
        G.line(x, cx + Math.cos(a) * 30, cy + Math.sin(a) * 20, cx + Math.cos(a) * 80, cy + Math.sin(a) * 52, i % 2 ? '#fee761' : '#9be564');
      }
      x.restore();
    },

    drawOverlay(x, game) {
      const st0 = game.rev; if (!st0) return;
      st0.t += 1 / 60;
      const t = game.t;
      // vignette
      if (st0.aura) { x.save(); for (let i = 0; i < 14; i++) { x.globalAlpha = 0.07; G.frame(x, i * 2, i * 2, P.W - i * 4, P.H - i * 4, '#1a0a2a'); G.frame(x, i * 2 + 1, i * 2 + 1, P.W - i * 4 - 2, P.H - i * 4 - 2, '#1a0a2a'); } x.restore(); }
      // skeptic-o-meter
      if (st0.aura && !game.ui.some((w) => w instanceof UI.Dialogue && w.pos === 'top')) {
        UI.panel(x, P.W - 96, 3, 93, 14, { accent: '#e43b44' });
        F().draw(x, 'LASSIE-METER', P.W - 92, 7, '#ffb0b0');
        for (let i = 0; i < 3; i++) G.rect(x, P.W - 25 + i * 7, 6, 5, 8, i < (game.state.skepticism || 0) ? '#e43b44' : '#3a2e70');
      }
      // banner (prompt) — shown when not covered by a top dialogue
      const topDlg = game.ui.some((w) => (w instanceof UI.Dialogue) && w.pos === 'top');
      if (st0.banner && !topDlg && !game.ui.some((w) => w instanceof UI.CaseFile)) {
        const b = st0.banner;
        const lines = F().wrap(b.text, 220);
        const h = 16 + lines.length * 10;
        UI.panel(x, 4, 3, 226, h, { fill: ['#3a1a5a', '#321650', '#2a1246', '#22103c'], accent: '#fee761' });
        F().draw(x, `VISION ${b.n}/${b.total}` + (b.solved ? '  ★' : ''), 10, 7, '#fee761');
        lines.forEach((l, i) => F().draw(x, l, 10, 17 + i * 10, '#ffffff', { shadow: '#0e0a14' }));
      }
      if (st0.guess) {
        st0.guess.t += 1 / 60;
        const gt = st0.guess.t;
        const s = Math.min(1, gt / 0.18);
        const col = st0.guess.bad ? '#ff8a8a' : ['#fee761', '#9be564', '#7ae2f8', '#ff8ab8'][st0.guess.k % 4];
        const lines = F().wrap(st0.guess.text, 150);
        lines.forEach((l, i) => F().draw(x, l, 160, 58 + i * 18 - (1 - s) * 10, col, { align: 'center', scale: 2, outline: '#1a0a2a', wave: t }));
      }
      if (st0.big) {
        st0.big.t += 1 / 60;
        const bt = st0.big.t;
        const s = U.ease.outBack(Math.min(1, bt / 0.35));
        // starburst
        x.save(); x.globalAlpha = Math.max(0.25, 0.6 - bt * 0.3);
        for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + bt; G.poly(x, [[160, 62], [160 + Math.cos(a) * 200, 62 + Math.sin(a) * 200], [160 + Math.cos(a + 0.16) * 200, 62 + Math.sin(a + 0.16) * 200]], i % 2 ? '#fee761' : '#ff9a3c'); }
        x.restore();
        const lines = F().wrap(st0.big.text, 100);
        const sc = s > 0.5 ? 3 : 2;
        lines.forEach((l, i) => F().draw(x, l, 160, 50 + i * 26 - lines.length * 6, '#ffffff', { align: 'center', scale: sc, outline: '#1a0a2a', shake: bt < 0.4 ? 2 : 0 }));
      }
    },
  };
})(window.P);
