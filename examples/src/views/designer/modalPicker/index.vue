<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { ref } from 'vue';

import { EDesigner } from '@ies/core';
import { pluginManager } from '@ies/manager';

// 注入 mock HTTP 客户端，供设计器预览时 modal-picker 的 http 数据源使用
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

    // 回显接口
    if (url.includes('/detail')) {
      const id = params.id;
      if (Array.isArray(id)) {
        return Promise.resolve({
          data: mockData.filter((item) => id.includes(item.id)),
        });
      }
      const item = mockData.find((item) => item.id === id);
      return Promise.resolve({ data: item ?? null });
    }

    // 分页请求
    const pageNum = params.pageNum ?? 1;
    const pageSize = params.pageSize ?? 10;
    const keyword = params.name ?? '';

    let filtered = mockData;
    if (keyword) {
      filtered = mockData.filter((item) => item.name.includes(keyword));
    }

    const start = (pageNum - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return Promise.resolve({
      data: { list, total: filtered.length },
    });
  },
  post(url: string, data?: any) {
    return Promise.resolve({ data: [] });
  },
} as any;

const designerRef = ref<InstanceType<typeof EDesigner>>();

// 预置一个含 3 个 modal-picker 的 schema，方便直接在设计器中验证
const defaultSchema = ref<PageSchema>({
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
        // 单选 + 服务端分页 + 搜索
        {
          id: 'modalPicker_single',
          field: 'userId',
          input: true,
          label: '选择用户',
          type: 'modal-picker',
          props: {
            placeholder: '请选择用户',
            clearable: true,
            multiple: false,
            modalTitle: '选择用户（单选）',
            modalWidth: '800px',
            searchable: true,
            searchFields: [
              { id: 'sf_1', field: 'name', label: '用户名', type: 'input', placeholder: '请输入用户名' },
              {
                id: 'sf_2',
                field: 'dept',
                label: '部门',
                type: 'select',
                placeholder: '请选择部门',
                options: [
                  { label: '研发部', value: '研发部' },
                  { label: '产品部', value: '产品部' },
                  { label: '市场部', value: '市场部' },
                  { label: '运营部', value: '运营部' },
                ],
              },
            ],
            columns: [
              { id: 'col_1', prop: 'id', label: 'ID', width: '60px', align: 'center' },
              { id: 'col_2', prop: 'name', label: '用户名', width: '', align: 'left' },
              { id: 'col_3', prop: 'phone', label: '手机号', width: '140px', align: 'left' },
              { id: 'col_4', prop: 'email', label: '邮箱', width: '', align: 'left' },
              { id: 'col_5', prop: 'dept', label: '部门', width: '100px', align: 'center' },
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
                headers: {},
                dataPath: 'data.list',
                labelKey: 'name',
                valueKey: 'id',
                childrenKey: 'children',
                cache: false,
                autoLoad: true,
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
        // 多选 + 数量限制 10
        {
          id: 'modalPicker_multi',
          field: 'userIds',
          input: true,
          label: '批量选择',
          type: 'modal-picker',
          props: {
            placeholder: '请选择多个用户',
            clearable: true,
            multiple: true,
            multipleLimit: 3,
            modalTitle: '批量选择用户（最多10个）',
            modalWidth: '800px',
            searchable: true,
            searchFields: [
              { id: 'sf_3', field: 'name', label: '用户名', type: 'input', placeholder: '搜索用户名' },
            ],
            columns: [
              { id: 'col_6', prop: 'id', label: 'ID', width: '60px', align: 'center' },
              { id: 'col_7', prop: 'name', label: '用户名', width: '', align: 'left' },
              { id: 'col_8', prop: 'dept', label: '部门', width: '100px', align: 'center' },
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
                headers: {},
                dataPath: 'data.list',
                labelKey: 'name',
                valueKey: 'id',
                childrenKey: 'children',
                cache: false,
                autoLoad: true,
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
        // 静态数据 + 前端分页
        {
          id: 'modalPicker_static',
          field: 'city',
          input: true,
          label: '选择城市',
          type: 'modal-picker',
          props: {
            placeholder: '请选择城市',
            clearable: true,
            multiple: false,
            modalTitle: '选择城市（静态数据）',
            modalWidth: '600px',
            searchable: true,
            searchFields: [
              { id: 'sf_4', field: 'label', label: '城市名', type: 'input', placeholder: '搜索城市' },
            ],
            columns: [
              { id: 'col_9', prop: 'value', label: '编码', width: '80px', align: 'center' },
              { id: 'col_10', prop: 'label', label: '城市名称', width: '', align: 'left' },
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
                  { label: '苏州', value: 'SU' },
                  { label: '天津', value: 'TJ' },
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

function handleSubmit(e: PageSchema) {
  console.log(e);
}
</script>

<template>
  <EDesigner
    ref="designerRef"
    title="弹窗选择组件设计器"
    :default-schema="defaultSchema"
    @save="handleSubmit"
  />
</template>
