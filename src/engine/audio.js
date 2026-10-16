'use strict';
/* Chiptune synth: pulse/triangle/noise voices, a tiny step sequencer, and synthesized SFX.
   All music is original. Songs are written as 16th-note token strings:
   'C5' = note on, '-' = hold, '.' = rest. Drum tokens: k kick, s snare, h hat, o open hat, c crash. */
(function (P) {
  const U = P.U;
  const A = P.audio = {
    ctx: null, ready: false, settings: P.store.get('psych16_audio', { music: 0.55, sfx: 0.75, muted: false }),
    current: null, songs: {},
  };
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const midi = (n) => {
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(n);
    if (!m) return null;
    return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  };
  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);
  A.midi = midi;

  let waves = {}, noiseBuf = null;
  function pulseWave(ctx, duty) {
    const N = 48, real = new Float32Array(N), imag = new Float32Array(N);
    for (let n = 1; n < N; n++) { real[n] = Math.sin(2 * Math.PI * n * duty) / (n * Math.PI); imag[n] = (1 - Math.cos(2 * Math.PI * n * duty)) / (n * Math.PI); }
    return ctx.createPeriodicWave(real, imag);
  }

  A.unlock = function () {
    if (A.ready) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = A.ctx = new AC();
      A.master = ctx.createGain(); A.master.connect(ctx.destination);
      A.musicGain = ctx.createGain(); A.musicGain.connect(A.master);
      A.sfxGain = ctx.createGain(); A.sfxGain.connect(A.master);
      // gentle echo on the music bus for that SNES reverb feel
      const delay = ctx.createDelay(); delay.delayTime.value = 0.21;
      const fb = ctx.createGain(); fb.gain.value = 0.22;
      const wet = ctx.createGain(); wet.gain.value = 0.18;
      A.echoIn = ctx.createGain();
      A.echoIn.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(A.musicGain);
      waves = { p12: pulseWave(ctx, 0.125), p25: pulseWave(ctx, 0.25), p50: pulseWave(ctx, 0.5) };
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      A.ready = true;
      A.applyVolume();
      if (A.pending) { const p = A.pending; A.pending = null; A.music(p); }
      setInterval(tick, 25);
    } catch (e) { console.warn('audio unavailable', e); }
  };
  A.applyVolume = function () {
    if (!A.ready) return;
    const s = A.settings;
    A.musicGain.gain.value = s.muted ? 0 : s.music * 0.6;
    A.sfxGain.gain.value = s.muted ? 0 : s.sfx * 0.7;
    P.store.set('psych16_audio', s);
  };
  A.toggleMute = function () { A.settings.muted = !A.settings.muted; A.applyVolume(); return A.settings.muted; };

  /* ---------- voices ---------- */
  const INST = {
    lead: { wave: 'p25', a: 0.005, d: 0.12, s: 0.6, r: 0.06, vib: 5, vibDepth: 0.004, vol: 0.16 },
    lead50: { wave: 'p50', a: 0.01, d: 0.2, s: 0.5, r: 0.1, vib: 5, vibDepth: 0.005, vol: 0.12 },
    soft: { wave: 'p50', a: 0.04, d: 0.3, s: 0.45, r: 0.2, vib: 4, vibDepth: 0.006, vol: 0.1 },
    arp: { wave: 'p12', a: 0.002, d: 0.06, s: 0.3, r: 0.03, vol: 0.06 },
    pad: { wave: 'p50', a: 0.15, d: 0.4, s: 0.6, r: 0.4, vol: 0.05 },
    bass: { wave: 'triangle', a: 0.004, d: 0.1, s: 0.8, r: 0.04, vol: 0.32 },
    pbass: { wave: 'p50', a: 0.004, d: 0.1, s: 0.5, r: 0.04, vol: 0.09 },
    tri: { wave: 'triangle', a: 0.02, d: 0.2, s: 0.7, r: 0.15, vib: 5, vibDepth: 0.006, vol: 0.25 },
    bell: { wave: 'sine', a: 0.002, d: 0.5, s: 0.0, r: 0.2, vol: 0.14 },
  };
  function playNote(inst, m, t, dur, out, volMul = 1) {
    const ctx = A.ctx;
    const I = INST[inst] || INST.lead;
    const o = ctx.createOscillator();
    if (waves[I.wave]) o.setPeriodicWave(waves[I.wave]); else o.type = I.wave;
    o.frequency.setValueAtTime(freq(m), t);
    const g = ctx.createGain();
    const v = I.vol * volMul;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + I.a);
    g.gain.linearRampToValueAtTime(v * I.s + 0.0001, t + I.a + I.d);
    const end = t + Math.max(dur, I.a + 0.01);
    g.gain.setValueAtTime(v * I.s + 0.0001, end);
    g.gain.exponentialRampToValueAtTime(0.0001, end + I.r);
    if (I.vib) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = I.vib; lg.gain.value = freq(m) * I.vibDepth;
      l.connect(lg); lg.connect(o.frequency); l.start(t + 0.12); l.stop(end + I.r + 0.05);
    }
    o.connect(g); g.connect(out);
    if (out === A.musicGain && A.echoIn && (inst === 'lead' || inst === 'lead50' || inst === 'soft' || inst === 'arp' || inst === 'bell' || inst === 'tri')) g.connect(A.echoIn);
    o.start(t); o.stop(end + I.r + 0.05);
  }
  function drum(type, t, out, vol = 1) {
    const ctx = A.ctx;
    if (type === 'k') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.5 * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.2);
      return;
    }
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); const g = ctx.createGain();
    let len = 0.05, v = 0.15;
    if (type === 's') { f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7; len = 0.13; v = 0.32; }
    else if (type === 'h') { f.type = 'highpass'; f.frequency.value = 7000; len = 0.03; v = 0.09; }
    else if (type === 'o') { f.type = 'highpass'; f.frequency.value = 6000; len = 0.16; v = 0.08; }
    else if (type === 'c') { f.type = 'highpass'; f.frequency.value = 3500; len = 0.9; v = 0.13; }
    else if (type === 't') { f.type = 'lowpass'; f.frequency.value = 900; len = 0.12; v = 0.25; }
    g.gain.setValueAtTime(v * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    src.connect(f); f.connect(g); g.connect(out);
    src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02);
    if (type === 's') { const o = ctx.createOscillator(), g2 = ctx.createGain(); o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.06); g2.gain.setValueAtTime(0.12 * vol, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08); o.connect(g2); g2.connect(out); o.start(t); o.stop(t + 0.1); }
  }

  /* ---------- song builder ---------- */
  const CHORD = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], dim: [0, 3, 6], sus4: [0, 5, 7], aug: [0, 4, 8], 6: [0, 4, 7, 9], m6: [0, 3, 7, 9], 5: [0, 7] };
  function parseChord(c) {
    const m = /^([A-G][#b]?)(.*)$/.exec(c);
    return { root: midi(m[1] + '2'), iv: CHORD[m[2]] || CHORD[''] };
  }
  const BASS = {
    pump: 'R . R . R . R . R . R . R . R .',
    root: 'R - - - . . R - R - - - . . F -',
    surf: 'R . R R . R . R F . F F . F . O',
    walk: 'R - . . 3 - . . F - . . 6 - . .',
    funk: 'R . . R . . O . R . R . F . O .',
    country: 'R - . . F - . . R - . . F - . .',
    long: 'R - - - - - - - - - - - - - - -',
    drive: 'R R . R R . R R F F . F O . F .',
    half: 'R - - - - - - - F - - - - - - -',
  };
  function tokens(str) { return str.replace(/\|/g, ' ').trim().split(/\s+/); }
  function build(def) {
    const ch = [];
    const bars = def.chords ? def.chords.length : 0;
    if (def.chords && def.bass !== false) {
      const pat = tokens(BASS[def.bassStyle || 'root']);
      const t = [];
      for (const c of def.chords) {
        const { root, iv } = parseChord(c);
        for (const p of pat) {
          if (p === '-' || p === '.') { t.push(p); continue; }
          const off = p === 'R' ? 0 : p === 'F' ? 7 : p === 'O' ? 12 : p === '3' ? iv[1] : p === '6' ? (iv[3] || 9) : 0;
          t.push(root + off + (def.bassOct || 0) * 12);
        }
      }
      ch.push({ inst: def.bassInst || 'bass', t, vol: def.bassVol || 1 });
    }
    if (def.chords && def.arp) {
      const t = [];
      for (const c of def.chords) {
        const { root, iv } = parseChord(c);
        const notes = iv.map((i) => root + 24 + (def.arpOct || 0) * 12 + i);
        const seq = def.arp === 'updown' ? notes.concat(notes.slice(1, -1).reverse()) : notes;
        for (let i = 0; i < 16; i++) {
          if (def.arpRate === 2 && i % 2) { t.push('.'); continue; }
          t.push(seq[(def.arpRate === 2 ? i / 2 : i) % seq.length]);
        }
      }
      ch.push({ inst: def.arpInst || 'arp', t, vol: def.arpVol || 1 });
    }
    if (def.chords && def.pad) {
      const t = [];
      for (const c of def.chords) {
        const { root, iv } = parseChord(c);
        t.push({ chord: iv.slice(0, 3).map((i) => root + 36 + i) });
        for (let i = 1; i < 16; i++) t.push('-');
      }
      ch.push({ inst: 'pad', t, vol: 1 });
    }
    for (const L of def.leads || []) ch.push({ inst: L.inst || 'lead', t: tokens(L.notes).map((n) => (n === '-' || n === '.' ? n : midi(n))), vol: L.vol || 1 });
    if (def.drums) {
      const d = tokens(def.drums);
      const t = [];
      const reps = Math.max(1, bars);
      for (let i = 0; i < reps * 16; i++) t.push(d[i % d.length]);
      if (def.crash !== false) t[0] = 'c' + (t[0] === '.' ? '' : t[0]);
      ch.push({ drums: true, t, vol: def.drumVol || 1 });
    }
    return { bpm: def.bpm, ch, loop: def.loop !== false };
  }
  A.define = (name, def) => { A.songs[name] = build(def); };

  /* ---------- sequencer ---------- */
  let seq = null;
  function tick() {
    if (!A.ready || !seq) return;
    const ctx = A.ctx;
    const stepDur = 60 / seq.song.bpm / 4;
    while (seq.next < ctx.currentTime + 0.15) {
      const t = seq.next;
      let anyLeft = false;
      for (const c of seq.song.ch) {
        const len = c.t.length;
        if (!seq.song.loop && seq.step >= len) continue;
        anyLeft = true;
        const tok = c.t[seq.step % len];
        if (tok === '-' || tok === '.' || tok == null) continue;
        if (c.drums) { for (const ch of String(tok)) if (ch !== '.') drum(ch, t, seq.out, c.vol); continue; }
        let n = 1; while (n < len && c.t[(seq.step + n) % len] === '-') n++;
        if (typeof tok === 'object' && tok.chord) { for (const m of tok.chord) playNote(c.inst, m, t, n * stepDur * 0.95, seq.out, c.vol); }
        else playNote(c.inst, tok, t, n * stepDur * 0.92, seq.out, c.vol);
      }
      if (!anyLeft) { seq = null; return; }
      seq.step++;
      seq.next += stepDur;
    }
  }
  A.music = function (name) {
    if (!name) { A.stopMusic(); return; }
    if (A.current === name && seq) return;
    A.current = name;
    if (!A.ready) { A.pending = name; return; }
    const song = A.songs[name];
    if (!song) return;
    if (seq) fadeOut(seq.out);
    const out = A.ctx.createGain(); out.gain.value = 1; out.connect(A.musicGain);
    seq = { song, step: 0, next: A.ctx.currentTime + 0.08, out };
  };
  function fadeOut(g) { try { g.gain.setTargetAtTime(0, A.ctx.currentTime, 0.12); setTimeout(() => g.disconnect(), 1200); } catch (e) { /* ignore */ } }
  A.stopMusic = function () { A.current = null; if (seq && A.ready) fadeOut(seq.out); seq = null; };
  A.duck = function (on) { if (!A.ready || !seq) return; seq.out.gain.setTargetAtTime(on ? 0.35 : 1, A.ctx.currentTime, 0.1); };

  /* ---------- SFX ---------- */
  function tone(type, f0, f1, dur, vol, t0 = 0, wave) {
    const ctx = A.ctx, t = ctx.currentTime + t0;
    const o = ctx.createOscillator(), g = ctx.createGain();
    if (wave && waves[wave]) o.setPeriodicWave(waves[wave]); else o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(A.sfxGain); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, ftype, f0, f1, t0 = 0, q = 1) {
    const ctx = A.ctx, t = ctx.currentTime + t0;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.setValueAtTime(f0, t); f.Q.value = q;
    if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(A.sfxGain); s.start(t); s.stop(t + dur + 0.05);
  }
  const N = (n) => freq(midi(n));
  const SFX = {
    select: () => tone('square', 880, 880, 0.04, 0.05, 0, 'p25'),
    confirm: () => { tone('square', 660, 660, 0.05, 0.06, 0, 'p25'); tone('square', 990, 990, 0.08, 0.06, 0.05, 'p25'); },
    cancel: () => { tone('square', 500, 500, 0.05, 0.05, 0, 'p25'); tone('square', 330, 330, 0.08, 0.05, 0.05, 'p25'); },
    clue: () => ['C6', 'E6', 'G6', 'C7', 'E7'].forEach((n, i) => tone('square', N(n), N(n), 0.12, 0.06, i * 0.055, 'p12')),
    item: () => ['G5', 'B5', 'D6', 'G6'].forEach((n, i) => tone('square', N(n), N(n), 0.1, 0.06, i * 0.06, 'p25')),
    whoosh: () => { noise(0.4, 0.22, 'bandpass', 300, 4000, 0, 2); tone('sine', 300, 1200, 0.35, 0.05); },
    zoom: () => { noise(0.3, 0.2, 'bandpass', 500, 5000, 0, 3); tone('square', N('E6'), N('E6'), 0.15, 0.05, 0.28, 'p12'); tone('square', N('B6'), N('B6'), 0.25, 0.05, 0.36, 'p12'); },
    wrong: () => { tone('square', 140, 90, 0.35, 0.1, 0, 'p50'); tone('square', 147, 95, 0.35, 0.06, 0, 'p25'); },
    correct: () => { tone('square', N('A5'), N('A5'), 0.1, 0.07, 0, 'p25'); tone('square', N('E6'), N('E6'), 0.25, 0.07, 0.09, 'p25'); },
    phone: () => { for (let i = 0; i < 2; i++) { for (let k = 0; k < 6; k++) tone('square', k % 2 ? 480 : 620, k % 2 ? 480 : 620, 0.05, 0.05, i * 0.6 + k * 0.05, 'p50'); } },
    pickup: () => { tone('square', 300, 300, 0.04, 0.05, 0, 'p50'); noise(0.08, 0.08, 'lowpass', 2000, 800); },
    door: () => { noise(0.18, 0.25, 'lowpass', 600, 120); tone('triangle', 120, 60, 0.15, 0.2); },
    step: () => noise(0.03, 0.04, 'lowpass', 1500, 600),
    car: () => { tone('sawtooth', 50, 90, 0.6, 0.06); tone('sawtooth', 52, 95, 0.6, 0.05, 0.05); noise(0.6, 0.06, 'lowpass', 400, 900); },
    heart: () => ['E6', 'G#6', 'B6', 'E7'].forEach((n, i) => tone('sine', N(n), N(n), 0.35, 0.08, i * 0.08)),
    munch: () => { for (let i = 0; i < 3; i++) noise(0.07, 0.18, 'bandpass', 1200 + i * 200, 600, i * 0.13, 1.5); },
    gulp: () => tone('sine', 400, 120, 0.2, 0.12),
    psychic: () => { const ctx = A.ctx, t = ctx.currentTime; const o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(500, t); o.frequency.linearRampToValueAtTime(900, t + 0.9); l.frequency.value = 9; lg.gain.value = 60; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.1, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0); o.connect(g); g.connect(A.sfxGain); o.start(t); l.start(t); o.stop(t + 1.05); l.stop(t + 1.05); },
    spirit: () => { tone('sine', N('A6') * (1 + Math.random() * 0.1), N('E6'), 0.3, 0.05); tone('square', N('E5'), N('A5'), 0.18, 0.03, 0.03, 'p12'); noise(0.25, 0.05, 'highpass', 5000, 9000); },
    reveal: () => { ['D5', 'F#5', 'A5', 'D6'].forEach((n, i) => tone('square', N(n), N(n), 0.12, 0.07, i * 0.07, 'p25')); tone('square', N('D6'), N('D6'), 0.6, 0.06, 0.3, 'p50'); noise(0.8, 0.08, 'highpass', 4000, 3000, 0.3); },
    thunder: () => { noise(1.6, 0.4, 'lowpass', 300, 60); noise(0.3, 0.2, 'highpass', 2000, 800); },
    caught: () => { tone('square', 880, 880, 0.1, 0.07, 0, 'p50'); tone('square', 1320, 1320, 0.2, 0.07, 0.1, 'p50'); },
    boing: () => tone('square', 200, 600, 0.18, 0.06, 0, 'p25'),
    stamp: () => { noise(0.2, 0.35, 'lowpass', 900, 150); tone('triangle', 90, 50, 0.2, 0.3); },
    flash: () => { tone('sine', 1500, 3000, 0.15, 0.06); noise(0.15, 0.06, 'highpass', 6000, 9000); },
    type: () => tone('square', 1200 + Math.random() * 200, 1200, 0.02, 0.025, 0, 'p12'),
    gasp: () => { noise(0.25, 0.08, 'bandpass', 1500, 2500, 0, 3); },
    sparkle: () => ['E7', 'B6', 'G#7'].forEach((n, i) => tone('sine', N(n), N(n), 0.12, 0.04, i * 0.05)),
    drumroll: () => { for (let i = 0; i < 16; i++) noise(0.05, 0.08 + i * 0.006, 'bandpass', 1800, 1800, i * 0.045, 0.7); },
    hit: () => { noise(0.12, 0.3, 'lowpass', 1200, 200); tone('square', 160, 60, 0.12, 0.12, 0, 'p50'); },
    dial: () => { for (let i = 0; i < 7; i++) tone('sine', 700 + (i % 3) * 120, 700 + (i % 3) * 120, 0.06, 0.04, i * 0.09); },
    page: () => noise(0.12, 0.08, 'highpass', 2500, 4000),
  };
  A.sfx = function (name) {
    if (!A.ready || A.settings.muted) return;
    try { (SFX[name] || SFX.select)(); } catch (e) { /* ignore */ }
  };
  // dialogue blip; pitch from the speaker's voice
  let lastBlip = 0;
  A.blip = function (voice) {
    if (!A.ready || A.settings.muted) return;
    const now = A.ctx.currentTime;
    if (now - lastBlip < 0.045) return;
    lastBlip = now;
    const p = (voice && voice.pitch) || 1;
    const f = 300 * p * (0.94 + Math.random() * 0.12);
    tone('square', f, f * 0.9, 0.035, 0.035, 0, voice && voice.wave === 'tri' ? null : 'p25');
  };

  /* ---------- the soundtrack (original compositions) ---------- */
  A.define('title', {
    bpm: 132, chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'B7'], bassStyle: 'funk', drums: 'k . h . s . h k . k h . s . h .',
    arp: 'up', arpInst: 'arp', arpVol: 0.7,
    leads: [{ inst: 'lead', notes:
      'E5 - . E5 . G5 . A5 - . G5 . E5 - D5 - | E5 - - - . . . . C5 - D5 - E5 - G5 - | D5 - . D5 . B4 . D5 - . E5 . D5 - B4 - | A4 - - - . . . . F#4 - A4 - D5 - F#5 - |' +
      'E5 - . E5 . G5 . A5 - . B5 . A5 - G5 - | E5 - - - G5 - E5 - C5 - - - E5 - G5 - | F#5 - - - A5 - F#5 - D5 - - - F#5 - A5 - | B5 - - - A5 - - - F#5 - - - D#5 - - -' }],
  });
  A.define('office', {
    bpm: 100, chords: ['Cmaj7', 'Am7', 'Dm7', 'G7', 'Cmaj7', 'Am7', 'Dm7', 'G7'], bassStyle: 'walk', drums: 'k . h . s . h . k . h k s . h .', arp: 'up', arpRate: 2, arpVol: 0.6,
    leads: [{ inst: 'lead50', notes:
      'E5 - - G5 - - B5 - A5 - G5 - E5 - - - | C5 - - E5 - - G5 - E5 - - - . . . . | F5 - - A5 - - C6 - B5 - A5 - F5 - - - | D5 - - - G5 - F5 - D5 - B4 - . . . . |' +
      'E5 - G5 - B5 - D6 - C6 - B5 - G5 - - - | A5 - - - G5 - E5 - C5 - - - . . . . | F5 - A5 - C6 - A5 - F5 - D5 - F5 - - - | G5 - - - F5 - D5 - B4 - G4 - . . . .' }],
  });
  A.define('beach', {
    bpm: 150, chords: ['A', 'A', 'D', 'D', 'E', 'D', 'A', 'E'], bassStyle: 'surf', drums: 'k . h k s . h . k k h . s . h h',
    leads: [{ inst: 'lead', notes:
      'E5 E5 E5 E5 C#5 C#5 E5 E5 A5 - - - G#5 - E5 - | F#5 F#5 F#5 F#5 E5 E5 C#5 C#5 E5 - - - . . . . | F#5 F#5 F#5 F#5 A5 A5 F#5 F#5 D6 - - - C#6 - A5 - | B5 B5 B5 B5 A5 A5 F#5 F#5 A5 - - - . . . . |' +
      'G#5 G#5 G#5 G#5 B5 B5 G#5 G#5 E5 - - - G#5 - B5 - | A5 A5 A5 A5 F#5 F#5 D5 D5 F#5 - - - A5 - - - | C#6 - - - B5 - A5 - E5 - C#5 - E5 - A5 - | B5 - - - G#5 - - - E5 - - - . . . .', vol: 0.85 }],
  });
  A.define('station', {
    bpm: 112, chords: ['Dm', 'Bb', 'C', 'Am', 'Dm', 'Bb', 'C', 'A'], bassStyle: 'root', drums: 'k . h . s . h . k . h . s . h h', arp: 'updown', arpVol: 0.55,
    leads: [{ inst: 'lead50', notes:
      'D5 - - - F5 - A5 - G5 - F5 - E5 - D5 - | D5 - - - . . . . Bb4 - C5 - D5 - F5 - | E5 - - - G5 - C6 - Bb5 - A5 - G5 - E5 - | E5 - - - . . . . C5 - D5 - E5 - - - |' +
      'A5 - - - G5 - F5 - E5 - F5 - G5 - A5 - | F5 - - - D5 - - - Bb4 - - - D5 - - - | G5 - - - E5 - - - C5 - E5 - G5 - Bb5 - | A5 - - - - - - - E5 - - - C#5 - - -' }],
  });
  A.define('vision', {
    bpm: 84, chords: ['Am', 'F', 'Dm', 'E'], bassStyle: 'long', drums: 'h . . . h . . . h . . . h . . o', arp: 'updown', arpOct: 1, arpVol: 0.9, pad: true,
    leads: [{ inst: 'soft', notes: 'E5 - - - - - - - D5 - - - C5 - - - | C5 - - - - - - - A4 - - - C5 - - - | D5 - - - - - - - F5 - - - A5 - - - | G#5 - - - - - - - B5 - - - E6 - - -' }],
  });
  A.define('flashback', {
    bpm: 92, chords: ['F', 'C', 'Dm', 'Bb'], bassStyle: 'root', arp: 'up', arpRate: 2, arpVol: 0.7, pad: true, drums: 'k . . . s . . . k . k . s . . .',
    leads: [{ inst: 'soft', notes: 'A5 - - - - - G5 - F5 - - - C5 - - - | E5 - - - - - D5 - C5 - - - G4 - - - | F5 - - - - - E5 - D5 - - - A4 - - - | D5 - - - C5 - Bb4 - C5 - - - - - - -' }],
  });
  A.define('tension', {
    bpm: 124, chords: ['Em', 'Em', 'C', 'B'], bassStyle: 'drive', drums: 'h . h . h . h k h . h . h . h .', crash: false,
    leads: [{ inst: 'arp', notes: 'B4 . . . . . . . C5 . . . B4 . . . | B4 . . . . . . . D5 . C5 . B4 . . . | C5 . . . . . . . E5 . D5 . C5 . . . | B4 - - - D#5 - - - F#5 - - - A5 - - -', vol: 1.6 }],
  });
  A.define('henry', {
    bpm: 108, chords: ['G', 'C', 'G', 'D'], bassStyle: 'country', drums: 'k . h . s . h . k . h . s . h .',
    leads: [{ inst: 'lead', notes: 'D5 - B4 - D5 - G5 - - - F#5 - E5 - D5 - | E5 - - - C5 - E5 - G5 - - - E5 - - - | D5 - B4 - G4 - B4 - D5 - - - G5 - - - | F#5 - - - E5 - D5 - A4 - - - . . . .', vol: 0.9 }],
  });
  A.define('map', {
    bpm: 140, chords: ['C', 'F', 'G', 'C'], bassStyle: 'funk', drums: 'k . h . s . h k . k h . s . h .', arp: 'up', arpVol: 0.5,
    leads: [{ inst: 'lead', notes: 'G5 - E5 - C5 - E5 - G5 - - - C6 - - - | A5 - F5 - C5 - F5 - A5 - - - . . . . | B5 - G5 - D5 - G5 - B5 - - - D6 - - - | C6 - - - G5 - - - E5 - - - . . . .' }],
  });
  A.define('finale', {
    bpm: 144, chords: ['Dm', 'Dm', 'Bb', 'C'], bassStyle: 'pump', drums: 'k . h . s . h . k k h . s . h .', arp: 'up', arpVol: 0.5,
    leads: [{ inst: 'lead', notes: 'D5 - D5 - F5 - D5 - A5 - G5 - F5 - E5 - | D5 - - - A4 - - - D5 - E5 - F5 - G5 - | F5 - F5 - Bb5 - F5 - D6 - C6 - Bb5 - A5 - | G5 - - - E5 - - - C5 - E5 - G5 - Bb5 -' }],
  });
  A.define('bbq', {
    bpm: 120, chords: ['A', 'D', 'A', 'E'], bassStyle: 'country', drums: 'k . h . s . h h k . h . s . h .',
    leads: [{ inst: 'lead', notes: 'E5 - C#5 - A4 - C#5 - E5 - F#5 - E5 - C#5 - | D5 - F#5 - A5 - F#5 - D5 - - - . . . . | C#5 - E5 - A5 - G#5 - A5 - E5 - C#5 - A4 - | B4 - - - E5 - G#5 - B5 - - - . . . .' }],
  });
  A.define('mansion', {
    bpm: 88, chords: ['Cm', 'Ab', 'Fm', 'G'], bassStyle: 'half', arp: 'updown', arpVol: 0.8, drums: 'k . . . . . h . k . . . . . h .', crash: false,
    leads: [{ inst: 'tri', notes: 'G5 - - - Eb5 - - - C5 - - - D5 - Eb5 - | C5 - - - - - - - Ab4 - - - . . . . | F5 - - - Ab5 - - - C6 - - - B5 - Ab5 - | G5 - - - - - - - B4 - D5 - F5 - - -' }],
  });
  A.define('complete', {
    bpm: 140, loop: false, crash: true,
    leads: [{ inst: 'lead', notes: 'C5 E5 G5 C6 - - G5 - C6 - - - - - - - . . . .' }, { inst: 'lead50', notes: 'E4 G4 C5 E5 - - C5 - E5 - - - - - - - . . . .', vol: 0.8 }, { inst: 'bass', notes: 'C3 - - - - - - - G2 - - - C3 - - - . . . .' }],
    drums: 'k . . . k . . . k . k . c . . . . . . .',
  });
})(window.P);
