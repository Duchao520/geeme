<template>
  <div class="goods-sell" v-loading="pageLoading">
    <specialFilter @filterTime="handleGetFilter" currentType="goodsSell"/>
    <!-- <totalTipList :superData="suberTotalList"/> -->
    <div class="table-main">
      <div class="table-box">
        <goodsSellList :tableData="tableData" :forDialog="forDialog"/>
        <div class="page-line">
          <div>
            <goodsSell2Excel :params="params"/>
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
  </div>
</template>

<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
import specialFilter from '../filters/specialFilter'
import totalTipList from '../filters/totalTipList'
import goodsSellList from '../tables/goodsSellList'

import goodsSell2Excel from '../export/goodsSell2Excel'
export default {
  data() {
    return {
      // 本页自己的数据
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageLoading: false, 

      // 子组件用的数据(渲染)
      tableData: [],
      suberTotalList: [
        {name: '订货单', num: '-'}, // invoiceNum
        {name: '订货客户数', num: '-'}, // invoiceCustomerNum
        {name: '订货金额', num: '-'}, // invoiceTotalMoney
      ], // 按后端做的渲染统计 - 防止未请求时的空渲染
      forDialog: 1, // 1,2,3,4, [start, end]
      // 请求参数-来自子组件发送
      params: {
        endDay: null,
        startDay: null,
      },
    }
  },
  methods: {
    init() {
      // this.getTotalData() // 统计小条 暂时没接口 // 所以表格高度 + 95
      this.handleCurrentChange(1)
    },
    handleGetFilter(obj) {
      this.forDialog = obj.forDialog
      delete obj.forDialog
      this.params = obj
      this.init()
    },
    // 统计数据 - 给子组件的
    /* async getTotalData() {
      let res = await axios.post('/', {
        ...this.params,
        brandId: this.currentInfo.brandId,
      })
      this.suberTotalList[0].num = res.invoiceNum || 0
      this.suberTotalList[1].num = res.invoiceCustomerNum || 0
      this.suberTotalList[2].num = res.invoiceTotalMoney || 0
    }, */
    // 表格数据 - 给子组件的
    async getTableData() {
      this.pageLoading = true
      let res = await axios.post('/getProductInvoiceStatistics', {
        ...this.params,
        brandId: this.currentInfo.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
      this.tableData = res.listInvoiceStatisticsProduct || []
      this.total = res.total || 0
      this.pageLoading = false
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getTableData()
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  components: { specialFilter, totalTipList, goodsSellList, goodsSell2Excel }
}
</script>

<style lang='scss' scoped>
.goods-sell {
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