<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { ref } from 'vue';

import { EDesigner } from '@ies/core';
import { pluginManager } from '@ies/manager';

pluginManager.panel.hideActivitybar('源码');
pluginManager.panel.hideRightSidebar('样式');

setTimeout(() => {
  pluginManager.panel.showActivitybar('源码');
  pluginManager.panel.showRightSidebar('样式');
}, 8000);

const designerRef = ref<InstanceType<typeof EDesigner>>();
/**
 * 点击保存按钮操作
 * @param e
 */
function handleSubmit(e: PageSchema) {
  console.log(e);
}
</script>
<template>
  <EDesigner
    ref="designerRef"
    title="EpicDesigner基础用法示例"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>欢迎使用EpicDesigner设计器</div>
    </template>
  </EDesigner>
</template>
