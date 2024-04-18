<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="个人信息编辑" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content">
      <div class="flex items-center justify-center ml-[-40px]">
        <div class="text-center h-8 mr-4 text-[#333333] text-xl font-bold">头像:</div>
        <van-uploader
          v-model="fileList"
          multiple
          accept=".jpg, .jpeg, .png"
          :max-count="1"
          :deletable="false"
          :reupload="true"
        />
        <!-- <img class="w-[140px] h-[140px] rounded-full"  src="https://img0.baidu.com/it/u=571315025,2356538170&fm=253&fmt=auto&app=120&f=JPEG?w=509&h=500"/> -->
      </div>
      <div class="flex items-center justify-center">
        <div class="rounded-md bg-white p-1 mt-12 w-4/5">
          <van-form @submit="onSubmit">
            <van-cell-group inset>
              <van-field
                v-model="username"
                name="username"
                label="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
                placeholder="请输入用户名"
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
              <van-field name="mbit" label="MBIT">
                <template #input>
                  <van-radio-group v-model="mbit" direction="horizontal">
                    <van-radio name="I">I</van-radio>
                    <van-radio name="E">E</van-radio>
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
                v-model="height"
                type="number"
                label="身高"
                name="height"
                placeholder="请输入身高(cm)"
              />
              <van-field
                v-model="star"
                is-link
                readonly
                name="star"
                label="星座"
                placeholder="点击选择星族"
                @click="showPicker = true"
              />
              <van-popup v-model:show="showPicker" position="bottom">
                <van-picker
                  :columns="starList"
                  @confirm="onConfirm"
                  @cancel="showPicker = false"
                />
              </van-popup>
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
              <van-field
                v-model="message"
                rows="2"
                autosize
                label="留言"
                type="textarea"
                maxlength="50"
                name="message"
                placeholder="请输入介绍"
                show-word-limit
              />
            </van-cell-group>
            <div style="margin: 6px">
              <van-button round block type="primary" native-type="submit">
                保存
              </van-button>
            </div>
          </van-form>
        </div>
      </div>

      <!-- <div class="footer-btn flex items-center justify-center mt-4">
                <van-button class="w-[100px] text-xl rounded-lg" type="primary" @click="onClickSave">保存</van-button>
            </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { areaList } from "@vant/area-data";
import { getUser, updateUser } from "@/util/user";
import axios from "axios";
import { showSuccessToast, showFailToast } from "vant";
const username = ref("");
const sex = ref("");
const age = ref(null);
const height = ref(null);
const mbit = ref("");
const star = ref("");
const message = ref("");
const showPicker = ref(false);
const userInfo = ref(null);
const fileList = ref([]);
const userNo = localStorage.getItem("userNo");
const starList = [
  { text: "白羊座", value: "白羊座" },
  { text: "金牛座", value: "金牛座" },
  { text: "双子座", value: "双子座" },
  { text: "巨蟹座", value: "巨蟹座" },
  { text: "狮子座", value: "狮子座" },
  { text: "处女座", value: "处女座" },
  { text: "天秤座", value: "天秤座" },
  { text: "天蝎座", value: "天蝎座" },
  { text: "射手座", value: "射手座" },
  { text: "摩羯座", value: "摩羯座" },
  { text: "水瓶座", value: "水瓶座" },
  { text: "双鱼座", value: "双鱼座" },
];
onMounted(async () => {
  const data = await getUser(userNo);
  const res =data.data
  userInfo.value = res;
  username.value = res.username;
  sex.value = res.sex;
  age.value = res.age;
  height.value = res.height;
  mbit.value = res.mbit;
  star.value = res.star;
  area.value = res.area;
  message.value = res.message;
  if (res.avatorImg) {
    fileList.value[0] = { url: res.avatorImg };
  }
});
const area = ref("");
const showArea = ref(false);
const onConfirmArea = ({ selectedOptions }) => {
  showArea.value = false;
  area.value = selectedOptions.map((item) => item.text).join("-");
};
const onConfirm = ({ selectedOptions }) => {
  star.value = selectedOptions[0]?.text;
  showPicker.value = false;
};
const onClickLeft = () => history.back();
const onSubmit = async (values) => {
  console.log("submit", values);
  let imgUrl = "";
  if (fileList.value.length !== 0 && fileList.value[0]?.file) {
    const formData = new FormData();
    formData.append("image", fileList.value[0].file);
    try {
      const response = await axios.post(
        "http://47.99.134.195/api/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      imgUrl = response.data.imgUrl;
      fileList.value[0] = { url: imgUrl };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  } else {
    if (!fileList.value[0]?.file && fileList.value.length === 0) {
      fileList.value[0] = {
        url:
          "http://smart-love.oss-cn-hangzhou.aliyuncs.com/2d34d081-38ca-40cc-87d7-9cf7ee7859c3-595f67c3a6eb1_610.jpg",
      };
      imgUrl =
        "http://smart-love.oss-cn-hangzhou.aliyuncs.com/2d34d081-38ca-40cc-87d7-9cf7ee7859c3-595f67c3a6eb1_610.jpg";
    } else {
      imgUrl = fileList.value[0].url;
    }
  }
  const obj = { ...values, avatorImg: imgUrl, userNo: userNo };
  const res = await updateUser(obj);
  console.log(res);
  if (res.code == 200) {
    showSuccessToast("修改成功");
  } else {
    showFailToast("修改失败");
  }
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  
  position: relative;
  background: linear-gradient(to bottom, pink, #ffffff);
 
  .content {
    box-sizing:border-box;
    height:100vh;
    padding-top:60px;
    margin-bottom:20px;
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
