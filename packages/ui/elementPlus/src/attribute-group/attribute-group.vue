<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed, inject, nextTick, provide, ref, watch } from 'vue';

import { ElFormItem } from 'element-plus';
import { EpicNode } from '@ies/base-ui';
import {
  ATTRIBUTE_GROUP_CTX_KEY,
  ATTRIBUTE_META_KEY,
  useFormItem,
  usePageManager,
} from '@ies/designer';
import { pluginManager } from '@ies/manager';
import { deepEqual, findSchemas } from '@ies/utils';

import { useContainerValidate } from '../common/useContainerValidate';

defineOptions({
  name: 'EpAttributeGroup',
});

const props = withDefaults(
  defineProps<{
    componentSchema: ComponentSchema;
    modelValue?: any[];
  }>(),
  {
    componentSchema: () => ({ type: '' }),
    modelValue: () => [],
  },
);

const emit = defineEmits(['update:modelValue']);

const pageManager = usePageManager();
const isDesignMode = computed(() => pageManager.isDesignMode.value);
const { formData } = useFormItem();

const field = computed(() => props.componentSchema?.field ?? '');

// ========== 容器校验 ==========
const { childErrors, validateField, validateAll, clearValidate } = useContainerValidate({
  getValidator: (name: string) => pageManager.funcs.value[name],
});

/**
 * 判断子组件是否必填（用于 ElFormItem 的 required 星号显示）
 */
function isChildRequired(child: ComponentSchema): boolean {
  if (child.props?.required) return true;
  if (!child.rules) return false;
  return (child.rules as any[]).some((r) => r.required === true);
}

/**
 * 字段值变化处理：更新值后触发 change 校验
 */
function handleFieldChange(child: ComponentSchema, rawValue: any) {
  setFieldValue(child, rawValue);
  // 仅在运行模式下触发校验
  if (!isDesignMode.value && child.rules?.length) {
    validateField(child, getFieldValue(child), 'change');
  }
}

/**
 * 字段失焦处理：触发 blur 校验
 */
function handleFieldBlur(child: ComponentSchema) {
  if (!isDesignMode.value && child.rules?.length) {
    validateField(child, getFieldValue(child), 'blur');
  }
}

/**
 * 校验本属性组内所有字段（供 form.validate 调用）
 */
