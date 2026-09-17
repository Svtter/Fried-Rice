# Design: Add article series support

## Context

The theme (a Hugo theme, Stack-derived) currently groups content only via the default `tags`/`categories` taxonomies. Posts render through `layouts/single.html` → `layouts/_partials/article/article.html`; taxonomy term pages fall back to `layouts/_default/list.html`. There is no ordering concept and no cross-post navigation, so multi-part articles are hard to follow.

Constraints:
- Hugo ≥ 0.157 (extended) is the minimum, per `config/_default/module.toml`.
- The theme ships its own `config/_default/` files, which merge into the site's configuration.
- i18n strings must be added to both `.toml` and `.yaml` variants where the theme maintains both (`en`, `zh-cn`); English is the fallback language.

## Goals / Non-Goals

**Goals:**
- Author can mark a post as part of a series with one front-matter line: `series: ["name"]`.
- Each series gets a landing page (`/series/<name>/`) listing its articles in intended reading order.
- Each post in a series shows a navigation box (series title + part list + prev/next), so readers never lose the thread.
- Zero impact on posts and sites that do not use the feature.

**Non-Goals:**
- Nested sub-series or a post belonging to multiple series with separate navigation per series (a post in several series shows the box for the first series only).
- Sidebar widgets, RSS-level series feeds, or reading-progress features.
- Translations for all ~30 bundled languages (English and Simplified Chinese ship; the rest fall back).

## Decisions

- **Use a Hugo taxonomy named `series`.** Alternatives: a `series` page-bundle under content, or manual prev/next front-matter links. A taxonomy gives us free listing pages, RSS, and term metadata, and matches how tags/categories already work in this theme. Posts in multiple series are technically allowed by Hugo; the article box picks the first series term for navigation.

- **The `series` taxonomy must be declared in the site config; the theme cannot ship it.** Hugo does not merge `taxonomies` from theme/module config (verified empirically: a `config/_default/taxonomies.toml` in the theme is silently ignored, even with `_merge = "deep"`). So the feature requires three lines in the site's config, documented in the README and pre-configured in `exampleSite`. If a site declares any taxonomy, Hugo's defaults (`tags`, `categories`) are replaced, so the docs show adding `series` alongside existing entries.

- **Ordering: front-matter `weight` ascending first, then date ascending.** The box and the landing page must agree, so both use the same chained sort: `sort (sort .Pages "Date" "asc") "Params.weight" "asc"` (the last sort is primary; pages without a weight sort as weight 0 within that rule). Documented in the spec as "weight first, date fallback".

- **Series landing page: dedicated `layouts/series/term.html`, falling back gracefully.** Hugo's lookup order checks `series/term.html` before `_default/term.html`/`list.html`, so the dedicated layout only affects the `series` taxonomy. It reuses the existing `.section-card` / `.article-list--compact` markup from `layouts/_default/list.html` so the visual language stays consistent.

- **In-article box as a partial: `layouts/_partials/article/components/series.html`, included from `layouts/single.html` after the article and before related content.** Alternatives: inside `article.html` (couples taxonomy logic into the core article partial) or a widget (requires user opt-in, weaker default). A partial gated on `.Params.series` keeps default-on behavior with a single-line opt-out (`params.article.series.enabled = false`).

- **i18n keys under `article.series.*`** following the existing `article.*` structure (`seriesLabel`, `part`, `prev`, `next`, plus `list.series` reused from existing `list` strings where possible).

- **SCSS in a new partial `assets/scss/partials/article-series.scss`, imported from `style.scss`**, reusing `$--primary` / card variables so light and dark schemes both work.

- **Series cover image comes from the term's own content file.** `content/series/<name>/_index.md` front matter (`image`, `description`) is picked up by the taxonomy term (same mechanism Stack already uses for categories), so no separate data file or params map is needed. The cover renders as a banner on the series landing page and at the top of the in-article series box, reusing the existing `helper/image` partial and `imageProcessing.cover` setting.

- **Homepage series section: dedicated partial + params, no widget.** A `layouts/_partials/series/home.html` partial is included from `layouts/index.html` between hero and latest posts. It iterates `.Site.GetPage "series"` terms (so it no-ops when the taxonomy is missing), sorts by article count descending, and caps at `params.series.limit` (default 4). Cards are custom markup (not the subsection tile) because they need an article-count label; series without a cover get a flat accent-bordered card.

## Risks / Trade-offs

- **Sites must declare the `series` taxonomy themselves** (Hugo limitation) → Mitigation: README documents the exact snippet; `exampleSite` ships it pre-configured.
- **Posts in multiple series** show only the first series box → Mitigation: documented non-goal; box links to the series page where all series are listed.
- **Unweighted + weighted mixing** can surprise authors (unweighted posts sort before weighted ones when treated as weight 0) → Mitigation: document recommending explicit weights for series posts; the archetype leaves `series` empty so nothing sorts unexpectedly by default.

## Migration Plan

Purely additive. Existing sites upgrade the theme, optionally set `series` in post front matter; nothing else changes. Rollback = remove `series` values from front matter and revert the theme files.

## Open Questions

- Whether to later add a sidebar "all series" widget — deferred until usage proves it is wanted.
