<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, nextTick, onUnmounted, provide, reactive, ref, watch } from 'vue';

import { EpDesignerLoader } from '@ies/base-ui';
import { DESIGNER_CONTEXT_KEY, providePageManager } from '@ies/hooks';
import { createPageManager, pluginManager, useRevoke } from '@ies/manager';
import { setupPanel } from '@ies/panel-ui';
import { setupExtensions } from '@ies/custom';
import { deepClone, deepCompareAndModify } from '@ies/utils';

import { useViewDesigner } from '../composables/useViewDesigner';
import type { MultiViewPageSchema } from '../types';
import { MULTI_VIEW_CONTEXT_KEY } from './context';

import ViewToolbar from './ViewToolbar.vue';
import FieldPool from './FieldPool.vue';
import ViewCanvas from './ViewCanvas.vue';
import ViewAttributePanel from './ViewAttributePanel.vue';

// ════════════════════════════════════════
//  Props / Emits
// ════════════════════════════════════════

const props = withDefaults(
  defineProps<{
    /** 默认 Schema */
    defaultSchema?: MultiViewPageSchema;
    /** 画布模式 */
    canvasMode?: 'desktop' | 'mobile' | 'tablet';
    /** 标题 */
    title?: string;
    /** 表单模式（使用 form 布局） */
    formMode?: boolean;
  }>(),
  {
    canvasMode: 'desktop',
    formMode: true,
    title: '多视图设计器',
  },
);

const emit = defineEmits<{
  save: [schema: MultiViewPageSchema];
  ready: [];
}>();

// ════════════════════════════════════════
//  初始化插件系统
// ════════════════════════════════════════

setupPanel(pluginManager);
setupExtensions(pluginManager);

const ready = ref(false);

// ════════════════════════════════════════
//  创建 pageManager（唯一数据源）
//  pageManager.pageSchema 是 reactive，所有子组件通过注入共享
// ════════════════════════════════════════

const pageManager = createPageManager();

// 如果有初始 schema，写入 pageManager
if (props.defaultSchema) {
  pageManager.setPageSchema(deepClone(props.defaultSchema) as any);
}

// 设置画布模式（与 EDesigner 保持一致）
const canvasConfigs: Record<string, any> = {
  desktop: {},
  mobile: { mode: 'mobile', width: '390px' },
  tablet: { mode: 'tablet', width: '780px' },
};
pageManager.pageSchema.canvas = {
  mode: props.canvasMode,
  ...canvasConfigs[props.canvasMode],
  ...pageManager.pageSchema.canvas,
};

// 表单模式下隐藏 form 组件（避免在组件库中显示）
if (props.formMode) {
  pluginManager.component.hide('form');
}

// 记录默认组件 ID（用于区分初始数据和用户添加的组件）
pageManager.setDefaultComponentIds(pageManager.pageSchema.schemas);

// 提供影响 pageManager 给子组件（node.vue / form.vue 等依赖它）
providePageManager(pageManager);

// ════════════════════════════════════════
//  核心状态（使用 pageManager.pageSchema 作为唯一数据源）
// ════════════════════════════════════════

// 将 pageManager.pageSchema 包装为 ref，供 useViewDesigner 使用
// pageManager.pageSchema 是 reactive，直接作为 ref 的 .value
const pageSchemaRef = ref(pageManager.pageSchema) as any;

const {
  mode,
  currentViewId,
  viewTypes,
  viewConfigs,
  pageSchema,
  selectedField,
  allFields,
  context,
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
  onPreview,
} = useViewDesigner(pageSchemaRef.value);

// ════════════════════════════════════════
//  保存 / 预览
// ════════════════════════════════════════

function handleSave() {
  emit('save', getData());
}

function handlePreview() {
  // 预览逻辑：将当前视图解析为标准 schema 并触发预览
  console.log('preview', getData());
}

// ════════════════════════════════════════
//  数据模型模式下的设计器上下文
//  复用 EDesigner 的 DESIGNER_CONTEXT_KEY，让现有的属性面板组件能工作
// ════════════════════════════════════════

// 使用 reactive 创建设计器状态，与 EDesigner 内部结构一致
const designerState = reactive({
  disabledHover: false,
  hoverNode: null as ComponentSchema | null,
  matched: [] as ComponentSchema[],
  selectedNode: null as ComponentSchema | null,
});

function setHoverNode(schema: ComponentSchema | null = null) {
  if (!schema || designerState.disabledHover) {
    designerState.hoverNode = null;
    return false;
  }
  if (schema?.id === designerState.hoverNode?.id) {
    return false;
  }
  designerState.hoverNode = schema;
}

function setSelectedNode(schema?: ComponentSchema) {
  if (!schema) {
    schema = pageManager.pageSchema.schemas[0];
  }
  designerState.selectedNode = schema;
  selectedField.value = schema;
}

// 使用真实的 useRevoke，让 toolbar 的撤销/重做按钮能正常工作
const revoke = useRevoke(
  pageManager.pageSchema as any,
  designerState,
  setSelectedNode,
);

// 设置为设计模式
pageManager.setDesignMode(true);

