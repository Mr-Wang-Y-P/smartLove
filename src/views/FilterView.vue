<template>
  <div>
    <div class="header">
      <van-nav-bar title="推荐偏好" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content">
      <div class="content-title">
        <div class="content-icon"></div>
        <span class="content-text">普通筛选</span>
      </div>
      <h3 class="mt-2">推荐地区</h3>
      <div class="area-btns">
        <div class="areas" v-for="(item, index) in selectAreaList" :key="index">
          <div class="area_btn">
            {{ item }}
            <van-icon
              name="cross"
              style="position: absolute; right: -6px; top: -6px"
              @click="deleteSelectCity"
            />
          </div>
        </div>
        <div class="icon_plus" @click="showPopup">
          <van-icon color="#ccc" name="plus" />
        </div>
      </div>
      <div class="filter-area" style="margin-bottom: 20px">
        <div class="filter-area__text">
          <span class="filter-area__text-title">性别</span>
        </div>
        <van-checkbox-group v-model="sexChecked" direction="horizontal" shape="square">
          <van-checkbox name="man">男</van-checkbox>
          <van-checkbox name="woman">女</van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="content-title">
        <div class="content-icon"></div>
        <span class="content-text">高级筛选</span>
      </div>
      <div class="filter-areas">
        <div class="filter-area">
          <div class="filter-area__text">
            <span class="filter-area__text-title">年龄</span>
            <span class="selectValueText">{{ ages[0] }}-{{ ages[1] }}</span>
          </div>
          <van-slider bar-height="3px" active-color="pink" v-model="ages" range />
        </div>
        <div class="filter-area">
          <div class="filter-area__text">
            <span class="filter-area__text-title">身高</span>
            <span class="selectValueText">{{ heights[0] }}-{{ heights[1] }}</span>
          </div>
          <van-slider
            min="130"
            max="250"
            bar-height="3px"
            active-color="pink"
            v-model="heights"
            range
          />
        </div>
        <div class="filter-area">
          <div class="filter-area__text">
            <span class="filter-area__text-title">MBIT</span>
          </div>
          <van-checkbox-group v-model="mbitChecked" direction="horizontal" shape="square">
            <van-checkbox name="I">I人</van-checkbox>
            <van-checkbox name="E">E人</van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="filter-area">
          <div class="filter-area__text">
            <span class="filter-area__text-title">星座</span>
          </div>
          <van-checkbox-group
            v-model="checkedConstellations"
            direction="horizontal"
            shape="square"
            class="checkbox-group"
          >
            <van-checkbox
              class="constellationsBox"
              v-for="(constellation, index) in constellations"
              :key="index"
              :name="constellation.name"
              >{{ constellation.name }}</van-checkbox
            >
          </van-checkbox-group>
        </div>
      </div>
      <div class="footer-btn">
        <van-button class="btn" type="primary" @click="saveFilter">保存</van-button>
      </div>
      <van-popup v-model:show="showArea" position="bottom" :style="{ height: '50%' }">
        <van-area
          @confirm="ConfirmCity"
          @cancel="showArea = false"
          ref="areaRef"
          v-model="selectCity"
          title="地区"
          :area-list="areaList"
          :columns-num="2"
        />
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { areaList } from "@vant/area-data";
import { ref, onMounted } from "vue";
import { getUser, updateFilter } from "@/util/user";
import { showSuccessToast, showFailToast } from "vant";
const areaRef = ref(null);
const showArea = ref(false);
const selectCity = ref("");
const sexChecked = ref([]);
const selectAreaList = ref([]);
const ages = ref([15, 30]);
const heights = ref([155, 195]);
const mbitChecked = ref([]);
const checkedConstellations = ref([]);
const userNo = Number(localStorage.getItem("userNo"));
onMounted(async () => {
  const res = await getUser(userNo);
  const getFilterData = JSON.parse(res.data.filter);
  console.log(getFilterData);
  if (getFilterData.area) {
    selectAreaList.value = getFilterData.area.includes(",")
      ? getFilterData.area.split(",")
      : [getFilterData.area];
  }
  if (getFilterData.sex) {
    sexChecked.value = getFilterData.sex.includes(",")
      ? getFilterData.sex.split(",")
      : [getFilterData.sex];
  }
  if (getFilterData.mbit) {
    mbitChecked.value = getFilterData.mbit.includes(",")
      ? getFilterData.mbit.split(",")
      : [getFilterData.mbit];
  }
  if (getFilterData.star) {
    checkedConstellations.value = getFilterData.star.includes(",")
      ? getFilterData.star.split(",")
      : [getFilterData.star];
  }
  if (getFilterData.age) {
    ages.value = getFilterData.age.split(",");
  }
  if (getFilterData.height) {
    heights.value = getFilterData.height.split(",");
  }
});
const constellations = [
  { name: "白羊座" },
  { name: "金牛座" },
  { name: "双子座" },
  { name: "巨蟹座" },
  { name: "狮子座" },
  { name: "处女座" },
  { name: "天秤座" },
  { name: "天蝎座" },
  { name: "射手座" },
  { name: "摩羯座" },
  { name: "水瓶座" },
  { name: "双鱼座" },
];
const onClickLeft = () => history.back();
const showPopup = () => {
  showArea.value = true;
};
const ConfirmCity = (selectedValues) => {
  console.log(selectedValues);
  showArea.value = false;
  if (
    selectAreaList.value.indexOf(
      selectedValues.selectedOptions.map((item) => item.text).join("-")
    ) === -1
  ) {
    selectAreaList.value.push(
      selectedValues.selectedOptions.map((item) => item.text).join("-")
    );
  }
};
const deleteSelectCity = (index) => {
  selectAreaList.value.splice(index, 1);
};
const onChangeAge = (value) => {
  console.log(value);
};
const saveFilter = async () => {
  const filter = {
    area: selectAreaList.value.join(","),
    sex: sexChecked.value.join(","),
    age: ages.value.join(","),
    height: heights.value.join(","),
    mbit: mbitChecked.value.join(","),
    star: checkedConstellations.value.join(","),
  };
  console.log(filter);
  const res = await updateFilter({ filter: filter, userNo: userNo });
  console.log(res);
  if(res.code == 200){
    showSuccessToast(res.message)
  }else{
    showFailToast(res.message)
  }
};
</script>

