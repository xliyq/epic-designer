import type {
  DataSourceProvider,
  DataSourceContext,
  DataSourceOption,
  PagedResult,
  PagedDataSourceContext,
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
  const httpProvider: DataSourceProvider = {
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
      pagination: false,         // 是否启用服务端分页
      pageNumKey: 'pageNum',     // 页码参数名
      pageSizeKey: 'pageSize',   // 每页条数参数名
      listPath: 'data.list',     // 分页列表数据路径（覆盖 dataPath）
      totalPath: 'data.total',   // 总条数路径
      // 回显接口配置（可选）
      detailUrl: '',             // 回显接口地址，为空则不支持服务端回显
      valueParamKey: 'id',       // 回显接口参数名
      detailDataPath: 'data',    // 回显数据路径
    },
    watchFields: (config) => config.watchFields ?? [],
    loader: async (
      config: Record<string, any>,
      context: DataSourceContext,
    ) => {
      const { url } = config;
      if (!url) return [];

      const resolvedParams = resolveFormDataParams(config.params ?? {}, context.formData);

      // 检查联动字段是否全部为空
      const watchFields = config.watchFields as string[] | undefined;
      if (watchFields?.length) {
        const allEmpty = watchFields.every((f: string) => !context.formData[f]);
        if (allEmpty) return [];
      }

      const response = await httpRequest(config, resolvedParams, context);
      const list = extractByPath(response, config.dataPath || 'data');
      return mapItems(list, config);
    },
    pagedLoader: async (
      config: Record<string, any>,
      context: PagedDataSourceContext,
    ) => {
      // 未启用服务端分页：回退到 loader 全量加载 + 前端切片
      if (config.pagination !== true) {
        const all = await httpProvider.loader(config, context);
        const total = all.length;
        const start = (context.pageNum - 1) * context.pageSize;
        const list = all.slice(start, start + context.pageSize);
        return { list, total };
      }

      const { url } = config;
      if (!url) return { list: [], total: 0 };

      // 合并参数：基础参数 + 分页参数 + 搜索参数（非空）
      const baseParams = resolveFormDataParams(config.params ?? {}, context.formData);
      const pageNumKey = config.pageNumKey || 'pageNum';
      const pageSizeKey = config.pageSizeKey || 'pageSize';
      const mergedParams: Record<string, any> = {
        ...baseParams,
        [pageNumKey]: context.pageNum,
        [pageSizeKey]: context.pageSize,
      };
      if (context.searchParams) {
        for (const key in context.searchParams) {
          const v = context.searchParams[key];
          if (v != null && v !== '') {
            mergedParams[key] = v;
          }
        }
      }

      const response = await httpRequest(config, mergedParams, context);
      const list = extractByPath(response, config.listPath || 'data.list');
      const totalRaw = extractByPath(response, config.totalPath || 'data.total');
      const total = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw) || 0;

      return { list: mapItems(list, config), total };
    },
    detailLoader: async (
      config: Record<string, any>,
      context: DataSourceContext & { value: any | any[] },
    ) => {
      const detailUrl = config.detailUrl;
      if (!detailUrl) return [];

      const valueParamKey = config.valueParamKey || 'id';
      const isMulti = Array.isArray(context.value);

      // 构造请求参数
      const detailParams: Record<string, any> = {
        [valueParamKey]: context.value,
      };

      const response = await httpRequest(
        { ...config, url: detailUrl },
        detailParams,
        context,
      );
      const raw = extractByPath(response, config.detailDataPath || 'data');

      if (isMulti) {
        const arr = Array.isArray(raw) ? raw : [raw];
        return mapItems(arr, config);
      }
      const item = Array.isArray(raw) ? raw[0] : raw;
      const mapped = mapItems(item ? [item] : [], config);
      return mapped[0] ?? null;
    },
  };

  manager.register(httpProvider);

  builtinRegistered = true;
}

/**
 * 按点分路径从对象中取值
 * 例如 getByPath({ data: { list: [] } }, 'data.list') => []
 */
function extractByPath(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((o: any, k: string) => (o == null ? undefined : o[k]), obj);
}

/**
 * 将原始数据数组映射为 DataSourceOption[]
 * 复用 loader 中的映射逻辑，支持 children 递归
 */
function mapItems(items: any[], config: Record<string, any>): DataSourceOption[] {
  if (!Array.isArray(items)) return [];
  const lk = config.labelKey || 'label';
  const vk = config.valueKey || 'value';
  const ck = config.childrenKey || 'children';

  function walk(list: any[]): DataSourceOption[] {
    return list.map((item: any) => {
      // 保留原始数据全部字段，同时确保 label/value 映射正确
      const result: DataSourceOption = { ...item, label: item[lk], value: item[vk] };
      if (item[ck]) result.children = walk(item[ck]);
      return result;
    });
  }

  return walk(items);
}

/**
 * 统一的 HTTP 请求辅助函数
 * 优先使用注入的 $http（axios 实例），降级使用 fetch
 * @param config provider 配置（含 url、method、headers 等）
 * @param params 已解析的请求参数
 * @param context 数据源上下文（用于获取 global.$http、axiosConfig）
 */
async function httpRequest(
  config: Record<string, any>,
  params: Record<string, any>,
  context: DataSourceContext,
): Promise<any> {
  const { url, method } = config;
  const http = context.global?.$http;

  if (http?.get && http?.post) {
    return method === 'GET'
      ? await http.get(url, { params })
      : await http.post(url, params);
  }

  // 降级使用 fetch
  const defaultHeaders = context.global?.axiosConfig?.headers ?? {};
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...defaultHeaders,
    ...(config.headers ?? {}),
  };

  let fullUrl = url;
  const fetchOptions: RequestInit = { method, headers: mergedHeaders };

  if (method === 'GET') {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    if (query) fullUrl += (url.includes('?') ? '&' : '?') + query;
  } else {
    fetchOptions.body = JSON.stringify(params);
  }

  const res = await fetch(fullUrl, fetchOptions);
  return await res.json();
}