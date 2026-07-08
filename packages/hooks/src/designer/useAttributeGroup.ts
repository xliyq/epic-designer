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
