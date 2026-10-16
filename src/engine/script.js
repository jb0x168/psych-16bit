'use strict';
/* The chapter scripting API. Every chapter script receives `g`:
     await g.say('shawn:smug', 'Text');      await g.walk('gus', 120, 150);
     if (await g.ask('lassiter', 'Well?', ['Yes', 'No']) === 0) ...
   See docs/CHAPTER_GUIDE.md for the full reference. */
(function (P) {
  const U = P.U, UI = P.UI;

  class Script {
    constructor(game) { this.game = game; }
    get s() { return this.game.state; }
    get scene() { return this.game.scene; }
    get chapter() { return this.game.chapter; }
    get global() { return this.game.global; }

    /* ---------- state ---------- */
    flag(n) { return !!(this.s && this.s.flags[n]); }
    get(n) { return this.s ? this.s.flags[n] : undefined; }
    set(n, v = true) { this.s.flags[n] = v; }
    unset(n) { delete this.s.flags[n]; }
    inc(n, d = 1) { this.s.flags[n] = (this.s.flags[n] || 0) + d; return this.s.flags[n]; }
    once(n) { if (this.flag(n)) return false; this.set(n); return true; }
    hasClue(id) { return this.s.clues.includes(id); }
    hasItem(id) { return this.s.items.includes(id); }
    hasGift(id) { return this.s.gifts.includes(id); }
    has(id) { return this.hasClue(id) || this.hasItem(id) || this.hasGift(id); }
    hasAll(ids) { return ids.every((i) => this.has(i)); }
    count(kind) { return (this.s[kind] || []).length; }
    get here() { return this.scene ? this.scene.id : null; }
    talked(npc, topic) { return !!this.s.talked[npc + ':' + topic]; }
    met(npc) { return !!this.s.met[npc]; }

    /* ---------- dialogue ---------- */
    async say(who, text, o = {}) {
      if (Array.isArray(text)) { for (const t of text) await this.say(who, t, o); return; }
      await this.game.push(new UI.Dialogue(this.game, who, text, o)).promise;
    }
    async lines(list) { for (const l of list) { if (typeof l === 'function') await l(this); else await this.say(l[0], l[1], l[2] || {}); } }
    think(text) { return this.say('thought', text, { thought: true }); }
    narrate(text) { return this.say('narrator', text); }
    async choose(options, o = {}) { return this.game.push(new UI.Choice(this.game, options, o)).promise; }
    async ask(who, text, options, o = {}) {
      // show the question; it stays on screen (held) beneath the menu
      const d = new UI.Dialogue(this.game, who, text, o);
      d.hold = true;
      this.game.push(d);
      while (d.typing && !d.done) await this.wait(16);
      const r = await this.choose(options, o);
      d.close(true);
      return r;
    }
    /* Topic menu loop for NPC conversations.
       list: [{id, label, when?, once?, run: async g => {}, done?: bool}] ; returns when the player leaves. */
    async topics(npc, list, o = {}) {
      const key = (t) => npc + ':' + t.id;
      for (;;) {
        const avail = list.filter((t) => !t.when || t.when(this)).filter((t) => !(t.once && this.s.talked[key(t)]) || t.keep);
        const opts = avail.map((t) => ({ text: U.call(t.label, this), value: t.id, done: !!this.s.talked[key(t)] && !t.fresh }));
        if (o.present !== false && (this.s.clues.length || this.s.items.length)) opts.push({ text: o.presentLabel || 'Show evidence...', value: '__present' });
        if (o.give !== false && this.s.gifts.length && npc === 'juliet') opts.push({ text: 'Give something...', value: '__gift' });
        opts.push({ text: o.byeLabel || 'Goodbye', value: '__bye' });
        const c = P.getCast(npc);
        const pick = await this.choose(opts, { title: o.title || (c ? c.short : npc), cancel: '__bye', auto: 'topic' });
        if (pick === '__bye') { if (o.bye) await o.bye(this); return; }
        if (pick === '__present') { await this.presentTo(npc, o.onPresent); continue; }
        if (pick === '__gift') { await this.giveGift(); continue; }
        const t = avail.find((x) => x.id === pick);
        if (!t) continue;
        const first = !this.s.talked[key(t)];
        this.s.talked[key(t)] = true;
        const r = await t.run(this, first);
        if (r === 'exit' || o.single) return;
      }
    }
    async presentTo(npc, handler) {
      const id = await this.pick(['clues', 'items'], 'Show to ' + (P.getCast(npc) ? P.getCast(npc).short : npc) + '?');
      if (!id) return;
      const def = this.chapter.clues[id] || this.chapter.items[id] || {};
      let handled = false;
      if (handler) handled = await handler(this, id);
      if (!handled) {
        const h = this.chapter.reactions && this.chapter.reactions[npc];
        if (h && h[id]) { await h[id](this); handled = true; }
      }
      if (!handled) {
        const generic = [
          [npc, 'I have no idea why you are showing me that.'],
          [npc, 'Is that... supposed to mean something to me?'],
          [npc, "Mm-hm. That's a " + (def.name || 'thing') + '. Good for you.'],
        ];
        await this.say(...U.pick(generic));
        await this.say('gus', U.pick(['Shawn, put that away.', 'Smooth, Shawn. Real smooth.', 'Maybe show that to someone it matters to.']));
      }
    }
    async giveGift() {
      const id = await this.pick(['gifts'], 'Give to Juliet?');
      if (!id) return;
      const def = this.chapter.gifts[id];
      this.s.gifts = this.s.gifts.filter((x) => x !== id);
      this.global.giftsGiven = (this.global.giftsGiven || []).concat(id);
      if (def && def.give) await def.give(this);
      else await this.say('juliet:happy', "For me? Shawn, that's... actually really sweet.");
      await this.romance(def && def.romance != null ? def.romance : 1);
    }

    /* ---------- evidence / inventory ---------- */
    async clue(id, o = {}) {
      if (this.hasClue(id)) return false;
      const def = this.chapter.clues[id];
      if (!def) console.warn('unknown clue', id);
      this.s.clues.push(id);
      if (o.zoom || (def && def.zoom && o.zoom !== false)) await this.zoom(Object.assign({ icon: def && def.icon, title: def && def.name, text: def && (def.notice || def.desc) }, o.zoom === true ? {} : o.zoom || {}, typeof def.zoom === 'object' ? def.zoom : {}));
      P.audio.sfx('clue');
      this.game.toast('Clue: ' + (def ? def.name : id), def && def.icon, '#fee761');
      this.game.autosave();
      return true;
    }
    async item(id, o = {}) {
      if (this.hasItem(id)) return false;
      this.s.items.push(id);
      const def = this.chapter.items[id] || P.world.items[id];
      P.audio.sfx('item');
      this.game.toast('Got: ' + (def ? def.name : id), def && def.icon, '#7ee2d0');
      return true;
    }
    take(id) { this.s.items = this.s.items.filter((x) => x !== id); }
    async gift(id) {
      if (this.hasGift(id) || (this.global.giftsGiven || []).includes(id)) return false;
      this.s.gifts.push(id);
      const def = this.chapter.gifts[id];
      P.audio.sfx('heart');
      this.game.toast('For Jules: ' + (def ? def.name : id), def && def.icon, '#ff8ab8');
      return true;
    }
    async snack(id, o = {}) {
      const def = this.chapter.snacks[id] || P.world.snacks[id] || { name: id, icon: 'taco' };
      const sh = this.scene && this.scene.actors.shawn, gu = this.scene && this.scene.actors.gus;
      if (sh) sh.setAnim('eat', 1400); if (gu && o.both !== false) gu.setAnim('eat', 1400);
      P.audio.sfx('munch');
      await this.wait(700);
      if (!this.s.snacks.includes(id)) {
        this.s.snacks.push(id);
        this.global.snacks = (this.global.snacks || 0) + 1;
        this.game.toast('Snack logged: ' + def.name, def.icon, '#feae34');
      }
      await this.wait(500);
      if (def.after) await def.after(this);
    }
    async pick(kinds, prompt) { return this.game.push(new UI.CaseFile(this.game, { pick: true, kinds, prompt })).promise; }
    objective(text) {
      if (this.s.objective === text) return;
      this.s.objective = text;
      this.game.showObjective();
    }
    async romance(n = 1) {
      this.global.romance = Math.max(0, (this.global.romance || 0) + n);
      this.s.romanceGained = (this.s.romanceGained || 0) + n;
      if (n > 0) { P.audio.sfx('heart'); this.game.toast('Juliet +' + n + ' ♥', 'heart', '#ff8ab8'); const j = this.scene && this.scene.actors.juliet; if (j) j.emo('heart', 1600); }
      this.game.saveGlobal();
    }

    /* ---------- actors ---------- */
    actor(id) { return this.scene && this.scene.actors[id]; }
    async walk(id, x, y, o = {}) {
      const a = this.actor(id);
      if (!a) return;
      a.scripted = true;
      const f = this.scene.floor;
      if (o.ghost || x < f.x0 || x > f.x1 || (y != null && (y < f.y0 || y > f.y1))) a.ghost = true;
      await a.walkTo(x, y == null ? a.y : y, o);
      a.ghost = false;
      if (!o.keepScripted) a.scripted = false;
      if (o.face) this.face(id, o.face);
    }
    walkNoWait(id, x, y, o = {}) { const a = this.actor(id); if (a) { a.scripted = true; const f = this.scene.floor; if (x < f.x0 || x > f.x1) a.ghost = true; a.walkTo(x, y == null ? a.y : y, o).then(() => { a.scripted = false; a.ghost = false; }); } }
    async approach(id, targetId, gap = 26) {
      const a = this.actor(id), t = this.actor(targetId);
      if (!a || !t) return;
      const side = a.x < t.x ? -1 : 1;
      const [x, y] = this.scene.clampToFloor(t.x + side * gap, t.y + (id === 'gus' ? -3 : 0));
      await this.walk(id, x, y);
      this.face(id, targetId);
    }
    face(id, dir) {
      const a = this.actor(id); if (!a) return;
      if (dir === 'left') a.face = -1; else if (dir === 'right') a.face = 1;
      else if (typeof dir === 'number') a.face = dir < a.x ? -1 : 1;
      else { const t = this.actor(dir); if (t) a.face = t.x < a.x ? -1 : 1; }
    }
    faceEach(a, b) { this.face(a, b); this.face(b, a); }
    anim(id, pose, ms) { const a = this.actor(id); if (a) a.setAnim(pose, ms); }
    stopAnim(id) { const a = this.actor(id); if (a) { a.anim = null; a.animUntil = 0; } }
    expr(id, e) { const a = this.actor(id); if (a) a.expr = e; }
    bubble(id, text, ms) { const a = this.actor(id); if (a) a.say(text, ms); }
    emote(id, kind, ms) { const a = this.actor(id); if (a) a.emo(kind, ms); }
    spawn(id, def) {
      if (!this.scene) return null;
      const d = Object.assign({ id, cast: id }, def);
      return this.scene.addActor(d);
    }
    remove(id) { if (this.scene) this.scene.removeActor(id); }
    // re-create an actor from the scene definition (restores talk handlers) at its current spot
    respawn(id) {
      const sc = this.scene; if (!sc) return;
      const cur = sc.actors[id];
      const d = (sc.def.actors || []).find((a) => a.id === id);
      if (!d) return;
      sc.removeActor(id);
      const a = sc.addActor(Object.assign({}, d, cur ? { x: cur.x, y: cur.y, face: cur.face < 0 ? 'left' : 'right' } : {}));
      return a;
    }
    show(id, v = true) { const a = this.actor(id); if (a) a.visible = v; }
    place(id, x, y, face) { const a = this.actor(id); if (!a) return; a.stop(); a.x = x; if (y != null) a.y = y; if (face) this.face(id, face); }
    async hop(id, h = 8) {
      const a = this.actor(id); if (!a) return;
      for (let t = 0; t <= 1; t += 0.08) { a.offY = -Math.sin(t * Math.PI) * h; await this.wait(16); }
      a.offY = 0;
    }
    async stage(map) {
      // teleport actors into formation behind a quick fade
      await this.fade(true, 250);
      for (const [id, v] of Object.entries(map)) {
        let a = this.actor(id);
        if (!a && v.spawn !== false) a = this.spawn(id, { x: v[0], y: v[1] });
        if (a) { a.stop(); a.visible = true; a.x = v[0]; a.y = v[1]; if (v[2]) this.face(id, v[2]); }
      }
      if (this.scene) this.scene.camSnap = true;
      await this.fade(false, 250);
    }
    follow(id, leader) { const a = this.actor(id); if (a) a.follow = leader; }

    /* ---------- fx / flow ---------- */
    wait(ms) { return this.game.wait(ms); }
    fade(out, ms = 400, col) { return this.game.fadeTo(out ? 1 : 0, ms, col); }
    flash(col = '#ffffff', ms = 200) { this.game.flash = { col, t: 0, dur: ms / 1000 }; }
    shake(ms = 300, mag = 3) { this.game.shakeT = ms / 1000; this.game.shakeMag = mag; }
    sfx(n) { P.audio.sfx(n); }
    music(n) { P.audio.music(n); }
    async zoom(o) {
      // o.at: hotspot id | actor id | [x,y] (world)
      let sx = 160, sy = 90;
      const sc = this.scene;
      if (sc) {
        const cam = sc.camX;
        if (Array.isArray(o.at)) { sx = o.at[0] - cam; sy = o.at[1]; }
        else if (o.at && sc.actors[o.at]) { const a = sc.actors[o.at]; sx = a.x - cam; sy = a.y - a.height * 0.6; }
        else if (o.at) { const h = (sc.def.hotspots || []).find((q) => q.id === o.at); if (h) { sx = h.x + h.w / 2 - cam; sy = h.y + h.h / 2; } }
        else if (this.game.lastTarget) { sx = this.game.lastTarget[0] - cam; sy = this.game.lastTarget[1]; }
      }
      this.game.renderFrame(true);
      await this.game.push(new UI.Zoom(this.game, Object.assign({}, o, { sx: U.clamp(sx, 26, P.W - 26), sy: U.clamp(sy, 18, P.H - 18) }))).promise;
    }
    async card(o) { await this.game.push(new UI.TitleCard(this.game, o)).promise; }
    async message(title, body, o) { await this.game.push(new UI.Message(this.game, title, body, o)).promise; }
    toast(t, icon, col) { this.game.toast(t, icon, col); }
    async goto(sceneId, o = {}) { await this.game.gotoScene(sceneId, o); }
    async revelation(id) { return P.Revelation.run(this, id); }
    async memoryTest(o) { return P.Flashback.memoryTest(this, o); }
    async flashback(on) { this.game.flashbackFx = on; }
    async phoneHenry() { return this.game.henryCall(this); }
    async complete(o) { return this.game.completeChapter(o || {}); }
    async map() { return this.game.openMap(); }
    skepticism(d) { this.s.skepticism = U.clamp((this.s.skepticism || 0) + d, 0, 3); return this.s.skepticism; }

    /* Shawn's signature move: introducing Gus by a ridiculous name. Returns the name used. */
    async introGus(npc) {
      const used = this.s.nicknamesUsed || (this.s.nicknamesUsed = []);
      const pool = P.world.nicknames.filter((n) => !used.includes(n));
      const nick = U.pick(pool.length ? pool : P.world.nicknames);
      used.push(nick);
      this.global.nicknames = (this.global.nicknames || 0) + 1;
      await this.say('shawn:smug', `I'm Shawn Spencer, psychic. And this is my associate, {y}${nick}{/}.`);
      const reacts = ["That is not my name.", "Burton Guster. Please. Just... Guster.", '*sigh* Hi.', "He's been doing this for twenty years.", 'You know that is not my name, Shawn.'];
      await this.say('gus:angry', U.pick(reacts));
      return nick;
    }
  }
  P.Script = Script;
})(window.P);
