<template>
  <div class="settle-accounts">
    <!-- :modal-append-to-body="false" -->
    <el-dialog
      width="1000px"
      :visible="visible"
      append-to-body
      :before-close="handleClose"
      @close="$emit('closeAdvances')"
      @open="handleOpen"
      top="5vh"
      :close-on-click-modal="false"
      @opened="offMoveClose"
    >
      <el-form
        class="advances-received"
        ref="receiptFormRef"
        :model="receiptForm"
        :rules="receiptFormRules"
        label-width="80px"
        label-position="top"
      >
        <div class="content-area" v-loading="payWayLoading">
          <div class="left">
            <div class="smallBox"></div>
            <div class="left-area">
              <img src="@/assets/img/bg_order_top_long.png" class="bgimg" />
              <div class="title">
                <h4 style="font-size:18px;margin-right:6px;color:#333333">预收款充值</h4>
              </div>
              <div class="detail-line">
                <div class="circle cl"></div>
                <div class="circle cr"></div>
                <div class="inline"></div>
                <p>充值信息</p>
                <div class="inline"></div>
              </div>

              <div class="customer-content">
                <el-form-item :label="!showUserBox ? '选择客户：' : '已选客户：'" prop="customer">
                  <div class="box-item">
                    <select-customer ref="selectCustomer" :size="'small'"></select-customer>
                  </div>
                  <div class="box-item">
                    <g-clickbtn
                      style="margin-left: 5px;"
                      title="新增"
                      icon="icon_ope_append"
                      @click="dialog = 'addCustomer'"
                    ></g-clickbtn>
                  </div>
                  <div class="box-item-userbox" v-if="showUserBox">
                    <user-box :list="customerInfo"></user-box>
                    <i class="icon iconfont icon-icon_operate_delete" @click="clearCustomerInfo"></i>
                  </div>
                </el-form-item>
                <div class="receiptMoney">
                  <el-form-item label="收款金额：" prop="amount">
                    <!-- <el-input
                    v-model="receiptForm.amount"
                    placeholder="请输入收款金额"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                    step="1"
                    maxlength="10"
                  >
                    <template slot="append">
                      <p>元</p>
                    </template>
                    </el-input>-->
                    <NumberInput
                      v-model="receiptForm.amount"
                      :max="1000000"
                      width="200px"
                      placeholder="请输入收款金额"
                      :slotObj="{
                        show: true,
                        name: '元'
                      }"
                    />
                  </el-form-item>
                </div>
                <div class="remark">
                  <el-form-item label="备注说明：" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="receiptForm.remark"
                      placeholder="最多100字"
                      maxlength="100"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <pay-types :from="'advance'" :paymentModes="paymentModes" v-model="payTypeNumber"></pay-types>
          </div>
          <div class="right">
            <div class="payment" v-loading="loading">
              <div class="money" style="height: 30px;">
                <span class="money-flag" v-if="receiptForm.amount">￥</span>
                <span class="money-num">
                  {{
                  receiptForm.amount
                  ? `${setToPriceNumber(receiptForm.amount)}`
                  : `--`
                  }}
                </span>
              </div>
              <el-form-item label="应支付：" v-if="payTypeNumber === 2 || payTypeNumber === 4">
                <el-input v-model.number="receiptForm.amount" disabled>
                  <template slot="prepend">
                    <p>￥</p>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" v-else style="margin-top: 31.38px;">
                <!-- <el-input
                ref="input"
                :autofocus="true"
                maxlength="18"
                id="codeInput"
                placeholder="请输入付款码"
                @input="watchinput"
                v-model="receiptForm.authCode"
                ></el-input>-->
                <scanInput
                  :isAdvances="true"
                  ref="scanBox"
                  @getCode="
                    code => {
                      receiptForm.authCode = code;
                      affirmPay(code);
                    }
                  "
                />
              </el-form-item>
              <!-- <div class="button" @click="affirmPay">确认结算</div> -->
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 新增客户 -->
    <choose-add-customer
      v-if="dialog === 'addCustomer'"
      :visible="dialog === 'addCustomer'"
      @close="dialog = null"
    ></choose-add-customer>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { reg } from "@/assets/js/RegExp";
