// The hero's eyebrow as a live status badge. An eyebrow marked data-status-eyebrow="<source>:*" (the whole
// status page) or "<source>:<slug>" (one monitor) swaps its label for the status, "All operational",
// "Degraded", "Partial outage" or "Major outage" (one monitor: Online / Degraded / Offline), and takes a
// status badge's colour and dot. This is the site's one off-site request: Ridgwell Status's summary.json,
// on GitHub. If it can't be read, the eyebrow stays exactly as it is.
(function () {
  var SOURCES = {
    ridgwell: { url: "https://raw.githubusercontent.com/TheRidgwells/Status/main/data/summary.json", site: "status.ridgwell.family" }
  };
  var WHOLE = { up: "All operational", degraded: "Degraded", partial: "Partial outage", down: "Major outage" };
  var ONE = { up: "Online", degraded: "Degraded", down: "Offline" };

  function wantOf(el) {
    var v = el.getAttribute("data-status-eyebrow") || "";
    var i = v.indexOf(":");
    return i < 0 ? { source: "ridgwell", slug: v } : { source: v.slice(0, i), slug: v.slice(i + 1) };
  }

  var els = Array.prototype.slice.call(document.querySelectorAll("[data-status-eyebrow]"));
  if (!els.length || !window.fetch) return;
  var wanted = {};
  els.forEach(function (el) { var s = wantOf(el).source; if (SOURCES[s]) wanted[s] = true; });

  Object.keys(wanted).forEach(function (source) {
    fetch(SOURCES[source].url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (summary) {
      var bySlug = {};
      (summary.monitors || []).forEach(function (m) { bySlug[m.slug] = m; });
      els.forEach(function (el) {
        var want = wantOf(el);
        if (want.source !== source) return;
        var whole = want.slug === "*";
        var status = whole ? summary.status : (bySlug[want.slug] || {}).status;
        var text = whole ? WHOLE[status] : ONE[status];
        var state = el.querySelector(".eyebrow-state");
        var label = el.querySelector(".eyebrow-label");
        if (!text || !state) return;
        el.classList.remove("up", "degraded", "down");
        el.classList.add(status === "partial" ? "degraded" : status);
        state.textContent = text;
        state.hidden = false;
        if (label) label.hidden = true;
        el.title = "Live from " + SOURCES[source].site;
      });
    }).catch(function () {});
  });
})();
