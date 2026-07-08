import type { PluginManager } from '@ies/manager';

/**
 * attribute-group 子组件在设计时面板中显示的属性配置。
 * 当子组件处于 attribute-group 内时，替换标准属性面板。
 */
export function getAttributeGroupChildAttributes(
  pluginManager: PluginManager,
  selectedNodeType?: string,
) {
  // 获取该组件类型的字段映射声明
  const syncEntries = getSyncEntriesForType(pluginManager, selectedNodeType ?? '');

  return [
    {
      field: 'props.charNum',
      label: '属性编号',
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
    // 字段映射：结构化展示每个字段的取值来源
    // 用 EOptionsEditor 或自定义编辑器展示，这里先用描述性文本
    // syncFields 存储为 string[]，如 ["charValue", "charDisplay"]
    {
      field: 'props.syncFields',
      label: '字段映射',
      type: 'checkbox',
      description: syncEntries
        .map((e) => `${e.field} <- ${e.source}`)
        .join('\n'),
      props: {
        options: syncEntries.map((e) => ({
          label: `${e.field} (${e.source})`,
          value: e.field,
        })),
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
 * 获取指定组件类型的字段映射声明。
 * 返回每个字段的名称和取值来源描述。
 */
export function getSyncEntriesForType(
  pluginManager: PluginManager,
  type: string,
): { field: string; source: string }[] {
  const config = pluginManager.component.getConfigByType(type);
  const sync = config?.attributeSync;
  if (!sync) {
    return [{ field: 'charValue', source: '组件值' }];
  }
  return Object.entries(sync).map(([key, entry]) => ({
    field: key,
    source: entry.source ?? '组件值',
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
