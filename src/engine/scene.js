'use strict';
/* Scene runtime: actors, hotspots, camera, walk band, guards, depth-sorted drawing. */
(function (P) {
  const G = P.G, U = P.U, C = P.C;

  /* ======================= Actor ======================= */
  class Actor {
    constructor(def) {
      this.def = def;
      this.id = def.id;
      this.cast = def.cast || def.id;
      this.x = def.x || 160; this.y = def.y || 150;
      this.face = def.face === 'left' ? -1 : 1;
      this.speed = def.speed || 54;
      this.target = null; this.resolve = null;
      this.walkPhase = 0; this.t = Math.random() * 10;
      this.anim = def.pose || null; this.animT = 0; this.animUntil = 0;
      this.expr = null;
      this.talking = false; this.bubble = null; this.emote = null;
      this.visible = true; this.alpha = 1;
      this.blinkT = U.rand(1.5, 4.5); this.blinking = 0;
      this.follow = def.follow || null;
      this.sneak = false;
      this.prop = def.prop || null;     // dynamic prop overlay e.g. 'chipflip'
      this.offY = 0;                      // hop / bob offsets for scripted moments
      this.offX = 0;
    }
    get castDef() { return P.getCast(this.cast); }
    get height() { if (this.def.h) return this.def.h; const c = this.castDef; return c ? c.h : 56; }
    walkTo(x, y, opts = {}) {
      if (this.resolve) { const r = this.resolve; this.resolve = null; r(false); }
      this.target = { x, y: y == null ? this.y : y, run: !!opts.run };
      return new Promise((res) => { this.resolve = res; });
    }
    stop() { this.target = null; if (this.resolve) { const r = this.resolve; this.resolve = null; r(true); } }
    setAnim(name, ms) { this.anim = name; this.animT = 0; this.animUntil = ms ? ms / 1000 : 0; }
    say(text, ms = 2600) { this.bubble = { text, t: 0, dur: ms / 1000 }; }
    emo(kind, ms = 1200) { this.emote = { kind, t: 0, dur: ms / 1000 }; }
    update(dt, scene) {
      this.t += dt; this.animT += dt;
      if (this.animUntil && this.animT >= this.animUntil) { this.anim = null; this.animUntil = 0; }
      if (this.bubble) { this.bubble.t += dt; if (this.bubble.t > this.bubble.dur) this.bubble = null; }
      if (this.emote) { this.emote.t += dt; if (this.emote.t > this.emote.dur) this.emote = null; }
      this.blinkT -= dt;
      if (this.blinkT <= 0) { this.blinking = 0.12; this.blinkT = U.rand(2, 5); }
      if (this.blinking > 0) this.blinking -= dt;
      // follower logic
      if (this.follow && !this.scripted) {
        const L = scene.actors[this.follow];
        if (L && L.visible) {
          const tx = L.x - L.face * 24, ty = U.clamp(L.y - 5, scene.floor.y0, scene.floor.y1);
          const d = U.dist(this.x, this.y, tx, ty);
          if (!this.target && d > 34) this.target = { x: tx, y: ty, follow: true };
          else if (this.target && this.target.follow) { this.target.x = tx; this.target.y = ty; if (d < 6) { this.target = null; } }
          if (!this.target && !L.target && Math.abs(L.x - this.x) > 2) this.face = L.x > this.x ? 1 : -1;
        }
      }
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y;
        const d = Math.hypot(dx, dy);
        const sp = this.speed * (this.target.run ? 1.7 : this.target.follow ? 1.15 : 1) * (this.sneak ? 0.6 : 1);
        if (d < 1.2) {
          this.x = this.target.x; this.y = this.target.y; this.target = null;
          if (this.resolve) { const r = this.resolve; this.resolve = null; r(true); }
        } else {
          const step = Math.min(d, sp * dt);
          let nx = this.x + (dx / d) * step, ny = this.y + (dy / d) * step;
          if (!this.ghost && scene.blocked(nx, ny)) {
            if (!scene.blocked(nx, this.y)) ny = this.y;
            else if (!scene.blocked(this.x, ny)) nx = this.x;
            else { nx = this.x; ny = this.y; }
            if (Math.hypot(nx - this.x, ny - this.y) < 0.01) {
              this.target = null; if (this.resolve) { const r = this.resolve; this.resolve = null; r(false); }
            }
          }
          if (Math.abs(dx) > 0.5) this.face = dx > 0 ? 1 : -1;
          const moved = Math.hypot(nx - this.x, ny - this.y);
          this.walkPhase += moved / (this.sneak ? 20 : 26);
          this.x = nx; this.y = ny;
        }
      }
    }
    pose() {
      let p;
      if (this.anim) {
        const fn = typeof this.anim === 'function' ? this.anim : P.Poses[this.anim];
        p = fn ? fn(this.animT) : P.Poses.idle(this.t);
      } else if (this.target) p = this.sneak ? P.Poses.sneak(this.walkPhase) : P.Poses.walk(this.walkPhase);
      else if (this.talking) p = P.Poses.talk(this.t);
      else p = (P.Poses[this.def.idle] || P.Poses.idle)(this.t);
      p = Object.assign({}, p);
      if (this.expr && (p.face === 'neutral' || p.face === 'talk')) p.face = this.talking && Math.floor(this.t * 8) % 2 ? 'talk' : this.expr;
      if (this.blinking > 0 && (p.face === 'neutral' || p.face === 'happy' || p.face === 'angry')) p.face = 'blink';
      if (this.hold && !p.hold) p.hold = this.hold;
      return p;
    }
    draw(x, camX) {
      if (!this.visible) return;
      const sx = Math.round(this.x - camX + this.offX), sy = Math.round(this.y + this.offY);
      const H = this.height;
      if (this.offY > -40) G.shadow(x, sx, Math.round(this.y) + 1, Math.round(H * 0.2), 2, 0.25);
      if (this.def.draw) { this.def.draw(x, sx, sy, this); return; }
      const p = this.pose();
      const flip = this.face < 0;
      const s = P.Sprite.draw(x, this.cast, sx, sy, p, flip, { alpha: this.alpha < 1 ? this.alpha : null, silhouette: this.silhouette });
      if (this.prop) drawProp(x, this, sx, sy);
      this.lastSprite = s;
    }
    drawOverlay(x, camX, t) {
      if (!this.visible) return;
      const sx = Math.round(this.x - camX + this.offX), top = Math.round(this.y + this.offY - this.height - 6);
      if (this.emote) drawEmote(x, this.emote, sx, top, t);
      if (this.bubble) drawBubble(x, this.bubble.text, sx, top - (this.emote ? 12 : 0), this.castDef);
    }
    bounds() { const h = this.height; return { x: this.x - 11, y: this.y - h - 2, w: 22, h: h + 4 }; }
  }
  P.Actor = Actor;

  function drawProp(x, a, sx, sy) {
    if (a.prop === 'chipflip') {
      const ph = (a.t * 1.4) % 1;
      const hx = sx + a.face * 7, hy = sy - Math.round(a.height * 0.42);
      const lift = Math.round(Math.sin(ph * Math.PI) * 12);
      if (ph < 0.85) { G.rect(x, hx - 1, hy - lift - 1, 3, (Math.floor(a.t * 12) % 2) ? 1 : 2, '#e43b44'); G.px(x, hx, hy - lift - 1, '#ffffff'); }
    } else if (a.prop === 'coinflip') {
      const ph = (a.t * 1.1) % 1;
      const hx = sx + a.face * 7, hy = sy - Math.round(a.height * 0.42);
      const lift = Math.round(Math.sin(ph * Math.PI) * 10);
      if (ph < 0.9) { G.rect(x, hx - 1, hy - lift - 1, 3, (Math.floor(a.t * 12) % 2) ? 1 : 2, '#e8ecf4'); G.px(x, hx, hy - lift - 1, '#ffffff'); }
    } else if (a.prop === 'smoke') {
      const hx = sx + a.face * 7, hy = sy - Math.round(a.height * 0.45);
      G.rect(x, hx, hy, 3, 1, '#7a4a2a'); G.px(x, hx + (a.face > 0 ? 3 : -1), hy, '#ff6a3a');
      for (let i = 0; i < 3; i++) { const ph = (a.t * 0.5 + i / 3) % 1; G.px(x, hx + 2 + Math.round(Math.sin(ph * 7 + i) * 2), hy - 2 - Math.round(ph * 12), `rgba(220,220,230,${0.8 * (1 - ph)})`); }
    } else if (a.prop === 'steam') {
      for (let i = 0; i < 3; i++) { const ph = (a.t * 0.6 + i / 3) % 1; G.px(x, sx + a.face * 6 + Math.round(Math.sin(ph * 6 + i) * 1.5), sy - Math.round(a.height * 0.45) - Math.round(ph * 10), `rgba(255,255,255,${0.7 * (1 - ph)})`); }
    } else if (a.prop === 'zzz') {
      const ph = (a.t * 0.5) % 1;
      P.font.draw(x, 'z', sx + 4 + ph * 6, sy - a.height - 4 - ph * 10, '#c8d0ff');
    } else if (a.prop === 'sweat') {
      const ph = (a.t * 1.2) % 1;
      G.px(x, sx + a.face * 5, sy - a.height + 4 + ph * 6, '#9ad8ff');
    }
  }

  const EMOTES = {
    '!': (x, X, Y) => { G.rect(x, X - 3, Y - 12, 7, 12, '#ffffff'); G.frame(x, X - 3, Y - 12, 7, 12, '#1d1526'); G.rect(x, X - 1, Y - 10, 3, 5, '#e43b44'); G.rect(x, X - 1, Y - 4, 3, 2, '#e43b44'); },
    '?': (x, X, Y) => { G.rect(x, X - 4, Y - 12, 9, 12, '#ffffff'); G.frame(x, X - 4, Y - 12, 9, 12, '#1d1526'); P.font.draw(x, '?', X - 1, Y - 10, '#2a6ab0'); },
    '...': (x, X, Y) => { G.rect(x, X - 7, Y - 8, 15, 8, '#ffffff'); G.frame(x, X - 7, Y - 8, 15, 8, '#1d1526'); for (let i = 0; i < 3; i++) G.rect(x, X - 4 + i * 4, Y - 4, 2, 2, '#1d1526'); },
    heart: (x, X, Y) => { G.heart(x, X - 3, Y - 8, '#ff4a7a'); },
    anger: (x, X, Y) => { const c = '#e43b44'; G.line(x, X - 4, Y - 9, X - 1, Y - 6, c, 2); G.line(x, X + 4, Y - 9, X + 1, Y - 6, c, 2); G.line(x, X - 4, Y - 2, X - 1, Y - 5, c, 2); G.line(x, X + 4, Y - 2, X + 1, Y - 5, c, 2); },
    sweat: (x, X, Y) => { G.ellipse(x, X + 6, Y - 4, 2, 3, '#9ad8ff'); G.px(x, X + 6, Y - 8, '#9ad8ff'); G.px(x, X + 5, Y - 5, '#ffffff'); },
    idea: (x, X, Y) => { G.circle(x, X, Y - 8, 4, '#fee761'); G.rect(x, X - 2, Y - 4, 5, 3, '#c0cbdc'); G.px(x, X - 1, Y - 10, '#ffffff'); for (const [a, b] of [[-7, -8], [7, -8], [0, -15], [-5, -13], [5, -13]]) G.px(x, X + a, Y + b, '#fee761'); },
    music: (x, X, Y) => { P.font.draw(x, '♪', X - 3, Y - 10, '#9be564', { outline: '#1d1526' }); },
    food: (x, X, Y) => { x.drawImage(P.icon('taco'), X - 9, Y - 17); },
    sparkle: (x, X, Y, t) => { G.sparkle(x, X, Y - 6, 3 + Math.round(Math.sin(t * 20)), '#fee761'); },
  };
  function drawEmote(x, e, X, Y, t) {
    const pop = e.t < 0.15 ? Math.round((1 - e.t / 0.15) * 4) : 0;
    const f = EMOTES[e.kind] || EMOTES['!'];
    f(x, X, Y - pop, t);
  }
  P.drawEmote = drawEmote;
  function drawBubble(x, text, X, Y, cd) {
    const lines = P.font.wrap(text, 110);
    const w = Math.max(...lines.map((l) => P.font.width(l))) + 8, h = lines.length * 9 + 5;
    let bx = Math.round(X - w / 2), by = Math.round(Y - h - 4);
    bx = U.clamp(bx, 2, P.W - w - 2); by = Math.max(2, by);
    G.rect(x, bx, by, w, h, '#fffaf0'); G.frame(x, bx - 1, by - 1, w + 2, h + 2, '#1d1526');
    G.hl(x, bx, by + h - 1, w, '#e0d8c8');
    const tx = U.clamp(X, bx + 4, bx + w - 5);
    G.poly(x, [[tx - 3, by + h], [tx + 2, by + h], [tx - 1, by + h + 4]], '#fffaf0');
    G.line(x, tx - 3, by + h, tx - 1, by + h + 4, '#1d1526'); G.line(x, tx + 2, by + h, tx - 1, by + h + 4, '#1d1526');
    lines.forEach((l, i) => P.font.draw(x, l, bx + 4, by + 3 + i * 9, '#2a2038'));
  }
  P.drawBubble = drawBubble;

  /* ======================= Scene runtime ======================= */
  class Scene {
    constructor(def, game) {
      this.def = def; this.game = game;
      this.id = def.id;
      this.W = def.width || P.W;
      this.floor = Object.assign({ x0: 8, x1: this.W - 8, y0: 132, y1: 172 }, def.floor || {});
      this.blockers = def.blockers || [];
      this.camX = 0;
      this.actors = {};
      this.t = 0;
      this.bg = null; this.fg = null; this.variant = null;
    }
    g() { return this.game.g; }
    build() {
      const g = this.g();
      // actors defined by the scene (visibility evaluated live)
      for (const a of this.def.actors || []) {
        if (a.show && !a.show(g)) continue;
        this.addActor(Object.assign({}, a));
      }
      this.renderBg();
    }
    addActor(def) {
      const a = new Actor(def);
      if (def.guard) a.guard = Object.assign({ phase: 0, i: 0, alert: 0 }, def.guard);
      this.actors[a.id] = a;
      return a;
    }
    removeActor(id) { delete this.actors[id]; }
    renderBg() {
      const g = this.g();
      const v = this.def.variant ? this.def.variant(g) : 'default';
      if (this.bg && v === this.variant) return;
      this.variant = v;
      const before = P.props.pineappleCount;
      this.bg = G.canvas(this.W, P.H);
      if (this.def.bg) this.def.bg(this.bg.x, { W: this.W, H: P.H, v, g });
      this.paintedPineapple = P.props.pineappleCount > before;
      if (this.def.fg) { this.fg = G.canvas(this.W, P.H); this.def.fg(this.fg.x, { W: this.W, H: P.H, v, g }); } else this.fg = null;
    }
    blocked(x, y) {
      const f = this.floor;
      if (x < f.x0 || x > f.x1 || y < f.y0 || y > f.y1) return true;
      for (const b of this.blockers) {
        if (b.show && !b.show(this.g())) continue;
        if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return true;
      }
      return false;
    }
    clampToFloor(x, y) {
      const f = this.floor;
      return [U.clamp(x, f.x0, f.x1), U.clamp(y, f.y0, f.y1)];
    }
    // interactable list (actors + hotspots), screen-space aware
    interactables(vision) {
      const g = this.g();
      const list = [];
      for (const a of Object.values(this.actors)) {
        if (!a.visible || a.id === 'shawn' || a.def.noInteract) continue;
        if (a.id === 'gus' && !a.def.talk && !this.game.chapter) continue;
        const cd = a.castDef;
        const b = a.bounds();
        const sx = this.actors.shawn ? this.actors.shawn.x : 0;
        list.push({ kind: 'actor', actor: a, id: a.id, name: a.def.name || (cd ? cd.short : a.id), rect: b, walk: a.def.walk || [a.x + (a.x > sx ? -24 : 24), a.y], depth: a.y });
      }
      for (const h of this.def.hotspots || []) {
        if (h.show && !h.show(g)) continue;
        if (h.secret && !vision) continue;
        list.push({ kind: h.exit ? 'exit' : 'hotspot', hs: h, id: h.id, name: U.call(h.name, g), rect: { x: h.x, y: h.y, w: h.w, h: h.h }, walk: h.walk, depth: h.depth || (h.y + h.h) - 400 });
      }
      return list;
    }
    pick(mx, my, vision) {
      const wx = mx + this.camX;
      const list = this.interactables(vision).filter((o) => U.inRect(wx, my, o.rect));
      list.sort((a, b) => (a.id === 'gus') - (b.id === 'gus') || b.depth - a.depth); // Gus never steals a click
      return list[0] || null;
    }
    nearest(vision) {
      const s = this.actors.shawn;
      if (!s) return null;
      let best = null, bd = 1e9;
      for (const o of this.interactables(vision)) {
        if (o.hs && (o.hs.noFocus || o.hs.walk === null)) continue; // big backdrop hotspots are mouse-only
        const r = o.rect;
        const cx = U.clamp(s.x, r.x, r.x + r.w);
        const target = o.walk || [cx, s.y];
        const dx = Math.abs(s.x - cx), dy = Math.abs(s.y - (o.kind === 'actor' ? o.actor.y : U.clamp(s.y, r.y, r.y + r.h + 40)));
        let d = dx + dy * 0.5;
        if (o.walk) d = Math.min(d, U.dist(s.x, s.y, o.walk[0], o.walk[1]));
        // must roughly face it
        const facing = (cx - s.x) * s.face >= -6;
        if (!facing) d += 30;
        if (o.id === 'gus') d += 14;
        if (d < 34 && d < bd) { bd = d; best = o; }
      }
      return best;
    }
    update(dt) {
      this.t += dt;
      for (const a of Object.values(this.actors)) {
        a.update(dt, this);
        const gd = a.guard;
        if (gd && !(gd.off && gd.off(this.g())) && !(gd.alert > 0)) {
          // guards turn on their own clock and telegraph each turn with a '?'
          if (gd.timer == null) { gd.i = 0; gd.timer = gd.pattern[0].t; }
          gd.timer -= dt;
          const cur = gd.pattern[gd.i % gd.pattern.length], nxt = gd.pattern[(gd.i + 1) % gd.pattern.length];
          if (!a.target) a.face = cur.face === 'left' ? -1 : 1;
          if (gd.timer < 0.8 && nxt.face !== cur.face && !gd.warned) { a.emo('?', 700); gd.warned = true; }
          if (gd.timer <= 0) { gd.i++; gd.timer = gd.pattern[gd.i % gd.pattern.length].t; gd.warned = false; if (cur.say && Math.random() < 0.5) a.say(U.pick(cur.say), 1600); }
        }
      }
      // camera follow
      const s = this.actors[this.camTarget || 'shawn'];
      if (s && this.W > P.W) {
        const tx = U.clamp(s.x - P.W / 2, 0, this.W - P.W);
        this.camX = this.camSnap ? tx : U.lerp(this.camX, tx, Math.min(1, dt * 5));
        if (Math.abs(this.camX - tx) < 0.5) this.camX = tx;
        this.camSnap = false;
      } else if (this.W <= P.W) this.camX = 0;
      if (this.def.update) this.def.update(this, dt, this.g());
    }
    draw(x, opts = {}) {
      const cam = Math.round(this.camX);
      if (this.bg) x.drawImage(this.bg, -cam, 0);
      if (this.def.anim) this.def.anim(x, this.t, { cam, W: this.W, v: this.variant, g: this.g(), scene: this });
      if (this.game.rev && P.Revelation) P.Revelation.drawAura(x, this.game, cam);
      // guard vision cones
      for (const a of Object.values(this.actors)) if (a.guard && a.visible && !a.guard.off) drawCone(x, a, cam, this.t);
      const list = Object.values(this.actors).filter((a) => a.visible).sort((p, q) => p.y - q.y);
      // depth props (foreground objects sorted with actors)
      const props = (this.def.props || []).filter((p) => !p.show || p.show(this.g()));
      let pi = 0; props.sort((a, b) => a.y - b.y);
      for (const a of list) {
        while (pi < props.length && props[pi].y <= a.y) { props[pi].draw(x, cam, this.t, this.g()); pi++; }
        a.draw(x, cam);
      }
      while (pi < props.length) { props[pi].draw(x, cam, this.t, this.g()); pi++; }
      if (this.fg) x.drawImage(this.fg, -cam, 0);
      if (this.def.overlay) this.def.overlay(x, this.t, { cam, g: this.g(), scene: this });
    }
    drawOverlays(x) {
      const cam = Math.round(this.camX);
      for (const a of Object.values(this.actors)) a.drawOverlay(x, cam, this.t);
    }
  }
  function drawCone(x, a, cam, t) {
    const gd = a.guard;
    const range = gd.range || 90;
    const sx = Math.round(a.x - cam), sy = Math.round(a.y - a.height * 0.75);
    x.save();
    x.globalAlpha = gd.alert > 0 ? 0.32 : 0.13 + Math.sin(t * 4) * 0.03;
    x.fillStyle = gd.alert > 0 ? '#ff3a4a' : '#fff2a0';
    x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + a.face * range, sy - 18); x.lineTo(sx + a.face * range, a.y + 6); x.closePath(); x.fill();
    x.restore();
  }
  P.Scene = Scene;
})(window.P);
