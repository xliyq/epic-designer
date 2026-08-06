# attribute-group 组件设计

## 1. 解决的问题

epic-designer 的 SubForm 处理的是**对象嵌套**（`formData.field.subField`），但业务中存在一种特殊的数据结构——**API 定义属性数组**：

```json
"poordCharacters": [
  {
    "charNum": "8044",
    "charName": "一级渠道类型",
    "charType": "1",
    "charValue": "其他渠道",
    "charDisplay": "其他渠道",
    "placeHolder": "请选择渠道类型",
    "maxLength": 512,
    "regular": null,
    "bizCharEnumSpecLst": [
      { "code": "政企渠道", "value": "政企渠道" },
      { "code": "其他渠道", "value": "其他渠道" }
    ],
    "prodordAttachFiles": []
  }
]
```

这种结构的特征：
- 数组长度和每一项的字段结构**由 API 定义**（设计时不可知）
- 用户在表单中对每一项的 `charValue` 等字段进行编辑
- 提交时数组结构不变，只是值被填充
- 同数组内可能混用多种控件类型（Select / Input / UploadFile 等）

## 2. 设计时 Schema

```
Form
├── ...
└── attribute-group(field="poordCharacters")
    ├── Select(field="", bindAttribute="8044", syncFields=["charDisplay"])
    ├── Input(field="", bindAttribute="8028")
    ├── UploadFile(field="", bindAttribute="8044", syncFields=["prodordAttachFiles"])
    └── ...
```

### 设计约定

| schema 属性 | 说明 |
|------------|------|
| `type: "attribute-group"` | 组件类型 |
| `groupName: "分组组件"` | 左侧元素面板分组 |
| `field` | attribute-group 自身在 formData 中的 key，如 `"poordCharacters"` |
| `children[].field` | **废弃**，attribute-group 运行时忽略子组件的 field |
| `children[].props.bindAttribute` | 绑定到 API 属性定义中的 `charNum`，**必填** |
| `children[].props.syncFields` | 子组件除了 `charValue` 之外还要同步写入的字段名数组，如 `["charDisplay"]` |

### 容器属性（继承 SubForm 的 UI 模式）

| prop | 类型 | 缺省 | 说明 |
|------|------|------|------|
| title | string | label | 折叠面板标题 |
| bordered | boolean | true | 显示边框 |
| collapsible | boolean | false | 是否可折叠 |
| collapseIconPosition | 'left' \| 'right' | 'right' | 折叠图标位置 |
| defaultCollapsed | boolean | false | 默认是否折叠 |
| gridEnable | boolean | false | 启用网格排版 |
| gridCols | number | 2 | 网格列数 (2-4) |
| labelPosition | '' \| 'left' \| 'right' \| 'top' | '' | 标签位置，空=继承父表单 |
| labelWidth | string \| number | '' | 标签宽度，空=继承父表单 |

## 3. attributeMeta 注入协议

attribute-group 运行时需要 API 返回的属性定义数据来覆盖子组件的 label/options/校验规则。通过 EBuilder 的 `attributeMeta` prop 注入：

```ts
// 使用方代码
<EBuilder
  :pageSchema="schema"
  :formData="editData"
  :attributeMeta="{
    poordCharacters: apiResult.poordCharacters,
    poordExtendCharacters: apiResult.poordExtendCharacters,
    prodordCharacters: apiResult.prodordCharacters,
    prodordTemplate: apiResult.prodordTemplate,
  }"
/>
```

```ts
// EBuilder 内部（新增）
import { ATTRIBUTE_META_KEY } from '@ies/hooks'
provide(ATTRIBUTE_META_KEY, props.attributeMeta ?? {})
```

```ts
// attribute-group 内部
const allMeta = inject(ATTRIBUTE_META_KEY, {})
const myAttrDefs = computed(() => allMeta[props.componentSchema.field] ?? [])
```

### API 定义覆盖 Props

attribute-group 运行时按 `bindAttribute` 匹配 API 定义，覆盖子组件的以下 props：

| 子组件 prop | 覆盖源 | 说明 |
|-----------|--------|------|
| `label` | `attrDef.charName` | 字段标签 |
| `placeholder` | `attrDef.placeHolder` | 占位提示 |
| `options` | `attrDef.bizCharEnumSpecLst` → `{label, value}` | 下拉/单选选项 |
| `maxlength` | `attrDef.maxLength` | 输入长度限制 |
| `rules[0].pattern` | `attrDef.regular` | 正则校验 |

## 4. attributeSync 组件声明

每个组件在注册时通过 `attributeSync` 声明它在 attribute-group 内的数据产出规则：

```ts
// Select 组件注册配置
export default {
  type: 'select',
  defaultSchema: { input: true, ... },
  attributeSync: {
    charValue: (rawValue, extra) => rawValue,
    charDisplay: (rawValue, extra) => extra?.option?.label ?? null,
  },
  // ...
} as ComponentConfigModel
```

