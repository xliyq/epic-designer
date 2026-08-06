import type { FieldStateMap } from '@ies/types';

import type { ComputedRef, InjectionKey, Ref, Slots } from 'vue';

import { computed, inject, provide, ref } from 'vue';

export interface BuilderContext {
  fieldStateMap: ComputedRef<FieldStateMap>;
  slots: Slots;
}

export const BUILDER_KEY: InjectionKey<BuilderContext> =
  Symbol('builderContext');

/**
 * 表单数据注入 key
 * EBuilder 在 setup 中 provide 表单数据，子组件通过 useFormData inject 获取
 * 用于远程选项加载等需要读取当前表单数据的场景
 */
export const FORM_DATA_KEY: InjectionKey<Ref<Record<string, any>>> =
  Symbol('epicFormData');

export function useBuilderContext() {
  const builderContext = inject<BuilderContext>(BUILDER_KEY, {
    fieldStateMap: computed(() => ({})),
    slots: {},
  });

  return builderContext;
}

/**
 * 获取 EBuilder 注入的表单数据
 * 在设计器中返回空对象（设计器无运行时表单数据）
 */
export function useFormData(): Ref<Record<string, any>> {
  return inject<Ref<Record<string, any>>>(
    FORM_DATA_KEY,
    ref({}) as Ref<Record<string, any>>,
  );
}

/**
 * EBuilder 中 provide 表单数据
 */
export function provideFormData(formData: Ref<Record<string, any>>) {
  provide(FORM_DATA_KEY, formData);
}
