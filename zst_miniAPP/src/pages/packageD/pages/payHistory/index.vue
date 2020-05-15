<template>
  <div class="bag-scroll" ref="myScroll">
    <div class="scroll-container">
      <div class="all_pur_his" v-for="item in resdata">
        <div class="all_pur_left">
          <div class="pur_to">{{item.remark}}</div>
          <div class="pur_bot">{{item.createTime}}</div>
        </div>
        <div class="all_pur_right">
          -{{item.shouldMoney}}
        </div>
      </div>

    </div>
    <div class="no_more" v-if="noMore">{{notice_mes}}</div>
    <no-data :showNoData = "noData" :noticeMes="conNot"/>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import noData from '@/components/noData';
  import Tips from '@/common/js/tips'
  export default {
    name: "purHistory",
    components:{
      noData
    },
    data(){
      return {
        token:'',
        id:'',
        resdata:[],
        pageNum:1,
        pageSize:20,

        noData:false,
        conNot:'',
        noMore:false,
        notice_mes:''
      }
    },
    mounted(){
      var par = getQuery();
      this.id = par.id;
      this.getrecords();
    },
    methods:{
      getrecords(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
          maincardId:_this.id,
          pageNum:_this.pageNum,
          pageSize:_this.pageSize,
          orderBy:'desc'
        }
        getSignIn(_data).then(result=>{
          this.$http.getRecords(_data,result).then(res=>{
            console.log('如果我猜的不错的话',res);
            var ctime = res.data;
            if(ctime.length==0 && _this.resdata.length!=0){
              wx.hideLoading()
              _this.noMore = true;
              _this.notice_mes ='没有更多数据了~';
            }else{
              for(let i=0;i<ctime.length;i++){
                ctime[i].createTime = toDate(ctime[i].createTime * 1000);
                ctime[i].shouldMoney = (ctime[i].shouldMoney / 100).toFixed(2);
              }
              _this.resdata = _this.resdata.concat(res.data);
            }
            if(_this.resdata.length == 0){
              _this.noData = true;
              _this.conNot = '此卡暂无记录';
              return false;
            }
          })
        })

      },
    },
    async onReachBottom() {
      this.pageNum ++;
      Tips.loading();
      if(this.notice_mes == '没有更多数据了~'){
        return
      }
      this.getrecords();
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
      height:116rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .all_pur_left{
        float: left;
        line-height: 38rpx;
        .pur_to{
          font-size: 30rpx;
          font-weight: 400;
          margin-bottom:10rpx;
        }
        .pur_bot{
          font-size: 24rpx;
          color:#343C53;
        }
      }
      .all_pur_right{
        float: right;
        font-size: 34rpx;
        color:#FF0049;
      }
    }
    .no_more{
      width:100%;
      height:90rpx;
      text-align: center;
      line-height: 90rpx;
      /*background:#f2f2f2;*/
      /*padding-bottom:160rpx;*/
    }
  }
</style>
