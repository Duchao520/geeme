<template>
  <div>
    <v-toast :tip="tip" ref="toast"></v-toast>
    <transition name="slide_down_up">
      <div class="card-picker" v-show="card_list_flag || coupon_list_flag">
        <section class="container">
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
          <main>
            <div v-if="card_list_flag">
              <div class="card-group" v-for="(item,index) in cardList" :key="index" @click="chooseCard(item)">
                <div class="mask-fc"></div>
                <div class="card-item">
                  <p class="fz-28">余额：{{(item.money*100/10000).toFixed(2)}}元</p>
                  <p class="fz-24 mb-15">累计使用：{{item.consumeAmount * 100 / 100}}次</p>
                  <div class="flex_box">
                    <div class="left">
                      <p class="discount"><i class="fz-60" style="height: .6rem;line-height: .6rem">{{(item.shareCardDiscount
                        * 10).toFixed(1)}}</i><span class="fz-24">折</span></p>
                      <p class="fz-22 slogan">会员折扣</p>
                    </div>
                    <div class="right">
                      <img src="@/assets/imgs/scanPay/shareCard_btn.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="coupon-container" v-if="coupon_list_flag">
              <div class="mb-24" :class="{'opacity-7': Number(totalMoney<item.consumeMoney * 100 / 100)}"
                   v-for="(item,index) in couponList" :key="index" @click="chooseCoupon(index)">
                <div class="coupon-group" v-if="item.couponType == '1'">
                  <div class="left couponBg">
                    <div class="money"><span class="fz-28 ">￥</span><span class="fz-60" style="line-height: .6rem">{{item.couponMoney * 100 / 100}}</span>
                    </div>
                    <p class="meetMoney fz-24">
                      满{{item.consumeMoney * 100 / 100}}元可使用
                    </p>
                  </div>
                  <div class="active" v-show="couponActiveIndex === index"><img src="@/assets/imgs/scanPay/active.png"
                                                                                alt=""></div>
                  <div class="right">
                    <p class="fz-28" style="margin-bottom: .18rem">{{item.couponTitle}}</p>
                    <p class="fz-22 fc-8b8b8b dashed">{{String(item.startDate).slice(0,4) + '.' +
                      String(item.startDate).slice(4,6) +
                      '.' + String(item.startDate).slice(6,8) + '-' + String(item.endDate).slice(0,4) + '.' +
                      String(item.endDate).slice(4,6) +
                      '.' + String(item.endDate).slice(6,8)}}</p>
                    <p class="fz-22 fc-8b8b8b">{{item.shopStore.storeName}}</p>
                  </div>
                </div>
                <div class="coupon-group" v-if="item.couponType == '2'">
                  <div class="left couponBg">
                    <div class="money"><span class="fz-28 ">￥</span><span class="fz-60" style="line-height: .6rem">{{item.couponMoney * 100 / 100}}</span></div>
                    <p class="meetMoney fz-24">
                      现金券
                    </p>
                  </div>
                  <div class="active" v-show="couponActiveIndex === index"><img src="@/assets/imgs/scanPay/active.png" alt=""></div>
                  <div class="right">
                    <p class="fz-28" style="margin-bottom: .18rem">{{item.couponTitle}}</p>
                    <p class="fz-22 fc-8b8b8b dashed">{{String(item.startDate).slice(0,4) + '.' + String(item.startDate).slice(4,6) +
                      '.' + String(item.startDate).slice(6,8) + '-' + String(item.endDate).slice(0,4) + '.' + String(item.endDate).slice(4,6) +
                      '.' + String(item.endDate).slice(6,8)}}</p>
                    <p class="fz-22 fc-8b8b8b">{{item.shopStore.storeName}}</p>
                  </div>
                </div>
                <div class="fz-22 fc-8D8E98" style="height: .4rem;line-height: .4rem;background: #F7F7F9" v-if="item.isAllowSuperposition == '0'">该优惠券只能单独使用</div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </transition>
    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'该优惠券只可单独使用，是否继续'"
               :confirmSubmit="'确认'"
               ref="vConfirm_2"
               @PassEvent="onlyChooseCoupon"></v-confirm>
  </div>

</template>

