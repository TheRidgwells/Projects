#!/usr/bin/env node
// Static-site checks: node tests/site.test.js
// Every page's favicon tags, Discord component embed, footer (the family brand line, normal case,
// the version linking to the changelog, the Boring Legal Stuff link) and off-site requests; the
// web-root icon files; the legal hub; and the changelog renderer's version headings and section order.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const ROOT = path.join(__dirname, "..");
let pass = 0, fail = 0;
function check(name, fn) {
  try { fn(); pass++; console.log("ok   - " + name); }
  catch (e) { fail++; console.log("FAIL - " + name + ": " + e.message); }
}
const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");

function pages(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules" || e.name === "tests") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(pages(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

// The only off-site thing a page may load: the family logo and icon.
const OFFSITE_OK = /^https:\/\/(global\.media\.ridgwell\.family\/(logo|icon)\.png|seasonaloverlayslibrary\.stuxapis\.net\/seasonal-overlays-library\.js)$/;
const ALLOWED = new Set([1, 2, 9, 10, 11, 12, 14, 17]);
function walk(c, f) { f(c); (c.components || []).forEach(x => walk(x, f)); if (c.accessory) walk(c.accessory, f); }

for (const file of pages(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  if (!/<head/.test(html)) continue;
  const head = html.slice(html.indexOf("<head"), html.indexOf("</head>"));
  const redirect = rel === "changelog/index.html";

  check(rel + ": favicon tags", () => {
    assert(head.includes('<link rel="icon" href="/favicon.ico" sizes="48x48">'));
    assert(head.includes('<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png">'));
    assert(head.includes('<link rel="apple-touch-icon" href="/apple-touch-icon.png">'));
    assert(head.includes('<link rel="manifest" href="/site.webmanifest">'));
  });

  check(rel + ": loads nothing off-site but the family logo and icon", () => {
    const re = /<(script|link|img|iframe|source|video|audio)\b[^>]*?\s(?:src|href)="([^"]+)"/gi;
    let m;
    while ((m = re.exec(html))) {
      const url = m[2];
      if (m[1].toLowerCase() === "link" && !/rel="(stylesheet|icon|apple-touch-icon|manifest|preload|modulepreload)"/.test(m[0])) continue;
      if (/^(https?:)?\/\//i.test(url)) assert(OFFSITE_OK.test(url), "off-site " + m[1] + ": " + url);
    }
    assert(!/@import|fonts\.googleapis|fonts\.gstatic|cdnjs|jsdelivr|unpkg/i.test(html), "third-party font/CDN reference");
  });

  if (!redirect) {
    check(rel + ": footer brand line, credit, version link and legal link", () => {
      const footer = html.slice(html.indexOf('<footer class="site-footer">'), html.indexOf("</footer>"));
      assert(footer, "no footer");
      assert(footer.includes('<a class="brand-footer-text" href="/">A Ridgwell Family Project</a>'), "brand line");
      assert(footer.includes('src="https://global.media.ridgwell.family/logo.png"'), "family logo");
      assert(/by <a href="https:\/\/leo\.ridgwell\.family"[^>]*>Leo JD Ridgwell<\/a>/.test(footer), "credit");
      assert(footer.includes("The Ridgwell Family. All rights reserved."), "copyright");
      assert(footer.includes('<a href="/legal/">Boring Legal Stuff</a>'), "legal link");
      const version = footer.match(/<a [^>]*data-site-version[^>]*>/g) || [];
      assert.strictEqual(version.length, 1, "one version link");
      assert(version[0].includes('href="/changelogs/"'), "version link goes to the changelog");
      const toChangelog = footer.match(/<a [^>]*href="\/changelogs?\/"[^>]*>/g) || [];
      assert.strictEqual(toChangelog.length, 1, "no separate changelog link");
      assert(!/style="[^"]*uppercase/i.test(footer), "inline uppercase in the footer");
    });
  }

  const m = head.match(/<script id="discord:component-embed" type="application\/json">([\s\S]*?)<\/script>/);
  if (rel === "404.html" || redirect) {
    check(rel + ": no Discord embed", () => assert(!m && !head.includes("discord:component-embed")));
    continue;
  }
  check(rel + ": Discord embed is valid", () => {
    assert(m, "embed missing");
    assert(Buffer.byteLength(m[1]) <= 3000, "over 3000 bytes");
    assert(!/\\$1|\$1/.test(m[1]), 'contains "$1"');
    const root = JSON.parse(m[1]).component;
    assert.strictEqual(root.type, 17);
    assert.strictEqual(root.accent_color, 0x2a6bff);
    let count = 0;
    (root.components || []).forEach(c => walk(c, x => {
      count++;
      assert(ALLOWED.has(x.type), "type " + x.type);
      assert.notStrictEqual(x.type, 17, "nested container");
      if (x.type === 2) {
        assert.strictEqual(x.style, 5);
        assert(/^https?:\/\//.test(x.url));
        for (const k of Object.keys(x)) assert(["id", "type", "url", "style", "label", "emoji", "disabled"].includes(k), "button key " + k);
      }
    }));
    assert(count <= 40);
  });
}

check("no text-transform: uppercase in any footer rule", () => {
  const css = read("assets/css/brand-footer.css");
  assert(!/uppercase/i.test(css), "brand-footer.css");
  const style = read("assets/css/style.css");
  const rules = style.match(/[^{}]+\{[^}]*\}/g) || [];
  for (const r of rules) {
    const sel = r.slice(0, r.indexOf("{"));
    if (/footer|made-with|brand-mark|data-site-version|copyright/i.test(sel)) assert(!/uppercase/i.test(r), sel.trim());
  }
});

