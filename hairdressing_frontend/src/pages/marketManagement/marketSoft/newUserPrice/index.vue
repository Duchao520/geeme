<template>
  <div class="shop-group-buy-main" v-loading="loading">
    <div class="search-line">
      <el-button
        @click="changeRouter"
        class="normal_red_btn"
      >新增体验价</el-button>
      <div class="search-box">
        <input-search
          :placeholder="'搜索活动名称'"
          width="auto"
          v-model="expParams.keyword"
          @search="handleSearch"
        />
      </div>
    </div>
    <div class="filters-line">
      <el-form :model="expParams" label-width="85px" class="query-form">
        <el-form-item label="活动时间: ">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            clearable
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-main">
      <div class="table-box">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="sendRecordStatus">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-table stripe :data="experienceData" height="calc(100vh - 348px)">
          <el-table-column prop="activityName" show-overflow-tooltip label="活动名称"></el-table-column>
          <el-table-column prop="activityFor" show-overflow-tooltip label="享受客户">
            <template slot-scope="scope">
              <p v-if="scope.row.activityFor === 'all_customer'">所有客户</p>
              <p v-else>仅针对新客户</p>
            </template>
          </el-table-column>
          <el-table-column prop="activityStatus" label="活动状态">
            <template slot-scope="scope">
              <p v-if="scope.row.activityStatus === 'not_started'">未开始</p>
              <p v-else-if="scope.row.activityStatus === 'working'">进行中</p>
              <p v-else-if="scope.row.activityStatus === 'off_line'">已下线</p>
              <p v-else>已结束</p>
            </template>
          </el-table-column>
          <el-table-column prop="orderCount" label="销量"></el-table-column>
          <el-table-column prop="orderReceived" label="销售金额">
            <template slot-scope="scope">
              <p>￥{{scope.row.orderReceived.toFixed(2)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="activityFrom" label="开始时间"></el-table-column>
          <el-table-column prop="activityTo" label="结束时间"></el-table-column>
          <el-table-column prop="userName" label="操作人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <g-button
                :name="'详情'"
                class="text-cant-copy"
                :type="'green'"
                :icon="'icon_operate_eyes'"
                @click="toDetails(scope.row.id)"
              ></g-button>
              <g-button
                v-if="scope.row.activityStatus !== 'finished' && scope.row.activityStatus !== 'off_line'"
                :name="'下线'"
                class="text-cant-copy"
                :type="'red'"
                :icon="'icon_ope_revoke'"
                @click="offline(scope.row)"
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
          :current-page="expParams.pageNum"
          :page-size="expParams.pageSize"
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
      title="确定要将该活动下线吗？"
      content="下线后，该活动不会出现在客户版小程序，且不可恢复。"
      icon="icon_popup_question"
      iconColor="#FCB322"
    ></g-del-model>
  </div>
</template>
<script>
import '@/assets/css/tab.scss'
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { truncate } from "fs";
export default {
  data() {
    return {
      //tabs 选中标签
      sendRecordStatus: "all",
      // 切换标签列表
      sendRecords: [
        {
          value: "all", // 前端自定义
          label: "全部"
        },
        {
          value: "working",
          label: "进行中"
        },
        {
          value: "not_started",
          label: "未开始"
        },
        {
          value: "off_line",
          label: "已下线"
        },
        {
          value: "finished",
          label: "已结束"
        }
      ],
      // 时间选择器数据
      timeRange: [],
      loading: false,
      editConfirmVisible: false, // 删除对话框
      currentRow: {}, // 预删除行的内容
      // 获取体验价的参数
      expParams: {
        activityStatus: "all", //tabs 选中标签
        keyword: "",
        pageNum: 1,
        pageSize: 10,
        beginTime:null,
        endTime:null
      },
      // 体验价数据
      experienceData: [],
      // 体验价数据总数
      total: 0
    };
  },
  created() {
    // this.init()
    this.getExperience();
  },
  methods: {
    // 获取体验价活动列表
    getExperience() {
      this.loading = true;
      this.expParams.activityStatus =
        this.expParams.activityStatus === "all"
          ? null
          : this.expParams.activityStatus;
      const res = axios
        .post("/getExperienceActivityList", {
          ...this.expParams,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.experienceData = res.experiencePriceActivityList;
          this.total = res.total;
          this.loading = false;
        });
    },
    // 活动详情
    toDetails(id) {
      // alert("功能开发中");
      // 新标签页打开
      // this.toPagesInNewTags('/brand-inner/market/market-list/red-packet-details', {id: id})
      this.$router.push({
        path: "/shop-inner/new-user-price/detail",
        query: {
          id
        }
      });
    },
    // 下线活动
    offline(row) {
      this.currentRow = row;
      this.editConfirmVisible = true;
    },
    // 下线弹框确定事件
    async sureToDelete() {
      const res = await axios.get(
        `/closeExperienceActivity/${this.currentRow.id}`
      );
      if (res.success !== true) return this.$message.error("下线失败");
      this.$message.success("下线成功");
      // 关闭对话框
      this.editConfirmVisible = false;
      // 重新获取表格数据
      this.getExperience();
    },
    handleSearch(keyword) {
      this.handlePageChanged(1);
      console.log();
    },
    handleSelectChange(v) {
      // this.form.groupStatus = v || null //  '' 报错 转 null
      this.handlePageChanged(1);
    },
    handlePageChanged(page) {
      this.expParams.pageNum = page;
      this.getExperience();
    },
    // 新增体验价
    changeRouter() {
      this.$router.push({
        path: "/shop-inner/new-user-price/add"
      });
    },
  },
  filters: {},
  watch: {
    // 时间监听
    timeRange(v, o) {
      if (v && v.length) {
        this.expParams.beginTime = v[0];
        this.expParams.endTime = v[1];
      } else {
        this.expParams.beginTime = null;
        this.expParams.endTime = null;
      }
      this.handlePageChanged(1);
    },
    // 监听tabs
    sendRecordStatus(v, o) {
      this.expParams.activityStatus = v;
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
<style lang='scss' scoped>
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
  margin-top: 20px;
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
  height: calc(100vh - 240px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
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
    border-color: #e22c37;
    background: #e22c37;
  }
  &.sale_out {
    border-color: #bec3c6;
    background: #bec3c6;
  }
}

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
}
</style>
