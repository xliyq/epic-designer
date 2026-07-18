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

/** 字段池数据注入 key */
import type { ComponentSchema } from '@ies/types'
import type { InjectionKey, Ref } from 'vue'

export const FIELD_POOL_DATA_KEY: InjectionKey<Ref<ComponentSchema[]>> = Symbol('fieldPoolData')