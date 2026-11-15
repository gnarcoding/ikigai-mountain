(function () {
  "use strict";

  var root = document.documentElement;
  var controls = document.getElementById("foilControls");
  var button = document.getElementById("foilEnable");
  var status = document.getElementById("foilStatus");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var orientation = window.DeviceOrientationEvent;
  var needsPermission = orientation && typeof orientation.requestPermission === "function";
  var touchDevice = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  var canTilt = window.isSecureContext && !!orientation && touchDevice;
  var allowed = canTilt && !needsPermission;
  var pending = false, listening = false, baseline = null, timeout = 0;
  var frame = 0, lastTime = 0;
  var current = { x: 0, y: 0 }, target = { x: 0, y: 0 };

  function clamp(n) { return Math.max(-1, Math.min(1, n)); }
  function paint() {
    root.style.setProperty("--foil-x", (50 + current.x * 45).toFixed(2) + "%");
    root.style.setProperty("--foil-y", (50 + current.y * 45).toFixed(2) + "%");
    root.style.setProperty("--foil-angle", (115 + current.x * 22 + current.y * 12).toFixed(2) + "deg");
  }
  function tick(now) {
    frame = 0;
    var ease = 1 - Math.exp(-Math.min(64, now - (lastTime || now - 16)) / 75);
    lastTime = now;
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;
    var settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) < 0.002;
    if (settled) { current.x = target.x; current.y = target.y; }
    paint();
    if (!settled) frame = requestAnimationFrame(tick);
  }
  function aim(x, y) {
    if (motion.matches || document.hidden) return;
    target.x = clamp(x); target.y = clamp(y);
    if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); }
  }
  function pointer(e) {
    if (e.isPrimary === false) return;
    // Touch also provides a fallback when motion is unavailable. Never cancel scrolling.
    aim(e.clientX / Math.max(1, window.innerWidth) * 2 - 1,
      e.clientY / Math.max(1, window.innerHeight) * 2 - 1);
  }
  function screenAngle() {
    return window.screen.orientation ? window.screen.orientation.angle : (window.orientation || 0);
  }
  function delta(a, b) { return (a - b + 540) % 360 - 180; }
  function tilt(e) {
    if (motion.matches || document.hidden || !Number.isFinite(e.beta) || !Number.isFinite(e.gamma)) return;
    var angle = screenAngle();
    // Calibrate to the way this visitor is holding the phone, including landscape.
    if (!baseline || baseline.angle !== angle) baseline = { beta: e.beta, gamma: e.gamma, angle: angle };
    var x = delta(e.gamma, baseline.gamma) / 28;
    var y = delta(e.beta, baseline.beta) / 28;
    var radians = angle * Math.PI / 180;
    aim(x * Math.cos(radians) + y * Math.sin(radians), y * Math.cos(radians) - x * Math.sin(radians));
    clearTimeout(timeout);
    if (needsPermission) {
      button.hidden = true;
      status.textContent = "Tilt your phone to catch the light.";
    }
  }
  function stopTilt() {
    window.removeEventListener("deviceorientation", tilt);
    listening = false;
    baseline = null;
    clearTimeout(timeout);
  }
  function startTilt() {
    if (!allowed || listening || motion.matches || document.hidden) return;
    listening = true;
    window.addEventListener("deviceorientation", tilt, { passive: true });
    if (needsPermission) {
      // A granted permission does not guarantee working hardware or sensor data.
      timeout = setTimeout(function () {
        status.textContent = "Tilt is unavailable here. Touch and drag to shimmer.";
      }, 4000);
    }
  }
  function sync() {
    stopTilt();
    window.removeEventListener("pointermove", pointer);
    cancelAnimationFrame(frame); frame = 0;
    controls.hidden = motion.matches || !canTilt || !needsPermission;
    if (motion.matches || document.hidden) {
      current.x = current.y = target.x = target.y = 0;
      paint();
      return;
    }
    window.addEventListener("pointermove", pointer, { passive: true });
    startTilt();
  }
  button.addEventListener("click", async function () {
    if (pending || !canTilt || !needsPermission || motion.matches) return;
    pending = true;
    button.disabled = true;
    try {
      // Must be invoked inside this click, before any await (Safari requirement).
      allowed = (await orientation.requestPermission()) === "granted";
      if (allowed) {
        button.hidden = true;
        status.textContent = "Waiting for tilt…";
        startTilt();
      } else {
        status.textContent = "Tilt wasn’t enabled. Touch and drag to shimmer.";
      }
    } catch (err) {
      status.textContent = "Tilt is unavailable here. Touch and drag to shimmer.";
    } finally {
      pending = false;
      button.disabled = false;
    }
  });
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pageshow", sync);
  window.addEventListener("pagehide", function () { stopTilt(); cancelAnimationFrame(frame); frame = 0; });
  sync();
}());
