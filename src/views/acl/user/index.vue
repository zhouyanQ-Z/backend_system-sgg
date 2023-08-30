<template>
  <el-card style="height: 70px;">
    <el-form inline class="form">
      <el-form-item label="用户名：">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!queryParams.username" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="mtop-20">
    <el-button type="primary" @click="addUser" icon="Plus" v-has="'btn.User.add'">添加</el-button>
    <el-button type="danger" :disabled="userArr.length < 2" @click="batchDelUser" v-has="'btn.User.remove'">批量删除</el-button>
    <el-table class="mtop-20" ref="tableRef" :data="tableData"  @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="#" width="55" align="center" />
        <el-table-column label="ID" prop="id" align="center" />
        <el-table-column label="用户名字" prop="username" align="center" />
        <el-table-column label="用户名称" prop="name" align="center" />
        <el-table-column label="用户角色" prop="roleName" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="300px" align="center">
          <template #default="{row,$index}">
            <el-button type="primary" icon="User" size="small" @click="allocateRole(row)" v-has="'btn.User.assgin'">分配角色</el-button>
            <el-button type="warning" icon="Edit" size="small" @click="updateUser(row)" v-has="'btn.User.update'">编辑</el-button>
            <el-popconfirm :title="`您确定要删除${row.username}吗？`" :width="200" icon="Delete" @confirm="delUser(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete" v-has="'btn.User.remove'">删除</el-button>
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

  <!-- 添加或修改用户 -->
  <el-drawer
    v-model="drawerAddOrUpdate"
    :title="title"
    :before-close="cancel"
  >
  <template #default>
    <el-form :model="userForm" :rules="userRules" ref="userFormRef">
      <el-form-item label="用户姓名" prop="username">
        <el-input v-model="userForm.username" placeholder="请输入用户姓名" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="name">
        <el-input v-model="userForm.name" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password" v-if="!userForm.id">
        <el-input v-model="userForm.password" placeholder="请输入用户密码" />
      </el-form-item>
    </el-form>
  </template>
  <template #footer>
    <div style="flex: auto">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </template>
  </el-drawer>

  <!-- 分配角色 -->
  <el-drawer
    v-model="drawerRole"
    title="分配角色"
    :before-close="closeRole"
  >
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input  :value="roleForm.username" disabled/>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="checkAllChange">全选</el-checkbox>
          <el-checkbox-group
            v-model="roleForm.assignRoles"
            @change="checkedRolesChange"
          >
            <el-checkbox v-for="item in allRoleArr" :key="item.id" :label="item">{{ item.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closeRole">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { reqUserInfo,reqAddOrUpdateUser,reqAllRole,reqSetRole,reqDelUser } from '@/api/acl/user'
import type { UserItf,RoleType,SetRolePms } from '@/api/acl/user/type'
import { msgSuccess } from '@/utils/modal';
import { resetForm } from '@/utils/common'
import useUserStore from "@/store/modules/user";
import useLayoutSettingStore from '@/store/modules/setting'


const userStore = useUserStore()
let currentUser = '' // 保存当前用户
const layoutSettingStore = useLayoutSettingStore()

interface DataType {
  tableData: UserItf[],//sku列表数据
  queryParams: { pageNo:number, pageSize:number,username: string }, // 分页参数
  total: number,// sku列表总数
  tableRef: any,
  drawerAddOrUpdate: boolean,// 显示隐藏添加抽屉组件
  title: string, // 控制抽屉标题
  userForm: UserItf, // 用户表单
  userArr: number[], //保存批量选择用户
  drawerRole: boolean,// 显示隐藏分配抽屉组件
  roleForm: { username: string, assignRoles: RoleType[] }, // 分配角色表单
  checkAll: boolean, // 控制是否全选角色
  isIndeterminate: boolean,//设置不确定状态
  allRoleArr: RoleType[], // 角色列表
  roleParams: SetRolePms, // 分配角色携带参数

}

const data = reactive<DataType>({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 15,
    username: '',
  },
  total: 0,
  tableRef: null,
  drawerAddOrUpdate: false,
  title: '',
  userForm: {
    username: '',
    name: '',
    password: ''
  },
  userArr: [],
  drawerRole: false,
  roleForm: {
    username: '',
    assignRoles: []
  },
  checkAll: false,
  isIndeterminate: false,
  allRoleArr: [],
  roleParams: {
    userId: 0,
    roleIdList: []
  }
})


let { 
  tableData,
  queryParams,
  total,
  tableRef,
  drawerAddOrUpdate,
  title,
  userForm,
  userArr,
  drawerRole,
  roleForm,
  checkAll,
  isIndeterminate,
  allRoleArr,
  roleParams
 } = toRefs(data)

// 用户表单组件
const userFormRef = ref()

const userNameValidator = (rule: any, value: any, callback: any) => {
  if(value.trim().length >= 5) callback()
  else callback(new Error('用户名字至少5位'))
}
const nameValidator = (rule: any, value: any, callback: any) => {
  if(value.trim().length >= 5) callback()
  else callback(new Error('用户昵称至少5位'))
}
const passwordValidator = (rule: any, value: any, callback: any) => {
  if(value.trim().length >= 6) callback()
  else callback(new Error('用户密码至少6位'))
}
// 表单验证规则
const userRules = {
  username: [{ required: true,validator: userNameValidator,trigger:'blur' }],
  name: [{ required: true,validator: nameValidator,trigger:'blur' }],
  password: [{ required: true,validator: passwordValidator,trigger:'blur' }],
}

onMounted(() => {
  getData()
})

// 获取数据
const getData = () => {
  reqUserInfo(queryParams.value.pageNo,queryParams.value.pageSize,queryParams.value.username).then(res => {
    if(res.code === 200) {
      total.value = res.data.total
      tableData.value = res.data.records
    }
  })
}

// 用户搜索
const handleSearch = () => {
  getData()
  // 清空搜索关键字
  queryParams.value.username = ''
}

// 重置
const handleReset = () => {
  layoutSettingStore.updateRefresh()
}

// 添加用户
const addUser = () => {
  drawerAddOrUpdate.value = true
  // 清除id
  userForm.value.id = 0
  // 清除password
  userForm.value.password = ''
  title.value = '添加用户'
  // 清除上一次收集的数据
  nextTick(() => {
    //清理字段表单验证信息。
    //userFormRef.value.clearValidate('username')
    // 重置表单项为初始值并清除表单验证信息(resetFields)
    resetForm(userFormRef.value)
  })


}
// 修改用户
const updateUser = (user:UserItf) => {
  currentUser = user.username
  drawerAddOrUpdate.value = true
  title.value = '修改用户'
  // 解决重置表单无效方法
  nextTick(() => {
    // 重置表单项为初始值并清除表单验证信息
    resetForm(userFormRef.value)
    userForm.value = Object.assign({},user)
  })
}
// 分配角色
const allocateRole = (user:UserItf) => {
  roleForm.value.username = user.username
  roleParams.value.userId = (user.id as number)
  reqAllRole((user.id as number)).then(res => {
    if(res.code === 200) {
      // 存储当前已有职位
      roleForm.value.assignRoles = res.data.assignRoles
      // 存储全部职位
      allRoleArr.value = res.data.allRolesList
      // 显示抽屉组件
      drawerRole.value = true
    }
  })
}
// 删除用户
const delUser = (userId: number) => {
  reqDelUser([userId]).then(res => {
    if(res.code === 200) {
      msgSuccess('删除成功')
      // 重新获取数据
      if(tableData.value.length == 1) queryParams.value.pageNo -= 1
      getData()
    }
  })
}
// 批量删除用户
const batchDelUser = () => {
  reqDelUser(userArr.value).then(res => {
    if(res.code === 200) {
      msgSuccess('删除成功')
      // 重新获取数据
      if(tableData.value.length == userArr.value.length) queryParams.value.pageNo -= 1
      getData()
    }
  })
}
// 确定按钮操作
const confirm = () => {  
  if(!userFormRef.value) return
  userFormRef.value.validate((valid: boolean) => {
    if(valid) {
      reqAddOrUpdateUser(userForm.value).then(res => {
      if(res.code === 200) {
        let msg = userForm.value.id ? '修改成功':'添加成功'
        msgSuccess(msg)
        // 重新获取数据 如果是添加回到第一页
        if(!userForm.value.id) queryParams.value.pageNo = 1
        getData()
        // 让浏览器自动刷新，防止自己修改自己导致还在原账户里操作，但实际上已不存在当前账号了
        if(currentUser === userStore.username && userForm.value.username !== userStore.username) window.location.reload()
      } else {
        let msg = userForm.value.id ? '修改失败':'添加失败'
        msgSuccess(msg)
      }}).finally(() => { drawerAddOrUpdate.value = false })
    } else {
      return false
    }
  })
  
}
// 取消按钮操作
const cancel = () => {
  drawerAddOrUpdate.value = false
}

// 全选复选框发生变化触发的事件
const checkAllChange = (val: boolean) => {
  // 全选则选择全部职位，全不选则置空
  roleForm.value.assignRoles = val ? allRoleArr.value : []
  isIndeterminate.value = false
}
// 控制全选框不确定状态触发事件
const checkedRolesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoleArr.value.length
  // 不确定状态
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoleArr.value.length
}
// 确定分配角色
const confirmRole = () => {
  // 整理参数
  roleParams.value.roleIdList = roleForm.value.assignRoles.map((item: any) => item.id)
  // 发请求
  reqSetRole(roleParams.value).then(res => {
    if(res.code === 200) {
      msgSuccess('分配角色成功')
      // 重新获取数据
      getData()
    }
  }).finally(() => {
    // 关闭抽屉组件
    drawerRole.value = false
  })
}

// 关闭分配角色抽屉
const closeRole = () => {
  drawerRole.value = false
}
// 多选触发事件
const handleSelectionChange = (val: UserItf[]) => {
  userArr.value = val.map((item:any) => item.id)
}

</script>

<style scoped lang="scss">
  .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>