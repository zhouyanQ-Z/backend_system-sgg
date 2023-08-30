<template>
    <el-card class="sku-card-main">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column fixed label="序号" width="80" type="index" align="center" />
        <el-table-column prop="skuName" label="名称" align="center" show-overflow-tooltip width="150" />
        <el-table-column prop="skuDesc" label="描述" align="center" show-overflow-tooltip width="150" />
        <el-table-column label="默认图片" align="center">
          <template #default="{row,$index}">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(g)" align="center" />
        <el-table-column prop="price" label="价格(元)" align="center" />
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template #default="{row}">
            <div style="width: 100%;">
              <el-tooltip :content="row.isSale == 1 ? '下架':'上架'" placement="top">
                <el-button :type="row.isSale == 1 ? 'warning':'success'" size="small" :icon="row.isSale== 1 ? 'Bottom':'Top'" @click="updateSale(row)" v-has="'btn.Sku.updown'"></el-button>
              </el-tooltip>
              <el-tooltip content="编辑SKU" placement="top">
                <el-button type="primary" size="small" icon="Edit" @click="updateSku(row)" v-has="'btn.Sku.update'"></el-button>
              </el-tooltip>
              <el-tooltip content="查看" placement="top">
                <el-button type="info" size="small" icon="InfoFilled" @click="checkSku(row.id)"  v-has="'btn.Sku.detail'"></el-button>
              </el-tooltip>
              <el-popconfirm :title="`您确定要删除${row.skuName}吗？`" :width="200" icon="Delete" @confirm="delSku(row.id)">
                <template #reference>
                  <div style="margin-left: 12px;display: inline-block;">
                    <el-tooltip content="删除SKU" placement="top">
                      <el-button type="danger" size="small" icon="Delete" v-has="'btn.Sku.remove'"></el-button>
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

        <!-- 抽屉组件：查看商品详情 -->
        <el-drawer
          v-model="drawer"
          title="查看商品详情"
          :before-close="closeDrawer"
        >
          <el-row class="drawer-row">
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{ skuInfo.skuName }}</el-col>
          </el-row>
          <el-row class="drawer-row">
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
          </el-row>
          <el-row class="drawer-row">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ skuInfo.price }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag 
                style="margin: 5px;" 
                type="danger" 
                v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.attrName }}</el-tag>
            </el-col>
          </el-row>
          <el-row class="drawer-row">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag 
                style="margin: 5px;" 
                type="success" 
                v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrName }}</el-tag>
            </el-col>
          </el-row>
          <el-row class="drawer-row">
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                  <img :src="item.imgUrl" alt="" />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue';
import { reqSkuList,reqOnSale,reqCancelSale,reqSkuInfo,reqDelSku } from '@/api/product/sku'
import type {} from '@/api/product/sku'
import type { skuInf } from '@/api/product/spu/type';
import { msgSuccess } from '@/utils/modal';


  interface DataType {
    tableData: skuInf[],//sku列表数据
    queryParams: {pageNo:number,pageSize:number}, // 分页参数
    total: number,// sku列表总数
    drawer: boolean, // 控制抽屉组件显示与隐藏
    skuInfo: skuInf, // 商品详情
  }

  const data = reactive<DataType>({
    tableData: [],
    queryParams: {
      pageNo: 1,
      pageSize: 15
    },
    total: 0,
    drawer: false,
    skuInfo: {}
  })

  let { tableData,queryParams,total,drawer,skuInfo } = toRefs(data)

  onMounted(() => {
    getData()
  })


  const getData = () => {
    reqSkuList(queryParams.value.pageNo,queryParams.value.pageSize).then(res => {
      if(res.code === 200) {
        total.value = res.data.total
        tableData.value = res.data.records
      }
    })
  }
  //上架或下架操作
  const updateSale = (row:skuInf) => {
    if(row.isSale == 1) {
      // 此时是下架操作
      reqCancelSale((row.id as number)).then(res => {
        if(res.code === 200) {
          msgSuccess('下架成功')
          // 重新获取数据
          getData()
        }
      })
    } else {
      // 此时是上架操作
      reqOnSale((row.id as number)).then(res => {
        if(res.code === 200) {
          msgSuccess('上架成功')
          // 重新获取数据
          getData()
        }
      })
    }
  }
  // 编辑操作
  const updateSku = (row:any) => {
    msgSuccess('努力研发中......')
  }
  // 查看操作
  const checkSku = (skuId:number) => {
    drawer.value = true
    reqSkuInfo(skuId).then(res => {
      if(res.code === 200) {
        skuInfo.value = res.data
      }
    })
  }

  // 关闭抽屉组件
  const closeDrawer = (done: () => void) => {
    drawer.value = false
  }
  // 删除操作
  const delSku = (id:number) => {
    reqDelSku(id).then(res => {
      if(res.code === 200) {
        msgSuccess('删除成功')
        // 重新获取数据
        if(tableData.value.length == 1) queryParams.value.pageNo = queryParams.value.pageNo-1
        getData()
      }
    })
  }

  
</script>

<style scoped lang="scss">
  .drawer-row {
    margin: 10px 0;
  }

  .el-carousel__item img {
    width: 100%;
    height: 100%;
    line-height: 200px;
  }
</style>