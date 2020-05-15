<template>
  <div class="income-box">
    <el-table
      :data="tableData"
      height="calc(100vh - 389px)"
      stripe
      style="width: 100%; padding: 0 10px;"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column label="门店">
        <template slot-scope="{ row }">
          <p>{{ `${row.city} ${row.storeName}` }}</p>
        </template>
      </el-table-column>
      
      <el-table-column label="累计申请转入钱包金额">
        <template slot-scope="scope">
          <p>￥{{ scope.row.applyWalletOut ? scope.row.applyWalletOut.toFixed(2) : '0.00'}}</p>
        </template>
      </el-table-column>
      
      <el-table-column label="待处理金额">
        <template slot-scope="scope">
          <p>￥{{ scope.row.waitingDealAmount ? scope.row.waitingDealAmount.toFixed(2) : '0.00'}}</p>
        </template>
      </el-table-column>
      
      <el-table-column label="已结算金额">
        <template slot-scope="scope">
          <p>￥{{ scope.row.walletBilledMoney ? scope.row.walletBilledMoney.toFixed(2) : '0.00'}}</p>
        </template>
      </el-table-column>
      
      <el-table-column label="待结算金额">
        <template slot-scope="scope">
          <p>￥{{ scope.row.waitingBillAmount ? scope.row.waitingBillAmount.toFixed(2) : '0.00'}}</p>
        </template>
      </el-table-column>
      
    </el-table>
    <!-- 分页区域 -->
    <div class="pagination">
      <div></div>
      <div>
        <el-pagination
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
</template>

<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
export default {
  props: {
    filterData: {
      type: Object,
      default: () => {}
    },
    keyword: {
      type: String
    }
  },
  watch: {
  },
  filters: {
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      total: null,
      tableData: [],
      pageLoading: false,
      pageNum: 1,
      pageSize: 10
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    isBrand() {
      return this.currentEntry == "brand";
    }
  },
  mounted() {
    // this.getIncomeRecord();
  },
  methods: {
    // 各子组件方法名称统一， 节约代码
    async getIncomeRecord() {
      // 获取数据
      this.pageLoading = true;
      try {
        const res = await axios.post("/getPreMoneyBillInfoList", {
          brandId: this.currentInfo.brandId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          // storeId: this.isBrand ? this.filterData.storeId : this.currentInfo.shopId,
          dateFrom: this.filterData.timeFrom || null,
          dateTo: this.filterData.timeTo || null,
          storeName: this.filterData.keyWord || null
        });
        this.tableData = res.storeBillInfoList;
        this.total = res.total;
      } finally {
        this.pageLoading = false;
      }
    },
    // 分页切换事件
    handleCurrentChange(index) {
      this.pageNum = index;
      this.getIncomeRecord();
    },
    // 查看进度事件
    async handleClick(id) {
      console.log(id);
    }
  }
};
</script>

<style lang='scss' scoped>
.stylebtn {
  width: 60px !important;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 17px 23px;
}

.client_area {
  display: flex;
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .client_msg {
    display: flex;
    align-items: center;
    width: 80%;
    .client_img {
      margin-left: 5px;
      margin-right: 15px;
      position: relative;
    }
    .client_info {
      width: 95%;
      p {
        text-align: left;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .sex_icon {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 22px;
      top: 0;
    }
  }
}

.send-type-tags {
  border-radius: 12px;
  padding: 2px 4px;
  font-size: 10px;
  border: 1px solid #b2bbdc;
  background: #b2bbdc;
  color: #fff;
}
</style>