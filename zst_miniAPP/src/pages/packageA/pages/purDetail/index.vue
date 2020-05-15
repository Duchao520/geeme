<template>
    <div class="purDetail">
        <div class="con_top">
           <div class="inner" @click="goShopDetail(detailMes)">
              <img style="margin-right:10rpx;" :src="detailMes.storeLogo" alt="">
              <span style="font-size: 30rpx;margin-right:10rpx;">{{detailMes.storeName}}</span>
              <i class="iconfont icon-youjiantou"></i>
           </div>
        </div>
       <div class="scond_inn">
             {{detailMes.actualReceiveMoney}}
       </div>
      <div class="thr_inn">
          <span v-if="detailMes.state==0">待付款</span>
          <span v-if="detailMes.state==1 && detailMes.orderType!=3">交易成功</span>
          <span v-if="detailMes.state==1 && detailMes.orderType==3">退款成功</span>
          <span v-if="detailMes.state==-1">失败</span>
          <span v-if="detailMes.state==2">退款</span>
      </div>
      <div class="four_inn">
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
            付款方式
          </div>
          <div class="eve_ri">
             {{detailMes.otherWay}}
          </div>
        </div>
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
            订单金额
          </div>
          <div class="eve_ri">
            {{detailMes.totalMoney}}
          </div>
        </div>
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
            优惠金额
          </div>
          <div class="eve_ri">
            {{detailMes.partakeMoney}}
          </div>
        </div>
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
            实付金额
          </div>
          <div class="eve_ri">
            {{detailMes.actualReceiveMoney}}
          </div>
        </div>
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le" v-if="detailMes.orderType != 3">
            优惠方式
          </div>
          <div class="eve_ri">
            {{detailMes.activeTypeStr}}
          </div>
        </div>
        <div class="eve_inn">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
            付款时间
          </div>
          <div class="eve_ri">
            {{detailMes.createTime}}
          </div>
        </div>
      </div>
      <div class="five_inner">
        <div class="five_btn" @click="goindex">
            关闭
        </div>
      </div>
    </div>
</template>

<script>
    import { getQuery , getSignIn , utf8Decode , toDate} from '@/common/js/comm'
    export default {
        name: "index",
        data(){
          return {
            orderNum:'',
            payWay:'',
            activeType:'',
            detailMes:'',
          }
        },
        mounted(){
          var par = getQuery();
          this.orderNum = par.orderNum;
          this.activeType = par.activeType;
          this.payWay = par.payWay;
          this.getdetail();
        },
        methods:{
          goShopDetail(par){
              wx.navigateTo({
                url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.shopStoreId}&distance=0`
              })
            },
            goindex(){
              wx.navigateBack({
                delta: 1
              })
            },
            getdetail(){
              var _self = this;
              var _data = {
                token:_self.$store.state.token,
                orderNum:_self.orderNum,
                activeType:_self.activeType,
                payWay:_self.payWay,
              }
              getSignIn(_data).then(sec=>{
                  _self.$http.getordermesDetail(_data,sec).then(res=>{
                      if(res.data.payWay==0){
                        res.data.otherWay = '卡主余额支付';
                      }else if(res.data.payWay==1){
                        res.data.otherWay = '支付宝付款';
                      }else if(res.data.payWay==2){
                        res.data.otherWay = '微信付款';
                      }else if(res.data.payWay==3){
                        res.data.otherWay = '银行卡付款';
                      }else if(res.data.payWay==6){
                        res.data.otherWay = '现金付款';
                      }else if(res.data.payWay==10){
                        res.data[i].otherWay = 'svip卡付款';
                      }
                      res.data.actualReceiveMoney = Math.abs((Number(res.data.actualReceiveMoney)));
                      res.data.totalMoney = Math.abs(Number(res.data.totalMoney));
                     res.data.createTime = toDate((Number(res.data.createTime))*1000);
                     _self.detailMes = res.data;
                  })
              })
            }
        }
    }
</script>

<style lang="scss" scoped>
.purDetail{
  width:710rpx;
  padding:0 20rpx;
  .con_top{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:50rpx;
    margin-bottom:38rpx;
    .inner{
      display: flex;
      img{
        width:50rpx;
        height:50rpx;
        border-radius: 50%;
        display: block;
      }
      i{
        font-size: 20rpx;
        line-height: 50rpx;
      }
    }
  }
  .scond_inn{
     width:100%;
     font-size: 60rpx;
     text-align: center;
  }
  .thr_inn{
    width:100%;
    font-size: 30rpx;
    display: flex;
    justify-content: center;
    color:#9A9DA5;
    border-bottom:2rpx solid rgba(229,229,229,1) ;
    padding-bottom:20rpx;
    margin-bottom:70rpx;
  }
  .four_inn{
    width:100%;
    margin-bottom:90rpx;
    .eve_inn{
      font-size: 28rpx;
      display: flex;
      justify-content: space-between;
      margin-bottom:10rpx;
      .eve_le{
        color:#9A9DA5;
      }
    }
  }
  .five_inner{
    width:100%;
    height:100rpx;
    .five_btn{
      width:700rpx;
      height:100rpx;
      background:#F60F51;
      color:#fff;
      font-size: 36rpx;
      text-align: center;
      line-height: 100rpx;
      border-radius: 10rpx;
    }
  }
}
</style>
