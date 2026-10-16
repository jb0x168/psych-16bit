'use strict';
/* Main loop, modes, player control, HUD, saving. */
(function (P) {
  const G = P.G, U = P.U, UI = P.UI;
  const F = () => P.font, I = () => P.input;
  const ACC = UI.ACC;
  const SAVE = 'psych16_save_v1', GLOBAL = 'psych16_global_v1', SETTINGS = 'psych16_settings_v1';

  class Game {
    constructor() {
      this.ui = []; this.toasts = []; this.timers = [];
      this.t = 0; this.cutscene = 0; this.vision = false;
      this.fade = 0; this.fadeCol = '#0e0a14'; this.fadeAnim = null;
      this.shakeT = 0; this.shakeMag = 0; this.flash = null;
      this.settings = Object.assign({ textSpeed: 55, dialoguePos: 'top' }, P.store.get(SETTINGS, {}));
      this.dialoguePos = this.settings.dialoguePos || 'top';
      this.global = Object.assign({ romance: 0, giftsGiven: [], snacks: 0, done: {}, nicknames: 0 }, P.store.get(GLOBAL, {}));
      this.g = new P.Script(this);
      this.chapter = null; this.state = null; this.scene = null;
      this.banterT = 30; this.banterBusy = false; this.banterSeen = new Set();
      this.objT = 0;
      this.label = null;
    }
    init(canvas) {
      this.canvas = canvas; this.buf = canvas;
      canvas.width = P.W; canvas.height = P.H;
      this.x = canvas.getContext('2d'); this.x.imageSmoothingEnabled = false;
      P.input.attach(canvas);
      const fit = () => {
        const w = window.innerWidth, h = window.innerHeight;
        let s = Math.min(w / P.W, h / P.H);
        if (s >= 2) s = Math.floor(s);
        canvas.style.width = Math.floor(P.W * s) + 'px'; canvas.style.height = Math.floor(P.H * s) + 'px';
      };
      window.addEventListener('resize', fit); document.addEventListener('fullscreenchange', fit); fit();
      this.mode = new Boot(this);
      let last = performance.now();
      const frame = (now) => {
        let dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (P.timeScale) dt *= P.timeScale;
        try { this.update(dt); this.render(); } catch (e) { console.error(e); }
        P.input.endFrame();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
    saveSettings() { P.store.set(SETTINGS, this.settings); }
    saveGlobal() { P.store.set(GLOBAL, this.global); }
    toggleFullscreen() {
      try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); } catch (e) { /* not allowed */ }
    }

    /* ---------- widget + timing plumbing ---------- */
    push(w) { if (w.modal === false) this.toasts.push(w); else this.ui.push(w); return w; }
    wait(ms) { return new Promise((res) => this.timers.push({ t: ms / 1000, res })); }
    fadeTo(target, ms, col) {
      if (col) this.fadeCol = col;
      return new Promise((res) => { this.fadeAnim = { from: this.fade, to: target, t: 0, dur: Math.max(0.01, ms / 1000), res }; });
    }
    toast(text, icon, col) { this.push(new UI.Toast(this, text, icon, col)); }
    showObjective() { this.objT = 5; }
    async run(fn) {
      this.cutscene++;
      this.cancelBanter();
      try { await fn(this.g); } catch (e) { console.error('script error', e); }
      finally { this.cutscene = Math.max(0, this.cutscene - 1); }
    }
    get busy() { return this.cutscene > 0 || this.ui.length > 0; }

    /* ---------- chapters ---------- */
    newState(chId) {
      return { chapter: chId, scene: null, px: 0, py: 0, flags: {}, clues: [], items: [], gifts: [], snacks: [], talked: {}, met: {}, looked: {}, visited: {}, objective: '', skepticism: 0, hintCount: {}, hintsUsed: 0, wrongPresents: 0, revDone: {} };
    }
    async startChapter(id, o = {}) {
      const ch = P.chapters[id];
      if (!ch) return;
      this.chapter = ch;
      this.chapterCast = {};
      for (const [cid, def] of Object.entries(ch.cast || {})) { P.defineCast(cid, def); }
      this.state = o.state || this.newState(id);
      this.ui = []; this.toasts = []; this.vision = false; this.cutscene = 0;
      this.mode = new Play(this);
      this.scene = null;
      this.fade = 1;
      if (o.state && o.state.scene) {
        await this.gotoScene(o.state.scene, { x: o.state.px, y: o.state.py, resume: true });
      } else {
        this.run(async (g) => { await ch.start(g); });
      }
    }
    resolveScene(id) {
      const ch = this.chapter;
      let def = (ch && ch.scenes[id]) || P.world.scenes[id];
      if (!def) throw new Error('unknown scene ' + id);
      if (ch && ch.extend && ch.extend[id]) def = mergeScene(def, ch.extend[id]);
      def = Object.assign({}, def, { id });
      return def;
    }
    async gotoScene(id, o = {}) {
      const g = this.g;
      if (this.scene && !o.instant) await this.fadeTo(1, o.fadeMs || 280);
      this.cancelBanter();
      const def = this.resolveScene(id);
      const prev = this.scene ? this.scene.id : null;
      const sc = new P.Scene(def, this);
      this.scene = sc;
      sc.build();
      // player + Gus
      const entry = (o.from && def.entries && def.entries[o.from]) || (prev && def.entries && def.entries[prev]) || (def.entries && def.entries.map) || def.spawn || { x: 60, y: 150 };
      const ex = o.x != null ? o.x : entry.x, ey = o.y != null ? o.y : entry.y;
      if (!def.noShawn) sc.addActor({ id: 'shawn', cast: def.shawnCast || 'shawn', x: ex, y: ey, face: entry.face || 'right' });
      const gusAway = (this.state && this.state.flags.gusAway) || def.noGus;
      if (!gusAway && !def.noShawn && !sc.actors.gus) sc.addActor({ id: 'gus', cast: 'gus', x: ex - (entry.face === 'left' ? -22 : 22), y: Math.min(sc.floor.y1, Math.max(sc.floor.y0, ey - 4)), face: entry.face || 'right', follow: 'shawn', name: 'Gus',
        talk: (gg) => P.castTalk(gg, 'gus', P.BASE_TOPICS.gus), observe: (gg) => gg.say('shawn', U.pick(["Gus is giving me the 'we should leave' face.", 'Gus has a crumb on his tie. He is saving it for later.', "Gus's aura is a calm, professional teal. With notes of hunger."])) });
      else if (sc.actors.gus && !gusAway) sc.actors.gus.follow = sc.actors.gus.follow || null;
      sc.camSnap = true; sc.update(0);
      if (this.state) {
        this.state.scene = id; this.state.px = ex; this.state.py = ey;
        this.first = !this.state.visited[id];
        this.state.visited[id] = (this.state.visited[id] || 0) + 1;
      }
      const mus = U.call(def.music, g);
      if (mus) P.audio.music(mus);
      this.mode = this.mode instanceof Play ? this.mode : new Play(this);
      this.autosave();
      await this.fadeTo(0, o.fadeMs || 280);
      if (def.onEnter && !o.skipEnter) {
        if (this.cutscene > 0) await def.onEnter(g, { first: this.first, from: prev });
        else await this.run((gg) => def.onEnter(gg, { first: this.first, from: prev }));
      }
    }
    autosave() {
      if (!this.state || !this.chapter || !this.scene) return;
      const s = this.scene.actors.shawn;
      if (s) { this.state.px = Math.round(s.x); this.state.py = Math.round(s.y); }
      P.store.set(SAVE, { v: 1, chapter: this.chapter.id, state: this.state, time: Date.now() });
      this.saveGlobal();
    }
    save() { this.autosave(); }
    loadSave() { return P.store.get(SAVE, null); }
    toTitle() { P.audio.music('title'); this.chapter = null; this.state = null; this.scene = null; this.ui = []; this.cutscene = 0; this.flashbackFx = false; this.mode = new Title(this); this.fade = 0; }
    async completeChapter(o) {
      const ch = this.chapter;
      this.global.done[ch.id] = true;
      this.saveGlobal();
      P.store.del(SAVE);
      P.audio.music('complete');
      this.mode = new Complete(this, o);
      this.fade = 0;
    }
    openCaseFile() { if (!this.chapter) return; this.push(new UI.CaseFile(this, {})); }
    async openMap() {
      if (!P.MapScreen) return;
      await this.fadeTo(1, 250);
      const m = new P.MapScreen(this);
      this.mode = m;
      P.audio.music('map');
      await this.fadeTo(0, 250);
      const dest = await m.promise;
      try { if (dest) await this.gotoScene(dest.scene, { from: 'map' }); }
      catch (e) {
        console.error('scene load failed', e);
        this.mode = new Play(this); this.fade = 0;
        this.toast("Couldn't get there. The Blueberry stalled.", null, '#ff8a8a');
      }
    }

    /* ---------- Henry hint line ---------- */
    henryCall() {
      if (!this.chapter || this.busy) return;
      return this.run(async (g) => {
        const sh = this.scene && this.scene.actors.shawn;
        if (sh) sh.setAnim('phone');
        P.audio.duck(true);
        P.audio.sfx('dial'); await g.wait(700); P.audio.sfx('phone'); await g.wait(1300); P.audio.sfx('pickup');
        const s = this.state;
        s.hintsUsed = (s.hintsUsed || 0) + 1;
        const W = P.world.henry;
        await g.say('shawn:smile', U.pick(W.shawnOpens), { phone: true });
        await g.say('henry:stern', U.pick(W.greetings), { phone: true });
        const hint = (this.chapter.hints || []).find((h) => h.when(g));
        if (!hint) await g.say('henry', U.pick(W.noHint), { phone: true });
        else {
          const n = s.hintCount[hint.id] || 0;
          s.hintCount[hint.id] = n + 1;
          const lines = U.toArr(n === 0 ? hint.vague : (hint.specific || hint.vague));
          for (const l of lines) { if (Array.isArray(l)) await g.say(l[0], l[1], { phone: true }); else await g.say('henry', l, { phone: true }); }
          if (n === 0 && hint.specific) await g.say('henry:smug', 'Call back if you need me to draw you a picture.', { phone: true });
        }
        await g.say('henry', U.pick(W.signoffs), { phone: true });
        P.audio.sfx('pickup');
        P.audio.duck(false);
        if (sh) sh.anim = null;
      });
    }

    /* ---------- banter ---------- */
    cancelBanter() { this.banterToken = (this.banterToken || 0) + 1; this.banterBusy = false; if (this.scene) for (const a of Object.values(this.scene.actors)) if (a.bubble && a.bubble.banter) a.bubble = null; }
    async playBanter() {
      const sc = this.scene; if (!sc) return;
      const sh = sc.actors.shawn, gu = sc.actors.gus;
      if (!sh || !gu || !gu.visible || !sh.visible) return;
      const pools = [sc.def.banter || [], (this.chapter && this.chapter.banter) || [], P.world.banter];
      let cand = [];
      for (const p of pools) { const fresh = p.filter((b) => !this.banterSeen.has(b) && (!b.when || b.when(this.g))); if (fresh.length) { cand = fresh; break; } }
      if (!cand.length) { this.banterSeen.clear(); return; }
      const b = U.pick(cand);
      this.banterSeen.add(b);
      const tok = ++this.banterToken;
      this.banterBusy = true;
      const lines = b.lines || b;
      for (const [who, text] of lines) {
        if (tok !== this.banterToken) return;
        const a = sc.actors[who]; if (!a) continue;
        const dur = 1400 + text.length * 45;
        a.say(text, dur); a.bubble.banter = true;
        P.audio.blip((a.castDef || {}).voice);
        await this.wait(dur + 150);
      }
      if (tok === this.banterToken) this.banterBusy = false;
    }

    /* ---------- update / render ---------- */
    update(dt) {
      this.t += dt;
      // timers
      for (let i = this.timers.length - 1; i >= 0; i--) { const tm = this.timers[i]; tm.t -= dt; if (tm.t <= 0) { this.timers.splice(i, 1); tm.res(); } }
      if (this.fadeAnim) {
        const f = this.fadeAnim; f.t += dt;
        const k = Math.min(1, f.t / f.dur);
        this.fade = U.lerp(f.from, f.to, k);
        if (k >= 1) { this.fadeAnim = null; f.res(); }
      }
      if (this.shakeT > 0) this.shakeT -= dt;
      if (this.flash) { this.flash.t += dt; if (this.flash.t > this.flash.dur) this.flash = null; }
      if (this.objT > 0) this.objT -= dt;
      for (const tw of this.toasts) tw.update(dt);
      this.toasts = this.toasts.filter((w) => !w.done);
      // global hotkeys
      if (I().pressed('mute')) { const m = P.audio.toggleMute(); this.toast(m ? 'Sound off' : 'Sound on', null, '#c8d0ff'); }
      if (I().pressed('fullscreen') && !this.ui.length) this.toggleFullscreen();
      if (this.ui.length) {
        const top = this.ui[this.ui.length - 1];
        top.update(dt);
        this.ui = this.ui.filter((w) => !w.done);
        // other widgets keep animating
        for (const w of this.ui) if (w !== top) w.t += dt;
        if (this.mode && this.mode.passive) this.mode.passive(dt);
      } else if (this.mode) this.mode.update(dt);
      if (this.mode && this.mode.always) this.mode.always(dt);
    }
    renderFrame(noUI) {
      const x = this.x;
      x.save();
      if (this.shakeT > 0) x.translate(Math.round((Math.random() - 0.5) * 2 * this.shakeMag), Math.round((Math.random() - 0.5) * 2 * this.shakeMag));
      G.rect(x, -10, -10, P.W + 20, P.H + 20, '#0e0a14');
      if (this.mode) this.mode.draw(x, noUI);
      if (this.flashbackFx) drawFlashbackFx(x, this.t);
      x.restore();
      if (noUI) return;
      for (const w of this.ui) w.draw(x);
      this.toasts.forEach((w, i) => w.draw(x, i));
      if (this.flash) { x.save(); x.globalAlpha = 1 - this.flash.t / this.flash.dur; G.rect(x, 0, 0, P.W, P.H, this.flash.col); x.restore(); }
      if (this.fade > 0.001) { x.save(); x.globalAlpha = this.fade; G.rect(x, 0, 0, P.W, P.H, this.fadeCol); x.restore(); }
    }
    render() { this.renderFrame(false); }
  }

  function mergeScene(base, ext) {
    const out = Object.assign({}, base);
    for (const k of ['actors', 'hotspots', 'props', 'banter', 'blockers']) if (ext[k]) out[k] = (base[k] || []).filter((a) => !(ext.hide || []).includes(a.id)).concat(ext[k]);
    if (ext.hide) out.actors = (out.actors || []).filter((a) => !ext.hide.includes(a.id) || (ext.actors || []).includes(a));
    for (const k of ['onEnter']) if (ext[k] && base[k]) out[k] = async (g, o) => { await base[k](g, o); await ext[k](g, o); }; else if (ext[k]) out[k] = ext[k];
    for (const k of ['music', 'variant', 'name', 'bgExtra']) if (ext[k] !== undefined) out[k] = ext[k];
    if (ext.anim && base.anim) out.anim = (x, t, o) => { base.anim(x, t, o); ext.anim(x, t, o); }; else if (ext.anim) out.anim = ext.anim;
    if (ext.bgExtra) { const b = base.bg; out.bg = (x, o) => { b(x, o); ext.bgExtra(x, o); }; }
    return out;
  }
  P.mergeScene = mergeScene;

  function drawFlashbackFx(x, t) {
    x.save();
    x.globalCompositeOperation = 'saturation'; x.globalAlpha = 0.65; G.rect(x, 0, 0, P.W, P.H, '#808080');
    x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.5; G.rect(x, 0, 0, P.W, P.H, '#f0c890');
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 0.12;
    for (let yy = (Math.floor(t * 30) % 3); yy < P.H; yy += 3) G.hl(x, 0, yy, P.W, '#2a1a0a');
    x.globalAlpha = 1;
    // soft vignette corners
    for (let i = 0; i < 10; i++) { x.globalAlpha = 0.06; G.frame(x, i, i, P.W - i * 2, P.H - i * 2, '#2a1406'); }
    x.restore();
  }

  /* ======================= Modes ======================= */
  class Boot {
    constructor(game) { this.game = game; this.t = 0; }
    update(dt) {
      this.t += dt;
      if (I().anyPressed() || P.debugAuto) { P.audio.unlock(); P.audio.sfx('confirm'); P.audio.music('title'); this.game.mode = new Title(this.game); }
    }
    draw(x) {
      G.rect(x, 0, 0, P.W, P.H, '#0e0a14');
      UI.logo(x, 160, 52, 1);
      F().draw(x, 'THE SPIRITS ARE SPEAKING', 160, 92, '#c8d0ff', { align: 'center' });
      if (Math.floor(this.t * 2) % 2 === 0) F().draw(x, 'CLICK OR PRESS ANY KEY', 160, 124, '#fee761', { align: 'center' });
      F().draw(x, 'An unofficial, fan-made 16-bit tribute. Sound on!', 160, 162, '#5a5288', { align: 'center' });
    }
  }

  class Title {
    constructor(game) {
      this.game = game; this.t = 0; this.sel = 0;
      this.bg = G.canvas(P.W, P.H); paintTitleBg(this.bg.x);
      const save = game.loadSave();
      this.items = [];
      if (save && P.chapters[save.chapter]) this.items.push({ label: 'Continue', act: () => game.startChapter(save.chapter, { state: save.state }) });
      this.items.push({ label: 'New Case', act: () => game.startChapter(firstUnfinished(game)) });
      this.items.push({ label: 'Case Select', act: () => { game.mode = new Chapters(game); } });
      this.items.push({ label: 'Settings', act: () => game.push(new UI.Settings(game)) });
      this.items.push({ label: 'How to play', act: () => game.push(new UI.Help(game)) });
      P.audio.music('title');
    }
    update(dt) {
      this.t += dt;
      const n = this.items.length;
      if (I().pressed('up')) { this.sel = (this.sel - 1 + n) % n; P.audio.sfx('select'); }
      if (I().pressed('down')) { this.sel = (this.sel + 1) % n; P.audio.sfx('select'); }
      const X = 214, Y = 104;
      if (I().moved || I().clicked) this.items.forEach((it, i) => { if (UI.mouseIn(X, Y + i * 12 - 2, 100, 11)) { if (this.sel !== i && !I().clicked) P.audio.sfx('select'); this.sel = i; if (I().clicked) { P.audio.sfx('confirm'); it.act(); } } });
      if (I().pressed('confirm')) { P.audio.sfx('confirm'); this.items[this.sel].act(); }
    }
    always(dt) { this.t += 0; }
    draw(x) {
      const t = this.t;
      x.drawImage(this.bg, 0, 0);
      // shimmering sea
      for (let i = 0; i < 40; i++) { const px = (i * 53 + Math.floor(t * 12 * (1 + (i % 3)))) % P.W, py = 104 + (i * 7) % 26; G.hl(x, px, py, 3, i % 2 ? '#ffc890' : '#e890a0'); }
      // the Blueberry cruising by
      const cx = ((t * 40) % (P.W + 160)) - 80;
      P.props.car(x, Math.round(cx), 150, '#3a5ad8', 'compact', 1);
      // Shawn + Gus on the sand
      const sp = Math.floor(t / 3) % 3 === 1 ? P.Poses.temple() : P.Poses.idle(t);
      P.Sprite.draw(x, 'shawn', 64, 168, sp, false);
      P.Sprite.draw(x, 'gus', 40, 166, Math.floor(t / 3) % 3 === 1 ? P.Poses.shrug() : P.Poses.idle(t + 1), false);
      UI.logo(x, 110, 18, 1);
      F().draw(x, 'THE SPIRITS ARE SPEAKING', 110, 54, '#fff4e0', { align: 'center', outline: '#3a1a3a' });
      F().draw(x, '16-BIT FAN EDITION', 110, 66, ACC, { align: 'center', outline: '#1a2a10' });
      const X = 214, Y = 104;
      UI.panel(x, X - 8, Y - 8, 112, this.items.length * 12 + 12);
      this.items.forEach((it, i) => {
        const hot = i === this.sel;
        if (hot) UI.cursor(x, X - 3, Y + i * 12, t);
        F().draw(x, it.label, X + 6, Y + i * 12, hot ? '#ffffff' : '#c8c0f0');
      });
      F().draw(x, 'Unofficial fan tribute. Not affiliated with any network.', 160, 169, '#e8c8d8', { align: 'center', shadow: '#2a1030' });
    }
  }
  function firstUnfinished(game) { return P.chapterList.find((id) => !game.global.done[id]) || P.chapterList[0]; }
  function paintTitleBg(x) {
    P.props.sky(x, 0, 0, P.W, 104, 'sunset');
    P.props.sun(x, 236, 92, 14, '#ffd890');
    P.props.mountains(x, 0, 96, P.W, '#5a3a6a', 'titleM', 26, 22);
    P.props.mountains(x, 0, 100, P.W, '#3e2a52', 'titleM2', 14, 16);
    P.props.ocean(x, 0, 100, P.W, 30, 'sunset');
    // Stearns-ish pier silhouette
    G.rect(x, 150, 100, 170, 3, '#2a1a34'); for (let px = 152; px < P.W; px += 9) G.rect(x, px, 103, 2, 8, '#2a1a34');
    G.rect(x, 250, 92, 30, 8, '#2a1a34'); G.rect(x, 262, 86, 6, 6, '#2a1a34');
    P.props.sand(x, 0, 128, P.W, 52, '#d8a888');
    G.dither(x, 0, 128, P.W, 6, '#b88a7a', 8);
    P.props.palm(x, 14, 132, 70, 'tp1'); P.props.palm(x, 300, 136, 80, 'tp2'); P.props.palm(x, 180, 130, 50, 'tp3');
    // silhouette the palms a touch for dusk
  }

  class Chapters {
    constructor(game) { this.game = game; this.t = 0; this.sel = 0; }
    update(dt) {
      this.t += dt;
      const ids = P.chapterList, n = ids.length + 1;
      if (I().pressed('up')) { this.sel = (this.sel - 1 + n) % n; P.audio.sfx('select'); }
      if (I().pressed('down')) { this.sel = (this.sel + 1) % n; P.audio.sfx('select'); }
      const go = (i) => { P.audio.sfx('confirm'); if (i >= ids.length) this.game.mode = new Title(this.game); else this.game.startChapter(ids[i]); };
      if (I().moved || I().clicked) for (let i = 0; i < n; i++) if (UI.mouseIn(20, 30 + i * 34, 280, 32)) { if (this.sel !== i && !I().clicked) P.audio.sfx('select'); this.sel = i; if (I().clicked) go(i); }
      if (I().pressed('confirm')) go(this.sel);
      if (I().pressed('cancel')) { P.audio.sfx('cancel'); this.game.mode = new Title(this.game); }
    }
    draw(x) {
      G.bands(x, 0, 0, P.W, P.H, ['#1a1240', '#1e1548', '#221850', '#261b58'], 2);
      F().draw(x, 'CASE SELECT', 160, 10, ACC, { align: 'center', scale: 2, outline: '#0e0a14' });
      const ids = P.chapterList;
      ids.forEach((id, i) => {
        const ch = P.chapters[id], hot = i === this.sel, y = 30 + i * 34;
        UI.panel(x, 20, y, 280, 32, hot ? { accent: '#fee761', hi: '#fff4c0' } : {});
        F().draw(x, 'CASE ' + ch.number, 30, y + 6, hot ? '#fee761' : '#a8a0d8');
        F().draw(x, ch.title, 80, y + 6, '#ffffff');
        F().draw(x, ch.tagline || '', 30, y + 18, '#c8c0f0');
        if (this.game.global.done[id]) F().draw(x, '★ SOLVED', 290, y + 6, '#fee761', { align: 'right' });
      });
      const by = 30 + ids.length * 34, hot = this.sel === ids.length;
      UI.button(x, 120, by + 4, 80, 14, 'BACK', hot);
    }
  }

  class Complete {
    constructor(game, o) {
      this.game = game; this.o = o; this.t = 0;
      const s = game.state, ch = game.chapter;
      this.rows = [
        ['Clues found', `${s.clues.length} / ${Object.keys(ch.clues).length}`],
        ['Gifts found for Juliet', `${(game.global.giftsGiven || []).filter((g) => ch.gifts[g]).length + s.gifts.length} / ${Object.keys(ch.gifts).length}`],
        ['Snacks eaten', `${s.snacks.length} / ${Object.keys(ch.snacks).length}`],
        ['Wrong visions', `${s.wrongPresents || 0}`],
        ['Calls to Dad', `${s.hintsUsed || 0}`],
      ];
      const score = s.clues.length * 2 + s.snacks.length + (game.global.romance || 0) - (s.wrongPresents || 0) - (s.hintsUsed || 0);
      this.rank = score >= 26 ? 'ACTUAL PSYCHIC (?!)' : score >= 20 ? 'Senior Fake Psychic' : score >= 13 ? 'Junior Fake Psychic' : 'Still Better Than Lassie';
    }
    update(dt) {
      this.t += dt;
      if (this.t > 1.2 && (I().pressed('confirm') || I().clicked)) {
        P.audio.sfx('confirm');
        const ids = P.chapterList, i = ids.indexOf(this.game.chapter.id);
        if (i >= 0 && i + 1 < ids.length) this.game.startChapter(ids[i + 1]); else this.game.toTitle();
      }
    }
    draw(x) {
      const t = this.t, ch = this.game.chapter;
      G.bands(x, 0, 0, P.W, P.H, ['#1a1240', '#221a52', '#2a2064', '#221a52'], 2);
      for (let i = 0; i < 30; i++) { const a = t * 0.5 + i; G.sparkle(x, (i * 37 + t * 20) % P.W, (i * 23 + Math.sin(a) * 10) % P.H, i % 3, i % 2 ? ACC : '#fee761'); }
      const s = Math.min(1, t / 0.4);
      F().draw(x, 'CASE CLOSED', 160, 14 + (1 - U.ease.outBack(s)) * -30, '#fee761', { align: 'center', scale: 3, outline: '#0e0a14' });
      F().draw(x, `Case ${ch.number}: ${ch.title}`, 160, 44, '#ffffff', { align: 'center', outline: '#0e0a14' });
      UI.panel(x, 50, 58, 220, 84);
      this.rows.forEach(([a, b], i) => { if (t > 0.5 + i * 0.15) { F().draw(x, a, 60, 66 + i * 11, '#c8c0f0'); F().draw(x, b, 260, 66 + i * 11, '#ffffff', { align: 'right' }); } });
      if (t > 1.3) {
        F().draw(x, 'Juliet:', 60, 124, '#ff8ab8');
        const r = Math.min(10, this.game.global.romance || 0);
        for (let i = 0; i < 10; i++) G.heart(x, 96 + i * 9, 124, i < r ? '#ff4a7a' : '#4a3a7a', i < r ? '#ffd0dc' : '#5a4a8a');
      }
      if (t > 1.6) F().draw(x, 'RANK: ' + this.rank, 160, 148, ACC, { align: 'center', outline: '#0e0a14' });
      if (t > 2) F().draw(x, 'Did you spot the pineapple?', 160, 160, '#fee761', { align: 'center' });
      if (t > 2.2 && Math.floor(t * 2) % 2 === 0) F().draw(x, 'PRESS ENTER', 160, 170, '#c8c0f0', { align: 'center' });
    }
  }

  /* ---------------- play mode ---------------- */
  const HUD_BTNS = [
    { id: 'vision', tip: 'Shawn-Vision (Q)', x: P.W - 64 },
    { id: 'case', tip: 'Case File (Tab)', x: P.W - 48 },
    { id: 'phone', tip: 'Call Dad (H)', x: P.W - 32 },
    { id: 'menu', tip: 'Menu (Esc)', x: P.W - 16 },
  ];
  class Play {
    constructor(game) { this.game = game; this.hover = null; this.focus = null; this.hudHot = null; }
    get sc() { return this.game.scene; }
    passive(dt) { if (this.sc) this.sc.update(dt); }
    update(dt) {
      const game = this.game, sc = this.sc;
      if (!sc) return;
      sc.update(dt);
      const s = sc.actors.shawn;
      if (game.cutscene > 0) {
        this.hover = this.focus = null;
        if (game.walkingInteract && s) for (const a of Object.values(sc.actors)) if (a.guard && game.interactTarget !== a.id) this.updateGuard(a, s, dt);
        return;
      }
      if (!s) return;
      // HUD buttons
      this.hudHot = null;
      for (const b of HUD_BTNS) if (UI.mouseIn(b.x, 3, 14, 14)) this.hudHot = b;
      if (I().clicked && this.hudHot) { this.hudAction(this.hudHot.id); return; }
      if (I().pressed('pause')) { game.push(new UI.Pause(game)); return; }
      if (I().pressed('casefile')) { game.openCaseFile(); return; }
      if (I().pressed('phone')) { game.henryCall(); return; }
      if (I().pressed('objective')) game.showObjective();
      if (I().pressed('vision')) { this.toggleVision(); }
      // keyboard walking
      const dx = (I().held('right') ? 1 : 0) - (I().held('left') ? 1 : 0);
      const dy = (I().held('down') ? 1 : 0) - (I().held('up') ? 1 : 0);
      if (dx || dy) {
        s.scripted = false;
        s.target = { x: s.x + dx * 12, y: s.y + dy * 7, kb: true };
        this.kb = true;
      } else if (s.target && s.target.kb) { s.target = null; }
      // hover + focus
      this.hover = I().mx >= 0 ? sc.pick(I().mx, I().my, game.vision) : null;
      this.focus = sc.nearest(game.vision);
      if ((I().pressed('confirm')) && this.focus) { this.interact(this.focus, game.vision ? 'look' : 'use'); return; }
      if (I().rclicked && this.hover) { this.interact(this.hover, 'look'); return; }
      if (I().clicked && !this.hudHot) {
        this.kb = false;
        if (this.hover) { this.interact(this.hover, game.vision ? 'look' : 'use'); return; }
        const [tx, ty] = sc.clampToFloor(I().mx + sc.camX, Math.max(I().my, sc.floor.y0));
        s.scripted = false; s.walkTo(tx, ty);
        this.clickFx = { x: tx, y: ty, t: 0 };
      }
      if (this.clickFx) { this.clickFx.t += dt; if (this.clickFx.t > 0.4) this.clickFx = null; }
      // guards
      for (const a of Object.values(sc.actors)) if (a.guard) this.updateGuard(a, s, dt);
      // banter
      if (!game.banterBusy) {
        game.banterT -= dt;
        if (game.banterT <= 0) { game.banterT = U.rand(28, 46); game.playBanter(); }
      }
      // remember position for saves
      if (game.state) { game.state.px = Math.round(s.x); game.state.py = Math.round(s.y); }
    }
    hudAction(id) {
      const game = this.game;
      P.audio.sfx('select');
      if (id === 'vision') this.toggleVision();
      else if (id === 'case') game.openCaseFile();
      else if (id === 'phone') game.henryCall();
      else if (id === 'menu') game.push(new UI.Pause(game));
    }
    toggleVision() {
      const game = this.game;
      game.vision = !game.vision;
      P.audio.sfx(game.vision ? 'psychic' : 'cancel');
      if (game.vision) { const s = this.sc.actors.shawn; if (s) s.setAnim('temple', 600); game.visionT = 0; }
    }
    updateGuard(a, s, dt) {
      const gd = a.guard, g = this.game.g;
      if (gd.off && gd.off(g)) { gd.alert = 0; return; }
      if (gd.alert > 0) { gd.alert -= dt; return; }
      if (this.game.caught) return;
      const inZone = s.x >= gd.zone[0] && s.x <= gd.zone[1] && (!gd.zoneY || (s.y >= gd.zoneY[0] && s.y <= gd.zoneY[1]));
      const facingShawn = Math.sign(s.x - a.x) === a.face || Math.abs(s.x - a.x) < 6;
      if (inZone && facingShawn && Math.abs(s.x - a.x) < (gd.range || 90)) {
        gd.alert = 1.5;
        this.game.caught = true;
        s.stop();
        this.game.run(async (gg) => {
          a.emo('!', 1200); P.audio.sfx('caught');
          gg.face('shawn', a.id);
          await gg.wait(450);
          if (gd.onCaught) await gd.onCaught(gg);
          else await gg.say(a.id, 'Hey! Behind the tape!');
          const r = gd.reset || [gd.zone[0] - 24, s.y];
          await gg.walk('shawn', r[0], r[1]);
          this.game.caught = false;
        });
      }
    }
    interact(o, verb) {
      const game = this.game, sc = this.sc;
      game.vision = verb === 'look' ? false : game.vision;
      game.run(async (g) => {
        const s = sc.actors.shawn;
        let wx, wy;
        if (o.kind === 'actor') {
          const a = o.actor;
          const side = s.x < a.x ? -1 : 1;
          [wx, wy] = o.actor.def.walk || sc.clampToFloor(a.x + side * 26, a.y + 1);
          if (sc.blocked(wx, wy)) [wx, wy] = sc.clampToFloor(a.x - side * 26, a.y + 1);
        } else if (o.walk) [wx, wy] = o.walk;
        else [wx, wy] = sc.clampToFloor(U.clamp(s.x, o.rect.x, o.rect.x + o.rect.w), s.y);
        if (U.dist(s.x, s.y, wx, wy) > 3) {
          s.sneak = !!(o.hs && o.hs.sneak);
          game.walkingInteract = true; game.interactTarget = o.id;
          await g.walk('shawn', wx, wy);
          game.walkingInteract = false;
          s.sneak = false;
          if (game.caught || game.scene !== sc || game.ui.length) return;
        }
        const cx = o.rect.x + o.rect.w / 2;
        s.face = cx < s.x ? -1 : cx > s.x ? 1 : s.face;
        game.lastTarget = [cx, o.rect.y + o.rect.h / 2];
        const lk = sc.id + ':' + o.id;
        if (o.kind === 'actor') {
          const a = o.actor, d = a.def;
          if (!a.guard) a.face = s.x < a.x ? -1 : 1;
          if (verb === 'look') {
            game.state.looked[lk] = true;
            const chObs = game.chapter && game.chapter.observe && game.chapter.observe[a.id];
            if (chObs) await chObs(g); else if (d.observe) await d.observe(g); else await defaultObserve(g, a);
          } else {
            if (d.talk) await d.talk(g); else await defaultTalk(g, a);
          }
        } else {
          const h = o.hs;
          if (h.exit && verb !== 'look') {
            if (h.before && (await h.before(g)) === false) return;
            if (h.exit === 'map') { await game.openMap(); return; }
            await g.goto(h.exit, { from: sc.id, x: h.to ? h.to[0] : undefined, y: h.to ? h.to[1] : undefined });
            return;
          }
          const fn = verb === 'look' ? (h.look || h.use) : (h.use || h.look);
          if (verb === 'look') game.state.looked[lk] = true;
          if (fn) await fn(g); else await defaultLook(g, h);
          if (h.use && verb === 'use') game.state.looked[lk] = true;
        }
      });
    }
    draw(x, noUI) {
      const game = this.game, sc = this.sc;
      if (!sc) return;
      sc.draw(x);
      if (game.vision && !noUI) drawVision(x, sc, game);
      sc.drawOverlays(x);
      if (P.Revelation && P.Revelation.drawOverlay) P.Revelation.drawOverlay(x, game);
      if (noUI) return;
      if (this.clickFx) { const k = this.clickFx.t / 0.4; G.ellipse(x, this.clickFx.x - sc.camX, this.clickFx.y, 2 + k * 6, 1 + k * 2, k < 0.5 ? ACC : '#5aa83a'); }
      if (!game.busy && !game.rev) this.drawHUD(x);
    }
    drawHUD(x) {
      const game = this.game, sc = this.sc, t = game.t;
      // location
      const name = U.call(sc.def.name, game.g) || sc.id;
      UI.tag(x, 3, 3, name, '#e8e0ff');
      if (game.objT > 0 && game.state && game.state.objective) {
        const a = Math.min(1, game.objT, (5 - game.objT) * 3);
        x.save(); x.globalAlpha = a;
        const lines = F().wrap(game.state.objective, 200);
        UI.panel(x, 3, 16, 212, 10 + lines.length * 10, { accent: '#fee761' });
        lines.forEach((l, i) => F().draw(x, (i === 0 ? '▶ ' : '  ') + l, 8, 21 + i * 10, '#fee761'));
        x.restore();
      }
      // buttons
      for (const b of HUD_BTNS) {
        const hot = this.hudHot === b || (b.id === 'vision' && game.vision);
        G.rect(x, b.x, 3, 14, 14, '#0e0a14'); G.rect(x, b.x + 1, 4, 12, 12, hot ? '#4a3ea0' : '#241d58'); G.hl(x, b.x + 1, 4, 12, hot ? ACC : '#7a70b8');
        hudIcon(x, b.id, b.x + 2, 5, game.vision && b.id === 'vision');
      }
      // label
      let lab = null;
      const vis = game.vision;
      const tgt = (P.input.lastDevice === 'mouse' && this.hover) ? this.hover : (P.input.lastDevice !== 'mouse' || !this.hover ? this.focus : null);
      if (this.hudHot) lab = this.hudHot.tip;
      else if (tgt) {
        const nm = tgt.name;
        if (vis) lab = 'Observe ' + nm;
        else if (tgt.kind === 'actor') lab = 'Talk to ' + nm;
        else if (tgt.kind === 'exit') lab = (tgt.hs.verb || 'Go to') + ' ' + nm;
        else lab = (tgt.hs.verb || 'Check out') + ' ' + nm;
        if (P.input.lastDevice !== 'mouse') lab = '[E] ' + lab + (vis ? '' : '   [Q] Vision');
      }
      if (lab) {
        const w = F().width(lab) + 12;
        UI.panel(x, 160 - w / 2, P.H - 15, w, 13, { accent: vis ? '#c8a0ff' : ACC });
        F().draw(x, lab, 160, P.H - 12, vis ? '#e0c8ff' : '#ffffff', { align: 'center' });
      }
      if (tgt && P.input.lastDevice !== 'mouse') {
        const r = tgt.rect, cx = r.x + r.w / 2 - sc.camX, by = r.y - 4 + Math.round(Math.sin(t * 6));
        G.poly(x, [[cx - 3, by - 4], [cx + 4, by - 4], [cx, by]], vis ? '#c8a0ff' : ACC);
      }
    }
  }
  function hudIcon(x, id, X, Y, on) {
    const c = '#e8e0ff';
    if (id === 'vision') { G.ellipse(x, X + 5, Y + 5, 5, 3, on ? '#fee761' : c); G.circle(x, X + 5, Y + 5, 2, '#241d58'); G.px(x, X + 5, Y + 5, on ? '#e43b44' : c); }
    else if (id === 'case') { G.rect(x, X + 1, Y + 2, 9, 7, '#e8c870'); G.rect(x, X + 1, Y + 1, 4, 2, '#e8c870'); G.hl(x, X + 1, Y + 4, 9, '#b8984a'); }
    else if (id === 'phone') { G.rect(x, X + 3, Y + 1, 5, 9, c); G.rect(x, X + 4, Y + 2, 3, 5, '#6ab0ff'); }
    else if (id === 'menu') { for (let i = 0; i < 3; i++) G.hl(x, X + 1, Y + 2 + i * 3, 9, c); }
  }
  function drawVision(x, sc, game) {
    const t = game.t;
    game.visionT = (game.visionT || 0) + 0.016;
    x.save();
    x.globalCompositeOperation = 'multiply'; x.globalAlpha = 0.55; G.rect(x, 0, 0, P.W, P.H, '#7a5ad0');
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    // ripple ring on activation
    if (game.visionT < 0.6) { const sh = sc.actors.shawn; const r = game.visionT * 400; x.globalAlpha = 1 - game.visionT / 0.6; for (let a = 0; a < 120; a++) { const ang = (a / 120) * Math.PI * 2; G.px(x, sh.x - sc.camX + Math.cos(ang) * r, sh.y - 30 + Math.sin(ang) * r * 0.6, ACC); } x.globalAlpha = 1; }
    x.restore();
    // redraw actors lightly so they pop
    const looked = game.state ? game.state.looked : {};
    for (const o of sc.interactables(true)) {
      const r = o.rect;
      const cx = r.x + r.w / 2 - sc.camX, cy = r.y + Math.min(r.h / 2, 14);
      const seen = looked[sc.id + ':' + o.id];
      const important = o.hs ? (U.call(o.hs.clue, game.g) && !seen) : (o.actor.def.observe && !seen);
      const secret = o.hs && o.hs.secret;
      const col = secret ? '#ff8ab8' : important ? '#fee761' : '#c8d0ff';
      const ph = Math.sin(t * 5 + cx * 0.1);
      G.sparkle(x, cx + Math.round(Math.cos(t * 2 + cx) * 2), cy + Math.round(ph * 2), important || secret ? 3 : 1, col);
      if (important || secret) { G.sparkle(x, cx - 6, cy + 5, 1, col); G.sparkle(x, cx + 7, cy - 4, 1, col); }
    }
    F().draw(x, 'SHAWN-VISION', 160, 4, '#e0c8ff', { align: 'center', outline: '#2a1a4a' });
  }

  async function defaultObserve(g, a) {
    const nm = a.def.name || (a.castDef && a.castDef.short) || 'them';
    await g.say('shawn', U.pick([
      `I'm reading ${nm}'s aura. It's... beige. Deeply, profoundly beige.`,
      `Nothing on ${nm}. The spirits say "no comment."`,
      `${nm} has the energy of a person who alphabetizes their spice rack.`,
    ]));
  }
  async function defaultTalk(g, a) {
    const nm = a.def.name || (a.castDef && a.castDef.short) || 'them';
    await g.say(a.id, U.pick(['Can I help you?', "I'm a little busy right now.", 'Oh. Hi.']));
  }
  async function defaultLook(g, h) {
    await g.say('shawn', U.pick(["Huh. A " + U.call(h.name, g) + ". Fascinating. No, it's not.", "Nothing here the spirits care about.", 'Gus, make a note: ' + U.call(h.name, g) + '. Unremarkable.']));
  }

  P.Game = Game;
  P.Modes = { Boot, Title, Chapters, Complete, Play };
})(window.P);
