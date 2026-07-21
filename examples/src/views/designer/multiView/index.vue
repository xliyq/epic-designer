<script lang="ts" setup>
import { ref } from 'vue'
import { MultiViewDesigner, createDemoDataModel, createDemoViewTypes } from '@ies/custom/multi-view'

const designerRef = ref<InstanceType<typeof MultiViewDesigner>>()

const demoSchema = createDemoDataModel()
const demoViewTypes = createDemoViewTypes()

function handleSave() {
  const model = designerRef.value?.getDataModel()
  const views = designerRef.value?.getViews()
  const types = designerRef.value?.getViewTypes()
  console.log('数据模型:', model)
  console.log('视图列表:', types)
  console.log('视图数据:', views)
}
</script>

<template>
  <div class="h-full">
    <MultiViewDesigner
      ref="designerRef"
      :data-model="demoSchema"
      :view-types="demoViewTypes"
      title="多视图设计器"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.h-full { height: 100vh; }
</style>