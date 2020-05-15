<template>
  <div class="page_con">
     <div class="top_page">
        <div class="top_mes" @click="goinlieShop">
            <div class="top_inner">
              <div class="img_mes"><img :src="shopLogo" alt=""></div>
              <span style="margin-right:10rpx;font-size: 36rpx;color:#fff;">{{shopName}}</span>
              <i class="iconfont icon-youjiantou" style="font-size: 28rpx;color:#fff;"></i>
            </div>
        </div>
        <div class="price_mes" style="font-size: 72rpx;color:#fff;text-align: center;">
          ￥{{orderTotalPrice}}
       </div>
        <div v-if="usedIntegralCount!=0" class="price_mes" style="font-size: 28rpx;color:#fff;text-align: center;">
            原价{{originalPrice}}元，已优惠{{usedIntegralCount}}元
       </div>
       <div v-if="usedIntegralCount==0" class="price_mes" style="font-size: 28rpx;color:#fff;text-align: center;">
            支付成功
       </div>
        <div class="look_btn" v-if="goodsType!=1">
         <div class="look_inner"  @click="goLookcode">
            查看订单
         </div>
       </div>
        <div class="getMes">
            <div class="title_mes">本次消费您还获得了</div>
            <div class="eve_mes" style="margin-bottom:30rpx;">
                <div class="eve_img">
                  <img src="../../static/img/download.png" alt="">
                </div>
                <div class="eve_bot_img">
                    <div class="le_eve_img">
                        <div class="top" style="font-size: 30rpx;">获得1次砍价机会</div>
                        <div class="bot" style="font-size: 24rpx;color:#8D8E98;">参与砍价，有机会吃霸王餐</div>
                    </div>
                    <div class="ri_eve_img">
                         <div class="btn" @click="goCut">去砍价</div>
                    </div>
                </div>
            </div>
          <div class="eve_mes">
            <div class="eve_img">
              <img src="../../static/img/cutPhoto.png" alt="">
            </div>
            <div class="eve_bot_img">
              <div class="le_eve_img">
                <div class="top" style="font-size: 30rpx;">下载助商通APP</div>
                <div class="bot" style="font-size: 24rpx;color:#8D8E98;">红包可翻倍</div>
              </div>
              <div class="ri_eve_img">
                <div class="btn" @click="xiazai">去下载</div>
              </div>
            </div>
          </div>
        </div>
     </div>

    <div class="re-store">
      <div class="title"><img src="../../static/img/shop_line.png" alt=""></div>
      <div class="list-item flex_box" v-for="(iem,inx) in dataList" :key="inx" @click="gostoreDetail(iem)">
        <img :src="iem.storeLogo" alt="" class="thumb" style="margin-right: 12rpx">
        <div class="box_padding flex_box flex_column justify_space_between">
          <p class="txt-overflow fz-28">{{iem.storeName}}</p>
          <p class="flex_box justify_space_between align_center fz-24 fc-8D8E98">
            <span class="iconfont icon-dizhi txt-ellipsis fz-24" style="display: block;width: 410rpx">{{iem.address}}</span>
            <span class="fz-24">{{iem.distance}}km</span>
          </p>
          <p class="fz-30 fc-F7094D">到店消费最低享{{iem.shareCardDiscount}}折</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate ,calDistance} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  export default {
    name: "index",
    data(){
      return {
        shopId:'',
        shopLogo:'',
        shopName:'新闻信息',
        shopNum:1,
        dataList:[],
        orderNum:'',
        costPrice:'',
        orderTotalPrice:'',
        usedIntegralCount:'',
        originalPrice:'',
        goodsType:'',
      }
    },
    mounted(){
      this.shopId = this.$store.state.shopId;
      this.shopLogo = this.$store.state.shopLogo;
      this.shopName = this.$store.state.shopName;
      this.goodsType = this.$store.state.goodsType;
      console.log(this.goodsType);
      var par =getQuery();
      this.orderNum = par.selOrderNo;
      this.originalPrice = par.originalPrice;  //原价   0.01
      this.usedIntegralCount = par.usedIntegralCount;   //优惠了多少钱  1000
      this.orderTotalPrice = par.orderTotalPrice;   //实际支付  1
      this.getBargain();
    },
    methods:{
      getBargain(){
        var _data = {
          token:this.$store.state.token,
          longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
          pageNum:this.shopNum,
          limit:10,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getnearByshop(_data,sec).then(res=>{
            if(res.data.length!='') {
              for(let i=0;i<res.data.length;i++){
                res.data[i].shareCardDiscount = floatTo.multiply(res.data[i].shareCardDiscount,10);
              }
              _this.dataList = _this.dataList.concat(res.data);
            }
          })
        })
      },
      // 去往门店详情信息
      gostoreDetail(par){
        wx.navigateTo({
          url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.shopStoreId}&distance=${par.distance}`
        })
      },
      goinlieShop(){
        wx.navigateTo({
          url:`/pages/packageA/pages/inlineshop/main?shopId=${this.shopId}`
        })
      },
      xiazai(){
        wx.navigateTo({
          url:'/pages/packageD/pages/downApp/main'
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '具体详情，请下载助商通APP，每天领花呗，优惠乐不停',
        //   confirmColor:'#F60F51',
        //   success(res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
      },
      goCut(){
        wx.navigateTo({
          url:'/pages/packageC/pages/index/main'
        })
      },
      goOrderDetail(){

      },
      goLookcode(){
        wx.navigateTo({
          url:`/pages/packageA/pages/lookGoodsCode/main?orderNum=${this.orderNum}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.top_page{
  width:100%;
  height:474rpx;
  background:linear-gradient(0deg,rgba(248,17,79,1),rgba(255,110,106,1));
  position: relative;
  .top_mes{
    width:100%;
    height:50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom:60rpx;
    .top_inner{
      display: flex;
      align-items: center;
      margin-top:100rpx;
      .img_mes{
        width:50rpx;
        height:50rpx;
        border-radius: 50%;
        background:#fff;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          border-radius:50%;
          display: block;
        }
      }
    }
  }
  .look_btn{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:20rpx;
    .look_inner{
       border-radius: 6rpx;
       padding:10rpx 40rpx;
       border:2rpx solid #fff;
       color:#fff;
    }
  }
  .getMes{
    position: absolute;
    left:20rpx;
    padding-top:30rpx;
    padding-bottom:60rpx;
    top:396rpx;
    width:710rpx;
    border-radius: 14rpx;
    background:#fff;
    box-shadow:0 0 16rpx 4rpx rgba(92,92,92,0.15);
    float: left;
    .title_mes{
      width:100%;
      text-align: center;
      font-weight: bold;
      color:#492410;
      margin:20rpx 0;
    }
    .eve_mes{
      padding:0 30rpx;
      height:90rpx;
      display: flex;
      .eve_img{
        width:90rpx;
        height:90rpx;
        border-radius: 50%;
        margin-right:20rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .eve_bot_img{
        width:550rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ri_eve_img{
          padding:10rpx 24rpx;
          background:pink;
          color:#F82058;
          border-radius: 40rpx;
          font-size: 28rpx;
        }
      }
    }
  }
}
.re-store{
  width: 100%;
  box-sizing: border-box;
  padding: 0 22rpx;
  margin-top:366rpx;
  .title{
    width:100%;
    height:30rpx;
    margin-bottom:40rpx;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .board{
    display: block;
    width: 265rpx;
    height: 58rpx;
    margin: 0 auto;
    margin-bottom: 25rpx;
  }
  .list-item{
    background: #FFFFFF;
    overflow: hidden;
    border-bottom: 1rpx solid #EEEEEE;
    padding-bottom: 24rpx;
    margin-bottom: 24rpx;
    .thumb{
      display: block;
      width: 215rpx;
      height: 161rpx;
      border-radius: 10rpx;
    }
  }
}
</style>
