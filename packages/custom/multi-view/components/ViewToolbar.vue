<script lang="ts" setup>
import type { DesignerMode, ViewTypeConfig } from '../types';

import { ref } from 'vue';

import { ElButton, ElInput, ElMessageBox, ElPopover } from 'element-plus';

const props = defineProps<{
  mode: DesignerMode;
  viewTypes: ViewTypeConfig[];
  currentViewId: string | null;
  title?: string;
}>();

const emit = defineEmits<{
  'set-mode': [mode: DesignerMode];
  'switch-view': [viewId: string];
  'add-view': [name: string];
  'remove-view': [id: string];
  'rename-view': [id: string, name: string];
  save: [];
  preview: [];
}>();

// 新增视图弹窗
const showAddPopover = ref(false);
const newViewName = ref('');

function handleAddView() {
  const name = newViewName.value.trim();
  if (!name) return;
  emit('add-view', name);
  newViewName.value = '';
  showAddPopover.value = false;
}

function handleRemoveView(view: ViewTypeConfig) {
  if (props.viewTypes.length <= 1) {
    ElMessageBox.alert('至少需要保留一个视图类型', '提示');
    return;
  }
  ElMessageBox.confirm(
    `删除视图「${view.name}」将同时删除该视图下所有字段的覆盖配置，确认删除？`,
    '删除确认',
    { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' },
  )
    .then(() => {
      emit('remove-view', view.id);
    })
    .catch(() => {});
}

function handleRenameView(view: ViewTypeConfig) {
  ElMessageBox.prompt('请输入新的视图名称', '重命名视图', {
    inputValue: view.name,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      if (value && value.trim()) {
        emit('rename-view', view.id, value.trim());
      }
    })
    .catch(() => {});
}
</script>

<template>
  <header class="mv-toolbar">
    <!-- 左侧：模式切换 -->
    <div class="mv-toolbar-left">
      <div class="mv-mode-switch">
        <button
          class="mv-mode-btn"
          :class="{ active: mode === 'model' }"
          @click="emit('set-mode', 'model')"
        >
          数据模型
        </button>
        <button
          class="mv-mode-btn"
          :class="{ active: mode === 'view' }"
          @click="emit('set-mode', 'view')"
        >
          视图设计
        </button>
      </div>
    </div>

    <!-- 中间：视图标签（仅视图设计模式显示） -->
    <div class="mv-toolbar-center">
      <template v-if="mode === 'view'">
        <div class="mv-view-tabs">
          <div
            v-for="view in viewTypes"
            :key="view.id"
            class="mv-view-tab"
            :class="{ active: currentViewId === view.id }"
            @click="emit('switch-view', view.id)"
            @contextmenu.prevent="
              (e) => {
                e.stopPropagation();
              }
            "
          >
            <span class="mv-view-tab-name" @dblclick="handleRenameView(view)">
              {{ view.name }}
            </span>
            <span
              v-if="viewTypes.length > 1"
              class="mv-view-tab-close"
              @click.stop="handleRemoveView(view)"
            >
              ×
            </span>
          </div>

          <!-- 新增视图按钮 -->
          <ElPopover
            v-model:visible="showAddPopover"
            placement="bottom"
            :width="200"
            trigger="click"
          >
            <template #reference>
              <button class="mv-view-add-btn">+</button>
            </template>
            <div class="mv-add-view-form">
              <ElInput
                v-model="newViewName"
                placeholder="输入视图名称"
                size="small"
                @keyup.enter="handleAddView"
              />
              <ElButton
                size="small"
                type="primary"
                class="mv-add-view-btn"
                @click="handleAddView"
              >
                添加
              </ElButton>
            </div>
          </ElPopover>
        </div>
      </template>
      <template v-else>
        <span class="mv-toolbar-title">{{ title }}</span>
      </template>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="mv-toolbar-right">
      <ElButton size="small" @click="emit('preview')">预览</ElButton>
      <ElButton size="small" type="primary" @click="emit('save')">保存</ElButton>
    </div>
  </header>
</template>

<style scoped>
.mv-toolbar {
  display: flex;
  align-items: center;
  height: 48px;
  min-height: 48px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  gap: 12px;
}

.mv-toolbar-left {
  flex-shrink: 0;
}

.mv-toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
}

.mv-toolbar-title {
  font-size: 14px;
  color: #666;
}

.mv-toolbar-right {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}

/* 模式切换 */
.mv-mode-switch {
  display: flex;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}

.mv-mode-btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.mv-mode-btn.active {
  background: #fff;
  color: var(--ep-primary-color, #409eff);
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 视图标签 */
.mv-view-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mv-view-tab {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  background: #f5f5f5;
  border: 1px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.mv-view-tab:hover {
  background: #e8f4ff;
  color: var(--ep-primary-color, #409eff);
}

.mv-view-tab.active {
  background: var(--ep-primary-color, #409eff);
  color: #fff;
  border-color: var(--ep-primary-color, #409eff);
}

.mv-view-tab-name {
  user-select: none;
}

.mv-view-tab-close {
  margin-left: 4px;
  font-size: 14px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.mv-view-tab-close:hover {
  opacity: 1;
}

.mv-view-add-btn {
  width: 28px;
  height: 28px;
  border: 1px dashed #ccc;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.mv-view-add-btn:hover {
  border-color: var(--ep-primary-color, #409eff);
  color: var(--ep-primary-color, #409eff);
}

.mv-add-view-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mv-add-view-btn {
  width: 100%;
}
</style>
