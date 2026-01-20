# Spec: HowTo Schema

## Capability ID
`howto-schema`

## Summary
为教程和指南类内容创建 HowTo Schema，支持步骤、工具、材料、时间估算等字段，提升教程内容在 AI 搜索中的引用率（预期提升 68%）。

## Related Capabilities
- `entity-enhancement`: 使用稳定 @id
- `techarticle-schema`: 技术教程可同时使用两者

---

## ADDED Requirements

### Requirement: Generate HowTo Schema from frontmatter
系统从 frontmatter 的 `howto` 字段生成 HowTo Schema。

#### Scenario: Basic HowTo with steps
**Given** 文章 frontmatter 包含:
```yaml
howto:
  steps:
    - name: "步骤1"
      text: "执行步骤1的说明"
    - name: "步骤2"
      text: "执行步骤2的说明"
```
**When** 页面渲染时
**Then** 生成 HowTo Schema
**And** @type 为 "HowTo"
**And** step 数组包含两个 HowToStep

#### Scenario: HowTo section auto-detection
**Given** 文章位于 `tutorial` 或 `howto` 或 `guide` section
**And** 文章包含 `howto` frontmatter
**When** 页面渲染时
**Then** 生成 HowTo Schema

#### Scenario: No howto frontmatter
**Given** 文章不包含 `howto` frontmatter
**When** 页面渲染时
**Then** 不生成 HowTo Schema

---

### Requirement: Support totalTime field
HowTo 支持总时间估算，使用 ISO 8601 duration 格式。

#### Scenario: totalTime in ISO 8601 format
**Given** 文章 frontmatter 指定 `howto.totalTime: PT30M`
**When** 页面渲染时
**Then** Schema 包含 `totalTime: "PT30M"`

#### Scenario: totalTime in human-readable format
**Given** 文章 frontmatter 指定 `howto.totalTime: "30 minutes"`
**When** 页面渲染时
**Then** 系统转换为 ISO 8601 格式
**And** Schema 包含 `totalTime: "PT30M"`

#### Scenario: totalTime with hours and minutes
**Given** 文章 frontmatter 指定 `howto.totalTime: PT1H30M`
**When** 页面渲染时
**Then** Schema 包含 `totalTime: "PT1H30M"`

#### Scenario: No totalTime specified
**Given** 文章未指定 `howto.totalTime`
**When** 页面渲染时
**Then** Schema 不包含 `totalTime` 字段

---

### Requirement: Support estimatedCost field
HowTo 支持成本估算。

#### Scenario: Free tutorial
**Given** 文章 frontmatter 指定:
```yaml
howto:
  estimatedCost:
    currency: USD
    value: 0
```
**When** 页面渲染时
**Then** Schema 包含:
```json
"estimatedCost": {
  "@type": "MonetaryAmount",
  "currency": "USD",
  "value": "0"
}
```

#### Scenario: Paid resources required
**Given** 文章 frontmatter 指定:
```yaml
howto:
  estimatedCost:
    currency: CNY
    value: 99
```
**When** 页面渲染时
**Then** Schema 包含相应的 MonetaryAmount

#### Scenario: Default currency from config
**Given** 文章 frontmatter 指定 `howto.estimatedCost.value: 0`
**And** 未指定 currency
**And** 站点配置 `geo.howTo.defaultCurrency: USD`
**When** 页面渲染时
**Then** Schema 使用 USD 作为 currency

---

### Requirement: Support tools field
HowTo 支持工具列表。

#### Scenario: Single tool
**Given** 文章 frontmatter 指定:
```yaml
howto:
  tools:
    - VS Code
```
**When** 页面渲染时
**Then** Schema 包含:
```json
"tool": [
  {
    "@type": "HowToTool",
    "name": "VS Code"
  }
]
```

#### Scenario: Multiple tools
**Given** 文章 frontmatter 指定:
```yaml
howto:
  tools:
    - VS Code
    - Terminal
    - Git
```
**When** 页面渲染时
**Then** Schema 包含包含所有工具的 tool 数组

#### Scenario: Tool with URL
**Given** 文章 frontmatter 指定:
```yaml
howto:
  tools:
    - name: VS Code
      url: https://code.visualstudio.com/
```
**When** 页面渲染时
**Then** HowToTool 包含 url 字段

---

### Requirement: Support supplies field
HowTo 支持材料/供应品列表。

#### Scenario: Basic supplies
**Given** 文章 frontmatter 指定:
```yaml
howto:
  supplies:
    - API Key
    - 域名
```
**When** 页面渲染时
**Then** Schema 包含:
```json
"supply": [
  {
    "@type": "HowToSupply",
    "name": "API Key"
  },
  {
    "@type": "HowToSupply",
    "name": "域名"
  }
]
```

---

### Requirement: Support detailed steps
HowTo 必须支持详细的步骤定义。

