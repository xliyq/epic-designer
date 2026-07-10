import type { ComponentConfigModel } from '@ies/designer';

export default {
  bindModel: 'modelValue',
  component: () => import('./attribute-group.vue'),
  config: {
    attribute: [
      {
        field: 'field',
        label: '字段名',
        type: 'input',
        props: {
          placeholder: '属性组在 formData 中的 key',
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
        field: 'props.bordered',
        label: '显示边框',
        type: 'switch',
      },
      {
        field: 'props.collapsible',
        label: '可折叠',
        type: 'switch',
        onChange: ({ value, values }) => {
          const p = values.props ?? {};
          if (value) {
            if (!p.collapseIconPosition) p.collapseIconPosition = 'right';
            if (p.defaultCollapsed === undefined) p.defaultCollapsed = false;
          }
        },
      },
      {
        field: 'props.collapseIconPosition',
        label: '折叠图标位置',
        props: {
          options: [
            { label: '左侧', value: 'left' },
            { label: '右侧', value: 'right' },
          ],
          radioButton: true,
        },
        show: ({ values }) => !!values.props?.collapsible,
        type: 'radio',
      },
      {
        field: 'props.defaultCollapsed',
        label: '默认折叠',
        type: 'switch',
        show: ({ values }) => !!values.props?.collapsible,
      },
      {
        field: 'props.gridEnable',
        label: '网格布局',
        type: 'switch',
        onChange: ({ value, values }) => {
          const props = values.props ?? {};
          if (value) {
            props.gridCols = 2;
          } else {
            delete props.gridCols;
          }
        },
      },
      {
        field: 'props.gridCols',
        label: '栅格列数',
        props: {
          min: 2,
          max: 4,
        },
        show: ({ values }) => !!values.props?.gridEnable,
        type: 'number',
      },
      {
        field: 'props.labelPosition',
        label: '标签位置',
        props: {
          clearable: true,
          placeholder: '跟随父表单',
          options: [
            { label: '左侧', value: 'left' },
            { label: '右侧', value: 'right' },
            { label: '顶部', value: 'top' },
          ],
        },
        type: 'select',
      },
      {
        field: 'props.labelWidth',
        label: '标签宽度',
        type: 'EInputSize',
        show: ({ values }) =>
          values.props?.labelPosition &&
          values.props?.labelPosition !== 'top',
      },
      {
        field: 'props.groupMeta',
        label: '组元数据',
        type: 'input',
        description: '注入到每个数组项中的固定字段，JSON 格式',
        props: {
          placeholder: '{"sourceSystem":"web"}',
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
    label: '属性组',
    field: 'attributeGroup',
    input: true,
    hideLabel: true,
    props: {
      title: '属性组',
      bordered: true,
      collapsible: false,
    },
    type: 'attribute-group',
    children: [],
  },
  editConstraints: {
    fixedField: true,
  },
  isAttributeGroup: true,
  groupName: '分组组件',
  icon: 'icon--epic--wysiwyg-rounded',
  sort: 630,
} as ComponentConfigModel;
