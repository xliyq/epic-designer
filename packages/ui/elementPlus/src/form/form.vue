<script lang="ts" setup>
import type { ComponentSchema, FormDataModel } from '@ies/designer';

import { computed, onMounted, ref } from 'vue';

import { provideBuilderDisabled, useForm, usePageManager } from '@ies/designer';
import { deepCompareAndModify } from '@ies/designer';
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
const pageManager = usePageManager();

/**
 * 获取表单数据
 */
function getData(): FormDataModel {
  return formData;
}

/**
 * 设置表单数据（深合并，保留响应式引用与子表单未覆盖字段）
 * @param data
 */
function setData(data: FormDataModel) {
  if (!data) return;
  deepCompareAndModify(formData, data, false);
}

/**
 * 重置表单数据
 */
function resetData() {
  // form.value.resetFields 在 onMounted 中已被包装，会同时清除容器校验状态
  form.value?.resetFields();
}

/**
 * 清除所有容器组件的校验状态
 */
function clearContainerValidate() {
  const instances = pageManager.componentInstances.value;
  for (const scopeMap of Object.values(instances)) {
    for (const instance of Object.values(scopeMap)) {
      if (instance?.exposed?.__isContainerValidate && typeof instance.exposed.clearValidate === 'function') {
        instance.exposed.clearValidate();
      }
    }
  }
}

/**
 * 校验所有容器组件（attribute-group、section-group 等）
 * 注意：即使某个容器校验失败，仍继续校验其他容器，确保所有错误都能展示
 */
async function validateContainers(): Promise<void> {
  const instances = pageManager.componentInstances.value;
  const errors: Error[] = [];
  const validatePromises: Promise<void>[] = [];
  for (const scopeMap of Object.values(instances)) {
    for (const instance of Object.values(scopeMap)) {
      if (instance?.exposed?.__isContainerValidate && typeof instance.exposed.validate === 'function') {
        validatePromises.push(
          (async () => {
            try {
              await instance.exposed.validate();
            } catch (e: any) {
              errors.push(e instanceof Error ? e : new Error(String(e)));
            }
          })(),
        );
      }
    }
  }
  await Promise.all(validatePromises);
  if (errors.length > 0) {
    throw errors[0];
  }
}

// 以下 validate/clearValidate 函数引用将在 onMounted 中被赋值（避免 ElForm 原生方法被覆盖后产生递归）
let formValidate: () => Promise<void> = async () => {};
let formClearValidate: () => void = () => {};

/**
 * 校验表单数据（标准字段 + 容器组件字段）
 */
async function validate() {
  await formValidate();
}

/**
 * 清除校验状态
 */
function clearValidate() {
  formClearValidate();
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

    // 保存 ElForm 原生方法引用，避免包装后产生递归
    const origValidate = form.value.validate?.bind(form.value);
    const origClearValidate = form.value.clearValidate?.bind(form.value);
    const origResetFields = form.value.resetFields?.bind(form.value);

    // 包装 validate：并行校验 ElForm 标准字段和容器组件字段
    const wrappedValidate = async () => {
      const results = await Promise.allSettled([
        origValidate?.(),
        validateContainers(),
      ]);
      const failures = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
      if (failures.length > 0) {
        throw failures[0].reason;
      }
    };

    // 包装 clearValidate：同时清除容器组件校验状态
    const wrappedClearValidate = () => {
      origClearValidate?.();
      clearContainerValidate();
    };

    // 包装 resetFields：同时清除容器组件校验状态
    const wrappedResetFields = (...args: any[]) => {
      origResetFields?.(...args);
      clearContainerValidate();
    };

    form.value.validate = wrappedValidate as any;
    form.value.clearValidate = wrappedClearValidate as any;
    form.value.resetFields = wrappedResetFields as any;
    form.value.getData = getData;
    form.value.setData = setData;
    form.value.resetData = resetData;

    // 将包装后的方法赋值给外部引用
    formValidate = wrappedValidate;
    formClearValidate = wrappedClearValidate;

    formInstances.value[name] = form.value as any;
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
      minHeight: 'auto',
    }
  }
  return {}
})

const children = computed(() => {
  return props.componentSchema!.children ?? [];
});

defineExpose({
  form,
  clearValidate,
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