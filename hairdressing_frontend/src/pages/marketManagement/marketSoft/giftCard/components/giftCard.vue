<template>
  <div class="gift-card">
    <div class="table-main" v-loading="loading">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentTab">
          <el-tab-pane v-for="item in tableTabs" :key="item.id" :name="item.id" :label="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-box">
        <el-checkbox-group v-model="batchActivityIds" @change="handleChecked">
          <el-table stripe :data="tableData" height="calc(100vh - 330px)">
            <el-table-column show-overflow-tooltip label="活动标题">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row.id">
                  <p class="activity-name">{{ scope.row.name }}</p>
                </el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"></el-table-column>
            <el-table-column prop="giftCardName" show-overflow-tooltip label="卡项名称"></el-table-column>
            <el-table-column show-overflow-tooltip label="原价">
              <template
                slot-scope="{ row }"
              >{{ row.cardPrice ? '￥' + row.cardPrice.toFixed(2) : '￥0.00' }}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="活动价">
              <template
                slot-scope="{ row }"
              >{{ row.activityPrice ? '￥' + row.activityPrice.toFixed(2) : '￥0.00' }}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="分享奖励">
              <template
                slot-scope="{ row }"
              >
              <div v-if="row.awardInfo && row.awardInfo.length > 1">
                <div v-for="item in row.awardInfo" :key="item.awardAmount">
                  <p><span>{{item.countFrom}}-{{item.countTo}}：</span><span>{{item.awardAmount ? '￥' + item.awardAmount.toFixed(2) : '-'}}</span></p>
                </div>
              </div>
              <div v-else-if="row.awardInfo && row.awardInfo.length == 1">
                <p>
                  {{ row.awardInfo[0] && row.awardInfo[0].awardAmount ? '￥' + row.awardInfo[0].awardAmount.toFixed(2) : '￥0.00' }}
                </p>
              </div>
              <div v-else>
                <p>-</p>
              </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="活动时间">
              <template slot-scope="{ row }">
                <div v-if="row.timeFrom && row.timeTo">
                  <p>{{row.timeFrom}}</p>
                  <p style="text-align: center;">至</p>
                  <p>{{row.timeTo}}</p>
                </div>
                <div v-else>
                  <p>-</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="可领/总数">
              <template
                slot-scope="{ row }"
              >{{ row.getNum != null && row.cardCount != null ? `${row.cardCount - row.getNum}/${row.cardCount}` : `-` }}</template>
            </el-table-column>
            <el-table-column prop="userId" show-overflow-tooltip label="创建人">
              <template slot-scope="{ row }">
                {{creatorName(row.userId)}}
              </template>
            </el-table-column>
            <el-table-column prop="status" show-overflow-tooltip label="状态">
              <template slot-scope="{ row }">
                <p v-if="row.status === 1">
                  <status-text :type="'green'" :name="'已启用'"></status-text>
                </p>
                <p v-else-if="row.status === 2">
                  <status-text :type="'mred'" :name="'已停用'"></status-text>
                </p>
                <p v-else>
                  <status-text :type="'sgrey'" :name="'已过期'"></status-text>
                </p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作">
              <template slot-scope="scope">
                <g-button
                  :name="'详情'"
                  :type="'green'"
                  :icon="'icon_operate_eyes'"
                  @click="toDetails(scope.row.id)"
                ></g-button>
                <g-button
                  v-if="scope.row.status === 1"
                  :name="'停用'"
                  :type="'red'"
                  :icon="'icon_operate_disable'"
                  @click="disable(scope.row, true)"
                ></g-button>
                <g-button
                  v-if="scope.row.status === 2"
                  :name="'启用'"
                  :type="'mgreen'"
                  :icon="'icon_operate_recover'"
                  @click="recover(scope.row, true)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
        <div class="page-line">
          <div class="batch-btn">
            <el-checkbox
              v-model="checkAllFlag"
              @change="checkAllChange"
              style="margin-right: 10px; vertical-align: middle;"
              :indeterminate="isAllCheck"
            >全选</el-checkbox>
            <div style="display: inline-block; vertical-align: middle;">
              <g-button
                v-if="currentTab == '0' || currentTab == '1'"
                :name="'批量停用'"
                :type="'orangeFill'"
                :icon="'icon_operate_disable'"
                @click="batchRecoverActivity(2)"
              ></g-button>
              <g-button
                v-if="currentTab == '0' || currentTab == '2'"
                :name="'批量启用'"
                :type="'mgreenFill'"
                :icon="'icon_operate_recover'"
                @click="batchRecoverActivity(1)"
              ></g-button>
            </div>
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
    <!-- 批量启用 -->
    <g-del-model
      :delTagDialogVisible="batchOpenConfirmVisible"
      @confirm="batchOpenActivity"
      @close="batchOpenConfirmVisible = false"
      :title="batchTitle"
      :content="batchContent"
      :icon="batchIcon"
      :iconColor="batchIconColor"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { Base64 } from "js-base64";
