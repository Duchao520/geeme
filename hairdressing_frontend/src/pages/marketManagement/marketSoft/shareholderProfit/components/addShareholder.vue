<template>
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
        <select-customer ref="selectCustomer" :isBrand="isBrand" @choose="selectShareholderMobile"></select-customer>
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
            v-if="isBrand"
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
</template>

<script>
export default {
  props: {
    dialogLoad: Boolean,
    addShareholderVisible: {
      type: Boolean,
      default: false
    },
    btnLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
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

    return {
      mobileValid,
      shareholderRealNameValid,
      // 新增股东信息参数
      addShareholderForm: {
        shareholderRealName: ""
      },
      addShareholderRules: {},
      // 选中的介绍人信息
      introducerShareholder: {},
      // 所有股东信息（介绍人）
      introducerShareholderList: [],
    };
  },
  methods: {
    addShareholderClose() {
      this.$emit("addShareholderClose");
    },
    confirmAddShareholder() {
      this.$emit("confirmAddShareholder");
    },
    // 选择客户手机号
    selectShareholderMobile(data) {
      this.$emit("selectShareholderMobile", data);
      // this.customerInfo = {};
      // this.customerInfo = data;
      this.$refs.addShareholderRef.validateField("shareholderMobile");
    },
    handleClose() {
      this.$refs.selectCustomer.handleClose();
    },
    resetFields() {
      this.$refs.addShareholderRef.resetFields();
    },
    clearValidate(rule) {
      this.$refs.addShareholderRef.clearValidate(rule);
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
  }
};
</script>

<style>
</style>