<template>
  <div class="stock-in-out" v-loading="pageLoading">
    <simpleFilter @handleFilterChange="handleFilterChange" currentType="stockIO"/>
    <div class="table-main">
      <div class="table-box">
        <stockList  :tableData="tableData" @setRow="handleDetail"/>
        <div class="page-line">
          <div>
            <stockIO2Excel :params="params"/>
          </div>
          <el-pagination
            style="margin: 5px 20px 5px 0;"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <enterOrderDialog
      v-if="orderDetailVisible"
      :dialogVisible="orderDetailVisible"
      @close="orderDetailVisible = false"
      :detail="currentSignRow"
      :superInfo="orderInfo"
    />
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import simpleFilter from '../filters/simpleFilter'
import stockList from '../tables/stockList'
import enterOrderDialog from '../../enterOrderDialog'

import stockIO2Excel from '../export/stockIO2Excel'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageLoading: false, 
      tableData: [],
      // 详情相关
      orderInfo: {}, 
      currentSignRow: {}, 
      orderDetailVisible: false,
      // 
      params: {
        searchKey: null,
        storeId: null,
        productBrandId: null,
        productLevelOne: null,
        productLevelTwo: null,
        endDay: null,
        startDay: null,
      },
    }
  },
  created() {
    // this.init()
  },
  methods: {
    async init() {
      this.pageLoading = true
      let url = '/getProductStockSubOrderInOutList'
      let params = {
        ...this.params,
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : this.params.storeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        stockOrderNo: this.params.searchKey
      }
      let res = await axios.post(url, params)
      if (res.success) {
        this.tableData = res.listStockSubOrderInfo || []
        this.total = res.total
      } else {
        this.tableData = []
        this.total = 0
      }
      this.pageLoading = false
    },
    handleFilterChange(data) {
      this.params = data
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.init()
    },
    // 详情
    handleDetail(row) {
      this.orderInfo = {
        status: '1',
        routeType: row.operateType ? '出' : '入', // 操作类型：0-入库, 1-出库(仅查询有效)
      }
      this.currentSignRow = row
      this.orderDetailVisible = true
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  components: { simpleFilter, stockList, enterOrderDialog, stockIO2Excel }
}
</script>

<style lang='scss' scoped>
.stock-in-out {
  height: calc(100vh - 140px);
}

.table-main {
  margin: 20px 20px 0 20px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
  .psp li {
    list-style: disc;
    list-style-position: inside;
  }
}
.page-line {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .foot-btn {
    padding: 8px 18px;
  }
}
</style>
