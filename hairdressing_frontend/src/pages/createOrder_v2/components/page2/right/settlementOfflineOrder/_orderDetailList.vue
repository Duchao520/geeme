<template>
  <div class="order-list">
    <img src="@/assets/img/bg_order_top_long.png" class="bg-img">
    <div class="title">消费账单</div>
    <div class="left-circle circle-div"></div>
    <div class="right-circle circle-div"></div>
    <div class="detail-text">
      <div class="left-text">总金额</div>
      <div class="right-text">
        <span class="total-money"><span style="font-size: 14px;">￥</span>{{allNeedPay}}</span>
        <span class="detail-status" @click="changeDetailStatus">
          详情
          <span class="detail-status-icon" :class="[detailStatus]">
            <i class="icon iconfont icon-icon_back"></i>
          </span>
        </span>
      </div>
    </div>
    <div class="components-list">
      <transition 
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
        <!-- 详情展开组件 -->
        <GoodsList 
          v-show="detailStatus === 'open'" 
          v-bind="$attrs" 
          v-on="$listeners"
        />
      </transition>
      <!-- 优惠信息组件 -->
      <DiscountInfo 
        v-bind="$attrs"
        v-on="$listeners"
      />
      <!-- 服务单信息组件 -->
      <BasicInfo/>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import GoodsList from './left_goods/goodsList.vue';
import DiscountInfo from './left_goods/discountInfo.vue';
import BasicInfo from './left_goods/basicInfo.vue';
export default {
  data() {
    return {
      detailStatus: 'close', // open, close 
    }
  },
  methods: {
    // 切换详情组件展开、隐藏
    changeDetailStatus() {
      this.detailStatus = this.detailStatus === 'open' ? 'close' : 'open'
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    allNeedPay() { // 加上线上付款的
      let money = 0
      this.$attrs.currentGoodsList.map(i => {
        if (!i.deleted) {
          if (i.paymentStatus) {
            money += i.received
          } else if (i.countCardId || i.timeCardId) {
            money += Number((i.shopPrice * i.count).toFixed(2))
          } else {
            money += i.tempFinalPrice
          }
        }
      })
      return Number(money.toFixed(2))
    },
  },
  components: { GoodsList, DiscountInfo, BasicInfo },
}
</script>
<style lang='scss' scoped>
.order-list {
  font-size: 14px;
  // width: 343px;
  width: 423px;
  min-height: 686px;
  height: calc(100vh - 283px);
  background: #fff;
  margin-top: 24px;
  margin-left: 20px;
  position: relative;
  color: #333;
  font-family: 'PingFangSC-Regular';
  display: flex;
  flex-direction: column;
}
.bg-img {
  position: absolute;
  width: 102%;
  left: -1%;
}
.title {
  height: 46px;
  line-height: 56px;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
}
.detail-text {
  height: 46px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-top: 8px;
  margin: 0 14px;
  .left-text {
    font-size: 14px;
    font-weight: 600;
  }
  .right-text{
    cursor: pointer;
    .total-money {
      font-size: 16px;
      font-weight: 600;
    }
    .detail-status {
      user-select: none;
      color: #58C9F3;
      display: flex;
    }
    .detail-status-icon {
      margin-left: 3px;
      .iconfont { font-size: 10px; }
      &.open { transform: rotate(90deg); }
      &.close { transform: rotate(-90deg); }
    }
  }
}
.circle-div {
  border-radius: 50%;
  background: #f1f2f7;
  position: absolute;
  top: 46px;
  width: 20px;
  height: 20px;
  &.left-circle { left: -10px; }
  &.right-circle { right: -10px; }
}

// - 
.components-list {
  flex: 1;
  overflow-y: auto;
}
</style>
