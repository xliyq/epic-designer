<script lang="ts" setup>
import type { ViewTypeConfig, DesignerMode } from '../types'

const props = defineProps<{
  currentMode: DesignerMode
  currentViewTypeId: string
  viewTypes: ViewTypeConfig[]
  globalMode: boolean
  title?: string
}>()

const emit = defineEmits<{
  switchMode: [mode: DesignerMode]
  selectView: [id: string]
  addView: [name: string]
  removeView: [id: string]
  renameView: [id: string, newName: string]
  toggleGlobalMode: [v: boolean]
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

        <span class="mv-divider" />
        <label class="mv-global-toggle">
          <input
            type="checkbox"
            :checked="globalMode"
            @change="emit('toggleGlobalMode', ($event.target as HTMLInputElement).checked)"
          />
          <span>全局</span>
        </label>
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
  height: 42px;
  background: var(--ep-designer-background);
  padding: 0 12px;
  color: var(--ep-text-main);
  border-bottom: 1px solid var(--ep-border);
  font-size: 13px;
  gap: 12px;
}
.mv-header-left {
  flex-shrink: 0;
  font-weight: 500;
}
.mv-header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mv-mode-switch {
  display: flex;
  border: 1px solid var(--ep-border);
  border-radius: var(--ep-radius);
  overflow: hidden;
}
.mv-mode-switch button {
  padding: 2px 12px;
  font-size: 12px;
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
  gap: 4px;
  font-size: 12px;
}
.mv-view-tab {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
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
  min-width: 20px;
}
.mv-view-tab-close {
  font-size: 14px;
  line-height: 1;
  opacity: 0.6;
  cursor: pointer;
}
.mv-view-tab-close:hover {
  opacity: 1;
}
.mv-view-add-btn {
  padding: 2px 8px;
  border: 1px dashed var(--ep-border);
  border-radius: var(--ep-radius);
  cursor: pointer;
  background: transparent;
  color: var(--ep-text-secondary);
}
.mv-divider {
  width: 1px;
  height: 16px;
  background: var(--ep-border);
  margin: 0 4px;
}
.mv-global-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}
.mv-global-toggle input {
  margin: 0;
}
.mv-header-right {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}
.mv-btn {
  height: 24px;
  padding: 0 8px;
  border: 1px solid var(--ep-border);
  border-radius: var(--ep-radius);
  cursor: pointer;
  background: transparent;
  color: var(--ep-text-main);
  font-size: 12px;
}
.mv-btn-primary {
  background: var(--ep-primary);
  color: var(--ep-primary-foreground);
  border-color: var(--ep-primary);
}
</style>