<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { computed, inject, ref } from 'vue'
import { useDesignerContext } from '@ies/hooks'
import { FIELD_POOL_DATA_KEY } from '../types'
import FieldPoolNode from './FieldPoolNode.vue'

const ctx = inject(FIELD_POOL_DATA_KEY)
if (!ctx) throw new Error('FieldPool 需要 MultiViewDesigner 提供上下文')

const { pageSchema } = useDesignerContext()

const displayFields = computed(() => {
  if (ctx.mode === 'model') {
    return pageSchema.schemas[0]?.children ?? []
  }
  return ctx.modelFields
})

function isLeafField(schema: ComponentSchema): boolean {
  return !schema.children || schema.children.length === 0 || schema.input === true
}

function countLeafFields(schemas: ComponentSchema[]): number {
  let count = 0
  for (const s of schemas) {
    if (isLeafField(s)) {
      count++
    } else if (s.children) {
      count += countLeafFields(s.children)
    }
  }
  return count
}

const leafCount = computed(() => countLeafFields(displayFields.value))

const selectedFieldId = ref<string>('')

function selectField(schema: ComponentSchema) {
  if (schema.id) selectedFieldId.value = schema.id
}
</script>

<template>
  <div class="ep-field-pool">
    <div class="ep-field-pool-header">
      字段池
      <span class="ep-field-count">{{ leafCount }} 个字段</span>
    </div>
    <div class="ep-field-pool-body">
      <FieldPoolNode
        :schemas="displayFields"
        :selected-field-id="selectedFieldId"
        @select="selectField"
      />
    </div>
    <div
      v-if="displayFields.length === 0"
      class="pt-42px text-center text-gray-400"
    >
      暂无字段
    </div>
  </div>
</template>

<style scoped>
.ep-field-pool {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.ep-field-pool-header {
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--ep-border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  flex-shrink: 0;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
}
.ep-field-pool-body {
  flex: 1;
  overflow: auto;
  padding: 4px 0;
}
</style>