async function validate(): Promise<void> {
  if (isDesignMode.value) return;
  // 先清除所有校验状态，再重新校验
  clearValidate();
  const errors = await validateAll(
    children.value,
    (child) => getFieldValue(child),
    (child) => isChildHidden(child),
  );
  if (errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ========== /容器校验 ==========

const allMeta = inject(ATTRIBUTE_META_KEY, computed(() => ({})));
const attrDefs = computed(() => allMeta.value[field.value] ?? []);

const children = computed(() => props.componentSchema?.children ?? []);

// 查找页面中的表单 schema，用于继承 labelWidth、labelSuffix 等
const parentForm = computed(() => {
  const forms = findSchemas(
    pageManager.pageSchema.schemas,
    (s: ComponentSchema) => s.type === 'form',
  ) as ComponentSchema[];
  return forms[0] ?? null;
});

// 从页面表单中读取 labelSuffix
const labelSuffix = computed(() => parentForm.value?.props?.labelSuffix ?? '');

const groupMeta = computed<Record<string, any>>(() => {
  const raw = props.componentSchema?.props?.groupMeta;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
});

const internalArray = ref<any[]>([]);
// 标记是否已初始化，避免空数组 echo 导致跳过首次初始化
let initialized = false;
let lastEmitted: any[] = [];

function buildOutput(): any[] {
  return internalArray.value.map((item) => {
    const merged = { ...item };
    // 清理内部辅助字段，不输出到 formData
    delete merged._childId;
    for (const [k, v] of Object.entries(groupMeta.value)) {
      if (!(k in merged)) merged[k] = v;
    }
    return merged;
  });
}

function emitOutput() {
  const output = buildOutput();
  if (deepEqual(output, lastEmitted)) return;
  lastEmitted = output;
  emit('update:modelValue', output);
}

/**
 * 解析子组件的 metaOverrides，返回可合并的对象
 */
function parseMetaOverrides(child: ComponentSchema): Record<string, any> | null {
  const overrides = child.props?.metaOverrides;
  if (!overrides) return null;
  if (typeof overrides === 'string') {
    try {
      const parsed = JSON.parse(overrides);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // JSON 格式错误时忽略
    }
  } else if (typeof overrides === 'object') {
    return overrides;
  }
  return null;
}

/**
 * 将子组件的 metaOverrides 合并到 internalArray 中对应的数组项
 */
function applyMetaOverrides() {
  children.value.forEach((child) => {
    const overrides = parseMetaOverrides(child);
    if (!overrides) return;
    const charNum = child.props?.charNum;
    const item = charNum
      ? findAttrItem(charNum)
      : findItemByChildId(child.id!);
    if (item) {
      Object.assign(item, overrides);
    }
  });
}

function initFromModelValue(arr: any[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    // 没有外部数据时，根据子组件初始化空项
    internalArray.value = children.value.map((c) => {
      const charNum = c.props?.charNum;
      if (charNum) {
        return { charNum, charValue: null, charDisplay: null, prodordAttachFiles: [] };
      }
      return { _childId: c.id, charValue: null };
    });
  } else {
    internalArray.value = arr.map((item) => ({ ...item }));
  }
  // 将子组件的 metaOverrides 合并到数组项
  applyMetaOverrides();

  // 初始化时主动 emit，确保 formData 中有数据
  const output = buildOutput();
  lastEmitted = output;
  emit('update:modelValue', output);
}

// 外部 modelValue 变化 -> 初始化（跳过 echo）
watch(
  () => props.modelValue,
  (arr) => {
    // 首次初始化必须执行，后续用 deepEqual 跳过 echo
    if (initialized && deepEqual(arr, lastEmitted)) return;
    initialized = true;
    initFromModelValue(arr ?? []);
  },
  { immediate: true, deep: true },
);

// 不再 watch(internalArray) 自动 emit
// 用户编辑时通过 setFieldValue -> emitOutput 显式触发

// 设计时上下文注入
watch(
  [field, attrDefs, isDesignMode],
  () => {
    if (isDesignMode.value) {
      provide(ATTRIBUTE_GROUP_CTX_KEY, {
        groupField: field.value,
        attrsMeta: attrDefs.value,
      });
    }
  },
  { immediate: true },
);

// 注册/注销组件实例，暴露 validate/clearValidate 供 form.validate 调用
// 通过 defineExpose 暴露给父级 EpicNode，由 node.vue 的 handleAddComponentInstance 注册到 pageManager
defineExpose({
  validate,
  clearValidate: () => clearValidate(),
  __isContainerValidate: true,
});

function findAttrDef(charNum: string) {
  return attrDefs.value.find((d: any) => String(d.charNum) === String(charNum));
}

function findAttrItem(key: string): Record<string, any> | undefined {
  return internalArray.value.find(
    (d: any) => String(d.charNum) === String(key),
  );
}

/**
 * 通过子组件 id 查找 internalArray 中的项（用于没有 charNum 的子组件）
 */
function findItemByChildId(childId: string): Record<string, any> | undefined {
  return internalArray.value.find(
    (d: any) => d._childId === childId,
  );
}

/**
 * 解析 syncFields 配置，返回启用的字段名列表。
 * 兼容两种格式：
 * - 旧格式: ["charValue", "charDisplay"]
 * - 新格式: [{ field: "charValue", enabled: true }, { field: "charDisplay", enabled: false }]
 * 无配置时返回 attributeSync 的全部 key
 */
function getSyncKeys(child: ComponentSchema): string[] {
  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;
  const raw = child.props?.syncFields;

  if (!sync) return [];

  // 无配置，返回全部 key
  if (!raw || (Array.isArray(raw) && raw.length === 0)) {
    return Object.keys(sync);
  }

  // 新格式：对象数组
  if (Array.isArray(raw) && typeof raw[0] === 'object') {
    return (raw as { field: string; enabled: boolean }[])
      .filter((e) => e.enabled)
      .map((e) => e.field)
      .filter((f) => sync[f]); // 只保留 sync 中声明的
  }

  // 旧格式：字符串数组
  if (Array.isArray(raw) && typeof raw[0] === 'string') {
    return (raw as string[]).filter((f) => sync[f]);
  }

  return Object.keys(sync);
}

function getFieldValue(child: ComponentSchema): any {
  const charNum = child.props?.charNum;
  const item = charNum ? findAttrItem(charNum) : findItemByChildId(child.id!);
  if (!item) return null;

  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;

  if (sync) {
    const keys = getSyncKeys(child);
    for (const fieldKey of keys) {
      const entry = sync[fieldKey];
      if (entry?.read) {
        return entry.read(item[fieldKey]);
      }
    }
    return item[keys[0]] ?? null;
  }

  return item.charValue ?? null;
}

function setFieldValue(child: ComponentSchema, rawValue: any): void {
  const charNum = child.props?.charNum;

  // 查找或创建对应的 internalArray 项
  let target: Record<string, any> | undefined;
  if (charNum) {
    target = findAttrItem(charNum);
    if (!target) {
      target = { charNum, charValue: null, charDisplay: null, prodordAttachFiles: [] };
      internalArray.value.push(target);
    }
  } else {
    // 没有 charNum 的子组件，用 _childId 关联
    target = findItemByChildId(child.id!);
    if (!target) {
      target = { _childId: child.id, charValue: null };
      internalArray.value.push(target);
    }
  }

  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;

  if (sync) {
    const keys = getSyncKeys(child);

    // 查找标签（用于 charDisplay 同步）
    let matchedLabel: string | null = null;
    const options = child.props?.options ?? [];
    if (Array.isArray(options)) {
      const matched = options.find((o: any) => String(o.value ?? o.code) === String(rawValue));
      if (matched) matchedLabel = matched.label ?? matched.name ?? null;
    }
    // 如果没有在设计时 options 中找到，尝试从 API 定义中查找
    if (!matchedLabel) {
      const def = charNum ? findAttrDef(charNum) : null;
      if (def?.bizCharEnumSpecLst) {
        const matched = def.bizCharEnumSpecLst.find(
          (e: any) => String(e.code ?? e.value) === String(rawValue),
        );
        if (matched) matchedLabel = matched.value ?? matched.label ?? null;
      }
    }

    for (const fieldKey of keys) {
      const entry = sync[fieldKey];
      if (entry) {
        target[fieldKey] = entry.write(rawValue, {
          option: matchedLabel ? { label: matchedLabel } : null,
        });
      }
    }
  } else {
    target.charValue = rawValue;
  }

  if (rawValue == null || rawValue === '') {
    if (sync) {
      const keys = getSyncKeys(child);
      for (const fieldKey of keys) {
        if (fieldKey !== 'charValue') {
          target[fieldKey] = fieldKey === 'prodordAttachFiles' ? [] : null;
        }
      }
    } else {
      target.charDisplay = null;
      target.prodordAttachFiles = [];
    }
  }

  emitOutput();
}

// 为每个子组件构建增强后的 schema（合并 API 定义覆盖）
function getEnhancedSchema(child: ComponentSchema): ComponentSchema {
  const mergedProps = getMergedProps(child);
  const charNum = child.props?.charNum;
  const def = charNum ? findAttrDef(charNum) : null;
  return {
    ...child,
    field: undefined,
    label: def?.charName ?? child.label ?? '',
    props: mergedProps,
    noFormItem: true,
  };
}

const childContext = ref<{ schema: ComponentSchema; child: ComponentSchema }[]>([]);

function rebuildChildContext() {
  childContext.value = children.value.map((c) => ({
    schema: getEnhancedSchema(c),
    child: c,
  }));
}

watch(children, rebuildChildContext, { immediate: true });

/**
 * 运行时按子组件的 props.groupLabel 分组渲染。
 * - 子组件未设 groupLabel -> 归入 '' 组，不渲染分组标题
 * - 子组件设了 groupLabel -> 按值分组，渲染分组标题分隔线
 * - 数据层完全不变，仅影响视觉呈现
 */
/**
 * 判断子组件是否隐藏
 * 属性组内子组件 field 被清空，fieldState 无法匹配，仅判断 props.hidden
 */
function isChildHidden(child: ComponentSchema): boolean {
  return !!child.props?.hidden;
}

/**
 * 运行时按子组件的 props.groupLabel 分组渲染。
 * - 运行模式：过滤隐藏子组件，分组全隐藏时标题也不显示
 * - 数据层完全不变，仅影响视觉呈现
 */
const groupedChildContext = computed(() => {
  const groups: { groupLabel: string; items: { schema: ComponentSchema; child: ComponentSchema }[] }[] = [];
  const groupIndexMap: Record<string, number> = {};

  for (const entry of childContext.value) {
    // 运行模式下跳过隐藏的子组件
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

// 改用 computed 映射，确保每个子组件的值响应式更新（用普通对象，模板中方括号可访问）
const childBindings = computed(() => {
  const map: Record<string, any> = {};
  for (const entry of childContext.value) {
    const charNum = entry.child.props?.charNum;
    const item = charNum
      ? findAttrItem(charNum)
      : findItemByChildId(entry.schema.id!);
    if (!item) {
      map[entry.schema.id!] = null;
      continue;
    }

    const componentConfig = pluginManager.component.getConfigByType(entry.child.type);
    const sync = componentConfig?.attributeSync;

    let value = null;
    if (sync) {
      const keys = getSyncKeys(entry.child);
      for (const fieldKey of keys) {
        const syncEntry = sync[fieldKey];
        if (syncEntry?.read) {
          value = syncEntry.read(item[fieldKey]);
          break;
        }
      }
      if (value === null) {
        value = item[keys[0]] ?? null;
      }
    } else {
      value = item.charValue ?? null;
    }
    map[entry.schema.id!] = value;
  }
  return map;
});

function getMergedProps(child: ComponentSchema): Record<string, any> {
  const charNum = child.props?.charNum;
  const def = charNum ? findAttrDef(charNum) : null;
  const designProps = child.props ?? {};

  const merged: Record<string, any> = {};

  if (def?.charName) merged.label = def.charName;
  if (def?.placeHolder) merged.placeholder = def.placeHolder;
  if (def?.maxLength != null) merged.maxlength = def.maxLength;

  if (def?.bizCharEnumSpecLst && (child.type === 'select' || child.type === 'radio')) {
    merged.options = def.bizCharEnumSpecLst.map((e: any) => ({
      label: e.value,
      value: e.code ?? e.value,
    }));
  }

  const overrides = child.props?.metaOverrides;
  if (overrides) {
    let parsed: any = null;
    if (typeof overrides === 'string') {
      try {
        parsed = JSON.parse(overrides);
      } catch {
        // JSON 格式错误时忽略
      }
    } else if (typeof overrides === 'object') {
      parsed = overrides;
    }
    if (parsed && typeof parsed === 'object') {
      Object.assign(merged, parsed);
    }
  }

  const { charNum: _, syncFields, metaOverrides, ...rest } = designProps;
  return { ...rest, ...merged };
}

// 容器视觉属性
const title = computed(
  () =>
    props.componentSchema?.props?.title ??
    props.componentSchema?.label ??
    '',
);
// hideLabel：隐藏自身标题（预览模式下生效，设计模式保留以便选中/识别）
// const hideLabel = computed(() => !!props.componentSchema?.hideLabel);
const showTitle = computed(() => {
  if (!title.value) return false;
  // if (!isDesignMode.value && hideLabel.value) return false;
  return true;
});
const bordered = computed(
  () => props.componentSchema?.props?.bordered !== false,
);
const collapsible = computed(
  () => !!props.componentSchema?.props?.collapsible,
);
const collapseIconPosition = computed<'left' | 'right'>(
  () => props.componentSchema?.props?.collapseIconPosition ?? 'right',
);
const defaultCollapsed = computed(
  () => !!props.componentSchema?.props?.defaultCollapsed,
);
const collapsed = ref(defaultCollapsed.value);

const labelPosition = computed<'' | 'left' | 'right' | 'top'>(
  () => props.componentSchema?.props?.labelPosition ?? '',
);
const labelWidth = computed<string>(() => {
  // 优先使用自身的 labelWidth
  const w = props.componentSchema?.props?.labelWidth;
  if (w !== undefined && w !== null && w !== '') {
    return typeof w === 'number' ? `${w}px` : String(w);
  }
  // 未设置时从父表单继承
  const formLabelWidth = parentForm.value?.props?.labelWidth;
  if (formLabelWidth !== undefined && formLabelWidth !== null && formLabelWidth !== '') {
    return typeof formLabelWidth === 'number' ? `${formLabelWidth}px` : String(formLabelWidth);
  }
  return '';
});

/**
 * 计算每个子组件 ElFormItem 的 label-width prop
 * - 无标签 / hideLabel / top 布局：'0'（不占标签宽度）
 * - 有显式 labelWidth：使用该值
 * - 无显式 labelWidth：undefined（让 ElFormItem 继承父 ElForm 的 label-width）
 */
function getItemLabelWidth(child: ComponentSchema): string | undefined {
  if (!child.label || child.hideLabel || labelPosition.value === 'top') {
    return '0';
  }
  return labelWidth.value || undefined;
}
const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  if (labelWidth.value) style['--attr-group-label-width'] = labelWidth.value;
  return style;
});

function toggleCollapsed() {
  if (collapsible.value) collapsed.value = !collapsed.value;
}

/**
 * 设计模式下的分组标题注入。
 * edit-node slot 被 EDesigner 的 EpicNodes 拖拽容器填充，无法在 slot 内部插入标题。
 * 通过 DOM 操作在子组件分组边界处插入标题元素。
 */
const designBodyRef = ref<HTMLElement | null>(null);

function injectDesignGroupTitles() {
  if (!isDesignMode.value || !designBodyRef.value) return;

  // 先清除旧标题
  designBodyRef.value.querySelectorAll('.ep-attr-group__subgroup-title').forEach((el) => el.remove());

  // EDesigner 渲染结构：designBodyRef > .ep-draggable-range > .ep-node-item[data-epic-id]
  const draggableRange = designBodyRef.value.querySelector('.ep-draggable-range');
  if (!draggableRange) return;

  // 只处理可见的子组件（设计模式下 showHiddenItems=true 时 ep-hidden 也可见，不跳过）
  const childElements = Array.from(draggableRange.children).filter(
    (el) => !el.classList.contains('ep-attr-group__subgroup-title'),
  );

  let lastGroupLabel = '__inserted__';
  for (const el of childElements) {
    const epicId = el.getAttribute('data-epic-id') || '';
    // 通过 data-epic-id 匹配 children 中的 schema
    const childSchema = children.value.find((c) => c.id === epicId);
    // 隐藏状态由 EpicNode 统一处理（ep-hidden class + ::after 蒙层），这里不重复处理
    const groupLabel = childSchema?.props?.groupLabel || '';

    // 设置 span：将子组件的 props.span 映射到 grid column
    const span = childSchema?.props?.span;
    if (span) {
      (el as HTMLElement).style.gridColumn = `span ${span}`;
    } else {
      (el as HTMLElement).style.gridColumn = '';
    }

    if (groupLabel && groupLabel !== lastGroupLabel) {
      const titleEl = document.createElement('div');
      titleEl.className = 'ep-attr-group__subgroup-title';
      titleEl.textContent = groupLabel;
      draggableRange.insertBefore(titleEl, el);
      lastGroupLabel = groupLabel;
    } else if (!groupLabel) {
      lastGroupLabel = '__inserted__';
    }
  }
}

watch(
  [children, isDesignMode],
  () => {
    if (isDesignMode.value) {
      nextTick(() => injectDesignGroupTitles());
    }
  },
  { immediate: true, deep: true },
);

const gridStyle = computed(() => {
  const p = props.componentSchema?.props;
  if (p?.gridEnable) {
    const cols = p.gridCols ?? 2;
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '16px',
    } as Record<string, string>;
  }
  return {} as Record<string, string>;
});
</script>

<template>
  <div
    class="ep-attr-group"
    :class="{
      'ep-attr-group--bordered': bordered,
      'ep-attr-group--collapsed': collapsed,
    }"
    :data-label-position="labelPosition || undefined"
    :data-has-label-width="labelWidth ? '' : undefined"
    :style="rootStyle"
  >
    <div
      v-if="showTitle"
      class="ep-attr-group__header"
      :class="{ 'ep-attr-group__header--clickable': collapsible }"
      @click="toggleCollapsed"
    >
      <span
        v-if="collapsible && collapseIconPosition === 'left'"
        class="ep-attr-group__arrow ep-attr-group__arrow--left"
      >{{ collapsed ? '▶' : '▼' }}</span>
      <span class="ep-attr-group__title">{{ title }}</span>
      <span
        v-if="collapsible && collapseIconPosition === 'right'"
        class="ep-attr-group__arrow ep-attr-group__arrow--right"
      >{{ collapsed ? '▶' : '▼' }}</span>
    </div>

    <!-- 设计模式：保持原有拖拽能力，通过 DOM 操作插入分组标题 -->
    <div
      v-if="isDesignMode"
      ref="designBodyRef"
      v-show="!collapsed"
      class="ep-attr-group__body"
      :style="gridStyle"
    >
      <slot name="edit-node">
        <slot
          v-for="item in children"
          name="node"
          :component-schema="item"
        ></slot>
      </slot>
    </div>

    <!-- 运行模式：按 groupLabel 分组渲染，隐藏字段不显示，使用 ElFormItem 展示校验错误 -->
    <div v-else v-show="!collapsed" class="ep-attr-group__body" :style="gridStyle">
      <template v-for="group in groupedChildContext" :key="group.groupLabel || '__default__'">
        <div v-if="group.groupLabel" class="ep-attr-group__subgroup-title">
          {{ group.groupLabel }}
        </div>
        <ElFormItem
          v-for="ctx in group.items"
          :key="ctx.schema.id"
          class="ep-attr-group__form-item"
          :class="{ 'ep-hidden': isChildHidden(ctx.child) }"
          :style="ctx.child.props?.span ? { gridColumn: `span ${ctx.child.props.span}` } : undefined"
          :label="ctx.schema.hideLabel ? '' : (ctx.schema.label ?? '')"
          :label-width="getItemLabelWidth(ctx.child)"
          :error="childErrors[ctx.schema.id!]"
          :validate-status="childErrors[ctx.schema.id!] ? 'error' : ''"
          :required="isChildRequired(ctx.child)"
        >
          <EpicNode
            :component-schema="ctx.schema"
            :model-value="childBindings[ctx.schema.id!]"
            @update:model-value="(val: any) => handleFieldChange(ctx.child, val)"
            @blur="() => handleFieldBlur(ctx.child)"
          />
        </ElFormItem>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-attr-group {
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

  &:deep(.ep-attr-group__body > .ep-draggable-range) {
    display: contents !important;
  }

  /* 设计模式下分组标题在 draggable-range 内，确保 grid 布局生效 */
  &:deep(.ep-draggable-range .ep-attr-group__subgroup-title) {
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
}
</style>
