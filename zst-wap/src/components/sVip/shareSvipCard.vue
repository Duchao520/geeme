<template>
  <div class="seller_detail">
    <section class="sell_top">
      <div class="shareCard bg-50B3EB-346CC1-3C66AE">
        <div class="cardDetail fc-ffffff">
          <div class="flex_box align_center justify_space_between">
            <button class="explain fz-24 fc-ffffff"
                    style="margin-bottom: .4rem"
                    @click="showuse">使用说明<i class="iconfont icon-shuoming" style="font-size: .22rem"></i>
            </button>
            <img src="@/assets/imgs/svip/shareCard_slogan_2.png" alt=""
                 style="display: block;width: 1.62rem;height: .36rem">
          </div>

          <div class="flex_box align_center justify_space_between" style="margin-bottom: .45rem">
            <div class="flex_box align_center">
              <img :src="detaildata.storeLogo" alt="" class="logo">
              <p class="fz-36 txt-ellipsis" style="width: 2.6rem;">{{detaildata.storeName}}</p>
            </div>
            <div class="flex_box" style="align-items: flex-end">
              <span class="fz-60">{{(detaildata.shareCard.shareCardDiscount * 10).toFixed(1)}}</span>
              <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
              <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
            </div>
          </div>
          <div class="flex_box justify_space_between align_center"
               style="padding-bottom: .35rem;border-bottom: .02rem dashed #FFFFFF;margin-bottom: .12rem">
            <div class="fz-28 flex_box">
              <p style="max-width: 2.6rem"
                 class="txt-ellipsis">共享人:{{detaildata.shareCard.nick}}</p>({{detaildata.shareCard.username}})
            </div>
            <span class="fz-28">余额:{{(detaildata.shareCard.money/100).toFixed(2)}}元</span>
          </div>
        </div>
        <div class="contact">
          <div class="sell_address">
            <div class="left" @click="enterTheodolite">
              <i class="iconfont icon-dizhi1"></i>
              <div class="add_con txt-ellipsis">
                {{detaildata.address}}
              </div>
              <span class="add_distance">
               {{detaildata.distance}}km
                <i class="iconfont icon-arrow-right"></i>
              </span>
            </div>
            <div class="right" @click="postPh(detaildata.tel)">
              <img :src="phone" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="store_time">
        <p>营业时间:{{detaildata.openHours}}</p>
        <span class="iconfont"
              :class="{'icon-shoucang': detaildata.isCollection ===0,'icon-shoucang1': detaildata.isCollection ===1}"
              @click="collect" v-if="noshow">{{detaildata.isCollection == 1 ? '取消收藏' : '收藏此卡'}}</span>
      </div>
      <div class="sell_thumbModule">
        <v-marquee :imgs="imgs" @postIndex="getIndex"></v-marquee>
      </div>
    </section>
    <section class="module">
      <div class="module-title">商家简介</div>
      <p>{{detaildata.dealCateMatchRow}}</p>
      <p>{{detaildata.remark}}</p>
    </section>

    <footer class="flex_box" v-if="noshow">
      <button class="flex_box share_btn fc-ffffff align_center"
              style="justify-content: center"
              @click="shareCa">
        <i class="iconfont icon-fenxiang fz-32" style="margin-right: .14rem"></i>
        <div class="flex_box flex_column">
          <p class="fz-36" style="letter-spacing: .04rem">分享好友</p>
          <p class="fz-24">分享赚佣金{{(detaildata.shareCard.commissionRate * 100).toFixed(0)}}%</p>
        </div>
      </button>
      <button class="flex_box fc-ffffff align_center bg-F7094D flex_column"
              style="justify-content: center;width: 4.45rem"
              @click="useCard">
        <p class="fz-36" style="letter-spacing: .04rem">立即付款</p>
        <p class="fz-24">享受会员折扣价</p>
      </button>
    </footer>
    <div class="use_intro_pop" v-if="showBool">
      <div class="pop_con">
        <div class="close_img" @click="closePop">
          <img :src="avatar" alt="">
        </div>
        <div class="pop_title">
          <div>SVIP卡使用说明</div>
          <div class="heng_xian"></div>
        </div>

        <div class="pop_con_con">
          <div class="pop_con_fir">
            <div class="img_fir">
              <img src="@/assets/imgs/svip/first.png" alt="">
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于使用时间</div>
              <div class="fir_con">{{useintro.useDateStr===''? '无':useintro.useDateStr}}</div>
            </div>
          </div>

          <div class="pop_con_fir">
            <div class="img_fir">
              <img src="@/assets/imgs/svip/second.png" alt="">
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于使用时间段</div>
              <div class="fir_con">{{useintro.useTimeRange === ''? '无':useintro.useTimeRange}}</div>
            </div>
          </div>

          <div class="pop_con_fir">
            <div class="img_fir">
              <img src="@/assets/imgs/svip/third.png" alt="">
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于活动使用说明</div>
              <div class="fir_con">{{useintro.remark == ''? '无':useintro.remark}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <toast ref="toast" :tip="tip"></toast>
    <v-share :card="detaildata.shareCard" ref="share"></v-share>
    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'该商家需要扫结算二维码结算(结算商家打印小票上的二维码)'"
               :confirmSubmit="'扫描二维码'"
               @PassEvent="handleQrParams"
               ref="vConfirm"></v-confirm>
    <album :photos="imgs" ref="album"></album>
  </div>
</template>

<script>
  import phone from '@/assets/imgs/common/phone.png'
  import star from '@/assets/imgs/common/star.png'
  import carder from '@/assets/imgs/common/carder.png'
  import useintrouce from '@/assets/imgs/common/useintrouce.png'
  import share from '@/assets/imgs/common/share.png'
  import soucang from '@/assets/imgs/common/soucang.png'
  import jinbi from '@/assets/imgs/common/jinbi.png'
  import avatar from '@/assets/imgs/common/close.png'


  import full from '@/assets/imgs/svip/full.png'
  import discount from '@/assets/imgs/svip/discount.png'
  import tejia from '@/assets/imgs/svip/tejia.png'
  import address from '@/assets/imgs/svip/address.png'
  import toast from '@/components/common/toast'
  import axios from 'axios'
  import wx from 'weixin-js-sdk'

  import vMarquee from "@/components/common/vMarquee"
  import vShare from '@/components/common/vShare'
  import album from '@/components/common/album'
  import vConfirm from '@/components/common/vConfirm'

  import {secondCard, collectionPag, shareDistCard, shareQr} from '@/assets/js/comm'
  import {CARDPAGE} from "@/assets/js/deal";
  import {
    getSignIn, getUserAgentType, postTitle, shareInterface, postZSTTel, callAppMethod
    , postShareContentIOS, ctxPath, postStrAndroid, postImgAndroid, postUrlAndroid, postTitleAndroid,
    enterTheodolite, versions, postGoodsUrl , handleQrParams
  } from '@/assets/js/jsBridge'

  export default {
    props: ['tokenPromise'],
    name: "shareSvipCard",
    components: {
      toast,
      vMarquee,
      vShare,
      album,
      vConfirm
    },
    data() {
      return {
        //本地图片引入
        phone: phone,
        star: star,
        carder: carder,
        useintrouce: useintrouce,
        share: share,
        soucang: soucang,
        jinbi: jinbi,
        avatar: avatar,
        full: full,
        discount: discount,
        tejia: tejia,
        address: address,
        // 数据
        active: '',
        token: '',
        shopStoreId: '',
        shareCardId: '',
        distance: '',
        maincardId: '',
        detaildata: {
          shareCard: {
            nick: ''
          }
        },
        showBool: false,
        useintro: '',
        collection: '',
        noshow: true,
        yesshow: false,
        tip: '',
        imgs: '',
        isHangbai: false
      }
    },
    created(){
      callAppMethod('20');
    },
    mounted() {
      var _this = this;
      postTitle('共享卡详情');
      _this.shareCardId = _this.$route.query.shareCardId;
      _this.shopStoreId = _this.$route.query.shopStoreId;
      _this.distance = _this.$route.query.distance;

      _this.maincardId = _this.$route.query.maincardId;
      var _type = getUserAgentType();
      if (_type === 3) {
        _this.shareInit();
        _this.noshow = false;
        _this.yesshow = true;
        this.getShareDetail();
      } else {
        _this.tokenPromise.then((res) => {
          _this.token = res;
          this.getShareDetail();
        })
      }
    },
    methods: {
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*判断版本——IOS旧版本分享网页——新版本分享小程序*/
      versions() {
        var _self = this;
        var bool = versions();
        if (bool) {
          _self.postMinProUrl();
        } else {
          _self.webShare();
        }
      },
      getIndex(index) {
        var _self = this;
        _self.$refs.album.showAlbum(index);
      },
      getShareDetail() {
        var _type = getUserAgentType();
        var _self = this;
        if (_type === 3) {
          var _data = {
            shopStoreId: String(this.shopStoreId),
            shareCardId: String(this.shareCardId),
            distance: String(this.distance),
            maincardId: String(this.maincardId)
          }
          shareDistCard(_data).then(res => {
            if (res.data.state == 1) {
              this.collection = res.data.data.isCollection;
              this.useintro = res.data.data.svipCardActives[0];
              this.detaildata = res.data.data;
              this.imgs = res.data.data.storeImgs.split(',');
              console.log(this.imgs);
            } else {
              this.toast(res.data.msg);
            }
          })
        } else {
          var _data = {
            token: String(this.token),
            shopStoreId: String(this.shopStoreId),
            shareCardId: String(this.shareCardId),
            distance: String(this.distance),
          }
          getSignIn(_data).then(res => {
            var sec = res;
            secondCard(_data, sec).then(res => {
              if (res.data.state == 1) {
                this.collection = res.data.data.isCollection;
                this.useintro = res.data.data.svipCardActives[0];
                this.detaildata = res.data.data;
                this.imgs = res.data.data.storeImgs.split(',');
                _self.imgs = _self.imgs.filter(ele => ele != '');
                if(_self.detaildata.shopId == '1554363195'){
                  _self.isHangbai = true;
                }
                _self.versions();
              } else {
                this.toast(decodeURIComponent(res.data.msg))
              }

            })
          })
        }
      },
      showuse() {
        this.showBool = true;
      },
      closePop() {
        this.showBool = false;
      },
      useCard() {
        var _self = this;
        var _type = getUserAgentType();
        var storeId = _self.detaildata.id;
        var sharecardId = _self.detaildata.shareCard.id;
        if (_type == 3) {
          var shareuserId = _self.$route.query.userId;
          window.location.href = 'https://shopapi.tenzhao.com/sapi/qr/svip/' + storeId + '/0?shareuserId=' + shareuserId + '&userId=000&sharecardId=' + sharecardId
        } else {
          if(_self.isHangbai){
            _self.$refs.vConfirm.showConfirm();
          }else{
            CARDPAGE.shareCard = _self.detaildata.shareCard;
            _self.$router.push({
              name: 'svipPayIndex',
              query: {
                shopStoreId: storeId,
                shareCardId: sharecardId,
                distance: _self.distance,
                cardType: '2'
              }
            })
          }
        }
      },
      collect() {
        var _this = this;
        var collectState;
        if (_this.collection === 1) {
          collectState = '0';
        } else {
          collectState = '1';
        }
        var _data = {
          token: String(this.token),
          collection: String(collectState),
          shopStoreId: String(this.shopStoreId),
          shareCardId: String(this.shareCardId)
        };
        getSignIn(_data).then(res => {
          var sec = res;
          collectionPag(_data, sec).then((res) => {
            if (res.data.state == 1) {
              this.getShareDetail();
            } else {
              this.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      shareCa() {
        var _self = this;
        // shareInterface();
        _self.getShareQr(_self.detaildata.shareCard);
        _self.$refs.share.show(1);
      },
      postPh(phone) {
        window.location.href = 'tel:' + phone
      },
      webShare() {
        var _self = this;
        var _data = {
          title: `【${_self.detaildata.storeName}】助商通联盟商家卡主折扣卡`,
          describe: `立享会员折扣${_self.detaildata.shareCard.shareCardDiscount * 1000 / 100}折；更多优惠下载请下载助商通。`,
          imageUrl: _self.detaildata.storeImgs.split(',')[0]
        };
        postShareContentIOS(_data);
      },
      postMinProUrl() {
        var _self = this;
        var uri = "pages/packageB/pages/shareCardDetail/main?distance=" + _self.distance + "&shareid=" + _self.shareCardId + "&shopStoreId=" + _self.shopStoreId;
        postImgAndroid(_self.detaildata.storeImgs.split(',')[0]);
        postTitleAndroid(`【${_self.detaildata.storeName}】点击卡主付款，最低享受${(_self.detaildata.shareCard.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`)
        postGoodsUrl(uri)
        var _data = {
          title: `【${_self.detaildata.storeName}】点击卡主付款，最低享受${(_self.detaildata.shareCard.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`,
          imageUrl: _self.detaildata.storeImgs.split(',')[0]
        };
        postShareContentIOS(_data);
      },
      // 微信二次分享
      shareInit() {
        let _self = this;
        let _data = {
          url: window.location.href.split('#')[0]
        };
        axios.get('https://zst.tenzhao.com/api/voip/wechat/signature', {params: {'url': window.location.href}}).then(res => {
          var signature = res.data;

          wx.config({
            debug: false,
            appId: signature.appid,
            timestamp: signature.timestamp,
            nonceStr: signature.noncestr,
            signature: signature.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'hideMenuItems',
              'showMenuItems'
            ]
          });
          wx.ready(() => {
            var shareData = {
              title: `【${_self.detaildata.storeName}】助商通联盟商家SVIP会员折扣卡`,
              desc: `立享会员折扣${_self.detaildata.shareCard.shareCardDiscount * 1000 / 100}折；更多优惠下载请下载助商通。`,
              link: window.location.href,
              imgUrl: _self.detaildata.storeImgs,
              success: function () {
              },
              cancel: function () {
              }
            };
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
            wx.onMenuShareQZone(shareData);
            wx.checkJsApi({
              jsApiList: [
                'checkJsApi'
              ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success: function (res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
              }
            });
          });
          wx.error(function (res) {
            alert(res.errMsg);
          });

        })
      },
      enterTheodolite() {
        enterTheodolite(this.detaildata.longitude, this.detaildata.latitude);
      },
      getShareQr(card) {
        var _self = this;
        var _data = {
          token: String(_self.token),
          sharecardId: String(card.id),
          distance: String(card.distance),
          shopStoreId: String(card.shopStoreId)
        };
        _self.$getSignIn(_data).then(sec => {
          shareQr(_data, sec).then(res => {
            if (res.data.state == 1) {
              card.qrCode = res.data.data.qrCode;
              _self.detaildata.shareCard = card;
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      handleQrParams(){
        var _data = {
          isAppAccess: '1',
          isMainCard: '0',
          shareuserId: this.detaildata.shareuserId,
          cardNO: this.detaildata.cardNO,
          attach: '&shareCardId=' + this.detaildata.shareCardId
        };
        handleQrParams(_data);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .seller_detail {
    box-sizing: border-box;
    padding: .19rem .27rem;

    .sell_top {
      background: #FFFFFF;
      margin-bottom: .27rem;
      padding-bottom: .25rem;
      border-bottom: .01rem dashed #E5E5E5;

      .sell_info {
        display: flex;
        align-items: center;
        margin-bottom: .29rem;

        .sell_logo {
          width: .8rem;
          height: .8rem;
          margin-right: .26rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #0e90d2;
          }
        }

        .sell_name {
          font-size: .36rem;
        }

        .sell_level {
          height: 100%;
          display: flex;

          img {
            width: .19rem;
            height: .19rem;
          }
        }
      }

      .store_time {
        display: flex;
        justify-content: space-between;
        margin-bottom: .26rem;

        p {
          font-size: .28rem;
          color: #0D0D0F;
        }

        span {
          font-size: .24rem;
          color: #D2D2D2;
        }

        span::before {
          font-size: .3rem;
        }

        .icon-shoucang1::before {
          color: #FFB415;
        }
      }

      .shareCard {
        width: 6.8rem;
        height: 3.89rem;
        border-radius: .2rem;
        box-shadow: 0 .03rem .17rem .03rem rgba(0, 0, 0, 0.17);
        margin: 0 auto;
        overflow: hidden;
        margin-bottom: .42rem;

        .cardDetail {
          width: 100%;
          height: 3.1rem;
          box-sizing: border-box;
          padding: .21rem .29rem;

          .slogan {
            position: absolute;
            top: 0;
            right: .21rem;
          }

          .explain {
            display: block;
            padding: .04rem .14rem;
            background: rgba(0, 0, 0, .1);
            border-radius: .2rem;
          }

          .logo {
            display: block;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: #0D0D0D;
            margin-right: .2rem;
          }

          .discount {
            border: .02rem solid #ffffff;
          }
        }

        .contact {
          width: 100%;
          height: .79rem;
          background: #FFFFFF;
          box-sizing: border-box;
          padding: 0 .29rem;
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
              padding-right: .2rem;

              .icon-dizhi1 {
                color: #D2D2D2;
                font-size: .32rem;
                margin-right: .06rem;
              }

              .add_con {
                width: 3rem;
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
              padding: .12rem .15rem;
              border-left: .01rem solid #E5E5E5;

              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }

        }
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


      .sell_bus_info {
        width: 100%;
        box-sizing: border-box;
        padding: .29rem .21rem;

        p {
          color: #0D0D0F;
          font-size: .28rem;
        }
      }

      .card_info {
        width: 100%;
        box-sizing: border-box;
        padding: .28rem .22rem;
        background: linear-gradient(268deg, rgba(251, 230, 204, 1), rgba(214, 146, 92, 1));
        border-radius: .1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card_discount {
          font-size: .3rem;
          color: #FFFFFF;
        }

        button {
          display: block;
          width: 1.66rem;
          height: .5rem;
          background: rgba(246, 15, 81, 1);
          box-shadow: 0px 1px 3px 0px rgba(206, 11, 47, 0.43);
          border-radius: .1rem;
          color: #FFFFFF;
        }
      }
    }

    footer{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      .share_btn{
        width: 3.06rem;
        height: 100%;
        background: #FDB300;
      }
    }

    .justify_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .34rem;

      p {
        font-size: .28rem;
      }

      button {
        display: block;
        width: 1.6rem;
        height: .47rem;
        background: #FFB415;
        color: #FFFFFF;
        border-radius: .1rem;
        font-size: .28rem;
      }
    }

    .pay-btn {
      width: 100%;
      padding-bottom: .47rem;
      border-bottom: .01rem dashed #E5E5E5;
      margin-bottom: .28rem;

      button {
        display: block;
        width: 100%;
        height: .8rem;
        border-radius: .1rem;
        background: #F60F51;
        font-size: .36rem;
        color: #FFFFFF;
      }
    }

    .module {
      .module-title {
        font-size: .36rem;
        font-weight: bold;
        margin-bottom: .35rem;
      }

      p {
        font-size: .28rem;
        color: #0D0D0F;
      }
    }

    .use_intro_pop {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.6);

      .close_img {
        width: .55rem;
        height: .54rem;
        position: absolute;
        right: -0.3rem;
        top: -0.8rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .pop_con {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 2.24rem;
        width: 6rem;
        height: 7rem;
        background: #fff;
        margin: auto;
        z-index: 999;
        border-radius: .2rem;

        .pop_title {
          width: 100%;
          height: .52rem;
          /*background:#ff6700;*/
          margin-top: .52rem;
          font-size: .36rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          div {
            background: linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
          }

          .heng_xian {
            width: 2rem;
            height: 0.02rem;
            background: linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
            margin-top: 0.02rem;
          }
        }

        .pop_con_con {
          width: 5.6rem;
          margin-top: .72rem;
          margin-left: .2rem;

          .pop_con_fir {
            overflow: hidden;
            margin-bottom: .66rem;

            .img_fir {
              width: .35rem;
              height: .35rem;
              float: left;
              background: #ff6700;

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            .con_con_con {
              float: left;
              margin-left: .2rem;
              width: 4.8rem;

              .fir_title {
                font-size: .34rem;
                color: #000;
              }

              .fir_con {
                font-size: .28rem;
                color: #000;
              }
            }
          }
        }
      }
    }
  }
</style>
