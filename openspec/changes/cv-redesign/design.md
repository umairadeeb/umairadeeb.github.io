# Design

## Context

Current repo (observed): Jekyll on GitHub Pages (`github-pages` gem), `remote_theme: modern-resume-theme` configured in `_config.yml`, all CV content in `_config.yml`, `index.md` only sets `layout: default`, `assets/main.scss` imports the theme. No `_layouts`, `_includes` or `_data`. `images/umairadeeb.jpg` is 1.4 MB. Source design: `umair-profile.html` (single file, vanilla JS, SVG Gantt, details/summary cards). See proposal.md for motivation.

GitHub Pages restricts Jekyll to its allowed plugin list and Liquid 4, with no Node build step.

## Goals / Non-Goals

**Goals:**
- Same look and behaviour as `umair-profile.html`, restyled with the new palette, driven by `_data/profile.yml`.
- Zero build tooling beyond what GitHub Pages already runs.

**Non-Goals:**
- No static-site framework swap, no Node/npm pipeline, no CMS.
- No purging of git history.

## Decisions

1. **Custom layout, theme removed.** Add `_layouts/default.html`, `_includes/` partials (header, about, career, impact, ppro, earlier, skills, education, footer), `assets/css/site.css` (with print rules) and `assets/js/cv.js`. Remove `remote_theme` and `assets/main.scss`. *Alternative:* theme overrides, rejected: fights the theme to reach the target design.
2. **Content in `_data/profile.yml`.** Liquid renders HTML at build time, so content works without JS. Dates are `YYYY-MM`. JS reads timeline data from `data-*` attributes (as the attached file does for projects) and from a JSON block emitted by Liquid (`{{ site.data.profile.career | jsonify }}`). *Alternative:* browser-side YAML parsing, rejected: needs a library and shows empty content if JS fails.
3. **Colour tokens as CSS variables.** `--cyan #1AB8CF`, `--teal #0A8AA2`, `--deep #0B3C49`, `--ink #101820`, `--wash #E0FBFC`. Pills: role = deep/white, date = cyan/ink, location = wash/deep, tags = outlined teal on deep text. Dark theme redefines variables under `[data-theme="dark"]`, stored in `localStorage` (try/catch), applied before paint by an inline head script to avoid flash. Print forces light.
4. **Pill shape.** Fully rounded (`border-radius: 999px`) assumed from preview A; one variable (`--pill-radius`) so it can change in one line.
5. **Email protection.** YAML keeps `email.user` and `email.domain`. Liquid emits each reversed (`split: "" | reverse | join: ""`) into a `data-` attribute on the email icon (a `<button>`, no `href`), so neither `@`, `mailto:` nor the plain domain appears in served HTML. JS un-reverses. Click: `location.href = "mailto:" + user + "@" + domain`. `beforeprint` appends a `<span id="print-email">` to the header; `afterprint` removes it. *Alternative:* contact form, rejected by user choice. Limit: JS-executing bots can still decode; this stops regex scrapers only.
6. **PDF via `window.print()`.** `beforeprint` also opens all `<details>` (restored on `afterprint`). Print CSS: hide rail nav, controls, slider, filters, readout; single column; `@page` margin 16 mm; `break-inside: avoid` on cards. *Alternative:* static PDF, rejected by user: goes stale.
7. **Photo.** Copy `~/Downloads/umair.jpg` (already 400x400, 31 KB, under the 150 KB limit) to `images/profile-circle.jpg` without re-encoding; CSS `border-radius: 50%; object-fit: cover`. Delete the 1.4 MB original only after confirming with the user.
8. **Icons.** Inline SVG (LinkedIn, GitHub, mail) with `aria-label`; no icon font or CDN.
9. **Fonts.** Domine + IBM Plex Sans via Google Fonts (as in the attached file). Open question: self-host later for privacy/performance.
10. **Footer date.** `profile.updated` in YAML (e.g. `"November 2026"`) rather than hardcoded text.

## Risks / Trade-offs

- [Liquid reverse trick is trivially decodable] → acceptable; combined with alias address, which can be disabled in Cloudflare Email Routing.
- [Email printed in PDF can be scraped from shared PDFs] → alias is revocable.
- [Old address stays in git history] → note only; user can rotate or purge later.
- [Print layout differs across browsers] → verify in Chrome and Safari; `print-color-adjust: exact` for pill fills.
- [Gantt SVG drawn at load can mis-size when hidden or resized] → redraw on `resize`, as needed.
- [Content merge errors between old and new text] → task to diff old `_config.yml` content against YAML.
- [Lighthouse a11y: `#1AB8CF` fills] → ink text only, per spec.

## Migration Plan

1. Build the new layout and `_data/profile.yml` on a branch; run `bundle exec jekyll serve` locally.
2. Verify specs (scenarios), then merge to `main`; GitHub Pages deploys automatically.
3. Rollback: `git revert` the merge commit; theme-based site returns.
