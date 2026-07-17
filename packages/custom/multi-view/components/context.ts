import type { InjectionKey } from 'vue';

import { inject } from 'vue';

import type { MultiViewContext } from '../types';

/**
 * 多视图设计器上下文的注入键
 */
export const MULTI_VIEW_CONTEXT_KEY: InjectionKey<MultiViewContext> =
  Symbol('multiViewContext');

/**
 * 在多视图设计器子组件中获取上下文
 */
export function useMultiViewContext(): MultiViewContext {
  const ctx = inject<MultiViewContext>(MULTI_VIEW_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('useMultiViewContext 必须在 MultiViewDesigner 组件内使用');
  }
  return ctx;
}
