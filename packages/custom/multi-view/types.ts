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
import type { ComponentSchema } from '@ies/types'
import type { InjectionKey } from 'vue'

export interface FieldPoolContext {
  modelFields: ComponentSchema[]
  viewFields: ComponentSchema[]
  selectedFieldId: string
  selectField: (id: string) => void
  toggleField: (id: string) => void
}

export const FIELD_POOL_KEY: InjectionKey<FieldPoolContext> = Symbol('fieldPool')