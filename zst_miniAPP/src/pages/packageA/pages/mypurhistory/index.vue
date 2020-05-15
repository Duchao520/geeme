<template>
    <div class="mypurHistory">
       <div class="all_con">
          <div class="mypur_con"  v-if="dataList.length!=0">
            <div class="eve_inner" id="the-id"  :data-id="item" v-for="(item,index) in dataList" :key="index">
              <div class="mypur_top" v-if="fixedNav">
                <picker mode="date" :end="endDate" :value="date"  fields="month"  @change="bindDateChange">
                  <div class="le_mypur_top">
                   <span class="picker">
                      {{date}}
                   </span>
                    <i class="iconfont icon-xiajiantou2"></i>
                  </div>
                </picker>
                <div class="ri_mypur_top">
                  累计消费  ￥{{totalConsumeMoney}}
                </div>
              </div>
                <div>
                  <div class="mycurpur_top"  v-if="fixedNav && index!=0">
                    <picker mode="date" :end="endDate" :value="item.month"  fields="month"  @change="bindDateChange">
                      <div class="le_mypur_top">
                         <span class="picker">
                            {{item.month}}
                         </span>
                        <i class="iconfont icon-xiajiantou2"></i>
                      </div>
                    </picker>
                    <div class="ri_mypur_top">
                       累计消费 ￥{{item.totalConsumeMoney}}
                    </div>
                  </div>
                  <div class="bot_con" v-for="(itm,inex) in item.data" :key="inex" @click="gopurDetail(itm)">
                    <div style="display: flex;padding:20rpx 20rpx;">
                     <div class="le_inner">
                        <img :src="itm.storeLogo" alt="">
                     </div>
                      <div class="all_inner">
                         <div class="ri_inner">
                              <div class="ri_top">{{itm.storeName}}</div>
                              <div class="ri_mid"><span style="margin-right:10rpx;">{{itm.otherWay}}</span> <span>{{itm.otheractWay}}</span></div>
                              <div class="ri_bot">{{itm.createTime}}</div>
                         </div>

                       <div class="ri_ri_inner">
                          <div class="top_mes" style="font-size: 30rpx;color:#FF0049;margin-bottom:10rpx;font-weight: bold;display: flex;justify-content:flex-end ">
                              {{itm.actualReceiveMoney}}
                          </div>
                          <div class="bot_mes" style="font-size: 24rpx;color:#9A9DA5;" v-if="itm.partakeMoney!=0">
                             省￥{{itm.partakeMoney}}
                          </div>
                       </div>
                      </div>
                    </div>
                </div>
                </div>
            </div>
          </div>

          <div class="mypur_con" v-if="dataList.length==0">
             <no-data :showNoData ="noData" :noticeMes="conNot"/>
          </div>
       </div>
    </div>
</template>

