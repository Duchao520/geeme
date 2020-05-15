<template>
  <div class="bargain">
    <v-head :title="'砍价免费拿'"
            :borderBtm="true"></v-head>
    <div class="scroll"  ref="scroll" :style="{top: status_bar_height + 1.04 + 'rem'}">
      <div class="scroll-container">
        <div class="bg">
          <div style="width: 5.8rem;margin-bottom: .12rem;height: .4rem">
            <notice :lists="bargainSucList"></notice>
          </div>
          <bargin-goods :tokenPromise="tokenPromise"
                        @alertEvent="alertEvent"
                        @handleGoods="getGoods"
                        @handleBargainDetail="handleBargainDetail"
                        @handleDetail="handleDetail"
                        @showShareBtn="showShareBtn"
                        @toast="toast"></bargin-goods>
          <bargin-list :tokenPromise="tokenPromise"
                       @stopScrollEvent="stopScrollEvent"
                       @startScrollEvent="startScrollEvent"
                       @getBargainSucList="getBargainSucList"
                       @toast="toast"
                       ref="barginList"></bargin-list>
        </div>
        <re-store :tokenPromise="tokenPromise"
                  @refreshDom="refreshDom"
                  @toast="toast"
                  ref="reStore"></re-store>
      </div>
    </div>
    <v-share-cut-free ref="vShareCutFree" @posterEvent="receive" />
    <v-poster ref="vPoster"/>
    <toast-gather ref="toastGather" :tokenPromise="tokenPromise"></toast-gather>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>


</template>

<script>
  import vHead from '@/components/common/v-head'
  import notice from '@/components/common/notice'
  import vShareCutFree from '@/components/cardFriends/bargain/vShareCutFree'
  import vPoster from '@/components/cardFriends/bargain/vPoster'
  import barginGoods from './bargin-goods'
  import barginList from './bargin-list'
  import reStore from './re-store'
  import toastGather from './toast-gather'
  import BScroll from 'better-scroll';
  import {callAppMethod} from "@/assets/js/jsBridge";

  export default {
    name: "bargain",
    props: ['tokenPromise'],
    components: {
      vHead,
      barginGoods,
      barginList,
      reStore,
      toastGather,
      notice,
      vShareCutFree,
      vPoster
    },
    data() {
      return {
        scroll: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : .4,
        tip: '',
        bargainSucList: '',
        detail: ''
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted() {
      this.initScroll();

    },
    methods: {
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['scroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.$refs.reStore.bargainList();
        });
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      /**
       * 阻止父组件中的scroll事件
       */
      stopScrollEvent(){
        this.scroll.disable();
      },
      /**
       * 开启父组件中的scroll事件
       */
      startScrollEvent(){
        this.scroll.enable();
      },
      getGoods(goods){
        this.$refs.toastGather.getGoods(goods);
        this.$refs.barginList.getGoods(goods);
      },
      alertEvent(toast_type1,toast_type2){
        this.$refs.toastGather.show(toast_type1,toast_type2)
      },
      handleBargainDetail(detail){
        this.$refs.toastGather.getBargainDetail(detail);
      },
      getBargainSucList(list){
        this.bargainSucList = list;
      },
      showShareBtn(){
        this.$refs.vShareCutFree.show(1);
      },
      handleDetail(detail){
        this.detail = detail;
      },
      receive(e){
        let _self = this;
        let Check_if_the_method_is_called = 1;
        if(Check_if_the_method_is_called == e){
          _self.$refs.vPoster.show();
          _self.$refs.vPoster.get2D(_self.detail);
        }
      },
      refreshDom(){
        setTimeout(()=>{
          this.scroll.finishPullUp();
          this.scroll.finishPullDown();
          this.scroll.refresh();
        },500)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bargain {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .scroll{
    position: absolute;
    top: 1.04rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    overflow: hidden;
  }
  .bg {
    background: #FEDBE5;
    box-sizing: border-box;
    padding: .2rem;
  }
</style>
