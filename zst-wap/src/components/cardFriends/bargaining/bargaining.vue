<template>
  <div class="bargaining">
    <v-head :title="'我正在砍价的'" :borderBtm="true"></v-head>
    <div class="box_padding" style="padding: .32rem .19rem;background: #FEDBE5;">
      <div class="list-item box_padding bg-FFFFFF"
           style="margin-bottom: .35rem"
           v-for="(item,index) in list" :key="index">
        <p class="fz-30 flex_box align_center" style="margin-bottom: .28rem">
          <i class="iconfont icon-shangjia fz-42" style="color: #FA336C"></i>{{item.storeName}}提供
        </p>
        <div class="flex_box">
          <img v-lazy="item.bargainImg" alt="" class="thumb">
          <div class="detail flex_box flex_column justify_space_between">
            <p class="fz-30 txt-overflow" style="margin-bottom: .28rem">{{item.bargainTitle}}</p>
            <div class="flex_box justify_space_between align_center">
              <p class="fz-30 fc-8D8E98">已砍<span class="fc-F7094D">{{$accMul(item.helpedPrice,1)}}元</span></p>
              <router-link :to="{name: 'bargain',query:{status: 1,bargainTasksId: item.id,bargainId: item.bargainId}}" tag="button" class="btn_radius fz-34 fc-ffffff">继续砍价</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head';
  import {bargainingList} from "@/assets/js/comm";
  import {callAppMethod} from "@/assets/js/jsBridge";

  export default {
    name: "bargaining",
    props: ['tokenPromise'],
    components: {
      vHead,
    },
    data(){
      return{
        token: '',
        list: ''
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    },
    methods: {
      init(){
        var _self = this;
        _self.bargainingList();
      },
      bargainingList(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          ingNum: ''
        };
        bargainingList(_data).then(res => {
          if(res.data.state == 1){
            _self.list = res.data.data;
          }else{
            _self.$emit('toast',decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-item{
    padding: .23rem .13rem;
    border-radius: .1rem;
    box-shadow:0 .01rem .32rem .06rem rgba(254, 171, 193, 1);
    .thumb{
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: .1rem;
      margin-right: .17rem;
    }
    .detail{
      width: 4.6rem;
      height: 2rem;
      .time{
        display: block;
        width: .4rem;
        height: .4rem;
        border-radius: .1rem;
        background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
      }
      button{
        display: block;
        width: 1.8rem;
        height: .75rem;
        background: #FA336C;
      }
    }
  }
</style>
