<template>
  <div class="bag-scroll" ref="myScroll">
    <div class="scroll-container">
      <!--一样的问题****************************************************************-->
      <div class="share_ev"  v-for="(item,index) in resdata" :key="index" @click="shareDetail(item)">
        <div class="top_top">
          <span style="float: left;">{{item.createTime}}</span>
        </div>

        <div class="share_top">
          <span style="float: left;" v-if="item.mainCardNO === item.shareCardNO">卡主共享卡消费{{item.totalMoney}}元</span>
          <span style="float: left;" v-else>卡主共享卡消费{{item.totalMoney}}元</span>
          <span style="float: right;">实付金额 ￥{{item.shouldMoney}}</span>
        </div>
        <div class="share_bot">

          <span style="float: left;">技术服务费{{item.serviceFee / 100}}元</span>
          <span style="float: left;margin-left:.2rem;">分享佣金{{item.shareCardCommissionRate *1000/10}}%</span>
          <span style="float: right;display: inline-block;padding:.05rem .24rem;background:#FF0049;color:#fff;border-radius: .24rem;color:#fff;">赚￥{{item.actualMainCardProfit}}</span>
        </div>
      </div>
    </div>

    <no-data :showNoData = "noData" :noticeMes="conNot"/>
    <div class="no_more" v-if="noMore">{{notice_mes}}</div>
  </div>
</template>

<script>
  import { getSignIn , getQuery ,toDate} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  import noData from '@/components/noData'
  import Tips from '@/common/js/tips'
  export default {

    name: "shareHistory",
    components:{
      noData
    },
    data(){
      return {
        id:'',
        token:'',
        resdata:[],
        pageNum:1,
        pageSize:20,

        noData:false,
        conNot:'',
        noMore:false,
        notice_mes:'',
        goTogHis:''
      }
    },
    mounted(){
      // 说明一下传过来是一 说明是
      var par = getQuery();
      if(par.goTogHis == "1") {
        this.id = par.id;
        this.goTogHis =par.goTogHis;
        this.getPur();
      }else{
        this.id = par.id;
        this.getPurList();
      }
    },
    methods:{
      shareDetail(par){
        wx.navigateTo({
           url:`/pages/packageD/pages/shaHisDetail/main?id=${par.id}`
        })
      },
      getPurList(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
          // token:'6cea3e3ae4564f5d9180cc6ef8599575',
          maincardId:_this.id,
          pageNum:_this.pageNum,
          pageSize:_this.pageSize,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getProfit(_data , sec).then(res=>{
            var timeD = res.data;
            if(timeD.length==0 && this.resdata.length!=0){
              wx.hideLoading();
              _this.noMore = true;
              this.notice_mes == '没有更多数据了~'
            }else{
              for(let i=0;i<timeD.length;i++){
                timeD[i].createTime = toDate (timeD[i].createTime * 1000);
                timeD[i].mainCardProfit = timeD[i].mainCardProfit * 10/1000;
                timeD[i].totalMoney = (timeD[i].totalMoney /100 ).toFixed(2);
                timeD[i].shouldMoney = (timeD[i].shouldMoney /100 ).toFixed(2);
                timeD[i].actualMainCardProfit = floatTo.divide( timeD[i].actualMainCardProfit * 1000,100000);
                // timeD[i].actualMainCardProfit =  timeD[i].actualMainCardProfit * 10000/1000000;
              }
              this.resdata = timeD;
            }

            if(this.resdata.length == 0){
              _this.noData = true;
              _this.conNot = '暂无数据';
              return false;
            }
          })
        })
      },
      //调取分享卡收益明细
      getPur(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
          sharecardId:_this.id,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getShareMes(_data, sec).then(res=>{
            var timeD = res.data;
            if(timeD.length==0 && this.resdata.length!=0){
              wx.hideLoading();
              _this.noMore = true;
              this.notice_mes == '没有更多数据了~'
            }else{
              for(let i=0;i<timeD.length;i++){
                timeD[i].createTime = toDate (timeD[i].createTime * 1000);
                timeD[i].mainCardProfit = timeD[i].mainCardProfit * 10/1000;
                timeD[i].totalMoney = (timeD[i].totalMoney /100 ).toFixed(2);
                timeD[i].shouldMoney = (timeD[i].shouldMoney /100 ).toFixed(2);
                timeD[i].actualMainCardProfit = floatTo.divide(timeD[i].actualMainCardProfit * 1000,100000);
              }
              this.resdata = timeD;
            }

            if(this.resdata.length == 0){
              _this.noData = true;
              _this.conNot = '暂无数据';
              return false;
            }
           })
        })
      }
    },
    async onReachBottom() {
      this.pageNum ++;
      Tips.loading();
      if(this.notice_mes == '没有更多数据了~'){
        return
      }
      if(this.goTogHis==1) {
        this.getPur();
      }else{
        this.getPurList();
      }
    },
  }
</script>

<style lang="scss" scoped>
  .no_more{
    width:100%;
    height:90rpx;
    text-align: center;
    line-height: 90rpx;
    background:#F6F6F6;
  }
  .bag-scroll{
    position: absolute;
    left:0;right:0;
    top:0;bottom:0;
    width:94%;
    margin:0 3%;
    .share_ev{
      width:100%;
      overflow: hidden;
      line-height: 36rx;
      border-bottom:1px solid #E5E5E5;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .top_top{
        font-weight:300;
        color:rgba(52,60,83,1);
        font-size: 30rpx;
        padding:18rpx 0;
      }
      .share_top{
        overflow: hidden;
        margin-bottom:18rpx;
        font-size: 30rpx;
        color:#000;
        span{
          font-size: 30rpx;
        }
      }
      .share_bot{
        font-size: 24rpx;
        margin-bottom:18rpx;
      }
    }
  }
</style>
