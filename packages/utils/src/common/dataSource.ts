import type { DataSourceSchema } from '@ies/types';

/**
 * 创建默认的 DataSourceSchema
 */
export function createDefaultDataSource(): DataSourceSchema {
  return {
    type: 'static',
    config: {
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ],
    },
  };
}