<script lang="ts" setup>
import type { DataSourceSchema, DataSourceOption } from '@ies/types';

import { computed, nextTick, onMounted, reactive, ref, useAttrs, watch } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElRadio,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { useFormData } from '@ies/hooks';
import { pluginManager } from '@ies/manager';

// 样式导入
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/dialog/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/pagination/style/css';
import 'element-plus/es/components/radio/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/table-column/style/css';
import 'element-plus/es/components/table/style/css';
import 'element-plus/es/components/tag/style/css';

defineOptions({ name: 'EpModalPicker', inheritAttrs: false });

const props = defineProps<{
  dataSource?: DataSourceSchema | null;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const attrs = useAttrs();
const formData = useFormData();

// ============ 响应式状态 ============

const dialogVisible = ref(false);
const loading = ref(false);
const tableData = ref<any[]>([]);
const allData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const searchForm = reactive<Record<string, any>>({});

// 弹窗内临时选中状态（确认前不修改 modelValue）
const tempSelected = ref<any[]>([]);
// 单选模式下当前选中的行 key
const currentRowKey = ref<any>(null);

// 选中缓存：key = 行标识值, value = 完整行数据
const selectedCache = ref<Map<any, any>>(new Map());

// ElTable 引用
const tableRefInstance = ref<any>(null);

// ============ 计算属性 ============

const multiple = computed(() => !!attrs.multiple);
const multipleLimit = computed(() => Number(attrs.multipleLimit ?? 0));
const searchable = computed(() => !!attrs.searchable);
const searchFields = computed(() => (attrs.searchFields as any[]) ?? []);
const columns = computed(() => (attrs.columns as any[]) ?? []);
const rowKeyField = computed(() => (attrs.rowKey as string) || 'value');
const labelField = computed(() => 'label');
const paginationEnabled = computed(() => attrs.pagination !== false);
const pageSize = computed(() => Number(attrs.pageSize ?? 10));
const disabled = computed(() => !!attrs.disabled);
const clearable = computed(() => !!attrs.clearable);

const modalTitle = computed(() => (attrs.modalTitle as string) || '请选择');
const modalWidth = computed(() => (attrs.modalWidth as string) || '800px');

const modelValue = computed(() => attrs.modelValue);

// 判断是否服务端分页
const isServerPaged = computed(() => {
  const ds = props.dataSource;
  if (!ds) return false;
  const provider = pluginManager.dataSource.get(ds.type);
  return !!provider?.pagedLoader;
});

// 显示文本（单选）
const displayText = computed(() => {
  if (multiple.value) return '';
  const val = modelValue.value;
  if (val == null) return '';
  const item = selectedCache.value.get(val);
  return item?.[labelField.value] ?? '';
});

// 多选显示的 tag 列表
const displayTags = computed(() => {
  if (!multiple.value) return [];
  const val = modelValue.value;
  if (!Array.isArray(val)) return [];
  return val
    .map((v) => {
      const item = selectedCache.value.get(v);
      return item ? { value: v, label: item[labelField.value] ?? v } : null;
    })
    .filter(Boolean) as { value: any; label: string }[];
});

// ============ 工具函数 ============

function getItemValue(item: any): any {
  if (!item) return null;
  return item[rowKeyField.value];
}

// ============ 数据加载 ============

async function loadData() {
  const ds = props.dataSource;
  if (!ds) return;
  const provider = pluginManager.dataSource.get(ds.type);
  if (!provider) return;

  const context: any = {
    formData: formData.value,
    global: pluginManager.global,
  };

  loading.value = true;
  try {
    if (isServerPaged.value) {
      // 服务端分页
      const pagedCtx = {
        ...context,
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        searchParams: { ...searchForm },
      };
      const result = await provider.pagedLoader!(ds.config, pagedCtx);
      tableData.value = result.list;
      total.value = result.total;
    } else {
      // 前端分页：全量加载后切片
      const all = await provider.loader(ds.config, context);
      allData.value = all;
      total.value = all.length;
      applyFrontendFilter();
    }
    // 数据加载完成后恢复表格选中状态
    await nextTick();
    restoreSelection();
  } catch (e) {
    console.error('[modal-picker] 数据加载失败:', e);
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// 前端搜索过滤 + 切片
function applyFrontendFilter() {
  let filtered = allData.value;

  // 对每个搜索字段做 includes 模糊匹配
  for (const field of searchFields.value) {
    const keyword = searchForm[field.field];
    if (keyword != null && keyword !== '') {
      filtered = filtered.filter((item) => {
        const val = item[field.field];
        if (val == null) return false;
        return String(val).toLowerCase().includes(String(keyword).toLowerCase());
      });
    }
  }

  total.value = filtered.length;
  const start = (currentPage.value - 1) * pageSize.value;
  tableData.value = filtered.slice(start, start + pageSize.value);
}

// 恢复表格选中状态
function restoreSelection() {
  const tableRef = tableRefInstance.value;
  if (!tableRef) return;

  if (multiple.value) {
    // 多选：遍历 tempSelected，对表格中匹配的行调用 toggleRowSelection
    const selectedKeys = new Set(tempSelected.value.map((item) => getItemValue(item)));
    tableData.value.forEach((row) => {
      if (selectedKeys.has(getItemValue(row))) {
        tableRef.toggleRowSelection(row, true);
      }
    });
  } else {
    // 单选：记录当前选中行的 rowKey
    if (tempSelected.value.length > 0) {
      currentRowKey.value = getItemValue(tempSelected.value[0]);
    }
  }
}

// ============ 搜索 ============

function handleSearch() {
  currentPage.value = 1;
  if (isServerPaged.value) {
    loadData();
  } else {
    applyFrontendFilter();
    nextTick(() => restoreSelection());
  }
}

function handleResetSearch() {
  for (const key in searchForm) {
    searchForm[key] = undefined;
  }
  currentPage.value = 1;
  if (isServerPaged.value) {
    loadData();
  } else {
    applyFrontendFilter();
    nextTick(() => restoreSelection());
  }
}

// ============ 分页 ============

function handlePageChange(page: number) {
  currentPage.value = page;
  if (isServerPaged.value) {
    loadData();
  } else {
    applyFrontendFilter();
    nextTick(() => restoreSelection());
  }
}

function handleSizeChange() {
  currentPage.value = 1;
  // pageSize 通过 attrs 控制，这里重新加载当前页
  if (isServerPaged.value) {
    loadData();
  } else {
    applyFrontendFilter();
    nextTick(() => restoreSelection());
  }
}

// ============ 选中管理 ============

// 打开弹窗
function openDialog() {
  if (disabled.value) return;
  dialogVisible.value = true;
  // 清空搜索表单
  for (const key in searchForm) {
    searchForm[key] = undefined;
  }
  currentPage.value = 1;
  // 从缓存恢复已选项
  tempSelected.value = Array.from(selectedCache.value.values()).map((item) => ({ ...item }));
  currentRowKey.value = null;
  loadData();
}

// 单选：行点击选中
function handleRowClick(row: any) {
  if (multiple.value) {
    // 多选：切换该行选中状态
    const tableRef = tableRefInstance.value;
    if (!tableRef) return;
    const rowKey = getItemValue(row);
    const existIdx = tempSelected.value.findIndex((item) => getItemValue(item) === rowKey);
    if (existIdx >= 0) {
      // 取消选中
      tempSelected.value.splice(existIdx, 1);
      tableRef.toggleRowSelection(row, false);
    } else {
      // 检查限制
      if (multipleLimit.value > 0 && tempSelected.value.length >= multipleLimit.value) {
        ElMessage.warning(`最多只能选择 ${multipleLimit.value} 项`);
        return;
      }
      tempSelected.value.push({ ...row });
      tableRef.toggleRowSelection(row, true);
    }
  } else {
    // 单选：直接选中
    tempSelected.value = [{ ...row }];
    currentRowKey.value = getItemValue(row);
  }
}

// 多选：selection 列变化
function handleSelectionChange(selection: any[]) {
  if (multiple.value) {
    tempSelected.value = selection.map((item) => ({ ...item }));
  }
}

// 多选：手动勾选/取消勾选（限制数量）
function handleSelect(selection: any[], row: any) {
  if (multipleLimit.value > 0 && selection.length > multipleLimit.value) {
    const tableRef = tableRefInstance.value;
    if (tableRef) {
      tableRef.toggleRowSelection(row, false);
    }
    ElMessage.warning(`最多只能选择 ${multipleLimit.value} 项`);
  }
}

// 行样式：单选高亮当前行
function rowClassName({ row }: { row: any }) {
  if (!multiple.value && currentRowKey.value != null) {
    if (getItemValue(row) === currentRowKey.value) {
      return 'is-selected';
    }
  }
  return '';
}

// 确认选择
function handleConfirm() {
  const values = tempSelected.value.map((item) => getItemValue(item));
  const newVal = multiple.value ? values : (values[0] ?? null);
  emit('update:modelValue', newVal);
  emit('change', newVal);
  // 更新缓存
  const newCache = new Map<any, any>();
  for (const item of tempSelected.value) {
    newCache.set(getItemValue(item), item);
  }
  selectedCache.value = newCache;
  dialogVisible.value = false;
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
}

// ============ 外部交互 ============

// 清空
function handleClear(e: Event) {
  e.stopPropagation();
  emit('update:modelValue', multiple.value ? [] : null);
  emit('change', multiple.value ? [] : null);
  selectedCache.value = new Map();
  tempSelected.value = [];
}

// 多选 tag 关闭
function handleTagClose(value: any) {
  if (!multiple.value) return;
  const val = modelValue.value;
  if (!Array.isArray(val)) return;
  const newVal = val.filter((v) => v !== value);
  emit('update:modelValue', newVal);
  emit('change', newVal);
  selectedCache.value.delete(value);
  selectedCache.value = new Map(selectedCache.value);
}

// ============ 回显机制 ============

// 从缓存中匹配
function getFromCache(value: any): DataSourceOption[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const items = value
      .map((v) => selectedCache.value.get(v))
      .filter(Boolean) as DataSourceOption[];
    if (items.length === value.length) return items;
    return null;
  } else {
    const item = selectedCache.value.get(value);
    return item ? [item] : null;
  }
}

onMounted(async () => {
  const val = attrs.modelValue;
  if (val == null || (Array.isArray(val) && val.length === 0)) return;

  // 先尝试从缓存匹配
  const cached = getFromCache(val);
  if (cached && cached.length > 0) {
    selectedCache.value = new Map(cached.map((item) => [getItemValue(item), item]));
    return;
  }

  // 调 detailLoader 回显
  const ds = props.dataSource;
  if (!ds) return;
  const provider = pluginManager.dataSource.get(ds.type);
  if (!provider?.detailLoader) return;

  try {
    const result = await provider.detailLoader(ds.config, {
      formData: formData.value,
      global: pluginManager.global,
      value: val,
    });
    if (Array.isArray(result)) {
      selectedCache.value = new Map(result.map((item) => [getItemValue(item), item]));
    } else if (result) {
      selectedCache.value = new Map([[getItemValue(result), result]]);
    }
  } catch (e) {
    console.error('[modal-picker] 回显加载失败:', e);
  }
});

// 监听 modelValue 变化（外部清空时同步缓存）
watch(
  () => attrs.modelValue,
  (val) => {
    if (val == null || (Array.isArray(val) && val.length === 0)) {
      selectedCache.value = new Map();
    }
  },
);
</script>

<template>
  <div class="ep-modal-picker">
    <!-- 外层触发区域 -->
    <div class="ep-modal-picker__trigger" @click="openDialog">
      <!-- 多选 tag 展示 -->
      <template v-if="multiple && displayTags.length > 0">
        <div class="ep-modal-picker__tags">
          <ElTag
            v-for="tag in displayTags"
            :key="tag.value"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag.value)"
            @click.stop
          >
            {{ tag.label }}
          </ElTag>
        </div>
      </template>
      <!-- 只读输入框 -->
      <ElInput
        :model-value="displayText"
        :placeholder="(attrs.placeholder as string) || '请选择'"
        readonly
        :disabled="disabled"
      >
        <template #suffix>
          <span
            v-if="clearable && !disabled && (displayText || displayTags.length > 0)"
            class="ep-modal-picker__clear"
            @click="handleClear"
          >
            ✕
          </span>
          <span v-else class="ep-modal-picker__arrow"> ⌕ </span>
        </template>
      </ElInput>
    </div>

    <!-- 弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="modalTitle"
      :width="modalWidth"
      append-to-body
      destroy-on-close
      class="ep-modal-picker__dialog"
    >
      <!-- 搜索区域 -->
      <div
        v-if="searchable && searchFields.length"
        class="ep-modal-picker__search"
      >
        <ElForm :model="searchForm" inline>
          <ElFormItem
            v-for="field in searchFields"
            :key="field.field"
            :label="field.label"
          >
            <!-- input 类型 -->
            <ElInput
              v-if="field.type === 'input'"
              v-model="searchForm[field.field]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              clearable
              @keyup.enter="handleSearch"
            />
            <!-- select 类型 -->
            <ElSelect
              v-else-if="field.type === 'select'"
              v-model="searchForm[field.field]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              clearable
            >
              <ElOption
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </ElSelect>
            <!-- date-picker 类型 -->
            <ElDatePicker
              v-else-if="field.type === 'date-picker'"
              v-model="searchForm[field.field]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              clearable
              value-format="YYYY-MM-DD"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="handleSearch">搜索</ElButton>
            <ElButton @click="handleResetSearch">重置</ElButton>
          </ElFormItem>
        </ElForm>
      </div>

      <!-- 表格区域 -->
      <div class="ep-modal-picker__table-wrapper">
        <ElTable
          ref="tableRefInstance"
          v-loading="loading"
          :data="tableData"
          :row-key="rowKeyField"
          :row-class-name="rowClassName"
          highlight-current-row
          border
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
          @select="handleSelect"
        >
          <!-- 多选列 -->
          <ElTableColumn
            v-if="multiple"
            type="selection"
            width="50"
            :reserve-selection="true"
          />
          <!-- 单选列 -->
          <ElTableColumn v-else width="50" align="center">
            <template #default="{ row }">
              <ElRadio
                :model-value="currentRowKey"
                :value="getItemValue(row)"
                @click="handleRowClick(row)"
              >
                <span></span>
              </ElRadio>
            </template>
          </ElTableColumn>
          <!-- 数据列 -->
          <ElTableColumn
            v-for="col in columns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :align="col.align || 'left'"
            :show-overflow-tooltip="true"
          />
        </ElTable>
      </div>

      <!-- 分页区域 -->
      <div v-if="paginationEnabled" class="ep-modal-picker__pagination">
        <ElPagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>

      <!-- 底部 footer -->
      <template #footer>
        <div class="ep-modal-picker__footer">
          <ElButton @click="handleCancel">取消</ElButton>
          <ElButton type="primary" @click="handleConfirm">确定</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
