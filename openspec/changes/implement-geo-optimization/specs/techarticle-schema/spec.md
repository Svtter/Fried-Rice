# Spec: TechArticle Schema

## Capability ID
`techarticle-schema`

## Summary
为技术博客和技术文档创建 TechArticle Schema，支持难度级别、前置条件、依赖项等技术文章特有字段，提升技术内容在 AI 搜索中的引用率。

## Related Capabilities
- `entity-enhancement`: 使用稳定 @id 和 sameAs
- `enhanced-faq-schema`: 可与 FAQ 同页出现

---

## ADDED Requirements

### Requirement: Auto-detect technical articles
系统自动检测技术文章并生成 TechArticle Schema。

#### Scenario: Post section triggers TechArticle
**Given** 文章位于 `post` section
**And** 站点配置 `geo.autoDetect.techArticle: true`
**When** 页面渲染时
**Then** 生成 TechArticle Schema（而非普通 Article）
**And** @type 为 "TechArticle"

#### Scenario: Tutorial section triggers TechArticle
**Given** 文章位于 `tutorial` 或 `tech` section
**When** 页面渲染时
**Then** 生成 TechArticle Schema

#### Scenario: Explicit schemaType override
**Given** 文章 frontmatter 指定 `schemaType: Article`
**When** 页面渲染时
**Then** 生成普通 Article Schema（不升级为 TechArticle）

#### Scenario: TechArticle disabled in config
**Given** 站点配置 `geo.autoDetect.techArticle: false`
**When** 任何页面渲染时
**Then** 不自动生成 TechArticle Schema
**And** 使用默认 Article Schema

---

### Requirement: Support proficiencyLevel field
TechArticle 必须支持难度级别字段，帮助 AI 匹配用户查询意图。

#### Scenario: Beginner difficulty
**Given** 文章 frontmatter 指定 `difficulty: beginner`
**When** 页面渲染时
**Then** Schema 包含 `proficiencyLevel: "Beginner"`

#### Scenario: Intermediate difficulty
**Given** 文章 frontmatter 指定 `difficulty: intermediate`
**When** 页面渲染时
**Then** Schema 包含 `proficiencyLevel: "Intermediate"`

#### Scenario: Advanced difficulty
**Given** 文章 frontmatter 指定 `difficulty: advanced`
**When** 页面渲染时
**Then** Schema 包含 `proficiencyLevel: "Advanced"`

#### Scenario: Default difficulty from config
**Given** 文章未指定 `difficulty`
**And** 站点配置 `geo.techArticle.defaultProficiency: intermediate`
**When** 页面渲染时
**Then** Schema 包含 `proficiencyLevel: "Intermediate"`

#### Scenario: Localized proficiencyLevel
**Given** 文章 frontmatter 指定 `difficulty: beginner`
**And** 当前语言为中文 (zh-cn)
**When** 页面渲染时
**Then** Schema 包含 `proficiencyLevel: "Beginner"`
**Note**: proficiencyLevel 保持英文（Schema.org 标准），但 i18n 可用于 UI 显示

---

### Requirement: Support dependencies field
TechArticle 必须支持技术依赖项列表。

#### Scenario: Single dependency
**Given** 文章 frontmatter 指定:
```yaml
dependencies:
  - Node.js 18+
```
**When** 页面渲染时
**Then** Schema 包含 `dependencies` 数组
**And** 数组包含 "Node.js 18+"

#### Scenario: Multiple dependencies
**Given** 文章 frontmatter 指定:
```yaml
dependencies:
  - Node.js 18+
  - npm 9+
  - Python 3.10+
```
**When** 页面渲染时
**Then** Schema 包含包含所有依赖项的数组

#### Scenario: No dependencies
**Given** 文章未指定 `dependencies`
**When** 页面渲染时
**Then** Schema 不包含 `dependencies` 字段

---

### Requirement: Support prerequisites field
TechArticle 必须支持前置知识/条件字段。

#### Scenario: Prerequisites as array
**Given** 文章 frontmatter 指定:
```yaml
prerequisites:
  - 熟悉 JavaScript 基础
  - 了解 REST API 概念
```
**When** 页面渲染时
**Then** Schema 包含 `prerequisites` 字段
**And** 值为逗号分隔的字符串 "熟悉 JavaScript 基础, 了解 REST API 概念"

#### Scenario: Prerequisites as string
**Given** 文章 frontmatter 指定:
```yaml
prerequisites: "熟悉 JavaScript 基础"
```
**When** 页面渲染时
**Then** Schema 包含 `prerequisites: "熟悉 JavaScript 基础"`

---

### Requirement: Support audience field
TechArticle 必须支持目标受众字段。

