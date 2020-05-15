<template>
  <div>
    <el-table
      stripe
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
      height="calc(100vh - 453px)"
    >
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
      <el-table-column prop="createTime" label="时间" width="100px"></el-table-column>
      <el-table-column prop="customerName" label="客户"> 
        <template slot-scope="{row}">
          <p>
            <span 
              class="table-customer_name"
              :class="row.sex === '男' ? 'male' : row.sex === '女' ? 'female' : ''"
            >
              {{row.customerName}}
            </span>
          </p>
          <p>{{row.customerMobile}}</p>
          <p><span class="table-customer_level">{{row.levelName}}</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="消费产品/卡项/服务">
        <template slot-scope="{row}">
          <p>{{row.orderName}}</p>
          <p style="color: #999;">{{row.revenueName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="received" label="实收金额(￥)"></el-table-column>
      <el-table-column prop="payType" label="支付方式"></el-table-column>
      <el-table-column prop="cashIncome" label="入账现金(￥)"></el-table-column>
    </el-table>
    <div class="page-line">
      <el-pagination
        style="margin: 5px 20px 5px 0;"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
export default {
  props: {
    filterData: {
      type: Object
    }
  },
  data() {
    return {
      pageLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    }
  },
  created(){},
  methods: {
    init() {
      if (this.filterData.consumerType === undefined) { return } // 第一次初始化的时候,可能没有
      // 加区分品牌和门店端
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!shopId) { return }
      let data = {
        ...this.filterData, 
        storeId: shopId, 
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.pageLoading = true
      axios.post('/getStoreRevenueInfoList', data).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.storeRevenueInfoResponseList
          this.total = res.total
        } else {
          this.total = 0
          this.tableData = []
          this.$message({ type: 'error', message: res.message })
        }
      }).catch(err => {
        this.total = 0
        this.tableData = []
        this.pageLoading = false
      })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.init()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  watch: {
    filterData: {
      handler: function(v, o) {
        if (v) {
          this.currentPage = 1
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang='scss' scoped>
  .page-line {
    height: 65px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .table-customer_name {
    background: no-repeat right center;
    background-size: 15px 15px;
    padding-right: 20px;

    &.male {
      background-image: url('../../../../../assets/img/male_tip.png');
    }

    &.female {
      background-image: url('../../../../../assets/img/female_tip.png');
    }
  }

  .table-customer_level {
    padding: 2px 5px;
    border-radius: 10px;
    background-color: #9da8cc;
    color: #fff;
    font-size: 10px;
  }
</style>
