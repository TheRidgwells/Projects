# Changelog

All notable changes to The Ridgwell Family Projects (projects.ridgwell.family) are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with sections in a fixed order: Added, Changed,
Fixed, Removed, Security, Deprecated. This project is pre-stable, on [Semantic Versioning](https://semver.org)
`0.x.y`; its first stable release will be its first [Date Version](https://datevers.ing) (`YY.MM.DD`, the UTC release
date), with no 1.0.0.

## v0.5.1

### Changed

- `scripts/badge-icons.py` takes `--size=512`, for Ridgwell Social's instance avatar.

### Fixed

- **The Ridgwell Family** card says **Coming soon**, not Maintenance: the.ridgwell.family is a coming-soon page
  while it's rebuilt, and already answers for everyone's @ridgwell.family Fediverse handle.
- **Leo JD Ridgwell**'s card describes the rebuilt site (PHP: experience, portfolio, reports and CV), marked
  **Coming soon**, with a link to the original WordPress site at v1-leo.ridgwell.family.

## v0.5.0

### Added

- **New project icons** for Ridgwell Social, Status and this site, in the badge style projects.stuxie.dev uses: the
  family emblem on a round navy avatar in a Ridgwell blue ring, with a badge in the corner. Ridgwell Social's badge
  is the Fediverse mark, Status's a heartbeat line, and Projects' a `<•>`. `scripts/badge-icons.py` (Pillow) makes
  them.
- **The Ridgwell Family Projects** (this site) has its own card. The hero counts 8 sites.

### Changed

- The Discord embed lists Ridgwell Social and this site, and counts 8 sites.

### Removed

- The old Status icon (`status.svg`), replaced by the new one.

## v0.4.0

### Added

- **Ridgwell Social** (social.ridgwell.family): the family's own Fediverse server, GoToSocial with a Ridgwell Family
  theme, with an **In development** badge until it's live. Its repository is private, so the card links the website
  only. The hero counts 7 sites.
- **An In development badge** (`data-state="development"`), with a code-brackets glyph, as on projects.stuxie.dev.

## v0.3.0

### Added

- **The Ridgwell Archives** (archives.ridgwell.network): the family's retired websites and projects, with the Ridgwell
  Archives' own icon (the family logo on its navy square, as the LJDR Archives has). The hero counts 6 sites.

### Fixed

- The Status card no longer carries the "coming soon" state: status.ridgwell.family is live.

## v0.2.3

### Changed

- **The footer is one row, as on services.stux.group**: the copyright on the left, the links in the middle, and the
  family logo with "Created with… by Leo JD Ridgwell" on the right (it was a second, centred row).

## v0.2.2

### Added

- **A Status link in every footer**, to status.ridgwell.family, as on services.stux.group.

### Removed

- The "A Ridgwell Family Project" line beside the footer logo: the logo and the "Created with…" credit stay, as on
  services.stux.group.

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
