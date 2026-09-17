# Change: Add article series support

## Why

The theme currently has no way to group related posts into a series. Readers who land on one part of a multi-part article have no in-page way to see the full sequence or navigate to the previous/next part, and there is no dedicated page to read a whole series in order. Adding a series feature improves reading experience and keeps readers on the site.

## What Changes

- Support a `series` taxonomy so posts can declare `series: ["<name>"]` in front matter and Hugo generates `/series/` and `/series/<name>/` pages. Hugo does not merge `taxonomies` from theme config, so the site must declare it (documented in README; `exampleSite` updated).
- Add a dedicated series term page layout that lists the series' articles in reading order (front-matter `weight` first, date as fallback).
- Add a series navigation box on article pages: series title linking to the series page, an ordered list of all parts with the current one highlighted, and previous/next links.
- Add i18n strings for the series UI (English and Simplified Chinese; other languages fall back to English).
- Add a `series` field to the post archetype so new posts can declare a series easily.

## Capabilities

### New Capabilities
- `article-series`: Grouping posts into named series, with an ordered series landing page and in-article series navigation (series box with part list and prev/next links).

### Modified Capabilities
<!-- No existing specs to modify (openspec/specs/ is empty) -->

## Impact

- Affected code:
  - `layouts/series/term.html` (new): series landing page
  - `layouts/_partials/article/components/series.html` (new): series navigation box
  - `layouts/single.html`: include the series box on article pages
  - `assets/scss/partials/article-series.scss` (new): styles for the series box
  - `i18n/en.{yaml,toml}`, `i18n/zh-cn.yaml`: new series strings
  - `archetypes/default.md`: add `series` field
  - `exampleSite/hugo.yaml`: declare the `series` taxonomy for the demo site
  - `README.md`: series usage documentation
- No breaking changes; posts without `series` front matter are unaffected.
