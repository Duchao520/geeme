<template>
  <div class="main-info-left">
    <!-- 订单信息 -->
    <div class="info-box order-basic-info">
      <h3>订单信息</h3>
      <p>
        <span>订货时间:</span>
        <span>{{info.askTime}}</span>
      </p>
      <p>
        <span>订货单号:</span>
        <span>{{info.productInvoiceNo}}</span>
      </p>
      <p>
        <span>订货门店:</span>
        <span>{{info.toStoreName}}</span>
      </p>
      <p>
        <span>订货人:</span>
        <span>{{info.askUserName}}</span>
      </p>
      <p v-if="info.deleted">
        <span>关闭时间:</span>
        <span>{{info.deleteTime}}</span>
      </p>
      <p v-if="info.deleted">
        <span>操作人:</span>
        <span>{{info.deleteUserName}}</span>
      </p>
    </div>
    <!-- 备注信息 -->
    <div class="info-box order-remarks-info">
      <h3>备注信息</h3>
      <p>
        <span>订货说明:</span>
        <span :title="info.reason">{{info.reason}}</span>
      </p>
      <p>
        <span>审核备注:</span>
        <span :title="info.remarks">{{info.remarks}}</span>
      </p>
      <p class="deal-time" v-if="info.dealTime">
        <span>审核时间:</span>
        <span>{{info.dealTime}}</span>
      </p>
    </div>
    <!-- 收货人信息 -->
    <!-- 门店端待支付前可以修改收货地址, 后端暂时不支持 -->
    <div class="info-box consignee-info">
      <h3>收货信息</h3>
      <p>
        <span>收货人:</span>
        <span>{{info.receiverName}}</span>
      </p>
      <p>
        <span>手机号:</span>
        <span>{{info.receiverPhone}}</span>
      </p>
      <p>
        <span>收货地址:</span>
        <span :title="info.receiverAddress">{{info.receiverAddress}}</span>
      </p>
    </div>

    <!-- 以上3个是订货单创建后就有的 -->

    <!-- 物流信息 -->
    <div class="info-box logistics-info" v-if="info.newOrderStatus > 7">
      <h3>物流信息</h3>
      <p>
        <span>发货时间:</span>
        <span>{{info.logisticsSendTime}}</span>
      </p>
      <p>
        <span>物流公司:</span>
        <span :title="info.logisticsCompany">{{info.logisticsCompany}}</span>
      </p>
      <p>
        <span>物流单号:</span>
        <span :title="info.logisticsNo">{{info.logisticsNo}}</span>
      </p>
      <p v-if="info.logisticsBill">
        <span>物流单据:</span>
        <br>
        <span>
          <img
            :src="utils.formatPicImg(info.logisticsBill)" 
            class="image"
            preview="1" 
            preview-text=""
          />
        </span>
      </p>
    </div>
    <!-- 签收人信息 -->
    <div class="info-box signer-info" v-if="info.newOrderStatus === 11">
      <h3>签收信息</h3>
      <p>
        <span>签收时间:</span>
        <span>{{info.logisticsSignTime}}</span>
      </p>
      <p>
        <span>签收人:</span>
        <span>{{info.logisticsSigner}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      utils,
    }
  },
  methods: {

  },
  computed: {},
  watch: {
    'info.logisticsBill': {
      handler: function(v, o) {
        this.$previewRefresh() // 解决图片放大功能可能失效
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.info-box {
  padding: 12px 5px 16px;
  overflow: hidden;
}
.info-box + .info-box {
  border-top: 1px dashed #f0f1f4;
}
h3 {
  color: #333333;
  font-size: 14px;
  line-height: 40px;
}
p {
  line-height: 28px;
}
.image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  object-position: center center;
}
</style>
