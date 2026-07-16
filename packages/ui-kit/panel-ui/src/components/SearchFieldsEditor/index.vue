<script lang="ts" setup>
import type { PropType } from 'vue';

import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { EpicIcon } from '@ies/base-ui';
import { pluginManager } from '@ies/manager';
import { getUUID } from '@ies/utils';
import { useVModel } from '@vueuse/core';

/** 搜索字段下拉选项 */
interface SearchFieldOption {
  label: string;
  value: any;
}

/** 搜索字段配置 */
interface SearchFieldConfig {
  /** 查询参数名 */
  field: string;
  /** 记录唯一标识，用于拖拽排序 key */
  id?: string;
  /** 搜索表单标签 */
  label: string;
  /** select 类型时的选项 */
  options?: SearchFieldOption[];
  /** 占位文本 */
  placeholder: string;
  /** 控件类型 */
  type: 'date-picker' | 'input' | 'select';
}

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array as PropType<SearchFieldConfig[]>,
  },
});
const emit = defineEmits(['update:modelValue']);

const Input = pluginManager.component.get('input');
const Select = pluginManager.component.get('select');

/** 控件类型选项 */
const typeOptions = [
  { label: '输入框', value: 'input' },
  { label: '下拉框', value: 'select' },
  { label: '日期选择器', value: 'date-picker' },
];

const innerValue = useVModel(props, 'modelValue', emit);

/** 当前展开选项配置的字段索引 */
const expandedOptionIndex = ref<null | number>(null);

/**
 * 新增搜索字段
 */
function handleAdd() {
  const field: SearchFieldConfig = {
    field: '',
    id: getUUID(),
    label: '',
    options: [],
    placeholder: '',
    type: 'input',
  };
  innerValue.value = [...innerValue.value, field];
}

/**
 * 删除搜索字段
 * @param index 需要删除的字段索引
 */
function handleDelete(index: number) {
  innerValue.value = innerValue.value.filter((_item, i) => i !== index);
  // 若删除的是当前展开项，则重置展开状态
  if (expandedOptionIndex.value === index) {
    expandedOptionIndex.value = null;
  }
}

/**
 * 切换选项配置面板的展开/收起
 * @param index 字段索引
 */
function toggleOptions(index: number) {
  // 确保数组存在
  if (!innerValue.value[index].options) {
    innerValue.value[index].options = [];
  }
  expandedOptionIndex.value =
    expandedOptionIndex.value === index ? null : index;
}

/**
 * 新增选项
 * @param index 字段索引
 */
function handleAddOption(index: number) {
  const options = innerValue.value[index].options ?? [];
  innerValue.value[index].options = [...options, { label: '', value: '' }];
}

/**
 * 删除选项
 * @param fieldIndex 字段索引
 * @param optionIndex 选项索引
 */
function handleDeleteOption(fieldIndex: number, optionIndex: number) {
  const options = innerValue.value[fieldIndex].options ?? [];
  innerValue.value[fieldIndex].options = options.filter(
    (_item, i) => i !== optionIndex,
  );
}
</script>

<template>
  <div class="ep-search-fields-editor">
    <div v-show="!innerValue?.length" class="ep-search-fields-editor-empty">
      暂无配置
    </div>
    <VueDraggable
      v-model="innerValue"
      item-key="id"
      :component-data="{
        type: 'transition-group',
      }"
      group="search-fields"
      handle=".handle"
      :animation="200"
    >
      <div
        v-for="(item, index) in innerValue"
        :key="item.id"
        class="ep-search-fields-editor-item"
      >
        <!-- 第一行：拖拽手柄 + 参数名 + 标签 + 删除按钮 -->
        <div class="ep-search-fields-editor-row">
          <EpicIcon class="handle cursor-move" name="icon--epic--drag" />
          <Input
            v-model="item.field"
            v-model:value="item.field"
            placeholder="参数名"
            class="flex-1"
          />
          <Input
            v-model="item.label"
            v-model:value="item.label"
            placeholder="标签"
            class="flex-1"
          />
          <EpicIcon
            class="hover:text-red cursor-pointer"
            name="icon--epic--delete-outline-rounded"
            @click="handleDelete(index)"
          />
        </div>
        <!-- 第二行：控件类型 + 占位文本 + （select 时）配置选项按钮 -->
        <div class="ep-search-fields-editor-row">
          <span class="ep-search-fields-editor-spacer"></span>
          <Select
            v-model="item.type"
            v-model:value="item.type"
            :options="typeOptions"
            class="ep-search-fields-editor-type"
          />
          <Input
            v-model="item.placeholder"
            v-model:value="item.placeholder"
            placeholder="占位文本"
            class="flex-1"
          />
          <div
            v-if="item.type === 'select'"
            class="ep-button ghost primary ep-search-fields-editor-options-btn"
            @click="toggleOptions(index)"
          >
            {{ expandedOptionIndex === index ? '收起选项' : '配置选项' }}
          </div>
        </div>
        <!-- 选项配置面板（仅 select 类型展开时显示） -->
        <div
          v-if="item.type === 'select' && expandedOptionIndex === index"
          class="ep-search-fields-editor-options"
        >
          <div
            v-for="(option, optIdx) in item.options"
            :key="optIdx"
            class="ep-search-fields-editor-row"
          >
            <span class="ep-search-fields-editor-spacer"></span>
            <Input
              v-model="option.label"
              v-model:value="option.label"
              placeholder="选项标签"
              class="flex-1"
            />
            <Input
              v-model="option.value"
              v-model:value="option.value"
              placeholder="选项值"
              class="flex-1"
            />
            <EpicIcon
              class="hover:text-red cursor-pointer"
              name="icon--epic--delete-outline-rounded"
              @click="handleDeleteOption(index, optIdx)"
            />
          </div>
          <div
            class="ep-button ghost primary ep-search-fields-editor-add-option"
            @click="handleAddOption(index)"
          >
            添加选项
          </div>
        </div>
      </div>
    </VueDraggable>
    <div class="ep-button ghost primary" @click="handleAdd">添加搜索字段</div>
  </div>
</template>

<style scoped lang="less">
.ep-search-fields-editor {
  background-color: var(--ep-secondary);
  padding: 8px;
  border-radius: var(--ep-radius);
}

.ep-search-fields-editor-empty {
  margin: 8px 0;
  padding: 16px 0;
  text-align: center;
  color: var(--ep-text-helper, #999);
  font-size: 13px;
}

.ep-search-fields-editor-item {
  background-color: var(--ep-secondary);
  padding: 8px;
  border-radius: var(--ep-radius);
  border: 1px solid var(--ep-border);
  margin-bottom: 8px;
}

.ep-search-fields-editor-row {
  display: flex;
  align-items: center;
  gap: 6px;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
}

// 与拖拽手柄等宽的占位，保持后续行缩进对齐
.ep-search-fields-editor-spacer {
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
}

.ep-search-fields-editor-type {
  width: 110px;
  flex-shrink: 0;
}

.ep-search-fields-editor-options-btn {
  white-space: nowrap;
  flex-shrink: 0;
}

.ep-search-fields-editor-options {
  margin-top: 6px;
  padding: 8px;
  background-color: var(--ep-primary, #fff);
  border-radius: var(--ep-radius);
  border: 1px dashed var(--ep-border);
}

.ep-search-fields-editor-add-option {
  margin-top: 6px;
}
</style>