<script>
    import { getQuery , getSignIn , utf8Decode , toDate} from '@/common/js/comm'
    import noData from '@/components/noData';
    export default {
        name: "index",
        data(){
          return {
            date: '2019',
            pageNum:1,
            dataList:[],
            totalConsumeMoney:'',
            noData:'',
            conNot:'',
            scrollTop:'',
            fixedNav:true,
            selecMes:0,
            endDate:''
          }
        },
        components:{
          noData
        },
        mounted(){
          var _self = this;
          _self.getCurrentdate();
         _self.getcurHistoryduser();
        },
        methods:{
          upper(e) {

          },
          bindDateChange(e){
            this.date = e.target.value;
            this.pageNum=1;
            this.selecMes =1;
            this.dataList = [];
            this.getpurHistoryduser();
          },
          getcurHistoryduser(){
                var _self = this;
                var _data = {
                    token:_self.$store.state.token,
                    month:'',
                    pageNum:_self.pageNum,
                    pageSize:10,
                }
                getSignIn(_data).then(sec=>{
                    _self.$http.getpurHistoryduser(_data,sec).then(res=>{
                        for(let i=0;i<res.data.length;i++){
                            for(let j=0;j<res.data[i].data.length;j++){
                                    if(res.data[i].data[j].activeType==0){
                                        res.data[i].data[j].otheractWay = '无活动';
                                    }else if(res.data[i].data[j].activeType==1){
                                        res.data[i].data[j].otheractWay = '积分活动';
                                    }else if(res.data[i].data[j].activeType==2){
                                        res.data[i].data[j].otheractWay = '卡券活动';
                                    }else if(res.data[i].data[j].activeType==3){
                                        res.data[i].data[j].otheractWay = 'svip卡消费';
                                    }else if(res.data[i].data[j].activeType==4){
                                        res.data[i].data[j].otheractWay = '共享卡+优惠券';
                                    }else if(res.data[i].data[j].activeType==5){
                                        res.data[i].data[j].otheractWay = '积分活动 + 优惠券';
                                    }else if(res.data[i].data[j].activeType==6){
                                        res.data[i].data[j].otheractWay = '联盟打折卡';
                                    }else if(res.data[i].data[j].activeType==7){
                                        res.data[i].data[j].otheractWay = '联盟打折卡 + 优惠券';
                                    }
                                    if(res.data[i].data[j].payWay==0){
                                        res.data[i].data[j].otherWay = '卡主余额支付';
                                    }else if(res.data[i].data[j].payWay==1){
                                        res.data[i].data[j].otherWay = '支付宝付款';
                                    }else if(res.data[i].data[j].payWay==2){
                                        res.data[i].data[j].otherWay = '微信付款';
                                    }else if(res.data[i].data[j].payWay==3){
                                        res.data[i].data[j].otherWay = '银行卡付款';
                                    }else if(res.data[i].data[j].payWay==6){
                                        res.data[i].data[j].otherWay = '现金付款';
                                    }else if(res.data[i].data[j].payWay==10){
                                        res.data[i].data[j].otherWay = 'svip卡付款';
                                    }
                                     res.data[i].data[j].actualReceiveMoney = - (Number(res.data[i].data[j].actualReceiveMoney));
                                    res.data[i].data[j].createTime = toDate((Number(res.data[i].data[j].createTime))*1000);
                            }
                        }
                        if(_self.dataList.length==0){
                            _self.dataList = _self.dataList.concat(res.data);
                        }else{
                            var dataLen =  _self.dataList.length;
                            var lastMonth = _self.dataList[dataLen-1].month;
                            for(let k=0;k<res.data.length;k++){
                                if(res.data[k].month == lastMonth){
                                    _self.dataList[dataLen-1].data = _self.dataList[dataLen-1].data.concat(res.data[k].data);
                                }else{
                                    _self.dataList = _self.dataList.concat(res.data[k]);
                                }
                            }
                        }
                        _self.totalConsumeMoney = _self.dataList[0].totalConsumeMoney;
                        if(_self.dataList.length==0){
                            _self.noData = true;
                            _self.conNot = '当前无消费信息';
                        }else{
                            _self.noData = false;
                            _self.conNot = '';
                        }
                    })
                })
            },
          getpurHistoryduser(){
            var _self = this;
            var _data = {
              token:_self.$store.state.token,
              month:`${_self.date}-01`,
              pageNum:_self.pageNum,
              pageSize:10,
            }
            getSignIn(_data).then(sec=>{
                _self.$http.getpurHistoryduser(_data,sec).then(res=>{
                    for(let i=0;i<res.data.length;i++){
                        for(let j=0;j<res.data[i].data.length;j++){
                            if(res.data[i].data[j].activeType==0){
                                res.data[i].data[j].otheractWay = '无活动';
                            }else if(res.data[i].data[j].activeType==1){
                                res.data[i].data[j].otheractWay = '积分活动';
                            }else if(res.data[i].data[j].activeType==2){
                                res.data[i].data[j].otheractWay = '卡券活动';
                            }else if(res.data[i].data[j].activeType==3){
                                res.data[i].data[j].otheractWay = 'svip卡消费';
                            }else if(res.data[i].data[j].activeType==4){
                                res.data[i].data[j].otheractWay = '共享卡+优惠券';
                            }else if(res.data[i].data[j].activeType==5){
                                res.data[i].data[j].otheractWay = '积分活动 + 优惠券';
                            }else if(res.data[i].data[j].activeType==6){
                                res.data[i].data[j].otheractWay = '联盟打折卡';
                            }else if(res.data[i].data[j].activeType==7){
                                res.data[i].data[j].otheractWay = '联盟打折卡 + 优惠券';
                            }
                            if(res.data[i].data[j].payWay==0){
                                res.data[i].data[j].otherWay = '卡主余额支付';
                            }else if(res.data[i].data[j].payWay==1){
                                res.data[i].data[j].otherWay = '支付宝付款';
                            }else if(res.data[i].data[j].payWay==2){
                                res.data[i].data[j].otherWay = '微信付款';
                            }else if(res.data[i].data[j].payWay==3){
                                res.data[i].data[j].otherWay = '银行卡付款';
                            }else if(res.data[i].data[j].payWay==6){
                                res.data[i].data[j].otherWay = '现金付款';
                            }else if(res.data[i].data[j].payWay==10){
                                res.data[i].data[j].otherWay = 'svip卡付款';
                            }
                            res.data[i].data[j].actualReceiveMoney = - (Number(res.data[i].data[j].actualReceiveMoney));
                            res.data[i].data[j].createTime = toDate((Number(res.data[i].data[j].createTime))*1000);
                        }
                    }
                    if(_self.dataList.length==0){
                        _self.dataList = _self.dataList.concat(res.data);
                    }else{
                        var dataLen =  _self.dataList.length;
                        var lastMonth = _self.dataList[dataLen-1].month;
                        for(let k=0;k<res.data.length;k++){
                            if(res.data[k].month == lastMonth){
                                _self.dataList[dataLen-1].data = _self.dataList[dataLen-1].data.concat(res.data[k].data);
                            }else{
                                _self.dataList = _self.dataList.concat(res.data[k]);
                            }
                        }
                    }
                    _self.totalConsumeMoney = _self.dataList[0].totalConsumeMoney;
                    if(_self.dataList.length==0){
                        _self.noData = true;
                        _self.conNot = '当前无消费信息';
                    }else{
                        _self.noData = false;
                        _self.conNot = '';
                    }
                })
            })
          },
          getCurrentdate(){
            var today = new Date();//获得当前日期
            var year = today.getFullYear();//获得年份
            var month = today.getMonth() + 1;//此方法获得的月份是从0---11，所以要加1才是当前月份
            if(month<10){
              month = `0${month}`
            }
            this.date = `${year}-${month}`;
            this.endDate =  `${year}-${month}-01`;
          },
          gopurDetail(par){
            wx.navigateTo({
              url: `/pages/packageA/pages/purDetail/main?orderNum=${par.orderNum}&payWay=${par.payWay}&activeType=${par.activeType}`
            })
          },
        },
        onPageScroll (e) {
            this.scrollTop = e.scrollTop;
            var _this = this;
            let query = wx.createSelectorQuery()
            query.selectAll('.eve_inner').boundingClientRect( (rect) => {
                let top = rect.top
                for(let i=0;i<rect.length;i++){
                    if(rect[i].top<=0){
                        _this.date = rect[i].dataset.id.month;
                        _this.totalConsumeMoney = rect[i].dataset.id.totalConsumeMoney;
                    }
                }
            }).exec()
        },
        async onReachBottom() {
          this.pageNum ++;
          if(this.selecMes==0) {
            this.getcurHistoryduser();
          }else{
            this.getpurHistoryduser();
          }
        },
    }
