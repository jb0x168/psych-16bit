'use strict';
/* Palette + low-level pixel drawing helpers. All coordinates are integer native pixels. */
(function (P) {
  const U = P.U;

  // Base palette (Endesga-32 flavoured) + a few named extras used across the game.
  P.C = {
    black: '#0e0a14', ink: '#181425', outline: '#1d1526', dk: '#262b44', navy: '#3a4466', slate: '#5a6988',
    steel: '#8b9bb4', silver: '#c0cbdc', white: '#ffffff', cream: '#fff6e4', paper: '#f4ecd6',
    wine: '#3e2731', maroon: '#733e39', brown: '#b86f50', tan: '#e4a672', sand: '#ead4aa',
    rust: '#be4a2f', orange: '#d77643', amber: '#f77622', gold: '#feae34', yellow: '#fee761',
    green: '#63c74d', dgreen: '#3e8948', forest: '#265c42', teal: '#193c3e', blue: '#124e89', sky: '#0099db', cyan: '#2ce8f5',
    red: '#e43b44', dred: '#a22633', hot: '#ff0044', purple: '#68386c', magenta: '#b55088', pink: '#f6757a',
    peach: '#e8b796', clay: '#c28569', mint: '#9fe3c4', lilac: '#a88fd8', ui: '#20183a', ui2: '#2f2552', uiHi: '#5d4ca8',
  };
  const C = P.C;

  const G = P.G = {};
  G.canvas = (w, h) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    c.x = x;
    return c;
  };
  G.rect = (x, X, Y, W, H, col) => { if (W <= 0 || H <= 0) return; x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), Math.round(W), Math.round(H)); };
  G.px = (x, X, Y, col) => { x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), 1, 1); };
  G.hl = (x, X, Y, W, col) => G.rect(x, X, Y, W, 1, col);
  G.vl = (x, X, Y, H, col) => G.rect(x, X, Y, 1, H, col);
  G.frame = (x, X, Y, W, H, col) => { G.hl(x, X, Y, W, col); G.hl(x, X, Y + H - 1, W, col); G.vl(x, X, Y, H, col); G.vl(x, X + W - 1, Y, H, col); };

  // filled ellipse via horizontal spans (crisp pixel edges)
  G.ellipse = (x, cx, cy, rx, ry, col) => {
    x.fillStyle = col;
    if (rx <= 0 || ry <= 0) return;
    for (let dy = -Math.floor(ry); dy <= Math.floor(ry); dy++) {
      const t = dy / (ry + 0.5);
      const half = Math.round((rx + 0.5) * Math.sqrt(Math.max(0, 1 - t * t)) - 0.5);
      x.fillRect(Math.round(cx - half), Math.round(cy + dy), half * 2 + 1, 1);
    }
  };
  G.circle = (x, cx, cy, r, col) => G.ellipse(x, cx, cy, r, r, col);
  // even-odd scanline polygon fill
  G.poly = (x, pts, col) => {
    x.fillStyle = col;
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    minY = Math.floor(minY); maxY = Math.ceil(maxY);
    for (let y = minY; y <= maxY; y++) {
      const yc = y + 0.5, xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const x0 = Math.round(xs[i]), x1 = Math.round(xs[i + 1]);
        if (x1 > x0) x.fillRect(x0, y, x1 - x0, 1);
      }
    }
  };
  // Bresenham line with square brush
  G.line = (x, x0, y0, x1, y1, col, t = 1) => {
    x.fillStyle = col;
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy; const o = Math.floor((t - 1) / 2);
    for (;;) {
      x.fillRect(x0 - o, y0 - o, t, t);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };
  // thick rounded segment (limbs). r = radius in px (can be fractional)
  G.capsule = (x, x0, y0, x1, y1, r, col) => {
    x.fillStyle = col;
    const minX = Math.floor(Math.min(x0, x1) - r - 1), maxX = Math.ceil(Math.max(x0, x1) + r + 1);
    const minY = Math.floor(Math.min(y0, y1) - r - 1), maxY = Math.ceil(Math.max(y0, y1) + r + 1);
    const vx = x1 - x0, vy = y1 - y0, L2 = vx * vx + vy * vy || 1e-6;
    for (let py = minY; py <= maxY; py++) {
      let run = -1;
      for (let px = minX; px <= maxX + 1; px++) {
        let inside = false;
        if (px <= maxX) {
          const cx = px + 0.5, cy = py + 0.5;
          let t = ((cx - x0) * vx + (cy - y0) * vy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
          const dxp = cx - (x0 + vx * t), dyp = cy - (y0 + vy * t);
          inside = dxp * dxp + dyp * dyp <= r * r;
        }
        if (inside && run < 0) run = px;
        if (!inside && run >= 0) { x.fillRect(run, py, px - run, 1); run = -1; }
      }
    }
  };
  // ordered dither fill. level 0..16 (fraction of pixels lit out of 16)
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  G.dither = (x, X, Y, W, H, col, level = 8) => {
    x.fillStyle = col;
    X = Math.round(X); Y = Math.round(Y);
    for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
      if (BAYER[((Y + yy) & 3) * 4 + ((X + xx) & 3)] < level) x.fillRect(X + xx, Y + yy, 1, 1);
    }
  };
  // vertical banded gradient with dithered transitions — the classic 16-bit sky
  G.bands = (x, X, Y, W, H, cols, ditherH = 3) => {
    const n = cols.length, bandH = H / n;
    for (let i = 0; i < n; i++) {
      const y0 = Math.round(Y + i * bandH), y1 = Math.round(Y + (i + 1) * bandH);
      G.rect(x, X, y0, W, y1 - y0, cols[i]);
      if (i > 0 && ditherH > 0) {
        for (let d = 0; d < ditherH; d++) G.dither(x, X, y0 + d, W, 1, cols[i - 1], Math.round(12 - (d * 12) / ditherH));
      }
    }
  };
  // seeded speckle noise
  G.noise = (x, X, Y, W, H, cols, density, seed) => {
    const r = U.rng(seed || 'noise' + X + ',' + Y);
    const n = Math.round(W * H * density);
    for (let i = 0; i < n; i++) G.px(x, X + Math.floor(r() * W), Y + Math.floor(r() * H), cols[Math.floor(r() * cols.length)]);
  };
  G.shadow = (x, cx, cy, rx, ry, alpha = 0.28) => {
    x.save(); x.globalAlpha = alpha; G.ellipse(x, cx, cy, rx, ry, '#120a1e'); x.restore();
  };
  G.roundRect = (x, X, Y, W, H, col, r = 2) => {
    G.rect(x, X + r, Y, W - 2 * r, H, col);
    G.rect(x, X, Y + r, W, H - 2 * r, col);
    if (r >= 2) { G.rect(x, X + 1, Y + 1, W - 2, H - 2, col); }
  };
  // returns a new canvas with a 1px outline around opaque pixels (src must have 1px transparent margin)
  G.outline = (src, col = C.outline, diag = false) => {
    const w = src.width, h = src.height;
    const sx = src.getContext('2d');
    const d = sx.getImageData(0, 0, w, h).data;
    const out = G.canvas(w, h);
    const o = out.x;
    const [r, g, b] = U.hexToRgb(col);
    const od = o.createImageData(w, h); const p = od.data;
    const A = (xx, yy) => (xx < 0 || yy < 0 || xx >= w || yy >= h ? 0 : d[(yy * w + xx) * 4 + 3]);
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const i = (yy * w + xx) * 4;
      if (d[i + 3] > 100) { p[i] = d[i]; p[i + 1] = d[i + 1]; p[i + 2] = d[i + 2]; p[i + 3] = d[i + 3]; continue; }
      let n = A(xx - 1, yy) > 100 || A(xx + 1, yy) > 100 || A(xx, yy - 1) > 100 || A(xx, yy + 1) > 100;
      if (!n && diag) n = A(xx - 1, yy - 1) > 100 || A(xx + 1, yy - 1) > 100 || A(xx - 1, yy + 1) > 100 || A(xx + 1, yy + 1) > 100;
      if (n) { p[i] = r; p[i + 1] = g; p[i + 2] = b; p[i + 3] = 255; }
    }
    o.putImageData(od, 0, 0);
    return out;
  };
  // mirror a canvas horizontally
  G.flip = (src) => {
    const c = G.canvas(src.width, src.height);
    c.x.translate(src.width, 0); c.x.scale(-1, 1); c.x.drawImage(src, 0, 0);
    return c;
  };
  // recolour every opaque pixel (silhouettes / flashes)
  G.silhouette = (src, col) => {
    const c = G.canvas(src.width, src.height);
    c.x.drawImage(src, 0, 0);
    c.x.globalCompositeOperation = 'source-in';
    c.x.fillStyle = col; c.x.fillRect(0, 0, c.width, c.height);
    return c;
  };
  // draw a string-map (rows of chars) with a colour key. '.' / ' ' = transparent
  G.map = (x, X, Y, rows, key, flip = false) => {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        const col = key[ch];
        if (!col) continue;
        x.fillStyle = col;
        x.fillRect(X + (flip ? row.length - 1 - c : c), Y + r, 1, 1);
      }
    }
  };
  // star / sparkle (4-point)
  G.sparkle = (x, cx, cy, size, col, core = '#ffffff') => {
    cx = Math.round(cx); cy = Math.round(cy);
    G.rect(x, cx - size, cy, size * 2 + 1, 1, col);
    G.rect(x, cx, cy - size, 1, size * 2 + 1, col);
    if (size >= 2) { G.px(x, cx - 1, cy - 1, col); G.px(x, cx + 1, cy - 1, col); G.px(x, cx - 1, cy + 1, col); G.px(x, cx + 1, cy + 1, col); }
    G.px(x, cx, cy, core);
  };
  G.heart = (x, X, Y, col, hi = '#ffd0dc') => {
    G.map(x, X, Y, ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'], { '#': col });
    G.px(x, X + 1, Y + 1, hi);
  };
})(window.P);
