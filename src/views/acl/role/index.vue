<template>
  <el-card style="height: 70px;">
    <el-form inline class="form">
      <el-form-item label="角色名称：">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!queryParams.roleName" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="mtop-20">
    <el-button type="primary" @click="addRole" icon="Add" v-has="'btn.Role.add'">添加角色</el-button>
    <el-table class="mtop-20" ref="tableRef" :data="tableData" border>
        <el-table-column type="index" label="#" width="55" align="center" />
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="300px" align="center">
          <template #default="{row,$index}">
            <el-button type="primary" icon="User" size="small" @click="allocatePermission(row.id)" v-has="'btn.Role.assign'">分配权限</el-button>
            <el-button type="warning" icon="Edit" size="small" @click="updateRole(row)" v-has="'btn.Role.update'">编辑</el-button>
            <el-popconfirm :title="`您确定要删除${row.roleName}吗？`" :width="200" icon="Delete" @confirm="delRole(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete" v-has="'btn.Role.remove'">删除</el-button>
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

  <!-- 添加或修改角色 -->
  <el-dialog v-model="addOrUpdateVisible" :title="title">
    <el-form :model="roleForm" :rules="userRules" ref="roleFormRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>

  <!-- 分配角色 -->
  <el-drawer
    v-model="drawerPermission"
    title="分配权限"
    :before-close="closePermission"
  >
    <template #default>
      <el-tree
        ref="roleTree"
        :data="allRoleArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="roleCheckedArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closePermission">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { reqRoleList,reqAddOrUpdateRole,reqAllPermission,reqAllocatePermission,reqDelRole } from '@/api/acl/role'
import type { RoleType,PermissionResData } from '@/api/acl/role/type'
import { msgSuccess } from '@/utils/modal'
import { resetForm } from '@/utils/common'
import useLayoutSettingStore from '@/store/modules/setting'


const layoutSettingStore = useLayoutSettingStore()

// 树形控件配置选项
const defaultProps = {
  children: 'children',
  label: 'name',
}

interface DataType {
  tableData: RoleType[],// 角色列表
  queryParams: { pageNo:number, pageSize:number,roleName: string }, // 分页参数
  total: number,// table列表总数
  addOrUpdateVisible: boolean,// 显示隐藏添加更新对话框组件
  title: string, // 控制抽屉标题
  roleForm: RoleType, // 角色表单
  allRoleArr: PermissionResData[], // 角色列表
  drawerPermission: boolean,// 显示隐藏分配抽屉组件
  roleCheckedArr: number[], // 保存选中角色的id(四级id)

}

const data = reactive<DataType>({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 15,
    roleName: '',
  },
  total: 0,
  addOrUpdateVisible: false,
  title: '',
  roleForm: {
    roleName: ''
  },
  drawerPermission: false,
  allRoleArr: [],
  roleCheckedArr: []
})


let { 
  tableData,
  queryParams,
  total,
  addOrUpdateVisible,
  title,
  roleForm,
  drawerPermission,
  allRoleArr,
  roleCheckedArr
 } = toRefs(data)

// 角色表单组件
const roleFormRef = ref()
// 分配角色树形组件
const roleTree = ref()

const roleNameValidator = (rule: any, value: any, callback: any) => {
  if(value.trim().length >= 2) callback()
  else callback(new Error('角色名称至少2位'))
}
// 表单验证规则
const userRules = {
  roleName: [{ required: true,validator: roleNameValidator,trigger:'blur' }]
}

onMounted(() => {
  getData()
})

// 获取数据
const getData = () => {
  reqRoleList(queryParams.value.pageNo,queryParams.value.pageSize,queryParams.value.roleName).then(res => {
    if(res.code === 200) {
      total.value = res.data.total
      tableData.value = res.data.records
    }
  })
}

// 角色搜索
const handleSearch = () => {
  getData()
  // 清空搜索关键字
  queryParams.value.roleName = ''
}

// 重置
const handleReset = () => {
  layoutSettingStore.updateRefresh()
}

// 添加角色
const addRole = () => {
  addOrUpdateVisible.value = true
  // 清空上一次数据 id
  roleForm.value.id = undefined
  title.value = '添加角色'
  //// 清除上一次收集的数据
  nextTick(() => {
    // 重置表单项为初始值并清除表单验证信息(resetFields)
    resetForm(roleFormRef.value)     
  })
}
// 修改角色
const updateRole = (role:RoleType) => {
  addOrUpdateVisible.value = true
  title.value = '修改角色'
  // 解决重置表单无效方法
  nextTick(() => {
    // 重置表单项为初始值并清除表单验证信息
    resetForm(roleFormRef.value)
    Object.assign(roleForm.value,role)
  })
}
// 分配角色
const allocatePermission = (roleId:number) => {
  // 存储角色id
  roleForm.value.id = roleId
  // 显示抽屉组件
  drawerPermission.value = true
  reqAllPermission(roleId).then(res => {
    if(res.code === 200) {
      // 保存全部角色数据
      allRoleArr.value = res.data
      // 筛选选中的id(四级id)
      roleCheckedArr.value = filterSelected(res.data,[])
    }
  })
}
// 筛选选中的id(四级id)
const filterSelected = (data:any,initArr: number[]) => {
  data.forEach((item: any) => {
    if(item.elected && item.level === 4) {
      initArr.push(item.id)
    }
    if(item.children && item.children.length) {
      filterSelected(item.children,initArr)
    }
  });
  return initArr
}
// 删除角色
const delRole = (roleId: number) => {
  reqDelRole(roleId).then(res => {
    if(res.code === 200) {
      msgSuccess('删除成功')
      // 重新获取数据
      if(tableData.value.length == 1) queryParams.value.pageNo -= 1
      getData()
    }
  })
}
// 确定按钮操作
const confirm = () => {  
  if(!roleFormRef.value) return
  roleFormRef.value.validate((valid: boolean) => {
    if(valid) {
      reqAddOrUpdateRole(roleForm.value).then(res => {
      if(res.code === 200) {
        let msg = roleForm.value.id ? '修改成功':'添加成功'
        msgSuccess(msg)
        // 重新获取数据 如果是添加回到第一页
        if(!roleForm.value.id) queryParams.value.pageNo = 1
        getData()
      } else {
        let msg = roleForm.value.id ? '修改失败':'添加失败'
        msgSuccess(msg)
      }}).finally(() => { addOrUpdateVisible.value = false })
    } else {
      return false
    }
  })
}
// 取消按钮操作
const cancel = () => {
  addOrUpdateVisible.value = false
}
// 确定分配权限
const confirmPermission = () => {
  // 整理参数
  // 返回当前选中节点 key 的数组
  let permissionId = roleTree.value.getCheckedKeys()
  // 返回目前半选中的节点的 key 所组成的数组
  permissionId = permissionId.concat(roleTree.value.getHalfCheckedKeys())
  
  // 发请求
  reqAllocatePermission((roleForm.value.id as number),permissionId).then(res => {
    if(res.code === 200) {
      msgSuccess('分配权限成功')
      // 页面刷新，防止权限修改后页面还停留于未改之前（当前用户还是拥有未改之前的权限）
      window.location.reload()
    }
  }).finally(() => {
    // 关闭抽屉组件
    drawerPermission.value = false
  })
}

// 关闭分配权限抽屉
const closePermission = () => {
  drawerPermission.value = false
}

</script>

<style scoped lang="scss">
  .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>