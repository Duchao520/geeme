<template>
    <div class="page">
      <div class="top_bac">

      </div>
      <div class="new_svip">
       <div class="page_svip_detail">
          <div class="svip_card" :style="{'background':bgColor}">
            <div class="all_con">
              <div class="inner_card">
                  <div class="in_ca_img">
                    <div class="le_ca_img">
                      <img :src="shop.supplierLogo" alt="">
                    </div>
                    <div class="ri_ca_img">
                      <div class="new_all_le">
                        <div class="ca_title">
                          {{shop.shopName}}
                        </div>
                        <div class="ca_address">
                           <span>卡号：{{card.cardNO}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="new_all_ri">
                    <div class="text_new_all">
                        <span style="font-size: 140rpx;color:#fff;">{{card.discountRate * 1000/100?card.discountRate * 1000/100:0}}</span>
                        <span style="font-size: 30rpx;color:#fff;margin-left:16rpx;">折</span>
                        <span class="notice" style="font-size: 24rpx;border:2rpx solid #fff;color:#fff;padding:4rpx 8rpx;">会员折扣</span>
                    </div>
                  </div>
                  <div class="pay_le">
                    <div style="font-size: 30rpx;color:#fff;text-align: center">卡余额  {{card.money}}元</div>
                  </div>
                  <div class="put_cen">
                   <div class="cardPay">
                     <div style="font-size: 24rpx;display: flex;align-items: center;color:#fff;" @click="goRechargeHistory">
                       <img src="../../static/img/newSvipcard/moneyAdd.png" style="float: left;width:28rpx;height:28rpx;margin-right:14rpx;">
                       <span style="float: left;">查看充值记录</span>
                     </div>
                     <div style="width:2rpx;height:32rpx;background:#fff;"></div>
                    <div style="font-size: 24rpx;display: flex;align-items: center;color:#fff;" @click="goPayHistory">
                      <img src="../../static/img/newSvipcard/moneySub.png" style="float: left;width:28rpx;height:28rpx;margin-right:14rpx;">
                      <span style="float: left;">查看消费记录</span>
                    </div>
                  </div>
                 </div>
                  <div class="subPoint">
                    <img src="../../static/img/newSvipcard/subpoint.png" alt="">
                  </div>
              </div>
              <div class="card_bot">
                <div class="ca_bot_le">
                  <i class="iconfont icon-dizhi2" style="float: left;font-size: 46rpx;color:#8D8E98;margin-right:10rpx;"></i>
                  <div style="float: left;color:#8D8E98;width:500rpx;border-right:2rpx solid #E4E4E4;padding-right:16rpx;" @click="goShopMap">
                            <span style="float: left;font-size: 24rpx;">
                               <i style="width:348rpx;float: left; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color:#8D8E98;">{{shop.unitAddress}}</i>
                               {{distance}}km
                               <i class="iconfont icon-iconfontjiantou5" style="display:inline;font-size: 24rpx;color:#8D8E98;"></i>
                            </span>
                  </div>
                </div>
                <div class="ca_bot_ri" @click="putPhone">
                  <i class="iconfont icon-dianhua2"></i>
                </div>
              </div>
            </div>
              <div class="card_img">
                <img src="../../static/img/mySvipCard.png" alt="">
              </div>
          </div>
          <div class="card_black">
            <img src="../../static/img/newSvipcard/common_card.png" alt="" v-if="card.activeType == 1">
            <img src="../../static/img/newSvipcard/card_black.png" alt="" v-else-if="card.activeType == 2">
            <img src="../../static/img/newSvipcard/share_card_1.png" alt="" v-else-if="card.activeType == 3">
          </div>
          <div class="card_con" v-if="card.activeType != 1">
             <div class="card_title">
                分享赚
             </div>
            <div class="eve_con" @click="goShareCard">
               <div class="eve_le_con">
                 已创建{{card.activeType == 2 ? '共享卡' : card.activeType == 3 ? '分享卡' : ''}} {{sharecard_amount}} 张
               </div>
               <div class="eve_ri_con">
                  查看{{card.activeType == 2 ? '共享卡' : card.activeType == 3 ? '分享卡' : ''}}
               </div>
            </div>

            <div class="eve_con" @click="getvipHis">
               <div class="eve_le_con">
                 累计分享收益   {{card.profit}}元
               </div>
               <div class="eve_ri_con">
                 查看详情
               </div>
            </div>

            <div class="eve_con" @click="creatShare">
              <div class="eve_le_con">
                创建{{card.activeType == 2 ? '共享卡' : card.activeType == 3 ? '分享卡' : ''}}
              </div>
              <div class="eve_ri_con">
                <i class="iconfont icon-wuuiconxiangjifangda"></i>
              </div>
            </div>
          </div>

          <div class="how_Share" @click="gohowCreate" v-if="card.activeType != 1">
             如何创建{{card.activeType == 2 ? '共享卡' : card.activeType == 3 ? '分享卡' : ''}}赚钱？
          </div>
       </div>
       <div class="bottom_btn" @click="cardPay">
           卡主付款
       </div>
      </div>
    </div>
</template>

<script>
   import { getSignIn , getQuery} from '@/common/js/comm';
   import floatTo from '@/common/js/floatTo'
   import { mapMutations } from 'vuex'
   import { COLLECTION }  from '@/store/mutation-types'
   import Tips from '@/common/js/tips'
   var amapFile = require('@/utils/amap-wx');
   var myAmapFun;
    export default {
       name: "index",
       data(){
         return{
           active:'',
           card:'',
           shop:'',
           cardNO:'',
           sharecard_amount:'',
           id:'',
           //to
           longitude:'',
           latitude:'',
           //form
           lat:'',
           lng:'',
           distance:'',
           telphone:'',
           bgColor:'',
           discountOffset:'',
           shopStoreId:'',
           shareCardDiscountRateLimit: ''
         }
       },
        onshow(){
           var par =getQuery();
           this.id = par.id;
       },
       mounted(){
          this.newcollection(1);
          myAmapFun = new amapFile.AMapWX({key:'9bf5c08983bd73953f73c20b89899b33'});
          var par =getQuery();
          this.id = par.id;
          this.getCardDetail(par.id);
          this.getLocations();
          this.changethem();
       },
       methods:{
         ...mapMutations({
           newcollection:'COLLECTION'
         }),
         changethem(){
            this.bgColor = this.$store.state.bgColorValue;
         },
         getCardDetail(id){
           var _this = this;
           var _data = {
             token:this.$store.state.token,
             maincardId:id
           };
           getSignIn(_data).then(sec=>{
              _this.$http.getCardDetail(_data,sec).then(res=>{
                if(res.state ==1) {
                  _this.active = res.data.active;
                  res.data.card.money = (res.data.card.money / 100).toFixed(2);
                  res.data.card.profit = floatTo.divide(res.data.card.profit,100);
                  _this.card = res.data.card;
                  _this.shop = res.data.shop;
                  _this.cardNO = res.data.card.cardNO;
                  _this.shopStoreId = res.data.card.shopStoreId;
                  _this.discountOffset = res.data.discountOffset;
                  _this.sharecard_amount = res.data.sharecard_amount;
                  _this.shareCardDiscountRateLimit = res.data.shareCardDiscountRateLimit;
                  //这里是门店的位置
                  _this.longitude = res.data.shop.longitude;
                  _this.latitude = res.data.shop.latitude;
                  _this.telphone = res.data.shop.contactPhone;
                }else{
                  Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                }
              })
           })
         },
         gohowCreate(){
           wx.navigateTo({
             url:`/pages/packageD/pages/howMoney/main`
           })
         },
         goPayHistory(){
            wx.navigateTo({
              url:`/pages/packageD/pages/payHistory/main?id=${this.id}`
            })
         },
         goRechargeHistory(){
           wx.navigateTo({
             url:`/pages/packageD/pages/rechargeHistory/main?id=${this.cardNO}`
           })
         },
         getvipHis(){
           wx.navigateTo({
             url:`/pages/packageD/pages/shareCardHistory/main?id=${this.id}`
           })
         },
         creatShare(){
           console.log(floatTo.subtract(floatTo.multiply(this.shareCardDiscountRateLimit,10),this.discountOffset));
           if(floatTo.multiply(this.card.mainCardDiscountOfStatProfit,10) <= floatTo.subtract(floatTo.multiply(this.shareCardDiscountRateLimit,10),this.discountOffset)) {
             wx.navigateTo({
               url: `/pages/packageD/pages/creatVipCard/main?id=${this.id}`
             })
           }else{
             Tips.toast(`主卡折扣大于${floatTo.subtract(floatTo.multiply(this.shareCardDiscountRateLimit,10),this.discountOffset)}无法设置共享卡`,'none');
           }
         },
         cardPay(){
           //shop.supplierLogo      shop.shopName    card.discountRate  {{card.money}}
           var _self = this
           if(this.shop.id == '1554363195'){
             Tips.confirm('该商家需要扫结算二维码结算(结算商家打印小票上的二维码)').then(res => {
               wx.scanCode({
                 scanType: ['qrCode'],
                 success: _self.scanCallBack
               })
             })
           }else{
             wx.navigateTo({
               url:`/pages/packageD/pages/carderPay/main?id=${this.id}&supplierLogo=${this.shop.supplierLogo}&shopName=${this.shop.shopName}&discountRate=${this.card.discountRate}&money=${this.card.money}&shopStoreId=${this.shopStoreId}`
             })
           }
         },

         scanCallBack(e){
           var _self = this;
           var url = e.result;
           if(url.indexOf('/sapi/hangb/qr/') > -1){
             var attachObj = {'mainCardId':_self.id};
             var _data = {
               isAppAccess: '0',
               isMainCard: '1',
             };
             var otherParamas = {
               otherParams: encodeURIComponent(JSON.stringify(_data))
             };
             getSignIn(otherParamas).then(sec => {
               _self.$http.scanHBQR(url,otherParamas,sec).then(res => {
                 if(res){
                   var params = 'id=' + _self.id + '&shopStoreId=' + res.storeId + '&no=' + res.no + '&refStoreId=' + res.refStoreId;
                   wx.navigateTo({
                     url:`/pages/packageD/pages/carderPay_hangbai/main?${params}`
                   })
                 }else{
                   Tips.toast('出错了','none');
                 }
               })
             })
           }else{
             Tips.toast('请扫描小票码','none')
           }
         },
         goShareCard(){
           wx.navigateTo({
             url:`/pages/packageD/pages/myShareCard/main?id=${this.id}&mainCardNO=${this.cardNO}&supplierLogo=${this.shop.supplierLogo}
             &shopName=${this.shop.shopName}&unitAddress=${this.shop.unitAddress}&cardDiscount=${this.card.discountRate}&discountOffset=${this.discountOffset}&mainCardDiscountOfStatProfit=${this.card.mainCardDiscountOfStatProfit}
             &shareCardDiscountRateLimit=${this.shareCardDiscountRateLimit}`
           })
         },
         goShopMap(){
           this.formSubmit();
         },
         formSubmit() {
           var _this = this;
           wx.getLocation({//获取当前经纬度
             type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
             success: function (res) {
               wx.openLocation({//​使用微信内置地图查看位置。
                 latitude: Number(_this.latitude),//要去的纬度-地址
                 longitude: Number(_this.longitude),//要去的经度-地址
                 name: _this.shop.unitAddress,
                 address: _this.shop.unitAddress
               })
             }
           })
         },
         putPhone(){
           var _this =this;
           if(_this.telphone==''){
             Tips.toast('该商家暂未提供手机号码','none');
           }else{
             wx.makePhoneCall({
               phoneNumber: _this.telphone // 仅为示例，并非真实的电话号码
             })
           }

         },
         getLocations(){
           let _this = this
           wx.getSetting({
             success(res) {
               // 判断用户是否授权过，
               // 未授权过、
               if (!res.authSetting['scope.userLocation']) {
                 wx.authorize({
                   scope: 'scope.userLocation',
                   success(res) {
                     _this.bd_decrypt(Number(_this.longitude),Number(_this.latitude));
                   },
                   fail(err) {
                     // 当用户拒绝 查看自己的位置的时候  统计数据
                     // 统计数据  地理位置为空

                   }
                 })
               } else {
                 // 授权过    百度地图转火星
                 _this.bd_decrypt(Number(_this.longitude),Number(_this.latitude));
               }
             },
             fail(err) {
               console.log(err)
             }
           });
         },
         bd_decrypt(bd_lon,bd_lat) {
           var X_PI = Math.PI * 3000 / 180;
           var x = bd_lon - 0.0065;
           var y = bd_lat - 0.006;
           var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
           var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
           var gg_lon = z * Math.cos(theta);
           var gg_lat = z * Math.sin(theta);
           this.wxGetLocation(gg_lon,gg_lat);
         },
         wxGetLocation(lng,lat){
           var _this = this;
           wx.getLocation({
             type: 'wgs84',
             success: function (res) {
               let latitude,longitude;
               latitude = res.latitude.toString();
               longitude = res.longitude.toString();
               myAmapFun.getDrivingRoute({
                 origin: `${longitude},${latitude}`,
                 destination: `${lng},${lat}`,
                 success: function(data){
                   _this.distance = (data.paths[0].distance /1000).toFixed(2);
                 }
               })
             },
             fail: function(err) {
               console.log(err);
             }
           });
         },
       },
      async onPullDownRefresh() {
        // to doing..
        // 停止下拉刷新
        this.getCardDetail(this.id);
        wx.stopPullDownRefresh();
      },
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: relative;
  .top_bac{
    width:750px;
    height:410px;
    background:rgba(28,45,74,1);
    border-radius:50%;
    position: absolute;
    left:-375rpx;
    top:-506rpx;
  }
  .bottom_btn{
    width:100%;
    height:100rpx;
    color:#fff;
    position: fixed;
    left:0;
    bottom:0;
    background:#F7094D;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
  }
  .page_svip_detail{
    width:710rpx;
    margin:0 20rpx;
    .svip_card{
      margin-top:20rpx;
      width:710rpx;
      border-radius: 10rpx;
      position: relative;
      .card_img{
        position: absolute;
        width:59rpx;
        height:58rpx;
        right:24rpx;
        top:0;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .all_con{
        width:100%;
        overflow: hidden;
        box-shadow: 0px 0px 30rpx rgba(221,64,81,0.3);
        .card_bot{
          padding:0 20rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background:#fff;
          border-bottom-left-radius:10rpx ;
          border-bottom-right-radius: 10rpx;
          .ca_bot_le{
            display: flex;
            align-items: center;
          }
          .ca_bot_ri{
            width:100rpx;
            height:58rpx;
            display:flex;
            justify-content: center;
            align-items: center;
            i{
              color:#666666;
              font-size: 50rpx;
            }
          }
        }
      }
      .inner_card{
        width:670rpx;
        margin:0 20rpx;
        position: relative;
        .subPoint{
          position: absolute;
          width:142rpx;
          height:74rpx;
          right:34rpx;
          top:226rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .in_ca_top{
          margin-top:20rpx;
          margin-bottom:42rpx;
          color:#BF7740;
        }
        .in_ca_img{
          width:100%;
          height:120rpx;
          margin-bottom:10rpx;
          padding-top:26rpx;
          .le_ca_img{
            width:100rpx;
            height:100rpx;
            background:#ff6700;
            border-radius: 50%;
            float: left;
            img{
              width:100%;
              height:100%;
              display: block;
              border-radius: 50%;
            }
          }
          .ri_ca_img{
            width:530rpx;
            height:100rpx;
            float: left;
            display: flex;
            justify-content: space-between;
            padding:0 10rpx;
            .ca_title{
              font-size: 36rpx;
              color:#ffffff;
              width:450rpx;
              @include ovh;
            }
            .ca_address{
              width:280rpx;
              font-size: 28rpx;
              color:#ffffff;
              display: flex;
              align-items: center;
              @include ovh;
              .ca_ad{
                padding:0 22rpx;
                background:#F60F51;
                color:#fff;
                border-radius: 20rpx;
                font-size: 24rpx;
                margin-right:10rpx;
              }
            }
          }
        }
        .put_cen{
          width:100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .cardPay{
          width:70%;
          overflow: hidden;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom:20rpx;
          .pay_le{
            overflow: hidden;
          }
          .pay_ri{
            width:200rpx;
            height:60rpx;
            background:#FDB300;
            box-shadow:0px 1px 3px 0px rgba(206,11,47,0.43);
            border-radius:10px;
            display:flex;
            justify-content: center;
            align-items: center;
            font-size: 30rpx;
            color:#fff;
          }
        }
        .new_all_ri{
          width:100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .text_new_all{
              line-height: 100rpx;
              position: relative;
              span{
                background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
              }
              .notice{
                display: block;
                position: absolute;
                right:-88rpx;
                top:12rpx;
                line-height: 32rpx;
              }
          }
        }
      }
    }
    .card_black{
      width:100%;
      height: 76rpx;
      img{
        width:100%;
        height:76rpx;
        display: block;
      }
    }
    .card_con{
      margin-top:56rpx;
      font-size: 36rpx;
      font-weight: bold;
    }
    .eve_con{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:30rpx 0;
      border-bottom:2rpx solid rgba(0,0,0,0.1);
      .eve_le_con{
        font-size: 30rpx;
        font-weight: normal;
      }
      .eve_ri_con{
        font-size: 28rpx;
        font-weight: normal;
        color:#9A9DA5;
        i{
          line-height:60rpx;
          font-size: 60rpx;
          color:#FDB300;
        }
      }
    }
    .how_Share{
      width:100%;
      text-align: center;
      text-decoration:underline;
      color:#FE1457;
      margin-top:34rpx;
      font-size: 28rpx;
    }
  }
}
</style>
