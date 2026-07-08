<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed, inject, onMounted, provide, ref, watch } from 'vue';

import {
  ATTRIBUTE_GROUP_CTX_KEY,
  ATTRIBUTE_META_KEY,
  useFormItem,
  usePageManager,
} from '@ies/designer';
import { pluginManager } from '@ies/manager';

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

function initFromModelValue(arr: any[]) {
  if (!Array.isArray(arr)) {
    internalArray.value = [];
    return;
  }
  internalArray.value = arr.map((item) => ({ ...item }));
}

watch(
  () => props.modelValue,
  (arr) => {
    initFromModelValue(arr ?? []);
  },
  { immediate: true, deep: true },
);

watch(
  internalArray,
  (val) => {
    const output = val.map((item) => {
      const merged = { ...item };
      for (const [k, v] of Object.entries(groupMeta.value)) {
        if (!(k in merged)) merged[k] = v;
      }
      return merged;
    });
    emit('update:modelValue', output);
  },
  { deep: true },
);

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
  const bindAttr = child.props?.bindAttribute;
  if (!bindAttr) return undefined;
  const item = findAttrItem(bindAttr);
  return item?.charValue ?? null;
}

function setFieldValue(child: ComponentSchema, rawValue: any): void {
  const bindAttr = child.props?.bindAttribute;
  if (!bindAttr) return;
  const item = findAttrItem(bindAttr);
  if (!item) return;

  const componentConfig = pluginManager.component.getConfigByType(child.type);
  const sync = componentConfig?.attributeSync;

  if (sync) {
    for (const [fieldKey, derive] of Object.entries(sync)) {
      item[fieldKey] = (derive as Function)(rawValue, { option: null });
    }
  } else {
    item.charValue = rawValue;
  }

  if (rawValue == null || rawValue === '') {
    if (sync) {
      for (const fieldKey of Object.keys(sync)) {
        if (fieldKey !== 'charValue') {
          item[fieldKey] = fieldKey === 'prodordAttachFiles' ? [] : null;
        }
      }
    } else {
      item.charDisplay = null;
      item.prodordAttachFiles = [];
    }
  }
}

function getFieldProxy(child: ComponentSchema) {
  return computed({
    get: () => getFieldValue(child),
    set: (val: any) => setFieldValue(child, val),
  });
}

function getMergedProps(child: ComponentSchema): Record<string, any> {
  const bindAttr = child.props?.bindAttribute;
  const def = bindAttr ? findAttrDef(bindAttr) : null;
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

  const { bindAttribute, syncFields, metaOverrides, ...rest } = designProps;
  return { ...rest, ...merged };
}

function resolveComponent(type: string) {
  const cmp = pluginManager.component.get(type);
  return cmp;
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

    <!-- 运行模式：自管理渲染 -->
    <div v-else v-show="!collapsed" class="ep-attr-group__body" :style="gridStyle">
      <template v-for="child in children" :key="child.id">
        <div v-if="child.props?.bindAttribute" class="ep-attr-group__field">
          <label class="ep-attr-group__field-label">
            {{ getMergedProps(child).label ?? child.label ?? '' }}
          </label>
          <div class="ep-attr-group__field-control">
            <component
              :is="resolveComponent(child.type)"
              v-model="getFieldProxy(child).value"
              v-bind="getMergedProps(child)"
            />
          </div>
        </div>
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
