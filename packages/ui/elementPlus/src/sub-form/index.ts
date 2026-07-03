import type { ComponentConfigModel } from '@ies/types';

export default {
  component: () => import('./sub-form.vue'),
  config: {
    attribute: [
      {
        field: 'field',
        label: '字段名',
        type: 'input',
        props: {
          placeholder: '子表单在 formData 中的 key',
        },
      },
      {
        field: 'props.title',
        label: '标题',
        type: 'input',
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
            // 首次开启时，若未显式设置，则补上默认值以驱动下方选项显示为选中
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
        field: 'props.hidden',
        label: '隐藏',
        type: 'switch',
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
    ],
  },
  defaultSchema: {
    label: '子表单',
    field: 'subForm',
    props: {
      title: '子表单',
      bordered: true,
      collapsible: false,
      collapseIconPosition: 'right',
    },
    type: 'subForm',
    children: [],
  },
  editConstraints: {
    // field 由用户自定义业务含义，不使用随机 id 覆盖
    fixedField: true,
  },
  // 标记为子表单：数据结构为对象嵌套 (formData.field.xxx)
  isSubForm: true,
  groupName: '表单',
  icon: 'icon--epic--wysiwyg-rounded',
  sort: 620,
} as ComponentConfigModel;
