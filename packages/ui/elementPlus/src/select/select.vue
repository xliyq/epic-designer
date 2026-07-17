<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';

import { ElOption, ElSelect } from 'element-plus';

import 'element-plus/es/components/select/style/css';

defineOptions({ name: 'EpSelect', inheritAttrs: false });

const props = defineProps<{
  dataSource?: Record<string, any> | null;
  options?: any[] | null;
}>();

const emits = defineEmits(['update:modelValue']);

const attrs = useAttrs();

// 本地同步缓存 modelValue
const modelValueRef = ref(attrs.modelValue);
watch(() => attrs.modelValue, (val) => { modelValueRef.value = val; });

function handleUpdate(e: any = null): void {
  modelValueRef.value = e;
  emits('update:modelValue', e);
}

// 选项数据：优先 props.options，其次 dataSource.config.options
const finalOptions = computed(() => {
  if (props.options) return props.options;
  if (props.dataSource?.config?.options) return props.dataSource.config.options;
  return [];
});

// 默认启用 persistent，避免 ElSelect 在 watch getter 中调用 slots.default() 触发 Vue 警告
const selectAttrs = computed(() => ({
  ...attrs,
  persistent: attrs.persistent ?? true,
}));

function getOptions() {
  return finalOptions.value ?? [];
}

function getSelected() {
  const val = modelValueRef.value;
  if (val == null) return null;
  const opts = finalOptions.value;
  if (Array.isArray(val)) {
    return opts.filter((opt: any) => val.includes(opt.value));
  }
  return opts.find((opt: any) => opt.value === val) ?? null;
}

defineExpose({ getOptions, getSelected });
</script>

<template>
  <ElSelect
    v-bind="selectAttrs"
    :key="String(attrs.multiple)"
    :placeholder="(attrs.placeholder as string) || '请选择'"
    :model-value="modelValueRef"
    @update:model-value="handleUpdate"
  >
    <ElOption
      v-for="option in finalOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </ElSelect>
</template>
