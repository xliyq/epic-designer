<script lang="ts" setup>
import type { ComponentSchema, PageSchema } from '@ies/types'
import { computed, nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EDesigner } from '@ies/core'
import { EpSwitch } from '@ies/base-ui'
import { deepClone } from '@ies/utils'
import { useViewDesigner } from '../composables/useViewDesigner'
import type { MultiViewLabels, RemoveViewContext, RemoveViewResult, ViewTypeConfig } from '../types'
import ViewToolbar from './ViewToolbar.vue'
import FieldPool from './FieldPool.vue'

// 只声明多视图专有 props；DesignerProps 由 $attrs 透传至内部 EDesigner
const props = withDefaults(defineProps<{
  dataModel?: PageSchema
  viewTypes?: ViewTypeConfig[]
  views?: Record<string, PageSchema>
  canAddView?: boolean
  canDeleteView?: boolean
  /** 删除视图前的校验回调，返回 false 或 { canDelete: false, message } 阻止删除 */
  beforeRemoveView?: (ctx: RemoveViewContext) => Promise<RemoveViewResult> | RemoveViewResult
  /** 文案配置，传入部分字段即可覆盖默认值 */
  labels?: Partial<MultiViewLabels>
}>(), {
  canAddView: true,
  canDeleteView: true,
})

// 合并默认文案与用户传入的 labels（withDefaults 对对象类型不会逐字段合并）
const mergedLabels = computed<MultiViewLabels>(() => ({
  model: '数据模型',
  view: '视图设计',
  fieldPool: '字段池',
  ...props.labels,
}))

const emit = defineEmits<{
  save: []
  ready: []
  addView: []
  removeView: [id: string]
}>()

defineOptions({
  inheritAttrs: false,
})

const designerRef = ref<InstanceType<typeof EDesigner> | null>(null)

const {
  mode,
  dataModel,
  viewTypes,
  views,
  currentViewId,
  globalMode,
  currentView,
  modelFields,
  setMode,
  setGlobalMode,
  selectView,
  addViewType,
  removeViewType,
  renameViewType,
  syncFieldToAll,
  setAll,
  setDataModel,
  setViews,
  getDataModel,
  getViews,
  getViewTypes,
  saveHistory,
  getHistory,
  removeHistory,
} = useViewDesigner()

// 预览标题：模型模式下显示模型标签，视图模式下显示视图名
const previewTitle = computed(() => {
  if (mode.value === 'model') return mergedLabels.value.model
  const vt = viewTypes.value.find(v => v.id === currentViewId.value)
  return vt?.name ? `${mergedLabels.value.view} - ${vt.name}` : '预览'
})

// 初始化：同步加载传入数据（必须在 Suspense resolve 之前执行，否则 EDesigner 就绪时 dataModel 还是空的）
if (props.dataModel || props.viewTypes || props.views) {
  setAll(props.dataModel, props.viewTypes, props.views)
}

// 监听 props 变化，动态同步外部数据
watch(() => props.dataModel, (newModel) => {
  if (!newModel) return
  setDataModel(newModel)
  // 数据模型模式下，实时更新画布和 script
  if (mode.value === 'model') {
    designerRef.value?.setCanvasChildren(deepClone(newModel.schemas[0]?.children ?? []))
    designerRef.value?.setScript(newModel.script ?? '')
  }
}, { deep: true })

watch(() => props.viewTypes, (newTypes) => {
  viewTypes.value = newTypes ? newTypes.map(v => ({ ...v })) : []
  if (!currentViewId.value && viewTypes.value.length > 0) {
    currentViewId.value = viewTypes.value[0].id
  }
}, { deep: true })

watch(() => props.views, (newViews) => {
  if (newViews) setViews(newViews)
}, { deep: true })

// 从画布同步当前视图状态（画布上的增删操作不会自动同步到 views 状态）
function syncViewFromCanvas() {
  if (mode.value !== 'view') return
  const schema = getDesignerData()
  if (!schema) return
  const view = currentView.value
  if (!view) return
  view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
}

/** ════════════════════════════════════════
 *  字段树工具函数
 *  ════════════════════════════════════════ */

/** 在字段树中递归查找字段 */
function findFieldInTree(fields: ComponentSchema[], fieldId: string): ComponentSchema | null {
  for (const f of fields) {
    if (f.id === fieldId) return f
    if (f.children?.length) {
      const found = findFieldInTree(f.children, fieldId)
      if (found) return found
    }
  }
  return null
}

/** 在字段树中递归查找字段的直属父级 */
function findParentFieldInTree(fields: ComponentSchema[], childId: string): ComponentSchema | null {
  for (const f of fields) {
    if (f.children?.length) {
      if (f.children.some(c => c.id === childId)) return f
      const found = findParentFieldInTree(f.children, childId)
      if (found) return found
    }
  }
  return null
}

