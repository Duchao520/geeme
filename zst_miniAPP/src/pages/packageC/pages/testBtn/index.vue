<template>
  <div class="active-list">
    <div class="bottomMiddleHeaderItem" :animation="animation">
    <!-- 心跳 -->
    <div class="bottomMiddleHeaderItemSubView" style="width:100%;display: flex;justify-content: center;align-items: center">
      <button  style="width:600rpx; height:100rpx;margin-left:75rpx;background:#ff6700;border-radius: 20rpx" :animation="animation">喊我开团</button>
    </div>

    <!-- 投票文字 -->
    <div  class="bottomMiddleHeaderItemSubView">投票</div>
  </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  export default {
  data(){
    return {
      animation:''
    }
  },
  mounted() {
    var circleCount = 0;
    // 心跳的外框动画
    var _this = this;
     var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    console.log(animation);
    this.animation = animation;
    setInterval(function () {
      if (circleCount % 2 == 0) {
        animation.scale(1.15).step();
      } else {
        animation.scale(1.0).step();
      }
      this.animation = animation.export();
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(_this), 1000);
  }
  }
</script>

<style lang="scss" scoped>
  .active-list{
     width:710rpx;
     padding:20rpx 20rpx;
     font-size: 30rpx;
  }
</style>
