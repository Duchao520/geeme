<template>
  <div class="seller_detail">
    <section class="sell_top">
      <div class="fz-50 txt-ellipsis">
        {{storeDetail.storeName}}
      </div>
      <div class="flex_box activities justify_space_between align_center"
           style="margin-bottom: .27rem">
        <div class="flex_box align_center">
          <img src="@/assets/imgs/svip/card_store.png" alt=""
               style="display: block;width: 1.31rem;height: .33rem;margin-right: .12rem;"
               v-if="storeDetail.lstSvipShareCard.length!=0">
          <img src="@/assets/imgs/svip/bargain.png" alt=""
               style="display: block;width: 1.32rem;height: .33rem;margin-right: .12rem;"
               v-if="storeDetail.bargains">
          <p class="act fz-22" v-if="storeDetail.lstSvipShareCard.length!=0">共享卡会员卡{{storeDetail.lstSvipShareCard.length!=0 ? storeDetail.lstSvipShareCard[0].shareCardDiscount * 1000/100 : '' }}折</p>
        </div>
        <i class="iconfont icon-jiantou9 fc-8D8E98 fz-24" @click="toast_type = 2"></i>
      </div>
      <div class="sell_thumbModule">
        <v-marquee :imgs="imgs" @postIndex="getIndex">

        </v-marquee>
      </div>
      <div class="sell_address">
        <div class="left" @click="goAddress">
          <i class="iconfont icon-dizhi1"></i>
          <div class="add_con txt-ellipsis">
            {{storeDetail.address}}
          </div>
          <span class="add_distance">
            {{storeDetail.distance}}km
          </span>
        </div>
        <div class="right" @click="poPhone(tel)">
          <img :src="phone" alt="">
        </div>
      </div>
      <div class="flex_box justify_space_between align_center" style="padding: .16rem 0;border-bottom: .01rem dashed #EAEAEA"
           @click="toast_type = 3">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="@/assets/imgs/svip/icon_store.png" alt="" style="display: block;width: .3rem;height: .3rem;margin-right: .12rem">
          <p class="fz-24" style="margin-right: .24rem">营业时间</p>
          <p class="fz-20 fc-8D8E98">{{storeDetail.openHours}}</p>
        </div>
        <i class="iconfont icon-youjiantou1 fz-22 fc-8D8E98"></i>
      </div>
      <div class="flex_box justify_space_between align_center"
           style="padding: .16rem 0;border-bottom: .01rem dashed #EAEAEA"
           @click="toast_type = 1" v-if="activities.length > 0">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="@/assets/imgs/svip/icon_group.png" alt="" style="display: block;width: .3rem;height: .3rem;margin-right: .12rem">
          <p class="fz-24" style="margin-right: .24rem">招募卡主</p>
          <p class="fz-20 fc-8D8E98">共{{activities.length}}个套餐</p>
        </div>
        <i class="iconfont icon-youjiantou1 fz-22 fc-8D8E98"></i>
      </div>
      <router-link  :to="{name:'vipCard',query:{shopStoreId:shopStoreId,distance:distance,isBack: 0}}"
                    tag="div"
                    class="flex_box justify_space_between align_center"
                    style="padding: .16rem 0;"
                    v-if="storeDetail.lstSvipShareCard.length!=0 && storeDetail.shopId != '1554363195'">
        <div class="flex_box align_center fc-0D0D0F">
          <img src="@/assets/imgs/svip/icon_card.png" alt="" style="display: block;width: .3rem;height: .3rem;margin-right: .12rem">
          <p class="fz-24">使用共享会员卡付款，最低{{storeDetail.lstSvipShareCard.length!=0 ? storeDetail.lstSvipShareCard[0].shareCardDiscount * 1000/100 : '' }}折</p>
          <img src="@/assets/imgs/svip/suggest.png" alt="" style="display: block;width: 1.3rem;height: .25rem;">
        </div>
        <i class="iconfont icon-youjiantou1 fz-22 fc-8D8E98"></i>
      </router-link>

      <div class="flex_box justify_space_between" v-if="storeDetail.isOpenPayChannel==1"
           style="margin-bottom: .3rem">
        <div class="allienceCommon" v-if="storeDetail.comShareDiscountCardRate !=10">
          <p>{{storeDetail.comShareDiscountCardRate}}折</p>
        </div>
        <div class="allienceVip" v-if="storeDetail.vipShareDiscountCardRate!=10">
          <p>{{storeDetail.vipShareDiscountCardRate}}折</p>
        </div>
      </div>
      <p class="fz-24 fc-F7094D text-center">如何免费获得联盟打折卡<i class="iconfont icon-zheng-triangle fz-30 fc-F7094D"></i></p>
    </section>
    <bargain-list :bargains="storeDetail.bargains"></bargain-list>
    <div class="sell_card">
      <div class="recommend" v-show="goods.length > 0">
        <div class="space_between">
          <div class="title">店铺推荐</div>
          <div class="enter" @click="callZSTOnlineShop">进入线上店铺<i class="iconfont icon-arrow-right"></i></div>
        </div>
        <div class="space_between">
          <div class="goods-item" v-for="(item,index) in goods" :key="index" @click="targetHref(item.id)">
            <div class="thumb">
              <img v-lazy="item.cover" alt="">
            </div>
            <div class="goodsName txt-overflow">
              <i><img src="@/assets/imgs/common/shopIcon_3.png" alt=""></i>
              {{item.goodsName}}
            </div>
            <div class="price">￥{{item.salePriceMin *10 / 10}}</div>
          </div>
        </div>
      </div>
    </div>
    <transition name="alertMsg">
      <div class="toast_module" v-show="toast_type">
        <div class="bot_card" v-if="toast_type == 1">
          <img src="@/assets/imgs/common/close.png" class="close" alt="" @click="toast_type = ''">
          <div class="bot_title">
            <div class="bot_ti_top">招募卡主</div>
            <div class="bot_ti_bot"><span style="font-size: .28rem;margin-right: .1rem;">什么是卡主</span><i class="iconfont icon-sanjiaoright"></i></div>
          </div>
          <div class="over_show">
            <div class="bot_con">
              本店招募卡主，卡主享受最低会员价，
              套餐如下：
            </div>
            <div class="all_con" v-for="(item,index) in activities" :key="index">
              <div class="img_message">
                <span>{{index+1}}</span>
              </div>
              <div class="con_con"><span>充{{item.shouldMoney*100/10000}}元</span><span v-if="item.giveMoney!=0">送{{item.giveMoney * 100/10000}}元</span><span v-if="item.giveMoney!= 0 && item.discountRate!=0"> ，</span><span v-if="item.discountRate!=0">享受{{item.discountRate*1000/100}}折优惠</span></div>
            </div>
            <div style="width:100%;text-align: center;font-size: .24rem;color:#AF7651;">注：成为卡主需在线下门店进行充值</div>
          </div>
        </div>
        <div class="actDesc fc-0D0D0F" v-else-if="toast_type == 2">
          <img src="@/assets/imgs/common/close.png" class="close" alt="" @click="toast_type = ''">
          <p class="fz-34 font-weight" style="margin-bottom: .4rem;">商家活动</p>
          <div class="flex_box justify_space_between">
            <i class="fz-28">卡主商家</i>
            <div style="width: 5.35rem;">
              <p class="fz-28" style="margin-bottom: .24rem;">有招募卡主活动（会员充值活动），成为卡主可享受如下权益:</p>
              <div class="fz-24 flex_box" style="line-height: .3rem;margin-bottom: .2rem;">
                <i class="num">1</i>
                <p style="width: 5rem">卡主可享受充值会员价在门店消费</p>
              </div>
              <div class="fz-24 flex_box" style="line-height: .3rem;margin-bottom: .2rem;">
                <i class="num">2</i>
                <p style="width: 5rem">卡主可创建分享卡和将会员价分享给好友使用</p>
              </div>
              <div class="fz-24 flex_box" style="line-height: .3rem;margin-bottom: .2rem;flex-wrap: wrap">
                <i class="num">3</i>
                <p style="width: 5rem">充值共享卡套餐可创建共享卡，共享卡发布到门店，也可分享给好友</p>
              </div>
            </div>
          </div>
          <div class="flex_box justify_space_between" style="margin-bottom: .3rem">
            <i class="fz-28">砍价活动</i>
            <p class="fz-28" style="width: 5.35rem;">
              邀请好友砍价，砍成既可以通过核销码兑奖，具体见门店砍价版块及卡友帮版块
            </p>
          </div>
          <div class="flex_box justify_space_between" style="margin-bottom: .3rem">
            <i class="fz-28">共享会员卡</i>
            <p class="fz-28" style="width: 5.35rem">
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
          <img src="@/assets/imgs/common/close.png" class="close" alt="" @click="toast_type = ''">
          <p class="fz-34" style="margin-bottom: .34rem;">商家介绍</p>
          <p class="fz-28">{{storeDetail.storeName}}</p>
          <p class="fz-28">营业时间 {{storeDetail.openHours}}</p>
          <p class="fz-28">{{storeDetail.remark}}</p>
        </div>
      </div>
    </transition>
    <footer @click="enterPay"><p>立即付款</p><span>享受会员折扣价</span></footer>
    <album :photos="imgs" ref="album"></album>
    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'该商家需要扫结算二维码结算(结算商家打印小票上的二维码)'"
               :confirmSubmit="'扫描二维码'"
               @PassEvent="handleQrParams"
               ref="vConfirm"></v-confirm>
    <toast :tip="tip" ref="toast"></toast>
  </div>
