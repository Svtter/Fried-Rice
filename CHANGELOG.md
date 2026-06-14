# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
