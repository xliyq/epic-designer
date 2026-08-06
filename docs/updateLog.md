# 更新日志

## 0.0.4 (2026-08-06)

### 新增

- **多视图设计器** (`EMultiViewDesigner`)
  - 支持一套数据模型对应多套视图呈现方案
  - 字段池面板，视图模式下从数据模型选取字段
  - 全局/当前视图编辑模式切换
  - 视图类型自由增删（默认创建/查看/审批）
- **submitData 属性** — 字段隐藏时可选择是否保留表单数据
  - `hidden=true, submitData=true`（默认）→ 隐藏但保留数据
  - `hidden=true, submitData=false` → 隐藏且清除数据
  - 父容器 `submitData=false` 时子组件继承
- **多视图设计器** (`EMultiViewDesigner`)
  - 支持一套数据模型对应多套视图呈现方案
  - 字段池面板，视图模式下从数据模型选取字段
  - 全局/当前视图编辑模式切换
  - 视图类型由业务方通过 `viewTypes` prop 传入，不预设默认值
- **文档更新** — 新增布局指南、预制动作文档、多视图设计器使用指南

### 优化

- 导出 `setupComponent` 并添加幂等保护
- 多视图 script 随视图/模型切换与保存同步

## 0.0.3 (2026-07-15)

### 新增

- **预制动作** — 9 个开箱即用的动作方法
  - `showNotification`, `openLink`, `callApi`, `showConfirm`, `downloadFile`
  - `copyToClipboard`, `consoleLog`, `setLocalStorage`, `getLocalStorage`
- **表单网格布局**
  - 表单新增 `formMode` 属性（普通/网格/行内）
  - 网格模式下支持 `gridCols` 2-4 列，字段级 `span` 占列配置
  - 支持 Element Plus
- **Schema 参考文档** — 完整的数据结构文档

### 变更

- 更新 EDesigner 初始化流程，自动加载 custom 扩展
- 更新 README 指向自建仓库
- 清理文档中原作者的外部引用

### 技术

- 基于 epic-designer v1.1.13 fork
- 移除上游 `.git` 关联
- pnpm workspace 新增 `@ies/custom` 包