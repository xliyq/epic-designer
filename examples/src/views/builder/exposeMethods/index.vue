<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { onMounted, ref } from 'vue';

import { EBuilder } from '@ies/core';

const ebRef = ref<InstanceType<typeof EBuilder>>();

const pageSchema = ref<PageSchema>({
  canvas: {
    mode: 'desktop',
  },
  schemas: [
    {
      id: 'root',
      type: 'page',
      label: '页面',
      props: {},
      children: [
        {
          id: 'form_test',
          type: 'form',
          label: '表单',
          props: {
            labelWidth: '120px',
            labelLayout: 'fixed',
            labelPlacement: 'left',
            layout: 'horizontal',
            name: 'default',
          },
          children: [
            {
              id: 'card_select',
              type: 'card',
              label: '选择器测试',
              props: {
                gridCols: 2,
                gridEnable: true,
                style: { margin: '10px' },
              },
              children: [
                {
                  id: 'select_single',
                  type: 'select',
                  label: 'Select 单选',
                  field: 'selectSingle',
                  input: true,
                  props: {
                    placeholder: '请选择',
                    clearable: true,
                    options: [
                      { label: '张三', value: 'U001', dept: '技术部', code: 'T01' },
                      { label: '李四', value: 'U002', dept: '产品部', code: 'P01' },
                      { label: '王五', value: 'U003', dept: '设计部', code: 'D01' },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'select_single', methodName: 'onSelectChange', type: 'custom' },
                    ],
                  },
                },
                {
                  id: 'select_multi',
                  type: 'select',
                  label: 'Select 多选',
                  field: 'selectMulti',
                  input: true,
                  props: {
                    placeholder: '请选择',
                    multiple: true,
                    clearable: true,
                    options: [
                      { label: '张三', value: 'U001', dept: '技术部', code: 'T01' },
                      { label: '李四', value: 'U002', dept: '产品部', code: 'P01' },
                      { label: '王五', value: 'U003', dept: '设计部', code: 'D01' },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'select_multi', methodName: 'onSelectMultiChange', type: 'custom' },
                    ],
                  },
                },
              ],
            },
            {
              id: 'card_radio_checkbox',
              type: 'card',
              label: 'Radio / Checkbox 测试',
              props: {
                gridCols: 2,
                gridEnable: true,
                style: { margin: '10px' },
              },
              children: [
                {
                  id: 'radio_test',
                  type: 'radio',
                  label: 'Radio 单选',
                  field: 'gender',
                  input: true,
                  props: {
                    options: [
                      { label: '男', value: '1', desc: '男性' },
                      { label: '女', value: '2', desc: '女性' },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'radio_test', methodName: 'onRadioChange', type: 'custom' },
                    ],
                  },
                },
                {
                  id: 'checkbox_test',
                  type: 'checkbox',
                  label: 'Checkbox 多选',
                  field: 'hobbies',
                  input: true,
                  props: {
                    options: [
                      { label: '阅读', value: 'read', category: '静态' },
                      { label: '音乐', value: 'music', category: '艺术' },
                      { label: '运动', value: 'sport', category: '动态' },
                      { label: '旅行', value: 'travel', category: '生活' },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'checkbox_test', methodName: 'onCheckboxChange', type: 'custom' },
                    ],
                  },
                },
              ],
            },
            {
              id: 'card_cascader',
              type: 'card',
              label: 'Cascader 测试',
              props: { style: { margin: '10px' } },
              children: [
                {
                  id: 'cascader_single',
                  type: 'cascader',
                  label: 'Cascader 单选',
                  field: 'region',
                  input: true,
                  props: {
                    placeholder: '请选择地区',
                    options: [
                      {
                        label: '浙江',
                        value: 'zhejiang',
                        children: [
                          {
                            label: '杭州',
                            value: 'hangzhou',
                            children: [
                              { label: '西湖区', value: 'xihu', postcode: '310013' },
                              { label: '余杭区', value: 'yuhang', postcode: '311100' },
                            ],
                          },
                          {
                            label: '宁波',
                            value: 'ningbo',
                            children: [
                              { label: '海曙区', value: 'haishu', postcode: '315000' },
                              { label: '江北区', value: 'jiangbei', postcode: '315020' },
                            ],
                          },
                        ],
                      },
                      {
                        label: '江苏',
                        value: 'jiangsu',
                        children: [
                          {
                            label: '南京',
                            value: 'nanjing',
                            children: [
                              { label: '玄武区', value: 'xuanwu', postcode: '210018' },
                              { label: '鼓楼区', value: 'gulou', postcode: '210009' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'cascader_single', methodName: 'onCascaderChange', type: 'custom' },
                    ],
                  },
                },
                {
                  id: 'cascader_multi',
                  type: 'cascader',
                  label: 'Cascader 多选',
                  field: 'regions',
                  input: true,
                  props: {
                    placeholder: '请选择多个地区',
                    props: { multiple: true },
                    options: [
                      {
                        label: '浙江',
                        value: 'zhejiang',
                        children: [
                          {
                            label: '杭州',
                            value: 'hangzhou',
                            children: [
                              { label: '西湖区', value: 'xihu', postcode: '310013' },
                              { label: '余杭区', value: 'yuhang', postcode: '311100' },
                            ],
                          },
                          {
                            label: '宁波',
                            value: 'ningbo',
                            children: [
                              { label: '海曙区', value: 'haishu', postcode: '315000' },
                            ],
                          },
                        ],
                      },
                      {
                        label: '江苏',
                        value: 'jiangsu',
                        children: [
                          {
                            label: '南京',
                            value: 'nanjing',
                            children: [
                              { label: '玄武区', value: 'xuanwu', postcode: '210018' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  on: {
                    change: [
                      { componentId: 'cascader_multi', methodName: 'onCascaderMultiChange', type: 'custom' },
                    ],
                  },
                },
              ],
            },
            {
              id: 'card_result',
              type: 'card',
              label: '验证结果',
              props: { style: { margin: '10px' } },
              children: [
                {
                  id: 'textarea_result',
                  type: 'textarea',
                  label: '输出',
                  field: 'resultOutput',
                  input: true,
                  props: {
                    placeholder: '点击下方按钮查看 getOptions / getSelected 结果',
                    rows: 14,
                    readonly: true,
                  },
                },
                {
                  id: 'btn_get_options',
                  type: 'button',
                  label: '获取所有选项',
                  input: false,
                  props: { type: 'primary' },
                  on: {
                    click: [
                      { componentId: 'btn_get_options', methodName: 'dumpAllOptions', type: 'custom' },
                    ],
                  },
                },
                {
                  id: 'btn_get_selected',
                  type: 'button',
                  label: '获取当前选中',
                  input: false,
                  props: { type: 'success' },
                  on: {
                    click: [
                      { componentId: 'btn_get_selected', methodName: 'dumpAllSelected', type: 'custom' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  script: `const { defineExpose, find } = epic;

// ===== change 事件验证：同步调用 getSelected，检查是否拿到最新值 =====

function onSelectChange(value) {
  const inst = find('selectSingle', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  const opts = inst.getOptions();
  console.log('[Select单选] change:', { value, selected, optionsCount: opts.length });
}

function onSelectMultiChange(value) {
  const inst = find('selectMulti', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  console.log('[Select多选] change:', { value, selected, count: selected?.length });
}

function onRadioChange(value) {
  const inst = find('gender', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  console.log('[Radio] change:', { value, selected });
}

function onCheckboxChange(value) {
  const inst = find('hobbies', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  console.log('[Checkbox] change:', { value, selected, count: selected?.length });
}

function onCascaderChange(value) {
  const inst = find('region', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  console.log('[Cascader单选] change:', { value, selected, pathLength: selected?.length });
}

function onCascaderMultiChange(value) {
  const inst = find('regions', 'field');
  if (!inst) return;
  const selected = inst.getSelected();
  console.log('[Cascader多选] change:', { value, selected, pathCount: selected?.length });
}

// ===== 按钮验证：批量获取所有组件的 options / selected =====

function dumpAllOptions() {
  const fields = ['selectSingle', 'selectMulti', 'gender', 'hobbies', 'region', 'regions'];
  const result = {};
  fields.forEach(f => {
    const inst = find(f, 'field');
    if (inst && inst.getOptions) {
      result[f] = inst.getOptions();
    } else {
      result[f] = '[未找到实例或无 getOptions]';
    }
  });
  const output = JSON.stringify(result, null, 2);
  find('resultOutput', 'field').setValue(output);
  console.log('=== getOptions ===', result);
}

function dumpAllSelected() {
  const fields = ['selectSingle', 'selectMulti', 'gender', 'hobbies', 'region', 'regions'];
  const result = {};
  fields.forEach(f => {
    const inst = find(f, 'field');
    if (inst && inst.getSelected) {
      result[f] = inst.getSelected();
    } else {
      result[f] = '[未找到实例或无 getSelected]';
    }
  });
  const output = JSON.stringify(result, null, 2);
  find('resultOutput', 'field').setValue(output);
  console.log('=== getSelected ===', result);
}

defineExpose({
  onSelectChange,
  onSelectMultiChange,
  onRadioChange,
  onCheckboxChange,
  onCascaderChange,
  onCascaderMultiChange,
  dumpAllOptions,
  dumpAllSelected,
});`,
});

onMounted(() => {
  // 预设选中值，验证初始化后 getSelected 能否拿到正确结果
  ebRef.value?.setData({
    selectSingle: 'U001',
    selectMulti: ['U001', 'U003'],
    gender: '1',
    hobbies: ['read', 'travel'],
    region: ['zhejiang', 'hangzhou', 'xihu'],
    regions: [['zhejiang', 'hangzhou', 'xihu'], ['jiangsu', 'nanjing', 'xuanwu']],
  });
});
</script>

<template>
  <EBuilder ref="ebRef" :page-schema="pageSchema" />
</template>
