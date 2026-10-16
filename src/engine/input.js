'use strict';
/* Keyboard / mouse / touch input mapped into native-resolution game coordinates. */
(function (P) {
  const keys = {}, pressed = {}, released = {};
  const MAP = {
    up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'], left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'],
    confirm: ['Enter', 'Space', 'KeyE', 'KeyZ'], cancel: ['Escape', 'Backspace', 'KeyX'],
    vision: ['KeyQ', 'KeyV'], casefile: ['Tab', 'KeyC', 'KeyI'], phone: ['KeyH'], pause: ['Escape', 'KeyP'],
    mute: ['KeyM'], skip: ['ShiftLeft', 'ShiftRight'], objective: ['KeyO'], fullscreen: ['KeyF'],
  };
  const input = P.input = {
    mx: -1, my: -1, mdown: false, clicked: false, rclicked: false, moved: false, lastDevice: 'mouse', wheel: 0,
    held(a) { return (MAP[a] || [a]).some((k) => keys[k]); },
    pressed(a) { return (MAP[a] || [a]).some((k) => pressed[k]); },
    anyPressed() { return Object.keys(pressed).length > 0 || input.clicked; },
    consume() { for (const k in pressed) delete pressed[k]; input.clicked = false; input.rclicked = false; },
    endFrame() { for (const k in pressed) delete pressed[k]; for (const k in released) delete released[k]; input.clicked = false; input.rclicked = false; input.moved = false; input.wheel = 0; },
    attach(canvas) {
      const toGame = (cx, cy) => {
        const r = canvas.getBoundingClientRect();
        return [((cx - r.left) / r.width) * P.W, ((cy - r.top) / r.height) * P.H];
      };
      window.addEventListener('keydown', (e) => {
        if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.code)) e.preventDefault();
        if (!keys[e.code]) pressed[e.code] = true;
        keys[e.code] = true; input.lastDevice = 'keys';
        P.audio && P.audio.unlock();
      });
      window.addEventListener('keyup', (e) => { keys[e.code] = false; released[e.code] = true; });
      window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
      canvas.addEventListener('mousemove', (e) => { [input.mx, input.my] = toGame(e.clientX, e.clientY); input.moved = true; input.lastDevice = 'mouse'; });
      canvas.addEventListener('mousedown', (e) => {
        [input.mx, input.my] = toGame(e.clientX, e.clientY);
        if (e.button === 2) input.rclicked = true; else { input.clicked = true; input.mdown = true; }
        input.lastDevice = 'mouse';
        P.audio && P.audio.unlock();
      });
      window.addEventListener('mouseup', () => { input.mdown = false; });
      canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      canvas.addEventListener('wheel', (e) => { input.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
      canvas.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        [input.mx, input.my] = toGame(t.clientX, t.clientY);
        input.clicked = true; input.lastDevice = 'touch';
        P.audio && P.audio.unlock();
        e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchmove', (e) => { const t = e.changedTouches[0]; [input.mx, input.my] = toGame(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    },
  };
})(window.P);
