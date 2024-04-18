<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="今天吃啥呢" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content">
      <div class="w-[120px] h-[120px] flex items-center justify-center text-2xl">
        {{ food }}
      </div>
      <van-button v-show="!timer" @click="onClick" type="primary">开始</van-button>
      <van-button v-show="timer" @click="stopClick" type="primary">停止</van-button>
      <van-cell-group inset style="margin-top: 10px">
        <van-field
          v-model="message"
          rows="2"
          autosize
          label="美食"
          type="textarea"
          placeholder="请输入美食"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const food = ref("汉堡");
const message = ref("");
const foodList = ref(["汉堡", "炸鸡", "烤肉", "火锅"]);

onMounted(() => {
  message.value = foodList.value.join("，");
});
watch(message, (newMessage) => {
  if (typeof newMessage === "string" && newMessage.length > 0) {
    foodList.value = newMessage.split("，").map((item) => item.trim());
  }
});
const onClickLeft = () => history.back();
const timer = ref(null);
const index = ref(0);
const onClick = () => {
  if (!timer.value) {
    timer.value = setInterval(() => {
      food.value = foodList.value[index.value % foodList.value.length];
      index.value++;
    }, 200);
  }
};

const stopClick = () => {
  clearInterval(timer.value);
  timer.value = null;
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;

  position: relative;
  background: linear-gradient(to bottom, pink, #ffffff);

  .content {
    box-sizing: border-box;
    height: 100vh;
    padding-top: 60px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
      background: transparent;
    }
  }
  .header {
    width: 100vw;
    position: fixed;
    --van-nav-bar-height: 50px;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-font-size: 20px;
    z-index: 1;
  }
}
</style>