#### Scenario: Developer audience
**Given** 文章 frontmatter 指定 `audience: developers`
**When** 页面渲染时
**Then** Schema 包含:
```json
"audience": {
  "@type": "Audience",
  "audienceType": "developers"
}
```

#### Scenario: Default audience from config
**Given** 文章未指定 `audience`
**And** 站点配置 `geo.techArticle.defaultAudience: developers`
**When** 页面渲染时
**Then** Schema 包含 audience 对象，audienceType 为 "developers"

#### Scenario: No audience configured
**Given** 文章未指定 `audience`
**And** 站点未配置默认 audience
**When** 页面渲染时
**Then** Schema 不包含 `audience` 字段

---

### Requirement: Support speakable for voice search
TechArticle 支持 speakable 字段优化语音搜索。

#### Scenario: Speakable enabled with default selectors
**Given** 站点配置 `geo.speakable.enabled: true`
**And** 站点配置 `geo.speakable.selectors: ["h1", "h2", ".article-summary"]`
**When** TechArticle 页面渲染时
**Then** Schema 包含:
```json
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": ["h1", "h2", ".article-summary"]
}
```

#### Scenario: Speakable disabled
**Given** 站点配置 `geo.speakable.enabled: false`
**When** 页面渲染时
**Then** Schema 不包含 `speakable` 字段

---

### Requirement: Include stable @id URL
TechArticle 必须包含稳定的 @id URL。

#### Scenario: TechArticle @id format
**Given** 文章 URL 为 `https://example.com/post/api-tutorial/`
**When** 页面渲染时
**Then** Schema 包含 `@id: "https://example.com/post/api-tutorial/#article"`

---

### Requirement: Inherit Article fields
TechArticle 必须继承所有标准 Article 字段。

#### Scenario: All Article fields present
**Given** 文章有完整的 frontmatter
**When** TechArticle 渲染时
**Then** Schema 包含以下字段:
- headline
- description
- author (with @id and sameAs)
- publisher (with @id)
- datePublished
- dateModified
- image
- keywords
- articleSection
- wordCount
- timeRequired
- inLanguage
- mainEntityOfPage

---

## Schema Output Example

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://example.com/post/api-tutorial/#article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/post/api-tutorial/"
  },
  "headline": "REST API 开发入门教程",
  "description": "本教程将带你从零开始学习 REST API 的设计和开发。",
  "inLanguage": "zh-CN",
  "proficiencyLevel": "Beginner",
  "dependencies": ["Node.js 18+", "npm 9+"],
  "prerequisites": "熟悉 JavaScript 基础, 了解 HTTP 协议",
  "audience": {
    "@type": "Audience",
    "audienceType": "developers"
  },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", ".article-summary"]
  },
  "author": {
    "@type": "Person",
    "@id": "https://example.com/#author",
    "name": "张三",
    "url": "https://example.com/about/",
    "sameAs": [
      "https://github.com/zhangsan",
      "https://twitter.com/zhangsan"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://example.com/#organization",
    "name": "技术博客",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-01T00:00:00Z",
  "dateModified": "2025-01-02T12:00:00Z",
  "image": "https://example.com/post/api-tutorial/cover.jpg",
  "keywords": ["REST API", "Node.js", "教程"],
  "articleSection": "教程",
  "wordCount": 2500,
  "timeRequired": "PT15M"
}
```

---

## Configuration

```yaml
params:
  seo:
    geo:
      autoDetect:
        techArticle: true      # 自动检测并生成 TechArticle
      
      techArticle:
        defaultAudience: "developers"      # 默认受众
        defaultProficiency: "intermediate" # 默认难度
      
      speakable:
        enabled: true
        selectors:
          - "h1"
          - "h2"
          - ".article-summary"
          - ".article-content > p:first-of-type"
```

---

## Front Matter Reference

```yaml
---
title: "REST API 开发入门教程"
description: "本教程将带你从零开始学习 REST API 的设计和开发。"
date: 2025-01-01
tags: ["REST API", "Node.js", "教程"]
categories: ["教程"]

# TechArticle 特有字段
difficulty: beginner           # beginner | intermediate | advanced
audience: developers           # developers | designers | general
prerequisites:
  - 熟悉 JavaScript 基础
  - 了解 HTTP 协议
dependencies:
  - Node.js 18+
  - npm 9+

# 可选：强制指定 Schema 类型
# schemaType: TechArticle
---
```

---

## Validation Rules

1. **difficulty**: 必须为 beginner、intermediate 或 advanced 之一
2. **audience**: 建议使用标准值 developers、designers、general
3. **dependencies**: 建议包含版本号
4. **prerequisites**: 建议简洁明了，每项不超过 50 字