// 提供 DESIGNER_CONTEXT_KEY，让现有的属性面板能使用 useDesignerContext
provide(DESIGNER_CONTEXT_KEY, {
  handleDelete: () => {},
  handleDuplicate: () => {},
  handleImported: () => {},
  handleToggleDeviceMode: () => {},
  pageSchema: pageManager.pageSchema,
  preview: handlePreview,
  props: {
    canvasMode: props.canvasMode,
    canvasPadding: 16,
    disabledZoom: false,
    draggable: true,
    formMode: props.formMode,
    hiddenHeader: false,
    lockDefaultSchemaEdit: false,
    showHiddenItems: true,
    title: props.title,
  } as any,
  reset: () => {},
  revoke,
  save: handleSave,
  setDisabledHover: (v: boolean) => {
    designerState.disabledHover = v;
  },
  setHoverNode,
  setSelectedNode,
  state: designerState,
});

// 提供 MULTI_VIEW_CONTEXT_KEY，给多视图子组件使用
provide(MULTI_VIEW_CONTEXT_KEY, context);

// ════════════════════════════════════════
//  初始化：选中根节点，避免 attribute.vue 中 selectedNode 为 null
// ════════════════════════════════════════

setSelectedNode(pageManager.pageSchema.schemas[0]);

// ════════════════════════════════════════
//  数据模型模式：选中字段时同步 selectedField
// ════════════════════════════════════════

watch(
  () => designerState.selectedNode,
  (node) => {
    if (node && node.input) {
      selectedField.value = node;
    }
  },
);

// ════════════════════════════════════════
//  组件加载完成
// ════════════════════════════════════════

const designerRef = ref<HTMLElement | null>(null);

function handleReady() {
  nextTick(() => {
    ready.value = true;
    emit('ready');
  });
}

// ════════════════════════════════════════
//  导出方法
// ════════════════════════════════════════

defineExpose({
  getData,
  setData,
});

// 模式切换时：视图模式清除字段选中，数据模型模式切回根节点选中
watch(mode, (newMode) => {
  selectedField.value = null;
  if (newMode === 'model') {
    // 数据模型模式：选中根节点，让 attribute 面板正常工作
    setSelectedNode(pageManager.pageSchema.schemas[0]);
  }
});
</script>

<template>
  <div v-if="!pluginManager.designer.initialized.value" class="mv-loading">
    <EpDesignerLoader />
  </div>
  <Suspense v-else @resolve="handleReady">
    <template #default>
      <div class="mv-designer-main">
        <!-- 顶部工具栏 -->
        <ViewToolbar
          :mode="mode"
          :view-types="viewTypes"
          :current-view-id="currentViewId"
          :title="props.title"
          @set-mode="setMode"
          @switch-view="switchView"
          @add-view="addViewType"
          @remove-view="removeViewType"
          @rename-view="renameViewType"
          @save="handleSave"
          @preview="handlePreview"
        />

        <!-- 三栏主体 -->
        <div class="mv-body">
          <!-- 数据模型模式 -->
          <template v-if="mode === 'model'">
            <div class="mv-left-panel">
              <slot name="model-left">
                <!-- 组件库（复用 epic-designer 的组件面板） -->
                <ComponentLibrary />
              </slot>
            </div>
            <div class="mv-center-panel">
              <slot name="model-center">
                <!-- 拖拽画布 -->
                <ModelCanvas
                  :page-schema="pageSchema"
                  :form-mode="props.formMode"
                />
              </slot>
            </div>
            <div class="mv-right-panel">
              <slot name="model-right">
                <!-- 属性面板（复用 epic-designer 的属性面板） -->
                <ModelAttributePanel />
              </slot>
            </div>
          </template>

          <!-- 视图设计模式 -->
          <template v-else>
            <div class="mv-left-panel">
              <slot name="view-left">
                <FieldPool
                  :fields="allFields"
                  :current-view-id="currentViewId"
                  :view-configs="viewConfigs"
                  @toggle="toggleFieldInLayout"
                  @select="setSelectedField"
                />
              </slot>
            </div>
            <div class="mv-center-panel">
              <slot name="view-center">
                <ViewCanvas
                  :fields="getCurrentViewFields()"
                  :selected-field="selectedField"
                  :current-view-id="currentViewId"
                  :view-types="viewTypes"
                  @select="setSelectedField"
                  @move="moveField"
                />
              </slot>
            </div>
            <div class="mv-right-panel">
              <slot name="view-right">
                <ViewAttributePanel
                  :selected-field="selectedField"
                  :current-view-id="currentViewId"
                  :view-configs="viewConfigs"
                  :all-fields="allFields"
                  @set-override="setFieldOverride"
                  @reset-override="resetFieldOverride"
                  @reset-all-overrides="resetAllOverrides"
                />
              </slot>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template #fallback>
      <div class="mv-loading">
        <EpDesignerLoader />
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
// 异步加载子组件（用于 Suspense）
import { defineAsyncComponent } from 'vue';

const ComponentLibrary = defineAsyncComponent(() => import('./ComponentLibrary.vue'));
const ModelCanvas = defineAsyncComponent(() => import('./ModelCanvas.vue'));
const ModelAttributePanel = defineAsyncComponent(() => import('./ModelAttributePanel.vue'));

export default { name: 'MultiViewDesigner' };
</script>

<style scoped>
.mv-designer-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--ep-background, #f5f5f5);
}

.mv-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.mv-left-panel {
  width: 260px;
  min-width: 260px;
  border-right: 1px solid var(--ep-border-color, #e0e0e0);
  overflow-y: auto;
  background: var(--ep-panel-bg, #fff);
}

.mv-center-panel {
  flex: 1;
  overflow: auto;
  position: relative;
}

.mv-right-panel {
  width: 308px;
  min-width: 308px;
  border-left: 1px solid var(--ep-border-color, #e0e0e0);
  overflow-y: auto;
  background: var(--ep-panel-bg, #fff);
}

.mv-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
