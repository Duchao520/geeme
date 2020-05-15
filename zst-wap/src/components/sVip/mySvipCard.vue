<template>
  <div class="my_svip_card">
    <div class="flex_box justify_space_between align_center fz-30 fc-8D8E98 box_padding bg-FFFFFF" style="width:100%;padding: .25rem .86rem 0;margin-bottom: .32rem;position: fixed;top: 0;left: 0;z-index: 2">
      <p class="btn-item" :class="{'active': cardType == 1}" @click.stop="changeType(1)">我是卡主 {{cardbag.length}}张</p>
      <p class="btn-item" :class="{'active': cardType == 2}" @click.stop="changeType(2)">收藏的卡 {{shareCardList.length}}张</p>
    </div>
    <div style="height: .85rem"></div>
    <transition name="slide_go">
      <div class="bg-FFDDAA fz-30" v-show="touchTip && cardType == 2"><i class="iconfont icon-guanbi" style="margin-right: .36rem"
                                                        @click="touchTip = false"></i>长按卡片可取消收藏
      </div>
    </transition>
    <transition :name="transitionName">
      <section v-show="animationFlag">
        <main v-if="cardType == 1">
          <div class="card-item box_padding fc-ffffff"
               style="padding: .34rem .25rem .19rem;margin-bottom: .32rem"
               :class="mainCard_bgs[index%5]"
               v-for="(item,index) in cardbag" @click="bagDetail(item,mainCard_bgs[index%5])"
               :key="index">
            <img src="@/assets/imgs/svip/svip_slogan.png" alt="" class="slogan" style="display: block;width: .58rem;height: .58rem">
            <div class="flex_box" style="margin-bottom: .3rem;justify-content: space-between">
              <img :src="item.storeLogo =='' ? card:item.storeLogo" alt="" class="logo">
              <div class="flex_box flex_column" style="width: 2.6rem;justify-content: space-around">
                <p class="fz-36 txt-ellipsis">{{item.storeName}}</p>
                <p class="fz-24 txt-ellipsis">{{item.unitAddress}}</p>
              </div>
              <div class="flex_box" style="align-items: flex-end">
                <span class="fz-60">{{(item.discountRate * 10).toFixed(1)}}</span>
                <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
                <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
              </div>
            </div>
            <div class="flex_box fz-28" style="margin-left: 1.19rem">
              <span style="margin-right: .28rem">余额:{{(item.money/100).toFixed(2)}}元</span>
              <!--<span v-if="item.activeType ==1">普通卡:{{item.shareCardCount}}张</span>-->
              <span v-if="item.activeType ==2 && item.shareCardCount !=0">共享卡:{{item.shareCardCount}}张</span>
              <span v-if="item.activeType ==3 && item.shareCardCount !=0" >分享卡:{{item.shareCardCount}}张</span>
            </div>
          </div>
        </main>
        <main v-show="cardType == 2">
          <div style="height: .85rem"  v-show="touchTip"></div>
          <div class="card-item box_padding fc-ffffff bg-50B3EB-346CC1-3C66AE"
               style="padding: .34rem .25rem .19rem;margin-bottom: .32rem"
               v-for="item in shareCardList" @click="bagDetail(item)"
               @touchstart="gotouchstart(item)"
               @touchend="gotouchend">
            <img src="@/assets/imgs/svip/shareCard_slogan_2.png" alt="" class="slogan" style="display: block;width: 1.62rem;height: .36rem">
            <div class="flex_box" style="margin-bottom: .2rem;justify-content: space-between">
              <img :src="item.storeLogo =='' ? card:item.storeLogo" alt="" class="logo">
              <div class="flex_box flex_column" style="width: 2.6rem;justify-content: space-around">
                <p class="fz-36 txt-ellipsis">{{item.storeName}}</p>
                <p class="fz-24 txt-ellipsis">{{item.address}}</p>
              </div>
              <div class="flex_box" style="align-items: flex-end">
                <span class="fz-60">{{(item.shareCardDiscount * 10).toFixed(1)}}</span>
                <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
                <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
              </div>
            </div>
            <div class="flex_box fz-28 justify_space_between align_center" style="margin-left: 1.19rem">
              <span style="margin-right: .28rem">余额:{{(item.money/100).toFixed(2)}}元</span>
              <button class="btn_radius fc-ffffff iconfont icon-fenxiang fz-28"
                      style="background: rgba(255,255,255,.2);padding: .08rem .18rem;"
                      @click.stop="share(item)">
                分享赚佣金{{(item.commissionRate*100).toFixed(0)}}%
              </button>
            </div>
          </div>
        </main>
      </section>
    </transition>
    <transition name="fade">
      <section class="bg" v-show="collectionConfirm">
        <main class="collection">
          <button class=" fz-36" style="color: #F60F51" @click="collection">取消收藏</button>
          <i class="line"></i>
          <button class="fc-8D8E98 fz-36" @click="collectionConfirm = false">取消</button>
        </main>
      </section>
    </transition>

    <no-data :showNoData="noData" :noticeMes="conNot"/>
    <toast :tip="tip" ref="toast"></toast>
    <v-share :card="cardDetail" ref="share"></v-share>
  </div>
