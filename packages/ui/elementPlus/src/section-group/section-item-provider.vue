<script lang="ts" setup>
import { computed, provide } from 'vue';
import { SECTION_PARENT_ITEM_KEY } from '@ies/designer';

const props = defineProps<{
  item: Record<string, any> | null;
}>();

// 提供当前 item 给子组件，使用 computed 确保 inner section-group 的 watch
// 可以通过 deep 追踪到 item 内部的属性变化
const parentItem = computed(() => props.item);
provide(SECTION_PARENT_ITEM_KEY, parentItem);
</script>

<template>
  <slot />
</template>