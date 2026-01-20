# Spec: Enhanced FAQ Schema

## Capability ID
`enhanced-faq-schema`

## Summary
增强现有 FAQPage Schema，添加信任信号字段（author、dateCreated、upvoteCount），提升 AI 搜索引擎引用率。

## Related Capabilities
- `entity-enhancement`: 使用稳定 @id
- `techarticle-schema`: 可与技术文章同页出现

---

## ADDED Requirements

### Requirement: FAQ Schema must include author information
FAQ Schema 的每个 Answer 必须包含作者信息，增强 AI 信任信号。

#### Scenario: FAQ with default author from site config
**Given** 站点配置了 `author.name`
**And** 文章包含 FAQ frontmatter
**When** 页面渲染时
**Then** FAQ Schema 的每个 acceptedAnswer 包含 author 对象
**And** author.name 为站点配置的作者名
**And** author["@type"] 为 "Person"

#### Scenario: FAQ with custom author per question
**Given** 文章 FAQ frontmatter 中某问题指定了 `author`
**When** 页面渲染时
**Then** 该问题的 acceptedAnswer 使用指定的作者名
**And** 其他问题使用默认作者

---

### Requirement: FAQ Schema must include creation date
FAQ Schema 的每个 Answer 必须包含创建日期，帮助 AI 判断内容时效性。

#### Scenario: FAQ with page publish date as default
**Given** 文章有发布日期 `date: 2025-01-01`
**And** 文章包含 FAQ frontmatter
**When** 页面渲染时
**Then** 每个 acceptedAnswer 包含 `dateCreated` 字段
**And** dateCreated 格式为 ISO 8601 日期 (YYYY-MM-DD)
**And** 默认值为文章发布日期

#### Scenario: FAQ with custom date per question
**Given** 文章 FAQ frontmatter 中某问题指定了 `date: 2025-06-01`
**When** 页面渲染时
**Then** 该问题的 acceptedAnswer.dateCreated 为 "2025-06-01"

---

### Requirement: FAQ Schema supports optional upvoteCount
FAQ Schema 可选包含 upvoteCount 信任信号，需要从 frontmatter 明确指定。

#### Scenario: FAQ with upvoteCount specified
**Given** 文章 FAQ frontmatter 中某问题指定了 `upvotes: 42`
**And** 站点配置 `geo.trustSignals.upvoteCount: true`
**When** 页面渲染时
**Then** 该问题的 acceptedAnswer 包含 `upvoteCount: 42`

#### Scenario: FAQ without upvoteCount
**Given** 文章 FAQ frontmatter 未指定 `upvotes`
**When** 页面渲染时
**Then** acceptedAnswer 不包含 `upvoteCount` 字段

#### Scenario: upvoteCount disabled in config
**Given** 站点配置 `geo.trustSignals.upvoteCount: false`
**And** 文章 FAQ frontmatter 指定了 `upvotes: 42`
**When** 页面渲染时
**Then** acceptedAnswer 不包含 `upvoteCount` 字段

---

### Requirement: FAQ Schema includes stable @id
FAQPage Schema 必须包含稳定的 @id URL，便于 AI 实体识别。

#### Scenario: FAQ with stable @id
**Given** 文章 URL 为 `https://example.com/post/my-article/`
**And** 文章包含 FAQ frontmatter
**When** 页面渲染时
**Then** FAQPage Schema 包含 `@id` 字段
**And** @id 值为 `https://example.com/post/my-article/#faq`

---

## MODIFIED Requirements

### Requirement: FAQ Schema maintains backward compatibility
增强后的 FAQ Schema 必须兼容现有的 frontmatter 格式。

#### Scenario: Map format FAQ still works
**Given** 文章使用 map 格式 FAQ:
```yaml
faq:
  "问题1？": "答案1"
  "问题2？": "答案2"
```
**When** 页面渲染时
**Then** FAQPage Schema 正确生成
**And** 包含所有增强字段（author、dateCreated）
**And** 无 upvoteCount（未指定）

#### Scenario: Array format FAQ still works
**Given** 文章使用数组格式 FAQ:
```yaml
faq:
  - question: "问题1？"
    answer: "答案1"
  - question: "问题2？"
    answer: "答案2"
```
**When** 页面渲染时
**Then** FAQPage Schema 正确生成
**And** 包含所有增强字段

#### Scenario: Enhanced array format with trust signals
**Given** 文章使用增强数组格式:
```yaml
faq:
  - question: "问题1？"
    answer: "答案1"
    upvotes: 42
    date: "2025-06-01"
    author: "专家名"
```
**When** 页面渲染时
**Then** FAQPage Schema 正确生成
**And** 使用指定的 upvotes、date、author

---

## Schema Output Example

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://example.com/post/my-article/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "如何安装这个工具？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "运行 npm install tool-name 即可安装。建议使用 Node.js 18+ 版本以获得最佳兼容性。",
        "author": {
          "@type": "Person",
          "name": "张三"
        },
        "dateCreated": "2025-01-01",
        "upvoteCount": 42
      }
    },
    {
      "@type": "Question",
      "name": "支持哪些操作系统？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "支持 Windows、macOS 和 Linux。",
        "author": {
          "@type": "Person",
          "name": "张三"
        },
        "dateCreated": "2025-01-01"
      }
    }
  ]
}
```

---

## Configuration

```yaml
params:
  seo:
    geo:
      trustSignals:
        author: true         # 是否包含作者信息
        dateCreated: true    # 是否包含创建日期
        upvoteCount: false   # 是否允许 upvoteCount（需 frontmatter 指定）
```

---

## Front Matter Reference

### Basic Format (Map)
```yaml
faq:
  "问题1？": "答案1"
  "问题2？": "答案2"
```

### Basic Format (Array)
```yaml
faq:
  - question: "问题1？"
    answer: "答案1"
  - question: "问题2？"
    answer: "答案2"
```

### Enhanced Format (Array with trust signals)
```yaml
faq:
  - question: "问题1？"
    answer: "答案1"
    upvotes: 42          # 可选
    date: "2025-06-01"   # 可选，覆盖默认日期
    author: "专家名"      # 可选，覆盖默认作者
```

---

## Validation Rules

1. **Answer 长度建议**: 50-100 词最佳，便于 AI 提取
2. **问题格式**: 应以问号结尾，使用自然语言
3. **upvoteCount**: 必须为正整数
4. **dateCreated**: 必须为有效日期格式