</template>

<script>

  import {cardBag , shareQr , collectionPag} from '@/assets/js/comm'
  import {getSignIn, postTitle, getGPS , postImgAndroid , postTitleAndroid , postGoodsUrl , postShareContentIOS} from '@/assets/js/jsBridge'
  import {shuffle , MAINCARD} from "@/assets/js/deal";
  import card from '@/assets/imgs/common/my_card.png';
  import noData from '../common/noData'
  import toast from "@/components/common/toast"
  import vShare from "@/components/common/vShare"
  export default {
    props: ['tokenPromise'],
    name: "mySvipCard",
    components: {
      noData,
      toast,
      vShare
    },
    data() {
      return {
        showca: true,
        showsou: false,
        card: card,
        token: '',

        cardType: 1,
        cardbag: [],
        shareCardList: '',

        noData: false,
        conNot: '',

        LONG: '',
        LAT: '',
        tip: '',
        transitionName: '',
        animationFlag: true,
        cardDetail: '',
        collectionConfirm: false,
        timeOutEvent: '',
        touchTip: true,
        mainCard_bgs: ['bg-50B3EB-346CC1-3C66AE','bg-ECCCA7-CF9B65-C38758','bg-76DBE1-60C2A6-239E80','bg-FF8383-ED3766-CF1241','bg-CF5A53-B1203D-65060F']
      }
    },
    mounted() {
      var _this = this;
      postTitle('我的会员卡');
      this.cardType = this.$route.query.cardType ? this.$route.query.cardType : 1;
      getGPS().then(GPS => {
        this.LONG = GPS.LONG;
        this.LAT = GPS.LAT;
      })
      _this.tokenPromise.then((res) => {
        _this.token = res;
        _this.getcardBag();
        _this.getShareCard();
        _this.mainCard_bgs = shuffle(_this.mainCard_bgs);
      })
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      changeType(type){
        if(type == 1 && type !== this.cardType){
          this.cardType = 1;
          this.transitionName = 'slide_back';
          this.animationFlag = false;
          if (this.cardbag.length == 0) {
            this.noData = true;
            this.conNot = '无会员卡';
            return false;
          } else {
            this.noData = false;
          }
          setTimeout(() => {
            this.animationFlag = true
          },300)
        }else if(type == 2 && type !== this.cardType){
          this.cardType = 2;
          this.transitionName = 'slide_go';
          this.animationFlag = false;
          if (this.shareCardList.length == 0) {
            this.noData = true;
            this.conNot = '无会员卡';
            return false;
          } else {
            this.noData = false;
          }
          setTimeout(() => {
            this.animationFlag = true
          },300)
        }
      },
      //获取主卡
      getcardBag() {
        var _data = {
          token: String(this.token),
          longitude: String(this.LONG),
          latitude: String(this.LAT),
          cardType: '1'
        }

        getSignIn(_data).then(res => {
          cardBag(_data, res).then(res => {
            if(res.data.state == 1){
              this.cardbag = res.data.data;
              if (this.cardbag.length == 0) {
                this.noData = true;
                this.conNot = '无会员卡';
                return false;
              } else {
                this.noData = false;
              }
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }

          })
        })
      },

      getShareCard(){
        var _self = this;
        var _data = {
          token: String(this.token),
          longitude: String(this.LONG),
          latitude: String(this.LAT),
          cardType: '2'
        };
        getSignIn(_data).then(res => {
          cardBag(_data, res).then(res => {
            if(res.data.state == 1){
              this.shareCardList = res.data.data;

            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }

          })
        })
      },
      bagDetail(params,bg) {

        if (this.cardType == 1) {
          MAINCARD.bg = bg;
          this.$router.push({name: 'svipDetail', query: {maincardId: params.id}});
        } else {
          this.$router.push({
            name: 'shareSvipCard',
            query: {shareCardId: params.svipcardshareId, shopStoreId: params.shopStoreId, distance: params.distance}
          });
        }
      },
      share(card) {
        var _self = this;
        _self.getShareQr(card);
        console.log(card);
        _self.$refs.share.show(1);
      },
      getShareQr(card) {
        var _self = this;
        _self.cardDetail = card;
        _self.setShareContent();
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
              _self.cardDetail = card;
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      setShareContent() {
        var _self = this;
        var uri = "pages/packageB/pages/shareCardDetail/main?distance=" + _self.cardDetail.distance + "&shareid=" + _self.cardDetail.svipcardshareId + "&shopStoreId=" + _self.cardDetail.shopStoreId;
        postImgAndroid(_self.cardDetail.storeImgs.split(',')[0]);
        postTitleAndroid(`【${_self.cardDetail.storeName}】点击卡主付款，最低享受${(_self.cardDetail.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`)
        postGoodsUrl(uri);
        var _data = {
          title: `【${_self.cardDetail.storeName}】点击卡主付款，最低享受${(_self.cardDetail.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`,
          imageUrl: _self.cardDetail.storeImgs.split(',')[0]
        };
        postShareContentIOS(_data);
      },
      gotouchstart(item){
        let that = this;
        clearTimeout(this.timeOutEvent);//清除定时器
        that.timeOutEvent = 0;
        that.timeOutEvent = setTimeout(function(){
          //执行长按要执行的内容，
          that.cardDetail = item;
          that.collectionConfirm = true;
        },1000);//这里设置定时
      },
      //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
      gotouchend(){
        clearTimeout(this.timeOutEvent);
        if(this.timeOutEvent!=0){
          //这里写要执行的内容（尤如onclick事件）
        }
      },
      /**收藏——取消收藏*/
      collection() {
        var _self = this;
        var _data = {
          token: String(_self.token),
          collection: '0',
          shopStoreId: String(_self.cardDetail.shopStoreId),
          shareCardId: String(_self.cardDetail.svipcardshareId)
        };
        getSignIn(_data).then(sec => {
          collectionPag(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.toast("已取消收藏");
              _self.getShareCard();
            } else {
              _self.toast(decodeURI(res.data.msg))
            }
            _self.collectionConfirm = false;
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";
  .my_svip_card {
    box-sizing: border-box;
    padding: .25rem;
    -webkit-touch-callout: none;/*禁止长按链接或长按图片后弹出菜单*/
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    .btn-item::after{
      content: '';
      display: block;
      width: 100%;
      height: .05rem;
      border-radius: .05rem;
      margin-top: .16rem;
    }
    .bg-FFDDAA {
      width: 100%;
      height: .9rem;
      background: #FFDDAA;
      line-height: .9rem;
      box-sizing: border-box;
      padding-left: .54rem;
      color: #8B4302;
      position: fixed;
      top: .85rem;
      left: 0;
      z-index: 60;
    }

    .bg-FFDDAA::before {
      font-size: .36rem;
      margin-right: .36rem;
    }
    .active{
      color: #F60F51;
    }
    .active::after{
      background: #F60F51;
    }
    .card-item{
      width: 100%;
      height: 2.2rem;
      border-radius: 0 .2rem 0 0;
      box-shadow: 0 -1px .14rem .02rem rgba(12, 12, 12, .2);
      position: relative;
      .logo{
        display: block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #0D0D0D;
        margin-right: .2rem;
      }
      .discount{
        border: .02rem solid #ffffff;
      }
      .slogan{
        position: absolute;
        top: 0;
        right: .21rem;
      }
    }
    .btns{
      width: 100%;
      height: 1.3rem;
      background: #FFFFFF;
      position: fixed;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: .34rem 1.3rem 0;
      z-index: 5;
      .btn{
        width: 1.5rem;
        height: .7rem;
        border: .01rem solid rgba(224, 168, 122, 1);
        padding: .03rem;
        box-sizing: border-box;
        display: flex;
        position: relative;
        z-index: 10;
        .content{
          width: 100%;
          height: 100%;
          padding: 0 .2rem;
          border: .01rem solid rgba(224, 168, 122, 1);
          border-radius: .05rem;
          font-size: .2rem;
          color: #FFFFFF;
          line-height: .6rem
        }
      }
      .btn::after{
        position: absolute;
        bottom: -.13rem;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        content: '';
        display: block;
        width: 1rem;
        height: .04rem;
        border-radius: 50%;
      }
      .carder{
        border-color: rgba(224, 168, 122, 1);
        background:linear-gradient(144deg,rgba(214,146,92,1),rgba(251,230,204,1));
        .content{
          border-color: rgba(224, 168, 122, 1);
        }
      }
      .carder.active::after{
        background: rgba(172,106,0,.3);
        box-shadow: 0 0 .08rem .03rem rgba(172,106,0,.4);
      }
      .collection{
        border-color: #89B0F6;
        background:linear-gradient(0deg,rgba(135,174,246,1),rgba(162,199,252,1));
        .content{
          border-color: #89B0F6;
        }
      }
      .collection.active::after{
        background: rgba(135,174,246,.3);
        box-shadow: 0 0 .08rem .03rem rgba(135,174,246,.4);
      }
    }
    .bg{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(12,12,12,.5);
      .collection{
        width: 6.5rem;
        border-radius: .2rem .2rem 0 0;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .36rem;
        .line{
          width: 6rem;
          height: .02rem;
          background: #E5E5E5;
        }
        button{
          display: block;
          width: 100%;
          height: 1rem;
        }
      }
    }
  }
</style>
