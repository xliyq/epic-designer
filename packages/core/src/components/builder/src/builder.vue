<script lang="ts" setup>
import type { PageManager } from '@ies/manager';
import type {
  AttributeMeta,
  EpNodeInstance,
  FieldStates,
  FormDataModel,
  PageSchema,
} from '@ies/types';

import {
  computed,
  getCurrentInstance,
  provide,
  ref,
  useSlots,
  watch,
} from 'vue';

import { EpBaseLoader, EpicNode } from '@ies/base-ui';
import {
  ATTRIBUTE_META_KEY,
  BUILDER_KEY,
  createEventBus,
  FORM_INSTANCES_KEY,
  provideBuilderDisabled,
  provideBuilderReadonly,
  providePageManager,
} from '@ies/hooks';
import { pluginManager } from '@ies/manager';
import { setupPage } from '@ies/panel-ui';
import { setupExtensions } from '@ies/custom';
import {
  deepClone,
  deepCompareAndModify,
  findSchemas,
  migrateComponentProps,
  reorganizeSchemasForTableView,
} from '@ies/utils';

import { useBuilder } from '../hooks/useBuilder';

// 定义组件的 props 类型
const props = defineProps<{
  /** 属性组 API 定义数据，供 attribute-group 组件运行时使用 */
  attributeMeta?: AttributeMeta;
  /** 禁用表单 */
  disabled?: boolean;
  /** 字段状态规则 */
  fieldStates?: FieldStates;
  /** 表单数据 */
  formData?: FormDataModel;
  /** 页面 schema */
  pageSchema: null | PageSchema;
  /** 只读表单 */
  readonly?: boolean;
  tableView?: boolean;
}>();
// 定义事件
const emit = defineEmits<{
  change: [
    context: {
      field: string;
      formData: FormDataModel;
      value: any;
    },
  ];
  ready: [pageManager: PageManager];
}>();

setupPage(pluginManager);
setupExtensions(pluginManager);

const epBuilderSlot = pluginManager.component.get('epBuilderSlot');
// 使用 hooks 获取表单相关方法和状态
const {
  formInstances,
  getData,
  getFormInstance,
  getForms,
  pageManager,
  ready,
  resetData,
  setData,
  setForms,
  validate,
  validateAll,
} = useBuilder();

const suspenseKey = ref(0);

// 监听 pageSchema 的变化，并更新 pageManager.pageSchema
watch(
  [() => props.pageSchema, () => props.tableView],
  () => {
    if (!props.pageSchema?.schemas?.length) return;
    const newSchema = deepClone(props.pageSchema);

    migrateComponentProps(newSchema, true);

    if (props.tableView) {
      reorganizeSchemasForTableView(newSchema);
    }

    deepCompareAndModify(pageManager.pageSchema, newSchema);
    pageManager.mountMonitor.reset();
    suspenseKey.value++;
    ready.value = false;
  },
  {
    deep: true,
    immediate: true,
  },
);

// 监听 formData 的变化，并设置表单数据
watch(
  () => props.formData,
  (data) => {
    if (data) {
      setData(data);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

createEventBus();
// 提供依赖注入的上下文
provideBuilderDisabled(computed(() => props.disabled));
provideBuilderReadonly(computed(() => props.readonly));
provide(BUILDER_KEY, {
  fieldStateMap: computed(() => {
    //  将fieldStates转换对象类型
    const fieldStateMap = {};
    props.fieldStates?.forEach((fieldState) => {
      fieldStateMap[fieldState.field] = fieldState;
    });
    return fieldStateMap;
  }),
  slots: useSlots(),
});
providePageManager(pageManager);

provide(FORM_INSTANCES_KEY, formInstances);

provide(
  ATTRIBUTE_META_KEY,
  computed(() => props.attributeMeta ?? {}),
);

/**
 * 组件加载完成后的处理函数，注: pageSchema更新会触发组件重新加载
 * @returns {void}
 */
function handleReady() {
  const unwatch = watch(
    () => pageManager.mountMonitor.isAllMounted.value,
    (finished) => {
      if (finished) {
        if (unwatch) unwatch();
        triggerEpicReady();
      }
    },
  );
}

function triggerEpicReady() {
  ready.value = true;
  emit('ready', pageManager);

  // 执行绑定的ready事件
  findSchemas(pageManager.pageSchema.schemas, (schema) => {
    if (schema.on?.epicReady) {
      pageManager.doActions(schema.on.epicReady);
    }
    return false;
  });
}

// 获取当前实例，并提取 proxy
const instance = getCurrentInstance() as EpNodeInstance;
// 注入组件实例到 pageManager
pageManager.addComponentInstance('builder', instance);

pageManager.hook.register('formChange', (context) => {
  emit('change', context);
});

// 暴露组件的方法和状态
defineExpose({
  getData,
  getFormInstance,
  getForms,
  pageManager,
  ready,
  resetData,
  setData,
  setForms,
  validate,
  validateAll,
});
</script>

<template>
  <div
    v-if="
      !pluginManager.designer.initialized.value ||
      pageManager.pageSchema.schemas.length === 0
    "
    class="ep-loading-box"
  >
    <EpBaseLoader />
  </div>
  <Suspense v-else :key="suspenseKey" @resolve="handleReady">
    <template #default>
      <div
        class="ep-builder-main ep-scoped"
        :class="{
          'ep-readonly': props.readonly,
          'ep-table-view': props.tableView,
        }"
      >
        <EpicNode
          v-for="(item, index) in pageManager.pageSchema.schemas"
          :key="index"
          :component-schema="item"
        />
        <component v-if="epBuilderSlot" :is="epBuilderSlot" />
      </div>
    </template>
    <template #fallback>
      <div class="ep-loading-box">
        <EpBaseLoader />
      </div>
    </template>
  </Suspense>
</template>
