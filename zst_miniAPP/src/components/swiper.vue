<template>
  <swiper class="swiper"
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :circular="circular">
    <block v-for="(item, index) in images" :key="index">

      <swiper-item>
        <img :src="item.imghref" class="slide-image" @click="godetail(item.targethref)" mode="aspectFill" lazy-load/>
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
          const url = par;
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
    border-radius: 20rpx;
    display: block;
  }
</style>
