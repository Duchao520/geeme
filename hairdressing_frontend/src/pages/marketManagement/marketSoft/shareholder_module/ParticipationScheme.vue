<template>
  <div>
    <!-- 列表 -->
    <div class="participation-list">
      <div class="table-main">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="pitchSchem">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="table-box">
          <!-- <el-checkbox-group v-model="batchShareholderIds" @change="handleChecked"> -->
          <el-table
            stripe
            :data="storeBonusPlanData"
            height="calc(100vh - 256px)"
            v-loading="loading"
          >
            <el-table-column prop="parentSellerId" show-overflow-tooltip label="方案名称">
              <template slot-scope="{ row }">
                <p>{{row.name || '-'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="毛利分红比例">
              <template slot-scope="{ row }">
                <p>{{row.grossProfitBonusRate ? `${row.grossProfitBonusRate}%` : '-'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="返还保证金比例">
              <template slot-scope="{ row }">
                <p>{{row.securityFundReturnRate ? `${row.securityFundReturnRate}%` : '-'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="介绍股东奖励比例">
              <template slot-scope="{ row }">
                <p>{{row.referralFeeRate ? `${row.referralFeeRate}%` : '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="创建人">
              <template slot-scope="{ row }">
                <p>{{ row.createByName || '-' }}</p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="创建时间">
              <template slot-scope="{ row }">
                <p>{{ row.createTime || '-' }}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="状态">
              <template slot-scope="{ row }">
                <status-text v-if="row.status == 'enabled'" :type="'green'" :name="'已启用'"></status-text>
                <status-text v-else :type="'mred'" :name="'已停用'"></status-text>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="操作" width="180">
              <template slot-scope="scope">
                <g-button
                  :name="'编辑'"
                  type="detail"
                  :icon="'icon_operate_edit'"
                  @click="toEdit(scope.row)"
                ></g-button>
                <g-button
                  v-if="scope.row.status == 'disabled'"
                  :name="'启用'"
                  :type="'mgreen'"
                  :icon="'icon_operate_recover'"
                  @click="using(scope.row)"
                ></g-button>
                <g-button
                  v-if="scope.row.status == 'enabled'"
                  :name="'停用'"
                  :type="'red'"
                  :icon="'icon_operate_disable'"
                  @click="disable(scope.row)"
                ></g-button>
                <!-- <g-button
                  :name="'删除'"
                  type="cancel"
                  :icon="'icon_operate_delete'"
                  @click="deleted(scope.row)"
                ></g-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- </el-checkbox-group> -->
        </div>
        <div class="pages-line">
          <div class="batch-btn">
            <!-- <el-checkbox
              v-model="checkAllFlag"
              @change="checkAllChange"
              style="margin-right: 10px;"
              :indeterminate="isAllCheck"
            >全选</el-checkbox>-->
          </div>
          <el-pagination
            style="margin-right: 12px;"
            class="pagination"
            @current-change="handlePageChanged"
            :current-page="params.currentPage"
            :page-size="params.pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- question plaint -->
    <!-- 启用提示框 -->
    <g-del-model
      :delTagDialogVisible="usingHintVisible"
      @confirm="confirmUsing"
      @close="usingHintVisible = false"
      title="确定要重新启用吗？"
      content="启用后，该分红方案将即时恢复。"
      icon="icon_popup_question"
      iconColor="#F52D56"
      :btnLoad="btnLoad"
    ></g-del-model>
    <!-- 停用提示框 -->
    <g-del-model
      :delTagDialogVisible="disableHintVisible"
      @confirm="confirmDisable"
      @close="disableHintVisible = false"
      title="确定要重新停用吗？"
      content="停用后，该分红方案将即时失效。"
      icon="icon_popup_question"
      iconColor="#F52D56"
    ></g-del-model>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import { Base64 } from "js-base64";
export default {
  props: {
    storeBonusPlan: {
      type: Array,
      default: () => []
    },
    participationName: String
  },
  data() {
    return {
      utils,
      params: {
        currentPage: 1,
        pageSize: 10
      },
      timeRange: [],
      pitchSchem: "0", // 选中的方案
      sendRecords: [
        // 表格tags
        {
          label: "分红方案",
          value: "0"
        }
      ],
      shareholderData: [], // 股东列表数据
      loading: false,
      batchShareholderIds: [], // 选中的股东ids
      total: null,
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false,
      storeBonusPlanData: [],
      usingHintVisible: false,
      disableHintVisible: false,
      deletedHintVisible: false,
      btnLoad:false
    };
  },
  mounted() {
    // console.log(this.storeBonusPlan);
    // this.storeBonusPlanData = JSON.parse(JSON.stringify(this.storeBonusPlan))
    this.getParticipationSchemeList();
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  methods: {
    // 检索
    retrieval() {},
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag =
        this.batchShareholderIds.length == this.shareholderData.length;
      this.isAllCheck =
        checkedCount > 0 && checkedCount < this.shareholderData.length;
    },
    // 全选按钮点击
    checkAllChange(checked) {
      // 半选状态取消
      this.isAllCheck = false;
      if (checked) {
        this.shareholderData.forEach((item, index) => {
          if (this.batchShareholderIds.indexOf(item.id) == -1) {
            this.batchShareholderIds.push(item.id);
          }
        });
      } else {
        this.batchShareholderIds = [];
      }
    },
    // 获取分红方案信息
    async getParticipationSchemeList() {
      this.loading = true;
      try {
        const res = await axios.post("/getShareholderStoreBonusPlanPagedList", {
          ...this.params,
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          name: this.participationName
        });
        this.storeBonusPlanData = res.planInfoForPagedLists;
        this.total = res.total;
      } finally {
        this.loading = false;
      }
    },
    // 表格分页切换事件
    handlePageChanged(index) {
      this.params.currentPage = index;
      this.getParticipationSchemeList();
      this.batchShareholderIds = [];
      this.checkAllFlag = false;
      this.isAllCheck = false;
    },
    // 编辑
    toEdit(data) {
      this.$emit("editParticipation", data);
    },
    // 启用
    using(row) {
      this.currentData = row
      this.usingHintVisible = true;
    },
    confirmUsing() {
      this.useOrdisParticipation('enabled')
    },
    // 停用
    disable(row) {
      this.currentData = row
      this.disableHintVisible = true
    },
    confirmDisable() {
      this.useOrdisParticipation('disabled')
    },
    // 分红方案启用停用
    async useOrdisParticipation(type) {
      this.btnLoad = true
      try {
        const res  =  await axios.post('/addOrModifyShareholderStoreBonusPlan', {
          ...this.currentData,
          status: type
        })
        if (!res.success) return this.$message.error(type == 'enabled' ? '启用失败' : '停用失败')
        this.$message.success(type == 'enabled' ? '启用成功' : '停用成功')
        this.usingHintVisible = false
        this.disableHintVisible = false
        this.getParticipationSchemeList()
      } finally {
        this.btnLoad = false
      }
    },
    // 删除
    deleted() {}
  },
  watch: {
    participationName(v, o) {
      this.handlePageChanged(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-main {
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 144px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
    padding: 0 10px;
  }
  .pages-line {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .batch-btn {
      margin-left: 30px;
    }
  }
}

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
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

/deep/ .edit-group {
  span {
    margin-right: 4px;
  }
}

.check_single {
  margin-left: 5px;
  display: inline-block;
  /deep/ .el-checkbox__input {
    margin: 0px 15px 0 0;
  }
  /deep/ .el-checkbox__label {
    display: none;
  }
}
</style>