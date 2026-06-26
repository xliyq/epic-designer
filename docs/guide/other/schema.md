# Schema 参考

## PageSchema

设计器输出的顶层数据结构。

```typescript
interface PageSchema {
  /** 画布设置 */
  canvas?: {
    height?: string
    mode?: 'desktop' | 'mobile' | 'pad'
    width?: string
  }
  /** 页面组件树 */
  schemas: ComponentSchema[]
  /** 自定义脚本（由 Monaco 编辑器编写） */
  script?: string
}
```

## ComponentSchema

每个组件的节点结构。

```typescript
interface ComponentSchema {
  type: string
  id?: string
  field?: string
  label?: string
  description?: string
  input?: boolean
  noFormItem?: boolean
  props?: Record<string, any>
  children?: ComponentSchema[]
  rules?: FormItemRule[]
  on?: { [eventName: string]: ActionsModel[] }
  show?: ((params: RenderCallbackParams) => boolean) | boolean
  slotName?: string
  slots?: { [slotName: string]: ComponentSchema[] }
}
```

### 通用 props（表单输入组件）

| 字段 | 类型 | 说明 |
|------|------|------|
| `field` | `string` | 字段标识 |
| `label` | `string` | 显示标签 |
| `defaultValue` | `any` | 默认值 |
| `placeholder` | `string` | 占位文本 |
| `size` | `'small' \| 'default' \| 'large'` | 尺寸 |
| `clearable` | `boolean` | 可清空 |
| `readonly` | `boolean` | 只读 |
| `disabled` | `boolean` | 禁用 |
| `hidden` | `boolean` | 隐藏 |
| `span` | `number` | 网格模式下当前字段占几列 |
| `rules` | `FormItemRule[]` | 校验规则 |

### Form 特有

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | `'default'` | 表单标识 |
| `label-position` | `'left' \| 'right' \| 'top'` | `'left'` | 标签位置 |
| `labelWidth` | `string \| number` | `'100px'` | 标签宽度 |
| `labelSuffix` | `string` | — | 标签后缀 |
| `require-asterisk-position` | `'left' \| 'right'` | — | 星号位置 |
| `inline-message` | `boolean` | — | 行内展示校验信息 |
| `status-icon` | `boolean` | — | 校验反馈图标 |
| `scroll-to-error` | `boolean` | — | 滚动到错误处 |
| `formMode` | `'normal' \| 'grid' \| 'inline'` | `'normal'` | 表单模式 |
| `gridCols` | `number` | `2` | 网格列数（2-4），`formMode='grid'` 时生效 |

### Input 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `maxlength` | `number` | 最大字符数 |
| `showWordLimit` | `boolean` | 字数统计（需 `maxlength`） |
| `type` | `'text' \| 'password' \| ...` | 输入框类型 |
| `showPassword` | `boolean` | 密码切换可见（需 `type='password'`） |

### Textarea 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `maxlength` | `number` | 最大字符数 |
| `showWordLimit` | `boolean` | 字数统计（需 `maxlength`） |
| `autosize.minRows` | `number` | 最小行数 |
| `autosize.maxRows` | `number` | 最大行数 |

### InputNumber 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `min` | `number` | 最小值 |
| `max` | `number` | 最大值 |
| `step` | `number` | 步长 |
| `precision` | `number` | 精度（小数位数） |
| `controlsPosition` | `'right'` | 按钮位置 |
| `stepStrictly` | `boolean` | 严格步长 |

### Select 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `multiple` | `boolean` | 多选 |
| `collapseTags` | `boolean` | 折叠标签（需 `multiple`） |
| `collapseTagsTooltip` | `boolean` | 标签折叠提示（需 `multiple`+`collapseTags`） |
| `reserveKeyword` | `boolean` | 保留关键词（需 `multiple`） |
| `tagType` | `string` | 标签类型（需 `multiple`） |
| `multipleLimit` | `number` | 多选上限（需 `multiple`） |
| `filterable` | `boolean` | 可搜索 |
| `allowCreate` | `boolean` | 允许创建 |
| `placement` | `string` | 下拉位置 |
| `fitInputWidth` | `boolean` | 下拉宽度匹配输入 |
| `noDataText` | `string` | 无数据文本 |
| `options` | `array` | 选项数据源 |

### Radio 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `radioButton` | `boolean` | 按钮样式 |
| `textColor` | `string` | 按钮文字颜色（需 `radioButton`） |
| `fill` | `string` | 按钮填充色（需 `radioButton`） |
| `options` | `array` | 选项数据源 |

### Checkbox 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `min` | `number` | 最小勾选数 |
| `max` | `number` | 最大勾选数 |
| `radioButton` | `boolean` | 按钮样式 |
| `textColor` | `string` | 按钮文字颜色（需 `radioButton`） |
| `fill` | `string` | 按钮填充色（需 `radioButton`） |
| `options` | `array` | 选项数据源 |

### Switch 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `activeValue` | `any` | 开启时的值 |
| `inactiveValue` | `any` | 关闭时的值 |
| `activeText` | `string` | 开启文字 |
| `inactiveText` | `string` | 关闭文字 |
| `width` | `number` | 宽度(px) |
| `inlinePrompt` | `boolean` | 文字显示在按钮内 |

### DatePicker 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `string` | 日期类型（date/daterange/datetime/datetimerange/monthrange） |
| `format` | `string` | 显示格式 |
| `valueFormat` | `string` | 值格式 |
| `editable` | `boolean` | 可手动输入 |
| `startPlaceholder` | `string` | 开始占位（范围选择） |
| `endPlaceholder` | `string` | 结束占位（范围选择） |
| `rangeSeparator` | `string` | 范围分隔符 |

