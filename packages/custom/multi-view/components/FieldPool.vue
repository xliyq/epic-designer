<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { EpicIcon, EpicTree, EpTooltip } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'

const props = withDefaults(defineProps<{
  mode: 'model' | 'view'
  modelFields: ComponentSchema[]
  addFieldToView: (fieldId: string) => void
}>(), {})

const { pageSchema } = useDesignerContext()

const displayFields = computed(() => {
  if (props.mode === 'model') {
    return [...(pageSchema.schemas[0]?.children ?? [])]
  }
  return [...props.modelFields]
})

const selectedKeys = ref<string[]>([])
const folded = ref(false)

// 递归收集视图所有层级的字段 ID（保证嵌套字段也能正确标识 ✓）
const viewFieldIdSet = computed(() => {
  if (props.mode !== 'view') return new Set<string>()
  const ids = new Set<string>()
  function walk(fields: ComponentSchema[]) {
    for (const f of fields) {
      if (f.id) ids.add(f.id)
      if (f.children?.length) walk(f.children)
    }
  }
  walk(pageSchema.schemas[0]?.children ?? [])
  return ids
})
const inViewCount = computed({
  get: () => viewFieldIdSet.value.size,
  // 叶子总数只统计 displayFields 中的叶子字段
})

/** 在字段树中递归查找某个字段的直属父级 */
function findParentField(fields: ComponentSchema[], childId: string): ComponentSchema | null {
  for (const field of fields) {
    if (field.children?.length) {
      if (field.children.some(c => c.id === childId)) {
        return field
      }
      const found = findParentField(field.children, childId)
      if (found) return found
    }
  }
  return null
}

/** 判断是否为第一层字段 */
function isTopLevelField(id: string): boolean {
  return props.modelFields.some(f => f.id === id)
}

function handleNodeClick({ componentSchema }: { componentSchema: ComponentSchema }) {
  if (!componentSchema.id) return
  selectedKeys.value = [componentSchema.id]

  if (props.mode !== 'view') return

  const topLevel = isTopLevelField(componentSchema.id)

  if (topLevel) {
    // 第一层：单字段或容器，直接添加（容器字段会连带子字段一起 deepClone）
    if (viewFieldIdSet.value.has(componentSchema.id)) {
      ElMessage.info('该字段已添加')
      return
    }
    props.addFieldToView(componentSchema.id)
    return
  }

  // 嵌套子字段
  const parent = findParentField(props.modelFields, componentSchema.id)
  if (!parent) return

  if (!viewFieldIdSet.value.has(parent.id!)) {
    // 父级未添加 → 提示先加父级
    ElMessage.info(`请先添加父级字段「${parent.label || parent.type}」`)
    return
  }

  // 父级已添加
  if (viewFieldIdSet.value.has(componentSchema.id)) {
    ElMessage.info('该字段已添加')
    return
  }

  // 父级已添加 + 自己未添加 → 直接添加到视图顶层
  props.addFieldToView(componentSchema.id)
}

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}

function isLeafField(schema: ComponentSchema): boolean {
  return !schema.children || schema.children.length === 0 || schema.input === true
}

function countAllFields(schemas: ComponentSchema[]): number {
  let count = 0
  for (const s of schemas) {
    count++  // 当前节点（容器或叶子都算）
    if (s.children?.length) {
      count += countAllFields(s.children)
    }
  }
  return count
}

const totalFieldCount = computed(() => countAllFields(displayFields.value))
</script>

<template>
  <div class="ep-field-pool-section">
    <!-- 48px 图标栏 -->
    <div class="ep-field-bar">
      <EpTooltip placement="right" content="字段池">
        <div
          class="ep-field-bar-item"
          :class="{ checked: !folded }"
          @click="folded = !folded"
        >
          <EpicIcon name="icon--epic--list" />
        </div>
      </EpTooltip>
    </div>

    <!-- 280px 内容区 -->
    <div v-show="!folded" class="ep-field-sidebar">
      <div class="ep-field-sidebar-container">
        <div class="ep-field-header">
          <span>字段池</span>
          <span class="ep-field-count">{{ inViewCount }}/{{ totalFieldCount }} 个</span>
        </div>
        <div class="ep-field-body">
          <EpicTree
            v-if="displayFields.length > 0"
            :options="displayFields"
            :selected-keys="selectedKeys"
            @node-click="handleNodeClick"
          >
            <template #tree-node="{ schema }">
              <div
                class="ep-outline-item ep-text-padding flex items-center"
                :class="{
                  'is-disabled': props.mode === 'view' && schema.id ? isTopLevelField(schema.id) && viewFieldIdSet.has(schema.id) : false,
                }"
              >
                <EpicIcon
                  class="ep-component-icon"
                  :name="getFieldIcon(schema.type)"
                />
                <span class="max-w-full truncate">
                  {{ schema.label ?? pluginManager.component.getLabel(schema.type) }}
                </span>
                <span class="ep-node-type-text w-0 flex-1 truncate">
                  {{ schema.id }}
                </span>
                <span
                  v-if="props.mode === 'view' && schema.id && viewFieldIdSet.has(schema.id)"
                  class="ep-field-check"
                >
                  ✓
                </span>
              </div>
            </template>
          </EpicTree>
          <div
            v-if="displayFields.length === 0"
            class="pt-42px text-center text-gray-400"
          >
            暂无字段
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ep-field-pool-section {
  display: flex;
  flex-direction: row;
  border-top: 1px solid var(--ep-border);
  flex-shrink: 0;
}
.ep-field-bar {
  width: 48px;
  background-color: var(--ep-designer-background);
  border-left: 1px solid var(--ep-border);
  border-right: 1px solid var(--ep-border);
  padding: 8px 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ep-field-bar-item {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ep-radius);
  cursor: pointer;
  color: var(--ep-text-main);
  transition: all 0.3s;
  font-size: 16px;
}
.ep-field-bar-item::before {
  content: '';
  height: 80%;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--ep-primary);
  border-radius: var(--ep-radius);
  opacity: 0;
  transition: all 0.3s;
}
.ep-field-bar-item:hover {
  background: var(--ep-muted);
}
.ep-field-bar-item.checked {
  color: var(--ep-primary-foreground);
}
.ep-field-bar-item.checked::before {
  opacity: 1;
}
.ep-field-sidebar {
  width: 280px;
  background-color: var(--ep-designer-background);
  border-right: 1px solid var(--ep-border);
  overflow: hidden;
  flex-shrink: 0;
}
.ep-field-sidebar-container {
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ep-field-header {
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--ep-border);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  flex-shrink: 0;
  user-select: none;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
  margin-left: auto;
}
.ep-field-body {
  flex: 1;
  overflow: auto;
}
.ep-field-pool-section :deep(.ep-outline-item.is-disabled) {
  opacity: 0.5;
  cursor: default;
}
.ep-field-check {
  font-size: 12px;
  color: var(--ep-primary);
  flex-shrink: 0;
  margin-left: 4px;
}
</style>
