<script setup lang="ts">
import { computed } from 'vue';
import { ElCascader } from 'element-plus';
import { useDataSource, useFormData } from '@ies/hooks';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    options?: any[];
    dataSource?: any;
  }>(),
  {
    placeholder: '请选择',
    options: () => [],
    dataSource: undefined,
  },
);

const emit = defineEmits(['update:modelValue']);

const formData = useFormData();
const dataSource = computed(() => {
  if (props.dataSource) return props.dataSource;
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
