<template>
  <div class="banner-image" :style="{
    backgroundImage: `url(${backgroundImage})`
  }">
    <div class="info">
      <img src="@/assets/images/20190806173036.png" alt="">
      <div class="text">
        <p class="name">
          <span>妞妞和小猪</span>
          <img src="@/assets/images/icon_male_white.png" alt="">
        </p>
        <div class="grow">
          会员号：08123983
        </div>
      </div>
    </div>
    <p class="integral">积分 10180</p>
    <div class="icon-box">
      <i class="icon iconfont icon-icon_diamond"></i>
      <span :title="previewInfo.levelName">{{previewInfo.levelName}}</span>
    </div>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";

  export default {
    props: {
      previewInfo: Object
    },
    computed: {
      backgroundImage() {

        return this.previewInfo.image ? utils.formatPicImg(this.previewInfo.image) : ""
      }
    }
  }
</script>
<style lang="scss" scoped>
  @mixin font-style($lh,$fs) {
    line-height: $lh;
    font-size: $fs;
  }
  .banner-image {
    width: 343px;
    height: 128px;
    border-radius: 8px 8px 0 0;
    background-color: #FFFFFF;
    background-size: cover;
    background-position: center;
    box-sizing: border-box;
    padding: 20px;
    color: #ffffff;
    position: relative;
    .info {
      display: flex;

      img {
        flex: 0 0 60px;
        height: 60px;
        display: inline-block;
        margin-right: 7px;
      }

      .text {
        .name {
          @include font-style(25px, 18px);
          margin: 4px 0 5px;
          img{
            width: 12px;
            height: 12px;
            margin-bottom: -2px;
          }
        }
        .grow{
          @include font-style(17px, 12px);
        }

      }
    }
    .integral{
      @include font-style(4 7px, 12px);
    }
    .icon-box {
      position: absolute;
      right: 0;
      bottom: 16px;
      width: 90px;
      height: 26px;
      background: linear-gradient(to right, #FFE19F, #F8CC74, #EDBB47);
      @include font-style(26px, 13px);
      border-radius: 13px 0 0 13px;
      white-space: nowrap;
      .icon{
        margin: 0 1px 0 13px;
        font-size: 13px;
      }
    }
  }
</style>
