<p align="center">
  <img src="https://global.media.ridgwell.family/logo.png" width="300" alt="The Ridgwell Family">
</p>

# The Ridgwell Family Projects

### *The Ridgwell Family's sites and projects, all in one place: [projects.ridgwell.family](https://projects.ridgwell.family)*

[The Ridgwell Family Projects](https://projects.ridgwell.family) is a small, static, no-build-step website that links out to the family's other sites: personal pages, the family cats' page, and the status page that keeps an eye on them all.

- Plain HTML, CSS, and JavaScript: no framework, no bundler, no dependencies to install
- Deployed to [GitHub Pages](https://pages.github.com/) via `.github/workflows/pages.yml`
- No accounts, no ads, no tracking scripts, no cookies
- Fonts and scripts served from the site itself; the only off-site requests are the family logo and icon from `global.media.ridgwell.family`
- Dark and light themes, following your system preference, with a toggle in the header

---

## Projects listed here

| Project | What it is | Site | Repo |
|---|---|---|---|
| The Ridgwell Family | The Ridgwell Family's home page (under maintenance at the moment) | [the.ridgwell.family](https://the.ridgwell.family) | — |
| Leo JD Ridgwell | Leo's personal site: a blog about his work, life and projects, with his experience, portfolio and CV | [leo.ridgwell.family](https://leo.ridgwell.family) | — |
| Elisia | Elisia's site, still being built (a coming-soon page for now) | [elisia.ridgwell.family](https://elisia.ridgwell.family) | — |
| The Ridgwell Archives | The family's retired websites and projects, archived | [archives.ridgwell.network](https://archives.ridgwell.network) | — (private) |
| Lily, Poppy, Olly & Dougal | The Ridgwell cats, being cats: an animated page where the family's cats wander about, with Lily and Dougal remembered there too | [cats.ridgwell.family](https://cats.ridgwell.family) | — (private) |
| Status | Live status of the family's websites | [status.ridgwell.family](https://status.ridgwell.family) | [TheRidgwells/Status](https://github.com/TheRidgwells/Status) |

This table (and the matching cards on the site) is the source of truth for what's listed: update both together when a site is added, retired, or renamed. Only public sites are listed; nothing from the family's private homelab.

## Local development

```
./dev-server.sh          # http://127.0.0.1:8080, DEV_MODE forced on
./dev-server.sh 3000 --no-dev-mode
```

On Windows, use `dev-server.bat` instead. No `npm install` needed: the dev server is a single dependency-free Node script (`dev-server.js`); Node just needs to be installed. See [CONTRIBUTING.md](CONTRIBUTING.md) for more.

## Tests

```
bash tests/version.sh     # VERSION.md, CHANGELOG.md and the commit script's version rules
node tests/site.test.js   # every page's head, footer, embeds and off-site requests; icons; changelog renderer
```

Both also run in CI (`.github/workflows/ci.yml`).

## Versioning

This project is **pre-stable**, on [Semantic Versioning](https://semver.org) `0.x.y` (tags `v0.x.y`). Its first stable release will be its first [Date Versioning](https://datevers.ing) release, numbered by its UTC release date as `YY.MM.DD` (tag `vYY.MM.DD`), with no `1.0.0`; every release after that uses Date Versioning too. See [CHANGELOG.md](CHANGELOG.md) for what changed in each release.

## License

&copy; 2026 The Ridgwell Family. All rights reserved. Made by Leo JD Ridgwell. This repository is not licensed for reuse or redistribution. The fonts in `assets/fonts/` (Lato and Poppins) are under the SIL Open Font License.
