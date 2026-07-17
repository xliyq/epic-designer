<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';

import { ElOption, ElSelect } from 'element-plus';
import { useDataSource, useFormData } from '@ies/hooks';

import 'element-plus/es/components/select/style/css';

defineOptions({ name: 'EpSelect', inheritAttrs: false });

const props = defineProps<{
  dataSource?: Record<string, any> | null;
  options?: any[] | null;
}>();

const emits = defineEmits(['update:modelValue']);

const attrs = useAttrs();

// 本地同步缓存 modelValue，handleUpdate 时立即写入，解决 attrs 异步更新导致 getSelected 拿到旧值
const modelValueRef = ref(attrs.modelValue);
watch(() => attrs.modelValue, (val) => { modelValueRef.value = val; });

function handleUpdate(e: any = null): void {
  modelValueRef.value = e;
  emits('update:modelValue', e);
}

const formData = useFormData();

const dsSchema = computed(() => {
  if (props.dataSource) return props.dataSource;
  return { type: 'static', config: { options: props.options ?? [] } };
});

const isRemote = computed(() => dsSchema.value?.type !== 'static');
const { options: dsOptions, loading, getOptions, getSelected } = useDataSource(dsSchema, formData, modelValueRef);
const finalOptions = computed(() => dsOptions.value ?? []);

// 剥离 options/dataSource，避免透传给 ElSelect
const selectAttrs = computed(() => {
  const { options: _o, dataSource: _d, modelValue: _m, ...restAttrs } = attrs;
  return {
    ...restAttrs,
    persistent: attrs.persistent ?? true,
    ...(isRemote.value ? { loading: loading.value } : {}),
  };
});

defineExpose({ getOptions, getSelected });
</script>

<template>
  <ElSelect
    v-bind="selectAttrs"
    :key="String(attrs.multiple)"
    :placeholder="(attrs.placeholder as string) || '请选择'"
    :modelValue="modelValueRef"
    @update:modelValue="handleUpdate"
  >
    <ElOption
      v-for="option in finalOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </ElSelect>
</template>
