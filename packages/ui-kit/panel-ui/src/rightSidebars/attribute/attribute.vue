<script lang="ts" setup>
import { computed, watchEffect } from 'vue';

import { EpicIcon } from '@ies/base-ui';
import { useDesignerContext, useTableMeta } from '@ies/hooks';
import { pluginManager } from '@ies/manager';
import { useClipboard } from '@vueuse/core';

import {
  getAttributeGroupChildAttributes,
  getSectionGroupTemplateAttributes,
  isInAttributeGroup,
  isSectionGroupTemplate,
} from './groupChildAttributes';

import EAttributeItem from './modules/attributeItem.vue';

const designer = useDesignerContext();
const pageSchema = designer.pageSchema;

const { copied, copy } = useClipboard();
watchEffect(() => {
  if (copied.value) {
    pluginManager.global.$message.success('节点ID复制成功');
  }
});

const componentConfigs = pluginManager.component.getComponentConfigs();
const selectedNode = computed(() => {
  return designer.state.selectedNode;
});

const tableMeta = useTableMeta(pluginManager);

// 检测选中节点的上下文
const contextAttributes = computed(() => {
  const matched = designer.state.matched;
  if (!matched || !selectedNode.value) return null;

  // 在 attribute-group 内 -> 显示属性组子配置面板
  if (isInAttributeGroup(matched)) {
    return getAttributeGroupChildAttributes();
  }

  // section-group 区块模板 -> 显示区块模板配置面板
  if (isSectionGroupTemplate(matched)) {
    return getSectionGroupTemplateAttributes();
  }

  return null;
});

// 获取组件属性配置
const componentAttributes = computed(() => {
  if (!selectedNode.value || !selectedNode.value.type) {
    return [];
  }

  // 上下文面板优先：如果检测到特殊上下文，替换标准属性
  if (contextAttributes.value) {
    return contextAttributes.value;
  }

  const baseAttributes =
    componentConfigs[selectedNode.value.type]?.config?.attribute ?? [];
  const allAttributes = [...baseAttributes];

  // 所有组件统一注入公共属性
  const matched = designer.state.matched
  const parent = matched.length >= 2 ? matched[matched.length - 2] : undefined
  const gridCols = parent?.props?.gridCols ?? 4
  allAttributes.push({
    field: 'props.span',
    label: '栅格占列',
    props: {
      min: 1,
      max: gridCols,
    },
    show: ({ parent }) => parent?.props?.formMode === 'grid',
    type: 'number',
  });

  if (selectedNode.value.id === pageSchema.schemas[0]?.id) {
    allAttributes.push(
      {
        editData: pageSchema,
        field: 'canvas.width',
        label: '画布宽度',
        type: 'EInputSize',
      },
      {
        editData: pageSchema,
        field: 'canvas.height',
        label: '画布高度',
        type: 'EInputSize',
      },
    );
  }

  return allAttributes;
});
</script>
<template>
  <div :key="selectedNode?.id" class="ep-attribute-view">
    <!-- 组件id展示 start -->
    <div
      class="ep-attr-item mb-2 mt-2 flex h-8 cursor-pointer items-center px-4"
    >
      <div
        class="bg-$ep-secondary rounded-1 h-full flex-1 px-2 leading-8"
        @click="copy(designer.state.selectedNode?.id ?? '')"
      >
        <EpicIcon
          class="ep-component-icon translate-y-2px mr-1"
          :name="
            pluginManager.component.getIcon(designer.state.selectedNode!.type)
          "
        />
        {{ designer.state.selectedNode?.id }}
      </div>
    </div>
    <!-- 组件id展示 end -->
    <!-- 数据表 start -->
    <div
      v-if="tableMeta?.tableRemark && designer.state.selectedNode?.input"
      class="ep-attr-item mb-2 flex h-8 cursor-pointer items-center px-4"
    >
      <div class="ep-attr-label">数据表</div>
      <div class="bg-$ep-secondary rounded-1 h-full flex-1 px-2 leading-8">
        {{ tableMeta.tableRemark }}
      </div>
    </div>
    <!-- 数据表 end -->
    <div v-for="item in componentAttributes" :key="item.field">
      <EAttributeItem :schema="item" />
    </div>
  </div>
</template>
