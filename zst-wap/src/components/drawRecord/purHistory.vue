<template>
     <div class="mypurHistory">
       <div class="mycurpur_top">
         <div class="le_mypur_top">
           <x-button type="default"
                     plain
                     @click.native="startSelector = true" :text="calcuBeginTime"></x-button>
           <i class="iconfont icon-xia"></i>
         </div>
         <div class="ri_mypur_top">
           累计消费  ￥{{totalConsumeMoney}}
         </div>
       </div>
        <div class="bag-scroll" ref="myScroll" v-if="dataList.length!=0">
          <div class="scroll-container">
             <div class="eve_inner" ref="the-id" :data-month="item.month" :data-money="item.totalConsumeMoney"  v-for="(item,index) in dataList" :key="index">
                 <div class="mypur_top" v-if="index!=0">
                   <div class="le_mypur_top">
                     <x-button type="default"
                               plain
                               @click.native="startSelector = true" :text="item.month"></x-button>
                     <i class="iconfont icon-xia"></i>
                   </div>
                   <div class="ri_mypur_top">
                     累计消费  ￥{{item.totalConsumeMoney}}
                   </div>
                 </div>
                   <div style="width:7.1rem;padding:0 0.2rem;">
                   <div class="bot_con" style="width:100%;padding:0.2rem 0;" v-for="(itm,inex) in item.data" :key="inex" @click="gopurDetail(itm)">
                     <div style="display: flex;padding:20rpx 20rpx;" @click="gopurDetail(itm)">
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
                           <div class="top_mes" style="color:#FF0049;margin-bottom:0.1rem;font-weight: bold;display: flex;justify-content:flex-end;font-size:0.30rem;">
                             {{itm.actualReceiveMoney}}
                           </div>
                           <div class="bot_mes" style="font-size:0.24rem;color:#9A9DA5;" v-if="itm.partakeMoney!=0">
                             省￥{{itm.partakeMoney}}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
          </div>
          </div>
        </div>
        <no-data :showNoData="showNoData" :noticeMes="noticeMes" />

        <group v-show="false">
          <datetime v-model="calBeginTime"
                    :show.sync="startSelector"
                    :format="'YYYY-MM'"
                    :end-date="end_date"
                    @on-confirm="onConfirmStart"></datetime>
        </group>
    </div>
</template>

