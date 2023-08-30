<template>
  <el-card class="trademark-card">
    <el-button type="primary" icon="Plus" @click="addTrademark" v-has="'btn.Trademark.add'">添加品牌</el-button>
    <el-table :data="tableData" border style="width: 100%" class="table-box">
      <el-table-column label="序号" width="80px" align="center" type="index" />
      <el-table-column prop="tmName" label="品牌名称"  align="center" />
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template #default="{row}">
          <img class="logo" :src="row.logoUrl" alt=""/>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="品牌操作" align="center"  fixed="right" width="200">
        <template #default="{row}">
          <el-button type="warning" size="small" icon="Edit" @click="() => updateTrademark(row)" v-has="'btn.Trademark.update'">编辑</el-button>
          <el-popconfirm :title="`您确定要删除${row.tmName}吗？`" :width="200" icon="Delete" @confirm="() => delTrademark(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" v-has="'btn.Trademark.remove'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Pagination 
      :hidden="tableData.length==0" 
      :total="total" 
      v-model:page="queryParams.pageNo" 
      v-model:limit="queryParams.pageSize" 
      @pagination="getData" />
  </el-card>

  <!-- 添加或修改模块对话框 -->
  <el-dialog v-model="addOrUpdateDialogVisible" :title="addOrUpdateTitle">
    <el-form :model="form" style="width: 80%;" ref="addOrUpdateForm" :rules="addRules">
      <el-form-item label="品牌名称" :label-width="dialogLabelWidth" prop="tmName">
        <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称" />
      </el-form-item>
      <el-form-item label="品牌LOGO" :label-width="dialogLabelWidth" prop="logoUrl">
        <UploadFile :imageUrl="form.logoUrl" @upload-url="uploadUrl" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary"  @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, toRefs,onMounted, ref, nextTick } from 'vue';
  //import { FormInstance } from 'element-plus';
  import { reqBaseTrademark,reqAddOrUpdateBaseTrademark,reqDelBaseTrademark } from '@/api/product/trademark/index'
  import { Trademark } from '@/api/product/trademark/type'
  import { msgSuccess } from '@/utils/modal'
  import { resetForm } from '@/utils/common'

  interface DataForm {
    tableData: Trademark[],
    isLoading: boolean,
    queryParams: { pageNo: number,pageSize: number },
    total: number,
    addOrUpdateDialogVisible: boolean,
    dialogLabelWidth: number,
    form: Trademark,
    addOrUpdateTitle: string
  }

  let addOrUpdateForm = ref()
  const data = reactive<DataForm>({
    tableData: [],
    isLoading: false,
    queryParams: {
      pageNo: 1,
      pageSize: 15
    },
    total: 0,
    addOrUpdateDialogVisible: false,
    dialogLabelWidth: 120,
    form: {
      tmName:'',
      logoUrl: ''
    },
    addOrUpdateTitle: ''
  })

  let { 
    tableData,
    isLoading,
    queryParams,
    total,
    addOrUpdateDialogVisible,
    dialogLabelWidth,
    form,
    addOrUpdateTitle
  } = toRefs(data)

  const validatorTmname = (rule: any,value: any,callback:any) => {
    if(value.trim().length >= 2) callback()
    else callback(new Error('品牌名称字数大于等于2'))
  }
  const validatorLogoUrl = (rule: any,value: any,callback:any) => {
    if(value) callback()
    else callback(new Error('品牌LOGO不能为空'))
  }


  // 表单校验
  let addRules = {
    tmName: [{ required: true, validator: validatorTmname,trigger: 'blur'}],
    logoUrl: [{ required: true, validator: validatorLogoUrl}]
  }

  onMounted(() => {
    getData()
  })


  const getData = () => {
    reqBaseTrademark({page: queryParams.value.pageNo,limit: queryParams.value.pageSize}).then(res => {
      if(res.code === 200) {
        total.value = res.data.total
        tableData.value = res.data.records
      }
    })
  }


  // 添加
  const addTrademark = () => {
    // 清空表单数据
    resetForm(addOrUpdateForm.value)

    form.value.id = 0
    addOrUpdateDialogVisible.value = true
    addOrUpdateTitle.value = '添加品牌'
    // 清理校验结果 第一次时addOrUpdateForm.value为undefined
    nextTick(() => {
      addOrUpdateForm.value?.clearValidate('tmName')
      addOrUpdateForm.value?.clearValidate('logoUrl')
    })
  }
  // 修改
  const updateTrademark = (row: Trademark) => {
    // 清理校验结果 第一次时addOrUpdateForm.value为undefined
    nextTick(() => {
      addOrUpdateForm.value?.clearValidate('tmName')
      addOrUpdateForm.value?.clearValidate('logoUrl')
    })
    addOrUpdateDialogVisible.value = true
    addOrUpdateTitle.value = '修改品牌'
    // 解决重置表单无效方法
    nextTick(() => {
      form.value = Object.assign({},row)
    })
  }
  // 删除
  const delTrademark = (id: number) => {
    reqDelBaseTrademark(id).then(res => {
      if(res.code === 200) {
        msgSuccess('删除成功')
        // 若当前页的数据只有一个，则回到上一页
        if(tableData.value.length == 1) queryParams.value.pageNo -= queryParams.value.pageNo
        getData()
      }
    })
  }
  // 确定
  const submitForm = () => {
    addOrUpdateForm.value.validate((valid:boolean) => {
      if(valid) {
        reqAddOrUpdateBaseTrademark(form.value).then(res => {
          if(res.code === 200) {
            // 修改留在当前页，添加返回第一页
            if(form.value.id) msgSuccess('修改品牌成功')
            else {
              msgSuccess('添加品牌成功')
              queryParams.value.pageNo = 1
            }
            // 重新获取数据
            getData() 
          }
        }).finally(() => { addOrUpdateDialogVisible.value = false })
      }
    })
  }
  // 取消
  const cancel = () => {
    addOrUpdateDialogVisible.value = false
  }
  // 图片上传成功
  const uploadUrl = (url: string) => {
    form.value.logoUrl = url
    // 图片上传成功，清除对应校验规则
    addOrUpdateForm.value.clearValidate('logoUrl')
  }
</script>

<style scoped lang="scss">
.table-box {
  margin-top: 20px;

  .logo {
    width: 100px;
    height: 100px;
  }
}
</style>