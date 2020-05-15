<template>
  <div class="reCharge-box">
    <el-table
      :data="tableData"
      height="calc(100vh - 389px)"
      stripe
      style="width: 100%"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column prop="createTime" label="充值时间"></el-table-column>
      <el-table-column prop="username" label="客户姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column label="充值金额">
        <template slot-scope="scope">
          <p>￥{{scope.row.amount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="支付方式">
        <template slot-scope="scope">
          <p v-if="scope.row.payType === 1">支付宝</p>
          <p v-else>微信</p>
        </template>
      </el-table-column>
      <el-table-column label="充值渠道">
        <template slot-scope="scope">
          <p v-if="scope.row.channel === 1">线下门店</p>
          <p v-else>线上自助</p>
          <p>{{ scope.row.storeName }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="staffName" label="操作人"></el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div class="pagination">
      <div></div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="filterData.pageNum"
          :page-size="filterData.pageSize"
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
      type: Object
    },
    keyword: {
      type: String
    },
    dateFlag: {
      type: Boolean
    }
  },
  watch: {
    // 模糊匹配
    keyword(val) {
      // console.log(val);
      this.filterData.mobile = val;
      this.filterData.username = val;
      // console.log(this.filterData)
      this.getRecharge();
    },
    dateFlag(val) {
      // console.log(val);
      if (val) {
        this.getRecharge();
      }
      this.$emit("changeFlag");
    }
  },
  data() {
    return {
      total: null,
      tableData: [],
      pageLoading: false
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    })
  },
  mounted: function() {
    // this.getRecharge(); 这里利用父组件切换tab实现
  },
  methods: {
    getRecharge() {
      if (this.currentEntry === 'brand') {
        this.getRecharge_brand()
      } else {
        this.getRecharge_shop()
      }
    },
    // 获取充值记录 - 品牌
    getRecharge_brand() {
      // 获取数据
      this.pageLoading = true;
      axios
        .post("/getCashInRecordForStaff", {
          ...this.filterData,
        brandId: this.currentInfo.brandId})
        .then(res => {
          this.pageLoading = false;
          // console.log(res);
          if (res.success) {
            this.tableData = res.cashInRecordInfoList;
            this.total = res.total;
          } else {
            this.tableData = [];
            this.$message({ type: "error", message: res.message });
          }
        })
        .catch(err => {
          this.tableData = [];
          this.pageLoading = false;
        });
    },
    // 获取充值记录 - 门店
    getRecharge_shop() {
      this.pageLoading = true;
      axios.post('/getCashInRecordForStoreStaff', {...this.filterData, brandId: this.currentInfo.brandId, storeId: this.currentInfo.shopId}).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.cashInRecordInfoList;
          this.total = res.total;
        } else {
          this.tableData = [];
          this.$message({ type: "error", message: res.message });
        }
      }).catch(err => {
        this.tableData = [];
        this.pageLoading = false;
      })
    },
    // 分页切换事件
    handleCurrentChange(index) {
      this.filterData.pageNum = index;
      this.getRecharge();
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
</style>