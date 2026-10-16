'use strict';
/* Cold-open flashback helpers: the "close your eyes" memory test Henry gives young Shawn. */
(function (P) {
  const G = P.G, U = P.U, UI = P.UI;
  const F = () => P.font;

  class Countdown extends UI.Widget {
    constructor(game, secs, label) { super(game); this.modal = false; this.secs = secs; this.label = label; }
    update(dt) { super.update(dt); if (this.t >= this.secs) this.close(); }
    draw(x) {
      const left = Math.max(0, Math.ceil(this.secs - this.t));
      UI.panel(x, 110, 4, 100, 26, { accent: '#fee761' });
      F().draw(x, this.label || 'MEMORIZE!', 160, 8, '#fee761', { align: 'center' });
      F().draw(x, String(left), 160, 18, '#ffffff', { align: 'center' });
      const k = 1 - (this.t / this.secs);
      G.rect(x, 114, 27, Math.round(92 * k), 2, k < 0.3 ? '#e43b44' : '#9be564');
    }
  }

  P.Flashback = {
    /* o: { seconds, intro?, question, options:[...], answer:index, asker:'younghenry' } -> true/false */
    async memoryTest(g, o) {
      const game = g.game;
      g.sfx('flash');
      const cd = game.push(new Countdown(game, P.debugAuto ? 0.1 : (o.seconds || 6), o.label));
      await cd.promise;
      g.sfx('whoosh');
      await g.fade(true, 350, '#0e0a14');
      // keep black while asking
      const pick = await g.ask(o.asker || 'younghenry', o.question, o.options.map((t, i) => ({ text: t, value: i })));
      const ok = pick === o.answer;
      g.set('memory_ok', ok);
      await g.fade(false, 350);
      return ok;
    },
  };
})(window.P);
