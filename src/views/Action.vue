<template>
    <div class="home">
       
            <van-tabs class="tab" v-model:active="activeTabs" animated  @change="changeTab">
                <van-tab v-for="item in tabList" :title='item' :key="item">
                  <div class="tab-content w-full">
                    <router-view ></router-view>
                  </div>
                </van-tab>                   
            </van-tabs>
            
        <van-tabbar v-model="active" active-color="#ee0a24">
            <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/message" icon="chat-o">消息</van-tabbar-item>
            <van-tabbar-item to="/action" icon="fire-o">动态</van-tabbar-item>
            <van-tabbar-item to="/my" icon="user-circle-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { useTabStore } from '@/stores/tabStore';
const active = ref(2);
const router = useRouter();
const activeTabs = ref(null);
const tabList = ref(['关注','推荐','同城'])
const tabStore = useTabStore();
const changeTab = (name)=> {
  switch (name) {
    case 0:
      router.push('/action/like')
      break;
    case 1:
      router.push('/action/index')
      break;
    case 2:
      router.push('/action/area')
      break;
    default:
      router.push('/action/index')
      break;
  }
}

</script>

<style scoped lang="scss"> 
.home {
  height: calc(100vh - 50px);
  position: relative;
  background: linear-gradient(to bottom, pink, #ffffff);
  .tab{
    height :100%
  }
}
.van-tabs__content{
  height :100%
}
</style>