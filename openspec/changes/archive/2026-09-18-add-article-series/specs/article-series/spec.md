# Specification: article-series

## ADDED Requirements

### Requirement: Series taxonomy support
The theme SHALL support a `series` taxonomy so that posts declaring `series: ["<name>"]` in front matter are grouped and Hugo generates `/series/` and `/series/<name>/` pages. Because Hugo does not merge `taxonomies` from theme config, the site configuration MUST declare the `series` taxonomy (the theme MUST document this and keep the default `tags` and `categories` taxonomies unaffected).

#### Scenario: Post declares a series
- **WHEN** a post's front matter contains `series: ["deep-dive"]`
- **THEN** the post is listed on the page `/series/deep-dive/` and the `/series/` page lists the `deep-dive` series

#### Scenario: Post without series
- **WHEN** a post has no `series` front matter
- **THEN** the post renders exactly as before with no series UI and no `/series/` entry

### Requirement: Ordered series landing page
The theme SHALL provide a layout for series term pages that presents the series title and description, followed by the series' articles newest first. Ordering SHALL be determined by front-matter `weight` (descending — higher weight shown earlier) when present, falling back to publication date (newest first). Articles without an explicit weight are ordered by date relative to other unweighted articles. Each article's `description` SHALL be rendered below its title (clamped to two lines) so readers can tell what a chapter covers before opening it.

#### Scenario: Series with weights
- **WHEN** three posts share `series: ["guide"]` with weights 1, 2, 3
- **THEN** the series page `/series/guide/` lists them in weight order 3, 2, 1

#### Scenario: Series without weights
- **WHEN** three posts share a series and none declares a weight
- **THEN** the series page lists them from newest publication date to oldest

#### Scenario: Series with a description
- **WHEN** the series term has a description configured
- **THEN** the description is rendered under the series title on the series page

#### Scenario: Series with a cover image
- **WHEN** the series term has an `image` configured
- **THEN** the series page renders it as a cover banner above the series title, and the in-article series box shows it at the top of the box

#### Scenario: Series without a cover image
- **WHEN** the series term has no `image`
- **THEN** the series page and series box render without any cover image and remain fully usable

### Requirement: In-article series navigation box
The theme SHALL render a series navigation box on article pages whose post belongs to a series. The box MUST display the series title linking to the series landing page, an ordered list of all articles in the series (newest first, matching the landing page) with the current article highlighted, and links to the previous and next article in the displayed order (previous = newer chapter, next = older chapter).

#### Scenario: Middle part of a series
- **WHEN** a visitor opens a post that is part 2 of a 3-part series
- **THEN** the article page shows a series box listing all three parts newest first, highlighting part 2, with working links to the newer part (previous) and the older part (next)

#### Scenario: Newest part of a series
- **WHEN** a visitor opens the newest post of a series
- **THEN** the series box shows no previous link and a next link to the second-newest part

#### Scenario: Post outside any series
- **WHEN** a visitor opens a post without a `series` value
- **THEN** no series box is rendered

#### Scenario: Series box disabled by parameter
- **WHEN** `params.article.series.enabled` is set to `false` and a post belongs to a series
- **THEN** no series box is rendered on the article page, while the series landing page still works

### Requirement: Homepage series section
The theme SHALL provide a series section on the homepage that displays the site's series as cards (cover image when available, series title, the series `description` clamped to two lines, and article count), each linking to the series landing page. The section MUST be hidden automatically when the series taxonomy is not configured or contains no terms, and its visibility MUST be configurable via `params.series.showOnHome` (default true) with `params.series.limit` (default 4) controlling the maximum number of cards.

#### Scenario: Site has series
- **WHEN** the homepage is rendered and the site has at least one series
- **THEN** a "Series" section appears between the hero and the latest-posts list, with one card per series linking to its series page, ordered by article count descending

#### Scenario: Series with a description
- **WHEN** a series term has a `description` configured
- **THEN** its homepage card renders the description between the title and the article count, clamped to two lines

#### Scenario: Series without a cover image
- **WHEN** a series has no `image` configured
- **THEN** its homepage card renders as a flat card with the series title and article count, without a broken image

#### Scenario: No series or feature disabled
- **WHEN** the site has no series terms, the taxonomy is not configured, or `params.series.showOnHome` is false
- **THEN** no series section is rendered on the homepage and the page layout remains unchanged

### Requirement: Series i18n strings
The theme SHALL provide i18n strings for all series UI labels (series box heading, part numbering, previous/next labels). English and Simplified Chinese translations MUST be provided; other languages SHALL fall back to the site default language.

#### Scenario: Chinese site
- **WHEN** the site language is `zh-cn`
- **THEN** series UI labels render in Simplified Chinese

#### Scenario: Untranslated language
- **WHEN** the site language has no series strings (e.g. `fr`)
- **THEN** series UI labels fall back to English
