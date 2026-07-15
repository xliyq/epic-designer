# 数据源扩展

:::tip 数据源
数据源（DataSource）是设计器中为选择类组件（选择框、多选框、单选框、级联选择）提供选项数据的机制。通过注册不同的数据源提供者（Provider），可以让组件从静态数据、HTTP 接口、字典服务等任意来源加载选项。
:::

## 核心概念

数据源系统由以下几个核心概念组成：

| 概念 | 说明 |
| --- | --- |
| **DataSourceOption** | 选项数据项，结构为 `{ label, value, children? }` |
| **DataSourceProvider** | 数据源提供者，定义加载逻辑和编辑器 |
| **DataSourceSchema** | 存储在组件 schema 中的数据源配置，结构为 `{ type, config }` |
| **DataSourceManager** | 数据源管理器，负责注册/获取/删除提供者 |
| **useDataSource** | 运行时 composable，组件通过它加载选项数据 |

### 数据流

```
用户在设计器属性面板选择数据源类型
      │
      ▼
DataSourceEditor 组件
  - 从 pluginManager.dataSource.getAll() 获取所有已注册 provider
  - 下拉选择数据源类型（静态 / 远程 / 自定义...）
  - 动态渲染 provider.editor 指定的编辑器组件
      │
      ▼
保存到 schema.props.dataSource
  { type: 'static', config: { options: [...] } }
  { type: 'http',   config: { url, method, ... } }
      │
      ▼
运行时组件（select / checkbox / radio / cascader）
  - 读取 props.dataSource
  - 调用 useDataSource(dataSource, formData)
  - 查找 provider → provider.loader(config, context)
  - 返回 DataSourceOption[] → 渲染为选项
```

## 内置数据源

设计器默认注册了两个内置数据源提供者：

### 静态数据（static）

直接在属性面板中配置选项列表（label/value），适合选项固定且数量较少的场景。

- **编辑器**：`EOptionsEditor`（可视化拖拽编辑 label/value 列表）
- **默认配置**：`{ options: [] }`
- **加载方式**：同步返回 `config.options`

### 远程数据（http）

通过 HTTP 请求从后端接口加载选项数据，支持 GET/POST 请求、参数模板、数据路径映射、字段映射、联动字段和缓存。

- **编辑器**：`ERemoteConfigEditor`
- **默认配置**：

```ts
{
  url: '',           // 请求地址
  method: 'GET',     // 请求方法 GET | POST
  params: {},         // 请求参数，支持 ${formData.field} 模板
  headers: {},        // 请求头
  dataPath: 'data',   // 响应数据路径，如 data.list
  labelKey: 'label',  // 选项 label 对应的字段名
  valueKey: 'value',  // 选项 value 对应的字段名
  childrenKey: 'children', // 子选项字段名（级联用）
  cache: true,        // 是否缓存结果
  autoLoad: true,     // 是否自动加载
}
```

#### 参数模板

远程数据源支持在请求参数中使用 `${formData.field}` 模板引用当前表单值。例如：

```json
{
  "provinceId": "${formData.province}",
  "type": "city"
}
```

当 `formData.province` 变化时，如果 `provinceId` 被配置为联动字段，会自动重新发起请求。

#### 联动字段

通过配置联动字段（`watchFields`），当指定的表单字段值发生变化时，会自动重新加载数据。例如配置 `provinceId, parentId`，当这些字段的值变化时自动刷新选项。

:::warning 联动字段为空时不加载
当配置了联动字段且所有联动字段的值都为空时，数据源不会发起请求，选项为空数组。这避免了无效的 API 调用。
:::

#### HTTP 实例注入

远程数据源优先使用通过 `context.global.$http` 注入的 HTTP 实例（需提供 `get` 和 `post` 方法）。如果未注入，则降级使用原生 `fetch`。

