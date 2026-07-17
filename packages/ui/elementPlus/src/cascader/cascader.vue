<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
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
const attrs = useAttrs();

// 本地同步缓存 modelValue，避免 attrs 异步更新导致 getSelected 拿到旧值
const modelValueRef = ref(attrs.modelValue);
watch(() => attrs.modelValue, (val) => { modelValueRef.value = val; });

const formData = useFormData();
const dataSource = computed(() => {
  if (props.dataSource) return props.dataSource;
  return { type: 'static', config: { options: props.options ?? [] } };
});

const isRemote = computed(() => dataSource.value?.type !== 'static');
const { options: dsOptions, loading, getOptions } = useDataSource(dataSource, formData);
const finalOptions = computed(() => dsOptions.value ?? []);

function handleUpdate(val: any) {
  modelValueRef.value = val;
  emit('update:modelValue', val);
}

// 按路径逐级查找，返回整条路径的节点数组
function findNodesByPath(options: any[], path: any[]): any[] {
  const result: any[] = [];
  let currentLevel = options;
  for (const key of path) {
    const found = currentLevel?.find((opt: any) => opt.value === key);
    if (!found) return [];
    result.push(found);
    currentLevel = found.children;
  }
  return result;
}

// 全树搜索叶子节点（emitPath: false 场景）
function findLeafNode(options: any[], target: any): any | null {
  for (const opt of options ?? []) {
    if (opt.value === target) return opt;
    if (opt.children?.length) {
      const found = findLeafNode(opt.children, target);
      if (found) return found;
    }
  }
  return null;
}

function getSelected(): any {
  const val = modelValueRef.value;
  if (val == null) return null;

  const opts = finalOptions.value;

  // 多选模式：val 是路径数组的数组
  if (Array.isArray(val) && Array.isArray(val[0])) {
    return val
      .map((path: any[]) => findNodesByPath(opts, path))
      .filter((nodes: any[]) => nodes.length > 0);
  }

  // 单选 + emitPath: true：val 是路径数组
  if (Array.isArray(val)) {
    const nodes = findNodesByPath(opts, val);
    return nodes.length > 0 ? nodes : null;
  }

  // 单选 + emitPath: false：val 是叶子值
  return findLeafNode(opts, val);
}

defineExpose({ getOptions, getSelected });
</script>

<template>
  <ElCascader
    :placeholder="props.placeholder"
    :options="finalOptions"
    :loading="loading"
    @update:model-value="handleUpdate"
  />
</template>
