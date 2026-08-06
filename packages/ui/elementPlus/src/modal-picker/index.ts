import type { ComponentConfigModel } from '@ies/designer';
import { createDefaultDataSource } from '@ies/utils';

export default {
  component: () => import('./modal-picker.vue'),
  config: {
    attribute: [
      // === 基本属性 ===
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
        label: '占位内容',
        type: 'input',
      },
      {
        field: 'props.clearable',
        label: '可清空',
        type: 'switch',
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

      // === 选择模式 ===
      {
        field: 'props.multiple',
        label: '可多选',
        onChange: ({ value, values }) => {
          values.props.defaultValue = value ? [] : null;
        },
        type: 'switch',
      },
      {
        field: 'props.multipleLimit',
        label: '多选限制',
        show: ({ values }) => values.props.multiple,
        type: 'number',
      },

      // === 弹窗配置 ===
      {
        field: 'props.modalTitle',
        label: '弹窗标题',
        type: 'input',
      },
      {
        field: 'props.modalWidth',
        label: '弹窗宽度',
        type: 'input',
      },

      // === 搜索配置 ===
      {
        field: 'props.searchable',
        label: '显示搜索',
        type: 'switch',
      },
      {
        description: '配置弹窗内搜索区域的字段',
        field: 'props.searchFields',
        layout: 'vertical',
        label: '搜索字段',
        show: ({ values }) => values.props.searchable,
        type: 'SearchFieldsEditor',
      },

      // === 表格配置 ===
      {
        description: '配置表格列',
        field: 'props.columns',
        layout: 'vertical',
        label: '列配置',
        type: 'TableColumnsEditor',
      },
      {
        field: 'props.rowKey',
        label: '行标识字段',
        type: 'input',
      },

      // === 分页配置 ===
      {
        field: 'props.pagination',
        label: '显示分页',
        type: 'switch',
      },
      {
        field: 'props.pageSize',
        label: '每页条数',
        show: ({ values }) => values.props.pagination,
        type: 'number',
      },

      // === 数据源 ===
      {
        description: '配置数据来源：静态选项或远程 HTTP 请求',
        field: 'props.dataSource',
        layout: 'vertical',
        type: 'DataSourceEditor',
      },

      // === 校验 ===
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
    field: 'modalPicker',
    input: true,
    label: '弹窗选择',
    props: {
      placeholder: '请选择',
      clearable: true,
      disabled: false,
      hidden: false,
      multiple: false,
      multipleLimit: 0,
      modalTitle: '请选择',
      modalWidth: '800px',
      searchable: false,
      searchFields: [],
      columns: [],
      rowKey: 'value',
      pagination: true,
      pageSize: 10,
      dataSource: createDefaultDataSource(),
    },
    type: 'modal-picker',
  },
  groupName: '表单',
  icon: 'icon--epic--select',
  sort: 850,
  attributeSync: {
    charValue: {
      write: (rawValue) => rawValue,
      read: (fieldValue) => fieldValue,
      source: '选中值 (value)',
    },
    charDisplay: {
      write: (rawValue, extra) => {
        // 多选时返回逗号分隔的 label
        if (Array.isArray(extra?.options)) {
          return extra.options.map((o: any) => o?.label).join(', ');
        }
        return extra?.option?.label ?? null;
      },
      source: '选中项中文名 (label)',
    },
  },
} as ComponentConfigModel;
