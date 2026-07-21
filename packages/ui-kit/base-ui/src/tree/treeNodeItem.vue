<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, defineComponent, h, watch, ref } from 'vue';

import { EpicIcon } from '@ies/base-ui';
import { useDesignerContext } from '@ies/hooks';
import { pluginManager } from '@ies/manager';

import ETreeNodes from './treeNodes.vue';
import { useTreeContext } from './useTreeContext';

defineOptions({
  name: 'ETreeNodeItem',
});

const props = defineProps<{
  schema: ComponentSchema;
}>();

const treeContext = useTreeContext();
const { pageSchema } = useDesignerContext();

const expanded = computed(() => {
  return treeContext!.expandedKeys.value.includes(props.schema.id ?? '');
});

const TreeNodeText = defineComponent({
  setup() {
    return () =>
      h(
        'span',
        {
          class: {
            checked: treeContext!.selectedKeys.value.includes(props.schema.id!),
            hover: treeContext!.treeProps.hoverKey === props.schema.id,
            text: true,
          },
          onClick: () =>
            treeContext!.handleSelect(props.schema.id!, props.schema),
        },
        treeContext!.slots['tree-node']?.(props) ??
          h(
            'span',
            { class: 'ep-text-padding flex' },
            {
              default: () => [
                h(
                  'span',
                  { class: 'max-w-full truncate' },
                  props.schema.label ??
                    pluginManager.component.getConfigByType(props.schema.type)
                      ?.defaultSchema.label,
                ),
                h(
                  'span',
                  { class: 'ep-node-type-text flex-1 w-0 truncate' },
                  props.schema.id,
                ),
              ],
            },
          ),
      );
  },
});

function handleExpanded() {
  const id = props.schema.id;
  if (!id) {
    return false;
  }

  if (treeContext!.expandedKeys.value.includes(id)) {
    userCollapsed.value = true;
    treeContext!.expandedKeys.value = treeContext!.expandedKeys.value.filter(
      (item) => item !== id,
    );
  } else {
    userCollapsed.value = false;
    treeContext!.expandedKeys.value.push(id);
  }
}

const userCollapsed = ref(false);

// 响应式自动展开：当 children 数据到达时展开节点
watch(() => props.schema.children?.length, (hasChildren) => {
  if (hasChildren && props.schema.id && !userCollapsed.value) {
    if (!treeContext!.expandedKeys.value.includes(props.schema.id)) {
      treeContext!.expandedKeys.value.push(props.schema.id);
    }
  }
});
</script>
<template>
  <li
    class="ep-tree-node"
    :class="{
      expanded: props.schema.children?.length,
      'is-locked': pluginManager.component.getLocked(props.schema.type),
      'level-1': props.schema.id === pageSchema.schemas[0]?.id,
    }"
  >
    <a>
      <span
        v-if="
          props.schema.children?.length &&
          props.schema.id !== pageSchema.schemas[0]?.id
        "
        class="icon-expanded"
        :class="{ expanded }"
        @click="handleExpanded"
      >
        <EpicIcon name="icon--epic--caret-right-outlined" />
      </span>
      <TreeNodeText />
    </a>
    <ETreeNodes
      v-if="props.schema.children?.length"
      v-model:schemas="props.schema.children"
      class="ep-tree-sublist"
      :class="{ expanded }"
      :parent-schema="props.schema"
    />
  </li>
</template>
