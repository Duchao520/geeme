<template>
  <transition name="slide_down_up">
    <div class="vShare" v-show="bg">
      <transition name="slide_down_up">
        <footer v-show="isShow == 1">
          <div class="btn-container">
            <div class="btn-group">
              <i class="iconfont icon-weixin"></i>
              <p>分享给好友</p>
              <button @click="share"></button>
            </div>

            <div class="btn-group">
              <i class="iconfont icon-tupian"></i>
              <p>生成海报</p>
              <button @click="poster"></button>
            </div>
          </div>
          <button class="btn_class" @click="close">取消</button>
        </footer>
      </transition>

    </div>
  </transition>
</template>

<script>
  import {callAppMethod} from "@/assets/js/jsBridge";

  export default {
    name: "vShare",
    props: ['barginDetail','tokenPromise' ],
    components: {

    },
    data() {
      return {
        isShow: true,
        bg: false,
        token: ''
      }
    },
    methods: {
      close() {
        var _self = this;
        _self.isShow = false;
        _self.bg = false;
      },
      clear(){
        var _self = this;
        _self.isShow = false;
        _self.bg = false;
      },
      show(type) {
        var _self = this;
        _self.isShow = false;
        _self.bg = true;
        _self.isShow = type;
      },
      poster(){
        var _self = this;
        _self.close();
        _self.$emit('posterEvent','1')
      },
      share(){
        callAppMethod('24');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slide_down_up-enter-active {
    animation: slideInUp .2s;
  }

  .slide_down_up-leave-active {
    animation: slideOutDown .2s;
  }

  .vShare {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12, 12, 12, .5);
    z-index: 100;

    footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      border-radius: .2rem .2rem 0 0;
      background: #FFFFFF;
      .close{
        width: .55rem;
        height: .55rem;
        position: absolute;
        right: .28rem;
        top: -.74rem;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
        button{
          position: absolute;
          top: 0;
          right: 0;
          width: .55rem;
          height: .55rem;
        }
      }
      .btn-container {
        box-sizing: border-box;
        padding: .39rem .62rem;
        display: flex;
        justify-content: space-around;
        border-bottom: .01rem solid #E5E5E5;

        .btn-group {
          position: relative;
          i {
            display: block;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            margin: 0 auto;
            margin-bottom: .15rem;
            font-size: .64rem;
            text-align: center;
            line-height: 1rem;
          }

          img{
            display: block;
            width: .9rem;
            height: .9rem;
            padding: .05rem;
            border-radius: 50%;
            margin: 0 auto;
            margin-bottom: .15rem;
          }

          .icon-weixin {
            background: #4AB218;
            color: #FFFFFF;
          }

          .icon-erweima {
            background: #F60F51;
            color: #FFFFFF;
          }

          .icon-tupian {
            background: #00A0E9;
            color: #FFFFFF;
          }

          p {
            font-size: .24rem;
            color: #8D8E98;
          }
          button{
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
      }

      .btn_class {
        display: block;
        width: 100%;
        height: 1rem;
        font-size: .36rem;
        color: #8D8E98;
      }

    }
    .qrCode{
      height: 8.48rem;
      box-sizing: border-box;
      padding: .41rem .61rem;
      .flex{
        display: flex;
        align-items: center;
        margin-bottom: .96rem;
        img{
          display: block;
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          background: #0e90d2;
          margin-right: .41rem;
        }
        span{
          font-size: .36rem;
        }
      }
      .miniProgram-code{
        display: block;
        width: 4.5rem;
        height: 4.5rem;
        margin: 0 auto;
        background: #0c8deb;
        margin-bottom: .57rem;
      }
      .slogan{
        color: #AF7651;
        font-size: .36rem;
        text-align: center;
      }
    }

    .savePic{
      background: #EEEEEE;
      height: 10.46rem;
      box-sizing: border-box;
      padding-top: .81rem;
      .pic{
        width: 4.27rem;
        height: 7.59rem;
        box-shadow:0 .11rem .35rem 0 rgba(194,194,194,0.41);
        border-radius: .2rem;
        margin: 0 auto;
        background: #FFFFFF;
        margin-bottom: .41rem;
      }
      .btn_save{
        display: block;
        width: 4.71rem;
        height: .91rem;
        border-radius: .07rem;
        background: #F7094D;
        font-size: .41rem;
        color: #FFFFFF;
        margin: 0 auto;
        margin-bottom: .16rem;
      }
      .slogan{
        color: #8D8E98;
        font-size: .3rem;
        text-align: center;
      }
    }
  }
</style>
