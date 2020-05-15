<template>
    <!-- :style="{height: tableHeight}" -->
  <div>
      <!-- height="calc(100vh - 362px)" -->
    <el-table
      stripe
      show-summary
      :data="tableData"
      style="width: 100%"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column show-overflow-tooltip prop="date" label="员工">
        <template slot-scope="scope">
          {{scope.row.staffName}}
          <br />
          {{scope.row.levelName}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="date" label="归属部门"></el-table-column> -->
      <el-table-column prop="serviceCustomerNum" label="服务客数"></el-table-column>
      <el-table-column prop="specified" label="指定客数"></el-table-column>
      <el-table-column prop="laborPerformance" label="劳动业绩(￥)"></el-table-column>
      <el-table-column prop="productSalesPerformance" label="产品业绩(￥)"></el-table-column>
      <el-table-column prop="cardSalesPerformance" label="售卡业绩(￥)"></el-table-column>
      <el-table-column prop="totalCashPerformance" label="现金业绩(￥)"></el-table-column>
      <el-table-column prop="laborCommission" label="劳动提成(￥)"></el-table-column>
      <el-table-column prop="productCommission" label="产品提成(￥)"></el-table-column>
      <el-table-column prop="cardCommission" label="售卡提成(￥)"></el-table-column>
      <el-table-column prop="totalCommission" label="提成薪酬合计(￥)"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <g-button
            name="明细"
            :type="'green'"
            :icon="'icon_operate_eyes'"
            @click="getDetail(scope.row)"
          ></g-button>
          <!-- 仅限某一天时可以操作 -->
          <g-button
            name="重算"
            :type="'red'"
            :icon="'icon_ope_revoke'"
            @click="handleReset(scope.row)"
            v-if="filterData.occurDate === filterData.occurDateEnd && currentEntry === 'shop'"
          ></g-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-line">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="form.pageNum"
        :page-size="form.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div> -->
    <div class="padding-box"></div>
    <el-dialog
      title="业绩提成明细"
      :visible="performanceDialogVisible"
      :before-close="handleClose"
      width="1190px"
    >
      <div class="dialog-header-line" v-loading="dialogLoading">
        <span class="title-text">员工姓名:</span>
        <span class="content-info">{{currentRow.staffName}}</span>
        <!-- <span class="title-text">归属部门: </span>
        <span class="content-info"></span>-->
        <span class="title-text">职务:</span>
        <span class="content-info">{{currentRow.levelName}}</span>
        <span class="title-text">选择时间:</span>
        <el-date-picker
          size="medium"
          class="date-picker"
          v-model="dialogDateRange"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleDialogDateRangeChanged"
        ></el-date-picker>
        <div class="dialog-content-box">
          <div class="tags-line user-defined-tab">
            <el-tabs type="card" v-model="dialogForm.searchType">
              <el-tab-pane
                v-for="item in dialogDataTypes"
                :key="item.code"
                :name="item.code"
                :label="item.value"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <component :dialogTableData="dialogTableData" :is="dialogForm.searchType" @getOrderInfo="getOrderInfo"/>
          
          <div class="pagination-line">
            <el-pagination
              @current-change="handleDialogCurrentChange"
              :current-page="dialogForm.pageNum"
              :page-size="dialogForm.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="dialogTotal"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <service-order-detail
      v-if="ShowServiceOrderDetail"
      :infoVisible="ShowServiceOrderDetail"
      @handleClose="ShowServiceOrderDetail=false"
      :detail="orderInfo"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import ServiceOrderDetail from "@/components/order/billDetail/ServiceOrderDetail.vue";

import service from './dialogTables/service'
import product from './dialogTables/product'
import card from './dialogTables/card'

export default {
  props: {
    tableHeight: {
      type: String
    },
    filterData: {
      type: Object
    }
  },
  data() {
    return {
      total: 0,
      pageLoading: false,
      form: {
        // 取消分頁
        // pageNum: 1,
        // pageSize: 10,
      },
      tableData: [], // -
      // - 业绩提成对话框 -
      currentRow: {},
      performanceDialogVisible: false,
      dialogLoading: false,
      dialogDateRange: [],
      dialogDataTypes: [
        { code: "service", value: "劳动业绩" },
        { code: "product", value: "产品业绩" },
        { code: "card", value: "售卡业绩" }
      ],
      dialogForm: {
        searchType: "service",
        staffId: "",
        occurDate: "",
        occurDateEnd: "",
        pageNum: 1,
        pageSize: 10
      },
      dialogTableData: [],
      dialogTotal: 0,
      ShowServiceOrderDetail: false, // 详情的详情
      orderInfo: {} // -
      // = 业绩提成对话框 =
    };
  },
  created() {
    // this.init()
  },
  methods: {
    // - 提成列表 -
    init() {
      this.tableData = []
      let storeId =
        this.currentEntry === "shop"
          ? this.currentInfo.shopId
          : this.filterData.shopIdInBrand;
      if (!storeId) {
        // return;
      } // 在品牌端的默认情况下不请求， 一定要选择一个门店才可以, 如果后端开发了总部接口再说
      this.pageLoading = true;
      axios
        .post("getPerformanceSalaryNew", {
          ...this.filterData,
          ...this.form,
          storeId: storeId,
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          this.tableData = res.performanceSalaryInfoNewList || [];
          this.total = res.total;
          this.pageLoading = false;
        })
        .catch(err => {
          this.pageLoading = false;
        });
    },
    handleCurrentChange(page) {
      this.form.pageNum = val;
      this.init();
    },
    // 重新计算单日某员工数据
    handleReset(row) {
      let data = {
        "brandId": this.currentInfo.brandId,
        "occurDate": this.filterData.occurDate,
        "staffId": row.staffId,
        "storeId": this.currentInfo.shopId,
      }
      this.pageLoading = true
      axios.post('/recalculateStoreStaffPerformanceCommission', data).then(res => {
        this.pageLoading = false
        this.init()
      }).catch(err => {
        this.pageLoading = false
      })
    },
    // - 详情相关 -
    getDetail(row) {
      this.currentRow = row;
      this.dialogForm.staffId = row.staffId;
      // - 初始化详情日期为主表日期 -
      this.dialogDateRange = [
        this.filterData.occurDate,
        this.filterData.occurDateEnd
      ];
      this.dialogForm.occurDate = this.filterData.occurDate;
      this.dialogForm.occurDateEnd = this.filterData.occurDateEnd;
      // = 初始化详情日期为主表日期 =
      this.SearchFromApi();
      this.performanceDialogVisible = true;
    },
    async SearchFromApi() {
      this.dialogLoading = true;
      let data = { ...this.dialogForm, storeId: this.currentInfo.shopId };
      let res = await axios.post("/getStaffSalaryDetailByKind", data);
      this.dialogTableData = res.serviceInfoList || [];
      this.dialogTotal = res.total;
      this.dialogLoading = false;
    },
    handleClose() {
      this.performanceDialogVisible = false;
      this.dialogDateRange = [];
      this.dialogForm = {
        searchType: "service",
        staffId: "",
        occurDate: "",
        occurDateEnd: "",
        pageNum: 1,
        pageSize: 10
      };
    },
    handleDialogDateRangeChanged() {
      if (this.dialogDateRange.length) {
        this.dialogForm.occurDate = this.dialogDateRange[0];
        this.dialogForm.occurDateEnd = this.dialogDateRange[1];
        this.handleDialogCurrentChange(1);
      }
    },
    handleDialogCurrentChange(page) {
      this.dialogForm.pageNum = page;
      this.SearchFromApi();
    },
    getOrderInfo(id) {
      this.ShowServiceOrderDetail = false;
      axios.get(`/getConsumerOrderInfoById/${id}`).then(res => {
        this.orderInfo = res;
        // this.setBillId(res.billId) // 新的统一处理账单id
        // this.setPaperId(res.paperOrderId); // - 纸单
        this.ShowServiceOrderDetail = true;
      });
    }
    // = 详情相关 =
  },
  watch: {
    "dialogForm.searchType": {
      handler: function(v, o) {
        if (o && o !== v) {
          this.handleDialogCurrentChange(1);
        }
      },
      deep: true,
      immediate: true
    },
    filterData: {
      handler: function(v, o) {
        v.occurDate && this.init();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  filters: {
    cardTypeFilter(type) {
      let map = {
        0: "身份卡",
        1: "储值卡",
        2: "次  卡",
        3: "时间卡"
      };
      return map[type];
    },
    // - 此处可能有问题
    payTypeFilter(payType) {
      let map = {
        0: "微信",
        1: "支付宝",
        2: "现金",
        3: "储值卡",
        4: "自定义",
        5: "次卡",
        6: "时间卡",
        7: "赠送",
        8: "余额支付"
      };
      return map[payType];
    }
  },
  components: { ServiceOrderDetail, service, product, card }
};
</script>
<style lang='scss' scoped>
// .pagination-line {
//   height: 65px;
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-end;
//   align-items: center;
// }
// - 对话框
.dialog-header-line {
  .dialog-header-line {
    font-size: 14px;
  }
  .title-text {
    color: #999;
  }
  .content-info {
    margin-right: 14px;
  }
  .tags-line {
    margin-top: 12px;
  }
  .dialog-content-box {
    border-radius: 8px;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  }
  /deep/ .order-details {
    &:hover {
      color: #58c9f3;
      cursor: pointer;
    }
  }
}

.padding-box {
  height: 10px;
}

// /deep/ .el-table__footer-wrapper {
//   position: fixed;
//   z-index: 1;
// }
</style>
