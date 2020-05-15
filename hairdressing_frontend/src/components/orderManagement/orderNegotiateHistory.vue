<template>
  <div class="negotiate-history">
    <h3>协商记录</h3>
    <div class="negotiate-item" v-for="(item, index) in negotiateList" :key="index">
      <div class="head-portrait-box">
        <img 
          class="head-portrait" 
          :src="utils.formatPicImage(item.headPortrait, 'style', 40, 'someone')"
        />
      </div>
      <div class="item-content-box">
        <!-- 以下代码没有处理完 ， 需要加入各种状态来处理数据交缠 -->
        <!-- 状态-通用 -->
        <div class="step-title">{{item.phaseName|stepFilter}}</div>
        <!-- 退款原因-客户 -->
        <div class="refund-reason" v-if="item.sendMan === 'CUSTOMER'">
          <span>原因: </span>
          <span class="line-info">{{item.refundReason}};</span>
          <span>金额：</span>
          <span class="line-info">{{item.moneyApply}}元</span>
        </div>
        <!-- 拒绝理由-店家 -->
        <div class="reject-reason" v-if="item.sendMan === 'SALER'">
          <span>理由: </span>
          <span class="line-info">{{item.rejectReason}}</span>
        </div>
        <!-- 退款成功-店家 -->
        <div class="success-refund" v-if="item.sendMan === 'SALER'">
          <span>退款金额: </span>
          <span class="line-info">{{item.moneyApprove}}元</span>
        </div>
        <!-- 留言 -->
        <div class="step-note">
          <span>留言: </span>
          <span class="line-info">{{item.note}}</span>
        </div>
        <!-- 图片资料 -->
        <div class="step-images" v-if="item.images && item.images.length">
          <img
            v-for="(i, idx) in item.images" 
            :key="idx" 
            :preview="item.images" 
            :preview-text="''" 
            :src="utils.formatPicImg(i,'style', 146)" 
            style="object-fit: cover; object-position: center center;"
            class="step-image"
          >
        </div>
        <div class="create-time">
          {{item.createTime}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
export default {
  props: {
    negotiateList: {
      type: Array,
    }
  },
  data() {
    return {
      utils,
    }
  },
  computed: {
    
  },
  filters: {
    stepFilter(name) {
      let map = {
        REFUND_APPLY: '客户提交退款申请',
        REFUND_HANDLING: '退款申请受理中, 等待商家审核',
        REFUND_REJECT: '退款申请已被商家拒绝',
        REFUND_MODIFY: '客户修改退款申请',
        REFUND_SUCCESS: '商家已同意退款申请, 退款完成',
        REFUND_CANCEL: '客户取消退款申请',

        AFTER_SALE_APPLY: '客户提交售后申请',
        AFTER_SALE_HANDLING: '售后申请受理中, 等待商家审核',
        AFTER_SALE_REJECT: '售后申请已被商家拒绝',
        AFTER_SALE_MODIFY: '客户修改售后申请',
        AFTER_SALE_SUCCESS: '售后申请已通过, 售后完成',
        AFTER_SALE_CANCEL: '客户取消售后申请',

        OTHERS: '其他(补充留言)'
      }
      return map[name]
    }
  }
}
</script>
<style lang='scss' scoped>
h3 {
  font-size: 14px;
}
.negotiate-item {
  margin: 12px 0;
  border: 1px solid rgba(235, 236, 240, 1);
  padding: 10px 15px 10px 20px;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  color: #111;
  .create-time {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #777;
  }
  .head-portrait-box {
    width: 40px;
    .head-portrait {
      height: 40px;
      object-fit: cover;
      object-position: center center;
      border-radius: 50%;
    }
  }
  .item-content-box {
    flex: 1;
    margin-left: 12px;
    & > div { 
      margin-bottom: 4px;
      word-wrap: break-word;
    }
    .line-info {
      color: #777;
    }
    .step-image {
      width: 48px;
      height: 48px;
      margin-right: 12px;
      box-shadow: 1px 1px 1px 1px #333;
      cursor: pointer;
    }
  }
}
</style>
