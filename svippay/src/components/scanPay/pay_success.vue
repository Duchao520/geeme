<template>
  <div class="pay_success">
    <div class="box_padding padding-38 border-bottom-13">
      <div class="left">
        <p class="fz-42 mb-24">支付成功</p>
        <p class="fz-30 fc-878787">支付日期：{{orderTime.slice(0,4) + "-" + orderTime.slice(4,6) + "-" + orderTime.slice(6,8) + " " + orderTime.slice(8,10) + ":" + orderTime.slice(10,12) + ":" + orderTime.slice(12,14)}}</p>
      </div>
    </div>
    <div class="box_padding padding-24">
      <div class="flex_box align_center border-bottom-dashed pb-27 mb-24">
        <div class="logo" style="margin-right: .12rem">
          <img :src="logo" alt="">
        </div>
        <div class="right" style="width: 6rem">
          <p class="fz-38 txt-ellipsis" style="margin-bottom: .08rem">{{storeName}}</p>
          <p class="fz-28 fc-878787 txt-ellipsis">{{address}}</p>
        </div>
      </div>
      <div class="border-bottom-dashed pb-27 mb-24">
        <p class="fz-30 font-weight mb-24">订单详情</p>
        <p class="fz-28 mb-12">订单金额: {{Number(totalAmount).toFixed(2)}}元</p>
        <p class="fz-28 mb-12">不参与折扣金额:{{Number(notDisMoney).toFixed(2)}}元</p>
        <p class="fz-28 mb-12">支付方式: {{payWay == 1 ? '支付宝' : payWay == 2 ? '微信' : payWay == 3 ? '助商通' : ''}}</p>
        <p class="fz-28 mb-12">支付时间: {{orderTime.slice(0,4) + "-" + orderTime.slice(4,6) + "-" + orderTime.slice(6,8) + " " + orderTime.slice(8,10) + ":" + orderTime.slice(10,12) + ":" + orderTime.slice(12,14)}}</p>
        <p class="fz-28 mb-12">优惠方式:{{discountType == 1 ? '卡主折扣' : discountType == 2 ? '满减折扣' : discountType == 3 ? '联盟打折卡' : (!discountType && isCoupon) ? '优惠券' : '原价支付'}}{{(discountType && isCoupon) ? '+优惠券' : ''}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="fz-28 fc-F7094D">优惠金额:-{{Number(discount).toFixed(2)}}元</p>
          <p class="fz-36 font-weight">实际支付:{{Number(amount).toFixed(2)}}元</p>
        </div>
      </div>
      <div class="flex_box justify_space_between align_center mb-24">
        <p class="fz-30 font-weight" v-if="Number(totalmoney)">话呗余额：{{Number(totalmoney).toFixed(2)}}</p>
        <div class="flex_box align_center" onclick="window.location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.hh.csipsimple'">
          <p class="fc-B2682D fz-28" style="margin-right: .08rem">下载助商通每天领话呗</p>
          <button class="fc-ffffff btn_radius bg-F60F51 fz-28" style="padding: .06rem .12rem">立即下载</button>
        </div>
      </div>
      <div class="slogan flex_box" v-show="suportSvip == 1">
        <div class="left fz-30 fc-ffffff">该商家正在进行招募卡主活动</div>
        <div class="right fz-28 fc-ffffff" style="text-align: center">招募详情</div>
      </div>
    </div>
    <footer class="bg-F60F51 fc-ffffff fz-36" @click="close">
      关闭
    </footer>
  </div>
</template>

<script>
  export default {
    name: "pay_success",
    data(){
      return{
        logo: decodeURIComponent(this.$route.query.logo),
        storeName: this.$route.query.storeName,
        address: this.$route.query.address,
        totalAmount: this.$route.query.totalAmount,
        amount: this.$route.query.amount,
        notDisMoney: this.$route.query.notDisMoney,
        payWay: this.$route.query.payWay,
        orderTime: this.$route.query.orderTime,
        discount: this.$route.query.discount,
        discountType: this.$route.query.discountType,
        suportSvip: this.$route.query.suportSvip,
        totalmoney: this.$route.query.totalmoney,
        isCoupon: this.$route.query.isCoupon,
        userAgentType: ''
      }
    },
    methods: {
      getUserAgentType() {
        var _self = this;
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('AlipayClient') > -1) {
          _self.userAgentType = "ALIPAY";
        } else if (/.*micromessenger.*miniprogram.*/.test(userAgent.toLowerCase())) {
          _self.userAgentType = "miniProgram";
        } else if (userAgent.indexOf('MicroMessenger') > -1) {
          _self.userAgentType = "WXPAY";
        } else {
          // TODO 跳转到错误页

        }
      },
      close(){
        if(_self.userAgentType == 'ALIPAY'){
          AlipayJSBridge.call("closeWebview");
        } else if(_self.userAgentType == 'miniProgram') {
          var redirect_url = '../../pages/index/main?';
          wx.miniProgram.switchTab({url: redirect_url});
        } else if(_self.userAgentType == 'WXPAY'){
          WeixinJSBridge.invoke('closeWindow', {}, function(res) {

          });
        }
      }
    },
    mounted() {
      this.getUserAgentType();
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
  }
</style>
