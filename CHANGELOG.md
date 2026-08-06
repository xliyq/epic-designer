# Changelog

## 0.0.1 (2026-06-25)

### 新增

- **自定义扩展层** (`packages/custom/`)
  - 9 个预制公共方法：showNotification, openLink, callApi, showConfirm, downloadFile, copyToClipboard, consoleLog, setLocalStorage, getLocalStorage
  - 布局面板（GridPanel）：支持表单列数 + 字段占位列数配置
  - `setupExtensions()` 注册入口，自动在 EDesigner 初始化时加载
- **表单网格布局**
  - 表单新增 `formMode` 属性（普�?网格/行内�?  - 网格模式下支�?`gridCols`�?-4 列），字段级 `span` 占位列配�?  - 支持 Element Plus
- [Schema 参考文档](docs/guide/other/schema.md)

### 变更

- 更新 EDesigner 初始化流程，自动加载 custom 扩展
- 更新 README 指向自建仓库

### 技�?
- 基于 epic-designer v1.1.13 fork
- 移除上游 `.git` 关联
- pnpm workspace 新增 `@ies/custom` �