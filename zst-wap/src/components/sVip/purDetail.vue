<template>
  <div class="pur_purDetail">
    <toast ref="toast" :tip="tip"></toast>
    <div class="de_pur_fir">
      <div>消费金额 ：{{(resdata.totalMoney/100).toFixed(2)}}元</div>
      <div>卡主折扣 ：{{(resdata.mainCardDiscount*10).toFixed(1)}}折</div>
      <div>卡主共享卡折扣 ：{{(resdata.shareCardDiscount * 10).toFixed(1)}}折</div>
      <div>实付金额 ：{{(resdata.shouldMoney/100).toFixed(2)}}元</div>
      <div>卡主余额扣除 ：{{((resdata.maincardShouldMoney/100)).toFixed(2)}}元</div>
    </div>

    <div class="de_pur_fir">
      <div>付款日期 ：{{timestampToTime(resdata.notifyTime)}}</div>
      <div v-if="resdata.payWay === 0">支付类型 ：余额</div>
      <div v-if="resdata.payWay === 1">支付类型 ：支付宝</div>
      <div v-if="resdata.payWay === 2">支付类型 ：微信</div>
      <div>支付订单编号 ：{{resdata.orderNum}}</div>
      <div>消费门店 ：{{resdata.storeName}}</div>
      <div>用户昵称 ：{{resdata.nick}}</div>
      <div>卡主扣除后余额 ：{{(resdata.afterMoney/100).toFixed(2)}}元
      </div>
    </div>

    <div class="de_pur_sec">
      <div class="mon_num">
        佣金：{{(resdata.totalMaincardProfit/100).toFixed(2)}}元
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
          <div class="mon_con">{{(resdata.actualMainCardProfit/100).toFixed(4)}}元</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import toast from "@/components/common/toast"
  import {shareCardDetail} from '@/assets/js/comm'
  import {getSignIn, timestampToTime, postTitle} from '@/assets/js/jsBridge'

  export default {
    props: ['tokenPromise'],
    name: "purDetail",
    components: {
      toast
    },
    data() {
      return {
        consumerId: '',
        resdata: '',
        tip: ''
      }
    },
    mounted() {
      var _this = this;
      postTitle('分享卡记录消费详情');
      this.consumerId = this.$route.query.consumerId;
      _this.tokenPromise.then((res) => {
        _this.token = res;
        this.getPurList();
      })
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      getPurList() {
        var _self = this;
        var _data = {
          token: String(this.token),
          consumelogId: String(this.consumerId)
        }
        getSignIn(_data).then(result => {
          shareCardDetail(_data, result).then(res => {
            if(res.data.state == 1){
              _self.resdata = res.data.data;
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      timestampToTime(timestamp){
        return timestampToTime(timestamp);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pur_purDetail {
    width: 94%;
    margin: 0 3%;

    .de_pur_fir {
      width: 100%;
      font-size: .3rem;
      padding: .5rem 0;
      border-bottom: 1px solid #E5E5E5;
      line-height: .6rem;
    }

    .de_pur_sec {
      .mon_num {
        margin-top: .47rem;
        font-size: .34rem;
        margin-bottom: .45rem;
      }

      .mon_every {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .mon_title {
          font-size: .24rem;
        }

        .mon_con {
          font-size: .28rem;
          text-align: center;
        }
      }
    }
  }
</style>
