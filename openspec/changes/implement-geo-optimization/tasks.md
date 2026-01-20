# Tasks: GEO Optimization Implementation

## Overview
本任务清单按阶段组织，确保快速见效并逐步完善功能。

---

## Phase 1: Core Schema Enhancement (Week 1-2)
**目标**：实现核心 Schema 增强，预期引用率提升 150-340%

### Task 1.1: Update Configuration
**优先级**: High | **预估时间**: 2h | **依赖**: 无

- [ ] 在 `hugo.yaml` 添加 `geo` 配置节
- [ ] 设置智能默认值（enabled: true, 保守行为）
- [ ] 更新 `exampleSite/hugo.yaml` 添加完整配置示例
- [ ] 文档化所有配置项

**验证**:
- Hugo 构建无错误
- 配置项可正确读取

---

### Task 1.2: Enhance FAQ Schema
**优先级**: High | **预估时间**: 3h | **依赖**: Task 1.1

- [ ] 修改 `layouts/partials/structured-data/faq.html`
- [ ] 添加 `author` 字段到 `acceptedAnswer`
- [ ] 添加 `dateCreated` 字段（使用页面发布日期）
- [ ] 添加可选 `upvoteCount` 字段（从 frontmatter 读取）
- [ ] 添加 `@id` URL 到 FAQPage
- [ ] 保持向后兼容（现有 frontmatter 格式继续工作）

**验证**:
- Google Rich Results Test 通过
- JSON-LD 语法正确
- 现有 FAQ 内容正常渲染

---

### Task 1.3: Create TechArticle Schema
**优先级**: High | **预估时间**: 4h | **依赖**: Task 1.1

- [ ] 创建 `layouts/partials/structured-data/techarticle.html`
- [ ] 实现 `@id` 稳定 URL 生成
- [ ] 支持 `proficiencyLevel` (beginner/intermediate/advanced)
- [ ] 支持 `dependencies` 数组
- [ ] 支持 `prerequisites` 字符串或数组
- [ ] 支持 `audience` 对象
- [ ] 支持 `speakable` 配置
- [ ] 继承 Article Schema 的所有字段
- [ ] 添加自动检测逻辑（section 判断）

**验证**:
- Google Rich Results Test 通过
- 技术文章页面正确输出 TechArticle
- proficiencyLevel 多语言翻译正确

---

### Task 1.4: Add Stable Entity IDs
**优先级**: High | **预估时间**: 2h | **依赖**: Task 1.1

- [ ] 创建 `layouts/partials/structured-data/entity.html` 辅助模板
- [ ] 定义 @id 生成规则函数
- [ ] 修改 `article.html` 添加 `@id`
- [ ] 修改 `organization.html` 添加 `@id`
- [ ] 修改 `website.html` 添加 `@id`
- [ ] 确保跨页面 ID 一致性

**验证**:
- 同一实体在不同页面的 @id 相同
- @id URL 格式正确且稳定

---

### Task 1.5: Update Schema Orchestrator
**优先级**: High | **预估时间**: 2h | **依赖**: Task 1.2, 1.3, 1.4

- [ ] 修改 `layouts/partials/structured-data/include.html`
- [ ] 添加 TechArticle 条件加载逻辑
- [ ] 添加 HowTo 条件加载预留（Phase 2）
- [ ] 优化加载顺序
- [ ] 添加 geo.enabled 检查

**验证**:
- 不同类型页面加载正确的 Schema
- 构建性能无明显下降

---

## Phase 2: Extended Features (Week 3-4)
**目标**：扩展 HowTo 支持和实体增强

### Task 2.1: Create HowTo Schema
**优先级**: Medium | **预估时间**: 5h | **依赖**: Phase 1

- [ ] 创建 `layouts/partials/structured-data/howto.html`
- [ ] 支持 `totalTime` (ISO 8601 格式转换)
- [ ] 支持 `estimatedCost` 对象
- [ ] 支持 `tool[]` 数组
- [ ] 支持 `supply[]` 数组
- [ ] 支持 `step[]` 数组
- [ ] 支持嵌套 `directions` 子步骤
- [ ] 支持步骤图片（相对路径转绝对 URL）
- [ ] 生成步骤锚点 URL
- [ ] 更新 `include.html` 添加 HowTo 加载

**验证**:
- Google Rich Results Test 通过
- 教程页面正确输出 HowTo Schema
- 步骤顺序正确

---

### Task 2.2: Enhance sameAs Links
**优先级**: Medium | **预估时间**: 2h | **依赖**: Task 1.4

- [ ] 扩展 Organization Schema 的 sameAs 数组
- [ ] 扩展 Author/Person Schema 的 sameAs 数组
- [ ] 支持从 `site.Author` 配置自动提取
- [ ] 支持 Wikidata 链接格式
- [ ] 支持自定义 sameAs 列表

**验证**:
- sameAs 链接格式正确
- 知识图谱连接可验证

---

### Task 2.3: Multi-language i18n
**优先级**: Medium | **预估时间**: 3h | **依赖**: Task 1.3, 2.1

- [ ] 在 `i18n/zh-cn.yaml` 添加 GEO 翻译键
- [ ] 在 `i18n/en.yaml` 添加 GEO 翻译键
- [ ] 确保 `inLanguage` 正确传递
- [ ] proficiencyLevel 多语言翻译
- [ ] audience 多语言翻译
- [ ] 追踪页面多语言支持

**验证**:
- 中文页面 Schema 语言正确
- 英文页面 Schema 语言正确
- 翻译键无缺失

---

### Task 2.4: Speakable Support
**优先级**: Low | **预估时间**: 2h | **依赖**: Task 1.3

- [ ] 实现 speakable 生成逻辑
- [ ] 支持配置 CSS 选择器
- [ ] 集成到 TechArticle Schema
- [ ] 可选集成到 Article Schema

