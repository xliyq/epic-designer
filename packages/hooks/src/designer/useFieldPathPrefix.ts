import type { ComputedRef, InjectionKey } from 'vue';

import { computed, inject, provide } from 'vue';

/**
 * 字段路径前缀（响应式）。数组形式，例如 SubForm(field=a) 下嵌套 SubForm(field=b)
 * 得到 ['a', 'b']；子节点 field=x 时最终写入路径为 'a.b.x'。
 */
export const FIELD_PATH_PREFIX_KEY: InjectionKey<
  ComputedRef<(number | string)[] | null>
> = Symbol('fieldPathPrefix');

const EMPTY_PREFIX = computed<(number | string)[] | null>(() => null);

/**
 * 读取当前作用域的字段路径前缀（响应式）。
 * 无前缀时返回一个恒为 null 的 computed。
 */
export function useFieldPathPrefix(): ComputedRef<(number | string)[] | null> {
  return inject(FIELD_PATH_PREFIX_KEY, EMPTY_PREFIX);
}

/**
 * 向后代注入字段路径前缀。
 * 用于 SubForm 等需要把子节点 field 收敛到 parent.field 下的场景。
 * 传入返回 null 的 computed 可以显式清空前缀。
 */
export function provideFieldPathPrefix(
  prefix: ComputedRef<(number | string)[] | null>,
): void {
  provide(FIELD_PATH_PREFIX_KEY, prefix);
}
