# umairadeeb.github.io

Personal CV site, built with Jekyll on GitHub Pages.

## Edit the content

All CV content lives in [`_data/profile.yml`](_data/profile.yml). Layout, style and scripts need no changes for content edits.

- Dates are `"YYYY-MM"`. Use `present` as the end date for a current role or project.
- Adding a project under `ppro.projects` also adds its Gantt bar and technology filter chips.
- `updated` sets the footer "Last updated" text.
- `email` is stored as `user` and `domain`. It is never printed in the page HTML; it is added to the page only while printing or saving as PDF.
- Fields named `details` or `bullets` show in Full detail mode (or in the project card when opened).

## Preview locally

GitHub Pages needs Ruby 3.x for the `github-pages` gem. With Docker:

```sh
docker run --rm -p 4000:4000 -v "$PWD":/src:ro ruby:3.3 sh -c \
  'cp -r /src /site && cd /site && echo "gem \"webrick\"" >> Gemfile && bundle install && bundle exec jekyll serve --host 0.0.0.0'
```

Open http://localhost:4000.

## Files

| Path | Purpose |
| --- | --- |
| `_data/profile.yml` | All content |
| `_layouts/default.html`, `_includes/` | Page structure |
| `assets/css/site.css` | Styles, palette, dark theme, print layout |
| `assets/js/cv.js` | Timeline, filters, detail toggle, theme, email, PDF |