</script>

<style lang="scss" scoped>
.mypur_top{
  width:710rpx;
  padding:0 20rpx;
  height:100rpx;
  background:#F1F1F1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top:0;
  left:0;
  z-index:99;
  .le_mypur_top{
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    background:#fff;
    padding:4rpx 24rpx;
    border-radius: 38rpx;
    i{
      line-height: 36rpx;
    }
  }
  .ri_mypur_top{
    color:#9A9DA5;
    font-size: 28rpx;
  }
}
.mypur_con{
  .eve_inner{
    /*display: flex;*/
    /*padding:20rpx 0;*/
    .mycurpur_top{
      width:710rpx;
      height:100rpx;
      padding:0 20rpx;
      background:#F1F1F1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .le_mypur_top{
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        background:#fff;
        padding:4rpx 24rpx;
        border-radius: 38rpx;
        i{
          line-height: 36rpx;
        }
      }
      .ri_mypur_top{
        color:#9A9DA5;
        font-size: 28rpx;
      }
    }
    .all_inner{
      display: flex;
      justify-content: space-between;
      flex: 1;
      padding-bottom:10rpx;
      border-bottom:2rpx solid rgba(229,229,229,1);
    }
    .le_inner{
      width:70rpx;
      height:70rpx;
      border-radius: 50%;
      background:#ff6700;
      margin-right:20rpx;
      img{
        width:100%;
        height:100%;
        border-radius: 50%;
        display: block;
      }
    }
    .ri_inner{
      .ri_top{
        width:450rpx;
        font-size: 30rpx;
        margin-bottom:20rpx;
        @include ovh;
      }
      .ri_mid{
        width:450rpx;
        font-size: 24rpx;
        margin-bottom:18rpx;
        @include ovh
      }
      .ri_bot{
        width:450rpx;
        font-size: 24rpx;
        color:#9A9DA5;
        @include ovh
      }
    }
  }
  .eve_inner:first-child{
    margin-top:100rpx;
  }
}
</style>
