<script lang="ts" setup>
import type { DataSourceProvider, DataSourceSchema } from '@ies/types';

import { computed } from 'vue';

import { pluginManager } from '@ies/manager';
import { createDefaultDataSource } from '@ies/utils';

const props = withDefaults(
  defineProps<{
    modelValue?: DataSourceSchema;
    tree?: boolean;
  }>(),
  {
    tree: false,
  },
);

const emit = defineEmits(['update:modelValue']);

// 当前数据源配置
const dataSource = computed({
  get: () => {
    if (!props.modelValue) {
      const def = createDefaultDataSource();
      emit('update:modelValue', def);
      return def;
    }
    return props.modelValue;
  },
  set: (val) => emit('update:modelValue', val),
});

// 获取所有已注册的数据源提供者
const providers = computed<DataSourceProvider[]>(() => {
  return pluginManager.dataSource.getAll();
});

// 当前选中的提供者
const currentProvider = computed(() =>
  pluginManager.dataSource.get(dataSource.value.type),
);

// 切换数据源类型
function switchType(type: string) {
  const provider = pluginManager.dataSource.get(type);
  if (!provider) return;

  dataSource.value = {
    type,
    config: { ...provider.defaultConfig },
  };
}

// 获取编辑器组件
const editorComponent = computed(() => {
  const provider = currentProvider.value;
  if (!provider) return null;
  return pluginManager.component.get(provider.editor);
});

// 编辑器组件接收的 modelValue
const editorModelValue = computed(() => dataSource.value.config);
const editorProps = computed(() => {
  // 静态数据编辑器可能需要 tree 等额外属性
  const extra: Record<string, any> = {};
  if (props.tree) extra.tree = true;
  return extra;
});
function handleEditorUpdate(newConfig: any) {
  // 保留编辑器可能设置的额外字段
  dataSource.value = { ...dataSource.value, config: newConfig };
}
</script>

<template>
  <div class="ep-datasource-editor">
    <!-- 数据源类型切换 -->
    <div class="ep-datasource-editor__header">
      <label class="ep-datasource-editor__label">数据来源</label>
    </div>
    <div class="ep-datasource-editor__modes">
      <button
        v-for="provider in providers"
        :key="provider.id"
        class="ep-datasource-editor__mode-btn"
        :class="{ active: dataSource.type === provider.id }"
        @click="switchType(provider.id)"
      >
        {{ provider.label }}
      </button>
    </div>

    <!-- 编辑器 -->
    <div class="ep-datasource-editor__editor">
      <component
        :is="editorComponent"
        :model-value="editorModelValue"
        v-bind="editorProps"
        @update:model-value="handleEditorUpdate"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.ep-datasource-editor {
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__label {
    font-size: 12px;
    color: var(--ep-text-color, #606266);
    font-weight: 500;
  }

  &__modes {
    display: flex;
    gap: 4px;
    margin-bottom: 10px;
    border-radius: 6px;
    background: var(--ep-fill-color, #f5f7fa);
    padding: 3px;
  }

  &__mode-btn {
    flex: 1;
    min-width: 0;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    cursor: pointer;
    color: var(--ep-text-color-secondary, #909399);
    background: transparent;
    transition: all 0.2s ease;

    &:hover {
      color: var(--ep-text-color-primary, #303133);
    }

    &.active {
      color: #fff;
      background: var(--ep-color-primary, #409eff);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    }
  }

  &__editor {
    width: 100%;
  }
}
</style>