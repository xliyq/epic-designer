import type { MultiViewPageSchema, ViewTypeConfig } from '../types';

/**
 * 默认视图类型预设
 */
export const defaultViewTypes: ViewTypeConfig[] = [
  { id: 'create', name: '创建' },
  { id: 'detail', name: '查看' },
  { id: 'approve', name: '审批' },
];

/**
 * 创建演示数据（请假申请）
 * 预置 4 个字段，3 个视图，展示多视图覆盖的不同效果
 */
export function createDemoSchema(): MultiViewPageSchema {
  return {
    canvas: { mode: 'desktop' },
    schemas: [
      {
        id: 'root',
        label: '请假申请',
        type: 'form',
        props: {
          name: 'default',
          labelWidth: 100,
          labelLayout: 'fixed',
          labelAlign: 'right',
          layout: 'horizontal',
          colon: true,
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
        },
        children: [
          {
            id: 'field_applicant',
            label: '申请人',
            type: 'input',
            field: 'applicant',
            input: true,
            props: {
              placeholder: '请输入姓名',
              defaultValue: '',
            },
            rules: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
          },
          {
            id: 'field_leave_type',
            label: '请假类型',
            type: 'select',
            field: 'leaveType',
            input: true,
            props: {
              placeholder: '请选择请假类型',
              size: 'default',
              effect: 'light',
              dataSource: {
                type: 'static',
                config: {
                  options: [
                    { label: '事假', value: 'personal' },
                    { label: '病假', value: 'sick' },
                    { label: '年假', value: 'annual' },
                    { label: '婚假', value: 'marriage' },
                  ],
                },
              },
            },
            rules: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
          },
          {
            id: 'field_reason',
            label: '请假事由',
            type: 'textarea',
            field: 'reason',
            input: true,
            props: {
              placeholder: '请输入请假事由',
              autosize: { minRows: 3, maxRows: 6 },
            },
            rules: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
          },
          {
            id: 'field_days',
            label: '请假天数',
            type: 'number',
            field: 'days',
            input: true,
            props: {
              placeholder: '请输入天数',
              min: 0.5,
              step: 0.5,
              precision: 1,
            },
            rules: [{ required: true, message: '请输入请假天数', trigger: 'blur' }],
          },
          {
            id: 'field_date_range',
            label: '请假日期',
            type: 'date',
            field: 'dateRange',
            input: true,
            props: {
              type: 'daterange',
              placeholder: '请选择日期',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
          },
          {
            id: 'field_attachment',
            label: '附件',
            type: 'upload-file',
            field: 'attachment',
            input: true,
            props: {
              action: '/api/upload',
              name: 'file',
              showFileList: true,
            },
          },
        ],
      },
    ],
    viewTypes: [...defaultViewTypes],
    viewConfigs: {
      create: {
        layout: [
          'field_applicant',
          'field_leave_type',
          'field_reason',
          'field_days',
          'field_date_range',
          'field_attachment',
        ],
        fieldOverrides: {},
      },
      detail: {
        layout: [
          'field_applicant',
          'field_leave_type',
          'field_reason',
          'field_days',
          'field_date_range',
        ],
        fieldOverrides: {
          field_applicant: {
            props: { readonly: true },
          },
          field_leave_type: {
            props: { disabled: true },
          },
          field_reason: {
            props: { readonly: true },
          },
          field_days: {
            props: { disabled: true },
          },
          field_date_range: {
            props: { readonly: true },
          },
        },
      },
      approve: {
        layout: [
          'field_applicant',
          'field_leave_type',
          'field_reason',
          'field_days',
        ],
        fieldOverrides: {
          field_reason: {
            label: '审批摘要',
            props: { readonly: true },
          },
          field_applicant: {
            props: { readonly: true },
          },
          field_leave_type: {
            props: { disabled: true },
          },
          field_days: {
            props: { disabled: true },
          },
        },
      },
    },
  };
}
