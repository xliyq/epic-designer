# Multi-View Script 设计

## 背景

`MultiViewDesigner` 包装 `EDesigner`，通过交换 `schemas[0].children` 实现多视图切换。
`PageSchema.script` 是页面级脚本，绑定事件函数供组件引用。

### 问题

当前所有数据同步路径只调用 `setCanvasChildren`，该方法仅替换 `schemas[0].children`，
完全忽略 `script` 字段，导致：

1. **初始化时**：`dataModel.script` 未推入 EDesigner，脚本编辑器显示空白
2. **保存时**：`handleSave` 只提取 `schemas[0].children`，丢弃 `getData()` 返回的 script
3. **prop 变化时**：外部传入的 `dataModel.script` 未同步到 EDesigner

## 方案选型

### 三种方案对比

| 方案 | 事件一致性 | 灵活性 | 实现成本 |
|------|-----------|--------|---------|
| 共享 script | ✓ | ✗ 无法单视图独立事件 | 低 |
| 独立 script | ✓ 实践中不受影响 | ✓ 每个视图可独立扩展逻辑 | 中 |
| 拆分公共+私有 | ✓ | ✓ | 高（需改脚本编辑器 UI） |

### 讨论 1：独立 script 是否可行？

> **疑问**：如果要给某一个视图添加独立的事件，是不是会影响到其他的视图和 dataModel？

如果每个视图有独立的 script，切换视图时需要像 `children` 一样保存和恢复 script：

- `switchToView`：保存当前 `pageSchema.script` 到 dataModel，加载目标视图的 script
- `switchToModel`：保存当前视图的 script，恢复 dataModel 的 script
- `switchToAnotherView`：保存旧视图 script，加载新视图 script
- `handleSave`：把当前 `pageSchema.script` 写回当前模式对应的 dataModel 或 view（不广播）

这样每个视图的 script 互不影响。

### 讨论 2：独立 script 的核心矛盾——字段池添加组件

> **疑问**：独立 script 后，从字段池中添加组件，它绑定的事件怎么办？

**结论：实践中不存在这个问题。**

字段池显示的是 `dataModel.schemas[0].children`——数据模型中的字段定义。
这些字段通常是纯结构（`input`、`select`、`datepicker` 等），`props` 里存的是 `required`、`placeholder` 这类属性。

事件绑定（如 `onClick`、`onChange`）是在设计器里对具体视图添加的，不会定义在数据模型里。
因此字段池的字段从一开始就没有事件绑定，`deepClone` 不会丢失任何东西。

### 讨论 3：共享 script 的取舍

共享 script 所有视图共用同一份函数定义，但代价是无法做视图级的事件隔离。

对于当前阶段，如果不需要视图独立逻辑，共享 script 成本更低。
但考虑到未来扩展性，独立 script 是更合理的架构。

### 结论

**采用独立 script 方案。** 每个视图维护自己的 script，
切换时保存/恢复，保存时只写回当前上下文，不广播。

## 独立 script 全量问题分析

### 问题 1：字段池添加组件时事件断裂

**不存在。** 数据模型中的字段不含事件绑定，字段池 `deepClone` 不会丢失事件。

### 问题 2：保存时 script 写回哪里？

与 children 规则一致：

| 当前模式 | children 保存到 | script 保存到 |
|---------|:--------------:|:------------:|
| 模型 | `dataModel` | `dataModel.script` |
| 视图 | `currentView` | `currentView.script` |

不广播，各自独立。

### 问题 3：初始化时加载哪个 script？

`handleDesignerReady` 中已有 `mode.value` 判断：

```
model 模式 → 加载 dataModel.script
view 模式  → 加载 currentView.script
```

### 问题 4：模式切换时 script 的保存/恢复

三处切换函数都需要同步操作 script，与 children 并行：

| 切换函数 | 保存 | 加载 |
|---------|:----:|:----:|
| `switchToView` (model→view) | `dataModel.script = pageSchema.script` | `setScript(views[viewId].script)` |
| `switchToModel` (view→model) | `currentView.script = pageSchema.script` | `setScript(dataModel.script)` |
| `switchToAnotherView` (view→view) | 旧视图 `script = pageSchema.script` | `setScript(新视图.script)` |

### 问题 5：`watch(props.dataModel)` 会覆盖当前视图的 script 吗？

会。如果当前是视图模式，外部传入新的 dataModel 并调了 `setDataModel`，
接着 `setScript(newModel.script)` 会覆盖正在编辑的视图 script。

**需要加判断：只在模型模式同步 script 到 EDesigner。**

### 问题 6：撤销栈与 script 的关系

EDesigner 的撤销栈只记录 `children` 变化，不记录 `script` 变化。
切换时保存/恢复 script 是独立于撤销栈的，行为与 EDesigner 原生一致。

### 问题 7：预览时 script 正确吗？

`handlePreview` 调的是 `designerRef.value?.preview(title)`，预览使用 EDesigner 当前的 `pageSchema.script`。
切换时已同步，预览正确。

### 问题 8：`defineExpose` 导出的方法需要改吗？

不需要。`getDataModel`、`getViews`、`getView` 都返回 `deepClone`，已含 script。
`setView`、`setViews` 也接受含 script 的 schema。

