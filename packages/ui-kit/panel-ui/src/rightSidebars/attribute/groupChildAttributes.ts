/**
 * attribute-group 子组件在设计时面板中显示的属性配置。
 * 当子组件处于 attribute-group 内时，替换标准属性面板。
 */

export function getAttributeGroupChildAttributes() {
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
 * section-group 的直接子节点（带 optionKey）即为区块模板。
 */
export function isSectionGroupTemplate(matched: any[]): boolean {
  if (!matched || matched.length < 2) return false;
  const parent = matched[matched.length - 2];
  const selected = matched[matched.length - 1];
  return parent?.type === 'section-group' && selected?.optionKey !== undefined;
}
