<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { computed } from 'vue'
import { EpicIcon } from '@ies/base-ui'
import { pluginManager } from '@ies/manager'

const props = defineProps<{
  modelFields: ComponentSchema[]
  currentViewFields: ComponentSchema[]
  selectedFieldId: string
}>()

const emit = defineEmits<{
  selectField: [id: string]
  toggleField: [id: string]
}>()

const fieldList = computed(() => {
  return props.modelFields.map(field => ({
    ...field,
    inView: props.currentViewFields.some(f => f.id === field.id),
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
          'is-selected': field.id === selectedFieldId,
          'is-hidden': !field.inView,
        }"
        @click="emit('selectField', field.id)"
      >
        <span
          class="ep-field-eye"
          :class="{ visible: field.inView }"
          @click.stop="emit('toggleField', field.id)"
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
</style>