<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: any;
    placeholder?: string;
    defaultValue?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '-',
    defaultValue: '',
  },
);

// 值为空时显示占位符或默认值
function displayText(): string {
  const val = props.modelValue ?? props.defaultValue;
  if (val === null || val === undefined || val === '') {
    return props.placeholder;
  }
  // 数组/对象转为 JSON 字符串
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}
</script>

<template>
  <div class="ep-text-view">
    <span class="ep-text-view__content">{{ displayText() }}</span>
  </div>
</template>

<style lang="less" scoped>
.ep-text-view {
  width: 100%;
  height: var(--el-component-size, 32px);
  align-self: flex-start;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &__content {
    display: block;
    width: 100%;
    font-size: 14px;
    line-height: 1.4;
    color: var(--el-text-color-primary, #303133);
    word-break: break-all;
  }

  /* 空值时占位符样式 */
  &__content:empty::before {
    content: '-';
    color: var(--el-text-color-placeholder, #a8abb2);
  }
}
</style>
