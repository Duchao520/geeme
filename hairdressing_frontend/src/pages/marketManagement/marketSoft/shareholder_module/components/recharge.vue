<template>
  <el-dialog
    title="保证金充值"
    :visible.sync="rechargeDialogVisible"
    width="600px"
    :before-close="rechargeHandleClose"
    class="equity-dialog"
  >
    <div class="equity-container" v-loading="rechargeLoad">
      <div class="customer-info">
        <div class="customer-head">
          <div class="client_area">
            <!-- <el-checkbox :label="scope.row.id" class="check_single"></el-checkbox> -->
            <div class="client_msg">
              <div class="client_img">
                <!-- <img v-if="scope.row.shareholderHeadPortrait" :src="scope.row.shareholderHeadPortrait" /> -->
                <img
                  v-if="pitchRow.shareholderHeadPortrait"
                  :src="utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )"
                />
                <img
                  v-else
                  :src="
                        utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )
                      "
                />
                <img
                  class="sex_icon"
                  v-if="pitchRow.shareholderSex == '女'"
                  src="@/assets/img/female_tip.png"
                />
                <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
              </div>
              <div class="client_info">
                <p>{{ pitchRow.shareholderRealName }}</p>
                <p>{{ pitchRow.shareholderMobile }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="customer-name">
          <p>股东昵称：{{pitchRow.weName || '-'}}</p>
        </div>
      </div>

      <el-form
        :model="rechargeForm"
        :rules="rechargeRules"
        ref="rechargeForm"
        label-width="120px"
        class="recharge-query-form"
        style="margin-top: 20px;"
      >
        <el-form-item label="权益门店：" v-if="isBrand && rechargeList.length" prop="storeId">
          <el-select
            v-model="rechargeForm.storeId"
            placeholder="请选择权益门店"
            clearable
            style="width: 200px;"
            @change="rechargeEquityChange"
          >
            <el-option
              v-for="item in rechargeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="现有保证金：">
          <p>{{ surplusSecurityFund || 0 }}元</p>
        </el-form-item>

        <el-form-item label="保证金充值：" prop="securityFund">
          <el-input
            v-model.number="rechargeForm.securityFund"
            placeholder="限数字"
            style="width: 200px;"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input
            v-model="rechargeForm.remark"
            placeholder="请输入备注内容"
            style="width: 300px;"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="rechargeHandleClose">取 消</el-button>
      <el-button type="primary" @click="rechargeConfirm" :loading="btnLoad">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    rechargeDialogVisible: Boolean,
    pitchRow: Object
  },
  data() {
    return {
      utils,
      btnLoad: false,
      rechargeLoad: false,
      rechargeList: [],
      rechargeForm: {
        storeId: null,
        securityFund: "",
        remark: ""
      },
      rechargeRules: {
        storeId: [
          { required: true, message: "请选择权益门店", trigger: "change" }
        ],
        securityFund: [
          { required: true, message: "请选择权益门店", trigger: "change" }
        ]
      },
      pitchrechargeList: [],
      surplusSecurityFund: 0 // 现有保证金
    };
  },
  mounted() {},
  methods: {
    // 表头样式设置
    headerStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F4F5F7;";
      }
    },
    rechargeHandleClose() {
      this.surplusSecurityFund = 0;
      this.$refs.rechargeForm.resetFields();
      this.$emit("close");
    },
    rechargeConfirm() {
      this.$refs.rechargeForm.validate(async valid => {
        if (!valid) return;
        try {
          this.btnLoad = true;
          const res = await axios.post("/shareholderSecurityFund", {
            ...this.rechargeForm,
            shareholderId: this.pitchRow.id,
            brandId: this.currentInfo.brandId
          });
          if (!res.success) this.$message.error("充值失败");
          this.$message.success("充值成功");
          this.rechargeHandleClose();
          this.$emit("success");
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 退股权益门店选择
    async rechargeEquityChange(id) {
      if (id) {
        this.pitchRow.equityStoreInfoList.map(i => {
          if (i.storeId == id) {
            this.surplusSecurityFund = i.surplusSecurityFund;
          }
        });
      } else {
        this.surplusSecurityFund = 0;
      }
    }
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
  },
  watch: {
    pitchRow: {
      handler(val) {
        console.log(1)
        if (val.equityStoreInfoList && val.equityStoreInfoList.length) {
          this.rechargeList = JSON.parse(JSON.stringify(val.equityStoreInfoList));
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.equity-dialog {
  /deep/ .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #f4f5f7;
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
    .equity-container {
      .customer-info {
        height: 62px;
        background-color: #f4f5f7;
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
      .equity-table {
        margin-top: 10px;
      }
    }
  }
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
</style>