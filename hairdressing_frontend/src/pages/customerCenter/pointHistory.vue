<template>
  <div class="pages-main-box">
    <div class="pages-edit-container">
      <div class="point-history">
        <!-- 统计 -->
        <div class="total-line" v-loading="totalLoading">
          <totalDataInPiece :list="list">
            <template v-if="slotData" slot="header-edit">
              <div class="edit-point">
                <g-button :name="'修正'" :type="'detail'" :icon="'icon_operate_edit'" @click="toEdit"></g-button>
              </div>
            </template>
            <template v-if="slotData" slot="bottom">
              <div class="slot-points">
                <span class="bold">{{slotData}}</span>
                <span>将于 {{slotDate}} 到期</span>
              </div>
            </template>
          </totalDataInPiece>
        </div>
        <div class="point-history-list">
          <el-table :data="tableData" height="calc(100vh - 350px)">
            <el-table-column label="时间" prop="createTime"></el-table-column>
            <el-table-column label="积分变动类型" prop="changeType"></el-table-column>
            <el-table-column label="行为说明" prop="description">
              <template slot-scope="{row}">
                <p
                  v-for="(desc, idx) in row.description.split('#')"
                  :key="Math.random() + '' + idx"
                >{{desc}}</p>
              </template>
            </el-table-column>
            <el-table-column label="积分变动值" prop="integral">
              <template slot-scope="{row}">
                <span class="green" :class="{red: Number(row.integral) < 0}">{{row.integral}}</span>
              </template>
            </el-table-column>
            <el-table-column label="变动后剩余积分" prop="allIntegral"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <g-button
                  v-if="row.changeType == '修正' && row.surplusIntegral > 0"
                  :name="'回退'"
                  :type="'green'"
                  :icon="'icon_ope_revoke'"
                  @click="rollback(row)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <!-- 分页 -->
            <el-pagination
              class="pagination"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 修正积分 -->
    <el-dialog
      title="修正积分余额"
      :visible.sync="editDialogVisible"
      width="576px"
      :before-close="editHandleClose"
      class="edit-point"
    >
      <el-form
        :model="editPointForm"
        :rules="editPointRules"
        ref="editPointForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="当前积分：">
          <p>{{ list[3].value }}</p>
        </el-form-item>
        <el-form-item label="增加积分：" prop="integral">
          <el-input v-model.number="editPointForm.integral" placeholder="限数字" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="修正原因：" prop="description">
          <el-input
            v-model="editPointForm.description"
            type="textarea"
            :maxlength="30"
            placeholder="请输入修正原因，限30个字"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHandleClose">取 消</el-button>
        <el-button type="primary" @click="editConfirm" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 回退积分 -->
    <el-dialog
      title="回退积分"
      :visible.sync="rollbackDialogVisible"
      width="576px"
      :before-close="rollbackHandleClose"
      class="edit-point"
    >
      <el-form
        :model="rollbackPointForm"
        :rules="rollbackPointRules"
        ref="rollbackPointForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="可回退积分：">
          <p>{{ pitchRow.surplusIntegral }}</p>
        </el-form-item>
        <el-form-item label="回退积分：" prop="rollbackIntegral">
          <el-input
            v-model.number="rollbackPointForm.rollbackIntegral"
            placeholder="限数字"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="回退原因：" prop="description">
          <el-input
            v-model="rollbackPointForm.description"
            type="textarea"
            :maxlength="30"
            placeholder="请输入修正原因，限30个字"
            style="width: 400px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rollbackHandleClose">取 消</el-button>
        <el-button type="primary" @click="rollbackConfirm" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      pageLoading: false,
      totalLoading: false,

      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,

      slotData: 0, // 即将过期的积分
      slotDate: "", // 即将过期的服务器时间
      list: [
        {
          name: "累计获得积分",
          value: 0,
          showSlot: false
        },
        {
          name: "累计消耗积分",
          value: 0,
          showSlot: false
        },
        {
          name: "累计过期积分",
          value: 0,
          showSlot: false
        },
        {
          name: "剩余积分",
          value: 0,
          showSlot: true
        }
      ],
      editDialogVisible: false,
      editPointForm: {
        integral: null,
        description: null,
        integralChangeType: "storeAddIntegral"
      },
      editPointRules: {
        integral: [
          { required: true, message: "请输入积分", trigger: "change" },
          { required: true, message: "请输入积分", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入原因", trigger: "change" },
          { required: true, message: "请输入原因", trigger: "blur" }
        ]
      },
      rollbackDialogVisible: false,
      rollbackPointForm: {
        integral: null,
        description: null
      },
      rollbackPointRules: {
        rollbackIntegral: [
          { required: true, message: "请输入积分", trigger: "change" },
          { required: true, message: "请输入积分", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入原因", trigger: "change" },
          { required: true, message: "请输入原因", trigger: "blur" }
        ]
      },
      btnLoad: false,
      pitchRow: {},
    };
  },
  created() {
    this.init();
    this.getTotalData();
  },
  methods: {
    init() {
      this.pageLoading = true;
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.currentEntry === "brand") {
        Object.assign(params, { brandCustomerId: this.$route.params.id });
      } else {
        Object.assign(params, { customerId: this.$route.params.id });
      }
      axios
        .post("/getBrandCustomerIntegralRecordPage", params)
        .then(res => {
          this.tableData = res.brandCustomerIntegralRecordInfoList;
          this.total = res.total;
        })
        .then(() => {
          this.pageLoading = false;
        });
    },
    getTotalData() {
      this.totalLoading = true;
      let params = {};
      if (this.currentEntry === "brand") {
        Object.assign(params, { brandCustomerId: this.$route.params.id });
      } else {
        Object.assign(params, { customerId: this.$route.params.id });
      }
      axios
        .post(`/getBrandCustomerIntegralStatisticalInfo/`, params)
        .then(res => {
          this.list[0].value = res.integral; // 累计获得积分
          this.list[1].value = res.integralUsed; // 累计消耗积分
          this.list[2].value = res.integralOverdue; // 累计过期积分
          this.list[3].value = res.integralUnused; // 剩余积分
          this.slotData = res.currentYearOverdue;
          this.slotDate = res.overdueDate;
          this.totalLoading = false;
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.init();
    },
    // 积分修正
    toEdit() {
      this.editDialogVisible = true;
    },
    editHandleClose() {
      this.$refs.editPointForm.resetFields();
      this.editDialogVisible = false;
    },
    editConfirm() {
      this.$refs.editPointForm.validate(async valid => {
        if (!valid) return;
        try {
          this.btnLoad = true;
          const res = await axios.post("/storeAddIntegral", {
            ...this.editPointForm,
            brandCustomerId:
              this.currentEntry == "brand"
                ? Number(this.$route.params.id)
                : null,
            customerId:
              this.currentEntry == "brand"
                ? null
                : Number(this.$route.params.id)
          });
          if (!res.success) return this.$message.error("积分修正失败");
          this.$message.success("积分修正成功");
          this.editHandleClose();
          this.handleCurrentChange(1);
          this.getTotalData();
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 积分回退
    rollback(row) {
      this.pitchRow = row;
      this.rollbackDialogVisible = true;
    },
    rollbackHandleClose() {
      this.$refs.rollbackPointForm.resetFields();
      this.rollbackDialogVisible = false;
    },
    rollbackConfirm() {
      this.$refs.rollbackPointForm.validate(async valid => {
        if (!valid) return;
        try {
          this.btnLoad = true;
          const res = await axios.post("/rollbackStoreAddIntegral", {
            ...this.rollbackPointForm,
            brandCustomerId:
              this.currentEntry == "brand"
                ? Number(this.$route.params.id)
                : null,
            customerId:
              this.currentEntry == "brand"
                ? null
                : Number(this.$route.params.id),
            id: this.pitchRow.id,
            integralChangeType: 'rollbackAddIntegral',
          });
          if (!res.success) return this.$message.error("积分回退失败");
          this.$message.success("积分回退成功");
          this.rollbackHandleClose();
          this.handleCurrentChange(1);
          this.getTotalData();
        } finally {
          this.btnLoad = false;
        }
      });
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {
    'rollbackPointForm.rollbackIntegral' (val) {
      if (val >= this.pitchRow.surplusIntegral) {
        this.rollbackPointForm.rollbackIntegral = this.pitchRow.surplusIntegral
      }
    }
  },
};
</script>
<style lang='scss' scoped>
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}

.point-history {
  max-width: 1440px;
  min-height: 100%;
  box-sizing: border-box;
  padding: 30px 10px 0;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
}
.point-history-list {
  margin-top: 30px;
  padding: 0 10px;
  background: #fff;
  .pagination-box {
    height: 65px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.slot-points {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 10px;
  color: #999;
  .bold {
    color: #333;
    font-weight: bold;
  }
}

.edit-point {
  position: absolute;
  top: 5px;
  right: 0;
}

.green {
  color: green;
  &.red {
    color: red;
  }
}

.edit-point {
  /deep/ .el-dialog {
    border-radius: 5px;
    .el-dialog__header {
      border-bottom: 1px solid #eee;
    }
    .el-dialog__body {
      padding-bottom: 10px;
      padding-top: 10px;
    }
  }
}
</style>
