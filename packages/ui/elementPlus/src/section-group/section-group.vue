<script lang="ts" setup>
import type { ComponentSchema } from '@ies/designer';

import { computed, inject, nextTick, provide, ref, watch } from 'vue';

import { ElFormItem } from 'element-plus';
import { EpicNode } from '@ies/base-ui';
import {
  SECTION_GROUP_CTX_KEY,
  useFormItem,
  usePageManager,
} from '@ies/designer';
import { pluginManager } from '@ies/manager';
import { deepEqual, getValueByPath } from '@ies/utils';

import { useContainerValidate } from '../common/useContainerValidate';

defineOptions({
  name: 'EpSectionGroup',
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
const keyField = computed(
  () => props.componentSchema?.props?.keyField ?? 'skuNum',
);
const selectionField = computed(
  () => props.componentSchema?.props?.selectionField ?? '',
);

const children = computed(() => props.componentSchema?.children ?? []);

// ========== 容器校验 ==========
const { childErrors, validateField, validateAll, clearValidate } = useContainerValidate({
  getValidator: (name: string) => pageManager.funcs.value[name],
});

/**
 * 判断子组件是否为容器组件（不需要 ElFormItem 包裹）
 */
function isContainerChild(child: ComponentSchema): boolean {
  return child.type === 'attribute-group'
    || child.type === 'section-group'
    || child.type === 'card'
    || child.type === 'sub-form';
}

/**
 * 判断子组件是否必填（用于 ElFormItem 的 required 星号显示）
 */
function isChildRequired(child: ComponentSchema): boolean {
  if (child.props?.required) return true;
  if (!child.rules) return false;
  return (child.rules as any[]).some((r) => r.required === true);
}

/**
 * 获取指定区块内子组件的值
 * @param tplChild section-template 的子组件
 * @param item 区块数据对象
 */
function getChildValue(tplChild: ComponentSchema, item: Record<string, any> | null): any {
  if (!item) return null;
  return item[tplChild.field ?? ''] ?? null;
}

/**
 * 字段值变化处理：更新值后触发 change 校验
 */
function handleFieldChange(tplChild: ComponentSchema, item: Record<string, any>, fieldKey: string, val: any) {
  item[fieldKey] = val;
  emitOutput();
  // 仅对非容器、有 rules 的子组件在运行模式下触发校验
  if (!isDesignMode.value && !isContainerChild(tplChild) && tplChild.rules?.length) {
    validateField(tplChild, val, 'change');
  }
}

/**
 * 字段失焦处理：触发 blur 校验
 */
function handleFieldBlur(tplChild: ComponentSchema, item: Record<string, any>) {
  if (!isDesignMode.value && !isContainerChild(tplChild) && tplChild.rules?.length) {
    validateField(tplChild, getChildValue(tplChild, item), 'blur');
  }
}

/**
 * 校验本区块组内所有可见字段（供 form.validate 调用）
 */
async function validate(): Promise<void> {
  if (isDesignMode.value) return;
  // 先清除所有校验状态
  clearValidate();
  // 收集所有可见的非容器子组件进行校验
  const allFields: { child: ComponentSchema; getValue: () => any }[] = [];
  internalData.value.forEach((item, i) => {
    if (!item) return;
    const tpl = children.value[i];
    if (!tpl) return;
    (tpl.children ?? []).forEach((tplChild) => {
      // card 容器：展开子组件进行校验
      if (tplChild.type === 'card') {
        (tplChild.children ?? []).forEach((cardChild) => {
          if (isContainerChild(cardChild)) return;
          allFields.push({
            child: cardChild,
            getValue: () => getChildValue(cardChild, item),
          });
        });
        return;
      }
      if (isContainerChild(tplChild)) return;
      allFields.push({
        child: tplChild,
        getValue: () => getChildValue(tplChild, item),
      });
    });
  });

  const errors: { id: string; message: string; label?: string }[] = [];
  for (const { child, getValue } of allFields) {
    if (!child.id || !child.rules?.length) continue;
    const err = await validateField(child, getValue());
    if (err) {
      errors.push({ id: child.id!, message: err, label: child.label });
    }
  }

  if (errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

defineExpose({
  validate,
  clearValidate: () => clearValidate(),
  __isContainerValidate: true,
});
// ========== /容器校验 ==========

// 内部数据：固定长度 = children.length，null = 隐藏
const internalData = ref<(Record<string, any> | null)[]>([]);

// 上次 emit 的快照，用于跳过 EpNode 回写引发的 echo
let lastEmitted: any[] = [];

/**
 * 解析 groupMeta 配置（支持对象或 JSON 字符串），注入到每个输出项中。
 * 用于自动补充 skuNum / productType 等固定元数据，避免子组件手动维护。
 */
function parseGroupMeta(): Record<string, any> {
  const raw = props.componentSchema?.props?.groupMeta;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' ? raw : {};
}

function buildOutput(): any[] {
  const groupMeta = parseGroupMeta();
  const kField = keyField.value;
  return internalData.value
    .map((item, i) => {
      if (item === null) return null;
      // 注入 optionKey 作为 keyField 值（如 skuNum），再合并 groupMeta，最后是用户数据
      const optKey = children.value[i]?.optionKey ?? children.value[i]?.props?.optionKey ?? '';
      return { ...(kField ? { [kField]: optKey } : {}), ...groupMeta, ...item };
    })
    .filter((item): item is Record<string, any> => item !== null);
}

function emitOutput() {
  const output = buildOutput();
  // 只在数据真正变化时 emit，跳过回写 echo
  if (deepEqual(output, lastEmitted)) return;
  lastEmitted = output;
  emit('update:modelValue', output);
}

function initFromModelValue(arr: any[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    internalData.value = children.value.map(() => null);
    lastEmitted = [];
    return;
  }
  internalData.value = children.value.map((tpl) => {
    const optKey = tpl.optionKey ?? tpl.props?.optionKey ?? '';
    const match = arr.find(
      (d: any) => String(d[keyField.value]) === String(optKey),
    );
    return match ? { ...match } : null;
  });
  lastEmitted = buildOutput();
}

// 外部 modelValue 变化 -> 初始化内部数据（setData 回填场景）
// 用 deepEqual 跳过 EpNode 回写引发的 echo
watch(
  () => props.modelValue,
  (arr) => {
    if (deepEqual(arr, lastEmitted)) return;
    initFromModelValue(arr ?? []);
  },
  { immediate: true, deep: true },
);

// 监听选择字段变化 -> 控制显隐
// selectionField 支持点号嵌套路径（如 "prodordSkus.0.selectedTemplateNums"），
// 也兼容原来的顶层一级路径（如 "selectedOffers"），getValueByPath 对单段路径等价于直接读取。
watch(
  () => {
    if (!selectionField.value) return undefined;
    return getValueByPath(formData, selectionField.value);
  },
  (selected: any) => {
    if (!selectionField.value) return;
    // 兼容 checkbox（数组）和 radio（单值）两种选择方式
    const selectedArray: string[] = Array.isArray(selected)
      ? selected
      : selected != null && selected !== ''
        ? [String(selected)]
        : [];

    let didChange = false;

    children.value.forEach((tpl, i) => {
      const optKey = tpl.optionKey ?? tpl.props?.optionKey ?? '';
      const isSelected = selectedArray.includes(String(optKey));
      const wasNull = internalData.value[i] === null;

      if (isSelected && wasNull) {
        // 优先从 props.modelValue 查找全量数据，避免时序竞争导致数据覆盖
        const fullModel = props.modelValue ?? [];
        const modelMatch = fullModel.length > 0
          ? fullModel.find(
              (d: any) => String(d[keyField.value]) === String(optKey),
            )
          : undefined;
        internalData.value[i] = modelMatch
          ? { ...modelMatch }
          : { ...(tpl.props?.optionData ?? {}) };
        didChange = true;
        // 区块变为可见时，清除该区块内子组件的旧校验错误
        (tpl.children ?? []).forEach((tplChild) => {
          if (tplChild.type === 'card') {
            (tplChild.children ?? []).forEach((cardChild) => {
              if (cardChild.id && !isContainerChild(cardChild)) {
                delete childErrors.value[cardChild.id];
              }
            });
            return;
          }
          if (tplChild.id && !isContainerChild(tplChild)) {
            delete childErrors.value[tplChild.id];
          }
        });
      } else if (!isSelected && !wasNull) {
        internalData.value[i] = null;
        didChange = true;
        // 区块隐藏时，清除该区块内子组件的校验错误
        (tpl.children ?? []).forEach((tplChild) => {
          if (tplChild.type === 'card') {
            (tplChild.children ?? []).forEach((cardChild) => {
              if (cardChild.id && !isContainerChild(cardChild)) {
                delete childErrors.value[cardChild.id];
              }
            });
            return;
          }
          if (tplChild.id && !isContainerChild(tplChild)) {
            delete childErrors.value[tplChild.id];
          }
        });
      }
    });

    // 仅在显隐状态实际变化时 emit，用 nextTick 让 modelValue watch 优先完成
    if (didChange) {
      nextTick(() => emitOutput());
    }
  },
  { deep: true },
);

// 不再 watch(internalData) 自动 emit
// 用户编辑子组件时通过 getFieldProxy 的 setter 显式调用 emitOutput

// 设计时上下文
if (isDesignMode.value) {
  provide(SECTION_GROUP_CTX_KEY, {
    groupField: field.value,
    isTemplate: true,
  });
}

// 区块标题
function getSectionLabel(tpl: ComponentSchema): string {
  return tpl.label ?? tpl.props?.optionKey ?? tpl.optionKey ?? '';
}

// 运行时：为每个区块构建子组件的增强 schema
// 清空 field 防止 EpNode 走 formData 读写
function getRowChildSchema(child: ComponentSchema): ComponentSchema {
  return {
    ...child,
    field: undefined,
    noFormItem: true,
  };
}

// 为每个可见区块预构建子组件 schema 列表
const rowSchemas = computed(() => {
  return internalData.value.map((item, i) => {
    if (!item) return [];
    const tpl = children.value[i];
    return (tpl?.children ?? []).map((child) => ({
      schema: getRowChildSchema(child),
      fieldKey: child.field ?? '',
      child, // 保留原始 child schema 用于校验判断
    }));
  });
});

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
const collapsed = ref(false);

function toggleCollapsed() {
  if (collapsible.value) collapsed.value = !collapsed.value;
}

const visibleCount = computed(
  () => internalData.value.filter((item) => item !== null).length,
);
</script>

<template>
  <div
    class="ep-section-group"
    :class="{ 'ep-section-group--bordered': bordered }"
  >
    <div
      v-if="title"
      class="ep-section-group__header"
      :class="{ 'ep-section-group__header--clickable': collapsible }"
      @click="toggleCollapsed"
    >
      <span class="ep-section-group__title">{{ title }}</span>
      <span v-if="!isDesignMode" class="ep-section-group__count">
        共 {{ visibleCount }} 项
      </span>
      <span v-if="collapsible" class="ep-section-group__arrow">
        {{ collapsed ? '▶' : '▼' }}
      </span>
    </div>

    <!-- 设计模式：标准 EpNode 拖拽渲染 -->
    <div v-if="isDesignMode" v-show="!collapsed" class="ep-section-group__body">
      <slot name="edit-node">
        <slot
          v-for="item in children"
          name="node"
          :component-schema="item"
        ></slot>
      </slot>
    </div>

    <!-- 运行模式：用 EpNode 渲染，非容器子组件使用 ElFormItem 展示校验错误 -->
    <div v-else v-show="!collapsed" class="ep-section-group__body">
      <template v-for="(item, i) in internalData" :key="i">
        <div v-if="item && rowSchemas[i]" class="ep-section-group__card">
          <div class="ep-section-group__card-header">
            {{ getSectionLabel(children[i]) }}
          </div>
          <div class="ep-section-group__card-body">
            <template v-for="entry in rowSchemas[i]" :key="entry.schema.id">
              <!-- card 视觉容器：展开子组件，数据绑定到 item 而非 formData -->
              <template v-if="entry.child.type === 'card'">
                <div
                  v-if="!entry.child.props?.hidden"
                  class="ep-section-group__form-card"
                >
                  <div
                    v-if="entry.child.label"
                    class="ep-section-group__form-card__header"
                  >
                    {{ entry.child.label }}
                  </div>
                  <div class="ep-section-group__form-card__body">
                    <template v-for="cardChild in (entry.child.children ?? [])" :key="cardChild.id">
                      <!-- card 内嵌容器子组件 -->
                      <template v-if="isContainerChild(cardChild)">
                        <EpicNode
                          :component-schema="getRowChildSchema(cardChild)"
                          :model-value="item[cardChild.field ?? '']"
                          @update:model-value="(val: any) => { item[cardChild.field ?? ''] = val; emitOutput() }"
                        />
                      </template>
                      <!-- card 内非容器子组件 -->
                      <ElFormItem
                        v-else
                        class="ep-section-group__form-item"
                        :label="cardChild.hideLabel ? '' : (cardChild.label || '')"
                        label-width="auto"
                        :error="childErrors[cardChild.id!]"
                        :validate-status="childErrors[cardChild.id!] ? 'error' : ''"
                        :required="isChildRequired(cardChild)"
                      >
                        <EpicNode
                          :component-schema="getRowChildSchema(cardChild)"
                          :model-value="item[cardChild.field ?? '']"
                          @update:model-value="(val: any) => handleFieldChange(cardChild, item, cardChild.field ?? '', val)"
                          @blur="() => handleFieldBlur(cardChild, item)"
                        />
                      </ElFormItem>
                    </template>
                  </div>
                </div>
              </template>
              <!-- 容器子组件（如 attribute-group）：直接渲染，由容器自身管理校验 -->
              <template v-else-if="isContainerChild(entry.child)">
                <EpicNode
                  :component-schema="entry.schema"
                  :model-value="item[entry.fieldKey]"
                  @update:model-value="(val: any) => { item[entry.fieldKey] = val; emitOutput() }"
                />
              </template>
              <!-- 非容器输入子组件：用 ElFormItem 包裹以展示校验错误 -->
              <ElFormItem
                v-else
                class="ep-section-group__form-item"
                :label="entry.schema.hideLabel ? '' : (entry.schema.label || '')"
                label-width="auto"
                :error="childErrors[entry.schema.id!]"
                :validate-status="childErrors[entry.schema.id!] ? 'error' : ''"
                :required="isChildRequired(entry.child)"
              >
                <EpicNode
                  :component-schema="entry.schema"
                  :model-value="item[entry.fieldKey]"
                  @update:model-value="(val: any) => handleFieldChange(entry.child, item, entry.fieldKey, val)"
                  @blur="() => handleFieldBlur(entry.child, item)"
                />
              </ElFormItem>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ep-section-group {
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

  &__count {
    font-size: 12px;
    color: var(--el-text-color-secondary, #909399);
  }

  &__arrow {
    font-size: 10px;
    color: var(--el-text-color-secondary, #909399);
    flex-shrink: 0;
  }

  &__body {
    min-height: 40px;
  }

  &:deep(.ep-section-group__body > .ep-draggable-range) {
    display: contents !important;
  }

  &__card {
    border: 1px solid var(--el-border-color-lighter, #ebeef5);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__card-header {
    padding: 8px 12px;
    font-weight: 500;
    font-size: 14px;
    color: var(--el-text-color-primary, #303133);
    background: var(--el-fill-color-lighter, #fafafa);
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
  }

  &__card-body {
    padding: 12px;
  }

  /* 内嵌 card 视觉容器（纯视觉包装，不参与数据管理） */
  &__form-card {
    border: 1px solid var(--el-border-color-lighter, #ebeef5);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }

    &__header {
      padding: 8px 12px;
      font-weight: 500;
      font-size: 14px;
      color: var(--el-text-color-primary, #303133);
      background: var(--el-fill-color-lighter, #fafafa);
      border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
    }

    &__body {
      padding: 12px;
    }
  }

  /* 运行模式：非容器子组件的 ElFormItem 样式 */
  &__form-item {
    margin-bottom: 12px;

    :deep(.el-form-item__label) {
      flex-shrink: 0;
      text-align: right;
      padding-right: 12px;
      line-height: 32px;
      font-size: 14px;
      color: var(--el-text-color-regular, #606266);
      min-width: 80px;
    }

    :deep(.el-form-item__content) {
      flex: 1;
      min-width: 0;
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
}
</style>
