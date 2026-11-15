/* Booking calendar for gnarcoding.com/book, powered by Cal.com's inline embed. */
(function () {
  "use strict";

  // The Cal.com event to book: "username/event-slug".
  var CAL_LINK = "rick/get-rick-rolled";

  var BOOKING_URL = "https://cal.com/" + CAL_LINK;
  var statusEl = document.getElementById("calStatus");
  var linkEl = document.getElementById("calLink");
  if (linkEl) linkEl.href = BOOKING_URL;

  var ready = false;
  function showError() {
    if (ready || !statusEl) return;
    statusEl.classList.add("is-error");
    statusEl.innerHTML = "";
    var p = document.createElement("span");
    p.textContent = "The calendar didn't load here. ";
    var a = document.createElement("a");
    a.href = BOOKING_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Book on Cal.com instead";
    statusEl.append(p, a);
  }
  function markReady() {
    ready = true;
    if (statusEl) statusEl.hidden = true;
  }

  // Cal.com's standard loader: queues calls until embed.js arrives.
  (function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var d = C.document;
    C.Cal = C.Cal || function () {
      var cal = C.Cal;
      var ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        var s = d.createElement("script");
        s.src = A;
        s.onerror = showError;
        d.head.appendChild(s);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        var api = function () { p(api, arguments); };
        var namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  var NS = "book";
  Cal("init", NS, { origin: "https://cal.com" });
  Cal.ns[NS]("inline", {
    elementOrSelector: "#cal-inline",
    calLink: CAL_LINK,
    config: { layout: "month_view", theme: "auto" }
  });
  Cal.ns[NS]("ui", {
    theme: "auto",
    layout: "month_view",
    hideEventTypeDetails: true,
    cssVarsPerTheme: {
      light: { "cal-brand": "#1b2230" },
      dark: { "cal-brand": "#e2be62" }
    }
  });
  Cal.ns[NS]("on", { action: "linkReady", callback: markReady });
  Cal.ns[NS]("on", { action: "linkFailed", callback: showError });

  // If the embed never reports in, offer the direct link.
  setTimeout(function () {
    if (ready) return;
    var frame = document.querySelector("#cal-inline iframe");
    if (frame) markReady(); else showError();
  }, 15000);
})();
