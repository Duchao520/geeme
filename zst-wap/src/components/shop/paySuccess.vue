<template>
  <div class="paySuccess">
    <div class="bg box_padding">
      <div class="flex_box align_center" style="justify-content: center;margin-bottom: .4rem;">
        <img :src="logo" alt="" class="logo">
        <p class="fz-36 fc-ffffff">{{storeName}}</p>
        <i class="iconfont icon-youjiantou fc-ffffff fz-36"></i>
      </div>
      <p class="iconfont icon-renminbi fz-48 fc-ffffff text-center" style="margin-bottom: .12rem">{{actPay}}</p>
      <p class="fz-28 fc-ffffff text-center" style="margin-bottom: .28rem">原价{{$accAdd(Number(actPay),Number(discount))}}元，已优惠{{discount}}元</p>
      <button class="search_btn fz-30 fc-ffffff" style="margin-bottom: .5rem" @click="linkToCode">查看订单</button>
      <div class="award box_padding" style="padding: .48rem;margin-bottom: .5rem">
        <p class="text-center fz-36 font-weight" style="color: #492410">本次消费您还获得了</p>
        <div class="flex_box justify_space_between align_center" style="padding: .35rem 0;border-bottom: .02rem solid #E5E5E5">
          <div class="flex_box align_center">
            <img src="@/assets/imgs/shop/coin_icon.png" alt="" style="display: block;width: .9rem;height: .9rem;margin-right: .22rem">
            <div class="flex_box flex_column">
              <p class="fz-30">获得1次砍价机会</p>
              <p class="fz-24 fc-8D8E98">参与砍价，有机会吃霸王餐</p>
            </div>
          </div>
          <router-link tag="button" :to="{name: 'cardFriendsIndex'}" class="fz-28 fc-F7094D" style="background:rgba(248,32,88,.15);width: 1.4rem;height: .55rem;border-radius: .28rem">去砍价</router-link>
        </div>
      </div>
      <img src="@/assets/imgs/shop/recomm_bus.png" alt="" style="display: block;width: 7rem;height: .29rem;margin: 0 auto">
      <div class="box_padding" style="padding: 0 .24rem">
        <router-link :to="{name: 'sellerDetail',query: {shopStoreId: item.shopStoreId,distance: item.distance}}" tag="div" class="flex_box" style="border-bottom: .02rem solid rgba(52,60,83,.2);padding: .24rem 0"
             v-for="(item,index) in dataList" :key="index">
          <img v-lazy="item.storeLogo" alt=""
               style="display: block;width: 2.15rem;height: 1.6rem;border-radius: .1rem;background: #0d0d0f;margin-right: .12rem">
          <div style="width: 4.86rem">
            <p class="fz-32 txt-ellipsis" style="margin-bottom: .12rem">{{item.storeName}}</p>
            <div class="flex_box justify_space_between" style="margin-bottom: .36rem">
              <p class="txt-ellipsis iconfont icon-dizhi3 fz-24 fc-8D8E98" style="width: 4rem">{{item.address}}</p>
              <p class="fz-24 fc-8D8E98">{{item.distance}}km</p>
            </div>
            <p class="fz-30 fc-F7094D">到店消费最低享{{$accMul(item.shareCardDiscount,10)}}折</p>
          </div>
        </router-link>
      </div>

    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import {storeForBargain} from "@/assets/js/comm";
  import {getGPS,cancelCode , callAppMethod , postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "paySuccess",
    props: ['tokenPromise'],
    data(){
      return{
        token: '',
        lng: '',
        lat: '',
        tip: '',
        dataList: '',
        logo: this.$route.query.storeLogo,
        storeName: this.$route.query.storeName,
        actPay: this.$route.query.actPay,
        discount: this.$route.query.discount,
        orderNum: this.$route.query.orderNum
      }
    },
    mounted(){
      var _self = this;
      postTitle('支付成功');
      callAppMethod('20');
      _self.tokenPromise.then(res => {
        _self.token = res;
        getGPS().then(gps => {
          _self.lng = gps.LONG;
          _self.lat = gps.LAT;
          _self.storeForBargain();
        })
      })
    },
    methods: {
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      linkToCode(){
        cancelCode(this.orderNum);
      },
      storeForBargain(){
        var _self = this;
        var _data = {
          token:String(_self.token),
          longitude:_self.lng,
          latitude:_self.lat,
          pageNum:1,
          limit:10,
        };
        storeForBargain(_data).then(res => {
          if(res.data.state == 1){
            _self.dataList = res.data.data;
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .paySuccess{
    .bg{
      height:4.5rem;
      background:linear-gradient(0deg,rgba(248,17,79,1),rgba(255,110,106,1));
      padding: .56rem 0 1rem;
      .logo{
        display: block;
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
        background: #0d0d0f;
        margin-right: .2rem;
      }
      .search_btn{
        display: block;
        width: 2rem;
        height: .7rem;
        border-radius: .06rem;
        border: .02rem solid #FFFFFF;
        margin: 0 auto;
      }
      .award{
        width: 7rem;
        height: 3rem;
        box-shadow:0 0 .16rem .04rem rgba(92,92,92,0.15);
        border-radius:.2rem;
        margin: 0 auto;
        background: #FFFFFF;
      }
    }
  }
</style>
