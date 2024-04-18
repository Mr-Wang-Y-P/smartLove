<template>
  <div class="home">
    <div class="headTitle">
      <van-nav-bar title="我的" />
    </div>
    <div class="p-4 mt-[50px]">
      <div class="header mt-[10px] flex justify-between items-center">
        <div class="flex">
          <img v-show="userImg"  class="w-[70px] h-[70px] rounded-full" :src="userImg" />
          <div class="flex flex-col justify-center ml-2">
            <div class="text-xl font-bold">{{ username }}</div>
            <div class="text-sm">{{ userNo }}</div>
          </div>
        </div>
        <button
          class="w-[60px] text-zinc-400 h-[30px] border rounded-2xl border-zinc-400 border-solid"
          @click="goRouter('/editorUser')"
        >
          编辑
        </button>
      </div>
      <div class="mt-[16px] grid grid-cols-3 gap-4">
        <div class="flex flex-col justify-center item-center"  @click="goRouter('/history','我喜欢')">
          <span class="text-2xl font-bold text-center"> {{ count1 }} </span>
          <span class="text-center text-zinc-400"> 我喜欢的 </span>
        </div>
        <div class="flex flex-col justify-center item-center"  @click="goRouter('/history','喜欢我')">
          <span class="text-2xl font-bold text-center"> {{ count2 }} </span>
          <span class="text-center text-zinc-400"> 喜欢我的 </span>
        </div>
        <div class="flex flex-col justify-center item-center" @click="goRouter('/history','回看')">
          <span class="text-2xl font-bold text-center"> {{ count3 }} </span>
          <span class="text-center text-zinc-400"> 最近访问 </span>
        </div>
      </div>
      <div class="rounded-md bg-white p-1 mt-12">
        <van-cell @click="showShare = true" title="推荐给好友" icon="good-job-o" is-link>
        </van-cell>
        <van-cell title="帮助" icon="question-o" is-link @click="goRouter('/help')">
        </van-cell>
        <van-cell title="美食决定" is-link @click="goRouter('/foods')">
        </van-cell>
        <!-- <van-cell title="安全中心" icon="bulb-o" is-link> -->
        <!-- </van-cell> -->
        <van-cell title="设置" icon="setting-o" is-link @click="show = true"> </van-cell>
      </div>
      <p class="text-center text-zinc-400 text-sm mt-4">智恋号：{{ userNo }}</p>
    </div>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="show = false"
      @select="onSelect"
    />
    <!-- <van-cell title="显示分享面板"  /> -->
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelectShare"
    />
    <van-tabbar v-model="active" active-color="#ee0a24">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/message" icon="chat-o">消息</van-tabbar-item>
      <!-- <van-tabbar-item to="/friend" icon="friends-o">朋友</van-tabbar-item> -->
      <van-tabbar-item to="/action" icon="fire-o">动态</van-tabbar-item>
      <van-tabbar-item to="/my" icon="user-circle-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from "vue";
import ClipboardJS from "clipboard";
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";
import { getUser, getUserLove, getUserLoved, getUserHistory } from "@/util/user";
const username = ref("");
const userImg = ref("");
const userNo = localStorage.getItem("userNo");
const clipboardUrl = ref("url");
const active = ref(3);
const router = useRouter();
const show = ref(false);
const count1 = ref(0);
const count2 = ref(0);
const count3 = ref(0);
const actions = [{ name: "退出登录" }];
onMounted(async () => {
  const res = await getUser(userNo);
  console.log(res);
  username.value = res.data.username;
  userImg.value = res.data.avatorImg;
  const resLove = await getUserLove({ userNo });
  const resLoved = await getUserLoved({ userNo });
  count1.value = resLove.count;
  count2.value = resLoved.count;
  const res3 = await getUserHistory({
    userNo: Number(userNo),
  });
  count3.value = res3.data.length;
});
const onSelect = (item) => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  show.value = false;
  localStorage.removeItem("userNo");
  router.replace("/login");
  // if (item.name === "退出登录") {
  //   localStorage.removeItem("userNo");
  //   router.replace("/login");
  // } 
  // } else if (item.name === "注销") {
  //   showConfirmDialog({
  //     title: null,
  //     message: "是否确定注销账号",
  //   })
  //     .then(() => {
  //       // on confirm
  //       router.replace("/login");
  //       console.log(item.name, "账号已被注销");
  //     })
  //     .catch(() => {
  //       // on cancel
  //       console.log("取消注册");
  //     });
  // }
  // showToast(item.name);
};
const goRouter = (path, headerTitle) => {
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

const showShare = ref(false);
const options = [
  { name: "微博", icon: "weibo", className: "icon" },
  // { name: 'QQ', icon: 'qq',className:'qq' },
  { name: "复制链接", icon: "link", className: "link" },
];
const copyText = () => {
  const clipboard = new ClipboardJS(".link", {
    text() {
      return clipboardUrl.value;
    },
  });
  clipboard.on("success", () => {
    console.log("复制成功");
    showToast("复制成功");
  });
  clipboard.on("error", () => {
    console.log("复制失败");
    showToast("复制失败");
  });
};
// onMounted(() => {
//   console.log(document.getElementsByClassName('van-share-sheet__options'))
// })
const onSelectShare = (option) => {
  showShare.value = false;
  switch (option.name) {
    case "QQ":
      // https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=你的网址&sharesource=qzone&title=你的分享标题&pics=你的分享图片&summary=你的分享描述信息
      let title = "智恋";
      let url = window.location.href;
      window.open(
        "http://connect.qq.com/widget/shareqq/index.html?url=" +
          encodeURIComponent("http:www.baidu.com")
      );
      break;
    case "微博":
      window.open(
        "https://service.weibo.com/share/share.php?url=" +
          encodeURIComponent(window.location.href) +
          "&summary=智恋"
      );
      break;
    case "复制链接":
      copyText();
      break;
    default:
      break;
  }
};
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
    width: 100vw;
    position: fixed;
    --van-nav-bar-height: 50px;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-font-size: 20px;
  }
}
</style>