/** 在字段树中递归检查字段是否存在于任意层级 */
function fieldExistsInTree(fields: ComponentSchema[], fieldId: string): boolean {
  for (const f of fields) {
    if (f.id === fieldId) return true
    if (f.children?.length && fieldExistsInTree(f.children, fieldId)) return true
  }
  return false
}

/** 在字段树中按 id 查找容器引用（用于直接修改其 children） */
function findContainerRef(fields: ComponentSchema[], containerId: string): ComponentSchema | null {
  for (const f of fields) {
    if (f.id === containerId) return f
    if (f.children?.length) {
      const found = findContainerRef(f.children, containerId)
      if (found) return found
    }
  }
  return null
}

/** ════════════════════════════════════════
 *  添加字段到视图
 *  ════════════════════════════════════════ */

function addFieldToView(fieldId: string) {
  if (mode.value !== 'view') return
  // 同步画布状态到视图，确保操作的是最新数据
  syncViewFromCanvas()

  const modelField = findFieldInTree(dataModel.schemas[0]?.children ?? [], fieldId)
  if (!modelField) return
  const view = currentView.value
  if (!view) return

  const viewChildren = view.schemas[0].children ?? []

  // 已存在于视图中（任意层级）则跳过
  if (fieldExistsInTree(viewChildren, fieldId)) return

  const isTopLevel = (dataModel.schemas[0]?.children ?? []).some(f => f.id === fieldId)

  if (isTopLevel) {
    // 第一层字段：按数据模型顺序位置插入
    const modelIndex = modelFields.value.findIndex(f => f.id === fieldId)
    const insertAt = viewChildren.findIndex(f => {
      const idx = modelFields.value.findIndex(mf => mf.id === f.id)
      return idx > modelIndex
    })
    if (insertAt === -1) {
      viewChildren.push(deepClone(modelField))
    } else {
      viewChildren.splice(insertAt, 0, deepClone(modelField))
    }
  } else {
    // 嵌套子字段：找到视图中同 id 的父级容器，按数据模型顺序插入
    const parentInModel = findParentFieldInTree(dataModel.schemas[0]?.children ?? [], fieldId)
    if (parentInModel) {
      const container = findContainerRef(viewChildren, parentInModel.id!)
      if (container) {
        if (!container.children) container.children = []
        const modelChildren = parentInModel.children ?? []
        const modelIndex = modelChildren.findIndex(c => c.id === fieldId)
        const insertAt = container.children.findIndex(c => {
          const idx = modelChildren.findIndex(mc => mc.id === c.id)
          return idx > modelIndex
        })
        if (insertAt === -1) {
          container.children.push(deepClone(modelField))
        } else {
          container.children.splice(insertAt, 0, deepClone(modelField))
        }
      }
    }
  }

  designerRef.value?.setCanvasChildren(deepClone(viewChildren))
}
// ════════════════════════════════════════
//  EDesigner 就绪
// ════════════════════════════════════════

function handleDesignerReady() {
  // 根据当前模式决定是否将数据推送到画布
  if (mode.value === 'model' && dataModel.schemas[0]?.children?.length) {
    designerRef.value?.setCanvasChildren(deepClone(dataModel.schemas[0]?.children ?? []))
  }
  // 根据模式推送对应的 script
  const script = mode.value === 'model'
    ? dataModel.script
    : currentView.value?.script
  designerRef.value?.setScript(script ?? '')
  nextTick(() => emit('ready'))
}

// ════════════════════════════════════════
//  删除视图（校验 -> 确认 -> 删除 -> 通知）
// ════════════════════════════════════════

