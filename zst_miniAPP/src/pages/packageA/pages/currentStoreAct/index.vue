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
      <div class="noMore" v-if="noMore == 1" style="width:100%;height:80rpx;line-height: 80rpx;text-align: center;">没有更多数据了~</div>
    </div>
    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>
    <no-data :showNoData = "noData" :noticeMes="conNot"/>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  import noData from '@/components/noData';
  export default {
    data(){
      return {
        dataList:[],
        noData:false,
        conNot:'',
        noMore:0,
        pagesNum:1,
        scene:'',
        storeId:'',
      }
    },
    components:{
      noData
    },
    onShow(){
      let token = this.$store.state.token;
      let par = getQuery();
      if(par.scene){
        this.scene = par.scene;
        var newArr = (decodeURIComponent(this.scene)).split(',');
        this.storeId = newArr[0];
      }
      if(token != ""){
        this.getCanJoin();
      }else{
        const url = `../../pages/loginpage/main?scene=${this.scene}`;
        wx.navigateTo({url})
      }
    },
    onHide(){
      this.dataList=[];
      this.pagesNum =1;
    },
    methods:{
      backIndex(){
        wx.switchTab({
          url:'/pages/index/main'
        })
      },
      getCanJoin(){
        var _data = {
          token:this.$store.state.token,
          storeId:this.storeId,
          state:1,
          pageNum:this.pagesNum,
          limit:10,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getBargainForStore(_data,sec).then(res=> {
            if (res.state == 1) {
              if(res.data.length!=0) {
                _this.dataList = _this.dataList.concat(res.data);
              }
              if(_this.dataList.length!=0 && res.data.length ==0){
                _this.noMore = 1;
              }else{
                _this.noMore = 0;
              }
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
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.pagesNum ++;
      this.getCanJoin();
    },
  }
</script>

<style lang="scss" scoped>
  .back_index{
    position: fixed;
    width:116rpx;
    height:116rpx;
    display: block;
    right:40rpx;
    bottom:104rpx;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
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
</style>
