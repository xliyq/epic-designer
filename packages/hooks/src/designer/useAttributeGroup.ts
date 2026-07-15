import type { ComputedRef, InjectionKey } from 'vue';

/**
 * attribute-group 运行时需要的 API 属性定义数据。
 * key = attribute-group 的 field 名（如 "poordCharacters"）
 * value = 该属性组的 API 定义数组
 */
export type AttributeMeta = Record<string, any[]>;

export const ATTRIBUTE_META_KEY: InjectionKey<ComputedRef<AttributeMeta>> =
  Symbol('attributeMeta');

/**
 * attribute-group 设计时上下文，用于子组件面板检测。
 * 当子组件处于 attribute-group 内时，右侧属性面板替换为属性组子配置面板。
 */
export interface AttributeGroupCtx {
  groupField: string;
  attrsMeta: any[];
}

export const ATTRIBUTE_GROUP_CTX_KEY: InjectionKey<AttributeGroupCtx | null> =
  Symbol('attributeGroupCtx');

/**
 * section-group 设计时上下文，用于区块模板面板检测。
 */
export interface SectionGroupCtx {
  groupField: string;
  isTemplate: boolean;
}

export const SECTION_GROUP_CTX_KEY: InjectionKey<SectionGroupCtx | null> =
  Symbol('sectionGroupCtx');

/**
 * section-group 运行时父级 item 上下文，用于嵌套 section-group 读取父级数据。
 * 当 section-group 嵌套在另一个 section-group 内部时，父级提供当前 item 的响应式引用，
 * 子 section-group 可以从此上下文读取 selectionField 等字段。
 */
export const SECTION_PARENT_ITEM_KEY: InjectionKey<Record<string, any> | null> =
  Symbol('sectionParentItem');
