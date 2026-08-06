<template>
  <div class="goods-page">
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="200" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="primary" link size="small" @click="handleView(scope.row)">
            预览
          </el-button>
          <el-button type="primary" link size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElTable,ElTableColumn,ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { formTableData } from '@/mock'
const router = useRouter()
interface GoodsItem {
  id:number
  name: string
  jsonSchema:string
}

const tableData: GoodsItem[] = formTableData

function handleView(row: GoodsItem) {
  console.log('查看', row)
  router.push({ name: 'formPreview', query: { id: row.id } })
}

function handleEdit(row: GoodsItem) {
  console.log('编辑', row)
  router.push({ name: 'formMode', query: { id: row.id } })
}
</script>

<style scoped>
.goods-page {
  padding: 20px;
}
</style>