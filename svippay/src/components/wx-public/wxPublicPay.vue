<template>
  <div>
    <div class="fz14 box">
      <div class="border-buttom">
        <p>商家名称</p>
        <p class="fc-c">{{storeName}}</p>
      </div>
      <div class="border-buttom">
        <p>订单编号</p>
        <p class="fc-c">{{orderNum}}</p>
      </div>
      <div>
        <p>订单时间</p>
        <p class="fc-c">{{time}}</p>
      </div>
    </div>
    <div class="fz14 box">
      <p><span>应付金额</span><span class="fl-r fc-c">￥{{totalMoney}}</span></p>
      <p><span>话呗抵扣</span><span class="fl-r fc-c">-￥{{integralConvertCash}}</span></p>
      <p><span>还需付款</span><span class="fl-r fc-r">￥{{shouldPayMoney}}</span></p>
    </div>
    <div class="fz14 ">
      <p class="title">选择支付方式</p>
      <div class="flex-box">
        <div class="item">
          <img src="@/assets/imgs/wx-public/wx.png" width="70"/>
          <br/>
          <input v-model="paytype" name="paytype" checked="" id="wx" type="radio" value="wx"/><i
          class="chexkbox"></i><label for="wx">微信支付</label>
        </div>
        <div class="item">
          <img src="@/assets/imgs/wx-public/money.png" width="70"/>
          <br/>
          <input v-model="paytype" name="paytype" id="xj" type="radio" value="xj"/><i class="chexkbox"></i><label
          for="xj">现金支付</label>
        </div>
      </div>
    </div>
    <button class="btns" style="width: 3rem;height: 1rem" @click="wxPay">确认支付</button>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import axios from 'axios'
  import {timestampToTime , getStore , timestampToTime2} from "@/assets/js/jsBridge";
  import {regular_uri} from "@/assets/js/concact";

  export default {
    name: 'payItem',
    data() {
      return {
        orderNum: this.$route.query.orderNum,
        storeName: this.$route.query.storeName,
        consumeTime: Number(this.$route.query.consumeTime),
        time: timestampToTime(Number(this.$route.query.consumeTime)),
        shouldPayMoney: this.$route.query.shouldPayMoney,
        integralConvertCash: this.$route.query.integralConvertCash,
        totalMoney: this.$route.query.totalMoney,
        activeNum: this.$route.query.activeNum,
        storeId: this.$route.query.storeId,
        mercId: this.$route.query.payChannelStoreNum,
        openid: this.$route.query.openid,
        trmNo: this.$route.query.trmNo,
        paytype: '',
        userinfo: '',
        tip: ''
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*微信支付*/
      wxPay() {
        var _self = this;
        if (this.paytype == '') {
          _self.toast('请选择支付方式');
        } else {
          if (this.paytype == 'wx') {
            try {
              var uri = regular_uri.wxPay + '?storeId=' + this.storeId + '&trmNo=' + this.trmNo + '&payWay=WXPAY&amount=' + this.shouldPayMoney*100
                + '&totalAmount=' + this.totalMoney*100 + '&mercId=' + this.mercId + '&integralCount=' + this.integralConvertCash + '&openid=' + this.openid
                + "&activeNum=" + this.activeNum + '&subject=' + '';
              axios.post(uri).then(res => {
                _self.wxPayConfig(res.data)
              })
            }catch (e) {
              alert(e)
            }
          } else if (this.paytype == 'xj') {
            _self.$router.replace({
              name: 'success',
              query: {
                amount: _self.shouldPayMoney,
                discount: _self.integralConvertCash,
                orderTime: timestampToTime2(_self.consumeTime),
                storeName: _self.storeName,
                order_no: _self.orderNum,
                def_status: '',
                def_money: ''
              }
            })
          }
        }
      },
      /**微信支付配置支付参数*/
      wxPayConfig(_data) {
        var _self = this;
        if (_data.state == 1) {
          var data = _data.data;
          var _appId = data.apiAppid;
          var timeStamp = data.apiTimestamp;
          var nonceStr = data.apiNoncestr;
          var package1 = data.apiPackage;
          var signType = data.apiSigntype;
          var paySign = data.apiPaysign;
          // var txn_amt = res.txn_amt;
          var pay_time = data.sysTime;
          var order_no = data.orderNo;

          // alert(package1)
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": _appId, //公众号名称，由商户传入
                "timeStamp": timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": nonceStr, //随机串
                "package": package1,
                "signType": signType, //微信签名方式：
                "paySign": paySign //微信签名
              },
              function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  //TODO 成功后的页面跳转
                  _self.$router.replace({
                    name: 'success',
                    query: {
                      amount: _self.shouldPayMoney,
                      discount: _self.integralConvertCash,
                      orderTime: pay_time,
                      storeName: _self.storeName,
                      order_no: order_no,
                      def_status: '',
                      def_money: ''
                    }
                  })
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                  // alert(getStore('userinfo'));
                  window.history.back();
                } else {
                  console.log(res.err_msg)
                  console.log(res.err_desc)
                  _self.$router.replace({
                    name: 'fail',
                    query: {
                      amount: _self.shouldPayMoney,
                      discount: _self.integralConvertCash,
                      orderTime: pay_time,
                      storeName: _self.shopName,
                      order_no: order_no,
                      err_msg: res.err_msg,
                      err_desc: res.err_desc,
                      def_status: _self.def_status,
                      def_money: ''
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

        } else {
          //TODO 渠道下单失败
          alert(decodeURIComponent(_data.msg))

        }
      },
      getTotalMoney(){
        var _self = this;
        _self.userinfo = JSON.parse(getStore('userinfo')) ;
      }
    },
    mounted() {
      console.log(this.$route.query)
      console.log(this.paytype)
      this.getTotalMoney();
    }
  }

</script>

<style scoped>
  .fz14 {
    font-size: 14px;
  }

  .box {
    padding: .5rem;
    border-bottom: 2px solid #D6D8DD;
    line-height: 1.5;
  }

  .flex-box {
    display: flex;
  }

  .box > div {
    padding: .25rem 0;
  }

  .item {
    flex: 1;
    text-align: center;
  }

  .title {
    padding: 0 .5rem;
    line-height: 2;
  }

  input[type='radio'] {
    opacity: 0;
  }

  .chexkbox {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1px solid #8D8D8D;
    background-size: cover;
    vertical-align: middle;
    border-radius: 50%;
  }

  input:checked ~ .chexkbox {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAANlBMVEUAAAARltsSltoQldsQj98Ql9sRltsQldoRldoSldsQl98SldwRltsQltwRldsRltoQltsSltsGb0GeAAAAEXRSTlMA8KBgEEDAMNCAIJCwUODfcPZN+asAAAFrSURBVFjD7ZfbksMgCIaDIkoSm/L+L7uzszO1jYq43va7/wnh7PZFYfcHJfmFTs44qY7HJZ+Qn7DhL2nhdrO8x2kwsZMoAA8/D6KTdCecDIHQl+MpFnxXn0SWLDixkpv6Q8xAbOizTJCwDgDIDIcSABv3ZAaZJN0MkMySFQdM0HwEEvMhhfdUojV1SQpuK3iT/uYobAVDE8FevlNnEkzFG+UTLiPUpEfo5iGYmqdq9utlgGVAaGfabMB3EhWaSQBGrvVRbSiq4v246RF0A9XYxVKzz60EsGfANf45w1vBOtENcCtqeL70XiwG6iJ7gji1zpRC+lPurE7Lh1rKpVmTdCC9mQhHs4YHAynhYFSE0UBJqDYqjLcKRG3dOMNQhSR94upYX10sYXG10epyjcvrvSJMHhg1vHDizIYhbG1o5cyz+wB+8dSNa8c24eq5PyaXrfLvN0tS5DbicXfj9Dj97GMiEJFEjsP2pc8PxhSYTgGzXkEAAAAASUVORK5CYII=);
    background-size: 14px 14px;
    border: none;
  }
  .btns{
    display: block;
    width: 3rem;
    height: .8rem;
    background: #ff4f81;
    color: #FFFFFF;
    font-size: .3rem;
    margin: .3rem auto;
    border-radius: .1rem;
  }
</style>
