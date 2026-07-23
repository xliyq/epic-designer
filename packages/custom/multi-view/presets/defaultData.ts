import type { PageSchema } from '@ies/types'
import type { ViewTypeConfig } from '../types'

/**
 * 演示数据模型（标准 PageSchema）
 */
export function createDemoDataModel(): PageSchema {
  return {
    schemas: [
      {
        id: 'root',
        label: '表单',
        type: 'form',
        props: {
          colon: true,
          labelAlign: 'right',
          labelCol: { span: 5 },
          labelLayout: 'fixed',
          labelPlacement: 'left',
          labelWidth: 100,
          layout: 'horizontal',
          name: 'default',
          wrapperCol: { span: 19 },
        },
        children: [],
      },
    ],
    script: '',
  }
}

/**
 * 演示视图类型列表
 */
export function createDemoViewTypes(): ViewTypeConfig[] {
  return [
    { id: 'create', name: '创建' },
    { id: 'approve', name: '审批' },
    { id: 'view', name: '查看' },
  ]
}