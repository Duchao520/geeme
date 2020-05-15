<template>
  <div class="deposit">
    <!-- 表格单选区域 -->
    <div class="radio-group">
      <el-date-picker
        v-model="timeRange"
        type="datetimerange"
        clearable
        unlink-panels
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      ></el-date-picker>

      <el-select
        v-model="params.storeId"
        placeholder="请选择"
        clearable
        size="small"
        style="margin-left: 20px;"
      >
        <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>

    <!-- 数据统计 -->
    <el-card class="data-statistic">
      <div class="statistic-item">
        <p>
          <span>￥</span>{{ totalRecharge.toFixed(2) }}
        </p>
        <p>累计充值</p>
      </div>
      <div class="statistic-item">
        <p>
          <span>￥</span>{{ totalReturnAmount.toFixed(2) }}
        </p>
        <p>累计返还</p>
      </div>
      <div class="statistic-item">
        <p>
          <span>￥</span>{{ surplusSecurityFund.toFixed(2) }}
        </p>
        <p>剩余保证金</p>
      </div>
    </el-card>

    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="depositData" height="calc(100vh - 400px)" v-loading="loading">
        <el-table-column prop="createTime" label="时间" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- <p>{{utils.formatDateTimeFromYearToSecond(row.bindTime)}}</p> -->
            <p>{{row.createTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="权益门店">
          <template slot-scope="{row}">
            <p>{{`${row.city} ${row.storeName}`}}</p>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="{row}">{{ row.changeType | changeTypeFilter }}</template>
        </el-table-column>
        <el-table-column label="金额(￥)">
          <template slot-scope="{row}">
            <p
              class="green"
              :class="{ 'red': row.changeSecurityFund < 0}"
            >{{ row.changeSecurityFund }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages-line">
      <div class="batch-btn"></div>
      <el-pagination
        style="margin-right: 12px;"
        class="pagination"
        @current-change="handlePageChanged"
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 解绑 -->
    <g-del-model
      :delTagDialogVisible="unbundleVisible"
      @confirm="unbundleClient"
      @close="unbundleVisible = false"
      title="确定要将该客户解绑吗？"
      content="解绑后，该客户将不再为股东带来收益。"
      icon="icon_popup_question"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      utils,
      // 加入时间model
      timeRange: [],
      params: {
        currentPage: 1,
        pageSize: 10,
        endTime: "",
        startTime: "",
        storeId: null
      },
      loading: false,
      depositData: [],
      total: null,
      unbundleVisible: false,
      storeList: [],
      pitchRow: {},
      btnLoad: false,
      totalRecharge: 0, // 累计充值
      totalReturnAmount: 0, // 累计返还
      surplusSecurityFund: 0 // 剩余保证金
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.loading = true;
        // 获取保证金统计和list
        const [res_1, res_2, res_3] = await Promise.all([
          axios.post("/getSecurityFundStatistics", {
            endTime: this.params.endTime,
            startTime: this.params.startTime,
            shareholderId: this.shareholderDetail.id,
            storeId: this.params.storeId
          }),
          axios.post("/getShareholderSecurityFundChangeRecordList", {
            shareholderId: this.shareholderDetail.id,
            ...this.params
          }),
          axios.post("/getStoreListByBrandIdLikeName", {
            brandId: this.currentInfo.brandId,
            pageNum: 1,
            pageSize: 999,
            searchName: null
          })
        ]);
        this.totalRecharge =
          res_1.recharge + res_1.openAccount + res_1.modifyAdd;
        this.totalReturnAmount = res_1.returnAmount;
        this.surplusSecurityFund = res_1.surplusSecurityFund;
        this.depositData = res_2.recordInfoForPagedList;
        this.total = res_2.total;
        this.storeList = res_3.storeBasicInfoList;
      } finally {
        this.loading = false;
      }
    },
    unbundle(row) {
      this.pitchRow = row;
      this.unbundleVisible = true;
    },
    // 解绑
    async unbundleClient() {
      try {
        this.btnLoad = true;
        const res = await axios.post("/relieveBindShareholder", {
          id: this.pitchRow.id
        });
        if (!res.success) return this.$message.error("解绑失败");
        this.$message.success("解绑成功");
        this.unbundleVisible = false;
        this.handlePageChanged(this.params.currentPage);
      } finally {
        this.btnLoad = false;
      }
    },
    handlePageChanged(val) {
      this.params.currentPage = val;
      this.init();
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      shareholderDetail: state => state.shareholder.shareholderDetail
    }),
    isBrand() {
      return this.currentEntry == "brand";
    }
  },
  watch: {
    "params.storeId"() {
      this.handlePageChanged(1);
    },
    "params.consumeStatus"() {
      this.handlePageChanged(1);
    },
    timeRange(val) {
      if (val && val.length) {
        this.params.startTime = val[0];
        this.params.endTime = val[1];
      } else {
        this.params.startTime = null;
        this.params.endTime = null;
      }
      this.init();
    }
  },
  filters: {
    changeTypeFilter(val) {
      switch (val) {
        case "recharge_security_fund":
          return "保证金充值";
        case "return_security_fund":
          return "客户消费返还";
        case "quit_shareholder_account":
          return "退股";
        case "modify_shareholder_account_add":
          return "变更保证金-增加";
        case "modify_shareholder_account_subtract":
          return "变更保证金-减少";
        case "open_shareholder_count":
          return "入股初始保证金";
        case "return_security_fund_rollback":
          return "客户消费返还退回";
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.deposit {
  padding: 20px 20px 0;
}
.pages-line {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
// 拷贝来的用户信息，可能有冗余
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

.green {
  color: green;
  &.red {
    color: red;
  }
}

.data-statistic {
  margin: 10px 0;
  /deep/ .el-card__body {
    display: flex;
    align-items: center;
    // justify-content: space-around;
    .statistic-item {
      flex: 1;
      text-align: center;
      :nth-child(1) {
        span {
          font-size: 12px;
        }
        margin: 0 auto;
        font-size: 20px;
        color: #000;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :nth-child(2) {
        font-size: 12px;
        color: #a5a5a5;
      }
    }
  }
}
</style>