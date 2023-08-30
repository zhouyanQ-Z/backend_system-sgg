<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="ruleFormRef">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input placeholder="请输入账号" v-model="loginForm.username">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login-btn"
              @click="hadleLogin"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { useRouter,useRoute } from "vue-router";
import useUserStore from "@/store/modules/user";
import { notifySuccess, notifyError } from "@/utils/modal";
import { getTime } from "@/utils/common";


const $router = useRouter();
const $route = useRoute();
const userStore = useUserStore();
const ruleFormRef = ref()
const data = reactive({
  loginForm: {
    username: "admin",
    password: "atguigu123",
  },
  loading: false,
});

const validatorName = (rule:any,value:any,callback:any) => {
  if(value === '') callback(new Error('账号不能为空'))
  else if(value.length < 5 && value.length > 10) {
    callback(new Error('账号长度为5-10位'))
  } 
  else callback()
}

const validatorPass = (rule:any,value:any,callback:any) => {
  if(value === '') callback(new Error('密码不能为空'))
  else if(value.length < 6 && value.length > 10) {
    callback(new Error('密码长度为6-10位'))
  } 
  else callback()
}

const rules = {
  username: [
    //{ require: true, min: 5, max: 10, message: '账号长度在5-10位', trigger: 'change' },
    { validator:validatorName,trigger:'change' }
  ],
  password: [
    //{ require: true, min: 6, max: 15, message: '密码长度在6-15位', trigger: 'change' }
    { validator:validatorPass,trigger:'change' }
  ]
}

let { loginForm, loading } = toRefs(data);

const hadleLogin = () => {
  if(!ruleFormRef.value) return
  ruleFormRef.value.validate((valid:boolean) => {
    if(valid) {
      loading.value = true;
      userStore.userLogin(loginForm.value).then((res) => {
        // 判断登录是是否携带query参数
        //let redirect = $route.query.redirect;
        $router.replace({ path: $route.query.redirect as string || '/' });
        notifySuccess("欢迎回来", `HI,${getTime()}好`);
      })
      .catch((err) => {        
        notifyError(err.message);
      })
      .finally(() => {
        loading.value = false;
      });
    }
  })
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url("@/assets/images/login_form.png") no-repeat;
  background-size: cover;
  padding: 40px;
  h1 {
    font-size: 40px;
    color: #fff;
    font-weight: bold;
  }
  h2 {
    font-size: 20px;
    color: #fff;
    margin: 20px 0;
  }
  .el-form-item {
    margin-left: 30px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
