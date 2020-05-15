<template>
  <div class="container">
    <div class="success">
      <div class="left">
        <div class="successIcon">
          <img src="@/assets/imgs/scanPay/success.png" alt="">
        </div>
        <p>支付失败</p>
      </div>
      <p style="font-size: .48rem"><span id="actAmount">{{Number(amount).toFixed(2)}}</span>元</p>
    </div>
    <ul class="orderInfo">
      <li><span>订单金额</span><span id="total">{{Number(money).toFixed(2)}}元</span></li>
      <li><span>话呗抵扣</span><span id="discount">{{Number(discount).toFixed(2)}}元</span></li>
      <li><span>实付金额</span><span id="amount">{{Number(amount).toFixed(2)}}元</span></li>
      <li><span>订单时间</span><span id="orderTime">{{orderTime.slice(0,4) + "-" + orderTime.slice(4,6) + "-" + orderTime.slice(6,8) + " " + orderTime.slice(8,10) + ":" + orderTime.slice(10,12) + ":" + orderTime.slice(12,14)}}</span></li>
      <li><span>商家名称</span><span id="storeName">{{storeName}}</span></li>
      <li><span>订单编号</span><span id="order_no">{{order_no}}</span></li>
      <li><span>失败信息</span><span>{{err_msg}}</span></li>
      <li><span>失败描述</span><span>{{err_desc}}</span></li>
      <li></li>
    </ul>
    <div class="thumb">
      <router-link tag="div" :to="{name: 'cardMaster'}" class="thumb-item">
        <img src="@/assets/imgs/scanPay/card.png" alt="">
      </router-link>
      <router-link tag="div" :to="{name: 'couponCourse'}" class="thumb-item">
        <img src="@/assets/imgs/scanPay/coupon.png" alt="">
      </router-link>
    </div>
    <div class="line-item" v-show="def_money">
      <div class="left">当前话呗余额</div>
      <i>{{Number(def_money).toFixed(2)}}话呗</i>
    </div>
    <div class="border_box" v-if="userAgentType == 'WXPAY'">
      <span v-show="def_status">您当前话呗余额不足，无法抵扣现金，</span>“下载助商通APP,每天免费领取话呗”
    </div>

    <button class="download" v-if="userAgentType !== 'ZST'" style="margin-top: .35rem" onclick="window.location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.hh.csipsimple'">免费领取话呗</button>
    <p class="close"  @click="closeWindow">{{userAgentType == 'ZST' ? '关闭页面' : '以后再说,关闭页面'}}<i class="iconfont icon-icon11-copy"></i><i class="iconfont icon-icon11-copy"></i></p>
  </div>
</template>

<script>
  import {ZSTRequestGoAPPIndex} from "@/assets/js/jsBridge";
  import wx from "weixin-js-sdk";

  export default {
    name: "success",
    data(){
      return{
        amount: this.$route.query.amount,
        discount: this.$route.query.discount,
        orderTime: String(this.$route.query.orderTime),
        storeName: this.$route.query.storeName,
        order_no: this.$route.query.order_no,
        money: Number(this.$route.query.amount),
        err_msg: this.$route.query.err_msg,
        err_desc: this.$route.query.err_desc,
        userAgentType: '',
        def_status: this.$route.query.def_status ? this.$route.query.def_status : '',
        def_money: this.$route.query.def_money ? this.$route.query.def_money : '',
      }
    },
    methods: {
      /*关闭页面*/
      closeWindow(){
        var _self = this;
        if(_self.userAgentType == 'ALIPAY'){

        } else if(_self.userAgentType == 'miniProgram') {
          var redirect_url = '../../Index/index/main?';
          wx.miniProgram.navigateTo({url: redirect_url});
        }else if(_self.userAgentType == 'WXPAY'){
          WeixinJSBridge.invoke('closeWindow', {}, function(res) {

          });
        }else if(_self.userAgentType == 'ZST'){
          ZSTRequestGoAPPIndex();
        }else{

        }
      },
      getUserAgentType() {
        var _self = this;
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('AlipayClient') > -1) {
          _self.userAgentType = "ALIPAY";
        } else if (/.*micromessenger.*miniprogram.*/.test(userAgent.toLowerCase())) {
          _self.userAgentType = "miniProgram";
        } else if (userAgent.indexOf('MicroMessenger') > -1) {
          _self.userAgentType = "WXPAY";
        } else if (userAgent.indexOf('zst-ios-broswer') > -1 || userAgent.indexOf('zst-android-broswer') > -1) {
          _self.userAgentType = "ZST";
        } else {
          // TODO 跳转到错误页

        }
      }
    },
    mounted() {
      var _self = this;
      _self.getUserAgentType();
    }
  }
</script>

<style lang="scss" scoped>
  header{
    width: 100%;
    height: .9rem;
    box-sizing: border-box;
    padding: 0 .23rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    position: fixed;
    top: 0;
    border-bottom: .01rem solid #e5e5e5;
  }

  header img{
    width: .22rem;
    height: .4rem;
    color: #343c53;
  }
  header .title{
    font-size: .36rem;
    color: #0d0d0f;
  }
  .container{
    box-sizing: border-box;
    padding: .39rem .24rem;
  }
  .container .success{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: .49rem;
    border-bottom: .01rem dashed #DCDCDC;
    margin-bottom: .37rem;
  }
  .container .success .left{
    display: flex;
  }
  .container .success .left .successIcon{
    width: .46rem;
    height: .46rem;
  }
  .container .success .left .successIcon img{
    display: block;
    width: 100%;
    height: 100%;
  }
  .container p{
    text-align: center;
    font-size: .34rem;
    /*margin-bottom: .33rem;*/
  }
  .container .orderInfo{
    width: 100%;
    height: 5.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .container .orderInfo li{
    display: flex;
    justify-content: space-between;
    font-size: .26rem;
  }
  .container .orderInfo li:nth-child(7){
    border-bottom: .01rem dashed #dcdcdc;
  }
  .container .orderInfo li:last-child{
    font-size: .3rem;
  }
  .container .thumb{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .container .thumb .thumb-item{
    width: 3.4rem;
    height: 2rem;
  }
  .container .thumb .thumb-item img{
    display: block;
    width: 100%;
    height: 100%;
    background: #E33946;
    border-radius: .1rem;
  }
  .container .line-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .36rem 0;
    /*border-bottom: .01rem dashed #DCDCDC;*/
  }
  .container .line-item .left{
    display: flex;
    font-size: .3rem;
    align-items: center;
  }
  .container .line-item .left::before{
    content: '';
    display: block;
    width: .05rem;
    height: .31rem;
    border-radius: .03rem;
    background: #FF002B;
    margin-right: .2rem;
  }
  .container .line-item i{
    color: #FF0049;
    font-size: .3rem;
  }
  .container .border_box{
    box-sizing: border-box;
    padding: 0 .27rem;
    font-size: .28rem;
  }
  .container .download{
    font-size: .36rem;
    display: block;
    width: 100%;
    height: .89rem;
    background-color: #feb623;
    color: #FFFFFF;
    text-align: center;
    line-height: .89rem;
    margin: 0 auto;
    border-radius: .08rem;
    outline: none;
    border: none;
    margin-bottom: .17rem;
  }
  .container .close{
    text-align: center;
    font-size: .24rem;
    color: #FF002B;
    i{
      font-size: .16rem;
    }
  }
  .container a{
    text-align: center;
    color: #f7094d;
    font-size: .24rem;
    display: block;
  }
</style>
