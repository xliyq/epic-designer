<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, reactive, watch } from 'vue';

import { EpicNode } from '@ies/base-ui';

const props = defineProps<{
  actionArgsConfigs: ComponentSchema[];
  modelValue: null | string | undefined;
}>();
const emits = defineEmits(['update:modelValue']);

const valueRef = computed<any[]>(() => {
  if (props.modelValue) {
    return JSON.parse(props.modelValue);
  }
  return [];
});

// 记录每个 input 类型字段是否处于表达式模式
const exprModes = reactive<Record<string, boolean>>({});

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      const arr = JSON.parse(props.modelValue);
      props.actionArgsConfigs.forEach((item) => {
        const val = arr[item.field!];
        exprModes[item.field!] =
          val && typeof val === 'object' && val.__isExpression__;
      });
    }
  },
  { immediate: true },
);

function isShow(item: ComponentSchema) {
  if (typeof item.show === 'boolean') {
    return item.show;
  }
  if (typeof item.show === 'function') {
    const plainValues = valueRef.value.map((v) =>
      v && typeof v === 'object' && v.__isExpression__ ? '' : v,
    );
    return item.show?.({ values: plainValues });
  }
  return true;
}

function isInputType(item: ComponentSchema) {
  return item.type === 'input';
}

function getPlainValue(field: string): any {
  const val = valueRef.value[field];
  if (val && typeof val === 'object' && val.__isExpression__) return '';
  return val;
}

function getExprContent(field: string): string {
  const val = valueRef.value[field];
  return val && typeof val === 'object' && val.__isExpression__
    ? val.content
    : '';
}

function toggleExpr(field: string) {
  const values = [...JSON.parse(props.modelValue ?? '[]')];
  const current = values[field];
  const isExpr = current && typeof current === 'object' && current.__isExpression__;

  if (isExpr) {
    values[field] = '';
    exprModes[field] = false;
  } else {
    values[field] = { __isExpression__: true, content: current ?? '' };
    exprModes[field] = true;
  }
  emits('update:modelValue', JSON.stringify(values));
}

function handleSetValue(value: any, field: string) {
  const values = [...JSON.parse(props.modelValue ?? '[]')];
  values[field] = value;
  emits('update:modelValue', JSON.stringify(values));
}

function handleExprInput(content: string, field: string) {
  const values = [...JSON.parse(props.modelValue ?? '[]')];
  values[field] = { __isExpression__: true, content };
  emits('update:modelValue', JSON.stringify(values));
}
</script>
<template>
  <div class="ep-attribute-view">
    <div v-for="item in props.actionArgsConfigs" :key="item.id">
      <div v-show="isShow(item)" class="ep-attr-item" :class="item.layout">
        <div class="ep-attr-label" :title="item.label">
          {{ item.label }}
        </div>
        <div class="ep-attr-input">
          <template v-if="isInputType(item) && exprModes[item.field!]">
            <div class="ep-expr-wrap">
              <textarea
                class="ep-expression-textarea"
                :value="getExprContent(item.field!)"
                @input="handleExprInput(($event.target as HTMLTextAreaElement).value, item.field!)"
                placeholder="输入表达式，如: $formData.field1"
                rows="3"
              />
              <div class="ep-expr-hint">
                取值：<code>$formData.字段名</code> 取表单字段值，
                <code>$event.0</code> 取事件参数。
                函数：<code>IF(条件, 真, 假)</code>、<code>SUM(a, b)</code>、<code>AVERAGE(a, b)</code> 等。
              </div>
            </div>
            <span
              class="ep-expr-toggle active"
              @click="toggleExpr(item.field!)"
            >
              fx
            </span>
          </template>
          <template v-else>
            <EpicNode
              is-property
              :component-schema="{
                ...item,
                props: {
                  ...item.props,
                  input: false,
                  field: undefined,
                  hidden: false,
                },
                show: true,
                noFormItem: true,
              }"
              :model-value="getPlainValue(item.field!)"
              @update:model-value="handleSetValue($event, item.field!)"
            />
            <span
              v-if="isInputType(item)"
              class="ep-expr-toggle"
              @click="toggleExpr(item.field!)"
            >
              fx
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.ep-expr-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 18px;
  margin-left: 4px;
  font-size: 11px;
  font-weight: 600;
  font-family: monospace;
  color: var(--ep-text-helper, #999);
  background: var(--ep-muted, #f5f5f5);
  border: 1px solid var(--ep-border, #ddd);
  border-radius: 3px;
  cursor: pointer;
  vertical-align: middle;
  transition: all 0.2s;

  &:hover {
    color: var(--ep-primary, #1890ff);
    border-color: var(--ep-primary, #1890ff);
  }

  &.active {
    color: #fff;
    background: var(--ep-primary, #1890ff);
    border-color: var(--ep-primary, #1890ff);
  }
}

.ep-expr-wrap {
  flex: 1;
  min-width: 0;
}

.ep-expr-hint {
  margin-top: 4px;
  font-size: 11px;
  color: var(--ep-text-helper, #999);
  line-height: 1.5;

  code {
    padding: 1px 4px;
    font-size: 10px;
    font-family: monospace;
    background: var(--ep-muted, #f5f5f5);
    border-radius: 2px;
  }
}

.ep-expression-textarea {
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  font-family: monospace;
  color: var(--ep-text-main);
  background: var(--ep-background, #fff);
  border: 1px solid var(--ep-primary, #1890ff);
  border-radius: 4px;
  outline: none;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    box-shadow: 0 0 0 2px var(--ep-primary-faded, rgba(24, 144, 255, 0.15));
  }
}
</style>
