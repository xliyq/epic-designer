<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed } from 'vue';

import { pluginManager } from '@ies/manager';

import type { ViewTypeConfig } from '../types';

const props = defineProps<{
  /** 当前视图的字段列表（已按 layout 排序） */
  fields: ComponentSchema[];
  /** 当前选中的字段 */
  selectedField: ComponentSchema | null;
  /** 当前视图ID */
  currentViewId: string | null;
  /** 视图类型列表 */
  viewTypes: ViewTypeConfig[];
}>();

const emit = defineEmits<{
  /** 选中字段 */
  select: [field: ComponentSchema];
  /** 移动字段顺序 */
  move: [fieldId: string, direction: 'up' | 'down'];
}>();

// 当前视图名称
const currentViewName = computed(() => {
  const vt = props.viewTypes.find((v) => v.id === props.currentViewId);
  return vt?.name ?? '';
});

/**
 * 获取组件的图标
 */
function getIcon(type: string): string {
  return pluginManager.component.getIcon(type);
}

/**
 * 获取组件的标签
 */
function getLabel(type: string): string {
  return pluginManager.component.getLabel(type) || type;
}

/**
 * 检查字段是否选中
 */
function isSelected(fieldId: string): boolean {
  return props.selectedField?.id === fieldId;
}

/**
 * 处理字段点击
 */
function handleClick(field: ComponentSchema) {
  emit('select', field);
}

/**
 * 上移
 */
function handleMoveUp(field: ComponentSchema, e: MouseEvent) {
  e.stopPropagation();
  if (field.id) emit('move', field.id, 'up');
}

/**
 * 下移
 */
function handleMoveDown(field: ComponentSchema, e: MouseEvent) {
  e.stopPropagation();
  if (field.id) emit('move', field.id, 'down');
}
</script>

<template>
  <div class="mv-view-canvas">
    <!-- 画布头部 -->
    <div class="mv-canvas-header">
      <span class="mv-canvas-title">{{ currentViewName }}视图</span>
      <span class="mv-canvas-count">{{ fields.length }} 个字段</span>
    </div>

    <!-- 字段列表 -->
    <div class="mv-canvas-body">
      <div v-if="fields.length === 0" class="mv-canvas-empty">
        <div class="mv-canvas-empty-icon">
          <svg viewBox="0 0 1024 1024" width="48" height="48">
            <path
              d="M832 64H192c-35.2 0-64 28.8-64 64v832l192-128h512c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z m0 704H320l-128 85.3V128h640v640z"
              fill="#ccc"
            />
          </svg>
        </div>
        <p>暂无字段在当前视图中</p>
        <p class="mv-canvas-empty-hint">请从左侧字段池点击添加字段到当前视图</p>
      </div>

      <div v-else class="mv-canvas-fields">
        <div
          v-for="(field, index) in fields"
          :key="field.id"
          class="mv-canvas-field"
          :class="{ selected: isSelected(field.id ?? '') }"
          @click="handleClick(field)"
        >
          <!-- 序号 -->
          <span class="mv-field-index">{{ index + 1 }}</span>

          <!-- 字段信息区 -->
          <div class="mv-field-content">
            <div class="mv-field-top">
              <span class="mv-field-icon" :class="getIcon(field.type)"></span>
              <span class="mv-field-name">{{ field.label || '(未命名)' }}</span>
              <span class="mv-field-type-badge">{{ getLabel(field.type) }}</span>
              <span
                v-if="field.rules?.some((r) => r.required)"
                class="mv-field-required-badge"
              >
                必填
              </span>
            </div>
            <div class="mv-field-bottom">
              <span class="mv-field-key">field: {{ field.field ?? '-' }}</span>
            </div>
          </div>

          <!-- 排序按钮 -->
          <div class="mv-field-actions">
            <button
              class="mv-move-btn"
              :disabled="index === 0"
              @click="handleMoveUp(field, $event)"
              title="上移"
            >
              ↑
            </button>
            <button
              class="mv-move-btn"
              :disabled="index === fields.length - 1"
              @click="handleMoveDown(field, $event)"
              title="下移"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mv-view-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.mv-canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.mv-canvas-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.mv-canvas-count {
  font-size: 12px;
  color: #999;
}

.mv-canvas-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.mv-canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
  text-align: center;
}

.mv-canvas-empty p {
  margin: 8px 0 0;
  font-size: 14px;
}

.mv-canvas-empty-hint {
  font-size: 12px !important;
  color: #ddd;
}

.mv-canvas-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.mv-canvas-field {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.15s;
  gap: 12px;
}

.mv-canvas-field:hover {
  border-color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.mv-canvas-field.selected {
  border-color: var(--ep-primary-color, #409eff);
  background: #f0f7ff;
}

/* 序号 */
.mv-field-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mv-canvas-field.selected .mv-field-index {
  background: var(--ep-primary-color, #409eff);
  color: #fff;
}

/* 字段内容区 */
.mv-field-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.mv-field-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mv-field-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.mv-field-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.mv-field-type-badge {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.mv-field-required-badge {
  font-size: 11px;
  color: #f56c6c;
  background: #fef0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

.mv-field-bottom {
  display: flex;
  align-items: center;
}

.mv-field-key {
  font-size: 11px;
  color: #bbb;
  font-family: monospace;
}

/* 操作按钮 */
.mv-field-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.mv-move-btn {
  width: 24px;
  height: 20px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #666;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.mv-move-btn:hover:not(:disabled) {
  border-color: var(--ep-primary-color, #409eff);
  color: var(--ep-primary-color, #409eff);
  background: #f0f7ff;
}

.mv-move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
