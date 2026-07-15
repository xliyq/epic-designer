import { computed, defineComponent, h } from 'vue';

import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus';
import { useFormData, useRemoteOptions } from '@ies/hooks';

import 'element-plus/es/components/select/style/css';

// 二次封装组件
export default defineComponent({
  emits: ['update:modelValue'],
  setup(_, { attrs, emit }) {
    function handleUpdate(e = null): void {
      emit('update:modelValue', e);
    }

    // 远程选项
    const formData = useFormData();
    const remoteConfig = computed(() => attrs.remoteConfig as any);
    const isRemote = computed(() => remoteConfig.value?.enabled);
    const { options: remoteOptions } = useRemoteOptions(remoteConfig, formData);

    const finalOptions = computed(() =>
      isRemote.value ? remoteOptions.value : (attrs.options as any[]) ?? [],
    );

    return () => {
      const props: Record<string, any> = {
        ...attrs,
        'onUpdate:modelValue': handleUpdate,
      };
      return h(ElRadioGroup, props, {
        default: () => [
          props?.radioButton
            ? finalOptions.value?.map((option: any) =>
                h(
                  ElRadioButton,
                  { value: option.value },
                  { default: () => option.label },
                ),
              )
            : finalOptions.value?.map((option: any) =>
                h(
                  ElRadio,
                  { value: option.value },
                  { default: () => option.label },
                ),
              ),
        ],
      });
    };
  },
});
