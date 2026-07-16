import type { Global, InitialGlobal } from '@ies/types';

import { reactive } from 'vue';

// 重新导出，保持向后兼容
export type { Global, HttpClient, AxiosConfig, MessageApi } from '@ies/types';

export type { InitialGlobal } from '@ies/types';

// 创建默认全局对象的函数，避免在模块加载时立即执行
function createDefaultGlobal(initialGlobal?: InitialGlobal): Global {
  // 默认提示函数
  const defaultMessage = (text: string) => {
    console.warn(`[Epic]全局提示函数未注册 提示信息：'${text}'`);
  };
  return {
    $message: {
      error: defaultMessage,
      info: defaultMessage,
      success: defaultMessage,
      warning: defaultMessage,
    },
    ...initialGlobal,
  };
}

export function useGlobal(initialGlobal?: InitialGlobal) {
  // 如果没有提供初始值，则使用默认全局对象
  const finalInitialGlobal = createDefaultGlobal(initialGlobal);
  // 全局状态对象
  const global = reactive<Global>(finalInitialGlobal);

  return {
    global,
  };
}
