import type { ComponentSchema } from '@ies/types';

import { computed, reactive, ref, watch } from 'vue';

import { deepCompareAndModify, deepClone } from '@ies/utils';

import type {
  DesignerMode,
  FieldOverride,
  MultiViewContext,
  MultiViewPageSchema,
  ViewConfig,
  ViewTypeConfig,
} from '../types';
import { hasAnyOverride } from './useViewSchema';

/**
 * 默认视图类型预设
 */
const DEFAULT_VIEW_TYPES: ViewTypeConfig[] = [
  { id: 'create', name: '创建' },
  { id: 'detail', name: '查看' },
  { id: 'approve', name: '审批' },
];

/**
 * 多视图设计器核心状态管理
 *
 * 管理：模式切换、视图增删切换、字段显隐、覆盖属性读写
 *
 * @param externalPageSchema 外部传入的 pageSchema（通常来自 pageManager.pageSchema）
 * @param initialSchema 初始数据（仅用于初始化 viewTypes/viewConfigs，schemas 由 externalPageSchema 管理）
 */
export function useViewDesigner(
  externalPageSchema: MultiViewPageSchema,
  initialSchema?: MultiViewPageSchema,
) {
  // 使用外部传入的 pageSchema 作为唯一数据源
  const pageSchema = ref<MultiViewPageSchema>(externalPageSchema);

  // 从 initialSchema 初始化 viewTypes/viewConfigs（如果传入了的话）
  const schemaForInit = initialSchema ?? externalPageSchema;

  // ── 模式 ──
  const mode = ref<DesignerMode>('model');

  // ── 视图类型列表 ──
  const viewTypes = ref<ViewTypeConfig[]>(
    schemaForInit.viewTypes
      ? [...schemaForInit.viewTypes]
      : [...DEFAULT_VIEW_TYPES],
  );

  // ── 当前选中的视图ID ──
  const currentViewId = ref<string | null>(
    viewTypes.value[0]?.id ?? null,
  );

  // ── 视图配置映射 ──
  const viewConfigs = reactive<Record<string, ViewConfig>>({});

  // 初始化视图配置
  if (schemaForInit.viewConfigs) {
    for (const [key, val] of Object.entries(schemaForInit.viewConfigs)) {
      viewConfigs[key] = {
        layout: [...val.layout],
        fieldOverrides: val.fieldOverrides
          ? JSON.parse(JSON.stringify(val.fieldOverrides))
          : {},
      };
    }
  }

  // 同步 pageSchema 中的 viewTypes 和 viewConfigs
  watch(
    [viewTypes, viewConfigs],
    () => {
      pageSchema.value.viewTypes = viewTypes.value.map((v) => ({ ...v }));
      pageSchema.value.viewConfigs = {};
      for (const [key, val] of Object.entries(viewConfigs)) {
        pageSchema.value.viewConfigs[key] = {
          layout: [...val.layout],
          fieldOverrides: val.fieldOverrides
            ? JSON.parse(JSON.stringify(val.fieldOverrides))
            : undefined,
        };
      }
    },
    { deep: true },
  );

  // ── 当前选中的字段 ──
  const selectedField = ref<ComponentSchema | null>(null);

  // ── 当前视图配置（computed）──
  const currentViewConfig = computed<ViewConfig | null>(() => {
    if (!currentViewId.value) return null;
    return viewConfigs[currentViewId.value] ?? null;
  });

  // ── 表单的所有字段（数据模型）──
  const allFields = computed<ComponentSchema[]>(() => {
    const formNode = pageSchema.value.schemas?.[0];
    return formNode?.children ?? [];
  });

  // ════════════════════════════════════════
  //  模式切换
  // ════════════════════════════════════════

  function setMode(newMode: DesignerMode) {
    mode.value = newMode;
  }

  // ════════════════════════════════════════
  //  视图类型增删切换
  // ════════════════════════════════════════

  function switchView(viewId: string) {
    currentViewId.value = viewId;
  }

  function addViewType(name: string) {
    const id = `view_${Date.now()}`;
    const newType: ViewTypeConfig = { id, name };
    viewTypes.value.push(newType);
    // 自动为该视图创建空配置
    viewConfigs[id] = { layout: [], fieldOverrides: {} };
    currentViewId.value = id;
  }

  function removeViewType(id: string) {
    const index = viewTypes.value.findIndex((v) => v.id === id);
    if (index === -1) return;

    viewTypes.value.splice(index, 1);
    delete viewConfigs[id];

    // 如果删除的是当前视图，切换到第一个
    if (currentViewId.value === id) {
      currentViewId.value = viewTypes.value[0]?.id ?? null;
    }
  }

  function renameViewType(id: string, name: string) {
    const vt = viewTypes.value.find((v) => v.id === id);
    if (vt) {
      vt.name = name;
    }
  }

  // ════════════════════════════════════════
  //  字段显隐 / 排序
  // ════════════════════════════════════════

  function ensureViewConfig(viewId: string): ViewConfig {
    if (!viewConfigs[viewId]) {
      viewConfigs[viewId] = { layout: [], fieldOverrides: {} };
    }
    return viewConfigs[viewId];
  }

  function toggleFieldInLayout(fieldId: string) {
    if (!currentViewId.value) return;
    const config = ensureViewConfig(currentViewId.value);
    const index = config.layout.indexOf(fieldId);
    if (index === -1) {
      config.layout.push(fieldId);
    } else {
      config.layout.splice(index, 1);
      // 移出视图时清除选中
      if (selectedField.value?.id === fieldId) {
        selectedField.value = null;
      }
    }
  }

  function moveField(fieldId: string, direction: 'up' | 'down') {
    if (!currentViewId.value) return;
    const config = ensureViewConfig(currentViewId.value);
    const index = config.layout.indexOf(fieldId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [config.layout[index], config.layout[index - 1]] = [
        config.layout[index - 1],
        config.layout[index],
      ];
    } else if (direction === 'down' && index < config.layout.length - 1) {
      [config.layout[index], config.layout[index + 1]] = [
        config.layout[index + 1],
        config.layout[index],
      ];
    }
  }

  function isFieldInLayout(fieldId: string): boolean {
    if (!currentViewId.value) return false;
    const config = viewConfigs[currentViewId.value];
    return config?.layout.includes(fieldId) ?? false;
  }

  function getCurrentViewFields(): ComponentSchema[] {
    if (!currentViewId.value) return [];
    const config = viewConfigs[currentViewId.value];
    if (!config) return [];
    return config.layout
      .map((id) => allFields.value.find((f) => f.id === id))
      .filter((f): f is ComponentSchema => !!f);
  }

  // ════════════════════════════════════════
  //  字段选中
  // ════════════════════════════════════════

  function setSelectedField(field: ComponentSchema | null) {
    selectedField.value = field;
  }

  // ════════════════════════════════════════
  //  字段覆盖属性读写
  // ════════════════════════════════════════

  function getFieldOverride(fieldId: string): FieldOverride | undefined {
    if (!currentViewId.value) return undefined;
    const config = ensureViewConfig(currentViewId.value);
    return config.fieldOverrides?.[fieldId];
  }

  function setFieldOverride(
    fieldId: string,
    override: Partial<FieldOverride>,
  ) {
    if (!currentViewId.value) return;
    const config = ensureViewConfig(currentViewId.value);
    if (!config.fieldOverrides) {
      config.fieldOverrides = {};
    }
    const existing = config.fieldOverrides[fieldId] ?? {};
    config.fieldOverrides[fieldId] = { ...existing, ...override };
  }

  function resetFieldOverride(fieldId: string, fieldPath: string) {
    if (!currentViewId.value) return;
    const config = viewConfigs[currentViewId.value];
    if (!config?.fieldOverrides?.[fieldId]) return;

    const override = config.fieldOverrides[fieldId];

    if (fieldPath === 'widgetType') {
      delete override.widgetType;
    } else if (fieldPath.startsWith('props.')) {
      const propKey = fieldPath.slice('props.'.length);
      delete override.props?.[propKey];
      if (override.props && Object.keys(override.props).length === 0) {
        delete override.props;
      }
    } else {
      delete (override as any)[fieldPath];
    }

    // 如果没有覆盖了，清理
    if (!hasAnyOverride(override)) {
      delete config.fieldOverrides[fieldId];
    }
  }

  function resetAllOverrides(fieldId: string) {
    if (!currentViewId.value) return;
    const config = viewConfigs[currentViewId.value];
    if (config?.fieldOverrides) {
      delete config.fieldOverrides[fieldId];
    }
  }

  // ════════════════════════════════════════
  //  数据导入/导出
  // ════════════════════════════════════════

  function setData(schema: MultiViewPageSchema) {
    // 使用 deepCompareAndModify 保持响应式引用不变
    // 这样 pageManager.pageSchema 和 pageSchema.value 始终指向同一对象
    deepCompareAndModify(pageSchema.value as any, deepClone(schema));
    if (schema.viewTypes) {
      viewTypes.value = schema.viewTypes.map((v) => ({ ...v }));
    }
    if (schema.viewConfigs) {
      // 清空再写入
      for (const key of Object.keys(viewConfigs)) {
        delete viewConfigs[key];
      }
      for (const [key, val] of Object.entries(schema.viewConfigs)) {
        viewConfigs[key] = {
          layout: [...val.layout],
          fieldOverrides: val.fieldOverrides
            ? JSON.parse(JSON.stringify(val.fieldOverrides))
            : {},
        };
      }
    }
    currentViewId.value = viewTypes.value[0]?.id ?? null;
    selectedField.value = null;
  }

  function getData(): MultiViewPageSchema {
    return pageSchema.value;
  }

  // ════════════════════════════════════════
  //  保存 / 预览（占位，由外部组件传入回调）
  // ════════════════════════════════════════

  let saveCallback: (() => void) | null = null;
  let previewCallback: (() => void) | null = null;

  function onSave(cb: () => void) {
    saveCallback = cb;
  }

  function onPreview(cb: () => void) {
    previewCallback = cb;
  }

  function save() {
    saveCallback?.();
  }

  function preview() {
    previewCallback?.();
  }

  // ════════════════════════════════════════
  //  构建上下文
  // ════════════════════════════════════════

  const context: MultiViewContext = {
    mode: mode.value,
    currentViewId: currentViewId.value,
    viewTypes: viewTypes.value,
    viewConfigs,
    pageSchema: pageSchema.value,
    selectedField: selectedField.value,

    setMode,
    switchView,
    addViewType,
    removeViewType,
    renameViewType,

    toggleFieldInLayout,
    moveField,
    setSelectedField,

    getFieldOverride,
    setFieldOverride,
    resetFieldOverride,
    resetAllOverrides,

    isFieldInLayout,
    getCurrentViewFields,

    save,
    preview,
  };

  // 保持 context 的属性同步
  watch([mode, currentViewId, viewTypes, selectedField, pageSchema], () => {
    context.mode = mode.value;
    context.currentViewId = currentViewId.value;
    context.viewTypes = viewTypes.value;
    context.selectedField = selectedField.value;
    context.pageSchema = pageSchema.value;
  });

  return {
    // 状态
    mode,
    currentViewId,
    viewTypes,
    viewConfigs,
    currentViewConfig,
    pageSchema,
    selectedField,
    allFields,
    context,
    // 操作
    setMode,
    switchView,
    addViewType,
    removeViewType,
    renameViewType,
    toggleFieldInLayout,
    moveField,
    setSelectedField,
    getFieldOverride,
    setFieldOverride,
    resetFieldOverride,
    resetAllOverrides,
    isFieldInLayout,
    getCurrentViewFields,
    setData,
    getData,
    onSave,
    onPreview,
    save,
    preview,
  };
}
