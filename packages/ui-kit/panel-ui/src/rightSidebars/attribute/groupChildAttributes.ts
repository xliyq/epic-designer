import type { PluginManager } from '@ies/manager';

/**
 * attribute-group 子组件在设计时面板中显示的属性配置。
 * 当子组件处于 attribute-group 内时，替换标准属性面板。
 * syncFields 的选项动态来自该组件类型的 attributeSync 声明。
 */
export function getAttributeGroupChildAttributes(
  pluginManager: PluginManager,
  selectedNodeType?: string,
) {
  // 根据选中组件类型获取可用的同步字段
  const syncOptions = getSyncFieldsForType(pluginManager, selectedNodeType ?? '');

  return [
    {
      field: 'props.bindAttribute',
      label: '绑定属性',
      type: 'input',
      description: '对应 API 属性定义中的 charNum',
      props: {
        placeholder: '如 8044',
      },
    },
    {
      field: 'label',
      label: '标题',
      type: 'input',
      props: {
        placeholder: '运行时由 API 定义覆盖',
      },
    },
    {
      field: 'props.syncFields',
      label: '同步字段',
      type: 'checkbox',
      description: '选择该组件需要同步写入的属性字段',
      props: {
        options: syncOptions,
      },
    },
    {
      field: 'props.metaOverrides',
      label: '属性覆盖',
      type: 'input',
      description: '覆盖 API 定义字段，JSON 格式',
      props: {
        placeholder: '{"alias":"customName","toBossFlag":0}',
      },
    },
    {
      field: 'props.hidden',
      label: '隐藏',
      type: 'switch',
    },
  ];
}

/**
 * section-group 区块模板在设计时面板中显示的属性配置。
 * 当选中区块模板（children 中带 optionKey 的节点）时显示。
 */
export function getSectionGroupTemplateAttributes() {
  return [
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
  ];
}

/**
 * 获取指定组件类型的 syncFields 可选项。
 * 从该组件的 attributeSync 声明中提取所有 key。
 */
export function getSyncFieldsForType(
  pluginManager: PluginManager,
  type: string,
): { label: string; value: string }[] {
  const config = pluginManager.component.getConfigByType(type);
  const sync = config?.attributeSync;
  if (!sync) {
    return [{ label: 'charValue', value: 'charValue' }];
  }
  return Object.keys(sync).map((key) => ({ label: key, value: key }));
}

/**
 * 检测选中节点的父节点是否为指定类型。
 */
export function getParentType(
  matched: any[],
  parentType: string,
): boolean {
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
 * section-group 的直接子节点（type=section-template 或带 optionKey）即为区块模板。
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
