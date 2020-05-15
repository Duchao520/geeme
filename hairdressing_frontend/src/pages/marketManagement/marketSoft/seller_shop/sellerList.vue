<template>
  <div class="seller-list">
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
        <el-checkbox-group v-model="batchSellerIds" @change="handleChecked">
        <el-table
          stripe
          :data="sellerData"
          height="calc(100vh - 352px)"
          v-loading="loading"
        >
          <el-table-column label="推客信息" width="200">
            <template slot-scope="scope">
              <div class="client_area">
                <el-checkbox :label="scope.row.id" class="check_single"></el-checkbox>
                <div class="client_msg">
                  <div class="client_img">
                    <img v-if="scope.row.headPortrait" :src="scope.row.headPortrait" />
                    <img
                      v-else
                      :src="
                        utils.formatPicImage(
                          scope.row.headPortrait,
                          'style',
                          40,
                          'someone',
                          scope.row.sex
                        )
                      "
                    />
                    <img
                      class="sex_icon"
                      v-if="scope.row.sex == '女'"
                      src="@/assets/img/female_tip.png"
                    />
                    <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                  </div>
                  <div class="client_info">
                    <p>{{ scope.row.name }}</p>
                    <p>{{ scope.row.mobile }}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="parentSellerId" show-overflow-tooltip label="邀请人">
            <template slot-scope="{ row }">
              <p v-if="row.parentSellerId === 0">无邀请人</p>
              <div v-else>
                <p>{{ sellerName(row.parentSellerId) }}</p>
                <p>{{ row.parentMobile }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="加入时间"></el-table-column>
          <el-table-column prop="customerNum" show-overflow-tooltip label="绑定客户数"></el-table-column>
          <el-table-column prop="childNum" show-overflow-tooltip label="邀请推客数"></el-table-column>
          <el-table-column prop="expectAmount" show-overflow-tooltip label="累计佣金">
            <template slot-scope="{ row }">
              <p>{{ row.expectAmount ?  "￥" + row.expectAmount.toFixed(2) : '￥0.00' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="realAmount" show-overflow-tooltip label="待结算">
            <template slot-scope="{ row }">
              <p>{{ row.expectAmount ? "￥" + (row.expectAmount - (row.realAmount || 0)).toFixed(2) : '￥0.00'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="groupId" show-overflow-tooltip label="隶属分组">
            <template slot-scope="{ row }">
              <p>{{ groupName(row.groupId) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="activityName" show-overflow-tooltip label="操作" :width="240">
            <template slot-scope="scope">
              <g-button
                :name="'详情'"
                :type="'green'"
                :icon="'icon_operate_eyes'"
                @click="toDetails(scope.row.id)"
              ></g-button>
              <g-button
                v-if="scope.row.deleted === false"
                :name="'禁用'"
                :type="'red'"
                :icon="'icon_operate_disable'"
                @click="disable(scope.row)"
              ></g-button>
              <g-button
                v-if="scope.row.deleted === true"
                :name="'启用'"
                :type="'mgreen'"
                :icon="'icon_operate_recover'"
                @click="recover(scope.row)"
              ></g-button>
              <g-button
                :name="'修改分组'"
                :type="'detail'"
                class="edit-group"
                @click="editGroup(scope.row)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
        </el-checkbox-group>
      </div>
      <div class="pages-line">
        <div class="batch-btn">
          <el-checkbox
            v-model="checkAllFlag"
            @change="checkAllChange"
            style="margin-right: 10px;"
             :indeterminate="isAllCheck"
          >全选</el-checkbox>
          <g-button
            v-if="sendRecordStatus === '1'"
            :name="'批量禁用'"
            :type="'orangeFill'"
            :icon="'icon_operate_disable'"
            @click="batchDisableSeller"
          ></g-button>
          <g-button
            v-else
            :name="'批量启用'"
            :type="'mgreenFill'"
            :icon="'icon_operate_recover'"
            @click="batchRecoverSeller"
          ></g-button>
          <g-button :name="'修改分组'" :type="'detail'" class="edit-group" @click="batchEditGroup"></g-button>
        </div>
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handlePageChanged"
          :current-page="paramsForm.pageNum"
          :page-size="paramsForm.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 禁用 -->
    <g-del-model
      :delTagDialogVisible="banConfirmVisible"
      @confirm="banSeller"
      @close="banConfirmVisible = false"
      title="确定要将该推客禁用吗？"
      content="禁用后，该推客相关权益即时终止。"
      icon="icon_popup_question"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>
    <!-- 批量禁用 -->
    <g-del-model
      :delTagDialogVisible="batchBanConfirmVisible"
      @confirm="batchBanSeller"
      @close="batchBanConfirmVisible = false"
      title="确定要将这些推客都禁用吗？"
      content="禁用后，这些推客相关权益都将即时终止。"
      icon="icon_popup_question"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>
    <!-- 启用 -->
    <g-del-model
      :delTagDialogVisible="openConfirmVisible"
      @confirm="openSeller"
      @close="openConfirmVisible = false"
      title="确定要将该推客启用吗？"
      content="启用后，该推客相关权益即时开启。"
      icon="icon_popup_success"
      iconColor="#41CAC0"
      :btnLoad="btnLoad"
    ></g-del-model>
    <!-- 批量启用 -->
    <g-del-model
      :delTagDialogVisible="batchOpenConfirmVisible"
      @confirm="batchOpenSeller"
      @close="batchOpenConfirmVisible = false"
      title="确定要将这些推客都启用吗？"
      content="启用后，这些推客相关权益都将即时开启。"
      icon="icon_popup_success"
      iconColor="#41CAC0"
      :btnLoad="btnLoad"
    ></g-del-model>
    <!-- 修改分组对话框 -->
    <el-dialog
      title="修改分组"
      :visible.sync="editGroupDialogVisible"
      width="30%"
      @close="editGroupClose"
    >
      <el-form
        :model="editGroupForm"
        :rules="editGroupRules"
        ref="editGroupRef"
        label-width="120px"
      >
        <el-form-item label="选择分组: " prop="groupId">
          <el-select v-model="editGroupForm.groupId" placeholder="请选择" clearable>
            <el-option
              v-for="item in sellerGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditGroup" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>
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
    sellerform: {
      type: Object,
      default: () => {}
    },
    sellerGroup: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      utils,
      // 加载标识
      loading: false,
      // tab栏选中数据
      sendRecordStatus: "1",
      // tab栏可选数组
      sendRecords: [
        {
          value: "1", // 前端自定义
          label: "已启用"
        },
        // {
        //   value: "WAIT_SEND",
        //   label: "待审核(已禁用)"
        // },
        // {
        //   value: "SENT",
        //   label: "已驳回(已禁用)"
        // },
        {
          value: "2",
          label: "已禁用"
        }
      ],
      // 请求参数
      paramsForm: {},
      // 表格数据
      sellerData: [],
      // 表格数据总数
      total: null,
      // 禁用推客提示框标识
      banConfirmVisible: false,
      // 批量禁用推客提示框标识
      batchBanConfirmVisible: false,
      // 启用推客提示框标识
      openConfirmVisible: false,
      // 批量启用推客提示框标识
      batchOpenConfirmVisible: false,
      // 选中的推客信息
      currentSeller: {},
      // 批量推客id数组
      batchSellerIds: [],
      // 修改分组对话框开关
      editGroupDialogVisible: false,
      // 修改分组表单数据
      editGroupForm: {
        groupId: null
      },
      // 修改分组表单校验
      editGroupRules: {
        groupId: [{ required: true, message: "请选择分组" }]
      },
      batchEditGroupFlag: false,
      btnLoad: false,
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false,
    };
  },
  mounted() {
    this.paramsForm = JSON.parse(JSON.stringify(this.sellerform));
    this.getSellerList();
    // 详情页面关闭时，表格数据刷新
    this.$root.$on("needRefreshPage", data => {
      this.getSellerList();
    });
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage");
  },
  methods: {
    // 全选按钮点击
    checkAllChange(checked) {
      // 半选状态取消
      this.isAllCheck = false
      if (checked) {
        this.sellerData.forEach((item, index) => {
          if (this.batchSellerIds.indexOf(item.id) == -1) {
            this.batchSellerIds.push(item.id);
          }
        });
      } else {
        this.batchSellerIds = [];
      }
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag = this.batchSellerIds.length == this.sellerData.length;
      this.isAllCheck = checkedCount > 0 && checkedCount < this.sellerData.length;
    },
    // 根据分组id返回分组名称
    groupName(id) {
      let name = null;
      this.sellerGroup.forEach(i => {
        if (i.id === id) {
          name = i.name;
        }
      });
      return name;
    },
    // 根据推客id返回推客名称
    sellerName(id) {
      let name = null;
      this.sellerData.forEach(i => {
        if (i.id === id) {
          name = i.name;
        }
      });
      return name;
    },
    // 表格分页切换事件
    handlePageChanged(index) {
      this.paramsForm.pageNum = index;
      this.getSellerList();
      this.batchSellerIds = [];
      this.checkAllFlag = false
      this.isAllCheck = false
    },
    // 获取推客信息列表
    async getSellerList(fatherParams) {
      // 父组件调用时，如果有来自父组件的参数改动， 则让请求参数与实参相同
      if (fatherParams) {
        this.paramsForm = fatherParams;
      }
      let deleted = this.sendRecordStatus === "1" ? false : true;
      this.loading = true;
      const res = await axios.post(`/getSellerList`, {
        ...this.paramsForm,
        brandId: this.currentInfo.brandId,
        deleted
      });
      this.loading = false;
      this.total = res.total;
      this.sellerData = res.sellerInfoList;
    },
    // 详情
    toDetails(id) {
      // 在新的标签页中打开推客详情，对id进行加密处理
      this.toPagesInNewTags(
        `/shop-inner/promotion-commission/propagandist-detail/${Base64.encode(
          id
        )}`
      );
      // this.$router.push({name:'/shop-inner/promotion-commission/propagandist-detail',params:{id}})
    },
    // 禁用
    disable(row) {
      this.currentSeller = row;
      this.banConfirmVisible = true;
    },
    // 确认禁用推客
    async banSeller() {
      let deleted = this.banConfirmVisible;
      this.btnLoad = true;
      axios
        .post("/UpdateSeller", {
          id: this.currentSeller.id,
          deleted
        })
        .then(res => {
          if (deleted) {
            if (!res.success) return this.$message.error("禁用推客失败");
            this.$message.success("禁用推客成功");
            this.btnLoad = false;
            this.banConfirmVisible = false;
          } else {
            if (!res.success) return this.$message.error("启用推客失败");
            this.$message.success("启用推客成功");
            this.btnLoad = false;
            this.openConfirmVisible = false;
          }
          // 调用父组件事件刷新列表数据
          this.$parent.retrieval();
        })
        .catch(() => {
          this.btnLoad = false;
        });
    },
    // 推客列表选中
    // handleSelectionChange(arr) {
    //   this.batchSellerIds = arr.map(i => i.id);
    //   console.log(this.batchSellerIds);
    // },
    // 批量禁用
    batchDisableSeller() {
      if (this.batchSellerIds.length < 1)
        return this.$message.error("请至少勾选1个推客进行批量处理");
      this.batchBanConfirmVisible = true;
    },
    // 批量禁用确认
    async batchBanSeller() {
      let deleted = this.batchBanConfirmVisible;
      this.btnLoad = true;
      axios.post("/BatchUpdateSeller", {
        deleted,
        ids: this.batchSellerIds
      }).then(res => {

        if (deleted) {
          if (!res.success) return this.$message.error("批量禁用推客失败");
        this.$message.success("批量禁用推客成功");
        this.btnLoad = false;
        this.batchBanConfirmVisible = false;
      } else {
        if (!res.success) return this.$message.error("批量启用推客失败");
        this.$message.success("批量启用推客成功");
        this.btnLoad = false;
        this.batchOpenConfirmVisible = false;
      }
      // 调用父组件事件刷新列表数据
      this.$parent.retrieval();
      })
      .catch(() => {
        this.btnLoad = false;
      })
    },
    // 重新启用推客
    recover(row) {
      this.currentSeller = row;
      this.openConfirmVisible = true;
    },
    // 确认启用
    openSeller() {
      // 共用禁用启用事件
      this.banSeller();
    },
    // 批量启用
    batchRecoverSeller() {
      if (!this.batchSellerIds.length)
        return this.$message.error("请至少选择1个推客进行批量处理");
      this.batchOpenConfirmVisible = true;
    },
    // 批量启用确认
    batchOpenSeller() {
      // 共用批量事件
      this.batchBanSeller();
    },
    // 修改分组
    editGroup(row) {
      this.currentSeller = row;
      this.editGroupDialogVisible = true;
      this.batchEditGroupFlag = false;
      this.editGroupForm.groupId = row.groupId;
    },
    // 修改分组关闭事件
    editGroupClose() {
      this.$refs.editGroupRef.resetFields();
    },
    // 修改分组确认
    confirmEditGroup() {
      if (!this.batchEditGroupFlag) {
        this.$refs.editGroupRef.validate(async valid => {
          if (!valid) return;
          this.btnLoad = true;
          axios
            .post("/UpdateSeller", {
              id: this.currentSeller.id,
              groupId: this.editGroupForm.groupId
            })
            .then(res => {
              if (!res.success) return this.$message.error("修改分组失败");
              this.$message.success("修改分组成功");
              this.editGroupDialogVisible = false;
              this.btnLoad = false;
              this.getSellerList();
            })
            .catch(() => {
              this.btnLoad = false;
            });
        });
      } else {
        this.$refs.editGroupRef.validate(async valid => {
          if (!valid) return;
          this.btnLoad = true;
          axios
            .post("/BatchUpdateSeller", {
              ids: this.batchSellerIds,
              groupId: this.editGroupForm.groupId
            })
            .then(res => {
              if (!res.success) return this.$message.error("批量修改分组失败");
              this.$message.success("批量修改分组成功");
              this.editGroupDialogVisible = false;
              this.btnLoad = false;
              this.getSellerList();
            })
            .catch(() => {
              this.btnLoad = false;
            });
        });
      }
    },
    // 批量修改分组
    batchEditGroup() {
      if (!this.batchSellerIds.length)
        return this.$message.error("请至少选择1个推客进行批量处理");
      this.editGroupDialogVisible = true;
      this.batchEditGroupFlag = true;
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {
    sellerform(val) {
      console.log(val);
    },
    // tab切换监听
    sendRecordStatus(val) {
      this.handlePageChanged(1);
    }
  }
};
</script>

<style lang="scss" scoped>
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
