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
            label="账号"
            placeholder="账号"
            :rules="[
              { required: true, message: '请填写账号' },
              {
                pattern: /^(?:[\w.-]+@(?:qq\.com|163\.com|gmail\.com))$/,
                message: '请输入有效的邮箱地址',
              },
            ]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <p class="ml-4 mt-1 text-sm text-zinc-400">
          暂无账号，<span
            class="underline text-cyan-400"
            @click="() => $router.push('/register')"
            >去注册</span
          >
        </p>
        <p class="ml-4 mt-1 text-sm text-zinc-400">
          <span
            class="underline text-cyan-400"
            @click="() => $router.push('/forget')"
            >忘记密码</span
          >
        </p>
        <div class="mt-7">
          <van-button round block type="primary" native-type="submit"> 登录 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from "vue";
import { Login } from "@/util/user";


import { showSuccessToast, showFailToast } from "vant";
import { useRouter } from "vue-router";
const router = useRouter();
const account = ref("");
const password = ref("");

const onSubmit = async (values) => {
  console.log("submit", values);
  const res = await Login(values);
  if (res.code == "200") {
    showSuccessToast("登录成功");
    router.replace("/");
    localStorage.setItem("userNo", JSON.stringify(res.data[0].userNo));
    // sendEmail('mrwangyp_2024@qq.com',123456);
  } else {
    console.log("error", res);
    showFailToast(res.message);
  }
};
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