export default {
  props: {
    giftForm: {
      type: Object,
      default:() => {}
    },
    createPeople: {
      type: Array,
      default:() => []
    }
  },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: null,
      currentTab: "0",
      tableTabs: [
        {
          name: "全部",
          id: "0"
        },
        {
          name: "已启用",
          id: "1"
        },
        {
          name: "已停用",
          id: "2"
        },
        {
          name: "已过期",
          id: "3"
        }
      ],
      tableData: [],
      // 批量活动id
      batchActivityIds: [],
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false, // 半选标识
      btnLoad: false,
      batchOpenConfirmVisible: false,
      targetStatus: Boolean,
      // 提示框所需的一些参数
      batchTitle: '',
      batchContent: '',
      batchIcon: '',
      batchIconColor: '',
      // 单个活动启用停用
      isSingle: false,
      singleAc: {}
    };
  },
  mounted() {
    this.getGiftCardActivityList();
  },
  methods: {
    // 查询列表
    async getGiftCardActivityList() {
      this.loading = true;
      const res = await axios.post("/getGiftCardActivityList", {
        ...this.giftForm,
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        status: this.currentTab != "0" ? Number(this.currentTab) : null,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      this.tableData = res.giftCardActivityInfoList;
      this.total = res.total;
      this.loading = false;
    },
    // 获取创建人名称
    creatorName(id) {
      let name = '-'
      this.createPeople.some(i => {
        if (i.userId == id) {
          name = i.username
        }
      })
      return name
    },
    // 操作
    toDetails(id) {
      window.open('#/shop-inner/gift-vip-card-detail?id=' + Base64.encode(id),'_blank')
    },
    disable(row, flag) {
      this.singleAc = row
      this.isSingle = flag
      this.batchRecoverActivity(2,true)
    },
    recover(row, flag) {
      this.singleAc = row
      this.isSingle = flag
      this.batchRecoverActivity(1,true)
    },
    handleCurrentChange(index) {
      this.pageNum = index;
      this.getGiftCardActivityList();
      // 自定义全选勾选状态清空
      this.batchActivityIds = [];
      this.checkAllFlag = false;
      this.isAllCheck = false;
    },
    // 复选框勾选事件
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag = this.batchActivityIds.length == this.tableData.length;
      this.isAllCheck =
        checkedCount > 0 && checkedCount < this.tableData.length;
    },
    // 全选按钮点击
    checkAllChange(checked) {
      // 半选状态取消
      this.isAllCheck = false;
      if (checked) {
        this.tableData.forEach((item, index) => {
          if (this.batchActivityIds.indexOf(item.id) == -1) {
            this.batchActivityIds.push(item.id);
          }
        });
      } else {
        this.batchActivityIds = [];
      }
    },
    // 批量启用/停用
    batchRecoverActivity(flag, isSingle = false) {
      if (!this.isSingle && this.batchActivityIds.length < 1)
        return this.$message.warning("请至少选择一个活动进行批量操作！");
      this.batchTitle = flag == 1 ? '确定要将活动启用吗？' : '确定要将活动停用吗？'
      this.batchContent = flag == 1 ? '启用后，活动讲按照设定的规则进行。' : '停用后，活动即刻停止；已发放的礼品卡仍可使用。'
      this.batchIcon = flag == 1 ? 'icon_popup_success' : 'icon_popup_question'
      this.batchIconColor = flag == 1 ? '#41CAC0' : '#FCB322'
      this.batchOpenConfirmVisible = true
      this.targetStatus = flag
      this.isSingle = isSingle
    },
    // 确认启用/禁用事件
    async batchOpenActivity() {
      this.btnLoad = true
      try {
        const res = await axios.post('/batchUpdateGiftCardActivityStatus', {
          ids: this.isSingle ? [this.singleAc.id] : this.batchActivityIds,
          status: this.targetStatus
        }) 
        if (!res.success) return this.$message.error('操作失败')
        this.$message.success('操作成功')
        this.btnLoad = false
        this.batchOpenConfirmVisible = false
        this.handleCurrentChange(1)
      } finally {
        this.btnLoad = false
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {
    currentTab(val) {
      this.handleCurrentChange(1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/tab.scss";

.table-main {
  margin-top: 15px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
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
  .batch-btn {
    display: inline-block;
    vertical-align: middle;
    margin-top: 8px;
    margin-left: 10px;
  }
}

.activity-name {
  display: inline-block;
  width: 110px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>