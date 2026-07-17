<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, ref } from 'vue';

import { ElEmpty, ElSelect, ElOption, ElButton, ElSwitch } from 'element-plus';

import { pluginManager } from '@ies/manager';
import { getValueByPath, setValueByPath, deepClone } from '@ies/utils';

import type { FieldOverride, ViewConfig } from '../types';
import { getOverrideValue, setOverrideValue, hasAnyOverride } from '../composables/useViewSchema';

const props = defineProps<{
  /** 当前选中的字段 */
  selectedField: ComponentSchema | null;
  /** 当前视图ID */
  currentViewId: string | null;
  /** 视图配置映射 */
  viewConfigs: Record<string, ViewConfig>;
  /** 全部字段列表 */
  allFields: ComponentSchema[];
}>();

const emit = defineEmits<{
  /** 设置字段覆盖属性 */
  'set-override': [fieldId: string, override: Partial<FieldOverride>];
  /** 重置字段某个属性的覆盖 */
  'reset-override': [fieldId: string, fieldPath: string];
  /** 重置字段全部覆盖 */
  'reset-all-overrides': [fieldId: string];
}>();

// ════════════════════════════════════════
//  Tab 状态
// ════════════════════════════════════════

const activeTab = ref<'global' | 'override'>('global');

// ════════════════════════════════════════
//  组件配置
// ════════════════════════════════════════

const componentConfigs = pluginManager.component.getComponentConfigs();

// 当前选中字段的组件配置
const fieldConfig = computed(() => {
  if (!props.selectedField?.type) return null;
  return componentConfigs[props.selectedField.type] ?? null;
});

// 当前视图配置
const currentViewConfig = computed<ViewConfig | null>(() => {
  if (!props.currentViewId) return null;
  return props.viewConfigs[props.currentViewId] ?? null;
});

// 当前字段的覆盖配置
const currentOverride = computed<FieldOverride | undefined>(() => {
  const fieldId = props.selectedField?.id;
  if (!fieldId) return undefined;
  return currentViewConfig.value?.fieldOverrides?.[fieldId];
});

// ════════════════════════════════════════
//  组件属性列表（复用组件自身的 config.attribute）
// ════════════════════════════════════════

// 可在视图中覆盖的属性列表（来自组件自身 config.attribute）
const overridableAttributes = computed<ComponentSchema[]>(() => {
  if (!fieldConfig.value?.config?.attribute) return [];
  // 过滤掉 field（数据字段名不应覆盖）和 rules（用单独的覆盖项处理）
  return fieldConfig.value.config.attribute.filter(
    (attr: ComponentSchema) => attr.field !== 'field' && attr.field !== 'rules',
  );
});

// 全局属性面板的属性列表（含公共注入项）
const globalAttributes = computed<ComponentSchema[]>(() => {
  if (!props.selectedField?.type) return [];
  const base = fieldConfig.value?.config?.attribute ?? [];
  const all = [...base];
  // 注入 hideLabel
  all.push({
    field: 'hideLabel',
    label: '隐藏标签',
    type: 'switch',
  });
  return all;
});

// ════════════════════════════════════════
//  组件类型切换（控件类型覆盖）
// ════════════════════════════════════════

// 所有可切换的组件类型
const componentTypeOptions = computed(() => {
  return Object.values(componentConfigs)
    .filter((config) => config.groupName && config.defaultSchema?.type)
    .map((config) => ({
      label: config.defaultSchema.label ?? config.defaultSchema.type!,
      value: config.defaultSchema.type!,
    }));
});

// 当前控件类型覆盖值
const widgetTypeValue = computed({
  get() {
    return currentOverride.value?.widgetType ?? '';
  },
  set(val: string) {
    const fieldId = props.selectedField?.id;
    if (!fieldId) return;
    if (!val) {
      emit('reset-override', fieldId, 'widgetType');
    } else {
      emit('set-override', fieldId, { widgetType: val });
    }
  },
});

// ════════════════════════════════════════
//  覆盖属性读写
// ════════════════════════════════════════

/**
 * 获取某个属性在覆盖中的值和是否已覆盖
 */
function getOverrideState(fieldPath: string) {
  return getOverrideValue(currentOverride.value, fieldPath);
}

/**
 * 读取某个属性的全局值（从选中字段本身取）
 */
