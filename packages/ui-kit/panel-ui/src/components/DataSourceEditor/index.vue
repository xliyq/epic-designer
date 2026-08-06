<script lang="ts" setup>
import type { DataSourceProvider, DataSourceSchema } from '@ies/types';

import { computed, watch } from 'vue';

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
  get: () => props.modelValue ?? createDefaultDataSource(),
  set: (val) => emit('update:modelValue', val),
});

// 当 modelValue 为 undefined 时初始化默认值（独立于 computed，避免副作用）
watch(() => props.modelValue, (val) => {
  if (!val) {
    emit('update:modelValue', createDefaultDataSource());
  }
}, { immediate: true });

// 数据源模式选项：静态模式始终内置，其他来自注册的 provider
const modeOptions = computed(() => {
  const list: { label: string; value: string }[] = [
    { label: '静态数据', value: 'static' },
  ];
  const providers = pluginManager.dataSource.getAll();
  providers.forEach((p) => {
    if (p.id !== 'static') {
      list.push({ label: p.label, value: p.id });
    }
  });
  return list;
});

// 当前选中的提供者（静态模式不需要注册）
const currentProvider = computed(() => {
  if (dataSource.value.type === 'static') {
    return {
      id: 'static',
      label: '静态数据',
      editor: 'EOptionsEditor',
      defaultConfig: { options: [] },
      loader: async (config: any) => config.options ?? [],
    } as DataSourceProvider;
  }
  return pluginManager.dataSource.get(dataSource.value.type);
});

// 切换数据源类型
function handleTypeChange(type: string) {
  if (type === dataSource.value.type) return;
  if (type === 'static') {
    dataSource.value = { type: 'static', config: { options: [] } };
    return;
  }
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

// 获取 select 组件（与属性面板其他下拉项一致）
const SelectComponent = pluginManager.component.get('select');

// 编辑器组件接收的 modelValue（按不同编辑器类型转换格式）
const editorModelValue = computed(() => {
  if (dataSource.value.type === 'static') {
    // 静态数据编辑器期望 modelValue 是数组，不是 { options: [...] }
    return dataSource.value.config.options ?? [];
  }
  // 自定义编辑器期望 modelValue 是配置对象
  return dataSource.value.config;
});
const editorProps = computed(() => {
  // 静态数据编辑器可能需要 tree 等额外属性
  const extra: Record<string, any> = {};
  if (props.tree) extra.tree = true;
  return extra;
});
function handleEditorUpdate(newValue: any) {
  if (dataSource.value.type === 'static') {
    // 静态数据编辑器返回的是数组，映射回 { options: [...] }
    dataSource.value = {
      type: 'static',
      config: { options: newValue },
    };
  } else {
    dataSource.value = { ...dataSource.value, config: newValue };
  }
}
</script>

<template>
  <div class="ep-datasource-editor">
    <!-- 第一行：label + 下拉选择器（左右结构，与属性面板风格一致） -->
    <div class="ep-datasource-editor__row">
      <label class="ep-datasource-editor__label">数据源</label>
      <div class="ep-datasource-editor__field">
        <component
          :is="SelectComponent"
          :modelValue="dataSource.type"
          :options="modeOptions"
          placeholder="请选择数据来源"
          @update:modelValue="handleTypeChange"
        />
      </div>
    </div>

    <!-- 第二行：编辑器面板（占满宽度） -->
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

  &__row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  // 与属性面板 ep-attr-label 对齐
  &__label {
    width: 80px;
    min-width: 80px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--ep-text-md, 13px);
    line-height: 32px;
  }

  &__field {
    flex: 1;
    min-width: 0;
  }

  &__editor {
    width: 100%;
  }
}
</style>
