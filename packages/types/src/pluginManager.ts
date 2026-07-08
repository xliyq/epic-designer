import type { AsyncComponentLoader, Component, ShallowRef } from 'vue';

import type { ComponentSchema } from './epic-designer';
// 定义 ComponentType 类型
export type ComponentType = AsyncComponentLoader | Component | string;

/**
 * attribute-group 内子组件的数据产出规则。
 * key = 要写入的属性字段名，value = 从组件原始值推导出最终值的函数。
 * rawValue: 组件 v-model 的原始值
 * extra: 额外上下文（如 Select 的选中项 label）
 */
export type AttributeSyncMap = Record<
  string,
  (rawValue: any, extra?: { option?: any; options?: any[] }) => any
>;

export interface ActivitybarModel {
  component: ComponentType;
  icon: string;
  id: string;
  sort?: number;
  title: string;
  visible?: boolean;
}

export interface RightSidebarModel {
  component: ComponentType;
  id: string;
  sort?: number;
  title: string;
  visible?: boolean;
}

export interface ViewsContainersModel {
  activityBars: ShallowRef<ActivitybarModel[]>;
  rightSidebars: ShallowRef<RightSidebarModel[]>;
}

export type Components = Record<string, ComponentType>;

export interface EventModel {
  /**
   * @deprecated 此属性用于兼容旧版，后期可能会移除，请使用description属性代替。
   */
  describe?: string;
  description: string;

  type: string;
}

export interface ActionModel extends EventModel {
  args?: unknown[];
  argsConfigs?: ComponentSchema[];
}

export interface EditConstraintsModel {
  // 子节点是否固定不可拖动,只控制下一级，可选
  childImmovable?: boolean;
  // 表单字段是否固定 不添加随机UUID
  fixedField?: boolean;
  // 当前组件是否固定不可拖动，可选
  immovable?: boolean;
  // 是否为内联组件
  inline?: boolean;
  // 组件锁定，不可编辑，不可选中，不可复制删除
  locked?: boolean;
}

export interface ComponentConfigModel {
  // 输入表单组件v-model绑定变量名称 默认 modelValue
  bindModel?: string;
  // 组件
  component: ComponentType;
  // 配置
  config: {
    // 可执行函数
    action?: ActionModel[];
    // 属性编辑列表
    attribute?: ComponentSchema[];
    // 可触发事件
    event?: EventModel[];
    // 样式编辑组件列表
    style?: ComponentSchema[];
  };
  // 默认组件结构数据
  defaultSchema: ComponentSchema;
  // 设计编辑约束
  editConstraints?: EditConstraintsModel;
  // 分组名称（组件分组），不设置分组时仅注册，但不会显示在组件列表中，可选
  groupName?: string;
  // 组件图标
  icon?: string;
  // 是否为子表组件
  isSubTable?: boolean;
  // 是否为子表单组件（对象型嵌套表单，数据结构为 formData.field.xxx）
  isSubForm?: boolean;
  // 是否为属性组组件（数组型嵌套，数据结构为 formData.field[{charValue,...}]）
  isAttributeGroup?: boolean;
  // 是否为区块组组件（预编排区块，数据结构为 formData.field[{...},{...}]）
  isSectionGroup?: boolean;
  // attribute-group 内的数据产出规则，声明该组件在属性组中如何写入数组项字段
  attributeSync?: AttributeSyncMap;
  // 组件优先级, 默认值99,数字越大, 优先级越高, 优先使用高优先级组件
  priority?: number;
  // 用于组件排序，可选 默认值1000, 值越小，组件越靠前
  sort?: number;
}

export type ComponentConfigModelRecords = Record<string, ComponentConfigModel>;

export interface PublicMethodModel {
  argsConfigs?: ComponentSchema[];
  /**
   * @deprecated 此属性用于兼容旧版，后期可能会移除，请使用description属性代替。
   */
  describe?: string;
  description?: string;
  handler: Function;

  /**
   * @deprecated 此属性用于兼容旧版，后期可能会移除，请使用handler属性代替。
   */
  method?: Function;

  /**
   * @deprecated 此属性用于兼容旧版，后期可能会移除，请使用name属性代替。
   */
  methodName?: string;

  name: string;
}

export type PublicMethodsModel = Record<string, PublicMethodModel>;

export interface ComponentGroup {
  list: ComponentSchema[];
  title: string;
}

export type ComponentSchemaGroups = ComponentGroup[];