<style lang="scss" scoped>
.header {
  --van-nav-bar-height: 50px;
  --van-nav-bar-icon-color: black;
  --van-nav-bar-title-font-size: 20px;
}
.content {
  height: calc(100vh - 80px);
  overflow: auto;
  padding: 1em;
  &::-webkit-scrollbar {
    width: 0 !important;
    background: transparent;
  }
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
  .area-btns {
    display: flex;
    flex-wrap: wrap;
    .areas {
      margin: 6px 12px;
      position: relative;
      .area_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        box-sizing: border-box;
        height: 40px;
        color: #000;
        background: #f6f7fb;
        border-radius: 4px;
      }
    }
    .icon_plus {
      width: 70px;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      margin: 6px 12px;
    }
  }
  .sexSelect {
    margin: 1em 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.17em;
    font-weight: 600;
  }
  .filter-areas {
    margin-top: 12px;
    background: #f6f7fb;
    border-radius: 4px;
    padding: 10px;
    .filter-area {
      margin-bottom: 20px;
      .checkbox-group {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 10px;
      }
    }
    .filter-area__text {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .filter-area__text-title {
        font-weight: 600;
        font-size: 20px;
      }
      .selectValueText {
        font-size: 20px;
        color: #ccc;
      }
    }
    .custom-button {
      width: 26px;
      color: #fff;
      font-size: 10px;
      line-height: 18px;
      text-align: center;
      background-color: var(--van-primary-color);
      border-radius: 100px;
    }
  }
  .footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    .btn {
      width: 100px;
      border-radius: 8px;
      font-size: 20px;
    }
  }
}
</style>
