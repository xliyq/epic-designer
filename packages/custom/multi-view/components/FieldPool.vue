<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { EpicIcon, EpicTree } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'
import { FIELD_POOL_KEY } from '../types'
import type { ComponentSchema } from '@ies/types'

const ctx = inject(FIELD_POOL_KEY)
if (!ctx) throw new Error('FieldPool 需要 MultiViewDesigner 提供上下文')

const { pageSchema } = useDesignerContext()

// 数据模型字段
const modelFields = computed(() => pageSchema.schemas[0]?.children ?? [])

// 当前视图中包含的字段 ID 集合
const viewFieldIdSet = computed(() => new Set(ctx.viewFieldIds))

// EpicTree 选中 key
const selectedKeys = ref<string[]>([])

function handleNodeClick({ componentSchema }: { componentSchema: ComponentSchema }) {
  if (componentSchema.id) {
    selectedKeys.value = [componentSchema.id]
    ctx.selectField(componentSchema.id)
  }
}

function handleEyeClick(fieldId: string, event: MouseEvent) {
  event.stopPropagation()
  ctx.toggleField(fieldId)
}

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}
</script>

<template>
  <div class="ep-field-pool">
    <div class="ep-field-pool-header">
      字段池
      <span class="ep-field-count">{{ modelFields.length }} 个字段</span>
    </div>
    <EpicTree
      :options="modelFields"
      :selected-keys="selectedKeys"
      @node-click="handleNodeClick"
    >
      <template #tree-node="{ schema }">
        <div
          class="ep-outline-item ep-text-padding flex"
          :class="{ hidden: !viewFieldIdSet.has(schema.id ?? '') }"
        >
          <EpicIcon
            class="ep-eye-btn"
            :class="{ visible: viewFieldIdSet.has(schema.id ?? '') }"
            :name="viewFieldIdSet.has(schema.id ?? '')
              ? 'icon--epic--visibility-outline-rounded'
              : 'icon--epic--visibility-off-outline-rounded'"
            @click.stop="handleEyeClick(schema.id!, $event)"
          />
          <EpicIcon
            class="ep-component-icon translate-y-2px"
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
      v-if="modelFields.length === 0"
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
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
}
.ep-eye-btn {
  cursor: pointer;
  font-size: 14px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.ep-eye-btn.visible {
  opacity: 1;
}
.ep-eye-btn:hover {
  opacity: 1;
}
</style>