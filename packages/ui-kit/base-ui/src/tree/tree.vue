<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import type { TreeProps } from './types';

import { computed, provide, ref, useSlots, watch } from 'vue';

import { EpicIcon } from '@ies/base-ui';
import { pluginManager } from '@ies/manager';

import ETreeNodes from './treeNodes.vue';
import { TREE_CONTEXT_KEY } from './useTreeContext';

defineOptions({
  name: 'ETree',
});

const props = withDefaults(defineProps<TreeProps>(), {
  draggable: false,
  hoverKey: '',
  options: () => [],
  selectedKeys: () => [],
});

const emits = defineEmits(['update:selectedKeys', 'nodeClick']);
const slots = useSlots();

const Input = pluginManager.component.get('input');

const keyword = ref('');
const expandedKeys = ref([]);
const selectedKeysComputed = computed({
  get() {
    return props.selectedKeys;
  },
  set(value) {
    emits('update:selectedKeys', value);
  },
});

const getTreeData = computed({
  get() {
    return filterTreeByLabel(props.options, keyword.value);
  },
  set() {
    // console.log(e);
  },
});

// 数据到达后自动展开第一个（根）节点
watch(getTreeData, (val) => {
  if (val.length > 0 && val[0]?.id) {
    if (!expandedKeys.value.includes(val[0].id)) {
      expandedKeys.value.push(val[0].id);
    }
  }
}, { immediate: true });

/**
 * 通过label 过滤节点
 * @param tree 节点树
 * @param labelToFilter 过滤关键字
 */
function filterTreeByLabel(tree, labelToFilter) {
  // 无搜索关键字时直接返回原数组，保持引用不变，Vue 可追踪 children 变化
  if (!labelToFilter) return tree;

  const filteredTree: ComponentSchema[] = [];

  tree.forEach((item: ComponentSchema) => {
    if (item.label?.includes(labelToFilter)) {
      filteredTree.push(item);
    } else if (item.children) {
      const filteredChildren = filterTreeByLabel(item.children, labelToFilter);
      if (filteredChildren.length > 0) {
        // Clone the item and replace its children
        const clonedItem = { ...item };
        clonedItem.children = filteredChildren;
        filteredTree.push(clonedItem);
      }
    }
  });

  return filteredTree;
}

function handleSelect(id: string, componentSchema: ComponentSchema) {
  selectedKeysComputed.value = [id];
  emits('nodeClick', { componentSchema, id });
}

provide(TREE_CONTEXT_KEY, {
  expandedKeys,
  handleSelect,
  selectedKeys: selectedKeysComputed,
  slots,
  treeProps: props,
});
</script>
<template>
  <div class="ep-tree flex h-full flex-col">
    <!-- 搜素框 start -->
    <div class="ep-search-box px-10px py-6px">
      <Input
        v-model="keyword"
        v-model:value="keyword"
        placeholder="搜索节点"
        clearable
        allow-clear
      >
        <template #prefix>
          <EpicIcon name="icon--epic--search-rounded" />
        </template>
      </Input>
    </div>
    <!-- 搜素框 end -->
    <div class="ep-tree-main h-0 flex-1 overflow-auto">
      <ETreeNodes v-model:schemas="getTreeData" />
      <div
        v-show="getTreeData.length === 0"
        class="pt-42px text-center text-gray-400"
      >
        没有查询到的数据
      </div>
    </div>
  </div>
</template>
