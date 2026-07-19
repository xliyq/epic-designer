# 多视图设计器设计文档

## 1. 解决的问题

epic-designer 当前的设计模式是**一套 Schema 对应一套界面**。如果同一份业务数据需要在不同场景下以不同形式展现（如创建时可编辑、审批时只读+高亮关键字段、查看时隐藏附件），就必须手动维护多份 Schema，字段定义重复且难以保持一致。

多视图设计器解决的核心问题是：**一套数据模型定义 -> N 套视图呈现方案**，每套视图可独立配置字段的显隐、排序、标签、只读状态、控件类型、脚本等，且互不影响。

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **数据模型** | 业务数据的元定义。定义有哪些字段、字段类型、校验规则、默认值等属性。对应标准 `PageSchema`。 |
| **视图类型** | 一个业务场景的标识，如「创建」「查看」「审批」。用户可自由增删，不固定。 |
| **视图** | 针对某个视图类型的呈现方案，与数据模型结构完全一致，都是标准 `PageSchema`。包含字段列表、脚本等。 |

### 概念关系

```
数据模型 = PageSchema { schemas: [字段列表], script }
视图A    = PageSchema { schemas: [视图A的字段], script: "视图A的脚本" }
视图B    = PageSchema { schemas: [视图B的字段], script: "视图B的脚本" }
```

每个视图的字段列表独立于数据模型和其他视图，修改视图不影响数据模型，修改数据模型也不影响已有视图。

## 3. 数据结构

### 3.1 类型定义

不新增任何类型。数据模型和视图都使用标准 `PageSchema`：

```typescript
// 来自 @ies/types
interface PageSchema {
  schemas: ComponentSchema[];  // 根节点（如 form）的 children 为字段列表
  script?: string;             // 自定义脚本
  canvas?: { mode?, height?, width? };
}
```

视图类型列表单独定义（轻量，只含标识）：

```typescript
interface ViewTypeConfig {
  id: string;
  name: string;
}
```

### 3.2 运行时渲染

视图本身就是标准 `PageSchema`，渲染时直接传给 EBuilder：

```vue
<EBuilder :pageSchema="currentViewSchema" :formData="formData" />
```

不需要额外的解析函数。

## 4. 交互设计

### 4.1 整体布局

整体布局基于 EDesigner 现有结构，在其外部和扩展点增强，**不修改 EDesigner 源码**：

```
MultiViewDesigner
├── ViewToolbar（外部组件，替换 EDesigner 的 header）
│   ├── 左：标题
│   ├── 中：模式切换（数据模型 / 视图设计）+ 视图标签（仅视图设计模式显示）
│   └── 右：预览、保存按钮
│
└── EDesigner（hidden-header，内部三栏布局不变）
    ├── EActivityBar
    │   ├── 组件库（模型模式）/ 组件库 + 字段池（视图模式）
    │   ├── 源码
    │   └── 大纲
    ├── EEditContainer（画布，始终渲染 pageSchema.schemas[0].children）
    └── ERightSidebar
        ├── 属性
        ├── 样式
        └── 事件
```

具体扩展点：

| 位置 | EDesigner 原有 | 多视图扩展 |
|------|---------------|-----------|
| 顶部工具栏 | 标题 + 预览/保存 | 外部 ViewToolbar 组件提供模式切换 + 视图标签 |
| 左侧 ActivityBar | 组件库 / 源码 / 大纲 | 通过 `registerActivitybar` 注册「字段池」；视图模式显示，模型模式隐藏 |
| 中间画布 | 拖拽画布 | 模型模式渲染数据模型字段，视图模式通过 `pageSchema.schemas[0].children` 切换渲染视图字段 |
| 右侧面板 | 属性 / 样式 / 事件 | 保持 EDesigner 原生属性面板不变 |

### 4.2 模式切换

| 模式 | 说明 |
|------|------|
| **数据模型** | 管理字段的全局定义。从组件库拖入字段、调整布局、配置全局属性。 |
| **视图设计** | 管理字段的视图呈现。配置各视图的字段显隐、顺序、属性。 |

模式切换时，三栏变化：

