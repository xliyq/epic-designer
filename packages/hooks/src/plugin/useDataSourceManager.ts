import type {
  DataSourceProvider,
  DataSourceContext,
  DataSourceOption,
} from '@ies/types';

import { ref, type Ref } from 'vue';

/**
 * 数据源管理器
 */
export function useDataSourceManager() {
  const providers = ref<DataSourceProvider[]>([]);
  const providersMap = new Map<string, DataSourceProvider>();

  /**
   * 注册数据源提供者
   * 如果 id 已存在则覆盖（第三方可用相同 id 覆盖内置 provider）
   */
  function register(provider: DataSourceProvider): void {
    if (providersMap.has(provider.id)) {
      console.warn(`[DataSource] 数据源提供者 "${provider.id}" 已存在，已被覆盖`);
    }
    providersMap.set(provider.id, provider);
    providers.value = Array.from(providersMap.values());
  }

  function get(id: string): DataSourceProvider | undefined {
    return providersMap.get(id);
  }

  function getAll(): DataSourceProvider[] {
    return Array.from(providersMap.values());
  }

  function remove(id: string): void {
    providersMap.delete(id);
    providers.value = Array.from(providersMap.values());
  }

  return {
    providers,
    register,
    get,
    getAll,
    remove,
  };
}

/**
 * 模板变量正则：匹配 ${formData.xxx}
 */
const FORM_DATA_PATTERN = /\$\{formData\.([^}]+)\}/g;

/**
 * 解析参数中的 ${formData.xxx} 模板引用
 */
function resolveFormDataParams(
  params: Record<string, any>,
  formData: Record<string, any>,
): Record<string, any> {
  if (!params) return {};
  const resolved: Record<string, any> = {};
  for (const key in params) {
    const val = params[key];
    if (typeof val === 'string') {
      resolved[key] = val.replace(FORM_DATA_PATTERN, (_, fieldPath: string) => {
        const pathParts = fieldPath.split('.');
        let value: any = formData;
        for (const part of pathParts) {
          if (value == null) return '';
          value = value[part];
        }
        return value ?? '';
      });
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

let builtinRegistered = false;

/**
 * 注册内置数据源提供者
 */
export function registerBuiltinProviders(manager: ReturnType<typeof useDataSourceManager>): void {
  if (builtinRegistered) return;

  // 内置：静态数据
  manager.register({
    id: 'static',
    label: '静态数据',
    icon: 'icon--epic--list',
    editor: 'EOptionsEditor',
    defaultConfig: { options: [] },
    loader: async (config: Record<string, any>) => {
      return (config.options ?? []) as DataSourceOption[];
    },
  });

  // 内置：HTTP 远程数据
  manager.register({
    id: 'http',
    label: '远程数据',
    icon: 'icon--epic--cloud-download',
    editor: 'ERemoteConfigEditor',
    defaultConfig: {
      url: '',
      method: 'GET',
      params: {},
      headers: {},
      dataPath: 'data',
      labelKey: 'label',
      valueKey: 'value',
      childrenKey: 'children',
      cache: true,
      autoLoad: true,
    },
    watchFields: (config) => config.watchFields ?? [],
    loader: async (
      config: Record<string, any>,
      context: DataSourceContext,
    ) => {
      const { url, method, params, dataPath, labelKey, valueKey, childrenKey } = config;
      if (!url) return [];

      const resolvedParams = resolveFormDataParams(params ?? {}, context.formData);

      // 检查联动字段是否全部为空
      const watchFields = config.watchFields as string[] | undefined;
      if (watchFields?.length) {
        const allEmpty = watchFields.every((f: string) => !context.formData[f]);
        if (allEmpty) return [];
      }

      // 优先使用注入的 http 实例
      const http = context.global?.$http;
      let response: any;

      if (http?.get && http?.post) {
        response = method === 'GET'
          ? await http.get(url, { params: resolvedParams })
          : await http.post(url, resolvedParams);
      } else {
        // 降级使用 fetch
        const defaultHeaders = context.global?.axiosConfig?.headers ?? {};
        const mergedHeaders = { 'Content-Type': 'application/json', ...defaultHeaders, ...(config.headers ?? {}) };

        let fullUrl = url;
        const fetchOptions: RequestInit = { method, headers: mergedHeaders };

        if (method === 'GET') {
          const query = new URLSearchParams(
            Object.entries(resolvedParams)
              .filter(([, v]) => v != null && v !== '')
              .map(([k, v]) => [k, String(v)]),
          ).toString();
          if (query) fullUrl += (url.includes('?') ? '&' : '?') + query;
        } else {
          fetchOptions.body = JSON.stringify(resolvedParams);
        }

        const res = await fetch(fullUrl, fetchOptions);
        response = await res.json();
      }

      // 按路径取数据
      const path = dataPath || 'data';
      const rawList = path.split('.').reduce((obj: any, key: string) => obj?.[key], response) ?? [];
      const arr = Array.isArray(rawList) ? rawList : [];

      // 映射选项
      const lk = labelKey || 'label';
      const vk = valueKey || 'value';
      const ck = childrenKey || 'children';

      function mapItems(items: any[]): DataSourceOption[] {
        return items.map((item: any) => {
          const result: DataSourceOption = { label: item[lk], value: item[vk] };
          if (item[ck]) result.children = mapItems(item[ck]);
          return result;
        });
      }

      return mapItems(arr);
    },
  });

  builtinRegistered = true;
}