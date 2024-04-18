<template>
    <div class="home">
        <div class="header">
          <van-nav-bar :title="headerTitle" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="content">
            <div class="content-title" v-show="headerTitle.value === '回看'">
                <div class="content-icon"></div>
                <span class="content-text">今天</span>
            </div>
            <div v-if="data.length >0" class="grid grid-cols-2 gap-2 mt-2">

                <div class="h-[220px] flex flex-col items-center" v-for="(item,index) in data" :key="index" @click="goToTalk(item)">
                    <div>
                        <img class="w-[150px] h-[150px]" :src="item.avatorImg" />
                    </div>
                    <div class="flex items-center">
                       <span class="mr-2">{{item.username}}</span>
                        <img v-if="item.sex=='man'" class="w-[12px] h-[12px]" src="../assets/img/sexm.png"/>
                        <img v-else class="w-[12px] h-[12px]" src="../assets/img/sexw.png"/>
                    </div>   
                    <div>
                      <span v-if="item.age" class="mr-1 text-gray-500 text-sm">{{item.age}}岁</span>
                      <span v-if="item.height" class="mr-1  text-gray-500 text-sm">{{item.height}}cm</span>
                      <p v-if="item.area" class="mr-1  text-gray-500 text-sm">{{item.area}}</p>
                    </div>
                </div>
            </div>
            <div v-else>
              <van-empty description="暂无数据" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { useRoute,useRouter } from 'vue-router';
import { Empty } from 'vant';
import { v4 as uuidv4 } from "uuid";
const route = useRoute();
const router = useRouter();
import {getUserHistory,getUserLoveList,getUserLovedList } from "@/util/user";
import {addSession} from '@/util/session'
const onClickLeft = () => history.back();
const headerTitle = ref('回看')
const data = ref([])
const userNo = localStorage.getItem('userNo')
onMounted(async()=>{
  headerTitle.value = route.query.headerTitle
  if(headerTitle.value === '回看'){
    const res = await getUserHistory({
    userNo: Number(userNo)
  });
  data.value = res.data;
  }
  if(headerTitle.value === '我喜欢'){
    const res = await getUserLoveList({
    userNo: Number(userNo),
    type:'1'
  });
  data.value = res.data;
  }
  if(headerTitle.value === '喜欢我'){
    const res = await getUserLovedList({
    userNo: Number(userNo),
    type:'1'
  });
  data.value = res.data;
  }
})
const setTime = () => {
  const now = new Date();
  const formattedDateTime =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    " " +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);

  return formattedDateTime;
};
const goToTalk =async(item)=>{
  console.log(item)
  const uniqueId = uuidv4();
  const time = setTime()
  const res = await addSession({userNo:userNo,talkNo:item.userNo,sessionNo:uniqueId,createtime:time})
  console.log(res)
  if(res.code == 200 || res.code == 201){
    router.push('/message')
  }
  // userNo, talkNo, sessionNo, createtime
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
        width:100vw;
        position: fixed;
      --van-nav-bar-height: 50px;
      --van-nav-bar-icon-color: black;
      --van-nav-bar-title-font-size: 20px;
    }
    .content {
        margin:10px;
        padding:10px;
        margin-top:50px;
        .content-title {
            display: flex;
            align-items: center;
            .content-icon {
              height: 20px;
              width: 8px;
              background: pink;
              border-radius: 4px;
              display: inline-block;
              margin-right: 4px;
            }
            .content-text {
              font-size: 16px;
              color: gray;
            }
          }
    }
    .header {
      width:100vw;
      position: fixed;
      --van-nav-bar-height: 50px;
      --van-nav-bar-icon-color: black;
      --van-nav-bar-title-font-size: 20px;
    }
  }
</style>