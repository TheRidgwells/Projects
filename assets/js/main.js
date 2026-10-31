(function () {
  // Site banners (assets/css/site-banner.css + assets/js/site-banner.js, which measures them).
  // Dev mode shows the dev banner; there, ?banner=soon,maintenance,site previews the others.
  if (window.DEV_MODE) {
    var order = ["maintenance", "soon", "dev", "site"];
    var show = ["dev"];
    var m = /[?&]banner=([^&]*)/.exec(location.search);
    if (m) decodeURIComponent(m[1]).split(",").forEach(function (v) {
      v = v.trim();
      if (order.indexOf(v) >= 0 && show.indexOf(v) < 0) show.push(v);
    });
    var copy = {
      maintenance: ["Maintenance", "status", "The Ridgwell Family Projects is being updated and will be back shortly."],
      soon: ["Coming soon", "status", "The Ridgwell Family Projects is launching soon."],
      dev: ["Dev mode", "note", "Local preview of The Ridgwell Family Projects. Run <code>dev-server.sh --no-dev-mode</code> to see it as production does."],
      site: ["Notice", "note", "A site notice for The Ridgwell Family Projects appears here. <a href=\"https://github.com/TheRidgwells/Projects\">See the source</a>."]
    };
    var box = document.createElement("div");
    box.className = "site-banners";
    box.setAttribute("data-site-banners", "");
    order.forEach(function (v) {
      if (show.indexOf(v) < 0) return;
      var b = document.createElement("div");
      b.className = "site-banner site-banner--" + v;
      b.setAttribute("role", copy[v][1]);
      b.innerHTML = '<span class="site-banner-label">' + copy[v][0] + '</span><span class="site-banner-text">' + copy[v][2] + "</span>";
      box.appendChild(b);
    });
    document.documentElement.classList.add("has-site-banner");
    document.body.insertBefore(box, document.body.firstChild);
  }

  var yearEls = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  // Copyright ranges: data-year-start is the year of the repo's first commit,
  // rendered as "start–current", or just the year while they're the same.
  yearEls.forEach(function (el) {
    var start = parseInt(el.getAttribute("data-year-start"), 10);
    el.textContent = start && start < year ? start + "–" + year : year;
  });

  // One badge per card, above the description. data-state holds the card's
  // declared state(s); the first that applies wins (discontinued, template,
  // maintenance, soon). The HTML already renders it, so this only re-resolves
  // a card with several states. There are no live status badges: those would
  // mean a request to a third party (GitHub) on every visit.
  var STATES = [
    ["discontinued", "archived", "Discontinued"], ["template", "template", "Template"],
    ["maintenance", "maintenance", "Maintenance"], ["soon", "soon", "Coming soon"]
  ];
  function stateOf(card) {
    var have = (card.getAttribute("data-state") || "").split(/\s+/);
    for (var i = 0; i < STATES.length; i++) if (have.indexOf(STATES[i][0]) !== -1) return STATES[i];
    return null;
  }
  function badgeOf(card) {
    var badge = card.querySelector(":scope > .badge-status");
    if (!badge) {
      badge = document.createElement("span");
      badge.hidden = true;
      var desc = card.querySelector(".desc");
      card.insertBefore(badge, desc);
    }
    return badge;
  }
  document.querySelectorAll(".project-card").forEach(function (card) {
    var st = stateOf(card);
    if (!st) return;
    var badge = badgeOf(card);
    badge.className = "badge-status " + st[1];
    badge.textContent = "";
    var ico = document.createElement("i");
    ico.className = "badge-ico";
    ico.setAttribute("aria-hidden", "true");
    badge.appendChild(ico);
    badge.appendChild(document.createTextNode(st[2]));
    badge.hidden = false;
  });
})();

// Footer version link: this site's own VERSION.md, published with the site. If it can't be
// read, the link keeps its fallback text ("Changelog").
(function () {
  var links = document.querySelectorAll("[data-site-version]");
  if (!links.length || !window.fetch) return;
  fetch("/VERSION.md", { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }).then(function (v) {
    v = v.trim().replace(/^v/i, "");
    if (!/^\d+\.\d+\.\d+/.test(v)) return;
    Array.prototype.forEach.call(links, function (a) {
      a.textContent = "v" + v;
      a.setAttribute("title", "Version " + v + ": changelog");
    });
  }).catch(function () {});
})();

// Seasonal overlay button: SeasonalOverlaysLibrary (StuxAPIs) plays the overlay for today's
// season. The button reads "Pumpkins?" until the overlay is running, then "Pumpkins!" while it
// plays. The library is a deferred script, so wait for DOMContentLoaded before using it.
document.addEventListener("DOMContentLoaded", function () {
  var lib = window.SeasonalOverlaysLibrary;
  var btn = document.getElementById("season-btn");
  if (!lib || !btn) return;
  var LABEL = {
    fireworks: "\uD83C\uDF86 Fireworks", hearts: "\u2764\uFE0F Hearts", stpatricks: "\uD83C\uDF40 Shamrocks",
    eastereggs: "\uD83E\uDD5A Easter eggs", rainbows: "\uD83C\uDF08 Pride rainbows", sunny: "\u2600\uFE0F Sunshine",
    pumpkins: "\uD83C\uDF83 Pumpkins", skullsghosts: "\uD83D\uDC7B Spooky season", thanksgiving: "\uD83E\uDD83 Thanksgiving",
    snow: "\u2744\uFE0F Snow", christmas: "\uD83C\uDF84 Christmas", nyeve: "\uD83C\uDF89 New Year's Eve",
    leavesSpring: "\uD83C\uDF31 Spring leaves", leavesSummer: "\uD83C\uDF3F Summer leaves",
    leavesAutumn: "\uD83C\uDF42 Autumn leaves", leavesWinter: "\uD83C\uDF3E Winter leaves"
  };
  var preset = lib.resolveAutoPreset(new Date());
  if (!preset) return;
  var baseLabel = LABEL[preset] || "\u2728 Today's overlay";
  var setActive = function (on) { btn.textContent = baseLabel + (on ? "!" : "?"); };
  var running = function () { return !!document.getElementById("seasonal-overlays-container"); };
  setActive(false);
  btn.hidden = false;
  // The library has no "finished" event, so watch its container: it is added when an overlay
  // starts and removed when it ends (or is stopped).
  new MutationObserver(function () { setActive(running()); }).observe(document.body, { childList: true });
  btn.addEventListener("click", function () {
    setActive(true); // immediate, even if the overlay is suppressed
    // Safety net: if nothing is running shortly after, drop back to "?" once the default duration has passed.
    setTimeout(function () { if (!running()) setActive(false); }, 2600);
  });
});

// Light/dark toggle in the header: flips the theme and remembers it in this browser (ridgwell-projects-theme).
// The <head> script applies a remembered choice before paint; with none, the system theme applies.
(function () {
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
  function current() {
    var t = root.getAttribute("data-theme");
    return t === "light" || t === "dark" ? t : (mq && mq.matches ? "light" : "dark");
  }
  function label() {
    var next = current() === "light" ? "dark" : "light";
    btn.title = "Switch to " + next + " mode";
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
  }
  label();
  if (mq && mq.addEventListener) mq.addEventListener("change", label);
  btn.addEventListener("click", function () {
    var next = current() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ridgwell-projects-theme", next); } catch (e) {}
    label();
    try { window.dispatchEvent(new Event("themechange")); } catch (e) {}
  });
})();