async function handleRemoveView(viewId: string) {
  const view = views[viewId]
  if (!view) return

  const viewType = viewTypes.value.find(v => v.id === viewId)
  const viewIndex = viewTypes.value.findIndex(v => v.id === viewId)

  // 1. 业务校验（若父组件传了 beforeRemoveView）
  if (props.beforeRemoveView) {
    const ctx: RemoveViewContext = {
      id: viewId,
      name: viewType?.name ?? '',
      view: deepClone(view),
      viewIndex,
      totalViews: viewTypes.value.length,
    }
    const result = await props.beforeRemoveView(ctx)
    if (result !== true && !(typeof result === 'object' && result.canDelete)) {
      const message = typeof result === 'object' && result.message
        ? result.message
        : '该视图不允许删除'
      ElMessage.warning(message)
      return
    }
  }

  // 2. 确认弹窗
  try {
    await ElMessageBox.confirm(
      `确定删除视图「${viewType?.name ?? viewId}」吗？`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
  } catch {
    return // 用户取消
  }

  // 3. 执行删除
  removeViewType(viewId)

  // 4. 通知父组件
  emit('removeView', viewId)
}

// ════════════════════════════════════════
//  模式切换：交换 children + 历史记录隔离
// ════════════════════════════════════════

/** 保存当前画布的历史记录到指定 key */
function saveCurrentHistory(key: string) {
  const history = designerRef.value?.exportHistory?.()
  if (history) saveHistory(key, history)
}

/** 恢复指定 key 的历史记录到画布 */
function restoreHistory(key: string) {
  const history = getHistory(key)
  if (history) {
    designerRef.value?.importHistory?.(history)
  } else {
    designerRef.value?.revoke?.reset()
  }
}

function getDesignerData(): PageSchema | null {
  if (!designerRef.value) return null
  try {
    return designerRef.value.getData() as PageSchema
  } catch {
    return null
  }
}

/**
 * 从模型切换到视图：保存模型字段和历史，加载视图字段和历史
 */
function switchToView(viewId: string) {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 和 script 到数据模型
  if (dataModel.schemas[0]) {
    dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
  }
  dataModel.script = schema.script ?? ''

  // 保存数据模型的历史记录
  saveCurrentHistory('model')

  // 加载视图字段，没有视图时清空画布
  const view = views[viewId]
  if (view) {
    designerRef.value?.setCanvasChildren(deepClone(view.schemas[0]?.children ?? []))
    designerRef.value?.setScript(view.script ?? '')
  } else {
    designerRef.value?.setCanvasChildren([])
    designerRef.value?.setScript('')
  }

  // 恢复视图的历史记录
  restoreHistory(viewId)
}

/**
 * 从视图切换到模型：保存当前视图字段和历史，恢复模型字段和历史
 */
function switchToModel() {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 和 script 到当前视图
  const view = currentView.value
  if (view) {
    view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
    view.script = schema.script ?? ''
    saveCurrentHistory(currentViewId.value)
  }

  // 恢复数据模型字段和 script
  designerRef.value?.setCanvasChildren(deepClone(dataModel.schemas[0]?.children ?? []))
  designerRef.value?.setScript(dataModel.script ?? '')

  // 恢复数据模型的历史记录
  restoreHistory('model')
}

/**
 * 在不同视图间切换（先保存旧视图，再加载新视图）
 */
function handleSwitchView(newViewId: string) {
  if (mode.value !== 'view' || newViewId === currentViewId.value) return

  // 保存当前视图的 children、script 和历史记录（此时 currentView 还是旧视图）
  const schema = getDesignerData()
  if (schema) {
    const oldView = currentView.value
    if (oldView) {
      oldView.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
      oldView.script = schema.script ?? ''
      saveCurrentHistory(currentViewId.value)
    }
  }

  // 切换到新视图
  selectView(newViewId) // 这会触发 watch → switchToAnotherView，但此时 oldView 已保存
}

/**
 * 在不同视图间切换（由 watch 调用，此时 currentViewId 已更新）
 * 只负责加载新视图数据，不负责保存旧视图（由 handleSwitchView 完成）
 */
function switchToAnotherView(newViewId: string) {
  // 加载新视图（旧视图已在 handleSwitchView 中保存）
  const newView = views[newViewId]
  if (newView) {
    designerRef.value?.setCanvasChildren(deepClone(newView.schemas[0]?.children ?? []))
    designerRef.value?.setScript(newView.script ?? '')
  }

  // 恢复新视图的历史记录
  restoreHistory(newViewId)
}

// 监听模式切换
watch(mode, (newMode, oldMode) => {
  if (oldMode === 'model' && newMode === 'view') {
    switchToView(currentViewId.value)
  } else if (oldMode === 'view' && newMode === 'model') {
    switchToModel()
  }
})

// 监听视图切换
watch(currentViewId, (newId, oldId) => {
  if (mode.value !== 'view') return
  if (newId === oldId) return

  // 视图被删除导致 currentViewId 变空，清空画布
  if (!newId) {
    designerRef.value?.setCanvasChildren([])
    return
  }

  if (oldId) {
    // 如果全局模式开启，同步变更
    if (globalMode.value) {
      syncChangesOnSwitch(oldId)
    }
    switchToAnotherView(newId)
  }
})

// ════════════════════════════════════════
//  全局同步
// ════════════════════════════════════════

// 保存每个视图加载时的字段快照（用于检测变更）
const fieldSnapshots: Record<string, string> = {}

function takeSnapshot(viewId: string) {
  const view = views[viewId]
  if (!view) return
  fieldSnapshots[viewId] = JSON.stringify(view.schemas[0]?.children ?? [])
}

function syncChangesOnSwitch(viewId: string) {
  if (!globalMode.value) return
  const oldSnapshot = fieldSnapshots[viewId]
  if (!oldSnapshot) return

  const view = views[viewId]
  if (!view) return
  const currentChildren = view.schemas[0]?.children ?? []

  for (const field of currentChildren) {
    if (!field.id) continue
    // 在旧快照中查找同 ID 字段
    const oldFields: ComponentSchema[] = JSON.parse(oldSnapshot)
    const oldField = oldFields.find(f => f.id === field.id)
    if (!oldField) continue

    // 比较是否变化
    if (JSON.stringify(field) !== JSON.stringify(oldField)) {
      syncFieldToAll(field.id, field)
    }
  }
}

// 视图切换或模式切换时更新快照
watch([currentViewId, () => currentView.value?.schemas[0]?.children], () => {
  if (mode.value === 'view' && currentViewId.value) {
    takeSnapshot(currentViewId.value)
  }
}, { immediate: true, deep: true })

// ════════════════════════════════════════
//  保存
// ════════════════════════════════════════

function handlePreview() {
  designerRef.value?.preview(previewTitle.value)
}

function handleSave() {
  const schema = getDesignerData()
  if (schema) {
    if (mode.value === 'model') {
      dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
      dataModel.script = schema.script ?? ''
    } else {
      const view = currentView.value
      if (view) {
        view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
        view.script = schema.script ?? ''
      }
    }
  }
  emit('save')
}

// ════════════════════════════════════════
//  导出方法
// ════════════════════════════════════════

defineExpose({
  // ── EDesigner 兼容方法 ──
  exportHistory: (...args: any[]) => (designerRef.value as any)?.exportHistory?.(...args),
  getData: () => designerRef.value?.getData(),
  importHistory: (...args: any[]) => (designerRef.value as any)?.importHistory?.(...args),
  preview: (title?: string) => designerRef.value?.preview(title ?? previewTitle.value),
  reset: () => designerRef.value?.reset(),
  get revoke() { return designerRef.value?.revoke },
  save: () => designerRef.value?.save(),
  setData: (schema: PageSchema) => designerRef.value?.setData(schema),

  // ── 多视图专用方法 ──
  getDataModel,
  getViews,
  getViewTypes,
  addViewType,
  getView(id: string) {
    return views[id] ? deepClone(views[id]) as PageSchema : undefined
  },
  setView(id: string, schema: PageSchema) {
    views[id] = deepClone(schema) as PageSchema
  },
  setViews,
})
</script>

<template>
  <div class="mv-designer">
    <EDesigner
      ref="designerRef"
      v-bind="$attrs"
      @ready="handleDesignerReady"
      @save="handleSave"
    >
      <!-- header 插槽：用户提供则替换 ViewToolbar -->
      <template #header>
        <slot name="header">
          <ViewToolbar
            :current-mode="mode"
            :current-view-type-id="currentViewId"
            :view-types="viewTypes"
            :title="($attrs.title as string) ?? '多视图设计器'"
            :can-add-view="canAddView"
            :can-delete-view="canDeleteView"
            :labels="mergedLabels"
            @switch-mode="setMode"
            @select-view="handleSwitchView"
            @add-view="emit('addView')"
            @remove-view="handleRemoveView"
            @rename-view="renameViewType"
            @preview="handlePreview"
            @save="handleSave"
          >
            <template #prefix>
              <slot name="header-prefix" />
            </template>
            <template #title>
              <slot name="header-title" />
            </template>
            <template #right-prefix>
              <slot name="header-right-prefix" />
            </template>
            <template #right-action>
              <slot name="header-right-action" />
            </template>
            <template #right-suffix>
              <slot name="header-right-suffix" />
            </template>
          </ViewToolbar>
        </slot>
      </template>

      <!-- sidebarAfter：用户提供则替换 FieldPool -->
      <template #sidebarAfter>
        <slot name="sidebarAfter">
          <FieldPool
            :mode="mode"
            :modelFields="modelFields"
            :addFieldToView="addFieldToView"
            :field-pool-label="mergedLabels.fieldPool"
          />
        </slot>
      </template>

      <!-- sidebarRightTop：用户提供则替换全局开关 -->
      <template #sidebarRightTop>
        <slot name="sidebarRightTop">
          <div v-if="mode === 'view'" class="mv-global-switch">
            <EpSwitch
              v-model="globalMode"
              class="ml-2"
              inline-prompt
              style="--ep-switch-on-color: #ff4949; --ep-switch-off-color: #13ce66"
              active-text="全局"
              inactive-text="当前"
            />
          </div>
        </slot>
      </template>
    </EDesigner>
  </div>
</template>

<style scoped>
.mv-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mv-global-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-bottom: 1px solid var(--ep-border);
  flex-shrink: 0;
}
</style>
