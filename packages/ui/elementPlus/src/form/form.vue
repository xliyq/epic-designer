<script lang="ts" setup>
import type { ComponentSchema, FormDataModel } from '@ies/types';

import { computed, onMounted, ref } from 'vue';

import { provideBuilderDisabled, useForm } from '@ies/hooks';
import { ElForm } from 'element-plus';

interface FormInstance extends InstanceType<typeof ElForm> {
  getData?: () => FormDataModel;
  resetData: () => void;
  setData?: (FormDataModel) => void;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    componentSchema: ComponentSchema;
    disabled?: boolean;
  }>(),
  {
    componentSchema: () => ({ type: '' }),
    disabled: false,
  },
);

provideBuilderDisabled(computed(() => props.disabled));

const form = ref<FormInstance | null>(null);
const { formData, formInstances } = useForm(
  props.componentSchema?.props?.name ?? 'default',
);

/**
 * 获取表单数据
 */
function getData(): FormDataModel {
  return formData;
}

/**
 * 设置表单数据
 * @param data
 */
function setData(data: FormDataModel) {
  Object.assign(formData, data);
}

/**
 * 重置表单数据
 */
function resetData() {
  form.value?.resetFields();
}

/**
 * 校验表单数据
 */
function validate() {
  return form.value?.validate();
}

// form组件需要特殊处理
onMounted(async () => {
  if (
    props.componentSchema?.type === 'form' &&
    formInstances.value &&
    form.value
  ) {
    const name =
      props.componentSchema?.props?.name ??
      props.componentSchema?.name ??
      ('default' as string);

    formInstances.value[name] = form.value as any;
    form.value.getData = getData;
    form.value.setData = setData;
    form.value.resetData = resetData;
    return false;
  }
});

const formProps = computed(() => {
  const recordProps = { ...props.componentSchema!.props };
  let labelCol = recordProps.labelCol;
  let wrapperCol = recordProps.wrapperCol;
  if (recordProps.labelLayout === 'fixed') {
    labelCol = {
      style: `width:${typeof recordProps.labelWidth === 'number' ? `${recordProps.labelWidth}px` : recordProps.labelWidth}`,
    };
    wrapperCol = { style: 'width:auto;flex:1' };
  }
  const formMode = recordProps.formMode
  const isGrid = formMode === 'grid'
  const isInline = formMode === 'inline'

  if (isGrid) {
    // 网格模式下剥离 layout、style，避免冲突
    delete recordProps.layout
    delete recordProps.style
  } else if (isInline) {
    recordProps.layout = 'inline'
  }

  return {
    ...recordProps,
    class: isGrid ? 'form-grid' : '',
    labelCol,
    wrapperCol,
  };
});

const gridStyle = computed(() => {
  const p = props.componentSchema?.props
  if (p?.formMode === 'grid') {
    const columns = p.gridCols ?? 3
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: 'auto',
      gap: '16px',
    }
  }
  return {}
})

const children = computed(() => {
  return props.componentSchema!.children ?? [];
});

defineExpose({
  form,
  getData,
  resetData,
  setData,
  validate,
});
</script>

<template>
  <ElForm ref="form" :model="formData" v-bind="formProps" :style="gridStyle">
    <slot name="edit-node">
      <slot
        v-for="item in children"
        name="node"
        :component-schema="item"
      ></slot>
    </slot>
  </ElForm>
</template>
<style lang="less" scoped>
/* 设计模式下，ep-draggable-range 作为拖拽容器会导致 grid 布局异常，
   使用 display: contents 使其盒模型透明化，让子项直接参与 grid 布局 */
.form-grid {
  min-height: 60px;

  &:deep(> .ep-draggable-range) {
    display: contents !important;
  }
}
</style>