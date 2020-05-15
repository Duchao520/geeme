<template>
  <!--弹出层-->
  <div class="sha_mask" v-show="shareIsShow" @click="hide">
    <div class="sha_bot">
      <div class="sha_bot_top">
        <div class="sha_bot_inner">
          <div class="eve_inner" @click.stop>
            <button class="eve_img" open-type="share" style="background:#4AB218;" @click="hide">
              <i class="iconfont icon-wechat" style="font-size: 60rpx;"></i>
            </button>
            <div class="eve_tit">
              分享给好友
            </div>
          </div>

          <div class="eve_inner" @click.stop="createPoster">
            <div class="eve_img" style="background:#00A0E9;">
              <i class="iconfont icon-zhaopian-cuxiantiao-fill"></i>
            </div>
            <div class="eve_tit">
              生成海报
            </div>
          </div>
        </div>
      </div>
      <div class="sha_bot_bot" @click="hide">
        取消
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "vShare",
    data(){
      return{
        shareIsShow: 0
      }
    },
    methods: {
      show(){
        this.shareIsShow = 1;
      },
      hide(){
        this.shareIsShow = 0;
      },
      createPoster(){
        var _self = this;
        _self.hide();
        _self.$emit('createPoster');
      }
    },
    onUnload(){
      this.shareIsShow = 0;
    }
  }
</script>

<style lang="scss" scoped>
  .sha_mask{
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.2);
    position: fixed;
    left:0;
    top:0;
    z-index: 999;
    .sha_bot{
      position: absolute;
      width:100%;
      bottom:0;
      left:0;
      height:334rpx;
      background:#fff;
      border-radius:20rpx 20rpx 0 0;
      .sha_bot_top{
        width:100%;
        height:232rpx;
        border-bottom:2rpx solid rgba(229,229,229,1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius:20rpx 20rpx 0 0;
        .sha_bot_inner{
          width:630rpx;
          height:233rpx;
          display: flex;
          align-items: center;
          .eve_inner{
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-right: 24rpx;
            .eve_img{
              width:100rpx;
              height:100rpx;
              border-radius: 50%;
              margin-bottom:30rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              i{
                color:#fff;
                font-size: 48rpx;
              }
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
            .eve_tit{
              font-size: 24rpx;
              color:#8D8E98;
            }
          }
        }
      }
      .sha_bot_bot{
        width:100%;
        height:98rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#8D8E98;
        font-size: 36rpx;
      }
    }
  }
</style>