function getGlobalValue(fieldPath: string): any {
  if (!props.selectedField) return undefined;
  return getValueByPath(props.selectedField, fieldPath);
}

/**
 * 读取某个属性的最终值（有覆盖用覆盖值，否则用全局值）
 */
function getEffectiveValue(fieldPath: string): any {
  const overrideState = getOverrideState(fieldPath);
  if (overrideState.isOverridden) {
    return overrideState.value;
  }
  return getGlobalValue(fieldPath);
}

/**
 * 切换某个属性的覆盖状态
 * 从"继承"切换为"已覆盖"时，复制全局值作为初始覆盖值
 */
function toggleOverride(fieldPath: string, enabled: boolean) {
  const fieldId = props.selectedField?.id;
  if (!fieldId) return;

  if (enabled) {
    // 从继承切换为已覆盖：复制全局值
    const globalValue = getGlobalValue(fieldPath);
    const override = setOverrideValue(currentOverride.value, fieldPath, globalValue);
    emit('set-override', fieldId, override);
  } else {
    // 从已覆盖切换为继承：删除覆盖
    emit('reset-override', fieldId, fieldPath);
  }
}

/**
 * 修改已覆盖属性的值
 */
function handleOverrideChange(fieldPath: string, value: any) {
  const fieldId = props.selectedField?.id;
  if (!fieldId) return;
  const override = setOverrideValue(currentOverride.value, fieldPath, value);
  emit('set-override', fieldId, override);
}

/**
 * 重置全部覆盖
 */
function handleResetAll() {
  const fieldId = props.selectedField?.id;
  if (!fieldId) return;
  emit('reset-all-overrides', fieldId);
}

/**
 * 判断字段是否有任何覆盖
 */
const hasOverrides = computed(() => hasAnyOverride(currentOverride.value));

/**
 * 获取组件标签
 */
function getComponentLabel(type: string): string {
  return pluginManager.component.getLabel(type) || type;
}
</script>

<template>
  <div class="mv-attr-panel">
    <!-- 未选中字段 -->
    <div v-if="!selectedField" class="mv-attr-empty">
      <ElEmpty description="请选择一个字段" :image-size="60" />
    </div>

    <!-- 已选中字段 -->
    <template v-else>
      <!-- 字段信息头 -->
      <div class="mv-attr-header">
        <div class="mv-attr-field-id">
          {{ selectedField.id }}
        </div>
        <div class="mv-attr-field-info">
          <span class="mv-attr-field-label">{{ selectedField.label || '(未命名)' }}</span>
          <span class="mv-attr-field-type">{{ getComponentLabel(selectedField.type) }}</span>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="mv-attr-tabs">
        <button
          class="mv-attr-tab"
          :class="{ active: activeTab === 'global' }"
          @click="activeTab = 'global'"
        >
          全局
        </button>
        <button
          class="mv-attr-tab"
          :class="{ active: activeTab === 'override' }"
          @click="activeTab = 'override'"
        >
          当前视图
        </button>
      </div>

      <!-- ── 全局 Tab ── -->
      <div v-if="activeTab === 'global'" class="mv-attr-tab-content">
        <div
          v-for="attr in globalAttributes"
          :key="attr.field"
          class="mv-attr-item"
        >
          <div class="mv-attr-item-label">
            {{ attr.label }}
          </div>
          <div class="mv-attr-item-input">
            <!-- 全局属性的编辑使用原始组件 -->
            <GlobalAttrEditor
              :schema="attr"
              :selected-field="selectedField"
            />
          </div>
        </div>
      </div>

      <!-- ── 当前视图 Tab ── -->
      <div v-else class="mv-attr-tab-content">
        <!-- 控件类型覆盖 -->
        <div class="mv-attr-override-section">
          <div class="mv-attr-section-title">控件类型</div>
          <div class="mv-attr-item">
            <div class="mv-attr-item-label">展示控件</div>
            <div class="mv-attr-item-input">
              <ElSelect
                v-model="widgetTypeValue"
                size="small"
                placeholder="继承全局"
                clearable
                style="width: 100%"
              >
                <ElOption label="继承全局" value="" />
                <ElOption
                  v-for="opt in componentTypeOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </ElSelect>
            </div>
          </div>
        </div>

        <!-- 属性覆盖列表 -->
        <div class="mv-attr-override-section">
          <div class="mv-attr-section-title">
            <span>属性覆盖</span>
            <ElButton
              v-if="hasOverrides"
              type="text"
              size="small"
              @click="handleResetAll"
            >
              全部重置
            </ElButton>
          </div>

          <div
            v-for="attr in overridableAttributes"
            :key="attr.field"
            class="mv-attr-override-item"
            :class="{ overridden: getOverrideState(attr.field!).isOverridden }"
          >
            <!-- 属性标签 + 覆盖开关 -->
            <div class="mv-attr-override-header">
              <span class="mv-attr-override-label">{{ attr.label }}</span>
              <div class="mv-attr-override-toggle">
                <span class="mv-attr-override-status">
                  {{ getOverrideState(attr.field!).isOverridden ? '已覆盖' : '继承' }}
                </span>
                <ElSwitch
                  :model-value="getOverrideState(attr.field!).isOverridden"
                  size="small"
                  @change="(val) => toggleOverride(attr.field!, val as boolean)"
                />
                <span
                  v-if="getOverrideState(attr.field!).isOverridden"
                  class="mv-attr-override-reset"
                  @click="toggleOverride(attr.field!, false)"
                  title="重置为继承"
                >
                  ↺
                </span>
              </div>
            </div>

            <!-- 属性编辑器 -->
            <div
              class="mv-attr-override-editor"
              :class="{ disabled: !getOverrideState(attr.field!).isOverridden }"
            >
              <OverrideAttrEditor
                :schema="attr"
                :selected-field="selectedField"
                :override="currentOverride"
                :is-overridden="getOverrideState(attr.field!).isOverridden"
                @change="(val) => handleOverrideChange(attr.field!, val)"
              />
            </div>
          </div>

          <div v-if="overridableAttributes.length === 0" class="mv-attr-no-override">
            当前组件类型无可覆盖的属性
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';