#### Scenario: Step with position and URL
**Given** 文章 frontmatter 指定步骤
**And** 文章 URL 为 `https://example.com/tutorial/setup/`
**When** 页面渲染时
**Then** 每个 HowToStep 包含:
- position (从 1 开始)
- name
- text
- url (自动生成锚点链接)

#### Scenario: Step with image
**Given** 文章 frontmatter 指定:
```yaml
howto:
  steps:
    - name: "安装依赖"
      text: "运行安装命令"
      image: step1.png
```
**And** 文章位于 `content/tutorial/setup/`
**When** 页面渲染时
**Then** HowToStep.image 为完整 URL
**And** URL 为 `https://example.com/tutorial/setup/step1.png`

#### Scenario: Step with nested directions
**Given** 文章 frontmatter 指定:
```yaml
howto:
  steps:
    - name: "配置环境"
      text: "按以下步骤配置"
      directions:
        - "创建 .env 文件"
        - "添加 API_KEY 变量"
        - "设置数据库连接"
```
**When** 页面渲染时
**Then** HowToStep 包含 itemListElement 数组
**And** 每个子项为 HowToDirection
**And** 每个 HowToDirection 包含 position 和 text

---

### Requirement: Include stable @id URL
HowTo Schema 必须包含稳定的 @id URL。

#### Scenario: HowTo @id format
**Given** 文章 URL 为 `https://example.com/tutorial/setup/`
**When** 页面渲染时
**Then** Schema 包含 `@id: "https://example.com/tutorial/setup/#howto"`

---

### Requirement: Use page metadata for HowTo fields
HowTo 自动使用页面元数据填充基本字段。

#### Scenario: Name from title
**Given** 文章 title 为 "如何配置开发环境"
**When** 页面渲染时
**Then** HowTo.name 为 "如何配置开发环境"

#### Scenario: Description from page description
**Given** 文章 description 为 "本教程将指导你完成开发环境的配置"
**When** 页面渲染时
**Then** HowTo.description 为 "本教程将指导你完成开发环境的配置"

#### Scenario: inLanguage from site language
**Given** 当前语言为中文 (zh-cn)
**When** 页面渲染时
**Then** HowTo.inLanguage 为 "zh-CN"

---

## Schema Output Example

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://example.com/tutorial/setup-dev-env/#howto",
  "name": "如何配置开发环境",
  "description": "本教程将指导你从零开始配置完整的开发环境",
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
      "name": "GitHub 账号"
    },
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
      "text": "从官网下载并安装 Node.js LTS 版本，建议使用 18.x 或更高版本。",
      "url": "https://example.com/tutorial/setup-dev-env/#step-1",
      "image": "https://example.com/tutorial/setup-dev-env/step1.png"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "配置环境变量",
      "text": "创建并配置必要的环境变量",
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
          "text": "添加 API_KEY=your_api_key"
        },
        {
          "@type": "HowToDirection",
          "position": 3,
          "text": "添加 DATABASE_URL=your_database_url"
        }
      ]
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "验证安装",
      "text": "运行 node --version 和 npm --version 确认安装成功",
      "url": "https://example.com/tutorial/setup-dev-env/#step-3"
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
      autoDetect:
        howTo: true            # 启用 HowTo 检测（需要 howto frontmatter）
      
      howTo:
        defaultCurrency: "USD" # 默认货币
```

---

## Front Matter Reference

### Minimal Format
```yaml
---
title: "如何配置开发环境"
howto:
  steps:
    - name: "步骤1"
      text: "说明1"
    - name: "步骤2"
      text: "说明2"
---
```

### Full Format
```yaml
---
title: "如何配置开发环境"
description: "本教程将指导你从零开始配置完整的开发环境"

howto:
  totalTime: PT30M
  estimatedCost:
    currency: USD
    value: 0
  
  tools:
    - VS Code
    - Terminal
    - name: Git
      url: https://git-scm.com/
  
  supplies:
    - GitHub 账号
    - API Key
  
  steps:
    - name: "安装 Node.js"
      text: "从官网下载并安装 Node.js LTS 版本"
      image: step1.png
    
    - name: "配置环境变量"
      text: "创建并配置必要的环境变量"
      directions:
        - "创建 .env 文件"
        - "添加 API_KEY 变量"
        - "添加 DATABASE_URL 变量"
    
    - name: "验证安装"
      text: "运行命令确认安装成功"
---
```

---

## Validation Rules

1. **steps**: 至少需要 1 个步骤
2. **step.name**: 必填，建议简洁（10-30 字）
3. **step.text**: 必填，详细说明步骤
4. **totalTime**: 使用 ISO 8601 duration 格式 (PTnHnM)
5. **image**: 相对路径或完整 URL
6. **directions**: 每个子步骤建议简洁（20 字以内）