check("the legal hub links all six sub-pages, and each exists", () => {
  const hub = read("legal/index.html");
  for (const s of ["privacy", "terms", "cookies", "imprint", "disclaimer", "opt-out"]) {
    assert(hub.includes('href="/legal/' + s + '/"'), s);
    assert(fs.existsSync(path.join(ROOT, "legal", s, "index.html")), s + " page");
  }
});

check("CNAME is projects.ridgwell.family", () => {
  assert.strictEqual(read("CNAME").trim(), "projects.ridgwell.family");
});

check("favicon.ico is a PNG-in-ICO with 16, 32 and 48", () => {
  const b = fs.readFileSync(path.join(ROOT, "favicon.ico"));
  assert.strictEqual(b.readUInt16LE(2), 1);
  const n = b.readUInt16LE(4), sizes = [];
  for (let i = 0; i < n; i++) sizes.push(b[6 + i * 16] || 256);
  assert.deepStrictEqual(sizes.sort((a, c) => a - c), [16, 32, 48]);
});

check("apple-touch-icon.png is 180x180", () => {
  const b = fs.readFileSync(path.join(ROOT, "apple-touch-icon.png"));
  assert.strictEqual(b.readUInt32BE(16), 180); assert.strictEqual(b.readUInt32BE(20), 180);
});

check("site.webmanifest has the required fields and icons exist", () => {
  const w = JSON.parse(read("site.webmanifest"));
  assert(w.name && w.short_name && w.start_url === "/" && w.display === "browser" && w.theme_color && w.background_color);
  assert(w.icons.some(i => i.sizes === "192x192"));
  assert(w.icons.some(i => i.sizes === "512x512" && i.purpose === "maskable"));
  w.icons.forEach(i => assert(fs.existsSync(path.join(ROOT, i.src)), i.src));
});

check("main.js and changelogs.js fetch nothing off-site", () => {
  for (const f of ["assets/js/main.js", "assets/js/changelogs.js"]) {
    const js = read(f);
    const fetches = js.match(/fetch\(([^,)]+)/g) || [];
    fetches.forEach(c => assert(!/https?:/.test(c), f + ": " + c));
    assert(!/raw\.githubusercontent/i.test(js), f);
  }
});

// The changelog renderer must accept SemVer and Date Version headings and keep the global section order.
check("changelog renderer handles ## v0.x.y, ## vYY.MM.DD and -N headings, in section order", () => {
  const md = "# Changelog\n\n## v26.10.23-1\n\n### Deprecated\n\n- d\n\n### Fixed\n\n- f\n\n### Security\n\n- s\n\n### Added\n\n- a\n\n### Removed\n\n- r\n\n### Changed\n\n- c\n\n## v26.10.23\n\n### Changed\n\n- c\n\n## v0.1.0\n\n### Added\n\n- first\n";
  const els = { "cl-body": { innerHTML: "" }, "cl-version": { textContent: "" } };
  const sandbox = {
    document: { getElementById: id => els[id] },
    fetch: url => Promise.resolve({ ok: true, text: () => Promise.resolve(/CHANGELOG/.test(url) ? md : "0.1.0\n") }),
  };
  vm.runInNewContext(read("assets/js/changelogs.js"), sandbox);
  return new Promise(r => setTimeout(r, 50)).then(() => {
    const h = els["cl-body"].innerHTML;
    assert(h.includes("<h2>v26.10.23-1</h2>") && h.includes("<h2>v26.10.23</h2>") && h.includes("<h2>v0.1.0</h2>"));
    const first = h.slice(0, h.indexOf("<h2>v26.10.23</h2>"));
    const order = ["added", "changed", "fixed", "removed", "security", "deprecated"].map(t => first.indexOf("cl-label-" + t));
    assert(order.every(i => i > 0) && order.every((v, i) => !i || v > order[i - 1]), "order " + order);
    assert.strictEqual(els["cl-version"].textContent, "v0.1.0");
  }).then(() => { console.log("ok   - (async) changelog renderer"); }, e => { console.log("FAIL - changelog renderer: " + e.message); process.exitCode = 1; });
});

check("changelog badge colours are the fixed palette", () => {
  const css = read("assets/css/style.css");
  const want = { added: "#2ecc71", changed: "#3ba7ff", fixed: "#ffa64d", removed: "#ff4d4d", security: "#b06bff", deprecated: "#8a8a94" };
  for (const [k, v] of Object.entries(want)) assert(css.includes(".cl-label-" + k + " { --cl: " + v + "; }"), k);
});

console.log(pass + " passed, " + fail + " failed");
if (fail) process.exitCode = 1;
