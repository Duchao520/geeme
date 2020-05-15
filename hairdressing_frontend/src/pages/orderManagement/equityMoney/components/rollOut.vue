<template>
  <div class="reCharge-box">
    <el-checkbox-group v-model="settleApplyIds" @change="handleChecked">
      <el-table
        :data="tableData"
        height="calc(100vh - 389px)"
        stripe
        style="width: 100%; padding: 0 10px;"
        v-loading.fullscreen.lock="pageLoading"
      >
        <el-table-column label="转出申请时间">
          <template slot-scope="{ row }">
            <el-checkbox :label="row.applyId" class="check_single">
              <p class="activity-name">{{ row.createTime || '-'}}</p>
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名">
          <template slot-scope="scope">
            <div class="client_area">
              <div class="client_msg">
                <div class="client_img">
                  <img
                    :src="formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                  />
                  <img
                    class="sex_icon"
                    v-if="scope.row.sex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img
                    class="sex_icon"
                    v-else-if="scope.row.sex == '男'"
                    src="@/assets/img/male_tip.png"
                  />
                </div>
                <div class="client_info">
                  <p>{{scope.row.nickName}}</p>
                  <span>
                    <span class="send-type-tags">{{scope.row.memberLevel}}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column label="申请转出金额">
          <template slot-scope="scope">
            <p>￥{{scope.row.amount.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="转出时间"></el-table-column>
        <el-table-column prop="type" label="转出方式">
          <template slot-scope="{ row }">
            <p>{{ row.type == 1 ? '钱包余额' : '银行卡'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="{ row }">
            <status-text :name="filterStatus(row,'title')" :type="filterStatus(row,'color')" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="转账状态">
          <template slot-scope="{ row }">
            <p v-if="row.status != 2 || row.status != 5">-</p>
            <div v-else>
              <status-text v-if="row.billStatus" :name="'已结算'" :type="'green'" />
              <status-text v-else :name="'未结算'" :type="'orange1'" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作人">
          <template slot-scope="{ row }">
            <p>{{ row.staffName || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作" width="250">
          <template slot-scope="{ row }">
            <g-button
              :name="'查看进度'"
              :type="'green'"
              :icon="'icon_operate_eyes'"
              @click="lookPlan(row)"
            ></g-button>
            <!-- 总部操作 -->
            <g-button
              :name="'同意'"
              v-if="row.status == 3 && row.type == 1 && isBrand"
              :type="'detail'"
              :icon="'icon_order_hedui1'"
              @click="consentByBrand(row)"
            ></g-button>
            <g-button
              :name="'拒绝'"
              :type="'red'"
              :icon="'icon_operate_disable'"
              v-if="row.status == 3 && row.type == 1 && isBrand"
              @click="turnDown(row)"
            ></g-button>
            <g-button
              :name="'结算'"
              v-if="(row.status == 2 || row.status == 5) && row.billStatus == 0 && isBrand"
              :type="'green'"
              :icon="'icon_order_hedui1'"
              @click="settleAccounts(row, 'single')"
            ></g-button>
            <!-- 门店操作 -->
            <g-button
              :name="'同意'"
              v-if="row.status == 1 && !isBrand"
              :type="'detail'"
              :icon="'icon_order_hedui1'"
              @click="consent(row)"
            ></g-button>
            <g-button
              :name="'重审'"
              v-if="row.status == 6 && !isBrand"
              :type="'detail'"
              :icon="'icon_operate_recover'"
              @click="retrial(row)"
            ></g-button>
            <!-- <g-button
            :name="'撤回'"
            v-if="row.status == 2"
            :type="'detail'"
            :icon="'icon_operate_recover'"
            @click="withdraw(row)"
            ></g-button>-->
            <g-button
              :name="'拒绝'"
              :type="'red'"
              :icon="'icon_operate_disable'"
              v-if="row.status == 1  && !isBrand"
              @click="turnDown(row)"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
    <!-- 分页区域 -->
    <div class="pagination">
      <div class="batch-container">
        <el-checkbox
          v-model="checkAllFlag"
          @change="checkAllChange"
          style="margin-right: 10px;"
          :indeterminate="isAllCheck"
        >全选</el-checkbox>
        <g-button
          :name="'结算'"
          :type="'green'"
          :icon="'icon_order_hedui1'"
          @click="settleAccounts({}, 'both')"
        ></g-button>
      </div>
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

    <!-- 同意 -->
    <g-dialog-with-slot
      v-if="consentDialogVisible"
      :dialogVisible="consentDialogVisible"
      class="consent-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="consentTitle"
      @resolve="consentConfirm(consentQureyType)"
      @close="consentClose"
      :btnLoad="btnLoad"
      width="600px"
    >
      <div class="consent-container">
        <el-form
          :model="consentForm"
          :rules="consentRules"
          ref="consentForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="转出方式：" prop="name">
            <p>{{pitchRow.type == 1 ? '钱包余额' : '银行卡'}}</p>
            <p style="color: #FF8177" v-if="pitchRow.type == 1">{{ consentHint }}</p>
          </el-form-item>
          <!-- <el-form-item label="门店结算：" prop="name">
            <el-radio-group v-model="consentForm.billStatus">
              <el-radio :label="false">未结算</el-radio>
              <el-radio :label="true">已结算</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="备注：" prop="remark">
            <el-input
              type="textarea"
              style="width: 300px;"
              :rows="2"
              placeholder="可以填写转出说明"
              v-model="consentForm.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="转账凭证：">
            <g-upload-spic
              @change="updateDefaultImg"
              :photo="consentForm.photo"
              :size="2"
              width="100px"
              height="100px"
            ></g-upload-spic>
          </el-form-item>
        </el-form>
      </div>
    </g-dialog-with-slot>

    <!-- 拒绝 -->
    <g-dialog-with-slot
      v-if="turnDownDialogVisible"
      :dialogVisible="turnDownDialogVisible"
      class="turnDown-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定拒绝转出吗?'"
      @resolve="consentConfirm(2)"
      @close="turnDownClose"
      :btnLoad="btnLoad"
      width="600px"
    >
      <div class="turnDown-container">
        <el-form
          :model="turnDownForm"
          :rules="turnDownRules"
          ref="turnDownForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="转出方式：" prop="name" style="margin-top: 30px;">
            <p>{{pitchRow.type == 1 ? '钱包余额' : '银行卡'}}</p>
          </el-form-item>
          <el-form-item label="理由：" prop="reason">
            <el-input
              type="textarea"
              style="width: 300px;"
              :rows="2"
              placeholder="请简述拒绝理由"
              v-model="turnDownForm.reason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </g-dialog-with-slot>

    <!-- 总部同意 -->
    <g-dialog-with-slot
      v-if="consentByBrandDialogVisible"
      :dialogVisible="consentByBrandDialogVisible"
      class="consentByBrand-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定同意转出吗?'"
      @resolve="consentByBrandConfirm"
      @close="consentByBrandClose"
      :btnLoad="btnLoad"
      width="600px"
    >
      <div class="consentByBrand-container">
        <el-form
          :model="consentByBrandForm"
          :rules="consentByBrandRules"
          ref="consentByBrandForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="转出方式：" prop="name" style="margin-top: 30px;">
            <p>{{pitchRow.type == 1 ? '钱包余额' : '银行卡'}}</p>
          </el-form-item>
          <el-form-item label="门店结算：" prop="billStatus">
            <el-radio-group v-model="consentByBrandForm.billStatus">
              <el-radio :label="0">未结算</el-radio>
              <el-radio :label="1">已结算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              type="textarea"
              style="width: 300px;"
              :rows="2"
              placeholder="可以填写转出说明"
              v-model="consentByBrandForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </g-dialog-with-slot>

    <!-- 结算 -->
    <g-dialog-with-slot
      v-if="settleDialogVisible"
      :dialogVisible="settleDialogVisible"
      class="settle-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定结算吗?'"
      @resolve="settleConfirm"
      @close="settleDialogVisible=false"
      :btnLoad="btnLoad"
    >
      <p>结算后，权益金将转出到钱包余额中。</p>
    </g-dialog-with-slot>

    <!-- 查看进度弹框 -->
    <el-dialog title="查看进度" :visible.sync="planDialogVisible" width="780px" v-if="planData.length">
      <div class="box-card" v-loading="planLoad">
        <div
          class="box-card-item"
          v-for="item in planData"
          :key="item.id"
          :class="{'height-box': item.opType == 2}"
        >
          <div class="timeLine"></div>
          <i
            class="el-icon-circle-check"
            style="color: #4A9546"
            v-if="item.opType == 1 || item.opType == 4 || item.opType == 2"
          ></i>
          <i
            class="el-icon-remove"
            style="color: #F19E3A"
            v-if="item.opType == 3 || item.opType == 5"
          ></i>
          <i class="el-icon-circle-check" style="color: #4A9546" v-if="item.opType == 6"></i>
          <i class="el-icon-remove" style="color: #F5A623" v-if="item.opType == 7"></i>
          <p class="textTitle">{{ planText(item.opType) }}</p>
          <p class="textInfo">
            <span v-if="item.opType == 1">申请转出金额：￥{{ item.amount.toFixed(2) }}</span>
            <span v-if="item.opType == 2 || item.opType == 4">转出金额：￥{{ item.amount.toFixed(2) }}</span>
            <span v-if="item.opType == 7">修改转出金额：￥{{ item.amount.toFixed(2) }}</span>
            <span
              v-if="item.opType == 1 || item.opType == 7"
            >转出方式：{{ pitchRow.type == 2 ? '银行卡' : '钱包余额' }}</span>
            <span v-if="item.opType == 2 || item.opType == 4">备注：{{ item.remark || ' -' }}</span>
            <span v-if="item.opType == 2" class="plan-photo">
              转账凭证：
              <img v-if="item.photo" :src="utils.formatPicImg(item.photo)" alt />
              <!-- {{ item.photo ? '' : '-' }} -->

              <span v-else>-</span>
            </span>
            <span v-if="item.opType == 3 || item.opType == 5">拒绝理由：{{ item.reason || ' -' }}</span>
            <span>{{ item.createTime }}</span>
          </p>
          <div
            class="customer-info"
            v-if="pitchRow.type == 2 && item.accountName && (item.opType == 1 || item.opType == 7)"
          >
            <h4>{{item.accountName}}</h4>
            <p>账号：{{ item.accountNum }}</p>
            <p>银行：{{ item.bankName }}</p>
            <p>开户行：{{ item.openBank }}</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 撤回， 没有！ -->
    <!-- <g-dialog-with-slot
      v-if="withdrawDialogVisible"
      :dialogVisible="withdrawDialogVisible"
      class="withdraw-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定撤回拒绝吗?'"
      @resolve="consentConfirm(2)"
      @close="withdrawDialogVisible=false"
      :btnLoad="btnLoad"
      width="600px"
    >
    </g-dialog-with-slot>-->
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
    // 模糊匹配
    keyword(val) {
      this.filterData.mobile = val;
      this.filterData.username = val;
      this.getRecharge();
    }
  },
  filters: {},
  data() {
    return {
      utils,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      total: null,
      tableData: [],
      pageLoading: false,
      pageNum: 1,
      pageSize: 10,
      consentDialogVisible: false,
      pitchRow: {},
      consentTitle: "确定同意转出吗?",
      consentHint: "同意后，将向总部发起转出申请。",
      consentQureyType: 1,
      consentForm: {
        billStatus: null,
        remark: "",
        photo: ""
      },
      consentRules: {},
      turnDownDialogVisible: false,
      turnDownForm: {
        reason: ""
      },
      turnDownRules: {
        reason: [
          { required: true, message: "请输入拒绝理由", trigger: "blur" },
          { required: true, message: "请输入拒绝理由", trigger: "change" }
        ]
      },
      withdrawDialogVisible: false,
      // 总部操作变量
      consentByBrandDialogVisible: false,
      consentByBrandForm: {
        remark: "",
        billStatus: 0
      },
      consentByBrandRules: {},
      settleDialogVisible: false,
      settleApplyIds: [],
      btnLoad: false,
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false,
      // 进度弹框load
      planLoad: false,
      planDialogVisible: false,
      planData: [],
      settleFlag: "single"
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    isBrand() {
      return this.currentEntry == "brand";
    },
    // 进度转账完成标识
    transPass() {
      return this.planData.filter(item => item.type === 3).length;
    },
    /* 当前品牌Logo */
    brandLogo() {
      return this.$store.state.manage.currentInfo.brandLogo;
    }
  },
  mounted() {
    // this.getIncomeRecord();
  },
  methods: {
    async getIncomeRecord() {
      // 获取数据
      this.pageLoading = true;
      try {
        const res = await axios.post("/getPreMoneyOutApplyListForPc", {
          ...this.filterData,
          brandId: this.currentInfo.brandId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          storeId: this.isBrand
            ? this.filterData.storeId
            : this.currentInfo.shopId,
          timeFrom: this.filterData.timeFrom
            ? this.filterData.timeFrom + " 00:00:00"
            : null,
          timeTo: this.filterData.timeTo
            ? this.filterData.timeTo + " 23:59:59"
            : null
        });
        this.tableData = res.preMoneyOutApplyInfoList;
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
    async lookPlan(row) {
      this.pitchRow = row;
      this.planLoad = true;

      Promise.all([
        axios.post("/getPreMoneyOutApplyProgress", {
          applyId: row.applyId,
          customer: false
        })
      ])
        .then(([res_1]) => {
          this.planData = res_1.progressInfoList;
          this.planDialogVisible = true;
          this.planLoad = false;
          this.$nextTick(() => {
            this.judgeLine();
          });
        })
        .catch(err => {
          this.planLoad = false;
          this.$message.error("接口请求失败，请稍后再试");
        });

      // try {
      //   const res = await axios.post("/getPreMoneyOutApplyProgress", {
      //     applyId: row.applyId,
      //     customer: false
      //   });
      //   this.planData = res.progressInfoList;
      //   this.planDialogVisible = true;
      // } finally {
      //   this.$nextTick(() => {
      //     this.judgeLine();
      //   });
      //   this.planLoad = false;
      // }
    },
    // 同意
    consent(row) {
      this.pitchRow = row;
      this.consentTitle = "确定同意转出吗?";
      this.consentHint = "同意后，将向总部发起转出申请。";
      this.consentQureyType = 1;
      this.consentDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consentForm.resetFields();
      });
    },
    // 总部同意
    consentByBrand(row) {
      this.pitchRow = row;
      this.consentByBrandDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.consentByBrandForm.resetFields();
      });
    },
    async consentByBrandConfirm() {
      this.$refs.consentByBrandForm.validate(async valid => {
        if (!valid) return;
        this.btnLoad = true;
        try {
          const res = await axios.post("/dealPreMoneyInBrand", {
            applyId: this.pitchRow.applyId,
            billStatus: this.consentByBrandForm.billStatus,
            remark: this.consentByBrandForm.remark,
            type: 1
          });
          if (!res.success) return this.$message.error(res.message);
          this.$message.success("操作成功");
          this.getIncomeRecord();
          this.consentByBrandDialogVisible = false;
        } finally {
          this.btnLoad = false;
        }
      });
    },
    consentClose() {
      this.$refs.consentForm.resetFields();
      this.consentForm.photo = "";
      this.consentDialogVisible = false;
    },
    consentByBrandClose() {
      this.$refs.consentByBrandForm.resetFields();
      // this.consentForm.photo = ''
      this.consentByBrandDialogVisible = false;
    },
    // 重审
    retrial(row) {
      this.pitchRow = row;
      this.consentTitle = "确定重新提交审核吗?";
      this.consentHint = "将向总部重新发起转出申请。";
      this.consentQureyType = 3;
      this.consentDialogVisible = true;
    },
    // 拒绝
    turnDown(row) {
      this.pitchRow = row;
      this.turnDownDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.turnDownForm.resetFields();
      });
    },
    turnDownClose() {
      this.$refs.turnDownForm.resetFields();
      this.turnDownForm.reason = "";
      this.turnDownDialogVisible = false;
    },
    // 单个结算
    settleAccounts(row, flag) {
      if (flag == "both") {
        if (!this.settleApplyIds.length)
          return this.$message.error("请至少选择一个记录！");
      }
      this.settleFlag = flag;
      this.pitchRow = row;
      // this.settleApplyIds = [row.applyId];
      this.settleDialogVisible = true;
    },
    async settleConfirm() {
      this.btnLoad = true;
      try {
        const res = await axios.post("/billPreMoneyApplyByIds", {
          applyId:
            this.settleFlag == "both"
              ? this.settleApplyIds
              : [this.pitchRow.applyId],
          brandId: this.currentInfo.brandId
        });
        if (!res.success) return this.$message.error(res.message);
        this.$message.success("操作成功");
        this.getIncomeRecord();
        this.settleDialogVisible = false;
      } finally {
        this.btnLoad = false;
        this.settleApplyIds = [];
      }
    },
    // 撤回拒绝
    // withdraw(row) {
    //   this.pitchRow = row;
    //   this.withdrawDialogVisible = true;
    // },
    updateDefaultImg(val) {
      this.consentForm.photo = val;
      this.$message.success("图片上传成功");
    },
    async consentConfirm(type) {
      let ref = type == 2 ? "turnDownForm" : "consentForm";
      let url =
        type == 3
          ? "/preMoneyCommitAgain"
          : this.isBrand
          ? "/dealPreMoneyInBrand"
          : "/dealPreMoneyInStore";
      this.$refs[ref].validate(async valid => {
        if (!valid) return;
        this.btnLoad = true;
        try {
          const res = await axios.post(url, {
            applyId: this.pitchRow.applyId,
            billStatus:
              type == 3 || this.isBrand ? null : !!this.pitchRow.billStatus,
            photo: this.isBrand ? null : this.consentForm.photo,
            remark: this.isBrand ? null : this.consentForm.remark,
            reason: this.turnDownForm.reason,
            storeId: this.isBrand ? null : this.currentInfo.shopId,
            type: type == 3 ? null : type
          });
          if (!res.success) return this.$message.error(res.message);
          this.$message.success("操作成功");
          type == 2 ? this.turnDownClose() : this.consentClose();
          // this.getIncomeRecord();
          this.handleCurrentChange(this.pageNum);
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 全选按钮点击
    checkAllChange(checked) {
      // 半选状态取消
      this.isAllCheck = false;
      if (checked) {
        this.tableData.forEach((item, index) => {
          if (this.settleApplyIds.indexOf(item.applyId) == -1) {
            this.settleApplyIds.push(item.applyId);
          }
        });
      } else {
        this.settleApplyIds = [];
      }
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag = this.settleApplyIds.length == this.tableData.length;
      this.isAllCheck =
        checkedCount > 0 && checkedCount < this.tableData.length;
    },
    filterStatus(row, type) {
      switch (row.status) {
        case 1:
          return type == "title" ? "待审核" : "blue";
        case 2:
          return type == "title" ? "已转出" : "green";
        // 如果是银行卡， 门店同意则表示转出
        case 3:
          return type == "title"
            ? row.type == 1
              ? "待总部审核"
              : "已转出"
            : row.type == 1
            ? "blue"
            : "green";
        case 4:
          return type == "title" ? "已拒绝" : "orange1";
        case 5:
          return type == "title" ? "已转出" : "green";
        case 6:
          return type == "title" ? "总部已拒绝" : "orange1";
        default:
          return type == "title" ? "已取消" : "hui";
      }
    },
    planText(type) {
      switch (type) {
        case 1:
          return "客户提交申请";
        case 2:
          return this.pitchRow.type == 2
            ? "门店已同意，转出完成"
            : "门店已同意，申请总部审核中";
        case 3:
          return "申请被商家拒绝";
        case 4:
          return "总部已同意，转出完成";
        case 5:
          return "申请被总部拒绝";
        case 6:
          return "客户取消了申请";
        case 7:
          return "客户修改了申请";
      }
    },
    judgeLine() {
      // 原生js排他算法。。
      let lines = document.getElementsByClassName("timeLine");
      for (let i = 0; i < lines.length; i++) {
        lines[i].style.display = "block";
      }
      lines[lines.length - 1].style.display = "none";
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

.consent-container {
  margin-right: 100px;
}

.consent-dialog {
  /deep/ .dialog-body div.icon {
    margin-left: 30px;
  }
}

.check_single {
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.activity-name {
  display: inline-block;
  // width: 110px;
  // vertical-align: middle;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.batch-container {
  display: flex;
  align-items: center;
}

.box-card {
  position: relative;
  .box-card-item {
    position: relative;
    .timeLine {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(14px);
      width: 2px;
      height: 100%;
      background-color: #ccc;
    }
    i {
      z-index: 9999;
      position: absolute;
      padding-bottom: 5px;
      left: 50%;
      top: -4px;
      font-size: 30px;
      background-color: #fff;
    }
    .customer-info {
      position: absolute;
      top: 0;
      transform: translateX(40px);
      left: 50%;
      width: 230px;
      height: 100px;
      margin-top: 10px;
      padding: 5px 10px 10px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      h4,
      p {
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis; /*超出部分用...代替*/
      }
    }
  }
}

.box-card {
  p.textTitle {
    margin-left: 43px;
    font-size: 16px;
    color: #000;
    text-align: right;
    width: 320px;
  }
  p.textInfo {
    width: 320px;
    text-align: right;
    margin-left: 43px;
    margin-top: 10px;
    margin-bottom: 10px;
    span {
      display: block;
      color: #bcbcbc;
      width: 320px;
      // max-width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; /*超出部分用...代替*/
      &.plan-photo {
        position: absolute;
        top: 34px;
        right: 55px;
        img,
        span {
          display: inline-block;
          text-align-last: left;
          vertical-align: top;
          width: 200px;
          height: 90px;
        }
      }
    }
    div {
      span {
        display: inline-block;
        vertical-align: top;
        background-color: #ededed;
        width: 100px;
        height: 100px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  section.textImg {
    margin-left: 43px;
    margin-top: 10px;
    section.imgBox {
      color: #bcbcbc;
      width: 100%;
      overflow: hidden;
      span {
        margin-left: 30px;
        display: inline-block;
        vertical-align: top;
        background-color: #ededed;
        width: 120px;
        height: 100px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

/deep/ .el-dialog {
  border-radius: 5px;
}

.height-box {
  min-height: 130px;
}
</style>