## 改动清单

### 1. EDesigner (`packages/core/src/components/designer/src/designer.vue`)

新增 `setScript` 方法并 expose：

```ts
/**
 * 设置页面脚本（script 为页面级共享字段，不随视图切换而交换）
 */
function setScript(script: string) {
  pageSchema.script = script;
}

defineExpose({
  // ... 已有方法
  setScript,
});
```

### 2. MultiViewDesigner.vue

#### 2.1 初始化 (`handleDesignerReady`)

EDesigner 就绪后，根据模式推送对应的 script：

```ts
function handleDesignerReady() {
  if (mode.value === 'model' && dataModel.schemas[0]?.children?.length) {
    designerRef.value?.setCanvasChildren(deepClone(dataModel.schemas[0]?.children ?? []))
  }
  // 根据模式推送对应的 script
  const script = mode.value === 'model'
    ? dataModel.script
    : currentView.value?.script
  designerRef.value?.setScript(script ?? '')
  nextTick(() => emit('ready'))
}
```

#### 2.2 prop 变化 (`watch(props.dataModel)`)

只在模型模式同步 script，避免覆盖视图的独立 script：

```ts
watch(() => props.dataModel, (newModel) => {
  if (!newModel) return
  setDataModel(newModel)
  if (mode.value === 'model') {
    designerRef.value?.setCanvasChildren(deepClone(newModel.schemas[0]?.children ?? []))
    // 只在模型模式同步 script
    designerRef.value?.setScript(newModel.script ?? '')
  }
}, { deep: true })
```

#### 2.3 保存 (`handleSave`)

script 只写回当前上下文，不广播：

```ts
function handleSave() {
  const schema = getDesignerData()
  if (schema) {
    if (mode.value === 'model') {
      dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
      dataModel.script = schema.script ?? ''
    } else {
      const view = currentView.value
      if (view) {
        view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
        view.script = schema.script ?? ''
      }
    }
  }
  emit('save')
}
```

#### 2.4 模式切换 (`switchToView` / `switchToModel`)

在切换 children 的同时保存/恢复 script：

```ts
function switchToView(viewId: string) {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 和 script 到数据模型
  if (dataModel.schemas[0]) {
    dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
  }
  dataModel.script = schema.script ?? ''

  saveCurrentHistory('model')

  // 加载视图字段
  const view = views[viewId]
  if (view) {
    designerRef.value?.setCanvasChildren(deepClone(view.schemas[0]?.children ?? []))
    designerRef.value?.setScript(view.script ?? '')
  } else {
    designerRef.value?.setCanvasChildren([])
    designerRef.value?.setScript('')
  }

  restoreHistory(viewId)
}

function switchToModel() {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 和 script 到当前视图
  const view = currentView.value
  if (view) {
    view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
    view.script = schema.script ?? ''
    saveCurrentHistory(currentViewId.value)
  }

  // 恢复数据模型字段
  designerRef.value?.setCanvasChildren(deepClone(dataModel.schemas[0]?.children ?? []))
  designerRef.value?.setScript(dataModel.script ?? '')

  restoreHistory('model')
}
```

#### 2.5 视图切换 (`switchToAnotherView`)

```ts
function switchToAnotherView(newViewId: string) {
  const newView = views[newViewId]
  if (newView) {
    designerRef.value?.setCanvasChildren(deepClone(newView.schemas[0]?.children ?? []))
    designerRef.value?.setScript(newView.script ?? '')
  }
  restoreHistory(newViewId)
}
```

还需要在 `handleSwitchView` 切换前保存旧视图的 script：

```ts
function handleSwitchView(newViewId: string) {
  if (mode.value !== 'view' || newViewId === currentViewId.value) return

  const schema = getDesignerData()
  if (schema) {
    const oldView = currentView.value
    if (oldView) {
      oldView.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
      oldView.script = schema.script ?? ''
      saveCurrentHistory(currentViewId.value)
    }
  }

  selectView(newViewId)
}
```

## 数据流总结

```
初始化（model 模式）：
  dataModel.script ──setScript──> EDesigner.pageSchema.script

初始化（view 模式）：
  currentView.script  ──setScript──> EDesigner.pageSchema.script

模式切换（model→view）：
  EDesigner.script ──保存──> dataModel.script
  views[viewId].script ──setScript──> EDesigner.script

模式切换（view→model）：
  EDesigner.script ──保存──> currentView.script
  dataModel.script ──setScript──> EDesigner.script

视图切换（view→view）：
  EDesigner.script ──保存──> 旧视图.script
  新视图.script ──setScript──> EDesigner.script

保存（model 模式）：
  EDesigner.script ──getData()──> dataModel.script

保存（view 模式）：
  EDesigner.script ──getData()──> currentView.script

prop 变化（仅 model 模式）：
  props.dataModel.script ──setScript──> EDesigner.script
```

## 不涉及的部分

- `useViewDesigner.ts`：无需改动，dataModel 和 views 初始化时已有 `script: ''`
- 字段池 `addFieldToView`：无需改动，数据模型字段不含事件绑定
- `defineExpose` 的导出方法：`getView` 返回的 schema 已含 script（deepClone），`setView` 也已包含
- `addViewType`：新增视图时已有 `script: ''`