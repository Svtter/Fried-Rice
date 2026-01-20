# Design: GEO Optimization Architecture

## Overview
本设计文档描述 GEO（生成式引擎优化）的技术架构，确保与现有 SEO 功能无缝集成，针对 ChatGPT 和 DeepSeek 等大语言模型优化技术博客和教程内容。

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Hugo Build Process                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐   │
│  │ Content Files │───▶│  Partial Templates │───▶│  HTML Output │   │
│  │ (Markdown)    │    │  (Go Templates)    │    │  (JSON-LD)   │   │
│  └──────────────┘    └──────────────────┘    └──────────────┘   │
│         │                     │                      │           │
│         ▼                     ▼                      ▼           │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐   │
│  │ Front Matter │    │ structured-data/  │    │ AI Crawlers  │   │
│  │ - faq        │    │ ├─ include.html   │    │ - ChatGPT    │   │
│  │ - howto      │    │ ├─ faq.html       │    │ - DeepSeek   │   │
│  │ - difficulty │    │ ├─ techarticle.html│   │ - Perplexity │   │
│  │ - prereqs    │    │ ├─ howto.html     │    │ - Google AI  │   │
│  │ - deps       │    │ ├─ entity.html    │    └──────────────┘   │
│  └──────────────┘    │ └─ tracking.html  │                       │
│                      └──────────────────┘                        │
│                               │                                  │
│                               ▼                                  │
│                      ┌──────────────────┐                        │
│                      │   include.html    │                        │
│                      │  (Orchestrator)   │                        │
│                      │                   │                        │
│                      │  Decision Logic:  │                        │
│                      │  - Content Type   │                        │
│                      │  - Front Matter   │                        │
│                      │  - Site Config    │                        │
│                      └──────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Schema Orchestrator (`include.html`)

**职责**：根据内容类型和配置选择性加载 Schema

**决策逻辑**：
```
if seo.structuredData enabled:
  - Always load: website.html, organization.html, breadcrumb.html
  
  - If IsPage:
    - If section in [tutorial, howto, guide] OR howto frontmatter exists:
        → Load howto.html (HowTo Schema)
    - Else if section in [post, tech, blog, tutorial]:
        → Load techarticle.html (TechArticle Schema, 升级自 Article)
    - Else:
        → Load article.html (Default Article Schema)
    
    - If faq frontmatter exists:
        → Load faq.html (FAQPage Schema)
  
  - If geo.tracking enabled:
    → Add tracking metadata
```

**条件加载优势**：
- 减少不必要的 Schema 输出
- 提升页面性能
- 避免 Schema 冲突

### 2. TechArticle Schema (`techarticle.html`)

**用途**：技术博客和技术文档专用 Schema

**触发条件**：
- `section` 为 `post`, `tutorial`, `tech`, `blog`
- 或 `schemaType: TechArticle` frontmatter
- 或 `difficulty` frontmatter 存在

**Schema 结构**：
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://example.com/post/my-tutorial/#article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/post/my-tutorial/"
  },
  "headline": "文章标题",
  "description": "文章描述",
  "inLanguage": "zh-CN",
  "proficiencyLevel": "Beginner",
  "dependencies": ["Node.js 18+", "npm 9+"],
  "prerequisites": "熟悉 JavaScript 基础, 了解 REST API",
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
    "name": "作者名",
    "url": "https://example.com/about/",
    "sameAs": [
      "https://github.com/username",
      "https://twitter.com/username"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://example.com/#organization",
    "name": "站点名称",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-01T00:00:00Z",
  "dateModified": "2025-01-02T00:00:00Z",
  "wordCount": 1500,
  "timeRequired": "PT10M",
  "keywords": ["JavaScript", "API", "教程"],
  "articleSection": "技术"
}
```

**Front Matter 支持**：
```yaml
---
title: "API 开发入门教程"
difficulty: beginner  # beginner | intermediate | advanced
prerequisites:
  - 熟悉 JavaScript 基础
  - 了解 HTTP 协议
dependencies:
  - Node.js 18+
  - npm 9+
