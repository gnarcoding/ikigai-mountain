const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../text-foil.js'), 'utf8');

function eventTarget(extra = {}) {
  const listeners = new Map();
  return Object.assign({
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    async fire(type, event = {}) {
      for (const fn of listeners.get(type) || []) await fn(event);
    },
    count(type) { return listeners.get(type)?.size || 0; }
  }, extra);
}

function setup({ permission, touch = true, reduced = false, secure = true, sensors = true } = {}) {
  const vars = {};
  const elements = Object.fromEntries(['foilControls', 'foilEnable', 'foilStatus'].map(id =>
    [id, eventTarget({ hidden: id === 'foilControls', disabled: false, textContent: '' })]));
  const motion = eventTarget({ matches: reduced });
  const window = eventTarget({
    innerWidth: 400, innerHeight: 800, isSecureContext: secure,
    screen: { orientation: { angle: 0 } },
    matchMedia: query => query.includes('reduced-motion') ? motion : { matches: touch },
    DeviceOrientationEvent: sensors ? (permission ? { requestPermission: permission } : {}) : undefined
  });
  const document = eventTarget({
    hidden: false,
    documentElement: { style: { setProperty: (k, v) => { vars[k] = v; } } },
    getElementById: id => elements[id]
  });
  const frames = new Map(), timers = new Map();
  let sequence = 0, now = 0;
  vm.runInNewContext(source, {
    window, document, navigator: { maxTouchPoints: touch ? 5 : 0 },
    requestAnimationFrame: fn => { frames.set(++sequence, fn); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: fn => { timers.set(++sequence, fn); return sequence; },
    clearTimeout: id => timers.delete(id)
  });
  function settle() {
    for (let i = 0; frames.size && i < 120; i++) {
      const batch = [...frames.values()]; frames.clear(); now += 16;
      batch.forEach(fn => fn(now));
    }
    assert.equal(frames.size, 0, 'animation must stop after the light settles');
  }
  return { window, document, motion, elements, vars, frames, timers, settle };
}

test('desktop pointer moves only foil CSS variables and settles without a perpetual loop', async () => {
  const p = setup({ touch: false });
  assert.equal(p.window.count('deviceorientation'), 0);
  assert.equal(p.elements.foilControls.hidden, true);
  await p.window.fire('pointermove', { clientX: 400, clientY: 0 }); p.settle();
  assert.equal(p.vars['--foil-x'], '95.00%');
  assert.equal(p.vars['--foil-y'], '5.00%');
  assert.deepEqual(Object.keys(p.vars).sort(), ['--foil-angle', '--foil-x', '--foil-y']);
});

test('Android tilt calibrates to the initial hold, ignores empty sensors, and clamps extreme angles', async () => {
  const p = setup();
  assert.equal(p.window.count('deviceorientation'), 1);
  await p.window.fire('deviceorientation', { beta: null, gamma: null });
  assert.equal(p.frames.size, 0);
  await p.window.fire('deviceorientation', { beta: 65, gamma: 10 }); p.settle();
  assert.equal(p.vars['--foil-x'], '50.00%');
  await p.window.fire('deviceorientation', { beta: 79, gamma: 24 }); p.settle();
  assert.equal(p.vars['--foil-x'], '72.50%');
  assert.equal(p.vars['--foil-y'], '72.50%');
  await p.window.fire('deviceorientation', { beta: 160, gamma: 80 }); p.settle();
  assert.equal(p.vars['--foil-x'], '95.00%');
});

test('landscape rotation recalibrates and maps movement to the screen axes', async () => {
  const p = setup();
  await p.window.fire('deviceorientation', { beta: 30, gamma: 0 }); p.settle();
  p.window.screen.orientation.angle = 90;
  await p.window.fire('deviceorientation', { beta: 50, gamma: 15 }); p.settle();
  assert.equal(p.vars['--foil-x'], '50.00%');
  await p.window.fire('deviceorientation', { beta: 78, gamma: 15 }); p.settle();
  assert.equal(p.vars['--foil-x'], '95.00%');
  assert.equal(p.vars['--foil-y'], '50.00%');
});

test('iOS asks only on a click and reports success only after valid sensor data', async () => {
  let requests = 0;
  const p = setup({ permission: async () => { requests++; return 'granted'; } });
  assert.equal(requests, 0);
  assert.equal(p.elements.foilControls.hidden, false);
  assert.equal(p.window.count('deviceorientation'), 0);
  await p.elements.foilEnable.fire('click');
  assert.equal(requests, 1);
  assert.equal(p.elements.foilStatus.textContent, 'Waiting for tilt…');
  for (const fn of p.timers.values()) fn();
  assert.match(p.elements.foilStatus.textContent, /unavailable/);
  await p.window.fire('deviceorientation', { beta: 70, gamma: 2 }); p.settle();
  assert.match(p.elements.foilStatus.textContent, /catch the light/);
});

test('denied or rejected motion permission keeps touch fallback usable', async () => {
  for (const permission of [async () => 'denied', async () => { throw new Error('blocked'); }]) {
    const p = setup({ permission });
    await p.elements.foilEnable.fire('click');
    assert.equal(p.window.count('deviceorientation'), 0);
    assert.equal(p.elements.foilEnable.disabled, false);
    assert.match(p.elements.foilStatus.textContent, /Touch and drag/);
    await p.window.fire('pointermove', { clientX: 0, clientY: 800 }); p.settle();
    assert.equal(p.vars['--foil-x'], '5.00%');
  }
});

test('reduced motion stays static and responds when the preference changes', async () => {
  const p = setup({ reduced: true });
  assert.equal(p.window.count('deviceorientation'), 0);
  assert.equal(p.window.count('pointermove'), 0);
  assert.equal(p.vars['--foil-x'], '50.00%');
  p.motion.matches = false; await p.motion.fire('change');
  assert.equal(p.window.count('deviceorientation'), 1);
  await p.window.fire('pointermove', { clientX: 400, clientY: 400 }); p.settle();
  p.motion.matches = true; await p.motion.fire('change');
  assert.equal(p.vars['--foil-x'], '50.00%');
  assert.equal(p.frames.size, 0);
});

test('background pages stop listening and resume without duplicate handlers', async () => {
  const p = setup();
  p.document.hidden = true; await p.document.fire('visibilitychange');
  assert.equal(p.window.count('deviceorientation'), 0);
  assert.equal(p.window.count('pointermove'), 0);
  p.document.hidden = false; await p.document.fire('visibilitychange');
  await p.window.fire('pageshow');
  assert.equal(p.window.count('deviceorientation'), 1);
  assert.equal(p.window.count('pointermove'), 1);
});

test('insecure contexts and missing sensors retain pointer shimmer without a permission button', async () => {
  for (const options of [{ secure: false }, { sensors: false }]) {
    const p = setup(options);
    assert.equal(p.window.count('deviceorientation'), 0);
    assert.equal(p.elements.foilControls.hidden, true);
    await p.window.fire('pointermove', { clientX: 0, clientY: 400 }); p.settle();
    assert.equal(p.vars['--foil-x'], '5.00%');
  }
});
