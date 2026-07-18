<script lang="ts" setup>
import { computed, ref } from 'vue'
import { EpicIcon, EpicTree } from '@ies/base-ui'
import { useDesignerContext } from '@ies/hooks'
import { pluginManager } from '@ies/manager'
import type { ComponentSchema } from '@ies/types'

const { pageSchema } = useDesignerContext()

const modelFields = computed(() => pageSchema.schemas[0]?.children ?? [])
const selectedKeys = ref<string[]>([])

function handleNodeClick({ componentSchema }: { componentSchema: ComponentSchema }) {
  if (componentSchema.id) {
    selectedKeys.value = [componentSchema.id]
  }
}

function getFieldIcon(type: string): string {
  return pluginManager.component.getIcon(type) ?? ''
}
</script>

<template>
  <div class="ep-field-pool">
    <div class="ep-field-pool-header">
      字段池
      <span class="ep-field-count">{{ modelFields.length }} 个字段</span>
    </div>
    <EpicTree
      :options="modelFields"
      :selected-keys="selectedKeys"
      @node-click="handleNodeClick"
    >
      <template #tree-node="{ schema }">
        <div class="ep-outline-item ep-text-padding flex">
          <EpicIcon
            class="ep-component-icon translate-y-2px"
            :name="getFieldIcon(schema.type)"
          />
          <span class="max-w-full truncate">
            {{ schema.label ?? pluginManager.component.getLabel(schema.type) }}
          </span>
          <span class="ep-node-type-text w-0 flex-1 truncate">
            {{ schema.id }}
          </span>
        </div>
      </template>
    </EpicTree>
    <div
      v-if="modelFields.length === 0"
      class="pt-42px text-center text-gray-400"
    >
      暂无字段
    </div>
  </div>
</template>

<style scoped>
.ep-field-pool {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.ep-field-pool-header {
  padding: 8px 12px;
  font-weight: 500;
  border-bottom: 1px solid var(--ep-border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.ep-field-count {
  font-size: 11px;
  color: var(--ep-text-helper);
  font-weight: normal;
}
</style>