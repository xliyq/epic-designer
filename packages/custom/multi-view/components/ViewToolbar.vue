<script lang="ts" setup>
import type { ViewTypeConfig, DesignerMode } from '../types'

const props = defineProps<{
  currentMode: DesignerMode
  currentViewTypeId: string
  viewTypes: ViewTypeConfig[]
  title?: string
}>()

const emit = defineEmits<{
  switchMode: [mode: DesignerMode]
  selectView: [id: string]
  addView: [name: string]
  removeView: [id: string]
  renameView: [id: string, newName: string]
  save: []
  preview: []
}>()

function handleAddView() {
  const name = `视图${props.viewTypes.length + 1}`
  emit('addView', name)
}

function handleRenameView(id: string, event: Event) {
  const target = event.target as HTMLElement
  const newName = target.textContent?.trim()
  if (newName) emit('renameView', id, newName)
}
</script>

<template>
  <header class="mv-header">
    <div class="mv-header-left">
      {{ title ?? '多视图设计器' }}
    </div>

    <div class="mv-header-center">
      <div class="mv-mode-switch">
        <button
          :class="{ active: currentMode === 'model' }"
          @click="emit('switchMode', 'model')"
        >
          数据模型
        </button>
        <button
          :class="{ active: currentMode === 'view' }"
          @click="emit('switchMode', 'view')"
        >
          视图设计
        </button>
      </div>

      <div v-if="currentMode === 'view'" class="mv-view-tabs">
        <span
          v-for="vt in viewTypes"
          :key="vt.id"
          class="mv-view-tab"
          :class="{ active: vt.id === currentViewTypeId }"
          @click="emit('selectView', vt.id)"
        >
          <span
            class="mv-view-tab-name"
            :contenteditable="vt.id === currentViewTypeId"
            @blur="handleRenameView(vt.id, $event)"
          >
            {{ vt.name }}
          </span>
          <span
            v-if="viewTypes.length > 1"
            class="mv-view-tab-close"
            @click.stop="emit('removeView', vt.id)"
          >
            ×
          </span>
        </span>
        <button class="mv-view-add-btn" @click="handleAddView">+</button>

      </div>
    </div>

    <div class="mv-header-right">
      <button class="mv-btn" @click="emit('preview')">预览</button>
      <button class="mv-btn mv-btn-primary" @click="emit('save')">保存</button>
    </div>
  </header>
</template>

<style scoped>
.mv-header {
  display: flex;
  align-items: center;
  min-height: 60px;
  background: var(--ep-designer-background);
  padding: 0 16px;
  color: var(--ep-text-main);
  border-bottom: 1px solid var(--ep-border);
  font-size: 14px;
  gap: 16px;
  padding:4px 0;
}
.mv-header-left {
  flex-shrink: 0;
  font-weight: 600;
  font-size: 15px;
}
.mv-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
}
.mv-mode-switch {
  display: flex;
  border: 1px solid var(--ep-border);
  border-radius: var(--ep-radius);
  overflow: hidden;
}
.mv-mode-switch button {
  padding: 4px 16px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--ep-text-secondary);
  transition: all 0.2s;
}
.mv-mode-switch button.active {
  background: var(--ep-primary);
  color: var(--ep-primary-foreground);
}
.mv-view-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.mv-view-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--ep-radius);
  cursor: pointer;
  background: var(--ep-muted);
  transition: all 0.2s;
}
.mv-view-tab.active {
  background: var(--ep-primary);
  color: var(--ep-primary-foreground);
}
.mv-view-tab-name {
  outline: none;
  min-width: 24px;
}
.mv-view-tab-close {
  font-size: 16px;
  line-height: 1;
  opacity: 0.6;
  cursor: pointer;
}
.mv-view-tab-close:hover {
  opacity: 1;
}
.mv-view-add-btn {
  padding: 4px 12px;
  border: 1px dashed var(--ep-border);
  border-radius: var(--ep-radius);
  cursor: pointer;
  background: transparent;
  color: var(--ep-text-secondary);
  font-size: 14px;
}
.mv-divider {
  width: 1px;
  height: 20px;
  background: var(--ep-border);
  margin: 0 8px;
}
.mv-header-right {
  flex-shrink: 0;
  display: flex;
  gap: 10px;
}
.mv-btn {
  height: 30px;
  padding: 0 14px;
  border: 1px solid var(--ep-border);
  border-radius: var(--ep-radius);
  cursor: pointer;
  background: transparent;
  color: var(--ep-text-main);
  font-size: 13px;
  line-height: 1;
}
.mv-btn-primary {
  background: var(--ep-primary);
  color: var(--ep-primary-foreground);
  border-color: var(--ep-primary);
}
</style>