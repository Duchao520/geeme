<template>
  <div class="recruitStrategy">
    <section class="banner">
      <img src="@/assets/imgs/common/banner_recruit.png" alt="">
    </section>
    <section class="rules">
      <div class="rules-item">
        <div class="left">
          <img src="@/assets/imgs/rules/icon_determine.png" alt="">
        </div>
        <div class="right">点击授权，打开授权页面，进行淘宝应用授权;</div>
      </div>
      <div class="rules-item">
        <div class="left">
          <img src="@/assets/imgs/rules/icon_warning.png" alt="">
        </div>
        <div class="right">
          第二步：授权成功后，由于在淘宝内打
          开“助商通”的授权成功页面，会提示
          警告在“打开外部链接”，该警告非淘
          宝系链接都会提示，请放心打开链接;
        </div>
      </div>
      <div class="rules-item">
        <div class="left">
          <img src="@/assets/imgs/rules/icon_back.png" alt="">
        </div>
        <div class="right">
          第三步：进入授权成功页面，android
          首页可按“返回键”返回助商通，iOS
          手机可点击左上角返回助商通。
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "recruitStrategy",
    data(){
      return{
        web_title: '招募攻略'
      }
    },
    mounted() {
      var _self = this;
      postTitle(_self.web_title);
    }
  }
</script>

<style lang="scss" scoped>
  .recruitStrategy{
    .banner{
      width: 100%;
      height: 3.39rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .rules{
      width: 100%;
      box-sizing: border-box;
      padding: .37rem .45rem;
      .rules-item{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.28rem;
        .left{
          width: .9rem;
          height: .9rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .right{
          width: 5rem;
          color: #281317;
          font-size: .28rem;
          line-height: .48rem;
        }
      }
    }
  }
</style>
