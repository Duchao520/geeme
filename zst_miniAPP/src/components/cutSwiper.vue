<template>
  <swiper class="swiper"
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :circular="circular"
          style="height:750rpx;">
    <block v-for="(item, index) in images" :key="index">
      <swiper-item>
        <img :src="item" class="slide-image" @click="godetail()" mode="aspectFill"/>
      </swiper-item>
    </block>
  </swiper>
</template>

<script>
  export default {
    props: {
      images: {
        type: Array
      }
    },
    data() {
      return {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular:true
      };
    },
    methods:{
      godetail(par){
        if(par.indexOf('tenzhao.com') >= 0){
          console.log(par);
          const url = par;
          // wx.navigateTo({ url })
        }else{
          return false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  img{
    width:100%;
    height:100%;
    display: block;
  }
</style>
