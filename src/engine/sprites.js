'use strict';
/* Character sprites: skeletal, pose-driven pixel renderer.
   - Heads use hand-authored face + hair masks (side = 3/4 view facing right, front, back).
   - Bodies/limbs are drawn procedurally from a pose (joint angles + foot targets), so any
     character can walk, gesture, and (for Shawn) gyrate through psychic visions.
   - Every rendered frame is outlined and cached. */
(function (P) {
  const G = P.G, C = P.C, U = P.U;

  /* ---------------- colour presets ---------------- */
  const SKIN = {
    pale: ['#ffe8d6', '#f6d0b2', '#dba98a'],
    light: ['#ffe2c6', '#f3c39e', '#d39b76'],
    rosy: ['#ffe0cc', '#f4c2a6', '#d89a82'],
    tan: ['#f6c89c', '#dda272', '#b57a50'],
    olive: ['#ecbf90', '#c99466', '#a06e46'],
    brown: ['#bf8258', '#9c623e', '#76452a'],
    dark: ['#9e6646', '#7c4b31', '#5a3421'],
    deep: ['#7e4e34', '#603a25', '#442718'],
  };
  const HAIR = {
    brown: ['#a8743f', '#79512b', '#523419'],
    dkbrown: ['#7d5534', '#54361f', '#382313'],
    black: ['#4d4660', '#2c2638', '#19151f'],
    blonde: ['#fff0a8', '#f4cd64', '#cc9d3e'],
    gray: ['#ececf2', '#bcbcc8', '#8e8e9e'],
    white: ['#ffffff', '#ececf4', '#c0c0d0'],
    red: ['#f48e4c', '#cc5c2c', '#94401c'],
    auburn: ['#b4603c', '#8c4028', '#622a1a'],
    sandy: ['#ecd096', '#c9a26a', '#9c7848'],
    chestnut: ['#965e3a', '#6e4026', '#4c2a18'],
    salt: ['#c9c6cc', '#8f8a94', '#5e5a66'],
    platinum: ['#fffbe8', '#f2e6c0', '#cdbd92'],
  };
  P.SKIN = SKIN; P.HAIR = HAIR;
  const ramp = (c) => (Array.isArray(c) ? c : [U.shade(c, 0.28), c, U.shade(c, -0.3)]);

  /* ---------------- face masks (13x15, side view faces right) ---------------- */
  const FACE = {
    side: {
      avg: ['....#####....', '..########...', '.##########..', '.###########.', '############.', '############.', '############.', '############.', '#############', '.############', '.###########.', '..##########.', '..##########.', '....#######..', '......####...'],
      round: ['....#####....', '..#########..', '.###########.', '.############', '#############', '#############', '#############', '#############', '#############', '#############', '.############', '.###########.', '..##########.', '...########..', '.....#####...'],
      long: ['....#####....', '..########...', '.##########..', '.##########..', '###########..', '############.', '############.', '############.', '#############', '.############', '.###########.', '..##########.', '...#########.', '....########.', '.......####..'],
      soft: ['....#####....', '..########...', '.##########..', '.###########.', '############.', '############.', '############.', '############.', '#############', '.############', '.###########.', '..#########..', '...########..', '.....#####...', '.............'],
    },
    front: {
      avg: ['....#####....', '..#########..', '.###########.', '.###########.', '#############', '#############', '#############', '#############', '#############', '#############', '.###########.', '.###########.', '..#########..', '...#######...', '.....###.....'],
      round: ['....#####....', '..#########..', '.###########.', '#############', '#############', '#############', '#############', '#############', '#############', '#############', '#############', '.###########.', '..#########..', '...#######...', '.....###.....'],
      long: ['....#####....', '..#########..', '.###########.', '.###########.', '.###########.', '#############', '#############', '#############', '#############', '#############', '.###########.', '.###########.', '..#########..', '...#######...', '....#####....'],
      soft: ['....#####....', '..#########..', '.###########.', '.###########.', '#############', '#############', '#############', '#############', '#############', '.###########.', '.###########.', '..#########..', '...#######...', '.....###.....', '.............'],
    },
  };

  /* ---------------- hair masks (19x20 grid, origin = head(-3,-4)) ----------------
     H base, h highlight, D shadow (drawn over face)   B base, b highlight, K shadow (behind head) */
  const HM = {};
  HM.spiky = {
    side: [
      '...................',
      '........h..h....h..',
      '......hhH.hHh..hH..',
      '....hHHHHhHHHhhHH..',
      '...DHHHHHHHHHHHHHH.',
      '..DHHHHhHHHHhHHHHHh',
      '..DHHHHHHHHHHHHHHH.',
      '..DHHHHHHHHHHHHHHH.',
      '..DDHHHHHHHHHHDHH..',
      '..DDHHHHHH..D..HH..',
      '..DDHHHH...........',
      '..DDH...H..........',
      '..DDH...H..........',
      '...DD..............',
    ],
    front: [
      '.........h.........',
      '......h.hH..h......',
      '.....hHhHHhhHh.....',
      '....hHHHHHHHHHHh...',
      '...DHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHHHD.',
      '..DHHHHhHHHHhHHHHD.',
      '..DHHHHHHHHHHHHHHD.',
      '..DHHHH.HHH.HHHHHD.',
      '..DHH....H.....HHD.',
      '...H............H..',
    ],
  };
  HM.buzz = {
    side: [
      '...................', '...................', '...................',
      '.......HHHHH.......',
      '.....HhhhhhHHH.....',
      '....DHHHHHHHHHH....',
      '...DHHHHHHHHHHHH...',
      '...DHHHHHHHHHHHH...',
      '...DDHHHHHHHH......',
      '...DDHHHH..........',
      '...DDHH............',
      '...DD..............',
      '...DD..............',
      '....D..............',
    ],
    front: [
      '...................', '...................', '...................',
      '......HHHHHHH......',
      '....HHhhhhhhHHH....',
      '...DHHHHHHHHHHHD...',
      '...DHHHHHHHHHHHD...',
      '...DHHHHHHHHHHHD...',
      '...DHH.......HHD...',
      '...DH.........HD...',
      '...D...........D...',
    ],
  };
  HM.slick = {
    side: [
      '...................', '...................',
      '......HHHHHH.......',
      '....hHhhhhHHHH.....',
      '...DHHHHHHHHHHHH...',
      '..DHHhhhhHHHHHHH...',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHH....',
      '..DDHHHHHHHHH......',
      '..DDHHHHHH.........',
      '..DDDHH.H..........',
      '..DDD...H..........',
      '..DDD..............',
      '...DD..............',
    ],
    front: [
      '...................', '...................',
      '.......HHHHH.......',
      '.....HhhhhhhhH.....',
      '...DHHHHHHHHHHHD...',
      '..DHHhhhhhhhhhHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHH.HHHHHHD..',
      '..DHHH.......HHHD..',
      '..DHH.........HHD..',
      '...H...........H...',
    ],
  };
  HM.ponytail = {
    side: [
      '...................', '...................',
      '......hhhhh........',
      '....hHHHHHhhH......',
      '...HHHHHHHHHHHH....',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHHHH.',
      '.BDHHHHHHHHHHHHHHH.',
      'BBDHHHHHHHHHHHHHH..',
      'BBDDHHHHHHHHHH.....',
      'BbDDHHHHH.H........',
      'BBDDHH..H..........',
      'BB.DH..............',
      'BK.................',
      'BK.................',
      'KK.................',
      'K..................',
    ],
    front: [
      '...................', '...................',
      '......hhhhhh.......',
      '....hHHHHHHHHh.....',
      '...HHHHHHHHHHHHH...',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHH...HD..',
      '..DHHHHH.......HD..',
      '..DH...........HD..',
      '..D.............D..',
    ],
  };
  HM.bob = {
    side: [
      '...................', '...................',
      '......HHHHH........',
      '....HHHhhhHHH......',
      '...HHHHHHHHHHHH....',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHHHH.',
      '..DHHHHHHHHHHHHHHH.',
      '..DHHHHHHHHHHHHH...',
      '..DHHHHHHHHHH......',
      '..DHHHHHHHH........',
      '..DHHHHHHHH........',
      '..DDHHHHHHH........',
      '..DDHHHHHH.........',
      '..DDDHHHHH.........',
      '...DDDHH...........',
      '....DD.............',
    ],
    front: [
      '...................', '...................',
      '......HHHHHH.......',
      '....HHHhhhhHHH.....',
      '...HHHHHHHHHHHHH...',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHH....HD..',
      '..DHH..........HD..',
      '..DH............HD.',
      '..DH............HD.',
      '..DH............HD.',
      '..DD............DD.',
      '..DD............DD.',
      '...D............D..',
    ],
  };
  HM.gray = {
    side: [
      '...................', '...................', '...................',
      '......hhhh.........',
      '....hHHHHHHHH......',
      '...DHHHHHHHHHH.....',
      '..DHHHHHHHHHHH.....',
      '..DHHHHHHHHHH......',
      '..DDHHHHHH.........',
      '..DDHHHH...........',
      '..DDHH.H...........',
      '..DD...H...........',
      '..DD...............',
      '...D...............',
    ],
    front: [
      '...................', '...................', '...................',
      '......hhhhhh.......',
      '....hHHHHHHHHH.....',
      '...DHHHHHHHHHHHD...',
      '...DHHHH...HHHHD...',
      '...DHH.......HHD...',
      '...DH.........HD...',
      '...D...........D...',
    ],
  };
  HM.short = {
    side: [
      '...................', '...................',
      '.......hhhh........',
      '.....hHHHHHHh......',
      '...DHHHHHHHHHHH....',
      '..DHHHHHHHHHHHHH...',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHH...',
      '..DDHHHHHHHHHH.....',
      '..DDHHHHH..........',
      '..DDHHH.H..........',
      '..DDD...H..........',
      '..DD...............',
    ],
    front: [
      '...................', '...................',
      '.......hhhhh.......',
      '.....hHHHHHHHh.....',
      '...DHHHHHHHHHHHD...',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHHHHHHHHHD..',
      '..DHHHHHH..HHHHHD..',
      '..DHH.........HHD..',
      '..DH...........HD..',
    ],
  };
  HM.crew = {
    side: [
      '...................', '...................', '...................',
      '......HHHHHHH......',
      '....hhhhhhhhhh.....',
      '...DHHHHHHHHHHH....',
      '...DHHHHHHHHHHHH...',
      '...DHHHHHHHHHHH....',
      '...DDHHHHHHH.......',
      '...DDHHH...........',
      '...DDH.............',
      '...DD..............',
      '...D...............',
    ],
  };
  HM.balding = {
    side: [
      '...................', '...................', '...................',
      '.........h.........',
      '...................', '...................', '...................',
      '...DD..............',
      '...DDH.............',
      '..DDHH.............',
      '..DDHH.H...........',
      '..DDH..H...........',
      '..DDH..............',
      '...DD..............',
    ],
  };
  HM.surfer = {
    side: [
      '...................', '...................',
      '......hhHhh........',
      '....hHHHHHHHhh.....',
      '...DHHHHHHHHHHHh...',
      '..DHHHHHHHHHHHHHH..',
      '.DHHHHHHHHHHHHHHHH.',
      '.DHHHHHHHHHHHHHHHH.',
      '.DHHHHHHHHHHHHHHH..',
      '.DHHHHHHHHHHH.HH...',
      '.DDHHHHHH..H.......',
      '.DDHHHHHH..........',
      '.DDHHHHHH..........',
      '.DDDHHHHH..........',
      '..DDDHHH...........',
      '..DDDHH............',
      '...DDD.............',
      '....D..............',
    ],
  };
  HM.pompadour = {
    side: [
      '...................',
      '........hhhhh......',
      '......hHHHHHHhh....',
      '.....HHHHHHHHHHHh..',
      '...DHHHhhhHHHHHHHH.',
      '..DHHHHHHHHHHHHHHH.',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHH....',
      '..DDHHHHHHHH.......',
      '..DDHHHHH..........',
      '..DDHH.H...........',
      '..DD...H...........',
      '..DD...............',
    ],
  };
  HM.bun = {
    side: [
      '...................',
      '..BBB..............',
      '.BbBBB.............',
      '.BBBBBHHHHH........',
      '..BBHHHhhHHHHH.....',
      '..DHHHHHHHHHHHH....',
      '..DHHHHHHHHHHHHH...',
      '..DHHHHHHHHHHHH....',
      '..DDHHHHHHHHH......',
      '..DDHHHHH..........',
      '..DDHH.............',
      '..DD...............',
    ],
  };
  HM.long = {
    side: [
      '...................', '...................',
      '......hhhhh........',
      '....hHHHHHHHh......',
      '...HHHHHHHHHHHH....',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHHHH.',
      '.BDHHHHHHHHHHHHHHH.',
      '.BDHHHHHHHHHHHHH...',
      '.BDHHHHHHHHHH......',
      '.BDHHHHHH..........',
      '.BDHHHHH...........',
      '.BDDHHHH...........',
      '.BBDDHHH...........',
      '.BBKDDH............',
      '.BBK...............',
      '.BKK...............',
      '..K................',
    ],
  };
  HM.curly = {
    side: [
      '...................',
      '.......hHh.........',
      '.....hHHHHHhH......',
      '...hHHHHHHHHHHh....',
      '..DHHHhHHHHhHHHH...',
      '.DHHHHHHHHHHHHHHH..',
      '.DHHhHHHHHHHhHHHHH.',
      '.DHHHHHHHHHHHHHHHH.',
      '.DDHHHHHHHHHHHHH...',
      '.DDHHhHHHH.........',
      '.DDHHHHH...........',
      '..DDHHH............',
      '..DDDH.............',
      '...DD..............',
    ],
  };
  HM.beehive = {
    side: [
      '......hhhh.........',
      '....hHHHHHHh.......',
      '...HHHhHHHHHH......',
      '...HHHHHHHHHHH.....',
      '..DHHHHHHHHHHHH....',
      '..DHHHHhHHHHHHHH...',
      '..DHHHHHHHHHHHHHH..',
      '..DHHHHHHHHHHHHH...',
      '..DDHHHHHHHHH......',
      '..DDHHHHH..........',
      '..DDHH.............',
      '..DD...............',
    ],
  };
  HM.swoop = {
    side: [
      '...................', '...................',
      '.......hhhhh.......',
      '.....hHHHHHHhhh....',
      '...DHHHHHHHHHHHHh..',
      '..DHHHHHHHHHHHHHHH.',
      '..DHHHHHHHHHHHHHHHH',
      '..DHHHHHHHHHHH.HH..',
      '..DDHHHHHHHH.......',
      '..DDHHHH...........',
      '..DDHH.H...........',
      '..DD...H...........',
      '...D...............',
    ],
  };
  HM.mohawk = {
    side: [
      '...................',
      '.......hhhh........',
      '......hHHHHH.......',
      '.....HHHHHHHH......',
      '....DDHHHHHHHH.....',
      '...DD..HHHHH.......',
      '...D...............',
    ],
  };
  HM.afro = {
    side: [
      '....hhhhhhh........',
      '..hHHHHHHHHHh......',
      '.HHHHHHhHHHHHH.....',
      'DHHHHHHHHHHHHHHh...',
      'DHHHHHHHHHHHHHHHH..',
      'DHHHHHHHHHHHHHHHH..',
      'DHHHHHHHHHHHHHHH...',
      'DDHHHHHHHHHHHH.....',
      'DDHHHHHHHH.........',
      '.DDHHHHH...........',
      '.DDDHHH............',
      '..DDDH.............',
      '...DD..............',
    ],
  };
  HM.bald = { side: [] };
  HM.kidspiky = HM.spiky;
  P.HAIR_STYLES = HM;

  /* ---------------- builds ---------------- */
  const BUILD = {
    slim: { sw: 11, ww: 9, ar: 1.5, lr: 2.0, hip: 2 },
    avg: { sw: 12, ww: 10, ar: 1.6, lr: 2.2, hip: 2 },
    fem: { sw: 11, ww: 9, ar: 1.4, lr: 2.0, hip: 2 },
    big: { sw: 14, ww: 13, ar: 2.0, lr: 2.6, hip: 3 },
    huge: { sw: 16, ww: 15, ar: 2.3, lr: 2.9, hip: 3 },
    stout: { sw: 13, ww: 14, ar: 1.9, lr: 2.4, hip: 3 },
    kid: { sw: 9, ww: 8, ar: 1.3, lr: 1.7, hip: 2 },
  };

  /* ---------------- cast registry ---------------- */
  P.Cast = {};
  P.defineCast = function (id, def) {
    const d = Object.assign({
      name: id, short: id, h: 56, build: 'avg', skin: 'light', jaw: 'avg', eyes: '#3a2a24',
      hair: { style: 'short', color: 'brown' }, top: { type: 'tee', color: '#888' }, bottom: { type: 'pants', color: '#445' },
      shoes: '#3a2c2c', face: {}, acc: [], voice: { pitch: 1, wave: 'square' }, color: '#fff',
    }, def);
    d.id = id;
    d.skinR = SKIN[d.skin] || ramp(d.skin);
    d.hairR = HAIR[d.hair.color] || ramp(d.hair.color);
    d.browC = d.face.brow || d.hairR[2];
    d.kid = !!d.kid;
    P.Cast[id] = d;
    return d;
  };
  P.getCast = (id) => P.Cast[id] || (P.game && P.game.chapterCast && P.game.chapterCast[id]);

  /* ---------------- poses ----------------
     Angles in degrees; arm a = [shoulder, elbow] where 0 = hanging down, +ve swings forward (toward facing).
     Feet: fn/ff = [dx from body centre, lift]. */
  const BASE = { hipX: 0, crouch: 0, lean: 0, fn: [2, 0], ff: [-2, 0], an: [-6, 12], af: [8, 10], head: [0, 0], face: 'neutral', hand: null, hold: null, view: 'side' };
  P.pose = (o) => Object.assign({}, BASE, o);

  const Poses = P.Poses = {
    idle: (t) => P.pose({ an: [-5, 10 + Math.sin(t * 2) * 2], af: [7, 10], crouch: (Math.floor(t * 1.2) % 2) * 0 }),
    stand: () => P.pose({}),
    walk: (phase) => {
      const ph = phase % 1, A = 4;
      const foot = (p) => {
        p = ((p % 1) + 1) % 1;
        if (p < 0.5) return [A - (p / 0.5) * 2 * A, 0];
        const q = (p - 0.5) / 0.5;
        return [-A + q * 2 * A, Math.round(Math.sin(q * Math.PI) * 2)];
      };
      const sw = Math.sin(ph * Math.PI * 2);
      return P.pose({
        fn: foot(ph), ff: foot(ph + 0.5), crouch: Math.abs(Math.cos(ph * Math.PI * 2)) > 0.7 ? 0 : 1,
        an: [-sw * 16, 8 + Math.max(0, -sw) * 6], af: [sw * 16, 8 + Math.max(0, sw) * 6],
      });
    },
    talk: (t) => P.pose({ an: [30 + Math.sin(t * 5) * 12, 55 + Math.sin(t * 3) * 10], af: [8, 10], face: Math.floor(t * 8) % 2 ? 'talk' : 'neutral' }),
    point: () => P.pose({ an: [92, 0], af: [-10, 10], hand: 'point', fn: [4, 0], ff: [-3, 0], lean: 1 }),
    temple: () => P.pose({ an: [118, 92], af: [55, 30], hand: 'temple', face: 'closed', head: [0, 0] }),
    temple2: () => P.pose({ an: [118, 92], af: [118, 92], face: 'closed', crouch: 2, fn: [4, 0], ff: [-4, 0] }),
    armsUp: () => P.pose({ an: [168, 8], af: [190, -8], face: 'surprised', fn: [3, 0], ff: [-3, 0] }),
    crossed: () => P.pose({ an: [-6, 100], af: [-4, 96], fs: 0.6 }),
    sit: () => P.pose({ crouch: 10, fn: [10, 0], ff: [8, 0], an: [50, 50], af: [55, 45] }),
    sitIdle: (t) => P.pose({ crouch: 10, fn: [10, 0], ff: [8, 0], an: [50 + Math.sin(t * 2) * 4, 50], af: [55, 45] }),
    sitDrink: (t) => P.pose({ crouch: 10, fn: [10, 0], ff: [8, 0], an: [Math.floor(t) % 3 === 0 ? 140 : 60, 110], af: [55, 45], hold: 'cup' }),
    hips: () => P.pose({ an: [-28, 70], af: [-24, 70] }),
    shrug: () => P.pose({ an: [30, 90], af: [40, 95], head: [0, 1] }),
    phone: () => P.pose({ an: [150, 125], af: [6, 10], hold: 'phone' }),
    think: () => P.pose({ an: [40, 110], af: [20, -90], face: 'neutral' }),
    eat: (t) => P.pose({ an: [Math.floor(t * 4) % 2 ? 110 : 90, 70], af: [10, 40], face: Math.floor(t * 4) % 2 ? 'talk' : 'happy' }),
    sneak: (phase) => { const w = Poses.walk(phase); w.crouch += 4; w.lean = 3; w.an = [60, 40]; w.af = [70, 40]; return w; },
    // ---- psychic gyrations ----
    reel: () => P.pose({ lean: -4, hipX: 1, an: [150, 30], af: [120, 40], face: 'surprised', fn: [5, 0], ff: [-4, 0], head: [-1, 0] }),
    crouchVision: () => P.pose({ crouch: 9, an: [125, 95], af: [70, 40], face: 'closed', fn: [6, 0], ff: [-6, 0], lean: 2 }),
    tiptoe: () => P.pose({ crouch: -2, an: [178, 0], af: [100, 20], hand: 'point', face: 'closed', fn: [1, 2], ff: [-1, 2] }),
    lunge: () => P.pose({ crouch: 5, lean: 4, fn: [9, 0], ff: [-8, 0], an: [96, -6], af: [-40, 20], hand: 'point', face: 'surprised' }),
    stagger: () => P.pose({ lean: 4, hipX: -2, an: [80, 60], af: [140, 20], fn: [3, 0], ff: [-6, 1], face: 'closed', head: [1, 1] }),
    kneel: () => P.pose({ crouch: 12, fn: [7, 0], ff: [-7, 0], an: [130, 80], af: [140, 70], face: 'closed', lean: 1 }),
    wave1: () => P.pose({ an: [150, 40], af: [200, -40], face: 'closed', fn: [3, 0], ff: [-3, 0] }),
    wave2: () => P.pose({ an: [200, -40], af: [150, 40], face: 'closed', fn: [3, 0], ff: [-3, 0], hipX: 1 }),
    wave: (t) => (Math.floor(t * 5) % 2 ? Poses.wave1() : Poses.wave2()),
    conduct: (t) => (Math.floor(t * 4) % 2 ? Poses.conduct1() : Poses.conduct2()),
    conduct1: () => P.pose({ an: [120, 60], af: [100, -60], face: 'closed' }),
    conduct2: () => P.pose({ an: [80, 100], af: [140, 20], face: 'closed', crouch: 1 }),
    horse: (t) => P.pose({ an: [70, 50], af: [80, 50], crouch: Math.floor(t * 8) % 2 ? 3 : 0, fn: [3, Math.floor(t * 8) % 2 ? 2 : 0], ff: [-3, Math.floor(t * 8) % 2 ? 0 : 2], face: 'happy' }),
    hipsSway: (t) => P.pose({ hipX: Math.round(Math.sin(t * 10) * 2), an: [-28, 70], af: [-24, 70], face: 'closed' }),
    flail: (t) => P.pose({ an: [120 + Math.sin(t * 14) * 50, 30], af: [140 + Math.cos(t * 13) * 50, 20], face: 'surprised', crouch: Math.floor(t * 10) % 2 }),
    jazz: (t) => P.pose({ an: [70, 90], af: [75, 90], hand: 'jazz', face: 'happy', crouch: Math.floor(t * 6) % 2 }),
    // front-view poses
    frontIdle: () => P.pose({ view: 'front', an: [4, 0], af: [4, 0], fn: [3, 0], ff: [-3, 0] }),
    frontArmsUp: () => P.pose({ view: 'front', an: [160, 10], af: [160, 10], fn: [4, 0], ff: [-4, 0], face: 'closed' }),
    frontTemples: () => P.pose({ view: 'front', an: [140, 100], af: [140, 100], fn: [4, 0], ff: [-4, 0], face: 'closed' }),
    frontStar: () => P.pose({ view: 'front', an: [120, 0], af: [120, 0], fn: [7, 0], ff: [-7, 0], face: 'surprised' }),
    frontSquat: () => P.pose({ view: 'front', an: [80, 70], af: [80, 70], fn: [7, 0], ff: [-7, 0], crouch: 7, face: 'closed' }),
    back: () => P.pose({ view: 'back', an: [10, 0], af: [10, 0], fn: [3, 0], ff: [-3, 0] }),
    backArms: () => P.pose({ view: 'back', an: [130, 40], af: [130, 40], fn: [4, 0], ff: [-4, 0] }),
  };

  /* ---------------- renderer ---------------- */
  const D2R = Math.PI / 180;
  const OUT = '#1d1526';

  function drawHead(x, d, hx, hy, view, face, flipFront) {
    const jaw = FACE[view === 'side' ? 'side' : 'front'][d.jaw] || FACE[view === 'side' ? 'side' : 'front'].avg;
    const [sh, sb, ss] = d.skinR;
    const [hh, hb, hs] = d.hairR;
    const style = HM[d.hair.style] || HM.short;
    let mask = view === 'side' ? style.side : (style.front || null);
    const hairKey = { H: hb, h: hh, D: hs };
    const behindKey = { B: hb, b: hh, K: hs };
    const useView = view === 'side' || mask ? view : 'side';
    if (!mask) mask = style.side;
    // behind-head hair
    if (view !== 'back') G.map(x, hx - 3, hy - 4, mask, behindKey);
    // skin
    const fm = useView === 'side' ? FACE.side[d.jaw] || FACE.side.avg : jaw;
    G.map(x, hx, hy, fm, { '#': sb });
    if (view === 'back') {
      // whole head covered in hair except the nape + ears
      const key = { '#': hb };
      G.map(x, hx, hy, fm.slice(0, 12), key);
      for (let r = 0; r < 12; r++) { G.px(x, hx + 1, hy + r, hs); G.px(x, hx + 11, hy + r, hs); }
      G.px(x, hx, hy + 8, sb); G.px(x, hx + 12, hy + 8, sb); G.px(x, hx, hy + 9, ss); G.px(x, hx + 12, hy + 9, ss);
      G.map(x, hx - 3, hy - 4, mask, Object.assign({}, hairKey));
      return;
    }
    const f = d.face;
    if (useView === 'side') {
      // shading: jaw underside + back of cheek
      G.hl(x, hx + 5, hy + 13, 6, ss); G.px(x, hx + 4, hy + 12, ss);
      G.px(x, hx + 11, hy + 10, ss); // nose shadow
      // ear
      G.px(x, hx + 3, hy + 7, ss); G.px(x, hx + 4, hy + 7, sb); G.px(x, hx + 3, hy + 8, ss); G.px(x, hx + 4, hy + 8, ss); G.px(x, hx + 3, hy + 9, ss);
      // stubble / facial hair
      if (f.stubble) { for (let yy = 11; yy <= 13; yy++) for (let xx = 6; xx <= 11; xx++) if (((xx + yy) & 1) === 0 && fm[yy] && fm[yy][xx] === '#' && !(yy === 11 && xx >= 9)) G.px(x, hx + xx, hy + yy, U.mix(sb, d.hairR[2], 0.3)); }
      if (f.goatee) { const gc = HAIR[f.goatee] ? HAIR[f.goatee][1] : f.goatee; G.hl(x, hx + 8, hy + 12, 3, gc); G.hl(x, hx + 8, hy + 13, 3, gc); G.px(x, hx + 11, hy + 11, gc); G.px(x, hx + 8, hy + 11, gc); }
      if (f.mustache) { const mc = HAIR[f.mustache] ? HAIR[f.mustache][1] : f.mustache; G.hl(x, hx + 9, hy + 10, 3, mc); }
      if (f.beard) { const bc = HAIR[f.beard] ? HAIR[f.beard][1] : f.beard; for (let yy = 9; yy <= 14; yy++) for (let xx = 4; xx <= 12; xx++) if (fm[yy] && fm[yy][xx] === '#' && !(yy === 11 && (xx === 9 || xx === 10))) G.px(x, hx + xx, hy + yy, yy > 12 ? U.shade(bc, -0.15) : bc); }
      if (f.blush) { G.px(x, hx + 8, hy + 10, f.blush); }
      // eyes
      const eyeY = hy + 7;
      const ec = d.eyes;
      if (face === 'blink' || face === 'closed') {
        G.hl(x, hx + 7, eyeY + 1, 2, OUT); G.px(x, hx + 11, eyeY + 1, OUT);
      } else if (face === 'surprised') {
        G.px(x, hx + 8, eyeY - 1, '#fff'); G.px(x, hx + 8, eyeY, OUT); G.px(x, hx + 8, eyeY + 1, OUT);
        G.px(x, hx + 11, eyeY, OUT); G.px(x, hx + 11, eyeY + 1, OUT);
      } else if (face === 'happy') {
        G.px(x, hx + 7, eyeY + 1, OUT); G.px(x, hx + 8, eyeY, OUT); G.px(x, hx + 9, eyeY + 1, OUT); G.px(x, hx + 11, eyeY, OUT);
      } else {
        G.px(x, hx + 7, eyeY, '#f4f0f0'); G.px(x, hx + 8, eyeY, OUT); G.px(x, hx + 8, eyeY + 1, ec);
        G.px(x, hx + 11, eyeY, OUT); G.px(x, hx + 11, eyeY + 1, ec);
      }
      if (f.lashes && face !== 'closed' && face !== 'blink') { G.px(x, hx + 9, eyeY - 1, OUT); }
      // brows
      const bc = d.browC;
      if (face === 'angry') { G.px(x, hx + 7, eyeY - 2, bc); G.px(x, hx + 8, eyeY - 1, bc); G.px(x, hx + 9, eyeY - 1, bc); G.px(x, hx + 11, eyeY - 1, bc); }
      else if (face === 'surprised') { G.hl(x, hx + 7, eyeY - 3, 3, bc); G.px(x, hx + 11, eyeY - 3, bc); }
      else if (face === 'sad') { G.px(x, hx + 7, eyeY - 1, bc); G.px(x, hx + 8, eyeY - 2, bc); G.px(x, hx + 11, eyeY - 2, bc); }
      else { G.hl(x, hx + 7, eyeY - 2, 3, bc); G.px(x, hx + 11, eyeY - 2, bc); }
      // nose tip highlight
      G.px(x, hx + 12, hy + 8, sh);
      // mouth
      const mc = f.lips || '#8a3a3a';
      const my = hy + 11;
      if (face === 'talk' || face === 'surprised') { G.px(x, hx + 9, my, '#3a1418'); G.px(x, hx + 10, my, '#3a1418'); G.px(x, hx + 9, my + 1, '#3a1418'); G.px(x, hx + 10, my + 1, '#7a2a30'); }
      else if (face === 'happy' || face === 'smug') { G.px(x, hx + 8, my - 1, mc); G.hl(x, hx + 9, my, 2, mc); G.px(x, hx + 11, my - 1, mc); }
      else if (face === 'angry' || face === 'sad') { G.hl(x, hx + 9, my, 2, mc); G.px(x, hx + 8, my + 1, mc); }
      else G.hl(x, hx + 9, my, 2, mc);
      // glasses
      if (f.glasses) {
        const gc = f.glasses === 'sun' ? '#14101c' : (f.glassesColor || '#2a2234');
        if (f.glasses === 'sun') { G.hl(x, hx + 6, eyeY, 4, gc); G.hl(x, hx + 7, eyeY + 1, 2, gc); G.hl(x, hx + 10, eyeY, 3, gc); G.px(x, hx + 11, eyeY + 1, gc); G.px(x, hx + 7, eyeY, '#6a8ab0'); }
        else { G.frame(x, hx + 6, eyeY - 1, 4, 3, gc); G.px(x, hx + 10, eyeY, gc); G.frame(x, hx + 11, eyeY - 1, 2, 3, gc); G.hl(x, hx + 3, eyeY, 3, gc); }
      }
      if (f.earring) G.px(x, hx + 4, hy + 10, f.earring);
    } else {
      // FRONT view
      G.hl(x, hx + 3, hy + 13, 7, ss);
      G.px(x, hx, hy + 8, ss); G.px(x, hx + 12, hy + 8, ss); G.px(x, hx, hy + 9, ss); G.px(x, hx + 12, hy + 9, ss);
      G.px(x, hx + 6, hy + 9, ss);
      if (f.stubble) { for (let yy = 11; yy <= 13; yy++) for (let xx = 2; xx <= 10; xx++) if (((xx + yy) & 1) === 0 && fm[yy][xx] === '#' && !(yy === 11 && xx >= 4 && xx <= 8)) G.px(x, hx + xx, hy + yy, U.mix(sb, d.hairR[2], 0.3)); }
      if (f.goatee) { const gc = HAIR[f.goatee] ? HAIR[f.goatee][1] : f.goatee; G.hl(x, hx + 4, hy + 12, 5, gc); G.hl(x, hx + 5, hy + 13, 3, gc); G.px(x, hx + 4, hy + 11, gc); G.px(x, hx + 8, hy + 11, gc); }
      if (f.mustache) { const mc = HAIR[f.mustache] ? HAIR[f.mustache][1] : f.mustache; G.hl(x, hx + 4, hy + 10, 5, mc); }
      if (f.beard) { const bc = HAIR[f.beard] ? HAIR[f.beard][1] : f.beard; for (let yy = 9; yy <= 14; yy++) for (let xx = 1; xx <= 11; xx++) if (fm[yy] && fm[yy][xx] === '#' && !(yy === 11 && xx >= 5 && xx <= 7)) G.px(x, hx + xx, hy + yy, bc); }
      const eyeY = hy + 7, ec = d.eyes;
      if (face === 'blink' || face === 'closed') { G.hl(x, hx + 3, eyeY + 1, 2, OUT); G.hl(x, hx + 8, eyeY + 1, 2, OUT); }
      else if (face === 'happy') { G.px(x, hx + 3, eyeY + 1, OUT); G.px(x, hx + 4, eyeY, OUT); G.px(x, hx + 8, eyeY, OUT); G.px(x, hx + 9, eyeY + 1, OUT); }
      else {
        G.px(x, hx + 3, eyeY, '#f4f0f0'); G.px(x, hx + 4, eyeY, OUT); G.px(x, hx + 4, eyeY + 1, ec);
        G.px(x, hx + 9, eyeY, '#f4f0f0'); G.px(x, hx + 8, eyeY, OUT); G.px(x, hx + 8, eyeY + 1, ec);
        if (face === 'surprised') { G.px(x, hx + 3, eyeY + 1, '#f4f0f0'); G.px(x, hx + 9, eyeY + 1, '#f4f0f0'); }
      }
      const bc = d.browC;
      if (face === 'angry') { G.px(x, hx + 3, eyeY - 2, bc); G.px(x, hx + 4, eyeY - 1, bc); G.px(x, hx + 8, eyeY - 1, bc); G.px(x, hx + 9, eyeY - 2, bc); }
      else if (face === 'surprised') { G.hl(x, hx + 3, eyeY - 3, 2, bc); G.hl(x, hx + 8, eyeY - 3, 2, bc); }
      else { G.hl(x, hx + 3, eyeY - 2, 2, bc); G.hl(x, hx + 8, eyeY - 2, 2, bc); }
      const mc = f.lips || '#8a3a3a', my = hy + 11;
      if (face === 'talk' || face === 'surprised') { G.hl(x, hx + 5, my, 3, '#3a1418'); G.hl(x, hx + 5, my + 1, 3, '#7a2a30'); }
      else if (face === 'happy' || face === 'smug') { G.px(x, hx + 4, my - 1, mc); G.hl(x, hx + 5, my, 3, mc); G.px(x, hx + 8, my - 1, mc); }
      else G.hl(x, hx + 5, my, 3, mc);
      if (f.glasses) {
        const gc = f.glasses === 'sun' ? '#14101c' : (f.glassesColor || '#2a2234');
        if (f.glasses === 'sun') { G.hl(x, hx + 2, eyeY, 9, gc); G.hl(x, hx + 2, eyeY + 1, 3, gc); G.hl(x, hx + 8, eyeY + 1, 3, gc); }
        else { G.frame(x, hx + 2, eyeY - 1, 4, 3, gc); G.frame(x, hx + 7, eyeY - 1, 4, 3, gc); G.px(x, hx + 6, eyeY, gc); }
      }
    }
    // front hair
    G.map(x, hx - 3, hy - 4, mask, hairKey, flipFront);
  }

  function hatOver(x, d, hx, hy, view) {
    for (const a of d.acc) {
      const t = typeof a === 'string' ? a : a.type;
      const col = (typeof a === 'object' && a.color) || null;
      if (t === 'cap') {
        const c = col || '#c83030';
        if (view === 'side') {
          if (a.backwards) { G.rect(x, hx - 1, hy - 1, 12, 4, c); G.rect(x, hx - 4, hy + 2, 4, 2, U.shade(c, -0.3)); }
          else { G.rect(x, hx, hy - 1, 12, 4, c); G.rect(x, hx + 10, hy + 2, 5, 2, U.shade(c, -0.3)); }
          G.hl(x, hx + 2, hy - 1, 7, U.shade(c, 0.3));
        } else { G.rect(x, hx, hy - 1, 13, 4, c); G.rect(x, hx + 2, hy + 3, 9, 1, U.shade(c, -0.3)); }
      } else if (t === 'chefhat') {
        G.rect(x, hx + 1, hy - 7, 11, 8, '#ffffff'); G.ellipse(x, hx + 4, hy - 7, 3, 2, '#ffffff'); G.ellipse(x, hx + 9, hy - 7, 3, 2, '#ffffff'); G.hl(x, hx + 1, hy, 11, '#d8d8e8');
      } else if (t === 'cowboy') {
        const c = col || '#9a6034';
        G.rect(x, hx - 3, hy + 1, 19, 2, c); G.rect(x, hx + 1, hy - 4, 11, 5, c); G.hl(x, hx + 1, hy, 11, U.shade(c, -0.4)); G.hl(x, hx + 2, hy - 4, 9, U.shade(c, 0.25));
      } else if (t === 'fedora') {
        const c = col || '#4a4a5a';
        G.rect(x, hx - 2, hy + 1, 17, 2, c); G.rect(x, hx + 1, hy - 3, 11, 4, c); G.hl(x, hx + 1, hy, 11, '#2a2030');
      } else if (t === 'turban') {
        const c = col || '#7a2a8a';
        G.ellipse(x, hx + 6, hy - 1, 8, 5, c); G.hl(x, hx + 1, hy, 11, U.shade(c, -0.3)); G.px(x, hx + 6, hy - 2, '#5ad0ff'); G.px(x, hx + 6, hy - 3, '#fee761');
      } else if (t === 'bucket') {
        const c = col || '#7a8a5a';
        G.rect(x, hx - 1, hy + 2, 15, 2, U.shade(c, -0.2)); G.rect(x, hx + 1, hy - 2, 11, 5, c);
      } else if (t === 'flower') {
        G.px(x, hx + (view === 'side' ? 2 : 10), hy + 3, '#ff6aa0'); G.px(x, hx + (view === 'side' ? 1 : 11), hy + 3, '#ff9ac0'); G.px(x, hx + (view === 'side' ? 2 : 10), hy + 2, '#ff9ac0'); G.px(x, hx + (view === 'side' ? 3 : 9), hy + 3, '#ff9ac0'); G.px(x, hx + (view === 'side' ? 2 : 10), hy + 4, '#ff9ac0');
      } else if (t === 'shadeshead') {
        G.hl(x, hx + 6, hy + 1, 6, '#14101c'); G.px(x, hx + 8, hy + 1, '#6a8ab0');
      } else if (t === 'headband') {
        G.hl(x, hx, hy + 3, 13, col || '#e43b44');
      } else if (t === 'beanie') {
        const c = col || '#3a6a8a';
        G.ellipse(x, hx + 6, hy + 1, 7, 4, c); G.rect(x, hx - 1, hy + 2, 14, 2, U.shade(c, -0.25));
      } else if (t === 'tiara') {
        G.hl(x, hx + 3, hy + 1, 7, '#fee761'); G.px(x, hx + 6, hy, '#5ad0ff');
      }
    }
  }

  function drawLimb(x, a, b, r, col, edge) {
    if (edge) G.capsule(x, a[0], a[1], b[0], b[1], r + 0.9, edge);
    G.capsule(x, a[0], a[1], b[0], b[1], r, col);
  }

  function legIK(hip, ankle, L1, L2, dir) {
    let dx = ankle[0] - hip[0], dy = ankle[1] - hip[1];
    let dist = Math.hypot(dx, dy);
    const maxD = L1 + L2 - 0.01;
    if (dist > maxD) { dx *= maxD / dist; dy *= maxD / dist; dist = maxD; }
    const a = Math.acos(U.clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
    const base = Math.atan2(dy, dx);
    const ang = base - a * dir;
    return [hip[0] + Math.cos(ang) * L1, hip[1] + Math.sin(ang) * L1];
  }

  function renderFrame(d, pose) {
    const kid = d.kid;
    const H = d.h;
    const B = BUILD[d.build] || BUILD.avg;
    const cw = 64, chh = H + 36;
    const cv = G.canvas(cw, chh);
    const x = cv.x;
    const gx = 32, gy = chh - 4;
    const view = pose.view || 'side';
    const headH = 15;
    const torsoH = kid ? Math.round(H * 0.24) : Math.round(H * 0.3);
    const legLen = H - headH - 2 - torsoH + 1;
    const L = legLen - 2; const L1 = Math.ceil(L / 2), L2 = L - L1;
    const UA = kid ? 6 : 9, FA = kid ? 5 : 8;
    const hipX = gx + pose.hipX, hipY = gy - legLen + Math.max(-2, pose.crouch);
    const nx = hipX + pose.lean, ny = hipY - torsoH;
    const top = d.top, bot = d.bottom;
    const topR = ramp(top.color), botR = ramp(bot.color);
    const sleeveC = top.sleeve || (top.type === 'tee' || top.type === 'tank' ? null : top.color);
    const skin = d.skinR;
    const shoeC = d.shoes;
    const longCoat = top.type === 'labcoat' || top.type === 'trench';
    const dress = top.type === 'dress' || top.type === 'muumuu';

    const legCol = (near) => {
      const c = bot.type === 'skin' ? skin[1] : botR[1];
      return near ? c : U.shade(c, -0.22);
    };
    const drawLeg = (near, foot, hipOff) => {
      const hip = [hipX + hipOff, hipY];
      const ank = [gx + foot[0] + (view === 'side' ? 0 : 0), gy - 2 - foot[1]];
      const dir = view === 'side' ? -1 : (hipOff < 0 ? 1 : -1);
      const knee = legIK(hip, ank, L1, L2, view === 'side' ? 1 : dir);
      const lc = legCol(near), skinC = near ? skin[1] : skin[2];
      const edge = near && view === 'side' ? U.shade(lc, -0.45) : null;
      if (bot.type === 'shorts' || bot.type === 'boardshorts') {
        drawLimb(x, hip, knee, B.lr, lc, edge);
        const mid = [U.lerp(knee[0], ank[0], 0.25), U.lerp(knee[1], ank[1], 0.25)];
        drawLimb(x, knee, ank, B.lr - 0.5, skinC, null);
        drawLimb(x, hip, mid, B.lr + 0.2, lc, null);
      } else if (bot.type === 'skirt' || dress) {
        drawLimb(x, hip, knee, B.lr - 0.3, skinC, null);
        drawLimb(x, knee, ank, B.lr - 0.6, d.tights || skinC, null);
      } else {
        drawLimb(x, hip, knee, B.lr, lc, edge);
        drawLimb(x, knee, ank, B.lr - 0.25, lc, edge);
      }
      // shoe
      const sc = near ? shoeC : U.shade(shoeC, -0.25);
      const ax = Math.round(ank[0]), ay = Math.round(ank[1]);
      if (view === 'side') { G.rect(x, ax - 2, ay, 6, 2, sc); G.hl(x, ax - 2, ay + 2, 6, U.shade(sc, -0.45)); G.px(x, ax + 3, ay, U.shade(sc, 0.25)); }
      else { G.rect(x, ax - 2, ay, 5, 2, sc); G.hl(x, ax - 2, ay + 2, 5, U.shade(sc, -0.45)); }
      return knee;
    };

    const shoulderY = ny + 2;
    const drawArm = (near, ang, sx) => {
      const a1 = ang[0] * D2R, a2 = (ang[0] + ang[1]) * D2R;
      let dirX = 1;
      if (view !== 'side') dirX = sx < nx ? -1 : 1;
      const s = [sx, shoulderY];
      const e = [s[0] + Math.sin(a1) * UA * dirX, s[1] + Math.cos(a1) * UA];
      const fa = FA * (pose.fs || 1);
      const w = [e[0] + Math.sin(a2) * fa * dirX, e[1] + Math.cos(a2) * fa];
      const sc = sleeveC ? (near ? topR[1] : topR[2]) : (near ? skin[1] : skin[2]);
      const shortSleeve = top.type === 'tee' || top.type === 'hawaiian' || top.type === 'polo' || top.sleeves === 'short';
      const sleeveless = top.type === 'tank' || top.sleeves === 'none' || top.type === 'wetsuitDown';
      const upperC = sleeveless ? (near ? skin[1] : skin[2]) : near ? topR[1] : topR[2];
      const foreC = shortSleeve || sleeveless ? (near ? skin[1] : skin[2]) : (top.cuff && near ? top.cuff : sc);
      const edge = near ? U.shade(upperC, -0.5) : null;
      drawLimb(x, s, e, B.ar + 0.2, upperC, edge);
      drawLimb(x, e, w, B.ar, foreC, near ? U.shade(foreC, -0.5) : null);
      if (shortSleeve && !sleeveless) {
        const m = [U.lerp(s[0], e[0], 0.7), U.lerp(s[1], e[1], 0.7)];
        drawLimb(x, s, m, B.ar + 0.5, upperC, null);
      }
      // hand
      const hc = near ? skin[1] : skin[2];
      const hpx = w[0] + Math.sin(a2) * 1.2 * dirX, hpy = w[1] + Math.cos(a2) * 1.2;
      G.circle(x, Math.round(hpx), Math.round(hpy), kid ? 1 : 1.4, hc);
      if (near && pose.hand === 'point') {
        G.line(x, hpx, hpy, hpx + Math.sin(a2) * 4 * dirX, hpy + Math.cos(a2) * 4, hc, 1);
      }
      if (near && pose.hand === 'jazz') { G.px(x, hpx - 2, hpy - 2, hc); G.px(x, hpx + 2, hpy - 2, hc); G.px(x, hpx, hpy - 3, hc); }
      if (near && pose.hold) holdProp(x, pose.hold, Math.round(hpx), Math.round(hpy), view);
      return w;
    };

    const shN = view === 'side' ? nx - 3 : nx - Math.floor(B.sw / 2) + 1;
    const shF = view === 'side' ? nx + 2 : nx + Math.floor(B.sw / 2) - 1;
    const hipN = view === 'side' ? -1 : -B.hip;
    const hipF = view === 'side' ? 1 : B.hip;

    // ---------- draw order ----------
    if (view === 'side') drawArm(false, pose.af, shF);
    if (view === 'side') drawLeg(false, pose.ff, hipF); else { drawLeg(true, [-Math.abs(pose.fn[0]) , pose.fn[1]], hipN); }
    if (view === 'side') drawLeg(true, pose.fn, hipN); else { drawLeg(true, [Math.abs(pose.ff[0]), pose.ff[1]], hipF); }
    if (view === 'back') { drawArm(true, pose.an, shN); drawArm(true, pose.af, shF); }

    // hips / seat
    const ww = B.ww, sw = B.sw;
    if (!dress && bot.type !== 'skirt') G.rect(x, hipX - Math.floor(ww / 2), hipY - 2, ww, 4, botR[1]);
    // skirt / dress lower
    if (bot.type === 'skirt' || dress) {
      const sc = dress ? topR : botR;
      const len = top.type === 'muumuu' ? legLen - 3 : Math.round(legLen * 0.55);
      const flare = top.type === 'muumuu' ? 4 : 3;
      G.poly(x, [[hipX - ww / 2, hipY - 2], [hipX + ww / 2 + 0.5, hipY - 2], [hipX + ww / 2 + flare, hipY + len], [hipX - ww / 2 - flare, hipY + len]], sc[1]);
      G.hl(x, hipX - ww / 2 - flare + 1, hipY + len - 1, ww + flare * 2 - 1, sc[2]);
      if (top.pattern === 'flowers' || bot.pattern === 'flowers') flowerPattern(x, hipX - ww / 2 - 2, hipY, ww + 4, len, top.pattern2 || '#ff8ab0', d.id + 'sk');
    }
    // torso
    const lean = pose.lean;
    let torso;
    if (view === 'side') torso = [[nx - sw / 2 + 1, ny], [nx + sw / 2 - 2, ny], [nx + sw / 2, ny + 3], [hipX + ww / 2 + 0.5, hipY + 1], [hipX - ww / 2, hipY + 1], [nx - sw / 2, ny + 2]];
    else torso = [[nx - sw / 2 + 1, ny], [nx + sw / 2, ny], [nx + sw / 2 + 1, ny + 2], [hipX + ww / 2 + 1, hipY + 1], [hipX - ww / 2, hipY + 1], [nx - sw / 2, ny + 2]];
    G.poly(x, torso, topR[1]);
    // long coats hang over the legs
    if (longCoat) {
      const len = Math.round(legLen * 0.62);
      G.poly(x, [[hipX - ww / 2, hipY], [hipX + ww / 2 + 1, hipY], [hipX + ww / 2 + 2, hipY + len], [hipX - ww / 2 - 1, hipY + len]], topR[1]);
      G.hl(x, hipX - ww / 2 - 1, hipY + len - 1, ww + 3, topR[2]);
      if (view !== 'back') G.vl(x, Math.round(hipX + (view === 'side' ? 2 : 0)), hipY, len, topR[2]);
    }
    torsoDetail(x, d, view, nx, ny, hipX, hipY, sw, ww, topR, botR, torsoH);
    // neck
    G.rect(x, nx - 1 + (view === 'side' ? 1 : 0), ny - 2, 4, 3, skin[2]);
    // head
    const hx = Math.round(nx - 6 + pose.head[0] + (view === 'side' ? 1 : 0));
    const hy = Math.round(ny - headH - 1 + pose.head[1]);
    if (view !== 'side' && view !== 'back' && d.hair.style === 'ponytail') {
      // ponytail visible behind head in front view
      G.rect(x, hx + 10, hy + 4, 3, 10, d.hairR[2]);
    }
    if (view === 'side' && pose.hand === 'temple') { /* hand drawn after head */ }
    drawHead(x, d, hx, hy, view, pose.face || 'neutral', false);
    hatOver(x, d, hx, hy, view);
    // near arm last (in front)
    if (view === 'side') drawArm(true, pose.an, shN);
    if (view === 'front') { drawArm(true, pose.an, shN); drawArm(true, pose.af, shF); }

    const out = G.outline(cv, OUT);
    out.ax = gx; out.ay = gy; // anchor (feet)
    out.headY = hy;
    return out;
  }

  function flowerPattern(x, X, Y, W, H, col, seed) {
    const r = U.rng(seed);
    const n = Math.round((W * H) / 12);
    for (let i = 0; i < n; i++) { const px = X + Math.floor(r() * W), py = Y + Math.floor(r() * H); G.px(x, px, py, col); }
  }

  function torsoDetail(x, d, view, nx, ny, hipX, hipY, sw, ww, topR, botR, torsoH) {
    const top = d.top;
    const side = view === 'side';
    const back = view === 'back';
    const fx = side ? Math.round(nx + 2) : Math.round(nx); // "front centre line" x
    // back-side shading strip
    if (side) { G.vl(x, Math.round(nx - sw / 2 + 1), ny + 2, torsoH - 2, topR[2]); G.vl(x, Math.round(nx - sw / 2 + 2), ny + 3, torsoH - 4, topR[2]); }
    else { G.vl(x, Math.round(nx + sw / 2 - 1), ny + 2, torsoH - 2, topR[2]); }
    // belt line
    const belt = top.tucked !== false && ['shirt', 'suit', 'uniform', 'blazer', 'polo', 'overshirt', 'vest', 'tux'].includes(top.type);
    if (belt && !top.noBelt) {
      G.hl(x, Math.round(hipX - ww / 2), hipY - 1, ww + 1, d.belt || '#2a2028');
      if (!back) G.px(x, fx, hipY - 1, '#d8c070');
    }
    if (back) return;
    switch (top.type) {
      case 'overshirt': { // open shirt over a tee (Shawn)
        const inner = top.inner || '#ddd';
        G.rect(x, fx - 1, ny + 1, 3, torsoH - 2, inner);
        G.vl(x, fx - 2, ny + 1, torsoH - 1, U.shade(topR[1], -0.35));
        G.vl(x, fx + 2, ny + 2, torsoH - 2, U.shade(topR[1], -0.2));
        if (top.graphic) { G.px(x, fx, ny + 5, top.graphic); G.px(x, fx, ny + 6, top.graphic); G.px(x, fx + 1, ny + 6, top.graphic); }
        G.px(x, fx - 1, ny, U.shade(topR[1], 0.3)); G.px(x, fx + 2, ny, U.shade(topR[1], 0.3));
        break;
      }
      case 'shirt': case 'polo': {
        G.px(x, fx - 1, ny, U.shade(topR[1], 0.35)); G.px(x, fx + 1, ny, U.shade(topR[1], 0.35));
        for (let yy = ny + 3; yy < hipY - 2; yy += 3) G.px(x, fx, yy, U.shade(topR[1], -0.3));
        if (top.tie) { G.vl(x, fx, ny + 1, Math.min(torsoH - 4, 11), top.tie); G.px(x, fx, ny, U.shade(top.tie, 0.3)); G.px(x, fx - 1, ny + 2, top.tie); }
        if (top.pocket) G.rect(x, fx + (side ? 1 : 2), ny + 4, 2, 2, U.shade(topR[1], -0.15));
        break;
      }
      case 'suit': case 'blazer': case 'tux': {
        const shirt = top.shirt || '#f2f2f4';
        G.poly(x, [[fx - 2, ny], [fx + 2, ny], [fx + 1, ny + 7], [fx - 1, ny + 7]], shirt);
        if (top.tie) { G.vl(x, fx, ny + 1, 9, top.tie); G.px(x, fx, ny, top.tie); }
        if (top.type === 'tux') { G.hl(x, fx - 1, ny + 1, 3, '#1a1420'); }
        G.line(x, fx - 2, ny, fx - 1, ny + 7, U.shade(topR[1], -0.35));
        G.line(x, fx + 2, ny, fx + 1, ny + 7, U.shade(topR[1], 0.2));
        G.vl(x, fx, ny + 8, torsoH - 9, U.shade(topR[1], -0.35));
        if (top.type !== 'blazer') G.px(x, fx + 1, ny + 10, U.shade(topR[1], -0.4));
        if (top.pocketSquare) G.px(x, fx - 3, ny + 4, top.pocketSquare);
        break;
      }
      case 'hawaiian': {
        flowerPattern(x, nx - sw / 2 + 1, ny + 1, sw - 1, torsoH - 1, top.pattern || '#ffb050', d.id + 'h1');
        flowerPattern(x, nx - sw / 2 + 2, ny + 1, sw - 2, torsoH - 1, top.pattern2 || '#fff4c0', d.id + 'h2');
        G.px(x, fx - 1, ny, U.shade(topR[1], 0.4)); G.px(x, fx + 1, ny, U.shade(topR[1], 0.4)); G.vl(x, fx, ny + 1, torsoH - 2, U.shade(topR[1], -0.25));
        break;
      }
      case 'uniform': {
        G.px(x, fx - 1, ny, U.shade(topR[1], 0.35)); G.px(x, fx + 1, ny, U.shade(topR[1], 0.35));
        G.vl(x, fx, ny + 2, torsoH - 4, U.shade(topR[1], -0.3));
        G.rect(x, fx + (side ? 1 : 2), ny + 3, 2, 2, '#f2c84a'); G.px(x, fx + (side ? 1 : 2), ny + 3, '#fff2a0');
        G.rect(x, fx - (side ? 4 : 3), ny + 3, 2, 1, U.shade(topR[1], 0.25));
        break;
      }
      case 'labcoat': case 'trench': {
        G.vl(x, fx, ny + 1, torsoH, U.shade(topR[1], -0.2));
        G.poly(x, [[fx - 2, ny], [fx + 2, ny], [fx + 1, ny + 5], [fx - 1, ny + 5]], top.inner || '#7a9ad0');
        if (top.tie) G.vl(x, fx, ny + 1, 4, top.tie);
        G.rect(x, fx + 2, ny + 4, 2, 1, U.shade(topR[1], -0.25));
        break;
      }
      case 'tank': case 'tee': case 'hoodie': case 'sweater': case 'wetsuit': case 'wetsuitDown': {
        G.hl(x, fx - 1, ny, 3, U.shade(topR[1], -0.25));
        if (top.stripe) { G.hl(x, nx - sw / 2 + 1, ny + 5, sw - 1, top.stripe); }
        if (top.graphic) { G.rect(x, fx - 1, ny + 4, 3, 3, top.graphic); }
        if (top.type === 'hoodie') { G.rect(x, fx - 2, ny + torsoH - 6, 5, 3, U.shade(topR[1], -0.15)); G.px(x, fx - 1, ny + 1, '#ddd'); G.px(x, fx + 1, ny + 1, '#ddd'); }
        if (top.type === 'sweater' && top.collar) { G.px(x, fx - 1, ny, top.collar); G.px(x, fx + 1, ny, top.collar); }
        if (top.type === 'wetsuit') { G.vl(x, Math.round(nx - sw / 2 + 2), ny + 1, torsoH - 2, top.stripe || '#2ce8f5'); }
        break;
      }
      case 'dress': case 'muumuu': {
        if (top.pattern === 'flowers') flowerPattern(x, nx - sw / 2 + 1, ny + 1, sw - 1, torsoH - 1, top.pattern2 || '#ff8ab0', d.id + 'd');
        G.hl(x, fx - 1, ny, 3, U.shade(topR[1], -0.3));
        if (top.sash) G.hl(x, Math.round(hipX - ww / 2), hipY - 2, ww + 1, top.sash);
        break;
      }
      case 'vest': {
        const shirt = top.shirt || '#f2f2f4';
        G.rect(x, fx - 1, ny, 3, torsoH - 1, shirt);
        if (top.tie) G.vl(x, fx, ny + 1, 8, top.tie);
        G.px(x, fx + 2, ny + 6, '#d8c070'); G.px(x, fx + 2, ny + 9, '#d8c070');
        break;
      }
      case 'apron': {
        const shirt = top.shirt || '#f2f2f4';
        G.hl(x, fx - 1, ny, 3, shirt);
        break;
      }
      default: break;
    }
    // apron / overlays
    if (top.apron) {
      const ac = top.apron;
      G.rect(x, fx - 3, ny + 5, 7, torsoH - 4, ac);
      G.rect(x, fx - 4, hipY - 1, 9, 9, ac);
      G.hl(x, fx - 4, hipY + 8, 9, U.shade(ac, -0.3));
      G.line(x, fx - 2, ny, fx - 2, ny + 5, U.shade(ac, -0.2));
      if (top.apronText) G.px(x, fx, hipY + 2, top.apronText);
    }
    // accessories on the body
    for (const a of d.acc) {
      const t = typeof a === 'string' ? a : a.type;
      if (t === 'badge') { G.rect(x, fx + (side ? 2 : 2), hipY - 2, 2, 2, '#f2c84a'); G.px(x, fx + 2, hipY - 2, '#fff2a0'); }
      else if (t === 'holster') { if (side) { G.rect(x, Math.round(hipX - ww / 2), hipY - 1, 3, 4, '#2a2028'); } }
      else if (t === 'lei') { for (let i = -3; i <= 3; i++) G.px(x, fx + i, ny + 2 + (Math.abs(i) < 2 ? 1 : 0), ['#ff6aa0', '#fee761', '#ff9a50'][(i + 3) % 3]); }
      else if (t === 'chain') { G.hl(x, fx - 1, ny + 2, 3, '#fee761'); G.px(x, fx, ny + 3, '#fee761'); }
      else if (t === 'tooth') { G.hl(x, fx - 1, ny + 1, 3, '#3a2a1a'); G.px(x, fx, ny + 2, '#fff8e0'); G.px(x, fx, ny + 3, '#fff8e0'); }
      else if (t === 'pearls') { G.hl(x, fx - 2, ny + 1, 5, '#fff8f0'); G.px(x, fx, ny + 2, '#fff8f0'); }
      else if (t === 'sapphire') { G.hl(x, fx - 2, ny + 1, 5, '#fee761'); G.px(x, fx - 1, ny + 2, '#fee761'); G.px(x, fx + 1, ny + 2, '#fee761'); G.rect(x, fx - 1, ny + 3, 3, 2, '#2a5ad8'); G.px(x, fx, ny + 3, '#9ac8ff'); }
      else if (t === 'watch') { G.line(x, fx - 2, hipY - 6, fx + 2, hipY - 4, '#fee761'); G.px(x, fx + 2, hipY - 3, '#fee761'); }
      else if (t === 'bowtie') { G.px(x, fx - 1, ny, a.color || '#c03040'); G.px(x, fx + 1, ny, a.color || '#c03040'); G.px(x, fx, ny, U.shade(a.color || '#c03040', -0.3)); }
      else if (t === 'whistle') { G.line(x, fx - 1, ny + 1, fx + 1, ny + 5, '#e43b44'); G.px(x, fx + 1, ny + 6, '#c0cbdc'); }
      else if (t === 'scarf') { const c = a.color || '#c040a0'; G.hl(x, fx - 2, ny, 5, c); G.vl(x, fx + 1, ny + 1, 6, c); }
      else if (t === 'camera') { G.line(x, fx - 2, ny, fx + 1, ny + 6, '#2a2028'); G.rect(x, fx, ny + 6, 4, 3, '#2a2a34'); G.px(x, fx + 2, ny + 7, '#6ab0ff'); }
      else if (t === 'bag') { G.line(x, fx + 2, ny, fx - 3, hipY - 2, '#5a3a2a'); G.rect(x, Math.round(hipX - ww / 2 - 2), hipY - 3, 4, 5, '#7a4e32'); }
      else if (t === 'sash') { G.line(x, fx - 3, ny + 1, fx + 3, hipY - 2, a.color || '#e43b44', 2); }
      else if (t === 'clipboard') { /* held */ }
      else if (t === 'stethoscope') { G.line(x, fx - 2, ny, fx - 2, ny + 6, '#3a3a4a'); G.line(x, fx + 2, ny, fx + 2, ny + 6, '#3a3a4a'); G.px(x, fx, ny + 7, '#c0cbdc'); }
    }
  }

  function holdProp(x, what, hx, hy, view) {
    switch (what) {
      case 'phone': G.rect(x, hx - 1, hy - 3, 2, 4, '#2a2a34'); G.px(x, hx - 1, hy - 3, '#6ab0ff'); break;
      case 'notepad': G.rect(x, hx, hy - 3, 4, 5, '#f4ecd6'); G.hl(x, hx, hy - 3, 4, '#c03040'); break;
      case 'cup': G.rect(x, hx - 1, hy - 3, 3, 4, '#f4f4f4'); G.hl(x, hx - 1, hy - 3, 3, '#7a4a2a'); break;
      case 'shaveice': G.rect(x, hx - 1, hy - 1, 3, 3, '#f4f4f4'); G.ellipse(x, hx, hy - 3, 2, 2, '#ff5a7a'); G.px(x, hx + 1, hy - 4, '#5ad0ff'); G.px(x, hx - 1, hy - 3, '#fee761'); break;
      case 'chip': G.rect(x, hx - 1, hy - 3, 3, 2, '#e43b44'); G.px(x, hx, hy - 3, '#fff'); break;
      case 'magnifier': G.circle(x, hx + 2, hy - 3, 2, '#2a2a34'); G.px(x, hx + 2, hy - 3, '#bfe8ff'); G.line(x, hx, hy, hx + 1, hy - 1, '#7a4e32'); break;
      case 'rib': G.rect(x, hx - 2, hy - 2, 5, 2, '#8a3a1a'); G.px(x, hx + 3, hy - 2, '#f4ecd6'); break;
      case 'candle': G.rect(x, hx - 1, hy - 5, 2, 5, '#f4ecd6'); G.px(x, hx - 1, hy - 7, '#fee761'); G.px(x, hx - 1, hy - 6, '#f77622'); break;
      case 'clipboard': G.rect(x, hx - 1, hy - 4, 4, 6, '#b86f50'); G.rect(x, hx, hy - 3, 2, 4, '#f4ecd6'); break;
      case 'flashlight': G.rect(x, hx - 1, hy - 1, 4, 2, '#3a3a4a'); G.px(x, hx + 3, hy - 1, '#fee761'); break;
      case 'donut': G.circle(x, hx, hy - 2, 2, '#e4a672'); G.px(x, hx, hy - 2, '#ff8ab0'); break;
      default: break;
    }
  }

  /* ---------------- public: cached sprite fetch ---------------- */
  const cache = new Map();
  let cacheSize = 0;
  const q = (v) => (Array.isArray(v) ? v.map((n) => Math.round(n / 3) * 3).join(',') : v);
  P.Sprite = {
    key(id, pose) {
      return [id, pose.view, pose.hipX | 0, pose.crouch | 0, pose.lean | 0, q(pose.fn), q(pose.ff), q(pose.an), q(pose.af), pose.head.join(','), pose.face, pose.hand, pose.hold, pose.fs || 1].join('|');
    },
    get(id, pose) {
      const d = P.getCast(id);
      if (!d) return null;
      const k = P.Sprite.key(id, pose);
      let s = cache.get(k);
      if (!s) {
        const qp = Object.assign({}, pose, {
          fn: pose.fn.map((n) => Math.round(n)), ff: pose.ff.map((n) => Math.round(n)),
          an: pose.an.map((n) => Math.round(n / 3) * 3), af: pose.af.map((n) => Math.round(n / 3) * 3),
        });
        s = renderFrame(d, qp);
        cache.set(k, s);
        if (++cacheSize > 2500) { cache.clear(); cacheSize = 0; }
      }
      return s;
    },
    // draw a character with feet at (x,y). flip=true faces left.
    draw(ctx, id, X, Y, pose, flip, opts = {}) {
      let s = P.Sprite.get(id, pose);
      if (!s) return;
      if (flip) {
        const fk = 'F' + P.Sprite.key(id, pose);
        let f = cache.get(fk);
        if (!f) { f = G.flip(s); f.ax = s.width - s.ax; f.ay = s.ay; f.headY = s.headY; cache.set(fk, f); cacheSize++; }
        s = f;
      }
      const dx = Math.round(X - s.ax), dy = Math.round(Y - s.ay);
      if (opts.silhouette) { ctx.drawImage(G.silhouette(s, opts.silhouette), dx, dy); return s; }
      if (opts.alpha != null) { ctx.save(); ctx.globalAlpha = opts.alpha; ctx.drawImage(s, dx, dy); ctx.restore(); }
      else ctx.drawImage(s, dx, dy);
      return s;
    },
    clear() { cache.clear(); cacheSize = 0; },
  };
})(window.P);