```ts
// UploadFile 组件注册配置
export default {
  type: 'upload-file',
  attributeSync: {
    charValue: (rawValue) => rawValue?.map?.(f => f.fileId).join(',') ?? '',
    prodordAttachFiles: (rawValue) => rawValue ?? [],
  },
  // ...
}
```

```ts
// Input 组件注册配置（不声明 attributeSync，等同于缺省只写 charValue）
export default {
  type: 'input',
  defaultSchema: { input: true, ... },
  // 没有 attributeSync → charValue = rawValue
}
```

### 规则

- `attributeSync` 是一个 `Record<string, (rawValue, extra?) => any>` 对象
  - key: 要写入的属性字段名（如 `charValue`、`charDisplay`、`prodordAttachFiles`）
  - value: 从组件原始值推导出最终值的函数
- 没有 `attributeSync` 的组件视为 `{ charValue: v => v }`（直接赋值）
- `charValue` 始终是主字段，所有组件都必须产出（包括 UploadFile 存文件 ID）

## 5. 运行时数据流

### 5.1 数据保持策略（重要）

attribute-group 的 modelValue 存放的是**API 定义的完整数组项**。组件只修改用户可编辑的字段，**其他字段全部原样保持**，提交时一并输出：

```json
// API 定义
{
  "charNum": "8046",
  "charName": "统谈统签统付业务",
  "charType": "1",
  "charValue": "0",
  "charDisplay": "否",
  "alias": "askForPayType",          ← 非编辑字段，保持
  "toBossFlag": 1,                    ← 非编辑字段，保持
  "bizCharEnumSpecLst": [...]         ← 非编辑字段，保持
}

// 用户修改后
{
  "charNum": "8046",
  "charName": "统谈统签统付业务",
  "charType": "1",
  "charValue": "1",                   ← 用户修改
  "charDisplay": "是",                ← 同步更新
  "alias": "askForPayType",           ← 保持 ✓
  "toBossFlag": 1,                    ← 保持 ✓
  "bizCharEnumSpecLst": [...]         ← 保持 ✓
}
```

**只写字段**（attributeSync 中声明的 key）：
- `charValue` — 主值
- `charDisplay` — Select 等的中文名
- `prodordAttachFiles` — 上传文件数组
- 其余字段（alias / toBossFlag / bizCharEnumSpecLst / charNum / charName 等）— **只读保持**

### 5.2 初始化

```
API 返回 → attributeMeta: { poordCharacters: [...] }
setData(formData) → formData.poordCharacters = [{charValue: "xxx", ...}, ...]

attribute-group 初始化：
  1. formData 中取初始值（已有 setData 写入的初始数组）
  2. 按 bindAttribute 匹配 attrDef
  3. 合并 metaOverrides + groupMeta 到每个数组项
  4. 构建内部响应式数组
  5. 遍历子组件，用 API 定义覆盖 props 后渲染
```

### 5.3 元数据合并优先级

每个数组项最终值的字段来源优先级（从高到低）：

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 1 (最高) | `metaOverrides` | 子组件面板中手动覆盖的值 |
| 2 | 用户编辑的 `charValue` / 同步字段 | 运行时填写 |
| 3 | API 定义值 | `attributeMeta` 提供的初始值 |
| 4 | `groupMeta` | attribute-group 面板中配置的组级固定字段 |

### 5.2 用户编辑

```
用户填写 Select（选"政企渠道"）
  → 子组件 emit('update:modelValue', "政企渠道")
  → attribute-group 的 setFieldValue(child, rawValue)
    → 取 child.attributeSync
    → item.charValue = sync.charValue(rawValue)
    → item.charDisplay = sync.charDisplay(rawValue, { option })
    → emit('update:modelValue', 更新后的完整数组)

清除 Select 值
  → rawValue = null
  → item.charValue = null
  → sync 内其他字段 → 返回 null/[]
```

### 5.3 数据产出

```json
{
  "poordCharacters": [
    {
      "charNum": "8044",
      "charName": "一级渠道类型",
      "charType": "1",
      "charValue": "政企渠道",
      "charDisplay": "政企渠道",
      "prodordAttachFiles": []
    },
    {
      "charNum": "8028",
      "charName": "发展渠道编码",
      "charType": "2",
      "charValue": "1234567890123456789",
      "charDisplay": null,
      "prodordAttachFiles": []
    }
  ]
}
```

## 6. 渲染策略

attribute-group 在**设计模式**和**运行模式**行为不同：

