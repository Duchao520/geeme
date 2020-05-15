<template>
  <div class="service-in-list">
    <div class="top-info">
      <div class="left-box">
        <!-- <img :src="utils.formatPicImg(detail.image)"> -->
        <div class="left-main">
          <p class="item-name" :title="detail.cardName">
            <span class="card-name-box">{{detail.cardName}}</span>
            <span 
              class="card-tags"
              :class="{
                'add-card': detail.operateType === 1,
                'open-card': detail.operateType !== 1,
              }"
            >
              {{detail.operateType | operateTypeFilter}}
            </span>
            <span
              v-if="detail.upgradeCardKindId"
              class="card-tags is-upgrade"
            >
              升级
            </span>
            <!-- <span style="margin-left: 10px;" class="light-font" :title="detail.specificationName">{{detail.specificationName === '默认' ? '' : detail.specificationName}}</span> -->
          </p>
          <p class="item-server light-font">
            <span>销售: </span>
            <span v-if="detail.assistantOrSalers && detail.assistantOrSalers.length">{{(detail.assistantOrSalers || []).map(i => i.staffName).join('/')}}</span>
          </p>
          <p class="item-remark" @click="toEditRemark">
            <span class="light-font">备注: </span>
            <span>
              <span :title="detail.remarks" class="light-font">
                {{detail.remarks}}
              </span>
              <i class="icon iconfont icon-icon_open_on like-link"></i>
            </span>
          </p>
        </div>
      </div>
      <div class="right-box">
        <p class="shop-price" :title="detail.chargeMoney">￥{{(detail.chargeMoney).toFixed(2)}}</p>
        <p class="item-count light-font"></p>
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

    <div class="residue-or-receive">
      <span>应收款: </span>
      <span class="money red">
        ￥
        <dynamic-num :number="Number((detail.tempFinalPrice || 0).toFixed(2))"/>
      </span>
    </div>
    <div class="order-origin">
      <span>{{ detail.goodsOrderId ? '线上订单' : '门店开单' }}</span>
      <span> | </span>
      <span>{{ detail.paymentStatus ? '已支付' : '未支付' }}</span>
    </div>

    <!-- 对话框 -->
    <storeRemarkDialog
      v-if="showRemarkDialog"
      :visible="showRemarkDialog" 
      :remark="this.remarks"
      @close="showRemarkDialog = false"
      @edit="handleEditRemark"
    />

  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";

import storeRemarkDialog from './storeRemarkDialog.vue';
export default {
  props: {
    detail: {
      type: Object,
      require: true,
    },
    index: { // 包含deleted的下标
      type: Number,
      required: true
    },
  },
  data() {
    return {
      utils,
      storePreference: null, 
      remarks: '',
      showRemarkDialog: false, // 备注对话框

      firstLoad: true, // 阻止监听多次触发, 覆盖正常操作问题, 仅监听初始化的一次
    }
  },
  mounted() {
    this.remarks = this.detail.remarks
    this.storePreference = this.detail.storePreference
  },
  methods: {
    ...mapActions([
      'setSelectedCardsValue',
    ]),
    // 门店优惠价修改
    handleStorePreferenceChanged(val) {
      if (val) {
        if (/^[0-9]+(\.[0-9]{0,2})?$/.test(val) && Number(val) <= this.detail.chargeMoney) {
          this.detail.storePreference = Number(val)
          this.setSelectedCardsValue({index: this.index, storePreference: Number(val)})
        } else {
          this.storePreference = this.detail.storePreference
        }
      } else {
        this.detail.storePreference = null
        this.setSelectedCardsValue({index: this.index, storePreference: null})
      }

    },
    // 编辑备注 1
    toEditRemark() {
      this.showRemarkDialog = true
    },
    // 编辑备注 2
    handleEditRemark(text) {
      this.remarks = text
      this.detail.remarks = text
      this.setSelectedCardsValue({index: this.index, remarks: text})
      this.showRemarkDialog = false
    },
  },
  watch: {
    'detail.storePreference': {
      handler: function(v, o) {
        this.detail.tempFinalPrice = Number((this.detail.chargeMoney - v).toFixed(2))
        this.setSelectedCardsValue({index: this.index, tempFinalPrice: this.detail.tempFinalPrice})
        this.$emit('rootStorePreferenceChanged') 
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo,
    }),
    key() {
      return `${this.detail.goodsType}_${this.detail.specificationId}`;
    },
  },
  filters: {
    operateTypeFilter(type) {
      let map = {
        0: '开卡',
        2: '开卡', // 也叫这个
        1: '续卡',
        // 2: '自由开卡',
      }
      return map[type]
    },
  },
  components: { storeRemarkDialog }
}
</script>
<style lang='scss' scoped>
@mixin over-flow() {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.service-in-list {
  border-bottom: 1px dotted #efefef;
  padding: 4px 0;
}
.top-info {
  display: flex;
  flex-wrap: nowrap;
  // img { width: 60px; height: 60px; object-fit: cover; object-position: center center; border-radius: 3px; }
  .left-box {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
  }
  .left-main {
    flex: 1;
    // margin: 0 4px;
    // max-width: 156px;
    // max-width: 220px;
    max-width: 310px;
    .card-name-box {
      display: inline-block;
      // max-width: 130px;
      max-width: 210px;
      @include over-flow;
    }
    p {
      // @include over-flow;
    }
  }
  .right-box {
    max-width: 80px;
    min-width: 40px;
    text-align: right;
    p { @include over-flow; }
  }
}

.item-remark {
  cursor: pointer;
}
.icon-icon_open_on { font-size: 12px; }

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

.light-font { color: #999; }

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
  color: #F52D56;
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

/* 开卡、自由卡、续卡升级 */
.card-tags {
  height: 17px;
  width: 38px;
  text-align: center;
  box-sizing: border-box;
  line-height: 17px;
  font-size: 12px;
  border: 1px solid transparent;
  border-radius: 3px;
  margin-left: 5px;
  padding: 0 4px;
  text-align: center;
}
/* 开卡 */
.open-card {
  border-color: #f52d56;
  background: rgba(245, 45, 86, .1);
  color: #f52d56;
}
/* 续卡 */
.add-card {
  border-color: rgba(88, 201, 243, 1);
  background: rgba(88, 201, 243, 0.1);
  color: rgba(88, 201, 243, 1);
}
/* 续卡 */
.is-upgrade {
  border-color: rgba(117, 199, 79, 1);
  background: rgba(117, 199, 79, 0.1);
  color: rgba(117, 199, 79, 1);
}
</style>
