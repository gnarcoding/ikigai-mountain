(function () {
  "use strict";

  // Without these optional APIs the entire guide simply stays readable in English.
  if (!window.IntersectionObserver || !window.matchMedia) return;
  var selector = ".intro h1, .intro .thesis, .intro .lede, .intro .ridges, " +
    ".stop-title, .feels, .voice blockquote, .signs li, .through p, .carry, " +
    ".outro > h2, .outro > p:not(.label)";
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var contrast = window.matchMedia("(forced-colors: active)");
  var narrow = window.matchMedia("(max-width: 900px)");
  var stage = document.querySelector(".stage-wrap");
  var seen = new Set();
  var visible = new Set();
  var active = new Set();
  var observer = null, frame = 0, queued = 0;
  var lastY = window.scrollY, direction = 0;
  var glyphs = Array.from("ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ");

  function disabled() { return motion.matches || contrast.matches || document.hidden; }
  function key(el) { return el.tagName + ":" + el.textContent.trim(); }
  function topEdge() {
    return narrow.matches && stage ? Math.max(0, stage.getBoundingClientRect().bottom) : 0;
  }
  function inReadingArea(el) {
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.bottom > topEdge() + 12 && rect.top < window.innerHeight - 32;
  }
  function randomGlyphs(length) {
    var out = "";
    for (var i = 0; i < length; i++) out += glyphs[Math.floor(Math.random() * glyphs.length)];
    return out;
  }
  function finish(run) {
    // Restore the actual nodes, including the Carry this up label and any markup.
    run.el.replaceChildren.apply(run.el, run.original);
    run.el.classList.remove("mirage-running");
    active.delete(run);
  }
  function finishAll() {
    active.forEach(finish);
    cancelAnimationFrame(frame); frame = 0;
  }
  function tick(now) {
    frame = 0;
    active.forEach(function (run) {
      if (!run.el.isConnected || disabled()) { finish(run); return; }
      var elapsed = now - run.start;
      if (elapsed >= 1150) { finish(run); return; }
      // A reading-order wave, not one whole paragraph flashing in unison.
      var phase = Math.floor(elapsed / 85);
      run.words.forEach(function (word, i) {
        var revealAt = 160 + i / Math.max(1, run.words.length - 1) * 650;
        if (elapsed >= revealAt) {
          word.el.classList.add("is-resolved");
        } else if (phase !== run.phase) {
          word.glyph.dataset.glyphs = randomGlyphs(word.length);
        }
      });
      run.phase = phase;
    });
    if (active.size) frame = requestAnimationFrame(tick);
  }
  function begin(el) {
    var id = key(el);
    if (seen.has(id)) return;
    seen.add(id);
    observer.unobserve(el);
    visible.delete(el);
    var original = Array.from(el.childNodes), words = [];
    var fragment = document.createDocumentFragment();
    original.forEach(function (node) {
      // Leave inline markup, labels, and controls alone. Only direct prose is animated.
      if (node.nodeType !== 3) { fragment.appendChild(node); return; }
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part || /^\s+$/.test(part) || !/[A-Za-z]/.test(part)) {
          fragment.appendChild(document.createTextNode(part)); return;
        }
        var word = document.createElement("span");
        word.className = "mirage-word";
        var english = document.createElement("span");
        english.className = "mirage-original";
        english.textContent = part;
        var glyph = document.createElement("span");
        glyph.className = "mirage-glyph";
        glyph.setAttribute("aria-hidden", "true");
        // Generated decoration has no text nodes: copying/narration keep the English.
        glyph.dataset.glyphs = randomGlyphs(part.length);
        word.appendChild(english); word.appendChild(glyph);
        fragment.appendChild(word);
        words.push({ el: word, glyph: glyph, length: part.length });
      });
    });
    if (!words.length) { el.replaceChildren.apply(el, original); return; }
    el.replaceChildren(fragment);
    el.classList.add("mirage-running");
    active.add({ el: el, original: original, words: words, start: performance.now(), phase: -1 });
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function revealVisible() {
    queued = 0;
    if (direction !== 1 || disabled()) return;
    visible.forEach(function (el) {
      if (el.isConnected && inReadingArea(el)) begin(el);
    });
  }
  function schedule() {
    if (!queued) queued = requestAnimationFrame(revealVisible);
  }
  function observeStory() {
    finishAll();
    if (observer) observer.disconnect();
    visible.clear();
    // On phones, do not consume an effect while the text is behind the sticky mountain.
    var top = Math.min(topEdge() + 12, Math.max(0, window.innerHeight - 64));
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      schedule();
    }, { rootMargin: "-" + top + "px 0px -32px 0px", threshold: 0 });
    document.querySelectorAll(selector).forEach(function (el) {
      if (!seen.has(key(el))) observer.observe(el);
    });
  }
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y !== lastY) direction = y > lastY ? 1 : -1;
    lastY = y;
    schedule();
  }, { passive: true });
  window.addEventListener("resize", function () { direction = 0; observeStory(); });
  document.addEventListener("ikigai:story-rendered", function () { direction = 0; observeStory(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) finishAll();
    direction = 0; lastY = window.scrollY;
  });
  motion.addEventListener("change", finishAll);
  contrast.addEventListener("change", finishAll);
  // Restore clean selectable text immediately if someone starts interacting with it.
  document.addEventListener("pointerdown", finishAll, { passive: true });
  document.addEventListener("copy", finishAll);
  window.addEventListener("beforeprint", finishAll);
  window.addEventListener("pagehide", finishAll);
  observeStory();
}());
