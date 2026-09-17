# Tasks: Add article series support

## 1. Taxonomy & configuration

- [x] 1.1 Declare the `series` taxonomy in the site config (`exampleSite/hugo.yaml`) and document it in the README — Hugo ignores `taxonomies` from theme config, so it cannot be shipped by the theme

## 2. Series landing page

- [x] 2.1 Create `layouts/series/term.html` rendering the series title/description and the ordered article list (weight first, date fallback), reusing section-card and article-list--compact markup
- [x] 2.2 Add i18n strings for series page labels in `i18n/en.yaml` / `i18n/en.toml` and `i18n/zh-cn.yaml` / `i18n/zh-cn.toml` (fallback: English)

## 3. In-article series navigation box

- [x] 3.1 Create `layouts/_partials/article/components/series.html`: series title link, ordered part list with current article highlighted, prev/next links (gated on `params.article.series.enabled`, default true)
- [x] 3.2 Include the series partial in `layouts/single.html` after the article and before related content

## 4. Styling

- [x] 4.1 Create `assets/scss/partials/article-series.scss` for the series box and series page, imported from `assets/scss/style.scss`, using existing theme variables for light/dark schemes

## 5. Authoring support

- [x] 5.1 Add a `series` field to `archetypes/default.md`
- [x] 5.2 Document series usage (front matter `series`, optional per-post `weight` for ordering) in the theme README

## 6. Verification

- [x] 6.1 Add demo/example series content and run `hugo` build to confirm `/series/<name>/` pages generate and unmodified posts render unchanged
- [x] 6.2 Verify the series box shows correct prev/next links and part highlighting on demo content

## 7. Homepage series section

- [x] 7.1 Create `layouts/_partials/series/home.html`: series card grid (cover, title, count) linking to series pages, sorted by article count, capped by `params.series.limit`, auto-hidden when no series exist
- [x] 7.2 Include the section in `layouts/index.html` between hero and latest posts; add `params.series.showOnHome`/`limit` to `config/_default/params.toml` and `home.series` i18n strings (en, zh-cn)
- [x] 7.3 Style the cards in `assets/scss/partials/article-series.scss` (image cards + flat fallback without cover)
