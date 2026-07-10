import type { ComponentConfigModel } from '@ies/designer';

export default {
  bindModel: 'modelValue',
  component: () => import('./text-view.vue'),
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
        field: 'props.placeholder',
        label: '空值占位',
        type: 'input',
        props: {
          placeholder: '值为空时显示的文字',
        },
      },
      {
        field: 'props.defaultValue',
        label: '默认值',
        type: 'input',
        props: {
          placeholder: '无数据时显示的默认值',
        },
      },
      {
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
      },
    ],
  },
  defaultSchema: {
    field: 'textView',
    input: true,
    label: '文本展示',
    props: {
      placeholder: '-',
    },
    type: 'text-view',
  },
  groupName: '表单',
  icon: 'icon--epic--border-color-outline-rounded',
  sort: 690,
} as ComponentConfigModel;
