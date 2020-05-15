<template>
  <div class="keyboard" v-if="isShow">
    <div class="key_container">
      <div class="key" v-for="(item,index) in numList" :class="{'touch':item.touch}" :key="index" @touchstart="touchStart(index)" @touchend="touchEnd(index)" @click.stop="keyDown(item.num)">{{item.num}}</div>
      <div class="key iconfont icon-iconset0282" :class="{'touch':closeIcoTouch}" @touchstart="anoterTouchStart(1)" @touchend="anoterTouchEnd(1)" @click.stop="closeKeyboard"></div>
    </div>
    <div class="right">
      <div class="back iconfont icon-backspaceoutline" :class="{'touch':backIcoTouch}" @touchstart="anoterTouchStart(2)" @touchend="anoterTouchEnd(2)" @click.stop="backSpace"></div>
      <div class="submit" :class="{'touch':submitTouch}" @touchstart="anoterTouchStart(3)" @touchend="anoterTouchEnd(3)" @click.stop="submit">确定</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "keyboardNum",
    props: ['keyboardStatus'],
    data(){
      return{
        isShow: false,
        numList: [
          {num: '1',touch:0}, {num: '2',touch:0}, {num: '3',touch:0}, {num: '4',touch:0}, {num: '5',touch:0}, {num: '6',touch:0},
          {num: '7',touch:0}, {num: '8',touch:0}, {num: '9',touch:0}, {num: '.',touch:0}, {num: '0',touch:0}
        ],
        closeIcoTouch: 0,
        backIcoTouch: 0,
        submitTouch: 0
      }
    },
    methods: {
      keyDown(num){
        var _self = this;
        _self.$emit("keyDownEvent",num)
      },
      backSpace(){
        var _self = this;
        _self.$emit("backSpaceEvent")
      },
      closeKeyboard(){
        var _self = this;
        _self.isShow = false;
        _self.$emit("closeKeyboardEvent")
      },
      submit(){
        var _self = this;
        _self.$emit("submitEvent");
        _self.closeKeyboard();
      },
      isShowKeyboard(status){
        var _self = this;
        _self.isShow = status;
      },
      touchStart(index){
        var _self = this;
        _self.numList[index].touch = 1;
      },
      touchEnd(index){
        var _self = this;
        _self.numList[index].touch = 0;
      },
      anoterTouchStart(state){
        if(state == 1){
          this.closeIcoTouch = 1;
        }else if(state == 2){
          this.backIcoTouch = 1;
        }else if(state == 3){
          this.submitTouch = 1;
        }
      },
      anoterTouchEnd(state){
        if(state == 1){
          this.closeIcoTouch = 0;
        }else if(state == 2){
          this.backIcoTouch = 0;
        }else if(state == 3){
          this.submitTouch = 0;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .slide_down_up-enter-active{
    animation: slideInUp .2s;
  }
  .slide_down_up-leave-active{
    animation: slideOutDown .2s;
  }

  .keyboard {
    width: 100%;
    height: 458rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    background: #FFFFFF;
    display: flex;
    -webkit-user-select: none;
    user-select: none;
    .key_container{
      width: 565rpx;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .key{
        width: 188rpx;
        height: 115rpx;
        border:1rpx solid rgba(221, 221, 221, 1);
        font-size: 60rpx;
        color: #0D0D0F;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .touch{
        background: rgba(12,12,12,.3);
      }
    }
    .right{
      width: 185rpx;
      height: 100%;
      .back{
        width: 100%;
        height: 50%;
        font-size: 37rpx;
        color: #343C53;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1rpx solid rgba(221, 221, 221, 1);
      }
      .submit{
        width: 100%;
        height: 50%;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 38rpx;
        font-weight: bold;
        background: #FF4F81;
      }
      .touch{
        background: rgba(12,12,12,.3);
      }
    }
  }
</style>
