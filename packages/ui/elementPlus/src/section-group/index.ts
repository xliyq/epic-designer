import type { ComponentConfigModel } from '@ies/designer';

export default {
  bindModel: 'modelValue',
  component: () => import('./section-group.vue'),
  config: {
    attribute: [
      {
        field: 'field',
        label: '字段名',
        type: 'input',
        props: {
          placeholder: '区块组在 formData 中的 key',
        },
      },
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
      {
        field: 'props.title',
        label: '面板标题',
        type: 'input',
        props: {
          placeholder: '不填则使用标题',
        },
      },
      {
        field: 'props.keyField',
        label: '数据匹配字段',
        type: 'input',
        description: '外部数据中用于匹配 optionKey 的字段名，如 skuNum',
        props: {
          placeholder: 'skuNum',
        },
      },
      {
        field: 'props.selectionField',
        label: '选择字段',
        type: 'input',
        description: '监听哪个 formData 字段的选中值来控制区块显隐',
        props: {
          placeholder: 'selectedOffers',
        },
      },
      {
        field: 'props.bordered',
        label: '显示边框',
        type: 'switch',
      },
      {
        field: 'props.collapsible',
        label: '可折叠',
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
    label: '区块组',
    field: 'sectionGroup',
    input: true,
    props: {
      title: '区块组',
      bordered: true,
      collapsible: false,
      keyField: 'skuNum',
      selectionField: 'selectedOffers',
    },
    type: 'section-group',
    children: [],
  },
  editConstraints: {
    fixedField: true,
  },
  isSectionGroup: true,
  groupName: '分组组件',
  icon: 'icon--epic--wysiwyg-rounded',
  sort: 640,
} as ComponentConfigModel;
