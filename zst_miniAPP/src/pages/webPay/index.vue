<template>
  <div></div>
</template>

<script>
  import {getSignIn , getQuery} from "@/common/js/comm";
  import Tips from '@/common/js/tips'

  export default {
    name: "index",
    data(){
      return{
        storeId: '',
        trmNo: '',
        mercId: '',
        consumeShopId: '',
        consumeStoreId: '',
        no: '',
        amount: '',
        totalAmount: '',
        shareuserId: '',
        sharecardId: '',
        nonPartakeMoney: '',
        activeNum: '',
        couponId: '',
        isOriginPricePay: '',
        integralCount: '',
        scanSrc: '',
        isShareDiscountCard: ''
      }
    },
    mounted(){
      var _self = this;
      var par = getQuery();
      _self.storeId = par.storeId ? par.storeId : '';
      _self.trmNo = par.trmNo ? par.trmNo : '';
      _self.mercId = par.mercId ? par.mercId : '';
      _self.consumeShopId = par.consumeShopId ? par.consumeShopId : '';
      _self.consumeStoreId = par.consumeStoreId ? par.consumeStoreId : '';
      _self.no = par.no ? par.no : '';
      _self.amount = par.amount ? par.amount : '';
      _self.totalAmount = par.totalAmount ? par.totalAmount : '';
      _self.shareuserId = par.shareuserId ? par.shareuserId : '';
      _self.sharecardId = par.sharecardId ? par.sharecardId : '';
      _self.nonPartakeMoney = par.nonPartakeMoney ? par.nonPartakeMoney : '';
      _self.activeNum = par.activeNum ? par.activeNum : '';
      _self.couponId = par.couponId ? par.couponId : '';
      _self.isOriginPricePay = par.isOriginPricePay ? par.isOriginPricePay : '';
      _self.integralCount = par.integralCount ? par.integralCount : '';
      _self.scanSrc = par.scanSrc ? par.scanSrc : '';
      _self.isShareDiscountCard = par.isShareDiscountCard ? par.isShareDiscountCard : '';
      this.init();
    },
    methods: {
      init(){
        this.pubSigPay();

      },
      pubSigPay(){
        var _this = this;
        var _data = {
          storeId: _this.storeId,
          trmNo: _this.trmNo,
          mercId: _this.mercId,
          consumeShopId: _this.consumeShopId,
          consumeStoreId: _this.consumeStoreId,
          no: _this.no,
          openid: _this.$store.state.openId,
          amount: _this.amount,
          totalAmount: _this.totalAmount,
          subject: encodeURI('香山湖卡主共享卡小程序付款'),
          shareuserId: _this.shareuserId,
          sharecardId: _this.sharecardId,
          userId: _this.$store.state.userLiId,
          miniAppId: 'wx5e11922e81e3951d',
          wxUnionId: _this.$store.state.unionid ? _this.$store.state.unionid : '',
          nonPartakeMoney:_this.nonPartakeMoney,
          activeNum:_this.activeNum ? _this.activeNum :'',
          couponId:_this.couponId ? _this.couponId :'',
          isOriginPricePay:_this.isOriginPricePay,
          integralCount:_this.integralCount,
          isShareDiscountCard:_this.isShareDiscountCard,
          scanSrc:'1',
        }
        getSignIn(_data).then(sec => {
          _this.$http.unifiedpay(_data, sec).then(res => {
            if (res.state == 1) {
              if(res.data.resultCode != -1) {
                wx.requestPayment({
                  timeStamp: res.data.apiTimestamp,
                  nonceStr: res.data.apiNoncestr,
                  package: res.data.apiPackage,
                  signType: res.data.apiSigntype,
                  paySign: res.data.apiPaysign,
                  success: function (cc) {
                    Tips.toast(`付款成功`, 'none');
                    wx.navigateTo({
                      url: `../../pages/paySuc/main?orderNum=${res.orderNum}&shopStoreId=${_this.storeId}&shareCardId=${_this.sharecardId}`
                    })
                  },
                  fail: function (res) {
                    if (res.errMsg == 'requestPayment:fail cancel') {

                    }
                  },
                  complete: function (res) {
                  }
                })
              }else{
                Tips.toast(`${res.data.message}`, 'none');
              }
            }else {
              Tips.toast(`${res.msg}`, 'none');
            }

          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
