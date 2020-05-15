<template>
  <div class="active-list">
    <div style="box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);border-top-left-radius: 6rpx;border-top-right-radius: 6rpx;"  v-for="(item,index) in dataBaring" :key="item.id">
      <div class="top">
        <div style="overflow: hidden;background:#fff;padding-top:10rpx;padding-left:10rpx;border-top-left-radius: 6rpx;border-top-right-radius: 6rpx;">
          <i class="iconfont icon-shangjia fc-F7094D" style="float: left;"></i>
          <span style="float: left;color:#0D0D0F;font-size: 30rpx;margin-left:20rpx;">{{item.shopName}}</span>
        </div>
      </div>
      <div class="list-item box_padding bg-FFFFFF flex_box">
        <img :src="item.bargainImg" alt="" class="thumb">
        <div class="detail">
          <p class="fz-30 txt-overflow" style="margin-bottom: 40rpx;height:100rpx;@include ovhm(2)">{{item.bargainTitle}}</p>
          <div class="flex_box justify_space_between align_center">
            <div>
              <p class="fz-30 fc-8D8E98">已砍<span class="fc-F7094D">{{item.helpedPrice}}元</span></p>
            </div>
            <button class="btn_radius fz-28 fc-ffffff" @click="goCut(item)">继续砍价</button>
          </div>
        </div>
      </div>


    </div>

    <div style="width:100%;text-align: center;color:#FA336C;font-size: 30rpx;" v-if="lookMore==1" @click="goLookMore">查看更多</div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  export default {
    data(){
      return{
        dataBaring:[],
        pageNum:1,
        noData:0,
      }
    },
    mounted(){
      this.getBargaining();
    },
    methods: {
      getBargaining(){
        var _data = {
          token:this.$store.state.token,
          ingNum:10,
          pageNum:this.pageNum
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getBargaining(_data,sec).then(res=>{
            if(res.data.length!=0) {
              _this.noData = 0;
              _this.dataBaring = _this.dataBaring.concat(res.data);
            }else{
              _this.noData = 1;
            }
          })
        })
      },
      goCut(par){
        console.log(par);
        wx.navigateTo({
          url:`/pages/packageC/pages/cutFree/main?bargainId=${par.bargainId}&bargainTasksId=${par.id}&storeId=${par.storeId}&fromPage=index`
        })
      },
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.pageNum ++;
      this.getBargaining();
    },
  }
</script>

<style lang="scss" scoped>
  .active-list{
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 22rpx;
    background: #FEDBE5;
    .module{
      width: 262rpx;
      height: 32rpx;
      margin: 0 auto;
      margin-bottom: 22rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .list-item{
      padding: 23rpx 13rpx;
      border-radius: 6rpx;
      /*box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);*/
      margin-bottom:20rpx;
      .thumb{
        display: block;
        width: 200rpx;
        height: 200rpx;
        border-radius: 10rpx;
        background: #FF4F81;
        margin-right: 17rpx;
      }
      .detail{
        width: 460rpx;
        .time{
          display: block;
          width: 40rpx;
          height: 40rpx;
          border-radius: 10rpx;
          background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
          line-height: 40rpx;
        }
        button{
          display: block;
          width: 180rpx;
          height: 60rpx;
          background: #FA336C;
          padding:0;
          line-height: 60rpx;
        }
      }
    }
  }
</style>
