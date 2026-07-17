# 多视图设计器设计文档

## 1. 解决的问题

epic-designer 当前的设计模式是**一套 Schema 对应一套界面**。如果同一份业务数据需要在不同场景下以不同形式展现（如创建时可编辑、审批时只读+高亮关键字段、查看时隐藏附件），就必须手动维护多份 Schema，字段定义重复且难以保持一致。

多视图设计器解决的核心问题是：**一套数据模型定义 -> N 套视图呈现方案**，每套视图可独立配置字段的显隐、排序、标签、只读状态、控件类型等，且互不影响。

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **数据模型** | 业务数据的元定义。定义有哪些字段、字段类型、校验规则、默认值等全局属性。独立于任何具体界面。对应 `PageSchema.schemas[0].children`。 |
| **视图类型** | 一个业务场景的标识，如「创建」「查看」「审批」。用户可自由增删，不固定。 |
| **视图配置** | 针对某个视图类型的内容呈现方案。包括哪些字段展示（layout）、展示顺序、每个字段的覆盖属性。 |
| **覆盖属性** | 字段在某个视图下的差异化配置。只存储被覆盖的字段，未覆盖的属性运行时自动继承数据模型中的全局值。 |

### 概念关系图

```
数据模型（1 套）
  ├── 字段A（input, label="申请人", required=true）
  ├── 字段B（textarea, label="请假事由", required=true）
  ├── 字段C（number, label="请假天数"）
  └── 字段D（select, label="请假类型"）

视图配置（N 套）
  ├── 创建视图
  │   ├── layout: [A, B, C, D]           ← 全部字段展示
  │   └── fieldOverrides: {}             ← 无覆盖，全部用全局值
  │
  ├── 审批视图
  │   ├── layout: [A, B, C]              ← D 不展示
  │   └── fieldOverrides:
  │       ├── B: { label: "审批摘要", props: { readonly: true } }
  │       ├── A: { props: { readonly: true } }
  │       └── C: { props: { disabled: true } }
  │
  └── 自定义视图
      ├── layout: [A, D]                ← 只展示2个字段
      └── fieldOverrides:
          └── D: { widgetType: "radio" }  ← 控件类型从 select 切换为 radio
```

## 3. 数据结构

### 3.1 类型定义

```typescript
/**
 * 视图类型配置（用户可增删）
 */
interface ViewTypeConfig {
  /** 唯一标识 */
  id: string;
  /** 显示名称，如"创建"、"审批" */
  name: string;
}

/**
 * 单个字段在某个视图下的覆盖属性
 * 只存储被覆盖的字段，未覆盖的属性运行时继承全局值
 *
 * 覆盖来源分三层：
 * 1. 顶层字段：label / hideLabel / rules / on / show
 * 2. 控件类型：widgetType（覆盖 ComponentSchema.type）
 * 3. props：浅合并（{ ...globalProps, ...overrideProps }）
 */
interface FieldOverride {
  /** 覆盖标签标题 */
  label?: string;
  /** 覆盖隐藏标签 */
  hideLabel?: boolean;
  /** 覆盖校验规则 */
  rules?: FormItemRule[];
  /** 覆盖事件绑定 */
  on?: { [eventName: string]: ActionsModel[] };
  /** 覆盖动态显隐 */
  show?: ((params: any) => boolean) | boolean;
  /** 覆盖控件类型，如将 input 切换为 textarea */
  widgetType?: string;
  /** 覆盖组件 props 中的特定字段（placeholder / disabled / readonly / ...） */
  props?: Record<string, any>;
}

/**
 * 单个视图的配置
 */
interface ViewConfig {
  /** 字段 ID 有序列表（决定展示哪些字段 + 排列顺序） */
  layout: string[];
  /** 字段覆盖属性，key = 字段 ID */
  fieldOverrides?: Record<string, FieldOverride>;
}

/**
 * 扩展后的页面 Schema
 * 在 PageSchema 基础上新增 viewTypes 和 viewConfigs
 */
interface MultiViewPageSchema extends PageSchema {
  /** 视图类型列表（可增删） */
  viewTypes?: ViewTypeConfig[];
  /** 视图配置，key = viewType.id */
  viewConfigs?: Record<string, ViewConfig>;
}
```

### 3.2 数据示例

