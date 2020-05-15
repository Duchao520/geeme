<template>
  <div class="service-in-list">
    <div class="top-info">
      <div class="left-box">
        <img :src="utils.formatPicImg(detail.image)" />
        <div class="left-main">
          <p class="item-name">
            <span :title="detail.name">{{detail.name}}</span>
            <span
              style="margin-left: 10px;"
              class="light-font"
              :title="detail.specificationName"
            >{{detail.specificationName === '默认' ? '' : detail.specificationName}}</span>
          </p>
          <p class="item-server light-font">
            <span>① {{(detail.stationOne || []).map(i => i.staffName).join('/')}}</span>
            <span
              v-if="detail.assistantOrSalers && detail.assistantOrSalers.length"
            >② {{(detail.assistantOrSalers || []).map(i => i.staffName).join('/')}}</span>
            <span
              v-if="detail.stationThree && detail.stationThree.length"
            >③ {{(detail.stationThree || []).map(i => i.staffName).join('/')}}</span>
          </p>
          <p class="item-remark" @click="toEditRemark">
            <span class="light-font">备注:</span>
            <span>
              <span :title="detail.storeRemark" class="light-font">{{detail.storeRemark}}</span>
              <i class="icon iconfont icon-icon_open_on like-link"></i>
            </span>
          </p>
        </div>
      </div>
      <div class="right-box">
        <p class="shop-price" :title="detail.shopPrice">￥{{(detail.shopPrice).toFixed(2)}}</p>
        <p class="item-count light-font">×{{detail.count}}</p>
      </div>
    </div>
    <!-- 已经支付的订单不再显示次卡时间卡支付选择 -->
    <div class="times-card-choose" v-if="hasUsefulTimeCard">
      <div class="light-font">时间卡/次卡:</div>
      <div class="selected-card" v-if="showCardSelected" @click="handleGetUsefulCards">
        <!-- 编辑选择卡的按钮需要在收款台待支付时隐藏 并且 从另外渠道显示选择的次卡时间卡名称 -->
        <span class="over-flow-box">{{ selectedCardForService && selectedCardForService.cardName }}</span>
        <i
          style="margin-left: 4px; margin-top: 3px;"
          class="icon iconfont icon-icon_open_on like-link"
        ></i>
      </div>
    </div>
    <!-- 未支付的可以修改原数据的门店优惠 -->
    <div class="store-preference" v-if="!detail.paymentStatus">
      <div class="light-font">门店优惠</div>
      <div class="input-box">
        -
        <el-input
          :maxlength="6"
          ref="storePreferenceInput"
          :disabled="storePreferenceDisable"
          class="store-preference-input"
          v-model.trim="storePreference"
          @input="handleStorePreferenceChanged"
        ></el-input>
      </div>
    </div>
    <!-- 已支付的显示线上订单的优惠信息: 红包、优惠券、积分抵扣、其他优惠字段 -->
    <div class="online-paied-info">
      <!-- light-font -->
    </div>

    <!-- 未付、 已付简单区分 -->
    <div class="residue-or-receive" v-if="detail.paymentStatus">
      <span>实收款:</span>
      <span class="money red">
        ￥
        <dynamic-num :number="Number((detail.received || 0).toFixed(2))" />
      </span>
    </div>
    <!-- 未付、 已付简单区分 -->
    <div class="residue-or-receive" v-if="!detail.paymentStatus">
      <span>应收款:</span>
      <span class="money red">
        ￥
        <dynamic-num :number="Number((detail.tempFinalPrice || 0).toFixed(2))" />
      </span>
    </div>
    <div class="order-origin">
      <span>{{ detail.goodsOrderId ? '线上订单' : '门店开单' }}</span>
      <span>|</span>
      <span>{{ detail.paymentStatus ? '已支付' : '未支付' }}</span>
    </div>

    <!-- 对话框 -->
    <storeRemarkDialog
      v-if="showRemarkDialog"
      :visible="showRemarkDialog"
      :remark="this.storeRemark"
      @close="showRemarkDialog = false"
      @edit="handleEditRemark"
    />

    <!-- 切换选择时间卡、次卡 -->
    <selectedTimesCardDialog
      v-if="showTimesCardDialog"
      :visible="showTimesCardDialog"
      v-on="$listeners"
      v-bind="$attrs"
      :index="index"
      :detail="detail"
      @close="showTimesCardDialog = false"
      :checkedCard="selectedCardForService"
      @timeCardChanged="handleTimesCardChanged"
      :listInfo="$attrs.usefulCard"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import storeRemarkDialog from "./storeRemarkDialog.vue";
