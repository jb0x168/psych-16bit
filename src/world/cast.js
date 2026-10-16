'use strict';
/* Recurring cast. Chapter-specific characters are declared inside each chapter's `cast` block
   using exactly the same fields (see docs/CHAPTER_GUIDE.md). */
(function (P) {
  P.defineCast('shawn', {
    name: 'Shawn Spencer', short: 'Shawn', h: 56, build: 'avg', skin: 'light', jaw: 'avg', eyes: '#5e7a3a',
    hair: { style: 'spiky', color: 'brown' }, face: { stubble: true },
    top: { type: 'overshirt', color: '#c4562c', inner: '#24324e', graphic: '#fee761' },
    bottom: { type: 'jeans', color: '#3d5f8f' }, shoes: '#e4dccb',
    voice: { pitch: 1.0, wave: 'square' }, color: '#ff9a5a',
    portrait: { bg: '#3a1e2e', frame: '#ff9a5a' },
  });
  P.defineCast('gus', {
    name: 'Burton Guster', short: 'Gus', h: 58, build: 'big', skin: 'dark', jaw: 'round', eyes: '#2a1a14',
    hair: { style: 'buzz', color: 'black' }, face: {},
    top: { type: 'shirt', color: '#86b0e0', tie: '#263872', pocket: true },
    bottom: { type: 'pants', color: '#3c3c4c' }, shoes: '#2a1a14', belt: '#1a1418',
    voice: { pitch: 0.82, wave: 'square' }, color: '#86b0e0',
    portrait: { bg: '#18243e', frame: '#86b0e0' },
  });
  P.defineCast('lassiter', {
    name: 'Det. Carlton Lassiter', short: 'Lassiter', h: 59, build: 'slim', skin: 'pale', jaw: 'long', eyes: '#4a7ab0',
    hair: { style: 'slick', color: 'black' }, face: { brow: '#19151f' },
    top: { type: 'suit', color: '#3e3e4c', shirt: '#e8eef8', tie: '#7a2030' },
    bottom: { type: 'pants', color: '#3e3e4c' }, shoes: '#18141c', acc: ['badge', 'holster'],
    voice: { pitch: 0.72, wave: 'square' }, color: '#c0cbdc',
    portrait: { bg: '#1e2230', frame: '#8b9bb4' },
  });
  P.defineCast('juliet', {
    name: "Det. Juliet O'Hara", short: 'Juliet', h: 53, build: 'fem', skin: 'rosy', jaw: 'soft', eyes: '#4a8ad8',
    hair: { style: 'ponytail', color: 'blonde' }, face: { lashes: true, lips: '#c8506a' },
    top: { type: 'blazer', color: '#2c3e6a', shirt: '#cfe2f4' },
    bottom: { type: 'pants', color: '#2e2e3e' }, shoes: '#2a1e24', acc: ['badge'],
    voice: { pitch: 1.38, wave: 'square' }, color: '#ffd36a',
    portrait: { bg: '#2a2448', frame: '#ffd36a' },
  });
  P.defineCast('vick', {
    name: 'Chief Karen Vick', short: 'Chief Vick', h: 54, build: 'fem', skin: 'light', jaw: 'soft', eyes: '#5a3a24',
    hair: { style: 'bob', color: 'chestnut' }, face: { lashes: true, lips: '#a8404a' },
    top: { type: 'blazer', color: '#5e2a3c', shirt: '#f2e4e4' },
    bottom: { type: 'skirt', color: '#3a2630' }, tights: '#c89a84', shoes: '#1e1418', acc: ['pearls'],
    voice: { pitch: 1.15, wave: 'square' }, color: '#e8a0b8',
    portrait: { bg: '#2e1824', frame: '#e8a0b8' },
  });
  P.defineCast('henry', {
    name: 'Henry Spencer', short: 'Henry', h: 56, build: 'avg', skin: 'tan', jaw: 'avg', eyes: '#4a6a8a',
    hair: { style: 'gray', color: 'gray' }, face: { goatee: 'gray', stubble: true },
    top: { type: 'hawaiian', color: '#2a8a8a', pattern: '#ff9a3c', pattern2: '#fff0c0', tucked: false },
    bottom: { type: 'pants', color: '#b8a074' }, shoes: '#5a3a2a',
    voice: { pitch: 0.86, wave: 'square' }, color: '#7ee2d0',
    portrait: { bg: '#163a3a', frame: '#7ee2d0' },
  });
  P.defineCast('mcnab', {
    name: 'Officer Buzz McNab', short: 'McNab', h: 62, build: 'huge', skin: 'light', jaw: 'round', eyes: '#4a6a3a',
    hair: { style: 'crew', color: 'sandy' }, face: {},
    top: { type: 'uniform', color: '#2a3a6a', sleeves: 'short' },
    bottom: { type: 'pants', color: '#24304e' }, shoes: '#141018',
    voice: { pitch: 0.7, wave: 'square' }, color: '#9fc0ff',
    portrait: { bg: '#141e3a', frame: '#9fc0ff' },
  });
  P.defineCast('woody', {
    name: 'Woody the Coroner', short: 'Woody', h: 55, build: 'avg', skin: 'pale', jaw: 'avg', eyes: '#3a5a7a',
    hair: { style: 'balding', color: 'salt' }, face: { glasses: 'round' },
    top: { type: 'labcoat', color: '#f2f2f6', inner: '#7a9ad0', tie: '#b03a3a' },
    bottom: { type: 'pants', color: '#5a5a6a' }, shoes: '#2a2228',
    voice: { pitch: 1.12, wave: 'square' }, color: '#d8f0ff',
    portrait: { bg: '#1e2e2e', frame: '#d8f0ff' },
  });
  P.defineCast('youngshawn', {
    name: 'Young Shawn', short: 'Shawn', h: 38, kid: true, build: 'kid', skin: 'light', jaw: 'soft', eyes: '#5e7a3a',
    hair: { style: 'kidspiky', color: 'brown' }, face: {},
    top: { type: 'tee', color: '#e43b44', stripe: '#fee761' },
    bottom: { type: 'shorts', color: '#3d5f8f' }, shoes: '#f4f0e8',
    voice: { pitch: 1.7, wave: 'square' }, color: '#ff9a5a',
    portrait: { bg: '#3a2a1e', frame: '#ffb070', kid: true },
  });
  P.defineCast('younghenry', {
    name: 'Henry (1987)', short: 'Henry', h: 56, build: 'avg', skin: 'tan', jaw: 'avg', eyes: '#4a6a8a',
    hair: { style: 'short', color: 'dkbrown' }, face: { mustache: 'dkbrown' },
    top: { type: 'polo', color: '#4a7a9a' },
    bottom: { type: 'jeans', color: '#4a5a7a' }, shoes: '#5a3a2a',
    voice: { pitch: 0.86, wave: 'square' }, color: '#7ee2d0',
    portrait: { bg: '#2a2a1e', frame: '#d8c890' },
  });
})(window.P);