```json
{
  "schemas": [
    {
      "id": "root",
      "type": "form",
      "label": "请假申请",
      "props": { "name": "default", "labelWidth": 100 },
      "children": [
        { "id": "f1", "label": "申请人", "type": "input", "field": "applicant", "input": true, "props": { "placeholder": "请输入姓名" } },
        { "id": "f2", "label": "请假事由", "type": "textarea", "field": "reason", "input": true, "props": { "placeholder": "请输入事由" } },
        { "id": "f3", "label": "请假天数", "type": "number", "field": "days", "input": true, "props": {} }
      ]
    }
  ],
  "viewTypes": [
    { "id": "create", "name": "创建" },
    { "id": "approve", "name": "审批" }
  ],
  "viewConfigs": {
    "create": {
      "layout": ["f1", "f2", "f3"],
      "fieldOverrides": {}
    },
    "approve": {
      "layout": ["f1", "f2"],
      "fieldOverrides": {
        "f2": { "label": "审批摘要", "props": { "readonly": true } },
        "f1": { "props": { "readonly": true } }
      }
    }
  }
}
```

### 3.3 覆盖属性的写入方式

右侧面板切换到「当前视图」时，使用的是 EDesigner 原生属性面板，编辑方式和全局完全一致。区别仅在于写入目标：全局模式写入字段本身，当前视图模式写入 `fieldOverrides`。

### 3.4 运行时合并逻辑

```
输入: MultiViewPageSchema + viewType="approve"
  ↓
1. 取 schemas[0].children = 全部字段定义（数据模型）
2. 取 viewConfigs["approve"].layout = ["f1", "f2"]（字段 ID + 顺序）
3. 过滤: 只保留 layout 中的字段
4. 排序: 按 layout 顺序重排
5. 合并: 对每个字段执行
   resolved = {
     ...field,
     label: override?.label ?? field.label,
     hideLabel: override?.hideLabel ?? field.hideLabel,
     type: override?.widgetType ?? field.type,
     rules: override?.rules ?? field.rules,
     on: override?.on ?? field.on,
     props: { ...field.props, ...override?.props },
   }
  ↓
输出: 标准 PageSchema（可直接传给 EBuilder 渲染）
```

```typescript
function resolveFieldSchema(field: ComponentSchema, override?: FieldOverride): ComponentSchema {
  if (!override) return field;
  return {
    ...field,
    label: override.label ?? field.label,
    hideLabel: override.hideLabel ?? field.hideLabel,
    rules: override.rules ?? field.rules,
    on: override.on ?? field.on,
    show: override.show ?? field.show,
    type: override.widgetType ?? field.type,
    props: { ...field.props, ...override.props },
  };
}
```

## 4. 交互设计

### 4.1 整体布局

整体布局、视觉风格、交互行为尽可能参考 EDesigner 现有效果，在其基础上扩展多视图能力：

- 三栏比例、面板宽度、间距与 EDesigner 保持一致
- 左侧面板的组件库 / 大纲 / 源码等 ActivityBar 切换、右侧面板的属性 / 样式 / 事件等 Tab 切换，行为与 EDesigner 一致
- 左右面板的收起/展开行为与 EDesigner 一致
- 模式切换和视图标签作为顶部工具栏的增强，不改变 EDesigner 原有的布局结构

具体扩展点：

| 位置 | EDesigner 原有 | 多视图扩展 |
|------|---------------|-----------|
| 顶部工具栏 | 标题 + 预览/保存 | 中间区域增加模式切换 + 视图标签 |
| 左侧 ActivityBar | 组件库 / 源码 / 大纲 | 视图设计模式下增加「字段池」选项 |
| 中间画布 | 拖拽画布 | 视图设计模式下按 layout 过滤/排序字段并应用覆盖属性 |
| 右侧面板 | 属性 / 样式 / 事件 | 属性面板顶部增加「全局 / 当前视图」切换 |

顶部工具栏分左-中-右三段：
- **左**：标题
- **中**：分两行。第一行是模式切换（数据模型 / 视图设计）；第二行是视图标签（创建 / 审批 / 自定义+），仅在「视图设计」模式下显示
- **右**：预览、保存按钮

### 4.2 模式切换

顶部工具栏中间区域提供两个主模式切换按钮：

| 模式 | 说明 |
|------|------|
| **数据模型** | 管理字段的「全局定义」。在此模式下使用 EDesigner 的完整拖拽设计能力：从组件库拖入字段、调整布局、配置全局属性。 |
| **视图设计** | 管理字段的「视图呈现」。在此模式下配置各视图的字段显隐、顺序、覆盖属性。 |

两种模式下的三栏内容差异：