<script>
  import {getSignIn , getToken  , postTitle , ctxPath ,timestampToTime} from "@/assets/js/jsBridge";
  import {getpurHistoryduser} from "@/assets/js/getData"
  import { XButton,Datetime, Group,} from 'vux'
  import noData from '@/components/common/noData'
  import BScroll from 'better-scroll';
  export default {
    name: "purHistory",
    data(){
      return {
        date: '',
        pageNum:1,
        dataList:[],
        totalConsumeMoney:'',
        noData:'',
        conNot:'',
        token:'',
        beginTime:'',
        startSelector: false,
        end_date: '',
        calBeginTime: '',
        calEndTime: '',
        value: '',
        tip: '',
        isShow: false,
        showNoData:'',
        noticeMes:'',
        fixedNav:true,
        calcuBeginTime:'',
        selecMes:0,
        scrolltop:''
      }
    },
    props:['tokenPromise'],
    watch: {
      dataList: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.refresh();
          }, 500)
        },
        deep: true
      }
    },
    components:{
      XButton,
      Datetime,
      Group,
      noData
    },
    beforeRouteEnter(to, from, next) {
      console.log(from);
      if(from.name=='purDetail'){
        to.meta.keepAlive = true;
      }
      next();
    },
    mounted(){
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    },
    methods:{
      init(){
        var _self = this;
        _self.getCurrentdate();
        _self.getpurHistoryduser();
      },
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        function onScroll(pos) {
          let scrolltop = Math.abs(pos.y);
          let offsetTop = document.querySelectorAll('.eve_inner');
          for(let i=0;i<offsetTop.length;i++){
              if((scrolltop - offsetTop[i].offsetTop) >= 50){
                _self.totalConsumeMoney = offsetTop[i].dataset.money;
                _self.calcuBeginTime = offsetTop[i].dataset.month;
              }
          }
        }
        this.scroll.on('scroll', onScroll)
        this.scroll.on("pullingUp", () => {
          _self.pageNum ++;
          if(this.selecMes==0) {
            _self.getnewHistoryduser();
          }else{
            _self.getnewotherHistoryduser();
          }
        });
      },
      //重新选择了月份之后需要执行的方法
      getotherHistoryduser(){
        var _self = this;
        var _data = {
          token:_self.token,
          month:`${_self.date}-01`,
          pageNum:_self.pageNum,
          pageSize:10,
        }
        getSignIn(_data).then(sec=>{
          getpurHistoryduser(_data,sec).then(res=>{
            res = res.data;
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
                res.data[i].data[j].createTime = timestampToTime((Number(res.data[i].data[j].createTime))*1000);
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
            _self.totalConsumeMoney = _self.dataList.length!=0 ? _self.dataList[0].totalConsumeMoney:0;
            if(_self.dataList.length==0){
              _self.showNoData = true;
              _self.noticeMes = '当前无消费信息';
            }else{
              _self.showNoData = false;
              _self.noticeMes = '';
            }
            setTimeout(() => {
              _self.initScroll();
            },500)
          })
        })
      },
      getnewotherHistoryduser(){
        var _self = this;
        var _data = {
          token:_self.token,
          month:`${_self.date}-01`,
          pageNum:_self.pageNum,
          pageSize:10,
        }
        getSignIn(_data).then(sec=>{
          getpurHistoryduser(_data,sec).then(res=>{
            res = res.data;
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
                res.data[i].data[j].createTime = timestampToTime((Number(res.data[i].data[j].createTime))*1000);
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
            _self.totalConsumeMoney = _self.dataList.length !=0 ? _self.dataList[0].totalConsumeMoney:0;
            if(_self.dataList.length==0){
              _self.showNoData = true;
              _self.noticeMes = '当前无消费信息';
            }else{
              _self.showNoData = false;
              _self.noticeMes = '';
            }
          })
        })
      },
      // 初次加载实例化一个scroll
      getpurHistoryduser(){
        var _self = this;
        var _data = {
          token:_self.token,
          month:``,
          pageNum:_self.pageNum,
          pageSize:10,
        }
        getSignIn(_data).then(sec=>{
          getpurHistoryduser(_data,sec).then(res=>{
            res = res.data;
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
                res.data[i].data[j].createTime = timestampToTime((Number(res.data[i].data[j].createTime))*1000);
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
            _self.totalConsumeMoney =_self.dataList.length !=0 ? _self.dataList[0].totalConsumeMoney:0;
            if(_self.dataList.length==0){
              _self.showNoData = true;
              _self.noticeMes = '当前无消费信息';
            }else{
              _self.showNoData = false;
              _self.noticeMes = '';
            }
            setTimeout(() => {
              _self.initScroll();
            },500)
          })
        })
      },
      // 第二次不再实例化
      getnewHistoryduser(){
        var _self = this;
        var _data = {
          token:_self.token,
          month:``,
          pageNum:_self.pageNum,
          pageSize:10,
        }
        getSignIn(_data).then(sec=>{
          getpurHistoryduser(_data,sec).then(res=>{
            res = res.data;
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
                res.data[i].data[j].createTime = timestampToTime((Number(res.data[i].data[j].createTime))*1000);
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
            _self.totalConsumeMoney = _self.dataList.length !=0 ? _self.dataList[0].totalConsumeMoney:0;
            if(_self.dataList.length==0){
              _self.showNoData = true;
              _self.noticeMes = '当前无消费信息';
            }else{
              _self.showNoData = false;
              _self.noticeMes = '';
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
        this.calcuBeginTime = this.date;
      },
      gopurDetail(par){
        this.$router.push({
          name:'purDetail',
          params:{
            orderNum:par.orderNum ,
            payWay:par.payWay,
            activeType:par.activeType
          }
        })
      },
      onConfirmStart(val){
        this.calBeginTime = val;
        this.date = val;
        this.calcuBeginTime=val;
        this.selecMes =1;
        this.pageNum=1;
        this.dataList = [];
        this.getotherHistoryduser();
      },
      onConfirmEnd(val){
        this.pageNum=1;
        this.selecMes =1;
        this.dataList = [];
        this.calEndTime = val;
        this.date = val;
        this.getotherHistoryduser();
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /**
       * 计算日期范围
       */
      calDateRange(){
        var _self = this;
        var _date = new Date();
        var nowTimeStamp = Date.parse(_date);
        var nowTime = timestampToTime(nowTimeStamp).substr(0,10);
        var beginTime = timestampToTime(Number(nowTimeStamp) - 30 * 24 * 60 * 60 *1000).substr(0,10);
        _self.end_date = nowTime;
        _self.calBeginTime = beginTime;
        _self.calEndTime = nowTime;
      },
      initTime(){
        this.calBeginTime = this.beginTime ? timestampToTime(this.beginTime).substr(0,10) : this.calBeginTime;
        this.calEndTime = this.endTime ? timestampToTime(this.endTime).substr(0,10) : this.calEndTime;
      },
      show(){
        this.isShow = true;
      }
    },
    created() {
      this.calDateRange();
      this.initTime();
    }
  }
</script>

<style lang="scss" scoped>
  .mypur_top{
    width:7.1rem;
    padding:0 0.2rem;
    height:1rem;
    background:#F1F1F1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index:999;
    .le_mypur_top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.24rem;
      background:#fff;
      padding:0.04rem 0.24rem;
      border-radius: 0.38rem;
      i{
        line-height: 0.36rem;
      }
      button{
        border:none!important;
        outline:none;
        width:1.3rem;
        height:0.5rem;
        padding:0;
        font-size: 0.24rem;
      }
    }
    .ri_mypur_top{
      color:#9A9DA5;
      font-size: 0.28rem;
    }
  }
  .bag-scroll{
    /*width:7.1rem;*/
    /*padding:0 0.2rem;*/
    position: fixed;
    top: 1rem;
    bottom: 0;
    left: 0;
    right: 0;
    .eve_inner{
      /*display: flex;*/
      padding:0rem 0;
      .mypur_top{
        width:7.1rem;
        height:1rem;
        padding:0 0.2rem;
        background:#F1F1F1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .le_mypur_top{
          display: flex;
          justify-content: space-between;
          font-size: 0.24rem;
          background:#fff;
          padding:0.04rem 0.24rem;
          border-radius: 0.38rem;
          i{
            line-height: 0.36rem;
          }
        }
        .ri_mypur_top{
          color:#9A9DA5;
          font-size: 0.28rem;
        }
      }
      .all_inner{
        display: flex;
        justify-content: space-between;
        flex: 1;
        padding-bottom:0.1rem;
        border-bottom:0.02rem solid rgba(229,229,229,1);
      }
      .le_inner{
        width:0.7rem;
        height:0.7rem;
        border-radius: 50%;
        background:#ff6700;
        margin-right:0.2rem;
        img{
          width:100%;
          height:100%;
          border-radius: 50%;
          display: block;
        }
      }
      .ri_inner{
        .ri_top{
          width:4.5rem;
          font-size: 0.3rem;
          margin-bottom:0.2rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .ri_mid{
          width:4.5rem;
          font-size: 0.24rem;
          margin-bottom:0.18rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .ri_bot{
          width:4.5rem;
          font-size: 0.24rem;
          color:#9A9DA5;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .mycurpur_top{
    width:7.1rem;
    height:1rem;
    padding:0 0.2rem;
    background:#F1F1F1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left:0;
    top:0;
    z-index: 999;
    .le_mypur_top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.24rem;
      background:#fff;
      padding:0.04rem 0.24rem;
      border-radius: 0.38rem;
      i{
        line-height: 0.36rem;
      }
      button{
        border:none!important;
        outline:none;
        width:1.3rem;
        height:0.5rem;
        padding:0;
        font-size: 0.24rem;
      }
    }
    .ri_mypur_top{
      color:#9A9DA5;
      font-size: 0.28rem;
    }
  }
</style>
