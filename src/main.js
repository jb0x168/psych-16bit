'use strict';
/* Boot. Also exposes a tiny debug/automation surface used by tools/playtest.py. */
(function (P) {
  const game = P.game = new P.Game();
  const boot = () => {
    game.init(document.getElementById('game'));
    // sanity check: every chapter must paint a pineapple somewhere in its own scenes
    if (P.debug) {
      for (const id of P.chapterList) {
        const ch = P.chapters[id];
        const pc = P.props.pineappleCount;
        for (const sid of Object.keys(ch.scenes)) { try { const c = P.G.canvas(ch.scenes[sid].width || 320, 180); ch.scenes[sid].bg && ch.scenes[sid].bg(c.x, { W: c.width, H: 180, v: 'default', g: game.g }); } catch (e) { /* needs state */ } }
        if (P.props.pineappleCount === pc) console.warn(`[pineapple] chapter ${id} never paints a pineapple!`);
      }
    }
    // live-update support inside the artifact viewer
    const hot = window.claude && window.claude.hot;
    if (hot && hot.snapshot) hot.snapshot(() => { try { game.autosave(); } catch (e) { /* ignore */ } return {}; });
  };
  // inside the artifact viewer, boot through the live-update hook so state survives republishes
  const start = () => { const hot = window.claude && window.claude.hot; if (hot && hot.ready) hot.ready(boot); else boot(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})(window.P);
