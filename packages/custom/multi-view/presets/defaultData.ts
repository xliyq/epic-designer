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
        children: [
          { id: 'f1', label: '申请人', type: 'input', field: 'applicant', input: true, props: { placeholder: '请输入姓名' } },
          { id: 'f2', label: '请假事由', type: 'textarea', field: 'reason', input: true, props: { placeholder: '请输入事由' } },
          { id: 'f3', label: '请假天数', type: 'number', field: 'days', input: true, props: {} },
          { id: 'f4', label: '请假类型', type: 'select', field: 'type', input: true, props: { options: [{ label: '年假', value: 'annual' }, { label: '事假', value: 'personal' }, { label: '病假', value: 'sick' }] } },
        ],
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