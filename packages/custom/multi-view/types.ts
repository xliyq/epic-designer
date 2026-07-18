/**
 * 视图类型配置（用户可增删）
 */
export interface ViewTypeConfig {
  /** 唯一标识 */
  id: string
  /** 显示名称，如"创建"、"审批" */
  name: string
}

/** 设计器模式 */
export type DesignerMode = 'model' | 'view'

/** 字段池上下文（provide/inject） */
import type { InjectionKey } from 'vue'

export interface FieldPoolContext {
  /** 当前视图中的字段 ID 列表（用于眼睛图标标注） */
  viewFieldIds: string[]
  /** 当前选中的字段 ID */
  selectedFieldId: string
  /** 点击字段行 */
  selectField: (id: string) => void
  /** 切换字段在当前视图中的显隐 */
  toggleField: (id: string) => void
}

export const FIELD_POOL_KEY: InjectionKey<FieldPoolContext> = Symbol('fieldPool')