| 区域 | 数据模型模式 | 视图设计模式 |
|------|------------|------------|
| **左栏** | EDesigner 原生组件库 | EDesigner 原生组件库 + **字段池**（新增） |
| **中栏** | EDesigner 原生拖拽画布 | EDesigner 原生画布（始终为真实表单渲染效果） |
| **右栏** | EDesigner 原生属性面板 | EDesigner 原生属性面板 + **全局/当前视图切换**（新增） |

### 4.3 数据模型模式

数据模型模式**直接使用 EDesigner 组件**，三栏与 EDesigner 完全一致：

| 区域 | 内容 | 实现 |
|------|------|------|
| 左栏 | 组件库（input / select / datepicker / ...） | EDesigner 原生 |
| 中栏 | 拖拽画布（拖入字段、调整布局、容器嵌套） | EDesigner 原生 |
| 右栏 | 属性面板（字段名、类型、必填、占位、校验规则等全局属性） | EDesigner 原生 |

在此模式下的一切行为与现有 EDesigner 完全一致：
- 拖拽添加字段到画布
- 点击字段选中，右侧配置全局属性
- 支持栅格布局、卡片分组、子表单等全部能力
- 保存时输出的 `schemas[0].children` 就是数据模型

### 4.4 视图设计模式

切换到视图设计模式后，顶部显示视图类型标签（可增删切换），三栏内容在 EDesigner 基础上增强：

#### 左栏：EDesigner 组件库 + 字段池

```
┌──────────────────────────────────┐
│ [组件库] [字段池]                  │  ← 面板内 Tab 切换
├──────────────────────────────────┤
│ ── 组件库 Tab ──                  │
│  input  select  datepicker        │
│  number  switch  upload          │
│  （与 EDesigner 组件库完全一致）     │
├──────────────────────────────────┤
│ ── 字段池 Tab ──                  │
│  字段池              6 个字段      │
│  👁 申请人      input             │  ← 在当前视图中（高亮）
│  👁 请假事由    textarea           │  ← 在当前视图中
│  🚫 请假天数    number             │  ← 不在当前视图中（灰色）
│  🚫 请假类型    select             │  ← 不在当前视图中
│                                  │
│  字段默认隐藏，点击眼睛图标        │
│  加入或移出当前视图               │
└──────────────────────────────────┘
```

- **组件库 Tab**：与 EDesigner 原生组件库完全一致，可拖拽添加新字段到数据模型
- **字段池 Tab**（新增）：列出数据模型中的全部字段
  - 每个字段旁有眼睛图标，表示当前是否在视图中显示
  - 点击眼睛图标：切换字段在当前视图 layout 中的加入/移出
  - 点击字段行：选中该字段，右侧面板显示其属性配置
  - 字段默认隐藏：新增字段后不会自动出现在任何视图中

#### 中栏：画布

视图设计模式下，中间画布与 EDesigner 画布完全一致，无任何变化。画布只渲染当前视图 `layout` 中的字段，并应用了当前视图的覆盖属性（如只读、标签覆盖、控件类型覆盖等）。

#### 右栏：EDesigner 属性面板 + 全局/当前视图切换

右侧面板顶部新增「全局 / 当前视图」切换按钮，下方直接复用 EDesigner 原生属性面板：

```
┌──────────────────────────────────────┐
│  f2                                   │  ← 字段 ID
│  请假事由  textarea                    │  ← 字段名 + 类型
├──────────────────────────────────────┤
│  [全局]  [当前视图-创建]               │  ← 全局/当前视图切换（新增）
├──────────────────────────────────────┤
│  标题          [请假事由]              │  ← 属性编辑器（与 EDesigner 完全一致）
│  占位内容      [请输入事由]            │
│  只读          [✗]                    │
│  禁用          [✗]                    │
│  最大长度      [200]                  │
│  校验规则      [配置]                  │
│  ...                                 │
└──────────────────────────────────────┘
```

- **全局**：编辑字段的全局属性，修改影响所有视图。属性列表和编辑器与 EDesigner 原生属性面板完全一致
- **当前视图**：编辑字段在当前视图下的属性，仅影响当前视图。属性列表和编辑器与全局完全一致，但写入的是覆盖值（`fieldOverrides`）
  - 切换到当前视图时，编辑器初始显示全局当前值，用户修改后写入 `fieldOverrides`
  - 控件类型可直接切换为其他类型（如将 input 切换为 textarea），仅影响当前视图

### 4.5 视图类型管理

| 操作 | 交互 |
|------|------|
| **切换视图** | 点击顶部视图标签，画布和属性面板同步切换 |
| **新增视图** | 点击 [+] 按钮，输入视图名称，自动创建空 layout |
| **删除视图** | 点击标签上的 ×，弹窗确认后删除（同时删除该视图的全部覆盖配置） |
| **重命名视图** | 双击标签名称，输入新名称 |

