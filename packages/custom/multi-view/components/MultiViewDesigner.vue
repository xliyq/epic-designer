<script lang="ts" setup>
import type { ComponentSchema, PageSchema } from '@ies/types'
import { nextTick, onMounted, provide, reactive, ref, watch } from 'vue'
import { EDesigner } from '@ies/core'
import { pluginManager } from '@ies/manager'
import { deepClone } from '@ies/utils'
import { useViewDesigner } from '../composables/useViewDesigner'
import type { DesignerMode, ViewTypeConfig } from '../types'
import { FIELD_POOL_KEY } from '../types'
import ViewToolbar from './ViewToolbar.vue'
import FieldPool from './FieldPool.vue'

const props = withDefaults(defineProps<{
  dataModel?: PageSchema
  viewTypes?: ViewTypeConfig[]
  views?: Record<string, PageSchema>
  title?: string
}>(), {
  title: '多视图设计器',
})

const emit = defineEmits<{
  save: []
  ready: []
}>()

const designerRef = ref<InstanceType<typeof EDesigner> | null>(null)
const ready = ref(false)

const {
  mode,
  dataModel,
  viewTypes,
  views,
  currentViewId,
  globalMode,
  currentView,
  modelFields,
  viewFields,
  setMode,
  setGlobalMode,
  selectView,
  addViewType,
  removeViewType,
  renameViewType,
  toggleFieldInView,
  isFieldInView,
  syncFieldToAll,
  setAll,
  getDataModel,
  getViews,
  getViewTypes,
} = useViewDesigner()

// 初始化：加载传入的数据，注册字段池
onMounted(() => {
  if (props.dataModel || props.viewTypes || props.views) {
    setAll(props.dataModel, props.viewTypes, props.views)
  }
  // 注册字段池（不隐藏，纯验证是否注册成功）
  registerFieldPool()
})

// ════════════════════════════════════════
//  EDesigner 就绪后注册字段池
// ════════════════════════════════════════

function handleDesignerReady() {
  ready.value = true
  nextTick(() => emit('ready'))
}

let fieldPoolRegistered = false

function registerFieldPool() {
  if (fieldPoolRegistered) return
  fieldPoolRegistered = true
  pluginManager.panel.registerActivitybar({
    component: FieldPool,
    icon: 'icon--epic--list',
    id: 'field_pool',
    sort: 150,
    title: '字段池',
    visible: true,
  })
}

// ════════════════════════════════════════
//  模式切换：交换 children
// ════════════════════════════════════════

function getDesignerData(): PageSchema | null {
  if (!designerRef.value) return null
  try {
    return designerRef.value.getData() as PageSchema
  } catch {
    return null
  }
}

function setDesignerData(schema: PageSchema) {
  if (!designerRef.value) return
  designerRef.value.setData(schema)
}

/**
 * 从模型切换到视图：保存模型字段，加载视图字段
 */
function switchToView(viewId: string) {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 到数据模型
  if (dataModel.schemas[0]) {
    dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
  }

  // 加载视图字段
  const view = views[viewId]
  if (view) {
    setDesignerData({
      ...schema,
      schemas: [{
        ...schema.schemas[0],
        children: deepClone(view.schemas[0]?.children ?? []),
      }],
    })
  }

  }

/**
 * 从视图切换到模型：保存当前视图字段，恢复模型字段
 */
function switchToModel() {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前 children 到当前视图
  const view = currentView.value
  if (view) {
    view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
  }

  // 恢复数据模型字段
  setDesignerData({
    ...schema,
    schemas: [{
      ...schema.schemas[0],
      children: deepClone(dataModel.schemas[0]?.children ?? []),
    }],
  })
}

/**
 * 在不同视图间切换
 */
function switchToAnotherView(newViewId: string) {
  const schema = getDesignerData()
  if (!schema) return

  // 保存当前视图
  const oldView = currentView.value
  if (oldView) {
    oldView.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
  }

  // 加载新视图
  const newView = views[newViewId]
  if (newView) {
    setDesignerData({
      ...schema,
      schemas: [{
        ...schema.schemas[0],
        children: deepClone(newView.schemas[0]?.children ?? []),
      }],
    })
  }
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
  if (mode.value === 'view' && newId && oldId && newId !== oldId) {
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
//  字段池操作
// ════════════════════════════════════════

const selectedFieldId = ref('')

function handleFieldPoolSelect(fieldId: string) {
  selectedFieldId.value = fieldId
}

function handleFieldPoolToggle(fieldId: string) {
  toggleFieldInView(fieldId)
  // 刷新画布
  const schema = getDesignerData()
  if (schema && currentView.value) {
    setDesignerData({
      ...schema,
      schemas: [{
        ...schema.schemas[0],
        children: deepClone(currentView.value.schemas[0]?.children ?? []),
      }],
    })
  }
  takeSnapshot(currentViewId.value)
}

// 注入字段池上下文（FieldPool 在 EDesigner 内部渲染，通过 inject 获取数据）
const fieldPoolCtx = reactive({
  get modelFields() { return modelFields.value },
  get viewFields() { return viewFields.value },
  get selectedFieldId() { return selectedFieldId.value },
  selectField: handleFieldPoolSelect,
  toggleField: handleFieldPoolToggle,
})
provide(FIELD_POOL_KEY, fieldPoolCtx)

// ════════════════════════════════════════
//  保存
// ════════════════════════════════════════

function handleSave() {
  const schema = getDesignerData()
  if (schema) {
    if (mode.value === 'model') {
      dataModel.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
    } else {
      const view = currentView.value
      if (view) {
        view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
      }
    }
  }
  emit('save')
}

// ════════════════════════════════════════
//  导出方法
// ════════════════════════════════════════

defineExpose({
  getDataModel,
  getViews,
  getView(id: string) {
    return views[id] ? deepClone(views[id]) as PageSchema : undefined
  },
  getViewTypes,
  setView(id: string, schema: PageSchema) {
    views[id] = deepClone(schema) as PageSchema
  },
  setViews(allViews: Record<string, PageSchema>) {
    for (const key of Object.keys(views)) delete views[key]
    for (const [key, val] of Object.entries(allViews)) {
      views[key] = deepClone(val) as PageSchema
    }
  },
})
</script>

<template>
  <div class="mv-designer">
    <ViewToolbar
      :current-mode="mode"
      :current-view-type-id="currentViewId"
      :view-types="viewTypes"
      :global-mode="globalMode"
      :title="title"
      @switch-mode="setMode"
      @select-view="selectView"
      @add-view="addViewType"
      @remove-view="removeViewType"
      @rename-view="renameViewType"
      @toggle-global-mode="setGlobalMode"
      @save="handleSave"
    />
    <EDesigner
      ref="designerRef"
      hidden-header
      @ready="handleDesignerReady"
    />
  </div>
</template>

<style scoped>
.mv-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>