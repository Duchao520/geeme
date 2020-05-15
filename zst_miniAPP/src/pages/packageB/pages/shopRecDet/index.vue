<template>
  <div class="page">
    <div class="share_card_top">
      <div class="sh_tit_ri fz-50 txt-ellipsis">
        {{detaildata.storeName}}
      </div>
      <div class="flex_box activities justify_space_between align_center"
           style="margin-bottom: 27rpx">
        <div class="flex_box align_center">
          <img src="../../static/img/card_store.png" alt=""
               style="display: block;width: 131rpx;height: 33rpx;margin-right: 12rpx;"
               v-if="lstSvipShareCard.length!=0">
          <img src="../../static/img/bargain.png" alt=""
               style="display: block;width: 132rpx;height: 33rpx;margin-right: 12rpx;"
               v-if="bargains.length > 0">
          <p class="act fz-22" v-if="lstSvipShareCard.length!=0">共享卡会员卡{{lstSvipShareCard.length!=0 ? lstSvipShareCard[0].shareCardDiscount * 1000/100 : '' }}折</p>
        </div>
        <i class="iconfont icon-xiajiantou fc-8D8E98 fz-24" @click="toast_type = 2"></i>
      </div>
      <div class="sh_pho" v-if="detaildata.storeImgs == ''">
        <div class="sh_pho_le">
          暂无图片
        </div>
        <div class="sh_pho_le">
          暂无图片
        </div>
      </div>
      <div class="sh_pho"  v-else-if="detaildata.storeImgs != ''">
        <swiper class="swiper"
                :indicator-dots="indicatorDots"
                :vertical="vertical"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
                next-margin="50rpx"
                :display-multiple-items="imgNum">
          <block v-for="(item,index) in images" :key="index">
            <swiper-item class="li1">
              <img :src="item +'!243x180'" alt="" class="slide-image" @click="getImgDetail(item)">
            </swiper-item>
          </block>
        </swiper>
      </div>

      <div class="card_bot" style="border-bottom: 1rpx dashed #EAEAEA">
        <div class="ca_bot_le flex_box align_center">
          <i class="iconfont icon-dizhi fz-32" style="color:#1B1B1B;margin-right:10rpx;"></i>
          <div class="flex_box justify_space_between" style="color:#000;width:516rpx;padding-right:16rpx;" @click="goShopMap">
            <p class="txt-ellipsis fz-24" style="width: 450rpx;">{{detaildata.address}}</p>
            <p class="fz-24">{{distance}}km</p>
          </div>
        </div>
        <div class="ca_bot_ri" @click="ordPhone">
          <i class="iconfont icon-dianhua fz-36"></i>
        </div>
      </div>
      <div class="flex_box justify_space_between align_center" style="padding: 16rpx 0;border-bottom: 1rpx dashed #EAEAEA"
           @click="toast_type = 3">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="../../static/img/icon_store.png" alt="" style="display: block;width: 30rpx;height: 30rpx;margin-right: 12rpx">
          <p class="fz-24" style="margin-right: 24rpx">营业时间</p>
          <p class="fz-20 fc-8D8E98">{{detaildata.openHours}}</p>
        </div>
        <i class="iconfont icon-iconfontjiantou5 fz-22 fc-8D8E98"></i>
      </div>
      <div class="flex_box justify_space_between align_center"
           style="padding: 16rpx 0;border-bottom: 1rpx dashed #EAEAEA"
           @click="toast_type = 1" v-if="allactive.length > 0">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="../../static/img/icon_group.png" alt="" style="display: block;width: 30rpx;height: 30rpx;margin-right: 12rpx">
          <p class="fz-24" style="margin-right: 24rpx">招募卡主</p>
          <p class="fz-20 fc-8D8E98">共{{allactive.length}}个套餐</p>
        </div>
        <i class="iconfont icon-iconfontjiantou5 fz-22 fc-8D8E98"></i>
      </div>
      <div class="flex_box justify_space_between align_center"
           style="padding: 16rpx 0;"
           v-if="lstSvipShareCard.length!=0 && detaildata.shopId != '1554363195'"
           @click="cardPay(detaildata)">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="../../static/img/icon_card.png" alt="" style="display: block;width: 30rpx;height: 30rpx;margin-right: 12rpx">
          <p class="fz-24">使用共享会员卡付款，最低{{lstSvipShareCard.length!=0 ? lstSvipShareCard[0].shareCardDiscount * 1000/100 : '' }}折</p>
          <img src="../../static/img/suggest.png" alt="" style="display: block;width: 130rpx;height: 25rpx;">
        </div>
        <i class="iconfont icon-iconfontjiantou5 fz-22 fc-8D8E98"></i>
      </div>
      <div class="btn_history" v-if="detaildata.isOpenPayChannel==1">
          <div class="le_btn" v-if="detaildata.comShareDiscountCardRate !=10">
            <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/9/08c2ce78ce59f913ea96a7fcd1033ef2.png" alt="">
            <div class="discount_mes">
                {{detaildata.comShareDiscountCardRate}} 折
            </div>
          </div>
          <div class="ri_btn" v-if="detaildata.vipShareDiscountCardRate!=10">
            <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/9/39d73e6dfc8ebac24e76c4aa5134b76e.png" alt="">
            <div class="discount_mes">
              {{detaildata.vipShareDiscountCardRate }} 折
            </div>
          </div>
      </div>
    </div>
    <div v-if="detaildata.comShareDiscountCardRate !=10 && detaildata.vipShareDiscountCardRate!=10 && detaildata.isOpenPayChannel==1" class="aliange" style="display: flex;justify-content: center;align-items: center;padding-bottom:20rpx;">
       <span style="display: flex;" @click="goalignPage">
         <span style="text-decoration:underline;color:#FE054C;font-size: 24rpx;">如何免费获得联盟打折卡</span>
         <i class="iconfont icon-sanjiaoright" style="color:#FE054C;line-height: 36rpx;"></i>
       </span>
    </div>
    <div class="bargain box_padding" style="padding: 33rpx 22rpx;border-top: 20rpx solid #F2F2F2" v-if="bargains.length > 0">
      <div class="flex_box align_center justify_space_between">
        <p class="fz-34 fc-0D0D0F font-weight" style="margin-bottom: 24rpx">砍价活动({{bargains.length}})</p>
        <p class="fz-28 fc-8D8E98 flex_box" @click="bargainFlag = !bargainFlag">{{bargainFlag ? '收起' : '展开'}}<i class="iconfont fz-28" :class="{'icon-shouqitianchong': bargainFlag,'icon-shouqitianchong-copy': !bargainFlag}"></i></p>
      </div>
      <div class="flex_box"
           v-for="(bargain,idx) in bargains"
           v-if="bargainFlag || idx==0"
           :key="idx"
           style="margin-bottom: 20rpx;border-bottom: 1rpx solid #E5E5E5;padding-bottom: 20rpx">
        <img :src="bargain.mainImg" alt="" class="thumb">
        <div class="detail">
          <p class="fz-34 txt-ellipsis">{{bargain.title}}</p>
          <div class="flex_box justify_space_between align_center" style="margin-bottom: 12rpx">
            <div style="width: 370rpx">
              <v-progress :height="'15'" :rate="((bargain.shareNum - bargain.surplusShareNum)/bargain.shareNum*100) + '%'" :progressBg="'#4045D5'"></v-progress>
            </div>
            <p class="fz-22 fc-8D8E98">已砍{{bargain.shareNum - bargain.surplusShareNum}}/{{bargain.shareNum}}份</p>
          </div>
          <div class="flex_box justify_space_between align_center">
            <div class="flex_box flex_column" style="height: 70rpx">
              <p class="fz-24">已有{{bargain.helperNum}}人参与</p>
              <p class="flex_box align_center" v-if="bargain.currentPrice != 0">
                <i class="iconfont icon-renminbi fz-38 fc-F7094D">{{bargain.currentPrice}}</i>
                <i class="iconfont icon-renminbi fz-30 fc-8D8E98" style="text-decoration: line-through">{{bargain.originalPrice}}</i>
              </p>
              <p class="fz-38 fc-F7094D" v-else>砍价免费拿</p>
            </div>
            <button class="btn_radius fc-ffffff fz-34"
                    style="background: #FA336C;padding: 0 12rpx;margin: 0" @click="linkToGoodsDetail(bargain)">参与砍价</button>
          </div>
        </div>
      </div>
    </div>
    <div class="bot_share_card">
      <div class="shop_recom" v-if="shopData.length!=0">
        <div class="title">
          <div class="tit_le">店铺推荐</div>
          <div class="tit_ri" @click="goLineShop"><span>进入线上店铺</span> <i class="iconfont icon-iconfontjiantou5"></i></div>
        </div>
      </div>

      <div class="sh_pho_sec" v-if="shopData.length!=0">
        <div class="li1_sec" v-for="(item,index) in shopData" :key="index"  @click="godetail({id:item.id,dis:item.distanse})">
          <div class="li_top">
            <img :src="item.cover" alt="">
          </div>
          <div class="li_bot">
            <div class="Li_bot_top">
              <img src="/static/img/zst_logo.png" style="width:26rpx;height:26rpx;float: left;padding-top:4rpx;margin-right:6rpx;" alt="">
              <span style="font-size: 24rpx;">{{item.goodsName}}</span>
            </div>
            <div class="Li_bot_bot">
              ￥{{item.salePriceMin}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast_module" v-if="toast_type">
      <div class="bot_card" v-if="toast_type == 1">
        <img src="/static/img/close.png" class="close" alt="" @click="toast_type = ''">
        <div class="bot_title">
          <div class="bot_ti_top">招募卡主</div>
          <div class="bot_ti_bot" @click="goCarder"><span style="font-size: 28rpx;margin-right: 10rpx;">什么是卡主</span><i class="iconfont icon-sanjiaoright"></i></div>
        </div>
        <div class="over_show">
          <div class="bot_con">
            本店招募卡主，卡主享受最低会员价，
            套餐如下：
          </div>
          <div class="all_con" v-for="(item,index) in allactive" :key="index">
            <div class="img_message">
              <span>{{index+1}}</span>
            </div>
            <div class="con_con"><span>充{{item.shouldMoney*100/10000}}元</span><span v-if="item.giveMoney!=0">送{{item.giveMoney * 100/10000}}元</span><span v-if="item.giveMoney!= 0 && item.discountRate!=0"> ，</span><span v-if="item.discountRate!=0">享受{{item.discountRate*1000/100}}折优惠</span></div>
          </div>
          <div style="width:100%;text-align: center;font-size: 24rpx;color:#AF7651;">注：成为卡主需在线下门店进行充值</div>
        </div>
      </div>
      <div class="actDesc fc-0D0D0F" v-else-if="toast_type == 2">
        <img src="/static/img/close.png" class="close" alt="" @click="toast_type = ''">
        <p class="fz-34 font-weight" style="margin-bottom: 40rpx;">商家活动</p>
        <div class="flex_box justify_space_between">
          <i class="fz-28">卡主商家</i>
          <div style="width: 535rpx;">
            <p class="fz-28" style="margin-bottom: 24rpx;">有招募卡主活动（会员充值活动），成为卡主可享受如下权益:</p>
            <div class="fz-24 flex_box" style="line-height: 30rpx;margin-bottom: 20rpx;">
              <i class="num">1</i>
              <p style="width: 500rpx">卡主可享受充值会员价在门店消费</p>
            </div>
            <div class="fz-24 flex_box" style="line-height: 30rpx;margin-bottom: 20rpx;">
              <i class="num">2</i>
              <p style="width: 500rpx">卡主可创建分享卡和将会员价分享给好友使用</p>
            </div>
            <div class="fz-24 flex_box" style="line-height: 30rpx;margin-bottom: 20rpx;flex-direction: wrap">
              <i class="num">3</i>
              <p style="width: 500rpx">充值共享卡套餐可创建共享卡，共享卡发布到门店，也可分享给好友</p>
            </div>
          </div>
        </div>
        <div class="flex_box justify_space_between" style="margin-bottom: 30rpx">
          <i class="fz-28">砍价活动</i>
          <p class="fz-28" style="width: 535rpx;">
            邀请好友砍价，砍成既可以通过核销码兑奖，具体见门店砍价版块及卡友帮版块
          </p>
        </div>
        <div class="flex_box justify_space_between" style="margin-bottom: 30rpx">
          <i class="fz-28">共享会员卡</i>
          <p class="fz-28" style="width: 535rpx;">
            该商家门店有共享会员卡，使用共享会员卡付款，非会员也能享受会员价
          </p>
        </div>
        <!--<div class="flex_box justify_space_between">
          <i class="fz-28">共享打折卡</i>
          <p class="fz-28" style="width: 535rpx;">
            该商家付款时使用共享打折卡进行打折，共享打折卡可通过商家活动免费获取
          </p>
        </div>-->
      </div>
      <div class="storeDesc box_padding" v-else-if="toast_type == 3">
        <img src="/static/img/close.png" class="close" alt="" @click="toast_type = ''">
        <p class="fz-34" style="margin-bottom: 34rpx;">商家介绍</p>
        <p class="fz-28">{{detaildata.storeName}}</p>
        <p class="fz-28">营业时间 {{detaildata.openHours}}</p>
        <p>{{detaildata.remark}}</p>
      </div>
    </div>

    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>

    <div class="bot_btn" @click="goPayMoney">
      <div class="btn_bot_top">立即付款</div>
      <div class="btn_bot_bot">享受会员折扣价</div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , bd_decrypt} from '@/common/js/comm';
  import vProgress from './v-progress'
  import { mapMutations } from 'vuex'
  import {  AREACODE , LNG, LAT , REGION}  from '@/store/mutation-types'
  var amapFile = require('@/utils/amap-wx');
  var myAmapFun;
  import Tips from '@/common/js/tips';
  export default {
    name: "index",
    components: {
      vProgress
    },
    data(){
      return {
        shopStoreId:'',
        distance:'',
        discountInfo:'',
        svipCardActives:[],
        // 保存全部活动的数组
        allactive:[],

        collection:'',
        useintro:'',
        detaildata:'',
        shareCard:'',
        token:'',

        currentItemId:0,
        images:[],
        indicatorDots: false,
        vertical: false,
        autoplay: false,
        interval: 3000,
        duration: 1000,
        imgNum:2,
        imgNum_sec:3,

        lstSvipShareCard:[],

        //to
        longitude:'',
        latitude:'',
        //form
        lat1:'',
        lng2:'',
        inviterId:'',
        scene:'',

        over_show:true,
        showBtn:true,
        noticeM:'展开商家活动',

        par: {
          pageNum: 1,
          pageSize: 3,
          token: this.$store.state.token,
          isBoutique:1,
          shopId:''
        },
        shopData:[],
        bigImg:'',
        showImg:false,
        userId:'',
        bargains: '',
        showCard:1,
        toast_type: '', //1商家活动介绍  2招募卡主套餐
        bargainFlag: false,
        animationData1: '',
      }
    },
    mounted(){
      var par = getQuery();
      const pages = getCurrentPages();
      console.log('分享商家进来的页面',par);
      if(par.scene){
        par.scene = decodeURIComponent(par.scene);
        var narr = par.scene.split(',');
        this.shopStoreId =  par.shopStoreId? par.shopStoreId :narr[0];
        this.distance = par.distance ? par.distance:narr[1];
      }else{
        this.shopStoreId =  par.shopStoreId? par.shopStoreId : '';
        this.distance = par.distance ? par.distance: '';
        this.par.shopId = par.shopId ? par.shopId : '';
      }
      this.token = this.$store.state.token;
      if(par.inviterId){
        this.inviterId =par.inviterId;
      }else if(par.userId){
        this.inviterId =par.userId;
      }else{
        this.inviterId ='';
      }
      console.log('商店分享出来的',this.inviterId);
      this.scene = par.scene;
      this.getDetail();
      // if(!(pages[1].route.indexOf('shopRecom')>-1 || pages[0].route.indexOf('nearbyShop')>-1) ){
      this.getLocations();
      /*if(this.token){

        // }
      }else{
        const url = `../../../../pages/loginpage/main?distance=${this.distance}&shopId=${this.par.shopId}&shopStoreId=${this.shopStoreId}&inviterId=${this.inviterId}&scene=${this.scene}`;
        wx.navigateTo({url})
      }*/
      myAmapFun = new amapFile.AMapWX({key:'9bf5c08983bd73953f73c20b89899b33'});
    },
    methods:{
      ...mapMutations({
        areaCode:'AREACODE',
        lng:'LNG',
        lat:'LAT',
        region:'REGION',
      }),
      backIndex(){
        wx.switchTab({
          url:'../../../../pages/index/main'
        })
      },
      getImgDetail(par){
        var _this = this;
        wx.previewImage({
          current: par, // 当前显示图片的http链接
          urls: _this.images // 需要预览的图片http链接列表
        })
      },
      closeImg(){
        this.showImg = !this.showImg;
      },
      show_more(){
        this.over_show = !this.over_show;
        this.noticeM =  this.over_show? '展开商家活动':'收起商家活动';
      },
      goCarder(){
        wx.navigateTo({
          url:'../../../packageA/pages/svipRules/main'
        })
      },
      goPayMoney(){
        var _this = this;
        if(_this.par.shopId != '1554363195') {
          wx.navigateTo({
            url: `../../pages/payMoney/main?shopStoreId=${_this.shopStoreId}&identification=shopRecDet&inviterId=${_this.inviterId}`
          })
        }else{
          _this.showCard = 0;
          let shareid = _this.shareid ? _this.shareid :'';
          let inviterId = _this.inviterId ? _this.inviterId :'';
          Tips.confirm('该商家需要扫结算二维码结算(结算商家打印小票上的二维码)','提示',{}).then(res=>{
            wx.scanCode({
              success (res) {
                wx.navigateTo({
                  url:`/pages/packageA/pages/lakeWater/main?result=${res.result}&shareCardId=${shareid}&shareuserId=${inviterId}`
                })
              }
            })
          })
        }
      },
      goShopMap(){
        this.formSubmit();
      },
      linkToGoodsDetail(item){
        var _this = this;
        wx.navigateTo({
          url:`../../../packageC/pages/goodsDetail/main?bargainId=${item.id}&frompage=shopRecdet`
        })
      },
      formSubmit() {
        var _this = this;
        var gps = bd_decrypt(_this.latitude,_this.longitude);
        wx.getLocation({//获取当前经纬度
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(gps.lat),//要去的纬度-地址
              longitude: Number(gps.lng),//要去的经度-地址
              name: _this.detaildata.address,
              address: _this.detaildata.address
            })
          }
        })
      },
      cardPay(par){
        var _this = this;
        wx.navigateTo({
          url:`../../pages/svipCard/main?longitude=${par.longitude}&latitude=${par.latitude}&distance=${par.distance}&shopStoreId=${par.id}&inviterId=${_this.inviterId}&pageIndex=shopRecDet`
        })
      },
      getDetail(){
        var _this = this;
        var _data = {
          token:_this.token,
          shopStoreId:_this.shopStoreId,
          distance:_this.distance,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.recomDetail(_data,sec).then(res=>{
            console.log(res);
            if(res.state ==1) {
              _this.par.shopId = res.data.shopId;
              if(res.data.shopId =='1554363195'){
                this.showCard = 0;
              }
              _this.detaildata = res.data;
              _this.bargains = res.data.bargains;
              _this.bargains.forEach(ele => {
                ele.currentPrice = (ele.price*ele.discount*0.1).toFixed(2);
                ele.originalPrice = Number(ele.price).toFixed(2);
              })
              _this.longitude = res.data.longitude;
              _this.latitude = res.data.latitude;
              _this.discountInfo = res.data.discountInfo;
              let activeNum = res.data.svipCardActives;
              if (activeNum.length <= 2) {
                _this.over_show = false;
                _this.showBtn = false;
              } else if (activeNum.length > 2) {
                let activeArr = [];
                for (let i = 0; i < 2; i++) {
                  activeArr.push(activeNum[i])
                }
                _this.over_show = true;
                _this.showBtn = true;
                _this.svipCardActives = activeArr;
              }
              _this.allactive = res.data.svipCardActives;

              let newArr = [];
              let imageArr = res.data.storeImgs.split(',');
              for (let i = 0; i < imageArr.length; i++) {
                if (imageArr[i] != '') {
                  newArr.push(imageArr[i])
                }
              }
              if (newArr.length == 1) {
                newArr.push(newArr[0]);
              }
              _this.images = newArr;
              _this.lstSvipShareCard = res.data.lstSvipShareCard;

              _this.getList(_this.par);
              if (_this.images.length == 1) {
                _this.imgNum = 1;
              }
            }else if(res.state == 10000){
              const url = `../../../../pages/loginpage/main?distance=${this.distance}&shopId=${this.par.shopId}&shopStoreId=${this.shopStoreId}&inviterId=${this.inviterId}&scene=${this.scene}`;
              wx.navigateTo({url})
            }else{
              Tips.toast(`${res.msg}`,'none');
            }
          })
        })
      },
      swiperChange(e){
        var _this = this;
        var cur = e.target.current;
        _this.currentItemId = cur;
      },
      ordPhone(){
        var _this = this;
        if(_this.detaildata.mobilePhone ==''){
          Tips.toast('该商家暂未提供手机号','none')
        }else{
          wx.makePhoneCall({
            phoneNumber:_this.detaildata.mobilePhone  //仅为示例，并非真实的电话号码
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
                  _this.wxGetLocation()
                },
                fail(err) {
                  // 当用户拒绝 查看自己的位置的时候  统计数据
                  // 统计数据  地理位置为空

                }
              })
            } else {
              // 授权过    百度地图转火星
              _this.wxGetLocation(Number(_this.longitude),Number(_this.latitude));
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
        console.log(gg_lon,gg_lat);
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
            console.log('经纬度',latitude,longitude);
            myAmapFun.getDrivingRoute({
              origin: `${longitude},${latitude}`,
              destination: `${lng},${lat}`,
              success: function(data){
                console.log('看看返回结果',data.paths[0].distance);
                _this.distance = (data.paths[0].distance /1000).toFixed(2);
              }
            })
          },
          fail: function(err) {
            console.log(err);
          }
        });
      },
      getList(par) {
        var _this = this;
        getSignIn(par).then(sec => {
          _this.$http.getShopP(par, sec).then(res => {
            if (res.state == 1) {
              if (res.data.length != 0) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                }
                _this.shopData = res.data;
              }
            }
          })
        })


      },
      godetail(par){
        const url = `../../../../pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
        wx.navigateTo({ url })
      },
      goLineShop(){
        wx.navigateTo({
          url:`/pages/packageA/pages/inlineshop/main?shopId=${this.par.shopId}`
        })
      },
      goalignPage(){
         wx.navigateTo({
           url:'/pages/packageD/pages/alliance/main'
         })
      },
    },
    onShareAppMessage(res){
      var _this = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log('啦啦啦德玛西亚',res.target);
      }
      return {
        title:`【${this.detaildata.storeName}】点击卡主付款，最低享受${_this.lstSvipShareCard? _this.lstSvipShareCard[0].shareCardDiscount * 1000/100 : '' }折优惠`,
        path:`pages/packageB/pages/shopRecDet/main?distance=${_this.distance}&shopStoreId=${_this.shopStoreId}&shopId=${_this.par.shopId}&inviterId=${_this.$store.state.userLiId}`,
        imageUrl:`${this.images[0]}`,
        success:function(res){
          console.log('成功转发的消息',res)
        },
        fail:function(res){
          console.log('失败转发的消息',res)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    padding-bottom:100rpx;
    .bargain{
      .thumb{
        display: block;
        width: 200rpx;
        height: 200rpx;
        border-radius: 10rpx;
        margin-right: 17rpx;
      }
      .detail{
        width: 500rpx;
        height:100rpx;
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
          width: 168rpx;
          height: 70rpx;
          background: #FA336C;
          padding:0;
          line-height: 70rpx;
        }
      }
    }
    .mask{
      position: fixed;
      left:0;right:0;
      bottom:0;top:0;
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index:99;
      img{
        width:100%;
        display: block;
      }
    }
    .toast_module{
      position: fixed;
      left:0;right:0;
      bottom:0;top:0;
      background: rgba(12,12,12,.5);
      z-index: 100;
      .bot_card{
        width:100%;
        background:#fff;
        padding:20rpx 0;
        border-radius:20rpx 20rpx 0 0;
        position: absolute;
        bottom: 0;
        .close{
          position: absolute;
          top: -73rpx;
          right: 41rpx;
          display: block;
          width: 55rpx;
          height: 55rpx;
        }
        .bot_title{
          width:90%;
          height:38rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          padding:0 46rpx;
          .bot_ti_top{
            width: 146rpx;
            height:38rpx;
            text-align: center;
            line-height: 38rpx;
            padding-bottom:4rpx;
            margin-top:20rpx;
            font-size: 34rpx;
            font-weight: bold;
          }
          .bot_ti_bot{
            height:40rpx;
            color:#fff;
            background:linear-gradient(90deg,rgba(214,142,103,1),rgba(127,80,44,1));
            border-radius:20px;
            font-size:28rpx;
            line-height: 40rpx;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding:0 20rpx;
          }
        }
        .showMore{
          width:100%;
          height:40rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top:28rpx;
          .shwo_inner{
            display:flex;
            align-items: center;
            line-height:40rpx;
            span{
              font-size: 24rpx;
              color:rgba(52,60,83,1);
            }
            i{
              color:#9A9DA5;
            }
          }
        }
        .bot_con{
          margin:36rpx 45rpx;
          font-size:28rpx;
        }
        .all_con {
          overflow: hidden;
          margin:0 45rpx;
          margin-bottom: 19rpx;
          font-size: 24rpx;
          .img_message {
            width: 32rpx;
            height: 32rpx;
            background:linear-gradient(0deg,rgba(250,205,137,1),rgba(255,232,183,1));
            opacity:0.5;
            border-radius:50%;
            float: left;
            text-align: center;
            line-height: 32rpx;
            font-weight: bold;
          }

          .con_con {
            float: left;
            font-size: 24rpx;
            margin-left: 16rpx;
          }
        }
      }
      .actDesc{
        width:100%;
        background:#fff;
        border-radius:20rpx 20rpx 0 0;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        padding: 34rpx 23rpx;
        .close{
          position: absolute;
          top: -73rpx;
          right: 41rpx;
          display: block;
          width: 55rpx;
          height: 55rpx;
        }
        .num{
          height:30rpx;
          width: 30rpx;
          font-weight: bold;
          color:#7F502C;
          background:linear-gradient(0deg,rgba(250,205,137,1),rgba(255,232,183,1));
          opacity:0.5;
          border-radius: 50%;
          font-size:24rpx;
          line-height: 30rpx;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      }
      .storeDesc{
        width:100%;
        background:#fff;
        border-radius:20rpx 20rpx 0 0;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        padding: 47rpx 27rpx;
        .close{
          position: absolute;
          top: -73rpx;
          right: 41rpx;
          display: block;
          width: 55rpx;
          height: 55rpx;
        }
      }
    }
    .swiper-container{
      width: 100%;
      height: 300rpx;
      box-sizing: border-box;
      box-shadow:0 0 16rpx 2rpx rgba(96,90,90,0.21);
      border-radius: 10rpx;
      margin-bottom: 12rpx;
      .products{
        box-sizing: border-box;
        padding: 23rpx;
        height: 100%;
        .thumb{
          display: block;
          width: 150rpx;
          height: 150rpx;
          border-radius: 10rpx;

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
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .li{
      width: 340rpx;
      height: 210rpx;
    }
    .li1{
      width: 346rpx;
      margin: 0 auto;
      border-radius: 10rpx;
      height: 196rpx;
      transform: scale(0.9);
      img{
        width:316rpx;
        height:196rpx;
        border-radius: 10rpx;
      }
    }
    .selected{
      transform: scale(1)
    }
    .share_card_top{
      width:710rpx;
      margin:0 20rpx;
      .sh_title{
        width:100%;
        height:80rpx;
        margin-bottom:30rpx;
        .sh_tit_img{
          width:80rpx;
          height:80rpx;
          background:#f2f2f2;
          border-radius: 50%;
          margin-right:26rpx;
          float: left;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
        .sh_tit_ri{
          float: left;
          line-height: 80rpx;
          font-size: 36rpx;
          font-weight:bold;
        }
        .share_de{
          height:48rpx;
          background:rgba(255,180,21,1);
          box-shadow:0px 1px 3px 0px rgba(206,11,47,0.43);
          border-radius:10rpx;
          float: right;
          line-height: 48rpx;
          margin:16rpx 0;
          display:flex;
          justify-content: space-around;
          align-items: center;
          color:#fff;
          font-size: 28rpx;
        }
      }
      .activities{
        display: flex;
        flex-wrap: wrap;
        img{
          display: block;
          width: 131rpx;
          height: 33rpx;
          background: #0d0d0d;
        }
        .act{
          border:1rpx solid rgba(242,209,179,1);
          background:linear-gradient(180deg,rgba(208,151,109,1),rgba(92,29,14,1));
          border-radius:3rpx;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          padding: 0 12rpx;
        }
      }
      .sh_pho{
        width:100%;
        height:210rpx;
        display: flex;
        justify-content: space-between;
        .swiper{
          width:100%;
          height:210rpx;
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
      }
      .card_bot{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:16rpx 0;
        border-bottom:2rpx solid rgba(229,229,229,1);
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
          border-left:2rpx solid rgba(229,229,229,1);
          i{
            color:#FE054C;
            font-size: 50rpx;
          }
        }
      }
      .card_card{
        padding-top:28rpx;
        padding-bottom:28rpx;
        padding-left:20rpx;
        font-size: 32rpx;
      }
      .sha_peo{
        width:100%;
        height:86rpx;
        margin-bottom:28rpx;
        background:linear-gradient(268deg,rgba(251,230,204,1),rgba(214,146,92,1));
        /*border:1px solid rgba(224, 168, 122, 0.2);*/
        display:flex;
        align-items: center;
        border-radius: 10rpx;
        position: relative;
        .sha_share_card{
          position: absolute;
          right:0;
          top:0;
          width:206rpx;
          height:86rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .inner_text{
          position: absolute;
          right:0;
          top:0;
          width:176rpx;
          padding-left:30rpx;
          height:86rpx;
          display: flex;
          justify-content: space-around;
          line-height: 86rpx;
          font-size:30rpx;
          color:#fff;
          span{
            float: left;
          }
          i{
            float: left;
            color:#fff;
          }
        }
        .sha_peo_le{
          font-size: 28rpx;
          float: left;
          margin-left:20rpx;
          color:#fff;
        }
        .sha_peo_ri{
          float: right;
          margin-right:20rpx;
          height:50rpx;
          background:#F60F51;
          box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
          border-radius:10rpx;
          display:flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 30rpx;
        }
      }
      .carder_pay{
        width:710rpx;
        height:80rpx;
        background:#F60F51;
        color:#fff;
        box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
        border-radius:10rpx;
        line-height: 80rpx;
        text-align: center;
        margin-bottom:40rpx;
      }
    }
    .bot_share_card{
      width:710rpx;
      background:#f6f6f6;
      padding:20rpx 20rpx;
      overflow: hidden;
      .shop_recom{
        width:100%;
        .title{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height:80rpx;
          .tit_le{
            font-size: 34rpx;
            color:rgba(13,13,15,1);
            font-weight: bold;
          }
          .tit_ri{
            font-size: 30rpx;
            display: flex;
            color:#F60F51;
            i{
              color:#F60F51;
            }
          }
        }
      }
      .sh_pho_sec{
        width:100%;
        height:380rpx;
        border-radius: 10rpx;
        .li1_sec{
          width:224rpx!important;
          height:380rpx!important;
          margin-right:12rpx;
          background:#fff;
          float: left;
          .li_top{
            width:204rpx;
            height:236rpx;
            border-top-left-radius: 10rpx;border-top-right-radius: 10rpx;
            padding:10rpx;
            img{
              width:100%;
              height:100%;
              display: block;
              border-top-left-radius: 10rpx;border-top-right-radius: 10rpx;
            }
          }
          .li_bot{
            width:204rpx;
            height:144rpx;
            padding:10rpx;
            background:#fff;
            border-bottom-left-radius: 10rpx;
            border-bottom-right-radius: 10rpx;
            .Li_bot_top{
              span {
                font-size: 24 rpx;
                width: 216 rpx;
                @include ovhm(2);
              }
            }
            .Li_bot_bot{
              font-size: 30rpx;
              color:#F7094D;
              margin-top:10rpx;
            }
          }
        }
      }
    }
    .bot_btn{
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      height:100rpx;
      background:#F7094D;
      display: flex;
      align-items: center;
      flex-direction: column;
      color:#fff;
      .btn_bot_top{
        font-size: 36rpx;
      }
      .btn_bot_bot{
        font-size: 24rpx;
      }
    }
    .btn_history{
      width:100%;
      display: flex;
      justify-content: space-between;
      padding:20rpx 0;
      .ri_btn{
        width:320rpx;
        height:200rpx;
        border-radius:20rpx;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .discount_mes{
          position: absolute;
          right:26rpx;
          bottom:5rpx;
          font-size: 48rpx;
          color:#B0610C;
          font-weight: bold;
        }
      }
      .le_btn{
        width:320rpx;
        height:200rpx;
        border-radius: 20rpx;
        background:#FE054C;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .discount_mes{
          position: absolute;
          right:26rpx;
          bottom:5rpx;
          font-size: 48rpx;
          color:#F9CDA2;
          font-weight: bold;
        }
      }
    }
  }
</style>
