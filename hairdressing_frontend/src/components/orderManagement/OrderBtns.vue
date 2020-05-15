<template>
  <div class="root">
    <g-button
      type="open-bill"
      name="发货"
      icon="icon_ope_publish"
      @click="$emit('deliver-goods')"
      v-if="!detail.selfPickUp && status==='WAITING_DELIVER'"
    ></g-button>
    <g-button
      @click="$emit('changePrice',detail.id)"
      type="remark"
      name="改价"
      icon="icon_operate_edit"
      v-if="(detail.online || detail.channel) && status === 'WAITING_PAY' && !detail.wholesale"
    ></g-button>
    <g-button
      @click="$emit('remark',detail.id)"
      type="remark"
      name="备注"
      icon="icon_operate_edit"
      v-if="remarkShow&&checkHasBtnPermission(buttonRemark.remark)"
    ></g-button>
    <g-button
      @click="$emit('readComment',detail.id)"
      name="查看评价"
      type="greenFill"
      v-if="status==='COMPLETED'&&checkHasBtnPermission(buttonRemark.lookUpEvaluate)"
    ></g-button>
    <g-button
      @click="$emit('delete_',detail.id)"
      v-if="status==='CLOSED'&&checkHasBtnPermission(buttonRemark.deleteOrder)"
      type="delete"
      name="删除"
      icon="icon_operate_delete"
    ></g-button>
    <g-button
      @click="$emit('refuseRefund')"
      type="mgreenFill"
      name="拒绝退款"
      v-if="(status==='REFUNDING_OR_AFTER_SALES' || status==='REFUNDING')&&checkHasBtnPermission(buttonRemark.refuseRefund)"
    ></g-button>
    <g-button
      @click="$emit('refund',detail)"
      type="orange-yellow"
      name="退款"
      v-if="(status==='REFUNDING_OR_AFTER_SALES' || status==='REFUNDING')&&checkHasBtnPermission(buttonRemark.agreeRefund)"
    ></g-button>
    <g-button
      @click="$emit('afterSale',detail.id)"
      type="orange-yellow"
      name="售后处理"
      v-if="status==='AFTER_SALES_RIGHT'&&checkHasBtnPermission(buttonRemark.afterSaleHandle)"
    ></g-button>
    <!-- 垫付退款属于供应市场的一部分，这一期先不做 -->
    <!-- <g-button @click="$emit('afterSale')" type="orange-yellow" name="垫付退款" v-if="status==='pfsAndRefund'"></g-button> -->
  </div>
</template>
<script>
import { formatArrayToObjOrFlatArray } from "@/util/index";
import * as axios from "@/util/axios";
export default {
  name: "OrderBtns",
  props: {
    detail: Object,
    environment: String
  },
  computed: {
    remarkShow() {
      return (
        this.status === "WAITING_PAY" ||
        this.status === "WAITING_SERVICE" ||
        this.status === "WAITING_ASSESSMENT" ||
        this.status === "COMPLETED" ||
        this.status === "WAITING_DELIVER" ||
        this.status === "GROUP_BUY_WAIT" ||
        this.status === "WAITING_CONFIRM"
      );
    },
    status() {
      return this.detail.orderStatus || this.detail.productOrderStatus;
    },
    buttonRemark() {
      switch (this.environment) {
        case "service":
          return {
            remark: "shop_order_service_notes",
            invite: "shop_order_service_inviteNotes",
            lookUpEvaluate: "shop_order_service_evaluateDetails",
            deleteOrder: "shop_order_service_delBill",
            agreeRefund:"shop_order_service_agreeRefund",
            refuseRefund:"shop_order_service_rejectRefund",
            withdrawRefuseRefund:"shop_order_service_repealRejectRefund"
          };
          break;
        case "product":
          return {
            remark: "shop_order_product_notes",
            invite: "shop_order_product_inviteNotes",
            lookUpEvaluate: "shop_order_product_evaluateDetails",
            deleteOrder: "shop_order_product_delBill",
            agreeRefund:"shop_order_product_agreeRefund",
            refuseRefund:"shop_order_product_rejectRefund",
            withdrawRefuseRefund:"shop_order_product_repealRejectRefund",
            afterSaleHandle:"shop_order_product_afterSale"
          };
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.root {
  .btn {
    margin-bottom: 0;
  }
}
</style>

