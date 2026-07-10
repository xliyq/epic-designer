<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed } from 'vue';

defineOptions({
  name: 'EpSectionTemplate',
});

const props = withDefaults(
  defineProps<{
    componentSchema: ComponentSchema;
  }>(),
  {
    componentSchema: () => ({ type: '' }),
  },
);

const children = computed(() => props.componentSchema?.children ?? []);
const label = computed(
  () => props.componentSchema?.label ?? props.componentSchema?.optionKey ?? '',
);
</script>

<template>
  <div class="ep-section-template">
    <div v-if="label" class="ep-section-template__header">
      {{ label }}
    </div>
    <div class="ep-section-template__body">
      <slot name="edit-node">
        <slot
          v-for="item in children"
          name="node"
          :component-schema="item"
        ></slot>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-section-template {
  width: 100%;
  box-sizing: border-box;

  &__header {
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-fill-color-lighter, #fafafa);
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    border-radius: 0 0 4px 4px;
    min-height: 40px;
  }

  &:deep(.ep-section-template__body > .ep-draggable-range) {
    display: flex !important;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
}
</style>
