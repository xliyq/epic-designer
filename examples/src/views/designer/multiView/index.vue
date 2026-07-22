<script lang="ts" setup>
import { ref } from 'vue'
import { EMultiViewDesigner, createDemoDataModel, createDemoViewTypes } from '@ies/custom/multi-view'
import ViewCreateDialog from './ViewCreateDialog.vue'

const designerRef = ref<InstanceType<typeof EMultiViewDesigner>>()
const viewCreateRef = ref<InstanceType<typeof ViewCreateDialog> | null>(null)

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

function handleAddView() {
  viewCreateRef.value?.open()
}

function handleCreateViewConfirm(data: { name: string; code: string }) {
  designerRef.value?.addViewType(data.name, data.code)
}
</script>

<template>
  <div class="h-full">
    <EEMultiViewDesigner
      ref="designerRef"
      :data-model="demoSchema"
      :view-types="demoViewTypes"
      title="多视图设计器"
      @save="handleSave"
      @add-view="handleAddView"
    />
    <ViewCreateDialog
      ref="viewCreateRef"
      @confirm="handleCreateViewConfirm"
    />
  </div>
</template>

<style scoped>
.h-full { height: 100vh; }
</style>