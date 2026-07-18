<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { EpicIcon, EpicTree } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'
import type { ComponentSchema } from '@ies/types'
import { FIELD_POOL_DATA_KEY } from '../types'

const ctx = inject(FIELD_POOL_DATA_KEY)
if (!ctx) throw new Error('FieldPool 需要 MultiViewDesigner 提供上下文')

const { pageSchema } = useDesignerContext()

/**
 * 展示的字段列表：
 * - 模型模式：从 useDesignerContext 读取 EDesigner 实时画布数据
 * - 视图模式：从注入的数据模型快照读取
 */
const displayFields = computed(() => {
  if (ctx.mode === 'model') {
    return pageSchema.schemas[0]?.children ?? []
  }
  return ctx.modelFields
})

const selectedKeys = ref<string[]>([])

function handleNodeClick({ componentSchema }: { componentSchema: ComponentSchema }) {
  if (componentSchema.id) {
    selectedKeys.value = [componentSchema.id]
  }
}

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}

/** 判断是否为叶子节点（实际表单字段） */
function isLeafField(schema: ComponentSchema): boolean {
  return !schema.children || schema.children.length === 0 || schema.input === true
}

/** 递归统计叶子字段数量 */
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
</script>

<template>
  <div class="ep-field-pool">
    <div class="ep-field-pool-header">
      字段池
      <span class="ep-field-count">{{ leafCount }} 个字段</span>
    </div>
    <EpicTree
      :options="displayFields"
      :selected-keys="selectedKeys"
      @node-click="handleNodeClick"
    >
      <template #tree-node="{ schema }">
        <div class="ep-outline-item ep-text-padding flex items-center">
          <EpicIcon
            class="ep-component-icon"
            :name="getFieldIcon(schema.type)"
          />
          <span class="max-w-full truncate">
            {{ schema.label ?? pluginManager.component.getLabel(schema.type) }}
          </span>
          <span class="ep-node-type-text w-0 flex-1 truncate">
            {{ schema.id }}
          </span>
        </div>
      </template>
    </EpicTree>
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
</style>