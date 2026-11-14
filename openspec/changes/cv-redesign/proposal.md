# Proposal

## Why

The site renders `_config.yml` content through the remote `modern-resume-theme`. It is static, has outdated content, exposes a personal email in plain text, and offers no PDF export. A newer, interactive CV exists (`umair-profile.html`) but is a standalone file, not editable through YAML. Merge the two so the owner edits one YAML file and gets a modern, interactive, printable CV.

## What Changes

- Replace `modern-resume-theme` with a custom Jekyll layout, CSS and JS (stays deployable on GitHub Pages; no build tooling).
- Move CV content from `_config.yml` to `_data/profile.yml`. `_config.yml` keeps only site settings. The attached file's content wins on every conflict; content in the old config that the attached file does not cover (long bullets for Wirecard, Nisum, Primatics, Etilize, Sybrid, PTCL) is kept and shown in Full detail mode only.
- Port interactive features from `umair-profile.html`: career slider timeline, PPRO project Gantt, technology filter chips, animated vulnerability bars, section nav highlight, Summary / Full detail toggle, reduced-motion support.
- White background by default, plus a user-switchable dark theme (old config had `darkmode: true`).
- New palette: `#1AB8CF`, `#0A8AA2`, `#0B3C49`, `#101820`, `#E0FBFC`. Dates, positions and locations appear in pill boxes; technologies as outlined pills.
- Profile photo shown in a circle, using the new 400x400 photo (replaces the 1.4 MB `images/umairadeeb.jpg`).
- Header links are icon-only: LinkedIn, GitHub (`github.com/umairadeeb`), email. Instagram is dropped.
- Email uses the alias `umair@overthosehills.com`. It is stored split in YAML, absent from page HTML, assembled on click for `mailto:`, and injected into the DOM only during printing so it appears in the exported PDF.
- "Save as PDF" button calls `window.print()` with a print stylesheet.
- Remove the previous personal Gmail address from tracked files. **It remains in git history.**

## Capabilities

### New Capabilities
- `cv-content-model`: structure and rules of `_data/profile.yml`, the single editable source for all CV content, and how it is rendered at build time.
- `cv-page-presentation`: layout, palette, pill styling, circular photo, light/dark themes, responsive behaviour.
- `cv-interactive-views`: timeline slider, Gantt, technology filter, Summary / Full detail toggle, animations and reduced-motion behaviour.
- `cv-contact-and-export`: icon links, email protection and PDF export via print.

### Modified Capabilities
<!-- None: openspec/specs/ is empty. -->

## Impact

- Files: `_config.yml` (trimmed, theme removed), `index.md`, `assets/main.scss` (replaced), new `_layouts/`, `_includes/`, `_data/profile.yml`, `assets/` CSS/JS, `images/`.
- Dependencies: remove `modern-resume-theme`; `Gemfile` (`github-pages`) unchanged. Google Fonts loaded from CDN as in the attached file.
- Out of scope: Instagram, static pre-built PDF, blog, rewriting git history to purge the old email.

## Decisions Confirmed

- Pill shape: fully rounded (preview A).
- Footer "Last updated": read from YAML; initial value "November 2026".
- Favicon: keep `images/favicon.ico`.
- Meta description and page title: attached file text, stored in YAML.
- Photo source: `~/Downloads/umair.jpg` (400x400 JPEG, 31 KB).

## Open Questions

- Unused images (`landscape-trees.jpg`, `profile.jpg`, `umairadeeb.jpg`): deleted (confirmed by user). Safari check deferred by user until after deploy.
