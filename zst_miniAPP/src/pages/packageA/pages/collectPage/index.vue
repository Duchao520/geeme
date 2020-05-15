<template>
    <div class="page">
        <div class="pa_eve" v-for="item in dataList" @click="goDetail(item)">
            <div class="pa_eve_le">
              <img :src="item.cover" alt="">
            </div>
            <div class="pa_eve_ri">
                <div class="par_ev_top">

                   <img v-if="item.platform==3" src="../../static/img/zstLogo.png" alt="">
                   {{item.goodsName}}
                </div>
                <div class="par_ev_mid">
                    <div style="font-size: 30rpx;color:#F7094D;">￥{{item.originalPrice}}</div>
                    <div style="font-size: 24rpx;">助商通价:￥{{item.discountPrice}}</div>
                    <!--<div style="font-size: 22rpx;color:#9A9DA5;">京东价￥300.0</div>-->
                    <!--<div style="height:30rpx;display: flex;justify-content: space-between;align-items: center;border:1rpx solid #F7094D;" v-if="item.offerContent">-->
                       <!--<div style="font-size: 20rpx;background:#F7094D;color:#fff;width:30rpx;height:30rpx;text-align: center;line-height: 30rpx">券</div>-->
                       <!--<div style="font-size: 24rpx;line-height:30rpx;color:#F7094D;text-align:center;display: flex;justify-content: center;align-items: center;padding:0 10rpx;">￥10</div>-->
                    <!--</div>-->

                    <div v-if="item.offerContent != '0话呗'" style="font-size: 24rpx;color:#F7094D;">
                        话呗抵扣{{item.offerContent}}
                    </div>

                </div>
                <div class="par_ev_bot">
                   <div style="margin-right:20rpx;">{{item.collectionVolume}}人收藏</div>
                   <div>{{item.salesVolume}}人购买</div>
                </div>
            </div>
        </div>

       <no-data :showNoData = "noData" :noticeMes="conNot"/>

        <div class="footer">
          {{notice_mes}}
        </div>
    </div>
</template>

<script>
    import { getSignIn } from '@/common/js/comm'
    import noData from '@/components/noData'
    export default {
        name: "index",
        components:{
          noData
        },
        data(){
          return {
            dataList:[],
            par:{
              token:this.$store.state.token,
              pageNum:1,
              pageSize:10,
              isApplet:1,
            },
            noData:false,
            conNot:'',
            notice_mes:''
          }
        },
        mounted(){
          this.getColLi(this.par);
        },
        methods:{
           getColLi(par){
             var _this = this;
              getSignIn(par).then(sec=>{
                 _this.$http.getColLi(par,sec).then(res=>{
                   console.log('收藏的订单',res.data);
                   if(res.data.length != 0){
                     _this.dataList =_this.dataList.concat(res.data);
                   }else{
                     this.notice_mes = '没有更多数据了~';
                   }
                   console.log('这里面是有数据的吗',_this.dataList);
                   if(_this.dataList.length == 0){
                     _this.noData = true;
                     _this.conNot = '暂无收藏的订单哦'
                   }else{
                     _this.noData = false;
                     _this.conNot = ''
                   }

                 })
              })
           },
          goDetail(par){
            var url;
            if(par.goodsUrl.indexOf('http') != -1){
              var arr,newArr;
              arr = par.goodsUrl.split('&');
              newArr= arr[0].split('=');
              url = `../../../../pages/shopdetail/main?id=${Number(newArr[1])}`;
            }else{
              url = `../../../../${par.goodsUrl}`;
            }
            wx.redirectTo({
              url: url
            })
          }
        },
      async onReachBottom() {
        // 到这底部在这里需要做什么事情
        console.log(1)
        this.notice_mes = '加载中...';
        this.par.pageNum ++;
        this.getColLi(this.par);
        if(this.notice_mes == '没有更多数据了~'){
          return false;
        }
      },
    }
</script>

<style lang="scss" scoped>
.page{
  width:710rpx;
  margin:0 20rpx;
  overflow: hidden;
  .pa_eve{
    width:100%;
    overflow: hidden;
    border-bottom:2rpx solid #E5E5E5;
    padding:20rpx 0;
    .pa_eve_le{
      width:200rpx;
      height:200rpx;
      background:#daf3ff;
      float: left;
      margin-right:20rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .pa_eve_ri{
       float: left;
       width:490rpx;
      .par_ev_top{
        font-size: 30rpx;
        line-height: 40rpx;
        width:490rpx;
         img{
           width:25rpx;
           height:25rpx;
           display: block;
           float: left;
           margin-top:10rpx;
           margin-right:10rpx;
         }

      }
      .par_ev_mid{
         width:100%;
         height:30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top:20rpx;
        margin-bottom:36rpx;
      }
      .par_ev_bot{
        div{
          float: left;
          font-size: 20rpx;
          color:#9A9DA5;
        }
      }
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
