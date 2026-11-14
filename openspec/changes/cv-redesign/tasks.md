# Tasks

## 1. Scaffold and content

- [x] 1.1 Create branch `cv-redesign`; remove `remote_theme` and `assets/main.scss` import; keep only site settings in `_config.yml` (no CV content). Verify: `bundle exec jekyll build` succeeds.
- [x] 1.2 Write `_data/profile.yml` from `umair-profile.html` (identity, about, metrics, vuln benchmark, PPRO projects, career roles, earlier roles, skills, education, links, `updated`). Verify: `ruby -ryaml -e 'YAML.load_file("_data/profile.yml")'` loads without error.
- [x] 1.3 Merge old `_config.yml` bullets (Wirecard, Nisum, Primatics, Etilize, Sybrid, PTCL) into detail fields; apply "new content wins" on conflicts. Verify: a written diff list of old vs new facts has no unresolved item.
- [x] 1.4 Store email as `user: umair`, `domain: overthosehills.com`; remove the previous personal Gmail address everywhere. Verify: `git grep -i -E "umairr[@]g"` returns nothing in the working tree.

## 2. Layout and styling

- [x] 2.1 Add `_layouts/default.html`, `_includes/*` partials and `index.md` rendering all sections from YAML. Verify: built `_site/index.html` contains every section and role from the YAML.
- [x] 2.2 Write `assets/css/site.css` with palette tokens, pill classes, white default, dark theme, responsive rules. Verify: page at 360 px and 1280 px has no horizontal scroll; contrast check of each pill pair >= 4.5:1.
- [x] 2.3 Add circular photo: copy `~/Downloads/umair.jpg` to `images/profile-circle.jpg` (<150 KB). Verify: `ls -l` size and visual check that it is a circle.
- [x] 2.4 Add inline SVG icon links (LinkedIn, GitHub, email) with aria-labels; no Instagram. Verify: header shows icons only; GitHub href is `https://github.com/umairadeeb`.
- [x] 2.5 Add theme toggle with `localStorage` (try/catch) and pre-paint script. Verify: toggle persists across reload; no flash; print stays light.

## 3. Interactivity

- [x] 3.1 Add `assets/js/cv.js`: career Gantt + slider + readout, driven by YAML JSON. Verify: slider on a 2012 month highlights Etilize; a gap month shows the "between roles" text.
- [x] 3.2 Add PPRO Gantt with click-to-open and tech filter chips with status text. Verify: clicking a bar opens/focuses the card; Kubernetes chip dims non-matching cards and shows the count.
- [x] 3.3 Add Summary / Full detail toggle, animated metric and vulnerability bars, nav highlight, reduced-motion handling. Verify: Full detail opens all details, including earlier-role bullets; with reduced motion enabled nothing animates.
- [x] 3.4 Keyboard and ARIA pass (`aria-pressed`, labels, focus-visible). Verify: all controls operable by keyboard; axe or Lighthouse accessibility check has no critical issues.

## 4. Email protection and PDF

- [x] 4.1 Emit reversed email parts into a data attribute; click handler builds `mailto:`. Verify: a grep of the built page for `mailto:`, `overthosehills` and an email-shaped regex finds nothing; click opens a mail client with `umair@overthosehills.com`.
- [x] 4.2 Add `beforeprint` / `afterprint` handlers that insert and remove the print-only email and expand/restore details. Verify: Save as PDF output shows the email; DOM has no `#print-email` afterwards; Ctrl+P behaves the same.
- [x] 4.3 Write print stylesheet and "Save as PDF" button. Verify: PDF has expanded details, no controls, white background, no clipped pills, reasonable page count.

## 5. Integration

- [x] 5.1 Run `openspec validate cv-redesign` and walk every spec scenario against the local site (Chrome and Safari, phone width). Verify: checklist of scenarios all pass.
- [x] 5.2 Update `README.md` with how to edit `_data/profile.yml`, the date format and how to preview locally. Verify: following the README on a clean clone builds the site.
- [x] 5.3 Resolve the remaining open question (delete or keep unused `landscape-trees.jpg` and `profile.jpg`) with the user before merge. Verify: answer recorded in proposal.md.

## Workflow follow-up

- Merge to `main` after review; confirm GitHub Pages deploys.
- Archive the change after deployment.
