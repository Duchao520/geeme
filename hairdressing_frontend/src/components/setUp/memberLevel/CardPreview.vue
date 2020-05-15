<template>
  <div class="banner-image" :style="{
    backgroundImage: `url(${backgroundImage})`
  }">
    <div class="info">
      <img src="@/assets/images/20190806173036.png" alt="">
      <div class="text">
        <p class="name">妞妞和小猪</p>
        <div class="grow">
          <p>成长值</p>
          <p>59845</p>
        </div>
      </div>
    </div>
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
    width: 270px;
    height: 150px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    color: #fff;

    .info {
      display: flex;

      img {
        flex: 0 0 40px;
        height: 40px;
        display: inline-block;
        margin-right: 7px;
      }

      .text {
        .name {
          @include font-style(22px, 16px);
          margin-bottom: 3px;
        }

        .grow {
          display: flex;

          p:nth-child(1) {
            width: 42px;
            height: 17px;
            border-radius: 9px;
            @include font-style(17px, 10px);
            background-color: rgba(255, 255, 255, 1);
            color: #333;
            font-size: 10px;
            text-align: center;
            margin-right: 4px;
          }

          p:nth-child(2) {
            @include font-style(17px, 14px);
          }
        }
      }
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
