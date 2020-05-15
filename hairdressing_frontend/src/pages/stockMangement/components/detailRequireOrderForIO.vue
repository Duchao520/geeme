<template>
  <div>
    <el-dialog
      width="900px"
      :title="`${operateTypeName}库单详情`"
      :visible="dialogVisible"
      :before-close="handleClose"
    >
      <el-form 
        :model="detailInfo" 
        label-width="110px"
      >
        <!-- 出入库时间 -->
        <el-form-item :label="`${operateTypeName}库时间:`" prop="storageTime" style="margin-bottom: 0;">
          {{detailInfo.storageTime}}
        </el-form-item>
        <!-- 订货单号 -->
        <el-form-item label="订货单号:" style="margin-bottom: 0;">
          {{detailInfo.productInvoiceNo}}
        </el-form-item>
        <!-- 出入库单号 -->
        <el-form-item :label="`${operateType? '出' : '入'}库单号:`" style="margin-bottom: 0;">
          {{detailInfo.stockOrderNo}}
        </el-form-item>
        <!-- 出入库类型 -->
        <el-form-item :label="`${operateTypeName}库类型:`" style="margin-bottom: 0;">
          门店订货单{{operateTypeName}}库
        </el-form-item>
        <el-form-item v-if="detailInfo.reason" label="门店订货原因:" style="margin-bottom: 0;">
          {{detailInfo.reason}}
        </el-form-item>
        <el-form-item v-if="detailInfo.remarks" label="品牌审核备注:" style="margin-bottom: 0;">
          {{detailInfo.remarks}}
        </el-form-item>
        <!-- 出入库经办人 -->
        <el-form-item label="经办人:" prop="dealUserId" style="margin-bottom: 0;">
          {{detailInfo.dealUserName}}
        </el-form-item>
        <el-form-item label="审核人:" prop="dealUserId" style="margin-bottom: 0;">
          {{detailInfo.checkUserName}}
        </el-form-item>
        <el-form-item 
          :label="`${operateTypeName}库产品:`"
        >
          <el-table
            stripe
            :height="detailInfo.listStockSubOrder.length > 10 ? '770px' : ''"
            :data="detailInfo.listStockSubOrder"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="stockProductName"></el-table-column>
            <el-table-column label="规格名称" show-overflow-tooltip prop="specificationName"></el-table-column>
            <el-table-column label="数量" prop="num"></el-table-column>
            <el-table-column label="审核数量" prop="signNum"></el-table-column>
            <!-- 进出货价 -->
            <el-table-column :label="`${currentEntry === 'shop' ? '进货价' : '供货价'}`" prop="buyingPrice"></el-table-column>
            <!-- 门店端不显示品牌出货成本价 -->
            <el-table-column label="成本价" v-if="currentEntry === 'brand' || operateType === 0" prop="costPrice"></el-table-column>
            <el-table-column label="需要条形码" prop="needCheck">
              <template slot-scope="{row}">
                <el-checkbox 
                  disabled
                  :true-label="1"
                  :false-label="0"
                  v-model="row.needCheck"
                >{{row.needCheck ? '是' : '否'}}</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button plain class="plain_gray_btn" @click="handleClose">关 闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from '@/util/axios';
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
    operateType: { // 0-入库, 1-出库
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
    }
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
    operateTypeName() {
      return this.operateType ? '出' : '入'
    }
  },
}
</script>
<style lang='scss' scoped>

</style>
