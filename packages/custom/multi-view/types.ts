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

/** 字段池上下文 */
import type { ComponentSchema } from '@ies/types'
import type { InjectionKey } from 'vue'

export interface FieldPoolData {
  /** 当前模式 */
  mode: 'model' | 'view'
  /** 数据模型字段快照（视图模式下使用，模型模式下使用 useDesignerContext 实时数据） */
  modelFields: ComponentSchema[]
  /** 当前视图中已有的字段 ID 列表（用于标记已添加的字段） */
  viewFieldIds: string[]
  /** 视图模式下点击字段，添加到画布 */
  addFieldToView: (fieldId: string) => void
}

export const FIELD_POOL_DATA_KEY: InjectionKey<FieldPoolData> = Symbol('fieldPoolData')