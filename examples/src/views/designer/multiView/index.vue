<script lang="ts" setup>
import type { MultiViewPageSchema } from '@ies/custom/multi-view';

import { ref } from 'vue';

import { setupElementPlus } from '@ies/element-plus';
import { MultiViewDesigner, createDemoSchema } from '@ies/custom/multi-view';

// 初始化 Element Plus
setupElementPlus();

const designerRef = ref<InstanceType<typeof MultiViewDesigner>>();

// 预置演示数据
const demoSchema = createDemoSchema();

/**
 * 保存回调
 */
function handleSubmit(schema: MultiViewPageSchema) {
  console.log('保存的 Schema:', JSON.stringify(schema, null, 2));
}

/**
 * 获取数据
 */
function handleGetData() {
  const data = designerRef.value?.getData();
  console.log('当前数据:', data);
}
</script>

<template>
  <div class="h-full">
    <MultiViewDesigner
      ref="designerRef"
      :default-schema="demoSchema"
      title="请假申请 - 多视图设计器"
      form-mode
      @save="handleSubmit"
    />
  </div>
</template>

<style scoped>
.h-full {
  height: 100vh;
}
</style>
