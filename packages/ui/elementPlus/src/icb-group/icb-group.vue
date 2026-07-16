<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';
import { computed, ref, watch } from 'vue';
import { ElFormItem } from 'element-plus';
import { EpicNode } from '@ies/base-ui';
import { useFormItem, usePageManager } from '@ies/designer';
import { pluginManager } from '@ies/manager';
import { deepEqual, findSchemas } from '@ies/utils';
import { useContainerValidate } from '../common/useContainerValidate';

defineOptions({ name: 'EpIcbGroup' });

const props = withDefaults(defineProps<{
  componentSchema: ComponentSchema;
  modelValue?: any[];
}>(), {
  componentSchema: () => ({ type: '' }),
  modelValue: () => [],
});

const emit = defineEmits(['update:modelValue']);
const pageManager = usePageManager();
const isDesignMode = computed(() => pageManager.isDesignMode.value);
const { formData } = useFormItem();
const field = computed(() => props.componentSchema?.field ?? '');

// 容器校验
const { childErrors, validateField, validateAll, clearValidate } = useContainerValidate({
  getValidator: (name: string) => pageManager.funcs.value[name],
});

function isChildRequired(child: ComponentSchema): boolean {
  if (child.props?.required) return true;
  if (!child.rules) return false;
  return (child.rules as any[]).some((r) => r.required === true);
}

function handleFieldChange(child: ComponentSchema, rawValue: any) {
  setFieldValue(child, rawValue);
  if (!isDesignMode.value && child.rules?.length) {
    validateField(child, getFieldValue(child), 'change');
  }
}

function handleFieldBlur(child: ComponentSchema) {
  if (!isDesignMode.value && child.rules?.length) {
    validateField(child, getFieldValue(child), 'blur');
  }
}

async function validate(): Promise<void> {
  if (isDesignMode.value) return;
  clearValidate();
  const errors = await validateAll(children.value, (child) => getFieldValue(child), (child) => isChildHidden(child));
  if (errors.length > 0) throw new Error(errors[0].message);
}

const children = computed(() => props.componentSchema?.children ?? []);

const parentForm = computed(() => {
  const forms = findSchemas(pageManager.pageSchema.schemas, (s: ComponentSchema) => s.type === 'form') as ComponentSchema[];
  return forms[0] ?? null;
});

// 内部数据管理
const internalArray = ref<any[]>([]);
let initialized = false;
let lastEmitted: any[] = [];

function buildOutput(): any[] {
  return internalArray.value.map((item) => {
    const merged = { ...item };
    delete merged._childId;
    return merged;
  });
}

function emitOutput() {
  const output = buildOutput();
  if (deepEqual(output, lastEmitted)) return;
  lastEmitted = output;
  emit('update:modelValue', output);
}

