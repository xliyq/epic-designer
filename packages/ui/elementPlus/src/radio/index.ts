import type { ComponentConfigModel } from '@ies/designer';
import { createDefaultDataSource } from '@ies/utils';

export default {
  component: () => import('./radio'),
  config: {
    attribute: [
      {
        field: 'field',
        label: '数据字段',
        type: 'EpField',
      },
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
      {
        field: 'props.defaultValue',
        label: '默认值',
        type: 'radio',
      },
      {
        field: 'props.size',
        label: '尺寸',
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
        field: 'props.radioButton',
        label: '按钮模式',
        type: 'switch',
      },
      {
        description: '按钮模式下生效',
        field: 'props.textColor',
        label: '选项文本颜色',
        layout: 'horizontal',
        show: ({ values }) => {
          return values.props.radioButton;
        },
        type: 'color-picker',
      },
      {
        description: '按钮模式下生效',
        field: 'props.fill',
        label: '选项按钮颜色',
        layout: 'horizontal',
        show: ({ values }) => {
          return values.props.radioButton;
        },
        type: 'color-picker',
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
      {
        description: '配置数据来源：静态选项或远程 HTTP 请求',
        field: 'props.dataSource',
        layout: 'vertical',
        type: 'DataSourceEditor',
      },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        type: 'ERuleEditor',
      },
    ],
    event: [
      {
        description: '值变化时',
        type: 'change',
      },
    ],
  },
  defaultSchema: {
    field: 'radio',
    input: true,
    label: '单选框',
    props: {
      size: 'default',
      dataSource: createDefaultDataSource(),
    },
    type: 'radio',
  },
  groupName: '表单',
  icon: 'icon--epic--radio-button-checked-outline',
  sort: 850,
  attributeSync: {
    charValue: {
      write: (rawValue) => rawValue,
      read: (fieldValue) => fieldValue,
      source: '选中值 (code)',
    },
    charDisplay: {
      write: (rawValue, extra) => extra?.option?.label ?? null,
      source: '选中项中文名 (label)',
    },
  },
} as ComponentConfigModel;
