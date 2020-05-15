<template>
  <transition name="alertMsg">
    <div class="album" v-show="albumIsShow">
      <swiper :options="swiperOption" class="swiper-container" ref="mySwiper" @click="albumIsShow = false" @slidePrevTransitionStart="touchLeft" @slideNextTransitionStart="touchRight">
        <swiper-slide class="products" v-for="(item,index) in photos" :key="index" v-if="item">
          <img :src="item" alt="">
        </swiper-slide>
      </swiper>
      <p class="index" style="color: #FFFFFF">{{index+1}}/{{photos.length}}</p>
    </div>
  </transition>
</template>

<script>
  import 'swiper/dist/css/swiper.css';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';

  export default {
    props: ['photos'],
    name: "album",
    components: {
      swiper, swiperSlide
    },
    data() {
      return {
        swiperOption: {
        },
        albumIsShow: false,
        index: ''
      }
    },
    methods: {
      init(index){
        var _self = this;

      },
      showAlbum(index) {
        var _self = this;
        this.$nextTick(function () {
          this.$refs.mySwiper.swiper.slideTo(index);
          this.$refs.mySwiper.swiper.initialSlide = index;
          this.index = index;
        });
        _self.albumIsShow = true;
      },
      touchRight(){
        this.index = this.index+1;
      },
      touchLeft(){
        this.index = this.index-1;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .album {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000;
    z-index: 100;
    overflow: hidden;
    .swiper-container{
      width: 100%;
      height: 100%;
      img{
        display: block;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .index{
      color: #FFFFFF;
      font-size: .36rem;
      position: absolute;
      z-index: 101;
      bottom: .25rem;
      width: 100%;
      text-align: center;
    }
  }
</style>
