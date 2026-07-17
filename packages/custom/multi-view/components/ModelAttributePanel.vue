<script lang="ts" setup>
/**
 * 模型属性面板（数据模型模式下使用）
 * 直接复用 epic-designer 的属性面板
 */
import AttributeView from '@ies/panel-ui/src/rightSidebars/attribute/attribute.vue';
</script>

<template>
  <div class="mv-model-attr">
    <div class="mv-model-attr-tabs">
      <span class="mv-model-attr-tab active">属性</span>
    </div>
    <div class="mv-model-attr-content">
      <AttributeView />
    </div>
  </div>
</template>

<style scoped>
.mv-model-attr {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mv-model-attr-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
}

.mv-model-attr-tab {
  padding: 10px 0;
  font-size: 13px;
  color: var(--ep-primary-color, #409eff);
  border-bottom: 2px solid var(--ep-primary-color, #409eff);
  font-weight: 500;
}

.mv-model-attr-content {
  flex: 1;
  overflow-y: auto;
}
</style>