audience: developers  # developers | designers | general
---
```

### 3. HowTo Schema (`howto.html`)

**用途**：教程、指南、步骤类内容专用 Schema

**触发条件**：
- `section` 为 `tutorial`, `howto`, `guide`
- 或 `howto` frontmatter 存在

**Schema 结构**：
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://example.com/tutorial/setup-dev-env/#howto",
  "name": "如何配置开发环境",
  "description": "本教程将指导你完成开发环境的配置",
  "inLanguage": "zh-CN",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "VS Code"
    },
    {
      "@type": "HowToTool",
      "name": "Terminal"
    }
  ],
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "API Key"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "安装 Node.js",
      "text": "从官网下载并安装 Node.js LTS 版本",
      "url": "https://example.com/tutorial/setup-dev-env/#step-1",
      "image": "https://example.com/images/step1.png"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "配置环境变量",
      "text": "创建 .env 文件并添加必要的环境变量",
      "url": "https://example.com/tutorial/setup-dev-env/#step-2",
      "itemListElement": [
        {
          "@type": "HowToDirection",
          "position": 1,
          "text": "在项目根目录创建 .env 文件"
        },
        {
          "@type": "HowToDirection",
          "position": 2,
          "text": "添加 API_KEY=your_key"
        }
      ]
    }
  ]
}
```

**Front Matter 格式**：
```yaml
---
title: "如何配置开发环境"
howto:
  totalTime: PT30M
  estimatedCost:
    currency: USD
    value: 0
  tools:
    - VS Code
    - Terminal
  supplies:
    - API Key
  steps:
    - name: "安装 Node.js"
      text: "从官网下载并安装 Node.js LTS 版本"
      image: step1.png
    - name: "配置环境变量"
      text: "创建 .env 文件并添加必要的环境变量"
      directions:
        - "在项目根目录创建 .env 文件"
        - "添加 API_KEY=your_key"
---
```

### 4. Enhanced FAQ Schema (`faq.html`)

**增强内容**：
- 添加 `author` 字段到每个 Answer
- 添加 `dateCreated` 字段
- 支持可选 `upvoteCount` 信任信号

**增强后 Schema**：
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://example.com/post/faq-article/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "如何安装这个工具？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "运行 npm install tool-name 即可安装。",
        "author": {
          "@type": "Person",
          "name": "作者名"
        },
        "dateCreated": "2025-01-01",
        "upvoteCount": 42
      }
    }
  ]
}
```

**Front Matter 格式（增强）**：
```yaml
faq:
  - question: "如何安装这个工具？"
    answer: "运行 npm install tool-name 即可安装。"
    upvotes: 42  # 可选
```

### 5. Entity Enhancement (`entity.html`)

**稳定 @id 生成策略**：
```
@id 格式: {baseURL}/{section}/{slug}/#{type}

示例:
- Article:      https://example.com/post/my-article/#article
- HowTo:        https://example.com/tutorial/setup/#howto
- FAQ:          https://example.com/post/faq-post/#faq
- Author:       https://example.com/#author
- Organization: https://example.com/#organization
- Website:      https://example.com/#website
```

**sameAs 链接来源**：
```yaml
# hugo.yaml 配置
params:
  author:
    github: username      → https://github.com/username
    twitter: username     → https://twitter.com/username
    linkedin: username    → https://linkedin.com/in/username
    wikidata: Q12345      → https://www.wikidata.org/wiki/Q12345
    website: https://...  → 直接使用
```

### 6. AI Citation Tracking

**实现方式**：生成专用状态页面 `/geo-status/`

**页面功能**：
1. **Schema 类型统计**
   - TechArticle 数量
   - HowTo 数量
   - FAQPage 数量
   - 覆盖率百分比

2. **内容结构化检查**
   - 缺失必填字段警告
   - 推荐优化项列表
   - 多语言覆盖状态

3. **验证工具链接**
   - Google Rich Results Test
   - Schema.org Validator
   - JSON-LD Playground

**页面布局模板**：`layouts/page/geo-status.html`

## Configuration Schema

```yaml
params:
  seo:
    # 现有配置保持不变
    structuredData: true
    performanceHints: true
    
    # 新增 GEO 配置
    geo:
      enabled: true
      
      # 内容类型自动检测
      autoDetect:
        techArticle: true    # 自动为技术文章生成 TechArticle
        howTo: true          # 自动为教程生成 HowTo (需要 howto frontmatter)
        faq: true            # 自动为 FAQ 生成 (需要 faq frontmatter)
      
      # 实体增强
      entity:
        stableId: true       # 生成稳定 @id URL
        sameAs: true         # 自动链接社交账号和知识图谱
      
      # 信任信号
      trustSignals:
        author: true         # FAQ Answer 包含作者信息
        dateCreated: true    # FAQ Answer 包含创建日期
        upvoteCount: false   # 默认关闭（需要 frontmatter 明确指定）
      
      # 语音搜索优化
      speakable:
        enabled: true
        selectors:
          - "h1"
          - "h2"
          - ".article-summary"
          - ".article-content > p:first-of-type"
      
      # AI 引用追踪
      tracking:
        enabled: true
        path: "geo-status"   # 追踪页面路径: /geo-status/
      
      # 技术文章默认配置
      techArticle:
        defaultAudience: "developers"
        defaultProficiency: "intermediate"
      
      # HowTo 默认配置
      howTo:
        defaultCurrency: "USD"