import selectedTimesCardDialog from "./selectedTimesCardDialog.vue";
export default {
  props: {
    detail: {
      type: Object,
      require: true
    },
    index: {
      // 包含deleted的下标
      type: Number,
      required: true
    }
  },
  data() {
    return {
      utils,
      // cardSelected: false, // 该服务是否选择了卡(次卡\时间卡)
      storePreference: null,
      storeRemark: "",
      showRemarkDialog: false, // 备注对话框
      selectedCardForService: {}, // 已选择的次卡、时间卡
      showTimesCardDialog: false, // 时间卡、次卡选择

      firstLoad: true, // 阻止监听多次触发, 覆盖正常操作问题, 仅监听初始化的一次
      disabledStatus: false // 处理卡切换的禁用门店优惠输入框
    };
  },
  mounted() {
    this.storeRemark = this.detail.storeRemark;
    this.storePreference = this.detail.storePreference || null;
  },
  methods: {
    ...mapActions(["setSelectedGoodsValue"]),
    // 门店优惠价修改
    handleStorePreferenceChanged(val) {
      if (val) {
        if (
          /^[0-9]+(\.[0-9]{0,2})?$/.test(val) &&
          Number(val) <= this.tempPrice
        ) {
          this.detail.storePreference = Number(val);
          this.setSelectedGoodsValue({
            index: this.index,
            storePreference: Number(val)
          });
        } else {
          this.storePreference = this.detail.storePreference;
        }
      } else {
        this.detail.storePreference = null;
        this.setSelectedGoodsValue({
          index: this.index,
          storePreference: null
        });
      }
    },
    // 编辑备注 1
    toEditRemark() {
      this.showRemarkDialog = true;
    },
    // 编辑备注 2
    handleEditRemark(text) {
      this.storeRemark = text;
      this.detail.storeRemark = text;
      this.setSelectedGoodsValue({ index: this.index, storeRemark: text });
      this.showRemarkDialog = false;
    },
    // 用户想切换选择的卡, 展开对话框
    handleGetUsefulCards() {
      this.showTimesCardDialog = true;
    },
    // 切换次卡、时间卡的回调, 卡可能被取消选择, 卡可能重复存在
    handleTimesCardChanged(card) {
      // console.log(card)
      this.showTimesCardDialog = false;
      this.selectedCardForService = card;
    }
  },
  watch: {
    "detail.storePreference": {
      handler: function(v, o) {
        if (this.detail.timeCardId || this.detail.countCardId) {
          // 选择了次卡、时间卡导致的门店优惠清零不在这里处理
        } else {
          this.detail.tempFinalPrice = Number(
            (this.detail.count * this.tempPrice - v).toFixed(2)
          );
          this.$emit("rootStorePreferenceChanged"); // 影响储值卡\身份卡可用选项
        }
      },
      immediate: true
    },
    selectedCardForService: {
      handler: function(v, o) {
        if (o && !o.id) {
          this.$emit("rootTimeCardChanged"); // 减少从有卡状态切换到有卡状态的根组件请求, 【此时是无卡切换有卡】
          // this.$emit("saveCardInfo", { data: v, index: this.index });
        }
        if (v && v.id) {
          // 【此处可能是从时间卡切换到次卡或者次卡切换到时间卡】
          this.detail.tempFinalPrice = 0;
          this.handleStorePreferenceChanged(null); // 可能存在先输入的门店优惠价要清空
          let inputDom = this.$refs.storePreferenceInput.$refs.input; // 处理残留
          inputDom.value = null; // 处理残留
          let key = v.cardType === 3 ? "timeCardId" : "countCardId";
          let anotherKey = v.cardType === 3 ? "countCardId" : "timeCardId";
          this.$set(this.detail, key, v.id);
          this.$set(this.detail, "cardName", v.cardName);
          this.$set(this.detail, anotherKey, null);
          if (v.cardType === 3) {
            // 选择的是时间卡
            this.$emit("suberCardChanged", {
              countCardId: null,
              index: this.index
            });
          } else {
            // 选择的是次卡, 需要增加占位
            this.$emit("suberCardChanged", {
              countCardId: v.id,
              index: this.index
            });
          }
          // 这里方法用来右边显示次卡时间卡
          this.$emit("saveCardInfo", { data: v, index: this.index });
        } else {
          this.detail.tempFinalPrice = Number(
            (
              this.detail.count * this.tempPrice -
              this.detail.storePreference
            ).toFixed(2)
          );
          this.$set(this.detail, "cardName", null);
          this.$set(this.detail, "timeCardId", null);
          this.$set(this.detail, "countCardId", null);
          this.$emit("rootTimeCardChanged"); // 减少从有卡状态切换到有卡状态的跟组建请求, 【此时是有卡切换无卡】
          if (o.cardType === 2) {
            // 如果是次卡切换到无卡, 需要释放占位
            this.$emit("suberCardChanged", {
              countCardId: null,
              index: this.index
            });
          }
          this.$emit("saveCardInfo", { data: v, index: this.index });
        }
      }
    },
    "$attrs.suggestCard": {
      handler: function(v, o) {
        if (v && v.id && this.firstLoad) {
          this.selectedCardForService = v; // 优先选时间卡, 次卡后续再计算
          this.storePreference = 0;
          this.detail.storePreference = 0;
          this.setSelectedGoodsValue({ index: this.index, storePreference: 0 });
          this.firstLoad = false;
        }
      }
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    showCardSelected() {
      let cards = this.$attrs.usefulCard;
      return (
        cards &&
        ((cards.listCustomerCountCardDetail &&
          !!cards.listCustomerCountCardDetail.length) ||
          (cards.listCustomerTimeCardDetail &&
            !!cards.listCustomerTimeCardDetail.length))
      );
    },
    hasUsefulTimeCard() {
      let usefulCards = this.$attrs.usefulCard;
      return (
        !this.detail.paymentStatus &&
        usefulCards &&
        ((usefulCards.listCustomerCountCardDetail &&
          !!usefulCards.listCustomerCountCardDetail.length) ||
          (usefulCards.listCustomerTimeCardDetail &&
            !!usefulCards.listCustomerTimeCardDetail.length))
      );
    },
    storePreferenceDisable() {
      // el-input残留的数字在上方函数中dom操作
      if (
        (this.selectedCardForService && this.selectedCardForService.id) ||
        this.billInfo.billId
      ) {
        // 待补充有billId
        return true;
      }
      return false;
    },
    key() {
      return `${this.detail.goodsType}_${this.detail.specificationId}`;
    },
    tempPrice() {
      let price =
        this.billInfo.compareMemberLevelPrice[this.key].price >= 0 // 注意undefined // 收款台待支付的服务产品不会取匹配数据，所以直接改会员价
          ? this.billInfo.compareMemberLevelPrice[this.key].price
          : this.detail.memberPrice;
      return price;
    }
  },
  components: { storeRemarkDialog, selectedTimesCardDialog }
};
</script>
<style lang='scss' scoped>
@mixin over-flow() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-in-list {
  border-bottom: 1px dotted #efefef;
  padding: 4px 0;
}
.top-info {
  display: flex;
  flex-wrap: nowrap;
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    object-position: center center;
    border-radius: 3px;
  }
  .left-box {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
  }
  .left-main {
    flex: 1;
    margin: 0 4px;
    max-width: 250px;
    p {
      @include over-flow;
    }
  }
  .right-box {
    max-width: 80px;
    min-width: 40px;
    text-align: right;
    p {
      @include over-flow;
    }
  }
}

.item-remark {
  cursor: pointer;
}
.icon-icon_open_on {
  font-size: 12px;
}

.times-card-choose,
.store-preference,
.online-paied-info {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.residue-or-receive,
.order-origin {
  text-align: right;
  margin: 3px 0;
}

.light-font {
  color: #999;
}

.store-preference-input {
  width: 60px;
  height: 24px;
  /deep/ .el-input__inner {
    height: 24px;
    line-height: 24px;
    padding: 0 4px;
    text-align: right;
  }
}
.red {
  color: #f52d56;
}

.selected-card {
  display: flex;
  flex-wrap: nowrap;
  .over-flow-box {
    display: block;
    max-width: 200px;
    @include over-flow;
  }
}
</style>
