# Spec: Entity Enhancement

## Capability ID
`entity-enhancement`

## Summary
增强所有 Schema 的实体识别能力，包括稳定的 @id URL 生成和 sameAs 知识图谱链接，帮助 AI 准确识别和引用站点实体。

## Related Capabilities
- `enhanced-faq-schema`: 使用实体 ID
- `techarticle-schema`: 使用实体 ID 和 sameAs
- `howto-schema`: 使用实体 ID

---

## ADDED Requirements

### Requirement: Generate stable @id for all Schema types
所有 Schema 类型必须包含稳定的 @id URL，确保实体可被唯一识别。

#### Scenario: Article @id format
**Given** 文章 URL 为 `https://example.com/post/my-article/`
**When** 页面渲染 Article/TechArticle Schema 时
**Then** Schema 包含 `@id: "https://example.com/post/my-article/#article"`

#### Scenario: HowTo @id format
**Given** 文章 URL 为 `https://example.com/tutorial/setup/`
**And** 文章包含 HowTo Schema
**When** 页面渲染时
**Then** HowTo Schema 包含 `@id: "https://example.com/tutorial/setup/#howto"`

#### Scenario: FAQ @id format
**Given** 文章 URL 为 `https://example.com/post/faq-post/`
**And** 文章包含 FAQ Schema
**When** 页面渲染时
**Then** FAQPage Schema 包含 `@id: "https://example.com/post/faq-post/#faq"`

#### Scenario: Organization @id format
**Given** 站点 baseURL 为 `https://example.com/`
**When** 任何页面渲染 Organization Schema 时
**Then** Schema 包含 `@id: "https://example.com/#organization"`
**And** 所有页面的 Organization @id 相同

#### Scenario: Website @id format
**Given** 站点 baseURL 为 `https://example.com/`
**When** 任何页面渲染 Website Schema 时
**Then** Schema 包含 `@id: "https://example.com/#website"`

#### Scenario: Author @id format
**Given** 站点 baseURL 为 `https://example.com/`
**When** Article Schema 渲染 author 时
**Then** author 包含 `@id: "https://example.com/#author"`
**And** 所有文章的 author @id 相同

#### Scenario: @id disabled in config
**Given** 站点配置 `geo.entity.stableId: false`
**When** Schema 渲染时
**Then** Schema 不包含 @id 字段

---

### Requirement: Generate sameAs links for Organization
Organization Schema 必须包含 sameAs 链接到外部平台和知识图谱。

#### Scenario: sameAs from site author config
**Given** 站点配置:
```yaml
author:
  github: username
  twitter: username
  linkedin: username
```
**When** Organization Schema 渲染时
**Then** Schema 包含 sameAs 数组:
```json
"sameAs": [
  "https://github.com/username",
  "https://twitter.com/username",
  "https://linkedin.com/in/username"
]
```

#### Scenario: sameAs with Wikidata
**Given** 站点配置:
```yaml
author:
  wikidata: Q12345
```
**When** Organization Schema 渲染时
**Then** sameAs 包含 `https://www.wikidata.org/wiki/Q12345`

#### Scenario: sameAs from explicit config
**Given** 站点配置:
```yaml
seo:
  organization:
    sameAs:
      - https://github.com/org
      - https://www.wikidata.org/wiki/Q12345
      - https://custom.com/profile
```
**When** Organization Schema 渲染时
**Then** Schema 使用配置的 sameAs 数组

#### Scenario: No sameAs configured
**Given** 站点未配置任何社交账号
**And** 站点未配置 seo.organization.sameAs
**When** Organization Schema 渲染时
**Then** Schema 不包含 sameAs 字段

#### Scenario: sameAs disabled in config
**Given** 站点配置 `geo.entity.sameAs: false`
**When** Schema 渲染时
**Then** Schema 不包含 sameAs 字段（即使有配置）

---

### Requirement: Generate sameAs links for Author
Author/Person Schema 必须包含个人社交账号链接。

#### Scenario: Author sameAs
**Given** 站点配置:
```yaml
author:
  name: 张三
  github: zhangsan
  twitter: zhangsan
  linkedin: zhangsan
  website: https://zhangsan.com
```
**When** Article author 渲染时
**Then** author 包含:
```json
{
  "@type": "Person",
  "@id": "https://example.com/#author",
  "name": "张三",
  "url": "https://zhangsan.com",
  "sameAs": [
    "https://github.com/zhangsan",
    "https://twitter.com/zhangsan",
    "https://linkedin.com/in/zhangsan",
    "https://zhangsan.com"
  ]
}
```

#### Scenario: Author with image
**Given** 站点配置 `author.image: /img/author.jpg`
**When** Article author 渲染时
**Then** author 包含 `image` 字段
**And** image 为完整 URL

