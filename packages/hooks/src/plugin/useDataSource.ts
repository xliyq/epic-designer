import type {
  DataSourceSchema,
  DataSourceOption,
  DataSourceContext,
} from '@ies/types';

import type { ComputedRef, Ref } from 'vue';

import { ref, watch } from 'vue';

import { pluginManager } from '@ies/manager';

import {
  useDataSourceManager,
  registerBuiltinProviders,
} from './useDataSourceManager';

// 确保内置 provider 已注册（懒初始化）
const manager = useDataSourceManager();
let initDone = false;
function ensureBuiltin() {
  if (!initDone) {
    registerBuiltinProviders(manager);
    initDone = true;
  }
}

/**
 * 通用数据源加载 composable
 *
 * 统一 select/checkbox/radio/cascader 的选项加载。
 * 根据 schema.props.dataSource.type 查找对应 provider，
 * 委托给 provider.loader 执行数据加载。
 *
 * @param dataSourceRef dataSource schema（响应式），通常来自 computed(() => props.dataSource)
 * @param formData 表单数据
 */
export function useDataSource(
  dataSourceRef: ComputedRef<DataSourceSchema | undefined> | Ref<DataSourceSchema | undefined>,
  formData: Ref<Record<string, any>>,
) {
  ensureBuiltin();

  const options = ref<DataSourceOption[]>([]);
  const loading = ref(false);

  // 缓存 key = dataSource.type + JSON.stringify(config)
  const cacheKey = ref('');

  async function loadData(): Promise<void> {
    const ds = dataSourceRef.value;
    if (!ds) {
      options.value = [];
      return;
    }

    const provider = manager.get(ds.type);
    if (!provider) {
      console.warn(`[useDataSource] 未找到数据源提供者 "${ds.type}"`);
      options.value = [];
      return;
    }

    // static 类型直接同步返回，不需要 loading/缓存
    if (ds.type === 'static') {
      const ctx: DataSourceContext = { formData: formData.value };
      options.value = await provider.loader(ds.config, ctx);
      return;
    }

    // 缓存检查
    const newCacheKey = `${ds.type}_${JSON.stringify(ds.config)}`;
    if (provider.id === 'http') {
      // http 类型的缓存只检查 url + method + params
      const { url, method, params } = ds.config;
      const httpCacheKey = `${url}_${method}_${JSON.stringify(params)}`;
      cacheKey.value = httpCacheKey;
    }

    loading.value = true;
    try {
      const ctx: DataSourceContext = {
        formData: formData.value,
        global: pluginManager.global,
      };
      options.value = await provider.loader(ds.config, ctx);
    } catch (e) {
      console.error(`[useDataSource] 数据源加载失败 (${ds.type}):`, e);
      pluginManager.global.$message?.error?.('数据加载失败');
      options.value = [];
    } finally {
      loading.value = false;
    }
  }

  // 监听 dataSource 变化和联动字段变化，自动加载
  watch(
    () => {
      const ds = dataSourceRef.value;
      if (!ds) return null;

      const provider = manager.get(ds.type);
      const watchFields = provider?.watchFields?.(ds.config) ?? [];

      // 返回当前配置 + 联动字段当前值
      return {
        type: ds.type,
        config: ds.config,
        watchValues: watchFields.map((f: string) => formData.value[f]),
        allEmpty: watchFields.length > 0 && watchFields.every((f: string) => !formData.value[f]),
      };
    },
    (newVal, oldVal) => {
      if (!newVal) {
        options.value = [];
        return;
      }

      // static 类型不需要自动加载
      if (newVal.type === 'static') {
        loadData();
        return;
      }

      // 首次触发或配置变化时加载
      if (oldVal === null || oldVal === undefined) {
        // 联动字段全部为空时不加载
        if (newVal.allEmpty) {
          options.value = [];
          return;
        }
        loadData();
        return;
      }

      // 类型或配置变化时重新加载
      if (newVal.type !== oldVal.type) {
        loadData();
        return;
      }

      // 联动字段值变化时重新加载
      if (
        newVal.watchValues.some(
          (v: any, i: number) => v !== oldVal?.watchValues?.[i],
        )
      ) {
        loadData();
      }
    },
    { deep: true, immediate: true },
  );

  return {
    options,
    loading,
    reload: loadData,
  };
}