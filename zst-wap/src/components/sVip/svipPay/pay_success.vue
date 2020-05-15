<template>
  <div class="pay_success">
    <div class="box_padding padding-38 border-bottom-13 flex_box justify_space_between align_center">
      <div class="left">
        <p class="fz-42 mb-24">支付成功</p>
        <p class="fz-30 fc-878787">支付日期：{{orderTime.slice(0,4) + "-" + orderTime.slice(4,6) + "-" + orderTime.slice(6,8) + " " + orderTime.slice(8,10) + ":" + orderTime.slice(10,12) + ":" + orderTime.slice(12,14)}}</p>
      </div>
      <button class="btn_radius fc-ffffff fz-32 bg-FEB623 iconfont icon-fenxiang" style="padding: .04rem .16rem" @click="postStoreMiniUrl">分享</button>
    </div>
    <div class="box_padding padding-24">
      <div class="flex_box align_center border-bottom-dashed pb-27 mb-24" @click="enterStore">
        <div class="logo" style="margin-right: .12rem">
          <img :src="storeDetail.storeLogo" alt="">
        </div>
        <div class="right" style="width: 5.5rem">
          <p class="fz-38 txt-ellipsis" style="margin-bottom: .08rem">{{storeDetail.storeName}}</p>
          <p class="fz-28 fc-878787 txt-ellipsis icon-dizhi3 iconfont">{{storeDetail.address}}</p>
        </div>
        <i class="iconfont icon-youjiantou fc-878787"></i>
      </div>
      <div class="border-bottom-dashed pb-27 mb-24">
        <p class="fz-30 font-weight mb-24">订单详情</p>
        <p class="fz-28 mb-12">订单金额: {{Number(totalAmount).toFixed(2)}}元</p>
        <p class="fz-28 mb-12">不参与折扣金额:{{Number(notDisMoney).toFixed(2)}}元</p>
        <p class="fz-28 mb-12">支付方式: {{payWay == 1 ? '支付宝' : payWay == 2 ? '微信' : payWay == 3 ? '助商通' : ''}}</p>
        <p class="fz-28 mb-12">支付时间: {{orderTime.slice(0,4) + "-" + orderTime.slice(4,6) + "-" + orderTime.slice(6,8) + " " + orderTime.slice(8,10) + ":" + orderTime.slice(10,12) + ":" + orderTime.slice(12,14)}}</p>
        <p class="fz-28 mb-12">优惠方式:{{discountType == 1 ? '卡主折扣' : discountType == 2 ? '商家话呗活动' : discountType == 3 ? '优惠券活动' : discountType == 4 ? '共享卡+优惠券 双重优惠' : discountType == 5 ? '商家活动+优惠券 双重优惠' : '原价支付'}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="fz-28 fc-F7094D">优惠金额:-{{Number(discount).toFixed(2)}}元</p>
          <p class="fz-36 font-weight">实际支付:{{Number(amount).toFixed(2)}}元</p>
        </div>
      </div>
      <div class="flex_box justify_space_between align_center mb-24">
        <p class="fz-30 font-weight">话呗余额：{{totalMoney ? Number(totalMoney).toFixed(2) : ''}}</p>
      </div>
      <div class="slogan flex_box" v-show="svipCardActives.length > 0" @click="enterStore">
        <div class="left fz-30 fc-ffffff">该商家正在进行招募卡主活动</div>
        <div class="right fz-28 fc-ffffff" style="text-align: center">招募详情<i class="iconfont icon-zheng-triangle"></i></div>
      </div>
    </div>
    <footer class="bg-F60F51 fc-ffffff fz-36" @click="close">
      关闭
    </footer>

    <v-toast :tip='tip' ref="toast"></v-toast>
    <!--<v-share :card="cardDetail" ref="share"></v-share>-->

    <transition name="alertMsg">
      <div class="alert" v-show="shareCardFlag || bargainActFlag">
        <div class="alertContent">
          <div class="close" @click="closeToast">
            <img src="@/assets/imgs/common/close.png" alt="">
          </div>
          <div class="shareCardFlag box_padding" style="padding: .73rem .27rem .27rem" v-if="bargainActFlag">
            <img src="@/assets/imgs/svip/bargain_head.png" alt="" class="bargain_head">
            <p class="fz-30 font-weight text-center" style="color: #0A3277;margin-bottom: .35rem">价格靠你定，刀刀都是情</p>
            <div class="flex_box justify_space_between" style="margin-bottom: .24rem">
              <img v-lazy="bargainAct.mainImg" alt="" class="thumb">
              <div class="flex_box flex_column justify_space_between" style="width: 3.7rem">
                <p class="txt-overflow fz-28 font-weight" style="height: .76rem">{{bargainAct.title}}</p>
                <p class="flex_box align_center">
                  <span class="iconfont icon-renminbi fz-48 fc-F7094D" style="margin-right: .12rem">{{Number($accMul(Number(bargainAct.price),$accMul(bargainAct.discount,0.1))).toFixed(2)}}</span>
                  <span class="fc-8D8E98 fz-30" style="text-decoration: line-through">{{Number($accMul(Number(bargainAct.price),1)).toFixed(2)}}元</span>
                </p>
              </div>
            </div>
            <button class="btn_radius bg-F7094D fc-ffffff fz-36"
                    style="display: block;width: 100%;margin-bottom: .12rem"
                    @click="linkToBargain">前往砍价</button>
            <!--<router-link :to="{name: 'activeBargain'}" tag="p" class="fz-30 text-center"><span class="fc-F7094D">更多</span>砍价活动请点击 <i class="iconfont icon-arrow-right fc-8D8E98"></i></router-link>-->
          </div>
          <div class="shareCardFlag box_padding" v-if="shareCardFlag" style="padding: 0 .28rem;">
            <img src="@/assets/imgs/svip/shareCard_award.png" alt="" class="mg-auto" style="width: 2.98rem;height: 1.83rem;margin-bottom: .12rem">
            <p class="font-weight fz-38 text-center">【送好友一张共享卡】</p>
            <p class="fz-30 text-center" style="margin-bottom: .28rem;">好友消费立享<i class="fc-F7094D fz-38 font-weight">{{(shareCardDetail.shareCardDiscount*10).toFixed(1)}}折</i>，你还能获得<i class="fc-F7094D fz-38 font-weight">{{shareCardDetail ? accMul(shareCardDetail.commissionRate,100) : ''}}%</i>的佣金</p>
            <button class="btn_radius bg-FEB623 fc-ffffff fz-36"
                    style="display: block;width: 100%;margin-bottom: .12rem"
                    @click="postShareCardMiniUrl">去分享</button>
            <p class="fz-30 text-center">关闭后可在<span class="fc-F7094D">卡主-收藏的卡</span>中查看</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {storeDetail , getUserBalance , isAbleBargain} from "@/assets/js/comm";
  import {postTitle , getGPS , calDistance , postGoodsUrl , postShareContentIOS , postTitleAndroid , postImgAndroid ,
    shareInterface , callAppMethod} from "@/assets/js/jsBridge";
  import {accMul,CARDPAGE} from "@/assets/js/deal";
  import vShare from "@/components/common/vShare"

  export default {
    name: "pay_success",
    props: ['tokenPromise'],
    components: {vShare},
    data(){
      return{
        shopStoreId: this.$route.query.shopStoreId ? this.$route.query.shopStoreId : '',
        shareCardId: this.$route.query.shareCardId,
        totalAmount: this.$route.query.totalAmount,
        amount: this.$route.query.amount,
        notDisMoney: this.$route.query.notDisMoney,
        payWay: this.$route.query.payWay,
        orderTime: this.$route.query.orderTime ? this.$route.query.orderTime : '20181212456278',
        discount: this.$route.query.discount,
        discountType: this.$route.query.discountType,
        token: '',
        storeDetail: '',
        svipCardActives: '',
        shareCardDetail: '',
        bargainAct: '',
        totalMoney: '',
        shareCardFlag: false, //分享卡弹框
        bargainActFlag: false,  //砍价推送弹框
        tip: '',
        LONG: '',
        LAT: ''
      }
    },
    mounted(){
      var _self = this;
      postTitle('订单详情');
      callAppMethod('20');
      for(var key in CARDPAGE){               //清除本地缓存
        delete CARDPAGE[key];
      }
      _self.tokenPromise.then(res => {
        _self.token = res;
        getGPS().then(obj => {
          _self.LONG = obj.LONG;
          _self.LAT = obj.LAT;
          _self.init();
        })
      })
    },
    methods: {
      accMul(num1,num2){
        return accMul(num1,num2)
      },
      close(){
        var _self = this;
        _self.$router.go(-1);
      },
      closeToast(){
        this.shareCardFlag = false;
        this.bargainActFlag = false;
      },
      /** 提醒黑窗口弹出*/
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      init(){
        var _self = this;
        _self.isAbleBargain();

        _self.getStoreDetail();
        _self.getUserBalance();
      },
      getStoreDetail(){
        var _self = this;
        var _data = {
          token: _self.token,
          shopStoreId: String(_self.shopStoreId)
        };
        _self.$getSignIn(_data).then(sec => {
          storeDetail(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.storeDetail = res.data.data;
              _self.svipCardActives = res.data.data.svipCardActives;
              _self.getShareCard(res.data.data.lstSvipShareCard);
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      getUserBalance(){
        var _self = this;
        var _data = {
          token: _self.token
        };
        _self.$getSignIn(_data).then(sec => {
          getUserBalance(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.totalMoney = res.data.data.totalMoney;
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      /**
       * 获取分享卡详情
       */
      getShareCard(list){
        var _self = this;
        if(_self.shareCardId){
          list.forEach(ele => {
            if(_self.shareCardId == ele.id){
              _self.shareCardDetail = ele;
              _self.shareCardFlag = true;
              return;
            }
          })
        }
      },
      /**
       * 进入门店详情
       */
      enterStore(){
        var _self = this;
        var distance = calDistance(_self.LAT,_self.LONG,_self.storeDetail.longitude,_self.storeDetail.latitude);
        _self.$router.replace({
          name: 'sellerDetail',
          query: {
            shopStoreId: _self.shopStoreId,
            distance: distance
          }
        })
      },
      postStoreMiniUrl(){
        var _self = this;
        try {
          var distance = calDistance(_self.LAT,_self.LONG,_self.storeDetail.longitude,_self.storeDetail.latitude);
          var uri = "pages/packageB/pages/shopRecDet/main?shopStoreId=" + _self.shopStoreId + "&distance=" + distance;
          var img = _self.storeDetail.storeImgs.split(',')[0];
          var _data = {
            title: `【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`,
            imageUrl: img
          };
          postShareContentIOS(_data);
          postTitleAndroid(`【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`)
          postImgAndroid(img);
          postGoodsUrl(uri);
          shareInterface();
        } catch (e) {
          _self.toast(e);
        }
      },
      postShareCardMiniUrl(){
        var _self = this;
        var distance = calDistance(_self.LAT,_self.LONG,_self.storeDetail.longitude,_self.storeDetail.latitude);
        var img = _self.storeDetail.storeImgs.split(',')[0];
        var uri = "pages/packageB/pages/shareCardDetail/main?distance=" + distance + "&shareid=" + _self.shareCardDetail.id + "&shopStoreId=" + _self.shareCardDetail.shopStoreId;
        postImgAndroid(img);
        postTitleAndroid(`【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`)
        var _data = {
          title: `【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`,
          imageUrl: img
        };
        postShareContentIOS(_data);
        postGoodsUrl(uri);
        callAppMethod('22');
        shareInterface();
      },
      isAbleBargain(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          storeId: String(_self.shopStoreId),
          price: String(accMul(Number(_self.amount),100))
        };
        isAbleBargain(_data).then(res => {
          if(res.data.state == 1){
            if(res.data.data !== '' && res.data.data){
              _self.bargainAct = res.data.data;
              _self.bargainActFlag = true;
            }
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      linkToBargain(){
        var _self = this;
        _self.$router.replace({
          name: 'bargain',
          query: {
            status: 2,
            bargainId: _self.bargainAct.id,
            storeId: _self.shopStoreId}
        })
      }
    }
  }
</script>

<style lang="scss" scoped>


  .pay_success{
    .logo{
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      overflow: hidden;
      background: #08a1f8;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .slogan{
      width: 100%;
      height: .81rem;
      .left{
        width: 75%;
        height: 100%;
        line-height: .81rem;
        background:linear-gradient(268deg,#EABF99,rgba(214,146,92,1));
        box-sizing: border-box;
        padding-left: .3rem;
      }
      .right{
        width: 25%;
        height: 100%;
        line-height: .81rem;
        background: #1B1818;
      }
    }
    footer{
      position: fixed;
      width: 100%;
      height: 1rem;
      bottom: 0;
      left: 0;
      text-align: center;
      line-height: 1rem;
    }
    .alert{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(12,12,12,.5);
      .alertContent{
        position: absolute;
        top: 2rem;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 6rem;
        .bargain_head{
          display: block;
          position: absolute;
          top: -1.17rem;
          left: -.75rem;
          width: 7.5rem;
          height: 2.32rem;
          z-index: 1;
        }
        .close{
          width: .55rem;
          height: .55rem;
          position: absolute;
          top: -.8rem;
          right: -.28rem;
          z-index: 2;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .shareCardFlag{
          height: 5.14rem;
          background: #FFFFFF;
          border-radius: .2rem;
          button{
            width: 2.5rem;
            height: .8rem;
          }
          .thumb{
            display: block;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: .2rem;
            background: #0d0d0f;
          }
        }
      }
    }
  }
</style>
