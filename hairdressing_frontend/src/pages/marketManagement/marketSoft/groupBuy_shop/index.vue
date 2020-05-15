<template>
  <div class="shop-group-buy-main" v-loading="loading">
    <div class="search-line">
      <el-button
        @click="changeRouter"
        class="normal_red_btn"
        v-if="checkHasBtnPermission('/shop-inner/create-group-buying', 'path')"
      >设置拼团</el-button>
      <i v-else></i>
      <div class="search-box">
        <input-search
          :placeholder="'搜索服务/产品名称'"
          width="auto"
          v-model="form.keyword"
          @search="handleSearch"
        />
      </div>
    </div>
    <div class="filters-line">
      <el-form :model="form" label-width="85px" class="query-form">
        <!-- <el-form-item label="启用状态: ">
          <el-select
            v-model="form.groupStatus"
            clearable
            placeholder="选择筛选状态"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="生效时间: ">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            clearable
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentTab">
          <el-tab-pane v-for="item in tableTabs" :key="item.id" :name="item.id" :label="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-box">
        <el-table stripe :data="tableData" height="calc(100vh - 340px)">
          <el-table-column prop="activityName" label="归属活动名称" width="130">
            <template slot-scope="{ row }">
              <el-tooltip class="item" effect="dark" :content="row.activityName" placement="top">
                <p>{{ row.activityName }}</p>
              </el-tooltip>
              <p class="rulesOpera" v-if="row.settingId">
                <span @click="toDetails(row, 1)">活动详情</span>
                <span @click="backOnline(row, 1)">活动重启</span>
              </p>
              <p v-else>无</p>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" show-overflow-tooltip width="120" label="服务/产品名称"></el-table-column>
          <el-table-column prop="specificationName" show-overflow-tooltip label="规格"></el-table-column>
          <el-table-column prop="shopPrice" show-overflow-tooltip label="门店价/专柜价">
            <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
          </el-table-column>
          <el-table-column prop="groupCondition" width="120" label="拼团条件">
            <template slot-scope="scope">{{ scope.row.groupCondition }}人拼</template>
          </el-table-column>
          <el-table-column prop="groupPrice" label="拼团价格">
            <template slot-scope="scope">￥{{ scope.row.groupPrice }}</template>
          </el-table-column>
          <el-table-column prop="salesCount" label="拼团销量"></el-table-column>
          <el-table-column prop="salesAmount" label="销售金额">
            <template slot-scope="scope">￥{{ scope.row.salesAmount }}</template>
          </el-table-column>
          <el-table-column prop="effectiveTime" label="生效时间" width="100"></el-table-column>
          <el-table-column prop="invalidTime" label="结束时间" width="100"></el-table-column>
          <el-table-column prop="staffName" label="操作人"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span class="tag-box" :class="scope.row.status">{{ scope.row.status | statusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <g-button
                :name="'详情'"
                class="text-cant-copy"
                :type="'green'"
                :icon="'icon_operate_eyes'"
                @click="toDetails(scope.row, 2)"
              ></g-button>
              <g-button
                v-if="scope.row.status === 'open'"
                :name="'下线'"
                class="text-cant-copy"
                :type="'delete'"
                :icon="'icon_operate_disable'"
                @click="offline(scope.row)"
              ></g-button>
              <g-button
                v-if="scope.row.status !== 'open'"
                :name="'重新上线'"
                class="text-cant-copy"
                :type="'detail'"
                :icon="'icon_operate_recover'"
                @click="backOnline(scope.row, 2)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages-line">
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handlePageChanged"
          :current-page="form.currentPage"
          :page-size="form.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <g-del-model
      :delTagDialogVisible="editConfirmVisible"
      @confirm="sureToDelete"
      @close="editConfirmVisible = false"
      title="确定要将该拼团关闭吗？"
      content="关闭后，该拼团不会出现在客户版小程序，且不可恢复。"
      icon="icon_popup_question"
      iconColor="#FCB322"
    ></g-del-model>
    <!-- 不可上线提示框 -->
    <g-del-model
      :delTagDialogVisible="unOnlineConfirmVisible"
      @confirm="unOnlineConfirmVisible = false"
      @close="unOnlineConfirmVisible = false"
      title="暂时不可上线！"
      :content="unOnlineReason"
      icon="icon_popup_plaint"
      iconColor="#FFCC00"
    ></g-del-model>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { truncate } from "fs";
import { Base64 } from "js-base64";
export default {
  data() {
    return {
      form: {
        keyword: null,
        currentPage: 1,
        pageSize: 10,
        timeRange: {
          endTime: null,
          startTime: null
        }
      },
      statusOptions: [
        {
          name: "已上线",
          value: "open"
        },
        {
          name: "已下线",
          value: "close"
        },
        {
          name: "已售完",
          value: "sale_out"
        },
        {
          name: "已结束",
          value: "time_end"
        }
      ],
      timeRange: [],
      tableData: [],
      total: 0,
      loading: false,
      editConfirmVisible: false, // 下线提示框
      unOnlineConfirmVisible: false, // 重新上线提示
      currentRow: {}, // 预删除行的内容
      unOnlineReason: "", // 不可上线的理由
      currentTab: 'all',
      tableTabs: [
        {
          name: "全部",
          id: 'all'
        },
        {
          name: "已上线",
          id: "open"
        },
        {
          name: "已下线",
          id: "close"
        },
        {
          name: "已结束",
          id: "time_end"
        },
        // {
        //   name: '',
        //   id: "sale_out"
        // }
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      axios
        .post("/getAllStoreGroupBuyGoodsList", {
          storeId: this.currentInfo.shopId,
          ...this.form,
          groupStatus: this.currentTab == 'all' ? null : this.currentTab
        })
        .then(res => {
          this.tableData = res.groupPurchaseRuleList;
          this.total = res.total;
          this.loading = false;
        });
    },
    handleSearch(keyword) {
      this.handlePageChanged(1);
    },
    handleSelectChange(v) {
      this.form.groupStatus = v || null; //  '' 报错 转 null
      this.handlePageChanged(1);
    },
    handlePageChanged(page) {
      this.form.currentPage = page;
      this.init();
    },
    changeRouter() {
      this.$router.push("/shop-inner/create-group-buying");
    },
    // 重新上线活动
    async backOnline(row, type) {
      let id = type == 1 ? row.settingId : row.id;
      let groupIdTypeEnum = type == 1 ? "SETTING_ID" : "RULE_ID";
      let idType = type === 1 ? "all" : "alone";
      this.loading = true;
      const res = await axios.post("/canRestartGroupRule", {
        id,
        groupIdTypeEnum
      });
      this.loading = false;
      if (!res.success) {
        this.unOnlineReason =
          !res.message
            ? "请先将该活动的所有商品的拼团活动进行下线操作，再进重新上线"
            : res.message;
        this.unOnlineConfirmVisible = true;
        return;
      }
      this.$router.push(
        `/shop-inner/reset-group-buying?${idType}=${Base64.encode(id)}`
      );
    },
    // 拼团详情
    toDetails(row, type) {
      let idType = type === 1 ? "all" : "alone";
      let id = type === 1 ? row.settingId : row.id;
      window.open(
        `#/shop-inner/group-buying-detail?${idType}=${Base64.encode(id)}`,
        "_blank"
      );
      // 新标签页打开
      // this.toPagesInNewTags('/brand-inner/market/market-list/red-packet-details', {id: id})
    },
    // 下线
    offline(row) {
      this.currentRow = row;
      this.editConfirmVisible = true;
    },
    // 确认下线
    sureToDelete() {
      axios
        .post("/closeStoreGroupBuyRule", { id: this.currentRow.id })
        .then(res => {
          this.$message({
            type: res.success ? "success" : "error",
            message: res.message
          });
        })
        .then(() => {
          this.init();
          this.editConfirmVisible = false;
        });
    }
  },
  filters: {
    statusFilter(status) {
      let map = {
        open: "已上线",
        close: "已下线",
        sale_out: "已售完",
        time_end: "已结束"
      };
      return map[status];
    }
  },
  watch: {
    timeRange(v, o) {
      if (v && v.length) {
        this.form.timeRange.startTime = v[0];
        this.form.timeRange.endTime = v[1];
      } else {
        this.form.timeRange.startTime = null;
        this.form.timeRange.endTime = null;
      }
      this.handlePageChanged(1);
    },
    currentTab(val) {
      this.handlePageChanged(1);
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>
<style lang="scss" scoped>
.shop-group-buy-main {
  width: calc(100vw - 221px);
  height: calc(100vh - 75px);
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex-direction: column;
}
.search-line {
  height: 35px;
  width: 100%;
  display: flex;
  // 主轴对齐
  justify-content: space-between;
  align-items: center;
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
  .normal_red_btn {
    padding: 9.5px 16px;
  }
}
.filters-line {
  margin-top: 15px;
  height: 65px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  .query-form {
    display: flex;
    align-items: center;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
}
.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 235px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
    padding: 0 20px;
  }
  .pages-line {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.tag-box {
  padding: 1px 8px;
  border: 1px solid #333;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  &.open {
    border-color: #a9d86e;
    background: #a9d86e;
  }
  &.close {
    border-color: #fd4c70;
    background: #fd4c70;
  }
  &.sale_out,
  &.time_end {
    border-color: #fa9655;
    background: #fa9655;
  }
  &.time_end,
  &.time_end {
    border-color: #bec3c6;
    background: #bec3c6;
  }
}

.rulesOpera {
  span {
    font-size: 12px;
    cursor: pointer;
    color: #359dfe;
  }
  span + span {
    margin-left: 10px;
  }
}
</style>
