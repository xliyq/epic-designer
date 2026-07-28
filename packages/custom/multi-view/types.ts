import type { PageSchema } from '@ies/types'

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

/**
 * 删除视图时传给 beforeRemoveView 的上下文
 */
export interface RemoveViewContext {
  /** 视图 ID */
  id: string
  /** 视图名称 */
  name: string
  /** 视图完整 schema（含 children，可检查字段数量等） */
  view: PageSchema
  /** 在 viewTypes 中的位置 */
  viewIndex: number
  /** 视图总数 */
  totalViews: number
}

/**
 * beforeRemoveView 返回类型
 * - true：允许删除
 * - false：禁止删除（使用默认提示）
 * - { canDelete: false, message }：禁止删除并显示自定义提示
 */
export type RemoveViewResult = boolean | { canDelete: boolean; message?: string }

/**
 * 多视图设计器文案配置
 */
export interface MultiViewLabels {
  /** 数据模型模式标签（同时用于模式切换按钮和预览标题） */
  model: string
  /** 视图设计模式标签（同时用于模式切换按钮和预览标题前缀） */
  view: string
  /** 字段池标题 */
  fieldPool: string
}

