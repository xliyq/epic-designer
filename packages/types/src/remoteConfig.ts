/**
 * 远程选项数据绑定配置
 * 用于 select / checkbox / radio / cascader 等需要动态选项的组件
 */
export interface RemoteConfig {
  /** 是否启用远程数据 */
  enabled: boolean;

  /** 请求 URL */
  url: string;

  /** 请求方法 */
  method: 'GET' | 'POST';

  /**
   * 请求参数（GET 时拼 query，POST 时放 body）
   * 值中支持 ${formData.xxx} 模板引用表单其他字段值
   */
  params: Record<string, any>;

  /**
   * 请求头，会与 pluginManager.global.axiosConfig.headers 合并
   */
  headers?: Record<string, string>;

  /**
   * 响应数据路径，从响应体中取目标数组的路径
   * 支持 dot 路径，如 'data.list'
   * 默认 'data'
   */
  dataPath: string;

  /**
   * 响应字段映射：label
   * 从响应数据项中取哪个字段作为选项 label
   * 默认 'label'
   */
  labelKey: string;

  /**
   * 响应字段映射：value
   * 从响应数据项中取哪个字段作为选项 value
   * 默认 'value'
   */
  valueKey: string;

  /**
   * 子节点字段名（仅 cascader 级联选择器使用）
   * 树形数据中子节点的字段名
   * 默认 'children'
   */
  childrenKey?: string;

  /**
   * 是否缓存请求结果（相同 URL + 参数 不重复请求）
   * 默认 true
   */
  cache: boolean;

  /**
   * 是否在组件挂载时自动请求
   * 若为 false，需要手动调用 fetchOptions 或通过 watchFields 触发
   * 默认 true
   */
  autoLoad: boolean;

  /**
   * 联动触发字段：当这些字段的值变化时自动重新请求
   * 值为表单中的 field 字段名列表
   * 例: ['provinceId']
   */
  watchFields?: string[];
}
