<template>
  <div class="order-goods" v-loading="pageLoading">
    <simpleFilter @handleFilterChange="handleFilterChange" currentType="orderGoods" placeholder="搜索产品名称"/>
    <div class="table-main">
      <div class="table-box">
        <orderGoodsList  :tableData="tableData"/>
        <div class="page-line">
          <div>
            <orderGoods2Excel :params="params"/>
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
import simpleFilter from '../filters/simpleFilter'
import orderGoodsList from '../tables/orderGoodsList'

import orderGoods2Excel from '../export/orderGoods2Excel'
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
      // 
      params: {
        endDay: null,
        storeId: null,
        startDay: null,
        searchKey: null,
        productBrandId: null,
        productLevelOne: null,
        productLevelTwo: null,
      },
    }
  },
  created() {
    // this.init()
  },
  methods: {
    async init() {
      this.pageLoading = true
      let url = this.currentEntry === 'shop' ? '/getStoreSubProductInvoiceList' : '/getSubProductInvoiceList'
      let params = {
        ...this.params,
        brandId: this.currentInfo.brandId,
        toStoreId: this.currentEntry === 'shop' ? this.currentInfo.shopId : this.params.storeId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        // searchKey: this.params.searchKey
        beginTime: this.params.startDay,
        endTime: this.params.endDay,
      }
      let res = await axios.post(url, params)
      if (res.success) {
        this.tableData = res.listProductInvoiceSubListInfo || []
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

  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  components: { simpleFilter, orderGoodsList, orderGoods2Excel }
}
</script>

<style lang='scss' scoped>
.order-goods {
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
