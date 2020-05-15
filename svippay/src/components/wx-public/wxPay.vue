<template>

</template>

<script>
  import {getStore} from "@/assets/js/jsBridge";

  export default {
    name: "wxPay",
    data(){
      return{
        appId: this.$route.query.appId,
        timeStamp: this.$route.query.timeStamp,
        nonceStr: this.$route.query.nonceStr,
        package: this.$route.query.package,
        signType: this.$route.query.signType,
        paySign: this.$route.query.paySign,
        amount: this.$route.query.amount,
        discount: this.$route.query.discount,
        orderTime: this.$route.query.orderTime,
        storeName: this.$route.query.storeName,
        order_no: this.$route.query.order_no
      }
    },
    methods: {
      pay(){
        var _self = this;
        function onBridgeReady() {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": _self.appId, //公众号名称，由商户传入
              "timeStamp": _self.timeStamp, //时间戳，自1970年以来的秒数
              "nonceStr": _self.nonceStr, //随机串
              "package": _self.package,
              "signType": _self.signType, //微信签名方式：
              "paySign": _self.paySign //微信签名
            },
            function (res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location.href = 'https://wechat.tenzhao.com/mp/welcome.html';
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                window.history.back();
              } else {
                console.log(res.err_msg)
                console.log(res.err_desc)
                _self.$router.replace({
                  name: 'fail',
                  query: {
                    amount: _self.amount,
                    discount: _self.discount,
                    orderTime: _self.orderTime,
                    storeName: _self.storeName,
                    order_no: _self.order_no,
                    err_msg: res.err_msg,
                    err_desc: res.err_desc
                  }
                })
              }
            }
          );
        }
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      }
    },
    mounted() {
      this.pay();
    }
  }
</script>

<style scoped>

</style>
