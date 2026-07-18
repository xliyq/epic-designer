<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { computed, ref } from 'vue'
import { EpicIcon, EpicTree } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'

const ctx = pluginManager.global.__multi_view_pool
if (!ctx) throw new Error('FieldPool 需要 MultiViewDesigner 提供上下文（pluginManager.global.__multi_view_pool）')

const { pageSchema } = useDesignerContext()

const displayFields = computed(() => {
  if (ctx.mode === 'model') {
    return [...(pageSchema.schemas[0]?.children ?? [])]
  }
  return [...ctx.modelFields]
})

const selectedKeys = ref<string[]>([])
const collapsed = ref(false)

function handleNodeClick({ componentSchema }: { componentSchema: ComponentSchema }) {
  if (!componentSchema.id) return
  selectedKeys.value = [componentSchema.id]

  if (ctx.mode === 'view' && !viewFieldIdSet.value.has(componentSchema.id)) {
    ctx.addFieldToView(componentSchema.id)
  }
}

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}

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

const totalLeafCount = computed(() => countLeafFields(displayFields.value))
const viewFieldIdSet = computed(() => new Set(ctx.viewFieldIds))
const inViewCount = computed(() => ctx.viewFieldIds.length)
</script>

<template>
  <div class="ep-field-pool">
    <div
      class="ep-field-pool-header"
      @click="collapsed = !collapsed"
    >
      <span class="ep-collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
      字段池
      <span class="ep-field-count">{{ inViewCount }}/{{ totalLeafCount }} 个</span>
    </div>
    <div v-show="!collapsed" class="ep-field-pool-body">
      <EpicTree
        :options="displayFields"
        :selected-keys="selectedKeys"
        @node-click="handleNodeClick"
      >
        <template #tree-node="{ schema }">
          <div
            class="ep-outline-item ep-text-padding flex items-center"
            :class="{
              'is-disabled': ctx.mode === 'view' && schema.id ? viewFieldIdSet.has(schema.id) : false,
            }"
          >
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
            <span
              v-if="ctx.mode === 'view' && schema.id && viewFieldIdSet.has(schema.id)"
              class="ep-field-check"
            >
              ✓
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
  gap: 6px;
  font-size: 13px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}
.ep-field-pool-header:hover {
  background: var(--ep-muted);
}
.ep-collapse-icon {
  font-size: 10px;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
  margin-left: auto;
}
.ep-field-pool-body {
  flex: 1;
  overflow: auto;
}
.ep-field-pool :deep(.ep-outline-item.is-disabled) {
  opacity: 0.5;
  cursor: default;
}
.ep-field-check {
  font-size: 12px;
  color: var(--ep-primary);
  flex-shrink: 0;
  margin-left: 4px;
}
</style>