<template>
  <div class="page">
    <div  v-if="dataList.length !=0" class="active-list">
      <div  class="list-item box_padding bg-FFFFFF flex_box" v-for="(item,index) in dataList">
        <img :src="item.mainImg" alt="" class="thumb">
        <div class="detail">
          <div style="overflow: hidden">
            <i class="iconfont icon-shangjia fc-F7094D" style="float: left;"></i>
            <span style="float: left;color:#0D0D0F;font-size: 30rpx;margin-left:20rpx;">{{item.shopName}}</span></div>
          <div class="fz-30 txt-overflow" style="margin-bottom: 40rpx">{{item.title}}</div>
          <div class="flex_box justify_space_between align_center">
            <div>
               <span style="font-size: 38rpx;color:#F7094D;">￥{{item.currentPrice}}元</span>
               <span style="color:#8D8E98;text-decoration:line-through;font-size: 30rpx;">￥{{item.price}}</span>
            </div>
            <button class="btn_radius fz-28 fc-ffffff" @click="goJoinPrice(item)">参与砍价</button>
          </div>
        </div>
      </div>

    </div>
    <div v-if="dataList.length == 0">
      <div class="all_empty">
        <div class="empty_img">
          <img src="/static/img/common/empty.png" alt="">
        </div>
        <div class="em_title">
          {{conNot}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  export default {
    data(){
      return {
         dataList:[],
         noData:false,
         conNot:'',
         noticeMes:''
      }
    },
    onShow(){
      this.getCanJoin();
    },
    methods:{
        getCanJoin(){
            var _data = {
              token:this.$store.state.token,
              pageNum:1,
              limit:20,
            }
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.canTasksing(_data,sec).then(res=> {
                if (res.state == 1) {
                _this.dataList = res.data;
                console.log(_this.dataList);
                if (_this.dataList.length == 0) {
                  _this.noData = true;
                  _this.conNot = '您当前还没有可参与砍价的活动';
                } else {
                  _this.noData = false;
                }
                for (let i = 0; i < res.data.length; i++) {
                  let discount = floatTo.divide(res.data[i].discount, 10)
                  res.data[i].currentPrice = (floatTo.multiply(res.data[i].price, discount)).toFixed(2);
                }
              }else{
                  Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                }
              })

            })
        },
        goJoinPrice(par){
          console.log(par);
            wx.navigateTo({
              url:`/pages/packageC/pages/cutFree/main?bargainId=${par.id}&storeId=${par.storeIds}&fromPage=canJoin`
            })
        }
    }
  }
</script>

<style lang="scss" scoped>
  .active-list{
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 22rpx;
    background: #FEDBE5;
    .module{
      width: 317rpx;
      height: 58rpx;
      background: #0D0D0D;
      margin: 0 auto;
      margin-bottom: 22rpx;
    }
    .list-item{
      padding: 23rpx 13rpx;
      border-radius: 6rpx;
      box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);
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
  .all_empty{
    margin-top:300rpx;
    .empty_img{
      width:100%;
      height:332rpx;
      display: flex;
      justify-content: center;
      margin-top:300rpx;
      margin-bottom:60rpx;
      img{
        width:332rpx;
        height:332rpx;
        display: block;
      }
    }
    .em_title{
      font-size: 36rpx;
      text-align: center;
    }
  }
</style>
