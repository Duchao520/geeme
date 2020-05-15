<template>
    <div class="page">
       <div class="page_top">
          <div class="inc_price">
              <div class="inc_top">
                  {{dataAccount.canPostalAmounts}}
              </div>
              <div class="inc_bot">
                 推广收益（元）
              </div>
          </div>

         <div class="inc_le_ri">

           <div class="inc_le">
             <div style="font-size: 28rpx;">本月预估收入(元)</div>
             <div style="font-size: 24rpx;display: flex;justify-content: center;">
               <span>{{ dataAccount.thisMthPreInCome }}</span>
               <span style="border:2rpx solid #fff;margin-left:8rpx;padding:0 10rpx;font-size: 18rpx;height:28rpx;display:flex;justify-content: center;align-items: center;">待结算</span>
             </div>
           </div>

           <div class="inc_le" style="border:none;">
             <div style="font-size: 28rpx;">上月预估收入(元)</div>
             <div style="font-size: 24rpx;display: flex;justify-content: center;">
               <span>{{ dataAccount.lastMthPreInCome  }}</span>
               <span style="border:2rpx solid #fff;margin-left:8rpx;padding:0 10rpx;font-size: 18rpx;height:28rpx;display:flex;justify-content: center;align-items: center;">已结算</span>
             </div>
           </div>

         </div>
         <div class="in_fot">
           注：上月预估收入在本月23号结算
         </div>
       </div>
       <div class="page_mid">
          <div class="page_head">

              <div class="income_head">
                <img src="../../static/img/tixing.png" alt="">
                <div class="incom_text">
                    历史总收益：{{dataAccount.hisTradeCommission}}元
                </div>
              </div>

              <div class="tab_income">
                  <div class="tab_inner">
                      <div class="tab_inner_le" :class="showTab==1?'active':''" v-if="okCli"  @click="tabLe(1)">
                         已结算
                      </div>
                      <div class="tab_inner_le" :class="showTab==1?'active':''" v-if="!okCli">
                         已结算
                      </div>
                      <div class="tab_inner_ri" :class="showTab==2?'active':''" v-if="noCli"  @click="tabLe(2)">
                         预收入
                      </div>
                     <div class="tab_inner_ri" :class="showTab==2?'active':''"  v-if="!noCli">
                         预收入
                      </div>
                  </div>
              </div>
            <div v-for="(item,index) in  dataOther" :key="index">
              <div class="income_today" v-if="item.newArr.length != 0">
                  <div style="font-size:24rpx;">{{item.transDate}}</div>
                  <div style="font-size:20rpx;color: #000;opacity:0.6;">共{{item.totalOrder}}笔收益    预估收入￥{{item.totalMoney}}</div>
              </div>

              <div class="income_eve" v-if="item.newArr.length!=0" v-for="(inx,index2) in item.newArr" :key="index2">
                <!--{{inx.platform}}-->
                <!--显示这里是订单数据*********-->
                <div  v-if="inx.platform == 1 || inx.platform == 2 || inx.platform == 9">
                  <div class="in_eve_title">
                     <span>用户账号：{{inx.username}}</span>
                     <!--<span style="color:#F7094D;">订单付款</span>-->
                  </div>
                  <div class="pay_con">
                    <!--platform : （0其他 1淘宝  2京东 3推广 4会员推荐联盟商家充值 9为拼多多-->
                     <img v-if="inx.platform == 1" src="../../static/img/tbLogo.png" alt="">
                     <img v-else-if="inx.platform == 2" src="../../static/img/jdLogo.png" alt="">
                     <img v-else-if="inx.platform == 3" src="../../static/img/vipLogo.png" alt="">
                     <img v-else-if="inx.platform == 9" src="../../static/img/pddLogo.png" alt="">
                     <img v-else src="../../static/img/shop.png" alt="">

                    <span style="font-size: 24rpx;">{{inx.title}}</span>
                  </div>
                  <div class="pay_detail">
                      <div v-if="inx.shopName">店铺名称：{{inx.shopName}}</div>
                      <div>创建时间：{{inx.createDateTimeStr}}</div>
                      <div>结算时间：{{inx.transTime}}</div>
                  </div>

                  <div class="pay_bot">
                      <div class="pay_bot_eve">
                          <div class="pay_eve_top">
                             收入比例
                          </div>
                          <div class="pay_eve_bot">
                                {{(inx.incomeRatio) *1000/10 +'%'}}
                          </div>
                      </div>

                    <div class="pay_bot_eve">
                      <div class="pay_eve_top">
                        分成比例
                      </div>
                      <div class="pay_eve_bot">
                        {{(inx.fenChengRate) *1000/10 +'%' }}
                      </div>
                    </div>

                    <div class="pay_bot_eve">
                      <div class="pay_eve_top">
                        付款金额
                      </div>
                      <div class="pay_eve_bot">
                        ￥{{(inx.payMoney)}}
                      </div>
                    </div>

                    <div class="pay_bot_eve">
                      <div class="pay_eve_top">
                        收益金额
                      </div>
                      <div class="pay_eve_bot">
                         ￥{{inx.transMoney}}
                      </div>
                    </div>
                  </div>
                </div>
                <!--这里显示非订单数据*********-->

                <div v-else>
                  <div class="in_eve_title">
                    <!--<span>用户账号：{{inx.username}}</span>-->
                    <!--<span style="color:#F7094D;">订单付款</span>-->
                  </div>

                  <div class="pay_con">
                    <img v-if="inx.platform == 1" src="../../static/img/tbLogo.png" alt="">
                    <img v-else-if="inx.platform == 2" src="../../static/img/jdLogo.png" alt="">
                    <img v-else-if="inx.platform == 3" src="../../static/img/vipLogo.png" alt="">
                    <img v-else-if="inx.platform == 9" src="../../static/img/pddLogo.png" alt="">
                    <img v-else src="../../static/img/shop.png" alt="">
                    <span style="font-size: 24rpx;">{{inx.title}}</span>
                  </div>

                  <div class="pay_detail" style="display: flex;justify-content: space-between;align-items: center;opacity: 1;">
                    <div class="pay_de_le" style="opacity: .6">
                      <wxParse :content="inx.remark" @preview="preview" @navigate="navigate" />
                      <!--<div>结算时间：{{inx.createDateTimeStr}}</div>-->
                    </div>
                    <div class="pay_de_ri">
                      <div class="pay_de_top">
                        收益金额
                      </div>
                      <div class="pay_de_bot">
                        ￥{{inx.transMoney}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
       </div>
      </div>

      <div class="footer">
        {{notice_mes}}
      </div>
    </div>
</template>

<script>
  import { getSignIn , getYeMoDa ,toDate} from '@/common/js/comm'
  import wxParse from 'mpvue-wxparse'
  import Tips from '@/common/js/tips'
    export default {
        name: "index",
        data(){
          return {
            showTab:1,
            dataList:[
              {'moName':'收入比例','moRate':'30%'},
              {'moName':'分成比例','moRate':'50%'},
              {'moName':'付款金额','moRate':'￥5000.00'},
              {'moName':'收益金额','moRate':'￥210.00'},
            ],
            dataAccount:'',
            dataArray:[],
            dataOther:[],
            notice_mes:'',

            parData:{
              token:this.$store.state.token,
              typeGroup:1,
              pageNum:1,
              pageSize:10,
              limit:20,
            },
            okCli:true,
            noCli:true,
          }
        },
        components: {
          wxParse
        },
        mounted(){
          this.getAccp();
          this.dataOther = [];
          this.parData.pageNum = 1;
          this.getPreAll(this.parData);
        },
        methods:{
          tabLe(par){
              this.showTab = par;
              if(par == 1){
                 this.dataOther = [];
                 this.parData.pageNum = 1;
                 this.okCli = false;
                 this.noCli = true;
                 this.getPreAll(this.parData);
              }
              else if(par == 2){
                  this.dataOther = [];
                  this.parData.pageNum = 1;
                this.okCli = true;
                this.noCli = false;
                  this.getPre(this.parData);
              }
          },
          getAccp(){
             var _this = this;
             var _data = {
               token:this.$store.state.token
             }
             getSignIn(_data).then(sec=>{
                _this.$http.getAccount(_data,sec).then(res=>{
                  if(res.state==1) {
                    res.data.hisTradeCommission = parseFloat(res.data.hisTradeCommission).toFixed(2);
                    res.data.thisMthInCome = parseFloat(res.data.thisMthInCome).toFixed(2);
                    res.data.lastMthPreInCome = parseFloat(res.data.lastMthPreInCome).toFixed(2);
                    res.data.hisTradeCommission = parseFloat(res.data.hisTradeCommission).toFixed(2);
                    res.data.thisMthPreInCome = parseFloat(res.data.thisMthPreInCome).toFixed(2);
                    _this.dataAccount = res.data;
                  }else{
                    Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                  }
                })
             })
          },
          //预收入的
          getPre(_data){
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getPreincome(_data,sec).then(res=>{
                if(res.state==1) {
                  if (res.data.length != 0) {
                    for (var i = 0; i < res.countPreincomeOrderlog.length; i++) {
                      res.countPreincomeOrderlog[i].newArr = [];
                      for (let j = 0; j < res.data.length; j++) {
                        if (_this.getYeMoDa(res.countPreincomeOrderlog[i].transDate) == getYeMoDa(res.data[j].transTime *1000)) {
                          res.countPreincomeOrderlog[i].newArr.push(res.data[j]);
                        }
                      }
                    }
                    var dada = res.countPreincomeOrderlog;
                    for (let k = 0; k < dada.length; k++) {
                      for (let f = 0; f < dada[k].newArr.length; f++) {
                        dada[k].newArr[f].transTime = toDate((dada[k].newArr[f].transTime) * 1000);
                      }
                    }
                    _this.dataOther = _this.dataOther.concat(res.countPreincomeOrderlog);
                  } else {
                    _this.notice_mes = '没有更多数据了';
                  }
                }else{
                  Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                }
              })
            })
          },
          getYeMoDa(timeStamp) {
            // var newDate = new Date(timeStamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var times = timeStamp.replace('-', '/');
            var newTimes = times.replace('-', '/');
            var newDate = new Date(newTimes);
            var Y = newDate.getFullYear() + '-';
            var M = (newDate.getMonth() < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1) + '-';
            var D = (newDate.getDate() < 10 ? '0' + (newDate.getDate()) : newDate.getDate()) + ' ';
            return Y + M + D
          },
          // 已结算的
          getPreAll(_data){
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getPreAll(_data,sec).then(res=>{
                  if(res.state==1) {
                      var head = res.countZstamountlog;
                      for (let i = 0; i < res.countZstamountlog.length; i++) {
                        res.countZstamountlog[i].transDate = _this.getYeMoDa(String(res.countZstamountlog[i].transDate));
                        res.countZstamountlog[i].newArr = [];
                        for (let j = 0; j < res.data.length; j++) {
                          if (_this.getYeMoDa(res.countZstamountlog[i].transDate) == getYeMoDa(res.data[j].transTime * 1000)) {
                            res.countZstamountlog[i].newArr.push(res.data[j]);
                          }
                        }
                      }
                      var dada = res.countZstamountlog;
                      for (let k = 0; k < dada.length; k++) {
                        for (let f = 0; f < dada[k].newArr.length; f++) {
                          dada[k].newArr[f].transTime = toDate((dada[k].newArr[f].transTime) * 1000);
                        }
                      }
                      if (res.data.length != 0) {
                        _this.dataOther = _this.dataOther.concat(dada);
                        console.log('11111',_this.dataOther);
                      } else {
                        _this.notice_mes = '没有更多数据了';
                      }
                    }else{
                      Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                    }
              })
            })
          },
          getZsta(){
            var _data = {

            }
          }
      },
      async onReachBottom() {
        // 到这底部在这里需要做什么事情
        this.notice_mes = '加载中...';
        this.parData.pageNum ++;
        if(this.notice_mes == '没有更多数据了'){
          return false;
        }
        if(this.showTab == 1){
          this.getPreAll(this.parData)
        }
        else if(this.showTab == 2){
          this.getPre(this.parData)
        }

      },

    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  overflow: hidden;
  .footer{
    width:100%;
    height:100rpx;
    background:#fff;
    text-align: center;
    line-height:100rpx;
  }
  .page_top{
    width:100%;
    background:linear-gradient(0deg,rgba(247,9,77,1),rgba(255,139,139,1));
    padding-bottom:20rpx;
    .inc_price{
      width:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .inc_top{
        font-size: 100rpx;
        color:#fff;
        height:100rpx;
        padding-bottom:20rpx;
        margin-top:60rpx;
        line-height:100rpx;
      }
      .inc_bot{
        font-size: 30rpx;
        color:#fff;
      }
    }
    .inc_le_ri{
      width:710rpx;
      margin: 0 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color:#fff;
      .inc_le{
        width:50%;
        height:94rpx;
        border-right:2rpx solid #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

      }
    }
    .in_fot{
       width:710rpx;
       padding:12rpx 0;
       background:#e91a50;
       margin:0 20rpx;
       display: flex;
       justify-content: center;
       align-items: center;
       border-radius: 30rpx;
       font-size: 24rpx;
       color:#fff;
       margin-top:20rpx;
    }
  }
  .page_mid{
    width:100%;
    background:#F7094D;
    overflow: hidden;
    .page_head{
      width:100%;
      background:#fff;
      border-top-left-radius: 30rpx;
      border-top-right-radius: 30rpx;
      .income_head{
        width:372rpx;
        height:55rpx;
        position: relative;
        margin: 0 auto;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .incom_text{
          position: absolute;
          left:0;
          top:0;
          font-size: 24rpx;
          display: flex;
          width:372rpx;
          height: 55rpx;
          justify-content: center;
          align-items: center;
          color:#fff;
        }
      }
      .tab_income{
        width:710rpx;
        margin:0 20rpx;
        .tab_inner{
          width:100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding:24rpx 0;
          padding-bottom:6rpx;
          .tab_inner_le{
            padding:0 40rpx;
            border-bottom:4rpx solid #fff;
          }
          .tab_inner_ri{
            padding:0 40rpx;
            border-bottom:4rpx solid #fff;
          }
          .active{
            border-bottom:4rpx solid #F7094D;
            color:#F7094D;
          }
        }
      }
      .income_today{
        width:710rpx;
        height:74rpx;
        padding:0 20rpx;
        background:rgba(238,238,238,1);
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
      .income_eve{
        width: 710rpx;
        background:#fffff;
        padding:20rpx 20rpx;
        border-bottom:10rpx solid #eeeeee;
        .in_eve_title{
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
        }
        .pay_con{
          height:25rpx;
          line-height: 25rpx;
          margin-top:18rpx;
          margin-bottom:46rpx;
          img{
            width:25rpx;
            height:25rpx;
            display: block;
            float: left;
            margin-right:10rpx;
          }
        }
        .pay_detail{
          font-size: 24rpx;
          color:rgba(0,0,0,1);
          opacity: 0.6;
          margin-bottom:16rpx;
          .pay_de_le{

          }
          .pay_de_ri{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .pay_de_top{
              font-size: 20rpx;
            }
            .pay_de_bot{
              font-size: 24rpx;
              border:2px solid #eee;
              padding:4rpx 30rpx;
              border-radius: 40rpx;
              background:#FFA61A;
              color: #fff;
            }
          }
        }
        .pay_bot{
          display: flex;
          justify-content: space-around;
          align-items: center;
          .pay_bot_eve{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .pay_eve_top{
              font-size: 18rpx;
              margin-bottom:10rpx;
            }
            .pay_eve_bot{
              font-size: 24rpx;
              border:2px solid #eee;
              padding:4rpx 30rpx;
              border-radius: 40rpx;
            }
          }
          .pay_bot_eve:last-child{
            .pay_eve_bot{
              border:none;
              background:#FFA61A;
              color:#fff;
            }
          }
        }
      }
    }
  }
}
</style>
