<template>
  <transition name="alertMsg">
    <div class="toast-gather" v-show="toast_type1 || toast_type2">
      <div class="toast-container">
        <section class="box_padding toast-common" style="padding-top: 2rem">
          <img src="@/assets/imgs/cardFriends/toast_head.png" alt="" class="head">
          <img src="@/assets/imgs/common/close.png" alt=""
               class="close"
               @click="close">

          <main class="box_padding" style="padding: 0 .5rem .52rem" v-if="toast_type1 == 1">
            <p class="fz-36 font-weight text-center">少侠好刀法！砍掉<span class="fc-F7094D">{{Number($accMul(bargainDetail.helpPrice,1)).toFixed(2)}}</span>元
            </p>
            <p class="fz-30 text-center"
               style="margin-bottom: .35rem">
              已砍<span class="fc-F7094D">{{$accMul(Number(detail.helpedPrice),1)}}</span>元,还差<span class="fc-F7094D">{{$Subtr(Number(detail.taskPrice),Number(detail.helpedPrice))}}</span>元
            </p>
            <v-progress :height="'.15'"
                        :rate="$accMul($accDiv(Number(detail.helpedPrice),Number(detail.taskPrice)),100)+'%'"
                        :progressBg="'#F7094D'"></v-progress>
            <p class="fz-36 font-weight text-center"
               style="margin: .4rem 0 .24rem">邀请好友，可多砍一刀</p>
            <button class="fz-34 fc-ffffff" @click="share">喊好友砍一刀</button>
          </main>

          <main class="box_padding" style="padding: 0 .5rem .52rem" v-if="toast_type1 == 2">
            <p class="fz-36 font-weight text-center"
               style="margin-bottom: .45rem">很抱歉活动已结束</p>
            <router-link :to="{name: 'activeBargain'}" tag="button" class="fz-34 fc-ffffff">查看更多砍价活动</router-link>
          </main>

          <main class="box_padding" style="padding: 0 .5rem .52rem" v-if="toast_type1 == 3">
            <p class="fz-36 font-weight text-center"
               style="margin-bottom: .45rem">人多“利”量大，成功砍到价</p>
            <router-link :to="{
              name: 'checkSale',
              query: {bargainTasksId: bargainDetail.bargainTasksId,bargainId: bargainDetail.bargainId},
              params:{detail: detail.biBargain}
            }"
                         tag="button"
                         class="fz-34 fc-ffffff">领取兑换核销码
            </router-link>
          </main>

          <main class="box_padding" style="padding: 0 .5rem .2rem" v-if="toast_type1 == 4">
            <p class="fz-36 font-weight text-center"
               style="margin-bottom: .45rem">
              少侠晚来一步，本次活动已结束，商家送你一张商家送你一张<span class="fc-F7094D">{{$accMul(coupon.couponMoney,1)}}元</span>优惠券
            </p>
            <button class="fz-34 fc-ffffff" @click="getCoupon">领取优惠券</button>
            <p class="fz-24 fc-8D8E98">优惠券已放入您的账户，可在【首页-优惠券】中查看</p>
          </main>
        </section>
        <section class="box_padding shareCard" v-if="toast_type2 == 1">
          <p class="fz-36 font-weight text-center"
             style="margin-bottom: .5rem">
            商家送您一张<span class="fc-F7094D">{{$accMul(svipCard.shareCardDiscount,10)}}折</span>共享卡
          </p>
          <p class="fz-30 text-center"
             style="margin-bottom: .16rem">
            可在<span class="fc-F7094D">卡主-我的会员卡-收藏的卡</span>中查看
          </p>
          <router-link
            :to="{name: 'shareSvipCard',query:{shareCardId: svipCard.id,shopStoreId: svipCard.shopStoreId,maincardId: svipCard.maincardId,distance: 0}}"
            tag="button" class="fz-34 fc-ffffff"
            style="margin-bottom: .12rem">查看共享卡
          </router-link>
          <p class="fz-24 text-center">浙江和米通讯使用</p>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
  import vProgress from '@/components/common/v-progress';
  import {callAppMethod} from "@/assets/js/jsBridge";
  import {getCoupon} from "@/assets/js/comm";

  export default {
    name: "toast-gather",
    components: {
      vProgress
    },
    props: ['tokenPromise'],
    data() {
      return {
        toast_type1: '',
        toast_type2: '',
        detail: '',
        coupon: '',
        svipCard: '',
        bargainDetail: '',
        token: '',
        status: this.$route.query.status
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
      })
    },
    methods: {
      close() {
        this.toast_type1 = '';
        this.toast_type2 = '';
      },
      show(toast_type1, toast_type2) {
        this.toast_type1 = toast_type1 ? toast_type1 : this.toast_type1;
        this.toast_type2 = toast_type2 ? toast_type2 : this.toast_type2;
      },
      getGoods(goods) {
        var _self = this;
        _self.detail = goods;
        this.coupon = goods.biCardcouponactive;
        this.svipCard = goods.biSvipcardshare;
      },
      getBargainDetail(detail) {
        this.bargainDetail = detail;
      },
      share() {
        callAppMethod('24');
      },
      getCoupon() {
        var _self = this;
        var _data = {
          token: String(_self.token),
          couponNum: String(_self.coupon.couponNum)
        };
        getCoupon(_data).then(res => {
          if (res.data.state == 1) {
            _self.$emit('toast', decodeURIComponent('恭喜您，领取成功'));
            _self.close();
          } else {
            _self.$emit('toast', decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/global";

  .toast-gather {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background: rgba(12, 12, 12, .5);

    .toast-container {
      position: absolute;
      width: 6rem;
      top: 3.29rem;
      left: 0;
      right: 0;
      margin: auto;

      .toast-common {
        border-radius: .2rem;
        background: #FFFFFF;

        .head {
          display: block;
          width: 6rem;
          height: 3.25rem;
          position: absolute;
          top: -1.79rem;
          left: 0;
        }

        .close {
          display: block;
          width: .55rem;
          height: .55rem;
          position: absolute;
          top: -1.41rem;
          right: -.12rem;
        }

        button {
          display: block;
          width: 100%;
          height: .9rem;
          border-radius: .2rem;
          box-sizing: border-box;
          border: .08rem solid #F7094D;
          background: linear-gradient(0deg, rgba(237, 41, 102, 1), rgba(252, 83, 133, 1));
          box-shadow: 0 .01rem .32rem .06rem rgba(254, 216, 227, 1);
        }

        .bg-4F62F2-352FC0 {
          background: linear-gradient(0deg, rgba(53, 47, 192, 1), rgba(79, 98, 242, 1));
          border: .08rem solid #4C5DED;
          box-shadow: none;
        }
      }

      .shareCard {
        width: 100%;
        height: 3.77rem;
        background: url($ctxpath + "/static/customImgs/cardFriends/share_card_bg.png") center center no-repeat;
        background-size: 100% 100%;
        padding: .41rem .5rem 0;

        button {
          display: block;
          width: 100%;
          height: .9rem;
          border-radius: .2rem;
          box-sizing: border-box;
          border: .08rem solid #F7094D;
          background: linear-gradient(0deg, rgba(237, 41, 102, 1), rgba(252, 83, 133, 1));
          box-shadow: 0 .01rem .32rem .06rem rgba(254, 216, 227, 1);
        }
      }
    }
  }
</style>
