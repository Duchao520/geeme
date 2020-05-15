<template>
  <div class="recharge">
    <transition name="alertMsg">
      <div class="bounced" v-show="success_tips || fail_tips">
        <div class="order" id="success_tips" v-if="success_tips">
          <div class="type success_type">
            <p class="status">充值成功</p>
            <p class="money">充值话呗 : <span id="rechargeMoney">{{rechargeMoney}}</span>元</p>
            <p class="money">话呗余额 : <span id="totalmoney">{{totalmoney}}</span>元</p>
          </div>
          <div class="btns">
            <button class="continue" @click="continueRe" style="background: #f7094d">继续充值</button>
            <button class="back" @click="back" style="background: #feb623">返回支付</button>
          </div>
          <p class="slogan">助商通省的不是一点点</p>
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
        </div>
        <div class="order" id="fail_tips" v-if="fail_tips">
          <div class="type fail_type">
            <p class="status">充值失败</p>
            <p class="fail_info">{{fail_info}}</p>
          </div>
          <div class="btns">
            <button class="continue" @click="continueRe" style="background: #f7094d">继续充值</button>
            <button class="back" @click="back" style="background: #feb623">返回支付</button>
          </div>
          <p class="slogan">助商通省的不是一点点</p>
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
        </div>
      </div>
    </transition>
    <main>
      <div class="input-container">
        <div class="input-item">
          <label>充值卡号 : </label>
          <input type="text" v-model="cardnum" placeholder="请输入卡片序列号" id="cardNum" value="" required>
          <div class="sweep" @click="sweep">
            <img src="@/assets/imgs/scanPay/sweep.png" alt="">
          </div>
        </div>
        <div class="input-item" style="margin-top: 0">
          <label>充值密码 : </label>
          <input type="password" v-model="cardpwd" placeholder="请输入卡片密码" id="cardPass" value="" required>
        </div>
      </div>
      <button class="BTN submit" @click="recharge">立即充值</button>
      <div class="tip">
        <i></i>
        <span>可使用助商通卡进行充值</span>
      </div>
      <div class="tip">
        <i></i>
        <span>助商通卡可在助商通联盟商家免费获取</span>
      </div>
      <p style="padding-left: .41rem;font-size: .28rem;color: #babcc1;margin-top: .44rem">如图</p>
      <div class="thumb">
        <img src="@/assets/imgs/scanPay/thumb.png" alt="">
      </div>
    </main>
    <toast ref="toast" :tip="tip"></toast>
  </div>
</template>

