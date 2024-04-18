<template>
  <div class="content">
    <div
      v-if="data.length > 0"
      v-for="item in data"
      :key="item.actionNo"
      class="w-full my-8"
    >
      <div class="flex justify-between m-4 items-center">
        <div class="flex items-center">
          <img class="rounded-full w-10 h-10 mr-4" :src="item.avatorImg" />
          <div class="flex-col">
            <div class="flex items-center">
              <span class="font-bold">{{ item.username }}</span>
              <img class="ml-2 w-4 h-4" src="@/assets/img/sexm.png" />
            </div>
            <div class="text-neutral-500 text-sm">
              <span class="mr-2">{{ item.age }}</span>
              <span>{{ item.area }}</span>
            </div>
          </div>
        </div>
        <!-- <van-icon  name="ellipsis" />  -->
      </div>
      <div class="m-4 text-l">
        <p>{{ item.content }}</p>
        <div v-if="item.imgList.split(',').length > 0" class="mt-3">
          <div :class="gridClass(item)">
            <img
              v-for="(img, index) in item.imgList.split(',')"
              :key="index"
              :src="img"
            />
          </div>
        </div>
      </div>
      <p class="text-neutral-500 text-sm m-4">
        {{ timeToFriendlyString(item.publishtime) }}
      </p>
      <div class="text-neutral-500 text-sm mx-4 flex items-center justify-around">
        <span class="flex items-center" @click="toggleAnswer(item.actionNo)">
          <van-icon size="30" name="smile-comment" />
        </span>
        <span class="flex items-center">
          <van-icon
            v-show="item.like && item.like == 1"
            size="30"
            name="like"
            color="red"
            @click="toggleLike(item.actionNo, '0')"
          />
          <van-icon
            v-show="!item.like || item.like == 0"
            size="30"
            name="like"
            @click="toggleLike(item.actionNo, '1')"
          />
          <span class="ml-1 text-lg font-bold">{{ item.like_count }}</span>
        </span>
      </div>
    </div>
    <div v-else>
      <van-empty description="暂无数据" />
    </div>
    <van-icon
      @click="jumpRouter('/publish')"
      name="add"
      size="40"
      class="bottom-[380px] right-[200vw]"
      style="position: fixed"
    />
    <van-popup
      v-model:show="showAnswer"
      position="bottom"
      style="
        maxheight: 300px;
        width: 100vw;
        transform: translateX(0vw);
        overflow: hidden;
      "
    >
      <div class="relative h-[300px]" style="overflow: hidden">
        <van-list
          v-show="list.length > 0"
          style="height: 240px; overflow: auto"
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
        >
        <div class="" v-for="(item, index) in list" :key="index">
          <div class="flex min-h-10 p-2">
            <div class="flex items-center w-[100px]">
              <div class="w-[40px] h-[40px] rounded-full">
                <img class="rounded-full object-fill w-full h-full" :src="item.avatorImg" />
              </div>
              <div class="ml-[10px] truncate" style="width: 50px">
                {{item.username}}
              </div>
            </div>
            <div class="ml-4 text-zinc-400 break-all flex items-center flex-wrap" style="max-width: 220px">
              {{ item.text }}
            </div>
          </div>
        </div>
        </van-list>
        <div v-show="list.length == 0" style="height: 240px">
          <van-empty description="暂无数据" />
        </div>
        <van-cell-group
          inset
          style="
            margin: 0px;
            background: linear-gradient(to bottom, pink, #ffffff);
            border-radius: 0px;
          "
          class="fixed bottom px-[20px] w-full rounded-none"
        >
          <van-field
            v-model="text"
            center
            clearable
            label=""
            placeholder="请输入评论"
            class="bg-zinc-500"
            style="background: linear-gradient(to bottom, pink, #ffffff)"
          >
            <template #button>
              <van-button @click="sendText" size="small" type="primary">发送</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getLoveAction, getText, addText, updateLike } from "@/util/action";
import { Empty } from "vant";
const currentActionNo = ref('')
const router = useRouter();
const showAnswer = ref(false);
const currentUserNo = Number(localStorage.getItem("userNo"));
const list = ref([]);
const text = ref("");
const finished = ref(false);
const loading = ref(false);
const jumpRouter = (name) => {
  console.log(showAnswer.value);
  // if(!showAnswer) {
  router.push(name);
  // }
};
const data = ref([]);
onMounted(async () => {
  const result = await getLoveAction(currentUserNo);
  data.value = result.data;
});

const gridClass = (item) => {
  const imgCount = item.imgList.split(",").length;
  let cols, rows;
  // 根据图片数量确定行列数
  if (imgCount === 1 || imgCount === 2 || imgCount === 3) {
    cols = imgCount.toString();
    rows = "1";
  } else if (imgCount === 4) {
    cols = "2";
    rows = "2";
  } else if (imgCount >= 5 && imgCount <= 6) {
    cols = "3";
    rows = "2";
  } else if (imgCount >= 7 && imgCount <= 9) {
    cols = "3";
    rows = "3";
  }

  // 返回带有动态行列数的类名
  return `grid grid-cols-${cols} grid-rows-${rows} gap-1`;
};
const timeToFriendlyString = (dateStr) => {
  const inputDate = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - inputDate.getTime();

  // 计算相差的天数、小时和分钟
  const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesAgo = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

  if (daysAgo === 0) {
    // 同一天内
    if (minutesAgo <= 1) {
      return "刚刚";
    } else if (minutesAgo < 60) {
      return `${minutesAgo}分钟前`;
    } else {
      return `${hoursAgo}小时前`;
    }
  } else if (daysAgo === 1) {
    // 昨天
    return (
      "昨天 " +
      inputDate.toLocaleTimeString("default", { hour: "numeric", minute: "numeric" })
    );
  } else if (daysAgo === 2) {
    // 前天
    return (
      "前天 " +
      inputDate.toLocaleTimeString("default", { hour: "numeric", minute: "numeric" })
    );
  } else {
    // 更早的日期
    return inputDate.toLocaleDateString();
  }
};
const toggleLike = async (actionNo, type) => {
  
  const res = await updateLike({ like: type, actionNo: actionNo, userNo: currentUserNo });
  console.log(res);
  if (res.code == 200 || res.code == 201) {
    const result = await getLoveAction(currentUserNo);
    data.value = result.data;
  }
};
const toggleAnswer = async (actionNo) => {
  currentActionNo.value = actionNo
  showAnswer.value = true;
  list.value = [];
  const res = await getText(actionNo);
  console.log(res);
  list.value = res.data;
  finished.value = true;
};
const sendText =async()=>{
  const res = await addText({
    actionNo: currentActionNo.value,
    text: text.value,
    userNo: currentUserNo,
  });
  console.log(res);
  if(res.code == 200){
    text.value = ''
    const res = await getText(currentActionNo.value);
    list.value = res.data;
  }
}
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 94px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0 !important;
    background: transparent;
  }
  --van-field-placeholder-text-color: "white";
}
</style>
