<template>
  <div class="main-con">
    <div class="should-pay">
      <div class="arrow"></div>
      <h3>
        <span>￥</span>
        {{detail.finalPrice}}
      </h3>
    </div>
    <div class="right-center">
      <el-form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
        <el-form-item prop="code">
          <el-input
            ref="input"
            :autofocus="true"
            maxlength="18"
            id="codeInput"
            placeholder="扫码或输入付款码"
            :disabled="!currentPayType.openAccount"
            @input="watchinput"
            v-model="form.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <loading-with-text v-if="loading"></loading-with-text>
    </div>
    <pay-error-reason @anewPay="anewPay" v-if="showPayError" :errorInfo="errorInfo"></pay-error-reason>
    <div class="no-pay-account" v-if="!currentPayType.openAccount">
      <i class="icon iconfont icon-icon_popup_plaint"></i>
      <p class="no-account">暂无收款账号{{errorInfo.message}}</p>
      <p class="no-account-set">请前往“总部管理台-设置中心-交易设置-收款账号”进行设置。</p>
    </div>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import PayErrorReason from "@/components/createOrder/settleAccounts/PayErrorReason";

  export default {
    components: {
      "pay-error-reason": PayErrorReason
    },
    props: {
      detail: Object,
      canWindUpAnAccount: Boolean, //弹窗的打开状态（未打开肯定不可以结算）
      currentPayType: Object
    },
    data() {
      let codeValidator = (rule, value, callback) => {
        if (/[\d]{18}/.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的收款码"));
        }
      };
      return {
        loading: false,
        showPayError: false,
        errorInfo: {},
        form: {
          code: null
        },
        formRules: {
          code: {required: true, validator: codeValidator}
        }
      };
    },
    computed: {
      billInfo() {
        return this.$store.state.bill;
      },
      canUse() {
        return this.canWindUpAnAccount && this.payTypeNumber < 2;
      },
      payTypeNumber() {
        return this.$store.state.bill.settleAccountsInfo.payTypeNumber;
      },
    },
    mounted() {
      this.initInput();
    },
    methods: {
      watchinput() {
        if (this.form.code.length === 18 && this.canUse) {
          this.handleCode(this.form.code);
        }
      },
      handleCode(code) {
        this.$refs.form.validate(valid => {
          if (!valid) {
            console.warn("ERROR SUBMIT");
          } else {
            /* 不可以结账，且本次结账请求尚未返回的时候：不发请求 */
            if (!this.canWindUpAnAccount || this.loading) {
              return;
            }
            this.loading = true;
            //  /billingByAliPaymentCode - 支付宝扫码
            //  /billingByPaymentCode    - 微信扫码
            let url = this.currentPayType.billType ? 'billingByAliPaymentCode' : 'billingByPaymentCode'
            axios
              .post(url, {
                authCode: code,
                billId: this.billInfo.billId
              })
              .then(res => {
                this.loading = false;
                this.form.code = null;
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "支付成功"
                  });
                  if (this.$route.path === '/shop-inner/cashier-dask/cashier-list') {
                    this.$root.$emit('initCashierListPage')
                  } else {
                    this.$router.push("/shop-inner/cashier-dask/cashier-list");
                  }
                } else {
                  this.showPayError = true;
                  this.errorInfo = res;
                }
              });
          }
        });
      },
      initInput() {
        let _this = this;
        let code = "";
        let lastTime, nextTime;
        let lastCode, nextCode;
        document.onkeypress = function (e) {
          nextCode = e.which;
          nextTime = new Date().getTime();

          if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
            code += String.fromCharCode(lastCode);
            if(_this.canUse){
              _this.form.code = code;
            }

          } else if (
            lastCode != null &&
            lastTime != null &&
            nextTime - lastTime > 100
          ) {
            code = "";
          }
          lastCode = nextCode;
          lastTime = nextTime;
        };
        window.onkeypress = function (e) {
          if (e.which == 13 && _this.canUse) {
            _this.handleCode(code + "");
            code = "";
          }
        };
      },
      renewGetFocus() {
        this.$refs.input.focus();
      },
      anewPay() {
        this.showPayError = false;
        this.renewGetFocus();
      }
    },
    beforeDestroy() {
      // document.onkeypress = function() {};
      // window.onkeypress = function() {};
      this.form.code = null;
    }
  };
</script>
<style lang="scss" scoped>
  .main-con {
    .should-pay {
      display: flex;
      align-items: center;
      line-height: 36px;
      font-size: 20px;
      color: #f52d56;
      margin: 80px 0 50px;

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

    .right-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 0 30px;

      .el-form {
        width: 100%;
      }

      .code {
        width: 209px;
        height: 209px;
        background: red;
        margin: 30px 0 0 0;
      }
    }

    .no-pay-account{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 65px;
      .iconfont {
        font-size: 50px;
        color: #f52d56;
      }
      .no-account{
        line-height: 25px;
        font-size: 18px;
        color: #333333;
        margin: 20px 0 10px;
      }
      .no-account-set{
        line-height: 17px;
        font-size: 12px;
        color: #666666;
        width: 182px;
      }
    }
  }
</style>