<script>
  import {recharge} from "@/assets/js/comm";
  import {getSignIn} from "@/assets/js/jsBridge";
  import {regular_uri} from "@/assets/js/concact";
  import wx from 'weixin-js-sdk';
  import axios from 'axios';
  import toast from '@/components/toast';

  export default {
    name: "recharge",
    components: {
      toast
    },
    data(){
      return{
        success_tips: false,
        fail_tips: false,
        userId: this.$route.query.userId,
        shopStoreId: this.$route.query.shopStoreId,
        no: this.$route.query.no,
        cardnum: '',
        cardpwd: '',
        rechargeMoney: '',
        totalmoney: '',
        fail_info: '',
        tip: ''
      }
    },
    methods: {
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      recharge(){
        var _self = this;
        if(_self.cardnum && _self.cardpwd){
          var _data = {
            userId: _self.userId,
            cardnum: _self.cardnum,
            cardpwd: _self.cardpwd,
            resource: 1
          }
          getSignIn(_data).then(sec => {
            recharge(_data,sec).then(res => {
              if(res.data.state == 1){
                _self.success_tips = true;
                _self.rechargeMoney = res.data.money;
                _self.totalmoney = res.data.totalmoney;
              }else {
                _self.fail_tips = true;
                _self.fail_info = decodeURIComponent(res.data.msg);
              }
            })
          })
        }else{
          _self.toast("请输入卡号和密码")
        }
      },
      close(){
        var _self = this;
        _self.success_tips = false;
        _self.fail_tips = false;
      },
      continueRe(){
        var _self = this;
        _self.cardnum = '';
        _self.cardpwd = '';
        _self.close();
      },
      back(){
        var _self = this;
        window.location.href = regular_uri.scanPay + _self.shopStoreId + "/" + _self.no;
      },
      sweep(){
        var _self = this;
        var signature = {} ;
        var _data = {
          url: window.location.href.split('#')[0]
        };
        axios.get('https://zst.tenzhao.com/api/voip/wechat/signature', {params: {'url': window.location.href}}).then(res => {
          signature = res.data;
          wx.config({
            debug: false,
            appId: signature.appid,
            timestamp: signature.timestamp,
            nonceStr: signature.noncestr,
            signature: signature.signature,
            jsApiList: [
              'scanQRCode'
            ]
          });
          wx.ready(function () {
            wx.scanQRCode({
              desc: 'scanQRCode desc',
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                _self.cardnum = result.slice(7);
              }
            });
          });
          wx.error(function (res) {
            alert(res.errMsg);
          });
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .recharge {
    .fl-l {
      float: left;
    }

    .fl-r {
      float: right;
    }

    .clearfix {
      display: block;
      zoom: 1;
    }

    .clearfix:after {
      content: "";
      display: block;
      font-size: 0;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    /*body {
      width: 100%;
      font-family: "microsoft yahei";
      margin: 0;
      !*margin-top: 2.5rem !important;*!
      padding: 0;
      background-color: #FFFFFF;

    }*/
    main {
      width: 100%;
      box-sizing: border-box;
      padding: 0 .22rem;

      .input-container {
        width: 100%;
        border-bottom: .01rem solid #cccccc;

        .input-item {
          position: relative;
          width: 100%;
          display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
          display: -moz-box; /* 老版本语法: Firefox (buggy) */
          display: -ms-flexbox; /* 混合版本语法: IE 10 */
          display: -webkit-flex; /* 新版本语法: Chrome 21+ */
          display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
          justify-content: left;
          align-items: center;
          margin: .57rem 0;

          label {
            font-size: .32rem;
            color: #151515;
            //margin: auto;
          }

          input {
            //width: 5rem;
            border: none;
            outline: none;
            font-size: .36rem;
          }

          ::-webkit-input-placeholder {
            /* WebKit, Blink, Edge */
            color: #c7c7cd;
            font-size: .32rem;
          }

          :-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            color: #c7c7cd;
            font-size: .32rem;
          }

          ::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            color: #c7c7cd;
            font-size: .32rem;
          }

          :-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: #CECECE;
            font-size: .32rem;
          }

          .sweep {
            width: .47rem;
            height: .42rem;
            padding-top: .1rem;
            position: absolute;
            right: 0;
            top: 0;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .BTN {
        width: 6.25rem;
        height: .85rem;
        outline: none;
        border: none;
        border-radius: .08rem;
        font-size: .36rem;
        color: #FFFFFF;
        margin: .33rem auto;
        display: block;
        overflow: hidden;
        letter-spacing: .08rem;
        background: -webkit-linear-gradient(#ff8a8b, #f70b4e); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(#ff8a8b, #f70b4e); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(#ff8a8b, #f70b4e); /* Firefox 3.6 - 15 */
        background: linear-gradient(#ff8a8b, #f70b4e);
      }

      .tip {
        color: #9a9da5;
        display: flex;
        justify-content: left;
        align-items: center;
        box-sizing: border-box;
        padding: 0 .41rem;
        padding-bottom: .1rem;

        i {
          width: .09rem;
          height: .09rem;
          border-radius: 50%;
          background: #9a9da5;
          display: block;
          margin-right: .17rem;
        }

        span {
          font-size: .28rem;
        }
      }

      .thumb {
        width: 6.63rem;
        height: 4.52rem;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .bounced {
      background-color: rgba(0, 0, 0, 0.6);
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 3;

      .order {
        width: 5.5rem;
        /*height: 6rem;*/
        background: #FFFFFF;
        border-radius: .18rem;
        position: absolute;
        /*top: 0;
        bottom: 0;*/
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: 3rem;

        .type {
          width: 100%;
          height: 3.58rem;
          margin-bottom: .99rem;

          .status {
            font-size: .36rem;
            color: #FFFFFF;
            text-align: center;
            padding-top: 1.5rem;
            padding-bottom: .48rem;
          }

          .money {
            font-size: .26rem;
            color: #FFFFFF;
            text-align: center;
            margin-bottom: .17rem;
          }

          .fail_info {
            padding-top: .2rem;
            font-size: .26rem;
            color: #FFFFFF;
            text-align: center;
          }
        }

        .success_type {
          background: url($ctxpath + "/static/customImgs/scanPay/top-up-success.png") center center no-repeat;
          background-size: 100% 100%;
        }

        .fail_type {
          background: url($ctxpath + "/static/customImgs/scanPay/top-up-fail.png") center center no-repeat;
          background-size: 100% 100%;
        }

        .btns {
          width: 100%;
          box-sizing: border-box;
          padding: 0 .26rem;
          padding-bottom: .26rem;
          display: flex;
          justify-content: space-between;

          button {
            width: 2.34rem;
            height: .66rem;
            font-size: .28rem;
            border-radius: .08rem;
            color: #FFFFFF;
            display: block;
            outline: none;
            border: none;
          }
        }

        .slogan {
          font-size: .24rem;
          text-align: center;
          color: #9a9da5;
          margin-bottom: .28rem;
        }

        .close {
          width: .55rem;
          height: .55rem;
          position: absolute;
          top: -0.55rem;
          right: -0.55rem;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
</style>
