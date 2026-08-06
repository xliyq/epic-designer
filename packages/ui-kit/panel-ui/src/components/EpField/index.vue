<script lang="ts" setup>
import { pluginManager } from '@ies/manager';

const Input = pluginManager.component.get('input');
const modelValue = defineModel<string>();
</script>

<template>
  <Input v-model="modelValue" v-model:value="modelValue" />
</template>
