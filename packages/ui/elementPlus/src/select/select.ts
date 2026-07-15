import { computed, defineComponent, h, inject } from 'vue';

import { ElOption, ElSelect } from 'element-plus';
import { useFormData, useRemoteOptions } from '@ies/hooks';

import 'element-plus/es/components/select/style/css';

// 二次封装组件
export default defineComponent({
  emits: ['update:modelValue'],
  setup(_, { attrs, emit }) {
    function handleUpdate(e = null): void {
      emit('update:modelValue', e);
    }

    // 获取表单数据（设计器中返回空对象）
    const formData = useFormData();

    // 远程选项配置
    const remoteConfig = computed(() => attrs.remoteConfig as any);

    // 是否启用远程数据
    const isRemote = computed(() => remoteConfig.value?.enabled);

    // 远程选项加载
    const { options: remoteOptions, loading } = useRemoteOptions(
      remoteConfig,
      formData,
    );

    // 合并选项：远程模式用 remoteOptions，否则用静态 attrs.options
    const finalOptions = computed(() =>
      isRemote.value ? remoteOptions.value : (attrs.options as any[]) ?? [],
    );

    return () => {
      const props: Record<string, any> = {
        ...attrs,
        key: String(attrs.multiple),
        'onUpdate:modelValue': handleUpdate,
        placeholder: attrs.placeholder ?? '请选择',
      };

      // 远程模式时覆盖 loading
      if (isRemote.value) {
        props.loading = loading.value;
      }

      return h(ElSelect, props, {
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
