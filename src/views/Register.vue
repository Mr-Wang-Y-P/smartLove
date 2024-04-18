<template>
  <div class="home">
    <div class="headTitle">
      <van-nav-bar title="注册" />
    </div>
    <div class="mt-[100px] flex flex-col justify-center items-center mb-[20px]">
      <img src="@/assets/img/logo.png" class="w-[200px] h-[200px]" alt="logo" />
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="account"
            name="account"
            label="账号"
            placeholder="qq/网易/谷歌邮箱注册"
            :rules="[
              { required: true, message: '请填写qq/网易/谷歌邮箱注册' },
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
          <van-field
            name="sex"
            label="性别"
            :rules="[{ required: true, message: '请选择性别' }]"
          >
            <template #input>
              <van-radio-group v-model="sex" direction="horizontal">
                <van-radio name="man">男</van-radio>
                <van-radio name="woman">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="age"
            type="number"
            label="年龄"
            name="age"
            :rules="[{ required: true, message: '请填写年龄' }]"
            placeholder="请输入年龄"
          />
          <van-field
            v-model="area"
            is-link
            readonly
            name="area"
            label="地区选择"
            :rules="[{ required: true, message: '请选择地区' }]"
            placeholder="点击选择省市区"
            @click="showArea = true"
          />
          <van-popup v-model:show="showArea" position="bottom">
            <van-area
              :area-list="areaList"
              :columns-num="2"
              @confirm="onConfirmArea"
              @cancel="showArea = false"
            />
          </van-popup>
        </van-cell-group>
        <p class="ml-4 mt-1 text-sm text-zinc-400">
          已有账号，<span
            class="underline text-cyan-400"
            @click="() => $router.push('/login')"
            >去登录</span
          >
        </p>
        <div class="mt-7">
          <van-button round block type="primary" native-type="submit"> 注册 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { areaList } from "@vant/area-data";
import { Register } from "@/util/user";
import { showSuccessToast, showFailToast } from "vant";
import { useRouter } from 'vue-router';
const router = useRouter()
const account = ref("");
const password = ref("");
const age = ref("");
const sex = ref("");
const area = ref("");
const showArea = ref(false);
const onConfirmArea = ({ selectedOptions }) => {
  showArea.value = false;
  area.value = selectedOptions.map((item) => item.text).join("-");
};
const onSubmit = async(values) => {
  console.log("submit", values);
  const res = await Register(values);
  if (res.code == "200") {
    showSuccessToast("注册成功");
    router.replace("/login");
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
