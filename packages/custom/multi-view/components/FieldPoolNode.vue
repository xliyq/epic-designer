<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types'
import { VueDraggable } from 'vue-draggable-plus'
import { EpicIcon } from '@ies/base-ui'
import { pluginManager } from '@ies/manager'
import { deepClone } from '@ies/utils'

defineOptions({ name: 'FieldPoolNode' })

const props = withDefaults(defineProps<{
  schemas: ComponentSchema[]
  selectedFieldId: string
  depth?: number
  draggable?: boolean
  excludedIds?: string[]
}>(), { depth: 0, draggable: true, excludedIds: () => [] })

const emit = defineEmits<{
  select: [schema: ComponentSchema]
}>()

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}

function isLeaf(field: ComponentSchema): boolean {
  return !field.children || field.children.length === 0 || field.input === true
}

function cloneField(schema: ComponentSchema): ComponentSchema {
  return deepClone(schema)
}

function isFiltered(id: string | undefined): boolean {
  if (!id) return true
  // 模型模式下全部禁止拖拽
  if (!props.draggable) return true
  // 视图模式下已存在的字段禁止重复拖入
  return props.excludedIds.includes(id)
}
</script>

<template>
  <VueDraggable
    v-if="draggable"
    :model-value="schemas"
    :group="{ name: 'edit-draggable', pull: 'clone', put: false }"
    :sort="false"
    :animation="180"
    ghost-class="ep-field-dragging"
    :clone="cloneField"
    :filter="(el: any) => isFiltered(el?.dataset?.id)"
    item-key="id"
  >
    <div
      v-for="element in schemas"
      :key="element.id"
      :data-id="element.id"
    >
      <div
        class="ep-field-item ep-text-padding"
        :class="{
          selected: element.id === selectedFieldId,
          'not-draggable': !draggable || (element.id ? excludedIds.includes(element.id) : false),
        }"
        :style="{ paddingLeft: `${12 + depth * 16}px` }"
        @click="emit('select', element)"
      >
        <EpicIcon
          class="ep-component-icon"
          :name="getFieldIcon(element.type)"
        />
        <span class="ep-field-label">{{ element.label ?? element.type }}</span>
        <span class="ep-field-type-text">{{ element.id }}</span>
      </div>
      <FieldPoolNode
        v-if="!isLeaf(element) && element.children"
        :schemas="element.children"
        :selected-field-id="selectedFieldId"
        :depth="depth + 1"
        :draggable="draggable"
        :excluded-ids="excludedIds"
        @select="(s: ComponentSchema) => emit('select', s)"
      />
    </div>
  </VueDraggable>
  <!-- 非拖拽模式：纯展示 -->
  <div v-else>
    <div
      v-for="element in schemas"
      :key="element.id"
    >
      <div
        class="ep-field-item ep-text-padding not-draggable"
        :class="{ selected: element.id === selectedFieldId }"
        :style="{ paddingLeft: `${12 + depth * 16}px` }"
        @click="emit('select', element)"
      >
        <EpicIcon
          class="ep-component-icon"
          :name="getFieldIcon(element.type)"
        />
        <span class="ep-field-label">{{ element.label ?? element.type }}</span>
        <span class="ep-field-type-text">{{ element.id }}</span>
      </div>
      <FieldPoolNode
        v-if="!isLeaf(element) && element.children"
        :schemas="element.children"
        :selected-field-id="selectedFieldId"
        :depth="depth + 1"
        :draggable="draggable"
        :excluded-ids="excludedIds"
        @select="(s: ComponentSchema) => emit('select', s)"
      />
    </div>
  </div>
</template>

<style scoped>
.ep-field-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  cursor: grab;
  font-size: 13px;
  line-height: 30px;
  min-height: 30px;
  transition: background 0.15s;
}
.ep-field-item:hover {
  background: var(--ep-muted);
}
.ep-field-item.selected {
  background: var(--ep-primary-faded);
}
.ep-field-item.not-draggable {
  cursor: default;
  opacity: 0.6;
}
.ep-field-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ep-field-type-text {
  font-size: var(--ep-text-sm);
  color: var(--ep-disabled);
  flex-shrink: 0;
}
</style>