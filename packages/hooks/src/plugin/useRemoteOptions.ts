import type { RemoteConfig } from '@ies/types';

import type { ComputedRef, Ref } from 'vue';

import { ref, watch } from 'vue';

import { pluginManager } from '@ies/manager';
import { getValueByPath } from '@ies/utils';

/**
 * 模板变量正则：匹配 ${formData.xxx} 或 ${formData.xxx.yyy}
 */
const FORM_DATA_PATTERN = /\$\{formData\.([^}]+)\}/g;

/**
 * 解析参数中的 ${formData.xxx} 模板引用，替换为表单实际值
 */
function resolveParamBindings(
  params: Record<string, any>,
  formData: Record<string, any>,
): Record<string, any> {
  if (!params) return {};
  const resolved: Record<string, any> = {};
  for (const key in params) {
    const val = params[key];
    if (typeof val === 'string') {
      resolved[key] = val.replace(
        FORM_DATA_PATTERN,
        (_, fieldPath: string) => {
          const value = getValueByPath(formData, fieldPath, '');
          return value ?? '';
        },
      );
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * 通用远程选项数据加载 composable
 *
 * 用于 select / checkbox / radio / cascader 等需要动态选项的组件。
 * 从组件 props.remoteConfig 读取配置，自动发起 HTTP 请求获取选项数据。
 *
 * @param remoteConfig 响应式的 RemoteConfig，通常来自 attrs.remoteConfig
 * @param formData  响应式的表单数据，用于参数模板替换和联动监听
 */
export function useRemoteOptions(
  remoteConfig: ComputedRef<RemoteConfig | undefined> | Ref<RemoteConfig | undefined>,
  formData: Ref<Record<string, any>>,
) {
  /** 远程加载的选项列表 */
  const options = ref<any[]>([]);
  /** 加载状态 */
  const loading = ref(false);

  /** 缓存：key = url + method + params 的 JSON */
  const cacheMap = new Map<string, any[]>();

  /**
   * 获取 HTTP 请求函数
   * 优先使用 pluginManager.global.$http（外部注入的 axios 实例），
   * 否则降级使用原生 fetch
   */
  function getHttp(): {
    get: (url: string, config?: any) => Promise<any>;
    post: (url: string, data?: any, config?: any) => Promise<any>;
  } | null {
    const http = (pluginManager.global as any)?.$http;
    if (http?.get && http?.post) return http;
    return null;
  }

  /**
   * 使用原生 fetch 发起请求
   */
  async function fetchWithNative(
    url: string,
    method: 'GET' | 'POST',
    params: Record<string, any>,
    headers: Record<string, string>,
  ): Promise<any> {
    const defaultHeaders = pluginManager.global.axiosConfig?.headers ?? {};
    const mergedHeaders = { ...defaultHeaders, ...headers };

    let fullUrl = url;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...mergedHeaders,
      },
    };

    if (method === 'GET') {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== null && v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)]),
      ).toString();
      if (query) fullUrl += (url.includes('?') ? '&' : '?') + query;
    } else {
      options.body = JSON.stringify(params);
    }

    const res = await fetch(fullUrl, options);
    return await res.json();
  }

  /**
   * 发起请求获取选项数据
   */
  async function fetchOptions(): Promise<void> {
    const config = remoteConfig.value;
    if (!config?.enabled || !config.url) return;

    // 解析参数中的 ${formData.xxx} 模板
    const resolvedParams = resolveParamBindings(
      config.params ?? {},
      formData.value,
    );

    // 如果有 watchFields 且所有联动字段值都为空，跳过请求
    if (config.watchFields?.length) {
      const allEmpty = config.watchFields.every(
        (f) => !formData.value[f],
      );
      if (allEmpty) {
        options.value = [];
        return;
      }
    }

    // 缓存检查
    const cacheKey = JSON.stringify({
      url: config.url,
      method: config.method,
      params: resolvedParams,
    });
    if (config.cache && cacheMap.has(cacheKey)) {
      options.value = cacheMap.get(cacheKey)!;
      return;
    }

    loading.value = true;
    try {
      const http = getHttp();
      let response: any;

      if (http) {
        // 使用注入的 axios 实例
        response =
          config.method === 'GET'
            ? await http.get(config.url, { params: resolvedParams })
            : await http.post(config.url, resolvedParams);
      } else {
        // 降级使用 fetch
        response = await fetchWithNative(
          config.url,
          config.method,
          resolvedParams,
          config.headers ?? {},
        );
      }

      // 按路径取数据
      const rawList = getValueByPath(response, config.dataPath || 'data', []);
      const arr = Array.isArray(rawList) ? rawList : [];

      // 映射为 { label, value, children? }
      const labelKey = config.labelKey || 'label';
      const valueKey = config.valueKey || 'value';
      const childrenKey = config.childrenKey || 'children';

      const mapped = arr.map((item: any) => {
        const result: Record<string, any> = {
          label: item[labelKey],
          value: item[valueKey],
        };
        // cascader 树形数据：递归处理子节点
        if (item[childrenKey]) {
          result[childrenKey] = mapTreeData(
            item[childrenKey],
            labelKey,
            valueKey,
            childrenKey,
          );
        }
        return result;
      });

      options.value = mapped;

      if (config.cache) cacheMap.set(cacheKey, mapped);
    } catch (e) {
      console.error('[useRemoteOptions] 选项数据加载失败:', e);
      pluginManager.global.$message?.error?.('选项数据加载失败');
      options.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * 递归映射树形数据（cascader）
   */
  function mapTreeData(
    list: any[],
    labelKey: string,
    valueKey: string,
    childrenKey: string,
  ): any[] {
    return list.map((item: any) => {
      const result: Record<string, any> = {
        label: item[labelKey],
        value: item[valueKey],
      };
      if (item[childrenKey]) {
        result[childrenKey] = mapTreeData(
          item[childrenKey],
          labelKey,
          valueKey,
          childrenKey,
        );
      }
      return result;
    });
  }

  // 监听 remoteConfig 变化：enabled + autoLoad 为 true 时自动发起首次请求
  watch(
    () => {
      const config = remoteConfig.value;
      if (!config?.enabled) return null;
      return {
        enabled: config.enabled,
        autoLoad: config.autoLoad,
        url: config.url,
        // 联动字段的当前值，变化时触发重新请求
        watchValues: config.watchFields?.length
          ? config.watchFields.map((f) => formData.value[f])
          : [],
      };
    },
    (newVal, oldVal) => {
      if (!newVal) return;

      // 首次触发（oldVal === null 表示从无到有，或初始化）
      if (oldVal === null || oldVal === undefined) {
        if (newVal.autoLoad) {
          fetchOptions();
        }
        return;
      }

      // 后续变化：联动字段值变化时重新请求
      if (
        newVal.watchValues.some(
          (v: any, i: number) => v !== oldVal?.watchValues?.[i],
        )
      ) {
        fetchOptions();
      }
    },
    { deep: true, immediate: true },
  );

  return {
    options,
    loading,
    fetchOptions,
  };
}
