# Spec: AI Citation Tracking

## Capability ID
`ai-citation-tracking`

## Summary
创建 GEO 状态追踪页面，提供站点 Schema 统计、覆盖率分析和优化建议，帮助站长监控和改进 AI 搜索优化效果。

## Related Capabilities
- `enhanced-faq-schema`: 统计 FAQ 覆盖率
- `techarticle-schema`: 统计 TechArticle 覆盖率
- `howto-schema`: 统计 HowTo 覆盖率
- `entity-enhancement`: 检查实体完整性

---

## ADDED Requirements

### Requirement: Create GEO status page template
系统提供 GEO 状态页面模板，展示站点 Schema 统计和优化建议。

#### Scenario: Status page accessible
**Given** 站点配置 `geo.tracking.enabled: true`
**And** 站点配置 `geo.tracking.path: geo-status`
**And** 存在 `/content/page/geo-status/index.md`
**When** 访问 `/geo-status/`
**Then** 页面正确渲染 GEO 状态信息

#### Scenario: Status page with custom path
**Given** 站点配置 `geo.tracking.path: seo-dashboard`
**And** 存在 `/content/page/seo-dashboard/index.md`
**When** 访问 `/seo-dashboard/`
**Then** 页面正确渲染 GEO 状态信息

#### Scenario: Tracking disabled
**Given** 站点配置 `geo.tracking.enabled: false`
**When** 页面渲染时
**Then** 不生成追踪相关元数据

---

### Requirement: Display Schema type statistics
状态页面必须显示各 Schema 类型的数量统计。

#### Scenario: Count TechArticle pages
**Given** 站点有 10 篇技术文章
**And** 其中 8 篇生成 TechArticle Schema
**When** 状态页面渲染时
**Then** 显示 "TechArticle: 8 / 10 (80%)"

#### Scenario: Count HowTo pages
**Given** 站点有 5 篇教程
**And** 其中 3 篇包含 HowTo Schema
**When** 状态页面渲染时
**Then** 显示 "HowTo: 3 / 5 (60%)"

#### Scenario: Count FAQ pages
**Given** 站点有 20 篇文章
**And** 其中 4 篇包含 FAQ Schema
**When** 状态页面渲染时
**Then** 显示 "FAQPage: 4 / 20 (20%)"

#### Scenario: Total structured data coverage
**Given** 站点有 50 个页面
**And** 45 个页面有任意 Schema
**When** 状态页面渲染时
**Then** 显示 "总覆盖率: 45 / 50 (90%)"

---

### Requirement: Display multi-language status
状态页面必须显示多语言 Schema 覆盖情况。

#### Scenario: Bilingual coverage
**Given** 站点支持中文和英文
**And** 中文页面 Schema 覆盖率 95%
**And** 英文页面 Schema 覆盖率 85%
**When** 状态页面渲染时
**Then** 显示各语言覆盖率:
- "中文 (zh-cn): 95%"
- "English (en): 85%"

#### Scenario: Missing translations warning
**Given** 某些页面只有中文版本有 Schema
**And** 对应英文版本缺失 Schema
**When** 状态页面渲染时
**Then** 显示警告 "部分页面多语言 Schema 不完整"

---

### Requirement: Provide optimization recommendations
状态页面必须提供可操作的优化建议。

#### Scenario: Low FAQ coverage recommendation
**Given** FAQ 覆盖率低于 30%
**When** 状态页面渲染时
**Then** 显示建议 "建议为更多文章添加 FAQ 部分，可提升 AI 引用率 340%"

#### Scenario: Missing difficulty field
**Given** 有技术文章未指定 difficulty
**When** 状态页面渲染时
**Then** 显示建议 "X 篇技术文章缺少 difficulty 字段，建议添加以优化 TechArticle Schema"

#### Scenario: Missing author sameAs
**Given** author 配置未包含社交账号
**When** 状态页面渲染时
**Then** 显示建议 "建议在配置中添加作者社交账号 (github, twitter) 以增强实体识别"

#### Scenario: All optimizations complete
**Given** 所有优化项已完成
**When** 状态页面渲染时
**Then** 显示 "太棒了！GEO 优化已全部完成"

---

### Requirement: Provide validation tool links
状态页面必须提供外部验证工具链接。

#### Scenario: Validation tools section
**When** 状态页面渲染时
**Then** 显示以下验证工具链接:
- Google Rich Results Test
- Schema.org Validator  
- JSON-LD Playground

#### Scenario: Test URL generation
**Given** 站点 baseURL 为 `https://example.com`
**When** 状态页面渲染时
**Then** Rich Results Test 链接包含当前站点 URL 参数
**Example**: `https://search.google.com/test/rich-results?url=https://example.com`

---

### Requirement: Show recent content without Schema
状态页面显示最近缺少 Schema 的内容列表。

#### Scenario: List pages without FAQ
**Given** 最近 5 篇文章中有 2 篇没有 FAQ
**When** 状态页面渲染时
**Then** 显示 "最近无 FAQ 的文章" 列表
**And** 包含文章标题和链接

#### Scenario: List pages without HowTo
**Given** 教程 section 有 3 篇文章没有 HowTo Schema
**When** 状态页面渲染时
**Then** 显示 "教程缺少 HowTo Schema" 列表
**And** 包含文章标题和链接

---

### Requirement: Display configuration status
状态页面显示当前 GEO 配置状态。

#### Scenario: Show enabled features
**When** 状态页面渲染时
**Then** 显示以下配置状态:
- TechArticle 自动检测: ✓ 启用
- HowTo 自动检测: ✓ 启用
- FAQ 增强: ✓ 启用
- 稳定 @id: ✓ 启用
- sameAs 链接: ✓ 启用
- Speakable: ✗ 禁用

