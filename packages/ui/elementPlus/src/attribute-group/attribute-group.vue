<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed, inject, onMounted, provide, ref, watch } from 'vue';

import { EpicNode } from '@ies/base-ui';
import {
  ATTRIBUTE_GROUP_CTX_KEY,
  ATTRIBUTE_META_KEY,
  useFormItem,
  usePageManager,
} from '@ies/designer';
import { pluginManager } from '@ies/manager';
import { deepEqual } from '@ies/utils';

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

const allMeta = inject(ATTRIBUTE_META_KEY, computed(() => ({})));
const attrDefs = computed(() => allMeta.value[field.value] ?? []);

const children = computed(() => props.componentSchema?.children ?? []);

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
let lastEmitted: any[] = [];

function buildOutput(): any[] {
  return internalArray.value.map((item) => {
    const merged = { ...item };
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

function initFromModelValue(arr: any[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    // 没有外部数据时，根据子组件的 charNum 初始化空项
    internalArray.value = children.value
      .filter((c) => c.props?.charNum)
      .map((c) => ({
        charNum: c.props.charNum,
        charValue: null,
        charDisplay: null,
        prodordAttachFiles: [],
      }));
    lastEmitted = buildOutput();
    return;
  }
  internalArray.value = arr.map((item) => ({ ...item }));
  lastEmitted = buildOutput();
}

// 外部 modelValue 变化 -> 初始化（跳过 echo）
watch(
  () => props.modelValue,
  (arr) => {
    if (deepEqual(arr, lastEmitted)) return;
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

function findAttrDef(charNum: string) {
  return attrDefs.value.find((d: any) => String(d.charNum) === String(charNum));
}

function findAttrItem(charNum: string) {
  return internalArray.value.find(
    (d: any) => String(d.charNum) === String(charNum),
  );
}

function getFieldValue(child: ComponentSchema): any {
  const charNum = child.props?.charNum;
  if (!charNum) return undefined;
  const item = findAttrItem(charNum);
  if (!item) return null;

  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;

  const syncFields = child.props?.syncFields as string[] | undefined;

  if (sync) {
    const keys = syncFields && syncFields.length > 0
      ? syncFields
      : Object.keys(sync);
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
  if (!charNum) return;
  const item = findAttrItem(charNum);
  if (!item) return;

  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;

  const syncFields = child.props?.syncFields as string[] | undefined;

  if (sync) {
    const keys = syncFields && syncFields.length > 0
      ? syncFields
      : Object.keys(sync);

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
        item[fieldKey] = entry.write(rawValue, {
          option: matchedLabel ? { label: matchedLabel } : null,
        });
      }
    }
  } else {
    item.charValue = rawValue;
  }

  if (rawValue == null || rawValue === '') {
    if (sync) {
      const keys = syncFields && syncFields.length > 0
        ? syncFields
        : Object.keys(sync);
      for (const fieldKey of keys) {
        if (fieldKey !== 'charValue') {
          item[fieldKey] = fieldKey === 'prodordAttachFiles' ? [] : null;
        }
      }
    } else {
      item.charDisplay = null;
      item.prodordAttachFiles = [];
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
  childContext.value = children.value
    .filter((c) => c.props?.charNum)
    .map((c) => ({
      schema: getEnhancedSchema(c),
      child: c,
    }));
}

watch(children, rebuildChildContext, { immediate: true });

// 改用 computed 映射，确保每个子组件的值响应式更新
const childBindings = computed(() => {
  const map = new Map<string, any>();
  for (const entry of childContext.value) {
    const charNum = entry.child.props?.charNum;
    if (!charNum) continue;
    const item = findAttrItem(charNum);
    if (!item) {
      map.set(entry.schema.id!, null);
      continue;
    }

    const componentConfig = pluginManager.component.getConfigByType(entry.child.type);
    const sync = componentConfig?.attributeSync;
    const syncFields = entry.child.props?.syncFields as string[] | undefined;

    let value = null;
    if (sync) {
      const keys = syncFields && syncFields.length > 0
        ? syncFields
        : Object.keys(sync);
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
    map.set(entry.schema.id!, value);
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
  if (overrides && typeof overrides === 'object') {
    Object.assign(merged, overrides);
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
  const w = props.componentSchema?.props?.labelWidth;
  if (w === undefined || w === null || w === '') return '';
  return typeof w === 'number' ? `${w}px` : String(w);
});
const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  if (labelWidth.value) style['--attr-group-label-width'] = labelWidth.value;
  return style;
});

function toggleCollapsed() {
  if (collapsible.value) collapsed.value = !collapsed.value;
}

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
      v-if="title || collapsible"
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

    <!-- 设计模式：标准 EpNode 拖拽渲染 -->
    <div v-if="isDesignMode" v-show="!collapsed" class="ep-attr-group__body" :style="gridStyle">
      <slot name="edit-node">
        <slot
          v-for="item in children"
          name="node"
          :component-schema="item"
        ></slot>
      </slot>
    </div>

    <!-- 运行模式 -->
    <div v-else v-show="!collapsed" class="ep-attr-group__body" :style="gridStyle">
      <div v-for="ctx in childContext" :key="ctx.schema.id" class="ep-attr-group__field">
        <label v-if="ctx.schema.label" class="ep-attr-group__field-label">
          {{ ctx.schema.label }}
        </label>
        <div class="ep-attr-group__field-control">
          <EpicNode
            :component-schema="ctx.schema"
            :model-value="childBindings[ctx.schema.id!]"
            @update:model-value="(val: any) => setFieldValue(ctx.child, val)"
          />
        </div>
      </div>
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
    padding: 12px;
    min-height: 40px;
  }

  &:deep(.ep-attr-group__body > .ep-draggable-range) {
    display: contents !important;
  }

  &__field {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  &__field-label {
    flex-shrink: 0;
    text-align: right;
    padding-right: 12px;
    line-height: 32px;
    font-size: 14px;
    color: var(--el-text-color-regular, #606266);
  }

  &[data-has-label-width] &__field-label {
    width: var(--attr-group-label-width) !important;
  }

  &__field-control {
    flex: 1;
    min-width: 0;
  }

  &[data-label-position='top'] &__field {
    flex-direction: column;
    align-items: stretch;
  }

  &[data-label-position='top'] &__field-label {
    text-align: left;
    padding-right: 0;
    margin-bottom: 4px;
    line-height: 1.4;
  }
}
</style>
