<p align="center">
  <img src="https://global.media.ridgwell.family/logo.png" width="300" alt="The Ridgwell Family">
</p>

# Contributing to The Ridgwell Family Projects

This is a family project: the repository isn't open to public pull requests, and per the [License](README.md#license) section it isn't licensed for redistribution or reuse. This document exists so anyone with write access works on it consistently.

Questions: [admin@ridgwell.family](mailto:admin@ridgwell.family).

## Local setup

```
git clone https://github.com/TheRidgwells/Projects.git
cd Projects
./dev-server.sh
```

No install step: there's no `package.json`, no dependencies, nothing to build. `dev-server.js` is a single dependency-free Node script; the only requirement is having Node itself installed. Pass `--no-dev-mode` to test the site as it behaves in production (no dev banner).

## Project conventions

- **Plain HTML/CSS/JS, no framework, no build step.** Every page is a real `.html` file: no templating engine, no client-side router.
- **Nothing off-site but the family logo and icon, the seasonal overlay script, and one status fetch.** Fonts (`assets/fonts/`), styles and scripts are served from the site itself: no Google Fonts, no CDNs, no other third-party scripts. The logo and icon come from `https://global.media.ridgwell.family/logo.png` and `/icon.png`. The only live request is the hero eyebrow's status (below), from Ridgwell Status's `summary.json` on GitHub; the project cards have no live status. `tests/site.test.js` enforces this; if it ever has to change, update the Privacy and Cookies pages too.
- **The hero eyebrow is a live status badge.** `<a class="eyebrow" href="https://status.ridgwell.family" data-status-eyebrow="ridgwell:*">` holds `<span class="eyebrow-label">The Ridgwell Family</span><span class="eyebrow-state" hidden></span>`. `assets/js/status-eyebrow.js` reads `https://raw.githubusercontent.com/TheRidgwells/Status/main/data/summary.json` (no-store) and, once it loads, hides the label and shows only the status: "All operational", "Degraded", "Partial outage" (styled as degraded) or "Major outage". `ridgwell:<slug>` follows one monitor instead (Online / Degraded / Offline). It keeps the eyebrow's size, padding, font and pill shape, takes a status badge's colour (`--ok`, `--warn`, `--bad`: text, 10% background, 30% border, 35% when down) and a 7px dot that pulses when up (not under `prefers-reduced-motion`). If the fetch fails, it stays the plain eyebrow. Check dark, light and an outage state (set the class and text in the browser console) after changing it.
- The sitemap (`sitemap.xml`, `sitemap/index.html`, `robots.txt`) is generated: after adding or removing a page, edit the `PAGES` list in `scripts/build-sitemap.py` and run `python scripts/build-sitemap.py`, then commit the result.
- Clean URLs use a folder-per-page layout (`legal/privacy/index.html` → `/legal/privacy/`), not a `.html` suffix.
- Shared styles live in `assets/css/style.css`; shared behaviour in `assets/js/main.js`. Copy the existing header/footer block when adding a page rather than introducing a templating system.
- `assets/js/dev-mode.js` is the production default (`DEV_MODE = false`), committed as-is. `dev-server.js` intercepts that one path locally and serves a generated version instead; see the comment at the top of `dev-server.js`.
- Must work at phone width: check pages at 375px wide.

## The footer

Every page has the same footer: the copyright line ("The Ridgwell Family. All rights reserved."), the links (Boring Legal Stuff, Sitemap, Source, and the version number, which links to the changelog: there is no separate "Changelog" link), then the family brand line ("family logo | A Ridgwell Family Project") and "Created with love / code / coffee by Leo JD Ridgwell". All in normal case: no `text-transform: uppercase` anywhere in the footer.

## Adding or retiring a project card

The projects list has two sections: **Family sites** (personal and family home pages, as featured cards) and **Projects** (everything else).

1. Add/update the entry in the README's project table
2. Add/update the matching `<article class="project-card">` block in `index.html`, and the count in the hero stats
3. Drop a logo/icon into `assets/img/projects/` if the project doesn't already have a suitable square icon there (served from this site, not hot-linked). The family's own projects use badge icons (the family emblem with a small badge), made by `scripts/badge-icons.py`
4. **One badge per card**, above the description, from the card's `data-state` (space-separated; the first that applies wins: `discontinued`, `template`, `maintenance`, `development`, `soon`). Render the matching badge in the HTML, e.g. `<span class="badge-status soon"><i class="badge-ico" aria-hidden="true"></i>Coming soon</span>`. Remove the state when it no longer applies (for example once the.ridgwell.family or leo.ridgwell.family leaves coming soon mode, Elisia's site launches, or Ridgwell Social is out of development).
5. **Only link a repository if it is public**: no "Repository" link on a card for a private or missing repo; write "— (private)" in the README table instead. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public.
6. **Only public sites.** Nothing from the family's private homelab is listed here.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`), each its own folder with an `index.html`, linked from the "Boring Legal Stuff" hub at `legal/index.html`. Keep them in sync with what the site actually does: if analytics, a form, or another off-site request is ever added, the privacy and cookies pages need a real update.

## Branches

Work goes onto `test` (or a branch off it), never straight onto `main`. Changes reach `main` only through a pull
request from `test`, which Leo reviews and merges with a merge commit, and merging is what publishes the site: GitHub
Pages deploys on pushes to `main` (`.github/workflows/pages.yml`), never from `test`. CI runs on `test`, `main` and
every pull request.

## Versioning

This project is **pre-stable**, on [Semantic Versioning](https://semver.org) `0.x.y`. Its first stable release will be its first [Date Versioning](https://datevers.ing) release (`YY.MM.DD`, the UTC release date, with `-1`, `-2`… for later releases the same day); there is no `1.0.0`, and once there is a Date Version there's no going back to `0.x.y`. Declaring the project stable is Leo's call.

To release:

1. Add a `## v0.x.y` entry at the top of `CHANGELOG.md`, with its sections in this order: Added, Changed, Fixed, Removed, Security, Deprecated.
2. Set `VERSION.md` to the same bare version (no `v`).
3. Update `README.md` if anything there changed.
4. Run `bash tests/version.sh` and `node tests/site.test.js`.
5. Run `./commit.sh` (or `commit.bat` on Windows). It checks the version (a `0.x.y` or a real, non-future Date Version; never `1.0.0`, and never `0.x.y` once a Date Version tag exists), commits and tags `v<version>`, and never pushes.
6. On `test`: push `test`, then the tag on its own (`git push origin test`, then `git push origin v<version>`), and
   open a pull request from `test` into `main`. The site changes when Leo merges it.

## Before committing

- Open changed pages in a browser via `./dev-server.sh` and click through, in dark and light, and at phone width
- Check both the dev-mode banner (default) and `--no-dev-mode` behave as expected if you touched `dev-server.js` or `assets/js/dev-mode.js`
- Run the tests (above)