| 区域 | 数据模型模式 | 视图设计模式 |
|------|------------|------------|
| **左栏** | 组件库 / 源码 / 大纲 | 组件库 / 字段池 / 源码 / 大纲 |
| **中栏** | 画布渲染数据模型字段 | 画布渲染当前视图字段（通过切换 pageSchema.schemas[0].children） |
| **右栏** | 属性 / 样式 / 事件 | 保持 EDesigner 原生属性面板不变 |

### 4.3 数据模型模式

数据模型模式**直接使用 EDesigner 组件**（`hidden-header`），三栏与 EDesigner 完全一致：

| 区域 | 内容 |
|------|------|
| 左栏 | 组件库（input / select / datepicker / ...） |
| 中栏 | 拖拽画布（拖入字段、调整布局、容器嵌套） |
| 右栏 | 属性面板（字段名、类型、必填、占位、校验规则等全局属性）|

在此模式下的一切行为与现有 EDesigner 完全一致：
- 拖拽添加字段到画布
- 点击字段选中，右侧配置全局属性
- 支持栅格布局、卡片分组、子表单等全部能力

### 4.4 视图设计模式

切换到视图设计模式后，顶部显示视图类型标签，三栏内容基于 EDesigner 扩展：

#### 左栏：ActivityBar 新增字段池面板

通过 `pluginManager.panel.registerActivitybar()` 注册，始终可见，跟组件库、源码、大纲并列：

```
视图设计模式下的左侧 ActivityBar 图标栏：
  [组件库图标] [字段池图标] [源码图标] [大纲图标]
       ↑ 新增，点击后显示字段池面板

字段池面板内容：
┌──────────────────────────────────┐
│  ▶ 字段池              6/10 个    │  ← 可折叠标题栏（已加入/总计）
├──────────────────────────────────┤
│  │                               │
│  └─ 申请人           f1     ✓    │  ← 已加入视图（显示 ✓ 标记）
│  └─ 请假事由         f2     ✓    │
│  └─ 请假天数         f3          │  ← 未加入，可点击加入
│  └─ 请假类型         f4          │  ← 未加入
│                                  │
│  数据来源：始终是数据模型          │
│  - 模型模式：读 EDesigner 实时数据 │
│  - 视图模式：读数据模型快照        │
│                                  │
│  视图模式下点击未加入的字段        │
│  自动添加到画布，位置与数据模型一致 │
└──────────────────────────────────┘
```

- **组件库**：与 EDesigner 原生组件库完全一致，始终可用
- **字段池**（新增）：列出数据模型中的全部字段，使用 `EpicTree` 组件渲染
  - 始终展示数据模型中的字段，不受视图切换影响
  - 统计格式：`已加入数量/总叶子字段数`，如 `6/10 个`
  - 模型模式下点击字段可在右侧面板编辑属性
  - 视图模式下点击字段触发以下行为：
    1. 从数据模型中深拷贝该字段
    2. 插入到视图字段列表中，**位置与数据模型中的索引一致**
    3. 已加入的字段显示 ✓ 标记，灰色不可点击
    4. 画布自动刷新显示新字段
    5. 用户可在画布内拖拽调整顺序
  - 面板标题栏可点击折叠/展开，收起后隐藏字段列表

#### 中栏：画布

视图设计模式下，**中间画布与 EDesigner 画布完全一致，无任何变化**。通过切换 `pageSchema.schemas[0].children` 指向当前视图的字段列表，画布自动渲染当前视图内容。

#### 右栏：属性面板

保持 EDesigner 原生属性面板不变。选中画布中的字段后，属性编辑行为与 EDesigner 完全一致。

**全局/当前视图切换**：在 ViewToolbar 上提供切换开关，开启"全局"模式时，编辑字段属性后自动同步到数据模型 + 所有其他视图的同 ID 字段。默认"当前视图"模式，仅影响当前视图。

### 4.5 视图类型管理

| 操作 | 交互 |
|------|------|
| **切换视图** | 点击顶部视图标签，画布和属性面板同步切换 |
| **新增视图** | 点击 [+] 按钮，输入视图名称，自动创建空的 PageSchema |
| **删除视图** | 点击标签上的 ×，弹窗确认后删除 |
| **重命名视图** | 双击标签名称，输入新名称 |

## 5. 技术架构

### 5.1 核心原则

