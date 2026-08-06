import { computed, defineComponent, h, ref, watch } from 'vue';

import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus';
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
    options: {
      type: Array,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit, expose }) {
    // 本地同步缓存 modelValue，避免 attrs 异步更新导致 getSelected 拿到旧值
    const modelValueRef = ref(attrs.modelValue);
    watch(() => attrs.modelValue, (val) => { modelValueRef.value = val; });

    function handleUpdate(e = null): void {
      modelValueRef.value = e;
      emit('update:modelValue', e);
    }

    const formData = useFormData();

    const dataSource = computed(() => {
      if (props.dataSource) return props.dataSource;
      return { type: 'static', config: { options: props.options ?? [] } };
    });

    const isRemote = computed(() => dataSource.value?.type !== 'static');
    const { options: dsOptions, getOptions, getSelected } = useDataSource(dataSource, formData, modelValueRef);
    const finalOptions = computed(() => dsOptions.value ?? []);

    expose({ getOptions, getSelected });

    return () => {
      const { options: _attrsOptions, dataSource: _attrsDataSource, ...restAttrs } = attrs;
      const checkboxProps: Record<string, any> = {
        ...restAttrs,
        'onUpdate:modelValue': handleUpdate,
      };

      if (isRemote.value) {
        checkboxProps.options = finalOptions.value;
      }

      return h(ElCheckboxGroup, checkboxProps, {
        default: () => [
          checkboxProps?.radioButton
            ? finalOptions.value?.map((option: any) =>
                h(ElCheckboxButton, {
                  label: option.label,
                  value: option.value,
                }),
              )
            : finalOptions.value?.map((option: any) =>
                h(ElCheckbox, { label: option.label, value: option.value }),
              ),
        ],
      });
    };
  },
});
