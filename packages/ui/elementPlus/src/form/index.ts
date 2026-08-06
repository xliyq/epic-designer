import type { ComponentConfigModel } from '@ies/designer';

export default {
  component: () => import('./form.vue'),
  config: {
    action: [
      {
        description: '获取表单数据',
        type: 'getData',
      },
      {
        description: '设置表单数据',
        type: 'setData',
      },
      {
        description: '校验表单',
        type: 'validate',
      },
    ],
    attribute: [
      {
        field: 'props.name',
        label: 'Name',
        type: 'input',
      },
      {
        field: 'props.label-position',
        label: '标签位置',
        props: {
          clearable: true,
          options: [
            {
              label: '左边',
              value: 'left',
            },
            {
              label: '右边',
              value: 'right',
            },
            {
              label: '顶部',
              value: 'top',
            },
          ],
          radioButton: true,
        },
        type: 'radio',
      },
      {
        field: 'props.labelWidth',
        label: '标签宽度',
        type: 'EInputSize',
      },
      {
        field: 'props.labelSuffix',
        label: '标签后缀',
        type: 'input',
      },

      {
        field: 'props.size',
        label: '表单尺寸',
        props: {
          clearable: true,
          options: [
            {
              label: '大号',
              value: 'large',
            },
            {
              label: '中等',
              value: 'default',
            },
            {
              label: '小型',
              value: 'small',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.require-asterisk-position',
        label: '星号位置',
        props: {
          clearable: true,
          options: [
            {
              label: '左边',
              value: 'left',
            },
            {
              label: '右边',
              value: 'right',
            },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.inline-message',
        label: '行内展示校验信息',
        type: 'switch',
      },
      {
        field: 'props.status-icon',
        label: '校验反馈图标',
        type: 'switch',
      },
      {
        field: 'props.scroll-to-error',
        label: '滚动校验错误处',
        type: 'switch',
      },
      {
        field: 'props.formMode',
        label: '表单模式',
        onChange: ({ value, values }) => {
          const props = values.props ?? {}
          switch(value){
            case 'grid':
              props.gridCols = 2;
              props.gridEnable = true;
              delete props.inline
              break;
            case 'inline':
              props.inline = true
              delete props.gridEnable
              delete props.gridCols
              break;  
            case 'normal':
              delete props.gridEnable
              delete props.gridCols
              delete props.inline
              break;
          }
        },
        props: {
          options: [
            { label: '普通', value: 'normal' },
            { label: '网格', value: 'grid' },
            { label: '行内', value: 'inline' },
          ],
          radioButton: true,
        },
        type: 'radio',
      },
      {
        field: 'props.gridCols',
        label: '栅格列数',
        props: {
          min: 2,
          max: 4,
        },
        show: ({ values }) => values.props?.formMode === 'grid',
        type: 'number',
      },
      {
        field: 'props.disabled',
        label: '禁用',
        type: 'switch',
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
    ],
  },
  defaultSchema: {
    label: '表单',
    props: {
      'label-position': 'left',
      labelWidth: '100px',
      name: 'default',
      formMode: 'normal',
    },
    type: 'form',
    children: [],
  },
  groupName: '表单',
  icon: 'icon--epic--list-alt-outline-rounded',
  sort: 600,
} as ComponentConfigModel;
