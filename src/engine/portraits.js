'use strict';
/* Dialogue portraits: 48x56 busts built from the same cast definition as the sprites.
   Expressions: neutral happy smug angry surprised sad worried closed stern flirty.
   P.Portrait.get(id, expr, {talk, blink}) -> cached canvas */
(function (P) {
  const G = P.G, U = P.U;
  const OUT = '#1d1526';
  const PW = 48, PH = 56;
  const EXPR = {
    neutral: { brows: 'flat', eyes: 'open', mouth: 'flat' },
    happy: { brows: 'raised', eyes: 'happy', mouth: 'grin' },
    smile: { brows: 'flat', eyes: 'open', mouth: 'smile' },
    smug: { brows: 'one', eyes: 'half', mouth: 'smirk' },
    angry: { brows: 'angry', eyes: 'open', mouth: 'frown' },
    surprised: { brows: 'raised', eyes: 'wide', mouth: 'o' },
    sad: { brows: 'worried', eyes: 'half', mouth: 'frown' },
    worried: { brows: 'worried', eyes: 'open', mouth: 'flat' },
    closed: { brows: 'worried', eyes: 'closed', mouth: 'flat' },
    psychic: { brows: 'angry', eyes: 'closed', mouth: 'o' },
    stern: { brows: 'angry', eyes: 'half', mouth: 'flat' },
    flirty: { brows: 'one', eyes: 'half', mouth: 'smile' },
    eating: { brows: 'raised', eyes: 'happy', mouth: 'full' },
  };
  P.EXPR = EXPR;

  const JAW = {
    avg: { cr: [24, 22, 12, 13], jaw: [[12, 22], [13, 32], [16, 37], [21, 41], [25, 42], [30, 40], [34, 35], [36, 28], [36, 22]] },
    round: { cr: [24, 22, 12.5, 13], jaw: [[11.5, 22], [12, 33], [16, 39], [21, 42], [26, 43], [31, 41], [35, 36], [37, 29], [37, 22]] },
    long: { cr: [24, 21, 11.5, 13], jaw: [[12.5, 22], [13, 34], [16, 40], [21, 44], [25, 45], [30, 43], [33, 38], [35.5, 30], [35.5, 22]] },
    soft: { cr: [24, 22, 12, 13], jaw: [[12, 22], [13, 31], [16, 36], [21, 40], [25, 40.5], [29, 39], [33, 34], [36, 28], [36, 22]] },
    kid: { cr: [24, 23, 13, 14], jaw: [[11, 24], [12, 33], [16, 38], [21, 41], [25, 41.5], [30, 40], [34, 36], [37, 30], [37, 24]] },
  };

  /* ---------- hair styles (portrait scale). each returns {back(x), front(x)} drawers ---------- */
  function hairStyles(d, R) {
    const [hh, hb, hs] = R;
    const P2 = (x, pts, c) => G.poly(x, pts, c);
    const streak = (x, x0, y0, x1, y1, c = hh) => G.line(x, x0, y0, x1, y1, c);
    return {
      spiky: {
        front(x) {
          P2(x, [[10, 27], [10, 16], [13, 10], [19, 6], [29, 6], [35, 9], [38, 15], [38, 27], [36, 26], [35, 20], [32, 17], [30, 21], [27, 16], [24, 20], [21, 16], [18, 21], [16, 17], [13, 23], [12, 27]], hb);
          for (const t of [[[11, 14], [11, 3], [17, 9]], [[15, 9], [19, 0], [23, 7]], [[21, 7], [26, -1], [28, 7]], [[26, 7], [33, 1], [32, 10]], [[31, 10], [40, 6], [37, 15]], [[35, 14], [42, 14], [38, 19]]]) P2(x, t, hb);
          for (const [a, b, c2, e] of [[13, 10, 12, 5], [18, 7, 19, 2], [24, 6, 26, 1], [29, 7, 32, 3], [34, 10, 38, 7]]) streak(x, a, b, c2, e);
          streak(x, 16, 12, 22, 9); streak(x, 25, 10, 31, 10);
          for (const [a, b] of [[17, 20], [23, 19], [29, 20], [34, 19]]) G.px(x, a, b, hs);
          G.rect(x, 11, 23, 2, 7, hb); G.rect(x, 36, 23, 2, 6, hs);
        },
      },
      buzz: {
        front(x) {
          P2(x, [[11, 26], [11, 16], [14, 10], [20, 7], [28, 7], [34, 10], [37, 16], [37, 26], [35, 25], [35, 19], [31, 15.5], [24, 14.5], [17, 15.5], [13, 19], [13, 26]], hb);
          G.dither(x, 14, 8, 20, 6, hh, 4);
          G.hl(x, 16, 15, 16, hs);
        },
      },
      slick: {
        front(x) {
          P2(x, [[11, 27], [11, 15], [14, 9], [20, 5.5], [28, 5.5], [34, 9], [37, 14], [37, 26], [35, 24], [34, 16], [29, 13], [26, 13], [24, 16], [22, 13], [17, 14], [13, 20], [13, 27]], hb);
          streak(x, 14, 12, 21, 7); streak(x, 18, 12, 26, 7); streak(x, 25, 10, 32, 8); streak(x, 29, 12, 35, 11, hs);
          G.px(x, 24, 15, hs);
        },
      },
      ponytail: {
        back(x) {
          P2(x, [[9, 20], [13, 16], [15, 30], [13, 44], [9, 48], [6, 40], [7, 28]], hs);
          P2(x, [[10, 22], [13, 19], [14, 30], [12, 40], [9, 43], [8, 33]], hb);
          streak(x, 10, 26, 11, 38);
        },
        front(x) {
          P2(x, [[10, 30], [10, 16], [14, 9], [20, 5.5], [29, 5.5], [35, 9], [38, 15], [38, 32], [36, 34], [35, 22], [32, 17], [27, 15], [22, 18], [17, 22], [14, 26], [12, 33]], hb);
          streak(x, 15, 11, 22, 7); streak(x, 24, 7, 32, 9); streak(x, 18, 18, 27, 13); streak(x, 13, 20, 18, 14);
          G.line(x, 36, 20, 36, 32, hs);
          G.line(x, 22, 18, 32, 16, hs);
        },
      },
      bob: {
        front(x) {
          P2(x, [[8, 40], [8, 18], [12, 10], [19, 5.5], [29, 5.5], [36, 10], [40, 18], [40, 40], [37, 41], [36, 24], [33, 17], [27, 16], [21, 19], [16, 20], [13, 24], [12, 41]], hb);
          streak(x, 13, 12, 20, 8); streak(x, 22, 8, 30, 8); streak(x, 18, 17, 30, 13);
          G.line(x, 9, 24, 9, 38, hh); G.line(x, 39, 24, 39, 38, hs);
          G.hl(x, 8, 40, 5, hs); G.hl(x, 36, 40, 5, hs);
        },
      },
      gray: {
        front(x) {
          P2(x, [[11, 26], [11, 17], [13, 11], [19, 8], [29, 8], [35, 11], [37, 17], [37, 26], [35, 24], [35, 18], [32, 14], [29, 15], [26, 13], [22, 13], [19, 15], [16, 14], [13, 18], [13, 26]], hb);
          G.dither(x, 15, 9, 18, 4, hh, 6);
          streak(x, 14, 13, 18, 10, hs); streak(x, 30, 10, 34, 13, hs);
        },
      },
      short: {
        front(x) {
          P2(x, [[11, 27], [11, 15], [14, 9], [20, 6], [28, 6], [34, 9], [37, 15], [37, 27], [35, 25], [35, 19], [31, 16], [26, 17], [22, 15], [17, 17], [13, 21], [13, 27]], hb);
          streak(x, 15, 11, 22, 8); streak(x, 24, 8, 31, 10); streak(x, 20, 15, 28, 12, hs);
        },
      },
      crew: {
        front(x) {
          P2(x, [[11, 24], [11, 13], [13, 8.5], [35, 8.5], [37, 13], [37, 24], [35, 22], [35, 16], [13, 16], [13, 24]], hb);
          G.dither(x, 14, 9, 20, 3, hh, 8);
          G.hl(x, 14, 15, 20, hs);
        },
      },
      balding: {
        front(x) {
          P2(x, [[10, 32], [10, 20], [13, 17], [14, 32]], hb); P2(x, [[38, 32], [38, 20], [35, 17], [34, 32]], hb);
          streak(x, 22, 9, 25, 7, hb); streak(x, 26, 9, 28, 6, hb);
          G.px(x, 18, 12, '#ffffff88'.slice(0, 7));
        },
      },
      surfer: {
        back(x) { P2(x, [[8, 22], [12, 18], [36, 18], [41, 24], [41, 46], [36, 44], [12, 44], [7, 46]], hs); },
        front(x) {
          P2(x, [[8, 40], [8, 17], [12, 9], [19, 5], [29, 5], [36, 9], [40, 17], [41, 40], [37, 36], [36, 22], [32, 16], [28, 21], [24, 16], [20, 21], [16, 17], [13, 24], [12, 38]], hb);
          streak(x, 12, 14, 18, 8); streak(x, 22, 8, 30, 8); streak(x, 9, 22, 10, 36); streak(x, 38, 22, 39, 34, hs);
          for (const [a, b] of [[20, 20], [28, 20]]) G.px(x, a, b, hs);
        },
      },
      pompadour: {
        front(x) {
          P2(x, [[11, 26], [11, 14], [13, 7], [18, 2], [27, 1], [34, 4], [38, 10], [37, 25], [35, 23], [34, 15], [29, 12], [22, 12], [16, 14], [13, 20], [13, 26]], hb);
          streak(x, 16, 7, 24, 3); streak(x, 20, 9, 30, 5); streak(x, 26, 10, 34, 8, hs);
        },
      },
      bun: {
        back(x) { G.ellipse(x, 24, 5, 7, 5, hb); G.line(x, 20, 3, 27, 2, hh); },
        front(x) {
          P2(x, [[11, 26], [11, 15], [14, 9], [20, 6], [28, 6], [34, 9], [37, 15], [37, 26], [35, 24], [35, 17], [30, 14], [24, 13], [18, 14], [13, 18], [13, 26]], hb);
          streak(x, 15, 12, 23, 8); streak(x, 25, 8, 33, 12); streak(x, 18, 10, 30, 9, hh);
        },
      },
      long: {
        back(x) { P2(x, [[8, 20], [40, 20], [42, 52], [33, 50], [15, 50], [6, 52]], hs); },
        front(x) {
          P2(x, [[8, 46], [8, 17], [12, 9], [19, 5.5], [29, 5.5], [36, 9], [40, 17], [40, 46], [36, 44], [36, 22], [31, 16], [24, 15], [17, 17], [13, 22], [12, 44]], hb);
          streak(x, 13, 13, 20, 8); streak(x, 23, 8, 31, 9); streak(x, 10, 22, 11, 42); streak(x, 38, 22, 38, 42, hs);
        },
      },
      curly: {
        front(x) {
          for (const [cx, cy, r] of [[13, 16, 4], [17, 10, 4.5], [24, 8, 5], [31, 10, 4.5], [35, 16, 4], [11, 22, 3], [37, 22, 3], [20, 14, 3], [28, 14, 3]]) G.circle(x, cx, cy, r, hb);
          for (const [cx, cy] of [[15, 9], [23, 6], [30, 8], [12, 15], [35, 14]]) G.px(x, cx, cy, hh);
          for (const [cx, cy] of [[19, 16], [27, 16], [14, 20], [34, 20]]) G.px(x, cx, cy, hs);
        },
      },
      afro: {
        back(x) { G.ellipse(x, 24, 16, 19, 15, hb); G.dither(x, 8, 4, 32, 26, hh, 2); },
        front(x) { G.poly(x, [[12, 22], [14, 15], [24, 13], [34, 15], [36, 22], [36, 14], [12, 14]], hb); },
      },
      beehive: {
        front(x) {
          G.ellipse(x, 24, 4, 11, 10, hb); G.dither(x, 15, -4, 18, 14, hh, 3);
          P2(x, [[11, 26], [11, 15], [14, 9], [20, 7], [28, 7], [34, 9], [37, 15], [37, 26], [35, 24], [34, 16], [24, 14], [14, 16], [13, 26]], hb);
          streak(x, 16, 10, 24, 8); streak(x, 18, 0, 24, -3);
        },
      },
      swoop: {
        front(x) {
          P2(x, [[11, 26], [11, 15], [14, 9], [20, 5.5], [29, 5.5], [36, 9], [40, 14], [42, 20], [36, 18], [31, 15], [24, 17], [18, 16], [13, 20], [13, 26]], hb);
          streak(x, 14, 12, 26, 7); streak(x, 22, 11, 38, 13); streak(x, 18, 15, 32, 14, hs);
        },
      },
      mohawk: {
        front(x) { P2(x, [[20, 16], [21, 4], [24, -2], [27, 4], [28, 16]], hb); streak(x, 23, 1, 23, 14); G.dither(x, 12, 12, 24, 6, hs, 3); },
      },
      bald: { front() {} },
      kidspiky: null,
    };
  }

  function drawEyes(x, d, ex, by, expr, blink) {
    const eyes = blink ? 'closed' : expr.eyes;
    const ec = d.eyes;
    const lash = d.face.lashes;
    for (const [cx, side] of [[19, 0], [30, 1]]) {
      const x0 = cx - 2;
      if (eyes === 'closed') {
        G.hl(x, x0, by + 1, 5, OUT); if (lash) { G.px(x, x0 - 1, by, OUT); }
        continue;
      }
      if (eyes === 'happy') {
        G.hl(x, x0 + 1, by, 3, OUT); G.px(x, x0, by + 1, OUT); G.px(x, x0 + 4, by + 1, OUT);
        continue;
      }
      const wide = eyes === 'wide';
      const half = eyes === 'half';
      G.rect(x, x0, by - (wide ? 1 : 0), 5, wide ? 4 : 3, '#fbf6f2');
      G.rect(x, cx - 0 + (side ? -1 : 0), by - (wide ? 1 : 0), 2, wide ? 4 : 3, ec);
      G.px(x, cx + (side ? -1 : 0), by + 1, '#120c18');
      G.px(x, cx + 1 + (side ? -1 : 0), by - (wide ? 1 : 0), '#ffffff');
      // lids
      G.hl(x, x0, by - 1 - (wide ? 1 : 0), 5, OUT);
      if (half) G.hl(x, x0, by, 5, U.shade(d.skinR[1], -0.25));
      if (lash) { G.px(x, side ? x0 + 5 : x0 - 1, by - 2, OUT); G.hl(x, x0, by - 2 - (wide ? 1 : 0), 5, OUT); }
      G.hl(x, x0 + 1, by + 3, 3, U.shade(d.skinR[1], -0.12));
    }
  }

  function drawBrows(x, d, by, expr) {
    const c = d.face.brow || d.hairR[2];
    const thick = d.face.thickBrows !== false;
    const b = expr.brows;
    const L = (x0, y0, x1, y1) => { G.line(x, x0, y0, x1, y1, c); if (thick) G.line(x, x0, y0 - 1, x1, y1 - 1, c); };
    if (b === 'angry') { L(16, by - 1, 21, by + 1); L(28, by + 1, 33, by - 1); }
    else if (b === 'raised') { L(16, by - 2, 21, by - 3); L(28, by - 3, 33, by - 2); }
    else if (b === 'worried') { L(16, by, 21, by - 2); L(28, by - 2, 33, by); }
    else if (b === 'one') { L(16, by, 21, by); L(28, by - 3, 33, by - 2); }
    else { L(16, by, 21, by - 1); L(28, by - 1, 33, by); }
  }

  function drawMouth(x, d, my, expr, talk) {
    const lip = d.face.lips || U.shade(d.skinR[2], -0.25);
    const dark = '#3a1418', tongue = '#c0505a', teeth = '#fbf6f2';
    let m = expr.mouth;
    if (talk) m = m === 'grin' || m === 'smile' ? 'grinopen' : m === 'frown' ? 'frownopen' : 'open';
    switch (m) {
      case 'flat': G.hl(x, 22, my, 6, lip); G.hl(x, 23, my + 1, 4, U.shade(d.skinR[1], -0.08)); break;
      case 'smile': G.hl(x, 22, my, 6, lip); G.px(x, 21, my - 1, lip); G.px(x, 28, my - 1, lip); break;
      case 'grin': G.rect(x, 21, my - 1, 8, 3, dark); G.hl(x, 21, my - 1, 8, teeth); G.px(x, 20, my - 2, lip); G.px(x, 29, my - 2, lip); break;
      case 'smirk': G.hl(x, 22, my, 5, lip); G.px(x, 27, my - 1, lip); G.px(x, 28, my - 2, lip); break;
      case 'frown': G.hl(x, 22, my, 6, lip); G.px(x, 21, my + 1, lip); G.px(x, 28, my + 1, lip); break;
      case 'o': G.ellipse(x, 24.5, my + 0.5, 2, 2, dark); G.px(x, 24, my + 1, tongue); break;
      case 'full': G.ellipse(x, 24.5, my, 4, 2, U.shade(d.skinR[1], -0.12)); G.hl(x, 22, my, 6, lip); break;
      case 'open': G.rect(x, 22, my - 1, 6, 3, dark); G.hl(x, 23, my + 1, 4, tongue); G.hl(x, 22, my - 1, 6, teeth); break;
      case 'grinopen': G.rect(x, 21, my - 1, 8, 4, dark); G.hl(x, 21, my - 1, 8, teeth); G.hl(x, 22, my + 2, 6, tongue); break;
      case 'frownopen': G.rect(x, 22, my, 6, 2, dark); G.px(x, 21, my + 1, lip); G.px(x, 28, my + 1, lip); break;
      default: G.hl(x, 22, my, 6, lip);
    }
  }

  function drawBody(x, d) {
    const top = d.top;
    const R = [U.shade(top.color, 0.25), top.color, U.shade(top.color, -0.3)];
    const [sh, sb, ss] = d.skinR;
    const build = d.build === 'big' || d.build === 'huge' || d.build === 'stout' ? 2 : d.build === 'fem' || d.build === 'slim' ? -1 : 0;
    const shoulders = [[1 - build, 56], [3 - build, 49], [11 - build, 45], [19, 43.5], [29, 43.5], [37 + build, 45], [45 + build, 49], [47 + build, 56]];
    // neck
    G.rect(x, 19, 36, 11, 12, sb); G.rect(x, 19, 36, 11, 5, ss); G.rect(x, 27, 36, 3, 12, ss);
    const t = top.type;
    if (t === 'tank' || t === 'wetsuitDown') {
      G.poly(x, shoulders, sb);
      G.poly(x, [[11, 56], [13, 47], [18, 46], [24, 50], [30, 46], [35, 47], [37, 56]], R[1]);
      if (top.stripe) G.hl(x, 13, 52, 23, top.stripe);
    } else {
      G.poly(x, shoulders, R[1]);
      G.poly(x, [[36 + build, 45], [45 + build, 49], [47 + build, 56], [40, 56]], R[2]);
    }
    const V = (w, depth, col) => G.poly(x, [[24 - w, 43.5], [24 + w, 43.5], [24, 43.5 + depth]], col);
    switch (t) {
      case 'overshirt': {
        G.poly(x, [[17, 44], [31, 44], [30, 56], [18, 56]], top.inner);
        G.hl(x, 19, 44, 11, U.shade(top.inner, 0.15));
        if (top.graphic) { G.rect(x, 21, 49, 6, 4, top.graphic); G.rect(x, 22, 50, 2, 2, top.inner); }
        G.line(x, 17, 44, 16, 56, R[2]); G.line(x, 31, 44, 32, 56, R[2]);
        G.poly(x, [[12, 45], [18, 43], [20, 48], [16, 50]], R[0]); G.poly(x, [[36, 45], [30, 43], [28, 48], [32, 50]], R[0]);
        break;
      }
      case 'shirt': case 'polo': {
        G.poly(x, [[17, 43], [24, 47], [21, 50], [16, 46]], R[0]); G.poly(x, [[31, 43], [24, 47], [27, 50], [32, 46]], R[0]);
        if (top.tie) { G.poly(x, [[23, 46], [26, 46], [27, 56], [22, 56]], top.tie); G.rect(x, 22.5, 45, 4, 3, U.shade(top.tie, 0.2)); }
        else if (t === 'shirt') { for (let yy = 49; yy < 56; yy += 3) G.px(x, 24, yy, R[2]); }
        if (top.pocket) G.rect(x, 30, 50, 5, 4, R[2]);
        break;
      }
      case 'suit': case 'blazer': case 'tux': {
        G.poly(x, [[18, 43.5], [30, 43.5], [27, 56], [21, 56]], top.shirt || '#f2f2f4');
        if (top.tie) { G.poly(x, [[23, 45], [26, 45], [27, 56], [22, 56]], top.tie); G.rect(x, 22.5, 44, 4, 2, U.shade(top.tie, 0.2)); }
        if (t === 'tux') { G.poly(x, [[20, 44], [24, 46], [28, 44], [28, 47], [24, 46], [20, 47]], '#1a1420'); }
        G.poly(x, [[12, 45], [18, 43.5], [22, 56], [17, 56]], R[2]); G.poly(x, [[36, 45], [30, 43.5], [26, 56], [31, 56]], R[2]);
        G.line(x, 18, 44, 21, 55, R[0]);
        if (top.pocketSquare) G.rect(x, 33, 49, 3, 2, top.pocketSquare);
        break;
      }
      case 'hawaiian': {
        const r = U.rng(d.id + 'ph');
        for (let i = 0; i < 26; i++) { const px = 2 + Math.floor(r() * 44), py = 45 + Math.floor(r() * 11); const c = i % 2 ? top.pattern : top.pattern2; G.px(x, px, py, c); G.px(x, px + 1, py, c); G.px(x, px, py + 1, c); }
        V(5, 6, d.skinR[1]);
        G.poly(x, [[17, 43], [21, 49], [18, 50], [14, 45]], R[0]); G.poly(x, [[31, 43], [27, 49], [30, 50], [34, 45]], R[0]);
        break;
      }
      case 'uniform': {
        G.poly(x, [[17, 43], [24, 47], [21, 50], [16, 46]], R[0]); G.poly(x, [[31, 43], [24, 47], [27, 50], [32, 46]], R[0]);
        G.rect(x, 31, 49, 4, 5, '#f2c84a'); G.px(x, 32, 50, '#fff2a0'); G.vl(x, 24, 48, 8, R[2]);
        G.rect(x, 4, 48, 4, 5, '#c8a040');
        break;
      }
      case 'labcoat': case 'trench': {
        G.poly(x, [[18, 43.5], [30, 43.5], [27, 56], [21, 56]], top.inner || '#7a9ad0');
        if (top.tie) G.poly(x, [[23, 45], [26, 45], [26.5, 56], [22.5, 56]], top.tie);
        G.poly(x, [[12, 45], [18, 43.5], [22, 56], [17, 56]], R[2]); G.poly(x, [[36, 45], [30, 43.5], [26, 56], [31, 56]], R[2]);
        if (d.acc.includes('stethoscope')) { G.line(x, 15, 46, 19, 56, '#3a3a4a'); G.line(x, 33, 46, 29, 56, '#3a3a4a'); }
        break;
      }
      case 'dress': case 'muumuu': {
        V(6, 5, d.skinR[1]);
        if (top.pattern === 'flowers') { const r = U.rng(d.id + 'pd'); for (let i = 0; i < 18; i++) { const px = 4 + Math.floor(r() * 40), py = 47 + Math.floor(r() * 9); G.px(x, px, py, top.pattern2 || '#ff8ab0'); G.px(x, px + 1, py, top.pattern2 || '#ff8ab0'); } }
        break;
      }
      case 'vest': {
        G.poly(x, [[16, 43.5], [32, 43.5], [31, 56], [17, 56]], top.shirt || '#f2f2f4');
        if (top.tie) G.poly(x, [[23, 45], [26, 45], [26.5, 56], [22.5, 56]], top.tie);
        G.poly(x, [[16, 47], [21, 56], [16, 56]], R[1]); G.poly(x, [[32, 47], [27, 56], [32, 56]], R[1]);
        G.poly(x, [[3, 49], [11, 45], [16, 44], [16, 56], [2, 56]], top.shirt || '#f2f2f4');
        G.poly(x, [[45, 49], [37, 45], [32, 44], [32, 56], [46, 56]], U.shade(top.shirt || '#f2f2f4', -0.15));
        break;
      }
      case 'hoodie': {
        G.poly(x, [[12, 45], [18, 42], [30, 42], [36, 45], [30, 47], [18, 47]], R[2]);
        G.line(x, 21, 47, 21, 53, '#e8e8f0'); G.line(x, 27, 47, 27, 53, '#e8e8f0');
        break;
      }
      case 'sweater': {
        if (top.collar) { G.poly(x, [[18, 43], [24, 47], [21, 49], [17, 45]], top.collar); G.poly(x, [[30, 43], [24, 47], [27, 49], [31, 45]], top.collar); }
        G.hl(x, 18, 44, 13, R[2]);
        break;
      }
      case 'wetsuit': {
        G.hl(x, 19, 44, 11, R[2]);
        G.poly(x, [[3, 52], [12, 47], [12, 50], [4, 56]], top.stripe || '#2ce8f5');
        break;
      }
      default: {
        G.ellipse(x, 24, 44, 6, 2, U.shade(top.color, -0.35)); G.rect(x, 18, 42, 13, 2, d.skinR[1]);
        G.hl(x, 19, 44, 11, d.skinR[2]);
        if (top.stripe) G.rect(x, 2, 50, 44, 2, top.stripe);
        if (top.graphic) G.rect(x, 20, 49, 8, 5, top.graphic);
      }
    }
    if (top.apron) { G.poly(x, [[15, 47], [33, 47], [34, 56], [14, 56]], top.apron); G.line(x, 15, 47, 18, 43.5, U.shade(top.apron, -0.2)); G.line(x, 33, 47, 30, 43.5, U.shade(top.apron, -0.2)); if (top.apronText) G.rect(x, 21, 50, 6, 3, top.apronText); }
    // body accessories
    for (const a of d.acc) {
      const t2 = typeof a === 'string' ? a : a.type;
      if (t2 === 'pearls') { for (let i = 0; i < 9; i++) { const ang = Math.PI * (0.15 + 0.7 * (i / 8)); G.px(x, 24 + Math.cos(ang) * 7, 43 + Math.sin(ang) * 4, '#fff8f0'); } }
      else if (t2 === 'chain') { for (let i = 0; i < 9; i++) { const ang = Math.PI * (0.15 + 0.7 * (i / 8)); G.px(x, 24 + Math.cos(ang) * 6, 44 + Math.sin(ang) * 5, '#fee761'); } G.rect(x, 23, 49, 3, 3, '#fee761'); }
      else if (t2 === 'tooth') { for (let i = 0; i < 9; i++) { const ang = Math.PI * (0.15 + 0.7 * (i / 8)); G.px(x, 24 + Math.cos(ang) * 6, 43 + Math.sin(ang) * 5, '#3a2a1a'); } G.poly(x, [[23, 48], [26, 48], [24.5, 53]], '#fff8e0'); }
      else if (t2 === 'lei') { for (let i = 0; i < 12; i++) { const ang = Math.PI * (0.05 + 0.9 * (i / 11)); G.circle(x, 24 + Math.cos(ang) * 11, 44 + Math.sin(ang) * 6, 1.5, ['#ff6aa0', '#fee761', '#ff9a50'][i % 3]); } }
      else if (t2 === 'bowtie') { const c = a.color || '#c03040'; G.poly(x, [[19, 43], [24, 45], [19, 47]], c); G.poly(x, [[29, 43], [24, 45], [29, 47]], c); G.rect(x, 23, 44, 2, 2, U.shade(c, -0.3)); }
      else if (t2 === 'scarf') { const c = a.color || '#c040a0'; G.poly(x, [[15, 43], [33, 43], [31, 47], [17, 47]], c); G.poly(x, [[27, 46], [31, 46], [32, 56], [27, 56]], U.shade(c, -0.15)); }
      else if (t2 === 'badge' && (d.top.type === 'blazer' || d.top.type === 'suit')) { /* badge on belt, not in bust */ }
      else if (t2 === 'camera') { G.line(x, 14, 45, 30, 56, '#2a2028'); G.rect(x, 26, 50, 9, 6, '#2a2a34'); G.circle(x, 30, 53, 2, '#6ab0ff'); }
      else if (t2 === 'whistle') { G.line(x, 17, 44, 23, 52, '#e43b44'); G.rect(x, 22, 52, 3, 2, '#c0cbdc'); }
      else if (t2 === 'stethoscope' && d.top.type !== 'labcoat') { G.line(x, 15, 46, 19, 56, '#3a3a4a'); G.line(x, 33, 46, 29, 56, '#3a3a4a'); }
    }
  }

  function headAcc(x, d, layer) {
    for (const a of d.acc) {
      const t = typeof a === 'string' ? a : a.type;
      const col = (typeof a === 'object' && a.color) || null;
      if (layer === 'front') {
        if (t === 'cap') {
          const c = col || '#c83030';
          G.poly(x, [[10, 18], [12, 9], [18, 5], [30, 5], [36, 9], [38, 18]], c);
          if (a.backwards) { G.rect(x, 18, 16, 12, 2, U.shade(c, -0.3)); G.ellipse(x, 24, 15, 3, 1, '#fff'); }
          else { G.poly(x, [[10, 18], [38, 18], [44, 22], [12, 21]], U.shade(c, -0.3)); }
          G.line(x, 14, 9, 22, 6, U.shade(c, 0.3));
          if (a.logo) G.rect(x, 22, 9, 4, 3, a.logo);
        } else if (t === 'chefhat') {
          G.rect(x, 12, 4, 24, 12, '#ffffff'); G.circle(x, 15, 4, 5, '#ffffff'); G.circle(x, 24, 2, 6, '#ffffff'); G.circle(x, 33, 4, 5, '#ffffff'); G.hl(x, 12, 15, 24, '#d8d8e8'); G.hl(x, 12, 16, 24, '#c8c8d8');
        } else if (t === 'cowboy') {
          const c = col || '#9a6034';
          G.ellipse(x, 24, 15, 20, 3, U.shade(c, -0.2)); G.poly(x, [[14, 15], [15, 4], [21, 2], [24, 5], [27, 2], [33, 4], [34, 15]], c); G.hl(x, 14, 13, 21, U.shade(c, -0.45));
        } else if (t === 'fedora') {
          const c = col || '#4a4a5a';
          G.ellipse(x, 24, 13, 17, 3, U.shade(c, -0.15)); G.poly(x, [[14, 13], [15, 4], [24, 2], [33, 4], [34, 13]], c); G.hl(x, 14, 11, 21, '#2a2030');
        } else if (t === 'turban') {
          const c = col || '#7a2a8a';
          G.ellipse(x, 24, 11, 15, 9, c); G.line(x, 12, 14, 36, 6, U.shade(c, 0.25)); G.line(x, 12, 9, 34, 16, U.shade(c, -0.25)); G.circle(x, 24, 11, 2, '#fee761'); G.px(x, 24, 11, '#5ad0ff');
        } else if (t === 'bucket') {
          const c = col || '#7a8a5a';
          G.poly(x, [[14, 14], [16, 4], [32, 4], [34, 14]], c); G.poly(x, [[8, 18], [14, 13], [34, 13], [40, 18]], U.shade(c, -0.2));
        } else if (t === 'flower') {
          for (const [dx, dy] of [[0, -2], [2, 0], [0, 2], [-2, 0]]) G.circle(x, 36 + dx, 16 + dy, 1.6, '#ff8ab8'); G.circle(x, 36, 16, 1, '#fee761');
        } else if (t === 'shadeshead') {
          G.rect(x, 14, 11, 9, 4, '#14101c'); G.rect(x, 26, 11, 9, 4, '#14101c'); G.hl(x, 22, 12, 4, '#14101c'); G.px(x, 16, 12, '#6a8ab0'); G.px(x, 28, 12, '#6a8ab0');
        } else if (t === 'headband') {
          G.rect(x, 11, 13, 26, 3, col || '#e43b44');
        } else if (t === 'beanie') {
          const c = col || '#3a6a8a';
          G.ellipse(x, 24, 11, 14, 9, c); G.rect(x, 10, 13, 28, 5, U.shade(c, -0.25)); G.dither(x, 12, 4, 24, 8, U.shade(c, 0.2), 4);
        } else if (t === 'tiara') {
          G.hl(x, 16, 9, 16, '#fee761'); G.poly(x, [[22, 9], [24, 4], [26, 9]], '#fee761'); G.px(x, 24, 7, '#5ad0ff');
        } else if (t === 'earrings') {
          G.rect(x, 10, 31, 2, 3, col || '#fee761'); G.rect(x, 37, 31, 2, 3, col || '#fee761');
        } else if (t === 'hoops') {
          G.frame(x, 8, 30, 4, 5, col || '#fee761'); G.frame(x, 37, 30, 4, 5, col || '#fee761');
        } else if (t === 'monocle') {
          G.frame(x, 27, 24, 7, 7, '#e8c860'); G.line(x, 33, 30, 35, 40, '#e8c860');
        }
      }
    }
  }

  function render(id, exprName, talk, blink) {
    const d = P.getCast(id);
    if (!d) return null;
    const expr = EXPR[exprName] || EXPR.neutral;
    const kid = !!d.kid;
    const jaw = kid ? JAW.kid : JAW[d.jaw] || JAW.avg;
    const R = d.hairR;
    const styles = hairStyles(d, R);
    const style = styles[d.hair.style] || (d.hair.style === 'kidspiky' ? styles.spiky : styles.short);
    const [sh, sb, ss] = d.skinR;

    const layer = () => G.canvas(PW + 2, PH + 2);
    // body layer
    const Lb = layer(); Lb.x.translate(1, 1); drawBody(Lb.x, d);
    // hair back
    const Lhb = layer(); Lhb.x.translate(1, 1); if (style && style.back) style.back(Lhb.x);
    // head
    const Lh = layer(); const x = Lh.x; x.translate(1, 1);
    const [cx, cy, rx, ry] = jaw.cr;
    // ears
    G.ellipse(x, cx - rx - 0.5, cy + 6, 2, 3, sb); G.ellipse(x, cx + rx + 0.5, cy + 6, 2, 3, ss);
    G.ellipse(x, cx, cy, rx, ry, sb);
    G.poly(x, jaw.jaw, sb);
    // shading: right cheek + jaw underside
    G.poly(x, [[jaw.jaw[6][0] - 1, jaw.jaw[6][1]], [jaw.jaw[7][0], jaw.jaw[7][1]], [jaw.jaw[8][0], jaw.jaw[8][1] + 3], [jaw.jaw[7][0] - 2, jaw.jaw[7][1] + 1], [jaw.jaw[6][0] - 3, jaw.jaw[6][1] - 1]], U.mix(sb, ss, 0.6));
    G.poly(x, [[jaw.jaw[3][0], jaw.jaw[3][1] - 1], [jaw.jaw[4][0], jaw.jaw[4][1] - 1], [jaw.jaw[5][0], jaw.jaw[5][1] - 1], [jaw.jaw[5][0], jaw.jaw[5][1]], [jaw.jaw[3][0], jaw.jaw[3][1]]], ss);
    G.px(x, cx - rx + 3, cy - 6, sh); G.hl(x, cx - 6, cy - 9, 5, sh);
    // ear detail
    G.px(x, cx - rx - 0.5, cy + 6, ss); G.px(x, cx + rx + 0.5, cy + 6, U.shade(ss, -0.2));
    const eyeY = 27 + (kid ? 1 : 0) + (d.jaw === 'long' ? -1 : 0);
    // facial hair under features
    const f = d.face;
    if (f.stubble) {
      const sc = U.mix(sb, d.hairR[2], 0.28), sc2 = U.mix(sb, d.hairR[2], 0.42);
      const rr = U.rng(d.id + 'stub');
      for (let yy = 34; yy <= 44; yy++) for (let xx = 13; xx <= 36; xx++) {
        const edge = Math.abs(xx - 24.5) > 9 && yy < 37;
        if (edge || rr() > 0.42) continue;
        G.px(x, xx, yy, rr() > 0.5 ? sc : sc2);
      }
    }
    if (f.beard) { const bc = HAIRC(f.beard); G.poly(x, [[jaw.jaw[1][0], 30], [jaw.jaw[2][0], jaw.jaw[2][1]], [jaw.jaw[3][0], jaw.jaw[3][1] + 1], [jaw.jaw[4][0], jaw.jaw[4][1] + 2], [jaw.jaw[5][0], jaw.jaw[5][1] + 1], [jaw.jaw[6][0], jaw.jaw[6][1]], [jaw.jaw[7][0], 30], [32, 33], [17, 33]], bc[1]); G.dither(x, 14, 34, 22, 8, bc[0], 3); }
    // re-clip facial stubble/beard to face (redraw outside region transparent)
    x.save(); x.globalCompositeOperation = 'destination-in';
    const clip = G.canvas(PW + 2, PH + 2); clip.x.translate(1, 1);
    G.ellipse(clip.x, cx - rx - 0.5, cy + 6, 2, 3, '#000'); G.ellipse(clip.x, cx + rx + 0.5, cy + 6, 2, 3, '#000');
    G.ellipse(clip.x, cx, cy, rx, ry, '#000'); G.poly(clip.x, jaw.jaw, '#000');
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(clip, 0, 0); x.restore();
    x.setTransform(1, 0, 0, 1, 1, 1);
    // features
    drawBrows(x, d, eyeY - 4, expr);
    drawEyes(x, d, 0, eyeY, expr, blink);
    // nose
    G.line(x, 26, eyeY + 1, 27, eyeY + 6, ss); G.hl(x, 23, eyeY + 7, 5, ss); G.px(x, 25, eyeY + 6, sh);
    if (f.freckles) for (const [a, b] of [[17, 32], [19, 33], [30, 32], [32, 33], [18, 31], [31, 31]]) G.px(x, a, b, U.shade(sb, -0.25));
    if (f.blush) { G.hl(x, 16, eyeY + 6, 3, f.blush); G.hl(x, 30, eyeY + 6, 3, f.blush); }
    if (f.wrinkles) { G.px(x, 14, eyeY, ss); G.px(x, 35, eyeY, ss); G.line(x, 20, 34, 19, 37, ss); G.line(x, 29, 34, 30, 37, ss); }
    // mustache / goatee over mouth area
    const mouthY = 37 + (kid ? 0 : 0) + (d.jaw === 'long' ? 1 : 0) + (d.jaw === 'soft' ? -1 : 0);
    if (f.goatee) { const gc = HAIRC(f.goatee); G.poly(x, [[19, mouthY - 3], [30, mouthY - 3], [31, mouthY + 1], [28, mouthY + 6], [21, mouthY + 6], [18, mouthY + 1]], gc[1]); G.dither(x, 19, mouthY - 3, 12, 9, gc[0], 3); G.rect(x, 21, mouthY - 1, 8, 2, sb); }
    if (f.mustache) { const mc = HAIRC(f.mustache); G.poly(x, [[19, mouthY - 1], [21, mouthY - 3], [28, mouthY - 3], [30, mouthY - 1], [28, mouthY - 1], [24.5, mouthY - 2], [21, mouthY - 1]], mc[1]); G.hl(x, 21, mouthY - 3, 7, mc[0]); }
    drawMouth(x, d, mouthY, expr, talk);
    // glasses
    if (f.glasses) {
      const gc = f.glasses === 'sun' ? '#14101c' : (f.glassesColor || '#4a4458');
      if (f.glasses === 'sun') { G.rect(x, 15, eyeY - 2, 9, 5, gc); G.rect(x, 26, eyeY - 2, 9, 5, gc); G.hl(x, 23, eyeY - 1, 4, gc); G.px(x, 17, eyeY - 1, '#6a8ab0'); G.px(x, 28, eyeY - 1, '#6a8ab0'); }
      else if (f.glasses === 'round') {
        for (const ex of [19, 30]) { for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2; G.px(x, ex + Math.cos(t) * 4.2, eyeY + 0.5 + Math.sin(t) * 3.4, gc); } }
        G.hl(x, 23, eyeY, 3, gc); G.hl(x, 11, eyeY, 4, gc); G.hl(x, 34, eyeY, 3, gc);
        G.px(x, 17, eyeY - 1, '#ffffff');
      } else { G.frame(x, 15, eyeY - 2, 9, 6, gc); G.frame(x, 26, eyeY - 2, 9, 6, gc); G.hl(x, 23, eyeY, 3, gc); G.hl(x, 11, eyeY - 1, 4, gc); }
    }
    // hair front
    const Lhf = layer(); Lhf.x.translate(1, 1);
    if (style && style.front) style.front(Lhf.x);
    headAcc(Lhf.x, d, 'front');

    // composite: outline each layer separately for crisp separation
    const out = G.canvas(PW, PH);
    const o = out.x;
    const bg = (d.portrait && d.portrait.bg) || '#2a2440';
    const comp = G.canvas(PW + 2, PH + 2);
    comp.x.drawImage(G.outline(Lhb), 0, 0);
    comp.x.drawImage(G.outline(Lb), 0, 0);
    comp.x.drawImage(G.outline(Lh), 0, 0);
    comp.x.drawImage(G.outline(Lhf), 0, 0);
    // earrings drawn after hair so they peek out
    if (f.earring) { G.rect(comp.x, 11, 33, 2, 2, f.earring); }
    o.fillStyle = bg; o.fillRect(0, 0, PW, PH);
    // subtle backdrop pattern
    for (let yy = 0; yy < PH; yy += 2) { o.fillStyle = U.shade(bg, yy % 4 ? 0.04 : -0.04); o.fillRect(0, yy, PW, 1); }
    o.drawImage(comp, -1, -1);
    return out;
  }
  function HAIRC(c) { return P.HAIR[c] || [U.shade(c, 0.25), c, U.shade(c, -0.3)]; }

  const cache = new Map();
  P.Portrait = {
    W: PW, H: PH,
    get(id, expr = 'neutral', o = {}) {
      const d = P.getCast(id);
      if (!d) return null;
      if (!EXPR[expr]) expr = (d.portrait && d.portrait.base) || 'neutral';
      const k = id + '|' + expr + '|' + (o.talk ? 1 : 0) + (o.blink ? 1 : 0);
      let c = cache.get(k);
      if (!c) { c = render(id, expr, !!o.talk, !!o.blink); cache.set(k, c); }
      return c;
    },
    clear() { cache.clear(); },
  };
})(window.P);
