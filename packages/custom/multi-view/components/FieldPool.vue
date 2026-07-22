<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { computed, ref } from 'vue'
import { EpicIcon, EpicTree, EpTooltip } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'

const ctx = pluginManager.global.__multi_view_pool
if (!ctx) throw new Error('FieldPool 需要 EMultiViewDesigner 提供上下文（pluginManager.global.__multi_view_pool）')

const { pageSchema } = useDesignerContext()

const displayFields = computed(() => {
  if (ctx.mode === 'model') {
    return [...(pageSchema.schemas[0]?.children ?? [])]
  }
  return [...ctx.modelFields]
})

const selectedKeys = ref<string[]>([])
const folded = ref(false)

// 当前视图的字段 ID（直接从画布 pageSchema 读取，保证与画布增删操作同步）
const canvasChildren = computed(() => pageSchema.schemas[0]?.children ?? [])
const viewFieldIdSet = computed(() => {
  if (ctx.mode !== 'view') return new Set<string>()
  return new Set(canvasChildren.value.map(f => f.id).filter(Boolean) as string[])
})
const inViewCount = computed(() => viewFieldIdSet.value.size)

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
</script>

<template>
  <div class="ep-field-pool-section">
    <!-- 48px 图标栏 -->
    <div class="ep-field-bar">
      <EpTooltip placement="right" content="字段池">
        <div
          class="ep-field-bar-item"
          :class="{ checked: !folded }"
          @click="folded = !folded"
        >
          <EpicIcon name="icon--epic--list" />
        </div>
      </EpTooltip>
    </div>

    <!-- 280px 内容区 -->
    <div v-show="!folded" class="ep-field-sidebar">
      <div class="ep-field-sidebar-container">
        <div class="ep-field-header">
          <span>字段池</span>
          <span class="ep-field-count">{{ inViewCount }}/{{ totalLeafCount }} 个</span>
        </div>
        <div class="ep-field-body">
          <EpicTree
            v-if="displayFields.length > 0"
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
    </div>
  </div>
</template>

<style scoped>
.ep-field-pool-section {
  display: flex;
  flex-direction: row;
  border-top: 1px solid var(--ep-border);
  flex-shrink: 0;
}
.ep-field-bar {
  width: 48px;
  background-color: var(--ep-designer-background);
  border-left: 1px solid var(--ep-border);
  border-right: 1px solid var(--ep-border);
  padding: 8px 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ep-field-bar-item {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ep-radius);
  cursor: pointer;
  color: var(--ep-text-main);
  transition: all 0.3s;
  font-size: 16px;
}
.ep-field-bar-item::before {
  content: '';
  height: 80%;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--ep-primary);
  border-radius: var(--ep-radius);
  opacity: 0;
  transition: all 0.3s;
}
.ep-field-bar-item:hover {
  background: var(--ep-muted);
}
.ep-field-bar-item.checked {
  color: var(--ep-primary-foreground);
}
.ep-field-bar-item.checked::before {
  opacity: 1;
}
.ep-field-sidebar {
  width: 280px;
  background-color: var(--ep-designer-background);
  border-right: 1px solid var(--ep-border);
  overflow: hidden;
  flex-shrink: 0;
}
.ep-field-sidebar-container {
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ep-field-header {
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--ep-border);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  flex-shrink: 0;
  user-select: none;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
  margin-left: auto;
}
.ep-field-body {
  flex: 1;
  overflow: auto;
}
.ep-field-pool-section :deep(.ep-outline-item.is-disabled) {
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
