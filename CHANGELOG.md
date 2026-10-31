# Changelog

All notable changes to The Ridgwell Family Projects (projects.ridgwell.family) are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with sections in a fixed order: Added, Changed,
Fixed, Removed, Security, Deprecated. This project is pre-stable, on [Semantic Versioning](https://semver.org)
`0.x.y`; its first stable release will be its first [Date Version](https://datevers.ing) (`YY.MM.DD`, the UTC release
date), with no 1.0.0.

## v0.2.1

### Changed

- **Get in touch** points to Leo: the email is leo@ridgwell.family and the site button is leo.ridgwell.family.

## v0.2.0

### Added

- **The seasonal overlays**, as on projects.stuxie.dev: a "Today's overlay" button in the header area (for example
  "👻 Spooky season" at Halloween) plays the season's overlay from
  [SeasonalOverlaysLibrary](https://seasonaloverlayslibrary.stuxapis.net) by StuxAPIs, with a credit line under it.
  The Privacy and Cookies pages say it loads from `seasonaloverlayslibrary.stuxapis.net`, and the tests allow that one
  script.

## v0.1.0

### Added

- **The Ridgwell Family Projects**, a static index of the family's public sites and projects for
  projects.ridgwell.family, modelled on StuxieDev Projects and in the family's colours (blue `#2a6bff` on a deep navy
  `#061033`), in dark and light themes with a toggle in the header
- Cards for **The Ridgwell Family** (the.ridgwell.family, marked Maintenance), **Leo JD Ridgwell**
  (leo.ridgwell.family), **Elisia** (elisia.ridgwell.family, Coming soon), **Lily, Poppy, Olly & Dougal**
  (cats.ridgwell.family) and **Status** (status.ridgwell.family, Coming soon)
- The **Boring Legal Stuff** hub at `/legal/`, with the Privacy Policy, Terms and Ethics, Cookies Policy, Imprint,
  Disclaimer and Opt-Out Preferences pages
- The footer: the copyright line, the version number (linking to the changelog), "A Ridgwell Family Project" with the
  family logo, and "Created with love / code / coffee by Leo JD Ridgwell", all in normal case
- A changelog page at `/changelogs/` that renders this file, with its sections always in the fixed order and colours
- A sitemap (`/sitemap/`, `sitemap.xml`), a 404 page, and a favicon set made from the family icon
- Self-hosted fonts (Lato and Poppins): the only off-site requests are the family logo and icon from
  `global.media.ridgwell.family`
- `dev-server.sh` / `dev-server.bat`, with dev mode on by default and `--no-dev-mode` to turn it off
- `commit.sh` / `commit.bat`, which read `VERSION.md`, accept a `0.x.y` or a real, non-future Date Version, refuse
  anything else (including `1.0.0`) and going back to `0.x.y` once a Date Version tag exists, then commit and tag
- `tests/version.sh` and `tests/site.test.js`, run in CI, and the GitHub Pages and release workflows
