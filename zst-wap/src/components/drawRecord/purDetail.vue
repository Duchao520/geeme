<template>
    <div class="purDetail">
        <div class="con_top">
           <div class="inner" @click="goShopDetail(detailMes)">
              <img style="margin-right:0.1rem;" :src="detailMes.storeLogo" alt="">
              <span style="font-size: 0.3rem;margin-right:0.1rem;">{{detailMes.storeName}}</span>
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
        <div class="eve_inn" v-if="detailMes.orderType != 3">
          <!--付款方式 订单金额 优惠金额 实付金额 优惠方式  付款时间-->
          <div class="eve_le">
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
  import {getSignIn , getToken  , postTitle , ctxPath ,timestampToTime} from "@/assets/js/jsBridge";
  import {getordermesDetail} from "@/assets/js/getData"
  import vHead from '@/components/common/v-head'
    export default {
        name: "index",
        props:['tokenPromise'],
        components:{
          vHead
        },
        data(){
          return {
            orderNum:'',
            payWay:'',
            activeType:'',
            detailMes:'',
          }
        },
        mounted(){
          this.orderNum = this.$route.params.orderNum;
          this.activeType = this.$route.params.activeType;
          this.payWay = this.$route.params.payWay;
          var _self = this;
          _self.tokenPromise.then(res => {
            _self.token = res;
            _self.getdetail();
          })

        },
        methods:{
          goShopDetail(par){
            console.log(par.shopStoreId)
              this.$router.push({path:'sellerDetail',query:{
                  shopStoreId:par.shopStoreId,
                  distance:0,
                }})
            },
            goindex(){
              this.$router.push({path:'purHistory'})
            },
            getdetail(){
              var _self = this;
              var _data = {
                token:_self.token,
                orderNum:_self.orderNum,
                activeType:_self.activeType,
                payWay:_self.payWay,
              }
              getSignIn(_data).then(sec=>{
                  getordermesDetail(_data,sec).then(res=>{
                      res.data = res.data.data;
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
                     res.data.createTime = timestampToTime((Number(res.data.createTime))*1000);
                     _self.detailMes = res.data;
                  })
              })
            }
        }
    }
</script>

<style lang="scss" scoped>
.purDetail{
  width:7.1rem;
  padding:0 0.2rem;
  .con_top{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:0.5rem;
    margin-bottom:0.38rem;
    .inner{
      display: flex;
      img{
        width:0.5rem;
        height:0.5rem;
        overflow: hidden;
        border-radius: 50%;
        display: block;
      }
      i{
        font-size: 0.2rem;
        line-height: 0.5rem;
      }
    }
  }
  .scond_inn{
     width:100%;
     font-size: 0.6rem;
     text-align: center;
  }
  .thr_inn{
    width:100%;
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    color:#9A9DA5;
    border-bottom:0.02em solid rgba(229,229,229,1) ;
    padding-bottom:0.2rem;
    margin-bottom:0.7rem;
  }
  .four_inn{
    width:100%;
    margin-bottom:0.9rem;
    .eve_inn{
      font-size: 0.28rem;
      display: flex;
      justify-content: space-between;
      margin-bottom:0.1rem;
      .eve_le{
        color:#9A9DA5;
      }
    }
  }
  .five_inner{
    width:100%;
    height:1rem;
    .five_btn{
      width:7rem;
      height:1rem;
      background:#F60F51;
      color:#fff;
      font-size: 0.36rem;
      text-align: center;
      line-height: 1rem;
      border-radius: 0.1rem;
    }
  }
}
</style>
