<template>
  <el-card class="category-card">
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select  v-model="categoryStore.c1Id" @change="changeC1" :disabled="scene!==0">
          <el-option v-for="item in categoryStore.c1Data" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  v-model="categoryStore.c2Id" @change="changeC2" :disabled="scene!==0">
          <el-option v-for="item in categoryStore.c2Data" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  v-model="categoryStore.c3Id" @change="changeC3" :disabled="scene!==0">
          <el-option v-for="item in categoryStore.c3Data" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import useCategoryStore from '@/store/modules/category';

  let categoryStore = useCategoryStore()

  defineProps(['scene'])
  

  onMounted(() => {
    // 获取一级分类数据
    getC1()
  })

  // 获取一级分类数据
  const getC1 = () => {
    categoryStore.getC1()
  }

  // 一级分类change事件
  const changeC1 = () => {
    //清空二级三级分类数据
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Data = []
    categoryStore.getC2()
  }

  // 二级分类change事件
  const changeC2 = () => {
    //清空三级分类数据
    categoryStore.c3Id = ''
    categoryStore.getC3()
  }

  // 三级分类change事件
  const changeC3 = () => {
    //categoryStore.getAttrList()
  }


</script>

<style scoped lang="scss">
  .category-card {
    margin-bottom: 20px;
  }
</style>