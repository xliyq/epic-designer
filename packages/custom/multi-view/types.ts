import type { ActionsModel } from '@ies/manager';
import type { ComponentSchema, FormItemRule, PageSchema } from '@ies/types';

/**
 * 视图类型配置（用户可增删）
 */
export interface ViewTypeConfig {
  /** 唯一标识 */
  id: string;
  /** 显示名称，如"创建"、"审批"、"经理复核" */
  name: string;
  /** 可选图标标识 */
  icon?: string;
}

/**
 * 单个字段在某个视图下的覆盖属性
 * 只存储被覆盖的字段，未覆盖的属性运行时自动继承全局值
 */
export interface FieldOverride {
  // ── 顶层字段覆盖 ──
  /** 覆盖标签标题 */
  label?: string;
  /** 覆盖隐藏标签 */
  hideLabel?: boolean;
  /** 覆盖校验规则 */
  rules?: FormItemRule[];
  /** 覆盖事件绑定 */
  on?: { [eventName: string]: ActionsModel[] };
  /** 覆盖动态显隐 */
  show?: ((params: any) => boolean) | boolean;

  // ── 控件类型覆盖（特殊：覆盖 ComponentSchema.type）──
  /** 覆盖控件类型，如将 input 切换为 textarea */
  widgetType?: string;

  // ── props 覆盖（浅合并到全局 props 上）──
  /** 覆盖组件 props 中的特定字段，如 placeholder、disabled、readonly 等 */
  props?: Record<string, any>;
}

/**
 * 单个视图的配置
 */
export interface ViewConfig {
  /** 字段ID有序列表（决定展示哪些字段 + 排列顺序） */
  layout: string[];
  /** 字段覆盖属性，key = 字段ID */
  fieldOverrides?: Record<string, FieldOverride>;
}

/**
 * 扩展后的页面 Schema
 * 在 PageSchema 基础上新增 viewTypes 和 viewConfigs
 */
export interface MultiViewPageSchema extends PageSchema {
  /** 视图类型列表（可增删） */
  viewTypes?: ViewTypeConfig[];
  /** 视图配置，key = viewType.id */
  viewConfigs?: Record<string, ViewConfig>;
}

/**
 * 设计器模式
 */
export type DesignerMode = 'model' | 'view';

/**
 * 多视图设计器上下文
 * 注入给子组件使用
 */
export interface MultiViewContext {
  /** 当前模式：数据模型 / 视图设计 */
  mode: DesignerMode;
  /** 当前选中的视图类型ID */
  currentViewId: string | null;
  /** 视图类型列表 */
  viewTypes: ViewTypeConfig[];
  /** 视图配置映射 */
  viewConfigs: Record<string, ViewConfig>;
  /** 页面 Schema */
  pageSchema: MultiViewPageSchema;
  /** 当前选中的字段 */
  selectedField: ComponentSchema | null;

  /** 切换模式 */
  setMode: (mode: DesignerMode) => void;
  /** 切换当前视图 */
  switchView: (viewId: string) => void;
  /** 新增视图类型 */
  addViewType: (name: string) => void;
  /** 删除视图类型 */
  removeViewType: (id: string) => void;
  /** 重命名视图类型 */
  renameViewType: (id: string, name: string) => void;

  /** 字段加入/移出当前视图 */
  toggleFieldInLayout: (fieldId: string) => void;
  /** 调整字段在当前视图中的顺序 */
  moveField: (fieldId: string, direction: 'up' | 'down') => void;
  /** 选中字段 */
  setSelectedField: (field: ComponentSchema | null) => void;

  /** 获取字段在当前视图的覆盖配置 */
  getFieldOverride: (fieldId: string) => FieldOverride | undefined;
  /** 设置字段覆盖属性（写入 viewConfigs） */
  setFieldOverride: (fieldId: string, override: Partial<FieldOverride>) => void;
  /** 重置字段覆盖（删除某个属性路径的覆盖） */
  resetFieldOverride: (fieldId: string, fieldPath: string) => void;
  /** 重置字段的全部覆盖 */
  resetAllOverrides: (fieldId: string) => void;

  /** 检查字段是否在当前视图的 layout 中 */
  isFieldInLayout: (fieldId: string) => boolean;
  /** 获取当前视图的字段列表（按 layout 排序） */
  getCurrentViewFields: () => ComponentSchema[];

  /** 保存 */
  save: () => void;
  /** 预览 */
  preview: () => void;
}
