<template>
    <div class="home">
        <div class="headTitle">
          <van-nav-bar title="朋友" />
        </div>
        <div class="content">
        </div>
    </div>

    <van-tabbar v-model="active" active-color="#ee0a24">
        <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item to="/message" icon="chat-o">消息</van-tabbar-item>
        <!-- <van-tabbar-item to="/friend" icon="friends-o">朋友</van-tabbar-item> -->
        <van-tabbar-item to="/action" icon="fire-o">动态</van-tabbar-item>
        <van-tabbar-item to="/my" icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref } from "vue";
const active = ref(2);
</script>

<style lang="scss" scoped>
.home {
    height: calc(100vh - 50px);
    overflow: auto;
    position: relative;
    background: linear-gradient(to bottom, pink, #ffffff);
    &::-webkit-scrollbar {
      width: 0 !important;
      background: transparent;
    }
    .headTitle {
      width:100vw;
      position: fixed;
      --van-nav-bar-height: 50px;
      --van-nav-bar-icon-color: black;
      --van-nav-bar-title-font-size: 20px;
    }
    .content{
        margin-top:50px;
        height: calc(100vh - 100px);
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0 !important;
          background: transparent;
        }
    }
  }
</style>