```ts
// 注入 HTTP 实例（如 axios 封装）
pluginManager.global.$http = {
  get: (url, config) => axios.get(url, config),
  post: (url, data) => axios.post(url, data),
};
```

## 扩展自定义数据源

通过 `pluginManager.dataSource.register()` 方法可以注册自定义数据源提供者。注册后，该数据源会自动出现在属性面板的数据源类型下拉列表中。

### DataSourceProvider 接口

```ts
interface DataSourceProvider {
  /** 唯一标识 */
  id: string;
  /** 显示名称 */
  label: string;
  /** 图标（可选） */
  icon?: string;
  /**
   * 属性面板编辑器组件类型名
   * 需提前通过 pluginManager.component.add() 注册对应组件
   */
  editor: string;
  /**
   * 数据加载函数
   * @param config 该 provider 的配置数据（来自 schema props.dataSource.config）
   * @param context 数据源上下文（含 formData、field 等）
   * @returns 选项数组
   */
  loader: (
    config: Record<string, any>,
    context: DataSourceContext,
  ) => Promise<DataSourceOption[]>;
  /** 该 provider 的默认配置 */
  defaultConfig: Record<string, any>;
  /**
   * 联动字段配置（可选）
   * 返回需要监听的表单字段名列表
   * 当这些字段值变化时自动重新加载
   */
  watchFields?: (config: Record<string, any>) => string[];
}
```

### DataSourceContext 上下文

```ts
interface DataSourceContext {
  /** 当前表单数据 */
  formData: Record<string, any>;
  /** 组件 schema 中的 field */
  field?: string;
  /** 获取已注册的全局上下文 */
  global?: any;
}
```

### 注册步骤

注册一个自定义数据源需要两步：

1. **注册编辑器组件**：实现一个 Vue 组件作为属性面板中的配置编辑器，通过 `pluginManager.component.add()` 注册
2. **注册数据源提供者**：实现 `DataSourceProvider` 接口，通过 `pluginManager.dataSource.register()` 注册

### 完整示例：字典数据源

以下示例注册一个"字典数据源"，通过字典编码从后端字典服务加载选项。

#### 1. 新建编辑器组件

在 `src/designer-extensions/DictEditor/index.vue`：

```vue
<template>
  <div class="dict-editor">
    <div class="dict-editor__row">
      <label>字典编码</label>
      <input
        type="text"
        placeholder="如：sys_user_sex"
        :value="config.dictCode"
        @input="updateField('dictCode', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: Record<string, any>;
}>();

const emit = defineEmits(['update:modelValue']);

const config = computed(() => props.modelValue ?? {});

function updateField(key: string, value: any) {
  emit('update:modelValue', { ...config.value, [key]: value });
}
</script>
```

:::tip 编辑器组件约定
编辑器组件使用 `v-model` 接收和更新配置对象：
- **静态数据源**编辑器：`modelValue` 为 `DataSourceOption[]` 数组
- **自定义数据源**编辑器：`modelValue` 为 `Record<string, any>` 配置对象
:::

#### 2. 注册数据源提供者

在初始化代码中（如 `src/designer-extensions/index.ts`）：

```ts
import { pluginManager } from '@ies/designer';

// 第一步：注册编辑器组件
pluginManager.component.add('DictEditor', async () => {
  return await import('./DictEditor/index.vue');
});

// 第二步：注册数据源提供者
pluginManager.dataSource.register({
  id: 'dict',
  label: '字典数据',
  icon: 'icon--epic--list',
  editor: 'DictEditor',
  defaultConfig: {
    dictCode: '',
  },
  watchFields: () => [],

  loader: async (config, context) => {
    const { dictCode } = config;
    if (!dictCode) return [];

    // 优先使用注入的 HTTP 实例
    const http = context.global?.$http;
    let response: any;

    if (http?.get) {
      response = await http.get(`/api/dict/${dictCode}`);
    } else {
      const res = await fetch(`/api/dict/${dictCode}`);
      response = await res.json();
    }

    // 假设后端返回 { data: [{ label, value }] }
    const list = response.data ?? [];
    return list.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
  },
});
```