```

## Multi-language Support

**策略**：所有 Schema 字段继承 Hugo 的 i18n 机制

**关键多语言字段**：
- `inLanguage`: 自动从 `.Site.Language.Lang` 获取
- `headline`, `description`: 从 frontmatter 或 i18n 获取
- `proficiencyLevel`: 提供 i18n 翻译

**i18n 文件扩展**：

```yaml
# i18n/zh-cn.yaml
geo:
  proficiency:
    beginner: "入门级"
    intermediate: "中级"
    advanced: "高级"
  audience:
    developers: "开发者"
    designers: "设计师"
    general: "通用"
  tracking:
    title: "GEO 状态"
    schemaStats: "Schema 统计"
    recommendations: "优化建议"
```

```yaml
# i18n/en.yaml
geo:
  proficiency:
    beginner: "Beginner"
    intermediate: "Intermediate"
    advanced: "Advanced"
  audience:
    developers: "Developers"
    designers: "Designers"
    general: "General"
  tracking:
    title: "GEO Status"
    schemaStats: "Schema Statistics"
    recommendations: "Optimization Recommendations"
```

## Performance Considerations

1. **条件渲染**
   - 仅在需要时生成对应 Schema
   - 使用 Hugo 条件判断减少不必要输出

2. **缓存策略**
   - 使用 `partialCached` 缓存重复 Schema（如 Organization、Website）
   - 缓存键包含语言标识确保多语言正确

3. **JSON 输出优化**
   - 开发环境：缩进格式便于调试
   - 生产环境：可选压缩输出

4. **最小化 DOM 操作**
   - Schema 使用 `<script type="application/ld+json">` 标签
   - 不影响页面渲染性能

## File Structure

```
layouts/
└── partials/
    └── structured-data/
        ├── include.html        # 修改：添加 GEO Schema 调度逻辑
        ├── article.html        # 修改：添加 @id、增强实体
        ├── faq.html            # 修改：添加信任信号字段
        ├── organization.html   # 修改：添加 @id、扩展 sameAs
        ├── website.html        # 修改：添加 @id
        ├── breadcrumb.html     # 保持不变
        ├── techarticle.html    # 新增：TechArticle Schema
        ├── howto.html          # 新增：HowTo Schema
        └── entity.html         # 新增：实体 ID 生成辅助

layouts/
└── page/
    └── geo-status.html         # 新增：GEO 追踪页面模板

i18n/
├── zh-cn.yaml                  # 修改：添加 GEO 翻译键
└── en.yaml                     # 修改：添加 GEO 翻译键

hugo.yaml                       # 修改：添加 geo 配置节
exampleSite/hugo.yaml           # 修改：添加 geo 配置示例
exampleSite/content/page/geo-status/
└── index.md                    # 新增：GEO 状态页面内容
```

## Testing Strategy

1. **Schema 语法验证**
   - Google Rich Results Test
   - Schema.org Validator
   - 本地 JSON 解析测试

2. **多语言验证**
   - 中文页面 Schema 完整性
   - 英文页面 Schema 完整性
   - inLanguage 字段正确性

3. **回归测试**
   - 现有 SEO 功能不受影响
   - 现有 Article Schema 正常输出
   - 页面加载性能无明显下降

4. **AI 平台测试**
   - ChatGPT 搜索测试查询
   - DeepSeek 搜索测试查询
   - 验证 Schema 被正确解析

## Security Considerations

1. **数据泄露风险**
   - 不在 Schema 中暴露敏感信息
   - 作者信息可配置显示级别

2. **XSS 防护**
   - JSON-LD 内容使用 `safeJS` 过滤
   - 用户输入内容正确转义

## Migration Notes

- 现有配置完全兼容，无需迁移
- 新功能默认启用但行为保守
- 用户可通过配置逐步启用高级功能
