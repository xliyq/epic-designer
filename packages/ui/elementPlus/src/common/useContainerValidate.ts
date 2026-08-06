/**
 * 容器组件通用校验 composable
 * 用于 attribute-group、section-group 等自带数据管理、不接入 ElForm 自动校验的容器
 */
import type { ComponentSchema } from '@ies/designer';

import { ref } from 'vue';

/**
 * 判断值是否为空
 */
function isEmptyValue(value: any, type?: string): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (type === 'array') return !Array.isArray(value) || value.length === 0;
  return false;
}

/**
 * 判断单个规则是否匹配指定 trigger
 */
function matchTrigger(rule: Record<string, any>, trigger?: string): boolean {
  if (!trigger) return true; // 不指定 trigger 时校验所有规则
  const ruleTrigger = rule.trigger;
  if (!ruleTrigger) return true; // 规则未指定 trigger 时，任何 trigger 都匹配
  if (Array.isArray(ruleTrigger)) return ruleTrigger.includes(trigger);
  return ruleTrigger === trigger;
}

/**
 * 执行单条规则校验，返回错误消息（通过为 null）
 */
async function validateRule(
  rule: Record<string, any>,
  value: any,
  getValidator?: (name: string) => Function | undefined,
): Promise<string | null> {
  // required
  if (rule.required) {
    const type = rule.type;
    if (isEmptyValue(value, type)) {
      return rule.message || '必填项';
    }
  }

  // 空值且非 required 时，跳过后续校验（非 required 的空值视为合法）
  if (isEmptyValue(value)) {
    return null;
  }

  // pattern
  if (rule.pattern) {
    try {
      const pattern = new RegExp(rule.pattern);
      if (!pattern.test(String(value))) {
        return rule.message || '格式不正确';
      }
    } catch {
      // 正则无效时跳过
    }
  }

  // 自定义 validator
  if (rule.validator && getValidator) {
    const validatorFn = getValidator(rule.validator);
    if (typeof validatorFn === 'function') {
      try {
        await new Promise<void>((resolve, reject) => {
          validatorFn(
            (error?: Error) => {
              if (error) reject(error);
              else resolve();
            },
            value,
            [rule],
          );
        });
      } catch (err: any) {
        return err?.message || rule.message || '校验失败';
      }
    }
  }

  return null;
}

export interface ContainerValidateOptions {
  /** 获取自定义校验函数 */
  getValidator?: (name: string) => Function | undefined;
}

export function useContainerValidate(options: ContainerValidateOptions = {}) {
  const { getValidator } = options;

  /** 每个子组件的错误消息，key 为子组件 id */
  const childErrors = ref<Record<string, string>>({});

  /**
   * 校验单个子组件
   * @param child 子组件 schema
   * @param value 当前值
   * @param trigger 触发时机（'change' | 'blur'，不指定则校验所有规则）
   * @returns 错误消息（通过时返回 null）
   */
  async function validateField(
    child: ComponentSchema,
    value: any,
    trigger?: string,
  ): Promise<string | null> {
    const rules = (child.rules as Record<string, any>[]) || [];
    if (!rules.length) return null;

    for (const rule of rules) {
      if (!matchTrigger(rule, trigger)) continue;
      const error = await validateRule(rule, value, getValidator);
      if (error) {
        if (child.id) {
          childErrors.value[child.id] = error;
        }
        return error;
      }
    }

    // 所有规则通过，清除该字段错误
    if (child.id) {
      delete childErrors.value[child.id];
    }
    return null;
  }

  /**
   * 校验所有子组件
   * @param children 子组件列表
   * @param getValue 获取子组件当前值的函数
   * @param isHidden 判断子组件是否隐藏（隐藏则跳过校验）
   * @returns 所有错误信息数组（全部通过时返回空数组）
   */
  async function validateAll(
    children: ComponentSchema[],
    getValue: (child: ComponentSchema) => any,
    isHidden?: (child: ComponentSchema) => boolean,
  ): Promise<{ id: string; message: string; label?: string }[]> {
    const errors: { id: string; message: string; label?: string }[] = [];

    for (const child of children) {
      if (isHidden && isHidden(child)) continue;
      // 没有 id 或没有 rules 的跳过
      if (!child.id || !child.rules?.length) continue;

      const value = getValue(child);
      const error = await validateField(child, value);
      if (error) {
        errors.push({
          id: child.id!,
          message: error,
          label: child.label,
        });
      }
    }

    return errors;
  }

  /**
   * 清除校验状态
   * @param ids 指定要清除的子组件 id，不传则清除所有
   */
  function clearValidate(ids?: string[]) {
    if (!ids || ids.length === 0) {
      childErrors.value = {};
      return;
    }
    for (const id of ids) {
      delete childErrors.value[id];
    }
  }

  /**
   * 设置单个字段的错误（用于外部注入错误）
   */
  function setFieldError(id: string, message: string) {
    childErrors.value[id] = message;
  }

  return {
    childErrors,
    validateField,
    validateAll,
    clearValidate,
    setFieldError,
  };
}
