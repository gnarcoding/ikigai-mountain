(function () {
  var t = window.revealTest, results = document.getElementById("results"), count = 0;
  function check(condition, message) {
    var item = document.createElement("li");
    item.textContent = message; item.className = condition ? "pass" : "fail";
    results.appendChild(item);
    if (!condition) throw new Error(message);
    count++;
  }
  try {
    var first = document.getElementById("first"), second = document.getElementById("second");
    var original = first.textContent, node = first.firstChild;
    // Keep test result output from moving the fixture outside the reading viewport.
    first.getBoundingClientRect = function () { return { width: 380, top: 100, bottom: 300 }; };
    second.getBoundingClientRect = first.getBoundingClientRect;
    t.enter(first); t.advance(16);
    check(!first.classList.contains("mirage-running"), "No animation on initial load");
    t.scroll(300);
    check(!first.classList.contains("mirage-running"), "Scrolling upward does not trigger a reveal");
    var height = first.offsetHeight;
    t.scroll(350);
    check(first.classList.contains("mirage-running"), "Scrolling downward starts the Japanese glyph wave");
    check(first.textContent === original, "English DOM text remains exact during the animation");
    check(Array.from(first.querySelectorAll(".mirage-glyph")).every(function (el) {
      return el.getAttribute("aria-hidden") === "true" && !el.textContent && /[ｦ-ﾟ]/.test(el.dataset.glyphs);
    }), "Decorative Japanese glyphs are excluded from accessible text and textContent");
    check(Math.abs(first.offsetHeight - height) <= 1, "Wrapping and paragraph height remain steady");
    t.advance(400);
    var revealed = first.querySelectorAll(".is-resolved").length;
    check(revealed > 0 && revealed < first.querySelectorAll(".mirage-word").length, "Words resolve progressively in reading order");
    t.advance(800);
    check(first.firstChild === node && first.textContent === original && !first.querySelector("span"), "Completion restores the original text node and removes temporary spans");
    check(t.frames.size === 0, "Animation stops scheduling frames when finished");
    t.enter(first); t.scroll(200); t.scroll(450);
    check(!first.classList.contains("mirage-running"), "Returning to a revealed passage never replays it");

    t.preference("(prefers-reduced-motion: reduce)", true);
    t.enter(second); t.scroll(500);
    check(!second.classList.contains("mirage-running"), "Reduced motion bypasses the effect");
    t.preference("(prefers-reduced-motion: reduce)", false); t.scroll(550);
    check(second.classList.contains("mirage-running"), "An unread passage can animate after reduced motion is turned off");
    t.preference("(prefers-reduced-motion: reduce)", true);
    check(!second.classList.contains("mirage-running") && !t.frames.size, "Changing motion preference finishes an active reveal immediately");
    t.preference("(prefers-reduced-motion: reduce)", false);

    var clone = first.cloneNode(true);
    document.querySelector("main").appendChild(clone);
    document.dispatchEvent(new Event("ikigai:story-rendered"));
    check(!t.observer().targets.has(clone), "Rebuilding the trail does not replay already-read passages");

    var carry = document.getElementById("carry"), label = carry.firstChild, carryText = carry.textContent;
    t.preference("(max-width: 900px)", true);
    document.querySelector(".stage-wrap").getBoundingClientRect = function () { return { bottom: 350 }; };
    window.dispatchEvent(new Event("resize"));
    check(t.observer().options.rootMargin.startsWith("-362px"), "Mobile observation excludes the sticky mountain");
    carry.getBoundingClientRect = function () { return { width: 380, top: 100, bottom: 200 }; };
    t.enter(carry); t.scroll(600);
    check(!carry.classList.contains("mirage-running"), "Text concealed behind the mobile mountain does not consume its reveal");
    carry.getBoundingClientRect = function () { return { width: 380, top: 380, bottom: 420 }; };
    t.scroll(650);
    check(carry.classList.contains("mirage-running"), "The passage reveals once it reaches the visible reading area");
    document.dispatchEvent(new Event("copy"));
    check(carry.textContent === carryText && carry.firstChild === label && !carry.classList.contains("mirage-running"), "Copying restores clean text and preserves nested labels");

    var heading = document.querySelector("h1"), headingText = heading.textContent;
    heading.getBoundingClientRect = carry.getBoundingClientRect;
    t.enter(heading); t.scroll(700);
    check(heading.classList.contains("foil-text") && heading.classList.contains("mirage-running"), "The reveal coexists with holographic heading styling");
    window.dispatchEvent(new Event("beforeprint"));
    check(heading.textContent === headingText && !heading.classList.contains("mirage-running"), "Printing restores English and the permanent foil class");
    document.getElementById("result").textContent = count + " checks passed";
    document.documentElement.dataset.result = "passed";
  } catch (err) {
    document.getElementById("result").textContent = "Failed: " + err.message;
    document.documentElement.dataset.result = "failed";
    console.error(err);
  }
}());