---

### Requirement: Cross-reference entities
不同 Schema 中的相同实体应使用相同的 @id 引用。

#### Scenario: Publisher references Organization
**Given** Article Schema 渲染 publisher
**When** 页面渲染时
**Then** publisher 包含:
```json
{
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "name": "站点名称",
  "logo": {...}
}
```
**And** publisher.@id 与单独的 Organization Schema 的 @id 相同

#### Scenario: Author consistent across articles
**Given** 多篇文章使用同一作者
**When** 各文章渲染时
**Then** 所有文章的 author.@id 相同
**And** 值为 `https://example.com/#author`

---

### Requirement: Support multiple authors
支持文章指定多个作者（未来扩展）。

#### Scenario: Single author (default)
**Given** 文章未指定 authors
**When** 页面渲染时
**Then** author 为单个 Person 对象

#### Scenario: Multiple authors
**Given** 文章 frontmatter 指定:
```yaml
authors:
  - name: 张三
  - name: 李四
```
**When** 页面渲染时
**Then** author 为 Person 对象数组
**Note**: 此为未来扩展，当前版本暂不实现

---

## Schema Output Examples

### Organization with sameAs
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.com/#organization",
  "url": "https://example.com/",
  "name": "技术博客",
  "description": "分享技术知识和经验",
  "logo": "https://example.com/logo.png",
  "founder": {
    "@type": "Person",
    "@id": "https://example.com/#author",
    "name": "张三",
    "url": "https://zhangsan.com"
  },
  "sameAs": [
    "https://github.com/techblog",
    "https://twitter.com/techblog",
    "https://www.wikidata.org/wiki/Q12345"
  ]
}
```

### Author with full profile
```json
{
  "@type": "Person",
  "@id": "https://example.com/#author",
  "name": "张三",
  "url": "https://zhangsan.com",
  "image": "https://example.com/img/author.jpg",
  "sameAs": [
    "https://github.com/zhangsan",
    "https://twitter.com/zhangsan",
    "https://linkedin.com/in/zhangsan",
    "https://zhangsan.com"
  ]
}
```

### Website with @id
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "url": "https://example.com/",
  "name": "技术博客",
  "description": "分享技术知识和经验",
  "inLanguage": "zh-CN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## Configuration

```yaml
params:
  author:
    name: 张三
    homepage: https://zhangsan.com
    image: /img/author.jpg
    github: zhangsan
    twitter: zhangsan
    linkedin: zhangsan
    wikidata: Q12345          # 可选：Wikidata 实体 ID
    website: https://zhangsan.com
  
  seo:
    geo:
      entity:
        stableId: true        # 启用稳定 @id
        sameAs: true          # 启用 sameAs 链接
    
    organization:
      sameAs:                 # 可选：覆盖自动生成的 sameAs
        - https://github.com/org
        - https://www.wikidata.org/wiki/Q12345
```

---

## @id URL Format Reference

| Schema Type | @id Format | Example |
|-------------|-----------|---------|
| Website | `{baseURL}#website` | `https://example.com/#website` |
| Organization | `{baseURL}#organization` | `https://example.com/#organization` |
| Author/Person | `{baseURL}#author` | `https://example.com/#author` |
| Article | `{pageURL}#article` | `https://example.com/post/my-article/#article` |
| TechArticle | `{pageURL}#article` | `https://example.com/post/tutorial/#article` |
| HowTo | `{pageURL}#howto` | `https://example.com/tutorial/setup/#howto` |
| FAQPage | `{pageURL}#faq` | `https://example.com/post/faq/#faq` |
| BreadcrumbList | `{pageURL}#breadcrumb` | `https://example.com/post/my-article/#breadcrumb` |

---

## sameAs Platform URL Formats

| Platform | Config Key | URL Format |
|----------|-----------|------------|
| GitHub | `github` | `https://github.com/{username}` |
| Twitter/X | `twitter` | `https://twitter.com/{username}` |
| LinkedIn | `linkedin` | `https://linkedin.com/in/{username}` |
| Wikidata | `wikidata` | `https://www.wikidata.org/wiki/{id}` |
| Website | `website` | 直接使用配置值 |
| Custom | `seo.organization.sameAs[]` | 直接使用配置值 |

---

## Validation Rules

1. **@id URL**: 必须为完整的绝对 URL
2. **@id 唯一性**: 同一实体在所有页面使用相同 @id
3. **sameAs URL**: 必须为有效的 URL 格式
4. **Wikidata ID**: 必须以 Q 开头后跟数字 (如 Q12345)
5. **社交账号**: 只需提供用户名，系统自动生成完整 URL
