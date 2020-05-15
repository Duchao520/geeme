<template>
  <div>
    <transition name="slide_go">
      <div class="bg-FFDDAA fz-30" v-show="touchTip"><i class="iconfont icon-guanbi" style="margin-right: .36rem"
                                                        @click="touchTip = false"></i>试试向左滑，可收藏、可分享
      </div>
    </transition>
    <div style="height: .9rem;"></div>
    <div class="switch" @click="switchShow">
      <img src="@/assets/imgs/common/icon_switch.png" alt="">
    </div>
    <div class="scroll-container wheel-scroll">
      <div class="card-group wheel-item" v-for="(item,index) in dataList" :key="index">
        <div class="mask-fc"></div>
        <div class="card-container" :style="{height: switchFlag ? '3.1rem' : '2.3rem'}">
          <div
            class="card-item"
            @touchstart="touchStart($event,index)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)"
          >
            <div class="wrapper_container flex_box"
                 :style="{transform: 'translate(' + (!switchFlag && touchIndex == index ? x_distance : 0) + 'px' + ')'}">
              <div class="contents_wrapper flex_box justify_space_between" style="flex-direction: column;">
                <button class="mask-btn" @click="goshare(item)"></button>
                <div>
                  <div class="fz-24 fc-ffffff flex_box justify_space_between">
                    <p class="flex_box align_center">
                      <img src="@/assets/imgs/svip/shareCard_slogan.png" alt=""
                           style="display: block;width: 1.54rem;height: .28rem;margin-right: .14rem">(累计使用：{{item.consumeAmount}}次)
                    </p>
                    <div class="flex_box align_center">
                      <img src="@/assets/imgs/common/icon_cardholder.png" alt="" style="display: block;width: .4rem;height: .4rem;margin-right: .18rem">
                      <span class="txt-ellipsis" style="display: block;width: 1rem">{{item.realName}}</span>
                    </div>
                  </div>
                  <p class="fz-30 fc-ffffff">余额：{{item.money}}元</p>
                </div>
                <div class="flex_box justify_space_between align_center">
                  <p class="fz-60 fc-ffffff">{{Number(item.shareCardDiscount*100/10).toFixed(1)}}<i class="fz-28">折</i>
                    <span class="fz-22" style="border: .02rem solid #ffffff">会员折扣</span>
                  </p>
                  <img src="@/assets/imgs/svip/shareCard_btn.png" alt=""
                       style="display: block;width: 2.29rem;height: .66rem">
                </div>
              </div>
              <div class="slide flex_box">
                <p class="bg-FDB300">
                  <span v-if="item.collection == 0">加入</span><span v-if="item.collection == 0">收藏</span>
                  <span v-else="item.collection == 1">已收藏</span>
                  <button
                    @click.stop="collection((item.collection == 0 ? 1 : 0),item.shopStoreId,item.id,index)"></button>
                </p>
                <p class="bg-FFA035">
                  <span>分享赚</span><span>佣金{{item.commissionRate * 10 /10}}%</span>
                  <button @click.stop="share(item)"></button>
                </p>
                <p class="bg-ED752E">
                  <span>使用</span><span>此卡</span>
                  <button @click="goshare(item)"></button>
                </p>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="bottom_btns box_padding flex_box justify_space_between align_center" style="padding: 0 .31rem">
              <div class="iconfont icon-shoucang11-copy fc-8D8E98 fz-26"
                   :class="{'fc-FEB623': item.collection == 1}"
                   @click.stop="collection((item.collection == 0 ? 1 : 0),item.shopStoreId,item.id,index)">{{item.collection == 0 ? '加入收藏' : '已收藏'}}</div>
              <div class="fc-8D8E98 fz-24">分享赚佣金{{item.commissionRate * 10 /10}}%
                <button class="iconfont icon-fenxiang fc-ffffff fz-26 btn_radius"
                        style="background: #D2D2D2;padding: .08rem .12rem;margin-left: .12rem;z-index: 51"
                        @click.stop="share(item)">分享好友
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <toast :tip="tip" ref="toast"></toast>
    <no-data :showNoData="noData" :noticeMes="conNot"/>
    <v-share :card="cardDetail" ref="share"></v-share>
  </div>
