<script setup lang="ts">
import { computed } from 'vue';
import { ElCascader } from 'element-plus';
import { useDataSource, useFormData } from '@ies/hooks';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    options?: any[];
    remoteConfig?: any;
    dataSource?: any;
  }>(),
  {
    placeholder: '请选择',
    options: () => [],
    remoteConfig: undefined,
    dataSource: undefined,
  },
);

const emit = defineEmits(['update:modelValue']);

// 向后兼容
const formData = useFormData();
const dataSource = computed(() => {
  if (props.dataSource) return props.dataSource;
  if (props.remoteConfig?.enabled) {
    return { type: 'http', config: props.remoteConfig };
  }
  return { type: 'static', config: { options: props.options ?? [] } };
});

const isRemote = computed(() => dataSource.value?.type !== 'static');
const { options: dsOptions, loading } = useDataSource(dataSource, formData);
const finalOptions = computed(() => dsOptions.value ?? []);

function handleUpdate(val: any) {
  emit('update:modelValue', val);
}
</script>

<template>
  <ElCascader
    :placeholder="props.placeholder"
    :options="finalOptions"
    :loading="loading"
    @update:model-value="handleUpdate"
  />
</template>