### 完整示例：联动级联数据源

以下示例注册一个"省市区级联数据源"，根据上级区域 ID 动态加载下级选项：

```ts
pluginManager.component.add('RegionEditor', async () => {
  return await import('./RegionEditor/index.vue');
});

pluginManager.dataSource.register({
  id: 'region',
  label: '省市区数据',
  editor: 'RegionEditor',
  defaultConfig: {
    level: 'city',       // province | city | district
    parentIdField: '',   // 监听的上级字段名
  },

  // 声明联动字段：当 parentIdField 指向的表单字段变化时自动重新加载
  watchFields: (config) => {
    return config.parentIdField ? [config.parentIdField] : [];
  },

  loader: async (config, context) => {
    const { level, parentIdField } = config;
    const parentId = parentIdField ? context.formData[parentIdField] : null;

    // 联动字段为空时不加载
    if (parentIdField && !parentId) return [];

    const http = context.global?.$http;
    const params = { level, parentId };
    let response: any;

    if (http?.get) {
      response = await http.get('/api/region/list', { params });
    } else {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/region/list?${query}`);
      response = await res.json();
    }

    return (response.data ?? []).map((item: any) => ({
      label: item.name,
      value: item.code,
    }));
  },
});
```

## DataSourceManager API

数据源管理器提供以下方法：

### register

注册数据源提供者。

```ts
pluginManager.dataSource.register(provider: DataSourceProvider): void
```

如果 `provider.id` 已存在，将覆盖原有提供者并输出警告。

### get

获取指定数据源提供者。

```ts
pluginManager.dataSource.get(id: string): DataSourceProvider | undefined
```

### getAll

获取所有已注册的数据源提供者。

```ts
pluginManager.dataSource.getAll(): DataSourceProvider[]
```

### remove

移除数据源提供者。

```ts
pluginManager.dataSource.remove(id: string): void
```

### providers

所有已注册的数据源提供者（响应式引用）。

```ts
pluginManager.dataSource.providers: Ref<DataSourceProvider[]>
```

## 在组件中使用数据源

### 设计时：属性面板配置

在组件的属性面板定义中，添加 `DataSourceEditor` 类型的属性项：

```ts
export default {
  // ...组件配置
  attribute: [
    // ...其他属性
    {
      description: '配置数据来源：静态选项或远程 HTTP 请求',
      field: 'props.dataSource',
      layout: 'vertical',
      type: 'DataSourceEditor',
    },
  ],
  defaultSchema: {
    type: 'select',
    label: '选择框',
    props: {
      dataSource: createDefaultDataSource(), // 默认静态数据源
    },
  },
};
```

### 运行时：组件消费数据源

在运行时组件中，使用 `useDataSource` composable 加载选项：

```ts
import { useDataSource, useFormData } from '@ies/hooks';
import { computed } from 'vue';

