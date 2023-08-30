<template>
  <Category :scene="scene" />
  <el-card class="spu-card-main">
    <div class="table" v-show="scene==0">
      <el-button type="primary" icon="Plus" @click="addSpu" :disabled="!categoryStore.c3Id" v-has="'btn.Spu.add'">添加SPU</el-button>
      <el-table :data="tableData" border style="width: 100%" class="table-box">
        <el-table-column label="序号" width="80" align="center" type="index" />
        <el-table-column label="SPU名称" align="center" width="200px" prop="spuName" />
        <el-table-column label="SPU描述" prop="description" header-align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center"  fixed="right" width="250">
          <template #default="{row}">
            <div style="width: 100%;">
              <el-tooltip content="添加SKU" placement="top">
                <el-button type="primary" size="small" icon="Plus" @click="addSku(row)" v-has="'btn.Spu.addsku'"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑SPU" placement="top">
                <el-button type="warning" size="small" icon="Edit" @click="updateSpu(row)" v-has="'btn.Spu.update'"></el-button>
              </el-tooltip>
              <el-tooltip content="查看SKU列表" placement="top">
                <el-button type="info" size="small" icon="InfoFilled" @click="checkSku(row)" v-has="'btn.Spu.skus'"></el-button>
              </el-tooltip>
              <el-popconfirm :title="`您确定要删除${row.spuName}吗？`" :width="200" icon="Delete" @confirm="delSpu(row.id)">
                <template #reference>
                  <div style="margin-left: 12px;display: inline-block;">
                    <el-tooltip content="删除SPU" placement="top">
                      <el-button type="danger" size="small" icon="Delete" v-has="'btn.Spu.delete'"></el-button>
                    </el-tooltip>
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination 
        :hidden="tableData.length==0" 
        :total="total" 
        v-model:page="queryParams.pageNo" 
        v-model:limit="queryParams.pageSize" 
        @pagination="getData" />
    </div>
    <!-- 添加或修改spu -->
    <SpuFrom ref="spuForm"  v-show="scene==1" @changeScene="changeScene"/>
    <!-- 添加sku -->
    <SkuFrom ref="skuForm" v-show="scene==2" @changeScene="changeScene"/>
    <!-- dialog对话框：展示sku列表 -->
    <el-dialog v-model="dialogVisible" title="SKU列表">
    <el-table :data="skuArr" border>
      <el-table-column prop="skuName" label="SKU名字" align="center" />
      <el-table-column prop="price" label="SKU价格" align="center" />
      <el-table-column prop="weight" label="SKU重量" align="center" />
      <el-table-column label="SKU图片" align="center">
        <template #default="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;" alt="" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, reactive, ref, toRefs, watch } from 'vue';
  import Category from '@/components/category/index.vue';
  import useCategoryStore from '@/store/modules/category';
  import { reqSpu,reqSkuInfo,reqDelSpu } from '@/api/product/spu';
  import type { SpuItf,skuInf } from '@/api/product/spu/type';
  import SpuFrom from './spuForm.vue'
  import SkuFrom from './skuForm.vue'
import { msgSuccess } from '@/utils/modal';

  const spuForm = ref()
  const skuForm = ref()


  interface DataType {
    scene: number,// 场景类型
    tableData: SpuItf[],//spu列表数据
    queryParams: {pageNo:number,pageSize:number}, // 分页参数
    total: number,// spu列表总数
    skuArr: skuInf[], // 存储sku列表数据
    dialogVisible: boolean,// 对话框显示
  }

  const data = reactive<DataType>({
    scene: 0,
    tableData: [],
    queryParams: {
      pageNo: 1,
      pageSize: 15
    },
    total: 0,
    skuArr: [],
    dialogVisible: false
  })
  let categoryStore = useCategoryStore()


  let { scene,tableData,queryParams,total,skuArr,dialogVisible } = toRefs(data)


  // 获取数据
  const getData = () => {
    reqSpu(queryParams.value.pageNo,queryParams.value.pageSize,categoryStore.c3Id).then(res => {
      if(res.code === 200) {
        tableData.value = res.data.records
        total.value = res.data.total
      }
    })
  }

  // 添加spu
  const addSpu = (row: SpuItf) => {
    scene.value = 1
    // 调用子组件获取spu数据方法
    spuForm.value.addSpuInit(categoryStore.c3Id)
  }
  // 添加sku
  const addSku = (row: SpuItf) => {
    // 切换场景
    scene.value = 2
    // 调用子组件获取spu数据方法
    skuForm.value.initData(categoryStore.c1Id,categoryStore.c2Id,row)
  }
  // 编辑spu
  const updateSpu = (row: SpuItf) => {
    scene.value = 1
    // 调用子组件获取spu数据方法
    spuForm.value.initSpuData(row)
  }
  // 查看sku
  const checkSku = (row: SpuItf) => {
    reqSkuInfo((row.id as number)).then(res => {
      if(res.code === 200) {
        skuArr.value = res.data
        // 打开对话框
        dialogVisible.value = true
      }
    })
  }
  // 删除
  const delSpu = (row: SpuItf) => {
    reqDelSpu((row.id as number)).then(res => {
      if(res.code === 200) {
        msgSuccess('删除成功')
        // 重新获取数据
        if(tableData.value.length == 1) queryParams.value.pageNo = queryParams.value.pageNo-1
        getData()
      }
    })
  }

  // 切换场景
  const changeScene = (flag:number=0,type: string='') => {
    scene.value = 0
    // 添加返回回到第一页，修改返回留在当前页
    if(type === 'add') queryParams.value.pageNo = 1
    // flag为是否更新数据后再切换的场景 1=更新，0=没更新
    if(flag==1) getData()
  }


  watch(() => categoryStore.c3Id,() => {
    // 清空上次的分类数据
    tableData.value = []
    // c3Id不等于0或者为空
    if(categoryStore.c3Id) {
      getData()
    }
  })


  // 组件销毁之前把store中的分类数据清空
  onBeforeUnmount(() => {
    categoryStore.$reset()
  })

</script>

<style scoped lang="scss">
  .spu-card-main {
    .table-box {
      margin-top: 20px;
    }
  }
</style>