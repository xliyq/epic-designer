# EMultiViewDesigner 多视图设计器

:::tip 多视图设计器
`EMultiViewDesigner` 是设计器的扩展组件，解决**同一套数据模型需要多套呈现方案**的场景。例如：创建时可编辑、审批时只读+高亮、查看时隐藏部分字段。
:::

## 解决的问题

传统设计器一套 Schema 对应一套界面。如果同一份数据需要在不同场景下以不同形式展现，必须手动维护多份 Schema，字段定义重复且难以保持一致。

多视图设计器的核心：**一套数据模型定义 → N 套视图呈现方案**，每套视图可独立配置字段的显隐、排序、标签、只读状态、控件类型等。

## 使用方式

### 安装

多视图设计器随 `@ies/custom` 包提供，通过 `@ies/designer` 自动加载扩展后即可使用：

```vue
<script setup lang="ts">
import { EMultiViewDesigner } from '@ies/custom'
</script>
```

### 基础用法

```vue
<template>
  <EMultiViewDesigner
    ref="designerRef"
    :data-model="dataModel"
    :view-types="viewTypes"
    :views="views"
    @save="handleSave"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { EMultiViewDesigner } from '@ies/custom'

const dataModel = ref({
  schemas: [{
    type: 'form',
    children: [
      { type: 'input', field: 'name', label: '姓名' },
      { type: 'input', field: 'phone', label: '手机号' },
    ]
  }]
})

const viewTypes = ref([
  { id: 'create', name: '创建' },
  { id: 'view', name: '查看' },
])

const designerRef = ref()

function handleSave() {
  const model = designerRef.value?.getDataModel()
  const views = designerRef.value?.getViews()
  const types = designerRef.value?.getViewTypes()
  console.log({ model, views, types })
}
</script>
```

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data-model` | `PageSchema` | — | 数据模型，定义字段的全局结构 |
| `view-types` | `ViewTypeConfig[]` | — | 视图类型列表，每项 `{ id, name }` |
| `views` | `Record<string, PageSchema>` | `{}` | 可选，各视图的 Schema 数据 |

### 方法（通过 ref 调用）

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getDataModel()` | `PageSchema` | 获取数据模型 |
| `getViews()` | `Record<string, PageSchema>` | 获取所有视图 |
| `getView(id)` | `PageSchema \| undefined` | 获取指定视图 |
| `getViewTypes()` | `ViewTypeConfig[]` | 获取视图类型列表 |

## 核心概念

| 概念 | 说明 |
|------|------|
| **数据模型** | 业务数据的元定义，定义有哪些字段、类型、校验规则等 |
| **视图类型** | 业务场景标识，如「创建」「查看」「审批」，可自由增删 |
| **视图** | 针对某个视图类型的呈现方案，每个视图是独立的标准 `PageSchema` |

## 模式说明

### 数据模型模式

管理字段的全局定义。从组件库拖入字段、调整布局、配置全局属性。此模式下与 EDesigner 完全一致。

### 视图设计模式

为每个视图独立配置字段的显隐、顺序和属性：

- **字段池**：左侧新增「字段池」面板，列出数据模型中的所有字段
- **加入视图**：点击字段池中的字段，自动加入当前视图画布
- **独立编辑**：修改视图中的字段属性不影响数据模型和其他视图
- **全局编辑**：开启「全局」模式后，编辑字段属性会自动同步到数据模型和其他视图

## 运行时渲染

视图本身就是标准 `PageSchema`，可直接用 `EBuilder` 渲染：

```vue
<template>
  <EBuilder :pageSchema="views[currentViewType]" :formData="formData" />
</template>
<script setup lang="ts">
import { EBuilder } from '@ies/designer'
</script>
```

## 设计约束

- 字段默认不自动出现在视图中，需从字段池加入
- 同一字段在同一个视图中只会出现一次
- 视图类型由业务方通过 `viewTypes` prop 传入，不预设默认值
- 数据模型和视图各自独立，互不影响
- Schema 落库由业务系统处理