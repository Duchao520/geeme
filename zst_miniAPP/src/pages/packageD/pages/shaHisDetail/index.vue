<template>
  <div class="pur_purDetail">
    <div class="de_pur_fir">
      <div>消费金额 ：{{resdata.totalMoney}}元</div>
      <div>卡主折扣 ：{{resdata.mainCardDiscount * 1000/100}}折</div>
      <div>卡主共享卡折扣 ：{{resdata.shareCardDiscount * 1000/100}}折</div>
      <div>实付金额 ：{{resdata.shouldMoney}}元</div>
      <div>卡主余额扣除 ：{{resdata.payMoney}}元</div>
    </div>

    <div class="de_pur_fir">
      <div>付款日期 ：{{resdata.notifyTime}}</div>
      <div v-if="resdata.payWay === 0">支付类型 ：余额</div>
      <div v-if="resdata.payWay === 1">支付类型 ：支付宝</div>
      <div v-if="resdata.payWay === 2">支付类型 ：微信</div>
      <div>支付订单编号 ：{{resdata.orderNum}}</div>
      <div>消费门店 ：{{resdata.storeName}}</div>
      <div>用户昵称 ：{{resdata.nick}}</div>
      <div>卡主消费后余额 ：{{resdata.afterMoney}}元</div>
    </div>

    <div class="de_pur_sec">
      <div class="mon_num">
        佣金：{{resdata.totalMaincardProfit}}元
      </div>
      <div class="mon_every">
        <div>
          <div class="mon_title">技术服务费</div>
          <div class="mon_con">{{resdata.serviceRate * 10000/100}}%</div>
        </div>
        <div>
          <div class="mon_title">分享佣金比例</div>
          <div class="mon_con">{{resdata.shareCardCommissionRate * 10000/100}}%</div>
        </div>
        <div>
          <div class="mon_title">实际佣金收入</div>
          <div class="mon_con">{{resdata.actualMainCardProfit}}元</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { getSignIn , getQuery ,toDate} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  export default {
    name: "purDetail",
    data(){
      return {
        consumerId:'',
        resdata:''
      }
    },
    mounted(){
        var par = getQuery();
        this.consumerId = par.id;
        this.getPurList();
    },
    methods:{
      getPurList(){
        var _this = this;
        var _data = {
          token:this.$store.state.token,
          // token:'27a5b49bc0aa4e0791ec52c36292a065',
          consumelogId:_this.consumerId
        }
        getSignIn(_data).then(sec =>{
          _this.$http.getProfitDetail(_data,sec).then(res=>{
            console.log('后台没有数据吗',res.data);
            res.data.totalMoney = (res.data.totalMoney/100).toFixed(2);
            res.data.shouldMoney = (res.data.shouldMoney/100).toFixed(2);
            res.data.mainCardProfit = (res.data.mainCardProfit/100).toFixed(2);
            res.data.payMoney = (res.data.maincardShouldMoney/100).toFixed(2);
            res.data.notifyTime = toDate(res.data.notifyTime* 1000);
            res.data.actualMainCardProfit = floatTo.divide( res.data.actualMainCardProfit * 1000,100000);
            res.data.totalMaincardProfit = (res.data.totalMaincardProfit * 100/10000).toFixed(2);
            res.data.payMix = ((res.data.maincardBalance/100 - (res.data.totalMoney)*(res.data.mainCardDiscount))).toFixed(2);
            res.data.afterMoney = (res.data.afterMoney *100 /10000).toFixed(2);
            _this.resdata = res.data;
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pur_purDetail{
    width:94%;
    margin:0 3%;
    .de_pur_fir{
      width:100%;
      font-size:30rpx;
      padding: 50rpx 0;
      border-bottom:1px solid #E5E5E5;
      line-height: 60rpx;
    }
    .de_pur_sec{
      .mon_num{
        margin-top:48rpx;
        font-size: 34rpx;
        margin-bottom:46rpx;
      }
      .mon_every{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .mon_title{
          font-size: 24rpx;
        }
        .mon_con{
          font-size: 28rpx;
          text-align: center;
        }
      }
    }
  }
</style>
