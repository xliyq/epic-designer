<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { onMounted, ref } from 'vue';

import { EBuilder } from '@ies/core';
import { pluginManager } from '@ies/manager';

// 注入 mock HTTP 客户端，模拟分页接口
const mockData = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  email: `user${i + 1}@example.com`,
  dept: ['研发部', '产品部', '市场部', '运营部'][i % 4],
  label: `用户${i + 1}`,
  value: i + 1,
}));

pluginManager.global.$http = {
  get(url: string, config?: any) {
    const params = config?.params ?? {};

    if (url.includes('/detail')) {
      const id = params.id;
      if (Array.isArray(id)) {
        return Promise.resolve({ data: mockData.filter((item) => id.includes(item.id)) });
      }
      const item = mockData.find((item) => item.id === id);
      return Promise.resolve({ data: item ?? null });
    }

    const pageNum = params.pageNum ?? 1;
    const pageSize = params.pageSize ?? 10;
    const keyword = params.name ?? '';

    let filtered = mockData;
    if (keyword) filtered = filtered.filter((item) => item.name.includes(keyword));

    const start = (pageNum - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return Promise.resolve({ data: { list, total: filtered.length } });
  },
  post() {
    return Promise.resolve({ data: [] });
  },
} as any;

const ebRef = ref<InstanceType<typeof EBuilder>>();
const formDataJson = ref('');

// 页面 Schema
const pageSchema = ref<PageSchema>({
  canvas: { mode: 'desktop' },
  schemas: [
    {
      id: 'root',
      label: '表单',
      props: {
        colon: true,
        labelAlign: 'right',
        labelCol: { span: 5 },
        labelLayout: 'fixed',
        labelPlacement: 'left',
        labelWidth: 120,
        layout: 'horizontal',
        name: 'default',
        wrapperCol: { span: 19 },
      },
      type: 'form',
      children: [
        // HTTP 数据源 - 单选
        {
          id: 'picker_single',
          field: 'userId',
          input: true,
          label: '单选用户（HTTP）',
          type: 'modal-picker',
          props: {
            placeholder: '请选择用户',
            clearable: true,
            modalTitle: '选择用户（单选）',
            modalWidth: '800px',
            searchable: true,
            searchFields: [
              { id: 'sf_1', field: 'name', label: '用户名', type: 'input', placeholder: '请输入用户名' },
            ],
            columns: [
              { id: 'col_1', prop: 'id', label: 'ID', width: '60px', align: 'center' },
              { id: 'col_2', prop: 'name', label: '用户名', width: '', align: 'left' },
              { id: 'col_3', prop: 'phone', label: '手机号', width: '140px', align: 'left' },
              { id: 'col_4', prop: 'dept', label: '部门', width: '100px', align: 'center' },
            ],
            rowKey: 'value',
            pagination: true,
            pageSize: 10,
            dataSource: {
              type: 'http',
              config: {
                url: '/api/mock/users',
                method: 'GET',
                params: {},
                labelKey: 'name',
                valueKey: 'id',
                pagination: true,
                pageNumKey: 'pageNum',
                pageSizeKey: 'pageSize',
                listPath: 'data.list',
                totalPath: 'data.total',
                detailUrl: '/api/mock/users/detail',
                valueParamKey: 'id',
                detailDataPath: 'data',
              },
            },
          },
        },
        // HTTP 数据源 - 多选（限3）
        {
          id: 'picker_multi',
          field: 'userIds',
          input: true,
          label: '多选用户（HTTP，限3）',
          type: 'modal-picker',
          props: {
            placeholder: '请选择用户',
            clearable: true,
            multiple: true,
            multipleLimit: 3,
            modalTitle: '批量选择（最多3个）',
            modalWidth: '800px',
            searchable: true,
            searchFields: [
              { id: 'sf_2', field: 'name', label: '用户名', type: 'input', placeholder: '搜索' },
            ],
            columns: [
              { id: 'col_5', prop: 'id', label: 'ID', width: '60px', align: 'center' },
              { id: 'col_6', prop: 'name', label: '用户名', width: '', align: 'left' },
              { id: 'col_7', prop: 'dept', label: '部门', width: '100px', align: 'center' },
            ],
            rowKey: 'value',
            pagination: true,
            pageSize: 10,
            dataSource: {
              type: 'http',
              config: {
                url: '/api/mock/users',
                method: 'GET',
                params: {},
                labelKey: 'name',
                valueKey: 'id',
                pagination: true,
                pageNumKey: 'pageNum',
                pageSizeKey: 'pageSize',
                listPath: 'data.list',
                totalPath: 'data.total',
                detailUrl: '/api/mock/users/detail',
                valueParamKey: 'id',
                detailDataPath: 'data',
              },
            },
          },
        },
        // 静态数据源
        {
          id: 'picker_city',
          field: 'city',
          input: true,
          label: '选择城市（静态）',
          type: 'modal-picker',
          props: {
            placeholder: '请选择城市',
            clearable: true,
            modalTitle: '选择城市',
            modalWidth: '600px',
            searchable: true,
            searchFields: [
              { id: 'sf_3', field: 'label', label: '城市名', type: 'input', placeholder: '搜索' },
            ],
            columns: [
              { id: 'col_8', prop: 'value', label: '编码', width: '80px', align: 'center' },
              { id: 'col_9', prop: 'label', label: '城市名称', width: '', align: 'left' },
            ],
            rowKey: 'value',
            pagination: true,
            pageSize: 5,
            dataSource: {
              type: 'static',
              config: {
                options: [
                  { label: '北京', value: 'BJ' },
                  { label: '上海', value: 'SH' },
                  { label: '广州', value: 'GZ' },
                  { label: '深圳', value: 'SZ' },
                  { label: '杭州', value: 'HZ' },
                  { label: '南京', value: 'NJ' },
                  { label: '成都', value: 'CD' },
                  { label: '武汉', value: 'WH' },
                  { label: '西安', value: 'XA' },
                  { label: '重庆', value: 'CQ' },
                ],
              },
            },
          },
        },
      ],
    },
  ],
  script: '',
});

function setSingleValue() {
  // 设置一个新值，不同于初始值，方便观察回显效果
  const v = Math.floor(Math.random() * 35) + 1;
  ebRef.value?.setData({ userId: v });
  refreshOutput();
}

function setMultiValue() {
  // 随机选 2-3 个值
  const count = Math.floor(Math.random() * 3) + 1;
  const ids: number[] = [];
  while (ids.length < count) {
    const v = Math.floor(Math.random() * 35) + 1;
    if (!ids.includes(v)) ids.push(v);
  }
  ebRef.value?.setData({ userIds: ids });
  refreshOutput();
}

function setCityValue() {
  const cities = ['BJ', 'SH', 'GZ', 'SZ', 'CD'];
  const c = cities[Math.floor(Math.random() * cities.length)];
  ebRef.value?.setData({ city: c });
  refreshOutput();
}

function clearAll() {
  ebRef.value?.setData({ userId: null, userIds: [], city: null });
  refreshOutput();
}

async function refreshOutput() {
  if (!ebRef.value) return;
  const data = await ebRef.value?.getData();
  formDataJson.value = JSON.stringify(data ?? {}, null, 2);
}

onMounted(() => {
  // 页面加载后设置值，验证回显
  ebRef.value?.setData({
    userId: 5,
    userIds: [1, 3, 7],
    city: 'SH',
  });
  setTimeout(refreshOutput, 500);
});
</script>

<template>
  <div class="bp-page">
    <EBuilder ref="ebRef" :page-schema="pageSchema" />

    <div class="bp-actions">
      <button class="bp-btn bp-btn-primary" @click="setSingleValue">
        随机设置单选值
      </button>
      <button class="bp-btn bp-btn-primary" @click="setMultiValue">
        随机设置多选值
      </button>
      <button class="bp-btn bp-btn-primary" @click="setCityValue">
        随机设置城市
      </button>
      <button class="bp-btn bp-btn-danger" @click="clearAll">
        清空全部
      </button>
    </div>

    <div class="bp-output">
      <div class="bp-output__label">当前表单数据：</div>
      <pre class="bp-output__json">{{ formDataJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
.bp-page {
  padding: 16px;
}

.bp-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.bp-btn {
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  color: #606266;
}

.bp-btn-primary {
  color: #fff;
  background: #409eff;
  border-color: #409eff;
}

.bp-btn-primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.bp-btn-danger {
  color: #fff;
  background: #f56c6c;
  border-color: #f56c6c;
}

.bp-btn-danger:hover {
  background: #f78989;
  border-color: #f78989;
}

.bp-output {
  margin-top: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.bp-output__label {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.bp-output__json {
  margin: 0;
  padding: 12px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  background: #fafafa;
}
</style>