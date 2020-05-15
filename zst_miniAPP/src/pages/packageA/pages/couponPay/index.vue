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
        <p class="fc-c">{{timeState}}</p>
      </div>
    </div>
    <div class="fz14 box">
      <p><span>应付金额</span><span class="fl-r fc-c">￥{{totalMoney}}</span></p>
      <p><span>优惠券抵扣</span><span class="fl-r fc-c">-￥{{couponMoney}}</span></p>
      <p><span>还需付款</span><span class="fl-r fc-r">￥{{shouldPayMoney}}</span></p>
    </div>
    <div class="fz14" style="margin-top:30rpx;">
      <p class="title">选择支付方式</p>
      <div class="flex-box">

        <div class="item" @click="wxPayYes">
          <div class="item_top">
            <img src="../../static/img/wx.png" style="width:80rpx;height:80rpx;"/>
          </div>
          <div class="item_bot">
              <i class="iconfont" :class="showwxPay?'icon-iconfontradiobox':'icon-danxuan' "></i><i style="margin-left:6rpx;">微信支付</i>
          </div>
        </div>

        <div class="item" @click="moneyPay">
          <div class="item_top">
            <img src="../../static/img/money.png" style="width:80rpx;height:80rpx;"/>
          </div>
          <div class="item_bot">
             <i class="iconfont" :class="showMoneyPay?'icon-iconfontradiobox':'icon-danxuan'"></i><i style="margin-left:6rpx;">现金支付</i>
          </div>
        </div>
      </div>
    </div>
    <button class="btns" @click="wxPay">确认支付</button>

  </div>
</template>

<script>


import {getQuery , toDate} from '@/common/js/comm'
import Tips from '@/common/js/tips'
  export default {
    name: 'payItem',
    data() {
      return {
        orderNum: '',
        storeName: '',
        consumeTime: '',
        shouldPayMoney: '',
        couponMoney: '',
        totalMoney: '',
        activeNum: '',
        storeId: '',
        integralCount:'',
        mercId:'',
        showwxPay: true,
        showMoneyPay:false,
        payState:1,
        trmNo:'',
        timeState:'',
        id:''
      }
    },
    mounted() {
       var par =getQuery();
       console.log(par);
       this.orderNum = par.orderNum;
       this.totalMoney = par.totalMoney;
       this.shouldPayMoney = par.shouldPayMoney;
       this.couponMoney = par.couponMoney;
       this.integralCount = par.integralCount;
       this.consumeTime = par.consumeTime;
       this.timeState = toDate(par.consumeTime *1000);
       this.storeName = par.storeName;
       this.storeId = par.storeId;
       this.activeNum = par.activeNum;
       this.mercId = par.mercId;
       this.trmNo = par.trmNo;
       this.id = par.id;
    },
    methods: {
      wxPayYes(){
        this.showwxPay = true;
        this.showMoneyPay =false;
        this.payState = '';
        this.payState = 1;
      },
      moneyPay(){
        console.log(2222,this.showwxPay);
        this.showwxPay = false;
        this.showMoneyPay = true;
        this.payState ='';
        this.payState = 0;
      },
      /*微信支付*/
      wxPay() {
        var _self = this;
        Tips.loading('请稍后...');
        console.log(_self.payState);
        if (_self.payState === '') {
          Tips.toast('请选择支付方式','none');
        } else {
          if ( _self.payState == 1) {
            var _data = {
              trmNo:_self.trmNo,
              storeId:_self.storeId,
              storeName:_self.storeName,
              miniAppId:'wx5e11922e81e3951d',
              activeNum:_self.activeNum,
              mercId:_self.mercId,
              payWay:'WXPAY',
              openid:_self.$store.state.openId,
              totalAmount:(_self.totalMoney)*10000/100,
              amount:(_self.shouldPayMoney)*10000/100,
              integralCount:0,
              subject:'用户扫码支付',
              wxUnionId:_self.$store.state.unionid,
              couponId:_self.id
            }
            _self.$http.scanPay(_data).then(res=>{
              Tips.loaded();
              wx.requestPayment({
                timeStamp: res.data.apiTimestamp,
                nonceStr: res.data.apiNoncestr,
                package: res.data.apiPackage,
                signType:res.data.apiSigntype,
                paySign:res.data.apiPaysign,
                success:function(recc){
                  Tips.toast(`付款成功`,'none');
                  // wx.switchTab({
                  //   url:`/pages/paySuc/main?amount=${(_self.shouldPayMoney)}&discount=${_self.integralCount /100}
                  //     &orderTime=${res.data.sysTime}&storeName=${_self.storeName}&order_no=${res.data.orderNo}&money=${(_self.totalMoney)}`
                  // })
                  wx.switchTab({
                    url:`/pages/index/main`
                  })
                },
                fail:function(res){
                  console.log('失败',res);
                  if(res.errMsg == 'requestPayment:fail cancel') {
                    Tips.toast(`已取消付款`, 'none');
                  }else{
                    console.log(res.errMsg);
                  }
                },
                complete:function(res){

                }
              })
            })

          } else if (_self.payState == 0) {
            wx.showModal({
              title: '提示',
              content: '确认已现金支付？',
              success: function (sm) {
                if (sm.confirm) {
                    wx.switchTab({
                      url:'../../../../pages/index/main'
                    })
                } else if (sm.cancel) {
                   console.log('用户点击取消')
                }
              }
            })
          }
        }
      },
    }
  }

</script>

<style lang="scss" scoped>
  .fz14 {
    font-size: 28rpx;
    p{
      display: flex;
      justify-content: space-between;
    }
  }

  .box {
    padding: 50rpx;
    border-bottom: 4rpx solid #D6D8DD;
    line-height: 1.5;
  }

  .flex-box {
    display: flex;
    justify-content: space-around;
    padding:60rpx 0;
  }

  .box > div {
    padding: 25rpx 0;
  }

  .item {
    .item_top{
      display: flex;
      justify-content: center;
      align-items:center ;
      padding:10rpx 0;
    }
    .item_bot{
      display: flex;
    }
  }

  .title {
    padding: 0 50rpx;
    line-height: 2;
  }


  .chexkbox {
    display: inline-block;
    width: 28rpx;
    height: 28rpx;
    border: 1px solid #8D8D8D;
    background-size: cover;
    vertical-align: middle;
    border-radius: 50%;
  }

  input:checked  .chexkbox {
    background-size: 14px 14px;
    border: none;
  }
  .btns{
    display: flex;
    width: 300rpx;
    height: 80rpx;
    background: #ff4f81;
    color: #FFFFFF;
    font-size: 30rpx;
    margin: 30rpx auto;
    border-radius: 10rpx;
    justify-content: center;
    align-items: center;
  }
</style>