<script>
  import {shareCardList, getCouponList} from "@/assets/js/comm";
  import {getSignIn} from "@/assets/js/jsBridge";
  import {ctxPath} from "@/assets/js/concact";
  import axios from 'axios';
  import vConfirm from '@/components/common/vConfirm'

  export default {
    name: "card-picker",
    props: ['shopStoreId', 'openid', 'totalMoney','userId','code'],
    data() {
      return {
        card_list_flag: false,
        coupon_list_flag: false,
        cardList: '',
        couponList: '',
        couponActiveIndex: '',
        coupon_isAllowSuperposition: '',
        INDEX: '',
        tip: ''
      }
    },
    components: {
      vConfirm
    },
    methods: {
      close() {
        this.card_list_flag = false;
        this.coupon_list_flag = false;
      },
      /** 提醒黑窗口弹出*/
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      getCardList() {
        var _self = this;
        var _data = {
          shopStoreId: String(_self.shopStoreId)
        };
        axios({
          url: ctxPath + '/sapi/voip/shop/svipcard/share/list',
          method: 'get',
          params: _data
        }).then(res => {
          if (res.data.state == 1) {
            _self.cardList = res.data.data;
            _self.$emit('handleCardList', _self.cardList);
          } else {
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      showCardList() {
        this.card_list_flag = true;
      },
      chooseCard(card) {
        var _self = this;
        _self.$emit('chooseCardEvent', card);
        _self.close();
      },

      getCouponList(openid,userId) {
        var _self = this;
        var _data = {
          wxServiceNumOpenId: String(openid),
          userId: String(userId),
          shopStoreId: String(_self.shopStoreId),
          state: 2
        };
        axios({
          url: ctxPath + '/sapi/voip/coupon/list',
          method: 'get',
          params: _data
        }).then(res => {
          if (res.data.state == 1) {
            _self.couponList = res.data.data;
            _self.$emit('handleListLength', _self.couponList.length);
          } else if(res.data.state == 908701){
            // _self.toast('请先关注助商通微信公众号');
          } else {
            _self.toast(decodeURIComponent(res.data.msg))
          }
        })
      },
      showCouponList() {
        this.coupon_list_flag = true;
      },
      chooseCoupon(index) {
        var _self = this;
        if (Number(_self.totalMoney) >= _self.couponList[index].consumeMoney * 100 / 100&& Number(_self.totalMoney)) {
          if (index === _self.couponActiveIndex) {    //再次选择同一张,放弃使用当前优惠券
            _self.couponActiveIndex = '';
            _self.$emit('chooseCouponEvent', '');
          } else {
            if(_self.couponList[index].isAllowSuperposition == '0'){
              _self.coupon_isAllowSuperposition = _self.couponList[index];
              _self.INDEX = index
              _self.$refs.vConfirm_2.showConfirm();
            }else{
              _self.couponActiveIndex = index;
              _self.$emit('chooseCouponEvent',_self.couponList[index]);
              _self.close();
            }
          }
        }
      },
      onlyChooseCoupon(){
        var _self = this;
        _self.couponActiveIndex = _self.INDEX;
        _self.$emit('onlyChooseCoupon',_self.coupon_isAllowSuperposition);
        _self.close();
      },
      updateCounponActIndex() {
        var _self = this;
        _self.couponActiveIndex = '';
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .slide_down_up-enter-active {
    animation: slideInUp .2s;
  }

  .slide_down_up-leave-active {
    animation: slideOutDown .2s;
  }

  .card-picker {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12, 12, 12, .5);

    .container {
      position: absolute;
      height: 10rem;
      bottom: 0;
      width: 100%;
      border-radius: .2rem .2rem 0 0;
      /*overflow-y: scroll;*/
      background: #F2F2F2;

      main {
        width: 100%;
        height: 100%;

        overflow-y: scroll;

        .card-group {
          width: 100%;
          height: 2.27rem;

          .mask-fc {
            width: 100%;
            height: .27rem;
            background: #F2F2F2;
          }

          .card-item {
            width: 6.8rem;
            height: 2rem;
            margin: 0 auto;
            background: linear-gradient(270deg, rgba(60, 102, 174, .9), rgba(52, 108, 193, .9), rgba(80, 179, 235, .9));
            border-radius: .2rem .2rem 0 0;
            box-shadow: 0 -1px 20px 2px rgba(12, 12, 12, .2);
            box-sizing: border-box;
            padding: .24rem .25rem .16rem .41rem;

            .flex_box {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;

              .left {
                display: flex;
                align-items: flex-end;

                .discount {
                  display: flex;
                  align-items: flex-end;
                  margin-right: .2rem;
                }

                .slogan {
                  border: 1px solid #FFFFFF;
                }
              }

              .right {
                width: 2.29rem;
                height: .66rem;

                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }
            }

            p {
              color: #FFFFFF;
            }
          }
        }

        .coupon-container {
          box-sizing: border-box;
          padding: .37rem .18rem;

          .coupon-group {
            width: 100%;
            height: 1.86rem;
            display: flex;
            border-radius: 0 .1rem .1rem 0;
            overflow: hidden;
            position: relative;

            .couponBg {
              width: 2.42rem;
              height: 1.86rem;
              background: url($ctxpath + "/static/customImgs/scanPay/coupon_bg.png") center center no-repeat;
              background-size: 100% 100%;
            }

            .left {
              color: #FFFFFF;
              box-sizing: border-box;
              padding: .34rem 0;

              .money {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                margin-bottom: .24rem;
              }

              .meetMoney {
                text-align: center;
              }
            }

            .right {
              width: 4.72rem;
              height: 100%;
              background: #FFFFFF;
              box-sizing: border-box;
              padding: .28rem .21rem 0;

              .dashed {
                border-bottom: .02rem dashed #efefef;
              }
            }

            .active {
              width: .88rem;
              height: .79rem;
              position: absolute;
              top: 0;
              right: 0;

              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }

          .opacity-7 {
            opacity: .7;
          }
        }
      }

      .fz-28 {
        font-size: .28rem;
      }

      .fz-24 {
        font-size: .24rem;
      }

      .fz-30 {
        font-size: .30rem;
      }

      .fz-14 {
        font-size: .14rem;
      }

      .fz-60 {
        font-size: .6rem;
      }

      .fz-22 {
        font-size: .22rem;
      }

      .mb-15 {
        margin-bottom: .15rem;
      }

      .fc-8b8b8b {
        color: #8b8b8b;
      }

      .close {
        width: .55rem;
        height: .55rem;
        position: absolute;
        right: .28rem;
        top: -.74rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }

  }
</style>
