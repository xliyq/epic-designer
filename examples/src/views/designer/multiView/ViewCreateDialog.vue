<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const emit = defineEmits<{
  confirm: [data: { name: string; code: string }]
}>()

const visible = ref(false)
const form = reactive({ name: '', code: '' })
const rules = {
  name: [{ required: true, message: '请输入视图名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入视图编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '编码必须以字母开头，仅允许字母、数字和下划线', trigger: 'blur' },
  ],
}

const formRef = ref<FormInstance>()

async function handleOk() {
  try {
    await formRef.value?.validate()
    emit('confirm', { name: form.name.trim(), code: form.code.trim() })
    visible.value = false
  } catch {
    // 校验失败，不关闭
  }
}

function handleClose() {
  formRef.value?.resetFields()
}

function open() {
  visible.value = true
  nextTick(() => formRef.value?.resetFields())
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" title="新建视图" width="420px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="视图名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入视图名称" />
      </el-form-item>
      <el-form-item label="视图编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入视图编码（英文字母或下划线）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </template>
  </el-dialog>
</template>
