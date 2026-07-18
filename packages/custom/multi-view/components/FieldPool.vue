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

// 当前视图中包含的字段 ID 集合（快速判断）
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
    <EpicTree
      :options="modelFields"
      :selected-keys="selectedKeys"
      @node-click="handleNodeClick"
    >
      <template #tree-node="{ schema }">
        <div
          class="ep-field-item"
          :class="{
            'is-hidden': !viewFieldIdSet.has(schema.id ?? ''),
          }"
        >
          <span
            class="ep-field-eye"
            :class="{ visible: viewFieldIdSet.has(schema.id ?? '') }"
            @click="handleEyeClick(schema.id!, $event)"
          >
            {{ viewFieldIdSet.has(schema.id ?? '') ? '👁' : '🚫' }}
          </span>
          <EpicIcon
            v-if="getFieldIcon(schema.type)"
            :name="getFieldIcon(schema.type)"
            class="ep-field-icon"
          />
          <span class="ep-field-label">{{ schema.label ?? schema.type }}</span>
          <span class="ep-field-type">{{ schema.id }}</span>
        </div>
      </template>
    </EpicTree>
  </div>
</template>

<style scoped>
.ep-field-pool {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.ep-field-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.ep-field-item:hover {
  background: var(--ep-muted);
}
.ep-field-item.is-hidden {
  opacity: 0.5;
}
.ep-field-eye {
  cursor: pointer;
  font-size: 14px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.ep-field-icon {
  font-size: 14px;
  flex-shrink: 0;
}
.ep-field-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ep-field-type {
  font-size: 11px;
  color: var(--ep-text-helper);
  flex-shrink: 0;
}
</style>