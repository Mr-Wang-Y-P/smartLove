<template>
  <div class="home">
    <div class="headTitle">
      <van-nav-bar title="登录" />
    </div>
    <div class="mt-[100px] flex flex-col justify-center items-center">
      <img src="@/assets/img/logo.png" class="w-[200px] h-[200px]" alt="logo" />
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="account"
            name="account"
            label="用户名"
            placeholder="用户名"
            :rules="[
              { required: true, message: '请填写用户名' },
              {
                pattern: /^(?:[\w.-]+@(?:qq\.com|163\.com|gmail\.com))$/,
                message: '请输入有效的邮箱地址',
              },
            ]"
          />
          <van-field
            v-model="code"
            center
            clearable
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #button>
              <van-button size="small" type="primary" @click="sendEmail"
                >发送验证码</van-button
              >
            </template>
          </van-field>
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="新密码"
            placeholder="新密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <p class="ml-4 mt-1 text-sm text-zinc-400">
          暂无账号，<span
            class="underline text-cyan-400"
            @click="() => $router.push('/login')"
            >去登录</span
          >
        </p>
        <div class="mt-7">
          <van-button round block type="primary" native-type="submit"> 修改 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

import { showSuccessToast, showFailToast } from "vant";
import { useRouter } from "vue-router";
import {updatePaw} from '@/util/user'
const router = useRouter();
const account = ref("");
const password = ref("");
const code = ref("");
const rightCode = ref('')
const onSubmit = async (values) => {
  console.log("submit", values);
    if(code.value === rightCode.value){
        try {
        const response = await updatePaw({account:account.value,password:password.value})
        if(response.code == 200){
                showSuccessToast('密码修改成功')
                router.push('/login')
        }else{
            showFailToast('密码修改失败')
        }
      } catch (error) {
        // 处理失败响应
        console.error('密码修改失败:', error.response.data);
        showFailToast(error.response.data.message)
      }
    }else{
        showFailToast('验证码错误')
    }
};
const sendEmail = async () => {
    if(account.value){
        if(!(/^(?:[\w.-]+@(?:qq\.com|163\.com|gmail\.com))$/.test(account.value))){
            showFailToast('请输入有效的邮箱地址')
        }
        try {
        const response = await axios.post('http://127.0.0.1:8800/sendEmail', { account:account.value });

        // 处理成功响应
        rightCode.value = response.data.emailCode
        // console.log('邮件发送成功:', response.data);
      } catch (error) {
        // 处理失败响应
        // console.error('发送邮件失败:', error.response.data);
        showFailToast('发送邮件失败，请检查邮箱是否正确')
      }
    }else{
        showFailToast('请输入邮箱地址')
    }
}
</script>

<style scoped lang="scss">
.home {
  height: calc(100vh);
  overflow: auto;
  position: relative;
  background: linear-gradient(to bottom, pink, #ffffff);
  &::-webkit-scrollbar {
    width: 0 !important;
    background: transparent;
  }
  .headTitle {
    width: 100vw;
    position: fixed;
    --van-nav-bar-height: 50px;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-font-size: 20px;
  }
}
</style>
../email