## 5. 技术架构

### 5.1 核心原则

**数据模型模式直接使用 EDesigner 组件，不重新搭建设计器运行时。**

之前尝试在 MultiViewDesigner 内部手动拼凑 `DESIGNER_CONTEXT_KEY`、`pageManager`、`revoke` 等上下文注入，导致大量兼容问题。正确的做法是：

```
数据模型模式 = 直接嵌入 <EDesigner> 组件
视图设计模式 = 复用 EDesigner 画布和属性面板 + 扩展字段池和全局/当前视图切换
```

### 5.2 数据模型模式实现

直接使用 EDesigner 组件，通过 `ref` 获取其 `getData()` / `setData()` 方法：

```vue
<template>
  <EDesigner
    v-if="mode === 'model'"
    ref="designerRef"
    form-mode
    @save="handleModelSave"
  />
</template>

<script setup>
const designerRef = ref();

// 获取数据模型（字段定义）
function getModelFields() {
  const schema = designerRef.value?.getData();
  return schema.schemas[0]?.children ?? [];
}

// 设置数据模型
function setModelFields(fields) {
  designerRef.value?.setData({ schemas: [{ ...formSchema, children: fields }] });
}
</script>
```

EDesigner 完整处理：组件库、拖拽画布、属性面板、撤销重做、预览。不需要手动注入任何上下文。

### 5.3 视图设计模式实现

视图设计模式复用 EDesigner 的中栏画布和右栏属性面板，在此基础上扩展左栏字段池和右栏全局/当前视图切换。扩展组件不使用 `useDesignerContext`、`usePageManager` 等 EDesigner 内部钩子，只通过 props/emit 与 MultiViewDesigner 通信。

```
packages/custom/multi-view/
├── types.ts                         ← 类型定义
├── composables/
│   ├── useViewDesigner.ts           ← 视图状态管理（模式/视图/字段显隐/覆盖读写）
│   └── useViewSchema.ts             ← Schema 合并解析（resolveViewSchema）
├── components/
│   ├── MultiViewDesigner.vue        ← 主组件（模式切换 + 条件渲染 EDesigner / 视图面板）
│   ├── ViewToolbar.vue              ← 顶部工具栏（模式切换 + 视图标签增删切换）
│   ├── FieldPool.vue                ← 左侧字段池（眼睛图标切换显隐）
│   └── ViewAttributePanel.vue       ← 右侧属性面板（全局 / 当前视图切换）
└── index.ts                         ← 导出
```

视图设计模式的扩展组件（FieldPool、ViewToolbar、ViewAttributePanel）不使用 `useDesignerContext`、`usePageManager` 等 EDesigner 内部钩子，只通过 props/emit 通信。中栏画布和右栏属性面板直接复用 EDesigner 原生组件。

### 5.4 模式间的数据同步

```
EDesigner (数据模型模式)
  │
  │  getData() -> schemas[0].children
  │
  ▼
useViewDesigner.pageSchema.schemas[0].children  ← 字段定义（唯一数据源）
  │
  │  读取字段列表 -> FieldPool 渲染
  │  读取字段列表 + layout -> 画布渲染
  │  读取字段 + fieldOverrides -> 右侧属性面板渲染
  │
  ▼
保存时: 合并 schemas + viewTypes + viewConfigs -> MultiViewPageSchema
```

切换到视图设计模式时，从 EDesigner 的 `getData()` 中读取最新的字段定义，同步到 `useViewDesigner` 的状态中。切换回数据模型模式时，将 `useViewDesigner` 的字段定义写回 EDesigner 的 `setData()`。

### 5.5 运行时渲染

EBuilder 不需要改动。在调用端做视图解析即可：

```vue
<!-- 运行时使用 -->
<script setup>
import { resolveViewSchema } from '@ies/custom/multi-view';

const resolvedSchema = computed(() =>
  resolveViewSchema(multiViewSchema, currentViewType)
);
</script>

<template>
  <EBuilder :pageSchema="resolvedSchema" :formData="formData" />
</template>
```

`resolveViewSchema` 将 `MultiViewPageSchema` + `viewType` 解析为标准 `PageSchema`，EBuilder 直接消费。

## 6. 完整交互流程

### 6.1 定义数据模型