```
设计模式:
  ┌──────────────────────────────────────────────┐
  │  attribute-group (provide ATTRIBUTE_GROUP_CTX)│
  │  ┌─ children ───────────────────────────────┐ │
  │  │  Select(field="")  ← EpNode 渲染           │ │
  │  │  Input(field="")   ← EpNode 渲染           │ │
  │  │  UploadFile        ← EpNode 渲染           │ │
  │  └──────────────────────────────────────────┘ │
  └──────────────────────────────────────────────┘
   → 走 slot#node，让 EpNode 递归渲染子组件（标准设计器拖拽行为）
   → provide ATTRIBUTE_GROUP_CTX 供子组件的面板检测
   → 设计模式下 attribute-group 不干涉数据，不注入元数据

运行模式:
  ┌──────────────────────────────────────────────┐
  │  attribute-group                              │
  │  ┌─ children ───────────────────────────────┐ │
  │  │  <component :is="Select">                │ │
  │  │    v-bind="mergedApiProps('8044')"       │ │  ← API + metaOverrides + groupMeta
  │  │    v-model="attrItem('8044')"            │ │
  │  │  </component>                            │ │
  │  └──────────────────────────────────────────┘ │
  └──────────────────────────────────────────────┘
   → attribute-group 从 pluginManager 拿到组件定义
   → 用 <component :is="..."> 手动渲染
   → 自己接管 v-model 绑定和 props 覆盖
   → 不走 EpNode 递归，不走 FIELD_PATH_PREFIX_KEY
   → 合并 groupMeta + metaOverrides 到每个数组项
```

## 7. 面板配置

attribute-group 涉及三层面板配置，在右侧面板中通过**上下文检测**实现：

- 选中 attribute-group 自身 → 显示容器面板 + 组元数据面板
- 选中 attribute-group 内的子组件 → 显示属性组子配置面板（替代子组件的原生面板）

### 7.1 attribute-group 自身面板

当设计器中选中 attribute-group 节点时，右侧面板显示：

**容器属性**

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 字段名 | input | `field` | formData 中的 key |
| 标题 | input | `props.title` | 折叠面板标题 |
| 显示边框 | switch | `props.bordered` | |
| 可折叠 | switch | `props.collapsible` | |
| 网格排版 | switch | `props.gridEnable` | |
| 网格列数 | number | `props.gridCols` | 2-4 |
| 标签位置 | select | `props.labelPosition` | left/right/top |
| 标签宽度 | input | `props.labelWidth` | |

**组元数据** — 注入到每个数组项中的固定字段

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 组元数据 | key-value | `props.groupMeta` | 如 `{ sourceSystem: "web" }`，提交时合并到每个数组项 |

### 7.2 子组件面板（attribute-group 内）

当选中 attribute-group **内**的子组件（Select/Input/UploadFile 等）时，右侧面板替代为属性组子配置面板：

**属性绑定**

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 绑定属性 | select | `props.bindAttribute` | 从 `attributeMeta[groupField]` 中读取所有 charNum 供选择 |
| 同步字段 | checkbox-group | `props.syncFields` | `charDisplay`、`prodordAttachFiles` 等 |

**属性元数据覆盖** — 覆盖 API 定义的字段值

| 字段 | 类型 | 对应 schema | 说明 |
|------|------|------------|------|
| 元数据覆盖 | key-value | `props.metaOverrides` | 如 `{ alias: "customName", toBossFlag: 0 }`，优先级高于 API 定义 |

### 7.3 面板上下文检测机制

```ts
// attribute-group 在设计模式下 provide 子上下文
if (pageManager.isDesignMode.value) {
  provide(ATTRIBUTE_GROUP_CTX, {
    groupField: props.componentSchema.field,
    attrsMeta: allMeta.value[props.componentSchema.field] ?? [],
  })
}

// 属性面板渲染时
const attrGroupCtx = inject(ATTRIBUTE_GROUP_CTX, null)
if (attrGroupCtx && selectedNode.parentType === 'attribute-group') {
  // 渲染属性组子配置面板（bindAttribute / syncFields / metaOverrides）
} else {
  // 渲染该组件类型的标准属性面板
}
```

## 8. 新增/修改的文件

| 路径 | 动作 | 说明 |
|------|------|------|
| `packages/ui/elementPlus/src/attribute-group/` | 新增 | 组件注册、运行时组件、设计态子配置面板 |
| `packages/types/src/epic-designer.ts` | 新增 | 扩展 `ComponentConfigModel` 增加 `attributeSync` 定义 |
| `packages/hooks/src/designer/` | 新增 | `attributeMetaKey.ts` 定义注入 key |
| `packages/hooks/src/designer/` | 新增 | `attributeGroupCtx.ts` 定义设计时上下文 key |
| `packages/core/src/components/builder/` | 小改 | 转发 `attributeMeta` prop 为 provide |
| `packages/ui-kit/panel-ui/src/rightSidebars/` | 小改 | 属性面板增加 attribute-group 上下文检测 |
| 各输入组件（select/upload-file/radio/...） | 小改 | 注册配置加 `attributeSync` |
