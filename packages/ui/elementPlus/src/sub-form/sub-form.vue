<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed, ref } from 'vue';

import {
  provideFieldPathPrefix,
  useFieldPathPrefix,
} from '@ies/designer';

defineOptions({
  name: 'EpSubForm',
});

const props = withDefaults(
  defineProps<{
    componentSchema: ComponentSchema;
  }>(),
  {
    componentSchema: () => ({ type: '' }),
  },
);

const parentPrefix = useFieldPathPrefix();

// 组合出向后代注入的字段前缀（响应式，跟随 componentSchema.field 变化）
const currentPrefix = computed<(number | string)[] | null>(() => {
  const field = props.componentSchema?.field;
  const base = parentPrefix.value ? [...parentPrefix.value] : [];
  if (field) base.push(field);
  return base.length > 0 ? base : null;
});

provideFieldPathPrefix(currentPrefix);

const children = computed(() => props.componentSchema?.children ?? []);

// 视觉容器属性
const title = computed(
  () => props.componentSchema?.props?.title ?? props.componentSchema?.label ?? '',
);
const bordered = computed(() => props.componentSchema?.props?.bordered !== false);
const collapsible = computed(() => !!props.componentSchema?.props?.collapsible);
const collapseIconPosition = computed<'left' | 'right'>(
  () => props.componentSchema?.props?.collapseIconPosition ?? 'right',
);
const defaultCollapsed = computed(
  () => !!props.componentSchema?.props?.defaultCollapsed,
);
const collapsed = ref(defaultCollapsed.value);

// 标签位置 / 宽度：仅覆盖本 SubForm 内的 form-item 样式；不设置时沿用父级
const labelPosition = computed<'' | 'left' | 'right' | 'top'>(
  () => props.componentSchema?.props?.labelPosition ?? '',
);
const labelWidth = computed<string>(() => {
  const w = props.componentSchema?.props?.labelWidth;
  if (w === undefined || w === null || w === '') return '';
  return typeof w === 'number' ? `${w}px` : String(w);
});
const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  if (labelWidth.value) style['--sub-form-label-width'] = labelWidth.value;
  return style;
});

function toggleCollapsed() {
  if (collapsible.value) collapsed.value = !collapsed.value;
}

// 网格布局
const gridStyle = computed(() => {
  const p = props.componentSchema?.props;
  if (p?.gridEnable) {
    const cols = p.gridCols ?? 2;
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '16px',
    } as Record<string, string>;
  }
  return {} as Record<string, string>;
});
</script>

<template>
  <div
    class="ep-sub-form"
    :class="{
      'ep-sub-form--bordered': bordered,
      'ep-sub-form--collapsed': collapsed,
    }"
    :data-label-position="labelPosition || undefined"
    :data-has-label-width="labelWidth ? '' : undefined"
    :style="rootStyle"
  >
    <div
      v-if="title || collapsible"
      class="ep-sub-form__header"
      :class="{ 'ep-sub-form__header--clickable': collapsible }"
      @click="toggleCollapsed"
    >
      <span
        v-if="collapsible && collapseIconPosition === 'left'"
        class="ep-sub-form__arrow ep-sub-form__arrow--left"
      >{{ collapsed ? '▶' : '▼' }}</span>
      <span class="ep-sub-form__title">{{ title }}</span>
      <span
        v-if="collapsible && collapseIconPosition === 'right'"
        class="ep-sub-form__arrow ep-sub-form__arrow--right"
      >{{ collapsed ? '▶' : '▼' }}</span>
    </div>
    <div v-show="!collapsed" class="ep-sub-form__body" :style="gridStyle">
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
.ep-sub-form {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;

  &--bordered {
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    border-radius: 4px;
    background: var(--el-bg-color, #fff);
  }

  &__header {
    padding: 8px 12px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-fill-color-lighter, #fafafa);
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
    display: flex;
    align-items: center;
    gap: 6px;
    user-select: none;

    &--clickable {
      cursor: pointer;
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 10px;
    color: var(--el-text-color-secondary, #909399);
    flex-shrink: 0;

    &--right {
      margin-left: auto;
    }
  }

  &__body {
    padding: 12px;
    min-height: 40px;
  }

  &:deep(.ep-sub-form__body > .ep-draggable-range) {
    display: contents !important;
  }

  /*
   * labelPosition 覆盖：作用于本 SubForm 内所有 .el-form-item。
   * 内层 SubForm 若未设置 data-label-position，则天然继承外层样式；
   * 内层 SubForm 若设置了新的 data-label-position，会重新命中自己的规则并覆盖。
   */
  &[data-label-position='left'] :deep(.el-form-item) {
    .el-form-item__label {
      text-align: left;
      justify-content: flex-start;
    }
  }

  &[data-label-position='right'] :deep(.el-form-item) {
    .el-form-item__label {
      text-align: right;
      justify-content: flex-end;
    }
  }

  /*
   * 只有在 SubForm 显式配置了 labelWidth 时，才覆盖 label 宽度；
   * 否则让父 ElForm 下发的 labelWidth 继续生效（即"继承父表单"）。
   */
  &[data-has-label-width] :deep(.el-form-item__label) {
    width: var(--sub-form-label-width) !important;
    flex: 0 0 auto;
  }

  &[data-label-position='top'] :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .el-form-item__label {
      width: auto;
      text-align: left;
      justify-content: flex-start;
      margin-bottom: 4px;
      padding: 0;
      line-height: 1.4;
      flex: 0 0 auto;
    }

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
