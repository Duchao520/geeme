<template>
  <div class="bag-scroll" ref="myScroll">
    <div class="scroll-container">

      <div class="all_pur_his" v-for="item in resdata" :key="item.id">
        <div class="all_pur_left">
          <div class="pur_to">{{item.title}}</div>
          <div class="pur_bot">{{item.transDate}}</div>
        </div>
        <div class="all_pur_right">
           {{item.transMoney}}
        </div>
      </div>
    </div>
    <div class="footer">
        {{notice_mes}}
    </div>
  </div>
</template>

<script>
  import { getSignIn } from '@/common/js/comm'
  export default {
    data(){
      return {
        resdata:[],
        dataPar:{
          token:this.$store.state.token,
          pageNum:1,
          limit:12,
        },
        notice_mes:''
      }
    },
    mounted(){
      this.getPur(this.dataPar);
    },
    methods:{
      getPur(par){
        var _this = this;
        getSignIn(par).then(sec=>{
           _this.$http.getPurHis(par,sec).then(res=>{
               if(res.data.length != 0){
                 _this.resdata =  this.resdata.concat(res.data);
               }else{
                 _this.notice_mes = '没有更多数据了';
                 return false;
               }
           })
        })
      },
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.notice_mes = '加载中...';
      this.dataPar.pageNum ++;
      if(this.notice_mes == '没有更多数据了'){
         return false;
      }
      this.getPur(this.dataPar)
    },
  }
</script>

<style lang="scss"  scoped>
  .bag-scroll{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    width:94%;
    margin:0 3%;
    .all_pur_his{
      width:100%;
      border-bottom:1px solid #E5E5E5;
      height:1.16rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .all_pur_left{
        float: left;
        line-height: .38rem;
        .pur_to{
          font-size: .3rem;
          margin-bottom:14rpx;
        }
        .pur_bot{
          font-size: .24rem;
          color:#343C53;
        }
      }
      .all_pur_right{
        float: right;
        font-size: .34rem;
        color:#FF0049;
      }
    }
    .footer{
      width:100%;
      height:100rpx;
      background:#fff;
      text-align: center;
      line-height:100rpx;
    }
  }
</style>
