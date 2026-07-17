<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, nextTick, ref, watchEffect } from 'vue';

import { EpicNode } from '@ies/base-ui';
import { useDesignerContext } from '@ies/hooks';
import { pluginManager } from '@ies/manager';
import { getValueByPath, setValueByPath } from '@ies/utils';

/**
 * 全局属性编辑器
 * 复用 EAttributeItem 的渲染逻辑，直接读写选中字段的全局属性
 */
const props = defineProps<{
  schema: ComponentSchema;
  selectedField: ComponentSchema;
}>();

const designer = useDesignerContext();

// 读值
const modelValue = ref();

watchEffect(() => {
  modelValue.value = getValueByPath(
    props.selectedField,
    props.schema.field!,
  );
});

// 是否显示
function isShow(item: ComponentSchema): boolean {
  if (typeof item.show === 'boolean') return item.show;
  if (typeof item.show === 'function') {
    return item.show?.({ values: props.selectedField });
  }
  return true;
}

// 写值
function handleSetValue(value: any) {
  const field = props.schema.field!;
  if (props.schema.changeSync) {
    setValueByPath(props.selectedField, field, value);
  } else {
    nextTick(() => {
      setValueByPath(props.selectedField, field, value);
    });
  }
  designer.revoke.push('全局属性编辑');
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
        },
        show: true,
        noFormItem: true,
      }"
      v-model="modelValue"
      @update:model-value="handleSetValue"
    />
  </div>
</template>
