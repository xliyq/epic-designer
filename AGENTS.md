# epic-designer — 低代码拖拽表单设计器

基于 Vue 3 + TypeScript，输出 JSON Schema 落库，支持多 UI 库渲染。
GitHub: https://github.com/Kchengz/epic-designer (v1.1.13 fork)

## 架构概览

```
packages/
├── core/          # 核心引擎（拖拽、渲染、设计器组件）
├── designer/      # 打包入口，发布 npm
├── types/         # 公共 TS 类型
├── utils/ hooks/ manager/ custom/  # 工具、组合式API、管理器、扩展
├── ui-kit/        # base-ui + panel-ui 基础组件
└── ui/            # antd / element-plus / naive-ui 适配
internal/ examples/ docs/ scripts/
```

依赖方向：`custom → manager → hooks → core → types/utils`，`ui/* → core + ui-kit/* + types/utils`

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` / `build` | 启动开发 / 构建 |
| `pnpm test` | 测试（`-- --run 包名` 指定包） |
| `pnpm lint` / `format` | ESLint / Prettier |
| `pnpm docs:dev` | 文档站 |

## 编码约定

- **语言**：TypeScript 优先，Vue 3 `<script setup>` + Composition API，UnoCSS + Less
- **命名**：组件 PascalCase，文件 kebab-case，接口 `I` 前缀，枚举 `E` 前缀，组合式 `use` 前缀
- **包管理**：pnpm workspace，catalog 统一版本，`workspace:*` 引用本地包

## 核心概念

- **`PageSchema`** — 页面级 Schema（组件树 + 画布 + 脚本）
- **`ComponentSchema`** — 组件节点（type / field / label / props / rules / children / on / slots）
- **`FormConfig`** — 表单配置（布局、列数等）
- **设计器组件** — 插件注册，UI 适配层映射到具体库
- **动作系统** — 事件绑定（`on` 属性），定义在 `@ies/custom/actions`

## 分支策略

- **主分支**：`develop`，功能分支：`feature/*`
- **上游跟踪**：`upstream/develop`

## 工作流规则

### 修改代码前
1. **排查优先用 GitNexus**（`query`/`context`/`impact`），而非手动 grep
2. 明确影响范围（参考依赖方向），跨包改注意接口兼容
3. 核心引擎变更需同步更新三套 UI 适配
4. 修改 API 或行为后同步更新 `docs/`

### 提交
- Conventional Commits（`feat:` / `fix:` / `chore:`）
- 改类型包同步更新使用者，改 UI 适配验证 `examples`
- 新增功能或修复建议补充测试用例

### 发布
- `pnpm version:sync` → `pnpm build` → `pnpm pack` → 发布内部 npm

