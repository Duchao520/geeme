<template>
  <div class="page_con">
    <div class="top_page">
      <div class="top_mes" @click="goinlieShop">
        <div class="top_inner">
          <div class="img_mes"><img :src="shopMes.storeLogo" alt=""></div>
          <span style="margin-right:10rpx;font-size: 36rpx;color:#fff;">{{shopMes.storeName}}</span>
          <i class="iconfont icon-youjiantou" style="font-size: 28rpx;color:#fff;"></i>
        </div>
      </div>
      <div class="price_mes" style="font-size: 72rpx;color:#fff;text-align: center;">
        ￥{{shopMes.totalMoney}}
      </div>
      <div class="price_mes" style="font-size: 28rpx;color:#fff;text-align: center;">
        实付金额{{shopMes.actualReceiveMoney}}元，已优惠{{shopMes.partakeMoney}}元
      </div>
      <div class="price_mes" style="font-size: 28rpx;color:#fff;text-align: center;">
        支付成功
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
        <div class="eve_mes" style="margin-bottom:30rpx;" v-if="hasRedEnvelope == 1 && shopMes.isSupportTwoWayRedpacket == 1">
          <div class="eve_img">
            <img src="../../static/img/packet_icon.png" alt="">
          </div>
          <div class="eve_bot_img">
            <div class="le_eve_img">
              <div class="top" style="font-size: 30rpx;">您有1个红包待领取</div>
              <div class="bot" style="font-size: 24rpx;color:#8D8E98;">红包可提现</div>
            </div>
            <div class="ri_eve_img">
              <div class="btn" @click="packetIsShow = true">去领取</div>
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
    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>
    <div class="toast_bg" v-if="packetIsShow">
      <div class="packet box_padding" style="padding-top: 162rpx;">
        <img src="/static/img/close.png" alt="" class="close" @click="packetIsShow = false">
        <p class="text-center fz-36 font-weight" style="color: #FFDC94;">{{shopMes.storeName}}</p>
        <p class="fz-30 fc-ffffff text-center">给您发了一个现金红包</p>
        <form @submit="getPacket" report-submit="true">
          <button form-type="submit"></button>
        </form>
      </div>
    </div>
    <div class="re-store">
      <div class="title"><img src="../../static/img/shop_line.png" alt=""></div>
      <div class="list-item flex_box" v-for="(iem,inx) in dataList" :key="inx" @click="gostoreDetail(iem)">
        <img :src="iem.storeLogo" alt="" class="thumb" style="margin-right: 12rpx">
        <div class="box_padding flex_box flex_column justify_space_between">
          <p class="txt-overflow fz-28">{{iem.storeName}}</p>
          <p class="flex_box justify_space_between align_center fz-24 fc-8D8E98">
            <span class="iconfont icon-dizhi txt-ellipsis fz-24"
                  style="display: block;width: 410rpx">{{iem.address}}</span>
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
  import Tips from '@/common/js/tips'
  import { mapMutations } from 'vuex'
  import floatTo from '@/common/js/floatTo'
  import { NEWSHOPID }  from '@/store/mutation-types'
  export default {
    name: "index",
    data(){
      return {
        shopStoreId: '',
        shareCardId: '',
        orderNum: '',
        dataList: [],
        shopMes: '',
        payType: '',
        hasRedEnvelope: 0,
        fromPage: '',
        shopId: '',
        packetIsShow: false
      }
    },
    onShow(){
      if(this.orderNum){
        this.getOrderDetail();
      }
    },
    mounted(){
      var par =getQuery();
      this.orderNum = par.orderNum;
      this.shopStoreId = par.shopStoreId;
      this.shareCardId = par.shareCardId ?par.shareCardId:'';
      this.fromPage = par.fromPage ? par.fromPage : 'SHARECARD';
      this.getOrderDetail();
      this.getBargain();
    },
    methods: {
      ...mapMutations({
        newShopId:'NEWSHOPID'
      }),
      backIndex(){
        wx.switchTab({
          url:'/pages/index/main'
        })
      },
      getOrderDetail() {
        var _this = this,_data;

        if(this.fromPage == 'MAINCARD'){
          _data = {
            token:this.$store.state.token,
            orderNum:this.orderNum,
            shopStoreId:this.shopStoreId,
            isOriginPricePay:0,
            longitude:this.$store.state.lng ?this.$store.state.lng:'' ,
            latitude:this.$store.state.lat?this.$store.state.lat:'',
          };
          getSignIn(_data).then(sec => {
            _this.$http.getMaincard(_data, sec).then(res => {
              if(res.state == 1){
                _this.shopMes = res.data;
                _this.newShopId(res.data.shopId);
                _this.shopId = res.data.shopId;
                _this.hasRedEnvelope = Number(res.hasRedEnvelope);
                _this.payType = 3;
                if(_this.hasRedEnvelope == 1 && _this.shopMes.isSupportTwoWayRedpacket == 1){
                  _this.packetIsShow = true;
                }
              }else{
                Tips.toast(decodeURIComponent(res.msg),'none')
              }
            })
          })
        }else{
          _data = {
            token: this.$store.state.token ? this.$store.state.token : '',
            orderNum: this.orderNum ? this.orderNum : '',
            shopStoreId: this.shopStoreId ? this.shopStoreId : '',
            shareCardId: this.shareCardId ? this.shareCardId : '',
            longitude: this.$store.state.lng ? this.$store.state.lng : '',
            latitude: this.$store.state.lat ? this.$store.state.lat : '',
          }
          getSignIn(_data).then(sec => {
            _this.$http.getOrderOrder(_data, sec).then(res => {
              if(res.state == 1){
                _this.shopMes = res.data;
                _this.newShopId(res.data.consumeShopId);
                _this.shopId = res.data.consumeShopId;
                _this.hasRedEnvelope = Number(res.hasRedEnvelope);
                if(_this.shopMes.activeType == 3 || _this.shopMes.activeType == 4){
                  _this.payType = 1;
                }else if(_this.shopMes.activeType == 6 || _this.shopMes.activeType == 7){
                  _this.payType = 2;
                }else{
                  _this.payType = 3;
                }
                if(_this.hasRedEnvelope == 1 && _this.shopMes.isSupportTwoWayRedpacket == 1){
                    _this.packetIsShow = true;
                }
              }else{
                Tips.toast(decodeURIComponent(res.msg),'none')
              }
            })
          })
        }

      },
      /**
       * 未登录前往登录
       */
      goLogin(){
        const url = `../../../../pages/loginpage/main`;
        wx.navigateTo({url})
      },
      getBargain(){
        var _data = {
          token:this.$store.state.token,
          longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
          pageNum:1,
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
      gostoreDetail(par) {
        wx.navigateTo({
          url: `/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.shopStoreId}&distance=${par.distance}`
        })
      },
      goinlieShop() {
        wx.navigateTo({
          url: `/pages/packageA/pages/inlineshop/main?shopId=${this.shopId}`
        })
      },
      getPacket(e){
        var _self = this;
        var formId = e.mp.detail.formId;
        if(this.$store.state.token){
          _self.goPacket(formId);
        }else{
          Tips.confirm('领取红包需微信授权').then(res => {
            _self.goLogin();
          })
        }
      },
      xiazai() {
        wx.navigateTo({
          url: '/pages/packageD/pages/downApp/main'
        })
      },
      goCut() {
        if(this.$store.state.token){
          wx.navigateTo({
            url: '/pages/packageC/pages/index/main'
          })
        }else{
          this.goLogin();
        }

      },
      goPacket(formId){
       var _this = this;
        wx.navigateTo({
          url: `/pages/packageA/pages/packet/main?orderNum=${this.orderNum}&payType=${this.payType}&formId=${formId}`,
          success(){
             _this.packetIsShow = false;
          }
        })
      },
      goLookcode() {
        wx.navigateTo({
          url: `/pages/packageA/pages/lookGoodsCode/main?orderNum=${this.orderNum}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .toast_bg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12,12,12,.5);
    .packet{
      width: 542rpx;
      height: 659rpx;
      background: url("https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/30/47525e7ecb177bd5c9ccccb1ba35eb98.png") center center no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .close{
        display: block;
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        right: 0;
        top: -81rpx;
      }
      button{
        display: block;
        width: 420rpx;
        height: 90rpx;
        position: absolute;
        bottom: 47rpx;
        left: 61rpx;
      }
    }
  }
  .back_index{
    position: fixed;
    width:116rpx;
    height:116rpx;
    display: block;
    right:40rpx;
    bottom:104rpx;
    z-index:6;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
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
