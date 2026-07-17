<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, nextTick, ref, watchEffect } from 'vue';

import { EpicNode } from '@ies/base-ui';
import { pluginManager } from '@ies/manager';
import { getValueByPath } from '@ies/utils';

import type { FieldOverride } from '../types';
import { getOverrideValue } from '../composables/useViewSchema';

/**
 * 覆盖属性编辑器
 * 读取覆盖值（或继承的全局值），写入覆盖配置
 */
const props = defineProps<{
  schema: ComponentSchema;
  selectedField: ComponentSchema;
  override: FieldOverride | undefined;
  isOverridden: boolean;
}>();

const emit = defineEmits<{
  change: [value: any];
}>();

// 编辑器的值：有覆盖时显示覆盖值，否则显示全局值（灰色预览）
const modelValue = ref();

watchEffect(() => {
  if (props.isOverridden) {
    // 显示覆盖值
    const state = getOverrideValue(props.override, props.schema.field!);
    modelValue.value = state.value;
  } else {
    // 显示全局值（只读预览）
    modelValue.value = getValueByPath(
      props.selectedField,
      props.schema.field!,
    );
  }
});

// 是否显示
function isShow(item: ComponentSchema): boolean {
  if (typeof item.show === 'boolean') return item.show;
  if (typeof item.show === 'function') {
    // 在覆盖模式下，show 函数需要能读到当前值
    // 合并全局值和覆盖值作为 values
    const mergedValues = { ...props.selectedField };
    if (props.override?.props) {
      mergedValues.props = { ...mergedValues.props, ...props.override.props };
    }
    return item.show?.({ values: mergedValues });
  }
  return true;
}

// 写值
function handleSetValue(value: any) {
  emit('change', value);
}
</script>

<template>
  <div v-if="isShow(schema)">
    <EpicNode
      is-property
      :component-schema="{
        ...schema,
        props: {
          ...schema.props,
          input: false,
          field: undefined,
          hidden: false,
          placeholder: schema.props?.placeholder,
          disabled: !isOverridden,
        },
        show: true,
        noFormItem: true,
      }"
      v-model="modelValue"
      @update:model-value="handleSetValue"
    />
  </div>
</template>
