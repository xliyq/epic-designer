import { computed, defineComponent, h } from 'vue';

import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus';
import { useFormData, useRemoteOptions } from '@ies/hooks';

import 'element-plus/es/components/select/style/css';

// 二次封装组件
export default defineComponent({
  props: {
    remoteConfig: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    function handleUpdate(e = null): void {
      emit('update:modelValue', e);
    }

    // 远程选项
    const formData = useFormData();
    const remoteConfig = computed(() => props.remoteConfig as any);
    const isRemote = computed(() => remoteConfig.value?.enabled);
    const { options: remoteOptions } = useRemoteOptions(remoteConfig, formData);

    const finalOptions = computed(() =>
      isRemote.value ? remoteOptions.value : (attrs.options as any[]) ?? [],
    );

    return () => {
      const { options: _attrsOptions, remoteConfig: _attrsRemoteConfig, ...restAttrs } = attrs;
      const checkboxProps: Record<string, any> = {
        ...restAttrs,
        'onUpdate:modelValue': handleUpdate,
      };
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
