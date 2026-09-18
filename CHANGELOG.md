# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-09-18

### Fixed
- In-article series navigation box silently missing when the series name contains non-ASCII characters (e.g. CJK): the lookup built the series page path with `urlize`, which percent-encodes non-ASCII characters in recent Hugo versions, so `GetPage` never matched the real term page. The lookup now passes the raw series name and lets `GetPage` normalize the path
- "Latest posts" listings (homepage, archives, widgets, section and taxonomy lists) ordered by `weight` instead of date whenever any post carries a front-matter `weight` — most visibly after v1.3.0 introduced series weights, which pushed series posts to the top of every listing. List pages now sort by date descending by default (`params.sortBy: lastmod` still switches to last-modified descending); `weight` keeps affecting only the ordering inside series
- Homepage series cards never rendered the series `description` from `content/series/<name>/_index.md` — the partial only output the title and article count. Cards now show the description (clamped to two lines) between the title and the count

### Changed
- Series article ordering is now newest-first on the series landing page and in the in-article series box: `weight` sorts descending (higher weight shown earlier) with publication date (newest first) as the fallback for unweighted posts. The previous ascending order pushed ongoing series' latest chapters to the bottom of the list. Previous/next links follow the displayed order (previous = newer chapter)
- Series landing pages listed chapters as title + date only, with no way to tell what an article is about before opening it. A dedicated `article-list/series-item` partial now renders the article `description` (clamped to two lines) below the title and date; articles without a description render as before

## [1.3.0] - 2026-09-17

