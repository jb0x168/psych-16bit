'use strict';
/* Background prop library used by scene painters, plus the 16x16 icon set for clues/items.
   Every function draws into ctx `x` at integer native coordinates. */
(function (P) {
  const G = P.G, U = P.U, C = P.C;
  const sh = U.shade;
  const R = P.props = {};
  R.pineappleCount = 0; // engine sanity check: every chapter must paint at least one

  /* ---------------- skies & landscape ---------------- */
  const SKY = {
    day: ['#5fb4f0', '#76c2f4', '#8fcff6', '#a8dbf7', '#c2e7f8', '#dcf1f8'],
    sunset: ['#3a2a6a', '#6a3a7a', '#a8467a', '#e0607a', '#f4906a', '#ffc070'],
    dusk: ['#1e2250', '#2e3266', '#46407a', '#6a4c88', '#9a5a8a', '#c87a8a'],
    night: ['#0a0c22', '#10142e', '#161c3a', '#1c2446', '#222c52', '#2a365e'],
    overcast: ['#7a8aa0', '#8898ac', '#98a6b8', '#a8b4c4', '#b8c2d0', '#c8d0dc'],
    storm: ['#141824', '#1a1e2c', '#202634', '#262e3e', '#2e3848', '#384254'],
  };
  R.SKY = SKY;
  R.sky = (x, X, Y, W, H, kind = 'day') => G.bands(x, X, Y, W, H, SKY[kind] || SKY.day, 3);
  R.stars = (x, X, Y, W, H, seed = 'stars', n = 60) => {
    const r = U.rng(seed);
    for (let i = 0; i < n; i++) { const c = r() > 0.8 ? '#ffffff' : r() > 0.5 ? '#c8d0ff' : '#7a84b8'; G.px(x, X + Math.floor(r() * W), Y + Math.floor(r() * H), c); }
  };
  R.sun = (x, cx, cy, r = 9, col = '#fff2a8') => { G.circle(x, cx, cy, r + 2, sh(col, -0.1)); G.circle(x, cx, cy, r, col); G.circle(x, cx - 2, cy - 2, r - 4, '#fffbe0'); };
  R.moon = (x, cx, cy, r = 7) => { G.circle(x, cx, cy, r, '#f4f0d8'); G.circle(x, cx + 3, cy - 2, r - 1, '#00000000'); G.px(x, cx - 2, cy + 1, '#d8d0b0'); G.px(x, cx + 1, cy + 3, '#d8d0b0'); G.px(x, cx - 3, cy - 3, '#d8d0b0'); };
  R.cloud = (x, X, Y, w = 30, col = '#ffffff', shade = '#d8e8f4') => {
    G.ellipse(x, X + w * 0.5, Y + 6, w * 0.5, 4, shade);
    G.ellipse(x, X + w * 0.3, Y + 3, w * 0.25, 4, col); G.ellipse(x, X + w * 0.6, Y + 1, w * 0.28, 5, col); G.ellipse(x, X + w * 0.5, Y + 5, w * 0.45, 3, col);
  };
  R.mountains = (x, X, baseY, W, col, seed = 'mtn', amp = 22, step = 18) => {
    const r = U.rng(seed);
    const pts = [[X, baseY]];
    for (let px = X; px <= X + W + step; px += step) pts.push([px, baseY - amp * (0.4 + r() * 0.6)]);
    pts.push([X + W + step, baseY]);
    G.poly(x, pts, col);
    // snow/ridge highlights
    for (let i = 1; i < pts.length - 1; i++) G.line(x, pts[i][0], pts[i][1], pts[i][0] + 4, pts[i][1] + 5, sh(col, 0.15));
  };
  R.hills = (x, X, baseY, W, col, seed = 'hill', amp = 10) => {
    const r = U.rng(seed);
    let y = baseY - amp * r();
    for (let px = X; px < X + W; px++) {
      y += (r() - 0.5) * 1.2; y = U.clamp(y, baseY - amp, baseY - 2);
      G.vl(x, px, Math.round(y), baseY - Math.round(y) + 1, col);
    }
  };
  R.ocean = (x, X, Y, W, H, kind = 'day') => {
    const pal = kind === 'sunset' ? ['#3a3a7a', '#4a4a8a', '#6a5a9a', '#8a6aa0'] : kind === 'night' ? ['#0c1a3a', '#10224a', '#162a56', '#1c3262'] : ['#1a6aa8', '#2280c0', '#2a94d0', '#3aa8dc'];
    G.bands(x, X, Y, W, H, pal, 2);
    const r = U.rng('sea' + X + Y);
    for (let i = 0; i < W * H / 40; i++) G.hl(x, X + Math.floor(r() * W), Y + Math.floor(r() * H), 2 + Math.floor(r() * 4), kind === 'night' ? '#2a4a7a' : kind === 'sunset' ? '#c88aa0' : '#7ac8f0');
  };
  R.sand = (x, X, Y, W, H, base = '#ecd2a0') => {
    G.rect(x, X, Y, W, H, base);
    G.dither(x, X, Y, W, 3, sh(base, -0.1), 6);
    G.noise(x, X, Y, W, H, [sh(base, -0.12), sh(base, 0.12), sh(base, -0.06)], 0.06, 'sand' + X + Y);
  };
  R.grass = (x, X, Y, W, H, base = '#5aa04a') => {
    G.rect(x, X, Y, W, H, base);
    G.noise(x, X, Y, W, H, [sh(base, -0.15), sh(base, 0.12)], 0.12, 'grass' + X + Y);
    const r = U.rng('blades' + X);
    for (let i = 0; i < W / 3; i++) { const px = X + Math.floor(r() * W); G.vl(x, px, Y - 1, 2, sh(base, 0.15)); }
  };
  R.road = (x, X, Y, W, H) => {
    G.rect(x, X, Y, W, H, '#4a4a56'); G.noise(x, X, Y, W, H, ['#55556a', '#3e3e4a'], 0.08, 'road' + X);
    for (let px = X + 6; px < X + W; px += 28) G.rect(x, px, Y + Math.floor(H / 2), 14, 1, '#e8d880');
  };
  R.sidewalk = (x, X, Y, W, H) => {
    G.rect(x, X, Y, W, H, '#b8b0a8'); G.hl(x, X, Y, W, '#d8d0c8');
    for (let px = X; px < X + W; px += 24) G.vl(x, px, Y, H, '#9a948e');
  };

  /* ---------------- vegetation ---------------- */
  R.palm = (x, X, Y, h = 60, seed = 'palm') => {
    const r = U.rng(seed);
    const lean = (r() - 0.5) * 14;
    for (let i = 0; i < h; i++) {
      const t = i / h, px = X + Math.round(lean * t * t);
      G.rect(x, px - 2, Y - i, 5, 1, i % 4 === 0 ? '#7a5434' : '#9a6c44');
      G.px(x, px + 2, Y - i, '#6a4628');
    }
    const tx = X + Math.round(lean), ty = Y - h;
    const fronds = [[-22, 6], [-16, -6], [-6, -12], [8, -12], [18, -6], [24, 6], [-12, 10], [14, 10]];
    for (const [dx, dy] of fronds) {
      const steps = 10;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = tx + dx * t, py = ty + dy * t + Math.sin(t * Math.PI) * -3 + t * t * 6;
        G.rect(x, px - 1, py, 3, 2, s % 3 ? '#3e8a3a' : '#2e6a30');
        if (s > 2) { G.px(x, px, py + 2, '#2a5a2a'); G.px(x, px + (dx > 0 ? -1 : 1), py - 1, '#5aaa48'); }
      }
    }
    G.circle(x, tx, ty + 1, 3, '#6a4a2a'); G.px(x, tx - 2, ty + 2, '#4a3018'); G.px(x, tx + 2, ty + 3, '#4a3018');
  };
  R.bush = (x, X, Y, w = 20, col = '#3e8948') => {
    G.ellipse(x, X + w / 2, Y - 5, w / 2, 6, sh(col, -0.2)); G.ellipse(x, X + w / 2 - 2, Y - 7, w / 2 - 3, 5, col);
    G.noise(x, X + 2, Y - 11, w - 4, 8, [sh(col, 0.2), sh(col, -0.25)], 0.2, 'bush' + X);
  };
  R.tree = (x, X, Y, h = 50, col = '#3e8948', seed = 'tree') => {
    G.rect(x, X - 2, Y - h * 0.45, 5, h * 0.45, '#6a4a2e'); G.vl(x, X + 2, Y - h * 0.45, h * 0.45, '#4a3018');
    const r = U.rng(seed);
    for (let i = 0; i < 6; i++) G.circle(x, X + (r() - 0.5) * 18, Y - h * 0.55 - r() * h * 0.35, 9 + r() * 5, i % 2 ? col : sh(col, -0.15));
    G.noise(x, X - 16, Y - h, 32, h * 0.5, [sh(col, 0.2), sh(col, -0.3)], 0.15, seed + 'n');
  };
  R.flowers = (x, X, Y, W, seed = 'fl') => {
    const r = U.rng(seed);
    for (let i = 0; i < W / 3; i++) { const px = X + Math.floor(r() * W); G.vl(x, px, Y - 3, 3, '#3e8948'); G.px(x, px, Y - 4, ['#ff6aa0', '#fee761', '#ffffff', '#b55088'][Math.floor(r() * 4)]); }
  };
  R.plant = (x, X, Y, h = 24, pot = '#b86f50') => {
    G.poly(x, [[X - 6, Y - 10], [X + 6, Y - 10], [X + 5, Y], [X - 5, Y]], pot); G.hl(x, X - 6, Y - 10, 13, sh(pot, 0.25)); G.vl(x, X + 4, Y - 9, 9, sh(pot, -0.25));
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.38, len = h - 6 - Math.abs(i - 3) * 2;
      G.line(x, X, Y - 10, X + Math.cos(a) * len * 0.6, Y - 10 + Math.sin(a) * len, i % 2 ? '#3e8948' : '#4ea858', 2);
    }
  };

  /* ---------------- the pineapple ---------------- */
  // size: 0 = tiny (shelf/fruit bowl), 1 = normal, 2 = large (sign/statue)
  R.pineapple = (x, X, Y, size = 1) => {
    R.pineappleCount++;
    const s = [0.6, 1, 1.8][size] || 1;
    const bw = Math.max(2, Math.round(4 * s)), bh = Math.max(3, Math.round(6 * s));
    const cx = X, by = Y - bh; // body centre
    // crown
    const ch = Math.round(7 * s);
    for (let i = -2; i <= 2; i++) G.line(x, cx, by - bh + 1, cx + i * Math.max(1, Math.round(1.6 * s)), by - bh - ch + Math.abs(i) * Math.round(2 * s), i % 2 ? '#3e8948' : '#63c74d', size === 2 ? 2 : 1);
    // body
    G.ellipse(x, cx, by, bw, bh, '#d8962a');
    G.ellipse(x, cx - Math.round(s), by - Math.round(s), Math.max(1, bw - 1), Math.max(1, bh - 1), '#f2b83a');
    for (let yy = -bh + 1; yy < bh; yy += Math.max(2, Math.round(2 * s))) for (let xx = -bw + 1; xx < bw; xx += Math.max(2, Math.round(2 * s))) G.px(x, cx + xx + ((yy / 2) & 1), by + yy, '#9a5a1a');
    if (size >= 1) G.px(x, cx - Math.round(bw / 2), by - Math.round(bh / 2), '#fff0a0');
  };

  /* ---------------- architecture ---------------- */
  R.wall = (x, X, Y, W, H, col, o = {}) => {
    G.rect(x, X, Y, W, H, col);
    if (o.texture !== false) G.noise(x, X, Y, W, H, [sh(col, 0.05), sh(col, -0.05)], 0.05, 'wall' + col + X);
    if (o.stripes) for (let px = X; px < X + W; px += o.stripes) G.vl(x, px, Y, H, sh(col, -0.06));
    if (o.wainscot) {
      const wy = Y + H - o.wainscot;
      G.rect(x, X, wy, W, o.wainscot, o.wainscotCol || sh(col, -0.25));
      G.hl(x, X, wy, W, sh(o.wainscotCol || col, 0.2)); G.hl(x, X, wy + 1, W, sh(o.wainscotCol || col, -0.35));
      for (let px = X + 4; px < X + W; px += 16) G.vl(x, px, wy + 3, o.wainscot - 4, sh(o.wainscotCol || sh(col, -0.25), -0.15));
    }
    if (o.crown) { G.rect(x, X, Y, W, 3, sh(col, -0.2)); G.hl(x, X, Y + 3, W, sh(col, 0.15)); }
    G.rect(x, X, Y + H - 3, W, 3, o.baseboard || sh(col, -0.45));
  };
  R.brick = (x, X, Y, W, H, col = '#a85a3e') => {
    G.rect(x, X, Y, W, H, col);
    for (let yy = 0; yy < H; yy += 5) {
      G.hl(x, X, Y + yy, W, sh(col, -0.3));
      for (let xx = (yy / 5) % 2 ? 0 : 6; xx < W; xx += 12) G.vl(x, X + xx, Y + yy, 5, sh(col, -0.3));
    }
    G.noise(x, X, Y, W, H, [sh(col, 0.12), sh(col, -0.12)], 0.06, 'brick' + X + Y);
  };
  R.siding = (x, X, Y, W, H, col) => {
    G.rect(x, X, Y, W, H, col);
    for (let yy = 0; yy < H; yy += 4) { G.hl(x, X, Y + yy + 3, W, sh(col, -0.2)); G.hl(x, X, Y + yy, W, sh(col, 0.1)); }
  };
  R.stucco = (x, X, Y, W, H, col) => { G.rect(x, X, Y, W, H, col); G.noise(x, X, Y, W, H, [sh(col, 0.08), sh(col, -0.08)], 0.12, 'stucco' + X + Y); };
  R.roofTiles = (x, X, Y, W, H, col = '#c0583a') => {
    G.rect(x, X, Y, W, H, col);
    for (let yy = 0; yy < H; yy += 3) for (let xx = (yy / 3) % 2 ? 0 : 2; xx < W; xx += 4) { G.px(x, X + xx, Y + yy + 2, sh(col, -0.3)); G.px(x, X + xx + 1, Y + yy, sh(col, 0.2)); }
  };
  R.floor = (x, X, Y, W, H, kind = 'wood', col) => {
    if (kind === 'wood') {
      col = col || '#a8744a';
      G.rect(x, X, Y, W, H, col);
      for (let yy = 0; yy < H; yy += 4) { G.hl(x, X, Y + yy, W, sh(col, -0.22)); const off = ((yy / 4) * 23) % 37; for (let xx = off; xx < W; xx += 37) G.vl(x, X + xx, Y + yy, 4, sh(col, -0.22)); }
      G.noise(x, X, Y, W, H, [sh(col, 0.08), sh(col, -0.08)], 0.05, 'wood' + X + Y);
    } else if (kind === 'tile') {
      col = col || '#c8c4bc';
      G.rect(x, X, Y, W, H, col);
      for (let yy = 0; yy < H; yy += 10) G.hl(x, X, Y + yy, W, sh(col, -0.15));
      for (let xx = 0; xx < W; xx += 14) G.vl(x, X + xx, Y, H, sh(col, -0.15));
      G.dither(x, X, Y, W, 2, sh(col, -0.3), 8);
    } else if (kind === 'checker') {
      col = col || '#e8e0d0';
      const c2 = sh(col, -0.45);
      for (let yy = 0; yy < H; yy += 8) for (let xx = 0; xx < W; xx += 8) G.rect(x, X + xx, Y + yy, 8, 8, ((xx + yy) / 8) % 2 ? c2 : col);
    } else if (kind === 'carpet') {
      col = col || '#5a4a7a';
      G.rect(x, X, Y, W, H, col); G.dither(x, X, Y, W, H, sh(col, -0.1), 4); G.dither(x, X, Y, W, 3, sh(col, -0.3), 8);
    } else if (kind === 'concrete') {
      col = col || '#8a8a92';
      G.rect(x, X, Y, W, H, col); G.noise(x, X, Y, W, H, [sh(col, 0.1), sh(col, -0.1)], 0.1, 'conc' + X);
      for (let xx = 0; xx < W; xx += 40) G.vl(x, X + xx, Y, H, sh(col, -0.2));
    } else if (kind === 'planks') {
      col = col || '#9a7048';
      G.rect(x, X, Y, W, H, col);
      for (let xx = 0; xx < W; xx += 8) { G.vl(x, X + xx, Y, H, sh(col, -0.3)); G.vl(x, X + xx + 1, Y, H, sh(col, 0.12)); }
      G.noise(x, X, Y, W, H, [sh(col, -0.2)], 0.02, 'plank' + X);
    }
  };
  R.window = (x, X, Y, W, H, o = {}) => {
    const frame = o.frame || '#e8e0d0';
    G.rect(x, X - 2, Y - 2, W + 4, H + 4, sh(frame, -0.3)); G.rect(x, X - 1, Y - 1, W + 2, H + 2, frame);
    const sky = o.night ? ['#141a3a', '#1e2a4e'] : o.sunset ? ['#e0707a', '#f4a070'] : ['#8fcff6', '#c8ecf8'];
    G.bands(x, X, Y, W, H, sky, 2);
    if (o.view === 'palms') { R.palm(x, X + W * 0.7, Y + H + 8, H * 0.8, 'wpalm' + X); }
    if (o.view === 'city') { for (let i = 0; i < 4; i++) G.rect(x, X + i * (W / 4) + 1, Y + H * 0.5 + (i % 2) * 4, W / 4 - 2, H * 0.5, o.night ? '#2a3050' : '#a8b8c8'); }
    if (o.view === 'sea') { G.rect(x, X, Y + H * 0.6, W, H * 0.4, o.night ? '#162a56' : '#2a94d0'); }
    G.px(x, X + 2, Y + 2, '#ffffff'); G.line(x, X + 3, Y + 5, X + 6, Y + 2, '#e8f8ff');
    if (o.blinds) {
      for (let yy = Y; yy < Y + (o.blindsDown || H); yy += 3) { G.hl(x, X, yy, W, o.blindsCol || '#e8e2d4'); G.hl(x, X, yy + 1, W, sh(o.blindsCol || '#e8e2d4', -0.15)); }
    }
    if (o.cross !== false) { G.vl(x, X + Math.floor(W / 2), Y, H, frame); if (H > 20) G.hl(x, X, Y + Math.floor(H / 2), W, frame); }
    G.rect(x, X - 3, Y + H + 1, W + 6, 2, sh(frame, -0.1));
  };
  R.door = (x, X, Y, W, H, col = '#8a5a3a', o = {}) => {
    G.rect(x, X - 2, Y - 2, W + 4, H + 2, sh(col, -0.4));
    G.rect(x, X, Y, W, H, col);
    if (o.glass) { G.rect(x, X + 3, Y + 3, W - 6, H * 0.45, '#9ac8e8'); G.line(x, X + 4, Y + 8, X + 8, Y + 4, '#e8f8ff'); if (o.label) P.font.draw(x, o.label, X + W / 2, Y + 8, o.labelCol || '#2a2440', { align: 'center' }); }
    else { G.frame(x, X + 3, Y + 4, W - 6, H * 0.35, sh(col, -0.2)); G.frame(x, X + 3, Y + H * 0.5, W - 6, H * 0.4, sh(col, -0.2)); }
    G.rect(x, X + W - 5, Y + H * 0.55, 2, 2, '#fee761');
    G.vl(x, X, Y, H, sh(col, 0.2));
  };
  R.sign = (x, X, Y, W, H, text, o = {}) => {
    const bg = o.bg || '#2a2440', fg = o.fg || '#fee761';
    G.rect(x, X - 1, Y - 1, W + 2, H + 2, o.border || sh(bg, -0.4));
    G.rect(x, X, Y, W, H, bg);
    G.hl(x, X, Y, W, sh(bg, 0.25));
    if (text) P.font.draw(x, text, X + W / 2, Y + Math.floor((H - 7) / 2), fg, { align: 'center', shadow: o.shadow === false ? null : sh(bg, -0.5) });
    if (o.posts) { G.rect(x, X + 3, Y + H, 2, o.posts, '#6a5a4a'); G.rect(x, X + W - 5, Y + H, 2, o.posts, '#6a5a4a'); }
  };
  R.poster = (x, X, Y, W, H, kind = 'movie', seed = 'p') => {
    const r = U.rng(seed);
    const bgs = ['#c83a4a', '#2a6ab0', '#e8a030', '#3a8a5a', '#7a3a8a', '#1a1a2a'];
    const bg = bgs[Math.floor(r() * bgs.length)];
    G.rect(x, X - 1, Y - 1, W + 2, H + 2, '#1a1424'); G.rect(x, X, Y, W, H, bg);
    if (kind === 'movie') { G.circle(x, X + W / 2, Y + H * 0.4, Math.min(W, H) * 0.25, sh(bg, 0.4)); G.rect(x, X + 2, Y + H - 6, W - 4, 2, '#fff8e0'); G.rect(x, X + 3, Y + H - 3, W - 6, 1, sh(bg, 0.5)); }
    else if (kind === 'wanted') { G.rect(x, X, Y, W, H, '#f4ecd6'); G.rect(x, X + 2, Y + 2, W - 4, 3, '#2a2028'); G.rect(x, X + W / 2 - 3, Y + 7, 6, 7, '#8a7a6a'); G.circle(x, X + W / 2, Y + 8, 2, '#6a5a4a'); G.hl(x, X + 2, Y + H - 4, W - 4, '#8a3030'); }
    else if (kind === 'surf') { G.rect(x, X, Y, W, H * 0.6, '#ffb060'); G.rect(x, X, Y + H * 0.6, W, H * 0.4, '#2a94d0'); G.line(x, X + 2, Y + H - 2, X + W - 3, Y + 3, '#fff8e0', 2); }
    else if (kind === 'map') { G.rect(x, X, Y, W, H, '#e8dcb8'); G.noise(x, X, Y, W, H, ['#8ab07a', '#7aa0c8'], 0.2, seed); G.line(x, X + 2, Y + 3, X + W - 3, Y + H - 4, '#c83030'); }
    else if (kind === 'chart') { G.rect(x, X, Y, W, H, '#f4f4f8'); for (let i = 0; i < 4; i++) G.rect(x, X + 2 + i * 4, Y + H - 3 - (i + 1) * 3, 3, (i + 1) * 3, ['#e43b44', '#feae34', '#63c74d', '#0099db'][i]); }
  };
  R.frame = (x, X, Y, W, H, kind = 'landscape', seed = 'f') => {
    G.rect(x, X - 2, Y - 2, W + 4, H + 4, '#8a6a2a'); G.frame(x, X - 1, Y - 1, W + 2, H + 2, '#c8a040');
    if (kind === 'landscape') { G.bands(x, X, Y, W, H, ['#8fcff6', '#c8ecf8', '#7ab060', '#5a8a48'], 1); G.circle(x, X + W - 5, Y + 4, 2, '#fff2a8'); }
    else if (kind === 'portrait') { G.rect(x, X, Y, W, H, '#3a2a3a'); G.ellipse(x, X + W / 2, Y + H * 0.38, W * 0.22, H * 0.18, '#e8b796'); G.rect(x, X + W * 0.2, Y + H * 0.6, W * 0.6, H * 0.4, '#2a2030'); }
    else if (kind === 'photo') { G.rect(x, X, Y, W, H, '#e8e0d0'); G.rect(x, X + 2, Y + 2, W - 4, H - 4, '#7ab0d0'); G.circle(x, X + W / 2 - 2, Y + H / 2, 2, '#e8b796'); G.circle(x, X + W / 2 + 3, Y + H / 2, 2, '#7a4a32'); }
    else if (kind === 'fish') { G.rect(x, X, Y, W, H, '#3a6a8a'); G.ellipse(x, X + W / 2, Y + H / 2, W * 0.35, H * 0.22, '#c0cbdc'); G.poly(x, [[X + W * 0.8, Y + H / 2], [X + W - 2, Y + 2], [X + W - 2, Y + H - 2]], '#c0cbdc'); G.px(x, X + W * 0.25, Y + H / 2 - 1, '#1a1424'); }
  };
  R.clock = (x, cx, cy, r = 6) => { G.circle(x, cx, cy, r + 1, '#2a2028'); G.circle(x, cx, cy, r, '#f4f0e8'); G.line(x, cx, cy, cx, cy - r + 2, '#1a1424'); G.line(x, cx, cy, cx + r - 3, cy, '#1a1424'); G.px(x, cx, cy, '#e43b44'); };
  R.flag = (x, X, Y, kind = 'us') => {
    G.vl(x, X, Y, 34, '#c8b060'); G.px(x, X, Y - 1, '#fee761');
    if (kind === 'us') { for (let i = 0; i < 7; i++) G.hl(x, X + 1, Y + 1 + i * 2, 16, i % 2 ? '#f4f4f4' : '#c83a3a'); G.rect(x, X + 1, Y + 1, 7, 7, '#2a3a8a'); G.dither(x, X + 1, Y + 1, 7, 7, '#ffffff', 3); }
    else { G.rect(x, X + 1, Y + 1, 16, 12, '#f4f4f4'); G.hl(x, X + 1, Y + 12, 16, '#c83a3a'); G.ellipse(x, X + 9, Y + 7, 4, 2, '#7a4a2a'); G.px(x, X + 3, Y + 3, '#c83a3a'); }
  };

  /* ---------------- furniture ---------------- */
  R.desk = (x, X, Y, W = 50, col = '#8a5a3a', o = {}) => {
    // Y = floor line under the desk
    const top = Y - 22;
    G.rect(x, X, top, W, 4, sh(col, 0.15)); G.hl(x, X, top, W, sh(col, 0.35));
    G.rect(x, X + 2, top + 4, W - 4, 18, col);
    G.rect(x, X + 2, top + 4, W - 4, 2, sh(col, -0.3));
    if (o.drawers !== false) { G.frame(x, X + W - 18, top + 7, 14, 6, sh(col, -0.25)); G.frame(x, X + W - 18, top + 14, 14, 6, sh(col, -0.25)); G.hl(x, X + W - 13, top + 10, 4, '#d8c070'); G.hl(x, X + W - 13, top + 17, 4, '#d8c070'); }
    G.rect(x, X + 2, Y - 1, W - 4, 1, sh(col, -0.5));
    return top;
  };
  R.computer = (x, X, Y, o = {}) => { // Y = desk top
    G.rect(x, X, Y - 14, 16, 12, '#c8c4bc'); G.rect(x, X + 1, Y - 13, 14, 9, o.screen || '#2a4a6a'); G.dither(x, X + 1, Y - 13, 14, 9, '#3a6a9a', 4);
    if (o.text) for (let i = 0; i < 3; i++) G.hl(x, X + 3, Y - 11 + i * 2, 6 + (i * 3) % 5, '#7ae2a0');
    G.rect(x, X + 6, Y - 2, 4, 2, '#a8a49c'); G.rect(x, X - 2, Y - 1, 14, 1, '#d8d4cc');
  };
  R.chair = (x, X, Y, col = '#3a3a4a') => {
    G.rect(x, X, Y - 26, 3, 14, col); G.rect(x, X, Y - 13, 14, 3, col); G.rect(x, X + 1, Y - 10, 2, 10, sh(col, -0.3)); G.rect(x, X + 11, Y - 10, 2, 10, sh(col, -0.3)); G.hl(x, X, Y - 13, 14, sh(col, 0.3));
  };
  R.officeChair = (x, X, Y, col = '#2a2a3a') => {
    G.rect(x, X + 1, Y - 28, 12, 13, col); G.hl(x, X + 2, Y - 27, 10, sh(col, 0.3)); G.rect(x, X, Y - 15, 14, 4, sh(col, 0.1)); G.rect(x, X + 6, Y - 11, 2, 7, '#5a5a6a'); G.hl(x, X + 1, Y - 3, 12, '#5a5a6a'); G.px(x, X + 1, Y - 2, '#2a2a34'); G.px(x, X + 12, Y - 2, '#2a2a34');
  };
  R.cabinet = (x, X, Y, H = 40, col = '#8a8e98') => {
    G.rect(x, X, Y - H, 16, H, col); G.vl(x, X + 15, Y - H, H, sh(col, -0.3)); G.hl(x, X, Y - H, 16, sh(col, 0.3));
    for (let yy = Y - H + 3; yy < Y - 4; yy += 12) { G.frame(x, X + 2, yy, 12, 10, sh(col, -0.2)); G.hl(x, X + 6, yy + 4, 4, '#d8d8e0'); }
  };
  R.bookshelf = (x, X, Y, W = 30, H = 50, col = '#7a4e30', seed = 'books') => {
    G.rect(x, X, Y - H, W, H, col); G.rect(x, X + 2, Y - H + 2, W - 4, H - 4, sh(col, -0.35));
    const r = U.rng(seed);
    for (let sy = Y - H + 2; sy < Y - 6; sy += 12) {
      G.hl(x, X + 2, sy + 10, W - 4, col);
      let bx = X + 3;
      while (bx < X + W - 4) { const bw = 2 + Math.floor(r() * 3), bh = 6 + Math.floor(r() * 4); G.rect(x, bx, sy + 10 - bh, bw, bh, ['#c83a4a', '#2a6ab0', '#e8a030', '#3a8a5a', '#7a3a8a', '#e8e0d0'][Math.floor(r() * 6)]); G.vl(x, bx, sy + 10 - bh, bh, '#1a142488'.slice(0, 7)); bx += bw + (r() > 0.85 ? 3 : 0); }
    }
  };
  R.couch = (x, X, Y, W = 60, col = '#7a3a4a') => {
    G.rect(x, X, Y - 26, W, 12, sh(col, -0.1)); G.hl(x, X, Y - 26, W, sh(col, 0.2));
    G.rect(x, X - 3, Y - 18, W + 6, 14, col); G.hl(x, X - 3, Y - 18, W + 6, sh(col, 0.25));
    G.rect(x, X - 5, Y - 22, 6, 18, sh(col, -0.15)); G.rect(x, X + W - 1, Y - 22, 6, 18, sh(col, -0.15));
    G.vl(x, X + W / 2, Y - 17, 10, sh(col, -0.3)); G.rect(x, X - 3, Y - 4, 3, 4, '#3a2a20'); G.rect(x, X + W, Y - 4, 3, 4, '#3a2a20');
  };
  R.tv = (x, X, Y, o = {}) => { // Y floor
    G.rect(x, X, Y - 16, 30, 16, '#5a3a2a'); G.rect(x, X + 2, Y - 14, 26, 2, '#3a2418');
    G.rect(x, X + 1, Y - 38, 28, 22, '#1a1a22'); G.rect(x, X + 3, Y - 36, 24, 17, o.on ? '#3a6a9a' : '#2a3038');
    if (o.on) G.dither(x, X + 3, Y - 36, 24, 17, '#5a9ad0', 3);
  };
  R.fridge = (x, X, Y, col = '#e8e8ec') => {
    G.rect(x, X, Y - 44, 20, 44, col); G.hl(x, X, Y - 44, 20, '#ffffff'); G.vl(x, X + 19, Y - 44, 44, sh(col, -0.25)); G.hl(x, X, Y - 30, 20, sh(col, -0.3));
    G.vl(x, X + 16, Y - 41, 8, '#9a9aa8'); G.vl(x, X + 16, Y - 26, 10, '#9a9aa8');
    G.rect(x, X + 4, Y - 40, 3, 3, '#e43b44'); G.rect(x, X + 8, Y - 38, 4, 3, '#fee761');
  };
  R.waterCooler = (x, X, Y) => { G.rect(x, X, Y - 22, 12, 22, '#e8e8ec'); G.vl(x, X + 11, Y - 22, 22, '#b8b8c4'); G.ellipse(x, X + 6, Y - 29, 5, 7, '#8ac8f0'); G.px(x, X + 4, Y - 32, '#e8f8ff'); G.rect(x, X + 3, Y - 16, 2, 2, '#4a7ad0'); G.rect(x, X + 7, Y - 16, 2, 2, '#e43b44'); };
  R.coffee = (x, X, Y) => { G.rect(x, X, Y - 12, 10, 12, '#2a2a34'); G.rect(x, X + 2, Y - 6, 6, 5, '#6a4a2a'); G.hl(x, X + 2, Y - 6, 6, '#c8a080'); G.rect(x, X + 1, Y - 11, 8, 3, '#4a4a58'); G.px(x, X + 8, Y - 10, '#e43b44'); };
  R.donutBox = (x, X, Y) => { G.rect(x, X, Y - 4, 16, 4, '#f4b0c8'); G.rect(x, X, Y - 9, 16, 5, '#ffffff'); for (let i = 0; i < 3; i++) { G.circle(x, X + 3 + i * 5, Y - 5, 2, '#d8964a'); G.px(x, X + 3 + i * 5, Y - 6, ['#ff8ab0', '#6a3a2a', '#fee761'][i]); } };
  R.corkboard = (x, X, Y, W = 40, H = 26, o = {}) => {
    G.rect(x, X - 2, Y - 2, W + 4, H + 4, '#6a4a2a'); G.rect(x, X, Y, W, H, '#c89a5a'); G.noise(x, X, Y, W, H, ['#a87a4a', '#d8aa6a'], 0.2, 'cork' + X);
    const r = U.rng('cb' + X + Y);
    const pins = [];
    for (let i = 0; i < (o.n || 6); i++) { const px = X + 3 + Math.floor(r() * (W - 12)), py = Y + 2 + Math.floor(r() * (H - 10)); G.rect(x, px, py, 7 + Math.floor(r() * 3), 7, r() > 0.5 ? '#f4ecd6' : '#fff8a0'); G.hl(x, px + 1, py + 2, 4, '#8a8a9a'); G.px(x, px + 3, py, '#e43b44'); pins.push([px + 3, py]); }
    if (o.strings) for (let i = 1; i < pins.length; i++) G.line(x, pins[i - 1][0], pins[i - 1][1], pins[i][0], pins[i][1], '#e43b44');
  };
  R.lamp = (x, X, Y, col = '#e8c870') => { G.rect(x, X + 3, Y - 14, 2, 14, '#3a3a44'); G.hl(x, X, Y - 1, 8, '#3a3a44'); G.poly(x, [[X - 2, Y - 14], [X + 10, Y - 14], [X + 7, Y - 22], [X + 1, Y - 22]], col); G.hl(x, X - 2, Y - 14, 12, sh(col, -0.25)); };
  R.table = (x, X, Y, W = 30, col = '#8a5a3a', cloth) => {
    G.rect(x, X, Y - 16, W, 3, cloth || sh(col, 0.15)); G.rect(x, X + 2, Y - 13, 2, 13, sh(col, -0.25)); G.rect(x, X + W - 4, Y - 13, 2, 13, sh(col, -0.25));
    if (cloth) { G.rect(x, X - 1, Y - 16, W + 2, 7, cloth); G.hl(x, X - 1, Y - 10, W + 2, sh(cloth, -0.2)); }
  };
  R.stool = (x, X, Y, col = '#c83a4a') => { G.ellipse(x, X + 4, Y - 14, 5, 2, col); G.vl(x, X + 4, Y - 12, 12, '#8a8a98'); G.hl(x, X + 1, Y - 1, 7, '#8a8a98'); };
  R.barrel = (x, X, Y, col = '#8a5a32') => { G.rect(x, X, Y - 16, 14, 16, col); G.hl(x, X, Y - 13, 14, '#4a4a54'); G.hl(x, X, Y - 4, 14, '#4a4a54'); G.vl(x, X + 12, Y - 16, 16, sh(col, -0.3)); G.ellipse(x, X + 7, Y - 16, 7, 2, sh(col, 0.2)); };
  R.crate = (x, X, Y, s = 14, col = '#b8884a') => { G.rect(x, X, Y - s, s, s, col); G.frame(x, X, Y - s, s, s, sh(col, -0.35)); G.line(x, X, Y - s, X + s - 1, Y - 1, sh(col, -0.25)); G.hl(x, X + 1, Y - s + 1, s - 2, sh(col, 0.25)); };
  R.trash = (x, X, Y) => { G.rect(x, X, Y - 14, 10, 14, '#5a6a5a'); G.hl(x, X - 1, Y - 15, 12, '#4a5a4a'); for (let i = 2; i < 10; i += 3) G.vl(x, X + i, Y - 12, 10, '#4a5a4a'); };
  R.rug = (x, X, Y, W, H, col = '#a83a4a') => { G.ellipse(x, X + W / 2, Y + H / 2, W / 2, H / 2, col); G.ellipse(x, X + W / 2, Y + H / 2, W / 2 - 3, H / 2 - 2, sh(col, 0.2)); G.ellipse(x, X + W / 2, Y + H / 2, W / 2 - 6, H / 2 - 4, col); };

  /* ---------------- outdoor props ---------------- */
  R.tent = (x, X, Y, W = 60, H = 46, c1 = '#ffffff', c2 = '#e43b44', o = {}) => {
    const roofH = 12;
    // canopy stripes
    for (let i = 0; i < W; i += 8) G.poly(x, [[X + i, Y - H + roofH], [X + Math.min(i + 8, W), Y - H + roofH], [X + W / 2 + (Math.min(i + 8, W) - W / 2) * 0.3, Y - H], [X + W / 2 + (i - W / 2) * 0.3, Y - H]], (i / 8) % 2 ? c2 : c1);
    // valance
    for (let i = 0; i < W; i += 8) { G.rect(x, X + i, Y - H + roofH, 8, 4, (i / 8) % 2 ? c2 : c1); G.ellipse(x, X + i + 4, Y - H + roofH + 4, 4, 2, (i / 8) % 2 ? c2 : c1); }
    // walls
    G.rect(x, X + 1, Y - H + roofH + 5, W - 2, H - roofH - 5, o.wall || sh(c1, -0.08));
    G.vl(x, X + 1, Y - H + roofH + 5, H - roofH - 5, sh(c1, -0.3)); G.vl(x, X + W - 2, Y - H + roofH + 5, H - roofH - 5, sh(c1, -0.3));
    if (o.flap) { const fx = X + W / 2 - 7; G.poly(x, [[fx, Y], [fx + 14, Y], [fx + 11, Y - H + roofH + 6], [fx + 3, Y - H + roofH + 6]], o.dark || '#3a2a3a'); G.line(x, fx + 7, Y - H + roofH + 6, fx + 7, Y - 1, sh(c1, -0.4)); }
  };
  R.crimeTape = (x, X0, Y0, X1, Y1) => {
    G.rect(x, X0 - 1, Y0, 2, 22, '#e8a030'); G.rect(x, X1 - 1, Y1, 2, 22, '#e8a030');
    G.rect(x, X0 - 2, Y0 + 20, 4, 2, '#5a5a5a'); G.rect(x, X1 - 2, Y1 + 20, 4, 2, '#5a5a5a');
    const n = Math.max(1, Math.abs(X1 - X0));
    for (let i = 0; i <= n; i++) {
      const t = i / n, px = U.lerp(X0, X1, t), py = U.lerp(Y0, Y1, t) + 3 + Math.sin(t * Math.PI) * 3;
      G.rect(x, px, py, 1, 3, (Math.floor(i / 5) % 2) ? '#fee761' : '#1a1424');
    }
  };
  R.surfboard = (x, X, Y, H = 34, col = '#ff6a4a', stripe = '#fff8e0') => {
    G.ellipse(x, X, Y - H / 2, 3, H / 2, col); G.vl(x, X, Y - H + 3, H - 6, stripe); G.vl(x, X - 2, Y - H / 2 - 6, 12, sh(col, 0.3));
  };
  R.umbrella = (x, X, Y, c1 = '#e43b44', c2 = '#fff8e0') => {
    G.line(x, X, Y, X + 3, Y - 30, '#d8d0c0', 1);
    for (let i = 0; i < 6; i++) G.poly(x, [[X + 3, Y - 38], [X - 17 + i * 7, Y - 28], [X - 10 + i * 7, Y - 28]], i % 2 ? c1 : c2);
    G.hl(x, X - 17, Y - 28, 42, sh(c1, -0.3));
  };
  R.lifeguard = (x, X, Y) => {
    G.line(x, X, Y, X + 6, Y - 30, '#d8d0c0', 2); G.line(x, X + 30, Y, X + 24, Y - 30, '#d8d0c0', 2); G.line(x, X + 3, Y - 14, X + 27, Y - 14, '#c8c0b0');
    G.rect(x, X - 2, Y - 50, 34, 20, '#e43b44'); G.rect(x, X + 2, Y - 46, 26, 9, '#4a8ad8'); G.rect(x, X - 5, Y - 54, 40, 5, '#f4f0e0'); G.hl(x, X - 5, Y - 50, 40, '#c8c0b0');
    P.font.draw(x, 'LIFEGUARD', X + 15, Y - 37, '#ffffff', { align: 'center' });
    G.line(x, X + 2, Y - 30, X - 8, Y, '#d8d0c0');
  };
  R.car = (x, X, Y, col = '#3a6ad8', kind = 'compact', facing = 1) => {
    const W = kind === 'van' ? 64 : 54;
    const c = G.canvas(W + 4, 34); const q = c.x;
    const y0 = 30;
    if (kind === 'van') {
      G.rect(q, 2, y0 - 22, W - 4, 16, col); G.rect(q, 4, y0 - 26, W - 14, 5, col); G.rect(q, W - 14, y0 - 20, 12, 8, sh(col, 0.1));
      G.rect(q, 6, y0 - 24, 12, 7, '#9ac8e8'); G.rect(q, W - 12, y0 - 19, 8, 6, '#9ac8e8'); G.hl(q, 2, y0 - 12, W - 4, sh(col, -0.3));
    } else if (kind === 'police') {
      G.rect(q, 2, y0 - 16, W - 4, 10, '#f4f4f8'); G.poly(q, [[12, y0 - 16], [16, y0 - 25], [38, y0 - 25], [44, y0 - 16]], '#1a1a2a'); G.rect(q, 18, y0 - 23, 9, 6, '#9ac8e8'); G.rect(q, 29, y0 - 23, 9, 6, '#9ac8e8');
      G.rect(q, 2, y0 - 12, W - 4, 4, '#1a1a2a'); G.rect(q, 24, y0 - 28, 6, 3, '#e43b44'); G.rect(q, 30, y0 - 28, 6, 3, '#2a5ad8');
      P.font.draw(q, 'SBPD', 24, y0 - 15, '#1a1a2a');
    } else {
      G.rect(q, 2, y0 - 15, W - 4, 9, col); G.poly(q, [[12, y0 - 15], [17, y0 - 24], [36, y0 - 24], [44, y0 - 15]], sh(col, 0.08));
      G.rect(q, 19, y0 - 22, 8, 6, '#9ac8e8'); G.rect(q, 29, y0 - 22, 9, 6, '#9ac8e8'); G.hl(q, 2, y0 - 10, W - 4, sh(col, -0.3)); G.hl(q, 3, y0 - 15, W - 6, sh(col, 0.3));
    }
    for (const wx of [12, W - 14]) { G.circle(q, wx, y0 - 5, 5, '#1a1a22'); G.circle(q, wx, y0 - 5, 2, '#9a9aa8'); }
    G.rect(q, W - 4, y0 - 13, 2, 3, '#fff2a0'); G.rect(q, 2, y0 - 13, 2, 3, '#e43b44');
    const out = G.outline(c, '#1d1526');
    if (facing < 0) x.drawImage(G.flip(out), X, Y - 34); else x.drawImage(out, X, Y - 34);
  };
  R.fence = (x, X, Y, W, col = '#f4f0e8') => {
    G.hl(x, X, Y - 12, W, sh(col, -0.15)); G.hl(x, X, Y - 6, W, sh(col, -0.15));
    for (let px = X; px < X + W; px += 6) { G.rect(x, px, Y - 16, 4, 16, col); G.px(x, px + 1, Y - 17, col); G.px(x, px + 2, Y - 17, col); G.vl(x, px + 3, Y - 16, 16, sh(col, -0.2)); }
  };
  R.railing = (x, X, Y, W, col = '#e8e0d0') => { G.hl(x, X, Y - 14, W, col); G.hl(x, X, Y - 13, W, sh(col, -0.3)); for (let px = X; px < X + W; px += 8) G.vl(x, px, Y - 13, 13, sh(col, -0.1)); };
  R.streetlamp = (x, X, Y, on = false) => { G.rect(x, X, Y - 50, 2, 50, '#3a3a48'); G.rect(x, X - 3, Y - 54, 8, 5, '#3a3a48'); G.rect(x, X - 2, Y - 50, 6, 2, on ? '#fff2a0' : '#d8d0b0'); };
  R.grill = (x, X, Y) => { G.ellipse(x, X + 8, Y - 18, 9, 5, '#1a1a22'); G.rect(x, X, Y - 18, 17, 5, '#2a2a34'); G.line(x, X + 2, Y - 14, X, Y, '#3a3a48'); G.line(x, X + 14, Y - 14, X + 16, Y, '#3a3a48'); G.hl(x, X + 1, Y - 19, 15, '#5a5a6a'); };
  R.arcade = (x, X, Y, col = '#7a3a8a', t = 0, seed = 0) => {
    G.rect(x, X, Y - 44, 22, 44, col); G.vl(x, X + 21, Y - 44, 44, sh(col, -0.35)); G.rect(x, X - 1, Y - 46, 24, 7, sh(col, 0.2));
    G.rect(x, X + 3, Y - 37, 16, 13, '#0a0a14');
    const r = U.rng('arc' + seed);
    for (let i = 0; i < 8; i++) G.px(x, X + 4 + Math.floor(r() * 14), Y - 36 + Math.floor(r() * 11), ['#2ce8f5', '#fee761', '#ff6aa0', '#63c74d'][i % 4]);
    G.rect(x, X + 1, Y - 22, 20, 5, sh(col, -0.2)); G.px(x, X + 6, Y - 21, '#e43b44'); G.px(x, X + 11, Y - 20, '#fee761'); G.px(x, X + 14, Y - 20, '#2ce8f5');
    G.rect(x, X + 7, Y - 10, 8, 4, '#2a2a34'); G.px(x, X + 10, Y - 9, '#fee761');
  };
  R.stand = (x, X, Y, W = 60, o = {}) => { // food stand / shack
    const col = o.col || '#f4e4c0', roof = o.roof || '#3ab0a0';
    R.siding(x, X, Y - 40, W, 40, col);
    G.rect(x, X + 4, Y - 34, W - 8, 16, '#2a2028'); G.rect(x, X + 2, Y - 18, W - 4, 4, sh(col, -0.25)); G.hl(x, X + 2, Y - 18, W - 4, sh(col, 0.2));
    for (let i = 0; i < W + 8; i += 8) G.poly(x, [[X - 4 + i, Y - 46], [X + 4 + i, Y - 46], [X + 4 + i, Y - 40], [X + i, Y - 37], [X - 4 + i, Y - 40]], (i / 8) % 2 ? roof : '#ffffff');
    G.rect(x, X - 4, Y - 58, W + 8, 12, roof); G.hl(x, X - 4, Y - 58, W + 8, sh(roof, 0.3));
    if (o.sign) P.font.draw(x, o.sign, X + W / 2, Y - 55, o.signCol || '#ffffff', { align: 'center', shadow: sh(roof, -0.5) });
  };

  /* ---------------- atmosphere ---------------- */
  // darkness with a soft pool of light around a point (used by dark scenes)
  let darkC = null;
  R.darkness = (x, lx, ly, radius = 46, alpha = 0.9, extra = []) => {
    if (!darkC) darkC = G.canvas(P.W, P.H);
    const d = darkC.x;
    d.globalCompositeOperation = 'source-over';
    d.clearRect(0, 0, P.W, P.H);
    d.fillStyle = `rgba(6,4,14,${alpha})`; d.fillRect(0, 0, P.W, P.H);
    d.globalCompositeOperation = 'destination-out';
    for (const [cx, cy, r] of [[lx, ly, radius]].concat(extra)) {
      for (let k = 4; k >= 1; k--) { d.fillStyle = `rgba(0,0,0,${0.25 * (5 - k) / 4 + 0.1})`; d.beginPath(); d.arc(Math.round(cx), Math.round(cy), Math.round(r * k / 4 + 4), 0, Math.PI * 2); d.fill(); }
    }
    x.drawImage(darkC, 0, 0);
  };
  // rain streaks over a rectangle (windows) or the whole screen
  R.rain = (x, X, Y, W, H, t, col = '#8aa0d0', n = 30) => {
    for (let i = 0; i < n; i++) { const px = X + ((i * 53 + t * 40) % W), py = Y + ((i * 37 + t * 220) % H); G.line(x, px, py, px - 2, py + 5, col); }
  };

  /* ---------------- icon set (16x16) ---------------- */
  const I = {};
  const ink = '#1d1526';
  I.note = (x) => { G.rect(x, 3, 2, 10, 12, '#f4ecd6'); G.frame(x, 3, 2, 10, 12, ink); for (let i = 0; i < 4; i++) G.hl(x, 5, 5 + i * 2, 6 - (i % 2) * 2, '#6a7aa0'); G.rect(x, 6, 1, 4, 2, '#c83a3a'); };
  I.photo = (x) => { G.rect(x, 1, 3, 14, 11, '#f4f4f0'); G.frame(x, 1, 3, 14, 11, ink); G.rect(x, 3, 5, 10, 7, '#7ab0d0'); G.rect(x, 3, 10, 10, 2, '#e8c890'); G.circle(x, 8, 8, 2, '#e8b796'); };
  I.chip = (x) => { G.circle(x, 8, 8, 6, '#e43b44'); G.circle(x, 8, 8, 4, '#ffffff'); G.circle(x, 8, 8, 3, '#e43b44'); for (const [a, b] of [[8, 2], [8, 13], [2, 8], [13, 8]]) G.px(x, a, b, '#ffffff'); G.px(x, 6, 6, '#ff9a9a'); };
  I.fabric = (x) => { G.poly(x, [[2, 3], [13, 2], [14, 12], [8, 14], [3, 12]], '#f4f0e8'); for (let i = 3; i < 13; i += 3) G.hl(x, 3, i, 10, '#e43b44'); G.line(x, 6, 3, 10, 13, ink); G.px(x, 9, 9, '#c8c0b0'); };
  I.lock = (x) => { G.rect(x, 3, 7, 10, 7, '#5a6a7a'); G.frame(x, 3, 7, 10, 7, ink); G.frame(x, 5, 2, 6, 6, '#8a9aaa'); G.rect(x, 7, 9, 2, 3, '#fee761'); };
  I.footprint = (x) => { G.ellipse(x, 6, 9, 3, 5, '#c8a070'); G.ellipse(x, 11, 6, 2, 3, '#c8a070'); G.px(x, 5, 3, '#c8a070'); G.px(x, 7, 3, '#c8a070'); G.px(x, 10, 2, '#c8a070'); };
  I.key = (x) => { G.circle(x, 5, 6, 3, '#feae34'); G.circle(x, 5, 6, 1, '#00000000'); G.px(x, 5, 6, '#2a2028'); G.rect(x, 7, 6, 7, 2, '#feae34'); G.rect(x, 11, 8, 2, 2, '#feae34'); G.rect(x, 13, 8, 1, 3, '#feae34'); };
  I.money = (x) => { G.rect(x, 1, 4, 14, 8, '#63c74d'); G.frame(x, 1, 4, 14, 8, '#265c42'); G.circle(x, 8, 8, 2, '#3e8948'); G.rect(x, 2, 11, 14, 3, '#4ea858'); G.frame(x, 2, 11, 14, 3, '#265c42'); };
  I.receipt = (x) => { G.rect(x, 4, 1, 8, 14, '#f8f8f4'); for (let i = 3; i < 13; i += 2) G.hl(x, 5, i, 4 + (i % 3), '#8a8a9a'); for (let i = 4; i < 12; i += 2) G.px(x, i, 15, '#f8f8f4'); G.hl(x, 8, 12, 3, ink); };
  I.cooler = (x) => { G.rect(x, 2, 6, 12, 8, '#2a8ad8'); G.rect(x, 2, 4, 12, 3, '#f4f4f8'); G.frame(x, 2, 4, 12, 10, ink); G.rect(x, 6, 2, 4, 2, '#f4f4f8'); };
  I.mask = (x) => { G.rect(x, 3, 1, 10, 14, '#a8743f'); G.frame(x, 3, 1, 10, 14, ink); G.rect(x, 5, 4, 2, 3, ink); G.rect(x, 9, 4, 2, 3, ink); G.rect(x, 5, 10, 6, 2, '#e43b44'); G.hl(x, 4, 2, 8, '#63c74d'); };
  I.tooth = (x) => { G.line(x, 2, 3, 8, 7, '#5a3a2a'); G.line(x, 14, 3, 8, 7, '#5a3a2a'); G.poly(x, [[6, 7], [10, 7], [8, 14]], '#fff8e0'); };
  I.pill = (x) => { G.rect(x, 5, 1, 6, 3, '#f4f4f8'); G.rect(x, 4, 4, 8, 11, '#e8a030'); G.frame(x, 4, 4, 8, 11, ink); G.rect(x, 5, 7, 6, 4, '#f4f4f8'); G.hl(x, 6, 9, 4, '#c83a3a'); };
  I.bottle = (x) => { G.rect(x, 6, 1, 4, 4, '#3a8a5a'); G.rect(x, 4, 5, 8, 10, '#3a8a5a'); G.rect(x, 5, 8, 6, 4, '#f4ecd6'); G.vl(x, 5, 5, 9, '#7ac89a'); };
  I.camera = (x) => { G.rect(x, 1, 5, 14, 9, '#2a2a34'); G.rect(x, 4, 3, 5, 3, '#2a2a34'); G.circle(x, 8, 9, 3, '#6ab0ff'); G.circle(x, 8, 9, 1, '#1a1a2a'); G.px(x, 12, 6, '#e43b44'); };
  I.ticket = (x) => { G.rect(x, 1, 4, 14, 8, '#feae34'); G.vl(x, 5, 4, 8, '#c87a1a'); G.px(x, 0, 8, '#00000000'); G.hl(x, 7, 7, 6, '#c83a3a'); G.hl(x, 7, 9, 4, '#c83a3a'); };
  I.phone = (x) => { G.rect(x, 4, 1, 8, 14, '#2a2a34'); G.rect(x, 5, 3, 6, 9, '#6ab0ff'); G.px(x, 8, 13, '#8a8a9a'); };
  I.shell = (x) => { G.poly(x, [[8, 2], [14, 11], [8, 14], [2, 11]], '#ffc0b0'); for (let i = 4; i <= 12; i += 2) G.line(x, 8, 3, i, 13, '#e88a7a'); G.hl(x, 6, 13, 5, '#d87a6a'); };
  I.seaglass = (x) => { G.poly(x, [[4, 4], [8, 2], [13, 5], [12, 12], [6, 14], [2, 10]], '#7ae2c8'); G.poly(x, [[5, 5], [8, 3], [10, 5], [7, 8]], '#c8fff0'); };
  I.flower = (x) => { G.vl(x, 8, 8, 7, '#3e8948'); for (const [a, b] of [[8, 3], [5, 6], [11, 6], [6, 9], [10, 9]]) G.circle(x, a, b, 2, '#ff8ab8'); G.circle(x, 8, 6, 1, '#fee761'); };
  I.badge = (x) => { G.poly(x, [[8, 1], [14, 5], [12, 13], [8, 15], [4, 13], [2, 5]], '#f2c84a'); G.circle(x, 8, 8, 3, '#c89a2a'); G.px(x, 8, 8, '#fff2a0'); };
  I.map = (x) => { G.rect(x, 1, 3, 14, 11, '#e8dcb8'); G.vl(x, 5, 3, 11, '#c8bc98'); G.vl(x, 10, 3, 11, '#c8bc98'); G.line(x, 2, 11, 13, 5, '#c83030'); G.circle(x, 13, 5, 1, '#c83030'); };
  I.magnifier = (x) => { G.circle(x, 6, 6, 5, ink); G.circle(x, 6, 6, 3, '#bfe8ff'); G.px(x, 5, 5, '#ffffff'); G.line(x, 9, 9, 14, 14, '#7a4e32', 2); };
  I.cup = (x) => { G.rect(x, 3, 4, 9, 10, '#f4f4f8'); G.frame(x, 3, 4, 9, 10, ink); G.frame(x, 11, 6, 3, 5, ink); G.hl(x, 4, 5, 7, '#7a4a2a'); };
  I.glove = (x) => { G.rect(x, 4, 6, 8, 9, '#f4f4f8'); for (let i = 0; i < 4; i++) G.rect(x, 4 + i * 2, 2 + (i === 0 ? 2 : 0), 2, 5, '#f4f4f8'); G.frame(x, 4, 6, 8, 9, '#8a8a9a'); };
  I.watch = (x) => { G.rect(x, 6, 1, 4, 14, '#7a4e32'); G.circle(x, 8, 8, 4, '#c8a040'); G.circle(x, 8, 8, 3, '#f4f0e8'); G.line(x, 8, 8, 8, 6, ink); G.line(x, 8, 8, 10, 8, ink); };
  I.ring = (x) => { G.circle(x, 8, 10, 4, '#fee761'); G.circle(x, 8, 10, 2, '#00000000'); G.poly(x, [[6, 5], [10, 5], [11, 3], [8, 1], [5, 3]], '#7ae2f8'); };
  I.gem = (x) => { G.poly(x, [[4, 4], [12, 4], [15, 7], [8, 15], [1, 7]], '#3a6ad8'); G.poly(x, [[4, 4], [8, 7], [12, 4]], '#7aa0f0'); G.line(x, 1, 7, 15, 7, '#2a4ab0'); G.px(x, 5, 5, '#ffffff'); };
  I.candle = (x) => { G.rect(x, 6, 6, 4, 9, '#f4ecd6'); G.vl(x, 8, 4, 2, ink); G.ellipse(x, 8, 2, 1, 2, '#feae34'); G.px(x, 8, 3, '#fff2a0'); G.hl(x, 5, 15, 6, '#c8b090'); };
  I.fuse = (x) => { G.rect(x, 3, 5, 10, 6, '#c8c0b0'); G.rect(x, 1, 6, 2, 4, '#c8a040'); G.rect(x, 13, 6, 2, 4, '#c8a040'); G.line(x, 4, 8, 12, 8, '#e43b44'); G.px(x, 7, 7, '#1d1526'); };
  I.book = (x) => { G.rect(x, 3, 2, 10, 12, '#7a3a8a'); G.vl(x, 3, 2, 12, '#4a1a5a'); G.rect(x, 5, 4, 6, 2, '#fee761'); G.hl(x, 4, 13, 9, '#f4ecd6'); };
  I.letter = (x) => { G.rect(x, 1, 4, 14, 9, '#f4ecd6'); G.frame(x, 1, 4, 14, 9, ink); G.line(x, 1, 4, 8, 9, ink); G.line(x, 14, 4, 8, 9, ink); G.rect(x, 7, 8, 3, 3, '#c83a3a'); };
  I.sauce = (x) => { G.rect(x, 5, 1, 6, 3, '#f4f4f8'); G.poly(x, [[4, 4], [12, 4], [13, 15], [3, 15]], '#c83a1a'); G.rect(x, 5, 8, 6, 4, '#fee761'); G.vl(x, 4, 5, 9, '#e86a4a'); };
  I.spoon = (x) => { G.ellipse(x, 5, 5, 3, 4, '#c0cbdc'); G.line(x, 7, 8, 14, 15, '#c0cbdc', 2); G.px(x, 4, 4, '#ffffff'); };
  I.knife = (x) => { G.poly(x, [[2, 13], [11, 3], [13, 4], [5, 14]], '#c0cbdc'); G.line(x, 11, 4, 14, 1, '#5a3a2a', 2); };
  I.wax = (x) => { G.rect(x, 3, 5, 10, 8, '#f4e8a0'); G.frame(x, 3, 5, 10, 8, '#c8b060'); G.rect(x, 5, 7, 6, 3, '#2a94d0'); };
  I.sand = (x) => { G.ellipse(x, 8, 11, 6, 3, '#ecd2a0'); G.noise(x, 3, 9, 10, 5, ['#c8a070', '#fff0c8'], 0.4, 'iconsand'); };
  I.quarters = (x) => { G.rect(x, 2, 5, 12, 6, '#c0cbdc'); G.frame(x, 2, 5, 12, 6, '#5a6988'); for (let i = 4; i < 13; i += 2) G.vl(x, i, 5, 6, '#8b9bb4'); G.ellipse(x, 2, 8, 1, 3, '#e8f0f8'); };
  I.shaveice = (x) => { G.poly(x, [[4, 9], [12, 9], [10, 15], [6, 15]], '#f4f4f8'); G.ellipse(x, 8, 7, 5, 4, '#ff5a7a'); G.ellipse(x, 6, 6, 2, 2, '#5ad0ff'); G.ellipse(x, 10, 5, 2, 2, '#fee761'); };
  I.donut = (x) => { G.circle(x, 8, 8, 6, '#d8964a'); G.circle(x, 8, 8, 5, '#ff8ab0'); G.circle(x, 8, 8, 2, '#d8964a'); G.circle(x, 8, 8, 1, '#00000000'); for (const [a, b] of [[5, 5], [11, 6], [6, 11], [10, 11]]) G.px(x, a, b, '#fee761'); };
  I.taco = (x) => { G.ellipse(x, 8, 10, 7, 5, '#fee761'); G.ellipse(x, 8, 11, 6, 3, '#63c74d'); G.hl(x, 3, 9, 10, '#a85a3a'); G.px(x, 5, 8, '#e43b44'); G.px(x, 10, 8, '#e43b44'); };
  I.burger = (x) => { G.ellipse(x, 8, 5, 6, 3, '#e4a050'); G.rect(x, 2, 7, 12, 2, '#63c74d'); G.rect(x, 2, 9, 12, 2, '#6a3a1a'); G.ellipse(x, 8, 12, 6, 2, '#e4a050'); G.px(x, 6, 4, '#fff8e0'); };
  I.ribs = (x) => { G.rect(x, 2, 6, 12, 6, '#8a3a1a'); for (let i = 3; i < 14; i += 3) G.rect(x, i, 4, 1, 10, '#f4ecd6'); G.hl(x, 2, 6, 12, '#b85a2a'); };
  I.pie = (x) => { G.ellipse(x, 8, 10, 7, 4, '#d8964a'); G.ellipse(x, 8, 9, 6, 3, '#c83a4a'); for (let i = 3; i < 14; i += 3) G.vl(x, i, 6, 6, '#e8b060'); };
  I.plush = (x) => { G.circle(x, 8, 10, 5, '#a8743f'); G.circle(x, 8, 5, 4, '#a8743f'); G.circle(x, 5, 2, 2, '#a8743f'); G.circle(x, 11, 2, 2, '#a8743f'); G.px(x, 7, 5, ink); G.px(x, 9, 5, ink); G.px(x, 8, 6, '#e43b44'); };
  I.heart = (x) => { G.heart(x, 4, 5, '#ff4a7a'); };
  I.sunglasses = (x) => { G.rect(x, 1, 6, 6, 4, '#14101c'); G.rect(x, 9, 6, 6, 4, '#14101c'); G.hl(x, 6, 7, 4, '#14101c'); G.px(x, 2, 7, '#6a8ab0'); G.px(x, 10, 7, '#6a8ab0'); };
  I.hat = (x) => { G.ellipse(x, 8, 11, 7, 2, '#7a4e32'); G.rect(x, 4, 4, 8, 7, '#9a6a3a'); G.hl(x, 4, 9, 8, '#3a2a1a'); };
  I.feather = (x) => { G.line(x, 3, 14, 13, 2, '#f4f4f8', 2); G.line(x, 4, 13, 12, 3, '#c8c8d8'); };
  I.tape = (x) => { G.circle(x, 8, 8, 6, '#2a2a34'); G.circle(x, 8, 8, 2, '#c0cbdc'); G.rect(x, 3, 3, 10, 3, '#e43b44'); };
  I.card = (x) => { G.rect(x, 1, 4, 14, 9, '#f4f4f8'); G.frame(x, 1, 4, 14, 9, ink); G.rect(x, 3, 6, 4, 4, '#8a7a6a'); G.hl(x, 8, 6, 5, ink); G.hl(x, 8, 8, 4, '#8a8a9a'); G.hl(x, 8, 10, 5, '#8a8a9a'); };
  I.calendar = (x) => { G.rect(x, 2, 3, 12, 11, '#f4f4f8'); G.rect(x, 2, 3, 12, 3, '#e43b44'); G.frame(x, 2, 3, 12, 11, ink); for (let i = 0; i < 6; i++) G.px(x, 4 + (i % 3) * 3, 8 + Math.floor(i / 3) * 3, '#5a6988'); };
  I.recording = (x) => { G.rect(x, 1, 4, 14, 8, '#2a2a34'); G.circle(x, 5, 8, 2, '#c0cbdc'); G.circle(x, 11, 8, 2, '#c0cbdc'); G.rect(x, 4, 12, 8, 2, '#5a5a6a'); };
  I.vial = (x) => { G.rect(x, 6, 1, 4, 3, '#8a6a4a'); G.rect(x, 5, 4, 6, 11, '#d8f0ff'); G.rect(x, 5, 9, 6, 6, '#8a4ac8'); G.frame(x, 5, 4, 6, 11, '#5a6988'); };
  I.leaf = (x) => { G.ellipse(x, 8, 8, 4, 6, '#3e8948'); G.line(x, 8, 2, 8, 14, '#265c42'); G.px(x, 6, 6, '#63c74d'); };
  I.button = (x) => { G.circle(x, 8, 8, 5, '#c8a040'); for (const [a, b] of [[7, 7], [9, 7], [7, 9], [9, 9]]) G.px(x, a, b, ink); };
  I.wrench = (x) => { G.line(x, 3, 13, 11, 5, '#8b9bb4', 2); G.circle(x, 12, 4, 3, '#8b9bb4'); G.px(x, 13, 3, '#00000000'); G.rect(x, 12, 2, 2, 2, '#1d1526'); };
  I.contract = (x) => { G.rect(x, 3, 1, 10, 14, '#f4f4f8'); for (let i = 3; i < 11; i += 2) G.hl(x, 5, i, 6, '#8a8a9a'); G.line(x, 5, 12, 10, 12, '#2a4ab0'); G.rect(x, 9, 12, 3, 3, '#c83a3a'); };
  I.timer = (x) => { G.rect(x, 3, 4, 10, 10, '#2a2a34'); G.rect(x, 4, 6, 8, 4, '#4ac87a'); G.hl(x, 5, 7, 2, '#0a2a1a'); G.hl(x, 9, 7, 2, '#0a2a1a'); G.rect(x, 6, 2, 4, 2, '#e43b44'); };
  I.necklace = (x) => { for (let i = 0; i < 12; i++) { const a = Math.PI * (i / 11); G.px(x, 8 + Math.cos(a) * 6, 4 + Math.sin(a) * 6, '#fee761'); } G.poly(x, [[6, 10], [10, 10], [8, 14]], '#3a6ad8'); };
  I.chalk = (x) => { G.rect(x, 2, 3, 12, 10, '#2a3a2a'); G.frame(x, 2, 3, 12, 10, '#8a5a3a'); G.line(x, 4, 10, 8, 6, '#f4f4f8'); G.line(x, 8, 6, 12, 9, '#f4f4f8'); };
  I.spray = (x) => { G.rect(x, 5, 4, 6, 11, '#e43b44'); G.rect(x, 6, 2, 4, 2, '#c0cbdc'); G.rect(x, 6, 7, 4, 4, '#f4f4f8'); };
  I.scroll = (x) => { G.rect(x, 3, 3, 10, 10, '#f4e8c8'); G.rect(x, 2, 2, 12, 2, '#c8a870'); G.rect(x, 2, 12, 12, 2, '#c8a870'); for (let i = 5; i < 11; i += 2) G.hl(x, 5, i, 6, '#8a7a5a'); };
  I.question = (x) => { P.font.draw(x, '?', 5, 4, '#fee761', { scale: 1 }); };
  P.ICONS = I;

  const iconCache = new Map();
  P.icon = (name) => {
    if (typeof name === 'function') { const raw = G.canvas(18, 18); raw.x.translate(1, 1); name(raw.x); return G.outline(raw, '#1d1526'); }
    let c = iconCache.get(name);
    if (c) return c;
    const raw = G.canvas(18, 18); raw.x.translate(1, 1);
    (I[name] || I.question)(raw.x);
    c = G.outline(raw, '#1d1526'); // 18x18 including outline
    iconCache.set(name, c);
    return c;
  };
})(window.P);