### Cascader 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `separator` | `string` | 分隔符 |
| `expandTrigger` | `'click' \| 'hover'` | 展开触发方式 |
| `filterable` | `boolean` | 可搜索 |
| `props.multiple` | `boolean` | 多选 |
| `collapseTags` | `boolean` | 折叠标签（需 `props.multiple`） |
| `collapseTagsTooltip` | `boolean` | 标签折叠提示 |
| `showAllLevels` | `boolean` | 显示完整路径 |
| `props.checkStrictly` | `boolean` | 严格选择 |
| `props.emitPath` | `boolean` | 输出路径数组 |
| `options` | `array` | 选项数据源 |

### Slider 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `min` | `number` | 最小值 |
| `max` | `number` | 最大值 |
| `step` | `number` | 步长 |
| `showStops` | `boolean` | 显示间断点 |
| `showTooltip` | `boolean` | 显示提示 |
| `range` | `boolean` | 范围选择 |
| `vertical` | `boolean` | 垂直模式 |
| `height` | `string` | 滑块高度（垂直模式） |
| `showInput` | `boolean` | 显示输入框 |
| `showInputControls` | `boolean` | 输入框按钮（需 `showInput`） |
| `placement` | `string` | 提示位置 |

### ColorPicker 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `colorFormat` | `'hsl' \| 'hsv' \| 'hex' \| 'rgb'` | 颜色格式 |
| `showAlpha` | `boolean` | 透明度选择 |

### Upload 特有（upload-file / upload-image）

| 字段 | 类型 | 说明 |
|------|------|------|
| `action` | `string` | 上传地址 |
| `name` | `string` | 上传文件字段名 |
| `multiple` | `boolean` | 多文件上传 |
| `showFileList` | `boolean` | 显示文件列表 |
| `drag` | `boolean` | 拖拽上传 |
| `limit` | `number` | 上传数量限制 |

### Button 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'primary' \| 'success' \| ...` | 按钮类型 |
| `native-type` | `'button' \| 'submit' \| 'reset'` | 原生类型 |
| `color` | `string` | 自定义颜色 |
| `plain` | `boolean` | 朴素按钮 |
| `round` | `boolean` | 圆角按钮 |
| `circle` | `boolean` | 圆形按钮 |
| `text` | `boolean` | 文字按钮 |
| `loading` | `boolean` | 加载中 |

### Card 特有

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `shadow` | `'always' \| 'hover' \| 'never'` | — | 阴影时机 |
| `gridEnable` | `boolean` | `false` | 启用 CSS Grid 网格布局 |
| `gridCols` | `number` | `2` | 网格列数（2-4），`gridEnable` 时生效 |

### Row 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `align` | `'top' \| 'middle' \| 'bottom'` | 垂直对齐 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | 水平排列 |
| `gutter` | `number` | 栅格间距 |

### Tabs 特有

| 字段 | 类型 | 说明 |
|------|------|------|
| `tabPosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | 标签位置 |
| `type` | `'card' \| 'border-card'` | 样式类型 |

### 组件类型列表

| type | 说明 |
|------|------|
| `form` | 表单容器 |
| `input` | 文本输入 |
| `textarea` | 多行文本 |
| `input-number` | 数字输入 |
| `select` | 下拉选择 |
| `radio` | 单选 |
| `checkbox` | 多选 |
| `switch` | 开关 |
| `date-picker` | 日期选择 |
| `cascader` | 级联选择 |
| `slider` | 滑块 |
| `color-picker` | 颜色选择 |
| `upload-file` | 文件上传 |
| `upload-image` | 图片上传 |
| `button` | 按钮 |
| `row` | 栅格行 |
| `col` | 栅格列 |
| `card` | 卡片容器 |
| `tabs` | 标签页 |
| `tab-pane` | 标签面板 |
| `collapse` | 折叠面板 |
| `collapse-item` | 折叠项 |
| `modal` | 弹窗 |
| `form-item` | 表单项包装 |

## 事件绑定

```typescript
interface ActionsModel {
  type: 'component' | 'custom' | 'public'
  methodName: string
  componentId?: string
  args?: string
}

schema.on = {
  change: [
    { type: 'public', methodName: 'showNotification', args: '["success", "已保存"]' },
    { type: 'component', componentId: 'xxx', methodName: 'resetData' }
  ]
}
```

常见事件：

| 事件名 | 说明 |
|--------|------|
| `change` | 值变化 |
| `input` | 输入中 |
| `focus` | 获取焦点 |
| `blur` | 失去焦点 |
| `click` | 点击 |
| `clear` | 清空 |
| `epicReady` | 所有组件挂载完成 |
| `vnodeMounted` | 本组件挂载完成 |
| `vnodeUnmounted` | 本组件卸载 |

## 预制公共方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `showNotification` | `(type, message)` | 通知提示 |
| `openLink` | `(url, target?)` | 打开链接 |
| `callApi` | `(url, method?, data?)` | 调用 API |
| `showConfirm` | `(message, title?)` | 确认对话框 |
| `downloadFile` | `(url, filename?)` | 下载文件 |
| `copyToClipboard` | `(text)` | 复制到剪贴板 |
| `consoleLog` | `(...args)` | 控制台输出 |
| `setLocalStorage` | `(key, value)` | 设置本地存储 |
| `getLocalStorage` | `(key)` | 获取本地存储 |
