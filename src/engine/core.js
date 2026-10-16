'use strict';
/* PSYCH 16-bit fan adventure — engine core.
   Everything lives on the global `P` namespace so chapters can be plain <script> files. */
window.P = window.P || {};
(function (P) {
  P.W = 320;            // native resolution (16:9), scaled up with nearest-neighbour
  P.H = 180;
  P.VERSION = '1.0.0';

  const U = P.U = {};
  U.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
  U.randi = (a, b) => Math.floor(U.rand(a, b + 1));
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  U.dist = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
  U.inRect = (x, y, r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
  U.hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  U.rng = (seed) => {           // mulberry32 — deterministic art noise
    let a = (typeof seed === 'string' ? U.hash(seed) : seed) >>> 0;
    return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  U.ease = {
    linear: (t) => t,
    in: (t) => t * t,
    out: (t) => 1 - (1 - t) * (1 - t),
    inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  };
  U.toArr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
  U.call = (fnOrVal, ...args) => (typeof fnOrVal === 'function' ? fnOrVal(...args) : fnOrVal);
  U.hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  U.rgbToHex = (r, g, b) => '#' + [r, g, b].map((v) => U.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  U.mix = (a, b, t) => { const A = U.hexToRgb(a), B = U.hexToRgb(b); return U.rgbToHex(U.lerp(A[0], B[0], t), U.lerp(A[1], B[1], t), U.lerp(A[2], B[2], t)); };
  U.shade = (hex, amt) => (amt < 0 ? U.mix(hex, '#140c22', -amt) : U.mix(hex, '#fff6e4', amt));

  /* ---------- storage (always wrapped: may be unavailable) ---------- */
  P.store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } },
    del(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } },
  };

  /* ---------- chapter registry ---------- */
  P.chapters = {};
  P.chapterList = [];
  P.registerChapter = function (def) {
    const required = ['id', 'title', 'number', 'scenes', 'start'];
    for (const k of required) if (def[k] == null) console.warn(`[chapter ${def.id}] missing required field "${k}"`);
    if (!def.pineapple) console.warn(`[chapter ${def.id}] every chapter needs a background pineapple (declare pineapple: {scene, note})`);
    def.clues = def.clues || {};
    def.items = def.items || {};
    def.gifts = def.gifts || {};
    def.snacks = def.snacks || {};
    def.cast = def.cast || {};
    def.revelations = def.revelations || {};
    def.hints = def.hints || [];
    def.banter = def.banter || [];
    P.chapters[def.id] = def;
    if (!P.chapterList.includes(def.id)) P.chapterList.push(def.id);
    P.chapterList.sort((a, b) => P.chapters[a].number - P.chapters[b].number);
    return def;
  };

  /* shared world content (base scenes, cast, banter) registered by world/*.js */
  P.world = { scenes: {}, banter: [], nicknames: [], mapSpots: {} };

  P.debug = /[?&#]debug/.test(location.search + location.hash);
  P.log = (...a) => { if (P.debug) console.log('[P]', ...a); };
})(window.P);
