<template>
  <div class="home">
    <div class="headTitle">
      <van-nav-bar title="发布动态" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content">
      <van-cell-group
        inset
        style="
          margin: 0;
          border-radius: 0;
          background: linear-gradient(to bottom, pink, #ffffff);
        "
      >
        <van-field
          style="background: linear-gradient(to bottom, pink, #ffffff)"
          v-model="message"
          :autosize="true"
          label="留言"
          type="textarea"
          placeholder="请输入留言"
          show-word-limit
        />
      </van-cell-group>
      <div>
        <van-uploader
          class="upload"
          accept=".jpg, .jpeg, .png"
          :after-read="uploadImage"
          v-model="fileList"
          multiple
          :max-count="9"
        />
      </div>
      <div class="btn flex items-center justify-center my-4">
        <van-button class="w-[180px]" type="primary" @click="publish">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { addAction } from "@/util/action";
import { showSuccessToast, showFailToast } from "vant";
const message = ref("");
const fileList = ref([]);
const uploadFileList = ref([]);
const fileStr = ref("");
const currentUserNo = Number(localStorage.getItem("userNo"));
const onClickLeft = () => history.back();
import axios from "axios";

async function uploadImage(imageFile) {
  console.log("imageFile", imageFile);
  console.log(fileList.value);
  // const formData = new FormData();
  // formData.append("image", imageFile.file);
  // console.log("formData", formData);
  // try {
  //   const res = await axios.post("http://47.99.134.195:8800/api/upload-image", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   // console.log(res.data.imgUrl);
  //   // if (res.data.imgUrl) {
  //   //   fileStr.value = fileStr.value
  //   //     ? fileStr.value + "," + res.data.imgUrl
  //   //     : res.data.imgUrl;
  //   // }
  // } catch (error) {
  //   console.error("Error uploading image:", error);
  //   throw error;
  // }
}

const deleteImg = (imageFile) => {
  console.log("delete imageFile", imageFile);
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
const publish = async () => {
  const uniqueId = uuidv4();
  console.log(uniqueId);
  const time = setTime();
  // console.log(time, fileStr);
  if (!message.value && fileList.value.length == 0) {
    return;
  }
  if (fileList.value.length > 0) {
    const uploadPromises = fileList.value.map(async (item) => {
      const formData = new FormData();
      formData.append("image", item.file);

      try {
        const result = await axios.post(
          "http://47.99.134.195:8800/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(result.data.imgUrl);

        if (result.data.imgUrl) {
          return result; // 返回成功的上传结果
        }

        return null; // 或者返回特定值表示上传失败，根据实际需求调整
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    });

    // 等待所有上传完成
    const uploadResults = await Promise.all(uploadPromises);

    // 过滤掉上传失败或无效的结果，仅保留有效图片数据
    const validResults = uploadResults.filter((result) => result && result.data.imgUrl);

    // 更新 uploadFileList 和 fileStr
    uploadFileList.value = validResults;
    fileStr.value = validResults.map((result) => result.data.imgUrl).join(",");
  }

  console.log(fileStr.value, uploadFileList.value);

  const res = await addAction({
    actionNo: uniqueId,
    content: message.value,
    userNo: currentUserNo,
    imgList: fileStr.value,
    publishtime: time,
  });

  console.log(res);

  if (res.code === 200) {
    showSuccessToast("动态发布成功");
    message.value = "";
    fileStr.value = "";
    uploadFileList.value = [];
    fileList.value = [];
  } else {
    showErrorToast("动态发布失败");
  }
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  position: relative;

  .headTitle {
    width: 100vw;
    position: fixed;
    --van-nav-bar-height: 50px;
    --van-nav-bar-icon-color: black;
    --van-nav-bar-title-font-size: 20px;
    background: white;
    z-index: 1;
  }
  .content {
    padding-top: 50px;
    margin-bottom: 20px;
    box-sizing: border-box;
    height: calc(100vh);
    overflow: auto;
    position: relative;
    &::-webkit-scrollbar {
      width: 0 !important;
      background: transparent;
    }
  }
  --van-uploader-size: 30vw;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.upload {
  margin-top: 10px;
  width: 100vw;
  display: flex;
  justify-content: center;
}
</style>