**验证**:
- speakable 格式符合 Schema.org 规范
- 选择器指向有效元素

---

## Phase 3: Tracking & Validation (Week 5-6)
**目标**：实现自动分析和验证工具

### Task 3.1: Create GEO Status Page Template
**优先级**: Medium | **预估时间**: 4h | **依赖**: Phase 1, 2

- [ ] 创建 `layouts/page/geo-status.html` 模板
- [ ] 实现 Schema 类型统计逻辑
- [ ] 显示 TechArticle/HowTo/FAQ 数量
- [ ] 计算结构化数据覆盖率
- [ ] 显示多语言状态
- [ ] 添加优化建议列表
- [ ] 添加验证工具外链

**验证**:
- 页面正确渲染
- 统计数据准确
- 多语言切换正常

---

### Task 3.2: Create Status Page Content
**优先级**: Medium | **预估时间**: 1h | **依赖**: Task 3.1

- [ ] 创建 `exampleSite/content/page/geo-status/index.md`
- [ ] 创建 `exampleSite/content/page/geo-status/index.zh-cn.md`
- [ ] 设置页面 frontmatter (layout: geo-status)
- [ ] 添加页面描述

**验证**:
- 中英文页面可访问
- 布局正确应用

---

### Task 3.3: Schema Validation Data
**优先级**: Low | **预估时间**: 2h | **依赖**: Task 3.1

- [ ] 实现缺失字段检测逻辑
- [ ] 生成优化建议
- [ ] 检测 Schema 与内容不一致
- [ ] 输出验证摘要

**验证**:
- 能检测常见问题
- 建议可操作

---

### Task 3.4: Documentation
**优先级**: High | **预估时间**: 3h | **依赖**: All above

- [ ] 更新 README.md 添加 GEO 功能说明
- [ ] 创建 GEO 配置详细文档
- [ ] 添加 Front Matter 字段参考
- [ ] 添加示例内容文件
- [ ] 添加常见问题解答

**验证**:
- 文档完整准确
- 示例可运行

---

### Task 3.5: Testing & Validation
**优先级**: High | **预估时间**: 3h | **依赖**: All above

- [ ] 创建测试内容（中英文技术文章各一）
- [ ] 创建测试内容（中英文教程各一）
- [ ] 创建测试内容（带 FAQ 的文章）
- [ ] 运行 Google Rich Results Test（所有 Schema 类型）
- [ ] 验证 JSON-LD 语法正确性
- [ ] 性能测试（页面加载时间对比）
- [ ] 回归测试（现有 SEO 功能）

**验证**:
- 所有测试通过
- 无回归问题

---

## Dependencies Graph

```
                    ┌─────────────┐
                    │  Task 1.1   │
                    │   Config    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌───────────┐    ┌───────────┐    ┌───────────┐
   │ Task 1.2  │    │ Task 1.3  │    │ Task 1.4  │
   │    FAQ    │    │TechArticle│    │ Entity ID │
   └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
         │                │                 │
         └────────────────┼─────────────────┘
                          │
                          ▼
                   ┌───────────┐
                   │ Task 1.5  │
                   │ Orchestr. │
                   └─────┬─────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌───────────┐     ┌───────────┐       ┌───────────┐
│ Task 2.1  │     │ Task 2.2  │       │ Task 2.3  │
│   HowTo   │     │  sameAs   │       │   i18n    │
└─────┬─────┘     └─────┬─────┘       └─────┬─────┘
      │                 │                   │
      └─────────────────┼───────────────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       ┌───────────┐       ┌───────────┐
       │ Task 2.4  │       │ Task 3.1  │
       │ Speakable │       │Status Page│
       └───────────┘       └─────┬─────┘
                                 │
                                 ▼
                          ┌───────────┐
                          │ Task 3.2  │
                          │  Content  │
                          └─────┬─────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       ┌───────────┐     ┌───────────┐     ┌───────────┐
       │ Task 3.3  │     │ Task 3.4  │     │ Task 3.5  │
       │Validation │     │   Docs    │     │  Testing  │
       └───────────┘     └───────────┘     └───────────┘
```

---

## Parallel Work Opportunities

以下任务可并行执行：

**Phase 1 并行组**:
- Task 1.2 (FAQ) + Task 1.3 (TechArticle) + Task 1.4 (Entity ID)
- 前提：Task 1.1 (Config) 完成

**Phase 2 并行组**:
- Task 2.2 (sameAs) + Task 2.3 (i18n)
- Task 2.1 (HowTo) 需要独立完成

**Phase 3 并行组**:
- Task 3.3 (Validation) + Task 3.4 (Docs)
- 前提：Task 3.1, 3.2 完成

---

## Verification Checklist

### Phase 1 验收标准
- [ ] 配置项文档化且有示例
- [ ] FAQ Schema 包含 author 和 dateCreated
- [ ] TechArticle Schema 正确输出
- [ ] 所有 Schema 包含稳定 @id
- [ ] Google Rich Results Test 100% 通过

### Phase 2 验收标准
- [ ] HowTo Schema 正确输出
- [ ] sameAs 链接到知识图谱
- [ ] 中英文 Schema 完整
- [ ] Speakable 格式正确

### Phase 3 验收标准
- [ ] GEO 状态页面可访问
- [ ] 统计数据准确
- [ ] 文档完整
- [ ] 所有测试通过
- [ ] 无性能回归

---

## Estimated Total Time
- Phase 1: ~13 hours
- Phase 2: ~12 hours
- Phase 3: ~13 hours
- **Total: ~38 hours**

## Risk Mitigation
- 每个 Task 完成后立即验证
- 保持向后兼容性
- 使用 `partialCached` 优化性能
- 文档同步更新