export default defineComponent({
  props: {
    dataSource: { type: Object, default: null },
    options: { type: Array, default: null },
  },
  setup(props) {
    const formData = useFormData();

    // 兼容旧的 options prop
    const dataSource = computed(() => {
      if (props.dataSource) return props.dataSource;
      return { type: 'static', config: { options: props.options ?? [] } };
    });

    const { options, loading, reload } = useDataSource(dataSource, formData);

    return { options, loading, reload };
  },
});
```

`useDataSource` 返回值：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `Ref<DataSourceOption[]>` | 加载到的选项列表 |
| `loading` | `Ref<boolean>` | 是否正在加载 |
| `reload` | `() => Promise<void>` | 手动重新加载 |

### DataSourceOption 结构

```ts
interface DataSourceOption {
  /** 显示文本 */
  label: string;
  /** 选项值 */
  value: any;
  /** 子选项（级联数据用，可选） */
  children?: DataSourceOption[];
  /** 其他自定义字段 */
  [key: string]: any;
}
```

## DataSourceSchema 结构

存储在组件 schema 的 `props.dataSource` 中：

```ts
interface DataSourceSchema {
  /** 数据源类型，对应 provider.id */
  type: string;
  /** 该数据源的配置数据 */
  config: Record<string, any>;
}
```

示例：

```json
{
  "type": "static",
  "config": {
    "options": [
      { "label": "男", "value": "1" },
      { "label": "女", "value": "2" }
    ]
  }
}
```

```json
{
  "type": "http",
  "config": {
    "url": "/api/user/list",
    "method": "GET",
    "params": { "type": "${formData.userType}" },
    "dataPath": "data.list",
    "labelKey": "name",
    "valueKey": "id",
    "watchFields": ["userType"],
    "cache": true,
    "autoLoad": true
  }
}
```

## 使用数据源的内置组件

以下内置组件已集成数据源机制：

| 组件 | 说明 |
| --- | --- |
| **Select** 选择框 | 支持静态/远程数据源，远程时显示 loading |
| **Checkbox** 多选框 | 支持静态/远程数据源 |
| **Radio** 单选框 | 支持静态/远程数据源 |
| **Cascader** 级联选择 | 支持静态/远程数据源，支持树形选项 |

这些组件都通过相同的模式消费数据源：

1. 读取 `props.dataSource`，如果没有则回退为 `{ type: 'static', config: { options: props.options ?? [] } }`
2. 调用 `useDataSource(dataSource, formData)` 加载选项
3. 渲染选项列表

:::tip 兼容旧版 options
以上组件同时兼容旧的 `options` prop。如果未配置 `dataSource`，会自动将 `options` 包装为静态数据源。推荐使用 `dataSource` 以获得更完整的功能。
:::

## 常见问题

### 如何注入 HTTP 实例？

通过 `pluginManager.global.$http` 注入，需提供 `get` 和 `post` 方法：

```ts
import axios from 'axios';

pluginManager.global.$http = {
  get: (url, config) => axios.get(url, config),
  post: (url, data) => axios.post(url, data),
};
```

如果未注入，远程数据源会降级使用原生 `fetch`。

### 如何实现表单联动？

两种方式：

1. **使用远程数据源的联动字段**：在 `ERemoteConfigEditor` 中配置联动字段，或自定义 provider 的 `watchFields`
2. **自定义 provider 的 watchFields**：返回需要监听的表单字段名数组，当这些字段值变化时自动重新加载

### 如何禁用缓存？

远程数据源的 `config.cache` 设为 `false` 即可。静态数据源不涉及缓存。

### 如何手动重新加载？

在运行时组件中，调用 `useDataSource` 返回的 `reload` 方法：

```ts
const { reload } = useDataSource(dataSource, formData);

// 手动刷新
reload();
```

## 相关文件

| 文件 | 说明 |
| --- | --- |
| `packages/types/src/dataSource.ts` | 类型定义 |
| `packages/hooks/src/plugin/useDataSourceManager.ts` | 数据源管理器实现 + 内置 provider |
| `packages/hooks/src/plugin/useDataSource.ts` | 运行时加载 composable |
| `packages/utils/src/common/dataSource.ts` | `createDefaultDataSource()` 工具函数 |
| `packages/ui-kit/panel-ui/src/components/DataSourceEditor/index.vue` | 数据源选择器面板组件 |
| `packages/ui-kit/panel-ui/src/components/ERemoteConfigEditor/index.vue` | 远程 HTTP 配置编辑器 |
| `packages/ui-kit/panel-ui/src/components/EOptionsEditor/index.vue` | 静态选项编辑器 |
| `packages/ui-kit/panel-ui/src/components/index.ts` | 内置 provider 和编辑器注册入口 |