#### Scenario: Show missing configuration
**Given** author.github 未配置
**When** 状态页面渲染时
**Then** 配置状态显示 "GitHub: ✗ 未配置"

---

## Page Layout

### Status Page Sections

1. **概览摘要**
   - 总 Schema 覆盖率
   - GEO 就绪评分 (0-100)
   - 上次更新时间

2. **Schema 统计**
   - TechArticle 数量/覆盖率
   - HowTo 数量/覆盖率
   - FAQPage 数量/覆盖率
   - 多语言分布

3. **优化建议**
   - 优先级排序的建议列表
   - 每个建议包含预期收益

4. **配置状态**
   - 已启用功能列表
   - 未配置项警告

5. **验证工具**
   - 外部验证工具链接
   - 示例测试 URL

6. **待优化内容**
   - 最近缺少 Schema 的页面列表
   - 快速操作链接

---

## Configuration

```yaml
params:
  seo:
    geo:
      tracking:
        enabled: true           # 启用追踪
        path: "geo-status"      # 状态页面路径
        showRecentPages: 10     # 显示最近多少个缺少 Schema 的页面
```

---

## Front Matter for Status Page

```yaml
# content/page/geo-status/index.md
---
title: "GEO 状态"
layout: "geo-status"
menu:
  main:
    weight: -90
    params:
      icon: search
---

此页面显示站点的 GEO（生成式引擎优化）状态和优化建议。
```

```yaml
# content/page/geo-status/index.en.md
---
title: "GEO Status"
layout: "geo-status"
---

This page shows the GEO (Generative Engine Optimization) status and recommendations for this site.
```

---

## Template Output Example

```html
<div class="geo-status">
  <section class="geo-overview">
    <h2>GEO 概览</h2>
    <div class="geo-score">
      <span class="score">85</span>
      <span class="label">/ 100 分</span>
    </div>
    <p>总 Schema 覆盖率: 90%</p>
  </section>
  
  <section class="schema-stats">
    <h2>Schema 统计</h2>
    <table>
      <tr>
        <th>类型</th>
        <th>数量</th>
        <th>覆盖率</th>
      </tr>
      <tr>
        <td>TechArticle</td>
        <td>25 / 30</td>
        <td>83%</td>
      </tr>
      <tr>
        <td>HowTo</td>
        <td>8 / 10</td>
        <td>80%</td>
      </tr>
      <tr>
        <td>FAQPage</td>
        <td>15 / 50</td>
        <td>30%</td>
      </tr>
    </table>
  </section>
  
  <section class="recommendations">
    <h2>优化建议</h2>
    <ul>
      <li>
        <strong>添加更多 FAQ</strong>
        <p>35 篇文章缺少 FAQ，添加可提升引用率 340%</p>
      </li>
      <li>
        <strong>配置作者 GitHub</strong>
        <p>添加 author.github 以增强实体识别</p>
      </li>
    </ul>
  </section>
  
  <section class="config-status">
    <h2>配置状态</h2>
    <ul class="config-list">
      <li class="enabled">✓ TechArticle 自动检测</li>
      <li class="enabled">✓ HowTo 自动检测</li>
      <li class="enabled">✓ FAQ 增强</li>
      <li class="enabled">✓ 稳定 @id</li>
      <li class="disabled">✗ Speakable (未启用)</li>
    </ul>
  </section>
  
  <section class="validation-tools">
    <h2>验证工具</h2>
    <ul>
      <li><a href="https://search.google.com/test/rich-results?url=...">Google Rich Results Test</a></li>
      <li><a href="https://validator.schema.org/">Schema.org Validator</a></li>
      <li><a href="https://json-ld.org/playground/">JSON-LD Playground</a></li>
    </ul>
  </section>
</div>
```

---

## i18n Keys

```yaml
# i18n/zh-cn.yaml
geo:
  tracking:
    title: "GEO 状态"
    overview: "概览"
    score: "分"
    coverage: "覆盖率"
    schemaStats: "Schema 统计"
    recommendations: "优化建议"
    configStatus: "配置状态"
    validationTools: "验证工具"
    enabled: "已启用"
    disabled: "未启用"
    notConfigured: "未配置"
    allOptimized: "太棒了！GEO 优化已全部完成"
    addFaqRecommendation: "篇文章缺少 FAQ，添加可提升引用率 340%"
    addDifficultyRecommendation: "篇技术文章缺少 difficulty 字段"
    addSameAsRecommendation: "建议添加作者社交账号以增强实体识别"
```

```yaml
# i18n/en.yaml
geo:
  tracking:
    title: "GEO Status"
    overview: "Overview"
    score: "points"
    coverage: "Coverage"
    schemaStats: "Schema Statistics"
    recommendations: "Recommendations"
    configStatus: "Configuration Status"
    validationTools: "Validation Tools"
    enabled: "Enabled"
    disabled: "Disabled"
    notConfigured: "Not Configured"
    allOptimized: "Great! All GEO optimizations are complete"
    addFaqRecommendation: "articles missing FAQ, adding can improve citation rate by 340%"
    addDifficultyRecommendation: "technical articles missing difficulty field"
    addSameAsRecommendation: "Consider adding author social accounts to enhance entity recognition"
```

---

## Validation Rules

1. **状态页面**: 必须使用 `layout: geo-status`
2. **路径配置**: 必须与实际内容路径匹配
3. **多语言**: 建议创建所有支持语言的版本
4. **权限**: 状态页面建议在菜单中隐藏或限制访问（如仅管理员）
