<template>
  <div class="pay">
    <div class="pay_money">
      支付金额
    </div>
    <div class="money">
      {{(actPay/100).toFixed(2)}}元
    </div>
    <div class="payWay-item" style="margin-top: 1.57rem" @click="selectWay(1)">
      <div class="left iconfont icon-zhifubao ali"></div>
      <div class="mid">
        <p>支付宝支付</p>
        <span>前往支付宝支付</span>
      </div>
      <div class="right iconfont icon-gou fc-8D8E98" :class="{'active':payWay==1}"></div>
    </div>
    <div class="payWay-item" @click="selectWay(2)">
      <div class="left iconfont icon-goumaiweixin wechat"></div>
      <div class="mid">
        <p>微信支付</p>
        <span>前往微信支付</span>
      </div>
      <div class="right iconfont icon-gou fc-8D8E98" :class="{'active':payWay==2}"></div>
    </div>
    <button @click="callApp">前往支付</button>
    <toast ref="toast" :tip="tip"></toast>
  </div>
</template>

<script>
  import {callApp, postTitle, getSignIn, postPayOrder , callAppMethod} from "@/assets/js/jsBridge";
  import {getsVipMainOrder} from "@/assets/js/comm";
  import toast from '@/components/common/toast';

  export default {
    props: ['tokenPromise'],
    name: "pay",
    components: {
      toast
    },
    data() {
      return {
        actPay: this.$route.query.actPay,
        totalMoney: this.$route.query.totalMoney,
        maincardId: this.$route.query.maincardId,
        payWay: 1,
        token: '',
        tip: ''
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      selectWay(payWay) {
        var _self = this;
        _self.payWay = payWay;
      },
      /*吊起支付宝微信付款码*/
      callApp() {
        var _self = this;
        _self.mainOrder();
      },
      mainOrder(){
        var _self = this;
        var _data = {
          token: _self.token,
          payWay: String(_self.payWay),
          maincardId: String(_self.maincardId),
          totalMoney: String(_self.totalMoney),
          shouldMoney: String(_self.actPay),
          isOriginPricePay: 1
        };
        getSignIn(_data).then(sec => {
          getsVipMainOrder(_data,sec).then(res => {
            if (res.data.state == 1) {
              var _json = {
                resultDic: res.data,
                type: _self.payWay
              };
              postPayOrder(_json).then(res => {
                if (res) {
                  window.history.go(-2);
                }
              })
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      }
    },
    mounted() {
      var _self = this;
      callAppMethod('20');
      _self.tokenPromise.then(res => {
        _self.token = res;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .pay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    padding: .83rem .21rem;

    .pay_money {
      font-size: .34rem;
      text-align: center;
      box-sizing: border-box;
      padding: 0 .65rem;
      line-height: .6rem;
    }

    .money {
      font-size: .6rem;
      text-align: center;
      font-weight: bold;
    }

    .payWay-item {
      box-sizing: border-box;
      padding: .28rem .12rem;
      display: flex;
      align-items: center;
      border-bottom: .01rem solid rgba(229, 229, 229, 1);

      .left {
        width: .99rem;
        height: .99rem;
        font-size: .99rem;
      }

      .wechat {
        color: #39AD2D;
      }

      .ali {
        color: #08A1F8;
      }

      .mid {
        width: 5rem;
        box-sizing: border-box;
        padding: .15rem .18rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p {
          font-size: .34rem;
        }

        span {
          font-size: .24rem;
          color: #8D8E98;
        }
      }

      .right {
        font-size: .35rem;
      }
      .active{
        color: #FFA61A;
      }
    }

    button {
      margin: 1.49rem auto 0;
      display: block;
      width: 6.69rem;
      height: .91rem;
      color: #FFFFFF;
      font-size: .41rem;
      background: rgba(247, 9, 77, 1);
      border-radius: .07rem;
    }
  }
</style>
