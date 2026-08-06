import type { ComponentConfigModel } from '@ies/types';

export default {
  component: async () => await import('./index.vue'),
  config: {},
  defaultSchema: {
    input: true,
    label: '数据字段',
    type: 'EpField',
  },
} as ComponentConfigModel;
