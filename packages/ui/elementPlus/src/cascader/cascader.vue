<script setup lang="ts">
import { computed } from 'vue';
import { ElCascader } from 'element-plus';
import { useFormData, useRemoteOptions } from '@ies/hooks';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    options?: any[];
    remoteConfig?: any;
  }>(),
  {
    placeholder: '请选择',
    options: () => [],
    remoteConfig: undefined,
  },
);

const emit = defineEmits(['update:modelValue']);

// 远程选项
const formData = useFormData();
const isRemote = computed(() => props.remoteConfig?.enabled);
const { options: remoteOptions, loading } = useRemoteOptions(
  computed(() => props.remoteConfig),
  formData,
);

// 合并选项
const finalOptions = computed(() =>
  isRemote.value ? remoteOptions.value : props.options ?? [],
);

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
