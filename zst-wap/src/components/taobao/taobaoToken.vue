<template>
  <div class="taobaoToken">
    <toast :tip="tip" ref="toast"></toast>
    <header>
      <button @click="downLoad"></button>
    </header>
    <div class="thumb">
      <img v-lazy="detail.pic_url" alt="">
    </div>
    <div class="goodsName txt-overflow">
      <img src="@/assets/imgs/common/shopIcon_1.png" alt="">{{detail.title}}
    </div>
    <div class="price">
      <div class="left">
        <div class="presentPrice">￥ {{(detail.coupon_price-couponData.coupon_amount).toFixed(1)}}元</div>
        <div class="originalPrice">{{Number(detail.coupon_price).toFixed(1)}}元</div>
      </div>
      <div class="right">
        <p><i>￥</i>{{couponData.coupon_amount}}</p>
      </div>
    </div>
    <div class="key">
      {{key}}
    </div>
    <button class="copyBtn" :data-clipboard-text="key" @click="copy">一键复制</button>
    <div class="tip">复制上方口令,打开手机淘宝购买</div>
  </div>
</template>

<script>
  import clipBoard from 'clipboard';
  import toast from '@/components/common/toast';
  import {getTbk} from "@/assets/js/comm";
  import {getSignIn} from "@/assets/js/jsBridge";
  import axios from 'axios';
  import wx from 'weixin-js-sdk';

  export default {
    name: "taobaoToken",
    components:{
      toast
    },
    data(){
      return{
        key: '',
        tip: '',
        detail: '',
        couponData: '',
        goodsId: this.$route.query.goodsId,
        // goodsId: '577680953211',
        activityId: this.$route.query.activityId,
        userId: this.$route.query.userId
      }
    },
    methods: {
      downLoad(){
        var _self = this;
        window.location.href = 'https://ax4eod.mlinks.cc/AeUp?id=' + _self.goodsId + '&activityId=' + _self.activityId + "&userId=" + _self.userId
      },
      /*复制至剪贴板*/
      copy() {
        let _self = this;
        let clipboard = new clipBoard('.copyBtn');
        clipboard.on('success', e => {
          _self.tip = '复制成功';
          _self.$refs.toast.toast();
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          _self.tip = '复制失败';
          _self.$refs.toast.toast();
          clipboard.destroy()
        })
      },
      init(){
        var _self = this;
        _self.key = _self.$route.query.tbkPwd;
        _self.getTbk()
      },
      getTbk(){
        var _self = this;
        var _data = {
          goodsId: _self.goodsId,
          type: 1,
          isWebSiteIn: 0,
          activityId: _self.activityId
        };
        getTbk(_data).then(res => {
          if(res.data.state == 1){
            _self.detail = res.data.data;
            _self.couponData = res.data.couponData;
            // _self.shareInit();
          }
        })
      },
      shareInit(){
        let _self = this;
        let _data = {
          url: window.location.href.split('#')[0]
        };
        axios.get('https://zst.tenzhao.com/api/voip/wechat/signature',{params:{'url':window.location.href}})
          .then(res => {
            var signature = res.data;
            alert(JSON.stringify(signature))
            wx.config({
              debug: false,
              appId: signature.appid,
              timestamp: signature.timestamp,
              nonceStr: signature.noncestr,
              signature: signature.signature,
              jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems'
              ]
            });
            wx.ready(() => {
              var shareData = {
                title: _self.detail.title,
                desc: _self.couponData.coupon_amount == 0 ? `原价${Number(_self.detail.coupon_price).toFixed(1)}元` : `省${_self.couponData.coupon_amount}元`,
                link: window.location.href,
                imgUrl: _self.detail.pic_url,
                success:function(){
                },
                cancel: function () {
                }
              };
              wx.onMenuShareAppMessage(shareData);
              wx.onMenuShareTimeline(shareData);
              wx.onMenuShareQQ(shareData);
              wx.onMenuShareWeibo(shareData);
              wx.onMenuShareQZone(shareData);
              wx.checkJsApi({
                jsApiList: [
                  'checkJsApi'
                ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function(res) {
                  // 以键值对的形式返回，可用的api值true，不可用为false
                  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                }
              });
            });
            wx.error(function (res) {
              alert(res.errMsg);
            });

          })
      },
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/global.scss';
  .taobaoToken {
    box-sizing: border-box;
    padding: .25rem;
    background: #FFFFFF;
    header{
      width: 7rem;
      height: .8rem;
      margin-bottom: .16rem;
      background: url($ctxpath + "/static/customImgs/common/outside_header.png") center center no-repeat;
      background-size: 100% 100%;
      position: relative;
      button{
        background: none;
        display: block;
        width: 1.73rem;
        height: .6rem;
        position: absolute;
        right: 0;
        top: .1rem;
        margin: 0;
      }
    }
    .thumb{
      width: 100%;
      height: 7rem;
      margin-bottom: .5rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
        background: #1a9bb1;
      }
    }
    .goodsName{
      color: #030304;
      font-size: .3rem;
      img{
        width: .3rem;
        height: .3rem;
      }
    }
    .price{
      display: flex;
      justify-content: space-between;
      border-bottom: .01rem dashed #E5E5E5;
      padding-bottom: .35rem;
      margin-bottom: .22rem;
      .left{
        display: flex;
        align-items: flex-end;
        .presentPrice{
          font-size: .48rem;
          color: #F7094D;
          font-weight: bold;
        }
        .originalPrice{
          font-size: .24rem;
          color: #9A9DA5;
          text-decoration: line-through;
        }
      }
      .right{
        width: 1.4rem;
        height: .81rem;
        background: url($ctxpath + "/static/customImgs/taobao/coupons_bg.png") center center no-repeat;
        background-size: 100% 100%;
        p{
          padding-top: .3rem;
          padding-left: .1rem;
          font-size: .36rem;
          color: #FFFFFF;
          i{
            font-size: .18rem;
          }
        }
      }
    }
    .key{
      width: 100%;
      height: .95rem;
      background: #EEEEEE;
      font-size: .36rem;
      text-align: center;
      line-height: .95rem;
      margin-bottom: .18rem;
    }
    button{
      display: block;
      width: 2.5rem;
      height: .6rem;
      border-radius: .3rem;
      background: #FF4402;
      font-size: .3rem;
      color: #FFFFFF;
      margin: 0 auto;
      margin-bottom: .15rem;
    }
    .tip{
      font-size: .24rem;
      color: #9A9DA5;
      text-align: center;
    }
  }
</style>