1. 切换到「数据模型」模式
2. 从左侧组件库拖入字段（input / select / datepicker / ...）
3. 点击字段，在右侧属性面板配置全局属性（字段名、类型、必填、占位、校验规则等）
4. 可使用栅格布局、卡片分组、子表单等全部 EDesigner 能力

### 6.2 创建视图类型

1. 切换到「视图设计」模式
2. 顶部出现默认视图标签（创建 / 查看 / 审批）
3. 点击 [+] 新增自定义视图类型（如「经理复核」）
4. 点击视图标签切换到目标视图

### 6.3 配置视图内容

1. 在左侧字段池中，点击字段旁的眼睛图标，将字段加入当前视图
2. 字段出现在中栏画布中，按加入顺序排列
3. 点击画布中的字段，右侧面板显示属性配置

### 6.4 配置覆盖属性

1. 在右侧面板切换到「当前视图」
2. 编辑属性值（与全局模式下编辑方式完全一致）
3. 修改写入 `fieldOverrides`，仅影响当前视图
4. 切换视图标签，为同一字段在不同视图下独立配置

### 6.5 保存与预览

1. 点击「保存」：输出 `MultiViewPageSchema`（包含 schemas + viewTypes + viewConfigs）
2. 点击「预览」：选择视图类型，调用 `resolveViewSchema` 解析后用 EBuilder 渲染

## 7. API 参考

### 7.1 EMultiViewDesigner 组件

```vue
<MultiViewDesigner
  :default-schema="schema"
  title="请假申请"
  form-mode
  @save="handleSave"
  @ready="handleReady"
/>
```

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultSchema` | `MultiViewPageSchema` | - | 初始数据 |
| `title` | `string` | `'多视图设计器'` | 标题 |
| `formMode` | `boolean` | `true` | 是否使用表单模式 |

| 事件 | 参数 | 说明 |
|------|------|------|
| `save` | `MultiViewPageSchema` | 保存时触发 |
| `ready` | - | 组件就绪 |

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getData()` | `MultiViewPageSchema` | 获取当前数据 |
| `setData(schema)` | `void` | 设置数据 |

### 7.2 resolveViewSchema 函数

```typescript
function resolveViewSchema(
  schema: MultiViewPageSchema,
  viewType: string,
): PageSchema
```

将多视图 Schema + 视图类型解析为标准 PageSchema，可直接传给 EBuilder。

### 7.3 导出列表

```typescript
// 从 @ies/custom/multi-view 导出
export { MultiViewDesigner } from './components/MultiViewDesigner.vue';
export { resolveViewSchema, resolveFieldSchema } from './composables/useViewSchema';
export { useViewDesigner } from './composables/useViewDesigner';
export { createDemoSchema } from './presets/defaultData';

export type {
  ViewTypeConfig,
  FieldOverride,
  ViewConfig,
  MultiViewPageSchema,
} from './types';
```

## 8. 设计约束

| 约束 | 说明 |
|------|------|
| **字段默认隐藏** | 在数据模型中新增字段后，不自动出现在任何视图中，需手动从字段池加入 |
| **视图类型不固定** | 默认预置「创建 / 查看 / 审批」三种，用户可自由增删任意视图类型 |
| **数据模型模式复用 EDesigner** | 不重新搭建设计器运行时，直接使用 EDesigner 组件 |
| **纯前端实现** | 无需后端，Schema 落库由业务系统处理 |
| **打包发布** | 随 `@ies/custom` 包发布，外部项目 npm install 后可用 |

## 9. 与现有系统的关系

```
┌─────────────────────────────────────────────┐
│              业务系统 (ruoyi-vue-pro)          │
│                                             │
│  ┌─────────────┐     ┌──────────────────┐   │
│  │ EDesigner   │     │ EMultiViewDesigner│   │
│  │ (表单设计)   │     │ (多视图设计)      │   │
│  │             │     │                  │   │
│  │ 单一 Schema │     │ 数据模型 + N视图  │   │
│  │ -> 一套界面   │     │ -> N套界面        │   │
│  └──────┬──────┘     └────────┬─────────┘   │
│         │                     │              │
│         ▼                     ▼              │
│  ┌──────────────────────────────────────┐   │
│  │           EBuilder (渲染器)            │   │
│  │  PageSchema -> 表单界面                │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Schema 落库 -> 数据库存储                   │
└─────────────────────────────────────────────┘
```

- EDesigner 保持不变，向后兼容
- EMultiViewDesigner 是新增组件，不修改 EDesigner 源码
- EBuilder 保持不变，`resolveViewSchema` 在调用端使用
- 最终随 `@ies/custom` npm 包发布
