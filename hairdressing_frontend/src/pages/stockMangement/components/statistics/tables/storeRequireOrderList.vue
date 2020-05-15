<template>
<div>
  <el-table 
    stripe
    :data="tableData"
    height="calc(100vh - 310px)"
  >
  <!-- 405  310 -->
    <el-table-column label="门店名称" prop="storeName"></el-table-column>
    <el-table-column label="订货单数" prop="invoiceNum"></el-table-column>
    <el-table-column label="订单金额" prop="invoiceTotalMoney"></el-table-column>
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
  <storeRequireOrderDialog
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
import storeRequireOrderDialog from '../dialog/storeRequireOrderDialog'
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
      this.params = { askStoreId: row.storeId, storeName: row.storeName }
      this.detailVisible = true
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },  
  components: { storeRequireOrderDialog }
}
</script>

<style lang="scss" scoped>

</style>