function parseMetaOverrides(child: ComponentSchema): Record<string, any> | null {
  const overrides = child.props?.metaOverrides;
  if (!overrides) return null;
  if (typeof overrides === 'string') {
    try {
      const parsed = JSON.parse(overrides);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch { /* ignore */ }
  } else if (typeof overrides === 'object') {
    return overrides;
  }
  return null;
}

function applyMetaOverrides() {
  children.value.forEach((child) => {
    const overrides = parseMetaOverrides(child);
    if (!overrides) return;
    const parameterNum = child.props?.parameterNum;
    const item = parameterNum ? findIcbItem(parameterNum) : findItemByChildId(child.id!);
    if (item) Object.assign(item, overrides);
  });
}

function initFromModelValue(arr: any[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    internalArray.value = children.value.map((c) => {
      const parameterNum = c.props?.parameterNum;
      if (parameterNum) return { parameterNum, parameterValue: null };
      return { _childId: c.id, parameterValue: null };
    });
  } else {
    internalArray.value = arr.map((item) => ({ ...item }));
  }
  applyMetaOverrides();
  lastEmitted = buildOutput();
}

watch(() => props.modelValue, (arr) => {
  if (initialized && deepEqual(arr, lastEmitted)) return;
  initialized = true;
  initFromModelValue(arr ?? []);
}, { immediate: true, deep: true });

defineExpose({ validate, clearValidate: () => clearValidate(), __isContainerValidate: true });

function findIcbItem(key: string): Record<string, any> | undefined {
  return internalArray.value.find((d: any) => String(d.parameterNum) === String(key));
}

function findItemByChildId(childId: string): Record<string, any> | undefined {
  return internalArray.value.find((d: any) => d._childId === childId);
}

function getFieldValue(child: ComponentSchema): any {
  const parameterNum = child.props?.parameterNum;
  const item = parameterNum ? findIcbItem(parameterNum) : findItemByChildId(child.id!);
  if (!item) return null;
  return item.parameterValue ?? null;
}

function setFieldValue(child: ComponentSchema, rawValue: any): void {
  const parameterNum = child.props?.parameterNum;
  let target: Record<string, any> | undefined;
  if (parameterNum) {
    target = findIcbItem(parameterNum);
    if (!target) {
      target = { parameterNum, parameterValue: null };
      internalArray.value.push(target);
    }
  } else {
    target = findItemByChildId(child.id!);
    if (!target) {
      target = { _childId: child.id, parameterValue: null };
      internalArray.value.push(target);
    }
  }
  target.parameterValue = rawValue;
  emitOutput();
}

function getEnhancedSchema(child: ComponentSchema): ComponentSchema {
  return { ...child, field: undefined, label: child.label ?? '', props: getMergedProps(child), noFormItem: true };
}

const childContext = ref<{ schema: ComponentSchema; child: ComponentSchema }[]>([]);
function rebuildChildContext() {
  childContext.value = children.value.map((c) => ({ schema: getEnhancedSchema(c), child: c }));
}
watch(children, rebuildChildContext, { immediate: true });

function isChildHidden(child: ComponentSchema): boolean {
  return !!child.props?.hidden;
}

const groupedChildContext = computed(() => {
  const groups: { groupLabel: string; items: { schema: ComponentSchema; child: ComponentSchema }[] }[] = [];
  const groupIndexMap: Record<string, number> = {};
  for (const entry of childContext.value) {
    if (!isDesignMode.value && isChildHidden(entry.child)) continue;
    const gl = entry.child.props?.groupLabel || '';
    if (!(gl in groupIndexMap)) {
      groupIndexMap[gl] = groups.length;
      groups.push({ groupLabel: gl, items: [] });
    }
    groups[groupIndexMap[gl]].items.push(entry);
  }
  return groups;
});

const childBindings = computed(() => {
  const map: Record<string, any> = {};
  for (const entry of childContext.value) {
    const parameterNum = entry.child.props?.parameterNum;
    const item = parameterNum ? findIcbItem(parameterNum) : findItemByChildId(entry.schema.id!);
    map[entry.schema.id!] = item?.parameterValue ?? null;
  }
  return map;
});

function getMergedProps(child: ComponentSchema): Record<string, any> {
  const designProps = child.props ?? {};
  const merged: Record<string, any> = {};
  const overrides = child.props?.metaOverrides;
  if (overrides) {
    let parsed: any = null;
    if (typeof overrides === 'string') {
      try { parsed = JSON.parse(overrides); } catch { /* ignore */ }
    } else if (typeof overrides === 'object') {
      parsed = overrides;
    }
    if (parsed && typeof parsed === 'object') Object.assign(merged, parsed);
  }
  const { parameterNum: _, metaOverrides, suffix, ...rest } = designProps;
  return { ...rest, ...merged };
}

// 容器视觉属性
const title = computed(() => props.componentSchema?.props?.title ?? props.componentSchema?.label ?? '');
const showTitle = computed(() => !!title.value);
const bordered = computed(() => props.componentSchema?.props?.bordered !== false);
const collapsible = computed(() => !!props.componentSchema?.props?.collapsible);
const collapseIconPosition = computed<'left' | 'right'>(() => props.componentSchema?.props?.collapseIconPosition ?? 'right');
const defaultCollapsed = computed(() => !!props.componentSchema?.props?.defaultCollapsed);
const collapsed = ref(defaultCollapsed.value);
const labelPosition = computed<'' | 'left' | 'right' | 'top'>(() => props.componentSchema?.props?.labelPosition ?? '');
const labelWidth = computed<string>(() => {
  const w = props.componentSchema?.props?.labelWidth;
  if (w !== undefined && w !== null && w !== '') return typeof w === 'number' ? `${w}px` : String(w);
  const formLabelWidth = parentForm.value?.props?.labelWidth;
  if (formLabelWidth !== undefined && formLabelWidth !== null && formLabelWidth !== '') return typeof formLabelWidth === 'number' ? `${formLabelWidth}px` : String(formLabelWidth);
  return '';
});

function getItemLabelWidth(child: ComponentSchema): string | undefined {
  if (!child.label || child.hideLabel || labelPosition.value === 'top') return '0';
  return labelWidth.value || undefined;
}

const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  if (labelWidth.value) style['--icb-group-label-width'] = labelWidth.value;
  return style;
});

