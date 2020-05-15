<template>
  <div class="page">
      <div class="coupon_detail">
            <div class="coupon_con">
                  <div class="cou_top">
                     <img :src="storData.storeLogo" alt="">
                  </div>
                  <div class="cou_store_name">
                      {{storData.storeName}}
                  </div>
                   <div class="cou_active">
                      {{coupon_mes}}
                   </div>
                   <div class="cou_btn">
                      <div class="cou_btn_con" v-if="resData.state ==4">
                            已过期
                      </div>
                     <div class="cou_btn_con" v-if="resData.state ==3">
                            已使用
                      </div>
                     <div class="cou_btn_con" style="background:#F7094D;" v-if="resData.state ==2"  @click="useCoupon(resData)">
                           立即使用
                     </div>

                   </div>
                   <div class="cou_time">
                       有效期   {{startDate}}-{{endDate}}
                   </div>
                   <div class="coupon_line">
                     <img src="../../static/img/couponLine.png" alt="">
                   </div>
                   <div class="remaker">
                      {{resData.remark}}
                   </div>
                   <div class="cou_solid"></div>
                   <div class="cou_bot">
                       <div class="cou_top_le">
                            <div class="cou_top_le_top">{{storData.storeName}}</div>
                            <div class="cou_bot_le_bot">{{storData.distance}}km   {{storData.address}}</div>
                       </div>
                       <div class="cou_top_ri">
                           <div class="cou_ri_con">
                             <div class="add_le" @click="goShopMap">
                                <i class="iconfont icon-dizhi1"></i>
                             </div>
                             <div class="cou_phone" @click="orderPhone">
                               <i class="iconfont icon-dianhua"></i>
                             </div>
                           </div>
                       </div>
                   </div>
                   <div class="cou_solid"></div>
                   <div class="all_cou" v-if="isMultipleStore==1" @click="goMore">
                       查看全部使用门店
                   </div>
            </div>

      </div>
  </div>
</template>

<script>
  import { getQuery , getSignIn ,toDate } from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  import noData from '@/components/noData'

  export default {
    components:{
      noData
    },
    data() {
      return {
        id:'',
        couponNum:'',
        coupon_mes:'',
        resData:'',
        storData:'',
        shopData:'',
        startDate:'',
        endDate:'',
        isMultipleStore:''
      }
    },
    mounted(){
       var par = getQuery();
       console.log(par);
       this.id = par.id;
       this.couponNum = par.couponNum;
       this.getCoupond();
    },
    methods: {
      getCoupond(){
        var _data = {
          token:this.$store.state.token,
          couponNum:this.couponNum,
          id:this.id,
          longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getCouDetail(_data,sec).then(res=>{
            if(res.state==1){
              _this.consumeMoney = res.data.consumeMoney;   //满多少
              _this.couponMoney = res.data.couponMoney;    //减多少
              _this.textInner = '';
              _this.textInner = `-${_this.couponMoney}`;
              if(res.data.couponType==1) {
                _this.coupon_mes = `满${_this.consumeMoney}减${_this.couponMoney}`;
              }else if(res.data.couponType==2){
                _this.coupon_mes = `${_this.couponMoney}元现金券`;
              }
              _this.resData = res.data;
              _this.isMultipleStore = res.data.isMultipleStore;
              _this.endDate = this.getData(res.data.endDate);
             _this.startDate = this.getData(res.data.startDate);
              _this.storData = res.data.shopStore;
              _this.shopData = res.data.shopStore.shop;
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
            }
          })
        })
      },
      goMore(){
        var _this = this;
         wx.navigateTo({
           url:`../../pages/couponStore/main?id=${_this.id}&couponNum=${_this.couponNum}`
         })
      },
      getData(newData){
         var time = String(newData);
         var newYear = time.substring(0,4);
         var newMonth = time.substring(4,6);
         var newDay = time.substring(6,8);
         return `${newYear}.${newMonth}.${newDay}`
      },
      orderPhone(){
        var _this = this;
        wx.makePhoneCall({
          phoneNumber: _this.storData.mobilePhone //仅为示例，并非真实的电话号码
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
              latitude: Number(_this.storData.latitude),//要去的纬度-地址
              longitude: Number(_this.storData.longitude),//要去的经度-地址
              name: _this.storData.address,
              address: _this.storData.address
            })
          }
        })
      },
      useCoupon(par){
        console.log(par);
        wx.navigateTo({
          url:`../../pages/couQrCode/main?id=${par.id}&couponNum=${par.couponNum}`
        })
      }
    }
  }
