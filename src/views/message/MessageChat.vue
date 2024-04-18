<template>
  <div class="home">
    <div class="headTitle">
      <van-nav-bar :title="titleText" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content">
      <div ref="contentBodyRef" class="mt-2 px-4 content-body">
        <div v-for="(item, index) in data" :key="item.sessionId">
          <div
            v-if="item.userNo == talkNo && item.talkNo == userNo"
            class="flex my-4 items-center"
          >
            <div>
              <img
                v-if="talkInfo.avatorImg"
                class="w-10 h-10 rounded-full"
                :src="talkInfo.avatorImg"
              />
            </div>
            <div
              style="word-wrap: break-word"
              class="bg-white rounded-lg p-2 ml-2 max-w-52"
              v-if="item.talkContent"
            >
              {{ item.talkContent }}
            </div>
            <div class="bg-white rounded-lg p-2 mr-2 max-w-52" v-if="item.contentImg">
              <img
                :src="item.contentImg"
                class="max-w-50"
                @click="previewImg(item.contentImg)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd(item.sessionId,$event)"
              />
              <a
              :href="item.contentImg"
              download
              style="display: none"
              :ref="(el) => { downloadLinks.set(item.sessionId, el); }"
            ></a>
            </div>
            <div class="ml-2 max-w-64" v-if="item.voice">
              <audio style="max-width: 246px" :src="item.voice" controls="true"></audio>
            </div>
          </div>
          <div
            v-if="item.userNo == userNo && item.talkNo == talkNo"
            class="flex flex-row-reverse items-center my-4"
          >
            <div>
              <img
                v-if="userInfo.avatorImg"
                class="w-10 h-10 rounded-full"
                :src="userInfo.avatorImg"
              />
            </div>
            <div
              style="word-wrap: break-word"
              class="bg-white rounded-lg p-2 mr-2 max-w-52"
              v-if="item.talkContent"
            >
              {{ item.talkContent }}
            </div>
            <div class="bg-white rounded-lg p-2 mr-2 max-w-52" v-if="item.contentImg">
              <img
                :src="item.contentImg"
                class="max-w-50"
                @click="previewImg(item.contentImg)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd(item.sessionId,$event)"
              />
              <a
              :href="item.contentImg"
              download
              style="display: none"
              :ref="(el) => { downloadLinks.set(item.sessionId, el); }"
            ></a>
            </div>
            <div class="mr-2 max-w-64" v-if="item.voice">
              <audio style="max-width: 246px" :src="item.voice" controls="true"></audio>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full bg-[#f2f2f2] p-2">
        <div class="relative flex">
          <div class="w-4/5">
            <van-cell-group inset style="margin: 0">
              <van-field
                v-model="message"
                rows="1"
                autosize
                :label="null"
                type="textarea"
                placeholder="请输入"
              />
            </van-cell-group>
          </div>
          <div class="absolute bottom-2 right-4" style="bottom: 6px" v-show="message">
            <van-button type="primary" size="small" @click="sendSession">发送</van-button>
          </div>
          <div class="absolute bottom-2 right-7" v-show="!message">
            <van-icon v-show="!showBtns" name="plus" size="24" @click="showBtns = true" />
            <van-icon
              v-show="showBtns"
              name="cross"
              size="24"
              @click="showBtns = false"
            />
          </div>
        </div>

        <div class="h-20 w-full flex mt-3" v-show="!message && showBtns">
          <van-uploader :after-read="afterRead" accept=".jpg, .jpeg, .png">
            <div class="flex flex-col items-center justify-center m-3 mt-0">
              <div class="bg-white py-2 px-3">
                <van-icon name="photo-o" size="30" />
              </div>
              <div class="mt-2">相册</div>
            </div>
          </van-uploader>

          <div
            class="flex flex-col items-center justify-center m-3"
            @click="showBottom = true"
          >
            <div class="bg-white py-2 px-3">
              <van-icon name="audio" size="30" />
            </div>

            <div class="mt-2">录音</div>
          </div>
        </div>
        <van-popup
          v-model:show="showBottom"
          position="bottom"
          :style="{ height: '30%' }"
          closeable
          @click-overlay="onClickClose"
          @click-close-icon="onClickClose"
        >
          <div class="flex flex-col items-center justify-center h-full">
            <div id="myAudio" class="w-full flex justify-center">
              <audio
                v-show="currentAudio"
                :src="currentAudio"
                ref="audioElement"
                controls="true"
              ></audio>
            </div>
            <van-button
              type="primary"
              @click="recOpen"
              v-if="!startRec"
              style="margin-top: 20px"
              >开始录音</van-button
            >
            <van-button
              type="primary"
              @click="recStop"
              v-if="startRec && !currentAudio"
              style="margin-top: 20px"
              >结束录音</van-button
            >
            <div class="mt-6 flex justify-around items-center w-full">
              <van-button @click="cancelVoice" v-if="startRec && currentAudio"
                >取消</van-button
              >
              <van-button
                type="primary"
                @click="sendVoice"
                v-if="startRec && currentAudio"
                >发送</van-button
              >
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, nextTick, onMounted } from "vue";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
import axios from "axios";
import { getTalkUserInfo } from "@/util/user";
import { sendMessage, getSession } from "@/util/session";
import { showImagePreview } from "vant";
import { io } from "socket.io-client";
const titleText = ref("聊天");
const route = useRoute();
const sessionNo = route.params.id;
const talkNo = route.params.talkNo;
const userNo = Number(localStorage.getItem("userNo"));
const message = ref("");
const showBtns = ref(false);
const showBottom = ref(false);
const rec = ref(null);
const recBlob = ref(null);
const startRec = ref(false);
const showRecBtn = ref(null);
const currentAudio = ref(null);
const contentBodyRef = ref(null);
const data = ref([]);
const talkInfo = ref({});
const userInfo = ref({});
const downloadLinks = new Map();
// const downloadLink = ref(null);
const socket = io.connect("localhost:8800");
const touchStartTime = ref(null);

