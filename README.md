<h3 align="center">EpicDesigner</h3>

<h4 align="center">一个开箱即用的拖拽式的可视化低代码表单设计�?/h4>

<p align="center">
  <a href="https://github.com/vuejs/core">
    <img src="https://img.shields.io/badge/vue-3.3.4-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/microsoft/TypeScript">
    <img src="https://img.shields.io/badge/typescript-5.1.6-blue" alt="typescript">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>

📦 GitHub 仓库：[https://github.com/xliyq/epic-designer](https://github.com/xliyq/epic-designer)

---

## 简�?
基于 [epic-designer](https://github.com/Kchengz/epic-designer) v1.1.13 fork 二次开发，增强低代码拖拽表单设计器能力�?
核心定位：输�?JSON Schema 落库，支持多视图、多 UI 库渲染�?
## 新增特�?
- **预制公共方法** �?9 个开箱即用的动作（提示消息、打开链接、调�?API、确认对话框、下载文件、复制剪贴板、控制台输出、本地存储读写）
- **表单网格布局** �?支持多列栅格布局（columns 1-6 列），字段级 span 跨列
- **布局面板** �?右侧栏新增「布局」面板，配置表单列数和字段占�?- **Schema 参�?* �?完整的数据结构文�?
## 安装

```bash
npm i epic-designer
```

### 选择 Element Plus

```bash
npm i element-plus @ies/element-plus
```

```typescript
import 'epic-designer/dist/style.css'
import 'element-plus/dist/index.css'
import { setupElementPlus } from '@ies/element-plus'
setupElementPlus()
```

### 选择 Ant Design Vue

```bash
npm i ant-design-vue @ies/antd
```

```typescript
import 'epic-designer/dist/style.css'
import 'ant-design-vue/dist/reset.css'
import { setupAntd } from '@ies/antd'
setupAntd()
```

### 选择 Naive UI

```bash
npm i -D naive-ui @ies/naive-ui
```

```typescript
import 'epic-designer/dist/style.css'
import { setupNaiveUi } from '@ies/naive-ui'
setupNaiveUi()
```

## 快速上�?
### EDesigner（设计器�?
```vue
<template>
  <div class="h-full">
    <EDesigner />
  </div>
</template>
<script setup lang="ts">
import { EDesigner } from 'epic-designer'
</script>
<style>
.h-full { height: 100vh; }
</style>
```

### EBuilder（渲染器�?
```vue
<template>
  <div>
    <EBuilder :pageSchema="pageSchema" />
  </div>
</template>
<script setup>
import { EBuilder } from 'epic-designer'

const pageSchema = {
  schemas: [{
    type: 'form',
    id: 'root',
    props: { columns: 2 },
    children: [
      { label: '输入�?, type: 'input', field: 'input', input: true, props: { placeholder: '请输�? }, id: '1' },
    ],
  }],
}
</script>
```

## 扩展开�?
自定义扩展位�?`packages/custom/`�?
```
packages/custom/
├── actions/presets.ts       �?预制公共方法
├── panels/GridPanel.vue     �?布局面板
└── extensions/index.ts      �?注册入口
```

## 文档

- [Schema 参考](./docs/guide/other/schema.md)
- [CHANGELOG](./CHANGELOG.md)
