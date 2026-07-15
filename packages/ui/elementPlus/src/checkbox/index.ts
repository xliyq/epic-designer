import type { ComponentConfigModel, RemoteConfig } from '@ies/designer';
import { createDefaultRemoteConfig } from '@ies/utils';

export default {
  component: () => import('./checkbox'),
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
        type: 'checkbox',
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
        field: 'props.max',
        label: '最大选中数',
        type: 'number',
      },
      {
        field: 'props.min',
        label: '最小选中数',
        type: 'number',
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
        field: 'props.options',
        label: '选项管理',
        layout: 'vertical',
        type: 'EOptionsEditor',
      },
      {
        description: '配置远程数据源，通过 HTTP 请求动态加载选项',
        field: 'props.remoteConfig',
        label: '远程数据',
        layout: 'vertical',
        type: 'ERemoteConfigEditor',
      },
      {
        description: '校验规则需要配合表单使用',
        field: 'rules',
        label: '表单校验',
        layout: 'vertical',
        props: {
          ruleType: 'array',
        },
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
    field: 'checkbox',
    input: true,
    label: '复选框',
    props: {
      options: [
        {
          label: '选项1',
          value: '选项1',
        },
        {
          label: '选项2',
          value: '选项2',
        },
      ],
      remoteConfig: createDefaultRemoteConfig() as RemoteConfig,
    },
    type: 'checkbox',
  },
  groupName: '表单',
  icon: 'icon--epic--dialogs-outline-rounded',
  sort: 860,
  attributeSync: {
    charValue: {
      write: (rawValue) =>
        Array.isArray(rawValue) ? rawValue.join(',') : String(rawValue ?? ''),
      read: (fieldValue) =>
        fieldValue ? String(fieldValue).split(',') : [],
      source: '选中值列表 (逗号拼接)',
    },
    charDisplay: {
      write: (rawValue) =>
        Array.isArray(rawValue) ? rawValue.join(',') : String(rawValue ?? ''),
      source: '选中项中文名 (逗号拼接)',
    },
  },
} as ComponentConfigModel;
