<script lang="ts" setup>
/**
 * 模型画布（数据模型模式下使用）
 * 直接复用 epic-designer 的编辑容器
 */
import EditContainer from '@ies/core/src/components/designer/src/modules/editContainer/index.vue';

// EditContainer 通过 useDesignerContext() 获取 pageSchema
// MultiViewDesigner 已提供 DESIGNER_CONTEXT_KEY
</script>

<template>
  <EditContainer />
</template>
