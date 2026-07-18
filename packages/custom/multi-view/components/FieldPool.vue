<script lang="ts" setup>
import { computed, inject } from 'vue'
import { EpicIcon } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'
import { FIELD_POOL_KEY } from '../types'

const ctx = inject(FIELD_POOL_KEY)
if (!ctx) throw new Error('FieldPool 需要 MultiViewDesigner 提供上下文')

// 通过 useDesignerContext 获取 EDesigner 的实时 pageSchema
const { pageSchema } = useDesignerContext()

// 数据模型字段：始终从 EDesigner 的实时画布数据读取
const modelFields = computed(() => pageSchema.schemas[0]?.children ?? [])

// 合并标注：哪些字段在当前视图中
const fieldList = computed(() => {
  return modelFields.value.map(field => ({
    ...field,
    inView: ctx.viewFieldIds.includes(field.id ?? ''),
  }))
})

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
    <div class="ep-field-list">
      <div
        v-for="field in fieldList"
        :key="field.id"
        class="ep-field-item"
        :class="{
          'is-selected': field.id === ctx.selectedFieldId,
          'is-hidden': !field.inView,
        }"
        @click="ctx.selectField(field.id)"
      >
        <span
          class="ep-field-eye"
          :class="{ visible: field.inView }"
          @click.stop="ctx.toggleField(field.id)"
        >
          {{ field.inView ? '👁' : '🚫' }}
        </span>
        <EpicIcon
          v-if="getFieldIcon(field.type)"
          :name="getFieldIcon(field.type)"
          class="ep-field-icon"
        />
        <span class="ep-field-label">{{ field.label }}</span>
        <span class="ep-field-type">{{ field.type }}</span>
      </div>
      <div v-if="modelFields.length === 0" class="ep-field-empty">
        暂无字段，请在数据模型模式中添加
      </div>
    </div>
  </div>
</template>

<style scoped>
.ep-field-pool {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 13px;
}
.ep-field-pool-header {
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--ep-border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
}
.ep-field-list {
  flex: 1;
  overflow: auto;
  padding: 4px 0;
}
.ep-field-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.ep-field-item:hover {
  background: var(--ep-muted);
}
.ep-field-item.is-selected {
  background: color-mix(in oklch, var(--ep-primary), transparent 90%);
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
.ep-field-empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--ep-text-helper);
  font-size: 12px;
}
</style>