import type { ComponentSchema } from '@ies/types';

import type { FieldOverride, MultiViewPageSchema, ViewConfig } from '../types';

/**
 * 合并字段的全局定义和视图覆盖，生成最终渲染用的 ComponentSchema
 *
 * 覆盖规则：
 * - 顶层字段：override 有值则覆盖，无值继承全局
 * - props：浅合并（{ ...globalProps, ...overrideProps }）
 * - type：override.widgetType 覆盖 field.type
 */
export function resolveFieldSchema(
  field: ComponentSchema,
  override?: FieldOverride,
): ComponentSchema {
  if (!override) return field;

  const resolved: ComponentSchema = { ...field };

  // 顶层字段覆盖
  if (override.label !== undefined) {
    resolved.label = override.label;
  }
  if (override.hideLabel !== undefined) {
    resolved.hideLabel = override.hideLabel;
  }
  if (override.rules !== undefined) {
    resolved.rules = override.rules;
  }
  if (override.on !== undefined) {
    resolved.on = override.on;
  }
  if (override.show !== undefined) {
    resolved.show = override.show;
  }

  // 控件类型覆盖
  if (override.widgetType !== undefined) {
    resolved.type = override.widgetType;
  }

  // props 浅合并
  if (override.props !== undefined) {
    resolved.props = { ...field.props, ...override.props };
  }

  return resolved;
}

/**
 * 将 MultiViewPageSchema + viewType 解析为标准 PageSchema
 *
 * 1. 取 schemas[0].children 作为全部字段定义（数据模型）
 * 2. 取 viewConfigs[viewType].layout 过滤 + 排序
 * 3. 对每个字段 applyFieldOverride 合并覆盖属性
 *
 * @returns 标准 PageSchema，可直接传给 EBuilder 渲染
 */
export function resolveViewSchema(
  schema: MultiViewPageSchema,
  viewType: string,
): PageSchemaLike {
  const config: ViewConfig | undefined = schema.viewConfigs?.[viewType];

  // 无视图配置 -> 返回原始 schema
  if (!config || config.layout.length === 0) {
    return {
      ...schema,
      viewTypes: undefined,
      viewConfigs: undefined,
    } as PageSchemaLike;
  }

  // 取表单根节点
  const formNode = schema.schemas?.[0];
  if (!formNode || !formNode.children) {
    return { ...schema } as PageSchemaLike;
  }

  const allFields = formNode.children;

  // 按 layout 过滤 + 排序 + 合并覆盖
  const resolvedFields: ComponentSchema[] = config.layout
    .map((fieldId) => allFields.find((f) => f.id === fieldId))
    .filter((f): f is ComponentSchema => !!f)
    .map((field) =>
      resolveFieldSchema(
        field,
        config.fieldOverrides?.[field.id ?? ''],
      ),
    );

  return {
    ...schema,
    schemas: [
      { ...formNode, children: resolvedFields },
    ],
    viewTypes: undefined,
    viewConfigs: undefined,
  } as PageSchemaLike;
}

/** 内部类型别名，避免循环依赖 */
type PageSchemaLike = Omit<MultiViewPageSchema, 'viewTypes' | 'viewConfigs'>;

/**
 * 读取字段在某个视图下的覆盖属性值
 * 支持点号路径访问（如 'props.placeholder'）
 *
 * @returns override 中对应路径的值，undefined 表示未覆盖（需继承全局）
 */
export function getOverrideValue(
  override: FieldOverride | undefined,
  fieldPath: string,
): { value: any; isOverridden: boolean } {
  if (!override) return { value: undefined, isOverridden: false };

  // 控件类型特殊处理
  if (fieldPath === 'widgetType') {
    return {
      value: override.widgetType,
      isOverridden: override.widgetType !== undefined,
    };
  }

  // 顶层字段
  if (!fieldPath.startsWith('props.')) {
    const key = fieldPath as keyof FieldOverride;
    return {
      value: override[key],
      isOverridden: override[key] !== undefined,
    };
  }

  // props.xxx 路径
  const propKey = fieldPath.slice('props.'.length);
  const propValue = override.props?.[propKey];
  return {
    value: propValue,
    isOverridden: propValue !== undefined,
  };
}

/**
 * 写入字段覆盖属性
 * 支持点号路径写入（如 'props.placeholder'）
 */
export function setOverrideValue(
  override: FieldOverride | undefined,
  fieldPath: string,
  value: any,
): FieldOverride {
  const result: FieldOverride = override
    ? { ...override, props: override.props ? { ...override.props } : undefined }
    : {};

  // 控件类型特殊处理
  if (fieldPath === 'widgetType') {
    if (value === undefined || value === '') {
      delete result.widgetType;
    } else {
      result.widgetType = value;
    }
    return result;
  }

  // 顶层字段
  if (!fieldPath.startsWith('props.')) {
    if (value === undefined) {
      delete (result as any)[fieldPath];
    } else {
      (result as any)[fieldPath] = value;
    }
    return result;
  }

  // props.xxx 路径
  const propKey = fieldPath.slice('props.'.length);
  if (!result.props) {
    result.props = {};
  }
  if (value === undefined) {
    delete result.props[propKey];
    // 如果 props 为空对象，删除 props
    if (Object.keys(result.props).length === 0) {
      delete result.props;
    }
  } else {
    result.props[propKey] = value;
  }

  return result;
}

/**
 * 判断字段是否有任意覆盖属性
 */
export function hasAnyOverride(
  override: FieldOverride | undefined,
): boolean {
  if (!override) return false;
  return (
    override.label !== undefined ||
    override.hideLabel !== undefined ||
    override.rules !== undefined ||
    override.on !== undefined ||
    override.show !== undefined ||
    override.widgetType !== undefined ||
    (override.props !== undefined && Object.keys(override.props).length > 0)
  );
}
