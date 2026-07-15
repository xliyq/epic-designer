import { computed, defineComponent, h } from 'vue';

import { ElOption, ElSelect } from 'element-plus';
import { useDataSource, useFormData } from '@ies/hooks';

import 'element-plus/es/components/select/style/css';

// 二次封装组件
export default defineComponent({
  inheritAttrs: false,
  props: {
    dataSource: {
      type: Object,
      default: null,
    },
    // 向后兼容旧 schema
    remoteConfig: {
      type: Object,
      default: null,
    },
    options: {
      type: Array,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    function handleUpdate(e = null): void {
      emit('update:modelValue', e);
    }

    const formData = useFormData();

    // 向后兼容：将旧 schema 转换为新 dataSource 格式
    const dataSource = computed(() => {
      if (props.dataSource) return props.dataSource;
      if (props.remoteConfig?.enabled) {
        return { type: 'http', config: props.remoteConfig };
      }
      return { type: 'static', config: { options: props.options ?? [] } };
    });

    const isRemote = computed(() => dataSource.value?.type !== 'static');

    const { options: dsOptions, loading } = useDataSource(dataSource, formData);

    const finalOptions = computed(() => dsOptions.value ?? []);

    return () => {
      const { options: _attrsOptions, remoteConfig: _attrsRemoteConfig, dataSource: _attrsDataSource, ...restAttrs } = attrs;
      const selectProps: Record<string, any> = {
        ...restAttrs,
        key: String(attrs.multiple),
        'onUpdate:modelValue': handleUpdate,
        placeholder: attrs.placeholder ?? '请选择',
      };

      if (isRemote.value) {
        selectProps.loading = loading.value;
      }

      return h(ElSelect, selectProps, {
        default: () => [
          finalOptions.value?.map((option: any) =>
            h(ElOption, {
              label: option.label,
              value: option.value,
            }),
          ),
        ],
      });
    };
  },
});
