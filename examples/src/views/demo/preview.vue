<script lang="ts" setup>
import type { PageSchema } from '@ies/types';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { EBuilder } from '@ies/core';
import { pluginManager } from '@ies/manager';
import { formTableData } from '@/mock';
import { parse } from 'jsonc-parser'

const route = useRoute();
const ebRef = ref<InstanceType<typeof EBuilder>>();
const Button = pluginManager.component.get('button');

const pageSchema = computed<PageSchema>(() => {
  const id = route.query.id as string;
  const item = formTableData.find((v) => String(v.id) === String(id));
  if (!item) {
    return { canvas: { mode: 'desktop' }, schemas: [] };
  }
  const jsonSchema = parse(item.jsonSchema);
  
  console.log(jsonSchema,'schema')
  return {
    canvas: {
      mode: 'desktop',
    },
    ...jsonSchema
  };

});

const onValidate = () => {
  ebRef.value?.validate();
};

const onReset = () => {
  ebRef.value?.resetData();
};
</script>

<template>
  <div class="bg-white h-full p-4 overflow-auto">
    <EBuilder ref="ebRef" :page-schema="pageSchema" />
  </div>
</template>