function toggleCollapsed() { if (collapsible.value) collapsed.value = !collapsed.value; }

const gridStyle = computed(() => {
  const p = props.componentSchema?.props;
  if (p?.gridEnable) {
    const cols = p.gridCols ?? 2;
    return { display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' } as Record<string, string>;
  }
  return {} as Record<string, string>;
});

function getSuffix(child: ComponentSchema): string {
  return child.props?.suffix ?? '';
}
</script>

<template>
  <div
    class="ep-icb-group"
    :class="{ 'ep-icb-group--bordered': bordered, 'ep-icb-group--collapsed': collapsed }"
    :data-label-position="labelPosition || undefined"
    :data-has-label-width="labelWidth ? '' : undefined"
    :style="rootStyle"
  >
    <div v-if="showTitle" class="ep-icb-group__header" :class="{ 'ep-icb-group__header--clickable': collapsible }" @click="toggleCollapsed">
      <span v-if="collapsible && collapseIconPosition === 'left'" class="ep-icb-group__arrow ep-icb-group__arrow--left">{{ collapsed ? '▶' : '▼' }}</span>
      <span class="ep-icb-group__title">{{ title }}</span>
      <span v-if="collapsible && collapseIconPosition === 'right'" class="ep-icb-group__arrow ep-icb-group__arrow--right">{{ collapsed ? '▶' : '▼' }}</span>
    </div>

    <!-- 设计模式 -->
    <div v-if="isDesignMode" v-show="!collapsed" class="ep-icb-group__body" :style="gridStyle">
      <slot name="edit-node">
        <slot v-for="item in children" name="node" :component-schema="item"></slot>
      </slot>
    </div>

    <!-- 运行模式 -->
    <div v-else v-show="!collapsed" class="ep-icb-group__body" :style="gridStyle">
      <template v-for="group in groupedChildContext" :key="group.groupLabel || '__default__'">
        <div v-if="group.groupLabel" class="ep-icb-group__subgroup-title">{{ group.groupLabel }}</div>
        <ElFormItem
          v-for="ctx in group.items"
          :key="ctx.schema.id"
          class="ep-icb-group__form-item"
          :class="{ 'ep-hidden': isChildHidden(ctx.child) }"
          :style="ctx.child.props?.span ? { gridColumn: `span ${ctx.child.props.span}` } : undefined"
          :label="ctx.schema.hideLabel ? '' : (ctx.schema.label ?? '')"
          :label-width="getItemLabelWidth(ctx.child)"
          :error="childErrors[ctx.schema.id!]"
          :validate-status="childErrors[ctx.schema.id!] ? 'error' : ''"
          :required="isChildRequired(ctx.child)"
        >
          <div class="ep-icb-group__input-wrapper">
            <EpicNode
              :component-schema="ctx.schema"
              :model-value="childBindings[ctx.schema.id!]"
              @update:model-value="(val: any) => handleFieldChange(ctx.child, val)"
              @blur="() => handleFieldBlur(ctx.child)"
            />
            <span v-if="getSuffix(ctx.child)" class="ep-icb-group__suffix">{{ getSuffix(ctx.child) }}</span>
          </div>
        </ElFormItem>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-icb-group {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;

  &--bordered {
    border: 1px solid var(--el-border-color-light, #e4e7ed);
    border-radius: 4px;
    background: var(--el-bg-color, #fff);
  }

  &__header {
    padding: 8px 12px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-fill-color-lighter, #fafafa);
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
    display: flex;
    align-items: center;
    gap: 6px;
    user-select: none;

    &--clickable {
      cursor: pointer;
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    font-size: 10px;
    color: var(--el-text-color-secondary, #909399);
    flex-shrink: 0;

    &--right {
      margin-left: auto;
    }
  }

  &__body {
    min-height: 40px;
    padding: 12px;
  }

  &__subgroup-title {
    grid-column: 1 / -1;
    padding: 10px 12px 6px;
    margin-bottom: 8px;
    margin-top: 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-fill-color-lighter, #fafafa);
    border-radius: 3px;
    border-left: 3px solid var(--el-color-primary, #409eff);

    &:first-child {
      margin-top: 0;
    }
  }

  &:deep(.ep-icb-group__body > .ep-draggable-range) {
    display: contents !important;
  }

  /* 设计模式下分组标题在 draggable-range 内，确保 grid 布局生效 */
  &:deep(.ep-draggable-range .ep-icb-group__subgroup-title) {
    grid-column: 1 / -1;
  }

  /* 设计模式下 ep-node-item 在 grid 中正确布局，子组件宽度 100% */
  &:deep(.ep-draggable-range .ep-node-item) {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    min-height: 32px;

    .el-form-item {
      width: 100%;
      margin-bottom: 0;
    }

    .el-form-item__content {
      width: 100%;
      line-height: 32px;

      .el-input,
      .el-select,
      .el-date-editor,
      .el-cascader,
      .el-input-number,
      .el-textarea {
        width: 100%;
      }
    }
  }

  /* 设计模式下标签位置控制 */
  &[data-label-position='top'] {
    &:deep(.ep-draggable-range .ep-node-item) {
      flex-direction: column;
      align-items: stretch;
    }
    &:deep(.ep-draggable-range .ep-node-item .el-form-item__label) {
      text-align: left;
      padding-right: 0;
      margin-bottom: 4px;
      line-height: 1.4;
      width: auto !important;
    }
  }

  &[data-label-position='right'] {
    &:deep(.ep-draggable-range .ep-node-item) {
      flex-direction: row-reverse;
    }
    &:deep(.ep-draggable-range .ep-node-item .el-form-item__label) {
      text-align: left;
      padding-left: 12px;
      padding-right: 0;
    }
  }

  /* 运行模式：ElFormItem 样式适配 */
  &__form-item {
    margin-bottom: 12px;
    min-height: 32px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-form-item__content) {
      min-height: 32px;
      line-height: 32px;
      flex: 1;
      min-width: 0;

      .el-input,
      .el-select,
      .el-date-editor,
      .el-cascader,
      .el-input-number,
      .el-textarea {
        width: 100%;
      }
    }

    /* 文本展示类组件对齐 */
    :deep(.ep-text-view) {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }

  /* 运行模式下 labelPosition 覆盖 */
  &[data-label-position='top'] &__form-item {
    :deep(.el-form-item) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    :deep(.el-form-item__label) {
      text-align: left;
      padding-right: 0;
      padding-bottom: 4px;
      line-height: 1.4;
      width: auto !important;
      flex: none;
    }
    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }
  }

  &[data-label-position='right'] &__form-item {
    :deep(.el-form-item) {
      flex-direction: row-reverse;
    }
    :deep(.el-form-item__label) {
      text-align: left;
      padding-left: 12px;
      padding-right: 0;
    }
  }

  /* 隐藏字段 */
  &__form-item.ep-hidden {
    display: none;
  }

  /* ICB 输入包装器：flex 行内排列，输入框 + 后缀 */
  &__input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 4px;

    :deep(.el-input) {
      flex: 1;
      min-width: 0;
    }
  }

  &__suffix {
    flex-shrink: 0;
    color: var(--el-text-color-regular, #606266);
    font-size: 14px;
    white-space: nowrap;
  }
}
</style>