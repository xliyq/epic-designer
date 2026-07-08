# section-group 组件设计

## 1. 解决的问题

表单中存在按需显隐的预编排区块组合，典型场景：

```
表单中有一个多选组件（选择套餐）→ 选中几个套餐，就显示几个对应的区块
每个区块内部字段可能不同 → 区块 A 含 skuName + prodordCharacters
                           → 区块 B 含 skuName + skuCount
提交时数据合并在同一数组内 → formData.prodordSkus = [{...}, {...}]
```

## 2. 设计时 Schema

```json
{
  "type": "section-group",
  "field": "prodordSkus",
  "label": "套餐信息",
  "props": {
    "keyField": "skuNum",
    "selectionField": "selectedOffers",
    "title": "已选套餐"
  },
  "children": [
    {
      "optionKey": "2025999480006336",
      "children": [
        { "type": "input", "field": "skuName", "label": "套餐名称" },
        { "type": "attribute-group", "field": "prodordCharacters" }
      ]
    },
    {
      "optionKey": "2025999480006337",
      "children": [
        { "type": "input", "field": "skuName", "label": "套餐名称" },
        { "type": "input", "field": "skuCount", "label": "成员数量" }
      ]
    }
  ]
}
```

### 设计约定

| schema 属性 | 说明 |
|------------|------|
| `type: "section-group"` | 组件类型 |
| `groupName: "分组组件"` | 左侧元素面板分组 |
| `field` | 在 formData 中的 key，如 `"prodordSkus"` |
| `props.keyField` | 外部数据中用于匹配 optionKey 的字段名，如 `"skuNum"` |
| `props.selectionField` | 监听的选中值字段名，如 `"selectedOffers"` |
| `children[].optionKey` | 该区块的标识 key，与选择组件的 option value 一致 |
| `children[].children` | 该区块内的表单字段，设计时拖拽配置 |

### 区块容器 props

| prop | 类型 | 缺省 | 说明 |
|------|------|------|------|
| title | string | label | 区域标题 |
| bordered | boolean | true | 显示边框 |
| collapsible | boolean | false | 是否可折叠 |

## 3. 内部状态管理

```ts
// 固定长度 = children.length（设计时的区块数）
// null = 隐藏（未选中或没有数据）
// object = 可见（有数据）
internalData = ref<(T | null)[]>([
  { skuName: "尊享包", prodordCharacters: [...] },  // 可见
  null,                                                // 隐藏
])

// 对外产出（filter 掉 null，真数组无洞）
emit('update:modelValue', internalData.value.filter(Boolean))
```

## 4. 运行流程

### 4.1 初始化

```
initialData = modelValue ?? []
internalData = children.map(tpl =>
  initialData.find(d => d[keyField] === tpl.optionKey) ?? null
)
```

### 4.2 选择联动

监听 `formData[selectionField]` 的值变化控制显隐：

```ts
watch(() => formData[selectionField], (selected: string[]) => {
  if (!Array.isArray(selected)) return
  children.forEach((tpl, i) => {
    const isSelected = selected.includes(tpl.optionKey)
    if (isSelected && !internalData.value[i]) {
      // 选中：初始化空行
      internalData.value[i] = {}
    } else if (!isSelected && internalData.value[i]) {
      // 取消选中：清除数据
      internalData.value[i] = null
    }
  })
  emitOutput()
})
```

### 4.3 用户编辑

子组件不走 `setValueByPath`，直接操作内部数组：

```vue
<section-group (input=true, bindModel="modelValue")>
  <template v-for="(item, i) in internalData" :key="i">
    <div v-if="item" class="section-card">
      <component
        :is="resolveComponent(child.type)"
        v-for="child in children[i].children"
        v-model="item[child.field]"
        v-bind="computedChildProps(child)"
      />
    </div>
  </template>
</section-group>
```

每个行区块的渲染是**独立实例**——不同 `optionKey` 可以有完全不同的子组件集合。

### 4.4 setData 回填

```ts
// 外部传入 setData
setData({
  selectedOffers: ["2025999480006336", "2025999480006337"],
  prodordSkus: [
    { skuNum: "2025999480006336", skuName: "尊享包", ... },
    { skuNum: "2025999480006337", skuName: "基础包", ... }
  ]
})

// section-group 接收到 modelValue
watch(modelValue, (arr) => {
  internalData.value = children.map(tpl =>
    arr?.find(d => d[keyField] === tpl.optionKey) ?? null
  )
}, { immediate: true })
```

## 5. 与 attribute-group 的关系

```
section-group(field="prodordSkus")
  └─ optionKey="2025999480006336"
      ├─ Input(field="skuName")                  ← 标准表单字段
      └─ attribute-group(field="prodordCharacters")  ← 属性组
          └─ Select(bindAttribute="6001702001")       ← API 驱动
```

section-group 的子组件可以是：
- 标准 form 组件（Input / Select 等）
- attribute-group（处理属性数组）

## 6. 面板配置

### 6.1 section-group 自身面板

选中 section-group 节点时，右侧面板显示：

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 字段名 | input | `field` | formData 中的 key |
| 标题 | input | `props.title` | 区域标题 |
| key 字段 | input | `props.keyField` | 数据中用于匹配 optionKey 的字段名 |
| 选择字段 | input | `props.selectionField` | 监听哪个 formData 字段的选中值 |
| 显示边框 | switch | `props.bordered` | |
| 可折叠 | switch | `props.collapsible` | |

### 6.2 区块模板面板

section-group 的 children 中每个带 `optionKey` 的对象是一个区块模板。选中时显示：

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 选项 key | input | `optionKey` | 与选择组件的 option value 匹配 |
| 标题 | input | `label` | 区块显示标题 |

区块模板不是标准组件类型，通过**自定义子面板**替代原生属性面板（方案同 attribute-group）。

### 6.3 区块内子组件面板

区块内的子组件（Input、attribute-group 等）使用**它们自己的标准属性面板**，section-group 不干涉。

### 6.4 面板上下文检测

```ts
// section-group 在设计模式下 provide 子上下文
if (pageManager.isDesignMode.value) {
  provide(SECTION_GROUP_CTX, {
    groupField: props.componentSchema.field,
    isTemplate: true,  // 标记作用域
  })
}

// 区块模板渲染时再 provide 一层
// 让模板内子组件知道自己在 section-group 中（用于 attribute-group 面板检测）
provide(ATTRIBUTE_GROUP_PARENT_CTX, 'section-group')
```

### 6.5 对 core 的修改

| 改动 | 位置 | 说明 |
|------|------|------|
| `getFormSchemas` filter | `data.ts:582` | 加入 `type !== 'section-group'` |
| `reorganizeSchemasForTableView` | `data.ts:1037` | 加入 `isSectionGroup` 标记检查 |
| 组件配置 | `index.ts` | `input: true`, `bindModel: 'modelValue'` |
| `packages/ui-kit/panel-ui/src/rightSidebars/` | 小改 | 属性面板增加 section-group 上下文检测 |

setValueByPath / FIELD_PATH_PREFIX_KEY / deepCompareAndModify 均不需修改——section-group 自管理数据，不走这些链路。

## 7. 新增文件

| 路径 | 说明 |
|------|------|
| `packages/ui/elementPlus/src/section-group/index.ts` | 组件注册配置 |
| `packages/ui/elementPlus/src/section-group/section-group.vue` | 运行时组件 |
| `packages/ui/elementPlus/src/section-group/section-group-panel.vue` | 设计时区块模板配置面板 |
| `packages/hooks/src/designer/sectionGroupCtx.ts` | 设计时上下文 key 定义 |
