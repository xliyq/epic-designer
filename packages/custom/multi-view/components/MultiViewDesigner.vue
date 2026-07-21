<script lang="ts" setup>
import type { ComponentSchema, PageSchema } from '@ies/types'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { EDesigner } from '@ies/core'
import { EpSwitch } from '@ies/base-ui'
import { pluginManager } from '@ies/manager'
import { deepClone } from '@ies/utils'
import { useViewDesigner } from '../composables/useViewDesigner'
import type { ViewTypeConfig } from '../types'
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
  setMode,
  setGlobalMode,
  selectView,
  addViewType,
  removeViewType,
  renameViewType,
  syncFieldToAll,
  setAll,
  getDataModel,
  getViews,
  getViewTypes,
} = useViewDesigner()

// 初始化：加载传入的数据
onMounted(() => {
  if (props.dataModel || props.viewTypes || props.views) {
    setAll(props.dataModel, props.viewTypes, props.views)
  }
})

// 从画布同步当前视图状态（画布上的增删操作不会自动同步到 views 状态）
function syncViewFromCanvas() {
  if (mode.value !== 'view') return
  const schema = getDesignerData()
  if (!schema) return
  const view = currentView.value
  if (!view) return
  view.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
}

// 通过 pluginManager.global 共享字段池上下文（reactive 对象，直接修改属性）
function addFieldToView(fieldId: string) {
  if (mode.value !== 'view') return
  // 同步画布状态到视图，确保操作的是最新数据
  syncViewFromCanvas()

  const modelField = dataModel.schemas[0]?.children?.find(f => f.id === fieldId)
  if (!modelField) return
  const view = currentView.value
  if (!view) return

  // 已存在则跳过
  if (view.schemas[0].children?.some(f => f.id === fieldId)) return

  // 按数据模型位置插入
  const modelIndex = modelFields.value.findIndex(f => f.id === fieldId)
  const viewChildren = view.schemas[0].children ?? []
  const insertAt = viewChildren.findIndex(f => {
    const idx = modelFields.value.findIndex(mf => mf.id === f.id)
    return idx > modelIndex
  })
  if (insertAt === -1) {
    viewChildren.push(deepClone(modelField))
  } else {
    viewChildren.splice(insertAt, 0, deepClone(modelField))
  }

  const schema = getDesignerData()
  if (schema) {
    setDesignerData({
      ...schema,
      schemas: [{
        ...schema.schemas[0],
        children: deepClone(viewChildren),
      }],
    })
  }
}

// 初始化响应式上下文（保持引用不变，只更新属性）
if (!pluginManager.global.__multi_view_pool) {
  pluginManager.global.__multi_view_pool = reactive({
    mode: 'model',
    modelFields: [] as ComponentSchema[],
    addFieldToView,
  })
}

// 同步上下文到 pluginManager.global（响应式，FieldPool 直接读取）
watch([mode, modelFields, () => currentView.value?.schemas[0]?.children], () => {
  const pool = pluginManager.global.__multi_view_pool
  if (pool) {
    pool.mode = mode.value
    pool.modelFields = [...modelFields.value]
    pool.addFieldToView = addFieldToView
  }
}, { immediate: true, deep: true })

// ════════════════════════════════════════
//  EDesigner 就绪后注册字段池
// ════════════════════════════════════════

function handleDesignerReady() {
  ready.value = true
  nextTick(() => emit('ready'))
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
 * 在不同视图间切换（先保存旧视图，再加载新视图）
 */
function handleSwitchView(newViewId: string) {
  if (mode.value !== 'view' || newViewId === currentViewId.value) return

  // 保存当前视图（此时 currentView 还是旧视图）
  const schema = getDesignerData()
  if (schema) {
    const oldView = currentView.value
    if (oldView) {
      oldView.schemas[0].children = deepClone(schema.schemas[0]?.children ?? [])
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
  const schema = getDesignerData()
  if (!schema) return

  // 加载新视图（旧视图已在 handleSwitchView 中保存）
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

// ════════════════════════════════════════
//  保存
// ════════════════════════════════════════

function handlePreview() {
  designerRef.value?.preview()
}

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
    <EDesigner
      ref="designerRef"
      @ready="handleDesignerReady"
    >
      <template #header>
        <ViewToolbar
          :current-mode="mode"
          :current-view-type-id="currentViewId"
          :view-types="viewTypes"
          :title="title"
          @switch-mode="setMode"
          @select-view="handleSwitchView"
          @add-view="addViewType"
          @remove-view="removeViewType"
          @rename-view="renameViewType"
          @preview="handlePreview"
          @save="handleSave"
        />
      </template>
      <template #sidebarAfter>
        <FieldPool />
      </template>
      <template #sidebarRightTop>
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
