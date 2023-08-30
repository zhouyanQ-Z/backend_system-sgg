<template>
  <el-form label-width="100px" :model="spuParams">
    <el-form-item label="SPU名称">
      <el-input v-model="spuParams.spuName" placeholder="请输入SPU名称" />
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option v-for="item in trademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spuParams.description" type="textarea" row="3" placeholder="请输入SPU描述" />
    </el-form-item>
    <el-form-item label="SPU照片">
      <upload-image v-model="spuParams.spuImageList" />
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select v-model="saleAttrIdAndName" :placeholder="unSelectSaleAttr.length ? `还有${unSelectSaleAttr.length}个未选择`:'暂无数据可选'">
        <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
      </el-select>
      <el-button style="margin-left: 10px;" type="primary" icon="Plus" @click="addSaleAttr" :disabled="!saleAttrIdAndName">添加销售属性</el-button>
      <el-table :data="spuSaleAttrs" border style="margin-top: 20px;">
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column label="属性名" width="100px" align="center" prop="saleAttrName"/>
        <el-table-column label="属性值" header-align="center">
          <template #default="{row,$index}">
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag"
              class="tag"
              closable
              :disable-transitions="false"
              @close="tagClose(row,$index)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag"
              :ref="(el:HTMLElement) => handleRef(el,$index)"
              v-model="row.saleAttrValue"
              class="ml-1 w-50"
              size="small"
              @keyup.enter="completeInput(row)"
              @blur="completeInput(row)"
            />
            <el-button v-else type="success" size="small" @click="showInput(row,$index)" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px" align="center">
          <template #default="{row,$index}">
            <el-button type="danger" icon="Delete" @click="delSaleAttr($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="!spuSaleAttrs.length" type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { reactive,toRefs,nextTick, computed,toRaw } from 'vue';
  import type { SpuItf } from '@/api/product/spu/type';
  import { reqAllTrademark,reqSpuImages,reqAllSaleAttrs,reqSpuSaleAttrs,reqAddOrUpdateSpu } from '@/api/product/spu';
  import { Trademark } from '@/api/product/trademark/type'
  import { spuImage,spuSaleAttr,saleAttr } from '@/api/product/spu/type'
  import { msgSuccess } from '@/utils/modal'


  const emits = defineEmits(['changeScene'])

  interface DataType {
    trademark: Trademark[],
    imgList: spuImage[],
    spuSaleAttrs: spuSaleAttr[],
    allSaleAttrs: saleAttr[],
    spuParams: SpuItf,
    inputRefs:  HTMLElement[],
    saleAttrIdAndName: string, // 收集选择的销售属性id和名字
  }

  const data = reactive<DataType>({
    trademark: [],
    imgList: [],
    spuSaleAttrs: [],
    allSaleAttrs: [],
    spuParams: {
      //id: undefined,
      spuName: '', //spu名字
      description: '',// spu描述
      category3Id: '', // 三级分类id
      tmId: '',// 品牌id
      spuSaleAttrList: null, // spu销售属性
      spuImageList: null // spu图片
    },
    inputRefs: [],
    saleAttrIdAndName: ''
  })

  let { trademark,imgList,spuSaleAttrs,allSaleAttrs,spuParams,inputRefs,saleAttrIdAndName } = toRefs(data)

  // 计算出当前SPU还未拥有的销售属性
  let unSelectSaleAttr = computed(() => {
    return allSaleAttrs.value.filter(item => {
      return spuSaleAttrs.value.every(attr => attr.saleAttrName !== item.name)
    })
  })

  // 初始化数据
  const initSpuData = async (spu: SpuItf) => {
    // 保存父组件中存过来的数据
    spuParams.value = spu
    // 获取全部品牌数据
    let res1 = await reqAllTrademark()
    trademark.value = res1.data
    if(spu.id) {
      // 获取某个品牌下的全部spu图片
      let res2 = await reqSpuImages(spu.id)
      // imgList.value = res2.data
      spuParams.value.spuImageList = res2.data
      // 获取某个spu下的全部销售属性
      let res3 = await reqSpuSaleAttrs(spu.id)
      spuSaleAttrs.value = res3.data
    }
    // 获取全部销售属性
    let res4 = await reqAllSaleAttrs()
    allSaleAttrs.value = res4.data
  }

  // 添加spu初始化方法
  const addSpuInit = async (c3Id: number|string) => {
    // 清空上次数据
    Object.assign(spuParams.value,{
      //id: undefined,
      spuName: '', //spu名字
      description: '',// spu描述
      category3Id: '', // 三级分类id
      tmId: '',// 品牌id
      spuSaleAttrList: null, // spu销售属性
      spuImageList: null // spu图片
    })
    // 清空spuSaleAttrs
    spuSaleAttrs.value = []
    saleAttrIdAndName.value = ''
    // 存储三级id
    spuParams.value.category3Id = c3Id
    // 获取全部品牌数据
    let res1 = await reqAllTrademark()
    trademark.value = res1.data
    // 获取全部销售属性
    let res4 = await reqAllSaleAttrs()
    allSaleAttrs.value = res4.data
  }


  // 添加销售属性
  const addSaleAttr = () => {
    const [baseSaleAttrId,saleAttrName] = saleAttrIdAndName.value.split(':')
    let newSaleAttr:spuSaleAttr = {
      baseSaleAttrId: Number(baseSaleAttrId),
      saleAttrName,
      spuSaleAttrValueList: []
    }
    // 追加到销售属性数组中
    spuSaleAttrs.value.push(newSaleAttr)
    // 清空收集到的saleAttrIdAndName
    saleAttrIdAndName.value = ''
  }
  // 删除销售属性
  const delSaleAttr = (index: number) => {
    spuSaleAttrs.value.splice(index,1)
  }

  // 保存
  const save = () => {
    // 整理图片数据【已处理】

    // 整理销售数据
    spuParams.value.spuSaleAttrList = spuSaleAttrs.value

    // 发送请求
    reqAddOrUpdateSpu(spuParams.value).then(res => {
      if(res.code === 200) {
        spuParams.value.id ? msgSuccess('修改成功'):msgSuccess('添加成功')
        // 更换场景
        emits('changeScene',1,spuParams.value.id?'update':'add')
      }
    })
  }

  // 取消
  const cancel = () => {
    emits('changeScene')
  }

  // 接收文件上传数据
  //const handleUpload = (data:any) => {
  //  spuParams.value.spuImageList = data
  //}

  // 收集input dom对象
  const handleRef = (el:HTMLElement,index:number) => {
    inputRefs.value[index] = el
  }

  const tagClose = (row: spuSaleAttr,index: number) => {
    row.spuSaleAttrValueList.splice(index, 1)
  }

  // 点击添加input
  const showInput = (row: spuSaleAttr,index: number) => {
    row.flag = true
    row.saleAttrValue = ''
    nextTick(() => {
      inputRefs.value[index]!.focus()
    })
  }

  // 输入框输入完成
  const completeInput = (row: spuSaleAttr) => {
    let { saleAttrValue,baseSaleAttrId } = row
    if (saleAttrValue?.trim()) {
      // 判断属性值是否重复
      if(!row.spuSaleAttrValueList.find(item => item.saleAttrValueName == saleAttrValue)) {
        row.spuSaleAttrValueList.push({baseSaleAttrId,saleAttrValueName: saleAttrValue})
      }
    }
    row.flag = false
    row.saleAttrValue = ''
  }

  // 对外暴露相关方法
  defineExpose({
    initSpuData,
    addSpuInit
  })

</script>

<style scoped lang="scss">

.tag {
  margin-right: 5px;
}
</style>