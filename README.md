<h3 align="center">EpicDesigner</h3>

<h4 align="center">一个开箱即用的拖拽式的可视化低代码表单设计器</h4>

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

## 简介
基于 [epic-designer](https://github.com/Kchengz/epic-designer) v1.1.13 fork 二次开发，增强低代码拖拽表单设计器能力。
核心定位：输出 JSON Schema 落库，支持多视图、多 UI 库渲染。

## 新增特性
- **预制公共方法** — 9 个开箱即用的动作（提示消息、打开链接、调用 API、确认对话框、下载文件、复制剪贴板、控制台输出、本地存储读写）
- **表单网格布局** — 支持多列栅格布局（columns 1-6 列），字段级 span 跨列
- **布局面板** — 右侧栏新增「布局」面板，配置表单列数和字段占列
- **Schema 参考** — 完整的数据结构文档

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

## 快速上手
### EDesigner（设计器）
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

### EBuilder（渲染器）
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
      { label: '输入框', type: 'input', field: 'input', input: true, props: { placeholder: '请输入' }, id: '1' },
    ],
  }],
}
</script>
```

## 扩展开发
自定义扩展位于 `packages/custom/`：
```
packages/custom/
├── actions/presets.ts       — 预制公共方法
├── panels/GridPanel.vue     — 布局面板
└── extensions/index.ts      — 注册入口
```

## 版本管理

项目通过根 `package.json` 的版本号统一管理所有子包版本，只需修改一处即可全量同步。

### 命令说明

| 命令 | 说明 |
|---|---|
| `pnpm version:set <版本号>` | 设置新版本号，自动同步到所有子包及内部依赖引用 |
| `pnpm version:sync` | 以根版本号为基准，同步所有子包（不修改根版本号） |
| `pnpm version:check` | 检查版本号是否已更新（`pnpm pack` 前自动调用） |

### 使用流程

```bash
# 1. 设置新版本号（改一处，全同步）
pnpm version:set 0.0.2

# 2. 打包（版本检查通过后才会继续）
pnpm pack
```

如果版本号仍为初始版本 `0.0.1`，`pnpm pack` 会被拦截并提示更新版本号：

```
⚠️  当前版本号为 0.0.1，这是初始版本号。

   打包前请先更新版本号，例如:
     pnpm version:set 0.0.2
     pnpm version:set 0.1.0
     pnpm version:set 1.0.0
```

如需在初始版本下强制打包，可使用 `--force` 跳过检查：

```bash
npx epic version:check --force
```

## 文档

- [Schema 参考](./docs/guide/other/schema.md)
- [CHANGELOG](./CHANGELOG.md)