### Added
- Article series support: posts sharing a `series: ["<name>"]` front-matter value form a series. Each series gets a landing page at `/series/<name>/` (cover banner, description, articles ordered by `weight` with date as fallback), and every post in a series shows a navigation box with the ordered part list (current part highlighted) and previous/next links that include the adjacent post titles. Series covers/descriptions are configured via `content/series/<name>/_index.md` (`image` / `description`) (#47, #48)
- Homepage series section: series displayed as cards in the same proportions as article cards (cover, title, article count), ordered by article count and linking to each series page; hidden automatically when the site has no series. Configurable via `params.series.showOnHome` (default true) and `params.series.limit` (default 4) (#48)
- Series UI strings for `en` and `zh-cn` (other languages fall back to English), plus a `series` icon and `series` / `weight` fields in the post archetype (#48)

### Notes
- The `series` taxonomy must be declared in the site configuration (`taxonomies: series: series`): Hugo does not merge `taxonomies` from theme config, so the theme cannot register it on the user's behalf. Documented in the README; the demo site ships a two-part "Theme Walkthrough" series as a live example (#48)
- The in-article series box can be disabled globally with `params.article.series.enabled: false` while keeping the landing pages (#48)
- OpenSpec change proposal lives at `openspec/changes/add-article-series/` (archive with `openspec archive add-article-series` after deployment) (#48)

## [1.2.1] - 2026-08-27

### Fixed
- Desktop hero layout: the 4/5 hero visual spans both grid rows and its intrinsic height exceeded the text column's natural height, stretching the rows apart — a large dead gap (~140px at 1440px+ viewports, vs the designed 28px) appeared between the description and the newsletter card, and the visual ended lower than the left column. The image is now taken out of flow (`position: absolute; inset: 0`) so the text column dictates the row heights and the visual stretches to match it exactly; a `300px` figure min-height covers short-text viewports, and the newsletter's duplicated `margin-top` is dropped in favor of the grid row gap (#46)

## [1.2.0] - 2026-08-15

### Added
- Configurable header logo: `params.header.logo` renders an optional icon (local asset or remote URL) next to the site title in the header; unset by default, title-only rendering is unchanged (#45)

### Fixed
- Article inline TOC rendered unstyled after the v4.0.3 upstream merge reintroduced its markup without the companion `.article-toc` SCSS rules: the native disclosure marker showed beside the chevron icon, the summary/title had no affordance styling, and the inline TOC duplicated the desktop sidebar TOC widget. Styles restored (adapted to the flat design) and the inline TOC now hides at the `lg` breakpoint where the sidebar TOC takes over (#44)

## [1.1.2] - 2026-08-03

### Fixed
- Translations silently missing on sites configured with `defaultContentLanguage = "zh-cn"` (the standard BCP47 code for Simplified Chinese): the theme shipped only `i18n/zh.toml`, but Hugo matches i18n catalogs by exact language key, so `zh-cn` loaded nothing and every `i18n` call returned empty — most visibly the newsletter form's description/placeholder/submit text. Added `i18n/zh-cn.toml` (full alias of the Chinese catalog) so both `zh` and `zh-cn` keys resolve (#43)

## [1.1.1] - 2026-08-03

### Fixed
- Newsletter subscription forms (homepage hero + article footer inline) rendered the description, email placeholder, and submit button all blank: the `hero.newsletter.*` / `article.newsletter.*` i18n keys were referenced in the partials but never defined in any locale catalog. Keys now added for `zh` and `en`; the description key is named `desc` because Hugo reserves `description` in `lang.Translate` and mixing it with normal keys aborts the build. Missing fallback `hero.defaultSubtitle` / `hero.defaultDescription` keys are also added (#42)

## [1.0.1] - 2026-07-31

### Fixed
- Homepage pagination styles not applying because SCSS targeted `.page-item .page-link` while HTML renders `.page-link` as direct children (#39)
- Hero layout overlap on desktop when no hero image is set — `grid-area` rules now only apply when a visual is present (#39)
- Dark-mode pagination current-page shadow now uses `color-mix(var(--accent-color))` instead of a hardcoded purple (#39)

### Changed
- Pagination restyled as a centered pill bar aligned with the theme aesthetic (#39)
- Hero title uses fluid `clamp()` sizing; no-image layout stays centered single-column (#39)
- Removed hero topic pills from homepage and related i18n/config (#39)
- Demo site branded as Fried Rice Theme with optional hero image config (#39)

## [1.0.0] - 2026-06-24

### Added
- Global AdSense loader: include `adsense-script.html` in `head.html` to load `adsbygoogle.js` once and activate all `[data-adsense-placeholder]` units (#36)
- 404 page ad unit with new `ads/not-found.html` partial and `.not-found-ad` styling in `custom.scss` (#36)
- Per-location ad switches: `enable_in_article` (default off) and `enable_404` (default on), independent of `publisher_id` master switch (#36)

## [0.8.3] - 2026-06-22

### Fixed
- Restore SEO structured data (JSON-LD) and performance hints (preconnect/dns-prefetch) that were accidentally removed in v0.8.0 (#35)
- Restore OpenGraph/Twitter card image fallback to `.Params.cover.image` when `.Params.image` is not set (#35)
- Migrate deprecated `.Site.Author` references to `.Site.Params.author` in structured data templates (#35)

### Changed
- Ignore `.ralphplus/` workspace artifacts and generated `.dev/Caddyfile` in git (#34)

## [0.8.2] - 2026-06-14

### Fixed
- SVG and other non-processable cover images (e.g. `image/svg+xml` page-bundle resources) no longer abort the whole site build. `article-list/default.html` and the shadowed `_default/list.html` now guard `.Fill` with `reflect.IsImageResourceProcessable`, falling back to the original image — matching `article-list/tile.html` and `helper/thumbnail-image` (#30, #31)

### Added
- `exampleSite` SVG cover demo post, plus a project-level `article-list/default.html` override so the example site renders the custom rich card (`partials/`) instead of the upstream minimal card

## [0.8.1] - 2026-06-13

### Fixed
- Homepage article-list cards no longer rendered cover images after v0.8.0's `helper/image` contract rewrite — the custom card now passes `Image`/`Resources` and reads `Resource`/`Permalink` instead of the removed `exists` field (#28, #29)
- Aligned the shadowed `_default/list.html` to the same `helper/image` contract (latent; it was overridden by `layouts/list.html`)

### Changed
- Homepage card category pills now use per-category auto-coloring via `helper/color-from-str`, matching the upstream `_partials` card

## [0.8.0] - 2026-06-12

### Added
- Merged upstream hugo-theme-stack v4.0.3 (96 commits)
- Category link auto-color generation from upstream
- Pagination jump-to-page dialog from upstream
- Code block copy button from upstream
- Artalk comment system support from upstream
- Comentario comment system support from upstream
- Cookie consent banner from upstream
- Markdown alerts support (`> [!NOTE]` etc.) from upstream
- Responsive image support from upstream
- PhotoSwipe v5 upgrade from upstream
- `run.sh` for local HTTPS dev server (Hugo + Caddy + supervisord)

### Changed
- Upgraded Hugo requirement to >= 0.157 (tested with 0.163.1)
- CSS variable-based refactoring from upstream
- `partials/` → `_partials/` directory migration from upstream

### Removed
- Upstream inline article TOC (kept sidebar TOC style)

## [0.7.0] - 2026-03-19

### Added
- Optional hero visual support with a two-column anchor layout on the homepage

### Changed
- Elevated homepage newsletter hierarchy with a more prominent signup card and refined spacing
- Updated the example site hero configuration to showcase subtitle, description, topics, and hero image settings
- Ignore local `.serena/` and `.serana/` workspace artifacts by default

## [0.6.0] - 2026-03-12

### Added
- Inline newsletter signup widget for article pages
- Newsletter widget translations for English and Chinese locales

### Changed
- Newsletter inline typography and layout for better readability

## [0.4.1] - 2026-01-25

### Fixed
- Improve article tag visibility in dark mode with accent color background

## [0.4.0] - 2026-01-20

### Added
- Dark mode redesign with three-layer surface system and accent glow effects
- AI agent workflow configuration and documentation (OpenSpec framework)
- Updated Chinese fonts to Noto Sans SC and LXGW WenKai Screen

### Changed
- Refactored typography to use Noto Sans SC for all text including headings
- Updated FUNDING.yml to svtter

## [0.3.3] - 2025-12-30

### Added
- Configurable hero section parameters for customization

### Changed
- Updated default subtitle to prioritize Agent Engineer
- Updated default hero topic to Agent Engineer

### Fixed
- Correct theme name and remove duplicate footer

## [0.3.2] - 2025-12-27

### Fixed
- Override absolute positioning on mobile menu toggle
- Reduce mobile nav button spacing to prevent overlap

## [0.3.1] - 2025-12-26

### Added
- i18n support for hero and home sections (English and Chinese)

### Fixed
- realBlog link handling

## [0.3.0] - 2025-12-26

### Added
- Language switcher button for EN/ZH language switching
- i18n translations for footer text

### Fixed
- Language switcher to use .Translations for proper URL routing
- i18n file indentation for Hindi (hi) and Vietnamese (vi)

### Changed
- Updated .gitignore file

## [0.2.1] - 2025-12-23

### Fixed
- Mobile header icon overlap issue - RSS link, theme toggle, and hamburger menu no longer overlap
- RSS link now hidden on mobile viewport, accessible via mobile menu dropdown

### Changed
- Added theme screenshots to README

## [0.2.0] - 2025-12-23

### Added
- WebSite schema with search action support for better SEO
- Organization schema with founder, contact point, and address
- FAQ schema for pages with FAQ content
- Article/BlogPosting schema enhancements with accessibility metadata
- SEO configuration options in `hugo.yaml`

### Fixed
- JSON-LD output double-escaping issues
- Duplicate `datePublished` field in article schema
- Duplicate `founder` definitions in organization schema
- Empty address/contactPoint objects generating invalid JSON
- Variable scope errors in FAQ template
- Default pipe position in website search URL logic
- Dark mode support for hero topic pills
- Display all categories instead of only the first one
- Deprecated GoogleAnalytics config fallback removed

## [0.1.0] - 2025-12-21

### Added
- Initial fork from hugo-theme-stack
- Table of contents sidebar for article pages
- Google Analytics support with conditional template
- SEO optimizations with JSON-LD structured data and performance hints
- Article/BlogPosting schema with enhanced SEO fields

### Fixed
- TOC display and behavior improvements
- TOC styling for better readability
- Chinese character spacing in widget titles
- Proper padding to TOC widget title

### Changed
- Module path updated to Fried-Rice
- README rewritten for Fried Rice theme
