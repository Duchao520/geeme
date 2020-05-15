<template>
  <div class="main-con" v-loading="loading">
    <div class="should-pay incash">
      <div class="arrow"></div>
      <h3>
        <span>￥</span>
        {{detail.finalPrice}}
      </h3>
    </div>
    <div class="right-center-cash">
      <div class="receive-in-real">
        <span>实收</span>
        <span style="color:#58C9F3">不找零</span>
      </div>
      <div class="input-box">
        <el-form ref="form" :model="numberOfPendingPaymentsForm" label-width="0" :rules="formRules"
                 @submit.native.prevent>
          <el-form-item prop="numberOfPendingPayments">
            <el-input
              ref="payInCash"
              :autofocus="true"
              maxlength="8"
              placeholder="输入金额"
              @keyup.enter.native="billInCash"
              v-model.trim="numberOfPendingPayments"
            >
              <span slot="prefix">￥</span>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <pay-error-reason @anewPay="anewPay" v-if="showPayError" :errorInfo="errorInfo"></pay-error-reason>
    <div class="button" v-if="!showPayError" @click="billInCash">确认结算</div>
  </div>
</template>
<script>
  import PayErrorReason from "@/components/createOrder/settleAccounts/PayErrorReason";
  import * as axios from "@/util/axios";
  import {mapActions, mapState} from "vuex";

  export default {
    components: {
      "pay-error-reason": PayErrorReason
    },
    props: {
      detail: Object,
      payTypeNumber: Number,
      currentPayType: Object
    },
    data() {
      let moneyNumValidator = (rule, value, callback) => {
        if (/^\d+(\.\d+)?$/.test(this.numberOfPendingPayments)) {
          callback();
        } else {
          callback(new Error("请输入正确的数字"));
        }
      };
      return {
        loading: false, // 提交支付的加载
        showPayError: false,
        errorInfo: {},
        formRules: {
          numberOfPendingPayments: {validator: moneyNumValidator, required: true}
        }
      };
    },
    activated(){
      this.$refs.payInCash.focus()
    },
    computed: {
      ...mapState({
        billInfo: state => state.bill,
        numberOfPendingPaymentsForm: state => state.bill.numberOfPendingPaymentsForm,
      }),
      numberOfPendingPayments: {
        set(val) {
          this.setTheTotalBill(val);
        },
        get() {
          return Number(this.billInfo.numberOfPendingPaymentsForm.numberOfPendingPayments) || Number(this.detail.finalPrice)
        }
      }
    },
    methods: {
      ...mapActions(["setPaymentModeId", "setTheTotalBill"]),
      billInCash() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            console.warn("ERROR SUBMIT");
          } else {
            // 现金支付 钱包余额支付 自定义支付方式
            let url = this.payTypeNumber === 2 ? "/billingByCash" : this.payTypeNumber === 8 ? '/billingByWalletMoney' : "/billingByBrandSelfdefWay";
            let params
            // 钱包余额支付 8 
            if (this.payTypeNumber === 8) {
              params = {
                billId: this.billInfo.billId,
                storeCustomerId: this.detail.customerId
              }
            } else {
              params = {
                billId: this.billInfo.billId,
                received: Number(this.numberOfPendingPayments),
                billTypeId: this.currentPayType ? this.currentPayType.id : null
              };
            }
            this.loading = true 
            axios.post(url, params).then(res => {
              if (res.success) {
                this.$message({type: "success", message: "支付成功"});
                if (this.$route.path === '/shop-inner/cashier-dask/cashier-list') {
                  this.$root.$emit('initCashierListPage')
                } else {
                  this.$router.push("/shop-inner/cashier-dask/cashier-list");
                }
                this.setPaymentModeId(null)
              } else {
                this.showPayError = true;
                this.errorInfo = res;
              }
              this.loading = false
            });
          }
        });
      },
      anewPay() {
        this.showPayError = false;
        this.$refs.payInCash.focus();
      }
    },
    beforeDestroy() {
      this.numberOfPendingPayments = null;
    }
  };
</script>
<style lang="scss" scoped>
  .main-con {
    .should-pay {
      display: flex;
      align-items: center;
      line-height: 136px;
      font-size: 20px;
      color: #f52d56;
      margin-top: 30px;

      h3 {
        span {
          font-size: 14px;
          margin-right: -6px;
        }
      }

      .arrow {
        width: 11px;
        height: 11px;
        background: #f1f2f7;
        transform: rotateZ(45deg);
        margin-left: -5px;
        margin-right: 27px;
      }
    }

    .right-center-cash {
      box-sizing: border-box;
      padding: 0 44px 0 34px;

      .receive-in-real {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        padding: 0 2px;
      }

      .input-box {
        width: 100%;

        /deep/ .el-form-item__content {
          /deep/ .el-input__inner {
            width: 265px;
          }

          /deep/ .el-input__prefix {
            color: #333333;
          }
        }
      }
    }

    .incash {
      margin-bottom: -30px;
    }

    .button {
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

      &:hover {
        opacity: 0.9;
      }
    }
  }
</style>
