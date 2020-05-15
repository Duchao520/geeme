<template>
  <div class="defHistory">
    <v-head
      :title="'砍成记录'"
      :borderBtm="true"
      :replace="1"
      @replaceEvent="closeWebView"
      @callBackEvent="callBack"
      ref="head"></v-head>
    <type-select ref="typeSelect"
                 @search="search"></type-select>
    <!--待开发-->
    <!--<ul class="menu box_padding flex_box justify_space_between fz-30">
      <li class="menu-item active">线上砍价</li>
      <li class="menu-item">线下砍价</li>
    </ul>-->
    <order-list :tokenPromise="tokenPromise"
                ref="orderList"
                @toast="toast"></order-list>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head';
  import orderList from './order-list'
  import typeSelect from './type-select'
  import {callAppMethod ,getFrompage ,closeWebView} from "@/assets/js/jsBridge";


  export default {
    name: "defHistory",
    props: ['tokenPromise'],
    components: {
      vHead,
      orderList,
      typeSelect
    },
    data(){
      return{
        tip: ''
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted(){
      this.init();
    },
    methods: {
      closeWebView(){
        closeWebView();
      },
      init(){
        var _self = this;
        _self.$refs.head.showRight(2);
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      callBack(){
        this.$refs.typeSelect.cutSelect();
      },
      search(isUse,beginTime,endTime){

        this.$refs.orderList.search(isUse,beginTime,endTime)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .defHistory{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .menu{
      width: 100%;
      padding: 0 1.29rem;
      .menu-item{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .menu-item::after{
        content: '';
        display: block;
        width: 1.5rem;
        height: .05rem;
        border-radius: .03rem;
        margin-top: .22rem;
      }
      .active{
        color: #F7094D;
      }
      .active::after{
        background: #F7094D;
      }
    }
  }
</style>
