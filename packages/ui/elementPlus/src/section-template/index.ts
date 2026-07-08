import type { ComponentConfigModel } from '@ies/designer';

export default {
  component: () => import('./section-template.vue'),
  config: {
    attribute: [
      {
        field: 'optionKey',
        label: '选项 Key',
        type: 'input',
        description: '与选择组件的 option value 匹配',
        props: {
          placeholder: '如 2025999480006336',
        },
      },
      {
        field: 'label',
        label: '区块标题',
        type: 'input',
        props: {
          placeholder: '如 尊享包',
        },
      },
    ],
  },
  defaultSchema: {
    label: '区块模板',
    type: 'section-template',
    props: {
      optionKey: '',
    },
    children: [],
  },
  editConstraints: {
    fixedField: true,
  },
  groupName: '分组组件',
  icon: 'icon--epic--wysiwyg-rounded',
  sort: 650,
} as ComponentConfigModel;
