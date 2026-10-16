'use strict';
/* Case File (inventory / evidence picker), pause menu, settings. */
(function (P) {
  const G = P.G, U = P.U, UI = P.UI;
  const F = () => P.font, I = () => P.input;
  const ACC = UI.ACC;

  const TABS = {
    clues: { label: 'CLUES', empty: 'No clues yet. Talk to people. Look at things. Use your "gift" (Q).' },
    items: { label: 'ITEMS', empty: 'Your pockets contain lint and a pineapple-scented air freshener. Nothing useful.' },
    gifts: { label: 'FOR JULES', empty: 'Nothing for Juliet yet. Hidden things show up in Shawn-Vision...' },
    snacks: { label: 'SNACKS', empty: 'Gus: "We have not eaten in this chapter, Shawn." Unacceptable.' },
    notes: { label: 'NOTES' },
  };

  class CaseFile extends UI.Widget {
    constructor(game, o = {}) {
      super(game);
      this.o = o;
      this.pick = !!o.pick;
      this.tabs = o.kinds || ['clues', 'items', 'gifts', 'snacks', 'notes'];
      this.tab = 0; this.sel = 0; this.scroll = 0;
      this.lastTab = -1;
      P.audio.sfx('page');
      if (P.debugAuto && this.pick) this.autoT = 0;
    }
    entries(kind) {
      const g = this.game, s = g.state, ch = g.chapter;
      if (!s || !ch) return [];
      const defs = kind === 'clues' ? ch.clues : kind === 'items' ? ch.items : kind === 'gifts' ? ch.gifts : kind === 'snacks' ? ch.snacks : {};
      const ids = kind === 'clues' ? s.clues : kind === 'items' ? s.items : kind === 'gifts' ? s.gifts : kind === 'snacks' ? s.snacks : [];
      return ids.map((id) => Object.assign({ id, kind }, defs[id] || P.world.items[id] || { name: id, icon: 'question', desc: '' }));
    }
    update(dt) {
      super.update(dt);
      const kind = this.tabs[this.tab];
      const list = this.entries(kind);
      if (P.debugAuto && this.pick) {
        const want = P.debugPresent ? P.debugPresent(this) : null;
        this.close(want); return;
      }
      if (this.tab !== this.lastTab) { this.sel = 0; this.scroll = 0; this.lastTab = this.tab; }
      const cols = 6;
      const go = (d) => { const n = list.length; if (!n) return; this.sel = U.clamp(this.sel + d, 0, n - 1); P.audio.sfx('select'); };
      if (I().pressed('left')) go(-1);
      if (I().pressed('right')) go(1);
      if (I().pressed('up')) go(-cols);
      if (I().pressed('down')) go(cols);
      if (I().pressed('casefile') && !this.pick) { this.close(null); P.audio.sfx('cancel'); return; }
      if (I().pressed('cancel') || I().rclicked) { P.audio.sfx('cancel'); this.close(null); return; }
      // tab switching: Q/E? use [ ] or mouse; keyboard: shift tabs with 'vision'(Q) and 'phone'(H) is weird -> use PageUp/PageDown + number keys
      for (let i = 0; i < this.tabs.length; i++) if (I().pressed('Digit' + (i + 1))) { this.tab = i; P.audio.sfx('page'); }
      if (I().pressed('BracketLeft') || I().pressed('PageUp')) { this.tab = (this.tab - 1 + this.tabs.length) % this.tabs.length; P.audio.sfx('page'); }
      if (I().pressed('BracketRight') || I().pressed('PageDown')) { this.tab = (this.tab + 1) % this.tabs.length; P.audio.sfx('page'); }
      // mouse
      const X = 8, Y = 6;
      if (I().clicked || I().moved) {
        // tabs
        let tx = X + 8;
        for (let i = 0; i < this.tabs.length; i++) {
          const w = F().width(TABS[this.tabs[i]].label) + 10;
          if (I().clicked && UI.mouseIn(tx, Y + 6, w, 12)) { this.tab = i; P.audio.sfx('page'); }
          tx += w + 2;
        }
        // grid
        for (let i = 0; i < Math.min(24, list.length - this.scroll * cols); i++) {
          const gx = X + 10 + (i % cols) * 21, gy = Y + 26 + Math.floor(i / cols) * 21;
          if (UI.mouseIn(gx, gy, 20, 20)) {
            if (this.sel !== i + this.scroll * cols) { this.sel = i + this.scroll * cols; if (!I().clicked) P.audio.sfx('select'); }
            if (I().clicked && this.pick && this.dbl === this.sel && this.t - this.dblT < 0.45) { this.present(list); return; }
            if (I().clicked) { this.dbl = this.sel; this.dblT = this.t; }
          }
        }
        // buttons
        if (I().clicked) {
          if (this.pick && UI.mouseIn(196, 150, 50, 14)) { this.present(list); return; }
          if (UI.mouseIn(this.pick ? 250 : 256, 150, 50, 14)) { P.audio.sfx('cancel'); this.close(null); return; }
        }
      }
      this.scroll = Math.max(0, Math.floor(this.sel / cols) - 3);
      if (this.pick && I().pressed('confirm')) this.present(list);
    }
    present(list) {
      const e = list[this.sel];
      if (!e) { P.audio.sfx('wrong'); return; }
      P.audio.sfx('confirm');
      this.close(e.id);
    }
    draw(x) {
      const X = 8, Y = 6, W = P.W - 16, H = P.H - 12;
      x.save(); x.globalAlpha = 0.55; G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      UI.panel(x, X, Y, W, H, { fill: ['#2a2a1e', '#25251a', '#202016', '#1a1a12'], hi: '#f4e8b8', lo: '#8a7a4a', accent: '#feae34' });
      // manila folder look
      G.rect(x, X + 4, Y + 20, W - 8, H - 24, '#e8d49a'); G.rect(x, X + 5, Y + 21, W - 10, H - 26, '#f4e2aa');
      G.hl(x, X + 5, Y + 21, W - 10, '#fff4c8');
      let tx = X + 8;
      for (let i = 0; i < this.tabs.length; i++) {
        const lab = TABS[this.tabs[i]].label;
        const w = F().width(lab) + 10, on = i === this.tab;
        G.rect(x, tx, Y + 6 + (on ? 0 : 2), w, on ? 15 : 12, on ? '#f4e2aa' : '#c8b47a');
        G.frame(x, tx, Y + 6 + (on ? 0 : 2), w, on ? 15 : 12, '#6a5a2a');
        if (on) G.hl(x, tx + 1, Y + 20, w - 2, '#f4e2aa');
        F().draw(x, lab, tx + 5, Y + 9 + (on ? 0 : 1), on ? '#3a2a10' : '#5a4a20');
        tx += w + 2;
      }
      if (this.o.prompt) F().draw(x, this.o.prompt, X + W - 8, Y + 9, '#feae34', { align: 'right', shadow: '#0e0a14' });
      else F().draw(x, 'CASE FILE', X + W - 8, Y + 9, '#feae34', { align: 'right' });
      const kind = this.tabs[this.tab];
      if (kind === 'notes') { this.drawNotes(x, X + 12, Y + 28); this.drawButtons(x); return; }
      const list = this.entries(kind);
      const cols = 6;
      if (!list.length) {
        const lines = F().wrap(TABS[kind].empty, 250);
        lines.forEach((l, i) => F().draw(x, l, X + 14, Y + 34 + i * 10, '#6a5a2a'));
      }
      for (let i = 0; i < 24; i++) {
        const idx = i + this.scroll * cols;
        const gx = X + 10 + (i % cols) * 21, gy = Y + 26 + Math.floor(i / cols) * 21;
        G.rect(x, gx, gy, 20, 20, '#e0cc90'); G.frame(x, gx, gy, 20, 20, '#c8b47a');
        const e = list[idx];
        if (!e) continue;
        x.drawImage(P.icon(e.icon || 'note'), gx + 1, gy + 1);
        if (idx === this.sel) { const p = Math.floor(this.t * 4) % 2; G.frame(x, gx - 1 - p, gy - 1 - p, 22 + 2 * p, 22 + 2 * p, '#c83a3a'); }
        if (e.isNew) G.px(x, gx + 17, gy + 2, '#e43b44');
      }
      // details
      const e = list[this.sel];
      const dx = X + 140, dy = Y + 26, dw = W - 150;
      G.rect(x, dx, dy, dw, 116, '#fff6d0'); G.frame(x, dx, dy, dw, 116, '#c8b47a');
      for (let ly = dy + 14; ly < dy + 114; ly += 10) G.hl(x, dx + 2, ly + 8, dw - 4, '#e8d8b0');
      if (e) {
        const big = P.icon(e.icon || 'note');
        x.drawImage(big, dx + 4, dy + 4, 36, 36);
        const nameLines = F().wrap(e.name, dw - 48);
        nameLines.forEach((l, i) => F().draw(x, l, dx + 44, dy + 6 + i * 10, '#7a2a1a'));
        if (e.kind === 'clues') F().draw(x, e.from ? 'via ' + e.from : 'evidence', dx + 44, dy + 8 + nameLines.length * 10, '#9a8a6a');
        const lines = F().wrap(e.desc || '', dw - 10);
        lines.slice(0, 7).forEach((l, i) => F().draw(x, l, dx + 5, dy + 44 + i * 10, '#3a2a10'));
      }
      this.drawButtons(x);
    }
    drawButtons(x) {
      if (this.pick) { UI.button(x, 196, 150, 50, 14, 'PRESENT', true); UI.button(x, 250, 150, 50, 14, 'CANCEL', false); }
      else UI.button(x, 256, 150, 50, 14, 'CLOSE', false);
      F().draw(x, this.pick ? 'ENTER present   ESC cancel   [ ] tabs' : 'arrows select   [ ] or 1-5 tabs   ESC close', 18, 154, '#6a5a2a');
    }
    drawNotes(x, X, Y) {
      const g = this.game, s = g.state, ch = g.chapter, gl = g.global;
      const L = (t, y, c = '#3a2a10') => F().draw(x, t, X, Y + y, c);
      L(`CHAPTER ${ch.number}: ${ch.title}`, 0, '#7a2a1a');
      L('Current lead:', 14, '#9a8a6a');
      F().wrap(s.objective || '—', 270).forEach((l, i) => L(l, 24 + i * 10));
      L('Juliet:', 54, '#9a8a6a');
      const maxH = 10, r = Math.min(maxH, gl.romance || 0);
      for (let i = 0; i < maxH; i++) G.heart(x, X + 40 + i * 9, Y + 54, i < r ? '#ff4a7a' : '#c8b47a', i < r ? '#ffd0dc' : '#d8c890');
      L(romanceLabel(gl.romance || 0), 64, '#b04060');
      L('Lassie\'s skepticism:', 80, '#9a8a6a');
      for (let i = 0; i < 3; i++) G.rect(x, X + 104 + i * 9, Y + 80, 7, 7, i < (s.skepticism || 0) ? '#e43b44' : '#c8b47a');
      L(`Clues: ${s.clues.length}   Snacks this case: ${s.snacks.length}   Lifetime snacks: ${gl.snacks || 0}`, 94);
      L(`Calls to Dad: ${s.hintsUsed || 0}`, 104);
    }
  }
  function romanceLabel(r) {
    if (r <= 0) return 'She thinks you are "a lot".';
    if (r <= 2) return 'She laughed at one of your jokes. Once.';
    if (r <= 4) return 'Definitely a smile. Gus saw it too.';
    if (r <= 6) return 'She saved your number as "Shawn" (no eye-roll emoji).';
    if (r <= 8) return 'Lassiter has noticed. He is not pleased.';
    return 'Shules is canon. Gus, start writing the toast.';
  }
  UI.CaseFile = CaseFile;

  /* ---------------- settings + pause ---------------- */
  class Settings extends UI.Widget {
    constructor(game) { super(game); this.sel = 0; }
    rows() {
      const s = P.audio.settings, gs = this.game.settings;
      const speeds = [[30, 'Slow'], [55, 'Normal'], [95, 'Fast'], [999, 'Instant']];
      const sp = speeds.find((v) => v[0] === gs.textSpeed) || speeds[1];
      return [
        { label: 'Music', val: Math.round(s.music * 10), adj: (d) => { s.music = U.clamp(Math.round(s.music * 10 + d) / 10, 0, 1); P.audio.applyVolume(); } },
        { label: 'Sound FX', val: Math.round(s.sfx * 10), adj: (d) => { s.sfx = U.clamp(Math.round(s.sfx * 10 + d) / 10, 0, 1); P.audio.applyVolume(); P.audio.sfx('select'); } },
        { label: 'Mute all', val: s.muted ? 'ON' : 'OFF', adj: () => P.audio.toggleMute() },
        { label: 'Text speed', val: sp[1], adj: (d) => { const i = U.clamp(speeds.indexOf(sp) + d, 0, 3); gs.textSpeed = speeds[i][0]; this.game.saveSettings(); } },
        { label: 'Dialogue box', val: this.game.dialoguePos === 'top' ? 'Top' : 'Bottom', adj: () => { this.game.dialoguePos = this.game.dialoguePos === 'top' ? 'bottom' : 'top'; gs.dialoguePos = this.game.dialoguePos; this.game.saveSettings(); } },
        { label: 'Fullscreen', val: document.fullscreenElement ? 'ON' : 'OFF', adj: () => this.game.toggleFullscreen() },
        { label: 'Back', back: true },
      ];
    }
    update(dt) {
      super.update(dt);
      const rows = this.rows();
      if (I().pressed('up')) { this.sel = (this.sel - 1 + rows.length) % rows.length; P.audio.sfx('select'); }
      if (I().pressed('down')) { this.sel = (this.sel + 1) % rows.length; P.audio.sfx('select'); }
      const r = rows[this.sel];
      if (I().pressed('left') && r.adj) r.adj(-1);
      if (I().pressed('right') && r.adj) r.adj(1);
      const X = 70, Y = 34;
      if (I().clicked) {
        rows.forEach((row, i) => {
          if (UI.mouseIn(X, Y + 16 + i * 13, 180, 12)) {
            this.sel = i;
            if (row.back) { this.close(); return; }
            const mid = X + 150;
            if (row.adj) row.adj(I().mx < mid ? -1 : 1);
          }
        });
      }
      if (I().pressed('confirm') && r.back) { P.audio.sfx('cancel'); this.close(); }
      else if (I().pressed('confirm') && r.adj) r.adj(1);
      if (I().pressed('cancel') || I().rclicked) { P.audio.sfx('cancel'); this.close(); }
    }
    draw(x) {
      const X = 70, Y = 34, W = 180, rows = this.rows();
      x.save(); x.globalAlpha = 0.6; G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      UI.panel(x, X, Y, W, 22 + rows.length * 13);
      F().draw(x, 'SETTINGS', X + W / 2, Y + 5, ACC, { align: 'center' });
      rows.forEach((r, i) => {
        const y = Y + 18 + i * 13, hot = i === this.sel;
        if (hot) { G.rect(x, X + 4, y - 2, W - 8, 11, '#3a2e86'); UI.cursor(x, X + 7, y, this.t); }
        F().draw(x, r.label, X + 16, y, hot ? '#fff' : '#d8d0ff');
        if (r.val != null) {
          if (typeof r.val === 'number') { for (let k = 0; k < 10; k++) G.rect(x, X + 100 + k * 6, y + 1, 4, 6, k < r.val ? ACC : '#3a3270'); }
          else F().draw(x, '< ' + r.val + ' >', X + W - 12, y, hot ? '#fee761' : '#a8a0d8', { align: 'right' });
        }
      });
    }
  }
  UI.Settings = Settings;

  class Pause extends UI.Widget {
    constructor(game) { super(game); this.sel = 0; P.audio.sfx('confirm'); }
    items() {
      const g = this.game;
      return [
        { label: 'Resume', act: () => this.close() },
        { label: 'Case File', act: () => { this.close(); g.openCaseFile(); } },
        { label: 'Call Dad (hint)', act: () => { this.close(); g.phoneHenry(); }, disabled: !g.chapter },
        { label: 'Settings', act: () => g.push(new Settings(g)) },
        { label: 'How to play', act: () => g.push(new Help(g)) },
        { label: 'Save & quit to title', act: () => { this.close(); g.save(); g.toTitle(); } },
      ];
    }
    update(dt) {
      super.update(dt);
      const it = this.items();
      if (I().pressed('up')) { this.sel = (this.sel - 1 + it.length) % it.length; P.audio.sfx('select'); }
      if (I().pressed('down')) { this.sel = (this.sel + 1) % it.length; P.audio.sfx('select'); }
      const X = 96, Y = 40, W = 128;
      if (I().moved || I().clicked) it.forEach((row, i) => { if (UI.mouseIn(X, Y + 18 + i * 13, W, 12)) { this.sel = i; if (I().clicked && !row.disabled) { P.audio.sfx('confirm'); row.act(); } } });
      if (I().pressed('confirm') && !it[this.sel].disabled) { P.audio.sfx('confirm'); it[this.sel].act(); }
      if (I().pressed('cancel') || I().rclicked) { P.audio.sfx('cancel'); this.close(); }
    }
    draw(x) {
      const X = 96, Y = 40, W = 128, it = this.items();
      x.save(); x.globalAlpha = 0.6; G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      UI.panel(x, X, Y, W, 24 + it.length * 13);
      F().draw(x, 'PAUSED', X + W / 2, Y + 6, ACC, { align: 'center' });
      it.forEach((r, i) => {
        const y = Y + 20 + i * 13, hot = i === this.sel;
        if (hot) { G.rect(x, X + 4, y - 2, W - 8, 11, '#3a2e86'); UI.cursor(x, X + 7, y, this.t); }
        F().draw(x, r.label, X + 16, y, r.disabled ? '#5a5288' : hot ? '#fff' : '#d8d0ff');
      });
    }
  }
  UI.Pause = Pause;

  class Help extends UI.Widget {
    update(dt) { super.update(dt); if (this.t > 0.2 && (I().pressed('confirm') || I().pressed('cancel') || I().clicked)) { P.audio.sfx('cancel'); this.close(); } }
    draw(x) {
      x.save(); x.globalAlpha = 0.7; G.rect(x, 0, 0, P.W, P.H, '#0e0a14'); x.restore();
      UI.panel(x, 14, 10, P.W - 28, P.H - 20);
      F().draw(x, 'HOW TO BE A FAKE PSYCHIC', P.W / 2, 17, ACC, { align: 'center' });
      const rows = [
        ['Walk', 'Arrow keys / WASD, or click the ground'],
        ['Interact', 'E / Enter / Space, or click (talk, use, enter)'],
        ['Shawn-Vision', 'Q toggles it. Hidden details sparkle. Right-click observes'],
        ['Case File', 'Tab / C - clues, items, gifts for Juliet, snacks'],
        ['Call Dad', 'H - Henry grumbles, then gives you a hint'],
        ['Skip text', 'Hold Shift'],
        ['Menu', 'Esc - settings, save & quit'],
        ['', ''],
        ['Revelations', 'When you have the right clues, tell the police'],
        ['', 'you are "having a vision". Present the evidence'],
        ['', 'that proves each point. Wrong picks raise'],
        ['', 'Lassiter\'s skepticism. Three strikes: try again later.'],
      ];
      rows.forEach(([a, b], i) => { F().draw(x, a, 24, 32 + i * 10, '#fee761'); F().draw(x, b, 92, 32 + i * 10, '#e8e0ff'); });
    }
  }
  UI.Help = Help;
})(window.P);
