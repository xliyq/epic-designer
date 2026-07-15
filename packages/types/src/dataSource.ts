import type { Ref } from 'vue';

/**
 * 选项数据项
 */
export interface DataSourceOption {
  label: string;
  value: any;
  children?: DataSourceOption[];
  [key: string]: any;
}

/**
 * 数据源提供者上下文
 */
export interface DataSourceContext {
  /** 当前表单数据 */
  formData: Record<string, any>;
  /** 组件 schema 中的 field */
  field?: string;
  /** 获取已注册的全局上下文 */
  global?: any;
}

/**
 * 数据源提供者
 *
 * 第三方通过 pluginManager.dataSource.register() 注册自定义数据源提供者，
 * 实现自己的数据加载逻辑（HTTP、字典服务、WebSocket 等）。
 */
export interface DataSourceProvider {
  /** 唯一标识 */
  id: string;
  /** 显示名称 */
  label: string;
  /** 图标（可选） */
  icon?: string;
  /**
   * 属性面板编辑器组件类型名
   * 需提前通过 pluginManager.component.add() 注册对应组件
   */
  editor: string;
  /**
   * 数据加载函数
   * @param config 该 provider 的配置数据（来自 schema props.dataSource.config）
   * @param context 数据源上下文（含 formData、field 等）
   * @returns 选项数组
   */
  loader: (
    config: Record<string, any>,
    context: DataSourceContext,
  ) => Promise<DataSourceOption[]>;
  /** 该 provider 的默认配置 */
  defaultConfig: Record<string, any>;
  /**
   * 联动字段配置（可选）
   * 返回需要监听的表单字段名列表
   * 当这些字段值变化时自动重新加载
   */
  watchFields?: (config: Record<string, any>) => string[];
}

/**
 * 数据源 Schema 结构
 * 存储在组件的 props.dataSource 中
 */
export interface DataSourceSchema {
  /** 数据源类型，对应 provider.id */
  type: string;
  /** 该数据源的配置数据 */
  config: Record<string, any>;
}

/**
 * 数据源管理器返回值
 */
export interface DataSourceManager {
  /** 注册数据源提供者 */
  register: (provider: DataSourceProvider) => void;
  /** 获取数据源提供者 */
  get: (id: string) => DataSourceProvider | undefined;
  /** 获取所有已注册的数据源提供者 */
  getAll: () => DataSourceProvider[];
  /** 移除数据源提供者 */
  remove: (id: string) => void;
  /** 所有已注册的数据源提供者（响应式） */
  providers: Ref<DataSourceProvider[]>;
}
