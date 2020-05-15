<template>
  <div class="shareholder-main">
    <div class="search-line">
      <div class="table-title">
        <el-radio-group v-model="componentId">
          <el-radio-button border class="table-btns" label="ShareholderList">股东列表</el-radio-button>
          <el-radio-button border class="table-btns" label="ClientAffiliation">客户归属</el-radio-button>
          <el-radio-button border class="table-btns" label="TransactionRecord">交易记录</el-radio-button>
          <el-radio-button border class="table-btns" label="StatisticsStatement" v-if="false">统计报表</el-radio-button>
          <el-radio-button border class="table-btns" label="GrossProfitRate">毛利率</el-radio-button>
          <el-radio-button border class="table-btns" label="ParticipationScheme">分红方案</el-radio-button>
          <el-radio-button border class="table-btns" label="helpping" v-if="false">帮助中心</el-radio-button>
        </el-radio-group>

        <el-button
          @click="createShareholder"
          class="normal_red_btn"
          v-if="componentId === 'ShareholderList'"
        >新增股东</el-button>

        <el-button
          @click="createParticipation"
          class="normal_red_btn"
          v-if="componentId === 'ParticipationScheme'"
        >新增方案</el-button>
      </div>
      <!-- <div></div> -->
      <input-search
        v-if="componentId === 'ParticipationScheme'"
        :placeholder="'搜索分红方案名称'"
        width="auto"
        v-model="participationName"
        @search="handleSearchParticipationName"
      />
    </div>
    <!-- 动态表格组件 sonTabsChange在推广统计组件-->
    <component
      :is="componentId"
      ref="componentRef"
      :storeBonusPlan="storeBonusPlan"
      :participationName="participationName"
      :storeList="storeList"
      @editParticipation="editParticipation"
    ></component>
    <!-- 新增分组对话框 -->
    <!-- <el-dialog
      :title="createGroupTitle"
      :visible.sync="groupDialogVisible"
      width="500px"
      @close="groupClose"
    >
      <el-form :model="groupForm" :rules="groupRules" ref="groupRef" label-width="120px">
        <el-form-item label="分组名称：" prop="name">
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" style="width: 270px;"></el-input>
        </el-form-item>
        <el-form-item label="推广提成比例：" prop="sellPercent">
          <el-input
            v-model.number="groupForm.sellPercent"
            style="width: 180px;"
            placeholder="请输入自然数"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="邀请提成比例：" prop="invitePercent">
          <el-input
            v-model.number="groupForm.invitePercent"
            style="width: 180px;"
            placeholder="请输入自然数"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCreateGroup">确 定</el-button>
      </span>
    </el-dialog>-->
    <!-- 未设置提醒 -->
    <!-- <g-del-model
      :delTagDialogVisible="confirmSetVisible"
      @confirm="confirmSetVisible = false"
      @close="confirmSetVisible = false"
      title="暂不可进行此操作！"
      content="请先去设置中保存分销设置，再进行此操作！"
      icon="icon_popup_plaint"
      iconColor="#F52D56"
    ></g-del-model>-->
    <!-- 新增股东对话框 -->
    <el-dialog
      title="新增股东"
      :visible.sync="addShareholderVisible"
      @close="addShareholderClose"
      width="850px"
      :loading="dialogLoad"
      class="add-shareholder"
      top="10vh"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addShareholderForm"
        :rules="addShareholderRules"
        ref="addShareholderRef"
        class="add_shareholder_form"
        label-width="120px"
      >
        <el-form-item
          label="手机号码: "
          label-width="120px"
          prop="shareholderMobile"
          :rules="{ required: true, validator: mobileValid, trigger: 'change'}"
        >
          <!-- <el-select v-model="editGroupForm.groupId" placeholder="请选择" clearable>
            <el-option
              v-for="item in sellerGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <select-customer
            ref="selectCustomer"
            :isBrand="isBrand"
            @choose="selectShareholderMobile"
          ></select-customer>
        </el-form-item>
        <el-form-item label="股东昵称: " label-width="120px">
          <p>{{customerInfo.name}}</p>
        </el-form-item>
        <el-form-item
          label="股东姓名: "
          label-width="120px"
          prop="shareholderRealName"
          :rules="[{ required: true, validator: shareholderRealNameValid, trigger: 'change'},{ required: true, validator: shareholderRealNameValid, trigger: 'blur'}]"
        >
          <el-input v-model="addShareholderForm.shareholderRealName" placeholder="请输入股东姓名"></el-input>
        </el-form-item>

        <el-form-item label="介绍人: " label-width="120px">
          <el-select v-model="introducerShareholder" value-key="id" placeholder="请选择介绍人">
            <el-option
              v-for="item in introducerShareholderList"
              :key="item.id"
              :label="item.shareholderRealName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="权益设置: " :rules="{ required: true }" label-width="120px">
          <div class="rights-set" v-for="(item, index) in addShareholderStoreForm" :key="index">
            <el-form-item
              v-if="isBrand"
              label="权益门店: "
              label-width="120px"
              :prop="'rightsStore'"
              :rules="{ required: true, validator: (r, v, cb) => { rightsStoreValid (r, v, cb,index)}, trigger: 'change'}"
            >
              <el-select
                v-model="item.storeId"
                placeholder="请选择门店"
                @change="(val) => { changeRightsStore(val, index) }"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.storeId"
                  :label="item.storeName"
                  :value="item.storeId"
                ></el-option>
              </el-select>
            </el-form-item>

            <div style="width: 200px;"></div>

            <el-form-item
              label="分红方案: "
              label-width="120px"
              :prop="'shareholderPlanId'"
              :rules="{ required: true, validator: (r, v, cb) => { shareholderPlanIdValid (r, v, cb,index)}, trigger: 'change'}"
            >
              <el-select
                v-model="item.shareholderPlanId"
                :loading="inputLoad"
                placeholder="请选择门店分红方案"
              >
                <el-option
                  v-for="item in (isBrand ?  storeBonusPlanArr[index] : storeBonusPlan)"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <div style="width: 200px;"></div>

            <el-form-item
              label="入股保证金: "
              label-width="120px"
              prop="securityFund"
              :rules="[{ required: true, validator: (r, v, cb) => { securityFundValid (r, v, cb,index)}, trigger: 'change'},{ required: true, validator: (r, v, cb) => { securityFundValid (r, v, cb,index)}, trigger: 'blur'}]"
            >
              <el-radio-group v-model="securityFund[index]" class="securityFund">
                <el-radio :label="true">
                  已收&nbsp;
                  <number-input
                    style="display: inline-block;"
                    :value="item.securityFund"
                    :disabled="!securityFund[index]"
                    :width="'150px'"
                    :placeholder="'限数字'"
                    :min="0"
                    :decimal="false"
                    :slotObj="{ show: true, name: '元'}"
                    @input="(num) => { item.securityFund = num }"
                  ></number-input>
                </el-radio>
                <el-radio :label="false">未收，后续再充值</el-radio>
              </el-radio-group>
            </el-form-item>

            <div style="width: 200px;"></div>

            <el-form-item
              label="其他设置: "
              label-width="120px"
              :rules="{ required: true }"
              class="else-set"
            >
              <el-radio-group v-model="item.securityFundCanReturn">
                <el-radio :label="true">保证金可退</el-radio>
                <el-radio :label="false">保证金不可退</el-radio>
              </el-radio-group>
              <el-radio-group v-model="item.securityFundCanUse">
                <el-radio :label="true">保证金可用于消费</el-radio>
                <el-radio :label="false">保证金不可用于消费</el-radio>
              </el-radio-group>
              <el-radio-group v-model="item.myConsumeCanBonus">
                <el-radio :label="true">本人消费可分红</el-radio>
                <el-radio :label="false">本人消费不可分红</el-radio>
              </el-radio-group>
            </el-form-item>

            <div style="width: 200px;"></div>

            <el-form-item label="启用: " label-width="120px" class="else-set">
              <el-radio-group v-model="item.status">
                <el-radio :label="'enabled'">立即启用</el-radio>
                <el-radio :label="'disabled'">暂停启用</el-radio>
              </el-radio-group>
            </el-form-item>

            <i
              class="icon iconfont icon-icon_operate_delete deleteIcon"
              v-if="isBrand && addShareholderStoreForm.length > 1"
              @click="deleteIcon(index)"
            ></i>
            <i
              class="icon iconfont icon-icon_open_on addIcon"
              @click="addIcon"
              v-if="index == addShareholderStoreForm.length - 1 && isBrand"
            >&nbsp;&nbsp;增加权益门店</i>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShareholderClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddShareholder" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增分红对话框 -->
    <el-dialog
      :title="participationTitle"
      :visible.sync="addParticipationVisible"
      @close="addParticipationClose"
      width="550px"
    >
      <el-form
        :model="addParticipationForm"
        :rules="addParticipationRules"
        ref="addParticipationRef"
        class="add_Participation_form"
        label-width="160px"
      >
        <el-form-item label="方案名称：" prop="name">
          <el-input v-model="addParticipationForm.name" placeholder="请输入分组名称" style="width: 270px;"></el-input>
        </el-form-item>
        <el-form-item label="毛利分红比例：" prop="grossProfitBonusRate">
          <el-input
            v-model.number="addParticipationForm.grossProfitBonusRate"
            style="width: 180px;"
            placeholder="限数字"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="保证金返还比例：" prop="securityFundReturnRate">
          <el-input
            v-model.number="addParticipationForm.securityFundReturnRate"
            style="width: 180px;"
            placeholder="限数字"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="介绍股东奖励比例：" prop="referralFeeRate">
          <el-input
            v-model.number="addParticipationForm.referralFeeRate"
            style="width: 180px;"
            placeholder="限数字"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParticipationVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddParticipation(addParticipationForm.id ? 'edit' : 'add')"
          :loading="btnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ShareholderList from "../shareholder_module/ShareholderList";
