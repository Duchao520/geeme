<template>
  <div class="vMarquee" ref="marquee" @touchstart="touchStart" @touchmove="touchmove" @touchend="touchfinish">
    <div class="marquee-container" ref="marquee_con" :style="{transform: 'translateX(' + distance + 'px)'}">
      <div class="thumb" v-for="(item,index) in imgs" v-show="item" @click="postIndex(index)">
        <img v-lazy="item + '!243x180'" alt="">
      </div>
      <div class="thumb" v-for="(item,index) in imgs" v-if="imgs.length == 1" @click="postIndex(index)">
        <img v-lazy="item + '!243x180'" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import album from '@/components/common/album'
  export default {
    name: "vMarquee",
    props: ['imgs'],
    components: {
      album
    },
    data(){
      return{
        marquee_width: '',
        marquee_con_width: '',
        distance: 0,
        touch_dis: '',
        touch_start_x: '',    //touch开始横坐标
        touch_finish_x: '',    //touch结束横坐标
        timer: '',
        v: -0.5,    //移动速度,
      }
    },
    methods: {
      move(){
        var _self = this;
        /*超过容器方能运动*/
        if(_self.marquee_con_width>_self.marquee_width){
          _self.timer = setInterval(function () {
            _self.distance = _self.distance + _self.v;
            // 超过临界值则反向运动
            if (_self.distance < _self.marquee_width - _self.marquee_con_width) {
              _self.v = -1 * _self.v;
            }else if(_self.distance > 0){
              _self.v = -1 * _self.v;
            }
          }, 20)
        }
      },
      init(){
        var _self = this;
        /*计算容器宽度*/
        _self.marquee_width = _self.$refs.marquee.clientWidth;
        _self.marquee_con_width = _self.$refs.marquee_con.clientWidth;
      },
      touchmove(e){
        var _self = this;
        if(_self.marquee_con_width>_self.marquee_width){
          _self.touch_finish_x = e.changedTouches[0].clientX;
          var dx = _self.touch_finish_x - _self.touch_start_x;
          /*往那边滑往那边滚*/
          if(dx > 0){
            _self.v = 0.5
          }else{
            _self.v = -0.5
          }
          _self.distance = _self.distance + dx;
          if(_self.distance<_self.marquee_width - _self.marquee_con_width){
            _self.distance = _self.marquee_width - _self.marquee_con_width;
          }else if(_self.distance > 0){
            _self.distance = 0;
          }
          _self._self.touch_start_x = _self.touch_finish_x;
        }

      },
      touchStart(e){
        var _self = this;
        /*获取touch开始位置*/
        if(_self.marquee_con_width>_self.marquee_width){
          clearInterval(_self.timer);
          _self.touch_start_x = e.changedTouches[0].clientX;
        }

      },
      touchfinish(){
        var _self = this;
        if(_self.marquee_con_width>_self.marquee_width){
          this.move()
        }
      },
      postIndex(index){
        var _self = this;
        _self.$emit('postIndex',index);
      }
    },
    mounted() {
      setTimeout(()=>{
        this.move()
      },200)
    },
    updated() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .vMarquee {
    width: 100%;
    overflow: hidden;
    .justify_content{
      justify-content: space-between;
    }
    .marquee-container{
      float: left;
      display: flex;
      .thumb {
        width: 3rem;
        height: 2.22rem;
        margin-right: .1rem;
        overflow: hidden;
        border-radius: .1rem;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .thumb:last-child{
        margin-right: 0;
      }
      .the_one{
        width: 100%;
        img{
          display: block;
          width: 100%;
          /*height: 100%;*/
        }
      }
    }
  }
</style>
