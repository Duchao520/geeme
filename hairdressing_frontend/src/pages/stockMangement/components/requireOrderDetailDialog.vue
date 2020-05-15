<template>
  <el-dialog
    width="900px"
    title="订货单详情"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="form" 
      :model="form" 
      label-width="110px"
    >
      <!-- 出入库时间 -->
      <el-form-item label="订货时间:" style="margin-bottom: 0;">
        <span>
          {{form.askTime}}
        </span>
        <span :class="[`tags order-status-${form.orderStatus}`]">
          {{form.orderStatus | orderStatusFilter}}
        </span>
      </el-form-item>
      <!-- 订货单号 -->
      <el-form-item label="订货单号:" style="margin-bottom: 0;">
        {{form.productInvoiceNo}}
      </el-form-item>
      <!-- 订货门店 -->
      <el-form-item label="订货门店" style="margin-bottom: 0;">
        {{form.toStoreName}}
      </el-form-item>
      <!-- 订货人 -->
      <el-form-item label="订货人" style="margin-bottom: 0;">
        {{form.askUserName}}
      </el-form-item>
      <el-form-item 
        label="订单产品"
      >
        <el-table
          stripe
          :height="form.listProductInvoiceSubInfo.length > 10 ? '770px' : ''"
          :data="form.listProductInvoiceSubInfo"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
          <el-table-column label="规格名称" show-overflow-tooltip prop="specificationName"></el-table-column>
          <el-table-column label="订货数量" prop="askNum"></el-table-column>
          <el-table-column label="审核数量" prop="approvalNum"></el-table-column>
          <el-table-column label="订货时供货价" prop="supplyPrice"></el-table-column>
          <el-table-column label="审核后供货价" prop="approvalPrice"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button plain class="plain_gray_btn" @click="handleClose">关 闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detailInfo: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      form: {},
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.detailInfo))
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  filters: {
    orderStatusFilter(type) {
      let map = {
        1: '待审核',
        2: '待支付',
        3: '待发货',
        4: '待收货',
        5: '已完成'
      }
      return map[type]
    },
  },
}
</script>
<style lang='scss' scoped>
/*
  1: '待审核',
  2: '待支付',
  3: '待发货',
  4: '待收货',
  5: '已完成'
*/
.tags {
  padding: 2px 7px;
  font-size: 12px;
  border-radius: 10px;
  color: #ffffff;
  background: #707070;
  &.order-status-3, &.order-status-4 {
    background: #58C9F3;
  }
  &.order-status-1 {
    background: #FCB322;
  }
  &.order-status-2 {
    background: #E22C37;
  }
  &.order-status-5 {
    background: #A9D86E;
  }
}
</style>