</template>

<script>
  import phone from '@/assets/imgs/common/phone.png'
  import star from '@/assets/imgs/common/star.png'
  import carder from '@/assets/imgs/common/carder.png'
  import {
    ctxPath,
    getSignIn,
    postTitle,
    postZSTTel,
    enterTheodolite,
    postGoodsUrl,
    shareInterface,
    callAppMethod,
    postImgAndroid,
    postTitleAndroid,
    versions,
    postShareContentIOS,
    callZSTOnlineShop,
    handleQrParams
  } from "@/assets/js/jsBridge";
  import {CARDPAGE} from "@/assets/js/deal";
  import {storeDetail, reGoods} from "@/assets/js/comm";
  import toast from "@/components/common/toast"
  import bargainList from './sellerDetail/bargain-list'
  import vMarquee from "@/components/common/vMarquee"
  import album from '@/components/common/album'
  import vConfirm from '@/components/common/vConfirm'

  export default {
    name: "sellerDetail",
    props: ['tokenPromise'],
    components: {
      toast,
      vMarquee,
      album,
      bargainList,
      vConfirm
    },
    data() {
      return {
        phone: phone,
        star: star,
        carder: carder,
        shopStoreId: String(this.$route.query.shopStoreId),
        distance: this.$route.query.distance,
        token: '',
        storeDetail: '',
        fullReduceInfo: '',
        discountInfo: '',
        tel: '',
        // 纬度
        latitude: '',
        // 经度
        longitude: '',
        tip: '',
        imgs: '',
        activities: '',
        shareIsShow: false,
        goods: '',
        container_height: true,
        isHangbai: false,
        toast_type: ''
      }
    },
    created(){
      callAppMethod('20');
    },
    methods: {
      init() {
        var _self = this;
        callAppMethod('22');
        _self.versions();
        _self.getStoreDetail();
      },
      targetHref(id) {
        window.location.href = ctxPath + '/zst-wap/app-shop/index.html?id=' + id
      },
      callAppMethod(code){
        callAppMethod(code)
      },

      versions() {
        this.shareIsShow = versions();
      },
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*获取店铺详情*/
      getStoreDetail() {
        var _self = this;
        var _data;

        if (_self.distance) {
          _data = {
            token: _self.token,
            shopStoreId: String(_self.shopStoreId),
            distance: String(_self.distance)
          };
        } else {
          _data = {
            token: _self.token,
            shopStoreId: String(_self.shopStoreId)
          };
        }
        getSignIn(_data).then(sec => {
          storeDetail(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.tel = res.data.data.tel;
              _self.storeDetail = res.data.data;
              _self.latitude = res.data.data.latitude;
              _self.longitude = res.data.data.longitude;
              _self.fullReduceInfo = res.data.data.fullReduceInfo;
              _self.discountInfo = res.data.data.discountInfo;
              _self.imgs = res.data.data.storeImgs.split(',');
              _self.imgs = _self.imgs.filter(ele => ele != '');
              _self.activities = res.data.data.svipCardActives;
              _self.getReGoods(_self.storeDetail.shopId);
              _self.shareInit();
              if(_self.storeDetail.shopId == '1554363195'){
                _self.isHangbai = true;
              }
            } else {
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      poPhone(tel) {
        window.location.href = "tel:" + tel;
      },
      goAddress() {
        enterTheodolite(this.longitude, this.latitude);
      },
      shareInit() {
        var _self = this;
        try {
          var uri = "pages/packageB/pages/shopRecDet/main?shopStoreId=" + _self.shopStoreId + "&distance=" + _self.distance;
          var _data = {
            title: `【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`,
            imageUrl: _self.imgs[0]
          };
          postShareContentIOS(_data)
          postGoodsUrl(uri);
          postTitleAndroid(`【${_self.storeDetail.storeName}】点击卡主付款，最低享受${(_self.storeDetail.shareCardDiscount * 10).toFixed(1)}折优惠`)
          postImgAndroid(_self.imgs[0])
        } catch (e) {
          _self.toast(e);
        }

      },
      /*获取推荐商品*/
      getReGoods(shopId) {
        var _self = this;
        var _data = {
          shopId: String(shopId),
          pageNum: String(1),
          pageSize: String(3),
          isBoutique: String(1)
        }
        getSignIn(_data).then(sec => {
          reGoods(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.goods = res.data.data;
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      shareInterface() {
        shareInterface();
      },
      /*吊起线上商城*/
      callZSTOnlineShop() {
        if (this.storeDetail.shopId) {
          callZSTOnlineShop(String(this.storeDetail.shopId))
        } else {
          this.toast("缺少shopId")
        }
      },
      test() {
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        // image.setAttribute("crossOrigin", 'Anonymous')
        image.onload = function () {
          alert('图像加载成功')
        };

        image.onerror = function (e) {
          alert('图像加载失败')
        }

        image.src = 'http://static.tenzhao.com/shop/logo/1c92f1c9a3762fec6a6adf133b2f5cec73.jpg'
      },
      getIndex(index) {
        var _self = this;
        _self.$refs.album.showAlbum(index);
      },
      enterPay(){
        var _self = this;
        if(_self.isHangbai){
          _self.$refs.vConfirm.showConfirm();
        }else{
          for(var key in CARDPAGE){               //清除本地缓存
            delete CARDPAGE[key];
          }
          _self.$router.push({
            name: 'svipPayIndex',
            query:{
              shopStoreId: _self.shopStoreId,
              distance: _self.distance
            }
          })
        }
      },
      handleQrParams(){
        var _data = {
          isAppAccess: '1',
          isMainCard: '0',
        };
        handleQrParams(_data);
      }
    },
    mounted() {
      var _self = this;
      postTitle('商家详情')
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .slide_up_down-enter-active {
    animation: slideOutUp .2s;
  }

  .slide_up_down-leave-active {
    animation: slideOutDown .2s;
  }

  .seller_detail {
    background: #F2F2F2;

    .sell_top {
      box-sizing: border-box;
      padding: .4rem .27rem .21rem;
      background: #FFFFFF;
      margin-bottom: .2rem;
      .act{
        border:.01rem solid rgba(242,209,179,1);
        background:linear-gradient(180deg,rgba(208,151,109,1),rgba(92,29,14,1));
        border-radius:.03rem;
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        padding: 0 .12rem;
      }

      .sell_thumbModule {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: .22rem;

        .sell_thumb {
          width: 3.4rem;
          height: 2.1rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: .1rem;
            background: #0e90d2;
          }
        }
      }

      .sell_address {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding-bottom: .08rem;
        border-bottom: .01rem dashed #E5E5E5;

        .left {
          display: flex;
          align-items: center;
          padding-right: .35rem;

          .icon-dizhi1 {
            color: #D2D2D2;
            font-size: .32rem;
            margin-right: .06rem;
          }

          .add_con {
            width: 3.93rem;
            font-size: .24rem;
            margin-right: .29rem;
          }

          .add_distance {
            font-size: .24rem;
            color: #D2D2D2;
          }
        }

        .right {
          width: .31rem;
          height: .35rem;
          padding: .12rem .18rem;
          border-left: .01rem solid #E5E5E5;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }

      .allienceCommon{
        width: 3.2rem;
        height: 2rem;
        background: url($ctxpath + "/static/customImgs/svip/allience_common.png") center center no-repeat;
        background-size: 100% 100%;
        position: relative;
        p{
          position: absolute;
          right: .3rem;
          bottom: .24rem;
          font-size: .48rem;
          color: #F9CDA2;
          font-weight: bold;
        }
      }
      .allienceVip{
        width: 3.2rem;
        height: 2rem;
        background: url($ctxpath + "/static/customImgs/svip/allience_vip.png") center center no-repeat;
        background-size: 100% 100%;
        position: relative;
        p{
          position: absolute;
          right: .3rem;
          bottom: .24rem;
          font-size: .48rem;
          color: #B0610C;
          font-weight: bold;
        }
      }
    }

    .sell_card {
      width: 100%;
      background: #F2F2F2;
      padding-bottom: 0.6rem;
      float: left;

      .sell_card_con {
        width: 94%;
        margin: 0 3%;
        margin-top: 0.32rem;

        .sell_card_mid {
          width: 100%;
          padding-bottom: 0.3rem;
          border-radius: .2rem;
          background: #fff;

          .carder {
            width: 100%;
            height: .4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: .33rem 0;

            span {
              color: #0D0D0F;
              font-size: .34rem;
              font-weight: bold;
            }

            p {
              font-size: .28rem;
              padding: 0 .19rem;
              color: #FFFFFF;
              background: linear-gradient(90deg, rgba(214, 142, 103, 1), rgba(127, 80, 44, 1));
              height: .4rem;
              border-radius: .2rem;
              line-height: .4rem;
            }
          }

          .container {
            transition: all .3s;
            max-height: 3rem;

            .all_con {
              overflow: hidden;
              margin-bottom: .19rem;

              .img_message {
                width: .32rem;
                height: .32rem;
                /*background: #ff6700;*/
                float: left;
                background: linear-gradient(0deg, rgba(250, 205, 137, .5), rgba(255, 232, 183, .5));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;


                span {
                  font-family: MicrosoftYaHei-Bold;
                  background: linear-gradient(173deg, rgba(219, 153, 118, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-size: .24rem;
                  font-weight: bold;
                }
              }

              .con_con {
                float: left;
                font-size: .24rem;
                margin-left: .15rem;
              }
            }
          }

          .container_height {
            transition: all .3s;
            max-height: 1.35rem;
            overflow: hidden;
          }

          button {
            display: flex;
            margin: 0 auto;
            color: #343C53;
            margin-top: .3rem;
            font-size: .24rem;
            opacity: 0.6;
            align-items: center;
            i{
              margin-left: .08rem;
              display: block;
              width: .26rem;
              height: .26rem;
              border-radius: 50%;
              background: #9A9DA5;
              color: #FFFFFF;
              font-size: .15rem;
              line-height: .3rem;
              transition: all .2s;
            }
            .rotate-180{
              transform: rotate(180deg);
            }
          }
        }
      }
    }

    .recommend {
      box-sizing: border-box;
      padding: .16rem;

      .space_between {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .23rem;

        .title {
          color: #0D0D0F;
          font-size: .34rem;
        }

        .enter {
          color: #F60F51;
          font-size: .3rem;
          line-height: .3rem;
        }

        .goods-item {
          width: 2.35rem;
          height: 3.8rem;
          background: #FFFFFF;
          border-radius: .1rem;
          overflow: hidden;

          .thumb {
            width: 100%;
            height: 2.35rem;
            background: #FF4F81;
            margin-bottom: .16rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }

          .goodsName {
            font-size: .24rem;
            color: #0D0D0F;
            box-sizing: border-box;
            padding: 0 .16rem;
            margin-bottom: .2rem;
            line-height: .3rem;
            height: .6rem;

            i {
              width: .27rem;
              height: .27rem;

              img {
                width: .27rem;
                height: .27rem;
              }
            }
          }

          .price {
            color: #F7094D;
            font-size: .3rem;
          }
        }
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
        padding:.2rem 0;
        border-radius:.2rem .2rem 0 0;
        position: absolute;
        bottom: 0;
        .close{
          position: absolute;
          top: -.73rem;
          right: .41rem;
          display: block;
          width: .55rem;
          height: .55rem;
        }
        .bot_title{
          width:90%;
          height:.38rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          padding:0 .46rem;
          .bot_ti_top{
            width: 1.46rem;
            height:.38rem;
            text-align: center;
            line-height: .38rem;
            padding-bottom:.04rem;
            margin-top:.2rem;
            font-size: .34rem;
            font-weight: bold;
          }
          .bot_ti_bot{
            height:.4rem;
            color:#fff;
            background:linear-gradient(90deg,rgba(214,142,103,1),rgba(127,80,44,1));
            border-radius:.2rem;
            font-size:.28rem;
            line-height: .4rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding:0 .2rem;
          }
        }
        .showMore{
          width:100%;
          height:.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top:.28rem;
          .shwo_inner{
            display:flex;
            align-items: center;
            line-height:.4rem;
            span{
              font-size: .24rem;
              color:rgba(52,60,83,1);
            }
            i{
              color:#9A9DA5;
            }
          }
        }
        .bot_con{
          margin:.36rem .45rem;
          font-size:.28rem;
        }
        .all_con {
          overflow: hidden;
          margin:0 .45rem;
          margin-bottom: .19rem;
          font-size: .24rem;
          .img_message {
            width: .32rem;
            height: .32rem;
            background:linear-gradient(0deg,rgba(250,205,137,1),rgba(255,232,183,1));
            opacity:0.5;
            border-radius:50%;
            float: left;
            text-align: center;
            line-height: .32rem;
            font-weight: bold;
          }

          .con_con {
            float: left;
            font-size: .24rem;
            margin-left: .16rem;
          }
        }
      }
      .actDesc{
        width:100%;
        background:#fff;
        border-radius:.2rem .2rem 0 0;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        padding: .34rem .23rem;
        .close{
          position: absolute;
          top: -.73rem;
          right: .41rem;
          display: block;
          width: .55rem;
          height: .55rem;
        }
        .num{
          height:.3rem;
          width: .3rem;
          font-weight: bold;
          color:#7F502C;
          background:linear-gradient(0deg,rgba(250,205,137,1),rgba(255,232,183,1));
          opacity:0.5;
          border-radius: 50%;
          font-size:.24rem;
          line-height: .3rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      }
      .storeDesc{
        width:100%;
        background:#fff;
        border-radius:.2rem .2rem 0 0;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        padding: .47rem .27rem;
        .close{
          position: absolute;
          top: -.73rem;
          right: .41rem;
          display: block;
          width: .55rem;
          height: .55rem;
        }
      }
    }

    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 1rem;
      background: #F60F51;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;
      padding: .09rem 0;

      p {
        font-size: .36rem;
        letter-spacing: .08rem;
      }

      span {
        font-size: .24rem;
      }
    }
  }
</style>