socket.on("connect", () => {
  console.log("Connected to server");
  socket.on("chat-message", async (re) => {
    console.log("接受数据", re);
    if (re.sessionNo == sessionNo) {
      const res = await getSession(sessionNo);
      console.log(res);
      data.value = res.data;
      console.log(data.value);
      scrollToBottom();
      // 将新消息添加到消息列表
    }
  });
});

onMounted(async () => {
  const res = await getSession(sessionNo);
  data.value = res.data;
  const talkInfoData = await getTalkUserInfo(talkNo);
  talkInfo.value = talkInfoData.data;
  const userInfoData = await getTalkUserInfo(userNo);
  userInfo.value = userInfoData.data;
  console.log(userInfo.value, talkInfo.value);
  titleText.value = talkInfo.value.username;
  scrollToBottom();
});
const handleTouchStart = (event) => {
  touchStartTime.value = event.timeStamp;
  console.log('开始')
};
const handleTouchEnd = (sessionId,event) => {
  const touchEndTime = event.timeStamp;
  const duration = touchEndTime - touchStartTime.value;

  // 判断是否满足长按条件（例如持续时间大于 500ms）
  if (duration > 500) {
    saveImage(sessionId);
  }
};

const saveImage = (sessionId) => {
  // downloadLink.value.click();
  // console.log(downloadLink.value)
  console.log(sessionId)
  const downloadLinkRef = downloadLinks.get(sessionId);
  console.log(downloadLinkRef)
  downloadLinkRef.click()
};
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
const onClickLeft = () => history.back();
const sendSession = async () => {
  const res = await sendMessage({
    sessionNo: sessionNo,
    userNo: userNo,
    talkNo: talkNo,
    talkContent: message.value,
    contentImg: "",
    voice: "",
    talktime: setTime(),
  });
  console.log(res);
  const result = await getSession(sessionNo);
  data.value = result.data;
  message.value = "";
  scrollToBottom();

  socket.emit("chat-message", { sessionNo: sessionNo });
};
const afterRead = async (file) => {
  // 此时可以自行将文件上传至服务器
  console.log(file);
  const formData = new FormData();
  formData.append("image", file.file);
  try {
    const response = await axios.post("http://47.99.134.195:8800/api/upload-image", formData);
    console.log(response.data.imgUrl);
    const res = await sendMessage({
      sessionNo: sessionNo,
      userNo: userNo,
      talkNo: talkNo,
      talkContent: message.value,
      contentImg: response.data.imgUrl,
      voice: "",
      talktime: setTime(),
    });
    console.log(res);
    const result = await getSession(sessionNo);
    data.value = result.data;
    scrollToBottom();
    socket.emit("chat-message", { sessionNo: sessionNo });
    showBottom.value = false;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
const recOpen = () => {
  //创建录音对象
  rec.value = Recorder({
    type: "mp3", //录音格式，可以换成wav等其他格式
    sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
    bitRate: 16, //录音的比特率，越大音质越好
  });

  //打开录音，获得权限
  rec.value.open(
    () => {
      console.log("录音已打开");
      recStart();
    },
    (msg, isUserNotAllow) => {
      //用户拒绝了录音权限，或者浏览器不支持录音
      console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
    }
  );
};
const recStart = () => {
  if (!rec.value) {
    console.error("未打开录音");
    return;
  }
  rec.value.start();
  console.log("已开始录音");
  startRec.value = true;
};

const recStop = () => {
  if (!rec.value) {
    console.error("未打开录音");
    return;
  }
  rec.value.stop(
    (blob, duration) => {
      //blob就是我们要的录音文件对象，可以上传，或者本地播放
      recBlob.value = blob;
      //简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      let localUrl = (window.URL || webkitURL).createObjectURL(blob);
      console.log("录音成功", blob, localUrl, "时长:" + duration + "ms");

      // this.upload(blob);//把blob文件上传到服务器
      showRecBtn.value = true;
      currentAudio.value = localUrl;
      console.log(currentAudio);
      // rec.value.close();//关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      // rec.value=null;
    },
    (err) => {
      console.error("结束录音出错：" + err);
      rec.value.close(); //关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec.value = null;
    }
  );
};
const onClickClose = () => {
  startRec.value = false;
  showRecBtn.value = null;
  currentAudio.value = null;
  recBlob.value = null;
  rec.value = null;
};
const cancelVoice = () => {
  startRec.value = false;
  showRecBtn.value = null;
  currentAudio.value = null;
  recBlob.value = null;
};
const sendVoice = async () => {
  console.log(recBlob.value);
  const formData = new FormData();
  const fileName = "audio.mp3"; // 指定一个合适的文件名，可根据实际情况动态生成

  formData.append("audio", recBlob.value);
  try {
    const response = await axios.post(
      "http://47.99.134.195:8800/api/upload-audio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data.audioUrl);
    const res = await sendMessage({
      sessionNo: sessionNo,
      userNo: userNo,
      talkNo: talkNo,
      talkContent: message.value,
      contentImg: "",
      voice: response.data.audioUrl,
      talktime: setTime(),
    });
    console.log(res);
    const result = await getSession(sessionNo);
    data.value = result.data;
    scrollToBottom();
    socket.emit("chat-message", { sessionNo: sessionNo });
    showBottom.value = false;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};
const previewImg = (imgUrl) => {
  showImagePreview([imgUrl]);
};
const scrollToBottom = () => {
  nextTick(() => {
    // 使用ref绑定的元素
    if (contentBodyRef.value) {
      contentBodyRef.value.scrollTop = contentBodyRef.value.scrollHeight;
    }
  });
};
const formatCurrentTime = () => {
  const now = new Date();

  // 获取年、月、日、小时和分钟
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const date = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  // 拼接字符串
  const formattedTime = `${year}/${month}/${date} ${hours}:${minutes}`;

  return formattedTime;
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
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
  .content {
    padding-top: 50px;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .content-body {
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
      background: transparent;
    }
  }
}
</style>