**不修改 EDesigner 源码，所有扩展通过现有机制实现。**

MultiViewDesigner 内部始终只有一个 `EDesigner`（`hidden-header`），模式切换只做一件事：**交换 `pageSchema.schemas[0].children` 指向的数据**。

### 5.2 数据模型

```
MultiViewDesigner 内部状态:
├── dataModel: PageSchema      ← 数据模型（标准 PageSchema）
├── viewTypes: ViewTypeConfig[]  ← 视图类型列表 [{ id, name }]（轻量）
└── views: Record<string, PageSchema>  ← 各视图的 PageSchema
```

`dataModel` 和 `views` 都是标准 `PageSchema`，完全一致。

### 5.3 数据传入方式

```vue
<MultiViewDesigner
  ref="designerRef"
  :data-model="dataModel"          // 数据模型（PageSchema）
  :view-types="viewTypes"          // [{ id, name }]（轻量，不含字段数据）
  :views="views"                   // Record<string, PageSchema>（可选，按需传入）
  @save="handleSave"
/>
```

- `view-types` 只有 id + name，数据量小
- `views` 可选传入，也可以之后通过方法逐个设置

### 5.4 数据获取方式（通过 ref）

```typescript
const designerRef = ref<InstanceType<typeof MultiViewDesigner>>()

// 获取数据模型
const model = designerRef.value?.getDataModel()  // PageSchema

// 获取所有视图
const allViews = designerRef.value?.getViews()   // Record<string, PageSchema>

// 获取单个视图
const view = designerRef.value?.getView('create') // PageSchema | undefined

// 获取视图类型列表
const types = designerRef.value?.getViewTypes()   // ViewTypeConfig[]
```

### 5.5 字段池注册

通过 `pluginManager.panel.registerActivitybar()` 注册字段池面板：

```typescript
pluginManager.panel.registerActivitybar({
  component: FieldPool,
  id: 'field_pool',
  icon: 'icon--epic--list',
  title: '字段池',
  sort: 150,
  visible: false,
})
```

- 数据模型模式：`hideActivitybar('field_pool')`
- 视图设计模式：`showActivitybar('field_pool')`

### 5.6 模式切换时数据流

```
数据模型模式:
  pageSchema.schemas[0].children = dataModel.schemas[0].children
  → 画布渲染模型字段
  → 属性面板编辑模型字段

切换到视图设计:
  1. 保存当前 pageSchema.schemas[0].children 到 dataModel（如果是在模型模式下修改过）
  2. 从当前视图的 PageSchema 中取出 children
  3. pageSchema.schemas[0].children = 当前视图的字段列表
  4. 显示字段池

视图设计模式:
  pageSchema.schemas[0].children = 当前视图的字段列表
  → 画布渲染视图字段
  → 属性面板编辑视图字段（selectedNode 即视图中的字段对象）

切换到数据模型:
  1. 将当前 pageSchema.schemas[0].children 写回当前视图的 PageSchema
  2. pageSchema.schemas[0].children = 恢复为数据模型字段
  3. 隐藏字段池
```

### 5.7 全局编辑的同步逻辑

```
用户选中"全局"模式，编辑字段属性
  ↓
1. 修改当前视图中的字段（selectedNode 上的属性变更）
2. 同步到数据模型：
   - 找到数据模型中同 ID 的字段
   - 将修改后的属性值复制过去
3. 同步到其他视图：
   - 遍历所有其他视图的 PageSchema
   - 如果该视图也包含同 ID 字段，同步更新
```

### 5.8 运行时渲染

EBuilder 不需要改动。视图本身就是标准 `PageSchema`，直接渲染：

```vue
<script setup>
const props = defineProps<{
  views: Record<string, PageSchema>;
  currentViewTypeId: string;
  formData?: any;
}>();
</script>
<template>
  <EBuilder :pageSchema="views[currentViewTypeId]" :formData="formData" />
</template>
```

## 6. 完整交互流程

### 6.1 定义数据模型

1. 切换到「数据模型」模式
2. 从左侧组件库拖入字段
3. 点击字段，在右侧属性面板配置属性
4. 可使用栅格布局、卡片分组、子表单等全部 EDesigner 能力

### 6.2 创建视图类型

