<template>
  <div class="home">
    <div class="tabbar-header">
      <div class="flex">
        <!-- <van-icon style="margin-right:10px;" name="notes-o" color="pink" />  -->
        <img
          @click="jumpPage('/history', '回看')"
          src="../assets/img/history.png"
          style="margin-right: 10px"
        />
        <img @click="jumpPage('/filter')" src="../assets/img/filter.png" />
      </div>
      <div>推荐</div>
      <div class="tabbar-header__right" @click="removeUser">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="header mt-[70px]" v-show="userList.length > 0">
      <div class="userImg">
        <img :src="userImg" />
      </div>
      <div class="userInfo">
        <div class="userInfo-name">
          {{ username }}
        </div>
        <div class="userInfo-age">{{ age }}岁</div>
      </div>
    </div>
    <div class="body" v-show="userList.length > 0">
      <div class="info">
        <van-icon name="notes-o" color="pink" /> 关于我
        <div class="etags">
          <div class="etag" v-if="mbit">{{ mbit }}人</div>
          <div class="etag" v-if="height">身高{{ height }}cm</div>
          <div class="etag" v-if="star">
            {{ star }}
          </div>
          <div class="etag" v-if="area">
            {{ area }}
          </div>
        </div>
        <p v-if="message">{{ message }}</p>
      </div>
      <div class="info" v-show="currentAction.length > 0">
        <van-icon name="comment-o" color="pink" /> 动态
        <div v-for="(action, index) in currentAction" :key="index">
        

          <p>{{action.content}}</p>
          <div v-if="action.imgList">
            <div class="static m-1" v-for="(item, index) in action.imgList.split(',')" :key="index">
              <img
                class="static w-full"
                :src="item"
              />
            </div>
          </div>
         
        </div>
      </div>
    </div>
    <div
      v-show="userList.length === 0"
      class="mt-[50px] flex items-center justify-center"
      style="height: calc(100% - 50px)"
    >
      <van-empty description="当前筛选条件下，暂无数据" />
    </div>
    <div class="fixed-icon" v-show="userList.length > 0">
      <img src="../assets/img/delete.png" @click="meetClick('2')" />
      <img src="../assets/img/love.png" @click="meetClick('1')" />
    </div>
    <van-tabbar v-model="active" active-color="#ee0a24">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/message" icon="chat-o">消息</van-tabbar-item>
      <!-- <van-tabbar-item to="/friend" icon="friends-o">朋友</van-tabbar-item> -->
      <van-tabbar-item to="/action" icon="fire-o">动态</van-tabbar-item>
      <van-tabbar-item to="/my" icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { Tabbar, TabbarItem } from "vant";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUser, getFilterUser, addLove } from "@/util/user";
import { getUserAction } from "@/util/action";
import { shuffleArray } from "@/util/random";
import { Empty } from "vant";
const userNo = localStorage.getItem("userNo");
const active = ref(0);
const userImg = ref("");
const username = ref("");
const age = ref(null);
const area = ref("");
const height = ref(null);
const star = ref("");
const mbit = ref("");
const message = ref("");
const filterParams = ref("");
const router = useRouter();
const userList = ref([]);
const currentIndex = ref(0);
const currentUserNo = ref(null);
const currentAction = ref([]);
const jumpPage = (path, headerTitle) => {
  if (headerTitle) {
    router.push({
      path: path, // 如果使用命名路由
      query: {
        headerTitle: headerTitle,
      },
    });
  } else {
    router.push(path);
  }
};
const removeUser = ()=>{
  localStorage.removeItem('userNo')
  router.push('/login');
}
onMounted(async () => {
  const res = await getUser(userNo);
  filterParams.value = res.data.filter;
  const res2 = await getFilterUser(JSON.parse(filterParams.value));
  userList.value = shuffleArray(res2.data.filter((item) => item.userNo != userNo));
  console.log(userList.value);
  if (userList.value.length !== 0) {
    currentUserNo.value = userList.value[currentIndex.value].userNo;
    userImg.value = userList.value[currentIndex.value].avatorImg;
    area.value = userList.value[currentIndex.value].area;
    username.value = userList.value[currentIndex.value].username;
    age.value = userList.value[currentIndex.value].age;
    height.value = userList.value[currentIndex.value].height;
    star.value = userList.value[currentIndex.value].star;
    mbit.value = userList.value[currentIndex.value].mbit;
    message.value = userList.value[currentIndex.value].message;

    const actionList = await getUserAction(currentUserNo.value);
    console.log("actionList", actionList);
    currentAction.value = actionList.data.slice(0, 3);
  }
});
const meetClick = async (type) => {
  const res = await addLove({
    userNo: Number(userNo),
    meetNo: currentUserNo.value,
    type: type,
  });
  console.log(res);
  currentIndex.value = currentIndex.value + 1;
  if (currentIndex.value >= userList.value.length) {
    currentIndex.value = 0;
  }
  currentUserNo.value = userList.value[currentIndex.value].userNo;
  userImg.value = userList.value[currentIndex.value].avatorImg;
  area.value = userList.value[currentIndex.value].area;
  username.value = userList.value[currentIndex.value].username;
  age.value = userList.value[currentIndex.value].age;
  height.value = userList.value[currentIndex.value].height;
  star.value = userList.value[currentIndex.value].star;
  mbit.value = userList.value[currentIndex.value].mbit;
  message.value = userList.value[currentIndex.value].message;
  const actionList = await getUserAction(currentUserNo.value);
    console.log("actionList", actionList);
    currentAction.value = actionList.data.slice(0, 3);
};
</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 50px);
  overflow: auto;
  position: relative;
  &::-webkit-scrollbar {
    width: 0 !important;
    background: transparent;
  }
  .fixed-icon {
    position: fixed;
    bottom: 50px;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 20px 10px rgba(255, 255, 255, 0.5);
    img {
      height: 60px;
      margin: 0 50px;
    }
  }
  .tabbar-header {
    width: 100vw;
    position: fixed;
    background: #fff;
    img {
      height: 20px;
    }
    padding: 0 20px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 20px;
    font-weight: bold;
    &__right {
      border-radius: 16px;
      padding: 4px 8px;
      border: solid 1px #ccc;
    }
  }
  .header {
    height: 160px;
    background: pink;

    border-radius: 12px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    .userImg {
      width: 100px;
      height: 100px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .userInfo {
      .userInfo-name {
        font-size: 20px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
  .body {
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    .info {
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
      .etags {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        font-weight: 400;
        font-size: 14px;
        .etag {
          margin: 10px;
          padding: 4px 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      }
      p {
        margin: 10px;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
