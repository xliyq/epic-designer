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
 * 全局消息提示接口
 */
export interface MessageApi {
  error: (text: string) => void;
  info: (text: string) => void;
  success: (text: string) => void;
  warning: (text: string) => void;
}

/**
 * HTTP 客户端接口
 * 兼容 axios 实例或任何提供 get/post 方法的对象
 */
export interface HttpClient {
  get: (url: string, config?: Record<string, any>) => Promise<any>;
  post: (url: string, data?: any, config?: Record<string, any>) => Promise<any>;
  [key: string]: any;
}

/**
 * axios 配置（用于 fetch 降级时的 headers 等配置）
 */
export interface AxiosConfig {
  /** 请求头，与 fetch 降级路径的默认 headers 合并 */
  headers?: Record<string, string>;
  [key: string]: any;
}

/**
 * 全局上下文初始值（可扩展任意属性）
 */
export interface InitialGlobal {
  [key: string]: any;
}

/**
 * 全局上下文接口
 * 第三方可通过 pluginManager.global.$http = myAxios 注入 HTTP 客户端
 */
export interface Global {
  [key: string]: any;
  /** 全局消息提示 */
  $message: MessageApi;
  /**
   * HTTP 客户端实例（axios 或自定义）
   * 注入后，http 数据源 provider 会优先使用它发起请求
   */
  $http?: HttpClient;
  /**
   * axios 配置，用于 fetch 降级路径的 headers 等合并
   */
  axiosConfig?: AxiosConfig;
}

/**
 * 数据源提供者上下文
 */
export interface DataSourceContext {
  /** 当前表单数据 */
  formData: Record<string, any>;
  /** 组件 schema 中的 field */
  field?: string;
  /** 全局上下文（含 $http、$message、axiosConfig 等） */
  global?: Global;
}

/**
 * 分页查询结果
 */
export interface PagedResult {
  /** 当前页数据 */
  list: DataSourceOption[];
  /** 总记录数 */
  total: number;
}

/**
 * 分页查询上下文（扩展 DataSourceContext）
 */
export interface PagedDataSourceContext extends DataSourceContext {
  /** 当前页码（从 1 开始） */
  pageNum: number;
  /** 每页条数 */
  pageSize: number;
  /** 搜索参数（搜索字段名 -> 值） */
  searchParams: Record<string, any>;
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

  /**
   * 分页加载函数（可选）
   * 实现了此方法的 provider 支持服务端分页。
   * 未实现时，组件回退到 loader() 全量加载 + 前端分页。
   * @param config provider 配置数据
   * @param context 分页查询上下文（含 pageNum、pageSize、searchParams）
   * @returns 分页结果（list + total）
   */
  pagedLoader?: (
    config: Record<string, any>,
    context: PagedDataSourceContext,
  ) => Promise<PagedResult>;

  /**
   * 根据 value 获取完整数据项（可选）
   * 用于组件回显：已知 value，需要获取 label 等展示信息。
   * 未实现时，组件尝试从已加载的数据中匹配。
   * @param config provider 配置数据
   * @param context 数据源上下文（额外包含 value 字段）
   * @returns 单个选项或选项数组（多选时）
   */
  detailLoader?: (
    config: Record<string, any>,
    context: DataSourceContext & { value: any | any[] },
  ) => Promise<DataSourceOption | DataSourceOption[]>;
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
