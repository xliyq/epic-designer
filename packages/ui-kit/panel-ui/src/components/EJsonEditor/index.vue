<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const defaultPlaceholder = '{"key":"value"}';
const text = ref(props.modelValue ?? '');
const isError = ref(false);
const errorMsg = ref('');

watch(
  () => props.modelValue,
  (val) => {
    if (val !== text.value) {
      text.value = val ?? '';
      validate();
    }
  },
);

function validate() {
  if (!text.value.trim()) {
    isError.value = false;
    errorMsg.value = '';
    return true;
  }
  try {
    const parsed = JSON.parse(text.value);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      isError.value = true;
      errorMsg.value = '请输入 JSON 对象';
      return false;
    }
    isError.value = false;
    errorMsg.value = '';
    return true;
  } catch (e) {
    isError.value = true;
    errorMsg.value = 'JSON 格式错误';
    return false;
  }
}

function handleInput() {
  validate();
  emit('update:modelValue', text.value);
}

function handleBlur() {
  // 失焦时格式化有效 JSON
  if (!text.value.trim()) return;
  try {
    const parsed = JSON.parse(text.value);
    text.value = JSON.stringify(parsed, null, 2);
    isError.value = false;
    errorMsg.value = '';
    emit('update:modelValue', text.value);
  } catch {
    // 格式错误时不格式化，保持原样
  }
}
</script>

<template>
  <div class="ep-json-editor">
    <textarea
      v-model="text"
      class="ep-json-editor__textarea"
      :class="{ 'ep-json-editor__textarea--error': isError }"
      :placeholder="placeholder || defaultPlaceholder"
      rows="4"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div v-if="isError" class="ep-json-editor__error">
      {{ errorMsg }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-json-editor {
  width: 100%;

  &__textarea {
    width: 100%;
    min-height: 80px;
    padding: 8px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-bg-color, #fff);
    resize: vertical;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--el-color-primary, #409eff);
    }

    &--error {
      border-color: var(--el-color-danger, #f56c6c);
    }
  }

  &__error {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-color-danger, #f56c6c);
  }
}
</style>
