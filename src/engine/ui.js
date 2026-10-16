'use strict';
/* UI widgets. Each modal widget lives on game.ui (a stack); the top one receives input.
   Widgets resolve a promise when done so scripts can `await` them. */
(function (P) {
  const G = P.G, U = P.U, C = P.C;
  const F = () => P.font;
  const I = () => P.input;
  const UI = P.UI = {};
  const ACC = '#9be564'; // psych green accent
  UI.ACC = ACC;

  /* ---------------- window skin ---------------- */
  UI.panel = (x, X, Y, W, H, o = {}) => {
    X = Math.round(X); Y = Math.round(Y);
    const fill = o.fill || ['#2b2368', '#241d58', '#1e1849', '#19143c'];
    G.rect(x, X, Y, W, H, '#0e0a14');
    G.bands(x, X + 2, Y + 2, W - 4, H - 4, fill, 0);
    G.hl(x, X + 1, Y + 1, W - 2, o.hi || '#e8e0ff'); G.vl(x, X + 1, Y + 1, H - 2, o.hi || '#e8e0ff');
    G.hl(x, X + 1, Y + H - 2, W - 2, o.lo || '#7a70b8'); G.vl(x, X + W - 2, Y + 1, H - 2, o.lo || '#7a70b8');
    G.px(x, X + 1, Y + 1, o.accent || ACC); G.px(x, X + W - 2, Y + 1, o.accent || ACC); G.px(x, X + 1, Y + H - 2, o.accent || ACC); G.px(x, X + W - 2, Y + H - 2, o.accent || ACC);
  };
  UI.tag = (x, X, Y, text, col) => {
    const w = F().width(text) + 8;
    G.rect(x, X, Y, w, 11, '#0e0a14'); G.rect(x, X + 1, Y + 1, w - 2, 9, '#171238'); G.hl(x, X + 1, Y + 1, w - 2, col);
    F().draw(x, text, X + 4, Y + 2, col);
    return w;
  };
  UI.button = (x, X, Y, W, H, label, hot, o = {}) => {
    G.rect(x, X, Y, W, H, '#0e0a14');
    G.rect(x, X + 1, Y + 1, W - 2, H - 2, hot ? '#4a3ea0' : '#241d58');
    G.hl(x, X + 1, Y + 1, W - 2, hot ? ACC : '#7a70b8');
    F().draw(x, label, X + W / 2, Y + Math.floor((H - 7) / 2), hot ? '#ffffff' : (o.dim ? '#7a70b8' : '#d8d0ff'), { align: 'center' });
  };
  UI.cursor = (x, X, Y, t) => { const o = Math.round(Math.sin(t * 10)); F().draw(x, '▶', X + o, Y, ACC); };

  const mouseIn = (X, Y, W, H) => { const i = I(); return i.mx >= X && i.my >= Y && i.mx < X + W && i.my < Y + H; };
  UI.mouseIn = mouseIn;

  /* ---------------- base ---------------- */
  class Widget {
    constructor(game) { this.game = game; this.t = 0; this.done = false; this.promise = new Promise((r) => { this._res = r; }); this.modal = true; }
    close(v) { if (this.done) return; this.done = true; this.result = v; this._res(v); }
    update(dt) { this.t += dt; }
    draw() {}
  }
  UI.Widget = Widget;

  /* ---------------- dialogue ---------------- */
  function parseWho(who) {
    if (!who) return { id: null, expr: null };
    const [id, expr] = String(who).split(':');
    return { id, expr: expr || null };
  }
  class Dialogue extends Widget {
    constructor(game, who, text, o = {}) {
      super(game);
      const w = parseWho(who);
      this.who = w.id; this.expr = o.expr || w.expr;
      this.cast = P.getCast(this.who);
      this.name = o.name || (this.cast ? this.cast.short : this.who === 'narrator' || !this.who ? null : this.who);
      this.text = text;
      this.thought = !!o.thought || this.who === 'thought';
      if (this.who === 'thought') { this.cast = P.getCast('shawn'); this.name = 'Shawn (thinking)'; }
      this.phone = !!o.phone;
      this.lines = F().wrap(text, this.cast ? 244 : 296);
      this.total = F().count(this.lines.join(' '));
      this.shown = 0;
      this.pos = o.pos || game.dialoguePos || 'top';
      const actor = game.scene && this.who && game.scene.actors[this.who];
      this.actor = actor || null;
      if (this.actor) this.actor.talking = true;
      if (this.actor && this.expr) this.actor.expr = this.expr;
      if (P.debugAuto) this.shown = this.total;
    }
    get typing() { return this.shown < this.total; }
    finish() { this.shown = this.total; }
    close(v) { if (this.actor) { this.actor.talking = false; } super.close(v); }
    update(dt) {
      super.update(dt);
      const speed = this.game.settings.textSpeed || 55;
      if (this.typing) {
        const before = Math.floor(this.shown);
        this.shown = Math.min(this.total, this.shown + dt * (I().held('skip') ? 400 : speed));
        if (Math.floor(this.shown) !== before) {
          const ch = F().strip(this.lines.join(' '))[Math.floor(this.shown) - 1];
          if (ch && ch !== ' ' && Math.floor(this.shown) % 2 === 0) P.audio.blip(this.cast ? this.cast.voice : { pitch: 1.2 });
        }
        if (!this.typing && this.actor) this.actor.talking = false;
      }
      const go = I().pressed('confirm') || I().clicked || (I().held('skip') && this.t > 0.08) || (P.debugAuto && this.t > 0.02);
      if (go && !(this.hold && !this.typing)) {
        if (this.typing) this.finish();
        else { P.audio.sfx('page'); this.close(true); }
      }
    }
    draw(x) {
      const top = this.pos === 'top';
      const bx = 4, bw = P.W - 8, bh = 52;
      const by = top ? 4 : P.H - bh - 4;
      UI.panel(x, bx, by, bw, bh, this.thought ? { fill: ['#3a2a5a', '#30224e', '#281c44', '#20163a'], accent: '#c8a0ff' } : this.phone ? { fill: ['#1e3a3a', '#1a3232', '#162a2a', '#122222'], accent: '#7ee2d0' } : {});
      let tx = bx + 8;
      if (this.cast) {
        const talking = this.typing && Math.floor(this.t * 9) % 2 === 0;
        const blink = !talking && (this.t % 3.6) > 3.45;
        const pr = P.Portrait.get(this.cast.id, this.expr || (this.cast.portrait && this.cast.portrait.base) || 'neutral', { talk: talking, blink });
        const px = bx + 5, py = top ? by + 4 : by - 8;
        G.rect(x, px - 1, py - 1, P.Portrait.W + 2, (top ? 44 : P.Portrait.H) + 2, '#0e0a14');
        if (top) { x.drawImage(pr, 0, 4, P.Portrait.W, 44, px, py, P.Portrait.W, 44); }
        else x.drawImage(pr, px, py);
        G.frame(x, px - 1, py - 1, P.Portrait.W + 2, (top ? 44 : P.Portrait.H) + 2, (this.cast.portrait && this.cast.portrait.frame) || '#c8d0ff');
        if (this.phone) { G.rect(x, px + P.Portrait.W - 9, py + 2, 7, 11, '#2a2a34'); G.rect(x, px + P.Portrait.W - 8, py + 3, 5, 7, '#6ab0ff'); }
        tx = bx + 60;
      }
      let ty = by + 6;
      if (this.name) {
        const col = this.cast ? this.cast.color : '#c8d0ff';
        F().draw(x, this.thought ? '(' + this.name + ')' : this.name.toUpperCase(), tx, ty, col);
        ty += 11;
      }
      let left = Math.floor(this.shown);
      const baseCol = this.thought ? '#d8c8ff' : '#f4f0ff';
      for (const l of this.lines) {
        const n = F().count(l);
        F().draw(x, l, tx, ty, baseCol, { count: Math.max(0, left), shadow: '#0e0a14' });
        left -= n + 1;
        ty += 10;
        if (left < 0) break;
      }
      if (!this.typing) { const o = Math.floor(this.t * 3) % 2; G.poly(x, [[bx + bw - 12, by + bh - 9 + o], [bx + bw - 6, by + bh - 9 + o], [bx + bw - 9, by + bh - 5 + o]], ACC); }
    }
  }
  UI.Dialogue = Dialogue;

  /* ---------------- choice menu ---------------- */
  class Choice extends Widget {
    constructor(game, options, o = {}) {
      super(game);
      this.opts = options.map((op) => (typeof op === 'string' ? { text: op } : op));
      this.title = o.title || null;
      this.cancel = o.cancel;
      this.sel = Math.max(0, this.opts.findIndex((op) => !op.disabled));
      this.w = Math.min(300, Math.max(120, ...this.opts.map((op) => F().width(op.text) + 26), this.title ? F().width(this.title) + 16 : 0));
      this.h = this.opts.length * 11 + 8 + (this.title ? 12 : 0);
      this.x = o.x != null ? o.x : P.W - this.w - 6;
      this.y = o.y != null ? o.y : (game.dialoguePos === 'bottom' ? P.H - 60 - this.h : 60);
      if (this.y + this.h > P.H - 2) this.y = P.H - 2 - this.h;
      this.who = o.who || null;
      if (P.debugAuto) this.autoPick = o.auto;
    }
    update(dt) {
      super.update(dt);
      if (P.debugAuto && this.t > 0.02) {
        const want = P.debugPick ? P.debugPick(this.opts, this) : null;
        const idx = want != null ? want : 0;
        this.close(this.opts[idx].value != null ? this.opts[idx].value : idx); return;
      }
      const n = this.opts.length;
      const move = (d) => { let s = this.sel; for (let k = 0; k < n; k++) { s = (s + d + n) % n; if (!this.opts[s].disabled) break; } if (s !== this.sel) { this.sel = s; P.audio.sfx('select'); } };
      if (I().pressed('up')) move(-1);
      if (I().pressed('down')) move(1);
      const y0 = this.y + 4 + (this.title ? 12 : 0);
      if (I().moved || I().clicked) {
        for (let i = 0; i < n; i++) if (mouseIn(this.x, y0 + i * 11, this.w, 11) && !this.opts[i].disabled) { if (this.sel !== i) { this.sel = i; if (!I().clicked) P.audio.sfx('select'); } }
      }
      const clickedIn = I().clicked && mouseIn(this.x, y0, this.w, n * 11);
      if (I().pressed('confirm') || clickedIn) {
        const op = this.opts[this.sel];
        if (op && !op.disabled) { P.audio.sfx('confirm'); this.close(op.value != null ? op.value : this.sel); }
      } else if (this.cancel !== undefined && (I().pressed('cancel') || I().rclicked || (I().clicked && !mouseIn(this.x, this.y, this.w, this.h)))) { P.audio.sfx('cancel'); this.close(this.cancel); }
    }
    draw(x) {
      UI.panel(x, this.x, this.y, this.w, this.h);
      let y = this.y + 4;
      if (this.title) { F().draw(x, this.title, this.x + 8, y + 1, ACC); y += 12; }
      this.opts.forEach((op, i) => {
        const hot = i === this.sel;
        if (hot) G.rect(x, this.x + 3, y - 1, this.w - 6, 10, '#3a2e86');
        if (hot) UI.cursor(x, this.x + 5, y, this.t);
        const col = op.disabled ? '#5a5288' : op.done ? '#9a92c8' : hot ? '#ffffff' : '#d8d0ff';
        if (op.icon) x.drawImage(P.icon(op.icon), 0, 0, 18, 18, this.x + this.w - 15, y - 1, 9, 9);
        F().draw(x, op.text, this.x + 14, y, col);
        if (op.done) F().draw(x, '✓'.replace('✓', '•'), this.x + this.w - 10, y, '#7a70b8');
        y += 11;
      });
    }
  }
  UI.Choice = Choice;

  /* ---------------- toast ---------------- */
  class Toast extends Widget {
    constructor(game, text, icon, col) { super(game); this.modal = false; this.text = text; this.icon = icon; this.col = col || ACC; this.dur = 2.8; }
    update(dt) { super.update(dt); if (this.t > this.dur) this.close(); }
    draw(x, idx) {
      const w = F().width(this.text) + (this.icon ? 28 : 12);
      const slide = this.t < 0.25 ? 1 - this.t / 0.25 : this.t > this.dur - 0.3 ? (this.t - (this.dur - 0.3)) / 0.3 : 0;
      const X = Math.round(P.W - w - 4 + slide * (w + 10)), Y = 22 + idx * 22;
      UI.panel(x, X, Y, w, 20, { accent: this.col });
      if (this.icon) x.drawImage(P.icon(this.icon), X + 4, Y + 1);
      F().draw(x, this.text, X + (this.icon ? 24 : 6), Y + 7, this.col);
    }
  }
  UI.Toast = Toast;

  /* ---------------- title card ---------------- */
  class TitleCard extends Widget {
    constructor(game, o) { super(game); this.o = o; this.dur = o.dur || 4.2; }
    update(dt) { super.update(dt); if ((this.t > 0.8 && (I().pressed('confirm') || I().clicked)) || this.t > this.dur || (P.debugAuto && this.t > 0.05)) this.close(); }
    draw(x) {
      const t = this.t;
      // swirling 16-bit backdrop with palette cycling
      const cols = ['#1a1240', '#24185a', '#2e1e74', '#3a2690', '#24185a'];
      for (let yy = 0; yy < P.H; yy += 2) {
        const k = Math.floor((yy / 12 + t * 6 + Math.sin(yy / 20 + t * 2) * 2)) % cols.length;
        G.rect(x, 0, yy, P.W, 2, cols[(k + cols.length) % cols.length]);
      }
      for (let i = 0; i < 18; i++) { const a = t * 0.6 + i * 0.35; G.sparkle(x, 160 + Math.cos(a * 1.3 + i) * (60 + i * 6), 90 + Math.sin(a + i) * (30 + i * 3), (i % 3) + 1, i % 2 ? '#9be564' : '#fee761'); }
      const s = Math.min(1, t / 0.5);
      UI.logo(x, 160, 40 - (1 - U.ease.outBack(s)) * 50, 1);
      if (t > 0.6) {
        const a = Math.min(1, (t - 0.6) / 0.4);
        x.save(); x.globalAlpha = a;
        if (this.o.kicker) F().draw(x, this.o.kicker, 160, 84, '#c8d0ff', { align: 'center', shadow: '#0e0a14' });
        F().draw(x, this.o.title, 160, 98, '#ffffff', { align: 'center', scale: 2, outline: '#0e0a14' });
        if (this.o.sub) F().draw(x, this.o.sub, 160, 126, ACC, { align: 'center', shadow: '#0e0a14' });
        x.restore();
      }
    }
  }
  UI.TitleCard = TitleCard;

  // the game logo: chunky letters + pineapple-free psychic swirl
  UI.logo = (x, cx, cy, scale = 1, t = 0) => {
    const txt = 'PSYCH';
    const w = F().width(txt) * 4 * scale;
    const X = Math.round(cx - w / 2), Y = Math.round(cy);
    // drop shadow + outline via repeated draws
    for (const [dx, dy, c] of [[3, 3, '#0e0a14'], [-1, 0, '#0e0a14'], [1, 0, '#0e0a14'], [0, -1, '#0e0a14'], [0, 1, '#0e0a14'], [-2, -1, '#1d4a14'], [2, 2, '#1d4a14']]) F().draw(x, txt, X + dx * scale, Y + dy * scale, c, { scale: 4 * scale });
    F().draw(x, txt, X, Y, '#9be564', { scale: 4 * scale });
    // gloss band
    x.save(); x.beginPath(); x.rect(X, Y, w, 10 * scale); x.clip(); F().draw(x, txt, X, Y, '#d4ff9c', { scale: 4 * scale }); x.restore();
    x.save(); x.beginPath(); x.rect(X, Y + 22 * scale, w, 8 * scale); x.clip(); F().draw(x, txt, X, Y, '#5aa83a', { scale: 4 * scale }); x.restore();
  };

  /* ---------------- Shawn-Vision zoom lens ---------------- */
  class Zoom extends Widget {
    constructor(game, o) {
      super(game);
      this.o = o;
      const buf = game.buf;
      const cw = 52, ch = 36;
      this.snap = G.canvas(cw, ch);
      this.snap.x.drawImage(buf, -Math.round(o.sx - cw / 2), -Math.round(o.sy - ch / 2));
      this.lines = F().wrap(o.text || '', 280);
      P.audio.sfx('zoom');
    }
    update(dt) {
      super.update(dt);
      if ((this.t > 0.6 && (I().pressed('confirm') || I().clicked)) || (P.debugAuto && this.t > 0.05)) { P.audio.sfx('page'); this.close(); }
    }
    draw(x) {
      const t = this.t, o = this.o;
      const k = U.ease.outBack(Math.min(1, t / 0.45));
      // dim + speed lines
      x.save(); x.globalAlpha = Math.min(0.65, t * 2); G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      const cx = U.lerp(o.sx, 160, Math.min(1, t / 0.35)), cy = U.lerp(o.sy, 66, Math.min(1, t / 0.35));
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2 + t * 0.4, r0 = 50 + ((t * 300 + i * 37) % 120);
        G.line(x, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + 14), cy + Math.sin(a) * (r0 + 14), i % 3 ? '#5d4ca8' : '#9be564');
      }
      const R = Math.round(48 * k);
      if (R > 2) {
        x.save();
        x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.clip();
        x.drawImage(this.snap, Math.round(cx - 78), Math.round(cy - 54), 156, 108);
        if (o.icon) { const ic = P.icon(o.icon); const s = 3; x.drawImage(ic, Math.round(cx - 9 * s), Math.round(cy - 9 * s + Math.sin(t * 3) * 2), 18 * s, 18 * s); }
        x.restore();
        // lens rim
        for (let a = 0; a < 90; a++) { const ang = (a / 90) * Math.PI * 2; G.px(x, cx + Math.cos(ang) * (R + 1), cy + Math.sin(ang) * (R + 1), '#0e0a14'); G.px(x, cx + Math.cos(ang) * (R + 2), cy + Math.sin(ang) * (R + 2), a % 6 < 3 ? '#9be564' : '#fee761'); G.px(x, cx + Math.cos(ang) * (R + 3), cy + Math.sin(ang) * (R + 3), '#0e0a14'); }
        G.sparkle(x, cx - R * 0.6, cy - R * 0.6, 3, '#ffffff');
      }
      if (t > 0.35) {
        const bh = 18 + this.lines.length * 10;
        const by = P.H - bh - 4;
        UI.panel(x, 6, by, P.W - 12, bh, { accent: '#fee761' });
        F().draw(x, (o.kicker || 'SHAWN NOTICES') + ':', 14, by + 5, '#fee761');
        F().draw(x, o.title || '', 14 + F().width((o.kicker || 'SHAWN NOTICES') + ': ') + 2, by + 5, '#ffffff');
        this.lines.forEach((l, i) => F().draw(x, l, 14, by + 17 + i * 10, '#d8d0ff', { shadow: '#0e0a14' }));
      }
    }
  }
  UI.Zoom = Zoom;

  /* ---------------- generic "press a key" message panel ---------------- */
  class Message extends Widget {
    constructor(game, title, body, o = {}) { super(game); this.title = title; this.lines = F().wrap(body || '', 250); this.o = o; }
    update(dt) { super.update(dt); if ((this.t > 0.3 && (I().pressed('confirm') || I().clicked || I().pressed('cancel'))) || (P.debugAuto && this.t > 0.02)) { P.audio.sfx('confirm'); this.close(); } }
    draw(x) {
      const h = 30 + this.lines.length * 10, w = 270, X = (P.W - w) / 2, Y = (P.H - h) / 2;
      x.save(); x.globalAlpha = 0.5; G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      UI.panel(x, X, Y, w, h, { accent: this.o.col || ACC });
      if (this.o.icon) x.drawImage(P.icon(this.o.icon), X + 8, Y + 6);
      F().draw(x, this.title, X + (this.o.icon ? 30 : 10), Y + 9, this.o.col || ACC);
      this.lines.forEach((l, i) => F().draw(x, l, X + 10, Y + 24 + i * 10, '#f4f0ff', { shadow: '#0e0a14' }));
    }
  }
  UI.Message = Message;
})(window.P);
