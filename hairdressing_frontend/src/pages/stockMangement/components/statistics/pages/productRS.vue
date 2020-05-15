<template>
  <div class="product-receive-send" v-loading="pageLoading">
    <simpleFilter @handleFilterChange="handleFilterChange" @resetTableData="handleResetTable" currentType="productRS"/>
    <div class="table-main">
      <div class="table-box">
        <productRsList :tableData="tableData"/>
        <div class="page-line">
          <div>
            <productRs2Excel :params="params"/>
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
import productRsList from '../tables/productRsList'

import productRs2Excel from '../export/productRs2Excel'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageLoading: false, 
      tableData: [],
      
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
      let url = '/getProductStockStatistics'
      let params = {
        ...this.params,
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : this.params.storeId,
        pageNum: this.pageNum - 1, // 这个接口页码要0开始
        pageSize: this.pageSize,
      }
      let res = await axios.post(url, params)
      if (res.success) {
        this.tableData = res.listProductStockStatistics || []
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
    // 满足重算筛选条件， 触发按钮事件
    handleResetTable(date) {
      this.pageLoading = true
      let data = {
        countDate: date,
        brandId: this.currentInfo.brandId,
        storeId: this.currentEntry === 'shop' ? this.currentInfo.shopId : null, // 品牌时不管筛选门店，全改
      }
      axios.post('/recalculateStockOrderStatistics', data).then(res => {
        if (res.success) {
          this.$message.success('重算完成,真正为您刷新数据')
          // this.init() // 这里页面没更新到1, 看需求!!! 
          this.handleCurrentChange(1) // 如果要更新页面调用 !!!
        } else {
          this.$message.error(res.message)
          this.pageLoading = false
        }
      }).catch(err => {
        this.pageLoading = false
      })
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  components: { simpleFilter, productRsList, productRs2Excel }
}
</script>

<style lang='scss' scoped>
.product-receive-send {
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
