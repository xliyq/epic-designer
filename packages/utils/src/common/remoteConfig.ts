import type { RemoteConfig } from '@ies/types';

/**
 * 创建默认的 RemoteConfig
 */
export function createDefaultRemoteConfig(): RemoteConfig {
  return {
    enabled: false,
    url: '',
    method: 'GET',
    params: {},
    dataPath: 'data',
    labelKey: 'label',
    valueKey: 'value',
    childrenKey: 'children',
    cache: true,
    autoLoad: true,
    watchFields: [],
  };
}
