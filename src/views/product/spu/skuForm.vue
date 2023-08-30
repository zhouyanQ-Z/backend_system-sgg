<template>
  <el-form label-width="80">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="请输入SKU名称" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model.number="skuParams.price" placeholder="请输入价格" type="number" />
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input v-model.number="skuParams.weight" placeholder="请输入重量" type="number" />
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input v-model="skuParams.skuDesc" type="textarea" row="3" placeholder="请输入SKU描述" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option v-for="attrVal in item.attrValueList" :key="attrVal.id" :label="attrVal.valueName" :value="`${item.id}:${attrVal.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option v-for="attrVal in item.spuSaleAttrValueList" :key="attrVal.id" :label="attrVal.saleAttrValueName" :value="`${item.id}:${attrVal.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片信息">
      <el-table ref="tableRef" :data="imgArr" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="图片" prop="" align="center">
          <template #default="{row,$index}">
            <img :src="row.imgUrl" :alt="row.imgName" style="width: 100px; height: 100px;" />
          </template>
        </el-table-column> 
        <el-table-column label="名称" prop="imgName" align="center"/> 
        <el-table-column label="操作" fixed="right" width="100px" align="center">
          <template #default="{row,$index}">
            <el-button type="warning" @click="handleDefault(row)" size="small">设置默认</el-button>
          </template>
        </el-table-column> 
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import { reqAttrList } from '@/api/product/attr'
import { reqSpuImages,reqSpuSaleAttrs,reqAddSku } from '@/api/product/spu'
import type { spuImage,spuSaleAttr,skuInf } from '@/api/product/spu/type'
import type { attrRes } from '@/api/product/attr/type'
import { msgSuccess } from '@/utils/modal'



const emits = defineEmits(['changeScene'])


interface DataType {
  //attrForm: {},
  imgArr: spuImage[],
  saleArr: spuSaleAttr[],
  attrArr: attrRes[],
  skuParams: skuInf,
  tableRef:any,
}

const data = reactive<DataType>({
  //attrForm: {},
  imgArr: [],
  saleArr: [],
  attrArr: [],
  skuParams: {
    category3Id: '',//三级分类ID
    spuId: '',//spu的ID
    tmId: '',//品牌ID
    skuName: '',// sku名字
    price: '',// sku价格
    weight: '',// sku重量
    skuDesc: '',// sku描述
    skuAttrValueList: [], // 平台属性
    skuSaleAttrValueList: [], // 销售属性
    skuDefaultImg: '' // sku图片地址
  },
  tableRef: null
})

let { imgArr,saleArr,attrArr,skuParams,tableRef } = toRefs(data)

// 初始化数据
const initData = async (c1Id: string|number,c2Id:string|number,spu: any) => {
  // 清除收集数据
  Object.assign(skuParams.value,{
    category3Id: '',//三级分类ID
    spuId: '',//spu的ID
    tmId: '',//品牌ID
    skuName: '',// sku名字
    price: '',// sku价格
    weight: '',// sku重量
    skuDesc: '',// sku描述
    skuAttrValueList: [], // 平台属性
    skuSaleAttrValueList: [], // 销售属性
    skuDefaultImg: '' // sku图片地址
  })
  // 收集数据
  skuParams.value.category3Id = spu.category3Id
  skuParams.value.spuId = spu.id
  skuParams.value.tmId = spu.tmId
  // 获取平台属性
  let res1 = await reqAttrList(c1Id,c2Id,spu.category3Id)
  attrArr.value = res1.data
  
  // 获取销售属性
  let res2 = await reqSpuSaleAttrs(spu.id)
  saleArr.value = res2.data

  // 获取图片信息
  let res3 = await reqSpuImages(spu.id)
  imgArr.value = res3.data

}

// 选项变化触发事件
const handleSelectionChange = (val: never[]) => {
  // 只能勾选一个
  if(val.length > 1) {
    tableRef.value.clearSelection()
    tableRef.value.toggleRowSelection(val[val.length-1],true)
  }
}

// 设置默认操作
const handleDefault = (row:any) => {
  // 清除所有勾选
  tableRef.value.clearSelection()
  // 选中勾选图片
  tableRef.value.toggleRowSelection(row,true)
  skuParams.value.skuDefaultImg = row.imgUrl
}

// 保存
const save = () => {
  // 整理数据
  skuParams.value.skuAttrValueList = attrArr.value.map((item:any) => {
    //if(item.attrIdAndValueId) {
      let [attrId,valueId] = item.attrIdAndValueId.split(':')
      return {attrId,valueId}
    //}
  })
  skuParams.value.skuSaleAttrValueList = saleArr.value.map((item:any) => {
    //if(item.saleIdAndValueId) {
      let [saleAttrId,saleAttrValueId] = item.saleIdAndValueId.split(':')
      return {saleAttrId,saleAttrValueId}
    //}
  })
  //console.log(skuParams.value);
  // 发送请求
  reqAddSku(skuParams.value).then(res => {
    if(res.code === 200) {
      msgSuccess('添加成功')
      // 更换场景
      emits('changeScene',1,'add')
    }
  })
}

// 取消
const cancel = () => {
  emits('changeScene')
}

// 对外暴露方法
defineExpose({
  initData
})

</script>

<style scoped lang="scss">
  .el-form-item .el-form-item {
    margin-bottom: 18px;
  }
</style>