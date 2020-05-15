<template>
  <div class="page">
      <div class="fir_top">
        <new-swiper :images="images"/>
      </div>
      <div class="qrcode">
          <div class="eve_mod" :key="item.id" v-for="item in imgData" @click="goPage(item)">
              <div class="eve_mod_top">
                <img :src="item.urlPath" alt="">
              </div>
              <div class="eve_mod_bot">
                {{item.srcName}}
              </div>
          </div>
      </div>
      <div class="share_app">
        <swiper class="new_swiper"
                style="height:412rpx;"
                :indicator-dots="nindicatorDots"
                :vertical="nvertical"
                :autoplay="nautoplay"
                interval='false'
                :duration="nduration"
                next-margin="340rpx"
                circular="true"
                :display-multiple-items="nimgNum">
            <swiper-item class="newliMes" @click="gonewxin(item)"  v-for="(item,index) in bannerRegion" :key="index">
              <div class="newMes_top">
                  <img :src="item.titleurl" alt="">
                  <div class="current_text">{{item.count}}人已学习</div>
              </div>
            </swiper-item>
        </swiper>
      </div>

      <div class="vip_con">
        <div class="vip_con_title">
          <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/15cb79f8ba917cdb80dacb3f621e5284.png " alt="">
        </div>

        <div class="scroll_box" style="position: fixed;top:0;left:0;padding-left:4%;z-index:999;" v-if="scrollIn">
          <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
            <div class="item_list" :key="item.id" v-for="(item,index) in list">
              <div class="item_book_text" :class="{active:num == index}" @click="clickHandle(item.id,index)">{{item.name}}</div>
            </div>
          </scroll-view>
        </div>

        <div class="scroll_box" id="the-id">
          <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
            <div class="item_list" :key="item.id" v-for="(item,index) in list">
              <div class="item_book_text" :class="{active:num == index}" @click="clickHandle(item.id,index)">{{item.name}}</div>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="all_goods">
          <div class="add_goods">
        <div class="eve_goods" :key="item.id" v-for="item in dataList" @click="godetail({id:item.id,dis:item.distanse})">
          <div class="eve_g_img">
            <img :src="item.cover" alt="">
          </div>

          <div class="eve_bot_description">
            <div class="eve_bot_de">
              <div class="over_hid" style="margin-left:8rpx;">
                <img src="/static/img/common/cat.png" alt="">{{item.goodsName}}
              </div>
            </div>
          </div>

          <div class="eve_bot_con" :class="item.worldDiscount!=0 ? '':'eve_no_bot'">
            <div class="eve_bot_le" v-if="item.worldDiscount!=0">
              话呗抵扣￥{{item.worldDiscount}}
            </div>
          </div>

          <div class="eve_money">
            <div class="mon_footer">
              <span style="color:#F7094D;font-size: 36rpx;">￥{{item.salePriceMin}}</span>
              <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;" v-if="item.worldDiscount != 0">￥{{item.yuanjia}}</span>
            </div>
          </div>

        </div>
      </div>
      </div>
      <div class="no_more" v-if="noMore">{{notice_mes}}</div>
  </div>
</template>

<script>
import newSwiper  from '@/components/swiper'

import { getSignIn } from '@/common/js/comm'
import { mapMutations } from 'vuex'
import { TOTALMONEY , AREACODE , LNG, LAT , REGION}  from '../../store/mutation-types'

