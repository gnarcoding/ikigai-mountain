/* Browser-only fixture: real DOM/CSS, deterministic scroll, observer and animation clock. */
window.revealTest = (function () {
  var clock = 0, y = 400, id = 0;
  var frames = new Map(), queries = new Map(), latest;
  Object.defineProperty(window, "scrollY", { configurable: true, get: function () { return y; } });
  performance.now = function () { return clock; };
  window.requestAnimationFrame = function (fn) { frames.set(++id, fn); return id; };
  window.cancelAnimationFrame = function (key) { frames.delete(key); };
  window.matchMedia = function (query) {
    if (!queries.has(query)) {
      var media = new EventTarget(); media.matches = false; queries.set(query, media);
    }
    return queries.get(query);
  };
  window.IntersectionObserver = function (fn, options) {
    latest = this; this.fn = fn; this.options = options; this.targets = new Set();
    this.observe = function (el) { this.targets.add(el); };
    this.unobserve = function (el) { this.targets.delete(el); };
    this.disconnect = function () { this.targets.clear(); };
  };
  function advance(ms) {
    clock += ms;
    var batch = Array.from(frames.values()); frames.clear();
    batch.forEach(function (fn) { fn(clock); });
  }
  return {
    enter: function (el) { latest.fn([{ target: el, isIntersecting: true }]); },
    scroll: function (position) { y = position; window.dispatchEvent(new Event("scroll")); advance(16); },
    advance: advance,
    preference: function (query, matches) {
      var media = window.matchMedia(query); media.matches = matches; media.dispatchEvent(new Event("change"));
    },
    observer: function () { return latest; },
    frames: frames
  };
}());