import SelectCustomer from "@/components/appoModule/selectCustomer";
import UserBox from "@/components/appoModule/userBox";
import ChooseAddCustomer from "./chooseAddCustomer_order";
import PayTypes from "@/components/createOrder/settleAccounts/PayTypes";
import scanInput from "./scanInput";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  props: {
    visible: Boolean
  },
  components: {
    SelectCustomer,
    UserBox,
    ChooseAddCustomer,
    "pay-types": PayTypes,
    scanInput
  },
  data() {
    return {
      downFlag: false,
      loading: false,
      payWayLoading: false,
      // 传入组件g-clickbtn的标识
      cssChange: true,
      dialog: null,
      receiptForm: {
        brandId: null,
        storeId: null,
        amount: null,
        remark: "",
        authCode: "",
        customerId: ""
      },
      receiptFormRules: {
        amount: { required: true, message: "请输入收款金额", trigger: "blur" },
        code: [
          {
            required: true,
            validator: this.codeValidator,
            trigger: "change"
          },
          {
            required: true,
            validator: this.codeValidator,
            trigger: "blur"
          }
        ],
        customer: [
          {
            required: true,
            validator: this.customerValidator,
            trigger: "blur"
          },
          {
            required: true,
            validator: this.customerValidator,
            trigger: "change"
          }
        ]
      },
      paymentModes: null,
      payTextFlag: false
    };
  },
  mounted() {
    this.getEnabledBrandBillTypeInfos();
    this.receiptForm.brandId = this.currentInfo.brandId;
    this.receiptForm.storeId = this.currentInfo.shopId;
  },
  methods: {
    // 选择客户校验
    customerValidator(rule, value, callback) {
      if (this.customerInfo.length > 0) {
        callback();
      } else {
        callback(new Error("请选择客户"));
      }
    },
    // 收款码校验
    codeValidator(rule, value, callback) {
      if (/[\d]{18}/.test(this.receiptForm.authCode)) {
        callback();
      } else {
        callback(new Error("请输入正确的付款码"));
      }
    },
    ...mapActions([
      "saveCustomerInfo",
      "setAdvancesPayType",
      "setPaymentModeId"
    ]),
    // 清空客户
    clearCustomerInfo() {
      this.saveCustomerInfo({});
    },
    tab(index) {
      this.num = index;
    },
    getEnabledBrandBillTypeInfos() {
      this.payWayLoading = true;
      axios
        .post("/getEnabledBrandBillTypeInfos", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          // this.paymentModes = res.listBillTypeInfos
          //   .filter(item => item.openAccount)
          //   .concat(res.listBillTypeInfos.filter(item => !item.openAccount));
          //   console.log(this.paymentModes)
          // 进行预收款充值的支付方式过滤 暂时只显示微信和支付宝
          this.paymentModes = res.listBillTypeInfos.filter(
            i =>
              (i.billType === 0 && i.openAccount) ||
              (i.billType === 1 && i.openAccount)
          );
          // 当么有支付渠道时，给与提示
          this.payTextFlag = !this.paymentModes.length;
          // this.paymentModes[3].billTypeName = "自定义";
          this.payTypeNumber = 0;
          // this.setPaymentModeId(null);
          this.payWayLoading = false;
        });
    },
    // 付款码输入事件
    watchinput() {},
    // 确认结算
    affirmPay(code) {
      // 预校验
      this.$refs.receiptFormRef.validate(async valid => {
        if (!valid) return;
        this.receiptForm.customerId = this.customerInfo[0].id;
        if (this.payTypeNumber != 0 && this.payTypeNumber != 1) {
          return this.$message.error("暂时只支持微信和支付宝付款");
        }
        if (
          !reg.price.test(this.receiptForm.amount) ||
          this.receiptForm.amount == 0
        )
          return this.$message.error("充值金额请输入大于0的数字");
        if (!/[\d]{18}/.test(this.receiptForm.authCode))
          return this.$message.error("请输入正确的付款码"); // 如果是现金等支付方式 不要校验这里
        try {
          if (this.payTypeNumber == 0) {
            this.loading = true;
            const res = await axios.post(
              "/cashInByWechatInPc",
              this.receiptForm
            );
            this.loading = false;
            if (!res.success) return this.$message.error("充值失败");
            this.$message.success("充值成功");
            // 清空付款码信息
            this.$refs.scanBox.focusInput();
          } else {
            this.loading = true;
            const res = await axios.post(
              "/cashInByAliPayInPc",
              this.receiptForm
            );
            this.loading = false;
            if (!res.success) return this.$message.error(res.message);
            this.$message.success("充值成功");
            // 清空付款码信息
            this.$refs.scanBox.focusInput();
          }
        } catch (e) {
          this.loading = false;
          this.$message.error('充值失败，请查看付款码是否正确')
        }
      });
    },
    // 表单的信息和校验重置
    handleClose() {
      // 无法有效移除监听的事件？
      window.removeEventListener("mousedown", this.downHanle);
      this.$emit("closeAdvances");
      // 重置表单各信息
      this.$refs.selectCustomer.handleClose();
      this.$refs.receiptFormRef.resetFields();
      this.$refs.scanBox.focusInput();
      this.clearCustomerInfo();
    },
    // 禁止拖动关闭窗口 配合组件自身属性
    offMoveClose() {
      window.addEventListener("mousedown", this.downHanle);
    },
    downHanle(e) {
      if (
        e.srcElement.className &&
        e.srcElement.className ==
          document.querySelector(".el-dialog__wrapper").className
      ) {
        this.$emit("closeAdvances");
      }
    },
    handleOpen() {
      this.$nextTick(() => {
        this.$refs.receiptFormRef.resetFields();
        this.$refs.scanBox.focusInput();
      });
    },
    setToPriceNumber(num = 0) {
      return Number(num).toFixed(2);
    }
  },
  beforeDestroy() {
    window.removeEventListener("mousedown", this.downHanle);
  },
  computed: {
    showUserBox() {
      return this.customerInfo.length > 0;
    },
    // 选择的客户信息
    customerInfo() {
      let customer = this.$store.state.bill.customerInfo;
      return customer.id ? [this.$store.state.bill.customerInfo] : [];
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    payTypeNumber: {
      get() {
        return this.$store.state.bill.settleAccountsInfo.advancesPayType;
      },
      set(num) {
        this.setAdvancesPayType(num);
      }
    }
  },
  watch: {
    payTypeNumber(val) {
      // 扫码框获取焦点
      this.$nextTick(() => {
        // 切换支付方式时， 清空校验信息
        this.receiptForm.authCode = "";
        // this.$refs.scanBox.focusInput();
      });
    },
    downFlag(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";

.left-area {
  width: 343px;
  height: 100%;
  background: white;
  position: relative;

  .bgimg {
    position: absolute;
    width: 102%;
    left: -1%;
  }

  .title {
    box-sizing: border-box;
    padding-left: 16px;
    display: flex;
    line-height: 56px;
    h4 {
      margin-left: 107px;
    }
  }

  .detail-line {
    position: relative;
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;
    align-items: center;

    .circle {
      position: absolute;
      top: -2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f1f2f7;
    }

    .cl {
      left: -10px;
    }

    .cr {
      right: -10px;
    }

    p {
      margin: 0 5px;
      white-space: nowrap;
      color: #999999;
    }

    .inline {
      flex: auto;
      border-top: 1px dashed #efeff4;
    }
  }
}

.line {
  border-top: 1px dashed #efeff4;
  width: 100%;
  margin-top: 5px;
}

.datail-container-list {
  box-sizing: border-box;
  padding: 0 16px;

  .payment {
    flex: auto;
    display: flex;
    justify-content: flex-end;
    color: #333333;
    line-height: 25px;
  }

  .sale-discount {
    display: flex;
    justify-content: space-between;
    color: #333333;
    line-height: 25px;
  }

  .pay-type {
    display: flex;
    justify-content: flex-end;

    span {
      margin: 0 4px;
      color: #333333;
    }

    span:nth-last-child(1) {
      margin-right: 0;
    }
  }
}

.customer-content {
  margin: 35px 0 0 35px;
  width: 280px;
  background-color: #fff;
  border-radius: 0 5px 5px 0;
  box-shadow: 2px 2px 1px #fff;
  .box-item {
    display: inline-block;
  }
  /deep/ .el-form-item__label {
    font-size: 14px;
    font-weight: 700;
    color: #000;
  }
  .box-item-userbox {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    position: relative;
    .icon-icon_operate_delete {
      margin-left: 12px;
      cursor: pointer;
    }
  }
  .receiptMoney {
    margin-top: 20px;
  }
}

.payment {
  margin-top: 50px;
  position: relative;
  padding: 10px 30px;
  .money {
    margin-left: 20px;
    margin-top: 10px;
    font-weight: 700;
    color: red;
    .money-flag {
      font-size: 12px;
    }
    .money-num {
      font-size: 22px;
    }
  }
  /deep/ .el-form-item__error {
    position: absolute;
    top: 130px;
    left: 24px;
  }
  /deep/ h3 {
    margin-left: 20px;
  }
  /deep/ .info {
    font-size: 13px;
    line-height: 25px;
  }
}
// .settle-accounts{
/deep/ .el-dialog {
  border-radius: 5px;
  overflow: hidden;
  .el-dialog__body {
    padding: 0;
    max-width: 1000px;
  }
}
// }
.content-area {
  height: 730px;
  display: flex;
  margin-top: -30px;
  box-sizing: border-box;
  border-radius: 5px;
  color: #999999;
  font-size: 12px;
  .left {
    position: relative;
    width: 657px;
    box-sizing: border-box;
    padding: 20px;
    background: #f1f2f7;
    display: flex;
    .smallBox {
      position: absolute;
      top: 80px;
      right: -10px;
      transform: rotateZ(45deg);
      width: 20px;
      height: 20px;
      background-color: #f1f2f7;
    }
  }
  .right {
    width: 343px;
  }
}
/* .button {
  width: 200px;
  height: 40px;
  font-size: 18px;
  line-height: 40px;
  color: white;
  text-align: center;
  border-radius: 5px;
  transition: all 0.6s;
  cursor: pointer;
  background: #f52d56;
  display: inline-block;
  margin-top: 300px;
  margin-left: 40px;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
} */
</style>
