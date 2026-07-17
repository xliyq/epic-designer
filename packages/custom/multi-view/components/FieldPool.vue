<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed } from 'vue';

import { pluginManager } from '@ies/manager';

import type { ViewConfig } from '../types';

const props = defineProps<{
  /** 全部字段列表（数据模型中的所有字段） */
  fields: ComponentSchema[];
  /** 当前选中的视图ID */
  currentViewId: string | null;
  /** 视图配置映射 */
  viewConfigs: Record<string, ViewConfig>;
}>();

const emit = defineEmits<{
  /** 切换字段在当前视图中的显隐 */
  toggle: [fieldId: string];
  /** 选中字段 */
  select: [field: ComponentSchema];
}>();

// 当前视图的字段ID集合
const currentLayoutIds = computed<Set<string>>(() => {
  if (!props.currentViewId) return new Set();
  const config = props.viewConfigs[props.currentViewId];
  return new Set(config?.layout ?? []);
});

/**
 * 获取字段在当前视图中的显示状态
 */
function isInView(fieldId: string): boolean {
  return currentLayoutIds.value.has(fieldId);
}

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
  return pluginManager.component.getLabel(type);
}

/**
 * 获取字段类型的显示名称
 */
function getTypeName(field: ComponentSchema): string {
  return getLabel(field.type) || field.type;
}

/**
 * 处理字段点击：如果在视图中则选中，如果不在则加入视图并选中
 */
function handleClick(field: ComponentSchema) {
  const fieldId = field.id ?? '';
  if (!isInView(fieldId)) {
    // 不在视图中，先加入
    emit('toggle', fieldId);
  }
  emit('select', field);
}

/**
 * 切换显隐（点击眼睛图标）
 */
function handleToggleVisible(field: ComponentSchema, e: MouseEvent) {
  e.stopPropagation();
  const fieldId = field.id ?? '';
  emit('toggle', fieldId);
}
</script>

<template>
  <div class="mv-field-pool">
    <div class="mv-field-pool-header">
      <span class="mv-field-pool-title">字段池</span>
      <span class="mv-field-pool-count">{{ fields.length }} 个字段</span>
    </div>

    <div class="mv-field-pool-list">
      <div v-if="fields.length === 0" class="mv-field-pool-empty">
        暂无字段，请先在「数据模型」模式下添加
      </div>

      <div
        v-for="field in fields"
        :key="field.id"
        class="mv-field-pool-item"
        :class="{
          'in-view': isInView(field.id ?? ''),
          'not-in-view': !isInView(field.id ?? ''),
        }"
        @click="handleClick(field)"
      >
        <!-- 眼睛图标：切换显隐 -->
        <span
          class="mv-field-eye"
          :class="{ visible: isInView(field.id ?? '') }"
          @click="handleToggleVisible(field, $event)"
        >
          <svg v-if="isInView(field.id ?? '')" viewBox="0 0 1024 1024" width="14" height="14">
            <path
              d="M512 256c-176 0-326 100-400 256 74 156 224 256 400 256s326-100 400-256c-74-156-224-256-400-256z m0 416c-88 0-160-72-160-160s72-160 160-160 160 72 160 160-72 160-160 160z m0-256c-54 0-96 42-96 96s42 96 96 96 96-42 96-96-42-96-96-96z"
              fill="currentColor"
            />
          </svg>
          <svg v-else viewBox="0 0 1024 1024" width="14" height="14">
            <path
              d="M512 352c-88 0-160 72-160 160s72 160 160 160 160-72 160-160-72-160-160-160z m0 256c-54 0-96-42-96-96s42-96 96-96 96 42 96 96-42 96-96 96z m448-96c0-6 0-12-2-18-72-144-224-258-446-258S138 350 66 494c-2 6-2 12-2 18s0 12 2 18c72 144 224 258 446 258s374-114 446-258c2-6 2-12 2-18z m-106 18c-62 118-188 200-342 200s-280-82-342-200c62-118 188-200 342-200s280 82 342 200z"
              fill="currentColor"
              opacity="0.4"
            />
            <path
              d="M128 128l768 768"
              stroke="currentColor"
              stroke-width="64"
              stroke-linecap="round"
              opacity="0.6"
            />
          </svg>
        </span>

        <!-- 字段信息 -->
        <div class="mv-field-info">
          <span class="mv-field-label">{{ field.label || '(未命名)' }}</span>
          <span class="mv-field-type">{{ getTypeName(field) }}</span>
        </div>

        <!-- 必填标记 -->
        <span v-if="field.rules?.some((r) => r.required)" class="mv-field-required">
          *
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mv-field-pool {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mv-field-pool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mv-field-pool-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.mv-field-pool-count {
  font-size: 12px;
  color: #999;
}

.mv-field-pool-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.mv-field-pool-empty {
  padding: 40px 16px;
  text-align: center;
  color: #ccc;
  font-size: 13px;
}

.mv-field-pool-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 8px;
}

.mv-field-pool-item:hover {
  background: #f5f7fa;
}

.mv-field-pool-item.not-in-view {
  opacity: 0.5;
}

.mv-field-pool-item.in-view {
  background: #f0f7ff;
}

.mv-field-pool-item.in-view:hover {
  background: #e6f1ff;
}

/* 眼睛图标 */
.mv-field-eye {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ccc;
  transition: color 0.15s;
}

.mv-field-eye.visible {
  color: var(--ep-primary-color, #409eff);
}

.mv-field-eye:hover {
  color: var(--ep-primary-color, #409eff);
}

/* 字段信息 */
.mv-field-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mv-field-label {
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mv-field-type {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

/* 必填标记 */
.mv-field-required {
  color: #f56c6c;
  font-size: 14px;
  flex-shrink: 0;
}
</style>
