import type { ComponentSchema, PageSchema } from '@ies/types'
import { computed, reactive, ref } from 'vue'
import { deepClone } from '@ies/utils'
import type { DesignerMode, ViewTypeConfig } from '../types'

/**
 * 默认视图类型预设
 */
const DEFAULT_VIEW_TYPES: ViewTypeConfig[] = [
  { id: 'create', name: '创建' },
  { id: 'approve', name: '审批' },
  { id: 'view', name: '查看' },
]

/**
 * 多视图设计器核心状态管理
 *
 * dataModel 和 views 中的每个视图都是标准 PageSchema，结构完全一致。
 * 模式切换时通过交换 pageSchema.schemas[0].children 来实现画布内容切换。
 */
export function useViewDesigner() {
  // ── 模式 ──
  const mode = ref<DesignerMode>('model')

  // ── 数据模型（标准 PageSchema） ──
  const dataModel = reactive<PageSchema>({
    schemas: [{
      id: 'root',
      label: '表单',
      type: 'form',
      props: {
        colon: true,
        labelAlign: 'right',
        labelCol: { span: 5 },
        labelLayout: 'fixed',
        labelPlacement: 'left',
        labelWidth: 100,
        layout: 'horizontal',
        name: 'default',
        wrapperCol: { span: 19 },
      },
      children: [],
    }],
    script: '',
  })

  // ── 视图类型列表 ──
  const viewTypes = ref<ViewTypeConfig[]>([...DEFAULT_VIEW_TYPES])

  // ── 视图集合（Record<string, PageSchema>） ──
  const views = reactive<Record<string, PageSchema>>({})

  // 初始化默认视图
  function initDefaultViews() {
    for (const vt of viewTypes.value) {
      if (!views[vt.id]) {
        views[vt.id] = {
          schemas: [{
            id: 'root',
            label: '表单',
            type: 'form',
            props: { ...dataModel.schemas[0].props },
            children: [],
          }],
          script: '',
        }
      }
    }
  }
  initDefaultViews()

  // ── 当前选中的视图 ID ──
  const currentViewId = ref<string>(viewTypes.value[0]?.id ?? '')

  // ── 全局编辑模式 ──
  const globalMode = ref(false)

  // ── 当前视图的 PageSchema ──
  const currentView = computed(() => {
    if (!currentViewId.value) return null
    return views[currentViewId.value] ?? null
  })

  // ── 字段列表 ──
  const modelFields = computed(() => dataModel.schemas[0]?.children ?? [])

  // ════════════════════════════════════════
  //  模式切换
  // ════════════════════════════════════════

  function setMode(newMode: DesignerMode) {
    mode.value = newMode
  }

  // ════════════════════════════════════════
  //  视图类型 CRUD
  // ════════════════════════════════════════

  function selectView(id: string) {
    currentViewId.value = id
  }

  function addViewType(name: string, id?: string) {
    id = id ?? `view_${Date.now()}`
    viewTypes.value.push({ id, name })
    views[id] = {
      schemas: [{
        id: 'root',
        label: '表单',
        type: 'form',
        props: { ...dataModel.schemas[0].props },
        children: [],
      }],
      script: '',
    }
    currentViewId.value = id
  }

  function removeViewType(id: string) {
    const index = viewTypes.value.findIndex(v => v.id === id)
    if (index === -1) return
    viewTypes.value.splice(index, 1)
    delete views[id]
    if (currentViewId.value === id) {
      currentViewId.value = viewTypes.value[0]?.id ?? ''
    }
  }

  function renameViewType(id: string, name: string) {
    const vt = viewTypes.value.find(v => v.id === id)
    if (vt) vt.name = name
  }

  // ════════════════════════════════════════
  //  全局编辑同步
  // ════════════════════════════════════════

  function setGlobalMode(v: boolean) {
    globalMode.value = v
  }

  /**
   * 同步字段变更到数据模型和其他视图
   */
  function syncFieldToAll(fieldId: string, changedField: ComponentSchema) {
    // 同步到数据模型
    const modelChild = dataModel.schemas[0]?.children?.find(f => f.id === fieldId)
    if (modelChild) {
      Object.assign(modelChild, deepClone(changedField))
    }

    // 同步到其他视图
    for (const [viewId, view] of Object.entries(views)) {
      if (viewId === currentViewId.value) continue
      const viewChild = view.schemas[0]?.children?.find(f => f.id === fieldId)
      if (viewChild) {
        Object.assign(viewChild, deepClone(changedField))
      }
    }
  }

  // ════════════════════════════════════════
  //  数据导入/导出
  // ════════════════════════════════════════

  function setDataModel(schema: PageSchema) {
    Object.assign(dataModel, deepClone(schema))
  }

  function setViews(allViews: Record<string, PageSchema>) {
    for (const key of Object.keys(views)) {
      delete views[key]
    }
    for (const [key, val] of Object.entries(allViews)) {
      views[key] = deepClone(val) as PageSchema
    }
  }

  function getDataModel(): PageSchema {
    return deepClone(dataModel) as PageSchema
  }

  function getViews(): Record<string, PageSchema> {
    return deepClone(views) as Record<string, PageSchema>
  }

  function getViewTypes(): ViewTypeConfig[] {
    return [...viewTypes.value]
  }

  function setAll(dataModel_?: PageSchema, viewTypes_?: ViewTypeConfig[], views_?: Record<string, PageSchema>) {
    if (dataModel_) setDataModel(dataModel_)
    if (viewTypes_) {
      viewTypes.value = viewTypes_.map(v => ({ ...v }))
    }
    if (views_) {
      setViews(views_)
    } else {
      initDefaultViews()
    }
    if (!currentViewId.value && viewTypes.value.length > 0) {
      currentViewId.value = viewTypes.value[0].id
    }
  }

  return {
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
    setViews,
    getDataModel,
    getViews,
    getViewTypes,
    setAll,
  }
}