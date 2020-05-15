<template>
  <div class="cardFriendsIndex">
    <v-head :title="'卡友帮'"
            :borderBtm="true"
            :replace="1"
            @replaceEvent="closeWebView"></v-head>
    <div class="scroll" ref="myScroll" :style="{top: status_bar_height + 1.14 + 'rem'}">
      <div class="scroll-container">
        <div class="flex_box justify_space_between align_center fc-ffffff mine">
          <router-link :to="{name: 'activeBargain'}"
                       tag="p"
                       class="fz-30 font-weight flex_box align_center">
            可参与的砍价<i class="fz-34 bg-F7094D text-center" style="display:block;min-width: .35rem;height: .35rem;border-radius: 50%;line-height: .35rem">{{Number(count)}}</i><i class="iconfont icon-arrow-right"></i>
          </router-link>
          <div class="flex_box btns flex_box justify_space_between align_center">
            <router-link :to="{name: 'defHistory'}" tag="button" class="fc-ffffff fz-28">砍成记录</router-link>
            <i></i>
            <router-link :to="{name: 'bargainRules'}" tag="button" class="fc-ffffff fz-28">活动规则</router-link>
          </div>
        </div>
        <active-list :tokenPromise="tokenPromise"
                     @toast="toast"
                     @getTotal="getTotal"></active-list>
        <div class="common-list">
          <h4 class="fz-36">周边活动商家</h4>
          <router-link :to="{name: 'sellerDetail',query: {shopStoreId: item.id,distance: item.distance}}"
                       tag="div"
                       class="list-item box_padding bg-FFFFFF flex_box"
                       v-for="(item,index) in storeList"
                       :key="index">
            <img v-lazy="item.storeLogo" alt="" class="thumb">
            <div class="detail flex_box flex_column justify_space_between">
              <div class="fz-30 flex_box justify_space_between" style="height: .8rem">
                <p class="txt-overflow" style="width: 3.61rem">{{item.storeName}}</p>
                <i class="fz-24 fc-8D8E98">{{item.distance}}km</i>
              </div>
              <div class="flex_box justify_space_between" style="align-items: flex-end">
                <div>
                  <p class="fz-30 fc-0D0D0F">参与人数<span class="fz-36 fc-F7094D">{{item.totalNum}}人</span></p>
                </div>
                <p class="fz-30 fc-F7094D">砍价进行中</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head';
  import activeList from './active-list'
  import BScroll from 'better-scroll';
  import {getGPS , callAppMethod , closeWebView , postStatusColor} from "@/assets/js/jsBridge";
  import {bargainList} from "@/assets/js/comm";

  export default {
    name: "cardFriendsIndex",
    props: ['tokenPromise'],
    components: {
      vHead,
      activeList
    },
    data(){
      return{
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : .4,
        scroll: '',
        token: '',
        longitude: '',
        latitude: '',
        pageNum: 0,
        limit: 10,
        storeList: [],
        tip: '',
        count: 0
      }
    },
    created(){
      callAppMethod('17');
      postStatusColor('0');
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        getGPS().then(gps => {
          _self.longitude = gps.LONG;
          _self.latitude = gps.LAT;
          _self.init();
          setTimeout(() => {
            _self.initScroll();
          },200)
        });
      })
    },
    watch: {
      storeList:{
        handler(){
          setTimeout(()=>{
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          },200)
        },
        deep:true
      }
    },
    methods: {
      getTotal(num){
        this.count = num;
      },
      closeWebView(){
        closeWebView();
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.bargainList();
        });
      },
      init(){
        var _self = this;
        _self.bargainList();
      },
      bargainList(){
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: String(_self.token),
          longitude: String(_self.longitude),
          latitude: String(_self.latitude),
          pageNum: String(_self.pageNum),
          limit: String(_self.limit)
        };
        bargainList(_data).then(res => {
          if(res.data.state == 1){
            _self.storeList = _self.storeList.concat(res.data.data);
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll{
    position: absolute;
    top: 1.14rem;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .mine{
    box-sizing: border-box;
    padding: .15rem;
    background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
    .btns{
      width: 3.45rem;
      height: .5rem;
      border-radius: .25rem;
      background: rgba(12,12,12,.5);
      box-sizing: border-box;
      padding: 0 .33rem;
      i{
        display: block;
        width: .02rem;
        height: .33rem;
        background: #FFFFFF;
      }
    }
  }
  .common-list {
    width: 100%;
    box-sizing: border-box;
    padding: .2rem;
    background: #FFFFFF;
    .list-item{
      padding: .23rem .13rem;
      border-bottom: .02rem solid #E5E5E5;
      .thumb{
        display: block;
        width: 2.15rem;
        height: 1.61rem;
        border-radius: .1rem;
        margin-right: .17rem;
      }
      .detail{
        width: 4.6rem;
        height: 1.61rem;
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
  }
</style>
