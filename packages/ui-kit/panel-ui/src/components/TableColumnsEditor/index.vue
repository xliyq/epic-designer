<script lang="ts" setup>
import type { PropType } from 'vue';

import { VueDraggable } from 'vue-draggable-plus';

import { EpicIcon } from '@ies/base-ui';
import { pluginManager } from '@ies/manager';
import { getUUID } from '@ies/utils';
import { useVModel } from '@vueuse/core';

/** 表格列配置 */
interface TableColumnConfig {
  /** 对齐方式 */
  align: 'center' | 'left' | 'right';
  /** 记录唯一标识，用于拖拽排序 key */
  id?: string;
  /** 列标题 */
  label: string;
  /** 字段名（对应数据中的 key） */
  prop: string;
  /** 列宽（如 "100px" 或 ""） */
  width: string;
}

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array as PropType<TableColumnConfig[]>,
  },
});
const emit = defineEmits(['update:modelValue']);

const Input = pluginManager.component.get('input');
const Select = pluginManager.component.get('select');

/** 对齐方式选项 */
const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
];

const innerValue = useVModel(props, 'modelValue', emit);

/**
 * 新增表格列
 */
function handleAdd() {
  const column: TableColumnConfig = {
    align: 'left',
    id: getUUID(),
    label: '',
    prop: '',
    width: '',
  };
  innerValue.value = [...innerValue.value, column];
}

/**
 * 删除表格列
 * @param index 需要删除的列索引
 */
function handleDelete(index: number) {
  innerValue.value = innerValue.value.filter((_item, i) => i !== index);
}
</script>

<template>
  <div class="ep-table-columns-editor">
    <div v-show="!innerValue?.length" class="ep-table-columns-editor-empty">
      暂无配置
    </div>
    <VueDraggable
      v-model="innerValue"
      item-key="id"
      :component-data="{
        type: 'transition-group',
      }"
      group="table-columns"
      handle=".handle"
      :animation="200"
    >
      <div
        v-for="(item, index) in innerValue"
        :key="item.id"
        class="ep-table-columns-editor-item"
      >
        <!-- 第一行：拖拽手柄 + 字段名 + 列标题 + 删除按钮 -->
        <div class="ep-table-columns-editor-row">
          <EpicIcon class="handle cursor-move" name="icon--epic--drag" />
          <Input
            v-model="item.prop"
            v-model:value="item.prop"
            placeholder="字段名"
            class="flex-1"
          />
          <Input
            v-model="item.label"
            v-model:value="item.label"
            placeholder="列标题"
            class="flex-1"
          />
          <EpicIcon
            class="hover:text-red cursor-pointer"
            name="icon--epic--delete-outline-rounded"
            @click="handleDelete(index)"
          />
        </div>
        <!-- 第二行：列宽 + 对齐方式 -->
        <div class="ep-table-columns-editor-row">
          <span class="ep-table-columns-editor-spacer"></span>
          <Input
            v-model="item.width"
            v-model:value="item.width"
            placeholder="列宽（如 100px）"
            class="flex-1"
          />
          <Select
            v-model="item.align"
            v-model:value="item.align"
            :options="alignOptions"
            class="ep-table-columns-editor-align"
          />
        </div>
      </div>
    </VueDraggable>
    <div class="ep-button ghost primary" @click="handleAdd">添加列</div>
  </div>
</template>

<style scoped lang="less">
.ep-table-columns-editor {
  background-color: var(--ep-secondary);
  padding: 8px;
  border-radius: var(--ep-radius);
}

.ep-table-columns-editor-empty {
  margin: 8px 0;
  padding: 16px 0;
  text-align: center;
  color: var(--ep-text-helper, #999);
  font-size: 13px;
}

.ep-table-columns-editor-item {
  background-color: var(--ep-secondary);
  padding: 8px;
  border-radius: var(--ep-radius);
  border: 1px solid var(--ep-border);
  margin-bottom: 8px;
}

.ep-table-columns-editor-row {
  display: flex;
  align-items: center;
  gap: 6px;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
}

// 与拖拽手柄等宽的占位，保持第二行缩进对齐
.ep-table-columns-editor-spacer {
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
}

.ep-table-columns-editor-align {
  width: 90px;
  flex-shrink: 0;
}
</style>
