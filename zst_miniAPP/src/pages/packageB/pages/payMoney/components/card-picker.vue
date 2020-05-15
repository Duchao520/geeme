<template>
    <div class="card-picker" v-if="coupon_list_flag">
      <section class="container">
        <div class="close" @click="close">
          <img src="/static/img/close.png" alt="">
        </div>
        <main>
          <div class="coupon-container" v-if="coupon_list_flag">
            <div class=" mb-24"
                 :class="{'opacity-7': totalMoney < item.consumeMoney * 100 / 100}" v-for="(item,index) in couponList"
                 :key="index"
                 @click="chooseCoupon(index)">
              <div class="coupon-group" v-if="item.couponType == '1'">
                <div class="left couponBg">
                  <div class="money"><span class="fz-28 ">￥</span><span class="fz-60" style="line-height: 60rpx">{{item.couponMoney * 100 / 100}}</span></div>
                  <p class="meetMoney fz-24">
                    满{{item.consumeMoney * 100 / 100}}元可使用
                  </p>
                </div>
                <div class="active" v-show="couponActiveIndex === index"><img src="../../../static/img/active.png" alt=""></div>
                <div class="right">
                  <p class="fz-28" style="margin-bottom: 18rpx">{{item.couponTitle}}</p>
                  <p class="fz-22 fc-8b8b8b dashed">{{item.times}}</p>
                  <p class="fz-22 fc-8b8b8b">{{item.shopStore.storeName}}</p>
                </div>
              </div>
              <div class="coupon-group" v-if="item.couponType == '2'">
                <div class="left couponBg">
                  <div class="money"><span class="fz-28 ">￥</span><span class="fz-60" style="line-height: 60rpx">{{item.couponMoney * 100 / 100}}</span></div>
                  <p class="meetMoney fz-24">
                    现金券
                  </p>
                </div>
                <div class="active" v-show="couponActiveIndex === index"><img src="../../../static/img/active.png" alt=""></div>
                <div class="right">
                  <p class="fz-28" style="margin-bottom: 18rpx">{{item.couponTitle}}</p>
                  <p class="fz-22 fc-8b8b8b dashed">{{item.times}}</p>
                  <p class="fz-22 fc-8b8b8b">{{item.shopStore.storeName}}</p>
                </div>
              </div>
              <div class="fz-22 fc-8D8E98" style="height: 40rpx;line-height: 40rpx;background: #F7F7F9" v-if="item.isAllowSuperposition == '0'">该优惠券只能单独使用</div>
            </div>
          </div>
        </main>
      </section>
      <v-confirm :confirmTitle="'提示'"
                 :confirmDesc="'该优惠券只可单独使用，是否继续'"
                 :confirmSubmit="'确认'"
                 ref="vConfirm_2"
                 @PassEvent="onlyChooseCoupon"></v-confirm>
    </div>
</template>

<script>
  import {getSignIn} from "@/common/js/comm";
  import Tips from '@/common/js/tips';
  import vConfirm from './vConfirm';

  export default {
    name: "card-picker",
    props: ['totalMoney'],
    components: {
      vConfirm
    },
    data() {
      return {
        card_list_flag: false,
        coupon_list_flag: false,
        cardList: '',
        couponList: '',
        couponActiveIndex: '',
        coupon_isAllowSuperposition: '',
        tip: '',
        INDEX: ''
      }
    },
    methods: {
      close() {
        this.card_list_flag = false;
        this.coupon_list_flag = false;
      },

      getCouponList(storeId){
        var _self = this;
        var _data = {
          token: String(_self.$store.state.token),
          shopStoreId: String(storeId),
          state: '2'
        };
        getSignIn(_data).then(sec => {
          _self.$http.getCouponList(_data,sec).then(res => {
            if(res.state == 1){
              _self.couponList = res.data;
              _self.couponList.forEach(item => {
                item.times = String(item.startDate).slice(0,4) + '.' + String(item.startDate).slice(4,6) +
                  '.' + String(item.startDate).slice(6,8) + '-' + String(item.endDate).slice(0,4) + '.' + String(item.endDate).slice(4,6) +
                  '.' + String(item.endDate).slice(6,8)
              })
              _self.$emit('handleListLength',_self.couponList.length)
            }else {
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          })
        })
      },
      showCouponList(){
        console.log(this.totalMoney);
        this.coupon_list_flag = true;
      },
      chooseCoupon(index){
        var _self = this;
        if(Number(_self.totalMoney) >= _self.couponList[index].consumeMoney * 100 / 100 && Number(_self.totalMoney)){
          if(index === _self.couponActiveIndex){    //再次选择同一张,放弃使用当前优惠券
            _self.couponActiveIndex = '';
            _self.$emit('chooseCouponEvent','');
          }else{
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
      updateCounponActIndex(){
        var _self = this;
        _self.couponActiveIndex = '';
      }

    },
    mounted() {
      var _self = this;
    }
  }
</script>

<style lang="scss" scoped>
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
      height: 1100rpx;
      bottom: 0;
      width: 100%;
      border-radius: 20rpx 20rpx 0 0;
      padding: 0;
      /*overflow-y: scroll;*/
      background: #F2F2F2;

      main {
        width: 100%;
        height: 100%;

        overflow-y: scroll;
        .coupon-container{
          box-sizing: border-box;
          padding: 37rpx 18rpx;
          .coupon-group{
            width: 100%;
            height: 186rpx;
            display: flex;
            border-radius: 0 10rpx 10rpx 0;
            overflow: hidden;
            position: relative;
            .couponBg{
              width: 242rpx;
              height: 186rpx;
              background: url("../../../static/img/coupon_bg.png") center center no-repeat;
              background-size: 100% 100%;
            }
            .left{
              color: #FFFFFF;
              box-sizing: border-box;
              padding: 34rpx 0;
              .money{
                display: flex;
                justify-content: center;
                align-items: flex-end;
                margin-bottom: 24rpx;
              }
              .meetMoney{
                text-align: center;
              }
            }
            .right{
              width: 472rpx;
              height: 100%;
              background: #FFFFFF;
              box-sizing: border-box;
              padding: 28rpx 21rpx 0;
              .dashed{
                border-bottom: 2rpx dashed #efefef;
              }
            }
            .active{
              width: 88rpx;
              height: 79rpx;
              position: absolute;
              top: 0;
              right: 0;
              img{
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
          .opacity-7{
            opacity: .7;
          }
        }
      }
      .fz-28{
        font-size: 28rpx;
      }
      .fz-24{
        font-size: 24rpx;
      }
      .fz-30{
        font-size: 30rpx;
      }
      .fz-14{
        font-size: 14rpx;
      }
      .fz-60{
        font-size: 60rpx;
      }
      .fz-22{
        font-size: 22rpx;
      }
      .mb-15{
        margin-bottom: 15rpx;
      }
      .fc-8b8b8b{
        color: #8b8b8b;
      }
      .close {
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        right: 28rpx;
        top: -74rpx;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }

  }
</style>
