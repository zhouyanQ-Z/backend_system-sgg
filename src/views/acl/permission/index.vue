<template>
  <el-table :data="tableData" border style="width: 100%" row-key="id">
    <el-table-column label="名称" prop="name" header-align="center" />
    <el-table-column label="权限值" prop="code" align="center" />
    <el-table-column label="修改时间" prop="updateTime" align="center" />
    <el-table-column label="操作" fixed="right" width="300px" align="center">
      <template #default="{row,$index}">
        <el-button type="primary" icon="User" size="small" :disabled="row.level==4" @click="addMenu(row)" v-has="'btn.Permission.add'">{{ row.level === 3 ? '添加功能': '添加菜单' }}</el-button>
        <el-button type="warning" icon="Edit" size="small" :disabled="row.level==1" @click="updateMenu(row)" v-has="'btn.Permission.update'">编辑</el-button>
        <el-popconfirm :title="`您确定要删除${row.name}吗？`" :width="200" icon="Delete" @confirm="delMenu(row.id)">
          <template #reference>
            <el-button type="danger" size="small" icon="Delete" :disabled="row.level==1" v-has="'btn.Permission.remove'">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 对话框：添加或修改已有菜单数据 -->
  <el-dialog v-model="addOrUpdateVisible" :title="dialogTitle">
    <el-form :model="addOrUpdateForm" :rules="menuRules" ref="addOrUpdateFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="addOrUpdateForm.name" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input v-model="addOrUpdateForm.code" placeholder="请输入权限数值" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addOrUpdateCancel">取消</el-button>
      <el-button type="primary" @click="addOrUpdateConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { reqAllPermission,reqAddOrUpdateMenu,reqDelMenu } from '@/api/acl/menu'
import type { PermissionResData } from '@/api/acl/role/type'
import type { MenuParams } from '@/api/acl/menu/type'
import { msgSuccess } from '@/utils/modal'
import { resetForm } from '@/utils/common'

interface DataType {
  tableData: PermissionResData[],// 权限列表
  addOrUpdateVisible: boolean,// 显示隐藏添加更新对话框组件
  dialogTitle: string, // 控制对话框标题
  addOrUpdateForm: MenuParams, // 添加或修改表单
}

const data = reactive<DataType>({
  tableData: [],
  addOrUpdateVisible: false,
  dialogTitle: '添加',
  addOrUpdateForm: {
    id: undefined,
    code: '', // 权限值
    level: 0, // 菜单级别
    name: '', // 菜单名称
    pid: 0, // 菜单id
  }
})

let { tableData,addOrUpdateVisible,dialogTitle,addOrUpdateForm } = toRefs(data)


// 菜单表单组件
const addOrUpdateFormRef = ref()

const nameValidator = (rule: any, value: any, callback: any) => {
  if(value.trim().length >= 2) callback()
  else callback(new Error('菜单名称至少2位'))
}
const codeValidator = (rule: any, value: any, callback: any) => {
  if(/^[a-zA-Z]/.test(value.trim())) callback()
  else callback(new Error('权限值由英文字母组成'))
}
// 表单验证规则
const menuRules = {
  name: [{ required: true,validator: nameValidator,trigger:'blur' }],
  code: [{ required: true,validator: codeValidator,trigger:'blur' }],
}

onMounted(() => {
  getData()
})

// 获取数据
const getData = () => {
  reqAllPermission().then(res => {
    if(res.code === 200) {
      tableData.value = res.data
    }
  })
}

// 添加菜单
const addMenu = (row:PermissionResData) => {
  addOrUpdateVisible.value = true
  // 清空上一次数据 id
  addOrUpdateForm.value.id = undefined
  dialogTitle.value = row.level === 3 ? '添加功能': '添加菜单'
  // 收集新增菜单的level与id
  addOrUpdateForm.value.level = row.level+1
  addOrUpdateForm.value.pid = row.pid as number
  //// 清除上一次收集的数据
  nextTick(() => {
    // 重置表单项为初始值并清除表单验证信息(resetFields)
    resetForm(addOrUpdateFormRef.value)     
  })
}
// 修改菜单
const updateMenu = (row:PermissionResData) => {
  addOrUpdateVisible.value = true
  dialogTitle.value = '修改菜单'
  // 解决重置表单无效方法
  nextTick(() => {
    // 重置表单项为初始值并清除表单验证信息
    resetForm(addOrUpdateFormRef.value)
    Object.assign(addOrUpdateForm.value,row)
  })
}

// 删除菜单
const delMenu = (menuId: number) => {
  reqDelMenu(menuId).then(res => {
    if(res.code === 200) {
      msgSuccess('删除成功')
      getData()
    }
  })
}


// 确定按钮操作
const addOrUpdateConfirm = () => {  
  if(!addOrUpdateFormRef.value) return
  addOrUpdateFormRef.value.validate((valid: boolean) => {
    if(valid) {
      reqAddOrUpdateMenu(addOrUpdateForm.value).then(res => {
      if(res.code === 200) {
        let msg = addOrUpdateForm.value.id ? '修改成功':'添加成功'
        msgSuccess(msg)
        // 重新获取数据
        getData()
      } else {
        let msg = addOrUpdateForm.value.id ? '修改失败':'添加失败'
        msgSuccess(msg)
      }}).finally(() => { addOrUpdateVisible.value = false })
    } else {
      return false
    }
  })
}
// 取消按钮操作
const addOrUpdateCancel = () => {
  addOrUpdateVisible.value = false
}
</script>

<style scoped>

</style>