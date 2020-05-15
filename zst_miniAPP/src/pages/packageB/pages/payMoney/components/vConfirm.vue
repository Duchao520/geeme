<template>
  <div class="vConfirm" v-if="isShow">
    <div class="confirm">
      <img src="/static/img/close.png" alt="" class="close" @click="close">
      <p class="text-center fz-38 font-weight" style="margin-bottom: 58rpx">{{confirmTitle}}</p>
      <p class="fz-38 text-center" style="margin-bottom: 78rpx">{{confirmDesc}}</p>
      <div class="flex_box justify_space_between">
        <button class="btn_radius fz-36 fc-ffffff bg-FEB623 btn_block" @click="close">取消</button>
        <button class="btn_radius fz-36 fc-ffffff bg-F7094D btn_block" @click="PassEvent">{{confirmSubmit}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "vConfirm",
    props: ['confirmTitle','confirmDesc','confirmSubmit'],
    data(){
      return{
        isShow: false
      }
    },
    methods: {
      close(){
        this.isShow = false;
      },
      PassEvent(){
        this.$emit('PassEvent')
        this.close();
      },
      showConfirm(){
        this.isShow = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vConfirm{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12,12,12,.5);
    z-index: 50;
    .confirm{
      width: 600rpx;
      border-radius: 20rpx;
      background: #FFFFFF;
      position: absolute;
      top: 500rpx;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
      padding: 62rpx 28rpx 43rpx;
      .close{
        display: block;
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        top: -84rpx;
        right: -28rpx;
      }
      .btn_block{
        display: block;
        width: 250rpx;
        height: 80rpx;
      }
    }
  }
</style>
