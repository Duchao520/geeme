<template>
  <div>
    <el-table 
      stripe
      :data="tableData"
      height="calc(100vh - 310px)"
    >
      <!-- 310 - 405 -->
      <el-table-column label="产品编号" prop="stockProductNo"></el-table-column>
      <el-table-column label="产品名称" prop="stockProductName"></el-table-column>
      <!-- 产品规格没有  到产品级 -->
      <!-- <el-table-column label="规格名称" prop="specificationName"></el-table-column> -->
      <el-table-column label="订货单数" prop="invoiceNum"></el-table-column>
      <el-table-column label="订货数量" prop="approvalNum"></el-table-column>
      <el-table-column label="订单总金额" prop="invoiceTotalMoney"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <g-button
            :name="'销售明细'"
            type="detail"
            :icon="'icon_operate_eyes'"
            @click="handleDetail(row)"
          ></g-button>
        </template>
      </el-table-column>
    </el-table>
    <goodsSellDialog 
      v-bind="$attrs" 
      v-if="detailVisible" 
      :superParams="params"
      :dialogVisible="detailVisible" 
      @close="detailVisible = false"
    />
  </div>
</template>

<script>
import * as axios from '@/util/axios';
import { mapState, mapActions } from "vuex";
import goodsSellDialog from '../dialog/goodsSellDialog'
export default {
  props: {
    tableData: {
      type: Array
    },
  },
  data() {
    return {
      detailVisible: false,
      params: {},
    }
  },
  methods: {
    handleDetail(row) {
      this.params = { stockProductId: row.stockProductId, goodsName: row.stockProductName }
      this.detailVisible = true
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },  
  components: { goodsSellDialog }
}
</script>

<style lang="scss" scoped>

</style>