</template>

<script>
  import {govippage, collectionPag, shareQr} from "@/assets/js/comm";
  import card from "@/assets/imgs/svip/shareCard.png";
  import {
    getSignIn,
    getGPS,
    getCity,
    timestampToTime,
    postTitle,
    postGoodsUrl,
    postImgAndroid,
    postTitleAndroid,
    postShareContentIOS
  } from "@/assets/js/jsBridge";
  import {CARDPAGE} from "@/assets/js/deal";
  import noData from '@/components/common/noData';
  import toast from "@/components/common/toast";
  import vShare from "@/components/common/vShare";

  import BScroll from 'better-scroll';

  export default {
    props: ['tokenPromise'],
    name: "vipCard",
    components: {
      noData,
      toast,
      vShare
    },
    data() {
      return {
        card: card,
        isBack: this.$route.query.isBack,
        token: '',
        shopStoreId: '',
        distance: '',
        LONG: '',
        LAT: '',
        dataList: [],
        shareCardId: '',
        pageNum: 1,
        pageSize: 20,
        touchTip: true,

        noData: false,
        conNot: '',
        tip: '',
        cardDetail: '',
        switchFlag: false,

        touchIndex: '',             //touch目标的位置
        touch_finish_x: '',        //侧滑过程中touch点x轴坐标
        touch_start_x: '',          //侧滑开始时touch点x轴坐标
        x_distance: '',           //侧滑位移量
        finish_x_distance: ''       //tou结束位置
      }
    },
    watch: {

    },
    mounted() {
      var _self = this;
      postTitle('会员卡');
      _self.shopStoreId = _self.$route.query.shopStoreId;
      _self.distance = _self.$route.query.distance;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.storeList();
      })
    },
    methods: {
      close() {
      },
      goshare(item) {
        CARDPAGE.shareCard = item;
        if (this.isBack == 1) {
          this.$router.go(-1);
        } else {
          this.$router.push({
            name: 'svipPayIndex',
            query: {shopStoreId: this.shopStoreId, distance: this.distance, shareCardId: item.id, cardType: '2'}
          })
        }

      },
      getViplist() {
        var _self = this;
        var _data = {
          token: this.token,
          shopStoreId: String(this.shopStoreId),
          distance: '0',
          LONG: String(this.LONG),
          LAT: String(this.LAT),
          pageNum: String(this.pageNum),
          pageSize: String(this.pageSize)
        };

        getSignIn(_data).then(res => {
          var sec = res;
          govippage(_data, res).then(res => {
            if (res.data.state == 1) {
              var timeD = res.data.data;

              for (let i = 0; i < timeD.length; i++) {
                timeD[i].createTime = timestampToTime(timeD[i].createTime);
                timeD[i].commissionRate = (timeD[i].commissionRate * 1000) / 10;
                timeD[i].money = ((timeD[i].money * 10) / 1000).toFixed(2);
              }
              this.dataList = this.dataList.concat(res.data.data);
              if (this.dataList.length === 0) {
                this.noData = true;
                this.conNot = '无会员卡';
                return false;
              }
            } else {
              _self.toast(res.data.msg);
            }
          })
        })
      },
      switchShow(){
        this.switchFlag = !this.switchFlag;
        this.x_distance = 0;
      },
      // 查询经纬度
      storeList() {
        var _self = this;
        getGPS().then(GPS => {
          _self.LONG = GPS.LONG;
          _self.LAT = GPS.LAT;
          _self.getViplist();
        })
      },
      nextPage() {
        var _self = this;
        _self.pageNum++;
        _self.getViplist();
      },

      /**收藏——取消收藏*/
      collection(status, shopStoreId, shareCardId, index) {
        var _self = this;
        var _data = {
          token: String(_self.token),
          collection: String(status),
          shopStoreId: String(shopStoreId),
          shareCardId: String(shareCardId)
        };
        getSignIn(_data).then(sec => {
          collectionPag(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.toast(status == 1 ? "收藏成功" : "已取消收藏");
              _self.dataList[index].collection = status;
            } else {
              _self.toast(decodeURI(res.data.msg))
            }
          })
        })
      },
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      share(card) {
        var _self = this;
        _self.getShareQr(card);
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
        var uri = "pages/packageB/pages/shareCardDetail/main?distance=" + _self.cardDetail.distance + "&shareid=" + _self.cardDetail.id + "&shopStoreId=" + _self.cardDetail.shopStoreId;
        postImgAndroid(_self.cardDetail.storeImgs.split(',')[0]);
        postTitleAndroid(`【${_self.cardDetail.storeName}】点击卡主付款，最低享受${(_self.cardDetail.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`)
        postGoodsUrl(uri);
        var _data = {
          title: `【${_self.cardDetail.storeName}】点击卡主付款，最低享受${(_self.cardDetail.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`,
          imageUrl: _self.cardDetail.storeImgs.split(',')[0]
        };
        postShareContentIOS(_data);
      },
      touchStart(e, index) {
        var _self = this;
        _self.touchIndex = index;
        _self.touch_start_x = e.changedTouches[0].clientX;

      },
      touchMove(e) {
        var _self = this;
        _self.touch_finish_x = e.changedTouches[0].clientX;

        _self.x_distance = Number(_self.finish_x_distance) + _self.touch_finish_x - _self.touch_start_x;
        if (_self.x_distance > 0) {
          _self.x_distance = 0;
        } else if (_self.x_distance <= -180) {
          _self.x_distance = -180;
        }
      },
      touchEnd(e) {
        var _self = this;
        if (_self.x_distance < -60) {
          _self.x_distance = -180
          _self.finish_x_distance = -180;
        } else {
          _self.x_distance = 0;
          _self.finish_x_distance = 0;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .bg-FFDDAA {
    width: 100%;
    height: .9rem;
    background: #FFDDAA;
    line-height: .9rem;
    box-sizing: border-box;
    padding-left: .54rem;
    color: #8B4302;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 60;
  }

  .bg-FFDDAA::before {
    font-size: .36rem;
    margin-right: .36rem;
  }

  .switch{
    width: .9rem;
    height: .9rem;
    position: fixed;
    bottom: 1.06rem;
    right: .33rem;
    z-index: 1;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .scroll-container {

  }

  .card-group {
    width: 100%;
    position: relative;
    /*margin-bottom: .27rem;*/
    .mask-fc {
      width: 100%;
      height: .27rem;
      background: #FFFFFF;
    }
    .card-container{
      width: 6.8rem;
      height: 3.1rem;
      margin: 0 auto;
      overflow: hidden;
      box-shadow: 0 -1px 20px 2px rgba(12, 12, 12, .2);
      transition: all 0.2s;
      .card-item {
        width: 6.8rem;
        height: 3.1rem;
        border-radius: .2rem;
        overflow: hidden;
        box-shadow: 0 -1px 20px 2px rgba(12, 12, 12, .2);
        .wrapper_container {
          float: left;
          transition: all 0.2s;

          .contents_wrapper {
            width: 6.8rem;
            height: 2.3rem;
            background: linear-gradient(270deg, rgba(60, 102, 174, .9), rgba(52, 108, 193, .9), rgba(80, 179, 235, .9));
            box-sizing: border-box;
            padding: .24rem .25rem .16rem .41rem;
            position: relative;

            .mask-btn {
              display: block;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 20;
            }
          }

          .slide {
            width: 3.6rem;
            height: 2.3rem;
            float: left;

            p {
              width: 1.2rem;
              height: 100%;
              font-size: .24rem;
              color: #FFFFFF;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              position: relative;

              button {
                position: absolute;
                display: block;
                width: 100%;
                height: 100%;
              }
            }

            .bg-FDB300 {
              background: #FDB300;
            }

            .bg-FFA035 {
              background: #FFA035;
            }

            .bg-ED752E {
              background: #ED752E;
            }
          }
        }
        .bottom_btns{
          width: 100%;
          height: .8rem;
          background: #FFFFFF;
          border-radius: 0 0 .2rem .2rem;
          overflow: hidden;
        }
      }
    }

  }

</style>
