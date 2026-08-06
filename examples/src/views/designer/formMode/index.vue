<script lang="ts" setup>
import type { PageSchema } from '@ies/types';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { EDesigner } from '@ies/core';
import { Button } from 'ant-design-vue';
import response from '@/temp/3.json'
import {generateFormSchema} from '@/utils/form-schema-converter'
import { formTableData } from '@/mock';
import { parse } from 'jsonc-parser';

const designerRef = ref<InstanceType<typeof EDesigner>>();
const route = useRoute();
/**
 * 点击保存按钮操作
 * @param e
 */
function handleSubmit(e: PageSchema) {
  console.log(e);
}

function mockConvert(){
  const schemas = generateFormSchema(response);
  designerRef.value?.setData({
    canvas: { mode: 'desktop' },
    schemas
  });
}

onMounted(() => {
  const id = route.query.id;
  if (id !== undefined && id !== null && id !== '') {
    const item = formTableData.find((v) => String(v.id) === String(id));
    if (item) {
      const jsonSchema = parse(item.jsonSchema);
      designerRef.value?.setData({
        canvas: { mode: 'desktop' },
        ...jsonSchema
      });
    }
  }
});

</script>
<template>
  <EDesigner
    ref="designerRef"
    form-mode
    title="表单模式示例"
    @save="handleSubmit"
  >
    <template #header-prefix>
      <div>欢迎使用EpicDesigner设计器</div>
    </template>

    <template #header-right-prefix>
      <Button style="margin-right: 8px" size="small" @click="mockConvert">
        模拟接口数据转换
      </Button>
    </template>
  </EDesigner>
</template>