1. 切换到「视图设计」模式
2. 顶部出现默认视图标签（创建 / 查看 / 审批）
3. 点击 [+] 新增自定义视图类型（如「经理复核」）
4. 点击视图标签切换到目标视图

### 6.3 配置视图内容

1. 在左侧字段池中，点击字段旁的眼睛图标，将字段加入当前视图
2. 字段出现在中栏画布中
3. 点击画布中的字段，右侧面板显示属性配置

### 6.4 配置视图字段属性

1. 保持「当前视图」模式（默认），编辑画布中字段的属性
2. 编辑仅影响当前视图，不影响数据模型和其他视图
3. 切换视图标签，为同一字段在不同视图下独立配置

### 6.5 全局编辑字段属性

1. 在 ViewToolbar 上切换到「全局」模式
2. 编辑画布中字段的属性
3. 自动同步到数据模型 + 所有其他视图的同 ID 字段

### 6.6 保存

保存时由业务方通过 `ref` 自行获取所需数据：

```typescript
const model = designerRef.value?.getDataModel()
const views = designerRef.value?.getViews()
const types = designerRef.value?.getViewTypes()
```

## 7. 组件结构

```
packages/custom/multi-view/
├── composables/
│   └── useViewDesigner.ts          ← 视图状态管理（模式切换/视图增删/字段显隐/同步逻辑）
├── components/
│   ├── MultiViewDesigner.vue       ← 主组件（EDesigner + ViewToolbar + FieldPool 注册）
│   ├── ViewToolbar.vue             ← 顶部工具栏（模式切换 + 视图标签增删切换 + 全局/视图切换）
│   └── FieldPool.vue               ← 左侧字段池面板
├── presets/
│   └── defaultData.ts              ← 演示默认数据
└── index.ts                        ← 导出入口
```

各组件职责：

| 组件 | 职责 | 通信方式 |
|------|------|---------|
| `MultiViewDesigner` | 组合 EDesigner + ViewToolbar，管理模式切换和数据同步 | props/emit + ref expose |
| `ViewToolbar` | 模式切换按钮、视图标签增删切换、全局/当前视图切换 | props/emit |
| `FieldPool` | 显示数据模型字段列表、眼睛图标切换显隐 | 通过 `pluginManager` 注册 |

## 8. 设计约束

| 约束 | 说明 |
|------|------|
| **字段默认不出现** | 在数据模型中新增字段后，不自动出现在任何视图中，需从字段池点击加入或通过 API 加入 |
| **位置按数据模型** | 从字段池加入视图时，插入位置与数据模型中的索引一致，而非追加到末尾 |
| **不可重复加入** | 同一字段在同一个视图中只会出现一次，已加入的字段显示 ✓ 标记且不可再次点击 |
| **视图类型不固定** | 默认预置「创建 / 查看 / 审批」三种，用户可自由增删任意视图类型 |
| **不修改 EDesigner 源码** | 所有扩展通过 `pluginManager.panel`、`hidden-header` prop、`pageSchema` 数据操纵实现 |
| **数据模型和视图独立** | 每个视图是独立 `PageSchema`，互不影响 |
| **全局编辑自动同步** | 切换到"全局"模式编辑时，自动同步到数据模型 + 所有其他视图的同 ID 字段 |
| **纯前端实现** | Schema 落库由业务系统处理 |
| **打包发布** | 随 `@ies/custom` 包发布 |

## 9. 与现有系统的关系

```
业务系统
│
├── 传入：dataModel (PageSchema) + viewTypes + views (Record<string, PageSchema>)
│
├── MultiViewDesigner
│   ├── ViewToolbar（模式/视图切换 + 全局/视图切换）
│   └── EDesigner (hidden-header)
│   ├── 字段池面板（EDesigner 外部渲染）
│       ├── EEditContainer（自动响应 children 切换）
│       └── ERightSidebar（原生属性面板不变）
│
├── 获取：getDataModel() / getViews() / getViewTypes()
│
└── EBuilder 运行时：直接渲染 views[viewType]
```

- EDesigner 保持不变，向后兼容
- MultiViewDesigner 是新增组件，不修改 EDesigner 源码
- EBuilder 保持不变，直接渲染视图的 PageSchema
- 最终随 `@ies/custom` npm 包发布