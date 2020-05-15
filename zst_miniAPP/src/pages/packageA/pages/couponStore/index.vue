<template>
  <div class="page">
      <div class="storeList">
         <div class="cou_bot"  v-for="(item,index) in storData">
              <div class="cou_top_le">
                <div class="cou_top_le_top">{{item.storeName}}</div>
                <div class="cou_bot_le_bot">{{item.distance}}km   {{item.address}}</div>
              </div>
              <div class="cou_top_ri">
                <div class="cou_ri_con">
                  <div class="add_le" @click="formSubmit(item)">
                    <i class="iconfont icon-dizhi1"></i>
                  </div>
                  <div class="cou_phone" @click="orderPhone(item.mobilePhone)">
                    <i class="iconfont icon-dianhua"></i>
                  </div>
                </div>
              </div>
            </div>
      </div>
  </div>
</template>

<script>
  import { getQuery , getSignIn ,toDate } from '@/common/js/comm'
  export default {
    data() {
      return {
        id:'',
        couponNum:'',
        storData:''
      }
    },
    mounted(){
      var par = getQuery();
      console.log(par);
      this.id = par.id;
      this.couponNum = par.couponNum;
      this.getStoreList();
    },
    methods: {
      getStoreList(){
        var _data = {
          id:this.id,
          token:this.$store.state.token,
          couponNum:this.couponNum
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
            _this.$http.getcouStoreList(_data,sec).then(res=>{
              if(res.state == 1){
                 _this.storData = res.data;
              }
               console.log(res);
            })
        })
      },
      formSubmit(par) {
        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: par.latitude,//要去的纬度-地址
              longitude: par.longitude,//要去的经度-地址
              name: par.address,
              address: par.address
            })
          }
        })
      },
      orderPhone(phone){
        var _this = this;
        wx.makePhoneCall({
          phoneNumber: phone //仅为示例，并非真实的电话号码
        })
      },
    }
  }
</script>

<style lang="scss">
  .page {
    width: 100%;
    background: #fff;
    .storeList{
      width:710rpx;
      margin:0 20rpx;
      .cou_bot{
        width:100%;
        height:100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:2rpx solid rgba(125,125,125,0.3);
        padding:10rpx 0;
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
    }
  }

</style>