</script>

<style lang="scss">
.page{
  width:100%;
  position: absolute;
  left:0;top:0;
  right:0;bottom:0;
  background:linear-gradient(-39deg,rgba(247,9,77,1),rgba(255,139,139,1));
  .coupon_detail{
      width:720rpx;
      padding:0 15rpx;
      height:100vh;
      .coupon_con{
         width:720rpx;
         background:#fff;
         position: relative;
         border-radius: 6rpx;
         float: left;
         margin-top:140rpx;
         .cou_top{
           width:144rpx;
           height:144rpx;
           border-radius: 50%;
           background:#fff;
           position: absolute;
           left:0;
           right:0;
           top:-77rpx;
           margin:0 auto;
           display: flex;
           justify-content: center;
           align-items: center;
           img{
             width:136rpx;
             height:136rpx;
             display: block;
             border-radius: 50%;
           }
         }
         .cou_store_name{
           width:100%;
           margin-top:77rpx;
           display: flex;
           justify-content: center;
           color:#8D8E98;
           font-size: 24rpx;
         }
         .cou_active{
           color:#000;
           font-size: 48rpx;
           width:100%;
           text-align: center;
           padding:30rpx 0  20rpx 0;
         }
         .cou_btn{
          width:100%;
          height:48rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .cou_btn_con{
            background:#8D8E98;
            color:#fff;
            width:256rpx;
            border-radius: 4rpx;
            text-align: center;
            line-height: 48rpx;
            font-size: 28rpx;
          }
        }
         .cou_time{
            width:100%;
            text-align: center;
            color:#8D8E98;
            font-size: 24rpx;
            padding-top:20rpx;
            padding-bottom:20rpx;
         }
        .coupon_line{
          width:100%;
          height:70rpx;
          background:linear-gradient(-39deg,rgba(247,9,77,1),rgba(255,139,139,1));
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
         .remaker{
            width:700rpx;
            padding:20rpx 0;
            margin:0 10rpx;
         }
         .cou_solid{
           width:700rpx;
           margin:0 10rpx;
           height:2rpx;
           background:#E7E9EE;
         }
         .cou_bot{
            width:100%;
            height:100rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            /*margin:20rpx 0;*/
           .cou_top_le{
             padding-left:10rpx;
             font-size: 28rpx;
             .cou_top_le_top{
               font-size: 24rpx;
             }
             .cou_bot_le_bot{
               color:#7d7d7d;
               font-size: 24rpx;
               width:500rpx;
               @include ovh;
             }
           }
           .cou_top_ri{
             width:200rpx;
             height:60rpx;
             .cou_ri_con{
               display: flex;
               justify-content: space-around;
               align-content: center;
               i{
                 font-size: 60rpx;
               }
               .add_le{
                 height:60rpx;
                 width:50%;
                 border-right:2rpx solid #F7094D;;
                 box-sizing: border-box;
                 display: flex;
                 justify-content: center;
                 align-items:center;
                 color:#F7094D;
               }
               .cou_phone{
                 width:50%;
                 height:60rpx;
                 display: flex;
                 justify-content: center;
                 align-items:center;
                 color:#F7094D;
               }
             }
           }
         }
         .all_cou{
           font-size: 26rpx;
           padding:20rpx 0;
           width:700rpx;
           margin:0 10rpx;
         }
      }
  }
}
</style>