export default {
  props:[],
  data () {
    return {
      scrollTop: 100,
      num:0,
      index:0,
      // 精品推荐 手机数码 运动鞋包
      list:[],
      thrImg:[],
      dataList:[],
      isactive:false,
      noMore:false,
      // 轮播
      images:[],
      // 传递的参数
      par:{
         pageNum:1,
         pageSize:10,
         typeIdPath:'118000000000',
      },
      notice_mes:'',
      attenAcc:'',
      scrollIn:false,
      moduleVip:[],
      inMes:false,

      dataArr:[],
      innerTitle:'',


      imgData:[
         {
            urlPath:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/d0b34f9771d65599777f94987b809720.png ',
            srcName:'核销码'
         },
          {
            urlPath:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/6cfc10f2739b9856980ed144ab398d02.png ',
            srcName:'话呗充值'
          },

         {
            urlPath:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/f112e0589bfb2fd221cceb9b3fe73c9f.png ',
            srcName:'优惠券'
         },
         {
            urlPath:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/6b0dd623ac7f018482dc7bf2200a3eda.png ',
            srcName:'卡友帮'
         }
      ],

      nindicatorDots: false,
      nvertical: false,
      nautoplay: false,
      ninterval: 3000,
      nduration: 1000,
      nimgNum:1,

      shopName:'',
      mainStoreId:'',
      shopid:'',
      bannerRegion:[],
    }
  },

  components: {
    newSwiper
  },
  onShow(){
    this.checkNewVersion();
    this.getBalance();
    this.getShopMes();
    this.getbanner();
    this.getBannerMes();
  },
  mounted(){
    this.attenAcc = this.$store.state.attenAccount;
    this.getMoudle();
    this.getShopType();
    this.getShopP(this.par);
    //获取用户授权信息
    this.getLocations();
    if (this.$store.state.rechargeSwitch == 0 || this.$store.state.rechargeSwitch == -1) {
      this.inMes = true;
    } else {
      this.innerTitle = '推荐商家'
      this.inMes = false;
    }
  },

  methods: {
    ...mapMutations({
      totalMoney:'TOTALMONEY',
      areaCode:'AREACODE',
      lng:'LNG',
      lat:'LAT',
      region:'REGION',
    }),
    godeShopdtail(){
      var _this = this;
      wx.navigateTo({
        url:`../../pages/packageB/pages/shopRecDet/main?shopStoreId=${_this.mainStoreId}&distance=${0}&shopId=${_this.shopid}`
      })
    },
    gonewxin(par){
      wx.navigateTo({
        url:`/pages/packageD/pages/Monologue/main?id=${par.id}&detailurl=${par.detailurl}`
      })
    },
    getBannerMes(){
       this.$http.getInderBanner().then(res=>{
         if(res.state == 1) {
           this.bannerRegion = res.data;
         }
       })
    },
    gonewMoney(){
      wx.navigateTo({
        url:'/pages/packageD/pages/enjoyMemDis/main'
      })
    },
    gogong(){
      wx.navigateTo({
        url:'/pages/packageB/pages/shareParent/main'
      })
    },
    getShopMes(){
      var _data = {
        token:this.$store.state.token,
        shopId:this.$store.state.newShopId ? this.$store.state.newShopId:'',
        longitude:'',
        latitude:''
      }
      var _this = this;
      getSignIn(_data).then(sec=>{
         _this.$http.getShopMes(_data,sec).then(res=>{
           _this.shopName = res.shop.shopName;
           _this.mainStoreId = res.shop.mainStoreId;
           _this.shopid = res.shop.id;
         })
      })
    },
    goPage(par){
      if(this.$store.state.token){
        if(par.srcName == '核销码'){
          wx.navigateTo({
            url:'../../pages/packageA/pages/qrPay/main'
          })
        }else if(par.srcName == '优惠券'){
          wx.navigateTo({
            url:'/pages/packageA/pages/couponList/main'
          })
        }else if(par.srcName == '卡友帮'){
          wx.navigateTo({
            url:'/pages/packageC/pages/index/main'
          })
        }else if(par.srcName == '话呗充值'){
          wx.navigateTo({
            url:'../../pages/packageA/pages/worldPay/main'
          })
        }
      }else{
        wx.navigateTo({
          url:'/pages/loginpage/main'
        })
      }

    },
    checkNewVersion(){
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: "已经有新版本了哟~",
                content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
              });
            });
          }else{
            console.log('版本没有检测到更新');
          }
        });
    },

    goShop(par){
      wx.navigateTo({
        url:`../../pages/shopRecDet/main?shopStoreId=${par.id}&distance=${par.distance}`
      })
    },
    getLocations(){
      let _this = this
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success(res) {
                _this.wxGetLocation()
              },
              fail(err) {
                console.log('11',err);
              }
            })
          } else {
            // 授权过
            _this.wxGetLocation();
          }
        },
        fail(err) {
          console.log(err)
        }
      });
    },
    gcj02tobd09(lng, lat){
      // alert(1)
      var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
      var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
      var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat]
    },
    wxGetLocation(){
      let _this = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          let latitude,longitude,lati,long;
          lati = res.latitude.toString();
          long = res.longitude.toString();
          var arr  = _this.gcj02tobd09(long,lati)
          latitude = arr[1];
          longitude = arr[0];
          wx.request({
            header:{
              "Content-Type": "application/text"
            },
            url:'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=BQ5BZ-KE434-I4CU6-X5WGI-J4MXE-7CFZL',
            success: function(res) {
              let lng,lat,areaCode,region =[];
              lng = res.data.result.location.lng;   //纬度
              lat = res.data.result.location.lat;   //精度
              areaCode = res.data.result.ad_info.adcode; //所在城市编码
              region[0] = res.data.result.address_component.province; //省市区
              region[1] = res.data.result.address_component.city; //省市区
              region[2] = res.data.result.address_component.district; //省市区
              _this.areaCode(areaCode);
              _this.lng(lng);
              _this.lat(lat);
              _this.region(region);
            },

          });
        },
        fail: function(err) {
          console.log(err);
        }
      });
    },
    getBalance(){
      var _this = this;
      var _data = {
        token:this.$store.state.token,
      }
      getSignIn(_data).then(sec=>{
        _this.$http.getBalance(_data,sec).then(res=>{
          if(res.state == 1) {
            _this.totalMoney(res.data.totalMoney);
          }else{
             console.log('为什么会提示用户不存在',decodeURIComponent(res.msg))
          }
        })
      })
    },
    getbanner(){
      var _data = {
        token:this.$store.state.token,
      }
      getSignIn(_data).then(sec=>{
        this.$http.getbanner(_data,sec).then(res=>{
          if(res.state=1){
            this.images  = [];
            this.images = res.indexBanner
          }else{
            console.log('获取轮播图失败');
          }
        })
      })
    },
    getMoudle(){
      var _this = this;
      if(this.$store.state.token){
        var par = {
          token:this.$store.state.token,
          appFlag:0,
          version:this.$store.state.appVersion,
          device:this.$store.state.device
        }
      }
      getSignIn(par).then(sec=>{
          _this.$http.getMoudle(par,sec).then(res=>{
              if(res.data.length != 0) {
                var imgSrc = res.imgDomain;
                var img_head = res.data[0].modules
                for (let i = 0; i < img_head.length; i++) {
                  img_head[i].moduleImg = `${imgSrc}${img_head[i].moduleImg}`
                }
                _this.moduleVip = img_head;
              }
          })
        }
      )
    },
    getShopP(par){
      var _this =this;
      getSignIn(par).then(sec=>{
          _this.$http.getShopP(par,sec).then(res=>{
            if(res.state == 1) {
              if (res.data.length != 0) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                  res.data[i].worldDiscount =  ((res.data[i].yuanjia)*10000 - (res.data[i].salePriceMin)*10000)/10000;
                }
                _this.dataList = _this.dataList.concat(res.data);
              } else {
                this.noMore = true;
                this.notice_mes = '没有更多数据了~';
                return 1;
              }
            }
          })

        }
      )
    },
    getShopType(){
      var _this =this;
      var par = {
        platform:3
      }
      getSignIn(par).then(sec=>{
          _this.$http.getShopType(par,sec).then(res=>{
            _this.par.typeIdPath=res.data[0].id;
           _this.list = res.data;
          })
        }
      )
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    godetail(par){
      const url = `../../pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
      wx.navigateTo({ url })
    },
    goIsCarder(){
      const url = '../../pages/isCarder/main'
      wx.navigateTo({ url })
    },
    clickHandle (id,par) {
      this.num = par;
      this.par.typeIdPath = id;
      this.dataList = [];
      this.par.pageNum = 1;
      this.getShopP(this.par);
    },
  },
  onPageScroll:function(e){
    if (this.$store.state.rechargeSwitch == 0 || this.$store.state.rechargeSwitch == -1) {
      let _this = this;
      var query = wx.createSelectorQuery()
      query.select('#the-id').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        if (res[0]) {
          if (res[0].top <= 0) {
            _this.scrollIn = true;
          } else if (res[0].top > 0) {
            _this.scrollIn = false;
          }
        }
      })
    }
  },
  async onPullDownRefresh() {
    // to doing..
    // 停止下拉刷新
    this.getbanner();
    this.par.pageNum = 1;
    this.getShopP(this.par);
    wx.stopPullDownRefresh();
  },
  async onReachBottom() {
    // 到这底部在这里需要做什么事情
      this.par.pageNum ++;
      this.notice_mes = '加载中...';
      this.getShopP(this.par);
      if(this.notice_mes == '没有多数据了~'){
        return false;
      }
  },
}
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  height:100%;
  overflow: hidden;
  .new_top{
    padding:0 25rpx;
    height:52rpx;
    width:700rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .all_le{
      display: flex;
      align-items: center;
      font-size: 28rpx;
      .new_top_le{
        width:106rpx;
        height:26rpx;
        margin-right:20rpx;
        img{
          width:100%;
          height:26rpx;
          display: block;
        }
      }
    }
    .all_ri{
      display: flex;
      font-size:24rpx;
      line-height: 24rpx;
      color:#F7094D;
      font-weight: 700;
      i{
        margin-left:20rpx;
        font-size: 22rpx;
        height:24rpx;
        color:#F7094D;
        font-weight: 700;
      }
    }
  }
  .fir_top{
    width:698rpx;
    margin:20rpx 26rpx;
    /*margin-bottom:10rpx;*/
  }
  .qrcode{
    width:698rpx;
    margin:20rpx 26rpx;
    margin-bottom:10rpx;
    display: flex;
    justify-content: space-between;
    .eve_mod{
      text-align: center;
      .eve_mod_top{
        img {
          width:100rpx;
          height:100rpx;
        }
      }
      .eve_mod_bot{
        font-size: 24rpx;
        color:#000;
      }
    }
    .qr_left{
      width:320rpx;
      height:150rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .qr_right{
      width:320rpx;
      height:150rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
  }
  .cur_shop{
    width:100%;
    height:215rpx;
    .cur_shop_title{
      margin-left:14rpx;
      margin-right:14rpx;
      margin-bottom:24rpx;
    }
    .cur_shop_img{
      width:750rpx;
      overflow: hidden;
      height:auto;
      display: flex;
      justify-content: center;
      align-items: center;
      .all_eve{
        width:680rpx;

        display: flex;
        justify-content: space-between;
        align-items: center;
        .eve_cur{
           background:#fff;
           display: flex;
           align-items: center;
           flex-direction: column;
          .cur_sh_to{
            height:80rpx;
            width:80rpx;
            margin-bottom:4rpx;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
          .cur_sh_bo{
            font-size:24rpx;
          }
        }
      }
    }
  }
  .hengxian{
    width:100%;
    height:10rpx;
    background:rgba(242,242,242,1);
    overflow: hidden;
  }
  .share_app{
    width:750rpx;
    height:418rpx;
    .new_swiper{
      .newliMes{
        width:442rpx;
        height:100%;
        .newMes_top{
          width:442rpx;
          height:412rpx;
          position: relative;
          img{
            width:430rpx;
            height:100%;
            display: block;
          }
          .current_text{
            position: absolute;
            bottom:30rpx;
            left:36rpx;
            color:#F7094D;
            font-size: 20rpx;
          }
        }
        .new_bot{
          font-size: 28rpx;
          padding-right:20rpx;
          margin-top:20rpx;
        }
      }
    }
    .sh_pho_le{
      width:340rpx;
      height:100%;
      background:#f2f2f2;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color:#cccccc;
    }
    .share_title{
      width:100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top:24rpx;
      margin-bottom:10rpx;
      .sha_img{
        width:211rpx;
        height:22rpx;
        margin-bottom:8rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .sha_title{
        font-size: 20rpx;
        color:#0D0D0F;
      }

    }
    .share_con{
      margin:0 19rpx;
      overflow: hidden;
      .sh_co_top{
        .sh_left{
          width:48%;
          float: left;
          margin-right:4%;
          margin-bottom:20rpx;
          .sh_le_im{
            width:80rpx;
            height:80rpx;
            float: left;
            img{
              width:100%;
              height:100%;
              display:block;
            }
          }
          .sh_le_con{
            padding-top:16rpx;
            float: left;
            width:76%;
          }
        }
        .sh_left:nth-child(2n){
          margin-right:0;
        }
        .sh_right{
          width:48%;
        }
      }
    }
    .share_bot{
      width:100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      .sh_bot_title{
        font-size:24rpx;
        color:#FE0F53;
        padding:10rpx 0;
      }
      .sh_bot_img{
        width:700rpx;
        height:186rpx;
        margin-bottom:20rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
    }
  }
  .fir_bot_bot{
    width:702rpx;
    padding:0 24rpx;
    margin-bottom:10rpx;
  }
  .vip_con{
    width:92%;
    margin:0 4%;
    overflow: hidden;
    .vip_con_title{
      margin-top:10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 19rpx;
      img{
        width:276rpx;
        height:70rpx;
        display: block;
      }
        span{
          display: block;
          overflow: hidden;
        }
    }
    .scroll_box{
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      background:#fff;
      ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    .svip_con{
      width:100%;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      .svip_img{
        width:340rpx;
        height:222rpx;
        img {
          width:100%;
          height:100%;
          display: block;
        }
      }
    }
    .scro_con{
      width:100%;
    }
    .item_list{
      height: auto;
      margin-right: 80rpx;
      display: inline-block;
      .item_book_text{
        font-size: 28rpx;
      }
      .active{
        color:#F7094D;
        border-bottom:2px solid #F7094D;
      }
    }
  }
  .all_goods{
    padding-top:14rpx;
    width:100%;
    overflow: hidden;
    background:#f2f2f2;
    .add_goods{
      width:94%;
      margin:0 3%;
      overflow: hidden;
      display:grid;
      grid-template-columns: 340rpx 340rpx;
      grid-column-gap:25rpx;
      grid-auto-flow: row dense;
    }
    .eve_goods{
      width:340rpx;
      margin-right:25rpx;
      margin-bottom:14rpx;
      border-radius: 10rpx;
      padding-bottom:24rpx;
      background: #fff;
      float: left;
      .eve_g_img{
        width:340rpx;
        height:340rpx;
        background: #f2f2f2;
        border-radius: 8rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-top-left-radius: 8rpx;
          border-top-right-radius: 8rpx;
        }
      }
      .eve_bot_description{
        margin:0 12rpx;
        font-size: 24rpx;
        margin-top:14rpx;
        margin-bottom:36rpx;
        overflow: hidden;
        .eve_bot_de{
          .over_hid{
            width:312rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            img{
              width:27rpx;
              height:27rpx;
              margin-right:10rpx;
            }

          }

        }
      }
      .eve_bot_con{
        margin:0 12rpx;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        margin-bottom:24rpx;
        .eve_bot_le{
          height:30rpx;
          text-align: center;
          background:#F7094D;
          font-size: 20rpx;
          color:#fff;
          border-radius: 6rpx;
          padding:0 16rpx;
          line-height: 30rpx;
        }
        .arrow_box {
          height:26rpx;
          font-size: 20rpx;
          background:#f2f2f2;
          position: relative;
          border: 1px solid #F7094D;
          line-height: 28rpx;
          padding:0 6rpx;
        }
        .arrow_box:after, .arrow_box:before {
          right: 100%;
          top: 50%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }

        .arrow_box:after {
          border-color: rgba(136, 183, 213, 0);
          border-right-color: #fff2f6;
          border-width: 8rpx;
          margin-top: -8rpx;
        }
        .arrow_box:before {
          border-color: rgba(194, 225, 245, 0);
          border-right-color: #F7094D;
          border-width: 12rpx;
          margin-top: -12rpx;
        }
      }
      .eve_no_bot{
        margin-bottom:0;
      }
      .eve_money{
        margin:0 14rpx;
        height:29rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mon_footer{
          overflow: hidden;
        }
        .mon_mon{
          font-size: 24rpx;
          color:#9A9DA5;
        }
      }
    }
    .eve_goods:nth-child(2n){
      margin-right:0;
    }
  }
  .shop_bot{
    width:710rpx;
    padding:0 20rpx;
    .shop_bot_title{
      margin-top:20rpx;
      font-size:36rpx;
      font-weight:bold;
      color:rgba(0,0,0,1);
      margin-bottom:36rpx;
    }
    .eve_shop_inner{
      width:100%;
      .eve_con{
        width:100%;
        height:190rpx;
        border-bottom:2rpx solid rgba(52,60,83,0.2);
        padding-bottom:56rpx;
        margin-top:30rpx;
        .eve_con_le{
          width:250rpx;
          height:190rpx;
          background: #f2f2f2;
          border-radius: 10rpx;
          float: left;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 10rpx;
          }
        }
        .eve_con_ri{
          float: left;
          width:434rpx;
          margin-left:16rpx;
          .ev_shopName{
            font-size: 32rpx;
            font-weight:400;
            @include jcsb;
            align-items: center;
            .ev_name{
              width:324rpx;
              @include ovh;
            }
            .ev_add{
              font-size:24rpx;
              color:rgba(52,60,83,0.6);
            }
          }
          .intro{
            height:30rpx;
            display: flex;
            align-items: center;
            margin-top:10rpx;
            .in_tit{
              font-size: 24rpx;
              line-height:30rpx;
              float: left;
              margin-right:14rpx;
            }
            .in_img{
              float: left;
              width:110rpx;
              height:30rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
        }
      }
    }
    .int_cu{
      width:100%;
      height:30rpx;
      display: flex;
      align-items: center;
      margin:10rpx 0;
      .cu_img{
        width:24rpx;
        height:24rpx;
        float: left;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .cu_con{
        float: left;
        font-size: 24rpx;
      }
    }
    .int_bot_bot{

    }
  }
  .no_more{
    width:100%;
    height:90rpx;
    text-align: center;
    line-height: 90rpx;
    background:#f2f2f2;
    /*padding-bottom:160rpx;*/
  }
}

</style>