// 全局属性编辑器
const GlobalAttrEditor = defineAsyncComponent(() => import('./GlobalAttrEditor.vue'));
// 覆盖属性编辑器
const OverrideAttrEditor = defineAsyncComponent(() => import('./OverrideAttrEditor.vue'));

export default { name: 'ViewAttributePanel' };
</script>

<style scoped>
.mv-attr-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mv-attr-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 字段信息头 */
.mv-attr-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mv-attr-field-id {
  font-size: 11px;
  color: #999;
  font-family: monospace;
  margin-bottom: 4px;
}

.mv-attr-field-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mv-attr-field-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.mv-attr-field-type {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

/* Tab */
.mv-attr-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.mv-attr-tab {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.mv-attr-tab.active {
  color: var(--ep-primary-color, #409eff);
  border-bottom-color: var(--ep-primary-color, #409eff);
  font-weight: 500;
}

.mv-attr-tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* 全局属性项 */
.mv-attr-item {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  min-height: 36px;
}

.mv-attr-item-label {
  width: 80px;
  font-size: 13px;
  color: #666;
  flex-shrink: 0;
}

.mv-attr-item-input {
  flex: 1;
}

/* 覆盖区域 */
.mv-attr-override-section {
  margin-bottom: 8px;
}

.mv-attr-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

/* 覆盖属性项 */
.mv-attr-override-item {
  padding: 8px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.mv-attr-override-item.overridden {
  background: #f0f7ff;
}

.mv-attr-override-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.mv-attr-override-label {
  font-size: 13px;
  color: #666;
}

.mv-attr-override-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mv-attr-override-status {
  font-size: 11px;
  color: #bbb;
  min-width: 32px;
  text-align: right;
}

.mv-attr-override-item.overridden .mv-attr-override-status {
  color: var(--ep-primary-color, #409eff);
}

.mv-attr-override-reset {
  cursor: pointer;
  color: #999;
  font-size: 14px;
  padding: 2px;
}

.mv-attr-override-reset:hover {
  color: var(--ep-primary-color, #409eff);
}

.mv-attr-override-editor {
  transition: opacity 0.15s;
}

.mv-attr-override-editor.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.mv-attr-no-override {
  padding: 16px;
  text-align: center;
  color: #ccc;
  font-size: 12px;
}
</style>
