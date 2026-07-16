import type { DataSourceSchema } from '@ies/types';

/**
 * 创建默认的 DataSourceSchema
 */
export function createDefaultDataSource(): DataSourceSchema {
  return {
    type: 'static',
    config: {
      options: [],
    },
  };
}