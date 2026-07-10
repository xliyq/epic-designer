import type { PluginManager } from '@ies/manager';

/**
 * attribute-group 子组件在设计时面板中显示的属性配置。
 * 在标准属性基础上追加属性组专属配置（属性编号、字段映射、属性覆盖）。
 */
export function getAttributeGroupChildAttributes(
  pluginManager: PluginManager,
  selectedNodeType?: string,
) {
  // 获取该组件类型的字段映射声明
  const syncEntries = getSyncEntriesForType(pluginManager, selectedNodeType ?? '');

  // 1. 标准属性：从组件配置中获取
  const config = pluginManager.component.getConfigByType(selectedNodeType ?? '');
  const baseAttributes = config?.config?.attribute
    ? [...config.config.attribute]
    : [];

  // 2. 属性组专属属性：追加在标准属性之后
  const groupAttributes = [
    {
      field: 'props.charNum',
      label: '属性编号',
      type: 'input',
      description: '对应 API 属性定义中的 charNum',
      props: {
        placeholder: '如 8044',
      },
    },
    // 字段映射：checkbox + 可编辑字段名
    {
      field: 'props.syncFields',
      label: '字段映射',
      type: 'ESyncFieldsEditor',
      props: {
        entries: syncEntries,
      },
    },
    // 属性覆盖：轻量 JSON 编辑器
    {
      field: 'props.metaOverrides',
      label: '属性覆盖',
      type: 'EJsonEditor',
      description: 'JSON 对象，覆盖 API 定义字段',
    },
  ];

  return [...baseAttributes, ...groupAttributes];
}

/**
 * 获取指定组件类型的字段映射声明。
 * 返回每个字段的名称和取值来源描述。
 * charValue 始终包含且默认选中。
 */
export function getSyncEntriesForType(
  pluginManager: PluginManager,
  type: string,
): { field: string; source: string; enabled: boolean }[] {
  const config = pluginManager.component.getConfigByType(type);
  const sync = config?.attributeSync;
  if (!sync) {
    return [{ field: 'charValue', source: '组件值', enabled: true }];
  }
  return Object.entries(sync).map(([key, entry], index) => ({
    field: key,
    source: entry.source ?? '组件值',
    // charValue 默认选中，其他默认不选中
    enabled: index === 0 || key === 'charValue',
  }));
}

/**
 * section-group 区块模板在设计时面板中显示的属性配置。
 */
export function getSectionGroupTemplateAttributes() {
  return [
    {
      field: 'props.optionKey',
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
  ];
}

/**
 * 检测选中节点的父节点是否为指定类型。
 */
export function getParentType(matched: any[], parentType: string): boolean {
  if (!matched || matched.length < 2) return false;
  const parent = matched[matched.length - 2];
  return parent?.type === parentType;
}

/**
 * 判断选中节点是否在 attribute-group 内。
 */
export function isInAttributeGroup(matched: any[]): boolean {
  return getParentType(matched, 'attribute-group');
}

/**
 * 判断选中节点是否在 section-group 内且为区块模板。
 */
export function isSectionGroupTemplate(matched: any[]): boolean {
  if (!matched || matched.length < 2) return false;
  const parent = matched[matched.length - 2];
  const selected = matched[matched.length - 1];
  return (
    parent?.type === 'section-group' &&
    (selected?.type === 'section-template' ||
      selected?.optionKey !== undefined ||
      selected?.props?.optionKey !== undefined)
  );
}
