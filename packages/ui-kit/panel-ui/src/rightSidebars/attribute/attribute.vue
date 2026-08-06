<script lang="ts" setup>
import type { ComponentSchema } from '@ies/types';

import { computed, watchEffect } from 'vue';

import { EpicIcon } from '@ies/base-ui';
import { useDesignerContext, useTableMeta } from '@ies/hooks';
import { pluginManager } from '@ies/manager';
import { deepClone } from '@ies/utils';
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
    const parent = matched.length >= 2 ? matched[matched.length - 2] : undefined;
    const parentGridEnabled = parent?.props?.gridEnable === true;
    const gridCols = parent?.props?.gridCols ?? 4;
    return getAttributeGroupChildAttributes(
      pluginManager,
      selectedNode.value.type,
      { gridEnabled: parentGridEnabled, gridCols },
    );
  }

  // section-group 区块模板 -> 显示区块模板配置面板
  if (isSectionGroupTemplate(matched)) {
    return getSectionGroupTemplateAttributes();
  }

  return null;
});

// 组件类型切换：扁平列表，展示所有已注册组件
const componentTypeOptions = computed(() => {
  return Object.values(componentConfigs)
    .filter((config) => config.groupName && config.defaultSchema?.type)
    .map((config) => ({
      label: config.defaultSchema.label ?? config.defaultSchema.type!,
      value: config.defaultSchema.type!,
    }));
});

// 是否显示组件类型切换器：上下文面板时不显示
const showComponentTypeSwitcher = computed(() => {
  return !contextAttributes.value && !!selectedNode.value?.type;
});

// 组件类型切换 schema 配置项
const componentTypeSchema = computed<ComponentSchema>(() => ({
  field: 'type',
  label: '组件类型',
  type: 'select',
  props: {
    options: componentTypeOptions.value,
    placeholder: '请选择组件类型',
  },
  changeSync: true,
  onChange: ({ value }) => {
    handleComponentTypeChange(value as string);
  },
}));

/**
 * 切换当前选中节点的组件类型
 * 以新组件 defaultSchema.props 为基础，旧 props 中同名的 key 保留旧值（用户已配置的数据）
 * 保留通用属性（id、field、label、rules、children、on、hideLabel）
 */
function handleComponentTypeChange(newType: string) {
  const node = selectedNode.value;
  if (!node || !newType || newType === node.type) return;

  const newConfig = componentConfigs[newType];
  if (!newConfig?.defaultSchema) return;

  // 深拷贝新组件的默认 props，避免污染注册中心的配置
  const newProps = deepClone(newConfig.defaultSchema.props ?? {});

  // 以新 props 为基础，旧 props 中同名的 key 保留旧值（如 options、placeholder 等）
  const oldProps = node.props ?? {};
  for (const key of Object.keys(newProps)) {
    if (key in oldProps) {
      newProps[key] = deepClone(oldProps[key]);
    }
  }

  node.type = newType;
  node.props = newProps;

  // 将修改推入撤销栈
  designer.revoke.push('切换组件类型', true);
}

  // 获取选中节点的父节点，用于判断栅格配置
  const parent = computed(() => {
    const matched = designer.state.matched;
    if (!matched || matched.length < 2) return undefined;
    return matched[matched.length - 2];
  });
  const gridCols = computed(() => parent.value?.props?.gridCols ?? 4);
  const parentGridEnabled = computed(() => parent.value?.props?.gridEnable === true);

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
    const allAttributes: ComponentSchema[] = [];

    // 拷贝组件自身属性，并在 hidden 属性后紧跟插入 submitData
    for (const attr of baseAttributes) {
      allAttributes.push(attr);
      if (attr.field === 'props.hidden') {
        allAttributes.push({
          field: 'props.submitData',
          label: '提交数据',
          type: 'switch',
          props: {
            defaultValue: true,
          },
          show: ({ values }) => values.props?.hidden === true,
          description: '组件隐藏时，是否仍提交表单数据',
        });
      }
    }

    // 所有组件统一注入公共属性
    allAttributes.push({
      field: 'hideLabel',
      label: '隐藏标签',
      type: 'switch',
      description: '隐藏表单项标签并清除标签占位空间',
    });
    allAttributes.push({
      field: 'props.span',
      label: '栅格占列',
      props: {
        min: 1,
        max: gridCols.value,
      },
      show: parentGridEnabled.value,
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
        class="bg-$ep-secondary rounded-1 h-full flex-1 truncate px-2 leading-8"
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
    <!-- 组件类型切换 start -->
    <EAttributeItem
      v-if="showComponentTypeSwitcher"
      :schema="componentTypeSchema"
    />
    <!-- 组件类型切换 end -->
    <div v-for="item in componentAttributes" :key="item.field">
      <EAttributeItem :schema="item" :parent="parent" />
    </div>
  </div>
</template>
