<template>
  <Category :scene="scene" />
  <el-card class="attr-card-main">
    <div class="table" v-show="scene==0">
      <el-button type="primary" icon="Plus" @click="addAttr" :disabled="!categoryStore.c3Id" v-has="'btn.Attr.add'">添加属性</el-button>
      <el-table :data="tableData" border style="width: 100%" class="table-box">
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column label="属性名称" align="center" width="120px" prop="attrName" />
        <el-table-column label="属性值名称" header-align="center">
          <template #default="{row}">
            <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center"  fixed="right" width="200">
          <template #default="{row}">
            <el-tooltip content="编辑" placement="top">
              <el-button type="warning" size="small" icon="Edit" @click="updateAttr(row)" v-has="'btn.Attr.update'"></el-button>
            </el-tooltip>
            <el-popconfirm :title="`您确定要删除${row.tmName}吗？`" :width="200" icon="Delete" @confirm="delAttr(row.id)">
              <template #reference>
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" size="small" icon="Delete" v-has="'btn.Attr.remove'"></el-button>
                </el-tooltip>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add-update"  v-show="scene==1">
      <el-form inline>
        <el-form-item label="属性名称">
          <el-input v-model="attrParams.attrName" placeholder="请输入属性名称" />
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="Plus" @click="addAttrVal" :disabled="!attrParams.attrName">添加属性值</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-table :data="attrParams.attrValueList" border style="width: 100%;margin: 20px 0;">
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column label="属性值名称" header-align="center">
          <template #default="{row,$index}">
            <el-input :ref="(el:HTMLElement) => handleRef(el,$index)" v-if="row.flag" v-model="row.valueName" placeholder="请输入属性值" @blur="toLook(row,$index)" />
            <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center"  fixed="right" width="80">
          <template #default="{row,$index}">
            <el-button type="danger" size="small" icon="Delete" @click="delAttrVal($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="saveAttrVal" :disabled="attrParams.attrValueList.length==0">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { nextTick, reactive, toRaw, toRefs,watch,onBeforeUnmount } from 'vue';
  import Category from '@/components/category/index.vue';
  import useCategoryStore from '@/store/modules/category';
  import { reqAttrList,reqAddOrUpdateAttr,reqDelAttr } from '@/api/product/attr';
  import { attrRes,attrVal } from '@/api/product/attr/type';
  import { msgSuccess,msgError } from '@/utils/modal'
  import { deepClone } from '@/utils/common'

  interface dataForm {
    tableData: attrRes[],
    scene: number,
    attrParams: attrRes,
    inputArr: HTMLElement[],
  }

  const data = reactive<dataForm>({
    tableData: [],
    scene: 0, // card内容场景切换，scene=0显示table，scene=1显示添加或修改属性结构
    attrParams: {
      attrName: '', // 属性名
      attrValueList: [], // 属性值数组
      categoryId: '', // 三级分类id
      categoryLevel: 3, // 三级分类
    },
    inputArr: [], // 保存input实例，实现input框自动focus
  })

  let { tableData,scene,attrParams,inputArr } = toRefs(data)

  let categoryStore = useCategoryStore()


  // 添加属性
  const addAttr = () => {
    // 清空上次数据
    Object.assign(attrParams.value,toRaw(attrParams.value))
    scene.value = 1
    // 收集三级分类id
    attrParams.value.categoryId = categoryStore.c3Id
  }
  // 修改属性
  const updateAttr = (row: attrRes) => {
    scene.value = 1
    attrParams.value = deepClone(row) as attrRes
    
  }
  // 删除属性
  const delAttr = (id: number) => {
    reqDelAttr(id).then(res => {
      if(res.code === 200) {
        msgSuccess('删除成功')
        getAttrList()
      }
    })
  }

  // 获取属性列表
  const getAttrList = () => {
    reqAttrList(categoryStore.c1Id,categoryStore.c2Id,categoryStore.c3Id).then(res => {
      if(res.code === 200) {
        tableData.value = res.data
      }
    })
  }

  // 添加属性值
  const addAttrVal = () => {
    attrParams.value.attrValueList.push({
      valueName: '',
      flag: true  // 控制编辑与查看模式切换
    })
    // input框聚焦
    nextTick(() => {      
      inputArr.value[attrParams.value.attrValueList.length-1].focus()
    })
  }

  // 保存添加属性
  const saveAttrVal = () => {
    reqAddOrUpdateAttr(attrParams.value).then(res => {
      if(res.code === 200) {
        scene.value = 0
        msgSuccess(attrParams.value.id ? '修改成功':'添加成功')
        // 重新获取数据
        getAttrList()
      }
    })
  }

  // 取消
  const cancel = () => {
    scene.value = 0
  }

  // 查看模式
  const toLook = (row: attrVal,index: number) => {
    row.flag = !row.flag
    // 属性值不能为空
    if(row.valueName.trim() == '') {
      attrParams.value.attrValueList.splice(index,1)
      msgError('属性值不能为空')
      return
    }
    // 属性值不能重复
    let repeat = attrParams.value.attrValueList.find(item => {
      if(item != row) return item.valueName === row.valueName
    })
    if(repeat) {
      attrParams.value.attrValueList.slice(index,1)
      msgError('属性值不能重复')
      return
    }
  }
  // 编辑模式
  const toEdit = (row: attrVal,index:number) => {
    row.flag = !row.flag
    //响应式数据row.flag发生变化，获取更新后的dom
    nextTick(() => {
      inputArr.value[index].focus()
    })
  }

  // 收集input dom对象
  const handleRef = (el:HTMLElement,index:number) => {
    inputArr.value[index] = el
  }

  // 删除添加的属性值
  const delAttrVal = (index: number) => {
    attrParams.value.attrValueList.splice(index,1)
  }

  // 监听 三级分类id
  watch(() => categoryStore.c3Id,() => {
    // 清空上次的分类数据
    tableData.value = []

    if(categoryStore.c3Id !== 0 && categoryStore.c3Id !== '') {
      getAttrList()
    }
  })


  // 组件销毁之前把store中的分类数据清空
  onBeforeUnmount(() => {
    categoryStore.$reset()
  })

</script>

<style scoped lang="scss">
  

  .attr-card-main {

    .table-box {
      margin-top: 20px;
    }
  }
</style>