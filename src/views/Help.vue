<template>
    <div class="home">
        <div class="headTitle">
          <van-nav-bar title="帮助" left-arrow @click-left="onClickLeft"/>
        </div>
        <div class="content">
                <h4>用户信息安全声明</h4>
                <ul>
                  <li>本应用秉持开放理念，不对用户信息安全提供官方保证或设立额外约束。</li>
                  <li>我们的目标是营造一个让用户能够自由表达、释放本心的互动空间。</li>
                </ul>
                <p>然而，我们深知网络环境中存在的安全风险，诚挚提醒广大用户：</p>
                <ol>
                  <li>在享受无拘无束的体验时，务必保持对个人信息安全的关注与警惕。</li>
                  <li>妥善保管个人敏感信息，避免在应用内或通过应用与其他用户交流时泄露。</li>
                </ol>
                <p>请注意，您的信息安全保障主要依赖于自身的防范意识与行动。本平台在此领域不承担责任，敬请广大用户在畅所欲言的同时，提高防骗意识，谨防各类网络诈骗行为。</p>
              </div>
    </div>
</template>

<script setup>
const onClickLeft = () => history.back();
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
      width:100vw;
      position: fixed;
      --van-nav-bar-height: 50px;
      --van-nav-bar-icon-color: black;
      --van-nav-bar-title-font-size: 20px;
    }
    .content{
        padding-top:50px;
        padding-left:10px;
        padding-right:10px;
        height: 100vh;
        line-height: 2em;
    }
    .content-body{
     
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
        background: transparent;
      }
    }
  }
</style>