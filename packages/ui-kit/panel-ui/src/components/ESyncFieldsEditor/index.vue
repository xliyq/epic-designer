<script lang="ts" setup>
import { computed } from 'vue';

import { useVModel } from '@vueuse/core';

interface SyncFieldEntry {
  field: string;
  source: string;
  enabled: boolean;
}

const props = defineProps<{
  modelValue?: SyncFieldEntry[];
  entries?: SyncFieldEntry[];
}>();

const emit = defineEmits(['update:modelValue']);

const innerValue = useVModel(props, 'modelValue', emit, {
  defaultValue: [],
  passive: true,
});

// entries 是组件配置提供的默认映射声明，modelValue 是用户已保存的配置
// 合并：以 entries 为基础，用 modelValue 覆盖 field 和 enabled
const mergedEntries = computed<SyncFieldEntry[]>(() => {
  const defaults = props.entries ?? [];
  const saved = innerValue.value ?? [];
  return defaults.map((entry) => {
    const userConfig = saved.find((s) => s.field === entry.field || s.source === entry.source);
    if (userConfig) {
      return {
        field: userConfig.field || entry.field,
        source: entry.source,
        enabled: userConfig.enabled,
      };
    }
    return { ...entry };
  });
});

function toggleEnabled(index: number) {
  const entries = [...mergedEntries.value];
  entries[index] = { ...entries[index], enabled: !entries[index].enabled };
  innerValue.value = entries;
}

function updateField(index: number, newField: string) {
  const entries = [...mergedEntries.value];
  entries[index] = { ...entries[index], field: newField };
  innerValue.value = entries;
}
</script>

<template>
  <div class="ep-sync-fields-editor">
    <div
      v-for="(entry, index) in mergedEntries"
      :key="index"
      class="ep-sync-fields-editor__row"
    >
      <input
        type="checkbox"
        :checked="entry.enabled"
        class="ep-sync-fields-editor__checkbox"
        @change="toggleEnabled(index)"
      />
      <input
        type="text"
        :value="entry.field"
        class="ep-sync-fields-editor__input"
        :placeholder="entry.field"
        @input="updateField(index, ($event.target as HTMLInputElement).value)"
      />
      <span class="ep-sync-fields-editor__source">{{ entry.source }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-sync-fields-editor {
  width: 100%;

  &__row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  &__checkbox {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    border-radius: 4px;
    font-size: 13px;
    color: var(--el-text-color-primary, #303133);

    &:focus {
      outline: none;
      border-color: var(--el-color-primary, #409eff);
    }
  }

  &__source {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary, #909399);
    white-space: nowrap;
  }
}
</style>