import ClientAffiliation from "../shareholder_module/ClientAffiliation";
import GrossProfitRate from "../shareholder_module/GrossProfitRate";
import ParticipationScheme from "../shareholder_module/ParticipationScheme";
import StatisticsStatement from "../shareholder_module/StatisticsStatement";
import TransactionRecord from "../shareholder_module/TransactionRecord";
import helpping from "../shareholder_module/helpping";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapActions, mapState } from "vuex";
import { truncate } from "fs";
export default {
  data() {
    // --------------------------- 校 验 -----------------------
    let mobileValid = (r, v, cb) => {
      if (this.isBrand) {
        console.log(1);
        if (!this.customerInfo.brandCustomerId) {
          return cb("请输入手机号选择入股客户");
        } else {
          cb();
        }
      } else {
        console.log(2);
        if (!this.customerInfo.id) {
          return cb("请输入手机号选择入股客户");
        } else {
          console.log(3);
          cb();
        }
      }
    };
    let shareholderRealNameValid = (r, v, cb) => {
      if (!v) {
        return cb("请输入股东姓名");
      } else {
        cb();
      }
    };
    let shareholderPlanIdValid = (r, v, cb, i) => {
      if (!this.addShareholderStoreForm[i].shareholderPlanId) {
        return cb("请选择门店的分红方案");
      } else {
        cb();
      }
    };
    let securityFundValid = (r, v, cb, i) => {
      if (this.securityFund[i]) {
        if (!this.addShareholderStoreForm[i].securityFund) {
          cb("请输入入股保证金，不得小于0");
        } else {
          cb();
        }
      } else {
        cb();
      }
    };
    let rightsStoreValid = (r, v, cb, i) => {
      if (!this.addShareholderStoreForm[i].storeId) {
        return cb("请选择股东的权益门店");
      } else {
        cb();
      }
    };
    // --------------------------- 校 验 -----------------------
    return {
      mobileValid,
      shareholderRealNameValid,
      shareholderPlanIdValid,
      securityFundValid,
      rightsStoreValid,
      // 动态表格组建选中
      componentId: "ShareholderList",
      // 门店分红方案
      storeBonusPlan: [],
      // 总部门店分红方案 、、各个门店不一致
      storeBonusPlanArr: [[]],
      addShareholderVisible: false,
      // 新增股东信息参数
      addShareholderForm: {
        shareholderRealName: ""
      },
      // 新增股东门店信息参数
      addShareholderStoreForm: [
        {
          shareholderPlanId: null,
          securityFund: null,
          securityFundCanReturn: true,
          securityFundCanUse: true,
          myConsumeCanBonus: true,
          status: "enabled"
        }
      ],
      // 入股保证金
      securityFund: [true],
      // 所有股东信息（介绍人）
      introducerShareholderList: [],
      // 权益门店列表（所有门店）
      storeList: [],
      // 选中的介绍人信息
      introducerShareholder: {},
      addShareholderRules: {},
      // 股东手机号
      shareholderMobile: "",
      // 根据客户手机号获取的客户信息
      customerInfo: {},
      // 分红方案名称
      participationName: null,
      addParticipationVisible: false,
      participationTitle: "新增分红方案",
      addParticipationForm: {
        name: null,
        grossProfitBonusRate: "",
        securityFundReturnRate: "",
        referralFeeRate: ""
      },
      addParticipationRules: {
        name: [
          { required: true, message: "请输入方案名称", trigger: "blur" },
          { required: true, message: "请输入方案名称", trigger: "change" }
        ],
        grossProfitBonusRate: [
          { required: true, message: "请输毛利分红比例", trigger: "blur" },
          { required: true, message: "请输毛利分红比例", trigger: "change" }
        ],
        securityFundReturnRate: [
          { required: true, message: "请输入保证金返还比例", trigger: "blur" },
          { required: true, message: "请输入保证金返还比例", trigger: "change" }
        ],
        referralFeeRate: [
          {
            required: true,
            message: "请输入介绍股东奖励比例",
            trigger: "blur"
          },
          {
            required: true,
            message: "请输入介绍股东奖励比例",
            trigger: "change"
          }
        ]
      },
      btnLoad: false,
      dialogLoad: false,
      inputLoad: false
    };
  },
  components: {
    ShareholderList,
    ClientAffiliation,
    GrossProfitRate,
    ParticipationScheme,
    StatisticsStatement,
    TransactionRecord,
    helpping,
    SelectCustomer
  },
  created() {
    // 实现页面刷新保留顶部导航信息
    this.componentId =
      this.$route.params.tab ||
      this.$store.state.shareholder.menuStatus ||
      "ShareholderList";
    this.init();
  },
  methods: {
    ...mapActions(["saveShareholderMenu"]),
    // 初始化 接口并发优化
    async init() {
      let res_1 = await this.getStoreList();
      this.storeList = res_1.storeBasicInfoList;
      if (!this.isBrand) {
        let res_2 = await this.getStoreBonusPlan();
        this.storeBonusPlan = res_2.planInfoForPagedLists;
      }
    },
    // 获取品牌下的门店列表
    async getStoreList() {
      const res = await axios.get(
        `/getStoreListByBrandId/${this.currentInfo.brandId}`
      );
      return res;
    },
    // 获取门店分红方案
    async getStoreBonusPlan(shopId) {
      const res = await axios.post("/getShareholderStoreBonusPlanPagedList", {
        brandId: this.currentInfo.brandId,
        currentPage: 0,
        name: null,
        pageSize: 9999,
        storeId: shopId || this.currentInfo.shopId,
        status: "enabled"
      });
      return res;
    },
    // 新增股东
    createShareholder() {
      this.addShareholderVisible = true;
      // 在此获取介绍人信息
      this.getIntroducerShareholderInfo();
      this.$nextTick(() => {
        this.$refs.addShareholderRef.clearValidate("securityFund");
      });
    },
    // 选择客户手机号
    selectShareholderMobile(data) {
      this.customerInfo = {};
      this.customerInfo = data;
      this.$refs.addShareholderRef.validateField("shareholderMobile");
    },
    // 选择权益门店 品牌端在此获取门店的分红方案
    async changeRightsStore(val, index) {
      // 先清空已经选择的分红方案
      this.addShareholderStoreForm[index].shareholderPlanId = null;
      this.inputLoad = true;
      try {
        const res = await this.getStoreBonusPlan(val);
        this.storeBonusPlanArr[index] = res.planInfoForPagedLists;
      } finally {
        this.inputLoad = false;
      }
    },
    // 增加、删除权益
    addIcon() {
      this.addShareholderStoreForm.push({
        shareholderPlanId: null,
        securityFund: null,
        securityFundCanReturn: true,
        securityFundCanUse: true,
        myConsumeCanBonus: true,
        status: "enabled"
      });
      this.securityFund.push(true);
      this.storeBonusPlanArr.push([]);
      this.$nextTick(() => {
        this.$refs.addShareholderRef.clearValidate("securityFund");
      });
    },
    deleteIcon(index) {
      this.addShareholderStoreForm.splice(index, 1);
      this.securityFund.splice(index, 1);
      this.storeBonusPlanArr.splice(index, 1);
    },
    // 新增股东确认
    confirmAddShareholder() {
      this.$refs.addShareholderRef.validate(async valid => {
        if (!valid) return;
        // 在品牌，同一个门店只能选择一次 ，如果从门店数组出发筛选， 则删除逻辑非常复杂
        if (this.isBrand) {
          console.log(this.addShareholderStoreForm);
          let flag = true;
          
          this.addShareholderStoreForm.map((i, index) => {
            // 遍历的每一次addShareholderStoreForm保持其完整性
            let addShareholderStoreForm = JSON.parse(
              JSON.stringify(this.addShareholderStoreForm)
            );
            // 从原数组中删除该索引的元素， 再拿其遍历
            let arr = addShareholderStoreForm.splice(index, 1);
            if (addShareholderStoreForm.some(item => item.shareholderPlanId == arr[0].shareholderPlanId)) {
              flag = false;
            }
          });
          if (!flag) return this.$message.error("所选门店重复！");
        }
        // return;
        // 参数补全
        let { id, shareholderRealName } = this.introducerShareholder;
        this.introducerShareholder;
        this.addShareholderStoreForm.map(i => {
          i.brandId = this.currentInfo.brandId;
          // 如果是品牌，选择门店的时候已经带入门店id
          i.storeId = this.isBrand ? i.storeId : this.currentInfo.shopId;
          // i.id = this.customerInfo.id;
          // 兼容接口，写死，反正后端处理
          i.joinTime = "2020-04-24 23:59:59";
        });
        this.btnLoad = true;
        try {
          const res = await axios.post("/addShareholderInfo", {
            shareholderInfo: {
              ...this.addShareholderForm,
              brandId: this.currentInfo.brandId,
              brandCustomerId: this.customerInfo.brandCustomerId,
              channel: "pc",
              introducerShareholderId: id,
              introducerShareholderRealName: shareholderRealName
            },
            shareholderStoreInfoList: this.addShareholderStoreForm
          });
          if (!res.success)
            return this.$message.error("新增股东失败:" + res.message);
          this.$message.success("新增股东成功");
          // 子组件刷新页面
          this.$refs.componentRef.handlePageChanged(1);
          this.addShareholderVisible = false;
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 获取介绍人信息
    async getIntroducerShareholderInfo() {
      this.dialogLoad = true;
      try {
        const res = await axios.get(
          `/getShareholderInfoList/${this.currentInfo.brandId}`
        );
        this.introducerShareholderList = res.shareholderInfoList || [];
      } finally {
        this.dialogLoad = false;
      }
    },
    // 新增股东对话框关闭
    addShareholderClose() {
      // 数据还原
      this.addShareholderStoreForm = [
        {
          shareholderPlanId: null,
          securityFund: null,
          securityFundCanReturn: true,
          securityFundCanUse: true,
          myConsumeCanBonus: true,
          status: "enabled"
        }
      ];
      this.securityFund = [true];
      this.storeBonusPlanArr = [[]];
      this.introducerShareholder = null;
      this.customerInfo = {};
      this.$refs.selectCustomer.handleClose();
      this.$refs.addShareholderRef.resetFields();
      this.addShareholderVisible = false;
    },
    // 搜索分红方案名称
    handleSearchParticipationName(val) {
      // 子组件刷新页面
      this.participationName = val || null;
    },
    // 新增分红方案
    createParticipation() {
      this.participationTitle = "新增分红方案";
      this.addParticipationVisible = true;
    },
    // 确认新增分红
    confirmAddParticipation(type) {
      this.$refs.addParticipationRef.validate(async valid => {
        if (!valid) return;
        this.btnLoad = true;
        try {
          const res = await axios.post(
            "/addOrModifyShareholderStoreBonusPlan",
            {
              ...this.addParticipationForm,
              brandId: this.currentInfo.brandId,
              storeId: this.currentInfo.shopId
            }
          );
          if (!res.success)
            return this.$message.error(
              type == "edit" ? "修改分红方案失败" : "新增分红方案失败"
            );
          this.$message.success(
            type == "edit" ? "修改分红方案成功" : "新增分红方案成功"
          );
          this.addParticipationVisible = false;
          // 子组件刷新页面
          this.$refs.componentRef.handlePageChanged(1);
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 新增分红对话框关闭
    addParticipationClose() {
      this.addParticipationForm = {};
      this.$refs.addParticipationRef.resetFields();
    },
    // 编辑分红方案
    async editParticipation(data) {
      this.participationTitle = "编辑分红方案";
      this.addParticipationForm = {};
      this.addParticipationForm = JSON.parse(JSON.stringify(data));
      // this.confirmAddParticipation("edit");
      this.addParticipationVisible = true;
      this.$nextTick(() => {
        this.$refs.addParticipationRef.clearValidate();
      });
    }
  },
  watch: {
    componentId(val, o) {
      // 将导航信息存入vuex
      this.saveShareholderMenu(val);
      if (val == "ShareholderList" && !!o) {
        this.init();
      }
    },
    securityFund: {
      handler(v, o) {
        if (!v[0]) {
          this.addShareholderStoreForm[0].securityFund = 0;
        }
      },
      deep: true
    }
  },
  destroyed() {
    // 离开页面时，将数据重置
    this.saveShareholderMenu(null);
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 品牌标识
    isBrand() {
      return this.$route.path.indexOf("brand") != -1;
    }
  }
};
</script>
<style lang="scss" scoped>
.shareholder-main {
  width: calc(100vw - 221px);
  min-height: calc(100vh - 75px);
  display: flex;
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
  margin-bottom: 15px;
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
  .table-title {
    width: 100%;
    display: flex;
    align-items: center;
    white-space:nowrap;
    .normal_red_btn {
      padding: 9.5px 16px;
      margin-left: 20px;
    }
  }
}
.filters-line {
  // margin-top: 15px;
  height: 76px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .filters-search {
    .query-form {
      display: flex;
      align-items: center;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}

/deep/ .create-seller {
  .el-table__row td .el-form-item {
    margin-top: 22px;
    padding-bottom: 8px;
  }
}

.create-seller-pagination {
  margin-top: 20px;
}

/deep/.add-shareholder {
  .el-dialog {
    .el-dialog__body {
      padding: 20px 20px 35px !important;
    }
  }
}

.add_shareholder_form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 330px;
    margin-right: 40px;
  }
}

.securityFund {
  display: flex;
  align-items: center;
}

.else-set {
  /deep/ .el-radio-group {
    width: 600px;
    .el-radio {
      display: inline-block;
      width: 214px;
    }
  }
}

/deep/ .rights-set {
  & + .rights-set {
    margin-top: 20px;
  }
  width: 560px !important;
  border: 2px solid #f0f0f0;
  border-radius: 5px;
  padding-top: 22px;
  position: relative;
  .el-form-item {
    margin-bottom: 22px;
  }
  .addIcon {
    position: absolute;
    left: 0;
    bottom: -25px;
    font-size: 14px;
    cursor: pointer;
    line-height: 14px;
    vertical-align: -24%;
    color: #59c9f3;
    &:hover {
      color: #409eff !important;
    }
  }
  /deep/ .deleteIcon {
    position: absolute;
    right: -40px;
    bottom: 10px;
    display: inline;
    font-size: 20px;
    cursor: pointer;
    line-height: 20px;
    vertical-align: -24%;
    margin-left: 50px;
    &:hover {
      color: red !important;
    }
  }
}
</style>
