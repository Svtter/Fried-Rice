# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
