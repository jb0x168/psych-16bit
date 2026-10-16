'use strict';
/* Santa Barbara travel map. Spots come from P.world.mapSpots plus the chapter's `map` list. */
(function (P) {
  const G = P.G, U = P.U, UI = P.UI;
  const F = () => P.font, I = () => P.input;
  let bgCache = null;

  function paintMap() {
    const c = G.canvas(P.W, P.H), x = c.x;
    // ocean
    G.bands(x, 0, 0, P.W, P.H, ['#1a5a9a', '#1e66a8', '#2272b4'], 0);
    for (let i = 0; i < 200; i++) { const r = U.rng('mapwave' + i); G.hl(x, Math.floor(r() * P.W), 100 + Math.floor(r() * 80), 3, '#3a8ac8'); }
    // land (coast runs roughly east-west, Santa Barbara faces south)
    const coast = [];
    const r = U.rng('coast');
    for (let px = 0; px <= P.W; px += 8) coast.push([px, 112 + Math.sin(px / 40) * 6 + r() * 3]);
    G.poly(x, [[0, 0], [P.W, 0]].concat(coast.slice().reverse()), '#e8d8a8');
    G.poly(x, [[0, 0], [P.W, 0]].concat(coast.map(([a, b]) => [a, b - 4]).reverse()), '#8ab86a');
    G.noise(x, 0, 30, P.W, 80, ['#7aa85a', '#9ac87a'], 0.08, 'mapgrass');
    // mountains
    P.props.mountains(x, -10, 34, P.W + 20, '#6a7a8a', 'mapmtn', 26, 20);
    P.props.mountains(x, -10, 38, P.W + 20, '#5a6a6a', 'mapmtn2', 14, 14);
    // streets
    for (let yy = 48; yy < 106; yy += 12) G.hl(x, 30, yy, P.W - 60, '#d8d0b8');
    for (let xx = 40; xx < P.W - 30; xx += 22) G.vl(x, xx, 46, 62, '#d8d0b8');
    G.line(x, 10, 100, P.W - 10, 96, '#f4e8c0', 2); // coastal road
    // pier
    G.rect(x, 168, 112, 3, 22, '#9a7048'); G.rect(x, 164, 132, 12, 4, '#9a7048');
    // compass + title
    UI.panel(x, 4, 158, 112, 18);
    F().draw(x, 'SANTA BARBARA, CA', 10, 164, '#fee761');
    G.circle(x, 300, 160, 9, '#f4ecd6'); F().draw(x, 'N', 298, 152, '#c83a3a'); G.line(x, 300, 154, 300, 166, '#2a2028');
    return c;
  }

  class MapScreen {
    constructor(game) {
      this.game = game; this.t = 0;
      this.promise = new Promise((r) => { this.res = r; });
      const g = game.g;
      const all = Object.assign({}, P.world.mapSpots, (game.chapter && game.chapter.map) || {});
      this.spots = Object.entries(all).map(([id, s]) => Object.assign({ id }, s)).filter((s) => !s.show || s.show(g));
      const cur = game.scene ? game.scene.id : null;
      this.from = this.spots.find((s) => s.scene === cur || (s.scenes || []).includes(cur)) || this.spots[0];
      this.sel = Math.max(0, this.spots.indexOf(this.from));
      this.car = { x: this.from.x, y: this.from.y };
      this.travel = null;
      this.prevScene = cur;
      if (!bgCache) bgCache = paintMap();
    }
    update(dt) {
      this.t += dt;
      if (this.travel) {
        const tr = this.travel; tr.t += dt;
        const k = U.ease.inOut(Math.min(1, tr.t / tr.dur));
        this.car.x = U.lerp(tr.a.x, tr.b.x, k); this.car.y = U.lerp(tr.a.y, tr.b.y, k) - Math.sin(k * Math.PI) * 6;
        if (tr.t >= tr.dur + 0.15) { this.travel = null; this.res({ scene: tr.b.scene }); }
        return;
      }
      if (P.debugAuto && P.debugMap) { const id = P.debugMap(this.spots); const s = this.spots.find((q) => q.id === id || q.scene === id); if (s) { this.go(s); return; } }
      const n = this.spots.length;
      const cur = this.spots[this.sel];
      const dir = (dx, dy) => {
        let best = null, bd = 1e9;
        for (const s of this.spots) { if (s === cur) continue; const vx = s.x - cur.x, vy = s.y - cur.y; if (vx * dx + vy * dy <= 0) continue; const d = Math.hypot(vx, vy) * (1 + Math.abs(dx ? vy : vx) / 40); if (d < bd) { bd = d; best = s; } }
        if (best) { this.sel = this.spots.indexOf(best); P.audio.sfx('select'); }
      };
      if (I().pressed('left')) dir(-1, 0); if (I().pressed('right')) dir(1, 0); if (I().pressed('up')) dir(0, -1); if (I().pressed('down')) dir(0, 1);
      if (I().moved || I().clicked) this.spots.forEach((s, i) => { if (UI.mouseIn(s.x - 9, s.y - 16, 18, 20)) { if (this.sel !== i && !I().clicked) P.audio.sfx('select'); this.sel = i; if (I().clicked) this.go(s); } });
      if (I().clicked && UI.mouseIn(P.W - 60, 4, 56, 14)) { this.cancel(); return; }
      if (I().pressed('confirm')) this.go(this.spots[this.sel]);
      if (I().pressed('cancel') || I().rclicked) this.cancel();
    }
    go(s) {
      P.audio.sfx('confirm');
      if (s === this.from) { this.res({ scene: s.scene }); return; }
      P.audio.sfx('car');
      this.travel = { a: { x: this.car.x, y: this.car.y }, b: s, t: 0, dur: P.debugAuto ? 0.05 : 1.1 };
    }
    cancel() { P.audio.sfx('cancel'); this.res(this.prevScene ? { scene: this.prevScene } : { scene: this.from.scene }); }
    draw(x) {
      x.drawImage(bgCache, 0, 0);
      const t = this.t;
      this.spots.forEach((s, i) => {
        const hot = i === this.sel;
        const bob = hot ? Math.round(Math.sin(t * 6) * 2) : 0;
        G.ellipse(x, s.x, s.y + 1, 4, 2, 'rgba(0,0,0,0.3)');
        G.poly(x, [[s.x - 5, s.y - 12 + bob], [s.x + 5, s.y - 12 + bob], [s.x, s.y + bob]], '#0e0a14');
        G.circle(x, s.x, s.y - 12 + bob, 5, '#0e0a14');
        G.circle(x, s.x, s.y - 12 + bob, 4, s.color || (s.chapter ? '#e43b44' : '#2a8ad8'));
        G.px(x, s.x - 1, s.y - 14 + bob, '#ffffff');
        if (s.isNew) { G.sparkle(x, s.x + 6, s.y - 18, 2, '#fee761'); }
        F().draw(x, s.name, s.x, s.y + 3, hot ? '#ffffff' : '#2a2038', { align: 'center', outline: hot ? '#2a2038' : null });
      });
      // the Blueberry
      const cx = Math.round(this.car.x), cy = Math.round(this.car.y);
      G.rect(x, cx - 7, cy - 6, 14, 5, '#3a5ad8'); G.rect(x, cx - 4, cy - 9, 8, 3, '#4a6ae8'); G.rect(x, cx - 3, cy - 8, 6, 2, '#9ac8e8');
      G.rect(x, cx - 6, cy - 2, 3, 2, '#1a1a22'); G.rect(x, cx + 3, cy - 2, 3, 2, '#1a1a22');
      const s = this.spots[this.sel];
      if (s) {
        const desc = s.desc ? U.call(s.desc, this.game.g) : '';
        const lines = F().wrap(desc, 190);
        UI.panel(x, 122, 140, 194, 14 + lines.length * 9 + 2, { accent: '#fee761' });
        F().draw(x, s.name, 128, 144, '#fee761');
        lines.forEach((l, i) => F().draw(x, l, 128, 155 + i * 9, '#d8d0ff'));
      }
      UI.button(x, P.W - 60, 4, 56, 14, 'BACK (ESC)', false);
      F().draw(x, 'WHERE TO, GUS?', 6, 6, '#ffffff', { outline: '#0e0a14' });
    }
  }
  P.MapScreen = MapScreen;
})(window.P);
